"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Sparkles, Globe, Users } from "lucide-react";
import Image from "next/image";

export interface Project {
  id: string | number;
  platform: string;
  genre: string;
  episodes?: number;
  duration?: number;
  world?: string;
  characterCount?: number;
  logline: string;
  status: 'BAKING' | 'COMPLETED';
  progress: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const isBaking = project.status === 'BAKING';

  const getMilestone = (progress: number) => {
    if (progress <= 20) return "Architecting Structure";
    if (progress <= 45) return "Synthesizing Personas";
    if (progress <= 70) return "Mapping Tension";
    if (progress <= 90) return "Rendering Atmosphere";
    return "Finalizing Script";
  };

  return (
    <div className="relative w-[320px] h-[450px] group perspective-1000">
      {/* Step 7: Gold Flare Effect on Completion */}
      <AnimatePresence>
        {project.progress === 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-brand-gold/40 rounded-[2.5rem] blur-3xl z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "w-full h-full rounded-[2.5rem] bg-neutral-900 border overflow-hidden relative shadow-2xl transition-all duration-700",
          isBaking ? "border-brand-gold/20" : "border-white/5 hover:border-brand-gold/40"
        )}
      >
        {/* Baking Background Pulse */}
        {isBaking && (
          <motion.div 
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-brand-gold/10 z-0"
          />
        )}

        {/* Top Meta Info */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Canvas</span>
            <span className="text-[11px] font-black text-brand-gold uppercase tracking-[0.3em]">{project.platform}</span>
          </div>
          {isBaking && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/20">
               <Sparkles size={10} className="text-brand-gold animate-spin-slow" />
               <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Baking</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="h-full w-full flex flex-col justify-end p-8 relative z-10">
          {/* Baking Pulse Center & Milestones */}
          {isBaking && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-8">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-brand-gold/10 blur-2xl"
              />
              <div className="text-center mt-6">
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] animate-pulse">
                  {getMilestone(project.progress)}
                </p>
                <div className="flex items-center justify-center space-x-4 mt-3">
                  <div className="h-[1px] w-8 bg-brand-gold/20" />
                  <p className="text-3xl font-black text-white italic tabular-nums">{Math.round(project.progress)}%</p>
                  <div className="h-[1px] w-8 bg-brand-gold/20" />
                </div>
              </div>
            </div>
          )}

          {/* Static Content */}
          {!isBaking && (
            <motion.div 
              initial={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-3xl font-black text-white italic leading-tight uppercase transform group-hover:translate-x-2 transition-transform duration-500">
                {project.genre} <br/> Narrative
              </h3>
              
              {/* Bottom Specs & Metadata */}
              <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-white/5 opacity-60">
                <div className="flex flex-col">
                   <div className="flex items-center space-x-2 text-neutral-500 mb-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em]">Episodes</span>
                   </div>
                   <span className="text-xs font-black text-white">{project.episodes || "1"}</span>
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center space-x-2 text-neutral-500 mb-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em]">Duration</span>
                   </div>
                   <span className="text-xs font-black text-white">{project.duration || "120"}m</span>
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center space-x-2 text-neutral-500 mb-1">
                      <Globe size={10} className="text-brand-gold/50" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em]">World</span>
                   </div>
                   <span className="text-xs font-black text-white truncate pr-2">{project.world || "Contemporary"}</span>
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center space-x-2 text-neutral-500 mb-1">
                      <Users size={10} className="text-brand-gold/50" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em]">Souls</span>
                   </div>
                   <span className="text-xs font-black text-white">{project.characterCount || "3"}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hover Overlay Logline */}
          {!isBaking && (
            <motion.div 
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl p-10 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="w-12 h-[1px] bg-brand-gold/40 mb-8" 
              />
              <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] mb-4 italic">Logline Analysis</p>
              <p className="text-xl font-black text-white leading-relaxed italic line-clamp-4">
                "{project.logline}"
              </p>
              <div className="mt-12 group/btn">
                <button className="text-[10px] font-black text-neutral-600 group-hover/btn:text-white transition-colors uppercase tracking-[0.5em]">
                   Enter Production Studio
                </button>
                <motion.div className="h-[1px] w-0 group-hover/btn:w-full bg-brand-gold transition-all duration-500 mt-2" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Baking Gold Glow Progress Bar */}
        {isBaking && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${project.progress}%` }}
               className="h-full bg-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.8)]"
             />
          </div>
        )}
      </motion.div>
    </div>
  );
}
