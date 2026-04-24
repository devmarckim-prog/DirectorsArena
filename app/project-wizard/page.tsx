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

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProducing, setIsProducing] = useState(false);
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
    
    // Credit Deduction (20 C)
    const currentCredits = parseInt(localStorage.getItem("directors_arena_credits") || "1200");
    const newCredits = Math.max(0, currentCredits - 20);
    localStorage.setItem("directors_arena_credits", newCredits.toString());

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
        const igniteResponse = await fetch(`/api/ignite/${result.projectId}`, { method: 'POST' });
        
        if (igniteResponse.body) {
            const reader = igniteResponse.body.getReader();
            const decoder = new TextDecoder();
            
            // Wait for the very first chunk to confirm streaming has begun
            const { value } = await reader.read();
            if (value) {
                console.log("[Wizard] First chunk received. Engine Ignited. Gate Open.");
                // v8.4: Add intentional delay for DB propagation and UX
                await new Promise(r => setTimeout(r, 1500));
                // Immediately redirect to dashboard
                router.push(`/project-list`);
            }
            reader.cancel();
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
    <div className="min-h-screen text-neutral-100 font-sans overflow-x-hidden relative selection:bg-brand-gold/30 selection:text-white pt-12">
      <main className="relative pt-4 pb-8 max-w-7xl mx-auto px-6 flex-1 flex flex-col">
        <div className="flex justify-center mb-8 px-10">
          <div className="flex items-center space-x-12">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center space-x-4">
                <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= step ? 'bg-brand-gold' : 'bg-neutral-800'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${currentStep === step ? 'text-white' : 'text-neutral-700'}`}>
                  Act {step}
                </span>
                {step < 4 && <div className="w-12 h-[1px] bg-neutral-900" />}
              </div>
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

        <div className="mt-8 mb-12 mx-auto flex items-center space-x-6 z-40 bg-neutral-950/40 backdrop-blur-md px-8 py-4 rounded-full border border-white/5 shadow-2xl">
           {currentStep > 1 && (
             <button onClick={prevStep} className="text-neutral-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest px-4">
               Back
             </button>
           )}
           <div className="w-[1px] h-4 bg-white/10" />
           {currentStep < 4 ? (
             <button 
               onClick={nextStep}
               className="group flex items-center space-x-3 bg-brand-gold px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)]"
             >
               <span className="text-black text-[11px] font-black uppercase tracking-widest leading-none">
                 Next Act
               </span>
               <ArrowRight size={12} className="text-black ml-1 group-hover:translate-x-1 transition-transform" />
             </button>
           ) : (
             <button 
               onClick={handleProduce}
               disabled={isProducing}
               className={cn(
                 "group flex items-center space-x-3 bg-brand-gold px-12 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(197,160,89,0.4)]",
                 isProducing && "opacity-50 cursor-not-allowed"
               )}
             >
               <span className="text-black text-[11px] font-black uppercase tracking-widest leading-none">
                 Produce Scenario
               </span>
               <Sparkles size={12} className="text-black ml-1 animate-pulse" />
             </button>
           )}
        </div>
      </main>

      {/* v8.4: Improved Production Overlay with Korean Text and Blinking */}
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
              transition={{ duration: 1.5, times: [0, 0.4, 0.6, 1], repeat: 0 }}
              className="text-center"
            >
              <div className="w-16 h-[1px] bg-brand-gold/30 mx-auto mb-6" />
              <p className="text-[10px] font-black text-brand-gold uppercase tracking-[1em] mb-4">Finalizing Script Details</p>
              <motion.p 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.75, repeat: 2 }}
                className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none px-4"
              >
                당신의 대박 스토리가 생성되고 있습니다
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
