"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { updateProjectAction } from "@/app/actions";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleEpisodeClick = (ep: any) => {
    props.setSelectedEpisode(ep);
    setSelectedBeat(null);
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
    const dbEps = props.project?.episodes || [];
    // v11.6: 0이거나 유효하지 않은 경우 무조건 최소 1개는 보장 (UI 증발 방지)
    const rawCount = Number(props.project?.episode_count || epCountFromSyn || 0);
    const epCount = rawCount > 0 ? rawCount : 6; // 아예 없으면 기본 6개로 렌더링 시도

    console.log("[Navigator] v11.6 Syncing List:", { dbCount: dbEps.length, targetCount: epCount });

    return Array.from({ length: epCount }, (_, idx) => {
      const epNum = idx + 1;
      const existing = dbEps.find((e: any) => Number(e.episode_number) === epNum);
      if (existing) return existing;
      const syn = parseSynopsis(props.project?.synopsis);
      const synEp = syn?.episodes?.find((e: any) => Number(e.episodeNumber || e.episode_number) === epNum);
      return {
        id: synEp?.id || `placeholder-${epNum}`,
        episode_number: epNum,
        title: synEp?.title || `Episode ${epNum}`,
        summary: synEp?.summary || synEp?.logline || "",
        script_content: null,
      };
    });
  }, [props.project?.id, props.project?.episodes, props.project?.synopsis, props.project?.episode_count, epCountFromSyn]);

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

  const sceneList = useMemo(() => {
    if (!props.selectedEpisode) return [];
    const epNum = Number(props.selectedEpisode.episode_number);
    const syn = parseSynopsis(props.project?.synopsis);
    if (Array.isArray(syn?.structure) && syn.structure.length > 0) {
      return syn.structure.map((sc: any, idx: number) => ({
        id: sc.id || `struct-${idx}`,
        title: sc.title || `Scene ${idx + 1}`,
        description: sc.description || "",
        timestamp_label: sc.timestamp_label || `${String(Math.floor((idx * 7) / 60)).padStart(2, "0")}:${String((idx * 7) % 60).padStart(2, "0")}:00`,
        act_number: sc.act_number || 1,
        beat_type: sc.beat_type || "Scene",
      }));
    }
    if (epNum === 1) {
      const ep1 = syn?.episodes?.[0];
      if (Array.isArray(ep1?.scenes) && ep1.scenes.length > 0) {
        return ep1.scenes.map((sc: any, idx: number) => ({
          id: sc.id || `ep1-scene-${idx}`,
          title: sc.title || `Scene ${idx + 1}`,
          description: sc.description || sc.summary || "",
          timestamp_label: sc.timestamp_label || `00:${String((idx + 1) * 7).padStart(2, "0")}:00`,
          act_number: 1,
          beat_type: "Scene",
        }));
      }
    }
    
    // v11.4: 최후의 보루 - 데이터가 정말 없으면 기본 씬 1개라도 반환
    return [{ 
      id: `ep-default-scene`, 
      title: `Scene 1: 오프닝`, 
      description: `우측 상단의 [GENERATE SCENES] 버튼이나 하단의 [GENERATE SCRIPT] 버튼을 눌러 씬 구성과 대본 집필을 시작하세요.`, 
      timestamp_label: `00:05:00`, 
      act_number: 1, 
      beat_type: "Scene" 
    }];
  }, [props.selectedEpisode?.id, props.project?.synopsis, props.project?.episode_count]);

  // ============================================================
  // v11.3: Scene Selection Logic
  // ============================================================
  
  // 1. 초기 렌더링 시 sceneList의 첫 번째를 바로 잡기 위해 useState 대신 useMemo와 결합된 초기화 고려
  // 하지만 props 기반이므로 useEffect가 가장 안정적. 더 강력하게 수정.
  useEffect(() => {
    if (sceneList.length > 0) {
      const firstScene = sceneList[0];
      // 현재 선택된게 없거나, 다른 에피소드로 넘어왔을 때 무조건 첫 번째 씬 강제 선택
      if (!selectedBeat || !sceneList.some(s => s.id === selectedBeat.id)) {
        console.log("[Navigator] v11.3 Force Auto-select:", firstScene.title);
        setSelectedBeat(firstScene);
      }
    }
  }, [sceneList, props.selectedEpisode?.id]); 

  const scriptElements = useMemo(() => {
    if (!selectedBeat) return [];
    const content = props.pendingDraft || selectedBeat.script_content || "";
    return parseScreenplay(content);
  }, [selectedBeat?.id, selectedBeat?.script_content, props.pendingDraft]);

  return (
    <div id="navigator-workspace-root" className="bg-[#050505] pb-40 min-h-screen">
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
