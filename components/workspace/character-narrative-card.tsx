import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Shield, Check, X, Edit3, Upload, Loader2, Image as ImageIcon,
  Rocket, Droplet, Heart, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterEditForm } from "./character-edit-form";
import { CharacterAvatar } from "./character-avatar";

interface Props {
  character: any;
  allCharacters: any[];
  isActive: boolean;
  isEditing?: boolean;
  onUpdate: (updates: any) => Promise<any>;
  onEditFullMode: () => void;
  onSelect: () => void;
  onCloseEdit?: () => void;
}

export function CharacterNarrativeCard({ 
  character, 
  allCharacters,
  isActive, 
  isEditing,
  onUpdate, 
  onEditFullMode, 
  onSelect,
  onCloseEdit
}: Props) {
  // ── Optimistic local state ──
  const [local, setLocal] = useState<any>(character);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>("");

  // Sync when a different character is passed
  useEffect(() => {
    setLocal(character);
    setEditingField(null);
  }, [character?.id, character]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'characters');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        const updated = { ...local, avatar_url: data.url };
        setLocal(updated);
        await onUpdate(updated);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const startEdit = (e: React.MouseEvent, field: string, value: any) => {
    e.stopPropagation();
    if (!isActive) return;
    setEditingField(field);
    setTempValue(value ?? "");
  };

  const cancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingField(null);
    setTempValue("");
  };

  const save = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!editingField) return;
    const updated = { ...local, [editingField]: tempValue };
    setLocal(updated);
    setEditingField(null);
    setTempValue("");
    await onUpdate(updated);
  };

  const SaveCancel = () => (
    <div className="flex gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
      <button onClick={cancel} className="p-0.5 rounded-full bg-neutral-800 text-neutral-500 hover:text-red-400 transition-colors">
        <X size={9} />
      </button>
      <button onClick={save} className="p-0.5 rounded-full bg-brand-gold text-black hover:scale-110 transition-transform">
        <Check size={9} strokeWidth={3} />
      </button>
    </div>
  );

  const displayDesc = local.trait || local.description || local.look;
  const displayDesire = local.desire || local.void;
  
  const getDisplayAge = () => {
    // 1. Prioritize exact numerical age
    const exactAge = typeof local.age === 'number' ? local.age : parseInt(local.age);
    if (!isNaN(exactAge) && exactAge > 0) return `${exactAge}세`;
    
    // 2. Fallback to categorical age groups
    const group = local.ageGroup || local.age_group;
    if (group && group !== "null" && group !== "undefined") {
      const match = group.match(/\d+/);
      return match ? `${match[0]}대` : group;
    }
    return "나이 미상";
  };

  return (
    <motion.div
      layout
      id={`char-card-${character.id}`}
      data-character-card
      onClick={() => { if (!isActive) onSelect(); }}
      className={cn(
        "group relative w-[85vw] md:min-w-[420px] snap-center bg-[#09090B] border rounded-[28px] p-6 transition-all duration-700 cursor-pointer",
        isEditing ? "min-h-[850px] z-[100] border-brand-gold ring-2 ring-brand-gold/20 shadow-[0_0_100px_rgba(197,160,89,0.3)]" : 
        isActive
          ? "border-brand-gold/60 bg-white/[0.04] scale-[1.02] ring-1 ring-brand-gold/20 shadow-[0_0_40px_rgba(197,160,89,0.05)]"
          : "border-white/5 opacity-40 hover:opacity-100"
      )}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* ── ROW 1: ALWAYS VISIBLE Top Section ── */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div 
            className="shrink-0 overflow-hidden relative group cursor-pointer"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            <CharacterAvatar 
              name={local.name} 
              age={local.age} 
              gender={local.gender} 
              avatar_url={local.avatar_url}
              size={64}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              {isUploading ? <Loader2 className="animate-spin text-brand-gold" size={16} /> : <Upload className="text-white" size={16} />}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <h4 className="text-[23px] font-bold uppercase tracking-tight leading-none text-brand-gold font-sans">
                {local.name}
              </h4>
              <span className="text-[13px] font-medium text-text-tertiary font-mono">
                {getDisplayAge()}
              </span>
            </div>
            <span className="text-[13px] font-medium text-text-tertiary uppercase tracking-[0.1em] block font-mono">
              {local.job || local.role || "역할 미정"}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Shield 
              size={20} 
              className={isActive ? "text-brand-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" : "text-white/10"} 
            />
            {!isEditing && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onEditFullMode(); 
                }} 
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isActive ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20 scale-110" : "bg-white/5 text-white/20 hover:text-white hover:bg-white/10"
                )}
              >
                <Edit3 size={14} />
              </button>
            )}
            {isEditing && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onCloseEdit?.(); 
                }} 
                className="p-2 rounded-full bg-white/10 text-white/40 hover:text-white hover:bg-white/20 transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── EXPANDABLE CONTENT AREA ── */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="edit-form-area"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/10">
                <CharacterEditForm 
                  character={local}
                  allCharacters={allCharacters}
                  onClose={onCloseEdit || (() => {})}
                  onSave={onUpdate}
                  hideHeader={true}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="summary-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Trait (Narrative DNA) */}
              <div className="pl-5 border-l-2 border-brand-gold/20">
                <p className="text-[15px] leading-[1.75] italic text-text-primary font-sans">
                  {displayDesc ? `"${displayDesc}"` : "인물 설정이 집필되지 않았습니다."}
                </p>
              </div>

              {/* Narrative Parameters */}
              <div className="space-y-2 pt-2">
                {local.desire && (
                  <div className="flex items-center gap-3">
                    <Rocket size={10} className="text-blue-400/50" />
                    <span className="text-[11px] text-white/50 font-medium leading-none">{local.desire}</span>
                  </div>
                )}
                {local.void && (
                  <div className="flex items-center gap-3">
                    <Droplet size={10} className="text-red-400/50" />
                    <span className="text-[11px] text-white/50 font-medium leading-none italic">{local.void}</span>
                  </div>
                )}
                {local.secret && (
                  <div className="flex items-center gap-3">
                    <Shield size={10} className="text-brand-gold/50" />
                    <span className="text-[11px] text-brand-gold/60 font-black uppercase tracking-widest leading-none">Secret Archive Loaded</span>
                  </div>
                )}
              </div>

              {/* Relationship */}
              {local.relationship_type && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                  <Heart size={10} className="text-pink-500/40" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    Relationship: <span className="text-white/60 ml-1">{local.relationship_type}</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isActive && !isEditing && (
        <div className="absolute top-[-10%] right-[-10%] w-[180px] h-[180px] bg-brand-gold/[0.03] blur-[50px] rounded-full pointer-events-none" />
      )}
    </motion.div>
  );
}
