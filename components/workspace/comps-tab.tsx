"use client";

import { useState, useEffect } from "react";
import { 
  Play, Loader2, Sparkles, LayoutDashboard, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, Project } from "@/components/project-list/project-card";
import { fetchSimilarWorksPageAction } from "@/app/actions";

interface Comp {
  id: number | string;
  title: string;
  release_date: string;
  genres: string[];
  vote_average: number;
  poster_path: string;
  similarity_reason: string;
  media_type: "movie" | "tv";
  tmdb_id?: string | number;
}

interface CompsTabProps {
  projectId: string;
  hasSynopsis: boolean;
}

export function CompsTab({ projectId, hasSynopsis }: CompsTabProps) {
  const [data, setData] = useState<Comp[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchPage = async (offset: number, append: boolean = true) => {
    try {
      const result = await fetchSimilarWorksPageAction(projectId, offset);
      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error("[CompsTab] Fetch error:", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      // Ensure offset 0 and no append for initial load
      await fetchPage(0, false);
      setIsInitialLoading(false);
    };
    if (projectId) {
      init();
    }
  }, [projectId]);

  const handleGenerate = async () => {
    if (!hasSynopsis) return;
    setIsLoading(true);
    try {
      // Step 1: Trigger Server-side Generation & DB Persistence
      const res = await fetch('/api/scenario/comps', {
        method: 'POST',
        body: JSON.stringify({ projectId }),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      
      if (json.success) {
        // Step 2: Fetch the first page from DB after generation
        await fetchPage(0, false);
      } else {
        console.error("[CompsTab] Generation failed:", json.error);
      }
    } catch (e) { 
      console.error("[CompsTab] Critical generate error:", e);
    }
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await fetchPage(data.length, true);
    setIsLoadingMore(false);
  };

  const mapCompToProject = (comp: any): Project => {
    // v12.1: Extract packed metadata from viewer_stats if present
    let extras: any = {};
    if (typeof comp.viewer_stats === 'string') {
      try {
        extras = JSON.parse(comp.viewer_stats);
      } catch (e) {
        console.warn("[CompsTab] Failed to parse viewer_stats:", e);
      }
    } else if (comp.viewer_stats && typeof comp.viewer_stats === 'object') {
      extras = comp.viewer_stats;
    }

    const poster = extras.poster_path || comp.poster_path || `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=780`;
    const genres = extras.genres || comp.genres || [];
    const mediaType = extras.media_type || comp.media_type || 'movie';

    return {
      id: comp.id,
      title: comp.title,
      platform: mediaType === 'movie' ? 'MOVIE' : 'SERIES',
      genre: Array.isArray(genres) ? genres.join(' / ') : '장르 미지정',
      logline: comp.similarity_reason,
      status: 'COMPLETED',
      progress: 100,
      image: poster,
      is_sample: false
    };
  };

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[325px] rounded-[20px] bg-white/[0.02] border border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 cinematic-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8 relative z-20"
      >
        <div>
          <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-1">Cinematic Benchmark Output</h3>
          <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest opacity-60">
            Targeting market parity and narrative synergy {total > 0 ? `(${total} Works)` : ''}
          </p>
        </div>
        {(data.length > 0 || !isInitialLoading) && (
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className={cn(
              "group flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-500 border shadow-lg",
              isLoading 
                ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed" 
                : "bg-brand-gold text-black border-brand-gold hover:scale-105 active:scale-95"
            )}
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isLoading ? "Synthesizing..." : "Regenerate Analysis"}
            </span>
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading && data.length === 0 ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[325px] rounded-[20px] bg-white/[0.02] border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 cinematic-shimmer" />
              </div>
            ))}
          </motion.div>
        ) : data.length > 0 ? (
          <div className="space-y-8 relative">
            {/* Loading Overlay for Regeneration */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-[30px]"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Loader2 size={40} className="text-brand-gold animate-spin" />
                    <Sparkles size={16} className="absolute -top-1 -right-1 text-brand-gold animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">
                    Synthesizing New Dataset...
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div 
              key="list"
              className={cn(
                "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700",
                isLoading && "opacity-30 blur-[2px] scale-[0.98]"
              )}
            >
              {data.map((item: Comp, idx: number) => (
                <motion.div 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.05, duration: 0.6 }}
                >
                  <ProjectCard 
                    project={mapCompToProject(item)} 
                  />
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="flex justify-center pt-4 pb-20">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative flex items-center space-x-3 px-12 py-4 rounded-full bg-white/[0.03] border border-white/10 hover:bg-brand-gold hover:text-black transition-all duration-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-brand-gold opacity-0 group-hover:opacity-10 transition-opacity rounded-full" />
                  {isLoadingMore ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Load More Works</span>
                      <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform duration-500" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
             key="empty"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] bg-[#050505] group"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:border-brand-gold/20 transition-all duration-700">
                <LayoutDashboard size={32} className="text-neutral-700 group-hover:text-brand-gold/40 transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)] animate-bounce">
                <Sparkles size={12} className="text-black" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-3 text-center">Reference Analysis</h2>
            <p className="text-[10px] text-neutral-500 mb-8 max-w-xs text-center font-medium leading-[1.8] opacity-60 uppercase tracking-widest">
              Deep-learning benchmark audit against cinematic genomes.
            </p>
            
            <button 
              disabled={!hasSynopsis || isLoading}
              onClick={handleGenerate}
              className={cn(
                "group relative px-10 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-700 overflow-hidden",
                hasSynopsis 
                  ? "bg-white text-black hover:bg-brand-gold hover:shadow-[0_0_40px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95" 
                  : "bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed opacity-40"
              )}
            >
              <div className="relative z-10 flex items-center space-x-3">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                <span>{isLoading ? "Synthesizing Dataset..." : "Analyze References"}</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

