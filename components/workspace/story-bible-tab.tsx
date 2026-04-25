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

  const majorCharacters = useMemo(() => {
    return characters.filter(c => (c.importance || 0) >= 7).slice(0, 8);
  }, [characters]);

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
    if (idx !== -1) {
      setActiveIndex(idx);
      // Double check scroll sync
      setTimeout(() => {
        if (carouselRef.current) {
          const activeCard = carouselRef.current.children[idx] as HTMLElement;
          if (activeCard) {
            carouselRef.current.scrollTo({
              left: activeCard.offsetLeft - 20,
              behavior: 'smooth'
            });
          }
        }
      }, 50);
    }
  };

  return (
    <div className="space-y-12 pt-16 lg:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-6 flex flex-col">
          <div className="max-h-[800px] overflow-y-auto pr-8 custom-scrollbar-slim relative">
            <div className="space-y-8 pb-6">
              {/* Unified Narrative Rendering */}
              {(() => {
                const rawEpic = metadata?.story?.epicNarrative || metadata?.synopsis;
                let epicNarrative = typeof rawEpic === 'string' ? rawEpic : (rawEpic ? JSON.stringify(rawEpic) : null);
                
                if (typeof epicNarrative === 'string' && epicNarrative.trim().startsWith('{')) {
                  try {
                    const nested = JSON.parse(epicNarrative);
                    epicNarrative = nested.synopsis || nested.story?.epicNarrative || nested.epicNarrative || epicNarrative;
                  } catch { /* ignore */ }
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
                          <p className="font-cinematic-serif text-[24px] leading-snug tracking-tight mb-4 italic opacity-90">
                            "{logline}"
                          </p>
                        )}
                        <div className="text-[16px] text-text-secondary leading-[1.75] max-w-[65ch] whitespace-pre-wrap font-sans">
                          {narrativeText}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col space-y-8 min-h-[400px] items-center justify-center">
                    <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center w-full">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="mb-6">
                        <Loader2 size={42} className="text-brand-gold" />
                      </motion.div>
                      <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-80 mb-4">
                        {isStreaming ? "Synthesizing Narrative Strands..." : "Architecting Narrative DNA..."}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* UNIVERSAL DEV PULSE BAR */}
              {(project.status === 'BAKING' || isStreaming) && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-8 pt-8 border-t border-white/5 space-y-5"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] opacity-40">Heartbeat Insight</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} className="text-brand-gold animate-pulse" />
                            OMA v6.3 Narrative Pulse
                          </h4>
                       </div>
                    </div>
                 </motion.div>
              )}
            </div>
          </div>

          {/* NARRATIVE CONFLICT DIMENSIONS (Wide/Long Cards) */}
          <div className="space-y-4 pt-12 border-t border-white/5">
            <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-30 mb-4">Conflict Dimensions</h3>
            <div className="space-y-3">
              {(metadata?.story?.narrativeConflicts || [
                { type: "내적 갈등", description: metadata?.story?.conflicts?.internal || "정체성과 욕망의 충돌" },
                { type: "외적 갈등", description: metadata?.story?.conflicts?.external || "사회 시스템과의 대립" },
                { type: "사회적 갈등", description: metadata?.story?.conflicts?.social || "계급간의 보이지 않는 벽" }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="bg-bg-secondary/40 border border-white/5 p-5 rounded-[12px] flex items-center gap-6 group hover:border-brand-gold/20 transition-all">
                  <span className="w-24 shrink-0 text-[10px] font-mono font-bold text-brand-gold/60 uppercase tracking-widest">{item.type}</span>
                  <p className="text-sm font-medium text-text-primary leading-snug italic border-l border-white/10 pl-6">"{item.description}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* SIMPLIFIED AI RECONSTRUCTION CHAT */}
          <div className="mt-12 p-1 bg-white/[0.03] border border-white/10 rounded-[24px] focus-within:border-brand-gold/30 transition-all">
            <div className="flex items-center gap-4 px-6 py-4">
              <textarea 
                value={steerPrompt}
                onChange={(e) => setSteerPrompt(e.target.value)}
                placeholder="작품의 서사 방향이나 설정을 변경하려면 여기에 입력하세요..."
                className="flex-1 bg-transparent border-none text-text-primary text-[14px] leading-relaxed placeholder:text-text-tertiary/40 resize-none outline-none min-h-[44px] py-2 font-sans"
              />
              <button 
                onClick={() => {
                  onRegenerate(steerPrompt);
                  setSteerPrompt("");
                }}
                disabled={isStreaming}
                className="shrink-0 w-12 h-12 bg-brand-gold text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCcw size={18} className={cn(isStreaming && "animate-spin")} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-y-[40px]">
          <div className="sticky top-24 space-y-[40px] w-full">
            <NexusGraph
              characters={majorCharacters}
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
