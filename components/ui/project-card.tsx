"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Rotate3d, Edit, Trash2, User } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  id: number;
  title: string;
  category: string;
  isSample?: boolean;
  logline: string;
  image: string;
  author?: string;
  date?: string;
  className?: string;
}

export function ProjectCard({
  title,
  category,
  isSample = false,
  logline,
  image,
  author = "Anonymous Director",
  date = "2026.04.06",
  className
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const gold = "#C5A059";

  return (
    <div 
      className={cn("relative w-[300px] h-[420px] cursor-pointer group perspective-1000", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          {/* Top Indicators */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
              {category}
            </span>
            {isSample && (
              <span className="px-2 py-1 rounded bg-brand-gold text-black text-[10px] font-black uppercase tracking-tighter">
                SAMPLE
              </span>
            )}
          </div>

          {/* Card Image Area */}
          <div className="relative h-1/2 w-full overflow-hidden">
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          </div>

          {/* Card Meta Info */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors">
                {title}
              </h3>
              <div className="flex items-center space-x-2 text-neutral-500 text-xs">
                <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                  <User size={10} />
                </div>
                <span>{author}</span>
                <span>•</span>
                <span>{date}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <div className="flex space-x-3 text-neutral-400">
                <button 
                  className="hover:text-white transition-colors p-1"
                  onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}
                >
                  <Edit size={16} />
                </button>
                <div className="relative group/delete">
                  <button 
                    disabled={isSample}
                    className={cn(
                      "transition-colors p-1",
                      isSample ? "text-neutral-700 cursor-not-allowed" : "hover:text-red-500"
                    )}
                    onClick={(e) => { e.stopPropagation(); /* Delete logic */ }}
                  >
                    <Trash2 size={16} />
                  </button>
                  {isSample && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 text-[10px] text-white rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      샘플 프로젝트는 삭제가 제한됩니다.
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                className="text-neutral-500 hover:text-brand-gold transition-colors flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest"
                onClick={handleFlip}
              >
                <span>Logline</span>
                <Rotate3d size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-[#0F0F0F] border border-brand-gold/20 overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.1)] flex flex-col p-8 justify-center items-center text-center transform rotate-y-180"
        >
          <div className="absolute top-4 left-4">
             <Rotate3d size={20} className="text-brand-gold opacity-20" />
          </div>
          
          <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block">
            The Logline
          </span>
          
          <p className="text-neutral-300 text-lg leading-relaxed font-serif italic max-w-[80%] mx-auto">
            "{logline}"
          </p>

          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="h-[1px] w-8 bg-brand-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            <div className="h-[1px] w-8 bg-brand-gold/30" />
          </div>

          <button 
            className="mt-12 text-neutral-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
            onClick={handleFlip}
          >
            ← Back to Cover
          </button>
        </div>
      </motion.div>
      
    </div>
  );
}
