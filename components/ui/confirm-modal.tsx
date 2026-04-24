"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  variant = "danger"
}: ConfirmModalProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] pointer-events-auto relative"
            >
              {/* Cinematic Gold Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50" />
              
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                    variant === "danger" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-brand-gold/10 border-brand-gold/20 text-brand-gold"
                  )}>
                    <AlertTriangle size={24} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                      {message}
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={async () => {
                       try {
                         await onConfirm();
                       } finally {
                         onClose();
                       }
                    }}
                    className={cn(
                      "flex-[1.5] px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border",
                      variant === "danger" 
                        ? "bg-red-600 text-white border-red-500 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                        : "bg-brand-gold text-black border-brand-gold hover:opacity-90 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                    )}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>

              {/* Close Icon (Top Right) */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-neutral-600 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
