"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WriterLoader } from "@/components/ui/writer-loader";
import { ProjectGridSlot } from "@/components/project-list/project-grid-slot";
import { ProjectCard, Project } from "@/components/project-list/project-card";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Database, Sparkles } from "lucide-react";
import { fetchProjectsAction, deleteProjectAction, insertSampleProjectsAction, fetchSystemAssetsAction, seedSystemAssetsAction } from "@/app/actions";

export default function ProjectListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [systemImages, setSystemImages] = useState<any[]>([]);
  const [credits, setCredits] = useState(1200);

  const handleDeleteProject = async (id: string | number) => {
    const targetId = String(id).trim().toLowerCase();
    
    setTimeout(() => {
      setProjects(prev => {
        const after = prev.filter(p => String(p.id).trim().toLowerCase() !== targetId);
        return after;
      });
    }, 0);

    if (!targetId.startsWith('sample')) {
      try {
        const result = await deleteProjectAction(targetId);
        if (!result.success) {
          console.error("Supabase Deletion Failure:", result.error);
          alert("데이터베이스 수정 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
        }
      } catch (err) {
        console.error("Deletion Process Error:", err);
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProjectsAction();
        
        if (!data || data.length === 0) {
          const syncResult = await insertSampleProjectsAction();
          if (syncResult.success) {
            const refreshedData = await fetchProjectsAction();
            setProjects(refreshedData as Project[]);
          }
        } else {
          setProjects(data as Project[]);
        }

        let assets = await fetchSystemAssetsAction('dummy_image');
        if (assets.length === 0) {
          await seedSystemAssetsAction();
          assets = await fetchSystemAssetsAction('dummy_image');
        }
        setSystemImages(assets);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        const savedCredits = localStorage.getItem("directors_arena_credits");
        if (savedCredits) {
          setCredits(parseInt(savedCredits));
        }
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col pt-20 overflow-hidden relative bg-black">
      <motion.div
        key="content"
        initial={{ 
          clipPath: "inset(50% 0 50% 0)", 
          opacity: 0,
          scale: 0.95
        }}
        animate={{ 
          clipPath: "inset(0% 0 0% 0)", 
          opacity: 1,
          scale: 1 
        }}
        transition={{ 
          duration: 1.5, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-8 items-start mb-12"
      >
        <main className="w-full flex flex-col items-start overflow-visible">
          {/* Cinematic Title Group - WIZARD PARITY VERSION */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-10 text-left flex flex-col items-start"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-0 leading-tight pt-4 pb-1 font-sans">
              내 프로젝트 슬레이트
            </h1>
            <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-widest mt-1">
              당신만의 서사를 시작하거나 관리하십시오.
            </p>
          </motion.div>

          {/* PROJECT GRID - MOBILE-FIRST RESPONSIVE LAYOUT */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
            <ProjectGridSlot />
            
            <AnimatePresence>
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + (idx * 0.05), duration: 0.8 }}
                >
                  <ProjectCard 
                    project={project} 
                    systemImages={systemImages}
                    onDelete={handleDeleteProject} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </motion.div>

      {/* Subtle Loading Aura (Localized) */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-12 right-12 z-50 flex items-center space-x-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5"
        >
          <WriterLoader className="scale-50" />
          <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.3em]">Syncing Void...</span>
        </motion.div>
      )}
    </div>
  );
}
