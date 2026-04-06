"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Globe, Users, Scroll, Activity, 
  Shield, Cpu, Zap, Sparkles, MapPin, Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* Terminal Title & Navigation */}
      <div className="px-10 mb-12">
        <div className="flex items-center justify-between mb-8">
           <button 
             onClick={() => router.push("/dashboard")}
             className="group flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors"
           >
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Slate</span>
           </button>
           <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-brand-gold/40 uppercase tracking-[0.2em] font-mono">ID: {project.id}</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div>
              <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                 {project.genre} <span className="text-neutral-500">Narrative</span>
              </h1>
              <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                 <span className="text-brand-gold">{project.platform}</span>
                 <span className="text-neutral-800">•</span>
                 <span>Focus: {project.world}</span>
              </div>
           </div>

           {/* Tab Navigation */}
           <div className="flex space-x-12 border-b border-white/5 pb-2">
              {[
                { id: 'blueprint', label: '01. BLUEPRINT' },
                { id: 'souls', label: '02. SOULS' },
                { id: 'timeline', label: '03. TIMELINE' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={cn(
                    "relative text-[10px] font-black uppercase tracking-[0.3em] transition-colors pb-4",
                    activeSection === tab.id ? "text-brand-gold" : "text-neutral-600 hover:text-white"
                  )}
                >
                  {tab.label}
                  {activeSection === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold"
                    />
                  )}
                </button>
              ))}
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
              className="space-y-20"
            >
              {/* Hero Logline */}
              <section className="py-20 border-y border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem]">
                 <div className="max-w-4xl mx-auto text-center px-10">
                    <div className="w-12 h-[1px] bg-brand-gold/30 mx-auto mb-10" />
                    <p className="text-[10px] font-black text-brand-gold/40 uppercase tracking-[0.8em] mb-6 italic">The Narrative Seed</p>
                    <h2 className="text-3xl md:text-5xl font-serif italic font-black text-brand-gold leading-relaxed">
                      "{project.logline}"
                    </h2>
                 </div>
              </section>

              {/* Synopsis & Conflict */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
                    <div className="flex items-center space-x-3 mb-8">
                       <Scroll className="text-brand-gold" size={16} />
                       <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Expanded Synopsis</h3>
                    </div>
                    <p className="text-lg text-neutral-300 leading-loose italic font-serif">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(project.characters && project.characters.length > 0) ? (
                project.characters.map((char) => (
                  <div key={char.id} className="bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold/20 group-hover:bg-brand-gold transition-colors" />
                    
                    <div className="flex justify-between items-start mb-10">
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">{char.name}</h3>
                          <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{char.job || 'Protagonist'}</p>
                       </div>
                       <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                          <span className="text-[8px] font-black text-neutral-500 uppercase">{char.age}Y • {char.gender}</span>
                       </div>
                    </div>

                    <div className="space-y-6 flex-1">
                       <div className="space-y-2">
                          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">The Void (Wound)</span>
                          <p className="text-xs text-neutral-400 italic">"{char.void || 'A missing piece of their history.'}"</p>
                       </div>
                       <div className="space-y-4 pt-4 border-t border-white/5">
                          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Classified Secret</span>
                          <div className="bg-black/40 rounded-2xl p-6 relative">
                             <motion.p 
                               animate={{ filter: revealedSecrets[char.id] ? "blur(0px)" : "blur(8px)", opacity: revealedSecrets[char.id] ? 1 : 0.3 }}
                               className="text-sm text-brand-gold font-bold select-none italic"
                             >
                                {char.secret || "No secret registered to this soul."}
                             </motion.p>
                             {!revealedSecrets[char.id] && (
                               <button 
                                 onClick={() => toggleSecret(char.id)}
                                 className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-[0.3em] hover:text-brand-gold transition-colors"
                               >
                                  Reveal Secret
                               </button>
                             )}
                             {revealedSecrets[char.id] && (
                               <button 
                                 onClick={() => toggleSecret(char.id)}
                                 className="absolute top-2 right-4 text-[7px] font-black text-neutral-800 uppercase hover:text-brand-gold transition-colors"
                               >
                                  Hide
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <p className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.5em]">No Souls detected in this project's Void.</p>
                </div>
              )}
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
                 {project.scenes.map((scene) => (
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
    </div>
  );
}
