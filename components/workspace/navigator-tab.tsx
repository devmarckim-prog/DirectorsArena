"use client";

import {
  Zap,
  MapPin,
  Play,
  Flag,
  Target,
  Flame,
  Star,
  Check as CheckIcon,
  X,
  Sparkles,
  Send,
  RefreshCcw,
} from "lucide-react";
import { useState, useMemo, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScriptEditor } from "./script-editor";
import { parseScreenplay } from "@/lib/utils/script-parser";

interface StoryBeat {
  id?: string;
  title: string;
  description?: string;
  timestamp_label?: string;
  act_number: number;
  beat_type: string;
}

interface NavigatorTabProps {
  beats?: StoryBeat[];
  project?: any;
  selectedEpisode?: any;
  setSelectedEpisode?: (ep: any) => void;
  handleGenerateEpisodeScript?: (ep: any) => void;
  generatingEpisodeId?: string | null;
  pendingDraft?: any;
  isGenerating?: boolean;
  onSteer?: (instruction: string) => void;
  onAcceptDraft?: () => void;
  onDiscardDraft?: () => void;
  onBeatClick?: (beat: StoryBeat) => void;
}

function parseSynopsis(raw: any): any {
  if (!raw) return {};
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

export function NavigatorTab({ beats = [], ...props }: NavigatorTabProps) {
  const [selectedBeat, setSelectedBeat] = useState<any>(null);
  const [steeringBlock, setSteeringBlock] = useState<any>(null);
  const [instruction, setInstruction] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleEpisodeClick = (ep: any) => {
    props.setSelectedEpisode?.(ep);
    setSelectedBeat(null);
  };

  const handleBeatClick = (beat: any) => {
    setSelectedBeat(beat);
    props.onBeatClick?.(beat);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const scriptElements = useMemo(() => {
    if (!props.selectedEpisode?.script_content) return [];
    return parseScreenplay(props.selectedEpisode.script_content);
  }, [props.selectedEpisode?.script_content]);

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
  // 에피소드 목록: DB > AI synopsis.episodes > episode_count
  // ============================================================
  const episodeList = useMemo(() => {
    const dbEps = props.project?.episodes || [];
    if (dbEps.length > 0) return dbEps;

    const syn = parseSynopsis(props.project?.synopsis);

    if (Array.isArray(syn?.episodes) && syn.episodes.length > 0) {
      return syn.episodes.map((ep: any, idx: number) => ({
        id: ep?.id || `ep-${idx + 1}`,
        episode_number: ep?.episodeNumber || ep?.episode_number || idx + 1,
        title: ep?.title || `Episode ${idx + 1}`,
        summary: ep?.summary || ep?.logline || "",
        script_content: null,
      }));
    }

    const epCount = props.project?.episode_count || 0;
    if (epCount > 0) {
      return Array.from({ length: epCount }, (_, idx) => ({
        id: `ep-${idx + 1}`,
        episode_number: idx + 1,
        title: `Episode ${idx + 1}`,
        summary: "",
        script_content: null,
      }));
    }

    return [];
  }, [props.project?.episodes, props.project?.synopsis, props.project?.episode_count]);

  // ============================================================
  // 씬 목록: synopsis.structure > ep1 scenes > 빈 배열
  // ============================================================
  const sceneList = useMemo(() => {
    if (!props.selectedEpisode) return [];

    const epNum = props.selectedEpisode.episode_number;
    const syn = parseSynopsis(props.project?.synopsis);

    // 1순위: structure 배열
    if (Array.isArray(syn?.structure) && syn.structure.length > 0) {
      return syn.structure.map((sc: any, idx: number) => ({
        id: `struct-${idx}`,
        title: sc.title || `Scene ${idx + 1}`,
        description: sc.description || "",
        timestamp_label: sc.timestamp_label || `${String(Math.floor((idx * 7) / 60)).padStart(2, "0")}:${String((idx * 7) % 60).padStart(2, "0")}:00`,
        act_number: sc.act_number || 1,
        beat_type: sc.beat_type || "Scene",
      }));
    }

    // 2순위: ep1 scenes
    if (epNum === 1) {
      const ep1 = syn?.episodes?.[0];
      if (Array.isArray(ep1?.scenes) && ep1.scenes.length > 0) {
        return ep1.scenes.map((sc: any, idx: number) => ({
          id: `ep1-scene-${idx}`,
          title: sc.title || `Scene ${idx + 1}`,
          description: sc.description || sc.summary || "",
          timestamp_label: sc.timestamp_label || `00:${String((idx + 1) * 7).padStart(2, "0")}:00`,
          act_number: 1,
          beat_type: "Scene",
        }));
      }
      
      // 3순위: Default EP1 Scene 1 (If no scenes exist for EP1)
      return [{
        id: `ep1-scene-default`,
        title: `Scene 1: 오프닝`,
        description: `우측 상단의 [GENERATE SCENES] 버튼이나 하단의 [GENERATE SCRIPT] 버튼을 눌러 씬 구성과 대본 집필을 시작하세요.`,
        timestamp_label: `00:05:00`,
        act_number: 1,
        beat_type: "Scene",
      }];
    }

    return [];
  }, [props.selectedEpisode, props.project?.synopsis]);

  const handleRegenerateScene = (e: React.MouseEvent, beat: any) => {
    e.stopPropagation();
    setSteeringBlock({
      type: "scene_heading",
      id: beat.id || `scene-${beat.title}`,
      content: beat.description || beat.title,
    });
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  return (
    <div className="bg-neutral-950 pb-32">

      {/* 에피소드 없음 안내 */}
      {episodeList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 opacity-50">
          <Zap size={32} className="text-brand-gold mb-4 animate-pulse" />
          <p className="text-xs uppercase tracking-widest font-bold text-center">
            Generate a story first to see the Beat Sheet.
          </p>
        </div>
      )}

      {/* 1. EPISODE CARDS ROW */}
      {episodeList.length > 0 && (
        <div className="w-full flex gap-4 overflow-x-auto px-4 md:px-8 py-8 custom-scrollbar-gold scroll-smooth">
          {episodeList.map((ep: any, idx: number) => {
            const isSelected =
              props.selectedEpisode?.id === ep.id ||
              props.selectedEpisode?.episode_number === ep.episode_number;
            const isGenerating = props.generatingEpisodeId === ep.id;
            const hasScript = !!ep.script_content;

            return (
              <div
                key={ep.id || idx}
                onClick={() => handleEpisodeClick(ep)}
                className={cn(
                  "shrink-0 w-72 md:w-80 group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
                  isSelected
                    ? "bg-brand-gold/10 border-brand-gold/40 shadow-[0_0_30px_rgba(197,160,89,0.15)] ring-1 ring-brand-gold/20"
                    : "bg-white/[0.02] border-white/5 hover:border-brand-gold/20 hover:bg-brand-gold/[0.03]"
                )}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-brand-gold font-black text-xs tracking-widest uppercase">
                      EP {ep.episode_number}
                    </span>

                    {/* EP1: refresh icon / Others: generate button */}
                    {ep.episode_number === 1 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); props.handleGenerateEpisodeScript?.(ep); }}
                        className={cn(
                          "p-2 rounded-full transition-colors flex items-center justify-center",
                          isGenerating
                            ? "animate-spin text-brand-gold"
                            : "bg-white/5 text-neutral-500 hover:text-brand-gold hover:bg-brand-gold/10"
                        )}
                        title="Regenerate Script"
                      >
                        <RefreshCcw size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); props.handleGenerateEpisodeScript?.(ep); }}
                        disabled={isGenerating}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                          isGenerating
                            ? "bg-brand-gold/20 text-brand-gold animate-pulse cursor-wait"
                            : hasScript
                              ? "bg-white/5 text-neutral-400 hover:bg-brand-gold/10 hover:text-brand-gold"
                              : "bg-brand-gold text-black hover:opacity-90 hover:scale-105"
                        )}
                      >
                        {isGenerating ? (
                          <><Zap size={10} className="animate-pulse" />Generating...</>
                        ) : hasScript ? (
                          <><RefreshCcw size={10} />Regenerate</>
                        ) : (
                          <><Sparkles size={10} />Generate EP</>
                        )}
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-2 truncate group-hover:text-brand-gold transition-colors">
                    {ep.title || `Episode ${ep.episode_number}`}
                  </h3>

                  <p className="text-xs text-neutral-300 font-medium leading-[1.7] line-clamp-5 mb-4 flex-1">
                    {ep.summary || ep.synopsis || "No synopsis available."}
                  </p>

                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", hasScript ? "bg-brand-gold" : "bg-neutral-600")} />
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">
                      {hasScript
                        ? "Script Ready"
                        : ep.episode_number === 1
                          ? "Click to view scenes"
                          : "Awaiting Generation"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SCENE MATRIX ROW */}
      <AnimatePresence mode="wait">
        {props.selectedEpisode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-black/60 border-y border-white/5 py-8"
          >
            <div className="px-4 md:px-8 mb-4 flex items-center justify-between">
              <h4 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                <MapPin className="text-brand-gold w-4 h-4" />
                Scene Matrix — EP {props.selectedEpisode.episode_number}
              </h4>
              <div className="flex items-center gap-4">
                {sceneList.length > 0 && (
                  <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    {sceneList.length} SCENES
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); props.handleGenerateEpisodeScript?.(props.selectedEpisode); }}
                  disabled={props.isGenerating}
                  className="flex items-center gap-2 px-4 py-1.5 bg-brand-gold text-black rounded-full hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  <Sparkles size={10} /> Generate Scenes
                </button>
              </div>
            </div>

            {sceneList.length === 0 ? (
              <div className="px-8 py-10 flex flex-col items-center justify-center opacity-50">
                <Zap size={24} className="text-brand-gold mb-3 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-center">
                  {props.selectedEpisode.episode_number === 1
                    ? "Generate a story first to populate scenes."
                    : "Click 'Generate' above to create this episode's script."}
                </span>
              </div>
            ) : (
              <div className="w-full flex gap-3 overflow-x-auto px-4 md:px-8 pb-4 custom-scrollbar-gold">
                {sceneList.map((beat: any, idx: number) => {
                  const isSelected =
                    selectedBeat?.id === beat.id || selectedBeat?.title === beat.title;
                  return (
                    <div
                      key={beat.id || idx}
                      onClick={() => handleBeatClick(beat)}
                      className={cn(
                        "shrink-0 w-80 md:w-96 group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between",
                        isSelected
                          ? "bg-brand-gold/5 border-brand-gold/60 shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                          : "bg-[#09090B] border-white/10 hover:border-brand-gold/30"
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold rounded text-[8px] font-black uppercase tracking-widest">
                              SCENE {idx + 1}
                            </span>
                            {beat.timestamp_label && (
                              <span className="text-[8px] text-neutral-600 font-bold">
                                {beat.timestamp_label}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleRegenerateScene(e, beat)}
                            className="opacity-0 group-hover:opacity-100 shrink-0 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-black rounded-full p-2 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
                            title="Regenerate Scene"
                          >
                            <Sparkles size={14} className={isSelected ? "animate-pulse" : ""} />
                          </button>
                        </div>
                        <h4 className={cn("text-sm font-bold uppercase truncate mb-2", isSelected ? "text-brand-gold" : "text-white")}>
                          {beat.title}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-6 leading-relaxed mt-1">
                          {beat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SCRIPT EDITOR (unfolds on scene click) */}
      <AnimatePresence>
        {selectedBeat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pt-16 px-4 md:px-8 max-w-5xl mx-auto"
            ref={bottomRef}
          >
            <div className="flex items-center gap-4 mb-10 border-b border-brand-gold/20 pb-6">
              <div className="h-8 w-1 bg-brand-gold rounded-full" />
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{selectedBeat.title}</h2>
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">
                  {selectedBeat.timestamp_label || "Scene Sequence"}
                </span>
              </div>
            </div>

            <div className="font-serif italic text-zinc-500 text-lg leading-relaxed mb-16 border-l-2 border-brand-gold/20 pl-6 opacity-80">
              {selectedBeat.description}
            </div>

            <div className="relative min-h-[50vh] bg-black/40 border border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl">
              {scriptElements.length > 0 ? (
                <ScriptEditor
                  elements={scriptElements}
                  onSteerBlock={handleSteerBlock}
                  isLoading={props.isGenerating}
                  activeSteeringId={steeringBlock?.id}
                  steeringConsole={
                    <div className="bg-neutral-900/95 backdrop-blur-3xl border border-brand-gold/50 p-6 rounded-3xl shadow-2xl ring-1 ring-brand-gold/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-brand-gold w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Vision Co-Writer</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/30 to-transparent" />
                        <button onClick={(e) => { e.stopPropagation(); setSteeringBlock(null); }} className="text-white/40 hover:text-white p-1">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="mb-4 p-3 rounded-xl bg-black/50 border border-white/5 flex gap-3">
                        <div className="w-1 h-auto bg-brand-gold/30 rounded-full shrink-0" />
                        <p className="text-[11px] text-white/70 italic line-clamp-2">"{steeringBlock?.content}"</p>
                      </div>
                      <div className="relative flex items-end gap-2">
                        <textarea
                          value={instruction}
                          onChange={(e) => setInstruction(e.target.value)}
                          placeholder="AI에게 수정 지시를 내리세요..."
                          className="w-full bg-black/80 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold/40 resize-none min-h-[60px]"
                          autoFocus
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); submitSteer(); }}
                          disabled={!instruction.trim() || props.isGenerating}
                          className="w-10 h-10 shrink-0 rounded-xl bg-brand-gold text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  }
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-60">
                  <Sparkles className="text-brand-gold mb-4" size={40} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-6">Script content empty. Awaiting Generation.</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); props.handleGenerateEpisodeScript?.(props.selectedEpisode); }}
                    disabled={props.isGenerating}
                    className="px-8 py-3 bg-brand-gold text-black rounded-full font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                  >
                    <Sparkles size={12} /> Generate Script
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence>
              {steeringBlock && !scriptElements.some((el) => el.id === steeringBlock.id) && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="w-full mt-8 mb-16"
                >
                  <div className="bg-neutral-900/95 backdrop-blur-3xl border border-brand-gold/30 p-6 md:p-8 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="text-brand-gold w-4 h-4 animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Vision Co-Writer (LLM)</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/20 to-transparent" />
                      <button onClick={() => setSteeringBlock(null)} className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="mb-6 p-4 rounded-2xl bg-black border border-white/5 flex gap-4">
                      <div className="w-1 h-auto bg-brand-gold/50 rounded-full shrink-0" />
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase mb-1.5 font-bold tracking-widest">Context Block:</p>
                        <p className="text-xs text-white italic">"{steeringBlock.content}"</p>
                      </div>
                    </div>
                    <div className="relative flex items-end gap-3">
                      <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="이 씬의 전개를 수정하거나 내용을 추가해줘..."
                        className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-brand-gold/40 transition-all resize-none min-h-[100px]"
                        autoFocus
                      />
                      <button
                        onClick={submitSteer}
                        disabled={!instruction.trim() || props.isGenerating}
                        className="w-14 h-14 shrink-0 rounded-2xl bg-brand-gold text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
