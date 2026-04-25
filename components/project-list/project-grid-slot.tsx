"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectGridSlot({ className }: { className?: string }) {
  return (
    <Link 
      href="/project-wizard"
      className={cn("relative flex flex-col items-center justify-center h-[380px] w-full rounded-[20px] bg-black/40 border border-white/5 border-dashed hover:border-brand-gold/40 hover:bg-white/5 transition-all group overflow-hidden", className)}
    >
      <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/40 transition-colors duration-500">
          <Plus 
            size={20} 
            className="text-neutral-600 group-hover:text-brand-gold transition-colors duration-500" 
          />
        </div>
        
        <div className="text-center">
          <span className="text-neutral-500 font-bold group-hover:text-white text-[12px] transition-colors duration-500 block">
            New Project
          </span>
        </div>
      </div>
    </Link>
  );
}
