"use client";

import { motion } from "framer-motion";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";

interface StepTwoProps {
  formData: {
    logline: string;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

export function StepTwo({ formData, setFormData, onNext }: StepTwoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 150);
    setFormData((prev: any) => ({ ...prev, logline: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formData.logline.length >= 1) {
        onNext();
      }
    }
    if (e.key === "Escape") {
      // The global listener in page.tsx will handle it if we don't consume it,
      // but explicitly adding it here for focus clarity.
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-end mb-12">
        <div className="text-left">
          <motion.h2 
            className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            당신의 이야기를 관통하는<br />단 한 문장은 무엇입니까?
          </motion.h2>
          <p className="text-neutral-500 font-medium tracking-wide uppercase text-sm">
            Craft Your Core Narrative Seed (Logline)
          </p>
        </div>
        <div className="pb-2">
          <CircularProgress currentCount={formData.logline.length} maxCount={150} size={56} strokeWidth={4} />
        </div>
      </div>

      {/* Manuscript Editor Area */}
      <div className="relative w-full p-8 sm:p-12 rounded-3xl bg-neutral-900/20 border border-white/5 backdrop-blur-xl group overflow-hidden shadow-2xl">
        {/* Manuscript Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 transition-opacity group-focus-within:opacity-40"
          style={{ 
            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #C5A059 32px)",
            backgroundSize: "100% 32px",
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
          }}
        />

        <textarea
          autoFocus
          value={formData.logline}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="예: 1945년 경성, 실험실에서 탈출한 괴물보다 더 무서운 인간들의 욕망."
          className={cn(
            "w-full h-48 bg-transparent border-none outline-none resize-none relative z-10",
            "text-2xl sm:text-3xl font-serif text-brand-gold placeholder:text-neutral-800 leading-[32px] tracking-tight",
            "selection:bg-brand-gold/20 selection:text-white"
          )}
          style={{ 
            lineHeight: "32px",
            paddingTop: "2px" // Alignment tweak for lines
          }}
        />

        {/* Cinematic Particles (Optional subtle effect) */}
        <div className="absolute bottom-4 right-8 text-[10px] text-neutral-700 font-black uppercase tracking-[0.4em] italic pointer-events-none">
          Drafting Vision...
        </div>
      </div>
      
      <div className="mt-8 w-full flex justify-end">
        <p className={cn(
          "text-[11px] font-bold uppercase tracking-widest transition-colors",
          formData.logline.length >= 1 ? "text-brand-gold/60" : "text-neutral-700"
        )}>
          {formData.logline.length < 1 
            ? "당신의 이야기를 관통하는 단 한 문장은 무엇입니까?" 
            : "Vision threshold met. Press Enter to proceed."
          }
        </p>
      </div>
    </div>
  );
}
