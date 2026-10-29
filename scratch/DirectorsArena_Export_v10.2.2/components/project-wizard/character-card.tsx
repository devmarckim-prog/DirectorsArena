"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  User, Edit3, Trash2, Heart, Fingerprint, Activity, 
  RotateCw, Check, X, Shield, Rocket, Droplet, Maximize2,
  Briefcase, Calendar, Venus, Mars
} from "lucide-react";

import { CharacterAvatar } from "../workspace/character-avatar";

interface CharacterCardProps {
  character: any;
  allCharacters: any[];
  onUpdate: (updates: any) => void;
  onRemove: () => void;
}

export function CharacterCard({ character, allCharacters, onUpdate, onRemove }: CharacterCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);
  const [originalValue, setOriginalValue] = useState<any>(null);

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flip if clicking buttons or inputs
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input") || (e.target as HTMLElement).closest("textarea")) return;
    setIsFlipped(!isFlipped);
  };

  const startEditing = (field: string, value: any) => {
    setEditingField(field);
    setTempValue(value);
    setOriginalValue(value);
  };

  const saveEdit = () => {
    if (editingField) {
      const fieldPath = editingField.split(".");
      let updatedChar = { ...character };
      
      if (fieldPath.length === 2) {
        updatedChar = {
          ...character,
          [fieldPath[0]]: {
            ...character[fieldPath[0]],
            [fieldPath[1]]: tempValue
          }
        };
      } else {
        updatedChar = { ...character, [editingField]: tempValue };
      }
      onUpdate(updatedChar);
    }
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue(null);
  };

  const renderInlineEdit = (field: string, type: "text" | "number" | "select" | "slider" | "textarea" | "relationship", options?: string[]) => {
    if (editingField !== field) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 rounded-3xl border border-brand-gold/50 shadow-[0_0_40px_rgba(197,160,89,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full space-y-4">
          <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2 block text-center">
            Modify {field.split(".").pop()}
          </label>
          
          {type === "text" && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current</span>
                <span className="text-xs font-medium text-neutral-400 italic">"{originalValue || 'N/A'}"</span>
              </div>
              <input 
                autoFocus
                value={tempValue || ""}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-brand-gold/30"
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            </div>
          )}

          {type === "number" && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current</span>
                <span className="text-xs font-medium text-neutral-400 italic">{originalValue || '0'}</span>
              </div>
              <input 
                type="number"
                autoFocus
                value={tempValue || ""}
                onChange={(e) => setTempValue(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-brand-gold/30"
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            </div>
          )}

          {type === "slider" && (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Current</span>
                  <span className="text-lg font-bold text-neutral-400">{originalValue || 0}</span>
                </div>
                <div className="w-8 h-[1px] bg-brand-gold/20" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-brand-gold uppercase tracking-widest mb-1">Target</span>
                  <span className="text-2xl font-black text-white italic">{tempValue || 0}</span>
                </div>
              </div>
               <input 
                type="range"
                min="1"
                max="100"
                value={tempValue || 25}
                onChange={(e) => setTempValue(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
            </div>
          )}

          {type === "textarea" && (
            <div className="space-y-4 w-full">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current Edit</span>
              </div>
              <textarea 
                autoFocus
                value={tempValue || ""}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-gold/30 resize-none leading-relaxed"
              />
            </div>
          )}

          {type === "select" && options && (
            <div className="space-y-4 w-full">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current</span>
                <span className="text-xs font-medium text-neutral-400 italic">{originalValue || 'None'}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTempValue(opt)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                    tempValue === opt ? "bg-brand-gold border-brand-gold text-black" : "border-white/10 text-neutral-500 hover:text-white"
                  )}
                >
                  {opt}
                </button>
              ))}
              </div>
            </div>
          )}

          {type === "relationship" && (
            <div className="space-y-4 w-full">
              <select 
                value={tempValue?.targetId || ""}
                onChange={(e) => setTempValue({ ...tempValue, targetId: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-brand-gold/30 [&>option]:bg-neutral-900"
              >
                <option value="">Select Target Character...</option>
                {allCharacters?.filter(c => c.id !== character.id).map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name || "Unnamed Character"}</option>
                ))}
              </select>
              <input 
                placeholder="Relationship (e.g. Rival, Ally)"
                value={tempValue?.type || ""}
                onChange={(e) => setTempValue({ ...tempValue, type: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-brand-gold/30"
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            </div>
          )}

          <div className="flex justify-center space-x-4 pt-4">
            <button onClick={cancelEdit} className="p-3 bg-neutral-900 rounded-full text-neutral-500 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
            <button onClick={saveEdit} className="p-3 bg-brand-gold rounded-full text-black hover:scale-110 transition-transform">
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative group w-full h-[380px] [perspective:1000px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        onClick={handleFlip}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-8 rounded-[2.5rem] bg-neutral-950/40 border border-brand-gold/10 backdrop-blur-xl flex flex-col justify-between group/front">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gold/20 group-hover/front:bg-brand-gold transition-colors" />
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEditing("gender", character.gender); }}
                      className="text-[10px] font-black text-brand-gold/60 uppercase hover:text-brand-gold transition-colors"
                    >
                      {character.gender || "Gender?"}
                    </button>
                    <span className="text-neutral-800">•</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEditing("age", character.age); }}
                      className="text-[10px] font-black text-brand-gold/60 uppercase hover:text-brand-gold transition-colors"
                    >
                      {character.age ? `${character.age}Y` : "Age?"}
                    </button>
                  </div>
                   <button 
                    onClick={(e) => { e.stopPropagation(); startEditing("name", character.name); }}
                    className="text-2xl font-black text-white uppercase tracking-tighter text-left hover:text-brand-gold transition-colors block leading-none"
                  >
                    {character.name || "Untitled Soul"}
                  </button>
               </div>
               <div className="flex items-start space-x-3">
                  <div className="relative group/avatar">
                    <CharacterAvatar 
                      name={character.name || "Untitled"} 
                      age={character.age} 
                      gender={character.gender} 
                      size={60}
                      className="border-2 border-brand-gold/10 group-hover/avatar:border-brand-gold/40 transition-all duration-500 shadow-2xl"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} className="p-2.5 rounded-xl bg-white/5 text-neutral-500 hover:text-brand-gold transition-all">
                      <RotateCw size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2.5 rounded-xl bg-white/5 text-neutral-500 hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.3em] block mb-1">Occupation</label>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEditing("job", character.job); }}
                    className="text-sm font-bold text-neutral-300 hover:text-brand-gold transition-colors text-left w-full truncate block"
                  >
                    {character.job || "No defined role"}
                  </button>
               </div>

               <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Activity size={12} className="text-brand-gold/40" />
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Active Synopsis</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEditing("look", character.look); }}
                    className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3 italic text-left hover:text-brand-gold transition-colors w-full"
                  >
                    {character.look || "No description provided yet."}
                  </button>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4">
             <div />
             <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="text-[9px] font-black text-brand-gold/80 uppercase tracking-[0.5em] hover:tracking-[0.6em] transition-all flex items-center"
             >
               DETAILS ↠
             </button>
          </div>

          <AnimatePresence>
            {editingField === "name" && renderInlineEdit("name", "text")}
            {editingField === "age" && renderInlineEdit("age", "slider")}
            {editingField === "gender" && renderInlineEdit("gender", "select", ["Male", "Female", "Other"])}
            {editingField === "job" && renderInlineEdit("job", "text")}
            {editingField === "look" && renderInlineEdit("look", "textarea")}
          </AnimatePresence>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-8 rounded-[2.5rem] bg-neutral-950/60 border border-brand-gold/30 backdrop-blur-2xl flex flex-col justify-between overflow-hidden group/back">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.05),transparent)] pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <div className="flex justify-between items-center">
               <div className="flex items-center space-x-2">
                  <Fingerprint size={14} className="text-brand-gold" />
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em]">DEEP ARCHIVE</span>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-black transition-all">
                  <RotateCw size={14} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { id: "biometrics.bloodType", label: "Blood", icon: Activity, type: "select", options: ["A", "B", "AB", "O"] },
                 { id: "desire", label: "Desire", icon: Rocket, type: "text" },
                 { id: "secret", label: "Secret", icon: Shield, type: "text" },
                 { id: "biometrics.stature", label: "Stature", icon: Maximize2, type: "text" },
               ].map((field) => (
                 <div key={field.id} className="space-y-1">
                    <div className="flex items-center space-x-2 opacity-50">
                       <field.icon size={10} />
                       <span className="text-[8px] font-bold uppercase tracking-widest">{field.label}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEditing(field.id, field.id.includes(".") ? character[field.id.split(".")[0]][field.id.split(".")[1]] : character[field.id]); }}
                      className="text-[10px] font-medium text-neutral-300 hover:text-brand-gold transition-colors block text-left truncate w-full"
                    >
                      {field.id.includes(".") ? character[field.id.split(".")[0]][field.id.split(".")[1]] || "Value?" : character[field.id] || "Value?"}
                    </button>
                 </div>
               ))}
            </div>

            <div className="space-y-3">
               <div className="space-y-1">
                  <div className="flex items-center space-x-2 opacity-50">
                     <Droplet size={10} />
                     <span className="text-[8px] font-bold uppercase tracking-widest">Internal Wound</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEditing("void", character.void); }}
                    className="text-[10px] text-neutral-400 leading-relaxed italic hover:text-brand-gold transition-colors text-left line-clamp-2 block w-full"
                  >
                    {character.void || "Click to add narrative scar..."}
                  </button>
               </div>
               
               <button 
                 onClick={(e) => { e.stopPropagation(); startEditing("relationship", character.relationship || {}); }}
                 className="space-y-1 pt-3 border-t border-white/5 w-full text-left p-2 rounded-lg -mx-2 hover:bg-brand-gold/5 transition-colors group/rel block"
               >
                  <div className="flex items-center space-x-2 opacity-50 group-hover/rel:opacity-100 group-hover/rel:text-brand-gold transition-colors">
                     <Heart size={10} />
                     <span className="text-[8px] font-bold uppercase tracking-widest">Relationship Target</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate pt-1">
                    {character.relationship?.targetId ? (
                      <span className="text-white font-bold">{allCharacters?.find(c => c.id === character.relationship.targetId)?.name || "Unknown"} </span>
                    ) : (
                      "Click to assign target "
                    )}
                    {character.relationship?.type && <span className="text-brand-gold/80 ml-1 italic text-[9px]">({character.relationship.type})</span>}
                  </div>
               </button>
            </div>
          </div>

          <div className="relative z-10 flex justify-center mt-2">
             <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em] hover:text-white transition-colors"
             >
               ↞ RETURN
             </button>
          </div>

          <AnimatePresence>
            {editingField === "biometrics.bloodType" && renderInlineEdit("biometrics.bloodType", "select", ["A", "B", "AB", "O"])}
            {editingField === "biometrics.stature" && renderInlineEdit("biometrics.stature", "text")}
            {editingField === "desire" && renderInlineEdit("desire", "text")}
            {editingField === "secret" && renderInlineEdit("secret", "text")}
            {editingField === "void" && renderInlineEdit("void", "textarea")}
            {editingField === "relationship" && renderInlineEdit("relationship", "relationship")}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
