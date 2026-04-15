"use client";

import { FileText, Loader2, Lock, Send, Sparkles, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveScriptViewer } from "@/components/project-contents/interactive-script-viewer";
import type { Project, Episode } from "./types";
import { useState, useEffect } from "react";
import type { EpisodeSceneDraft } from "@/lib/schemas/generation";
import { motion, AnimatePresence } from "framer-motion";

interface NavigatorTabProps {
  project: Project;
  selectedEpisode: Episode | null;
  setSelectedEpisode: (episode: Episode) => void;
  handleGenerateEpisodeScript: (episode: Episode) => void;
  generatingEpisodeId: string | null;
  pendingDraft: EpisodeSceneDraft | null;
  isGenerating: boolean;
  onSteer: (instruction: string) => void;
  onAcceptDraft: () => void;
  onDiscardDraft: () => void;
}

export function NavigatorTab({
  project,
  selectedEpisode,
  setSelectedEpisode,
  handleGenerateEpisodeScript,
  generatingEpisodeId,
  pendingDraft,
  isGenerating,
  onSteer,
  onAcceptDraft,
  onDiscardDraft
}: NavigatorTabProps) {
  const [chatInput, setChatInput] = useState("");

  const handleSend = () => {
    if (!chatInput.trim() || isGenerating) return;
    console.log("[CO-WRITER] Sending instruction:", chatInput);
    onSteer(chatInput);
    setChatInput("");
  };

  return (
    <div className="flex gap-12 min-h-[800px] animate-in fade-in slide-in-from-bottom-4 duration-700 pt-10">
      {/* EPISODE LIST AREA (Slim side) */}
      <div className="w-64 flex-shrink-0 space-y-3 overflow-y-auto pr-4 custom-scrollbar">
        {project.episodes?.map(ep => (
          <button
            key={ep.id}
            onClick={() => {
              setSelectedEpisode(ep);
              onDiscardDraft(); 
            }}
            className={cn(
              "w-full text-left p-6 rounded-2xl border transition-all duration-300",
              selectedEpisode?.id === ep.id 
                ? "bg-brand-gold/10 border-brand-gold/30 shadow-[0_4px_15px_rgba(197,160,89,0.1)]" 
                : "bg-white/[0.01] border-white/5 hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-gold font-black text-[10px] uppercase italic tracking-[0.2em]">EP.{String(ep.episode_number).padStart(2, '0')}</span>
              {ep.script_content && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
            </div>
            <h4 className="text-white font-bold text-xs truncate uppercase tracking-tighter">{ep.title || "Untitled Sequence"}</h4>
          </button>
        ))}
      </div>

      {/* SCRIPT VIEWER & CO-WRITER AREA */}
      <div className="flex-1 flex flex-col gap-6 relative z-10">
        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden flex flex-col relative shadow-3xl backdrop-blur-3xl">
          {selectedEpisode ? (
            <div className="h-full flex flex-col">
               {/* Header */}
               <div className="p-10 border-b border-white/10 flex items-center justify-between bg-black/60">
                  <div>
                     <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic">EP.{selectedEpisode.episode_number}: {selectedEpisode.title}</h2>
                     <p className="text-neutral-500 text-[10px] mt-2 uppercase tracking-widest font-bold opacity-60 truncate max-w-md">{selectedEpisode.summary}</p>
                  </div>
                  {!selectedEpisode.script_content && !pendingDraft && (
                    <button
                      onClick={() => handleGenerateEpisodeScript(selectedEpisode)}
                      disabled={!!generatingEpisodeId}
                      className="px-8 py-3 bg-brand-gold text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-30 flex items-center gap-2"
                    >
                      {generatingEpisodeId === selectedEpisode.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Drafting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Initial AI Draft</span>
                        </>
                      )}
                    </button>
                  )}
               </div>

               {/* Interaction Area */}
               <div className="flex-1 overflow-hidden p-10 flex gap-10">
                  {/* MAIN SCRIPT AREA */}
                  <div className={cn("transition-all duration-1000 h-full relative", pendingDraft ? "w-1/2" : "w-full")}>
                    {selectedEpisode.script_content ? (
                      <InteractiveScriptViewer 
                        initialContent={selectedEpisode.script_content} 
                        projectId={project.id} 
                        episodeId={selectedEpisode.id} 
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[30px] bg-white/[0.01]">
                        <FileText size={80} className="text-neutral-700" />
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-[1em] text-neutral-500">Void Node Initialized</p>
                          <p className="text-[10px] text-neutral-700 mt-4 uppercase font-bold">Generate initial draft or use Co-Writer below</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI PENDING DRAFT AREA */}
                  <AnimatePresence>
                    {pendingDraft && (
                      <motion.div 
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.95 }}
                        className="w-1/2 h-full flex flex-col bg-brand-gold/[0.05] border border-brand-gold/30 rounded-[30px] overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.1)] relative"
                      >
                         <div className="p-6 bg-brand-gold/10 border-b border-brand-gold/20 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center space-x-3">
                               <Sparkles size={18} className="text-brand-gold animate-pulse" />
                               <span className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] italic">Co-Writer Suggestion</span>
                            </div>
                            <div className="flex items-center space-x-3">
                               <button 
                                  onClick={onDiscardDraft}
                                  className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/10"
                               >
                                  <RotateCcw size={14} />
                                  <span>Discard</span>
                               </button>
                               <button 
                                  onClick={onAcceptDraft}
                                  className="flex items-center space-x-2 px-5 py-2 bg-brand-gold text-black hover:bg-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/20"
                               >
                                  <Check size={14} />
                                  <span>Accept Draft</span>
                               </button>
                            </div>
                         </div>
                         <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-sm">
                            <div className="space-y-6 font-mono text-sm leading-loose">
                               <div className="mb-8 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                                  <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest block mb-2 opacity-50">Scene Objective</span>
                                  <p className="text-white italic text-xs">"{pendingDraft.draftTitle}"</p>
                               </div>
                               {pendingDraft.sceneElements.map((el, i) => (
                                 <div key={i} className={cn(
                                   "group relative transition-all duration-300 hover:bg-white/[0.02] p-2 rounded-lg",
                                   el.type === 'HEADING' && "text-brand-gold font-bold bg-white/5 p-3 -mx-2 rounded-lg border-l-4 border-brand-gold uppercase tracking-tighter",
                                   el.type === 'CHARACTER' && "text-center text-white font-black pt-6 uppercase tracking-widest",
                                   el.type === 'PARENTHETICAL' && "text-center text-neutral-500 italic text-xs -mt-1",
                                   el.type === 'DIALOGUE' && "text-center text-neutral-200 px-16 text-md leading-relaxed",
                                   el.type === 'ACTION' && "text-neutral-500 italic leading-relaxed py-2"
                                 )}>
                                   {el.content}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-700 space-y-4">
              <div className="w-16 h-[1px] bg-neutral-800" />
              <p className="font-black uppercase tracking-[0.5em] text-xs">Select Episode Sequence</p>
              <div className="w-16 h-[1px] bg-neutral-800" />
            </div>
          )}
        </div>

        {/* CO-WRITER STEERING CHAT BAR — THE COMMAND CENTER */}
        {selectedEpisode && (
          <div className="bg-black/80 border-2 border-white/10 rounded-[30px] p-6 flex items-center space-x-6 shadow-2xl backdrop-blur-4xl group transition-all hover:border-brand-gold/30">
             <div className="flex-1 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 p-4">
                  <Sparkles size={20} className={cn("transition-colors duration-500", isGenerating ? "text-brand-gold animate-spin" : "text-neutral-700 group-hover:text-brand-gold/40")} />
                </div>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isGenerating ? "AI CO-WRITER IS SYNTHESIZING DRAFT..." : "Command the AI: 'Add a tense confrontation', 'Make him more aggressive', 'End on a cliffhanger'..."}
                  disabled={isGenerating}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-24 py-5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-gold/50 transition-all font-medium disabled:opacity-50"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                   {isGenerating ? (
                     <div className="flex items-center space-x-3">
                        <Loader2 size={16} className="animate-spin text-brand-gold" />
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] animate-pulse">Drafting</span>
                     </div>
                   ) : (
                     <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Press Enter to Steer</span>
                   )}
                </div>
             </div>
             <button
               onClick={handleSend}
               disabled={!chatInput.trim() || isGenerating}
               className={cn(
                 "p-5 rounded-2xl transition-all duration-500 flex items-center justify-center shadow-xl",
                 chatInput.trim() 
                  ? "bg-brand-gold text-black hover:scale-110 active:scale-95 shadow-brand-gold/20" 
                  : "bg-white/5 text-neutral-700"
               )}
             >
               <Send size={24} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
