import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Globe, User, Sparkles, Wand2, Shield, Rocket, 
  Landmark, Plus, Trash2, Edit3, Heart, Users,
  PencilLine, FileText, Droplet, Fingerprint, Activity,
  Maximize2, Scroll
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusRail } from "@/components/ui/focus-rail";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
  onProduce: () => void;
  onNext?: () => void;
}

const WORLD_SETTINGS = [
  { id: "contemporary", title: "Contemporary", icon: Globe, imageSrc: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1000" },
  { id: "fantasy", title: "Fantasy", icon: Shield, imageSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000" },
  { id: "cyberpunk", title: "Cyberpunk", icon: Rocket, imageSrc: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000" },
  { id: "historical", title: "Historical", icon: Landmark, imageSrc: "https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80&w=1000" },
  { id: "noir_city", title: "Noir City", icon: Globe, imageSrc: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000" },
];

const EMPTY_CHARACTER = {
  id: "",
  name: "",
  gender: null as "Male" | "Female" | "Other" | null,
  age: null as number | null,
  job: "",
  biometrics: {
    bloodType: "",
    stature: "",
    habit: "",
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

export function StepThree({ formData, setFormData, onProduce }: StepThreeProps) {
  const [charMode, setCharMode] = useState<"ai" | "manual">("ai");
  const [isAddingChar, setIsAddingChar] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempChar, setTempChar] = useState(EMPTY_CHARACTER);

  const saveCharacter = () => {
    if (!tempChar.name) return;
    
    const newChars = [...formData.characters];
    const charWithId = { ...tempChar, id: tempChar.id || Math.random().toString(36).substr(2, 9) };
    
    if (editingIndex !== null) {
      newChars[editingIndex] = charWithId;
    } else {
      newChars.push(charWithId);
    }
    
    setFormData((prev: any) => ({ ...prev, characters: newChars }));
    setTempChar(EMPTY_CHARACTER);
    setIsAddingChar(false);
    setEditingIndex(null);
  };

  const removeCharacter = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      characters: prev.characters.filter((_: any, i: number) => i !== index)
    }));
  };

  const startEdit = (index: number) => {
    setTempChar(formData.characters[index]);
    setEditingIndex(index);
    setIsAddingChar(true);
  };

  // Character Form Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAddingChar) {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          saveCharacter();
        }
        if (e.key === "Escape") {
          setIsAddingChar(false);
          setEditingIndex(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAddingChar, tempChar, editingIndex, formData.characters]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col space-y-24 pb-32">
      {/* 1. World Stage: FocusRail */}
      <section className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
             <div className="h-[1px] w-8 bg-brand-gold/30" />
             <Globe className="text-brand-gold w-4 h-4" />
             <div className="h-[1px] w-8 bg-brand-gold/30" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase italic">Stage: World Focus</h2>
          <p className="text-neutral-500 text-[11px] font-black tracking-[0.6em] uppercase mt-4">Spin the Narrative Universe</p>
        </div>

        <FocusRail 
          items={WORLD_SETTINGS} 
          onSelect={(id) => {
            if (formData.world.setting !== id) {
              setFormData({ ...formData, world: { ...formData.world, setting: id } });
            }
          }}
        />
      </section>

      {/* 2. Character Studio: Multi-Soul */}
      <section className="space-y-12">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
             <div className="h-[1px] w-8 bg-brand-gold/30" />
             <PencilLine className="text-brand-gold w-4 h-4" />
             <div className="h-[1px] w-8 bg-brand-gold/30" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase italic">Soul: Multi-Soul Studio</h2>
          <p className="text-neutral-500 text-[11px] font-black tracking-[0.6em] uppercase mt-4">Architect of the Protagonists</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {formData.characters.map((char: any, idx: number) => (
                  <motion.div
                    key={char.id || idx}
                    layoutId={`char-${char.id || idx}`}
                    className="p-8 rounded-3xl bg-neutral-950/40 border border-brand-gold/20 flex flex-col justify-between group relative overflow-hidden backdrop-blur-md hover:border-brand-gold/50 transition-all duration-500"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold/40 group-hover:bg-brand-gold transition-colors" />
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                         <span className="text-[10px] font-black text-brand-gold/80 uppercase">{char.gender || "U"}</span>
                         <span className="text-neutral-800 text-[10px]">•</span>
                         <span className="text-[10px] font-black text-brand-gold/80 uppercase">{char.age || "?"}Y</span>
                      </div>
                      <h4 className="text-white font-black uppercase text-xl tracking-tight truncate leading-tight">{char.name || "Untitled"}</h4>
                      <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest truncate mt-1">{char.job || "No Occupation"}</p>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex space-x-1">
                        {char.relationship?.targetId && (
                           <div className="w-6 h-6 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                              <Users size={10} className="text-brand-gold" />
                           </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(idx)} className="p-2 text-neutral-600 hover:text-white transition-colors group/btn">
                          <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button onClick={() => removeCharacter(idx)} className="p-2 text-neutral-600 hover:text-red-500 transition-colors group/btn">
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {!isAddingChar && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingChar(true)}
                    className="h-48 rounded-3xl border-2 border-dashed border-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center space-y-4 group"
                  >
                    <div className="p-4 rounded-2xl bg-neutral-900 group-hover:bg-brand-gold group-hover:text-black transition-all">
                       <Plus size={28} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black text-neutral-600 group-hover:text-brand-gold uppercase tracking-[0.4em]">Add New Soul</span>
                  </motion.button>
                )}
              </div>

              {/* Character Form Expansion */}
              <AnimatePresence>
                {isAddingChar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="p-12 rounded-[3.5rem] bg-neutral-950/80 border border-brand-gold/10 backdrop-blur-3xl space-y-16 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative"
                  >
                    {/* Background Texture for Form */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M10 10l80 80M90 10L10 90' stroke='%23C5A059' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '100px 100px' }} />

                    {/* Section: Biometrics & Identity */}
                    <div className="space-y-8">
                       <div className="flex items-center space-x-4">
                          <Fingerprint className="text-brand-gold w-5 h-5" />
                          <h5 className="text-[11px] font-black text-brand-gold/60 uppercase tracking-[0.4em]">Section 01: Biometrics & Identity</h5>
                          <div className="flex-1 h-[1px] bg-brand-gold/10" />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                          <div className="space-y-4">
                            <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <input
                              type="text"
                              value={tempChar.name}
                              onChange={(e) => setTempChar({ ...tempChar, name: e.target.value })}
                              className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-base text-brand-gold placeholder:text-neutral-800 outline-none focus:border-brand-gold/30 transition-all font-bold"
                              placeholder="Name of your creation"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em] ml-1">Bio-Gender</label>
                            <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                              {["Male", "Female", "Other"].map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setTempChar({ ...tempChar, gender: g as any })}
                                  className={cn(
                                    "flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                    tempChar.gender === g ? "bg-brand-gold text-black shadow-xl shadow-brand-gold/10" : "text-neutral-600 hover:text-neutral-400"
                                  )}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-end mb-1">
                              <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em] ml-1">Biological Age</label>
                              <span className="text-sm font-black text-brand-gold">{tempChar.age ?? "?"}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={tempChar.age ?? 25}
                              onChange={(e) => setTempChar({ ...tempChar, age: parseInt(e.target.value) })}
                              className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                            />
                          </div>

                          <div className="space-y-4 text-center">
                            <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em]">Blood Type</label>
                            <div className="flex flex-wrap justify-center gap-2">
                              {["A", "B", "AB", "O"].map((bt) => (
                                <button
                                  key={bt}
                                  onClick={() => setTempChar({ ...tempChar, biometrics: { ...tempChar.biometrics, bloodType: bt } })}
                                  className={cn(
                                    "w-10 h-10 rounded-full border text-[10px] font-black flex items-center justify-center transition-all",
                                    tempChar.biometrics.bloodType === bt 
                                      ? "bg-brand-gold border-brand-gold text-black scale-110" 
                                      : "border-white/5 bg-black/20 text-neutral-600"
                                  )}
                                >
                                  {bt}
                                </button>
                              ))}
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Section: Narrative Stance */}
                    <div className="space-y-8">
                       <div className="flex items-center space-x-4">
                          <Activity className="text-brand-gold w-5 h-5" />
                          <h5 className="text-[11px] font-black text-brand-gold/60 uppercase tracking-[0.4em]">Section 02: Narrative Stance</h5>
                          <div className="flex-1 h-[1px] bg-brand-gold/10" />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          <div className="space-y-4">
                            <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em] ml-1">Social Role / Job</label>
                            <input
                              type="text"
                              value={tempChar.job}
                              onChange={(e) => setTempChar({ ...tempChar, job: e.target.value })}
                              className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-brand-gold placeholder:text-neutral-800 outline-none focus:border-brand-gold/30"
                              placeholder="e.g. Undercover Agent"
                            />
                          </div>

                          <div className="space-y-4 lg:col-span-2">
                            <label className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.2em] ml-1">Relationship Mapping</label>
                            <div className="flex items-center space-x-4 p-2 bg-black/20 border border-white/5 rounded-[2rem]">
                               <select 
                                 value={tempChar.relationship.targetId}
                                 onChange={(e) => setTempChar({ ...tempChar, relationship: { ...tempChar.relationship, targetId: e.target.value } })}
                                 className="w-1/3 h-11 bg-neutral-900 border-none rounded-full px-6 text-xs text-brand-gold outline-none appearance-none cursor-pointer"
                               >
                                 <option value="" className="bg-neutral-950 font-sans">Target Soul</option>
                                 {formData.characters.filter((_: any, i: number) => i !== editingIndex).map((c: any) => (
                                   <option key={c.id} value={c.id} className="bg-neutral-950 font-sans">{c.name}</option>
                                 ))}
                               </select>
                               <div className="w-8 h-[1px] bg-brand-gold/30 relative flex items-center justify-center">
                                  <Heart size={10} className="text-brand-gold/50 absolute" />
                               </div>
                               <input
                                 type="text"
                                 placeholder="Defining Connection (e.g. Fated Rival, Hidden Shadow)"
                                 value={tempChar.relationship.type}
                                 onChange={(e) => setTempChar({ ...tempChar, relationship: { ...tempChar.relationship, type: e.target.value } })}
                                 className="flex-1 h-11 bg-transparent border-none px-4 text-sm text-brand-gold placeholder:text-neutral-800 outline-none"
                               />
                            </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                          {[
                            { id: "look", label: "Visual Signature", icon: Maximize2, placeholder: "Scars, clothing style, aura" },
                            { id: "void", label: "The Void (Wound)", icon: Droplet, placeholder: "What part of them is missing?" },
                            { id: "desire", label: "Primal Desire (Goal)", icon: Rocket, placeholder: "What drives their blood?" },
                            { id: "secret", label: "Buried Secret", icon: Shield, placeholder: "What must never be known?" },
                          ].map((field) => (
                            <div key={field.id} className="space-y-3 group/field">
                              <div className="flex items-center space-x-2 ml-1">
                                <field.icon size={10} className="text-neutral-700 group-hover/field:text-brand-gold transition-colors" />
                                <label className="text-[9px] text-neutral-600 font-black uppercase tracking-[0.2em]">{field.label}</label>
                              </div>
                              <textarea
                                value={tempChar[field.id as keyof typeof tempChar] as string}
                                onChange={(e) => setTempChar({ ...tempChar, [field.id]: e.target.value })}
                                className="w-full h-32 bg-black/20 border border-white/5 rounded-2xl p-4 text-[11px] text-brand-gold placeholder:text-neutral-800 outline-none focus:border-brand-gold/20 resize-none transition-all leading-relaxed"
                                placeholder={field.placeholder}
                              />
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex justify-end items-center space-x-12 pt-8 border-t border-white/5">
                      <div className="hidden sm:flex flex-col items-end">
                         <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Shortcut: ESC to Exit</span>
                         <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest mt-1">CMD+S to Breathe Life</span>
                      </div>
                      <div className="flex space-x-6">
                        <Button 
                          variant="ghost" 
                          onClick={() => { setIsAddingChar(false); setEditingIndex(null); }} 
                          className="text-[10px] font-black uppercase text-neutral-600 hover:text-white tracking-[0.2em]"
                        >
                          Abort Soul
                        </Button>
                        <Button 
                          onClick={saveCharacter} 
                          className="bg-brand-gold hover:bg-brand-gold/80 text-black text-[11px] font-black uppercase px-16 h-16 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.15)] transition-all hover:scale-[1.02]"
                        >
                          Breathe Life into Soul
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                 
                 {/* Decorative Weaver SVG Paths */}
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
                    <motion.path
                      d="M -10 30 Q 25 60 50 30 T 110 30"
                      stroke="#C5A059"
                      strokeWidth="0.1"
                      fill="none"
                      animate={{ 
                        d: [
                          "M -10 30 Q 25 60 50 30 T 110 30", 
                          "M -10 30 Q 25 0 50 30 T 110 30", 
                          "M -10 30 Q 25 60 50 30 T 110 30"
                        ],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                 </svg>
              </div>

              <div className="relative z-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-24 h-24 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-brand-gold/20 relative group-hover:border-brand-gold/40 transition-colors shadow-2xl overflow-hidden"
                >
                   <div className="absolute inset-0 bg-brand-gold/5 animate-pulse" />
                   <Wand2 className="w-10 h-10 text-brand-gold relative z-10" />
                </motion.div>
                <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-4 italic">The AI Loom</h3>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.5em] leading-[2.5] max-w-sm mx-auto">
                  The Great Weaver is ready<br />
                  <span className="text-neutral-700">to weave multiple souls into the void</span><br />
                  based on your narrative seed.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="mt-12 bg-transparent border border-brand-gold/30 hover:border-brand-gold text-brand-gold text-[10px] font-black uppercase px-12 h-14 rounded-full tracking-[0.2em] transition-all relative overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-brand-gold/5 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                    <span className="relative">Initiate Weaving</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Production Trigger */}
      <div className="pt-20 border-t border-white/5">
        <Button
          onClick={onProduce}
          className="w-full h-28 bg-brand-gold hover:bg-brand-gold/90 text-black font-black text-3xl uppercase tracking-[0.8em] rounded-[3rem] shadow-[0_0_80px_rgba(197,160,89,0.2)] hover:shadow-[0_0_100px_rgba(197,160,89,0.4)] transition-all hover:scale-[1.01] active:scale-[0.98] group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <span className="relative drop-shadow-2xl">Produce Scenario</span>
        </Button>
      </div>
    </div>
  );
}
