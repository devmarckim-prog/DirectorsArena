import { useState, useMemo, useRef, useEffect } from "react";
import { Loader2, User, Shield, Users, RefreshCcw, Edit3, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterNarrativeCard } from "./character-narrative-card";
import { CharacterEditForm } from "./character-edit-form";
import type { Project } from "./types";
import { cn } from "@/lib/utils";

interface StoryBibleTabProps {
  project: Project;
  metadata: any;
  isSynopsisReady: boolean;
  isCharactersReady: boolean;
  onUpdateCharacter: (charId: string, updates: any) => Promise<any>;
  onRegenerate: () => void;
  isStreaming?: boolean;
}

export function StoryBibleTab({ 
  project, 
  metadata, 
  isSynopsisReady, 
  isCharactersReady,
  onUpdateCharacter,
  onRegenerate,
  isStreaming
}: StoryBibleTabProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const characters = useMemo(() => {
    const metaChars = metadata?.characters || metadata?.formData?.characters || [];
    const dbChars = project.characters || [];
    
    const charMap = new Map();
    [...dbChars, ...metaChars].forEach(c => {
      if (c && c.name && !charMap.has(c.name)) {
        charMap.set(c.name, c);
      }
    });
    
    return Array.from(charMap.values());
  }, [metadata?.characters, project.characters]);

  useEffect(() => {
    if (carouselRef.current) {
      const activeCard = carouselRef.current.children[activeIndex] as HTMLElement;
      if (activeCard) {
        carouselRef.current.scrollTo({
          left: activeCard.offsetLeft - 20,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex, characters.length]);

  const layoutData = useMemo(() => {
    const total = characters.length;
    if (total === 0) return { positions: [], groupCenters: {}, numGroups: 0 };
    
    const centerX = 400; 
    const centerY = 300; 
    
    const allGroups = new Set<string>();
    characters.forEach(char => {
      const gList = char.groups || [char.group || "Independent"];
      gList.forEach((g: string) => allGroups.add(g));
    });

    const uniqueGroups = Array.from(allGroups);
    const numGroups = uniqueGroups.length;
    const zoneRadius = numGroups <= 1 ? 0 : 280; 

    const groupCenters: Record<string, { x: number, y: number }> = {};
    uniqueGroups.forEach((name, idx) => {
      const angle = (idx * (360 / numGroups)) * (Math.PI / 180);
      groupCenters[name] = {
        x: centerX + zoneRadius * Math.cos(angle - Math.PI/2),
        y: centerY + zoneRadius * Math.sin(angle - Math.PI/2)
      };
    });

    const overlapCounts: Record<string, number> = {};
    const positions = characters.map((char, i) => {
      const gList = char.groups || [char.group || "Independent"];
      const groupSetKey = [...gList].sort().join("|");
      
      if (!overlapCounts[groupSetKey]) overlapCounts[groupSetKey] = 0;
      const indexInGroupSet = overlapCounts[groupSetKey]++;

      let sumX = 0;
      let sumY = 0;
      gList.forEach((g: string) => {
        const center = groupCenters[g];
        sumX += center.x;
        sumY += center.y;
      });

      const avgX = sumX / gList.length;
      const avgY = sumY / gList.length;
      const spreadRadiusX = (numGroups === 1) ? 320 : (gList.length > 1 ? 80 : 180); 
      const spreadRadiusY = (numGroups === 1) ? 230 : (gList.length > 1 ? 60 : 140); 
      const angle = (i * 137.5 + indexInGroupSet * 30) * (Math.PI / 180);
      
      return {
        x: avgX + spreadRadiusX * Math.cos(angle),
        y: avgY + spreadRadiusY * Math.sin(angle),
        groups: gList
      };
    });
    
    return { positions, groupCenters, numGroups };
  }, [characters]);

  const { positions, groupCenters } = layoutData;

  const getRelationColor = (type: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("romance") || t.includes("love")) return "#EC4899";
    if (t.includes("conflict") || t.includes("antagonist") || t.includes("enemy")) return "#EF4444";
    if (t.includes("ally") || t.includes("friend")) return "#C5A059";
    if (t.includes("mentor") || t.includes("teacher")) return "#3B82F6";
    return "#52525B";
  };

  return (
    <div className="space-y-16 pt-16 lg:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-6 flex flex-col">
          <div className="max-h-[800px] overflow-y-auto pr-8 custom-scrollbar-slim relative">
            <div className="space-y-8 pb-10">
              {/* Unified Narrative Rendering: Support both new AI generation and legacy sample formats */}
              {(() => {
                // epicNarrative 우선 추출 (raw JSON 노출 방지)
                const rawEpic = metadata?.story?.epicNarrative || metadata?.synopsis;
                let epicNarrative = typeof rawEpic === 'string' ? rawEpic : (rawEpic ? JSON.stringify(rawEpic) : null);
                
                // v8.1: Recursive JSON detection (AI가 JSON 문자열을 문자열로 응답하는 경우 대비)
                if (typeof epicNarrative === 'string' && epicNarrative.trim().startsWith('{')) {
                  try {
                    const nested = JSON.parse(epicNarrative);
                    epicNarrative = nested.synopsis || nested.story?.epicNarrative || nested.epicNarrative || epicNarrative;
                  } catch { /* ignore parsing errors */ }
                }

                const plainSynopsis = typeof project.synopsis === 'string' && !project.synopsis.trim().startsWith('{') ? project.synopsis : null;
                const narrativeText = epicNarrative || plainSynopsis;
                const logline = metadata?.story?.logline || metadata?.logline || project.logline || '';
                
                if (narrativeText) {
                  return (
                    <div className="flex gap-6 group">
                      <div className="w-[3px] h-auto bg-brand-gold shrink-0" />
                      <div className="flex flex-col">
                        {logline && (
                          <p className="text-brand-gold font-bold text-[22px] leading-snug tracking-tight mb-8">
                            "{logline}"
                          </p>
                        )}
                        <div className="mt-8 text-base text-zinc-300 leading-[1.7] whitespace-pre-wrap">
                          {narrativeText}
                        </div>
                      </div>
                    </div>
                  );
                }
                // 서사 없음: 로딩 / 빈 상태 표시
                return (
                  <div className="flex flex-col space-y-8 min-h-[400px] items-center justify-center">
                    <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center w-full">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="mb-6">
                        <Loader2 size={42} className="text-brand-gold" />
                      </motion.div>
                      <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-80 mb-4">
                        {isStreaming ? "Synthesizing Narrative Strands..." : "Architecting Narrative DNA..."}
                      </p>
                      <div className="flex items-center space-x-3 text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-8">
                        <span>{project.platform || "MOVIE"}</span>
                        <span className="opacity-20">•</span>
                        <span>{project.genre || "DRAMA"}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* UNIVERSAL DEV PULSE BAR (v6.3 Heartbeat) */}
              {(project.status === 'BAKING' || isStreaming) && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-12 pt-10 border-t border-white/5 space-y-5"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] opacity-40">Heartbeat Insight</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} className="text-brand-gold animate-pulse" />
                            OMA v6.3 Narrative Pulse
                          </h4>
                       </div>
                       <div className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                          <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Protocol: Raw_Vibe</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className={cn(
                          "p-4 rounded-2xl border transition-all duration-500",
                          project.progress >= 10 
                            ? "bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" 
                            : "bg-white/[0.02] border-white/5 opacity-30"
                       )}>
                          <div className="flex items-center gap-2 mb-2">
                             <div className={cn("w-2 h-2 rounded-full", project.progress >= 10 && "bg-green-500 animate-pulse")} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Phase 1: Ignition</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-medium">Model Handshake & Context Indexing</p>
                       </div>

                       <div className={cn(
                          "p-4 rounded-2xl border transition-all duration-500",
                          (project.progress > 10 || isStreaming) 
                            ? "bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" 
                            : "bg-white/[0.02] border-white/5 opacity-30"
                       )}>
                          <div className="flex items-center gap-2 mb-2">
                             <div className={cn("w-2 h-2 rounded-full", (project.progress > 10 || isStreaming) && "bg-green-500 animate-pulse")} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Phase 2: Streaming</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-medium">Receiving Narrative Fragments</p>
                       </div>
                    </div>
                    <p className="text-[7px] text-white/10 font-mono tracking-tighter italic text-left">
                       Protocol: Raw_Vibe_Protocol_Active | ID: {project.id}
                    </p>
                 </motion.div>
              )}
            </div>
          </div>

          <div className="mt-12 p-8 bg-brand-gold/[0.03] border border-brand-gold/10 rounded-[32px] group hover:border-brand-gold/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] opacity-60">System Reconstruction</span>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Regenerate Story Bible</h4>
              </div>
              <button 
                onClick={onRegenerate}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                <RefreshCcw size={14} />
                Reset & Regenerate
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-y-[40px]">
          <div className="sticky top-24 space-y-[40px] w-full">
            <div className="h-[600px] bg-black/40 border border-white/5 rounded-[48px] relative overflow-hidden group/map">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="-50 -100 900 800" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="node-glow-final"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <filter id="zone-glow"><feGaussianBlur stdDeviation="10" result="blur"/></filter>
                  </defs>

                  <g opacity="0.65">
                    {Object.entries(groupCenters).map(([name, center], i) => {
                      const color = ["#C5A059", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][i % 6];
                      const r = layoutData.numGroups <= 1 ? 260 : 170;
                      return (
                        <g key={name}>
                          <circle cx={center.x} cy={center.y} r={r} fill={color} fillOpacity="0.06" stroke={color} strokeWidth="1.5" strokeDasharray="6 4" filter="url(#zone-glow)"/>
                          <text x={center.x} y={center.y - (r + 25)} textAnchor="middle" className="text-[10px] font-black uppercase tracking-[0.6em] italic" fill={color}>{name}</text>
                        </g>
                      );
                    })}
                  </g>

                  <g opacity="0.4">
                    {characters.map((char, i) => (char.relations || []).map((rel: any, ri: number) => {
                      const targetIdx = characters.findIndex(c => c.name === rel.target);
                      if (targetIdx === -1) return null;
                      const s = positions[i];
                      const e = positions[targetIdx];
                      return (
                        <line key={`${i}-${ri}`} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke={getRelationColor(rel.type)} strokeWidth="1" strokeOpacity="0.4" />
                      );
                    }))}
                  </g>

                  {positions.map((pos, i) => (
                    <g key={i} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer" onClick={() => setActiveIndex(i)}>
                      <circle r={i === 0 ? 32 : (activeIndex === i ? 24 : 16)} fill={activeIndex === i ? "#C5A059" : "#111"} stroke={activeIndex === i ? "#C5A059" : "#333"} filter={activeIndex === i ? "url(#node-glow-final)" : ""} className="transition-all duration-500" />
                      <foreignObject x={i === 0 ? -12 : -10} y={i === 0 ? -12 : -10} width={i === 0 ? 24 : 20} height={i === 0 ? 24 : 20} className="pointer-events-none">
                        <User size={i === 0 ? 24 : 20} className={activeIndex === i ? "text-black" : "text-white/40"} />
                      </foreignObject>
                      <text y={i === 0 ? 54 : 42} textAnchor="middle" className={cn("text-[10px] font-black uppercase tracking-[0.2em]", activeIndex === i ? "fill-brand-gold" : "fill-white/20")}>{characters[i].name}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] opacity-80">Character Roster</h3>
              <div className="relative">
                <div ref={carouselRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 pb-4">
                  {characters.length > 0 ? characters.map((char, idx) => (
                    <CharacterNarrativeCard 
                      key={char.id || idx} 
                      character={char} 
                      isActive={activeIndex === idx} 
                      onUpdate={(updates) => onUpdateCharacter(char.id, updates)} 
                      onEditFullMode={() => setEditingCharId(char.id)} 
                      onSelect={() => setActiveIndex(idx)} 
                    />
                  )) : <div className="w-full py-10 text-center text-white/10 uppercase text-[10px] font-black border border-dashed border-white/5 rounded-3xl">등장인물 분석 중...</div>}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {characters.map((_, i) => <div key={i} className={cn("h-1 rounded-full transition-all duration-500", activeIndex === i ? "w-8 bg-brand-gold" : "w-2 bg-white/10")} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingCharId && (
          <CharacterEditForm 
            character={characters.find(c => c.id === editingCharId)} 
            onClose={() => setEditingCharId(null)} 
            onSave={(updates) => onUpdateCharacter(editingCharId, updates)} 
          />
        )}
      </AnimatePresence>

      <div className="space-y-6 pt-16 border-t border-white/5">
        <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] opacity-30 text-center">Narrative Conflict Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(metadata?.story?.narrativeConflicts || [
            { type: "내적 갈등", description: metadata?.story?.conflicts?.internal || "정체성과 욕망의 충돌" },
            { type: "외적 갈등", description: metadata?.story?.conflicts?.external || "사회 시스템과의 대립" },
            { type: "사회적 갈등", description: metadata?.story?.conflicts?.social || "계급간의 보이지 않는 벽" }
          ]).map((item: any, idx: number) => (
            <div key={idx} className="bg-[#18181B] border border-[#27272A] p-8 rounded-[12px]">
              <p className="text-[9px] font-black text-[#71717A] uppercase tracking-[0.4em] mb-4">{item.type}</p>
              <p className="text-lg font-black text-white uppercase tracking-tighter italic leading-tight">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
