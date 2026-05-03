/**
 * v11.27: EMERGENCY NAVIGATION OVERHAUL
 * This file is forced to recompile with new logic to bypass stale build caches.
 */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { updateProjectAction } from "@/app/actions";
import { supabase } from "@/lib/supabase/client";

// Modular Components
import { EpisodeSlider } from "./navigator/episode-slider";
import { SceneMatrix } from "./navigator/scene-matrix";
import { parseScreenplay } from "@/lib/utils/script-parser";
import { BeatScriptEditor } from "./navigator/beat-script-editor";

function parseSynopsis(syn: any) {
  if (!syn) return null;
  if (typeof syn === "object") return syn;
  try {
    return JSON.parse(syn);
  } catch (e) {
    return null;
  }
}

export function NavigatorTab(props: {
  project: any;
  beats: any[];
  selectedEpisode: any;
  setSelectedEpisode: (ep: any) => void;
  handleGenerateEpisodeScript?: (ep: any) => void;
  generatingEpisodeId: string | null;
  pendingDraft?: any;
  isGenerating?: boolean;
  onSteer?: (instruction: string) => void;
  onAcceptDraft?: () => void;
  onDiscardDraft?: () => void;
}) {
  const [selectedBeat, setSelectedBeat] = useState<any>(null);
  const [steeringBlock, setSteeringBlock] = useState<any>(null);
  const [instruction, setInstruction] = useState("");
  const [directEps, setDirectEps] = useState<any[]>([]);
  const [liveBeats, setLiveBeats] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // v11.30: 동일 에피소드 재클릭 시 selectedBeat 초기화 방지
  const handleEpisodeClick = (ep: any) => {
    const isSameEpisode = ep.id === props.selectedEpisode?.id || 
                          ep.episode_number === props.selectedEpisode?.episode_number;
    props.setSelectedEpisode(ep);
    // 다른 에피소드로 이동할 때만 씬 선택 초기화
    if (!isSameEpisode) {
      setSelectedBeat(null);
    }
  };

  const handleBeatClick = (beat: any) => {
    setSelectedBeat(beat);
  };

  const handleSteerBlock = (block: any) => {
    setSteeringBlock(block);
    setInstruction("");
  };

  const submitSteer = () => {
    if (!instruction.trim()) return;
    props.onSteer?.(`[Block Context: ${steeringBlock.content}] ${instruction}`);
    setSteeringBlock(null);
  };

  // ============================================================
  // Data Logic (Memos)
  // ============================================================
  const epCountFromSyn = useMemo(() => {
    const rawSyn = props.project?.synopsis || "";
    const syn = parseSynopsis(rawSyn);
    let count = Number(syn?.formData?.episodes || syn?.episodes?.length || 0);
    if (count <= 1 && typeof rawSyn === 'string') {
      const match = rawSyn.match(/"episodes"\s*:\s*(\d+)/) || rawSyn.match(/"episode_count"\s*:\s*(\d+)/);
      if (match) count = Number(match[1]);
    }
    return count;
  }, [props.project?.synopsis]);

  const episodeList = useMemo(() => {
    // v11.32: directEps 우선, 없으면 props.project.episodes
    const dbEps = directEps.length > 0 ? directEps : (props.project?.episodes || []);
    
    // episode_count: DB 값 → synopsis 파싱 → DB 실제 개수 → 기본값 8
    const rawCount = Number(props.project?.episode_count || epCountFromSyn || dbEps.length || 8);
    const epCount = rawCount > 0 ? rawCount : 8;

    console.log("[Navigator] v11.32 Episode Sync:", { dbCount: dbEps.length, targetCount: epCount, episode_count: props.project?.episode_count });

    // ✅ 항상 epCount 개의 슬롯 생성 (DB 에피소드 + 플레이스홀더 혼합)
    return Array.from({ length: epCount }, (_, idx) => {
      const epNum = idx + 1;
      const existing = dbEps.find((e: any) => Number(e.episode_number) === epNum);
      if (existing) {
        return { ...existing, story_beats_v2: existing.story_beats_v2 || [] };
      }
      // 플레이스홀더 생성
      const syn = parseSynopsis(props.project?.synopsis);
      const synEp = syn?.episodes?.find((e: any) => Number(e.episodeNumber || e.episode_number) === epNum);
      return {
        id: synEp?.id || `placeholder-${epNum}`,
        episode_number: epNum,
        title: synEp?.title || `Episode ${epNum}`,
        summary: synEp?.summary || synEp?.logline || "",
        script_content: null,
        story_beats_v2: []
      };
    });
  }, [props.project?.id, props.project?.episodes, props.project?.synopsis, props.project?.episode_count, epCountFromSyn, directEps]);

  // ✅ v11.7 OMA Sync: Force push initial state to parent if empty
  useEffect(() => {
    if (episodeList.length > 0 && !props.selectedEpisode) {
      console.log("[Navigator] OMA Audit: Pushing initial EP 1 to parent");
      props.setSelectedEpisode(episodeList[0]);
    }
  }, [episodeList, props.selectedEpisode]);

  useEffect(() => {
    const dbCount = Number(props.project?.episode_count || 0);
    if (dbCount <= 1 && epCountFromSyn > 1 && props.project?.id) {
      updateProjectAction(props.project.id, { episode_count: epCountFromSyn });
    }
  }, [props.project?.id, props.project?.episode_count, epCountFromSyn]);

  // v11.23: Emergency Direct Fetch with Error Reporting
  useEffect(() => {
    if (!props.project?.id) return;
    async function loadDirectly() {
      setFetchError(null);
      console.log("[Navigator] v11.27 Emergency Fetch Start (NO JOIN):", props.project.id);
      
      const { data, error } = await supabase
        .from('episodes_v2')
        .select('*') // CRITICAL: NO JOIN TO PREVENT 400 ERROR
        .eq('project_id', props.project.id)
        .order('episode_number', { ascending: true });
      
      if (error) {
        setFetchError(`FETCH_ERROR: ${error.message}`);
        console.error("[Navigator] v11.27 Error:", error);
      } else if (data && data.length > 0) {
        console.log("[Navigator] v11.27 Success:", data.length);
        setDirectEps(data);
        if (!props.selectedEpisode) props.setSelectedEpisode(data[0]);
      } else {
        setFetchError("NO_DATA_FOUND_FOR_PROJECT");
        console.warn("[Navigator] v11.27 Empty Data");
      }
    }
    loadDirectly();
  }, [props.project?.id]);

  useEffect(() => {
    const epId = props.selectedEpisode?.id;
    const projectId = props.project?.id;
    if (!epId || !projectId || epId.startsWith('placeholder')) return;

    async function syncBeats() {
      setIsSyncing(true);
      console.log("[Navigator] v11.32 Syncing Beats for project:", projectId);
      // ✅ episode_id 컬럼이 없으므로 project_id로 조회 (order_index 정렬)
      const { data, error } = await supabase
        .from('story_beats_v2')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });
      
      if (!error && data && data.length > 0) {
        console.log("[Navigator] v11.32 Live Beats loaded:", data.length);
        setLiveBeats(data);
      } else {
        if (error) console.warn("[Navigator] syncBeats error:", error.message);
        setLiveBeats([]);
      }
      setIsSyncing(false);
    }
    syncBeats();
  }, [props.selectedEpisode?.id, props.project?.id]);

  const sceneList = useMemo(() => {
    if (!props.selectedEpisode) return [];
    
    // 1. Priority: Live Beats from DB
    if (liveBeats && liveBeats.length > 0) {
      console.log("[Navigator] v11.29 Using Live Beats:", liveBeats.length);
      return liveBeats.map((b: any) => ({
        id: b.id,
        title: b.title || `Scene ${b.scene_number}`,
        description: b.description || "",
        timestamp_label: b.timestamp_label || "00:00:00",
        act_number: b.act_number || 1,
        beat_type: b.beat_type || "Scene",
        script_content: b.script_content
      }));
    }

    // 2. Emergency Fallback: Parse from raw script_content
    const script = props.selectedEpisode?.script_content || "";
    if (script && script.length > 10) {
      console.log("[Navigator] v11.29 Emergency Parsing Script (Len):", script.length);
      const sceneRegex = /(?=SCENE\s+\d+|\[SCENE\s+\d+\]|INT\.|EXT\.|S#\d+)/gi;
      const parts = script.split(sceneRegex).filter(p => p.trim().length > 10);

      if (parts.length > 0) {
        return parts.map((content, idx) => {
          const lines = content.trim().split('\n');
          const title = lines[0].replace(/[*#]/g, '').trim().substring(0, 50);
          return {
            id: `parsed-scene-${idx}`,
            title: title || `SCENE ${idx + 1}`,
            description: lines.slice(1, 3).join(' ').trim().substring(0, 100),
            timestamp_label: `00:${(idx + 1).toString().padStart(2, '0')}:00`,
            act_number: Math.ceil((idx + 1) / 3),
            beat_type: "Scene",
            script_content: content.trim()
          };
        });
      }

      // If split failed but script exists, return 1 big scene
      return [{
        id: "fallback-scene-1",
        title: "EPISODE 1: FULL SCRIPT",
        description: "Click to read the entire script content.",
        timestamp_label: "00:01:00",
        act_number: 1,
        beat_type: "Scene",
        script_content: script
      }];
    }

    // 3. Default Empty State
    return [{ 
      id: `ep-default-scene`, 
      title: `Scene 1: 오프닝`, 
      description: `우측 상단의 [GENERATE SCENES] 버튼이나 하단의 [GENERATE SCRIPT] 버튼을 눌러 씬 구성과 대본 집필을 시작하세요.`, 
      timestamp_label: `00:05:00`, 
      act_number: 1, 
      beat_type: "Scene",
      script_content: ""
    }];
  }, [props.selectedEpisode?.id, props.selectedEpisode?.script_content, liveBeats]);

  // ============================================================
  // v11.3: Scene Selection Logic
  // ============================================================
  
  // 1. 초기 렌더링 시 sceneList의 첫 번째를 바로 잡기 위해 useState 대신 useMemo와 결합된 초기화 고려
  // 하지만 props 기반이므로 useEffect가 가장 안정적. 더 강력하게 수정.
  // v11.30: selectedBeat가 null이 될 때도 반응하도록 의존성 배열에 추가
  useEffect(() => {
    if (sceneList.length > 0) {
      const firstScene = sceneList[0];
      if (!selectedBeat || !sceneList.some(s => s.id === selectedBeat.id)) {
        console.log("[Navigator] v11.30 Force Auto-select:", firstScene.title);
        setSelectedBeat(firstScene);
      }
    }
  }, [sceneList, props.selectedEpisode?.id, selectedBeat]);

  const scriptElements = useMemo(() => {
    if (!selectedBeat) return [];
    const content = props.pendingDraft || selectedBeat.script_content || "";
    return parseScreenplay(content);
  }, [selectedBeat?.id, selectedBeat?.script_content, props.pendingDraft]);

  return (
    <div id="navigator-workspace-root" className="bg-[#050505] pb-40 min-h-screen relative">
      {/* v11.26 Emergency Data Shield */}
      {props.selectedEpisode?.script_content && sceneList.length <= 1 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-gold/20 border border-brand-gold/40 p-4 rounded-xl backdrop-blur-md max-w-2xl text-center animate-bounce">
          <p className="text-brand-gold text-sm font-bold mb-2">🚨 대본 데이터 감지됨 (길이: {props.selectedEpisode.script_content.length})</p>
          <p className="text-white/60 text-[10px]">DB에는 대본이 있으나 씬 분할이 안 된 상태입니다. 실시간 파서가 작동 중입니다.</p>
        </div>
      )}

      {episodeList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 opacity-50">
          <Zap size={32} className="text-brand-gold mb-4 animate-pulse" />
          <p className="text-xs uppercase tracking-widest font-bold text-center">Generate a story first.</p>
        </div>
      )}

      <EpisodeSlider 
        episodes={episodeList}
        selectedEpisodeId={props.selectedEpisode?.id || props.selectedEpisode?.episode_number}
        generatingEpisodeId={props.generatingEpisodeId}
        onSelectEpisode={handleEpisodeClick}
        onGenerateScript={(ep) => props.handleGenerateEpisodeScript?.(ep)}
        projectId={props.project?.id}
      />

      <AnimatePresence mode="wait">
        {(props.selectedEpisode || props.project?.episode_count > 0) && (
          <SceneMatrix 
            key={props.selectedEpisode?.id || props.selectedEpisode?.episode_number || "initial"}
            selectedEpisode={props.selectedEpisode}
            sceneList={sceneList}
            selectedBeatId={selectedBeat?.id || selectedBeat?.title}
            onSelectBeat={handleBeatClick}
            onRegenerateScene={(e, beat) => {
              e.stopPropagation();
              setSteeringBlock({ type: "scene_heading", id: beat.id || `scene-${beat.title}`, content: beat.description || beat.title });
              setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
            }}
            onGenerateScenes={(ep) => props.handleGenerateEpisodeScript?.(ep)}
            isGenerating={!!props.isGenerating}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBeat && (
          <BeatScriptEditor 
            selectedBeat={selectedBeat}
            scriptElements={scriptElements}
            isGenerating={!!props.isGenerating}
            onGenerateScript={() => props.handleGenerateEpisodeScript?.(props.selectedEpisode)}
            steeringBlock={steeringBlock}
            setSteeringBlock={setSteeringBlock}
            instruction={instruction}
            setInstruction={setInstruction}
            onSubmitSteer={submitSteer}
            handleSteerBlock={handleSteerBlock}
            bottomRef={bottomRef}
            sceneList={sceneList}
            onNavigateScene={(beat) => setSelectedBeat(beat)}
          />
        )}
      </AnimatePresence>

      {/* v11.23 Debug Overlay */}
      {fetchError && (
        <div className="fixed bottom-4 right-4 bg-red-900/80 text-white p-3 rounded-lg border border-red-500 text-[10px] z-50 animate-bounce">
          ⚠️ {fetchError} | PID: {props.project?.id?.slice(0,8)}
        </div>
      )}
    </div>
  );
}
