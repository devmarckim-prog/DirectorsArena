"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, RotateCcw, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SceneCoWriterProps {
  onSteer: (instruction: string) => void;
  isGenerating?: boolean;
  pendingDraft?: {
    draftTitle: string;
    sceneElements: any[];
  } | null;
  onAccept: () => void;
  onDiscard: () => void;
}

export function SceneCoWriter({
  onSteer,
  isGenerating,
  pendingDraft,
  onAccept,
  onDiscard,
}: SceneCoWriterProps) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isGenerating) return;
    onSteer(instruction);
    setInstruction("");
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/50 backdrop-blur-xl border-l border-white/5">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest">AI Co-Writer</h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">V4.2 Structured Steering</p>
          </div>
        </div>
      </div>

      {/* Draft Preview or Instructions */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar-slim">
        <AnimatePresence mode="wait">
          {pendingDraft ? (
            <motion.div
              key="draft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-4"
            >
              <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(197,160,89,0.05)]">
                <div className="flex justify-between items-start mb-6">
                   <span className="text-brand-gold font-black text-[10px] uppercase tracking-widest">Proposed Scene Draft</span>
                   <div className="flex gap-2">
                     <button onClick={onDiscard} className="p-2 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-lg transition-colors">
                       <Trash2 size={14} />
                     </button>
                   </div>
                </div>
                
                <h4 className="text-white font-bold text-lg mb-4 tracking-tighter uppercase italic">{pendingDraft.draftTitle}</h4>
                
                <div className="space-y-3">
                  {pendingDraft.sceneElements.map((el, idx) => (
                    <div key={idx} className={cn(
                      "text-[11px] leading-relaxed",
                      el.type === 'HEADING' ? "text-brand-gold font-black uppercase mt-4" :
                      el.type === 'CHARACTER' ? "text-white font-bold uppercase text-center mt-3" :
                      el.type === 'DIALOGUE' ? "text-neutral-300 text-center px-8" :
                      el.type === 'PARENTHETICAL' ? "text-neutral-500 italic text-center text-[10px]" :
                      "text-neutral-400"
                    )}>
                      {el.type === 'CHARACTER' ? el.characterName : ""}
                      {el.content}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={onAccept}
                    className="flex-1 bg-brand-gold text-black font-black text-[10px] py-3 rounded-full uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Check size={14} /> Accept Draft
                  </button>
                  <button 
                    onClick={onDiscard}
                    className="flex-1 bg-white/5 text-white font-black text-[10px] py-3 rounded-full border border-white/5 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw size={14} /> Retry
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full py-20 text-center"
            >
              <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4 opacity-20">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Ready to assist your script.</p>
              <p className="text-[9px] text-neutral-800 uppercase tracking-tighter mt-1">Describe the next scene to begin steering.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Field */}
      <div className="p-6 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="예: '주원이 라임에게 진실을 고백하는 씬을 긴장감 있게 써줘'..."
            className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 pr-12 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-brand-gold/30 transition-all resize-none min-h-[100px] custom-scrollbar-slim"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!instruction.trim() || isGenerating}
            className={cn(
              "absolute bottom-4 right-4 p-2 rounded-xl transition-all",
              instruction.trim() ? "bg-brand-gold text-black scale-100" : "bg-neutral-800 text-neutral-600 scale-90"
            )}
          >
            {isGenerating ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
