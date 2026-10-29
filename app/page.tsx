"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, ShieldCheck, PlayCircle } from "lucide-react";
import { pocLoginAction } from "@/app/actions";
import { SamiyaLogo } from "@/components/brand/samiya-logo";

export default function LandingPage() {
  const router = useRouter();
  const [isPocLoading, setIsPocLoading] = useState(false);

  const handlePocLogin = async () => {
    setIsPocLoading(true);
    document.cookie = "da_poc_admin=true; path=/; max-age=604800; SameSite=Lax";
    try {
      await pocLoginAction();
    } catch (e) {
      // safe fallback
    }
    window.location.href = "/project-list";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative bg-[#06060c] overflow-hidden py-16">
      {/* Cinematic Ambient Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-600/[0.08] blur-[220px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/[0.07] blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* 1. MASTER SAMIYA LOGO AREA */}
        <div className="mb-10 relative flex flex-col items-center">
          <div className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-indigo-500/30 backdrop-blur-2xl shadow-[0_0_80px_rgba(99,102,241,0.25)] hover:scale-105 transition-transform duration-500">
            <SamiyaLogo size="xl" variant="vector" />
          </div>
        </div>

        {/* 2. TITANIC TITLES */}
        <div className="space-y-4 mb-14">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white px-4 leading-[1.1] font-[family-name:var(--font-noto-serif)] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            당신의 상상이<br />
            스토리가 됩니다
          </h1>
          
          <div className="flex flex-col items-center pt-2">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent mb-6" />
            <h2 className="text-sm md:text-lg font-black bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent uppercase tracking-[0.6em] ml-[0.6em]">
              SAMIYA AI STORY STUDIO
            </h2>
          </div>
        </div>

        {/* 3. CTA GATEWAY (Standard Entry + POC Direct Access + Motion Graphic Intro) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl">
          {/* Default Gateway */}
          <Link href="/project-list" className="w-full sm:w-auto">
            <div className="group relative flex items-center justify-between sm:justify-start space-x-5 bg-white/5 backdrop-blur-3xl border border-white/20 px-8 py-5 rounded-full hover:bg-white/10 hover:border-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 cursor-pointer">
              <span className="text-white text-sm md:text-base font-black uppercase tracking-[0.2em] ml-2">
                무료로 작가되어보기
              </span>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-300 flex-shrink-0">
                <ArrowRight size={18} className="text-white" />
              </div>
            </div>
          </Link>

          {/* POC Instant Admin Gateway */}
          <button
            onClick={handlePocLogin}
            disabled={isPocLoading}
            className="w-full sm:w-auto group relative flex items-center justify-between sm:justify-start space-x-5 bg-gradient-to-r from-brand-gold/20 via-amber-500/10 to-brand-gold/20 backdrop-blur-3xl border-2 border-brand-gold px-8 py-5 rounded-full hover:from-brand-gold/30 hover:to-brand-gold/30 hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-all duration-300 cursor-pointer text-left active:scale-95"
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
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center group-hover:scale-110 shadow-[0_0_20px_rgba(197,160,89,0.6)] transition-all duration-300 flex-shrink-0">
              <Sparkles size={18} className="text-black fill-black" />
            </div>
          </button>

          {/* Motion Graphic Intro Video CTA */}
          <Link href="/intro" className="w-full sm:w-auto">
            <div className="group relative flex items-center justify-center space-x-3 bg-indigo-600/20 hover:bg-indigo-600/30 backdrop-blur-3xl border border-indigo-500/50 px-7 py-5 rounded-full hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-300 cursor-pointer">
              <PlayCircle size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-indigo-200 text-sm md:text-base font-black uppercase tracking-[0.2em]">
                소개 영상
              </span>
            </div>
          </Link>
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
      <div className="absolute bottom-8 left-8 opacity-30 pointer-events-none hidden sm:block">
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.5em]">Samiya Core Synced</p>
      </div>
      <div className="absolute bottom-8 right-8 opacity-30 pointer-events-none text-right hidden sm:block">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Samiya Studio v10.3.0</p>
      </div>
    </main>
  );
}
