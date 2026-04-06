"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ProjectCard, Project } from "@/components/dashboard/project-card";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export function ProjectSlider({ projects, className }: { projects: Project[], className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 352; // Card width (320) + gap (32)
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
        <Link href="/create-project" className="flex-shrink-0 snap-center sm:snap-start block h-full">
          <div className="w-[320px] h-[450px] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group/add cursor-pointer flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-900 group-hover:bg-brand-gold transition-all flex items-center justify-center shadow-2xl group-hover:rotate-90">
               <span className="text-4xl text-neutral-700 group-hover:text-black font-black">+</span>
            </div>
            <div className="text-center">
              <p className="text-neutral-500 font-extrabold group-hover:text-brand-gold uppercase tracking-[0.4em] text-[10px]">Start New Narrative</p>
              <p className="text-[10px] text-neutral-800 uppercase tracking-widest mt-2">Initialize Void</p>
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
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
