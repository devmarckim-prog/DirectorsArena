"use client";

import { Loader2, User, Shield, Users } from "lucide-react";
import { SoulsNexus } from "@/components/project-list/souls-nexus";
import type { Project } from "./types";
import { cn } from "@/lib/utils";

interface StoryBibleTabProps {
  project: Project;
  metadata: any;
  isSynopsisReady: boolean;
  isCharactersReady: boolean;
}

export function StoryBibleTab({ 
  project, 
  metadata, 
  isSynopsisReady, 
  isCharactersReady 
}: StoryBibleTabProps) {
  return (
    <div className="space-y-16">
      {metadata?.isSeed ? (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
          <Loader2 size={48} className="text-brand-gold animate-spin mb-6" />
          <p className="text-xs font-black uppercase tracking-[0.5em] text-neutral-600">Architecting Narrative DNA...</p>
        </div>
      ) : (
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* [ARCHITECTURE 4] NAKED TYPOGRAPHY (LEFT: Synopsis) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#EAB308] font-black text-xl">❊</span>
                <h3 className="text-[10px] font-black text-[#EAB308] uppercase tracking-[0.5em] opacity-80">Story Protocol</h3>
              </div>
              
              {/* [SCROLLABLE NARRATIVE CONTAINER (v3.4 Universal Mapping)] */}
              <div className="max-h-[700px] overflow-y-auto pr-8 custom-scrollbar-slim relative">
                <div className="space-y-8 pb-10">
                  {metadata?.story?.epicNarrative ? (
                    <div className="flex gap-6 group">
                      {/* Gold Paragraph Marker */}
                      <div className="w-[3px] h-auto bg-[#EAB308] shrink-0" />
                      
                      <div className="flex flex-col">
                        {/* 2.0 YELLOW LOGLINE (Explicit Binding v4.3: Font -8px aggressive) */}
                        <p className="text-[#FACC15] font-bold not-italic text-[16px] lg:text-[22px] leading-snug tracking-tight mb-8">
                          "{metadata.story.logline || project.logline}"
                        </p>

                        {/* 2.1 WHITE SYNOPSIS BODY (v3.4 Strict Binding: mt-8, leading-[1.7]) */}
                        <div className="mt-8 text-base text-zinc-300 leading-[1.7] whitespace-pre-wrap">
                          {metadata.story.epicNarrative}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-6">
                      <div className="w-[6px] h-24 bg-[#EAB308]" />
                      <p className="text-[#FACC15] font-bold not-italic text-[16px] lg:text-[22px] leading-snug">
                        "{metadata?.story?.logline || project.logline}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* [ARCHITECTURE 5] CHARACTER & NETWORK ANALYSIS (RIGHT: Stacked) */}
            <div className="lg:col-span-5 flex flex-col gap-y-[24px]">
              {/* 1. 01. CHARACTER NETWORK */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EAB308] font-black text-lg">❊</span>
                    <h3 className="text-[10px] font-black text-[#EAB308] uppercase tracking-[0.5em] opacity-80">Character Network</h3>
                  </div>
                  <span className="text-[7px] font-black text-[#71717A] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Interactive Graph</span>
                </div>
                <div className="h-64 bg-[#18181B] border border-[#27272A] rounded-[12px] relative overflow-hidden group hover:border-[#EAB308]/30 transition-all flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col items-center space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-full border border-[#EAB308]/30 flex items-center justify-center bg-[#EAB308]/5">
                      <User size={20} className="text-[#EAB308]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-white uppercase tracking-[0.4em] mb-1">Network Mapping...</p>
                      <p className="text-[8px] font-bold text-[#71717A] uppercase tracking-widest">Architecting Narrative Relationships</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THE SOUL ROSTER */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#EAB308] font-black text-lg">❊</span>
                  <h3 className="text-[10px] font-black text-[#EAB308] uppercase tracking-[0.5em] opacity-80">Protagonist Roster</h3>
                </div>
                <div className="bg-[#18181B] border border-[#27272A] rounded-[12px] p-8 space-y-6">
                  {/* v3.16 Universal Character Mapping: metadata.characters OR project.characters fallback */}
                  {((metadata?.characters?.length > 0) || (project?.characters?.length > 0)) ? (
                    (metadata?.characters || project.characters).map((char: any, idx: number) => (
                      <div key={idx} className="group relative border-b border-[#27272A] last:border-0 pb-6 last:pb-0 hover:border-[#EAB308]/30 transition-all">
                        <div className="flex items-start justify-between mb-3">
                           <div>
                              <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{char.name}</h4>
                              <p className="text-[9px] font-black text-[#EAB308] uppercase tracking-[0.3em] mt-2">{char.role}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-[#71717A] group-hover:text-[#EAB308] transition-all">
                              <Shield size={14} />
                           </div>
                        </div>
                        <p className="text-[11px] text-[#71717A] font-medium leading-relaxed line-clamp-2 group-hover:text-neutral-300 transition-colors italic">
                          {char.trait || char.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-20">
                      <Users size={32} className="mx-auto mb-4" />
                      <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Sync</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* [ARCHITECTURE 6] NARRATIVE CONFLICTS (DYNAMIC MAPPING v3.4) */}
          <div className="space-y-6 pt-16 border-t border-white/5">
            <h3 className="text-[10px] font-black text-[#EAB308] uppercase tracking-[0.5em] opacity-30 text-center">Narrative Conflict Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(metadata?.story?.narrativeConflicts || [
                { type: "Internal", description: metadata?.story?.conflicts?.internal || "Duality & Identity" },
                { type: "External", description: metadata?.story?.conflicts?.external || "Institutional Authority" },
                { type: "Social", description: metadata?.story?.conflicts?.social || "Systemic Decay" }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="bg-[#18181B] border border-[#27272A] p-8 rounded-[12px] group hover:border-[#EAB308]/30 transition-all">
                  <p className="text-[9px] font-black text-[#71717A] uppercase tracking-[0.4em] mb-4 group-hover:text-[#EAB308] transition-colors">{item.type}</p>
                  <p className="text-lg font-black text-white uppercase tracking-tighter italic leading-tight">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
