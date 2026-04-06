"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  className?: string;
}

export function RangeSlider({ label, value, min, max, unit, onChange, className }: RangeSliderProps) {
  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em]">
          {label}
        </span>
        <div className="flex items-baseline space-x-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-black text-brand-gold tracking-tighter"
            >
              {value}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-bold text-neutral-400">{unit}</span>
        </div>
      </div>

      <div className="relative group/slider w-full h-6 flex items-center">
        {/* Track Base */}
        <div className="absolute w-full h-1 bg-neutral-900 rounded-full" />
        
        {/* Active Fill */}
        <div 
          className="absolute h-1 bg-brand-gold rounded-full transition-all duration-300"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />

        {/* Input Range (Invisible but Functional) */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Custom Thumb (Visual Only) */}
        <div 
          className="absolute w-5 h-5 bg-brand-gold rounded-full border-4 border-neutral-950 shadow-[0_0_15px_rgba(197,160,89,0.4)] pointer-events-none z-10 transition-transform group-hover/slider:scale-110"
          style={{ 
            left: `calc(${((value - min) / (max - min)) * 100}% - 10px)` 
          }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-[1px]" />
        </div>
      </div>
    </div>
  );
}
