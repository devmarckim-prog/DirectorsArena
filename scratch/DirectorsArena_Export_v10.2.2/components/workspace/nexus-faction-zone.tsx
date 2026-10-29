// components/workspace/nexus-faction-zone.tsx

import { motion } from 'framer-motion';
import { NexusFaction } from './nexus-types';
import { AntigravityLayoutEngine } from './nexus-layout';

interface NexusFactionZoneProps {
  faction: NexusFaction;
  layoutEngine: AntigravityLayoutEngine;
}

export function NexusFactionZone({ faction, layoutEngine }: NexusFactionZoneProps) {
  const pathData = layoutEngine.getFactionZonePath(faction.position);
  
  // ✅ 라벨 위치 계산 (영역별 최적화)
  const labelPositions: Record<string, { x: number, y: number }> = {
    left: { x: 180, y: 40 },
    right: { x: 1020, y: 40 },
    top: { x: 600, y: 150 },
    bottom: { x: 600, y: 540 }
  };
  
  const labelPos = labelPositions[faction.position];
  
  return (
    <g>
      {/* ✅ 영역 배경 */}
      <motion.path
        d={pathData}
        fill={`${faction.color}0A`}  // 4% 투명도
        stroke={`${faction.color}4D`}  // 30% 투명도
        strokeWidth="2"
        strokeDasharray="12,6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* ✅ 진영 라벨 */}
      <motion.text
        x={labelPos.x}
        y={labelPos.y}
        fill={faction.color}
        fontSize="14"
        fontWeight="600"
        fontFamily="monospace"
        textAnchor="middle"
        letterSpacing="4"
        initial={{ opacity: 0, y: labelPos.y - 10 }}
        animate={{ opacity: 0.8, y: labelPos.y }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {faction.name.replace(/_/g, ' ')}
      </motion.text>
    </g>
  );
}
