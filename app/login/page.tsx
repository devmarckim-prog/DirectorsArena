"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(197,160,89,0.3)]"
          >
            <Sparkles size={32} className="text-black" />
          </motion.div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            LOGIN
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">
            Authentication Required
          </p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl text-center">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-[52px] bg-white text-black rounded-lg font-medium text-sm flex items-center justify-center space-x-3 hover:bg-neutral-100 transition-all shadow-lg disabled:opacity-50 overflow-hidden"
          >
            <div className="flex items-center justify-center w-6 h-6">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1 23 23" />
              </svg>
            </div>
            <span className="font-sans font-semibold text-[#1f1f1f]">Sign in with Google</span>
          </button>

          {/* Dev Only: Admin Bypass Button */}
          <button
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              const devEmail = 'dev.marckim@gmail.com';
              const devPass = 'admin1234password';

              try {
                // 1. Sign in
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: devEmail,
                  password: devPass
                });

                if (error) throw error;

                // 2. Double check session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                  const targetUrl = `/project-list`;
                  console.log("SUCCESS: Session established.");
                  window.location.replace(targetUrl);
                } else {
                  throw new Error("세션 생성에 실패했습니다. 쿠키 설정을 확인해 주세요.");
                }
              } catch (err: any) {
                console.error("Dev Bypass Failed:", err);
                alert(err.message === "Invalid login credentials" 
                  ? "비밀번호가 맞지 않습니다. SQL이 정상적으로 실행되었는지 다시 확인해 주세요." 
                  : err.message);
                setLoading(false);
              }
            }}
            className="mt-6 w-full py-3 border border-white/5 text-neutral-700 text-[9px] font-black uppercase tracking-[0.3em] hover:text-brand-gold hover:border-brand-gold/20 transition-all rounded-xl disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "[ AUTHENTICATING... ]" : "[ Dev Mode: Login as Marc ]"}
          </button>

          <p className="mt-10 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
            By entering, you agree to our Protocol & Terms.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
