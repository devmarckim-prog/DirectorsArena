"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Sparkles, Globe, Users, Activity, 
  PlayCircle, Trash2, Edit3, Shield, ExternalLink,
  ScrollText, PenTool, Droplet
} from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

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
  characters?: any[];
  scenes?: any[];
  title?: string;
  is_sample?: boolean;
  image?: string;
  synopsis?: string;
}

export function ProjectCard({ 
  project, 
  onDelete 
}: { 
  project: Project;
  onDelete?: (id: string | number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // v3.11 Robust Data Extraction
  const meta = useMemo(() => {
    if (typeof project.synopsis !== 'string') return null;
    try {
      return JSON.parse(project.synopsis);
    } catch (e) {
      return null;
    }
  }, [project.synopsis]);

  const displayTitle = project.title || meta?.title || meta?.story?.title || "Untitled Project";
  const displayLogline = project.logline || meta?.logline || meta?.story?.logline || "No logline available.";
  
  // v4.2 Robust Baking Check: Samples and COMPLETED projects never show as baking
  const isBaking = !project.is_sample && project.status === 'BAKING';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.is_sample) return;
    
    const confirmed = window.confirm(`${displayTitle}를 정말로 삭제하시겠습니까?`);
    if (confirmed && onDelete) {
      onDelete(project.id);
    }
  };

  const getMilestone = (progress: number) => {
    if (progress <= 20) return "Architecting Structure";
    if (progress <= 45) return "Synthesizing Personas";
    if (progress <= 70) return "Mapping Tension";
    if (progress <= 90) return "Rendering Atmosphere";
    return "Finalizing Script";
  };

  return (
    <div 
      className="relative w-full h-[520px] perspective-2000 group cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{
          rotateZ: isFlipped ? [0, -2, 2, -2, 0] : 0,
          rotateY: isFlipped ? 180 : 0
        }}
        transition={{
          rotateZ: { duration: 0.3, ease: "easeInOut" },
          rotateY: { duration: 0.5, delay: isFlipped ? 0.3 : 0, type: "spring", stiffness: 260, damping: 20 }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        <div className="w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
          {/* FRONT SIDE */}
          <motion.div
             className={cn(
                "absolute inset-0 w-full h-full rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-800 overflow-hidden shadow-2xl transition-all duration-300",
                isBaking ? "border-brand-gold/40" : "border-neutral-800"
             )}
             style={{ backfaceVisibility: "hidden" }}
          >
             {/* Thumbnail Header Area - MAXIMUM VIVIDNESS */}
             <div className="absolute top-0 left-0 right-0 h-56 z-0 overflow-hidden rounded-t-2xl">
                <Image 
                  src={project.image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800"}
                  alt={displayTitle}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
             </div>
   
             {/* Top Badges */}
             <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                <div className="px-2.5 py-1 bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-md">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">{project.platform}</span>
                </div>
                {project.is_sample && (
                   <div className="px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/50 text-brand-gold rounded-md backdrop-blur-md">
                      <span className="text-[9px] font-black uppercase tracking-widest">Official</span>
                   </div>
                )}
             </div>
   
             {/* Center Baking UI */}
             {isBaking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-32 h-32 rounded-full bg-brand-gold/10 blur-3xl"
                  />
                  <div className="text-center mt-6 relative z-10">
                     <motion.p 
                       animate={{ opacity: [0.4, 1, 0.4] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2"
                     >
                       RENDERING NARRATIVE DNA
                     </motion.p>
                     <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                       {getMilestone(project.progress)}
                     </p>
                     <p className="text-5xl font-black text-white tabular-nums mt-4 tracking-tighter">{Math.round(project.progress)}%</p>
                   </div>
                </div>
             )}
   
             {/* Bottom Actions Cluster */}
             {!isBaking && (
                <div className="absolute bottom-6 left-6 right-6 z-10">
                   <div className="flex flex-col space-y-2">
                      <h3 className="text-xl font-bold text-white uppercase leading-tight tracking-tight pt-4 text-left">
                       {displayTitle}
                      </h3>
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-bold">
                         <PenTool size={10} className="text-brand-gold/60" />
                         <span className="text-neutral-400">Elite Co-Writer Active</span>
                         <span className="opacity-30">•</span>
                         <span>Scenario v1.0</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                         <div className="flex items-center space-x-3">
                            <button className="text-neutral-500 hover:text-white transition-colors">
                               <Edit3 size={14} />
                            </button>
                             <button 
                                onClick={handleDelete}
                                disabled={project.is_sample}
                                className={cn(
                                   "transition-colors",
                                   project.is_sample ? "opacity-20 cursor-not-allowed" : "text-neutral-500 hover:text-red-500"
                                )}
                             >
                                <Trash2 size={14} />
                             </button>
                         </div>
                          <div className="flex items-center space-x-2 text-[9px] font-black text-brand-gold uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors group/logline">
                             <span>Script DNA</span>
                             <ScrollText size={12} className="group-hover/logline:rotate-12 transition-transform" />
                          </div>
                      </div>
                   </div>
                </div>
             )}
   
             {/* Baking Progress Bar */}
             {isBaking && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${project.progress}%` }}
                     className="h-full bg-brand-gold shadow-[0_0_20px_rgba(197,160,89,1)] relative"
                   >
                     <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/40 to-transparent" />
                   </motion.div>
                </div>
             )}
          </motion.div>
   
          {/* BACK SIDE */}
          <motion.div
             className="absolute inset-0 w-full h-full rounded-2xl bg-black/95 backdrop-blur-xl border border-brand-gold/30 p-10 flex flex-col justify-between shadow-2xl overflow-hidden"
             style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
             <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <PenTool size={180} className="text-brand-gold -rotate-45" />
             </div>
   
             <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-[1px] bg-brand-gold animate-pulse" />
                    <span className="text-xs font-black text-brand-gold uppercase tracking-[0.5em]">Narrative Protocol</span>
                </div>
                
                <div className="space-y-8">
                    <div>
                       <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">Core Narrative Logline</h4>
                       <p className="text-lg font-cinematic-serif text-brand-gold leading-relaxed font-italic">
                          "{displayLogline}"
                       </p>
                    </div>
    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                       <div>
                          <span className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Architecture</span>
                          <span className="text-xs font-black text-brand-gold uppercase">{project.world || "VOID"}</span>
                       </div>
                       <div>
                          <span className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Character Souls</span>
                          <span className="text-xs font-black text-white">{project.characterCount || "3"} Personas</span>
                       </div>
                    </div>
                </div>
             </div>
   
              <div className="relative z-10 flex flex-col space-y-4">
                <Link 
                   href={`/project-contents/${project.id}`}
                   className="flex items-center justify-center space-x-3 w-full py-4 bg-brand-gold text-black rounded-lg font-black uppercase tracking-widest text-xs hover:bg-white transition-all"
                >
                   <PlayCircle size={16} />
                   <span>Enter Production Terminal</span>
                </Link>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     setIsFlipped(false);
                  }}
                  className="w-full py-2 text-neutral-600 hover:text-white text-[9px] font-black uppercase tracking-[0.3em] transition-colors"
                >
                   Return to Slate
                </button>
             </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
