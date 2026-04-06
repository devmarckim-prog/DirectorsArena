"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Globe, Users, Scroll, Activity, 
  Shield, Cpu, Zap, Sparkles, MapPin, Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SoulsNexus } from "@/components/dashboard/souls-nexus";

interface Character {
  id: string;
  name: string;
  job: string;
  gender: string;
  age: number;
  secret: string;
  look: string;
  void: string;
  desire: string;
}

interface Scene {
  id: string;
  sceneNumber: number;
  location: string;
  time: string;
  summary: string;
  goal: string;
  status: string;
}

interface Project {
  id: string;
  platform: string;
  genre: string;
  logline: string;
  synopsis: string;
  internalConflict: string;
  externalConflict: string;
  characters: Character[];
  scenes: Scene[];
  world: string;
  duration: number;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<'blueprint' | 'souls' | 'timeline'>('blueprint');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("directors_arena_projects");
    if (saved) {
      const projects = JSON.parse(saved);
      const found = projects.find((p: any) => p.id === id);
      if (found) setProject(found);
    }
  }, [id]);

  const toggleSecret = (charId: string) => {
    setRevealedSecrets(prev => ({ ...prev, [charId]: !prev[charId] }));
  };

  if (!project) return null;

  return (
    <div className="min-h-screen pt-24 pb-32">
      {/* Terminal Header: The Triad Structure [v1.0.5] */}
      <div className="px-10 mb-6 relative">
        <div className="flex items-start justify-between min-h-[160px]">
           {/* [LEFT] The Production Anchor */}
           <div className="flex flex-col z-10">
              <button 
                onClick={() => router.push("/dashboard")}
                className="group flex items-center space-x-2 text-neutral-600 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Exit to Slate</span>
              </button>

              <div className="space-y-4">
                 <h1 className="text-6xl font-serif font-bold text-brand-gold italic leading-none tracking-tighter select-none">
                    {project.genre}
                 </h1>
                 
                 {/* Metric Cluster (Vertical Consolidation) */}
                 <div className="flex flex-col space-y-2 pl-1">
                    {[
                      project.platform,
                      project.genre,
                      `${project.duration} min`
                    ].map((flag) => (
                      <div key={flag} className="flex items-center space-x-2">
                         <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
                         <span className="text-[9px] font-black text-brand-gold/60 uppercase tracking-[0.3em] italic">({flag})</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* [CENTER] The Titanic Navigation (The 1, 2, 3 Rule) */}
           <div className="absolute left-1/2 top-[72px] -translate-x-1/2 flex items-center z-20">
              <div className="flex items-center space-x-20">
                {[
                  { id: 'blueprint', label: '01. BLUEPRINT' },
                  { id: 'souls', label: '02. SOULS' },
                  { id: 'timeline', label: '03. TIMELINE' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={cn(
                      "relative text-3xl font-black uppercase tracking-[0.1em] transition-all duration-500",
                      activeSection === tab.id 
                        ? "text-brand-gold scale-110" 
                        : "text-neutral-700 hover:text-neutral-400"
                    )}
                  >
                    {tab.label.split('. ')[1]}
                    {activeSection === tab.id && (
                      <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute -bottom-4 left-0 right-0 h-[3px] bg-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.5)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </button>
                ))}
              </div>
           </div>

           {/* [RIGHT] The Elegant Detail */}
           <div className="flex flex-col items-end text-right z-10 pt-2">
              <div className="max-w-[280px]">
                 <p className="text-[11px] font-serif italic text-neutral-500 leading-relaxed">
                    "{project.logline}"
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Content Panels */}
      <main className="px-10">
        <AnimatePresence mode="wait">
          {activeSection === 'blueprint' && (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-20 mt-6"
            >
              {/* Synopsis & Conflict */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
                    <div className="flex items-center space-x-3 mb-8">
                       <Scroll className="text-brand-gold" size={16} />
                       <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Expanded Vision & Legibility</h3>
                    </div>
                    <p className="text-lg text-neutral-300 leading-[2.2] italic font-serif">
                       {project.synopsis}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-brand-gold/20 transition-colors">
                       <div className="flex items-center space-x-3 mb-4">
                          <Activity className="text-brand-gold" size={14} />
                          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Internal Tension</h4>
                       </div>
                       <p className="text-neutral-300 text-sm leading-relaxed">{project.internalConflict}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-brand-gold/20 transition-colors">
                       <div className="flex items-center space-x-3 mb-4">
                          <Shield className="text-brand-gold" size={14} />
                          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">External Pressure</h4>
                       </div>
                       <p className="text-neutral-300 text-sm leading-relaxed">{project.externalConflict}</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'souls' && (
            <motion.div
              key="souls"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full pt-6"
            >
              <SoulsNexus characters={project.characters} />
            </motion.div>
          )}

          {activeSection === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative pl-12 sm:pl-20 py-10"
            >
              {/* The Gold Rail */}
              <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-gold via-brand-gold/50 to-transparent" />

              <div className="space-y-12">
                 {project.scenes?.map((scene) => (
                   <motion.div 
                     key={scene.id}
                     initial={{ opacity: 0, x: 10 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     className="relative flex flex-col sm:flex-row sm:items-center gap-6 group"
                   >
                     {/* The Node */}
                     <div className="absolute -left-[30px] sm:-left-[46px] w-4 h-4 rounded-full bg-neutral-950 border-2 border-brand-gold z-10 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-brand-gold"
                        />
                     </div>

                     <div className="flex-1 bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-brand-gold/20 transition-all duration-500">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                           <div className="flex items-center space-x-4">
                              <span className="text-xl font-black text-brand-gold italic tabular-nums">#{scene.sceneNumber}</span>
                              <div className="w-[1px] h-4 bg-white/10" />
                              <div className="flex items-center space-x-3 text-white/60">
                                 <MapPin size={12} className="text-brand-gold/50" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{scene.location}</span>
                              </div>
                           </div>
                           <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                                 <Clock size={10} className="text-neutral-500" />
                                 <span className="text-[9px] font-black text-neutral-500 uppercase">{scene.time}</span>
                              </div>
                              <div className="px-3 py-1 bg-brand-gold text-black rounded-full">
                                 <span className="text-[9px] font-black uppercase tracking-widest">Goal Status</span>
                              </div>
                           </div>
                        </div>
                        
                        <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic border-l-2 border-brand-gold/20 pl-6 py-2">
                           {scene.summary}
                        </p>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                              <Sparkles size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.2em]">{scene.goal}</span>
                           </div>
                           <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-neutral-500 hover:text-white hover:border-brand-gold/30 transition-all uppercase tracking-widest">
                              Generate Script
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer Metadata Calibration [v1.0.5] */}
      <footer className="fixed bottom-6 left-10 right-10 flex justify-between items-center pointer-events-none opacity-40">
        <span className="text-[9px] font-mono font-black text-white uppercase tracking-[0.3em]">
           Project ID: {project.id}
        </span>
        <span className="text-[9px] font-mono font-black text-white uppercase tracking-[0.3em]">
           Studio: {project.id.split('-')[1]?.substring(0, 8) || "VOID"} // {project.world}
        </span>
      </footer>
    </div>
  );
}
