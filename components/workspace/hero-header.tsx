"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project } from "./types";

interface HeroHeaderProps {
  project: Project;
  metadata: any;
  masterMode: 'SCENARIO' | 'PRODUCTION';
  scenarioTab: string;
  setScenarioTab: (tab: any) => void;
  productionTab: string;
  setProductionTab: (tab: any) => void;
}

export function HeroHeader({
  project,
  metadata,
  masterMode,
  scenarioTab,
  setScenarioTab,
  productionTab,
  setProductionTab
}: HeroHeaderProps) {
  // v3.16 Dynamic Title Splitting
  const safeTitle = project.title || "Untitled Project";
  const titleParts = safeTitle.split(/[()]/);
  const mainTitle = titleParts[0].trim();
  const subTitle = titleParts[1] ? titleParts[1].trim() : (project.subtitle?.replace(/[()]/g, '') || safeTitle.toUpperCase());

  // v6.20 Dynamic Theme Logic (Cyberpunk/Noir Optimization)
  const isCyberpunk = project.world?.toLowerCase().includes('cyberpunk') || project.genre?.toLowerCase().includes('cyberpunk');
  const themeShadow = isCyberpunk 
    ? '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)'
    : '0 0 40px rgba(197, 160, 89, 0.4), 0 0 80px rgba(197, 160, 89, 0.1)';
  const glowColor = isCyberpunk ? 'bg-cyan-500/[0.08]' : 'bg-brand-gold/[0.05]';

  return (
    <header className="sticky top-24 z-40 bg-[#050505] pt-4 pb-2 flex flex-col items-center w-full backdrop-blur-3xl">
      {/* 2.0 PROTOCOL BADGES (Dynamic Binding v4.5) */}
      <div className="flex justify-center items-center gap-2 mb-1 animate-in fade-in slide-in-from-top-4 duration-1000 scale-90 md:scale-100 origin-center w-full">
        <div className="px-2 py-[2px] border border-brand-gold/40 bg-brand-gold/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-brand-gold uppercase tracking-[0.2em] leading-none mt-[1px]">{project.platform}</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.genre}</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.episodes?.length || project.episode_count} EPS</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.duration} MIN</span>
        </div>
      </div>

      {/* 2.1 TITANIC MAIN TITLE (Universal Mapping v4.5) */}
      <div className="relative mb-1 text-center flex flex-col items-center justify-center w-full">
        {/* KR MAIN: Cinematic Serif w/ Intensive Glow */}
        <motion.h1 
          animate={{
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "text-3xl md:text-[68px] font-black italic font-serif uppercase tracking-tighter text-white leading-none relative z-10",
            "text-center px-6 md:px-0"
          )}
          style={{ 
            textShadow: themeShadow
          }}
        >
          {mainTitle}
        </motion.h1>

        {/* EN SUB: Data Bound to Subtitle 필드 */}
        <span className="text-[12px] md:text-[13px] font-black text-brand-gold uppercase tracking-[1em] md:tracking-[1.25em] mt-2 ml-[1em] md:ml-[1.25em] opacity-80">
          {project.subtitle || subTitle}
        </span>

        {/* Cinematic Ambient Glow */}
        <div className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 blur-[150px] h-48 w-[120%] rounded-full pointer-events-none -z-10",
          glowColor
        )} />
      </div>

      {/* 3. NAVIGATION (mt-16 Integration) */}
      <nav className="flex justify-center gap-14 border-b border-white/5 w-full pb-2 mt-[16px] overflow-x-auto no-scrollbar relative z-20">
        {(masterMode === 'SCENARIO' ? [
          { id: 'BIBLE', label: 'Bible' },
          { id: 'SIMILAR', label: 'Similar Works' },
          { id: 'NAVIGATOR', label: 'Beat Sheet' }
        ] : [
          { id: 'CASTING', label: 'Casting' },
          { id: 'BUDGET', label: 'Budget' },
          { id: 'BREAKDOWN', label: 'Breakdown' },
          { id: 'PPL', label: 'PPL' }
        ]).map(tab => {
          const isActive = masterMode === 'SCENARIO' ? scenarioTab === tab.id : productionTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (masterMode === 'SCENARIO') setScenarioTab(tab.id as any);
                else setProductionTab(tab.id as any);
              }}
              className={cn(
                "relative text-[13px] font-medium uppercase tracking-[0.15em] pb-3 transition-all duration-300 font-mono",
                isActive ? "text-brand-gold" : "text-text-tertiary hover:text-white"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.4)]" 
                />
              )}
            </button>
          );
      })}
    </nav>
  </header>
);
}
