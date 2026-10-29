import React from "react";
import { motion } from "framer-motion";
import { X, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: any[];
  onRestore: (revision: any) => void;
}

export function RevisionModal({ isOpen, onClose, revisions, onRestore }: RevisionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest">Time Machine</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-tighter">Revision History</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar-slim">
          {(!revisions || revisions.length === 0) ? (
            <div className="text-center py-12 text-neutral-500 text-sm italic">
              No revisions found. AI generations will be backed up here.
            </div>
          ) : (
            <div className="space-y-4">
              {revisions.map((rev, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-brand-gold/30 transition-colors">
                  <div>
                    <h4 className="text-brand-gold font-bold text-sm uppercase tracking-widest">{rev.label || `Revision ${idx + 1}`}</h4>
                    <p className="text-xs text-neutral-500 mt-1">{new Date(rev.timestamp).toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-600 mt-2 max-w-md truncate">
                      {rev.snapshotType === 'script' ? "Script Content Backup" : "Project Generation Backup"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to restore this revision? Current progress will be overwritten.")) {
                        onRestore(rev);
                        onClose();
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={14} /> Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
