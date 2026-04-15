"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    // We will use standard Google OAuth in Supabase
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/project-list`,
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Unlocked globally for verification purposes as requested
  const isAdmin = !!user;

  if (loading) return null; // Don't flash login if checking session

  return (
    <div className="flex items-center space-x-6 pointer-events-auto">
      {user ? (
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs font-black uppercase tracking-widest text-neutral-400">
           {isAdmin && (
             <button 
               onClick={() => router.push("/admin")}
               className="px-4 py-2 border border-brand-gold/30 text-brand-gold bg-brand-gold/5 rounded-full hover:bg-brand-gold/20 transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(197,160,89,0.2)]"
             >
               <span>👑 Nexus Command</span>
             </button>
           )}
           <span className="hidden md:inline-flex">{user.email}</span>
           <button 
             onClick={handleLogout}
             className="px-4 py-2 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"
           >
             LOGOUT
           </button>
           <div className="flex items-center space-x-3 px-5 py-2 bg-brand-gold/5 border border-brand-gold/10 rounded-full">
             <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
             <span id="credits-badge" className="text-brand-gold text-xs">1,200 Credits</span>
           </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
           <button 
             onClick={() => router.push("/admin")}
             className="hidden md:flex px-4 py-2 border border-brand-gold/30 text-brand-gold bg-brand-gold/5 rounded-full hover:bg-brand-gold/20 transition-all items-center space-x-2 shadow-[0_0_15px_rgba(197,160,89,0.2)] text-xs font-black uppercase tracking-widest"
           >
             <span>👑 Nexus Command</span>
           </button>
           <button 
             onClick={handleLogin}
             className="group flex flex-col md:flex-row items-center space-x-0 md:space-x-3 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-full hover:bg-brand-gold/10 hover:border-brand-gold/40 transition-all duration-500"
           >
             <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs font-black">G</div>
             <span className="text-xs font-black text-white group-hover:text-brand-gold uppercase tracking-[0.2em] transition-colors mt-1 md:mt-0">Sign in with Google</span>
           </button>
        </div>
      )}
    </div>
  );
}
