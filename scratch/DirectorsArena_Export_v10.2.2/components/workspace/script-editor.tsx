"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScriptElement } from "@/lib/utils/script-parser";

interface ScriptEditorProps {
  elements: ScriptElement[];
  onSteerBlock: (element: ScriptElement) => void;
  isLoading?: boolean;
  activeSteeringId?: string | null;
  steeringConsole?: React.ReactNode;
}

export function ScriptEditor({ elements, onSteerBlock, isLoading, activeSteeringId, steeringConsole }: ScriptEditorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-mono text-sm leading-[1.8] text-zinc-300 pb-40">
      {elements.map((el, idx) => (
       <React.Fragment key={el.id + idx}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          onMouseEnter={() => setHoveredId(el.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={cn(
            "group relative px-12 py-3 rounded-2xl transition-all duration-300",
            hoveredId === el.id ? "bg-white/[0.03] shadow-xl" : "bg-transparent",
            el.type === 'CHARACTER' ? "text-center mt-8" :
            el.type === 'DIALOGUE' ? "text-center px-16 lg:px-32 flex flex-col items-center" :
            el.type === 'PARENTHETICAL' ? "text-center text-zinc-500 italic text-[12px]" :
            el.type === 'HEADING' ? "text-white font-black uppercase mt-12 bg-white/5 inline-block px-4 py-1" :
            "text-zinc-400"
          )}
        >
          {/* AI Steer Trigger */}
          <AnimatePresence>
            {hoveredId === el.id && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={() => onSteerBlock(el)}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-gold text-black flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-110 active:scale-95 transition-all z-50 shrink-0"
              >
                <Sparkles size={16} className="animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Content Rendering */}
          <div className={cn(
             "relative",
             el.type === 'CHARACTER' && "font-black tracking-[0.2em] text-white",
             el.type === 'DIALOGUE' && "max-w-md w-full",
             el.type === 'ACTION' && "leading-relaxed"
          )}>
            {el.type === 'DIALOGUE' && (
              <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-brand-gold/20" />
            )}
            {el.content}
          </div>

          {/* Type Indicator (Subtle) */}
          {hoveredId === el.id && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30">
               <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest">{el.type}</span>
            </div>
          )}
        </motion.div>
        
        {/* Inline Steering Console Injection */}
        <AnimatePresence>
          {activeSteeringId === el.id && steeringConsole && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="w-full px-4 md:px-12 pt-2 pb-8 overflow-hidden z-20"
            >
              {steeringConsole}
            </motion.div>
          )}
        </AnimatePresence>
      </React.Fragment>
      ))}

      {elements.length === 0 && (
         <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
            <Wand2 size={40} className="mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Ready to Scribe</p>
         </div>
      )}
    </div>
  );
}
