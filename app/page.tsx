"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Void Gateway UI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center z-10"
      >
        <div className="mb-12">
          <div className="w-16 h-[1px] bg-brand-gold/30 mx-auto mb-4" />
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[1em]">The Threshold</p>
        </div>

        <button 
          onClick={() => router.push("/dashboard")}
          className="group relative flex items-center space-x-6 bg-white/5 backdrop-blur-xl border border-brand-gold/30 px-10 py-5 rounded-full hover:bg-brand-gold/10 hover:shadow-[0_0_30px_rgba(197,160,89,0.2)] transition-all duration-500"
        >
          <span className="text-brand-gold text-sm font-black uppercase tracking-[0.4em] ml-4">
            무료로 작가되어보기
          </span>
          <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-500">
            <ArrowRight size={18} className="text-brand-gold group-hover:text-black transition-colors" />
          </div>
        </button>
      </motion.div>
    </main>
  );
}
