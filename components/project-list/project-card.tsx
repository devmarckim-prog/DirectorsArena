"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Trash2, Edit3, 
  PlayCircle, User, ArrowUpRight, Droplet, Sparkles
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 장르별 이미지 맵 (각 2개, 총 20개)
const GENRE_IMAGE_MAP: Record<string, string[]> = {
  romance: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&q=80&w=800",
  ],
  horror: [
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1572544656882-6b0b30c51e38?auto=format&fit=crop&q=80&w=800",
  ],
  fantasy: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
  ],
  noir: [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800",
  ],
  business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  ],
  historical: [
    "https://images.unsplash.com/photo-1551029506-0807df4e2031?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&q=80&w=800",
  ],
  comedy: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  ],
  scifi: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800",
  ],
  mystery: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80&w=800",
  ],
  action: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
  ],
};

// 장르 키워드 → 이미지 맵 키 매핑
function resolveGenreKey(genreOrPlatform: string): string | null {
  const g = (genreOrPlatform || '').toLowerCase();
  if (/로맨스|romance|멜로|melo|love/.test(g)) return 'romance';
  if (/공포|horror|스릴러|thriller/.test(g)) return 'horror';
  if (/판타지|fantasy|무협|wuxia/.test(g)) return 'fantasy';
  if (/누아르|noir|범죄|crime/.test(g)) return 'noir';
  if (/비즈니스|business|기업|직장|office/.test(g)) return 'business';
  if (/사극|historical|시대|조선|역사/.test(g)) return 'historical';
  if (/코미디|comedy|시트콤|sitcom/.test(g)) return 'comedy';
  if (/sf|sci.fi|공상과학|우주|space|cyber/.test(g)) return 'scifi';
  if (/미스터리|mystery|추리|detective/.test(g)) return 'mystery';
  if (/액션|action/.test(g)) return 'action';
  return null;
}

// 전체 이미지 풀 (장르 매칭 실패 시 fallback)
const ALL_IMAGES = Object.values(GENRE_IMAGE_MAP).flat();

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
  genreImages = {},
  onDelete 
}: { 
  project: Project;
  genreImages?: Record<string, string[]>;
  onDelete?: (id: string | number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(project.progress || 0);
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
    // 1. 프로젝트에 직접 이미지가 있으면 우선 사용
    if (project.image && !project.image.includes('placeholder')) return project.image;
    if (meta?.image) return meta.image;

    // 2. 장르 매칭: DB 이미지 우선, 코드 상수 fallback
    const genreStr = `${project.genre || ''} ${project.platform || ''}`;
    const genreKey = resolveGenreKey(genreStr);

    // ID 해시 (항상 동일한 이미지 보장)
    const idStr = String(project.id);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    const absHash = Math.abs(hash);

    if (genreKey) {
      // DB 이미지 우선
      const dbPool = genreImages[genreKey];
      if (dbPool && dbPool.length > 0) return dbPool[absHash % dbPool.length];
      // 코드 상수 fallback
      const codePool = GENRE_IMAGE_MAP[genreKey];
      if (codePool && codePool.length > 0) return codePool[absHash % codePool.length];
    }

    // 3. 장르 미매칭 → 전체 DB 풀 혹은 코드 풀
    const allDbImages = Object.values(genreImages).flat();
    if (allDbImages.length > 0) return allDbImages[absHash % allDbImages.length];
    return ALL_IMAGES[absHash % ALL_IMAGES.length];
  }, [project.id, project.image, project.genre, project.platform, meta, genreImages]);

  const displayTitle = project.title || meta?.title || meta?.story?.title || "Untitled Project";
  const displayLogline = project.logline || meta?.formData?.logline || meta?.logline || meta?.story?.logline || "No logline available.";
  
  const isDone = project.status === 'READY' || project.status === 'COMPLETED' || (project.progress ?? 0) >= 100;

  const isBaking = !project.is_sample && 
    (project.status === 'BAKING' || project.status === 'ERROR') &&
    !isDone;

  const isLocked = !project.is_sample && !isDone && (project.progress ?? 0) < 80;

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

  // v9.1: Incremental Progress Logic
  useEffect(() => {
    if (!isBaking || displayProgress >= 100) return;
    
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        // Increment slowly, but sync with real progress if real is higher
        const next = prev + (Math.random() * 0.5);
        return Math.max(next, project.progress);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isBaking, project.progress, displayProgress]);

  // Sync with real progress if real progress jumps ahead
  useEffect(() => {
    if (project.progress > displayProgress) {
        setDisplayProgress(project.progress);
    }
  }, [project.progress]);

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
                <div className="absolute inset-0 z-10 pointer-events-none">
                   {/* Top area for progress - moved from bottom */}
                   <div className="absolute top-[80px] left-0 right-0 flex flex-col items-center justify-center p-4">
                      <motion.p 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em] mb-3"
                      >
                        {project.status === 'ERROR' ? "GENERATION ERROR" : (displayProgress <= 15 ? "ENGINE IGNITION" : "BAKING NARRATIVE")}
                      </motion.p>
                      
                      <div className="relative w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mb-3 border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${displayProgress}%` }}
                          className="absolute inset-y-0 left-0 bg-brand-gold shadow-[0_0_10px_rgba(197,159,89,0.5)]"
                        />
                      </div>

                       <p className={cn(
                        "text-2xl font-black text-white tabular-nums tracking-tighter opacity-80",
                        isLocked && "animate-pulse"
                      )}>
                        {Math.round(displayProgress)}%
                      </p>
                    </div>

                    {/* Bottom area - Title matched to completed state */}
                    <div className="absolute top-[210px] left-0 right-0 p-5 pt-3.5 flex flex-col space-y-2.5">
                       <h3 className="text-[18px] font-bold text-white/40 tracking-tight leading-tight line-clamp-1 italic">
                        {displayTitle.replace(/\s*[(\uFF08].*?[)\uFF09]\s*/g, "").trim()}
                      </h3>
                      <div className="flex items-center space-x-2 text-[9px] text-neutral-500 font-medium">
                        <span className="opacity-20 tracking-tighter uppercase">Initializing Core Protocol...</span>
                      </div>

                      {/* Abandon Project Button */}
                      {isLocked && (
                        <div className="pt-4 flex flex-col items-center">
                          <button 
                            onClick={handleDelete}
                            className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 mt-2"
                          >
                            <Trash2 size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Abandon Project</span>
                          </button>
                        </div>
                      )}
                    </div>
                </div>
             )}
    
             {!isBaking && (
                <div className="absolute top-[210px] left-0 right-0 bottom-0 p-5 pt-3.5 flex flex-col justify-between z-10">
                   <div className="space-y-2.5">
                     <div className="flex items-start justify-between">
                        <div className="flex flex-col space-y-1">
                          <h3 className="text-[18px] font-bold text-white tracking-tight leading-tight line-clamp-1 group-hover:text-brand-gold transition-colors">
                            {displayTitle.replace(/\s*[(\uFF08].*?[)\uFF09]\s*/g, "").trim()}
                          </h3>
                          {(() => {
                            const enTitle = meta?.title_en || meta?.story?.title_en || displayTitle.match(/[(\uFF08](.*?)[)\uFF09]/)?.[1];
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
                        <span className="opacity-40 tracking-tighter uppercase">
                          {project.is_sample ? "MOCK PREVIEW" : "READY TO SYNC"}
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
