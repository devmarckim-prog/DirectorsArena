"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 px-10 flex items-center justify-between z-50 pointer-events-none">
      <div className="flex items-center space-x-10 pointer-events-auto">
        <div className="flex items-center space-x-3">
          {/* Golden 'N' Icon Placeholder */}
          <div className="w-5 h-5 flex items-center justify-center border border-brand-gold/50 rounded-sm">
            <span className="text-[10px] font-black text-brand-gold">N</span>
          </div>
          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.3em]">
            VOID CORE SYNCHRONIZED
          </span>
        </div>
      </div>

      <div className="pointer-events-auto">
        <span className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.4em] italic">
          v1.01 RELAY - SAFE POINT ESTABLISHED
        </span>
      </div>
    </footer>
  );
}
