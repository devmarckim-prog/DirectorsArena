"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WriterLoader } from "@/components/ui/writer-loader";
import { ProjectSlider } from "@/components/dashboard/project-slider";
import { Project } from "@/components/dashboard/project-card";
import { Database, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState(1200);

  // V1.01 Simulation: Smoothly progress BAKING projects
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects((prev) => 
        prev.map((p) => {
          if (p.status === 'BAKING' && p.progress < 100) {
            const nextProgress = p.progress + (100 / 15); // Standard 15s completion
            if (nextProgress >= 100) {
              return { ...p, progress: 100, status: 'COMPLETED' };
            }
            return { ...p, progress: nextProgress };
          }
          return p;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Persistence & Load Transparency
  useEffect(() => {
    const savedProjects = localStorage.getItem("directors_arena_projects");
    if (savedProjects) {
       setProjects(JSON.parse(savedProjects));
    } else {
      const defaultProject: Project = {
        id: "sample-1",
        platform: "OTT Series",
        genre: "Noir",
        logline: "A detective falls in love with a suspect in a rain-drenched city.",
        status: 'COMPLETED',
        progress: 100,
        characterCount: 4,
        world: "Tokyo Rain",
        characters: [],
        scenes: [],
      };
      setProjects([defaultProject]);
    }

    const savedCredits = localStorage.getItem("directors_arena_credits");
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
      const badge = document.getElementById('credits-badge');
      if (badge) badge.innerText = `${parseInt(savedCredits).toLocaleString()} Credits`;
    }

    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Save State Persistence
  useEffect(() => {
     if (projects.length > 0) {
        localStorage.setItem("directors_arena_projects", JSON.stringify(projects));
     }
  }, [projects]);

  return (
    <div className="flex-1 flex flex-col h-screen pt-24 overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center z-[200] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <WriterLoader className="mb-4" />
              <motion.p 
                className="text-brand-gold font-black tracking-[0.4em] text-[10px] uppercase italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Inscribing into the Void...
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col"
          >
            <main className="flex-1 flex flex-col justify-center">
              <div className="px-10 mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                    <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                      Project: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-700">Slate</span>
                    </h1>
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-[1px] bg-brand-gold/30" />
                       <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.8em]">Architecting Narratives</p>
                    </div>
                </motion.div>
              </div>

              <div className="relative">
                <ProjectSlider projects={projects} />
              </div>
            </main>

            <footer className="h-20 border-t border-white/5 px-10 flex items-center justify-between z-10">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Database size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Void Core Synchronized</span>
                </div>
                {projects.some(p => p.status === 'BAKING') && (
                  <div className="flex items-center space-x-2 text-brand-gold">
                    <Sparkles size={14} className="animate-spin-slow" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Processing Narrative Engine...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-neutral-800 uppercase tracking-widest text-[9px] font-black italic">
                 V1.01 RELAY • Safe Point Established
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
