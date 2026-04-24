import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Sparkles, Wand2, PencilLine, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { CharacterCard } from "./character-card";

interface StepFourProps {
  formData: any;
  setFormData: (data: any) => void;
  onProduce: () => void;
}

const EMPTY_CHARACTER = {
  id: "",
  name: "",
  gender: "Male" as "Male" | "Female" | "Other",
  age: 25,
  job: "",
  biometrics: {
    bloodType: "A",
    stature: "175cm",
    habit: "Tapping fingers",
  },
  relationship: {
    targetId: "",
    type: "",
  },
  look: "",
  void: "",
  desire: "",
  secret: "",
};

export function StepFour({ formData, setFormData, onProduce }: StepFourProps) {
  const [charMode, setCharMode] = useState<"ai" | "manual">("ai");
  const [isWeaving, setIsWeaving] = useState(false);

  const updateCharacter = (index: number, updates: any) => {
    const newChars = [...formData.characters];
    newChars[index] = updates;
    setFormData({ ...formData, characters: newChars });
  };

  const removeCharacter = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      characters: prev.characters.filter((_: any, i: number) => i !== index)
    }));
  };

  const addEmptyCharacter = () => {
    const newChar = { ...EMPTY_CHARACTER, id: Math.random().toString(36).substr(2, 9) };
    setFormData((prev: any) => ({
      ...prev,
      characters: [...prev.characters, newChar]
    }));
  };

  const initiateWeaving = () => {
    setIsWeaving(true);
    // Mock AI Generation delay
    setTimeout(() => {
      const aiChars = [
        {
          id: "char-1",
          name: "김주원",
          gender: "Male",
          age: 34,
          job: "백화점 CEO",
          biometrics: { bloodType: "A", stature: "182cm", habit: "Adjusting cufflinks" },
          relationship: { targetId: "char-2", type: "Protagonist" },
          look: "완벽주의자, 폐소공포증, 애정결핍.",
          void: "Lost his younger sister to a corporate 'restructuring' he helped plan.",
          desire: "To dismantle the G-SEC network from the inside.",
          secret: "He is still on the corporate payroll as a double agent."
        },
        {
          id: "char-2",
          name: "길라임",
          gender: "Female",
          age: 30,
          job: "스턴트 무술감독",
          biometrics: { bloodType: "B", stature: "165cm", habit: "Humming dead frequencies" },
          relationship: { targetId: "char-1", type: "Protagonist" },
          look: "걸크러시, 높은 자존감.",
          void: "Born in the dead-zones with no legal identity.",
          desire: "Absolute freedom from the neural net.",
          secret: "She once hacked the World Governor's private terminal."
        },
        {
          id: "char-3",
          name: "오스카",
          gender: "Male",
          age: 36,
          job: "한류스타",
          biometrics: { bloodType: "O", stature: "185cm", habit: "Winking at fans" },
          relationship: { targetId: "char-1", type: "Ally" },
          look: "낙천적인 바람둥이, 주원의 사촌.",
          void: "Always second best to Ju-won.",
          desire: "To find his true love, Yoon Seul.",
          secret: "He is actually a donor for an illegal liver transplant."
        },
        {
          id: "char-4",
          name: "윤슬",
          gender: "Female",
          age: 34,
          job: "CF 감독",
          biometrics: { bloodType: "AB", stature: "168cm", habit: "Fixing glasses" },
          relationship: { targetId: "char-3", type: "Ally" },
          look: "도도하지만 상처받은 내면.",
          void: "Betrayed by her first love.",
          desire: "To ruin Oska's career.",
          secret: "She owns the rival production company."
        },
        {
          id: "char-5",
          name: "임종수",
          gender: "Male",
          age: 38,
          job: "액션스쿨 대표",
          biometrics: { bloodType: "B", stature: "180cm", habit: "Cracking knuckles" },
          relationship: { targetId: "char-2", type: "Ally" },
          look: "묵묵한 카리스마, 라임의 스승.",
          void: "Failed to protect his best friend.",
          desire: "To keep Ra-im safe at all costs.",
          secret: "He killed a man in self-defense 10 years ago."
        },
        {
          id: "char-6",
          name: "문분홍",
          gender: "Female",
          age: 58,
          job: "로엘 그룹 여주인",
          biometrics: { bloodType: "A", stature: "162cm", habit: "Drinking tea" },
          relationship: { targetId: "char-1", type: "Antagonist" },
          look: "냉정한 계급주의자, 주원의 모친.",
          void: "Abandoned by her own father.",
          desire: "To maintain the purity of the Roel lineage.",
          secret: "She is poisoning the grandfather’s medication."
        },
        {
          id: "char-7",
          name: "박봉호",
          gender: "Male",
          age: 55,
          job: "로엘 그룹 전무",
          biometrics: { bloodType: "O", stature: "174cm", habit: "Smiling falsely" },
          relationship: { targetId: "char-1", type: "Antagonist" },
          look: "야심가, 주원을 견제하는 숙적.",
          void: "Perpetual outsider in the family.",
          desire: "To take over as CEO of Roel Group.",
          secret: "He is laundering money through the construction department."
        }
      ];
      setFormData({ ...formData, characters: aiChars });
      setIsWeaving(false);
      setCharMode("manual");
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col space-y-16 pb-32">
      {/* 2. Character Studio: Multi-Soul */}
      <section className="space-y-16">
        <div className="w-full flex justify-between items-end mb-12 px-2">
          <div className="text-left">
            <motion.h2 
              className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tighter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              누가 당신의 이야기를<br />이끌어 나갑니까?
            </motion.h2>
            <p className="text-neutral-500 font-medium tracking-wide uppercase text-sm">
              Architect of the Protagonists
            </p>
          </div>
          <div className="pb-2">
            <CircularProgress currentCount={formData.characters.length} maxCount={4} size={56} strokeWidth={4} />
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex p-1.5 bg-neutral-900/60 rounded-full border border-white/5 backdrop-blur-2xl shadow-2xl">
            {[ 
              { id: "ai", label: "AI Weaver", icon: Sparkles }, 
              { id: "manual", label: "Manual Author", icon: PencilLine } 
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCharMode(mode.id as any)}
                className={cn(
                  "px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3",
                  charMode === mode.id ? "bg-brand-gold text-black shadow-[0_0_30px_rgba(197,160,89,0.3)]" : "text-neutral-600 hover:text-white"
                )}
              >
                <mode.icon size={14} strokeWidth={2.5} />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Soul Grid */}
        <AnimatePresence mode="wait">
          {charMode === "manual" ? (
            <motion.div 
              key="manual" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {formData.characters.map((char: any, idx: number) => (
                  <CharacterCard 
                    key={char.id || idx}
                    character={char}
                    allCharacters={formData.characters}
                    onUpdate={(updates) => updateCharacter(idx, updates)}
                    onRemove={() => removeCharacter(idx)}
                  />
                ))}

                {formData.characters.length < 4 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addEmptyCharacter}
                    className="h-[380px] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center space-y-4 group"
                  >
                    <div className="p-4 rounded-2xl bg-neutral-900 group-hover:bg-brand-gold group-hover:text-black transition-all">
                       <Plus size={28} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black text-neutral-600 group-hover:text-brand-gold uppercase tracking-[0.4em]">Add New Soul</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 text-center rounded-[4rem] border border-brand-gold/10 bg-neutral-950/20 backdrop-blur-xl relative overflow-hidden group"
            >
              {/* AI Looming Animation Placeholder */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                 <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(197,160,89,0.08)_180deg,transparent_360deg)] rounded-full blur-3xl opacity-50" 
                 />
                 
                 <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                      d="M -10 50 Q 25 30 50 50 T 110 50"
                      stroke="#C5A059"
                      strokeWidth="0.1"
                      fill="none"
                      animate={{ 
                        d: [
                          "M -10 50 Q 25 30 50 50 T 110 50", 
                          "M -10 50 Q 25 70 50 50 T 110 50", 
                          "M -10 50 Q 25 30 50 50 T 110 50"
                        ],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                 </svg>
              </div>

              <div className="relative z-10">
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="w-24 h-24 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-brand-gold/20 relative group-hover:border-brand-gold/40 transition-colors shadow-2xl overflow-hidden"
                >
                   <div className="absolute inset-0 bg-brand-gold/5 animate-pulse" />
                   <Wand2 className={cn("w-10 h-10 text-brand-gold relative z-10", isWeaving && "animate-spin")} />
                </motion.div>
                <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-4 italic">
                  {isWeaving ? "당신의 대박 스토리가 생성되고 있습니다" : "The AI Loom"}
                </h3>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.5em] leading-[2.5] max-w-sm mx-auto">
                  The character generator is ready<br />
                  <span className="text-neutral-700">to generate multiple characters for your script</span><br />
                  based on your narrative seed.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={initiateWeaving}
                    disabled={isWeaving}
                    className="mt-12 bg-transparent border border-brand-gold/30 hover:border-brand-gold text-brand-gold text-[10px] font-black uppercase px-12 h-14 rounded-full tracking-[0.2em] transition-all relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-brand-gold/5 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                    <span className="relative">{isWeaving ? "당신의 대박 스토리가 생성되고 있습니다" : "이야기 생성하기"}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cinematic Status Footer */}
        <div className="flex justify-end pr-10">
          <div className="text-[10px] text-neutral-700 font-black uppercase tracking-[0.4em] italic pointer-events-none">
            Architecting Stage...
          </div>
        </div>
      </section>
    </div>
  );
}
