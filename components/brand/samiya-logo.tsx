"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SamiyaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animated?: boolean;
  variant?: "image" | "vector";
}

export function SamiyaLogo({
  className,
  size = "md",
  showText = true,
  animated = true,
  variant = "vector"
}: SamiyaLogoProps) {
  const sizeMap = {
    sm: { height: 28, text: "text-lg", spark: 16 },
    md: { height: 38, text: "text-2xl", spark: 22 },
    lg: { height: 52, text: "text-4xl", spark: 30 },
    xl: { height: 72, text: "text-6xl", spark: 42 }
  };

  const currentSize = sizeMap[size];

  if (variant === "image") {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        <Image
          src="/samiya_logo.png"
          alt="Samiya Logo"
          width={currentSize.height * 2.8}
          height={currentSize.height}
          className="object-contain rounded-lg filter drop-shadow-[0_0_15px_rgba(129,140,248,0.35)]"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center select-none font-sans group", className)}>
      {/* Dynamic Animated Vector Logo */}
      <div className="flex items-center tracking-tight font-black">
        <span className={cn(
          "bg-gradient-to-r from-[#1e1b4b] via-[#4338ca] to-[#6366f1] dark:from-[#818cf8] dark:via-[#a78bfa] dark:to-[#c084fc] bg-clip-text text-transparent transition-all duration-300",
          currentSize.text
        )}>
          Sam
        </span>

        {/* The 'i' with signature glowing sunburst rays */}
        <div className="relative inline-flex flex-col items-center justify-end mx-[1px]">
          {/* Radiating Sunburst Sparks */}
          <div className="relative flex items-center justify-center mb-[2px]">
            {/* Pulsing Core Glow */}
            <div className={cn(
              "rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]",
              animated && "animate-pulse",
              size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : size === "lg" ? "w-3.5 h-3.5" : "w-5 h-5"
            )} />

            {/* Radiant Sunburst Rays (5 lines) */}
            <svg
              className={cn(
                "absolute -top-[120%] pointer-events-none transition-transform duration-500 group-hover:scale-125",
                size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-16 h-16"
              )}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ray 1: Top Left (-60 deg) */}
              <line x1="12" y1="12" x2="6" y2="7" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" className={animated ? "animate-pulse" : ""} />
              {/* Ray 2: Top Mid-Left (-30 deg) */}
              <line x1="16" y1="9" x2="14" y2="2" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
              {/* Ray 3: Center Top (0 deg) */}
              <line x1="20" y1="8" x2="20" y2="1" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
              {/* Ray 4: Top Mid-Right (30 deg) */}
              <line x1="24" y1="9" x2="26" y2="2" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
              {/* Ray 5: Top Right (60 deg) */}
              <line x1="28" y1="12" x2="34" y2="7" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" className={animated ? "animate-pulse" : ""} />
            </svg>
          </div>

          {/* Body of 'i' */}
          <div className={cn(
            "rounded-full bg-gradient-to-b from-[#6366f1] via-[#818cf8] to-[#4338ca] dark:from-[#a78bfa] dark:to-[#6366f1]",
            size === "sm" ? "w-1.5 h-3.5" : size === "md" ? "w-2 h-5" : size === "lg" ? "w-2.5 h-7" : "w-3.5 h-10"
          )} />
        </div>

        <span className={cn(
          "bg-gradient-to-r from-[#4338ca] via-[#3b82f6] to-[#1e1b4b] dark:from-[#a78bfa] dark:via-[#818cf8] dark:to-[#60a5fa] bg-clip-text text-transparent transition-all duration-300",
          currentSize.text
        )}>
          ya
        </span>
      </div>
    </div>
  );
}
