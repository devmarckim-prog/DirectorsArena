// components/workspace/nexus-graph.tsx

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character, deriveNexusData } from './nexus-types';
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
  
  const handleNodeClick = useCallback((id: string) => {
    setSelectedNode(prev => {
      const newSelection = prev === id ? null : id;
      if (onSelectId) {
        setTimeout(() => onSelectId(newSelection || ""), 0);
      }
      return newSelection;
    });
  }, [onSelectId]);

  const layoutEngine = useMemo(() => new AntigravityLayoutEngine(), []);
  
  // ✅ 3. 데이터 전처리 (deriveNexusData 적용)
  const nexusData = useMemo(() => {
    return deriveNexusData(characters);
  }, [characters]);

  // ✅ 4. 레이아웃 계산
  const { positions, zones } = useMemo(() => {
    try {
      return layoutEngine.calculatePositions(nexusData.characters as any);
    } catch (error) {
      console.error('❌ 레이아웃 계산 실패:', error);
      return { positions: {}, zones: [] };
    }
  }, [nexusData.characters, layoutEngine]);
  
  // ✅ 연결선 계산
  const connections = useMemo(() => {
    return layoutEngine.calculateConnections(nexusData.relationships, positions);
  }, [nexusData.relationships, positions, layoutEngine]);

  const protagonistId = useMemo(() => {
    const sorted = [...nexusData.characters].sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
    return sorted[0]?.id;
  }, [nexusData.characters]);

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
          {connections.map((conn, i) => {
            const isHighlighted = 
              !selectedNode || 
              conn.from === selectedNode || 
              conn.to === selectedNode;
            
            const isHovered =
              hoveredNode === conn.from ||
              hoveredNode === conn.to;
            
            return (
              <g key={`conn-${conn.from}-${conn.to}-${i}`}>
                <motion.path
                  d={conn.path}
                  stroke={conn.color}
                  strokeWidth={conn.strokeWidth}
                  strokeDasharray={conn.dashArray}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isHighlighted ? conn.opacity : 0.05 }}
                  transition={{ duration: 1 }}
                />
                
                {/* ✅ 관계 설명 라벨 (호버 시 표시) */}
                {isHovered && conn.description && (
                  <g>
                    <rect
                      x={(positions[conn.from].x + positions[conn.to].x) / 2 - 80}
                      y={(positions[conn.from].y + positions[conn.to].y) / 2 - 20}
                      width="160"
                      height="36"
                      fill="rgba(10, 10, 15, 0.95)"
                      stroke={conn.color}
                      strokeWidth="1.5"
                      rx="6"
                    />
                    <text
                      x={(positions[conn.from].x + positions[conn.to].x) / 2}
                      y={(positions[conn.from].y + positions[conn.to].y) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="11"
                      fontFamily="var(--font-body, -apple-system, sans-serif)"
                    >
                      {conn.description}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g id="nodes-layer">
          {nexusData.characters.map((char, index) => {
            const pos = positions[char.id];
            if (!pos) return null;
            return (
              <NexusNode
                key={`node-${char.id}`}
                index={index}
                character={char as any}
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

      {/* ✅ 범례 개선 (관계 타입별) */}
      <div style={{ 
        position: 'absolute', bottom: 30, left: 30, 
        background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', 
        padding: '14px 20px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', 
        zIndex: 50, display: 'flex', flexDirection: 'column', gap: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px', letterSpacing: '1px' }}>관계 유형</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: '첫사랑/연인', color: '#ff006e', dash: 'none', width: 3 }, 
            { label: '가족', color: '#a78bfa', dash: 'none', width: 2.5 }, 
            { label: '절친', color: '#06ffa5', dash: '6 3', width: 2 },
            { label: '멘토', color: '#ffbe0b', dash: '4 2', width: 2 },
            { label: '동맹', color: '#06ffa5', dash: 'none', width: 1.5 },
            { label: '적대', color: '#ff4444', dash: '8 4', width: 2 },
          ].map(item => (
            <div key={item.label} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="10">
                <line x1="0" y1="5" x2="24" y2="5" stroke={item.color} strokeWidth={item.width} strokeDasharray={item.dash} />
              </svg>
              <span style={{ fontSize: '11px', opacity: 0.9 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
