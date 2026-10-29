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
    }, 2000);
  };

  const handleModeToggle = (mode: "ai" | "manual") => {
    setCharMode(mode);
  };

  const handleAddCharacter = () => {
    setCharMode("manual");
    addEmptyCharacter();
  };

  return (
    <div className="w-full flex flex-col space-y-16 pb-32">
      {/* 2. Character Studio: Multi-Soul */}
      <section className="space-y-16">
        <div className="w-full flex justify-between items-end mb-12">
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
        </div>

        {/* Multi-Soul Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* AI Auto Generation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "h-[380px] rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group cursor-pointer",
              charMode === "ai" 
                ? "bg-brand-gold/10 border-brand-gold shadow-[0_0_50px_rgba(197,160,89,0.15)]" 
                : "bg-neutral-900/40 border-white/5 grayscale"
            )}
            onClick={() => handleModeToggle("ai")}
          >
            {/* Checkbox UI */}
            <div className={cn(
              "absolute top-6 right-6 w-8 h-8 rounded-xl border transition-all duration-500 flex items-center justify-center",
              charMode === "ai" 
                ? "bg-brand-gold border-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.4)]" 
                : "border-white/10 bg-black/20"
            )}>
              <Sparkles size={charMode === "ai" ? 14 : 12} className={cn(
                "transition-all",
                charMode === "ai" ? "text-black scale-110" : "text-neutral-700"
              )} />
            </div>

            <div className={cn(
              "p-6 rounded-[2rem] transition-all duration-500",
              charMode === "ai" ? "bg-brand-gold text-black scale-110" : "bg-neutral-800 text-neutral-600"
            )}>
              <Sparkles size={32} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <h3 className={cn(
                "text-lg font-black uppercase tracking-[0.2em] mb-2",
                charMode === "ai" ? "text-white" : "text-neutral-500"
              )}>AI 자동 생성</h3>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest italic">Narrative Weaver Engine</p>
            </div>
            
            {charMode === "ai" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-10 px-8 text-center"
              >
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] animate-pulse">Active Protocol</span>
              </motion.div>
            )}
          </motion.div>

          {/* Manual Character Cards */}
          {formData.characters.map((char: any, idx: number) => (
            <div key={char.id || idx} className={cn(
              "transition-all duration-700",
              charMode === "ai" ? "opacity-20 pointer-events-none scale-95 grayscale" : "opacity-100"
            )}>
              <CharacterCard 
                character={char}
                allCharacters={formData.characters}
                onUpdate={(updates) => updateCharacter(idx, updates)}
                onRemove={() => removeCharacter(idx)}
              />
            </div>
          ))}

          {/* Add New Soul Button */}
          {formData.characters.length < 4 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddCharacter}
              className="h-[380px] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center space-y-4 group"
            >
              <div className="p-4 rounded-2xl bg-neutral-900 group-hover:bg-brand-gold group-hover:text-black transition-all">
                  <Plus size={28} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-neutral-600 group-hover:text-brand-gold uppercase tracking-[0.4em]">Add New Soul</span>
            </motion.button>
          )}
        </div>
        
        {/* Cinematic Status Footer - REMOVED AS REQUESTED */}
      </section>
    </div>
  );
}
