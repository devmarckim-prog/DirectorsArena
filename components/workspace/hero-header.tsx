// components/workspace/hero-header.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project } from "./types";
import { Check, Edit3, X, Share2, FileText, Download, Link as LinkIcon, Loader2 } from "lucide-react";
import { exportToFDX } from "@/lib/utils/export-fdx";
import { exportToDOCX } from "@/lib/utils/export-docx";

interface HeroHeaderProps {
  project: Project;
  metadata: any;
  masterMode: 'SCENARIO' | 'PRODUCTION';
  scenarioTab: string;
  setScenarioTab: (tab: any) => void;
  productionTab: string;
  setProductionTab: (tab: any) => void;
  onUpdateProject?: (updates: any) => Promise<any>;
}

export function HeroHeader({
  project,
  metadata,
  masterMode,
  scenarioTab,
  setScenarioTab,
  productionTab,
  setProductionTab,
  onUpdateProject
}: HeroHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  // v3.16 Dynamic Title Splitting Logic
  const safeTitle = project.title || "Untitled Project";
  const titleParts = safeTitle.split(/[()]/);
  const mainTitle = titleParts[0].trim();
  const subTitle = titleParts[1] ? titleParts[1].trim() : (project.subtitle?.replace(/[()]/g, '') || (mainTitle !== "Untitled Project" ? mainTitle.toUpperCase() : "DRAMA AI"));

  const [editValue, setEditValue] = useState(mainTitle);
  const [editSubtitle, setEditSubtitle] = useState(subTitle);

  useEffect(() => {
    const syncTitle = project.title || "";
    setEditValue(syncTitle || "Untitled Project");
    setEditSubtitle(project.subtitle || "");
  }, [project.title, project.subtitle]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareConfig, setShareConfig] = useState(
    (typeof project.generated_content === 'string' ? JSON.parse(project.generated_content).shareConfig : (project.generated_content as any)?.shareConfig) || {}
  );
  const [isTogglingShare, setIsTogglingShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleShare = async (enable: boolean) => {
    setIsTogglingShare(true);
    try {
      const res = await fetch(`/api/project/${project.id}/share`, {
        method: 'POST',
        body: JSON.stringify({ enable })
      });
      const data = await res.json();
      if (data.success) {
        setShareConfig(data.shareConfig);
      }
    } catch (e) {
      console.error("Failed to toggle share", e);
    }
    setIsTogglingShare(false);
  };

  const handleCopyLink = () => {
    if (!shareConfig.token) return;
    const url = `${window.location.origin}/share/${shareConfig.token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFDX = () => {
    const allScripts = project.episodes?.map(e => e.script_content).filter(Boolean).join('\n\n') || "";
    exportToFDX(project.title, allScripts);
  };

  const handleExportDOCX = () => {
    const allScripts = project.episodes?.map(e => e.script_content).filter(Boolean).join('\n\n') || "";
    exportToDOCX(project.title, allScripts);
  };

  const handleSave = async () => {
    if (onUpdateProject) {
      await onUpdateProject({ 
        title: editValue.trim(),
        subtitle: editSubtitle.trim()
      });
    }
    setIsEditing(false);
  };

  // v6.20 Dynamic Theme Logic
  const isCyberpunk = project.world?.toLowerCase().includes('cyberpunk') || project.genre?.toLowerCase().includes('cyberpunk');
  const themeShadow = isCyberpunk 
    ? '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)'
    : '0 0 40px rgba(197, 160, 89, 0.4), 0 0 80px rgba(197, 160, 89, 0.1)';
  const glowColor = isCyberpunk ? 'bg-cyan-500/[0.08]' : 'bg-brand-gold/[0.05]';

  return (
    <header className="sticky top-24 z-40 bg-[#050505] pt-4 pb-2 flex flex-col items-center w-full backdrop-blur-3xl">
      
      {/* EXPORT & SHARE BUTTON */}
      <div className="absolute right-0 top-4 z-50 animate-in fade-in slide-in-from-right-4 duration-1000">
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-brand-gold/30 rounded-full bg-brand-gold/10 hover:bg-brand-gold/20 transition-all group shadow-[0_0_15px_rgba(197,160,89,0.1)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
        >
          <Share2 size={14} className="text-brand-gold group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">Export / Share</span>
        </button>
      </div>

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-[500px] bg-neutral-950 border border-brand-gold/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] relative">
            <button onClick={() => setIsShareModalOpen(false)} className="absolute top-6 right-6 text-neutral-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black mb-2 uppercase tracking-widest">Share & Export</h2>
            <p className="text-xs text-neutral-400 mb-8 font-medium">Export industry standard formats or generate a read-only link.</p>

            <div className="mb-10">
              <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-4 border-b border-white/10 pb-2">Export Document</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => window.open(`/print/deck/${project.id}`)} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                  <FileText className="text-brand-gold group-hover:scale-110 transition-transform" size={20} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">Pitch Deck</div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest">PDF Export</div>
                  </div>
                </button>
                <button onClick={() => window.open(`/print/script/${project.id}`)} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                  <FileText className="text-brand-gold group-hover:scale-110 transition-transform" size={20} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest">Script</div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest">PDF Export</div>
                  </div>
                </button>
                <button onClick={handleExportFDX} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                  <Download className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-blue-400">Final Draft</div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest">.FDX</div>
                  </div>
                </button>
                <button onClick={handleExportDOCX} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group">
                  <Download className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-blue-500">MS Word</div>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest">.DOCX</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-4 border-b border-white/10 pb-2">Read-Only Web Link</h3>
              {shareConfig.enabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-2 pl-4">
                    <LinkIcon size={14} className="text-neutral-500" />
                    <input type="text" readOnly value={`${window.location.origin}/share/${shareConfig.token}`} className="bg-transparent text-xs text-neutral-300 w-full outline-none" />
                    <button onClick={handleCopyLink} className="px-4 py-2 bg-brand-gold text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform whitespace-nowrap">
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <button onClick={() => handleToggleShare(false)} disabled={isTogglingShare} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                    {isTogglingShare ? <Loader2 size={12} className="animate-spin" /> : null} Disable Link
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="text-xs text-neutral-500 font-medium">Link sharing is disabled.</div>
                  <button onClick={() => handleToggleShare(true)} disabled={isTogglingShare} className="px-4 py-2 bg-white border border-white/10 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
                    {isTogglingShare ? <Loader2 size={12} className="animate-spin" /> : null} Generate Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      <div className="flex justify-center items-center gap-2 mb-1 animate-in fade-in slide-in-from-top-4 duration-1000 scale-90 md:scale-100 origin-center w-full">
        <div className="px-2 py-[2px] border border-brand-gold/40 bg-brand-gold/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-brand-gold uppercase tracking-[0.2em] leading-none mt-[1px]">{project.platform}</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.genre}</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.episodes?.length || project.episode_count} EPS</span>
        </div>
        <div className="px-2 py-[2px] border border-white/10 bg-white/5 rounded-full backdrop-blur-md flex items-center justify-center">
          <span className="text-[7.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mt-[1px]">{project.duration} MIN</span>
        </div>
      </div>

      {/* MAIN TITLE (Editable) */}
      <div className="relative mb-1 text-center flex flex-col items-center justify-center w-full group">
        {isEditing ? (
          <div className="flex flex-col items-center gap-2 z-20">
            <div className="flex items-center gap-4">
              <input
                autoFocus
                className="bg-transparent border-b-2 border-brand-gold text-white text-3xl md:text-[50px] font-black font-serif text-center outline-none px-4 py-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Korean Title"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
              />
              <div className="flex flex-col gap-1">
                <button onClick={handleSave} className="p-2 bg-brand-gold text-black rounded-full hover:scale-110 transition-transform">
                  <Check size={18} strokeWidth={3} />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 text-white rounded-full hover:scale-110 transition-transform">
                  <X size={18} />
                </button>
              </div>
            </div>
            <input
              className="bg-transparent border-b border-brand-gold/30 text-brand-gold text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] text-center outline-none px-2 py-1 w-full max-w-md"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="English Title / Subtitle"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setIsEditing(false);
              }}
            />
          </div>
        ) : (
          <div className="relative cursor-pointer group" onClick={() => setIsEditing(true)}>
            <motion.h1 
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "text-3xl md:text-[68px] font-black font-serif uppercase tracking-tighter text-white leading-none relative z-10",
                "text-center px-6 md:px-0 group-hover:text-brand-gold/90 transition-colors"
              )}
              style={{ textShadow: themeShadow }}
            >
              {mainTitle}
            </motion.h1>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gold/10 p-2 rounded-full border border-brand-gold/20">
              <Edit3 size={20} className="text-brand-gold" />
            </div>
          </div>
        )}

        {/* EN SUB */}
        {!isEditing && (
          <span className="text-[12px] md:text-[13px] font-black text-brand-gold uppercase tracking-[1em] md:tracking-[1.25em] mt-2 ml-[1em] md:ml-[1.25em] opacity-80">
            {(project.subtitle || subTitle || "").toUpperCase()}
          </span>
        )}

        <div className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 blur-[150px] h-48 w-[120%] rounded-full pointer-events-none -z-10",
          glowColor
        )} />
      </div>

      {/* NAVIGATION */}
      <nav className="flex justify-center gap-14 border-b border-white/5 w-full pb-2 mt-[16px] overflow-x-auto no-scrollbar relative z-20">
        {(masterMode === 'SCENARIO' ? [
          { id: 'BIBLE', label: 'Bible' },
          { id: 'UNIVERSE', label: 'Universe' },
          { id: 'SIMILAR', label: 'Similar Works' },
          { id: 'NAVIGATOR', label: 'Beat Sheet' }
        ] : [
          { id: 'CASTING', label: 'Casting' },
          { id: 'BUDGET', label: 'Budget' },
          { id: 'BREAKDOWN', label: 'Breakdown' },
          { id: 'PPL', label: 'PPL' }
        ]).map(tab => {
          const isActive = masterMode === 'SCENARIO' ? scenarioTab === tab.id : productionTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (masterMode === 'SCENARIO') setScenarioTab(tab.id as any);
                else setProductionTab(tab.id as any);
              }}
              className={cn(
                "relative text-[13px] font-medium uppercase tracking-[0.15em] pb-3 transition-all duration-300 font-mono",
                isActive ? "text-brand-gold" : "text-text-tertiary hover:text-white"
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.4)]" 
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
