"use client";

import { motion } from "framer-motion";

interface CircularProgressProps {
  currentCount: number;
  maxCount?: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ 
  currentCount, 
  maxCount = 150, 
  size = 40, 
  strokeWidth = 3 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(currentCount / maxCount, 1);
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/10"
        />
        {/* Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#C5A059"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-neutral-500">
        {Math.max(0, maxCount - currentCount)}
      </span>
    </div>
  );
}
