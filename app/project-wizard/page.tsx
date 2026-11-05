"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { StepOne } from "@/components/project-wizard/step-one";
import { StepTwo } from "@/components/project-wizard/step-two";
import { StepThree } from "@/components/project-wizard/step-three";
import { StepFour } from "@/components/project-wizard/step-four";
import { createProjectAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { InsufficientCreditsModal } from "@/components/ui/insufficient-credits-modal";

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProducing, setIsProducing] = useState(false);
  const [engineMode, setEngineMode] = useState<"api" | "poc">("api");
  const [producingText, setProducingText] = useState("Claude AI가 시네마틱 서사와 인물 관계도를 실시간 집필 중입니다...");
  const [isComplete, setIsComplete] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(10);
  const [formData, setFormData] = useState({
    platform: "ott",
    genres: ["Noir"],
    episodes: 6,
    duration: 60,
    logline: "",
    world: { year: 2026, region: "KR", setting: "Contemporary", tone: "Dark" },
    characters: [],
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleProduce = useCallback(async () => {
    setIsProducing(true);

    try {
        // v4.5 Supabase-First: Creation (0%)
        const result = await createProjectAction(formData);

        if (!result.success) {
            console.error("Failed to create project", result.error);
            setIsProducing(false);
            alert("프로젝트 생성 중 오류가 발생했습니다.");
            return;
        }

        // Phase 2: Engine Ignition (Targeting 10% -> 11%+)
        const igniteResponse = await fetch(`/api/ignite/${result.projectId}?engine=${engineMode}`, { 
            method: 'POST',
            headers: { 'x-engine-mode': engineMode }
        });
        
        if (igniteResponse.status === 402) {
            const errData = await igniteResponse.json();
            setIsProducing(false);
            setRequiredCredits(errData.required || 10);
            setShowCreditModal(true);
            return;
        }

        if (igniteResponse.ok && igniteResponse.body) {
            const reader = igniteResponse.body.getReader();
            const decoder = new TextDecoder();
            
            setProducingText(engineMode === 'api' 
              ? "실시간 Claude AI와 연결 성공! 서사 및 인물 데이터를 생성 중..." 
              : "POC 더미 데이터 생성 중..."
            );

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                if (chunk.includes('STREAMING_STARTED')) {
                    setProducingText("Claude AI가 세계관, 4대 캐릭터, 1화 대본을 실시간 작성 중...");
                }
                if (chunk.includes('COMPLETE') || chunk.includes('"status":"COMPLETE"')) {
                    break;
                }
            }

            await new Promise(r => setTimeout(r, 600));
            setIsProducing(false);
            setIsComplete(true);
        } else {
            throw new Error("Failed to ignite generation engine");
        }

    } catch (e) {
        console.error(e);
        setIsProducing(false);
        alert("엔진 가동 중 오류가 발생했습니다. 대시보드에서 다시 시도해주세요.");
    }
  }, [formData, router]);

  return (
    <div className="min-h-screen text-neutral-100 font-sans overflow-x-hidden relative selection:bg-brand-gold/30 selection:text-white pt-4">
      <main className="relative pt-2 pb-44 max-w-7xl mx-auto px-6 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col pt-4">
          {/* v11.0: New High-Fidelity Step Indicator positioned above the Title */}
          <div className="w-full mb-5">
            <div className="flex items-center space-x-12">
              {[1, 2, 3, 4].map((step) => (
                <button 
                  key={step} 
                  onClick={() => setCurrentStep(step)}
                  className="group flex items-center space-x-4 outline-none"
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                    currentStep === step ? 'bg-brand-gold scale-125 shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 
                    currentStep > step ? 'bg-brand-gold/40' : 'bg-neutral-800'
                  )} />
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300",
                    currentStep === step ? 'text-white translate-x-1' : 'text-neutral-700 group-hover:text-neutral-400'
                  )}>
                    Act {step}
                  </span>
                  {step < 4 && <div className="w-12 h-[1px] bg-neutral-900 ml-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <StepOne key="step1" formData={formData} setFormData={setFormData} onNext={nextStep} />
              )}
              {currentStep === 2 && (
                <StepTwo key="step2" formData={formData} setFormData={setFormData} onNext={nextStep} />
              )}
              {currentStep === 3 && (
                <StepThree key="step3" formData={formData} setFormData={setFormData} onNext={nextStep} />
              )}
              {currentStep === 4 && (
                <StepFour key="step4" formData={formData} setFormData={setFormData} onProduce={handleProduce} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* v11.0: Fixed Bottom Navigation Bar for consistent 'Void' control */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 md:space-x-6 z-[100] bg-neutral-950/90 backdrop-blur-2xl px-5 md:px-8 py-3 rounded-full border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
           {/* Engine Mode Selector */}
           <div className="flex items-center space-x-1.5 bg-neutral-900/90 px-3 py-1.5 rounded-full border border-white/10">
             <button
               type="button"
               onClick={() => setEngineMode('api')}
               className={cn(
                 "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center space-x-1",
                 engineMode === 'api' 
                   ? "bg-brand-gold text-black shadow-[0_0_12px_rgba(197,160,89,0.5)]" 
                   : "text-neutral-400 hover:text-white"
               )}
             >
               <span>🤖 Claude API</span>
             </button>
             <button
               type="button"
               onClick={() => setEngineMode('poc')}
               className={cn(
                 "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center space-x-1",
                 engineMode === 'poc' 
                   ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]" 
                   : "text-neutral-400 hover:text-white"
               )}
             >
               <span>⚡ POC 더미</span>
             </button>
           </div>
           <div className="w-[1px] h-4 bg-white/10" />
           {currentStep > 1 && (
             <button onClick={prevStep} className="text-neutral-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest px-4">
               Back
             </button>
           )}
           <div className="w-[1px] h-4 bg-white/10" />
           {currentStep < 4 ? (
             <button 
               onClick={nextStep}
               className="group flex items-center space-x-4 bg-brand-gold px-10 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(197,160,89,0.3)]"
             >
               <span className="text-black text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                 Next Act
               </span>
               <ArrowRight size={14} strokeWidth={3} className="text-black ml-1 group-hover:translate-x-1 transition-transform" />
             </button>
           ) : (
             <button 
               onClick={handleProduce}
               disabled={isProducing}
               className={cn(
                 "group flex items-center space-x-4 bg-brand-gold px-14 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_60px_rgba(197,160,89,0.4)]",
                 isProducing && "opacity-50 cursor-not-allowed"
               )}
             >
               <span className="text-black text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                 Produce Scenario
               </span>
               <Sparkles size={14} className="text-black ml-1 animate-pulse" />
             </button>
           )}
        </div>
      </main>

      <AnimatePresence>
        {isProducing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-10"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 1.5, times: [0, 0.4, 0.6, 1], repeat: Infinity }}
              className="text-center"
            >
              <div className="w-16 h-[1px] bg-brand-gold/30 mx-auto mb-6" />
              <p className="text-[10px] font-black text-brand-gold uppercase tracking-[1em] mb-4">Engine Igniting</p>
              <motion.p 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none px-4"
              >
                {producingText}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[400] flex flex-col items-center justify-center p-10 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-neutral-900 border border-brand-gold/30 rounded-[40px] p-12 text-center shadow-[0_0_100px_rgba(197,160,89,0.15)]"
            >
              <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(197,160,89,0.4)]">
                <Sparkles size={40} className="text-black" />
              </div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">
                엔진 가동 성공!
              </h2>
              <p className="text-neutral-400 text-sm font-medium leading-relaxed mb-10">
                당신의 새로운 서사가 백그라운드에서 생성되기 시작했습니다.<br/>
                이제 프로젝트 목록에서 생성 과정을 실시간으로 확인할 수 있습니다.
              </p>
              <button
                onClick={() => router.push('/project-list')}
                className="w-full bg-brand-gold text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                목록으로 이동하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InsufficientCreditsModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
        requiredCredits={requiredCredits}
      />
    </div>
  );
}
