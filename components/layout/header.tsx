"use client";

import Link from "next/link";
import { AuthNav } from "@/components/auth/auth-nav";
import { motion } from "framer-motion";
import { Database, Clapperboard, Video, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isProjectPage = pathname?.includes('/project-contents/');

  return (
    <header className="fixed top-0 left-0 right-0 h-24 z-[100] bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-16 relative">
        {/* 2.1 FAR LEFT: Master Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)] group-hover:scale-105 transition-transform">
              <Clapperboard size={20} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-[0.2em] leading-none uppercase">Directors</span>
              <span className="text-sm font-black text-brand-gold tracking-[0.2em] leading-none uppercase mt-1">Arena</span>
            </div>
          </Link>
        </div>

        {/* 2.2 CENTER: Primary Navigation (Menus Removed per Request) */}
        <nav className="hidden lg:flex items-center gap-12" />

        {/* 3.2 FAR RIGHT: Top Utility Cluster */}
        <div className="flex justify-end items-center gap-4">
          {/* Version & Admin Unified Cluster */}
          <div className="flex items-center gap-2">
            {/* Large Version Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-gold/5 border border-brand-gold/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(197,160,89,0.1)] group hover:border-brand-gold transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(197,160,89,1)]" />
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.1em]">Build v3.3.2</span>
            </div>

            {/* Admin Toggle */}
            <Link href="/admin" className="p-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-500 hover:text-brand-gold hover:border-brand-gold/50 transition-all group">
               <Database size={18} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>

          {/* Global Credits Cluster */}
          <div className="flex items-center gap-4 px-6 py-2 bg-black/40 backdrop-blur-xl border border-brand-gold/30 rounded-full shadow-[0_0_20px_rgba(197,160,89,0.1)] group hover:border-brand-gold/60 transition-all">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-gold/50" />
                <span className="text-brand-gold font-black text-[10px] uppercase tracking-widest leading-none">Unlimited (Beta)</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <User size={16} className="text-neutral-500" />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
