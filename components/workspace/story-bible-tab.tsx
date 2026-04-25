import { useState, useMemo, useRef, useEffect } from "react";
import { Loader2, User, RefreshCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterNarrativeCard } from "./character-narrative-card";
import { CharacterEditForm } from "./character-edit-form";
import { NexusGraph } from "./nexus-graph";
import type { Project } from "./types";
import { cn } from "@/lib/utils";

interface StoryBibleTabProps {
  project: Project;
  metadata: any;
  isSynopsisReady: boolean;
  isCharactersReady: boolean;
  onUpdateCharacter: (charId: string, updates: any) => Promise<any>;
  onRegenerate: (prompt?: string) => void;
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
  const [nexusSelectedId, setNexusSelectedId] = useState<string | null>(null);
  const [steerPrompt, setSteerPrompt] = useState("");
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

  // When a nexus node is selected, sync the carousel to that character
  const handleNexusSelect = (id: string | null) => {
    setNexusSelectedId(id);
    if (!id) return;
    const idx = characters.findIndex((c) => c.id === id);
    if (idx !== -1) setActiveIndex(idx);
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
                        <div className="mt-8 text-[16px] text-text-secondary leading-[1.75] max-w-[65ch] whitespace-pre-wrap font-sans">
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

              {/* NARRATIVE CONFLICT DIMENSIONS (Moved from bottom) */}
              <div className="space-y-6 pt-12 border-t border-white/5">
                <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-30">Conflict Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(metadata?.story?.narrativeConflicts || [
                    { type: "내적 갈등", description: metadata?.story?.conflicts?.internal || "정체성과 욕망의 충돌" },
                    { type: "외적 갈등", description: metadata?.story?.conflicts?.external || "사회 시스템과의 대립" },
                    { type: "사회적 갈등", description: metadata?.story?.conflicts?.social || "계급간의 보이지 않는 벽" }
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="bg-bg-secondary/60 border border-white/5 p-6 rounded-[16px] group hover:border-brand-gold/20 transition-all">
                      <p className="text-[9px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-3">{item.type}</p>
                      <p className="text-sm font-bold text-text-primary leading-snug italic line-clamp-2">"{item.description}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI RECONSTRUCTION CHAT (Replaces old card) */}
              <div className="mt-12 p-1 bg-bg-secondary/40 border border-white/5 rounded-[32px] overflow-hidden focus-within:border-brand-gold/30 transition-all shadow-2xl">
                <div className="p-8 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                      <RefreshCcw size={14} className="text-brand-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] opacity-60">Architectural Override</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Reconstruct Story Bible</h4>
                    </div>
                  </div>
                  <textarea 
                    value={steerPrompt}
                    onChange={(e) => setSteerPrompt(e.target.value)}
                    placeholder="예: '주인공의 성격을 더 냉소적으로 바꿔줘' 혹은 '결말을 비극으로 변경해서 다시 써줘'..."
                    className="w-full bg-transparent border-none text-text-primary text-[14px] leading-relaxed placeholder:text-text-tertiary/40 resize-none outline-none min-h-[80px] font-sans"
                  />
                </div>
                <div className="bg-white/[0.02] px-8 py-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-brand-gold opacity-40" />
                    <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Steerable Regeneration Mode</span>
                  </div>
                  <button 
                    onClick={() => {
                      onRegenerate(steerPrompt);
                      setSteerPrompt("");
                    }}
                    disabled={isStreaming}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Send Protocol
                  </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-y-[40px]">
          <div className="sticky top-24 space-y-[40px] w-full">
            <NexusGraph
              characters={characters}
              selectedId={nexusSelectedId}
              onSelectId={handleNexusSelect}
            />

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
                  {characters.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500 cursor-pointer hover:opacity-100",
                        activeIndex === i ? "w-8 bg-brand-gold" : "w-2 bg-white/10 hover:bg-white/30"
                      )}
                    />
                  ))}
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
    </div>
  );
}
