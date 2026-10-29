"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, PlayCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/user-menu";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserAction } from "@/app/actions";
import { SamiyaLogo } from "@/components/brand/samiya-logo";

export function Header() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(true); // Default true in POC/Dev so button is easily accessible
  const isProjectPage = pathname?.includes('/project-contents/');
  const isLandingPage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');
  const isIntroPage = pathname === '/intro';

  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await getCurrentUserAction();
        if (profile) {
          setIsAdmin(profile.role === 'admin' || profile.id === 'poc-test-admin-id');
        } else {
          // Fallback: try client-side Supabase if server action returned null
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            setIsAdmin(data?.role === 'admin');
          } else {
            // Check cookie
            const isPoc = document.cookie.includes('da_poc_admin=true');
            setIsAdmin(isPoc || true);
          }
        }
      } catch (err) {
        setIsAdmin(true);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setIsAdmin(data?.role === 'admin');
        } else {
          const profile = await getCurrentUserAction();
          if (profile) {
            setIsAdmin(profile.role === 'admin' || profile.id === 'poc-test-admin-id');
          } else {
            const isPoc = document.cookie.includes('da_poc_admin=true');
            setIsAdmin(isPoc || true);
          }
        }
      } catch (err) {
        setIsAdmin(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLandingPage || isAdminPage || isIntroPage) return null;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-24 z-[100] bg-black/80 backdrop-blur-md transition-all",
      !isProjectPage && "border-b border-white/5"
    )}>
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-16 relative">
        {/* FAR LEFT: Master Samiya Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <SamiyaLogo size="md" variant="vector" />
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase ml-1">
              Studio
            </span>
          </Link>
        </div>

        {/* CENTER: Navigation (Spacer) */}
        <nav className="hidden lg:flex items-center gap-12" />

        {/* FAR RIGHT: Utility Cluster */}
        <div className="flex justify-end items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Version Badge */}
            <div className="flex items-center gap-2 group transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]" />
              <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.1em]">Build v10.3.2 (Dynamic Motion Graphic)</span>
            </div>

            {/* Platform Intro Motion Graphic Link */}
            <Link
              href="/intro"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white transition-all text-xs font-black shadow-[0_0_15px_rgba(99,102,241,0.3)] group"
              title="플랫폼 모션 그래픽 소개 영상 보기"
            >
              <PlayCircle size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>소개 영상</span>
            </Link>

            {/* Direct Admin Console Link */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold hover:text-white transition-all text-xs font-black shadow-[0_0_15px_rgba(197,160,89,0.25)] group"
                title="관리자 어드민 콘솔 바로가기"
              >
                <Shield size={14} className="group-hover:scale-110 transition-transform" />
                <span>어드민 콘솔</span>
              </Link>
            )}

            {/* Premium User Menu with Credits & Logout */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
