"use client";

import { useEffect, useState } from "react";
import { 
  getAdminSettingsAction, 
  updateAdminSettingsAction, 
  resetPromptsToDefaultAction 
} from "@/lib/actions/admin";
import { SchemaFieldDesigner } from "@/components/admin/schema-field-designer";
import { 
  Settings, Save, RotateCcw, 
  Terminal, Database, Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'schema'>('prompts');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getAdminSettingsAction();
    setSettings(data);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAdminSettingsAction(settings);
      alert("Settings saved successfully");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset all prompts to system defaults? This cannot be undone.")) return;
    setIsSaving(true);
    try {
      await resetPromptsToDefaultAction();
      await loadSettings();
      alert("Prompts reset to defaults");
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Orchestrator Settings</h2>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.4em]">Engine Logic & Schema Configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-neutral-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-brand-gold text-black hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest shadow-[0_0_25px_rgba(197,159,89,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? "Synchronizing..." : "Save Config"}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('prompts')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'prompts' ? "bg-brand-gold text-black shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Prompt Engineering
        </button>
        <button 
          onClick={() => setActiveTab('schema')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'schema' ? "bg-brand-gold text-black shadow-lg" : "text-neutral-500 hover:text-white"
          )}
        >
          Input Schema Design
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'prompts' ? (
          <div className="space-y-8">
            {/* Model Configuration */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                  <Terminal size={24} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Model Infrastructure</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Primary Engine (Sonnet)</label>
                  <input 
                    value={settings.model_id_primary}
                    onChange={(e) => setSettings({...settings, model_id_primary: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:border-brand-gold/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Fast Engine (Haiku)</label>
                  <input 
                    value={settings.model_id_fast}
                    onChange={(e) => setSettings({...settings, model_id_fast: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:border-brand-gold/50 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Core Prompts */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">System Prompts</h3>
              </div>
              
              <div className="space-y-10">
                {[
                  { key: 'prompt_scenario_init', label: 'Story Ignition (Init)' },
                  { key: 'prompt_episode_outline', label: 'Narrative Outline' },
                  { key: 'prompt_episode_script', label: 'Cinematic Scripting' },
                  { key: 'prompt_scenario_rewrite', label: 'Script Refinement (Rewrite)' },
                ].map((p) => (
                  <div key={p.key} className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">{p.label}</label>
                    <textarea 
                      value={settings[p.key]}
                      onChange={(e) => setSettings({...settings, [p.key]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xs font-medium text-neutral-300 focus:border-brand-gold/50 outline-none transition-all h-64 resize-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 rounded-2xl bg-brand-gold/10 text-brand-gold">
                <Database size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Dynamic Input Schema</h3>
            </div>
            
            <SchemaFieldDesigner 
              fields={settings.schema_fields} 
              onUpdate={(fields) => setSettings({...settings, schema_fields: fields})}
            />
          </section>
        )}
      </div>
    </div>
  );
}
