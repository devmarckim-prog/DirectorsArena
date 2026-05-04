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
            Nexus Entrance
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">
            Authentication Required
          </p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl text-center">
          <p className="text-neutral-400 text-sm mb-10 leading-relaxed">
            Directors Arena에 오신 것을 환영합니다.<br />
            아래 버튼을 통해 구글 계정으로 즉시 시작하세요.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-4 hover:bg-brand-gold transition-all duration-500 shadow-[0_10px_30px_rgba(255,255,255,0.05)] disabled:opacity-50"
          >
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-black transition-colors">
              G
            </div>
            <span>{loading ? "Initializing..." : "Sign in with Google"}</span>
            <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
                  const targetUrl = `http://localhost:3000/project-list`;
                  console.log("SUCCESS: Session established.");
                  console.log("REDIRECTING TO:", targetUrl);
                  alert(`로그인 성공! 다음 주소로 이동합니다: ${targetUrl}`);
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
