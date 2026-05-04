"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
}

export function InsufficientCreditsModal({ 
  isOpen, 
  onClose,
  requiredCredits = 10
}: InsufficientCreditsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-brand-gold/10 rounded-full blur-[80px]" />

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="text-brand-gold" size={32} />
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Insufficient Credits
              </h2>
              
              <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                이 작업을 수행하기 위한 크레딧이 부족합니다.<br />
                최소 <span className="text-brand-gold font-bold">{requiredCredits} Credits</span>가 필요합니다.
              </p>

              <div className="space-y-4">
                <Link href="/pricing">
                  <button className="w-full bg-brand-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform">
                    <span>크레딧 충전하기</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
                
                <button 
                  onClick={onClose}
                  className="w-full bg-white/5 text-neutral-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
                >
                  나중에 하기
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">
                <Sparkles size={12} />
                <span>Premium Cinematic Service</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
