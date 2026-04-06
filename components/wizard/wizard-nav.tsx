"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WizardNavProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export function WizardNav({ currentStep, totalSteps = 3, onStepClick }: WizardNavProps) {
  const steps = [1, 2, 3];
  
  return (
    <div className="relative w-full h-8 flex items-center justify-between px-2 overflow-visible">
      {/* Base Line (The Script Line) */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-gold/20 -translate-y-1/2" />
      
      {/* Active Line Progress */}
      <motion.div 
        className="absolute top-1/2 left-0 h-[1px] bg-brand-gold -translate-y-1/2"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Steps */}
      {steps.map((stepNum) => {
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <button 
            key={stepNum} 
            onClick={() => onStepClick?.(stepNum)}
            className="relative z-10 outline-none group"
            type="button"
          >
            {isActive ? (
              /* Ink Drop (Active) */
              <motion.div
                layoutId="ink-drop"
                className="relative flex items-center justify-center"
              >
                {/* Glow Shadow */}
                <motion.div 
                  className="absolute w-12 h-12 bg-brand-gold/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.2, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* The Drop Shape */}
                <div className="w-3 h-4 bg-brand-gold rounded-full relative shadow-[0_0_20px_rgba(197,160,89,0.8)]">
                  <div className="absolute -top-1 left-1.5 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-brand-gold" />
                </div>

                {/* Step Indicator Text */}
                <span className="absolute -bottom-10 text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] whitespace-nowrap">
                   Act {stepNum}
                </span>
              </motion.div>
            ) : (
              /* Completed/Static Dot */
              <div 
                className={cn(
                  "w-2.5 h-2.5 rounded-full border transition-all duration-500 hover:scale-150",
                  isCompleted 
                    ? "bg-brand-gold border-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.4)]" 
                    : "bg-neutral-900 border-white/20 opacity-40 hover:opacity-100"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
