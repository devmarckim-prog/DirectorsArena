import { useState, useEffect } from "react";
import { 
  X, Check, User, Briefcase, Venus, Mars, Calendar, 
  FileText, Shield, Rocket, Droplet, Maximize2, Activity, Heart,
  Search, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CharacterEditFormProps {
  character: any;
  allCharacters: any[];
  onSave: (updates: any) => Promise<any>;
  onClose: () => void;
  hideHeader?: boolean;
}

export function CharacterEditForm({ character, allCharacters, onSave, onClose, hideHeader }: CharacterEditFormProps) {
  // Safety check to prevent crashes if character is not found
  if (!character) return null;

  const getInitialAge = () => {
    if (character.age !== undefined && character.age !== null) return character.age.toString();
    const group = character.ageGroup || character.age_group;
    if (group) {
      const match = group.match(/\d+/);
      return match ? match[0] : "";
    }
    return "";
  };

  const [formData, setFormData] = useState({
    name: character.name || "",
    job: character.job || character.role || "",
    gender: character.gender || "Neutral",
    age: getInitialAge(),
    look: character.look || character.trait || character.description || "",
    desire: character.desire || "",
    void: character.void || "",
    secret: character.secret || "",
    biometrics: {
      blood_type: character.biometrics?.blood_type || "",
      stature: character.biometrics?.stature || ""
    },
    relationship_type: character.relationship_type || "",
    relationship_target_id: character.relationship_target_id || ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'narrative' | 'biometrics' | 'nexus'>('profile');

  const handleSave = async () => {
    setIsSaving(true);
    const updates = {
      ...formData,
      age: parseInt(formData.age) || 0
    };
    await onSave(updates);
    setIsSaving(false);
    onClose();
  };

  const sections = [
    { id: 'profile', label: 'Basic Profile', icon: User },
    { id: 'narrative', label: 'Narrative DNA', icon: FileText },
    { id: 'biometrics', label: 'Biometrics', icon: Activity },
    { id: 'nexus', label: 'Character Nexus', icon: Users },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "z-[100] bg-[#09090B] flex flex-col overflow-hidden",
        !hideHeader && "absolute inset-0 rounded-[28px] border border-brand-gold/30 shadow-[0_0_100px_rgba(197,160,89,0.1)]"
      )}
    >
      {/* Header - Hidden in compact mode */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
              <User size={20} className="text-brand-gold" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none mb-1">
                {formData.name || "Untitled Character"}
              </h4>
              <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.4em] opacity-60">Deep DNA Archive</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Rail */}
        <div className="w-16 border-r border-white/5 bg-black/40 flex flex-col items-center py-8 gap-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              title={s.label}
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                activeSection === s.id 
                  ? "bg-brand-gold text-black shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-110" 
                  : "text-white/20 hover:text-white/60 hover:bg-white/5"
              )}
            >
              <s.icon size={18} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar-gold bg-black/20">
          
          {activeSection === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] flex items-center gap-2">
                  <User size={10} className="opacity-50" /> Full Name
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                  placeholder="인물 이름을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Briefcase size={10} className="opacity-50" /> Occupation
                  </label>
                  <input 
                    type="text"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                    placeholder="직업/역할"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar size={10} className="opacity-50" /> Age
                  </label>
                  <input 
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                   Gender Identity
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Male", "Female", "Neutral", "Non-binary"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                        formData.gender === g 
                          ? "bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/10" 
                          : "bg-white/[0.02] text-white/30 border-white/10 hover:border-white/20"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'narrative' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] flex items-center gap-2">
                  <FileText size={10} className="opacity-50" /> Trait / Look
                </label>
                <textarea 
                  value={formData.look}
                  onChange={(e) => setFormData({ ...formData, look: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all min-h-[100px] resize-none leading-relaxed font-sans text-white/80"
                  placeholder="인물의 외모나 성격적 특징을 서술하세요..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Rocket size={10} className="opacity-50 text-blue-400" /> Narrative Desire
                  </label>
                  <textarea 
                    value={formData.desire}
                    onChange={(e) => setFormData({ ...formData, desire: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs focus:border-brand-gold/50 outline-none transition-all min-h-[80px] resize-none font-sans text-white/70"
                    placeholder="인물의 근본적인 욕망은 무엇인가요?"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Droplet size={10} className="opacity-50 text-red-400" /> Internal Wound (Void)
                  </label>
                  <textarea 
                    value={formData.void}
                    onChange={(e) => setFormData({ ...formData, void: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs focus:border-brand-gold/50 outline-none transition-all min-h-[80px] resize-none font-sans text-white/70"
                    placeholder="인물이 가진 내면의 상처나 결핍..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Shield size={10} className="opacity-50 text-brand-gold" /> Dark Secret
                </label>
                <input 
                  type="text"
                  value={formData.secret}
                  onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                  placeholder="인물이 숨기고 있는 치명적인 비밀"
                />
              </div>
            </div>
          )}

          {activeSection === 'biometrics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity size={10} className="opacity-50" /> Blood Type
                  </label>
                  <div className="flex gap-2">
                    {["A", "B", "O", "AB"].map((bt) => (
                      <button
                        key={bt}
                        onClick={() => setFormData({ ...formData, biometrics: { ...formData.biometrics, blood_type: bt } })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[10px] font-bold border transition-all",
                          formData.biometrics.blood_type === bt 
                            ? "bg-brand-gold border-brand-gold text-black" 
                            : "bg-white/[0.02] text-white/30 border-white/10 hover:border-white/20"
                        )}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Maximize2 size={10} className="opacity-50" /> Stature / Build
                  </label>
                  <input 
                    type="text"
                    value={formData.biometrics.stature}
                    onChange={(e) => setFormData({ ...formData, biometrics: { ...formData.biometrics, stature: e.target.value } })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                    placeholder="E.g. 185cm, Athletic"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'nexus' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] flex items-center gap-2">
                  <Heart size={10} className="opacity-50" /> Relationship Target
                </label>
                <select 
                  value={formData.relationship_target_id}
                  onChange={(e) => setFormData({ ...formData, relationship_target_id: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white appearance-none"
                >
                  <option value="" className="bg-neutral-900">Select Target...</option>
                  {allCharacters?.filter(c => c.id !== character.id).map(opt => (
                    <option key={opt.id} value={opt.id} className="bg-neutral-900">{opt.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                  Relationship Type
                </label>
                <input 
                  type="text"
                  value={formData.relationship_type}
                  onChange={(e) => setFormData({ ...formData, relationship_type: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-brand-gold/50 outline-none transition-all font-sans text-white"
                  placeholder="E.g. Secret Lover, Rival, Mentor"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/5 bg-white/[0.01] flex gap-4">
        <button 
          onClick={onClose}
          className="flex-1 h-14 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-[2] bg-brand-gold text-black h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-[0_10px_40px_rgba(197,160,89,0.2)]"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Check size={16} strokeWidth={3} />
          )}
          <span>Apply DNA Changes</span>
        </button>
      </div>
    </motion.div>
  );
}

// Dummy icon for Loader2 if missing
function Loader2({ className, size }: { className?: string; size?: number }) {
  return <Activity className={cn("animate-spin", className)} size={size} />;
}
