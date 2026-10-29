// components/workspace/nexus-node.tsx

import { motion } from 'framer-motion';

interface NexusNodeProps {
  character: any;
  position: { x: number; y: number; size: number; color: string };
  isSelected: boolean;
  isHovered: boolean;
  isProtagonist: boolean;
  index: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function NexusNode({
  character,
  position,
  isSelected,
  isHovered,
  isProtagonist,
  index,
  onClick,
  onMouseEnter,
  onMouseLeave
}: NexusNodeProps) {
  const baseSize = position.size * 1.4;
  const radius = baseSize / 2;

  const x = position.x ?? 0;
  const y = position.y ?? 0;

  // ✅ 심플한 실루엣 아이콘 렌더링 함수
  const renderSimpleAvatar = () => {
    const age = character.age || 30;
    const gender = character.gender?.toUpperCase();
    const isAlien = character.traits?.some((t: string) => t.toLowerCase().includes('외계') || t.toLowerCase().includes('alien')) || 
                   character.description?.includes('외계') || character.description?.includes('alien') || gender === 'OTHER';

    const iconColor = "#ffffff";
    const iconScale = radius * 0.04; // 노드 크기에 맞춘 스케일

    if (isAlien) {
      // Alien Icon (Minimalist)
      return (
        <g transform={`scale(${iconScale}) translate(-12, -12)`}>
          <path fill={iconColor} d="M12,2C8,2,4,6,4,11s3,9,8,9s8-4,8-9S16,2,12,2z M9,12c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S9.6,12,9,12z M15,12c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S15.6,12,15,12z" />
        </g>
      );
    }

    if (age < 13) {
      // Child Icon
      return (
        <g transform={`scale(${iconScale}) translate(-12, -12)`}>
          <circle fill={iconColor} cx="12" cy="8" r="4" />
          <path fill={iconColor} d="M12,14c-4,0-6,2-6,4v2h12v-2C18,16,16,14,12,14z" />
        </g>
      );
    }

    if (gender === 'FEMALE') {
      // Woman Icon (Longer hair silhouette)
      return (
        <g transform={`scale(${iconScale}) translate(-12, -12)`}>
          <path fill={iconColor} d="M12,2c-2.8,0-5,2.2-5,5v1c0,1.1,0.4,2.1,1,2.8C6.1,12.1,4,14.8,4,18v2h16v-2c0-3.2-2.1-5.9-4-7.2c0.6-0.7,1-1.7,1-2.8V7C17,4.2,14.8,2,12,2z" />
        </g>
      );
    }

    if (gender === 'MALE') {
      // Man Icon
      return (
        <g transform={`scale(${iconScale}) translate(-12, -12)`}>
          <circle fill={iconColor} cx="12" cy="7" r="5" />
          <path fill={iconColor} d="M12,14c-4.4,0-8,2-8,5v1h16v-1C20,16,16.4,14,12,14z" />
        </g>
      );
    }

    // Default / Neutral Icon
    return (
      <g transform={`scale(${iconScale}) translate(-12, -12)`}>
        <path fill={iconColor} d="M12,12c2.2,0,4-1.8,4-4s-1.8-4-4-4S8,5.8,8,8S9.8,12,12,12z M12,14c-2.7,0-8,1.3-8,4v2h16v-2C20,15.3,14.7,14,12,14z" />
      </g>
    );
  };

  return (
    <motion.g
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      animate={{
        scale: isSelected ? 1.2 : (isHovered ? 1.1 : 1),
      }}
      transition={{ duration: 0.2 }}
    >
      <g transform={`translate(${x}, ${y})`}>
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-10; 0,0"
            dur={`${3 + (index % 2) * 0.5}s`}
            repeatCount="indefinite"
            begin={`${index * 0.2}s`}
          />

          {isProtagonist && (
            <g opacity={0.3}>
              <circle r={radius + 15} fill="none" stroke={position.color} strokeWidth="1.5">
                <animate attributeName="r" values={`${radius + 15};${radius + 30};${radius + 15}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          <circle
            r={radius}
            fill="#0d0d1a"
            stroke={position.color}
            strokeWidth={isProtagonist ? 5 : 3}
            filter={isProtagonist || isHovered ? "url(#glow)" : "none"}
          />

          {/* ✅ 프리미엄 심플 실루엣 아이콘 적용 */}
          {renderSimpleAvatar()}

          <text 
            y={radius + 30} 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="18" 
            fontWeight="500" 
            style={{ 
              userSelect: 'none', 
              textShadow: '0 0 10px rgba(0,0,0,0.9)',
              letterSpacing: '-0.01em'
            }}
          >
            {character.name}
          </text>

          <text 
            y={radius + 52} 
            textAnchor="middle" 
            fill={position.color} 
            fontSize="12" 
            fontWeight="400" 
            opacity="0.9" 
            style={{ 
              userSelect: 'none', 
              fontFamily: 'monospace',
              letterSpacing: '0.08em'
            }}
          >
            {character.job?.toUpperCase()}
          </text>
        </g>
      </g>
    </motion.g>
  );
}
