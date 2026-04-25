"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Trash2, Edit3, 
  PlayCircle, User, ArrowUpRight, Droplet, Sparkles
} from "lucide-react";
import { useState, useMemo } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1478720568477-151d9b1b746d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542204172-3f241327663f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=800"
];

export interface Project {
  id: string | number;
  platform: string;
  genre: string;
  episodes?: number;
  duration?: number;
  world?: string;
  characterCount?: number;
  logline: string;
  status: 'BAKING' | 'COMPLETED' | 'ERROR' | 'READY';
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
  systemImages = [],
  onDelete 
}: { 
  project: Project;
  systemImages?: any[];
  onDelete?: (id: string | number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  
  const meta = useMemo(() => {
    if (typeof project.synopsis !== 'string') return null;
    try {
      return JSON.parse(project.synopsis);
    } catch (e) {
      return null;
    }
  }, [project.synopsis]);

  const displayImage = useMemo(() => {
    if (project.image && !project.image.includes('placeholder')) return project.image;
    if (meta?.image) return meta.image;
    
    const idStr = String(project.id);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash);
    
    if (systemImages && systemImages.length > 0) {
      return systemImages[idx % systemImages.length].url;
    }
    return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
  }, [project.id, project.image, meta, systemImages]);

  const displayTitle = project.title || meta?.title || meta?.story?.title || "Untitled Project";
  const displayLogline = project.logline || meta?.formData?.logline || meta?.logline || meta?.story?.logline || "No logline available.";
  
  const isBaking = !project.is_sample && (project.status === 'BAKING' || project.status === 'ERROR');

  const isLocked = !project.is_sample && project.status !== 'READY' && project.progress < 80;

  const handleCardClick = () => {
    if (isLocked) return;
    router.push(`/project-contents/${project.id}`);
  };

  const handleFlipTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.is_sample) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(project.id);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "relative w-full h-[380px] perspective-2000 group",
          isLocked ? "cursor-not-allowed" : "cursor-pointer"
        )}
        onClick={handleCardClick}
      >
        <motion.div
          animate={{
            rotateY: isFlipped ? 180 : 0
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* FRONT SIDE */}
          <motion.div
             className={cn(
                "absolute inset-0 w-full h-full rounded-[20px] bg-[#0d0d0d] border border-white/5 overflow-hidden shadow-2xl transition-all duration-300",
                isBaking ? "border-brand-gold/20" : "hover:border-white/10 group-hover:bg-[#121212]"
             )}
             style={{ backfaceVisibility: "hidden" }}
          >
             <div className="absolute top-0 left-0 right-0 h-[220px] z-0 overflow-hidden bg-neutral-900 border-none">
                {!imgError ? (
                  <Image 
                    src={displayImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 placeholder:bg-neutral-800"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                    <Droplet size={20} className="text-white/10" />
                  </div>
                )}
                {/* Enhanced Gradient from Image 3 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
             </div>
    
             <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                <div className="flex items-center space-x-2">
                   <div className="px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-sm border border-white/5 flex items-center justify-center whitespace-nowrap">
                      <span className="text-[8px] font-bold text-neutral-400 tracking-widest uppercase leading-none">
                         {project.genre || project.platform || "영화"}
                      </span>
                   </div>
                </div>
                {project.is_sample && (
                   <div className="px-1.5 py-0.5 bg-black rounded-sm border border-white/10 shadow-lg flex items-center justify-center whitespace-nowrap">
                      <span className="text-[8px] font-black text-brand-gold tracking-[0.2em] uppercase leading-none">
                         SAMPLE
                      </span>
                   </div>
                )}
             </div>
    
             {isBaking && (
                <div className="absolute inset-x-0 bottom-0 top-[185px] flex flex-col items-center justify-center p-4 z-10 bg-black/60 backdrop-blur-md px-6">
                   <div className="text-center relative z-10 w-full mb-2">
                      <motion.p 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2"
                      >
                        {project.status === 'ERROR' ? "GENERATION ERROR" : (project.progress <= 10 ? "ENGINE IGNITION" : "BAKING")}
                      </motion.p>
                      <p className={cn(
                        "text-3xl font-black text-white tabular-nums tracking-tighter",
                        isLocked && "animate-pulse"
                      )}>
                        {Math.round(project.progress)}%
                      </p>
                    </div>

                    {/* DEV MODE INSIGHTS (v6.1) */}
                    <div className="w-full mt-4 bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-1.5 overflow-hidden">
                       <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-widest">
                          <span className="text-white/40">Dev Insight</span>
                          <span className="text-brand-gold/60">OMA v6.1 Pulse</span>
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                             <div className={cn("w-1 h-1 rounded-full", project.progress >= 10 ? "bg-green-500 animate-pulse" : "bg-white/20")} />
                             <span className={cn("text-[8px] font-bold", project.progress >= 10 ? "text-white" : "text-white/20")}>Phase 1: API Handshake</span>
                          </div>
                          <div className="flex items-center space-x-2">
                             <div className={cn("w-1 h-1 rounded-full", project.progress > 10 ? "bg-green-500 animate-pulse" : "bg-white/20")} />
                             <span className={cn("text-[8px] font-bold", project.progress > 10 ? "text-white" : "text-white/20")}>Phase 2: Narrative Stream</span>
                          </div>
                       </div>
                       <p className="text-[7px] text-white/20 font-mono tracking-tighter truncate">
                          ID: {project.id} | Protocol: RAW_VIBE_v6.1
                       </p>
                    </div>

                    {isLocked && (
                      <div className="mt-4 flex flex-col items-center space-y-2">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">
                          Terminal Access Locked
                        </p>
                        <button 
                          onClick={handleDelete}
                          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 mt-2"
                        >
                          <Trash2 size={12} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Abandon Project</span>
                        </button>
                      </div>
                    )}
                </div>
             )}
    
             {!isBaking && (
                <div className="absolute top-[210px] left-0 right-0 bottom-0 p-5 pt-3.5 flex flex-col justify-between z-10">
                   <div className="space-y-2.5">
                     <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-1">
                          <h3 className="text-[18px] font-bold text-white tracking-tight leading-tight line-clamp-1 group-hover:text-brand-gold transition-colors">
                            {displayTitle.replace(/\s*\(.*?\)\s*/g, "").trim()}
                          </h3>
                          {(() => {
                            const enTitle = meta?.title_en || meta?.story?.title_en || displayTitle.match(/\((.*?)\)/)?.[1];
                            if (!enTitle) return null;
                            return (
                              <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] line-clamp-1">
                                {enTitle}
                              </span>
                            );
                          })()}
                        </div>
                        <ArrowUpRight size={14} className="absolute top-0 right-0 text-white/20 group-hover:text-brand-gold transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                     </div>
                     <div className="flex items-center space-x-2 text-[9px] text-neutral-500 font-medium">
                       <span className="opacity-40 tracking-tighter">
                         {new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                       </span>
                     </div>
                   </div>
                   <div className="w-full space-y-4">
                     {/* Bottom Bar from Image 2 */}
                     <div className="h-[1px] w-full bg-white/5" />
                     
                     <div className="flex items-center justify-between px-0.5">
                       <div className="flex items-center space-x-5">
                         <button className="text-neutral-700 hover:text-white transition-colors">
                           <Edit3 size={14} strokeWidth={1.5} />
                         </button>
                          <button 
                            onClick={handleDelete}
                            disabled={project.is_sample}
                            className={cn(
                              "transition-colors relative z-[30]",
                              project.is_sample ? "opacity-10 cursor-not-allowed" : "text-neutral-700 hover:text-red-500"
                            )}
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                       </div>
                       <div 
                         onClick={handleFlipTrigger}
                         className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-white/0 hover:bg-white/5 transition-all text-[8px] font-black text-neutral-600 tracking-widest hover:text-brand-gold group/logline cursor-help"
                       >
                         <span>LOGLINE</span>
                         <Sparkles size={10} className="text-brand-gold/40 group-hover/logline:text-brand-gold" />
                       </div>
                     </div>
                   </div>
                </div>
             )}
          </motion.div>
    
          {/* BACK SIDE */}
          <motion.div
             className="absolute inset-0 w-full h-full rounded-[20px] bg-[#050505] border border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
             style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
             onClick={(e) => e.stopPropagation()}
          >
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                        <Droplet size={12} className="text-brand-gold" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em]">STORY CORE</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-[14px] font-medium text-neutral-400 leading-relaxed italic opacity-90 line-clamp-6">
                       "{displayLogline}"
                    </p>
                </div>
             </div>
             <div className="relative z-10 flex flex-col space-y-3">
                <button 
                   onClick={handleCardClick}
                   disabled={isLocked}
                   className={cn(
                     "flex items-center justify-center space-x-3 w-full py-3.5 rounded-lg font-bold tracking-widest text-[10px] transition-all",
                     isLocked 
                       ? "bg-neutral-900 text-neutral-600 border border-white/5 cursor-not-allowed opacity-50" 
                       : "bg-brand-gold text-black hover:bg-white shadow-[0_0_25px_rgba(197,159,89,0.3)]"
                   )}
                >
                   <PlayCircle size={14} strokeWidth={2.5} />
                   <span>{isLocked ? "INITIALIZING..." : "ENTER TERMINAL"}</span>
                </button>
                <button 
                  onClick={handleFlipTrigger}
                  className="w-full py-1 text-neutral-700 hover:text-white text-[8px] font-bold tracking-[0.3em] transition-colors"
                >
                   FLIP BACK
                </button>
             </div>
             <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-gold/5 rounded-full blur-[60px]" />
          </motion.div>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="프로젝트 삭제"
        message={`'${displayTitle}' 프로젝트를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 캐릭터와 비트 데이터가 삭제됩니다.`}
        confirmText="영구 삭제"
        variant="danger"
      />
    </>
  );
}
