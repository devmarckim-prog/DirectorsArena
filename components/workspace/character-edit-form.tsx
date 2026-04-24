"use client";

import { useState } from "react";
import { X, Check, User, Briefcase, Venus, Mars, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface CharacterEditFormProps {
  character: any;
  onSave: (updates: any) => Promise<any>;
  onClose: () => void;
}

export function CharacterEditForm({ character, onSave, onClose }: CharacterEditFormProps) {
  const [formData, setFormData] = useState({
    name: character.name || "",
    job: character.job || character.job || "",
    gender: character.gender || "Neutral",
    age: character.age?.toString() ?? "",
    look: character.look || character.trait || "",
  });
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-50 bg-[#09090B] p-8 flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-black text-brand-gold uppercase tracking-tighter italic">Edit Character DNA</h4>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X size={20} className="text-neutral-500" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar-slim">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <User size={10} /> Name
          </label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none transition-all"
            placeholder="Name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <Briefcase size={10} /> Job / Role
            </label>
            <input 
              type="text"
              value={formData.job}
              onChange={(e) => setFormData({ ...formData, job: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none transition-all"
              placeholder="E.g. Protagonist"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={10} /> Age
            </label>
            <input 
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none transition-all"
              placeholder="Age"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <Venus size={10} /> Gender
          </label>
          <div className="flex gap-2">
            {["Male", "Female", "Neutral", "Non-binary"].map((g) => (
              <button
                key={g}
                onClick={() => setFormData({ ...formData, gender: g })}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  formData.gender === g 
                    ? "bg-brand-gold text-black border-brand-gold" 
                    : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <FileText size={10} /> Trait / Look
          </label>
          <textarea 
            value={formData.look}
            onChange={(e) => setFormData({ ...formData, look: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none transition-all min-h-[100px] resize-none"
            placeholder="Describe character's appearance and traits..."
          />
        </div>
      </div>

      <div className="pt-8 mt-auto">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-brand-gold text-black h-12 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Check size={16} />
          )}
          <span>Apply Changes</span>
        </button>
      </div>
    </motion.div>
  );
}
