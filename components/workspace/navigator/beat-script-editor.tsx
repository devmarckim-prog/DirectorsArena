"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScriptEditor } from "../script-editor";

interface BeatScriptEditorProps {
  selectedBeat: any;
  scriptElements: any[];
  isGenerating: boolean;
  onGenerateScript: () => void;
  steeringBlock: any;
  setSteeringBlock: (block: any) => void;
  instruction: string;
  setInstruction: (val: string) => void;
  onSubmitSteer: () => void;
  handleSteerBlock: (block: any) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
  // v11.31: Scene Navigation
  sceneList?: any[];
  onNavigateScene?: (beat: any) => void;
}

export function BeatScriptEditor({
  selectedBeat,
  scriptElements,
  isGenerating,
  onGenerateScript,
  steeringBlock,
  setSteeringBlock,
  instruction,
  setInstruction,
  onSubmitSteer,
  handleSteerBlock,
  bottomRef,
  sceneList = [],
  onNavigateScene,
}: BeatScriptEditorProps) {
  if (!selectedBeat) return null;

  const currentIndex = sceneList.findIndex(
    (s) => s.id === selectedBeat.id || s.title === selectedBeat.title
  );
  const prevScene = currentIndex > 0 ? sceneList[currentIndex - 1] : null;
  const nextScene = currentIndex < sceneList.length - 1 ? sceneList[currentIndex + 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="pt-8 px-4 md:px-8 max-w-5xl mx-auto"
      ref={bottomRef}
    >
      <div className="relative min-h-[50vh] bg-black/10 border-white/5 rounded-3xl p-4 md:p-8">
        {scriptElements.length > 0 ? (
          <ScriptEditor
            elements={scriptElements}
            onSteerBlock={handleSteerBlock}
            isLoading={isGenerating}
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
                    onClick={(e) => { e.stopPropagation(); onSubmitSteer(); }}
                    disabled={!instruction.trim() || isGenerating}
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
              onClick={(e) => { e.stopPropagation(); onGenerateScript(); }}
              disabled={isGenerating}
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
                  onClick={onSubmitSteer}
                  disabled={!instruction.trim() || isGenerating}
                  className="w-14 h-14 shrink-0 rounded-2xl bg-brand-gold text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* v11.31: Scene Navigation Bar */}
      {sceneList.length > 1 && (
        <div className="flex items-center justify-between mt-8 mb-16 px-2">
          {/* 이전 씬 */}
          <button
            onClick={() => prevScene && onNavigateScene?.(prevScene)}
            disabled={!prevScene}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-brand-gold group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Previous</p>
              <p className="text-[11px] text-white/80 font-medium line-clamp-1 max-w-[180px]">
                {prevScene?.title || ""}
              </p>
            </div>
          </button>

          {/* 현재 씬 인디케이터 */}
          <div className="flex items-center gap-1.5">
            {sceneList.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "bg-brand-gold w-4"
                    : "bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>

          {/* 다음 씬 */}
          <button
            onClick={() => nextScene && onNavigateScene?.(nextScene)}
            disabled={!nextScene}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <div className="text-right">
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Next</p>
              <p className="text-[11px] text-white/80 font-medium line-clamp-1 max-w-[180px]">
                {nextScene?.title || ""}
              </p>
            </div>
            <ChevronRight size={16} className="text-brand-gold group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
