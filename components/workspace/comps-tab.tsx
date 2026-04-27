"use client";

import { useState, useEffect } from "react";
import { 
  Play, Loader2, Sparkles, LayoutDashboard, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, Project } from "@/components/project-list/project-card";

interface Comp {
  id: number;
  title: string;
  release_date: string;
  genres: string[];
  vote_average: number;
  poster_path: string;
  similarity_reason: string;
  media_type: "movie" | "tv";
  tmdb_id?: string | number;
}

// v6.12 High-Fidelity Mock Data for UI Verification
const MOCK_COMPS: Comp[] = [
  {
    id: 121,
    title: "The Lord of the Rings: The Two Towers",
    release_date: "2002-12-18",
    genres: ["Adventure", "Fantasy", "Action"],
    vote_average: 8.4,
    poster_path: "https://image.tmdb.org/t/p/w780/56v2KjI5h9n9QCvAl6ybv3Yv7wk.jpg",
    similarity_reason: "High-fantasy world-building and epic scale narrative with multiple character arcs crossing paths.",
    media_type: "movie"
  },
  {
    id: 27205,
    title: "Inception",
    release_date: "2010-07-15",
    genres: ["Action", "Sci-Fi", "Adventure"],
    vote_average: 8.4,
    poster_path: "https://image.tmdb.org/t/p/w780/edv5CZvRjS99vS6Y6I6HjC1RSmY.jpg",
    similarity_reason: "Complex psychological layers and non-linear storytelling structures that challenge perceived reality.",
    media_type: "movie"
  },
  {
    id: 157336,
    title: "Interstellar",
    release_date: "2014-11-05",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    vote_average: 8.4,
    poster_path: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlSabaC.jpg",
    similarity_reason: "Themes of cosmic solitude, familial bonds, and scientifically-grounded speculative fiction.",
    media_type: "movie"
  },
  {
    id: 155,
    title: "The Dark Knight",
    release_date: "2008-07-16",
    genres: ["Drama", "Action", "Crime"],
    vote_average: 8.5,
    poster_path: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDp92SKyYw9Status.jpg",
    similarity_reason: "Masterful exploration of morality and chaos within an urban noir setting with iconic antagonists.",
    media_type: "movie"
  }
];

interface CompsTabProps {
  projectId: string;
  hasSynopsis: boolean;
  metadata?: any;
  storedComps?: Comp[];
  onGenerated?: (newComps: Comp[]) => void;
}

export function CompsTab({ projectId, hasSynopsis, metadata, storedComps, onGenerated }: CompsTabProps) {
  const [data, setData] = useState<Comp[] | null>(storedComps || null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    if (storedComps && storedComps.length > 0) {
      setData(storedComps);
    }
  }, [storedComps]);

  const handleGenerate = async () => {
    if (!hasSynopsis) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/scenario/comps', {
        method: 'POST',
        body: JSON.stringify({ projectId }),
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setData(json.data);
        onGenerated?.(json.data);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setData(MOCK_COMPS);
        onGenerated?.(MOCK_COMPS);
      }
    } catch (e) { 
      console.error(e);
      setData(MOCK_COMPS); 
      onGenerated?.(MOCK_COMPS);
    }
    setIsLoading(false);
  };

  const mapCompToProject = (comp: Comp): Project => {
    return {
      id: comp.id,
      title: comp.title,
      platform: comp.media_type === 'movie' ? 'MOVIE' : 'SERIES',
      genre: comp.genres?.join(' / ') || '장르 미지정',
      logline: comp.similarity_reason,
      status: 'COMPLETED',
      progress: 100,
      image: comp.poster_path,
      is_sample: false
    };
  };

  const currentList = data || metadata?.similarWorks || [];
  const displayedList = (currentList || []).slice(0, visibleCount);
  const hasMore = currentList && currentList.length > visibleCount;

  return (
    <div className="space-y-8 px-4">
      {/* Header with Regenerate Trigger */}
      {currentList && currentList.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-1">Cinematic Benchmark Output</h3>
            <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest opacity-60">Targeting market parity and narrative synergy</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="group flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-brand-gold hover:text-black transition-all duration-500"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:animate-pulse" />}
            <span className="text-[9px] font-black uppercase tracking-widest">Regenerate Analysis</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
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
        ) : currentList && currentList.length > 0 ? (
          <div className="space-y-8">
            <motion.div 
              key="list"
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayedList.map((item: Comp, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.6 }}
                >
                  <ProjectCard 
                    project={mapCompToProject(item)} 
                  />
                </motion.div>
              ))}
            </motion.div>
            {hasMore && (
              <div className="flex justify-center pb-12">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  <span>Load More</span>
                  <ChevronDown size={14} />
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
