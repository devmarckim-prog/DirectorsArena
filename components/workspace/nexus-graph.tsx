"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { deriveNexusData } from "./nexus-types";
import { AntigravityLayoutEngine, CANVAS_W, CANVAS_H } from "./nexus-layout";
import { FactionZone } from "./nexus-faction-zone";
import { NexusNode } from "./nexus-node";

interface NexusGraphProps {
  characters: any[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

// Singleton engine — stable reference across renders
const engine = new AntigravityLayoutEngine();

export function NexusGraph({ characters, selectedId, onSelectId }: NexusGraphProps) {

  // ── Derive structured data ──
  const nexusData = useMemo(() => deriveNexusData(characters ?? []), [characters]);

  // ── Calculate positions (deterministic) ──
  const positions = useMemo(
    () => engine.calculatePositions(nexusData.characters, nexusData.factions),
    [nexusData]
  );

  // ── Build connection paths ──
  const connections = useMemo(
    () => engine.buildConnections(nexusData.relationships, positions),
    [nexusData.relationships, positions]
  );

  // ── Selected character detail ──
  const selectedChar = nexusData.characters.find((c) => c.id === selectedId) ?? null;

  const handleNodeClick = (id: string) => {
    onSelectId(selectedId === id ? null : id);
  };

  // ── Empty state ──
  if (nexusData.characters.length === 0) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center border border-white/5 bg-black/40 rounded-[3rem]">
        <Fingerprint className="text-brand-gold opacity-20 mb-4 animate-pulse" size={40} />
        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em]">
          No Characters Registered
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-[3rem] bg-[radial-gradient(ellipse_at_center,_#12121f_0%,_#050508_100%)] border border-white/5"
      style={{ height: '600px' }}
    >
      {/* ── SVG Layer: Faction zones + Connection lines ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="nexus-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nexus-glow-strong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faction zones */}
        {nexusData.factions.map((faction) => {
          const isHighlighted =
            selectedChar?.faction === faction.name;
          return (
            <FactionZone key={faction.name} faction={faction} isHighlighted={isHighlighted} />
          );
        })}

        {/* Connection lines */}
        {connections.map((conn, i) => {
          const isInvolved =
            selectedId === null ||
            conn.from === selectedId ||
            conn.to === selectedId;
          return (
            <motion.path
              key={i}
              d={conn.path}
              stroke={conn.color}
              strokeWidth={conn.strokeWidth}
              fill="none"
              filter="url(#nexus-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isInvolved ? conn.opacity : conn.opacity * 0.18,
              }}
              transition={{
                pathLength: { duration: 1.4, ease: 'easeOut', delay: i * 0.07 },
                opacity: { duration: 0.35 },
              }}
              strokeDasharray={conn.dashArray}
            />
          );
        })}

        {/* Relationship label on selected connection */}
        {selectedId && connections
          .filter((c) => c.from === selectedId || c.to === selectedId)
          .map((conn, i) => {
            const fromPos = positions[conn.from];
            const toPos = positions[conn.to];
            if (!fromPos || !toPos) return null;
            const lx = (fromPos.x + toPos.x) / 2;
            const ly = (fromPos.y + toPos.y) / 2 - 12;
            const rel = nexusData.relationships.find(
              (r) => r.from === conn.from && r.to === conn.to
            );
            return (
              <motion.text
                key={`lbl-${i}`}
                x={lx} y={ly}
                textAnchor="middle"
                fill={conn.color}
                fontSize="8"
                fontFamily="monospace"
                letterSpacing="2"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {(rel?.description ?? rel?.type ?? '').toUpperCase()}
              </motion.text>
            );
          })}
      </svg>

      {/* ── HTML Layer: Character nodes ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {nexusData.characters.map((char) => {
          const layout = positions[char.id];
          if (!layout) return null;
          return (
            <div key={char.id} style={{ pointerEvents: 'auto' }}>
              <NexusNode
                character={char}
                layout={layout}
                isSelected={selectedId === char.id}
                onClick={() => handleNodeClick(char.id)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Smart Character Detail Card (Dynamic Positioning) ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
        {selectedId && (() => {
          const char = nexusData.characters.find(c => c.id === selectedId);
          const charPos = positions[selectedId];
          if (!char || !charPos) return null;

          // 1. Calculate base position (normalized to viewport %)
          const cardWidth = 320;
          const cardHeight = 200;
          let cardX = (charPos.x / CANVAS_W) * 100;
          let cardY = ((charPos.y + charPos.size + 40) / CANVAS_H) * 100;

          // 2. Boundary Checks
          if (cardX < 20) cardX = 20;
          if (cardX > 80) cardX = 80;

          const isBottomOverflow = cardY > 65;
          if (isBottomOverflow) {
            cardY = ((charPos.y - charPos.size - 180) / CANVAS_H) * 100;
          }

          return (
            <motion.div
              key={selectedId}
              initial={{ scale: 0.9, opacity: 0, y: isBottomOverflow ? 10 : -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                position: 'absolute',
                left: `${cardX}%`,
                top: `${cardY}%`,
                transform: 'translateX(-50%)',
                background: 'rgba(5, 5, 10, 0.92)',
                border: `1.5px solid ${charPos.color}44`,
                borderRadius: '24px',
                padding: '24px',
                width: cardWidth,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${charPos.color}15`,
                pointerEvents: 'auto',
                zIndex: 1000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Connector Arrow */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                [isBottomOverflow ? 'bottom' : 'top']: '-8px',
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                [isBottomOverflow ? 'borderTop' : 'borderBottom']: `8px solid ${charPos.color}44`,
              }} />

              {/* Close Button */}
              <button 
                onClick={() => onSelectId(null)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-1"
              >
                <Fingerprint size={14} className="rotate-45" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: charPos.color }} />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: charPos.color }}>
                    {char.faction}
                  </span>
                </div>

                <div>
                  <h4 className="text-[20px] font-bold text-white tracking-tight leading-tight mb-1">
                    {char.name}
                  </h4>
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest font-mono">
                    {char.job || char.role}
                  </p>
                </div>

                {char.look && (
                  <p className="text-[13px] text-text-secondary leading-relaxed italic border-t border-white/5 pt-3">
                    "{char.look}"
                  </p>
                )}
              </div>
            </motion.div>
          );
        })()}
      </motion.div>

      {/* ── Legend ── */}
      <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
        {[
          { label: 'ENEMY', color: '#ff006e', dash: true },
          { label: 'ALLY', color: '#06d6a0', dash: false },
          { label: 'FAMILY', color: '#9d4edd', dash: false },
          { label: 'NEUTRAL', color: '#52525b', dash: true },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="22" height="8">
              <line
                x1="0" y1="4" x2="22" y2="4"
                stroke={item.color}
                strokeWidth="1.5"
                strokeDasharray={item.dash ? '4 3' : '0'}
              />
            </svg>
            <span style={{ fontSize: '7px', fontFamily: 'monospace', color: item.color, letterSpacing: '2px', opacity: 0.7 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
