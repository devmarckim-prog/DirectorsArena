"use client";

import { use, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  fetchProjectDetailsAction, 
  persistGenerationAction,
  generateEpisodeScriptAction,
  generateEpisodeSceneDraftAction,
  updateEpisodeScriptContentAction,
  updateCharacterAction,
  triggerRegenerateAction,
  updateProjectAction
} from "@/app/actions";
import { supabase } from "@/lib/supabase/client";
import { EpisodeSceneDraft } from "@/lib/schemas/generation";
import type { Project, Episode, Character } from "@/components/workspace/types";
import type { ProjectGeneration } from "@/lib/schemas/generation";
import { 
  DEFAULT_SCRIPT_PROMPT, 
  DEFAULT_REWRITE_PROMPT, 
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { 
  Loader2, Sparkles, LayoutDashboard, 
  DollarSign, Clapperboard, Map, Play,
  Lock, MapPin, ChevronLeft
} from "lucide-react";
import { HeroHeader } from "@/components/workspace/hero-header";
import { SidebarRail } from "@/components/workspace/sidebar-rail";
import { StoryBibleTab } from "@/components/workspace/story-bible-tab";
import { NavigatorTab } from "@/components/workspace/navigator-tab";
import { CompsTab } from "@/components/workspace/comps-tab";
import { SceneCoWriter } from "@/components/workspace/scene-co-writer";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// Shell Components (Casting, Budget, etc.)
// ============================================

const CastingBoardShell = ({ projectId, isUnlocked, metadata }: { projectId: string; isUnlocked: boolean; metadata?: any }) => {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/production/casting', { method: 'POST', body: JSON.stringify({ projectId }), headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (json.success && json.data) setData(json.data);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };
  if (data || metadata?.castingRecommendations) {
    const list = data || metadata.castingRecommendations;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((c: any, idx: number) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center group hover:border-brand-gold/30 transition-all">
            <div className="w-24 h-24 rounded-full bg-neutral-900 border border-white/10 mb-8 flex items-center justify-center overflow-hidden">
               <span className="text-4xl font-black text-brand-gold/20">{c.recommended_actor?.[0] || 'A'}</span>
            </div>
            <h4 className="text-2xl font-black text-white italic tracking-tighter mb-2">{c.recommended_actor}</h4>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-6 block opacity-50">Match Strategy</span>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">"{c.reason}"</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
      <Sparkles size={48} className="text-neutral-700 mb-6" />
      <button onClick={handleGenerate} disabled={!isUnlocked || isLoading} className={cn("px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all", isUnlocked ? "bg-brand-gold text-black active:scale-95" : "opacity-30")}>Analyze Casting</button>
    </div>
  );
};

const BudgetEstimatorShell = ({ projectId, isUnlocked, metadata }: { projectId: string; isUnlocked: boolean; metadata?: any }) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/production/budget', { method: 'POST', body: JSON.stringify({ projectId }), headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (json.success && json.data) setData(json.data);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };
  if (data || metadata?.budgetEstimate) {
    const totalCost = data?.estimated_cost || 0;
    return <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center"><h3 className="text-xs font-black text-brand-gold uppercase mb-4 tracking-widest">Estimated Budget</h3><p className="text-5xl font-black text-white tracking-tighter">₩{totalCost.toLocaleString()}</p></div>;
  }
  return <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl"><DollarSign size={48} className="mx-auto text-neutral-700 mb-6"/><button onClick={handleGenerate} disabled={!isUnlocked || isLoading} className="px-8 py-4 bg-brand-gold text-black rounded-full font-black uppercase text-xs">Estimate Budget</button></div>;
};

const ScriptBreakdownShell = ({ episodeId, isScriptReady }: { episodeId: string | undefined; isScriptReady: boolean }) => (
  <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl"><Clapperboard size={48} className="mx-auto text-neutral-700 mb-6"/><button disabled={!isScriptReady} className="px-8 py-4 bg-white text-black rounded-full font-black uppercase text-xs disabled:opacity-50">Generate Breakdown</button></div>
);

const PPLLocationShell = ({ episodeId, isScriptReady }: { episodeId: string | undefined; isScriptReady: boolean }) => (
  <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl"><MapPin size={48} className="mx-auto text-neutral-700 mb-6"/><button disabled={!isScriptReady} className="px-8 py-4 bg-brand-gold text-black rounded-full font-black uppercase text-xs disabled:opacity-50">Scout PPL Locations</button></div>
);

// ============================================
// Main Detail Page
// ============================================

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const initializedRef = useRef(false);
  const [streamedData, setStreamedData] = useState<Partial<ProjectGeneration>>({});
  
  const [generatingEpisodeId, setGeneratingEpisodeId] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [pendingDraft, setPendingDraft] = useState<EpisodeSceneDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  const [masterMode, setMasterMode] = useState<'SCENARIO' | 'PRODUCTION'>('SCENARIO');
  const [scenarioTab, setScenarioTab] = useState<'BIBLE' | 'SIMILAR' | 'NAVIGATOR'>('BIBLE');
  const [productionTab, setProductionTab] = useState<'CASTING' | 'BUDGET' | 'BREAKDOWN' | 'PPL'>('CASTING');
  const [isCoWriterOpen, setIsCoWriterOpen] = useState(false);

  const metadata = useMemo(() => {
    // streamedData에 서사가 있으면 우선 사용 (generated_content 로드 or 스트리밍 후)
    const sd = (streamedData as any)?.synopsis;
    if (sd?.story?.epicNarrative) {
      // synopsis DB 데이터와 병합
      let base: any = {};
      try {
        if (typeof project?.synopsis === 'string' && project.synopsis.trim().startsWith('{')) {
          base = JSON.parse(project.synopsis);
        }
      } catch { /* ignore */ }
      return {
        ...base,
        ...sd,
        story: { ...base.story, ...sd.story }
      };
    }

    if (!project?.synopsis) return null;
    try {
      if (typeof project.synopsis === 'string' && project.synopsis.trim().startsWith('{')) {
        return JSON.parse(project.synopsis);
      }
      return { story: { logline: project.synopsis } };
    } catch { return null; }
  }, [project?.synopsis, streamedData]);


  // ============================================================
  // OMA v7.9: generated_content DB 읽기 (새로고침 후 복원)
  // ============================================================
  useEffect(() => {
    if (!id) return;
    // v8.2: Clear previous project data to prevent state leak
    setStreamedData({});
    setProject(null);

    async function loadFromDB() {
      const { data } = await supabase
        .from('projects_v2')
        .select('generated_content, status')
        .eq('id', id)
        .single();

      if (data?.status === 'READY' && data.generated_content?.epicNarrative) {
        setStreamedData({
          synopsis: {
            story: {
              epicNarrative: data.generated_content.epicNarrative
            }
          }
        } as any);
      }
    }
    loadFromDB();
  }, [id]);


  const triggerStreaming = useCallback(async (projectId: string) => {
    setIsStreaming(true);
    setMasterMode('SCENARIO');
    setScenarioTab('BIBLE');
    
    let buffer = "";
    
    try {
      const response = await fetch(`/api/ignite/${projectId}`, { method: 'POST' });

      if (!response.body) {
        throw new Error("No response body received from ignite engine.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let lastReportedProgress = 10;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // v7.3: buffer.length 기반 진행률 (클로저 스테일 버그 해결)
          const currentProgress = Math.min(95, 15 + Math.floor((buffer.length / 8000) * 80));
          if (currentProgress >= lastReportedProgress + 5) {
            lastReportedProgress = currentProgress;
            // fire-and-forget: 진행률 DB 업데이트
            supabase.from('projects_v2').update({ progress: currentProgress }).eq('id', projectId);
          }
          
          // 완성된 라인만 처리, 마지막 미완성 라인은 버퍼에 유지
          const lines = buffer.split('\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('0:')) continue;

            try {
              const rawValue = trimmed.substring(2).trim();
              if (!rawValue) continue;
              const parsed = JSON.parse(rawValue);

              // 객체 신호 처리 (Phase, KeepAlive)
              if (typeof parsed === 'object' && parsed !== null) {
                if (parsed.phase === 2) {
                  setProject((prev: any) => ({ ...prev, progress: 15 }));
                } else if (parsed.phase === 3 && parsed.status === 'COMPLETE') {
                  // 서버가 완료 신호를 보냄 → UI 즉시 반영
                  setProject((prev: any) => ({ ...prev, progress: 100, status: 'READY' }));
                }
                // KEEPALIVE 등 나머지 객체는 모두 무시
                continue;
              }

              // 문자열 조각은 화면에 실시간 누적하지 않음
              // (AI가 JSON으로 응답하므로 날것 JSON이 표시되는 문제 방지)
              // 완료 후 DB에서 파싱된 데이터를 가져와 렌더링함
              if (typeof parsed === 'string') {
                // 진행률만 업데이트 (텍스트 표시는 완료 후)
                // setStreamedData 제거 — no raw JSON display
              }
            } catch {
              // 파싱 실패 청크 무시 (SSE 메타 라인 등)
            }
          }
        }
      } finally {
        reader.cancel();
      }
      
      // 스트림 완료 후 DB에서 최신 파싱 데이터 fetch (약간 여유를 줌)
      await new Promise(r => setTimeout(r, 800));
      const refreshed = await fetchProjectDetailsAction(projectId);
      if (refreshed) {
        setProject(refreshed);
        if (refreshed.episodes?.length > 0) setSelectedEpisode(refreshed.episodes[0]);
      }
    } catch (e: any) { 
      console.error("[Stream] Critical failure:", e);
      await supabase
        .from('projects_v2')
        .update({ status: 'ERROR', error_message: e.message })
        .eq('id', projectId);
    } finally { 
      setIsStreaming(false); 
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      const data = await fetchProjectDetailsAction(id);
      if (data) {
        setProject(data);
        if (data.episodes?.length > 0) setSelectedEpisode(data.episodes[0]);
        
        if (data.status === 'BAKING' && !isStreaming && !initializedRef.current) {
          console.log("[Pipeline] Baking project detected. Auto-starting...");
          initializedRef.current = true;
          setTimeout(() => {
            triggerStreaming(id);
          }, 500);
        }
      }
    }
    loadData();
  }, [id, isStreaming, triggerStreaming]);

  const [steerPrompt, setSteerPrompt] = useState("");
  const handleRegenerate = (prompt?: string) => {
    setSteerPrompt(prompt || "");
    setIsRegenerateModalOpen(true);
  };

  const handleConfirmRegenerate = async () => {
    setIsStreaming(true);
    setIsRegenerateModalOpen(false);
    setStreamedData({});

    const result = await triggerRegenerateAction(id, steerPrompt);
    if (result.success) {
      await new Promise(r => setTimeout(r, 800));
      triggerStreaming(id);
      setSteerPrompt("");
    } else {
      setIsStreaming(false);
      alert("Failed to trigger regeneration: " + (result.error || "Unknown error"));
    }
  };

  const handleGenerateEpisodeScript = async (episode: Episode) => {
    if (!project) return;
    setGeneratingEpisodeId(episode.id);
    try {
      const result = await generateEpisodeScriptAction(project.id, episode.id, episode.episode_number);
      if (result.success) {
        const refreshed = await fetchProjectDetailsAction(project.id);
        if (refreshed) {
          setProject(refreshed);
          const updated = refreshed.episodes?.find((e: Episode) => e.id === episode.id);
          if (updated) setSelectedEpisode(updated);
        }
      }
    } catch (e) { } finally { setGeneratingEpisodeId(null); }
  };

  const handleSteerDraft = async (instruction: string) => {
    if (!project || !selectedEpisode) return;
    setIsGenerating(true);
    try {
      const result = await generateEpisodeSceneDraftAction(project.id, selectedEpisode.id, instruction, selectedEpisode.script_content || "");
      if (result.success && result.draft) {
        setPendingDraft(result.draft);
        setIsCoWriterOpen(true);
      }
    } catch (e) { } finally { setIsGenerating(false); }
  };

  const handleAcceptDraft = async () => {
    if (!project || !selectedEpisode || !pendingDraft) return;
    const draftText = pendingDraft.sceneElements.map(el => {
      switch(el.type) {
        case 'HEADING': return `\n\n${el.content.toUpperCase()}\n`;
        case 'ACTION': return `\n${el.content}\n`;
        case 'CHARACTER': return `\n\n          ${el.content.toUpperCase()}\n`;
        case 'PARENTHETICAL': return `\n        (${el.content})\n`;
        case 'DIALOGUE': return `          ${el.content}\n`;
        default: return el.content;
      }
    }).join("");
    const newFullContent = (selectedEpisode.script_content || "") + draftText;
    const result = await updateEpisodeScriptContentAction(selectedEpisode.id, project.id, newFullContent);
    if (result.success) {
      setSelectedEpisode(prev => prev ? { ...prev, script_content: newFullContent } : null);
      setProject((prev: any) => ({
        ...prev,
        episodes: prev.episodes.map((e: any) => e.id === selectedEpisode.id ? { ...e, script_content: newFullContent } : e)
      }));
      setPendingDraft(null);
    }
  };

  const handleDiscardDraft = () => setPendingDraft(null);

  const handleUpdateCharacter = async (charId: string, updates: any) => {
    setProject((prev: any) => {
      if (!prev) return prev;
      return { ...prev, characters: prev.characters?.map((c: any) => c.id === charId ? { ...c, ...updates } : c) };
    });
    const result = await updateCharacterAction(charId, updates);
    if (result.success) {
      fetchProjectDetailsAction(id).then(ref => { if(ref) setProject(ref); });
    }
    return result;
  };

  const handleUpdateProject = async (updates: any) => {
    setProject((prev: any) => prev ? { ...prev, ...updates } : prev);
    const result = await updateProjectAction(id, updates);
    if (!result.success) {
      // Rollback on failure
      const ref = await fetchProjectDetailsAction(id);
      if (ref) setProject(ref);
      alert("Failed to update project: " + result.error);
    }
    return result;
  };

  if (!project) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-brand-gold" /></div>;

  const isSynopsisReady = !!project.synopsis;
  const isScriptReadyCurrent = !!selectedEpisode?.script_content;
  const isCharactersReady = !!(project.characters?.length > 0);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-brand-gold/30">
      <SidebarRail masterMode={masterMode} setMasterMode={setMasterMode} onBackToSlate={() => router.push("/project-list")} />

      <main className={cn("flex-1 ml-20 min-h-screen relative bg-[#050505] transition-all duration-300", isCoWriterOpen ? "mr-96" : "mr-0")}>
        <div className="max-w-[1700px] mx-auto min-h-screen relative px-12 lg:px-24">
          <HeroHeader 
            project={project} 
            metadata={metadata} 
            masterMode={masterMode} 
            scenarioTab={scenarioTab} 
            setScenarioTab={setScenarioTab} 
            productionTab={productionTab} 
            setProductionTab={setProductionTab}
            onUpdateProject={handleUpdateProject}
          />

          <section className="mt-12 pb-60 z-10 relative">
            <AnimatePresence mode="wait">
              {masterMode === 'SCENARIO' && (
                <motion.div key="scenario" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {scenarioTab === 'BIBLE' && (
                    <StoryBibleTab 
                      project={project} 
                      metadata={metadata} 
                      isSynopsisReady={isSynopsisReady}
                      isCharactersReady={isCharactersReady}
                      onUpdateCharacter={handleUpdateCharacter}
                      onRegenerate={handleRegenerate}
                      isStreaming={isStreaming}
                    />
                  )}
                  {scenarioTab === 'SIMILAR' && <CompsTab projectId={project.id} hasSynopsis={isSynopsisReady} storedComps={project.similar_works} />}
                  {scenarioTab === 'NAVIGATOR' && (
                    <NavigatorTab 
                      project={project} beats={project.story_beats} selectedEpisode={selectedEpisode} setSelectedEpisode={setSelectedEpisode} 
                      handleGenerateEpisodeScript={handleGenerateEpisodeScript} generatingEpisodeId={generatingEpisodeId} 
                      pendingDraft={pendingDraft} isGenerating={isGenerating} onSteer={handleSteerDraft} onAcceptDraft={handleAcceptDraft} onDiscardDraft={handleDiscardDraft} 
                    />
                  )}
                </motion.div>
              )}
              {masterMode === 'PRODUCTION' && (
                <motion.div key="production" className="pt-10">
                  {productionTab === 'CASTING' && <CastingBoardShell projectId={project.id} isUnlocked={isSynopsisReady} metadata={metadata} />}
                  {productionTab === 'BUDGET' && <BudgetEstimatorShell projectId={project.id} isUnlocked={isSynopsisReady} metadata={metadata} />}
                  {productionTab === 'BREAKDOWN' && <ScriptBreakdownShell episodeId={selectedEpisode?.id} isScriptReady={isScriptReadyCurrent} />}
                  {productionTab === 'PPL' && <PPLLocationShell episodeId={selectedEpisode?.id} isScriptReady={isScriptReadyCurrent} />}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <footer className="fixed bottom-0 left-20 right-0 h-16 bg-black/95 backdrop-blur-3xl border-t border-white/5 z-[100] flex items-center justify-between px-12 lg:px-24">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-green-500 animate-pulse" : masterMode === 'SCENARIO' ? "bg-brand-gold animate-pulse" : "bg-blue-500")} />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {isStreaming ? "GENERATING..." : `${masterMode} Terminal`}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest italic">Arena Protocol v7.8</span>
            </div>
            <div className="flex items-center space-x-4 opacity-50 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
              <span className="text-[9px] font-black text-brand-gold tracking-widest">
                {isStreaming ? `${project?.progress || 0}%` : 'STABLE'}
              </span>
            </div>
          </footer>

          <AnimatePresence>
            {isCoWriterOpen && (
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 w-96 h-full z-[150] shadow-2xl">
                <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-2 bg-neutral-900 border border-white/10 rounded-l-xl cursor-pointer" onClick={() => setIsCoWriterOpen(false)}>
                  <ChevronLeft className="text-neutral-500 hover:text-white" />
                </div>
                <SceneCoWriter onSteer={handleSteerDraft} isGenerating={isGenerating} pendingDraft={pendingDraft} onAccept={handleAcceptDraft} onDiscard={handleDiscardDraft} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isCoWriterOpen && masterMode === 'SCENARIO' && (
            <button onClick={() => setIsCoWriterOpen(true)} className="fixed bottom-24 right-8 w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center text-black shadow-2xl z-50 hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </button>
          )}

          <ConfirmModal
            isOpen={isRegenerateModalOpen} onClose={() => setIsRegenerateModalOpen(false)} onConfirm={handleConfirmRegenerate}
            title="스토리 바이블 재생성" message="정말로 프로젝트를 재생성하시겠습니까? 현재의 시나리오와 에피소드가 모두 지워지고 새로운 서사가 집필됩니다."
            confirmText="집필 시작" variant="danger"
          />

          <div className="fixed top-0 left-20 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-brand-gold/[0.04] blur-[250px] rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
