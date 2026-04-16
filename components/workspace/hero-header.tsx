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
  const titleParts = project.title.split(/[()]/);
  const mainTitle = titleParts[0].trim();
  const subTitle = titleParts[1] ? titleParts[1].trim() : (project.subtitle?.replace(/[()]/g, '') || project.title.toUpperCase());

  return (
    <header className="sticky top-24 z-40 bg-[#050505] pt-12 pb-4 flex flex-col items-center w-full backdrop-blur-3xl">
      {/* 2.0 PROTOCOL BADGES (Dynamic Binding v3.0) */}
      <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="px-4 py-1.5 border border-[#EAB308]/40 bg-[#EAB308]/5 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-black text-[#EAB308] uppercase tracking-[0.2em]">{project.version || "BUILD V3.3.2"}</span>
        </div>
        <div className="px-4 py-1.5 border border-[#71717A]/40 bg-[#18181B]/80 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-black text-[#71717A] uppercase tracking-[0.2em]">{project.buildId ? `Series Protocol ${project.buildId}` : "Series Protocol v1.02"}</span>
        </div>
      </div>

      {/* 2.1 TITANIC MAIN TITLE (Universal Mapping v3.16) */}
      <div className="relative mb-4 text-center flex flex-col items-center">
        {/* KR MAIN: text-[110px] font-black w/ Intensive Glow */}
        <h1 
          className="text-[110px] font-black uppercase tracking-tighter text-white leading-none relative z-10"
          style={{ 
            textShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.2)' 
          }}
        >
          {mainTitle}
        </h1>

        {/* EN SUB: Restored Gold + Tracking */}
        <span className="text-[20px] font-black text-[#EAB308] uppercase tracking-[1.5em] mt-8 ml-[1.5em]">
          {subTitle}
        </span>

        {/* Cinematic Ambient Glow */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-white/[0.07] blur-[150px] h-48 w-[120%] rounded-full pointer-events-none -z-10" />
      </div>

      {/* 3. NAVIGATION (mt-16 Integration) */}
      <nav className="flex justify-center gap-14 border-b border-white/5 w-full pb-2 mt-[16px] overflow-x-auto no-scrollbar relative z-20">
        {(masterMode === 'SCENARIO' ? [
          { id: 'BIBLE', label: 'Story Bible' },
          { id: 'SIMILAR', label: 'Comps' },
          { id: 'NAVIGATOR', label: 'Navigator' }
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
                "relative text-sm font-black uppercase tracking-[0.35em] pb-3 transition-all duration-300",
                isActive ? "text-white" : "text-[#71717A] hover:text-white"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#EAB308] shadow-[0_0_10px_rgba(234,179,8,0.4)]" 
                />
              )}
            </button>
          );
      })}
    </nav>
  </header>
);
}
