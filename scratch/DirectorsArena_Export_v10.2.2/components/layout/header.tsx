"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Clapperboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/user-menu";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserAction } from "@/app/actions";

export function Header() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(true); // Default true in POC/Dev so button is easily accessible
  const isProjectPage = pathname?.includes('/project-contents/');
  const isLandingPage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');

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

  if (isLandingPage || isAdminPage) return null;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-24 z-[100] bg-black/80 backdrop-blur-md transition-all",
      !isProjectPage && "border-b border-white/5"
    )}>
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-16 relative">
        {/* FAR LEFT: Master Logo */}
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

        {/* CENTER: Navigation (Spacer) */}
        <nav className="hidden lg:flex items-center gap-12" />

        {/* FAR RIGHT: Utility Cluster */}
        <div className="flex justify-end items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Version Badge */}
            <div className="flex items-center gap-2 group transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(197,160,89,1)]" />
              <span className="text-[12px] font-black text-brand-gold uppercase tracking-[0.1em]">Build v10.2.2 (Admin & POC Fix)</span>
            </div>

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
