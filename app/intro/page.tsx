"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Sparkles, 
  Film, 
  Cpu, 
  Users, 
  FileText, 
  ShieldCheck,
  MousePointer,
  Layers,
  Activity
} from "lucide-react";
import { SamiyaLogo } from "@/components/brand/samiya-logo";

const TOTAL_DURATION = 40; // 40 seconds total video presentation

const CHAPTERS = [
  { id: 0, time: 0, title: "01 영감의 불꽃", label: "Samiya 브랜드 인트로" },
  { id: 1, time: 6, title: "02 원클릭 POC 접속", label: "메인 홈 & 1초 로그인" },
  { id: 2, time: 14, title: "03 위저드 실시간 조작", label: "넷플릭스 8회차 기획" },
  { id: 3, time: 22, title: "04 대본 & 씬 에디터", label: "쇼러너 AI 실시간 각본" },
  { id: 4, time: 30, title: "05 어드민 콘솔 대시보드", label: "전략 인텔리전스 센터" },
  { id: 5, time: 35, title: "06 스튜디오 피날레", label: "지금 스토리 창작 시작" },
];

export default function SamiyaIntroMotionGraphicPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for rich dynamic SFX
  const playSoundEffect = (type: "spark" | "click" | "whoosh" | "impact" | "chime") => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "whoosh") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "spark") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "impact") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === "chime") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.type = "sine";
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.07);
          noteGain.gain.setValueAtTime(0.08, now + idx * 0.07);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.2);
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.start(now + idx * 0.07);
          noteOsc.stop(now + idx * 0.07 + 1.2);
        });
      }
    } catch (e) {}
  };

  // Main 60fps playback timer
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  // Chapter tracking and audio cue
  useEffect(() => {
    const activeIdx = CHAPTERS.slice().reverse().find((ch) => currentTime >= ch.time)?.id ?? 0;
    if (activeIdx !== currentChapter) {
      setCurrentChapter(activeIdx);
      if (activeIdx === 0) playSoundEffect("spark");
      else if (activeIdx === 1) playSoundEffect("whoosh");
      else if (activeIdx === 2) playSoundEffect("click");
      else if (activeIdx === 3) playSoundEffect("whoosh");
      else if (activeIdx === 4) playSoundEffect("impact");
      else if (activeIdx === 5) playSoundEffect("chime");
    }
  }, [currentTime, currentChapter]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#07060b] text-white flex flex-col items-center justify-center p-3 md:p-6 font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-3 px-2">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>메인 홈으로 이동</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/25">
            Samiya Dynamic Platform Demo
          </span>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-500/30 transition-all"
          >
            <ShieldCheck size={14} />
            <span>어드민 콘솔</span>
          </Link>
        </div>
      </div>

      {/* Main 16:9 Cinema Viewport */}
      <div
        ref={containerRef}
        className="w-full max-w-6xl aspect-video bg-gradient-to-br from-[#090813] via-[#040408] to-[#0c0919] rounded-3xl border border-indigo-500/30 shadow-[0_0_90px_rgba(99,102,241,0.25)] relative overflow-hidden flex flex-col justify-between"
      >
        {/* Ambient Cosmic Lights */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        </div>

        {/* Top Video Metadata */}
        <div className="relative z-20 flex items-center justify-between p-5 md:p-6 pb-0">
          <div className="flex items-center gap-3">
            <SamiyaLogo size="sm" variant="vector" />
            <div className="h-3.5 w-[1px] bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
              Live Interactive UI Demonstration
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-black text-indigo-400">{CHAPTERS[currentChapter].title}</span>
            <span className="text-neutral-500">•</span>
            <span>{CHAPTERS[currentChapter].label}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DYNAMIC STAGE: SIMULATED LIVE APP DEMO                   */}
        {/* ======================================================== */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          
          {/* ACT 0: THE SPARK & BRAND GENESIS (0s - 6s) */}
          {currentTime >= 0 && currentTime < 6 && (
            <div className="flex flex-col items-center justify-center text-center animate-fadeIn duration-500">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 flex items-center justify-center shadow-[0_0_80px_rgba(167,139,250,0.8)] animate-bounce">
                  <Sparkles size={40} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping" />
              </div>

              <SamiyaLogo size="xl" variant="vector" />

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-3">
                당신의 상상이 현실적인 스토리가 되는 곳
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 mt-2 max-w-lg">
                원클릭 기획안 작성부터 8막 서사, 대본 집필, 프로덕션 분석까지<br />
                실제 서비스 조작 화면을 지금 바로 확인해보세요.
              </p>
            </div>
          )}

          {/* ACT 1: LIVE DEMO - HOME PAGE & 1-CLICK POC LOGIN (6s - 14s) */}
          {currentTime >= 6 && currentTime < 14 && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn duration-500">
              {/* macOS Style Simulated Studio Window */}
              <div className="w-full bg-[#0a0914] rounded-2xl border border-indigo-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 transform hover:scale-[1.01]">
                {/* Browser Title Bar */}
                <div className="h-9 bg-[#111020] border-b border-white/10 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-6 py-1 rounded-md text-[10px] font-mono text-neutral-400 border border-white/5">
                    <span className="text-emerald-400">🔒</span>
                    <span>https://samiya.studio</span>
                  </div>
                  <div className="text-[10px] font-bold text-neutral-500">1920 × 1080</div>
                </div>

                {/* Simulated Screen with Real Capture */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/screen_home.png"
                    alt="Samiya Home Screen Capture"
                    fill
                    className="object-cover object-top filter brightness-95"
                    priority
                  />

                  {/* Animated Simulated Cursor Hover & Click */}
                  <div 
                    className="absolute z-30 transition-all duration-1000 ease-out pointer-events-none"
                    style={{
                      left: currentTime < 9 ? "35%" : currentTime < 12 ? "58%" : "58%",
                      top: currentTime < 9 ? "65%" : currentTime < 12 ? "72%" : "72%",
                      transform: currentTime >= 10 && currentTime <= 11.5 ? "scale(0.85)" : "scale(1)"
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <MousePointer size={28} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] fill-black" />
                      {/* Click Shockwave Ripple */}
                      {currentTime >= 10 && currentTime <= 12 && (
                        <div className="absolute w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-400/30 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Action Highlight Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/80 backdrop-blur-xl border border-amber-500/40 p-3 rounded-xl shadow-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-black text-amber-300">ONE-CLICK TEST ADMIN</span>
                      <span className="text-xs text-neutral-300">— 로그인/비밀번호 없이 즉시 99,999 크레딧 계정으로 입장</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                      CLICK DETECTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 2: LIVE DEMO - PROJECT WIZARD IN ACTION (14s - 22s) */}
          {currentTime >= 14 && currentTime < 22 && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn duration-500">
              <div className="w-full bg-[#0a0914] rounded-2xl border border-indigo-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Title Bar */}
                <div className="h-9 bg-[#111020] border-b border-white/10 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-6 py-1 rounded-md text-[10px] font-mono text-neutral-400 border border-white/5">
                    <span className="text-emerald-400">🔒</span>
                    <span>https://samiya.studio/project-wizard</span>
                  </div>
                  <div className="text-[10px] font-bold text-indigo-400">STEP 1 / 4 • PRE-PRODUCTION</div>
                </div>

                {/* Actual Wizard Screenshot & Interactive Cursor */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/screen_wizard.png"
                    alt="Samiya Project Wizard Capture"
                    fill
                    className="object-cover object-top filter brightness-95"
                    priority
                  />

                  {/* Animated Simulated Cursor adjusting slider & selecting Netflix */}
                  <div 
                    className="absolute z-30 transition-all duration-700 ease-in-out pointer-events-none"
                    style={{
                      left: currentTime < 16 ? "25%" : currentTime < 19 ? "45%" : "70%",
                      top: currentTime < 16 ? "40%" : currentTime < 19 ? "65%" : "82%",
                      transform: currentTime >= 18 && currentTime <= 19.5 ? "scale(0.85)" : "scale(1)"
                    }}
                  >
                    <div className="relative">
                      <MousePointer size={28} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] fill-indigo-600" />
                      {currentTime >= 18 && (
                        <div className="absolute -inset-2 rounded-full border border-indigo-400 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Dynamic Action Callout */}
                  <div className="absolute top-6 right-6 bg-indigo-950/90 backdrop-blur-xl border border-indigo-500/50 p-3 rounded-xl shadow-2xl max-w-xs text-left">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-300 uppercase mb-1">
                      <Sparkles size={12} />
                      <span>타겟 플랫폼 & 회차 슬라이더 실시간 조작</span>
                    </div>
                    <p className="text-[11px] text-neutral-200">
                      넷플릭스 OTT 규격 • 8부작 미니시리즈 아키텍처 자동 설계 중
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 3: LIVE DEMO - SCRIPT & SCENE CO-WRITER (22s - 30s) */}
          {currentTime >= 22 && currentTime < 30 && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn duration-500">
              <div className="w-full bg-[#0a0914] rounded-2xl border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Title Bar */}
                <div className="h-9 bg-[#111020] border-b border-white/10 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-6 py-1 rounded-md text-[10px] font-mono text-neutral-400 border border-white/5">
                    <span className="text-emerald-400">🔒</span>
                    <span>https://samiya.studio/workspace/script-studio</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400">AI SHOWRUNNER CO-WRITER</div>
                </div>

                {/* Realistic Script Stream Editor Simulation */}
                <div className="relative aspect-[16/9] w-full bg-[#0d0c18] p-6 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-indigo-400" />
                        <span className="text-xs font-black text-white font-mono">S# 14. 근정전 앞마당 - 밤 (달빛 아래)</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                        실시간 대본 자동 타이핑 스트림
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-xs text-neutral-300 leading-relaxed max-w-2xl">
                      <p className="text-neutral-500">
                        거친 비바람이 전각을 휘감는다. 붉은 도포를 입은 이도가 피 묻은 서신을 품에서 꺼낸다.
                      </p>
                      <p className="pl-6 border-l-2 border-indigo-500">
                        <strong className="text-white block mb-0.5">이도 (32)</strong>
                        &ldquo;전하, 이 손에 쥐어진 것은 역모의 기록이 아니라, 전하께서 버리신 백성들의 눈물입니다.&rdquo;
                      </p>
                      <p className="pl-6 border-l-2 border-rose-500">
                        <strong className="text-white block mb-0.5">한명회 (54)</strong>
                        &ldquo;감히 누구 앞에서 세상을 논하느냐. 오늘 밤 궁을 나갈 수 있는 자는 없다.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* AI Copilot Badge */}
                  <div className="flex items-center justify-between bg-black/60 border border-white/10 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-300 block uppercase">서사 텐션 자동 검증</span>
                        <span className="text-[11px] text-neutral-300">긴장도 94.8% • 인물 어조 싱크로율 98% 유지</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">READY FOR PRODUCTION</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 4: LIVE DEMO - ADMIN CONSOLE & REAL-TIME INTELLIGENCE (30s - 35s) */}
          {currentTime >= 30 && currentTime < 35 && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn duration-500">
              <div className="w-full bg-[#0a0914] rounded-2xl border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Title Bar */}
                <div className="h-9 bg-[#111020] border-b border-white/10 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-6 py-1 rounded-md text-[10px] font-mono text-neutral-400 border border-white/5">
                    <span className="text-amber-400">🛡️</span>
                    <span>https://samiya.studio/admin</span>
                  </div>
                  <div className="text-[10px] font-bold text-amber-400">NEXUS STRATEGIC CENTER</div>
                </div>

                {/* Actual Admin Screenshot */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/screen_admin.png"
                    alt="Samiya Admin Console Capture"
                    fill
                    className="object-cover object-top filter brightness-95"
                    priority
                  />

                  {/* Floating Metric Spotlight */}
                  <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-xl border border-amber-500/50 p-3.5 rounded-xl text-left shadow-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity size={14} className="text-amber-400" />
                      <span className="text-[10px] font-black text-amber-300 uppercase">시스템 인텔리전스 모니터링</span>
                    </div>
                    <p className="text-xs text-neutral-200">
                      전체 회원 관리, 크레딧 사용량, AI 모델 요율 및 보안 접속 로그 실시간 관제
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACT 5: CLIMAX & CTA (35s - 40s) */}
          {currentTime >= 35 && (
            <div className="flex flex-col items-center justify-center text-center animate-fadeIn duration-500 max-w-2xl">
              <SamiyaLogo size="xl" variant="vector" />

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-3 leading-tight">
                지금, 당신의 이야기가<br />
                스크린 위에 펼쳐집니다
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 mt-3 max-w-lg">
                한 줄의 아이디어에서 시작해 완성도 높은 대본까지.<br />
                Samiya AI 크리에이티브 스튜디오와 함께 시작하세요.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link
                  href="/project-wizard"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 hover:brightness-110 text-white font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(129,140,248,0.5)] transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  <span>스토리 창작 시작하기</span>
                </Link>

                <button
                  onClick={() => handleSeek(0)}
                  className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  <span>영상 다시 보기</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* BOTTOM VIDEO PLAYER CONTROLS                             */}
        {/* ======================================================== */}
        <div className="relative z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 md:p-6 pt-10">
          {/* Progress Bar (Clickable Scrubber) */}
          <div
            className="w-full h-2 bg-white/15 rounded-full cursor-pointer relative group overflow-hidden mb-3.5"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              handleSeek(ratio * TOTAL_DURATION);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full relative transition-all duration-100"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-transform active:scale-95 shadow-md"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
                title="처음부터 재생"
              >
                <RotateCcw size={14} />
              </button>

              <span className="text-xs font-mono font-bold text-neutral-400 tracking-wider">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Quick Chapter Buttons */}
            <div className="hidden lg:flex items-center gap-1.5">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleSeek(ch.time)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                    currentChapter === ch.id
                      ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105"
                      : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {ch.title}
                </button>
              ))}
            </div>

            {/* Right: Sound & Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title={isMuted ? "소리 켜기" : "소리 끄기"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="전체화면"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Footnotes */}
      <div className="w-full max-w-6xl mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 px-2">
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
          <span className="text-[11px] font-black text-indigo-400 block mb-0.5">01 • 1초 POC 로그인</span>
          <p className="text-[11px] text-neutral-400">계정 가입 없이 테스트 어드민 즉시 활성화</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
          <span className="text-[11px] font-black text-purple-400 block mb-0.5">02 • 8막 서사 마법사</span>
          <p className="text-[11px] text-neutral-400">플랫폼 맞춤형 회차 설계 및 인물 매트릭스</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
          <span className="text-[11px] font-black text-emerald-400 block mb-0.5">03 • 방송 규격 대본</span>
          <p className="text-[11px] text-neutral-400">지문, 대사, 씬 헤더 자동 포맷팅 스튜디오</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
          <span className="text-[11px] font-black text-amber-400 block mb-0.5">04 • 넥서스 어드민</span>
          <p className="text-[11px] text-neutral-400">회원 관리, 크레딧 및 AI 모델 실시간 통제</p>
        </div>
      </div>
    </div>
  );
}
