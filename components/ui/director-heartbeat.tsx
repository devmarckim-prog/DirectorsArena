"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'pulse';
  timestamp: string;
}

export function DirectorHeartbeat() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Global Log Listening (VIBE Dedicated)
  useEffect(() => {
    const handleLog = (event: CustomEvent<LogEntry>) => {
      setLogs((prev) => [...prev.slice(-49), event.detail]);
    };

    window.addEventListener('oma-heartbeat-log' as any, handleLog as any);
    
    // Initial Boot Log
    if (logs.length === 0) {
      const bootLog: LogEntry = {
        id: 'boot',
        message: 'Director\'s Heartbeat System Initialized. Standing by for Engine Ignition.',
        type: 'info',
        timestamp: new Date().toLocaleTimeString()
      };
      setLogs([bootLog]);
    }

    return () => window.removeEventListener('oma-heartbeat-log' as any, handleLog as any);
  }, [logs.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center">
      {/* Mini Status Bar */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-2xl hover:border-brand-gold/30 transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
           <Activity size={14} className="text-brand-gold" />
           <motion.div 
             className="absolute inset-0 bg-brand-gold/20 rounded-full"
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
          Director's Heartbeat
        </span>
        {isOpen ? <ChevronDown size={12} className="text-neutral-500" /> : <ChevronUp size={12} className="text-neutral-500" />}
      </motion.button>

      {/* Narrative Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[400px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center space-x-2">
                <Terminal size={12} className="text-brand-gold" />
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Vercel API Engine Node: 8083</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-md text-neutral-500 hover:text-white transition-all group/close"
                title="Close Heartbeat"
              >
                <div className="relative">
                  <Activity size={14} className="group-hover/close:hidden" />
                  <span className="hidden group-hover/close:block text-[10px] font-bold">ESC</span>
                </div>
              </button>
            </div>

            {/* Log Area */}
            <div 
              ref={scrollRef}
              className="h-[240px] overflow-y-auto p-5 font-mono text-[10px] leading-relaxed custom-scrollbar-slim"
            >
              {logs.map((log) => (
                <div key={log.id} className="mb-2 flex items-start space-x-3 group">
                  <span className="text-neutral-700 whitespace-nowrap">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <span className={cn(
                      "font-medium",
                      log.type === 'error' ? "text-red-400" : 
                      log.type === 'success' ? "text-green-400" : 
                      log.type === 'pulse' ? "text-brand-gold" : "text-neutral-300"
                    )}>
                      {log.message}
                    </span>
                  </div>
                  {log.type === 'success' && <CheckCircle2 size={10} className="text-green-500 mt-0.5" />}
                  {log.type === 'error' && <AlertCircle size={10} className="text-red-500 mt-0.5" />}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-brand-gold/5 border-t border-white/5 flex items-center justify-between">
               <span className="text-[8px] font-bold text-brand-gold/60 uppercase tracking-widest">OMA Zero-Defect Monitoring</span>
               <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
                  <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">System Ready</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility for formatting
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
