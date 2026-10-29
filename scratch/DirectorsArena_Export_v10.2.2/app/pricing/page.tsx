"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/lib/actions/stripe";

const PACKAGES = [
  {
    id: "starter",
    name: "Debut Director",
    credits: 50,
    price: "₩9,900",
    priceId: "price_starter_id", // Replace with real Stripe Price ID
    description: "본격적인 시나리오 작필의 시작",
    features: ["50 AI Credits", "Standard Generation", "Full Export Rights"]
  },
  {
    id: "pro",
    name: "Established Writer",
    credits: 200,
    price: "₩29,900",
    priceId: "price_pro_id", // Replace with real Stripe Price ID
    description: "가장 인기 있는 전문가 패키지",
    popular: true,
    features: ["200 AI Credits", "Priority Generation", "Advanced Rewrite Access", "Global Scene Context"]
  },
  {
    id: "master",
    name: "Showrunner",
    credits: 500,
    price: "₩59,900",
    priceId: "price_master_id", // Replace with real Stripe Price ID
    description: "대규모 프로젝트와 시리즈물을 위한 선택",
    features: ["500 AI Credits", "Elite Model Access", "Direct Admin Support", "Custom Prompt Tuning"]
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (pkg: typeof PACKAGES[0]) => {
    setLoading(pkg.id);
    const result = await createCheckoutSession(pkg.priceId, pkg.credits);
    if (result.url) {
      window.location.href = result.url;
    } else {
      alert("결제창을 불러오는 데 실패했습니다: " + result.error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-6"
          >
            <Sparkles size={14} className="text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Membership Protocol</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6"
          >
            Forge Your Destiny
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-lg max-w-2xl mx-auto"
          >
            상상을 현실로 만드는 가장 빠른 방법. <br />
            필요한 만큼의 크레딧을 충전하고 당신의 서사를 완성하세요.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx + 0.3 }}
              className={`relative group bg-neutral-900/50 backdrop-blur-3xl border ${pkg.popular ? 'border-brand-gold' : 'border-white/10'} rounded-[40px] p-10 flex flex-col hover:bg-neutral-900/80 transition-all duration-700 shadow-2xl`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-black text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-neutral-500 text-xs font-black uppercase tracking-[0.3em] mb-4">{pkg.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black italic">{pkg.price}</span>
                  <span className="text-neutral-600 text-sm font-bold uppercase tracking-widest">/ KRW</span>
                </div>
                <p className="mt-6 text-neutral-400 text-sm leading-relaxed">{pkg.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {pkg.features.map((feat) => (
                  <div key={feat} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center">
                      <Check size={12} className="text-brand-gold" />
                    </div>
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={loading !== null}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 transition-all duration-500 ${
                  pkg.popular 
                    ? 'bg-brand-gold text-black hover:shadow-[0_0_40px_rgba(197,160,89,0.3)]' 
                    : 'bg-white text-black hover:bg-brand-gold'
                } disabled:opacity-50`}
              >
                <span>{loading === pkg.id ? "Preparing..." : "Select Package"}</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center border-t border-white/5 pt-12"
        >
          <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.4em]">
            Secure Payment Powered by Stripe Protocol v3.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
