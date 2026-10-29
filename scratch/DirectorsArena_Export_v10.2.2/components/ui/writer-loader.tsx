"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * WriterLoader: Phase 2-2-A Implementation
 * Geometric Motif Loader with Writer Icons.
 * Icons: Pen Nib, Sheet of Paper (Script), Ink Drop.
 * Uses the 'draw' animation from globals.css.
 */
export function WriterLoader({ className, size = 120 }: { className?: string; size?: number }) {
  const brandGold = "#C5A059";

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Shape 1: Pen Nib */}
        <path
          d="M50 10 L60 40 L50 80 L40 40 Z M50 10 L50 40"
          stroke={brandGold}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: "draw 3s ease-in-out infinite",
          }}
        />

        {/* Shape 2: Sheet of Paper (Script) */}
        <path
          d="M30 20 H65 L75 30 V80 H30 Z M65 20 V30 H75"
          stroke={brandGold}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: "draw 3s ease-in-out infinite 1s",
          }}
        />

        {/* Shape 3: Ink Drop */}
        <path
          d="M50 90 C35 90 25 80 25 65 C25 50 50 20 50 20 C50 20 75 50 75 65 C75 80 65 90 50 90 Z"
          stroke={brandGold}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: "draw 3s ease-in-out infinite 2s",
          }}
        />

        {/* Subtle Inner Glow */}
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
