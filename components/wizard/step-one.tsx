import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Monitor, Film, Smartphone, BookOpen, Check } from "lucide-react";
import { RangeSlider } from "@/components/ui/range-slider";

interface StepOneProps {
  formData: {
    platform: string;
    genres: string[];
    episodes: number;
    duration: number;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

const PLATFORMS = [
  { id: "movie", name: "Movie", icon: Film, description: "Cinema, Theater Release" },
  { id: "ott", name: "OTT Series", icon: Monitor, description: "Netflix, Disney+, TVing" },
  { id: "novel", name: "Web Novel", icon: BookOpen, description: "Kakaopage, Munpia" },
  { id: "short", name: "Short-form", icon: Smartphone, description: "Tiktok, Reels, Shorts" },
];

const GENRES = ["Noir", "Thriller", "Romance", "SF", "Comedy", "Period Drama"];

const SPEC_DEFAULTS: Record<string, { eps: number; dur: number }> = {
  movie: { eps: 1, dur: 120 },
  ott: { eps: 12, dur: 60 },
  novel: { eps: 100, dur: 5 },
  short: { eps: 50, dur: 1 },
};

export function StepOne({ formData, setFormData }: StepOneProps) {
  // Auto-sync specs when platform changes
  useEffect(() => {
    if (formData.platform && SPEC_DEFAULTS[formData.platform]) {
      const defaults = SPEC_DEFAULTS[formData.platform];
      setFormData((prev: any) => ({
        ...prev,
        episodes: defaults.eps,
        duration: defaults.dur,
      }));
    }
  }, [formData.platform, setFormData]);

  const toggleGenre = (genre: string) => {
    const isSelected = formData.genres.includes(genre);
    if (isSelected) {
      setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
    } else {
      setFormData({ ...formData, genres: [...formData.genres, genre] });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          어떤 작품의 설계를 시작할까요?
        </motion.h2>
        <p className="text-neutral-500 font-medium tracking-wide uppercase text-sm">
          Select Your Canvas and Narrative Tone
        </p>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-16">
        {PLATFORMS.map((platform) => {
          const isSelected = formData.platform === platform.id;
          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, platform: platform.id })}
              className={cn(
                "relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col items-center text-center group h-44 sm:h-52 overflow-hidden",
                isSelected 
                  ? "bg-brand-gold/10 border-brand-gold shadow-[0_0_30px_rgba(197,160,89,0.2)]" 
                  : "bg-neutral-900/40 border-white/5 backdrop-blur-md hover:border-white/20"
              )}
            >
              {isSelected && (
                 <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center">
                    <Check size={12} strokeWidth={4} className="text-black" />
                 </div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500",
                isSelected ? "text-brand-gold" : "text-neutral-600 group-hover:text-neutral-400"
              )}>
                <platform.icon size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className={cn(
                "text-lg font-bold transition-colors uppercase tracking-tight",
                isSelected ? "text-white" : "text-neutral-400 group-hover:text-white"
              )}>
                {platform.name}
              </h3>
              
              <p className="mt-2 text-[10px] text-neutral-600 font-medium leading-tight">
                {platform.description}
              </p>

              {/* Selection Glow */}
              {isSelected && (
                <motion.div 
                   layoutId="card-glow"
                   className="absolute inset-0 bg-brand-gold/5 pointer-events-none"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Genre Section */}
      <div className="w-full flex flex-col items-center">
        <h4 className="text-neutral-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
          Set Narrative Tone
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          {GENRES.map((genre) => {
            const isSelected = formData.genres.includes(genre);
            return (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(genre)}
                className={cn(
                  "px-6 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 uppercase tracking-widest",
                  isSelected 
                    ? "border-brand-gold bg-gradient-to-r from-brand-gold to-[#D4B57A] text-black shadow-lg shadow-brand-gold/10" 
                    : "border-white/10 bg-neutral-900/60 text-neutral-500 hover:border-white/20 hover:text-white"
                )}
              >
                {genre}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Spec Sliders Section */}
      <AnimatePresence>
        {formData.platform && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-2xl mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12"
          >
            <RangeSlider
              label="Episodes"
              value={formData.episodes}
              min={1}
              max={formData.platform === "novel" ? 200 : 50}
              unit="부작"
              onChange={(v) => setFormData({ ...formData, episodes: v })}
            />
            <RangeSlider
              label="Duration"
              value={formData.duration}
              min={1}
              max={formData.platform === "movie" ? 180 : 90}
              unit="분"
              onChange={(v) => setFormData({ ...formData, duration: v })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
