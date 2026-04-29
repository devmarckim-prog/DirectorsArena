"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Sparkles, RefreshCcw } from "lucide-react";

interface SceneMatrixProps {
  selectedEpisode: any;
  sceneList: any[];
  selectedBeatId: string | undefined;
  onSelectBeat: (beat: any) => void;
  onRegenerateScene: (e: React.MouseEvent, beat: any) => void;
  onGenerateScenes: (ep: any) => void;
  isGenerating: boolean;
}

export function SceneMatrix({
  selectedEpisode,
  sceneList,
  selectedBeatId,
  onSelectBeat,
  onRegenerateScene,
  onGenerateScenes,
  isGenerating
}: SceneMatrixProps) {
  if (!selectedEpisode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-black/40 border-y border-white/5 py-12"
    >
      <div className="w-full flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 custom-scrollbar-gold">
        <AnimatePresence mode="popLayout">
          {sceneList.map((beat: any, idx: number) => {
            const isSelected = selectedBeatId === beat.id || selectedBeatId === beat.title;
            return (
              <motion.div
                key={beat.id || idx}
                layout
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: idx * 0.05,
                  ease: [0.23, 1, 0.32, 1] 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (beat) onSelectBeat(beat);
                }}
                className={cn(
                  "shrink-0 w-80 md:w-96 group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between",
                  isSelected
                    ? "bg-brand-gold/5 border-brand-gold/60 shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                    : "bg-[#09090B] border-white/10 hover:border-brand-gold/30"
                )}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold rounded text-[8px] font-black uppercase tracking-widest">
                        SCENE {idx + 1}
                      </span>
                      {beat.timestamp_label && (
                        <span className="text-[8px] text-neutral-600 font-bold tracking-widest">
                          {beat.timestamp_label}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => onRegenerateScene(e, beat)}
                      className="opacity-0 group-hover:opacity-100 shrink-0 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-black rounded-full p-2 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Sparkles size={14} className={isSelected ? "animate-pulse" : ""} />
                    </button>
                  </div>
                  <h4 className={cn("text-sm font-black italic uppercase truncate mb-2 tracking-tight", isSelected ? "text-brand-gold" : "text-white")}>
                    {beat.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-6 leading-relaxed mt-2 group-hover:text-neutral-300 transition-colors">
                    {beat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ADD SCENE CARD (+) */}
        <motion.button 
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          whileHover={{ opacity: 1, backgroundColor: "rgba(197, 160, 89, 0.05)", borderColor: "rgba(197, 160, 89, 0.4)" }}
          className="shrink-0 w-48 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
          onClick={() => {/* TODO: Handle Add Scene */}}
        >
          <Plus size={20} className="text-white group-hover:text-brand-gold transition-colors" />
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-brand-gold transition-colors">Add Scene</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
