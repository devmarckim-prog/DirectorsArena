"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  DollarSign, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { SamiyaLogo } from "@/components/brand/samiya-logo";

const TOTAL_DURATION = 42; // Total video duration in seconds

const CHAPTERS = [
  { id: 0, time: 0, title: "영감의 불꽃", icon: Sparkles, desc: "Samiya 브랜드 탄생" },
  { id: 1, time: 7, title: "8막 서사 엔진", icon: Cpu, desc: "로그라인에서 8막 구조로" },
  { id: 2, time: 14, title: "인물 관계 매트릭스", icon: Users, desc: "살아 숨쉬는 캐릭터 네트워크" },
  { id: 3, time: 22, title: "각본 실시간 집필", icon: FileText, desc: "쇼러너 AI와 대본 완성" },
  { id: 4, time: 30, title: "올인원 프로덕션", icon: DollarSign, desc: "캐스팅 & 제작비 & PPL" },
  { id: 5, time: 36, title: "Samiya의 세계로", icon: Film, desc: "지금 스토리를 시작하세요" },
];

export default function SamiyaIntroMotionGraphicPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for rich cinematic soundscapes
  const playSoundEffect = (type: "spark" | "woosh" | "impact" | "typewriter" | "chime") => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "spark") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "impact") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.7);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === "chime") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.type = "sine";
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
          noteGain.gain.setValueAtTime(0.08, now + idx * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.start(now + idx * 0.08);
          noteOsc.stop(now + idx * 0.08 + 1.2);
        });
      }
    } catch (e) {
      // Audio fallback silent
    }
  };

  // Main playback timer loop (60fps requestAnimationFrame)
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

  // Determine active chapter based on currentTime
  useEffect(() => {
    const activeIdx = CHAPTERS.slice().reverse().find((ch) => currentTime >= ch.time)?.id ?? 0;
    if (activeIdx !== currentChapter) {
      setCurrentChapter(activeIdx);
      if (activeIdx === 0) playSoundEffect("spark");
      else if (activeIdx === 1) playSoundEffect("impact");
      else if (activeIdx === 2) playSoundEffect("spark");
      else if (activeIdx === 3) playSoundEffect("impact");
      else if (activeIdx === 4) playSoundEffect("spark");
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
    <div className="min-h-screen bg-[#07060b] text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 px-2">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>메인 홈으로 나가기</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Samiya Official Promo Video
          </span>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all"
          >
            <ShieldCheck size={14} />
            <span>어드민 콘솔</span>
          </Link>
        </div>
      </div>

      {/* Main Cinematic Video Box (16:9 Aspect Ratio) */}
      <div
        ref={containerRef}
        className="w-full max-w-6xl aspect-video bg-gradient-to-br from-[#090813] via-[#040408] to-[#0d0a1b] rounded-3xl border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.25)] relative overflow-hidden flex flex-col justify-between"
      >
        {/* Dynamic Canvas Ambient Lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Top Floating Badge in Video */}
        <div className="relative z-20 flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-3">
            <SamiyaLogo size="sm" variant="vector" />
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
              AI Cinematic Storytelling Platform
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>ACT {currentChapter + 1} / {CHAPTERS.length}</span>
            <span className="text-neutral-500">•</span>
            <span>{CHAPTERS[currentChapter].title}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DYNAMIC SCENE CONTAINER (Timeline Keyframe Render)        */}
        {/* ======================================================== */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12 text-center">
          
          {/* ACT 0: PRELUDE - THE SPARK OF INSPIRATION (0s - 7s) */}
          {currentTime >= 0 && currentTime < 7 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-700 max-w-3xl">
              {/* Luminous Sunburst Spark Ignition */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 flex items-center justify-center shadow-[0_0_80px_rgba(167,139,250,0.8)] animate-bounce">
                  <Sparkles size={48} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
                </div>
                {/* Expanding Shockwave Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-pulse" />
              </div>

              {/* Brand Typography Reveal */}
              <div className="mb-4">
                <SamiyaLogo size="xl" variant="vector" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 drop-shadow-lg">
                당신의 상상이 현실적인 스토리가 되는 곳
              </h2>
              <p className="text-xs md:text-sm font-medium text-neutral-400 mt-3 max-w-xl tracking-wide leading-relaxed">
                시놉시스부터 8막 서사 아키텍처, 인물 관계도, 고품격 대본 및 제작 예산 산출까지<br />
                스토리텔러를 위한 차세대 올인원 AI 크리에이티브 스튜디오입니다.
              </p>
            </div>
          )}

          {/* ACT 1: LOGLINE TO 8-ACTS (7s - 14s) */}
          {currentTime >= 7 && currentTime < 14 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-500 w-full max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-2">
                STEP 01 • NARRATIVE ARCHITECTURE
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-6">
                로그라인 한 줄이 8막 서사로 폭발합니다
              </h2>

              {/* Typing Simulated Logline Box */}
              <div className="w-full max-w-2xl bg-white/5 border border-indigo-500/30 rounded-2xl p-4 mb-6 text-left shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-neutral-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>LOGLINE INPUT</span>
                </div>
                <p className="text-sm md:text-base font-semibold text-white font-mono">
                  &ldquo;조선 최고의 관상가가 왕의 운명을 바꾸기 위해 궁의 설계자로 잠입한다.&rdquo;
                  <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />
                </p>
              </div>

              {/* 8-Act Arc Cards Horizontal Stream */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-3xl">
                {[
                  { act: "1막", name: "일상의 균열", color: "from-blue-600/30 to-indigo-600/30" },
                  { act: "2막", name: "운명의 부름", color: "from-indigo-600/30 to-purple-600/30" },
                  { act: "3막", name: "궁중 잠입", color: "from-purple-600/30 to-pink-600/30" },
                  { act: "4막", name: "치명적 위기", color: "from-pink-600/30 to-rose-600/30" },
                ].map((item, idx) => (
                  <div
                    key={item.act}
                    className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border border-white/10 text-left transform transition-all duration-300 hover:scale-105`}
                  >
                    <span className="text-[9px] font-black text-indigo-300 block">{item.act}</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACT 2: CHARACTER MATRIX (14s - 22s) */}
          {currentTime >= 14 && currentTime < 22 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-500 w-full max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-2">
                STEP 02 • SYNAPTIC CHARACTER MATRIX
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-8">
                살아 숨쉬는 캐릭터와 입체적 갈등 구도
              </h2>

              {/* Interactive Character Network Visual */}
              <div className="relative w-full max-w-xl h-52 flex items-center justify-between px-8">
                {/* Node 1: Protagonist */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center border-2 border-white shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                    <span className="text-xs font-black text-white">이도 (32)</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-300 mt-2">주인공 • 천재 관상가</span>
                  <span className="text-[9px] font-mono text-cyan-400">욕망: 가문의 복수</span>
                </div>

                {/* Energy Vector Line in between */}
                <div className="flex-1 relative flex items-center justify-center mx-4">
                  <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-rose-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/60 animate-marquee" />
                  </div>
                  <div className="absolute -top-3 bg-neutral-900 border border-rose-500/50 px-2.5 py-0.5 rounded-full text-[9px] font-black text-rose-400">
                    생사결단 대립 (89%)
                  </div>
                </div>

                {/* Node 2: Antagonist */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-purple-800 flex items-center justify-center border-2 border-white/80 shadow-[0_0_30px_rgba(244,63,94,0.6)]">
                    <span className="text-xs font-black text-white">한명회 (54)</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-300 mt-2">적대자 • 영의정</span>
                  <span className="text-[9px] font-mono text-rose-400">욕망: 절대 권력</span>
                </div>
              </div>

              {/* Dynamic Sub-relationships */}
              <div className="mt-4 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-medium text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>심리 프로파일링 및 서사 텐션 자동 밸런싱 완료</span>
              </div>
            </div>
          )}

          {/* ACT 3: SCRIPT & SCENE CO-WRITER (22s - 30s) */}
          {currentTime >= 22 && currentTime < 30 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-500 w-full max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">
                STEP 03 • AI SHOWRUNNER CO-WRITER
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-6">
                방송/영화 산업 표준 규격의 프로페셔널 대본
              </h2>

              {/* Cinematic Script Sheet Simulation */}
              <div className="w-full max-w-2xl bg-neutral-900/90 border border-neutral-700/60 rounded-2xl p-6 text-left shadow-2xl backdrop-blur-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-400" />
                    <span className="text-xs font-black text-white font-mono">S# 14. 근정전 앞마당 - 밤 (달빛 아래)</span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    AI 각본 생성 완료
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-neutral-300 leading-relaxed">
                  <p className="text-neutral-500">
                    거친 비바람이 전각을 휘감는다. 붉은 도포를 입은 이도가 피 묻은 서신을 품에서 꺼낸다.
                  </p>
                  <p className="pl-6 border-l-2 border-indigo-500/50">
                    <strong className="text-white block mb-0.5">이도 (32)</strong>
                    &ldquo;전하, 이 손에 쥐어진 것은 역모의 기록이 아니라, 전하께서 버리신 백성들의 눈물입니다.&rdquo;
                  </p>
                  <p className="pl-6 border-l-2 border-rose-500/50">
                    <strong className="text-white block mb-0.5">한명회 (54)</strong>
                    &ldquo;감히 누구 앞에서 세상을 논하느냐. 오늘 밤 궁을 나갈 수 있는 자는 없다.&rdquo;
                  </p>
                </div>

                {/* Floating Metric Pill */}
                <div className="absolute -bottom-4 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles size={12} />
                  <span>극적 긴장감 지수 94.8% • 쇼러너 검증 통과</span>
                </div>
              </div>
            </div>
          )}

          {/* ACT 4: PRODUCTION SUITE - CASTING & BUDGET (30s - 36s) */}
          {currentTime >= 30 && currentTime < 36 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-500 w-full max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-2">
                STEP 04 • PRODUCTION INTELLIGENCE
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-8">
                캐스팅부터 제작 예산, PPL 플래닝까지 올인원
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {/* Card 1: Virtual Casting */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block">AI CASTING MATCH</span>
                      <span className="text-xs font-black text-white">가상 캐스팅 추천</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">배역별 최적의 배우 라인업 및 티켓 파워 시뮬레이션</p>
                </div>

                {/* Card 2: Budget Breakdown */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block">BUDGET ENGINE</span>
                      <span className="text-xs font-black text-white">제작비 정밀 산출</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">씬별 특수효과(VFX), 세트, 인건비 자동 비용 견적서</p>
                </div>

                {/* Card 3: PPL Placement */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Film size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block">PPL & LOCATIONS</span>
                      <span className="text-xs font-black text-white">스폰서십 & 로케이션</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">흐름을 해치지 않는 자연스러운 브랜드 협찬 씬 분석</p>
                </div>
              </div>
            </div>
          )}

          {/* ACT 5: CLIMAX & CTA (36s - 42s) */}
          {currentTime >= 36 && (
            <div className="flex flex-col items-center justify-center animate-fadeIn duration-700 max-w-2xl">
              <div className="mb-4">
                <SamiyaLogo size="xl" variant="vector" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-2 leading-tight">
                지금, 당신의 이야기가<br />
                스크린 위에 펼쳐집니다
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 mt-4 max-w-lg">
                전 세계 쇼러너들이 사용하는 AI 스토리 엔진. <br />
                Samiya와 함께 위대한 작품의 첫 페이지를 열어보세요.
              </p>

              {/* Action Buttons */}
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
        <div className="relative z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-12">
          {/* Progress Bar (Clickable Scrubber) */}
          <div
            className="w-full h-2 bg-white/10 rounded-full cursor-pointer relative group overflow-hidden mb-4"
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

          {/* Controls Cluster */}
          <div className="flex items-center justify-between">
            {/* Left: Play / Pause / Replay & Timecode */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-transform active:scale-95 shadow-md"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
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

            {/* Center: Chapter Quick Jump Pills */}
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
            <div className="flex items-center gap-3">
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

      {/* Feature Highlights beneath Video */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 px-2">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-xs font-black text-indigo-400 block mb-1">01 • AI SHOWRUNNER</span>
          <p className="text-xs text-neutral-400">업계 표준 8막 구조 및 플롯 포인트 자동 설계</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-xs font-black text-purple-400 block mb-1">02 • CHARACTER SYNAPSE</span>
          <p className="text-xs text-neutral-400">인물 간 갈등 지수 및 심리 프로파일링 매트릭스</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-xs font-black text-cyan-400 block mb-1">03 • SCRIPT STUDIO</span>
          <p className="text-xs text-neutral-400">영화/방송 대본 규격의 실시간 지문 및 대사 작성</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-xs font-black text-amber-400 block mb-1">04 • LOGISTICS ENGINE</span>
          <p className="text-xs text-neutral-400">가상 캐스팅, 회차별 제작 예산 및 PPL 전략 수립</p>
        </div>
      </div>
    </div>
  );
}
