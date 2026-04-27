"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Shield, Check, X, Edit3 } from "lucide-react";

interface Props {
  character: any;
  isActive: boolean;
  onUpdate: (updates: any) => Promise<any>;
  onEditFullMode: () => void;
  onSelect: () => void;
}

export function CharacterNarrativeCard({ character, isActive, onUpdate, onEditFullMode, onSelect }: Props) {
  // ── Optimistic local state ──
  const [local, setLocal] = useState<any>(character);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>("");

  // Sync when a different character is passed (e.g., navigating carousel)
  useEffect(() => {
    setLocal(character);
    setEditingField(null);
  }, [character?.id]);

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
    // 1. Optimistic UI update
    setLocal(updated);
    setEditingField(null);
    setTempValue("");
    // 2. Async persist
    await onUpdate(updated);
  };

  // ── Tiny save/cancel buttons ──
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

  return (
    <div
      id={`char-card-${character.id}`}
      data-character-card
      onClick={() => { if (!isActive) onSelect(); }}
      className={cn(
        "group relative w-[85vw] md:min-w-[420px] snap-center bg-[#09090B] border rounded-[28px] p-6 transition-all duration-700 cursor-pointer overflow-hidden",
        isActive
          ? "border-brand-gold/60 bg-white/[0.04] scale-[1.02] ring-1 ring-brand-gold/20 shadow-[0_0_40px_rgba(197,160,89,0.05)]"
          : "border-white/5 opacity-40 hover:opacity-100"
      )}
    >
      <div className="relative z-10 space-y-4">

        {/* ── ROW 1: Name + Age + Shield ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Name */}
            {editingField === "name" ? (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  autoFocus
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                  className="w-full bg-white/5 border border-brand-gold/40 rounded-lg px-2 py-0.5 text-brand-gold font-bold text-xl uppercase tracking-tighter outline-none focus:border-brand-gold font-sans"
                />
                <SaveCancel />
              </div>
            ) : (
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <h4
                  onClick={(e) => startEdit(e, "name", local.name)}
                  className={cn(
                    "text-[23px] font-bold uppercase tracking-tight leading-none transition-colors font-sans",
                    isActive ? "text-brand-gold cursor-pointer hover:opacity-80" : "text-text-primary"
                  )}
                >
                  {local.name}
                </h4>

                {/* Age — inline slider when editing */}
                {editingField === "age" ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="range" min="0" max="100"
                      value={tempValue}
                      onChange={(e) => setTempValue(parseInt(e.target.value))}
                      className="w-20 h-1 accent-brand-gold cursor-pointer"
                    />
                    <span className="text-brand-gold text-xs font-bold w-8">{tempValue}세</span>
                    <button onClick={cancel} className="p-0.5 rounded-full bg-neutral-800 text-neutral-500 hover:text-red-400"><X size={9} /></button>
                    <button onClick={save} className="p-0.5 rounded-full bg-brand-gold text-black"><Check size={9} strokeWidth={3} /></button>
                  </div>
                ) : (
                  <span
                    onClick={(e) => startEdit(e, "age", local.age ?? 0)}
                    className={cn("text-[13px] font-medium text-text-tertiary leading-none transition-colors font-mono", isActive && "cursor-pointer hover:text-brand-gold")}
                  >
                    {local.age > 0 ? `${local.age}세` : "나이 미상"}
                  </span>
                )}
              </div>
            )}

            {/* Job */}
            {editingField === "job" ? (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  autoFocus
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                  className="w-full bg-white/5 border border-brand-gold/40 rounded-lg px-2 py-1 text-white text-[12px] font-medium uppercase tracking-widest outline-none focus:border-brand-gold font-mono"
                />
                <SaveCancel />
              </div>
            ) : (
              <span
                onClick={(e) => startEdit(e, "job", local.job || local.role)}
                className={cn("text-[13px] font-medium text-text-tertiary uppercase tracking-[0.1em] block transition-colors font-mono", isActive && "cursor-pointer hover:text-text-secondary")}
              >
                {local.job || local.role || "역할 미정"}
              </span>
            )}
          </div>

          {/* Shield + edit button */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Shield size={20} className={isActive ? "text-brand-gold" : "text-white/10"} />
            {isActive && (
              <button onClick={(e) => { e.stopPropagation(); onEditFullMode(); }} className="p-1.5 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-full transition-colors">
                <Edit3 size={13} className="text-brand-gold" />
              </button>
            )}
          </div>
        </div>

        {/* ── ROW 2: Description ── */}
        <div className="pl-5 border-l-2 border-brand-gold/20">
          {editingField === "trait" ? (
            <div onClick={(e) => e.stopPropagation()}>
              <textarea
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") cancel(); }}
                rows={2}
                className="w-full bg-white/5 border border-brand-gold/40 rounded-lg px-2 py-1 text-white text-[13px] italic outline-none focus:border-brand-gold resize-none"
              />
              <SaveCancel />
            </div>
          ) : (
            <p
              onClick={(e) => startEdit(e, "trait", displayDesc)}
              className={cn("text-[15px] leading-[1.75] italic transition-colors duration-300 font-sans", isActive ? "text-text-primary cursor-pointer hover:text-brand-gold" : "text-text-tertiary")}
            >
              {displayDesc
                ? `"${displayDesc}"`
                : <span className="text-white/20 not-italic">{isActive ? "외모/특성 클릭하여 입력" : "—"}</span>}
            </p>
          )}
        </div>

        {/* ── ROW 3: Desire ── */}
        <div className="flex items-start gap-3">
          <span className="text-[8px] font-black text-brand-gold/40 uppercase tracking-[0.3em] mt-1 shrink-0">욕구</span>
          {editingField === "desire" ? (
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                className="w-full bg-white/5 border border-brand-gold/40 rounded-lg px-2 py-1 text-white text-[12px] outline-none focus:border-brand-gold"
              />
              <SaveCancel />
            </div>
          ) : (
            <p
              onClick={(e) => startEdit(e, "desire", displayDesire)}
              className={cn("text-[12px] font-medium flex-1 transition-colors", isActive ? "text-white/70 cursor-pointer hover:text-brand-gold" : "text-white/25")}
            >
              {displayDesire || <span className="italic text-white/20">{isActive ? "욕구 클릭하여 입력" : "—"}</span>}
            </p>
          )}
        </div>
      </div>

      {isActive && (
        <div className="absolute top-[-10%] right-[-10%] w-[180px] h-[180px] bg-brand-gold/[0.03] blur-[50px] rounded-full pointer-events-none" />
      )}
    </div>
  );
}
