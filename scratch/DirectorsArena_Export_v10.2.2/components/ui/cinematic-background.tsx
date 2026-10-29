"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#050505]" />;

  return (
    <div className="fixed inset-0 z-[-1] bg-[#050505] overflow-hidden pointer-events-none">
      {/* Base Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1A1A1A_0%,_#050505_100%)]" />

      {/* Dynamic Light Leaks */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-gold/5 blur-[120px]"
      />
      
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-brand-gold/10 blur-[150px]"
      />

      {/* Cinematic Grain / Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] contrast-[150%] brightness-[100%]"
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '150px 150px'
           }} 
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
