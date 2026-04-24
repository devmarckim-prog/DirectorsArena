"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Database, ShieldAlert, LayoutDashboard, Film, Skull, Trash2, Settings, Loader2 } from "lucide-react";
import {
  fetchProjectsAction, fetchAdminStatsAction, deleteProjectAction,
  purgeAllProjectsAction, getAdminSettingsAction, updateAdminSettingsAction,
  resetPromptsToDefaultAction, insertSampleProjectsAction, updateProjectAction
} from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Save, Edit3 } from "lucide-react";

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scripts' | 'prompts'>('dashboard');
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<{ total: number; today: number; completed: number; costUsd: string; episodeCount: number; dailyCosts: { date: string; cost: number }[] }>({ 
    total: 0, today: 0, completed: 0, costUsd: "0.00", episodeCount: 0, dailyCosts: [] 
  });
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // v6.0 CMS State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    genre: '',
    logline: '',
    epicNarrative: ''
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projData, statData, settingsData] = await Promise.all([
        fetchProjectsAction(),
        fetchAdminStatsAction(),
        getAdminSettingsAction()
      ]);
      setProjects(projData || []);
      setStats(statData);
      setSettings(settingsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAllData(); }, []);

  const handleDelete = (id: string) => {
    console.log("Admin: Requesting deletion for ID:", id);
    setConfirmDeleteId(id);
  };

  const executeDelete = async (id: string) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        console.log("Admin: Deletion successful");
        await loadAllData();
      } else {
        alert("삭제 실패: " + res.error);
      }
    } catch (err) {
      console.error("Deletion error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (project: any) => {
    let epicNarrative = "";
    let logline = project.logline || "";

    try {
      if (typeof project.synopsis === 'string' && project.synopsis.startsWith('{')) {
        const syn = JSON.parse(project.synopsis);
        epicNarrative = syn.story?.epicNarrative || syn.epicNarrative || "";
        if (!logline) logline = syn.story?.logline || syn.logline || "";
      }
    } catch (e) {
      console.error("Failed to parse synopsis for editing", e);
    }

    setEditForm({
      title: project.title || "",
      genre: project.genre || "",
      logline: logline,
      epicNarrative: epicNarrative
    });
    setEditingProjectId(project.id);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProjectId) return;
    setIsSaving(true);

    try {
      // Reconstruct Synopsis JSON (v6.0 UX Standard)
      const currentProject = projects.find(p => p.id === editingProjectId);
      let existingSynopsis = {};
      try {
        if (currentProject?.synopsis) {
          existingSynopsis = typeof currentProject.synopsis === 'string' 
            ? JSON.parse(currentProject.synopsis) 
            : currentProject.synopsis;
        }
      } catch (e) {}

      const updatedSynopsis = {
        ...existingSynopsis,
        story: {
          ...(existingSynopsis as any).story,
          logline: editForm.logline,
          epicNarrative: editForm.epicNarrative
        }
      };

      const result = await updateProjectAction(editingProjectId, {
        title: editForm.title,
        genre: editForm.genre,
        logline: editForm.logline,
        synopsis: JSON.stringify(updatedSynopsis)
      });

      if (result.success) {
        setIsEditModalOpen(false);
        await loadAllData();
        alert("프로젝트 수정 사항이 저장되었습니다.");
      } else {
        alert("수정 실패: " + result.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeAll = async () => {
    const code = prompt("모든 프로젝트를 삭제합니다. 동의하시면 'DELETE ALL'을 입력하세요.");
    if (code === "DELETE ALL") {
      setLoading(true);
      await purgeAllProjectsAction();
      await loadAllData();
      alert("전체 데이터베이스가 초기화 되었습니다.");
    }
  };

  const handleInsertSample = async () => {
    setIsSaving(true);
    const res = await insertSampleProjectsAction();
    if (res.success) { await loadAllData(); alert("Elite Sample Set Injected Successfully"); }
    else { alert("Injection Failed"); }
    setIsSaving(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateAdminSettingsAction(settings);
    alert(res.success ? "Settings Saved Successfully." : "Save Failed");
    setIsSaving(false);
  };

  const handleResetDefaults = async () => {
    if (!confirm("모든 시스템 프롬프트를 공장 초기화하시겠습니까?")) return;
    setIsSaving(true);
    const res = await resetPromptsToDefaultAction();
    if (res.success) {
      const freshData = await getAdminSettingsAction();
      setSettings(freshData);
      alert("Prompts Reset to Default.");
    } else { alert("Reset Failed"); }
    setIsSaving(false);
  };

  const handleSettingChange = (field: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const tabClass = (tab: string) => cn(
    "flex items-center space-x-3 px-6 py-4 rounded-2xl w-full transition-all duration-300 font-black uppercase tracking-widest text-xs",
    activeTab === tab
      ? "bg-brand-gold text-black shadow-[0_0_30px_rgba(197,160,89,0.3)]"
      : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
  );

  const PROMPT_FIELDS = [
    { id: 'prompt_episode_script', label: 'Main Episode Script (Critical)', rows: 12 },
    { id: 'prompt_scenario_rewrite', label: 'Micro-Generation Rewrite (Interactive)', rows: 3 },
    { id: 'prompt_scenario_init', label: 'Scenario Initialization', rows: 3 },
    { id: 'prompt_episode_outline', label: 'Episode Outlining', rows: 3 },
    { id: 'prompt_similar_content', label: 'Similar Content Recommendation', rows: 3 },
    { id: 'prompt_prod_casting', label: 'Production - Casting', rows: 3 },
    { id: 'prompt_prod_budget', label: 'Production - Budget', rows: 3 },
    { id: 'prompt_prod_breakdown', label: 'Production - Script Breakdown', rows: 3 },
    { id: 'prompt_prod_ppl_location', label: 'Production - PPL & Location', rows: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 font-sans relative overflow-x-hidden pt-24 pb-32">
      <BackgroundPaths />

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-10">

        {/* SIDEBAR */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <div className="mb-10">
              <div className="inline-flex items-center space-x-3 bg-red-950/30 text-red-500 border border-red-900/50 px-4 py-2 rounded-full mb-6">
                <ShieldAlert size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Admin Access</span>
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-tight">
                Admin<br /><span className="text-brand-gold">Dashboard</span>
              </h1>
            </div>

            <nav className="flex flex-col space-y-2">
              <button onClick={() => setActiveTab('dashboard')} className={tabClass('dashboard')}>
                <LayoutDashboard size={16} /><span>Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('scripts')} className={tabClass('scripts')}>
                <Film size={16} /><span>Project List</span>
              </button>
              <button onClick={() => setActiveTab('prompts')} className={tabClass('prompts')}>
                <Settings size={16} /><span>Models & Prompts</span>
              </button>
            </nav>

            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col space-y-4">
              <button
                onClick={handleInsertSample}
                disabled={isSaving}
                className="w-full py-4 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <span>Inject Sample Project</span>}
              </button>
              <button
                onClick={() => router.push("/project-list")}
                className="w-full py-4 text-neutral-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Return to App
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1">
          <AnimatePresence mode="wait">

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-white uppercase tracking-widest">Global Analytics</h2>
                  <p className="text-neutral-500 text-sm mt-2">8083 Supabase Cluster Telemetry</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  {[
                    { label: 'Total Project Nodes', value: stats.total, icon: <Database size={80} /> },
                    { label: 'Generated Episode Scripts', value: stats.episodeCount, icon: <Film size={80} />, gold: true },
                    { label: 'Completed Status', value: stats.completed, icon: null },
                    { label: 'Cumulative API Cost', value: `$${stats.costUsd} USD`, icon: null },
                  ].map((card, i) => (
                    <div key={i} className={cn(
                      "rounded-3xl p-8 backdrop-blur-md relative overflow-hidden border",
                      card.gold ? "bg-brand-gold/10 border-brand-gold/20" : "bg-white/5 border-white/10"
                    )}>
                      {card.icon && (
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          {card.icon}
                        </div>
                      )}
                      <h3 className={cn("text-[10px] font-black uppercase tracking-widest mb-2", card.gold ? "text-brand-gold/60" : "text-neutral-500")}>
                        {card.label}
                      </h3>
                      <span className={cn("text-4xl font-black", card.gold ? "text-brand-gold" : "text-white")}>
                        {card.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* DAILY COST TREND (v7.2 Telemetry UI) */}
                <div className="mb-12">
                   <div className="flex items-center space-x-3 mb-6">
                      <Settings className="text-brand-gold animate-spin-slow" size={16} />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Daily API Expenditure Trend</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.dailyCosts && stats.dailyCosts.length > 0 ? stats.dailyCosts.map((d: any, i: number) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                           <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">{d.date}</span>
                           <div className="flex items-baseline space-x-1">
                              <span className="text-xl font-black text-white">${d.cost.toFixed(3)}</span>
                              <span className="text-[10px] font-bold text-neutral-600">USD</span>
                           </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-10 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl text-center">
                           <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">No telemetry data available for the last 7 days.</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-10 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 opacity-[0.03]">
                    <Skull size={300} className="text-red-500" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 flex items-center space-x-3">
                        <ShieldAlert className="text-red-500" /><span>Danger Zone</span>
                      </h3>
                      <p className="text-sm text-neutral-400">Permanently erase all generated projects from the Supabase V2 cluster.</p>
                    </div>
                    <button onClick={handlePurgeAll} className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-colors whitespace-nowrap">
                      Purge Database
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCRIPTS TAB */}
            {activeTab === 'scripts' && (
              <motion.div key="scripts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Project Registry</h2>
                    <p className="text-neutral-500 text-sm mt-2">All system-generated narrative projects</p>
                  </div>
                  <button onClick={loadAllData} className="px-5 py-2 bg-white/5 hover:bg-white/10 font-bold text-xs uppercase tracking-widest border border-white/10 rounded-full transition-colors">
                    Refresh
                  </button>
                </div>

                <div className="bg-black/60 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="py-6 px-8 text-[10px] font-black text-neutral-500 uppercase tracking-widest">ID / Title</th>
                        <th className="py-6 px-8 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Status</th>
                        <th className="py-6 px-8 text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={3} className="py-20 text-center text-xs font-black text-brand-gold uppercase tracking-[0.2em] animate-pulse">Initializing Nodes...</td></tr>
                      ) : projects.length === 0 ? (
                        <tr><td colSpan={3} className="py-20 text-center text-sm font-black text-neutral-600 uppercase tracking-widest">No Projects Found.</td></tr>
                      ) : projects.map((p) => {
                        let displayTitle = p.title;
                        let displayGenre = p.genre;
                        
                        // v3.12 Dynamic Extraction for Registry
                        if (typeof p.synopsis === 'string' && p.synopsis.startsWith('{')) {
                           try {
                             const meta = JSON.parse(p.synopsis);
                             displayTitle = p.title || meta?.title || meta?.story?.title || "Untitled Project";
                             displayGenre = p.genre || meta?.genre || meta?.story?.genre || "Unknown Genre";
                           } catch (e) { /* Fallback to raw */ }
                        }

                        return (
                          <tr key={p.id} className={cn("border-b border-white/5 hover:bg-white/[0.03] transition-colors", deletingId === p.id && "opacity-30")}>
                            <td className="py-6 px-8">
                              <span className="text-[10px] font-black text-neutral-600 bg-white/5 px-2 py-1 rounded-md block mb-1">{p.id.split('-')[0]}</span>
                              <span className="font-black text-lg text-white font-serif italic block">{displayTitle}</span>
                              <span className="text-[11px] font-black text-brand-gold/60 uppercase tracking-widest">{displayGenre}</span>
                            </td>
                            <td className="py-6 px-8 align-middle">
                              <span className={cn(
                                "px-3 py-1 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border",
                                p.status === 'COMPLETED' ? "border-green-500/30 text-green-500" : "border-brand-gold/30 text-brand-gold"
                              )}>
                                {p.status}
                              </span>
                              <span className="text-xs text-neutral-500 block mt-1">{new Date(p.created_at).toLocaleDateString()}</span>
                            </td>
                            <td className="py-6 px-8 align-middle text-right">
                              <div className="flex items-center justify-end space-x-3">
                                <button 
                                  onClick={() => handleEditClick(p)}
                                  className="group px-5 py-2.5 border border-brand-gold/30 text-brand-gold bg-brand-gold/5 rounded-full hover:bg-brand-gold hover:text-black font-black uppercase tracking-widest text-[10px] transition-all flex items-center space-x-2"
                                >
                                  <Edit3 size={12} className="group-hover:scale-110 transition-transform" />
                                  <span>Edit</span>
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-red-600 hover:border-red-500 hover:text-white transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* PROMPTS & MODELS TAB */}
            {activeTab === 'prompts' && settings && (
              <motion.div key="prompts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Models & Prompts</h2>
                    <p className="text-neutral-500 text-sm mt-2">Control the Claude orchestration pipeline dynamically</p>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleResetDefaults} disabled={isSaving} className="px-5 py-2 bg-neutral-900 border border-red-900/50 text-red-500 hover:bg-red-900/20 font-bold text-xs uppercase tracking-widest rounded-full transition-colors">
                      Reset Defaults
                    </button>
                    <button onClick={handleSaveSettings} disabled={isSaving} className="px-5 py-2 bg-brand-gold text-black hover:bg-brand-gold/80 font-bold text-xs uppercase tracking-widest rounded-full transition-colors flex items-center gap-2">
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                      Save All
                    </button>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Model Selection */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-sm font-black text-brand-gold uppercase tracking-widest mb-6">Pipeline Models</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { field: 'model_id_primary', label: 'Primary Gen Model', note: 'Used for complex story generation and breakdowns.' },
                        { field: 'model_id_fast', label: 'Fast Analytics Model', note: 'Used for quick extractions (budget, comps).' },
                      ].map(m => (
                        <div key={m.field}>
                          <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">{m.label}</label>
                          <select
                            value={settings[m.field] || ''}
                            onChange={(e) => handleSettingChange(m.field, e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                          >
                            <option value="claude-sonnet-4-20250514">claude-sonnet-4-20250514 (Stable)</option>
                            <option value="claude-sonnet-3-5">claude-sonnet-3-5</option>
                            <option value="claude-haiku-4-5-20251001">claude-haiku-4-5-20251001</option>
                          </select>
                          <p className="text-[10px] text-neutral-600 mt-2">{m.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Engineering */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-sm font-black text-brand-gold uppercase tracking-widest mb-6">Modular System Prompts</h3>
                    <div className="space-y-8">
                      {PROMPT_FIELDS.map(pf => (
                        <div key={pf.id}>
                          <label className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase mb-2">
                            <span>{pf.label}</span>
                            <span className="text-[9px] text-neutral-600 font-mono bg-black/50 px-2 py-0.5 rounded">{pf.id}</span>
                          </label>
                          <textarea
                            value={settings[pf.id] || ''}
                            onChange={(e) => handleSettingChange(pf.id, e.target.value)}
                            rows={pf.rows}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono leading-relaxed text-neutral-300 focus:outline-none focus:border-brand-gold resize-y"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </main>

      {/* PROJECT EDIT MODAL (v6.0 CMS) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
                      <Edit3 size={18} className="text-brand-gold" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Edit Narrative Node</h2>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-1">ID: {editingProjectId}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar-slim">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Project Title</label>
                      <input 
                        type="text" 
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Genre Classification</label>
                      <input 
                        type="text" 
                        value={editForm.genre}
                        onChange={(e) => setEditForm(prev => ({ ...prev, genre: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Logline (Master Vision)</label>
                    <textarea 
                      value={editForm.logline}
                      onChange={(e) => setEditForm(prev => ({ ...prev, logline: e.target.value }))}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-medium leading-relaxed text-zinc-300 focus:outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3">Epic Narrative (Parsed JSON Context)</label>
                    <textarea 
                      value={editForm.epicNarrative}
                      onChange={(e) => setEditForm(prev => ({ ...prev, epicNarrative: e.target.value }))}
                      rows={10}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[12px] font-mono leading-relaxed text-zinc-400 focus:outline-none focus:border-brand-gold resize-y"
                    />
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-end space-x-4">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-10 py-4 bg-brand-gold text-black rounded-full font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{isSaving ? "Persisting..." : "Synchronize Database"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 border border-red-900/30 rounded-[32px] p-10 text-center shadow-[0_0_100px_rgba(255,0,0,0.1)]"
            >
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Excision Protocol</h2>
              <p className="text-sm text-neutral-400 mb-10 leading-relaxed">
                정말 이 프로젝트를 영구적으로 말소하시겠습니까?<br />
                <span className="text-red-500/60 font-mono text-[10px]">Warning: This action is irreversible.</span>
              </p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => executeDelete(confirmDeleteId)}
                  className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="w-full py-5 text-neutral-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  Abort Operation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
