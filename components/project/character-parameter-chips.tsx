"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParameterChipProps {
  label: string;
  value: string;
  color?: string;
}

export function ParameterChip({ label, value, color = "#C5A059" }: ParameterChipProps) {
  return (
    <div className="flex flex-col gap-1.5 group/chip">
      <span className="text-[7px] font-black text-white/30 tracking-[0.3em] uppercase group-hover/chip:text-brand-gold transition-colors">{label}</span>
      <div 
        className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover/chip:bg-white/[0.06] group-hover/chip:border-brand-gold/20"
        style={{ boxShadow: `0 0 15px ${color}05` }}
      >
        <span className="text-[10px] font-black text-white/90 uppercase tracking-wider">{value}</span>
      </div>
    </div>
  );
}

interface StatBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
}

export function StatBar({ label, value, color = "#C5A059" }: StatBarProps) {
  return (
    <div className="space-y-2 group/stat">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] group-hover/stat:text-brand-gold/60 transition-colors">{label}</span>
        <span className="text-[9px] font-black text-white uppercase tracking-widest">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 2, ease: "circOut" }}
          className="h-full rounded-full relative z-10"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}60`
          }}
        />
        {/* Ghost Track for depth */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      </div>
    </div>
  );
}
