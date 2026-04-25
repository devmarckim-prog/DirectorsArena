"use client";

import { motion } from "framer-motion";
import type { NexusCharacter, NodeLayout } from "./nexus-types";
import { hashString } from "./nexus-types";
import { CANVAS_W, CANVAS_H } from "./nexus-layout";

interface NexusNodeProps {
  character: NexusCharacter;
  layout: NodeLayout;
  isSelected: boolean;
  onClick: () => void;
}

const ARCHETYPE_SYMBOL: Record<string, string> = {
  PROTAGONIST: '★',
  VILLAIN: '✦',
  ALLY: '◆',
  NEUTRAL: '●',
};

export function NexusNode({ character, layout, isSelected, onClick }: NexusNodeProps) {
  // Deterministic animation timing — no Math.random()
  const seed = hashString(character.id);
  const floatDuration = 2.5 + (seed % 20) / 10;
  const floatDelay = (seed % 15) / 10;

  const leftPct = (layout.x / CANVAS_W) * 100;
  const topPct = (layout.y / CANVAS_H) * 100;
  const symbol = ARCHETYPE_SYMBOL[character.archetype] ?? '●';

  return (
    <motion.button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : 20,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
      animate={{ scale: isSelected ? 1.2 : 1, y: [0, -8, 0] }}
      transition={{
        scale: { duration: 0.3, ease: 'easeOut' },
        y: { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* Pulse ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: layout.size + 18,
          height: layout.size + 18,
          borderRadius: '50%',
          border: `1px solid ${layout.color}`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.3, 0.04, 0.3] }}
        transition={{ duration: floatDuration + 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Avatar circle */}
      <div
        style={{
          width: layout.size,
          height: layout.size,
          borderRadius: '50%',
          background: '#070710',
          border: `${isSelected ? 3 : 2}px solid ${layout.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSelected
            ? `0 0 28px ${layout.color}80, 0 0 8px ${layout.color}40`
            : `0 0 8px ${layout.color}25`,
          color: layout.color,
          fontSize: Math.round(layout.size * 0.38),
          transition: 'box-shadow 0.3s, border-width 0.3s',
        }}
      >
        {symbol}
      </div>

      {/* Name label */}
      <div
        style={{
          position: 'absolute',
          top: layout.size + 12,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
          letterSpacing: '0.02em',
          textShadow: `
            0 0 12px rgba(0,0,0,1),
            0 0 4px ${layout.color}CC
          `,
          transition: 'color 0.3s, transform 0.3s',
          pointerEvents: 'none',
        }}
      >
        {character.name}
      </div>

      {/* Faction badge — only when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: layout.size + 26,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '7px',
            fontFamily: 'monospace',
            color: layout.color,
            opacity: 0.65,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            letterSpacing: '1.5px',
          }}
        >
          {character.faction.toUpperCase()}
        </motion.div>
      )}
    </motion.button>
  );
}
