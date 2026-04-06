"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * WriterLoader: Surgical Motion Refinement
 * Focuses on 'Action' rather than static icons.
 * 1. Pen Nib: Tilted 15deg, cursive travel path.
 * 2. Ink Drop: Vertical drop with splash.
 * 3. Script: Lines fade-in during motion.
 */
export function WriterLoader({ className, size = 100 }: { className?: string; size?: number }) {
  const gold = "#C5A059";

  return (
    <div className={cn("relative flex items-center justify-center max-w-full overflow-hidden", className)} style={{ width: "min(100%, 300px)", height: size }}>
      
      {/* 1. Script / Paper (Static Base with Dynamic Lines) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          {/* Paper Outline */}
          <path d="M4 2H16L20 6V22H4V2Z" opacity="0.3" />
          
          {/* Fading Lines (Simulating writing) */}
          {[0, 1, 2].map((i) => (
            <motion.line
              key={i}
              x1="8" y1={10 + i * 4} x2="16" y2={10 + i * 4}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0, 1, 1, 0], pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 3,
                delay: 1 + i * 0.5,
                repeat: Infinity,
                times: [0, 0.2, 0.8, 1]
              }}
            />
          ))}
        </svg>
      </div>

      {/* 2. Ink Drop (Vertical Motion) */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        initial={{ y: -20, opacity: 0, scale: 0.5 }}
        animate={{ 
          y: [0, 60, 60], 
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 2, 0] 
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          times: [0, 0.4, 0.5, 0.6],
          ease: "easeInOut"
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill={gold}>
          <path d="M12 3C12 3 6 10 6 16C6 19.3 8.7 22 12 22C15.3 22 18 19.3 18 16C18 10 12 3 12 3Z" />
        </svg>
      </motion.div>

      {/* 3. Pen Nib (Cursive Motion) */}
      <motion.div
        className="absolute z-10"
        style={{ rotate: 15 }} // Fixed tilt
        animate={{
          x: [-40, 0, 40, -40],
          y: [10, -10, 10, 10],
          rotate: [15, 20, 10, 15]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2">
          {/* Pen Nib Shape */}
          <path d="M12 2L19 21L12 17L5 21L12 2Z" fill={`${gold}22`} />
          <line x1="12" y1="2" x2="12" y2="10" strokeWidth="1" />
        </svg>
      </motion.div>

    </div>
  );
}
