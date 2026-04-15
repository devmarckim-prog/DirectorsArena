"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WriterLoader } from "@/components/ui/writer-loader";
import { ProjectGridSlot } from "@/components/project-list/project-grid-slot";
import { ProjectCard, Project } from "@/components/project-list/project-card";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Database, Sparkles } from "lucide-react";
import { fetchProjectsAction, deleteProjectAction, insertSampleProjectsAction } from "@/app/actions";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState(1200);

  const handleDeleteProject = async (id: string | number) => {
    // 1. Kinetic Zero-Delay Response with Strict Normalization
    const targetId = String(id).trim().toLowerCase();
    console.log("[DELETE] Target ID Normalized:", targetId);
    
    // UI 즉시 업데이트 (Strict Comparison)
    setTimeout(() => {
      setProjects(prev => {
        const after = prev.filter(p => String(p.id).trim().toLowerCase() !== targetId);
        console.log(`[DELETE] UI Sync: ${prev.length} -> ${after.length}`);
        return after;
      });
    }, 0);

    // 2. Server-side persistence (DB 연동)
    if (!targetId.startsWith('sample')) {
      try {
        const result = await deleteProjectAction(targetId);
        if (!result.success) {
          console.error("Supabase Deletion Failure:", result.error);
          alert("데이터베이스 수정 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
          // No rollback to ensure kinetic confidence unless user explicitly refreshes
        }
      } catch (err) {
        console.error("Deletion Process Error:", err);
      }
    }
  };

  // V5.0 SSOT: Fetch only real records from Supabase
  useEffect(() => {
    async function getProjects() {
      try {
        const data = await fetchProjectsAction();
        
        // v5.3 Zero-Bootstrapping: If DB is empty, auto-inject high-fidelity samples
        if (!data || data.length === 0) {
          console.log("[BOOTSTRAP] Database is empty. Injecting elite samples...");
          const syncResult = await insertSampleProjectsAction();
          if (syncResult.success) {
            const refreshedData = await fetchProjectsAction();
            setProjects(refreshedData as Project[]);
          }
        } else {
          setProjects(data as Project[]);
        }
      } catch (error) {
        console.error("Failed to load DB projects", error);
      } finally {
        const savedCredits = localStorage.getItem("directors_arena_credits");
        if (savedCredits) {
          setCredits(parseInt(savedCredits));
        }
        setIsLoading(false);
      }
    }
    getProjects();
  }, []);

  return (
    <div className="flex-1 flex flex-col pt-32 overflow-hidden relative bg-black">
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
                className="text-brand-gold font-black tracking-[0.5em] text-[10px] uppercase italic opacity-70"
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
            transition={{ duration: 1.2 }}
            className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-16 items-start mb-32"
          >
            <main className="w-full flex flex-col items-start overflow-visible">
              {/* Cinematic Title Group - STRICT LEFT ALIGNMENT */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mb-24 text-left flex flex-col items-start"
              >
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none italic">
                  내 프로젝트 <span className="text-brand-gold">슬레이트</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[1px] bg-brand-gold/30" />
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em] ml-1">
                    Architect your narrative legacy or manage the void.
                  </p>
                </div>
              </motion.div>

              {/* PROJECT GRID - 4 COLUMN SPREAD */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                <ProjectGridSlot />
                
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (idx * 0.1), duration: 0.8 }}
                  >
                    <ProjectCard 
                      project={project} 
                      onDelete={handleDeleteProject} 
                    />
                  </motion.div>
                ))}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
