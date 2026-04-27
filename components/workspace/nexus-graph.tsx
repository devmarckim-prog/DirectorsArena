// components/workspace/nexus-graph.tsx

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character } from './nexus-types';
import { AntigravityLayoutEngine } from './nexus-layout';
import { NexusNode } from './nexus-node';

interface NexusGraphProps {
  characters: Character[];
  onSelectId?: (id: string) => void;
  selectedId?: string | null;
}

export function NexusGraph({ characters, onSelectId, selectedId }: NexusGraphProps) {
  // ✅ 1. State 선언
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ✅ 외부 selectedId와 내부 상태 동기화 (양방향 연동)
  useEffect(() => {
    if (selectedId !== undefined) {
      setSelectedNode(selectedId);
    }
  }, [selectedId]);
  
  // ✅ 2. 전문가 제안: 클릭 핸들러 메모이제이션 및 위치 최적화
  const handleNodeClick = useCallback((id: string) => {
    setSelectedNode(prev => {
      const newSelection = prev === id ? null : id;
      if (onSelectId) {
        // ✅ 전문가 제안: 렌더 사이클 밖으로 호출 분리하여 안정성 확보
        setTimeout(() => onSelectId(newSelection || ""), 0);
      }
      return newSelection;
    });
  }, [onSelectId]);

  const layoutEngine = useMemo(() => new AntigravityLayoutEngine(), []);
  
  // ✅ 3. 데이터 전처리
  const { normalizedChars, nameToId } = useMemo(() => {
    const nameMap: Record<string, string> = {};
    const processed = characters.map((c, i) => {
      const id = c.id || c.name || `char-${i}`;
      if (c.name) nameMap[c.name] = id;
      return { ...c, id };
    });
    return { normalizedChars: processed, nameToId: nameMap };
  }, [characters]);

  // ✅ 4. 레이아웃 계산
  const { positions, zones } = useMemo(() => {
    try {
      return layoutEngine.calculatePositions(normalizedChars as any);
    } catch (error) {
      console.error('❌ 레이아웃 계산 실패:', error);
      return { positions: {}, zones: [] };
    }
  }, [normalizedChars, layoutEngine]);
  
  const protagonistId = useMemo(() => {
    const sorted = [...normalizedChars].sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
    return sorted[0]?.id;
  }, [normalizedChars]);

  // ✅ 5. 렌더링
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '800px',
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)',
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'visible',
          zIndex: 10
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        
        {/* Faction Zones */}
        <g id="zones-layer">
          {zones.map((zone, zIdx) => (
            <g key={`zone-${zone.name || 'unnamed'}-${zIdx}`}>
              <rect x={zone.cx - zone.w/2} y={zone.cy - zone.h/2} width={zone.w} height={zone.h}
                fill={zone.color + '05'} stroke={zone.color + '30'} strokeWidth={1} strokeDasharray="10,5" rx={15} />
              <text x={zone.cx} y={zone.cy + zone.h/2 - 20} textAnchor="middle" fill={zone.color} fontSize={10} fontWeight={600} fontFamily="monospace" style={{ opacity: 0.4, textTransform: 'uppercase', letterSpacing: 3 }}>
                {(zone.name || 'UNKNOWN').replace(/_/g, ' ')}
              </text>
            </g>
          ))}
        </g>
        
        {/* Connections */}
        <g id="connections-layer">
          {normalizedChars.flatMap((char, cIdx) =>
            (char.relations ?? []).map((rel, rIdx) => {
              const fromPos = positions[char.id];
              const targetId = nameToId[rel.target] || rel.target;
              const toPos = positions[targetId];
              
              if (!fromPos || !toPos) return null;

              const isHighlighted = !selectedNode || selectedNode === char.id || selectedNode === targetId;
              const mx = (fromPos.x + toPos.x) / 2;
              const my = (fromPos.y + toPos.y) / 2 - 60;
              
              const stroke =
                rel.type.toLowerCase() === 'enemy'  ? '#ff006e' :
                rel.type.toLowerCase() === 'ally'   ? '#06ffa5' :
                rel.type.toLowerCase() === 'family' ? '#8b5cf6' : '#ffbe0b';

              return (
                <motion.path
                  key={`rel-${char.id}-${targetId}-${rIdx}`}
                  d={`M ${fromPos.x} ${fromPos.y} Q ${mx} ${my} ${toPos.x} ${toPos.y}`}
                  stroke={stroke} strokeWidth={rel.strength ? Math.max(1, rel.strength * 0.3) : 1.2}
                  strokeDasharray={rel.type.toLowerCase() === 'enemy' ? '6,4' : 'none'}
                  fill="none" initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isHighlighted ? 0.6 : 0.05 }}
                  transition={{ duration: 1 }}
                />
              );
            })
          )}
        </g>

        {/* Nodes */}
        <g id="nodes-layer">
          {normalizedChars.map((char, index) => {
            const pos = positions[char.id];
            if (!pos) return null;
            return (
              <NexusNode
                key={`node-${char.id}`}
                index={index}
                character={char}
                position={pos}
                isSelected={selectedNode === char.id}
                isHovered={hoveredNode === char.id}
                isProtagonist={char.id === protagonistId}
                onClick={() => handleNodeClick(char.id)}
                onMouseEnter={() => setHoveredNode(char.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* ✅ 전문가 제안: 범례 가독성 대폭 강화 (크기 확대) */}
      <div style={{ 
        position: 'absolute', bottom: 30, left: 30, 
        background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', 
        padding: '14px 20px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', 
        zIndex: 50, display: 'flex', gap: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {[
          { label: 'ENEMY', color: '#ff006e', dash: true }, 
          { label: 'ALLY', color: '#06ffa5', dash: false }, 
          { label: 'FAMILY', color: '#8b5cf6', dash: false }
        ].map(item => (
          <div key={item.label} style={{ color: item.color, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: 20, height: 3, 
              background: item.color, 
              borderBottom: item.dash ? `1.5px dashed ${item.color}` : 'none',
              borderRadius: '2px'
            }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
