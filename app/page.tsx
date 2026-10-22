"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clapperboard, Sparkles, ShieldCheck } from "lucide-react";
import { pocLoginAction } from "@/app/actions";

export default function LandingPage() {
  const router = useRouter();
  const [isPocLoading, setIsPocLoading] = useState(false);

  const handlePocLogin = async () => {
    setIsPocLoading(true);
    try {
      // 1. Direct client cookie setting for zero-latency client recognition
      document.cookie = "da_poc_admin=true; path=/; max-age=604800; SameSite=Lax";
      // 2. Server action to sync session
      await pocLoginAction();
    } catch (e) {
      // Failsafe direct route navigation
      window.location.href = "/project-list";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative bg-[#050505] overflow-hidden py-16">
      {/* Cinematic Ambient Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/[0.04] blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* 1. MASTER LOGO AREA */}
        <div className="mb-12 relative">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-[32px] bg-brand-gold flex items-center justify-center shadow-[0_0_60px_rgba(197,160,89,0.4)] relative z-10 mx-auto">
            <Clapperboard size={50} className="text-black" />
          </div>
          {/* External Halo */}
          <div className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 rounded-[32px] bg-brand-gold/20 blur-2xl animate-pulse -z-10 mx-auto" />
        </div>

        {/* 2. TITANIC TITLES */}
        <div className="space-y-4 mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white px-4 leading-[1.1] font-[family-name:var(--font-noto-serif)] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            당신의 상상이<br />
            스토리가 됩니다
          </h1>
          
          <div className="flex flex-col items-center pt-2">
            <div className="w-12 h-[1px] bg-brand-gold/40 mb-6" />
            <h2 className="text-xl md:text-2xl font-black text-brand-gold uppercase tracking-[0.8em] ml-[0.8em] opacity-90">
              AI 스토리텔링 툴
            </h2>
          </div>
        </div>

        {/* 3. CTA GATEWAY (Standard Entry + POC Direct Access) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
          {/* Default Gateway */}
          <Link href="/project-list" className="w-full sm:w-auto">
            <div className="group relative flex items-center justify-between sm:justify-start space-x-6 bg-white/5 backdrop-blur-3xl border border-brand-gold/30 px-8 py-5 rounded-full hover:bg-brand-gold/10 hover:border-brand-gold/60 hover:shadow-[0_0_50px_rgba(197,160,89,0.3)] transition-all duration-300 cursor-pointer">
              <span className="text-brand-gold text-sm md:text-base font-black uppercase tracking-[0.3em] ml-2">
                무료로 작가되어보기
              </span>
              <div className="w-11 h-11 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold transition-all duration-300 flex-shrink-0">
                <ArrowRight size={20} className="text-brand-gold group-hover:text-black transition-colors" />
              </div>
            </div>
          </Link>

          {/* POC Instant Admin Gateway */}
          <button
            onClick={handlePocLogin}
            disabled={isPocLoading}
            className="w-full sm:w-auto group relative flex items-center justify-between sm:justify-start space-x-6 bg-gradient-to-r from-brand-gold/20 via-amber-500/10 to-brand-gold/20 backdrop-blur-3xl border-2 border-brand-gold px-8 py-5 rounded-full hover:from-brand-gold/30 hover:to-brand-gold/30 hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-all duration-300 cursor-pointer text-left active:scale-95"
          >
            <div className="flex flex-col ml-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">
                  LOGIN FREE • TEST ADMIN
                </span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-black rounded-sm tracking-wider">
                  POC
                </span>
              </div>
              <span className="text-white text-base md:text-lg font-black uppercase tracking-[0.2em] mt-0.5">
                {isPocLoading ? "접속 중..." : "POC 접속"}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-brand-gold flex items-center justify-center group-hover:scale-110 shadow-[0_0_20px_rgba(197,160,89,0.6)] transition-all duration-300 flex-shrink-0">
              <Sparkles size={20} className="text-black fill-black" />
            </div>
          </button>
        </div>

        {/* POC Notice Pill & Admin Direct Link */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-neutral-400 text-xs font-mono">
            <ShieldCheck size={14} className="text-brand-gold" />
            <span>POC 접속 시 로그인 없이 어드민 권한으로 즉시 입장하며 더미 데이터가 로드됩니다.</span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/50 text-brand-gold text-xs font-black shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all hover:scale-105"
          >
            <ShieldCheck size={14} />
            <span>🛡️ 어드민 콘솔 바로가기</span>
          </Link>
        </div>
      </div>

      {/* Decorative Branding (Bottom Corners) */}
      <div className="absolute bottom-8 left-8 opacity-20 pointer-events-none hidden sm:block">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em]">Project Core Synchronized</p>
      </div>
      <div className="absolute bottom-8 right-8 opacity-20 pointer-events-none text-right hidden sm:block">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em]">Protocol v10.2.2 (POC & Admin Ready)</p>
      </div>
    </main>
  );
}
