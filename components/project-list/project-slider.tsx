"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ProjectCard, Project } from "@/components/project-list/project-card";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export function ProjectSlider({ 
  projects, 
  onDeleteProject,
  className 
}: { 
  projects: Project[], 
  onDeleteProject?: (id: string | number) => void,
  className?: string 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 372; // Card width (340) + gap (32)
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-20 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => scroll("left")}
          className="p-3 rounded-full bg-neutral-900 border border-white/10 text-white hover:bg-brand-gold hover:text-black transition-all shadow-2xl"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => scroll("right")}
          className="p-3 rounded-full bg-neutral-900 border border-white/10 text-white hover:bg-brand-gold hover:text-black transition-all shadow-2xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex space-x-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Link href="/project-wizard" className="flex-shrink-0 snap-center sm:snap-start block h-full">
          <div className="w-[340px] h-[480px] rounded-2xl border border-dashed border-white/15 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 transition-all group/add cursor-pointer flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-full border border-white/20 group-hover:border-[#C5A059] transition-all flex items-center justify-center">
               <span className="text-2xl text-white/40 group-hover:text-[#C5A059] font-light transition-colors">+</span>
            </div>
            <div className="text-center">
               <p className="text-white/40 font-medium group-hover:text-[#C5A059] text-xs transition-colors">New Project</p>
            </div>
          </div>
        </Link>

        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 snap-center sm:snap-start"
          >
            <ProjectCard project={project} onDelete={onDeleteProject} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
