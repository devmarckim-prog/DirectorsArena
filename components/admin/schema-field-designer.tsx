"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Plus, X, Save, Zap, Film, User, Users
} from "lucide-react";
import { updateSchemaFieldsAction } from "@/app/actions";

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(' ');

const TYPE_BADGE: Record<string, string> = {
  text: 'TEXT', textarea: 'TEXTAREA', select: 'SELECT', number: 'NUMBER',
};

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  project:      { label: '프로젝트 기본',  icon: Film,  color: 'text-blue-400' },
  character:    { label: '주인공 설정',    icon: User,  color: 'text-purple-400' },
  relationship: { label: '인물 관계',      icon: Users, color: 'text-pink-400' },
};

interface SchemaField {
  enabled: boolean;
  label: string;
  type: string;
  promptKey: string;
  sourceKey: string;
  category?: string;
  options: string[];
}

interface Props {
  initialFields: Record<string, SchemaField>;
}

export function SchemaFieldDesigner({ initialFields }: Props) {
  const [fields, setFields] = useState<Record<string, SchemaField>>(initialFields);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [newOption, setNewOption] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const toggle = (key: string) =>
    setFields(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));

  const update = (key: string, field: string, val: any) =>
    setFields(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));

  const addOption = (key: string) => {
    const val = (newOption[key] || '').trim();
    if (!val) return;
    setFields(prev => ({ ...prev, [key]: { ...prev[key], options: [...(prev[key].options || []), val] } }));
    setNewOption(prev => ({ ...prev, [key]: '' }));
  };

  const removeOption = (key: string, idx: number) =>
    setFields(prev => ({ ...prev, [key]: { ...prev[key], options: prev[key].options.filter((_, i) => i !== idx) } }));

  const handleSave = async () => {
    setIsSaving(true);
    await updateSchemaFieldsAction(fields);
    setIsSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const entries = Object.entries(fields);
  const enabledCount = entries.filter(([, f]) => f.enabled).length;

  // Group by category
  const grouped = entries.reduce<Record<string, [string, SchemaField][]>>((acc, pair) => {
    const cat = pair[1].category || 'project';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pair);
    return acc;
  }, {});

  const promptPreviewLines = entries
    .filter(([, f]) => f.enabled)
    .map(([, f]) => `- ${f.promptKey}: {값}`);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Prompt Injection Fields</h2>
          <p className="text-neutral-500 text-sm mt-2 max-w-xl leading-relaxed">
            활성화된 항목은 Claude에게 보내는&nbsp;
            <span className="text-brand-gold font-bold">userPrompt에 구조화된 컨텍스트</span>로 주입됩니다.
            캐릭터 정보는 <code className="text-xs bg-white/5 px-1 rounded">characters_v2</code> 테이블에서 자동으로 읽습니다.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-mono bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-neutral-500 w-fit">
            <Zap size={10} className="text-brand-gold" />
            <span>{enabledCount} / {entries.length} 필드가 Claude 프롬프트에 주입됩니다</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-brand-gold text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-brand-gold/80 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Saved Toast */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-2xl px-5 py-3"
          >
            <Zap size={14} className="text-green-400" />
            <span className="text-green-400 text-sm font-bold">저장 완료! 다음 생성부터 Claude 프롬프트에 즉시 반영됩니다.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt Preview */}
      <div className="mb-8 bg-black/60 border border-brand-gold/20 rounded-2xl p-4">
        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Claude에게 주입될 프롬프트 미리보기</p>
        <pre className="text-[11px] text-neutral-400 font-mono leading-relaxed whitespace-pre-wrap">
{`아래 정보를 바탕으로 시네마틱한 드라마/영화 프로젝트를 생성하십시오.

[프로젝트 구조화 정보]
${promptPreviewLines.length > 0 ? promptPreviewLines.join('\n') : '(활성화된 필드 없음)'}`}
        </pre>
      </div>

      {/* Grouped Field Cards */}
      <div className="space-y-8">
        {Object.entries(CATEGORY_META).map(([catKey, catMeta]) => {
          const catFields = grouped[catKey] || [];
          if (catFields.length === 0) return null;
          const Icon = catMeta.icon;
          const catEnabled = catFields.filter(([, f]) => f.enabled).length;

          return (
            <div key={catKey}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <Icon size={14} className={catMeta.color} />
                <span className={cn("text-[11px] font-black uppercase tracking-widest", catMeta.color)}>
                  {catMeta.label}
                </span>
                <span className="text-[10px] text-neutral-700 font-mono">
                  {catEnabled} / {catFields.length} 활성
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {catFields.map(([key, field]) => {
                  const isExpanded = expandedKey === key;
                  return (
                    <motion.div
                      key={key}
                      layout
                      className={cn(
                        "rounded-2xl border transition-all duration-200 overflow-hidden",
                        field.enabled ? "bg-brand-gold/5 border-brand-gold/20" : "bg-white/[0.02] border-white/5"
                      )}
                    >
                      {/* Card Row */}
                      <div className="flex items-center gap-4 px-5 py-3.5">
                        <button onClick={() => toggle(key)} className="flex-shrink-0 transition-transform hover:scale-110">
                          {field.enabled
                            ? <ToggleRight size={28} className="text-brand-gold" />
                            : <ToggleLeft size={28} className="text-neutral-600" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-sm font-black", field.enabled ? "text-white" : "text-neutral-500")}>
                              {field.label}
                            </span>
                            {field.enabled && (
                              <span className="text-[9px] font-black bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                주입됨
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-neutral-700 bg-black/40 px-2 py-0.5 rounded">
                              {TYPE_BADGE[field.type] || field.type}
                            </span>
                          </div>
                          {field.enabled && (
                            <p className="text-[10px] text-neutral-600 mt-0.5 font-mono">
                              prompt: <span className="text-brand-gold/60">"{field.promptKey}"</span>
                              &nbsp;·&nbsp;
                              src: <span className="text-neutral-500">"{field.sourceKey}"</span>
                            </p>
                          )}
                        </div>

                        {field.enabled && (
                          <button
                            onClick={() => setExpandedKey(isExpanded ? null : key)}
                            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                          >
                            {isExpanded
                              ? <ChevronUp size={12} className="text-neutral-400" />
                              : <ChevronDown size={12} className="text-neutral-400" />}
                          </button>
                        )}
                      </div>

                      {/* Expanded Panel */}
                      <AnimatePresence>
                        {isExpanded && field.enabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 overflow-hidden"
                          >
                            <div className="px-5 py-4 space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">표시 라벨</label>
                                  <input
                                    value={field.label}
                                    onChange={e => update(key, 'label', e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1.5">
                                    프롬프트 레이블 <span className="text-brand-gold">(Claude에게 보임)</span>
                                  </label>
                                  <input
                                    value={field.promptKey}
                                    onChange={e => update(key, 'promptKey', e.target.value)}
                                    className="w-full bg-black/50 border border-brand-gold/20 rounded-xl px-3 py-2 text-sm text-brand-gold focus:outline-none focus:border-brand-gold font-mono"
                                  />
                                </div>
                              </div>

                              {field.type === 'select' && (
                                <div>
                                  <label className="block text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2">드롭다운 옵션</label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {(field.options || []).map((opt, idx) => (
                                      <span key={idx} className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-white">
                                        {opt}
                                        <button onClick={() => removeOption(key, idx)} className="text-neutral-500 hover:text-red-400"><X size={9} /></button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      value={newOption[key] || ''}
                                      onChange={e => setNewOption(p => ({ ...p, [key]: e.target.value }))}
                                      onKeyDown={e => { if (e.key === 'Enter') addOption(key); }}
                                      placeholder="새 옵션 추가..."
                                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold placeholder:text-neutral-700"
                                    />
                                    <button onClick={() => addOption(key)} className="px-3 py-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold rounded-xl hover:bg-brand-gold/30">
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-brand-gold text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(197,160,89,0.2)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Saving...' : 'Synchronize to Claude Pipeline'}
        </button>
      </div>
    </div>
  );
}
