// components/workspace/story-bible-tab.tsx

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
    const highImportance = characters.filter(c => (c.importance || 0) >= 7);
    return (highImportance.length > 0 ? highImportance : characters.slice(0, 6)).slice(0, 8);
  }, [characters]);

  useEffect(() => {
    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll('[data-character-card]');
      const activeCard = cards[activeIndex] as HTMLElement;
      if (activeCard) {
        carouselRef.current.scrollTo({
          left: activeCard.offsetLeft - (carouselRef.current.offsetWidth / 2) + (activeCard.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex, characters.length]);

  // ✅ 카드 클릭 시 관계도(Graph)와 동시 연동을 위한 핸들러
  const handleCardSelect = useCallback((id: string, idx: number) => {
    setActiveIndex(idx);
    setNexusSelectedId(id);
  }, []);

  // ✅ 전문가 제안: ID가 없으면 이름으로라도 찾도록 로직 강화 및 중앙 정렬 스크롤
  const handleNexusSelect = useCallback((id: string | null) => {
    setNexusSelectedId(id); // 관계도 선택 상태 동기화
    if (!id) return;
    
    // ID 필드가 없으면 이름 필드로라도 대조하여 인덱스 추출
    const idx = characters.findIndex((c) => 
      String(c.id ?? c.name) === String(id)
    );
    
    if (idx === -1) {
      console.warn(`[NexusSelect] '${id}' 인물을 찾을 수 없습니다.`);
      return;
    }
    
    setActiveIndex(idx);
    
    setTimeout(() => {
      if (carouselRef.current) {
        const cards = carouselRef.current.querySelectorAll('[data-character-card]');
        const targetCard = cards[idx] as HTMLElement;
        
        if (targetCard) {
          // 캐러셀 내의 정확한 중앙 정렬 계산
          carouselRef.current.scrollTo({
            left: targetCard.offsetLeft - (carouselRef.current.offsetWidth / 2) + (targetCard.offsetWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  }, [characters]);

  return (
    <div className="space-y-12 pt-16 lg:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-6 flex flex-col">
          <div className="max-h-[800px] overflow-y-auto pr-8 custom-scrollbar-slim relative">
            <div className="space-y-8 pb-6">
              {/* Narrative Content */}
              {(() => {
                const rawEpic = metadata?.story?.epicNarrative || metadata?.synopsis;
                let epicNarrative = typeof rawEpic === 'string' ? rawEpic : (rawEpic ? JSON.stringify(rawEpic) : null);
                
                if (typeof epicNarrative === 'string') {
                  if (epicNarrative.trim().startsWith('{')) {
                    try {
                      const nested = JSON.parse(epicNarrative);
                      epicNarrative = nested.synopsis || nested.story?.epicNarrative || nested.epicNarrative || nested.epicNarrativeText || epicNarrative;
                    } catch { /* ignore */ }
                  }
                  if (typeof epicNarrative === 'string' && epicNarrative.includes('"logline":')) {
                    const loglineMatch = epicNarrative.match(/"logline":\s*"([^"]+)"/);
                    if (loglineMatch) epicNarrative = loglineMatch[1];
                  }
                  if (typeof epicNarrative === 'string') {
                    epicNarrative = epicNarrative.replace(/[{}"]/g, '').replace(/\\n/g, '\n').trim();
                  }
                }

                // ✅ 인물명 감지 및 스팬 래핑 함수
                const parseNarrativeWithCharacters = (text: string, chars: Character[]) => {
                  if (!text || !chars.length) return [{ type: 'text', content: text, id: '' }];
                  const sorted = [...chars].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));
                  const parts: { type: 'text' | 'character'; content: string; id: string }[] = [];
                  let remaining = text;

                  while (remaining.length > 0) {
                    let matched = false;
                    for (const char of sorted) {
                      const idx = remaining.indexOf(char.name);
                      if (idx === 0) {
                        parts.push({ type: 'character', content: char.name, id: char.id ?? char.name });
                        remaining = remaining.slice(char.name.length);
                        matched = true;
                        break;
                      } else if (idx > 0) {
                        parts.push({ type: 'text', content: remaining.slice(0, idx), id: '' });
                        remaining = remaining.slice(idx);
                        matched = true;
                        break;
                      }
                    }
                    if (!matched) {
                      parts.push({ type: 'text', content: remaining, id: '' });
                      break;
                    }
                  }
                  return parts;
                };

                const plainSynopsis = typeof project.synopsis === 'string' && !project.synopsis.trim().startsWith('{') ? project.synopsis : null;
                const narrativeText = (typeof epicNarrative === 'string' && epicNarrative.length > 10) ? epicNarrative : (plainSynopsis || epicNarrative);
                const logline = metadata?.story?.logline || metadata?.logline || project.logline || '';
                
                if (narrativeText) {
                  const parts = parseNarrativeWithCharacters(narrativeText, characters);
                  return (
                    <div className="flex gap-6 group">
                      <div className="w-[3px] h-auto bg-brand-gold shrink-0" />
                      <div className="flex flex-col">
                        {logline && (
                          <p className="font-handwritten text-[32px] leading-snug tracking-tight mb-4 opacity-95 italic">
                            "{logline}"
                          </p>
                        )}
                        <div className="text-[18px] text-text-secondary leading-[1.8] max-w-[65ch] whitespace-pre-wrap font-sans">
                          {parts.map((p, i) => (
                            p.type === 'character' ? (
                              <span 
                                key={i} 
                                onClick={() => handleNexusSelect(p.id)}
                                className="text-brand-gold font-bold cursor-pointer hover:underline underline-offset-4 decoration-brand-gold/30"
                              >
                                {p.content}
                              </span>
                            ) : p.content
                          ))}
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
                      <p className="text-[12px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-80 mb-4">
                        {isStreaming ? "Synthesizing Narrative Strands..." : "Architecting Narrative DNA..."}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Conflict Dimensions */}
          <div className="space-y-4 pt-12 border-t border-white/5">
            <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] opacity-30 mb-4">Conflict Dimensions</h3>
            <div className="space-y-3">
              {(metadata?.story?.narrativeConflicts || [
                { type: "내적 갈등", description: metadata?.story?.conflicts?.internal || "정체성과 욕망의 충돌" },
                { type: "외적 갈등", description: metadata?.story?.conflicts?.external || "사회 시스템과의 대립" },
                { type: "사회적 갈등", description: metadata?.story?.conflicts?.social || "계급간의 보이지 않는 벽" }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="bg-bg-secondary/40 border border-white/5 p-6 rounded-[12px] flex items-center gap-6 group hover:border-brand-gold/20 transition-all">
                  <span className="w-28 shrink-0 text-[11px] font-mono font-bold text-brand-gold/60 uppercase tracking-widest">{item.type}</span>
                  <p className="text-[16px] font-medium text-text-primary leading-snug border-l border-white/10 pl-6">"{item.description}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Area */}
          <div className="mt-12 p-1 bg-white/[0.03] border border-white/10 rounded-[24px] focus-within:border-brand-gold/30 transition-all">
            <div className="flex items-center gap-4 px-6 py-4">
              <textarea 
                value={steerPrompt}
                onChange={(e) => setSteerPrompt(e.target.value)}
                placeholder="작품의 서사 방향이나 설정을 변경하려면 여기에 입력하세요..."
                className="flex-1 bg-transparent border-none text-text-primary text-[16px] leading-relaxed placeholder:text-text-tertiary/40 resize-none outline-none min-h-[44px] py-2 font-sans"
              />
              <button 
                onClick={() => { onRegenerate(steerPrompt); setSteerPrompt(""); }}
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] opacity-80">Character Roster</h3>
              </div>
              <div className="relative">
                <div ref={carouselRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 pb-4">
                  {characters.length > 0 ? characters.map((char, idx) => (
                    <CharacterNarrativeCard 
                      key={char.id || idx} 
                      character={char} 
                      isActive={activeIndex === idx} 
                      onUpdate={(updates) => onUpdateCharacter(char.id, updates)} 
                      onEditFullMode={() => setEditingCharId(char.id)} 
                      onSelect={() => handleCardSelect(char.id || char.name, idx)} 
                    />
                  )) : <div className="w-full py-10 text-center text-white/10 uppercase text-[10px] font-black border border-dashed border-white/5 rounded-3xl">등장인물 분석 중...</div>}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {characters.map((_, i) => (
                    <button key={i} onClick={() => setActiveIndex(i)} className={cn("h-1.5 rounded-full transition-all duration-500 cursor-pointer hover:opacity-100", activeIndex === i ? "w-10 bg-brand-gold" : "w-2.5 bg-white/10 hover:bg-white/30")} />
                  ))}
                </div>
              </div>
            </div>

            <NexusGraph
              characters={majorCharacters}
              onSelectId={handleNexusSelect}
              selectedId={nexusSelectedId}
            />
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
