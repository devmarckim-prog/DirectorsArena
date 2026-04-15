"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectGridSlot({ className }: { className?: string }) {
  return (
    <Link 
      href="/project-wizard" 
      className={cn("block w-full h-[520px] group relative overflow-hidden", className)}
    >
      <div className="w-full h-full rounded-3xl border border-white/5 bg-neutral-950/20 backdrop-blur-3xl hover:border-brand-gold/40 hover:bg-brand-gold/[0.03] transition-all duration-700 flex flex-col items-center justify-center space-y-8 relative z-10">
        {/* Animated Corner Accents */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/10 group-hover:border-brand-gold/60 transition-all duration-700" />
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/10 group-hover:border-brand-gold/60 transition-all duration-700" />

        <div className="w-20 h-20 rounded-full border border-white/5 bg-black flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 rounded-full border border-brand-gold/0 group-hover:border-brand-gold/30 animate-pulse" />
          <Plus 
            size={28} 
            className="text-neutral-700 group-hover:text-brand-gold transition-colors duration-700" 
          />
        </div>
        
        <div className="text-center space-y-2">
          <span className="text-white font-black tracking-[0.5em] group-hover:text-brand-gold text-[10px] uppercase transition-colors duration-700 block">
            New Project
          </span>
          <span className="text-neutral-600 text-[9px] font-bold uppercase tracking-widest block group-hover:text-neutral-400 transition-colors duration-700">
            Initialize Narrative Node
          </span>
        </div>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/[0.01] transition-all duration-700" />
    </Link>
  );
}
