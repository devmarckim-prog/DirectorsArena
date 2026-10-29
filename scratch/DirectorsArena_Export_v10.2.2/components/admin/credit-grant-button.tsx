"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Coins, Loader2, X, Calendar, Check } from "lucide-react";
import { manualCreditGrantAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CreditGrantButtonProps {
  userEmail: string;
  currentCredits: number;
}

export function CreditGrantButton({ userEmail, currentCredits }: CreditGrantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [amount, setAmount] = useState<string>("10");
  const [memo, setMemo] = useState<string>("Promotion Bonus");
  const [validDays, setValidDays] = useState<string>("30");
  const [mode, setMode] = useState<'add' | 'sub'>('add');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleGrant = async () => {
    const amountVal = parseInt(amount);
    if (isNaN(amountVal)) return alert("Invalid amount");

    const finalAmount = mode === 'add' ? amountVal : -amountVal;

    setIsPending(true);
    try {
      let expiresAt: string | undefined = undefined;
      if (validDays && parseInt(validDays) > 0) {
        const date = new Date();
        date.setDate(date.getDate() + parseInt(validDays));
        expiresAt = date.toISOString();
      }

      const result = await manualCreditGrantAction(userEmail, finalAmount, memo, expiresAt);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 1500);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-2 rounded-xl border transition-all active:scale-95 group min-w-[80px]",
          isOpen 
            ? "bg-brand-gold text-black border-brand-gold shadow-[0_0_20px_rgba(197,159,89,0.3)]" 
            : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white hover:border-brand-gold/30 hover:bg-brand-gold/5"
        )}
      >
        <span className={cn("text-xs font-black tracking-widest", isOpen ? "text-black" : "text-white group-hover:text-brand-gold")}>
          {currentCredits.toLocaleString()}
        </span>
        <span className={cn("text-[8px] font-bold uppercase ml-1 opacity-50", isOpen ? "text-black" : "text-neutral-500")}>C</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute left-1/2 -translate-x-1/2 mt-4 w-72 bg-[#0e0d0b] border border-white/10 rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-3xl"
          >
            {/* Mode Switcher */}
            <div className="flex p-1 bg-white/5 rounded-2xl mb-6">
              <button 
                onClick={() => setMode('add')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  mode === 'add' ? "bg-brand-gold text-black" : "text-neutral-500 hover:text-white"
                )}
              >
                Add
              </button>
              <button 
                onClick={() => setMode('sub')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  mode === 'sub' ? "bg-red-500 text-white" : "text-neutral-500 hover:text-white"
                )}
              >
                Subtract
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 px-4 text-xl font-black text-white outline-none focus:border-brand-gold/30 transition-all"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-700">CREDITS</span>
                </div>
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest ml-1">Validity (Days)</label>
                <input 
                  type="number"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 px-4 text-xs font-bold text-neutral-400 outline-none focus:border-brand-gold/30 transition-all"
                  placeholder="30"
                />
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest ml-1">Note</label>
                <input 
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 px-4 text-[10px] font-bold text-neutral-500 outline-none focus:border-brand-gold/30 transition-all"
                  placeholder="Promotion..."
                />
              </div>

              <button
                onClick={handleGrant}
                disabled={isPending || isSuccess}
                className={cn(
                  "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all mt-4",
                  isSuccess 
                    ? "bg-emerald-500 text-white" 
                    : mode === 'add' ? "bg-brand-gold text-black hover:bg-white" : "bg-red-500 text-white hover:bg-red-400"
                )}
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isSuccess ? (
                  <Check size={14} />
                ) : (
                  <Check size={14} />
                )}
                {isPending ? "Syncing..." : isSuccess ? "Success" : "Apply Adjustment"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
