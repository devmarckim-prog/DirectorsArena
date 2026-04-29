"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, RefreshCcw, Sparkles, Zap } from "lucide-react";

interface EpisodeSliderProps {
  episodes: any[];
  selectedEpisodeId: string | number | undefined;
  generatingEpisodeId: string | null;
  onSelectEpisode: (ep: any) => void;
  onGenerateScript: (ep: any) => void;
  projectId: string;
}

export function EpisodeSlider({
  episodes,
  selectedEpisodeId,
  generatingEpisodeId,
  onSelectEpisode,
  onGenerateScript,
  projectId
}: EpisodeSliderProps) {
  return (
    <div className="w-full overflow-x-auto px-4 md:px-8 py-8 custom-scrollbar-gold scroll-smooth">
      <div className="flex gap-6 min-w-max">
        {episodes.map((ep: any, idx: number) => {
          const isSelected = selectedEpisodeId === ep.id || selectedEpisodeId === ep.episode_number;
          const isGenerating = generatingEpisodeId === ep.id;
          const hasScript = !!ep.script_content;
          const isPlaceholder = String(ep.id).includes('placeholder');

          return (
            <motion.div
              key={`ep-card-${ep.id || idx}-${projectId}`}
              whileHover={{ y: -5 }}
              onClick={() => onSelectEpisode(ep)}
              className={cn(
                "shrink-0 w-72 md:w-80 group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col",
                isSelected
                  ? "bg-brand-gold/10 border-brand-gold/40 shadow-[0_0_30px_rgba(197,160,89,0.15)] ring-1 ring-brand-gold/20"
                  : "bg-white/[0.02] border-white/5 hover:border-brand-gold/20 hover:bg-brand-gold/[0.03]",
                isPlaceholder && !isSelected && "opacity-40 grayscale-[0.5] blur-[0.5px]"
              )}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "font-black text-[10px] tracking-widest uppercase",
                    isSelected ? "text-brand-gold" : "text-white/40"
                  )}>
                    EP {ep.episode_number}
                  </span>

                  {ep.episode_number === 1 ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onGenerateScript(ep); }}
                      className={cn(
                        "p-2 rounded-full transition-colors flex items-center justify-center",
                        isGenerating
                          ? "animate-spin text-brand-gold"
                          : "bg-white/5 text-neutral-500 hover:text-brand-gold hover:bg-brand-gold/10"
                      )}
                    >
                      <RefreshCcw size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); onGenerateScript(ep); }}
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

                <h3 className={cn(
                  "text-lg font-black uppercase italic tracking-tight mb-2 truncate group-hover:text-brand-gold transition-colors",
                  isSelected ? "text-white" : "text-white/60"
                )}>
                  {ep.title || `Episode ${ep.episode_number}`}
                </h3>

                <p className="text-xs text-neutral-400 font-medium leading-[1.8] line-clamp-4 flex-1">
                  {ep.summary || ep.synopsis || "Awaiting story generation for this episode..."}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* ADD EPISODE CARD (+) */}
        <button 
          className="shrink-0 w-72 md:w-80 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group opacity-30 hover:opacity-100"
          onClick={() => {/* TODO: Handle Add Episode */}}
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/40 group-hover:scale-110 transition-all">
            <Plus size={24} className="text-white group-hover:text-brand-gold" />
          </div>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-brand-gold">Add Episode</span>
        </button>
      </div>
    </div>
  );
}
