"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogOut, 
  CreditCard, 
  Shield, 
  Settings, 
  ChevronDown, 
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { logoutAction } from "@/app/actions";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  credits: number;
  plan: string;
  avatar_url?: string;
}

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial Load
    const initUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata?.avatar_url);
      }
      setLoading(false);
    };

    const fetchProfile = async (userId: string, email: string, avatarUrl?: string) => {
      const { data } = await supabase
        .from('users')
        .select('id, email, role, credits, plan')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser({ ...(data as UserProfile), avatar_url: avatarUrl });
      } else {
        setUser({
          id: userId,
          email: email,
          role: 'user',
          credits: 0,
          plan: 'free',
          avatar_url: avatarUrl
        });
      }
    };

    initUser();

    // 2. Real-time Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata?.avatar_url);
      } else {
        setUser(null);
      }
    });

    // 3. Real-time Profile Listener (Credits/Plan)
    let profileChannel: any = null;
    if (user?.id) {
      profileChannel = supabase
        .channel(`user-profile-${user.id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${user.id}`
        }, (payload) => {
          if (payload.new) {
            setUser(prev => {
              if (!prev) return null;
              return { 
                ...prev, 
                credits: payload.new.credits ?? prev.credits,
                plan: payload.new.plan ?? prev.plan,
                role: payload.new.role ?? prev.role
              };
            });
          }
        })
        .subscribe();
    }

    // 4. Click Outside Listener
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      if (profileChannel) supabase.removeChannel(profileChannel);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutAction();
    router.replace('/login');
  };

  if (loading || !user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button - Source of Truth for Credits/Plan */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all group relative z-[111]",
          isOpen && "bg-white/10"
        )}
      >
        <div className="flex flex-col items-end mr-1 hidden sm:flex">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-white/50 transition-colors">
            {user.plan === 'free' ? 'FREE ACCOUNT' : 'ELITE DIRECTOR'}
          </span>
          <span className="text-[11px] font-black text-brand-gold tabular-nums leading-none">
            {user.credits.toLocaleString()} Credits
          </span>
        </div>
        
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-brand-gold/30 transition-all">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-brand-gold" />
            )}
          </div>
          <div className={cn(
             "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-white/10 transition-transform duration-500 shadow-lg",
             isOpen && "rotate-180"
          )}>
             <ChevronDown size={10} className="text-neutral-500" />
          </div>
        </div>
      </button>

      {/* Dropdown Menu - Ultra Slim & Integrated Expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] right-0 w-60 bg-[#0a0a0a]/95 border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] backdrop-blur-3xl p-1.5 z-[110] overflow-hidden"
          >
            {/* Action Items Only - Directly Expanded from Trigger */}
            <div className="space-y-1">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/pricing');
                }}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 group-hover:bg-brand-gold/20 transition-colors">
                    <CreditCard size={14} className="text-brand-gold" />
                  </div>
                  <span className="text-[11px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest transition-colors">Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-black text-brand-gold">{user.credits.toLocaleString()}</span>
                  <ArrowRight size={10} className="text-brand-gold/50 group-hover:text-brand-gold transition-all group-hover:translate-x-1" />
                </div>
              </button>

              {user.email === 'dev.marckim@gmail.com' && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/admin');
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-gold/20 transition-colors">
                    <Shield size={14} className="text-neutral-500 group-hover:text-brand-gold transition-colors" />
                  </div>
                  <span className="text-[11px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest transition-colors">Nexus Console</span>
                </button>
              )}

              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings');
                }}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-gold/20 transition-colors">
                  <Settings size={14} className="text-neutral-500 group-hover:text-brand-gold transition-colors" />
                </div>
                <span className="text-[11px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest transition-colors">Settings</span>
              </button>
            </div>

            {/* Logout - Red Accent Footer */}
            <div className="mt-1.5 p-1 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/0 hover:bg-red-500/10 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/5 flex items-center justify-center border border-red-500/10 group-hover:border-red-500/20 transition-colors">
                  <LogOut size={14} className="text-red-500/50 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-[11px] font-black text-red-500/70 group-hover:text-red-500 uppercase tracking-widest transition-colors">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
