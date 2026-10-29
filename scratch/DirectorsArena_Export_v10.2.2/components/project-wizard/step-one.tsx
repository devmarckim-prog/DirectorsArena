import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Monitor, Film, Smartphone, BookOpen, Check } from "lucide-react";
import { RangeSlider } from "@/components/ui/range-slider";
import { CircularProgress } from "@/components/ui/circular-progress";

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

const SPEC_DEFAULTS: Record<string, { eps: number; dur: number }> = {
  movie: { eps: 1, dur: 120 },
  ott: { eps: 6, dur: 60 },
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

  const selectionCount = formData.platform ? 1 : 0;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full mb-4">
        <div className="text-left">
          <motion.h2 
            className="text-3xl sm:text-5xl font-black text-white mb-1 tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            당신의 스토리 설계를<br />시작해 볼께요?
          </motion.h2>
          <p className="text-neutral-500 font-medium tracking-wide uppercase text-xs sm:text-sm">
            Select Your Canvas
          </p>
        </div>
      </div>

      {/* Manuscript Container Area */}
      <div className="relative w-full p-4 sm:p-6 rounded-3xl bg-neutral-900/20 border border-white/5 backdrop-blur-xl group overflow-hidden shadow-2xl">
        {/* Manuscript Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 transition-opacity group-hover:opacity-20"
          style={{ 
            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #C5A059 32px)",
            backgroundSize: "100% 32px",
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Platform Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {PLATFORMS.map((platform) => {
              const isSelected = formData.platform === platform.id;
              return (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, platform: platform.id })}
                  className={cn(
                    "relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col items-center text-center group h-28 sm:h-34 overflow-hidden justify-center",
                    isSelected 
                      ? "bg-brand-gold/10 border-brand-gold shadow-[0_0_30px_rgba(197,160,89,0.2)]" 
                      : "bg-black/40 border-white/5 backdrop-blur-md hover:border-white/20"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-gold flex items-center justify-center">
                        <Check size={11} strokeWidth={4} className="text-black" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 transition-all duration-500",
                    isSelected ? "text-brand-gold" : "text-neutral-600 group-hover:text-neutral-400"
                  )}>
                    <platform.icon size={22} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className={cn(
                    "text-sm sm:text-base font-bold transition-colors uppercase tracking-tight",
                    isSelected ? "text-white" : "text-neutral-400 group-hover:text-white"
                  )}>
                    {platform.name}
                  </h3>
                  
                  <p className="mt-1 text-[9px] sm:text-[10px] text-neutral-600 font-medium leading-tight line-clamp-1">
                    {platform.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Spec Sliders Section */}
      <AnimatePresence>
        {formData.platform && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full mt-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 bg-neutral-900/30 p-5 sm:p-6 rounded-[28px] border border-white/10 shadow-xl"
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
