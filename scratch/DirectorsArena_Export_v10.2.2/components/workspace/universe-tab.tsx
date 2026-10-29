"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Loader2, BookA, Sparkles } from "lucide-react";

interface UniverseTabProps {
  project: any;
  onUpdateProject: (updates: any) => Promise<any>;
}

export function UniverseTab({ project, onUpdateProject }: UniverseTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const content = typeof project.generated_content === 'string' 
    ? JSON.parse(project.generated_content) 
    : (project.generated_content || {});
  
  const universeSettings = content.universe_settings || { persona: "", glossary: [] };

  const [persona, setPersona] = useState(universeSettings.persona || "");
  const [glossary, setGlossary] = useState<{term: string, definition: string}[]>(universeSettings.glossary || []);

  const handleAddTerm = () => {
    setGlossary([{ term: "", definition: "" }, ...glossary]);
  };

  const handleRemoveTerm = (index: number) => {
    setGlossary(glossary.filter((_, i) => i !== index));
  };

  const handleUpdateTerm = (index: number, field: 'term' | 'definition', value: string) => {
    const newGlossary = [...glossary];
    newGlossary[index][field] = value;
    setGlossary(newGlossary);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const cleanedGlossary = glossary.filter(g => g.term.trim() !== "");
    
    const updatedContent = {
      ...content,
      universe_settings: {
        persona,
        glossary: cleanedGlossary
      }
    };

    await onUpdateProject({ generated_content: updatedContent });
    setGlossary(cleanedGlossary);
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
            <Sparkles className="text-brand-gold" size={32} />
            Universe Settings
          </h2>
          <p className="text-sm text-neutral-500 uppercase tracking-widest mt-2 font-bold">
            Define AI Persona and Custom Glossary
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest">Director's Persona</h3>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">AI 톤앤매너 및 지배 원칙 설정</p>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 focus-within:border-brand-gold/50 transition-colors">
          <textarea
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g. 다크하고 냉소적인 누아르 톤으로 작성할 것. 인물들의 대사는 짧고 은유적으로 표현할 것."
            className="w-full h-32 bg-transparent text-sm leading-relaxed text-white outline-none resize-none placeholder:text-neutral-700"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <BookA size={24} className="text-brand-gold" />
              Project Glossary
            </h3>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">고유 명사, 전문 용어, SF 설정 사전</p>
          </div>
          <button onClick={handleAddTerm} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
            <Plus size={14} /> Add Term
          </button>
        </div>

        <div className="space-y-3">
          {glossary.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <p className="text-xs text-neutral-600 uppercase tracking-widest font-bold">No terms defined yet.</p>
            </div>
          ) : (
            glossary.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-white/10 rounded-2xl bg-white/[0.02] group hover:border-white/30 transition-colors">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={item.term}
                    onChange={(e) => handleUpdateTerm(index, 'term', e.target.value)}
                    placeholder="Term (e.g. 크립토나이트)"
                    className="w-full bg-transparent text-brand-gold font-bold uppercase tracking-widest text-sm outline-none border-b border-transparent focus:border-brand-gold/30 pb-1"
                  />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    value={item.definition}
                    onChange={(e) => handleUpdateTerm(index, 'definition', e.target.value)}
                    placeholder="Definition"
                    className="w-full bg-transparent text-sm text-neutral-300 outline-none border-b border-transparent focus:border-white/20 pb-1"
                  />
                </div>
                <button onClick={() => handleRemoveTerm(index)} className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
