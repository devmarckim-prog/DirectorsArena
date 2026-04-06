"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { StepOne } from "@/components/wizard/step-one";
import { StepTwo } from "@/components/wizard/step-two";
import { StepThree } from "@/components/wizard/step-three";

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProducing, setIsProducing] = useState(false);
  const [formData, setFormData] = useState({
    platform: "Movie",
    genres: ["Noir"],
    episodes: 1,
    duration: 120,
    logline: "",
    world: { setting: "Contemporary", tone: "Dark" },
    characters: [],
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleProduce = useCallback(() => {
    setIsProducing(true);
    
    // Credit Deduction Execution (20 C)
    const currentCredits = parseInt(localStorage.getItem("directors_arena_credits") || "1200");
    const newCredits = Math.max(0, currentCredits - 20);
    localStorage.setItem("directors_arena_credits", newCredits.toString());

    // Save as BAKING
    const newProject = {
      id: `project-${Date.now()}`,
      platform: formData.platform,
      genre: formData.genres[0],
      episodes: formData.episodes,
      duration: formData.duration,
      world: formData.world.setting,
      characterCount: formData.characters.length || 3,
      logline: formData.logline,
      status: 'BAKING',
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    const saved = localStorage.getItem("directors_arena_projects");
    const projects = saved ? JSON.parse(saved) : [];
    localStorage.setItem("directors_arena_projects", JSON.stringify([newProject, ...projects]));

    // 1.0s Fade-to-Black Cinematic Sequence
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }, [formData, router]);

  return (
    <div className="min-h-screen text-neutral-100 font-sans overflow-x-hidden relative selection:bg-brand-gold/30 selection:text-white pt-24">
      {/* Act Tracker (Transparent Background) */}
      <main className="relative pt-8 pb-20 max-w-7xl mx-auto px-6 min-h-screen flex flex-col">
        <div className="flex justify-center mb-16 px-10">
          <div className="flex items-center space-x-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center space-x-4">
                <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= step ? 'bg-brand-gold' : 'bg-neutral-800'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${currentStep === step ? 'text-white' : 'text-neutral-700'}`}>
                  Act {step}
                </span>
                {step < 3 && <div className="w-12 h-[1px] bg-neutral-900" />}
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Renderer */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepOne key="step1" formData={formData} setFormData={setFormData} onNext={nextStep} />
            )}
            {currentStep === 2 && (
              <StepTwo key="step2" formData={formData} setFormData={setFormData} onNext={nextStep} />
            )}
            {currentStep === 3 && (
              <StepThree key="step3" formData={formData} setFormData={setFormData} onProduce={handleProduce} />
            )}
          </AnimatePresence>
        </div>

        {/* Control Footer */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-40 bg-neutral-950/40 backdrop-blur-md px-8 py-4 rounded-full border border-white/5">
           {currentStep > 1 && (
             <button onClick={prevStep} className="text-neutral-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest px-4">
               Back
             </button>
           )}
           <div className="w-[1px] h-4 bg-white/10" />
           <button 
             onClick={currentStep < 3 ? nextStep : handleProduce}
             className="group flex items-center space-x-3 bg-brand-gold px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)]"
           >
             <span className="text-black text-[11px] font-black uppercase tracking-widest leading-none">
               {currentStep < 3 ? "Next Act" : "Produce Scenario"}
             </span>
             <ArrowRight size={12} className="text-black ml-1 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </main>

      {/* Production Overlay Restoration (V1.01) */}
      <AnimatePresence>
        {isProducing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-10"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center"
            >
              <div className="w-16 h-[1px] bg-brand-gold/30 mx-auto mb-6" />
              <p className="text-[10px] font-black text-brand-gold uppercase tracking-[1em] mb-4">Finalizing Narrative Block</p>
              <p className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Developing...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
