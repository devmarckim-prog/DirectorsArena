"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clapperboard } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative bg-[#050505] overflow-hidden">
      {/* Cinematic Ambient Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/[0.03] blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
      </div>

      {/* Main Hero Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* 1. MASTER LOGO AREA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-16 relative"
        >
          <div className="w-28 h-28 rounded-[32px] bg-brand-gold flex items-center justify-center shadow-[0_0_60px_rgba(197,160,89,0.4)] relative z-10">
            <Clapperboard size={54} className="text-black" />
          </div>
          {/* External Halo */}
          <div className="absolute inset-0 w-28 h-28 rounded-[32px] bg-brand-gold/20 blur-2xl animate-pulse -z-10" />
        </motion.div>

        {/* 2. TITANIC TITLES */}
        <div className="space-y-4 mb-20">
          <motion.h1 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "-0.02em" }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white px-4 leading-[1.1] font-[family-name:var(--font-noto-serif)] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            당신의 상상이<br />
            스토리가 됩니다
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-[1px] bg-brand-gold/40 mb-6" />
            <h2 className="text-xl md:text-2xl font-black text-brand-gold uppercase tracking-[0.8em] ml-[0.8em] opacity-80">
              AI 스토리텔링 툴
            </h2>
          </motion.div>
        </div>

        {/* 3. CTA GATEWAY */}
        <Link href="/project-list">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="group relative flex items-center space-x-8 bg-white/5 backdrop-blur-3xl border border-brand-gold/30 px-12 py-6 rounded-full hover:bg-brand-gold/10 hover:border-brand-gold/60 hover:shadow-[0_0_50px_rgba(197,160,89,0.3)] transition-all duration-700 cursor-pointer"
          >
            <span className="text-brand-gold text-base font-black uppercase tracking-[0.4em] ml-4">
              무료로 작가되어보기
            </span>
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold transition-all duration-700">
              <ArrowRight size={22} className="text-brand-gold group-hover:text-black transition-colors" />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Decorative Branding (Bottom Corners) */}
      <div className="absolute bottom-12 left-12 opacity-20 pointer-events-none">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em]">Project Core Synchronized</p>
      </div>
      <div className="absolute bottom-12 right-12 opacity-20 pointer-events-none text-right">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em]">Protocol v3.3.4</p>
      </div>
    </main>
  );
}
