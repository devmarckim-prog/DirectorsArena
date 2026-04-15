"use client";

import { ArrowLeft, Scroll, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRailProps {
  masterMode: 'SCENARIO' | 'PRODUCTION';
  setMasterMode: (mode: 'SCENARIO' | 'PRODUCTION') => void;
  onBackToSlate: () => void;
}

export function SidebarRail({ masterMode, setMasterMode, onBackToSlate }: SidebarRailProps) {
  return (
    <aside className="w-20 h-screen fixed top-0 left-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-10 z-50">
      <div className="mb-12">
        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
          <span className="text-brand-gold font-black text-xs italic">D</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center space-y-8">
        <button 
          onClick={onBackToSlate}
          className="p-3 text-neutral-600 hover:text-white transition-all transform hover:scale-110"
          title="Return to Slate"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-8 h-px bg-white/5" />

        <button
          onClick={() => setMasterMode('SCENARIO')}
          className={cn(
            "p-4 rounded-2xl transition-all duration-500",
            masterMode === 'SCENARIO' ? "bg-brand-gold/20 text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]" : "text-neutral-600 hover:text-neutral-400"
          )}
          title="Scenario Mode"
        >
          <Scroll size={22} />
        </button>

        <button
          onClick={() => setMasterMode('PRODUCTION')}
          className={cn(
            "p-4 rounded-2xl transition-all duration-500",
            masterMode === 'PRODUCTION' ? "bg-brand-gold/20 text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]" : "text-neutral-600 hover:text-neutral-400"
          )}
          title="Production Mode"
        >
          <Activity size={22} />
        </button>
      </div>

      <div className="pb-8">
        <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,0.5)] animate-pulse" />
      </div>
    </aside>
  );
}
