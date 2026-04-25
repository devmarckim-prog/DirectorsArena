"use client";

import { motion } from "framer-motion";
import type { NexusFaction, FactionPosition } from "./nexus-types";

interface FactionZoneProps {
  faction: NexusFaction;
  isHighlighted?: boolean;
}

const ZONE_RECTS: Record<FactionPosition, { x: number; y: number; w: number; h: number; lx: number; ly: number }> = {
  left:   { x: 30,  y: 80,  w: 260, h: 440, lx: 160, ly: 62 },
  right:  { x: 610, y: 80,  w: 260, h: 440, lx: 740, ly: 62 },
  center: { x: 320, y: 140, w: 260, h: 320, lx: 450, ly: 124 },
  bottom: { x: 210, y: 468, w: 480, h: 110, lx: 450, ly: 454 },
};

export function FactionZone({ faction, isHighlighted = false }: FactionZoneProps) {
  const r = ZONE_RECTS[faction.position];
  if (!r) return null;

  return (
    <g>
      <motion.rect
        x={r.x} y={r.y} width={r.w} height={r.h} rx={28}
        fill={faction.color}
        fillOpacity={isHighlighted ? 0.12 : 0.06}
        stroke={faction.color}
        strokeWidth={2}
        strokeDasharray="10 5"
        strokeOpacity={isHighlighted ? 0.65 : 0.35}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      />
      <motion.text
        x={r.lx} y={r.ly}
        textAnchor="middle"
        fill={faction.color}
        fontSize="12"
        fontFamily="var(--font-mono)"
        letterSpacing="6"
        fontWeight="bold"
        fillOpacity={isHighlighted ? 1 : 0.6}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        {faction.name.toUpperCase().split('').join(' ')}
      </motion.text>
    </g>
  );
}
