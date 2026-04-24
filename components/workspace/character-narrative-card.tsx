"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Edit3, Shield, Check, X, User, Activity, Rocket, ShieldAlert } from "lucide-react";
import { ParameterChip } from "@/components/project/character-parameter-chips";

interface CharacterNarrativeCardProps {
  character: any;
  isActive: boolean;
  onUpdate: (updates: any) => Promise<any>;
  onEditFullMode: () => void;
  onSelect: () => void;
}

export function CharacterNarrativeCard({ 
  character, 
  isActive, 
  onUpdate,
  onEditFullMode,
  onSelect
}: CharacterNarrativeCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);
  const [originalValue, setOriginalValue] = useState<any>(null);

  const startEditing = (field: string, value: any) => {
    setEditingField(field);
    setTempValue(value);
    setOriginalValue(value);
  };

  const saveEdit = async () => {
    if (editingField) {
      await onUpdate({ ...character, [editingField]: tempValue });
    }
    setEditingField(null);
  };

  const renderInlineEditor = (field: string, type: "text" | "number" | "select" | "slider", options?: string[]) => {
    if (editingField !== field) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute inset-0 z-50 bg-[#09090B]/98 backdrop-blur-xl flex flex-col items-center justify-center p-8 rounded-[32px] border border-brand-gold/30 shadow-[0_0_50px_rgba(197,160,89,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-xs space-y-6 text-center">
          <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2 block">
            Reset {field.toUpperCase()} Protocol
          </label>
          
          {type === "text" && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current Value</span>
                <span className="text-sm font-medium text-neutral-400 italic">"{originalValue || 'N/A'}"</span>
              </div>
              <input 
                autoFocus
                value={tempValue || ""}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-brand-gold/50"
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            </div>
          )}

          {type === "slider" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Current</span>
                  <span className="text-xl font-bold text-neutral-400">{originalValue || 0}</span>
                </div>
                <div className="w-8 h-[1px] bg-brand-gold/20" />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-brand-gold uppercase tracking-widest mb-1">Target</span>
                  <span className="text-3xl font-black text-white italic">{tempValue || 0}</span>
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={tempValue || 0}
                onChange={(e) => setTempValue(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
            </div>
          )}

          {type === "select" && options && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Current Selection</span>
                <span className="text-sm font-medium text-neutral-400 italic">{originalValue || 'None'}</span>
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

          <div className="flex justify-center space-x-4 pt-4">
            <button onClick={() => setEditingField(null)} className="p-3 bg-neutral-900 rounded-full text-neutral-500 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
            <button onClick={saveEdit} className="p-3 bg-brand-gold rounded-full text-black hover:scale-110 transition-transform shadow-lg shadow-brand-gold/20">
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      onClick={() => {
        if (!isActive) onSelect();
      }}
      className={cn(
        "group relative w-[85vw] md:min-w-[480px] snap-center bg-[#09090B] border rounded-[32px] p-8 md:p-10 transition-all duration-700 cursor-pointer overflow-hidden",
        isActive ? "border-brand-gold/60 bg-white/[0.04] scale-[1.02] ring-1 ring-brand-gold/20 shadow-[0_0_50px_rgba(197,160,89,0.05)]" : "border-white/5 opacity-40 hover:opacity-100"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing("name", character.name);
                }}
                className={cn(
                  "text-4xl font-black uppercase italic tracking-tighter leading-none cursor-pointer hover:text-brand-gold transition-colors", 
                  isActive ? "text-brand-gold" : "text-white"
                )}
              >
                {character.name}
              </h4>
              {isActive && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditFullMode();
                  }}
                  className="p-2 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-full transition-colors group/edit"
                >
                  <Edit3 size={14} className="text-brand-gold group-hover/edit:scale-110 transition-transform" />
                </button>
              )}
            </div>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                startEditing("job", character.job || character.role);
              }}
              className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] cursor-pointer hover:text-white/60 transition-colors block"
            >
              {character.job || character.role || "Architect"}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Shield size={24} className={isActive ? "text-brand-gold" : "text-white/10"} />
            {isActive && character.gender && (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing("gender", character.gender);
                }}
                className="text-[8px] font-black text-brand-gold/60 uppercase tracking-widest cursor-pointer hover:text-brand-gold transition-colors"
              >
                {character.gender}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          <div onClick={(e) => { e.stopPropagation(); startEditing("relationship_type", character.relationship_type || "Ally"); }}>
            <ParameterChip label="Type" value={character.relationship_type || "Ally"} />
          </div>
          <div onClick={(e) => { e.stopPropagation(); startEditing("age", character.age); }}>
            <ParameterChip label="Age" value={character.age > 0 ? character.age.toString() : "Unknown"} />
          </div>
          <div onClick={(e) => { e.stopPropagation(); startEditing("gender", character.gender); }}>
            <ParameterChip label="Gender" value={character.gender || "Unknown"} />
          </div>
          <div onClick={(e) => { e.stopPropagation(); startEditing("archetype", character.archetype || "Void"); }}>
            <ParameterChip label="Archetype" value={character.archetype || "Void"} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-brand-gold/20" />
          <p 
            onClick={(e) => {
              e.stopPropagation();
              startEditing("trait", character.trait || character.description || character.look);
            }}
            className={cn("text-sm leading-relaxed transition-colors duration-700 italic font-medium cursor-pointer hover:text-brand-gold", isActive ? "text-zinc-300" : "text-zinc-500")}
          >
            "{character.trait || character.description || character.look || "데이터 복구 중..."}"
          </p>
        </div>
      </div>

      <AnimatePresence>
        {editingField === "name" && renderInlineEditor("name", "text")}
        {editingField === "job" && renderInlineEditor("job", "text")}
        {editingField === "age" && renderInlineEditor("age", "slider")}
        {editingField === "gender" && renderInlineEditor("gender", "select", ["Male", "Female", "Neutral", "Non-binary"])}
        {editingField === "relationship_type" && renderInlineEditor("relationship_type", "select", ["Protagonist", "Antagonist", "Ally", "Foil"])}
        {editingField === "archetype" && renderInlineEditor("archetype", "select", ["Hero", "Shadow", "Void", "Mentor", "Trickster"])}
        {editingField === "trait" && renderInlineEditor("trait", "text")}
      </AnimatePresence>

      {isActive && (
        <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-brand-gold/[0.03] blur-[60px] rounded-full pointer-events-none" />
      )}
    </div>
  );
}
