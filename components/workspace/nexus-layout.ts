// components/workspace/nexus-layout.ts

import { NexusCharacter, NexusRelationship, NexusFaction, seededRandom, Character } from './nexus-types';

export interface LayoutPosition {
  x: number;
  y: number;
  size: number;
  color: string;
  faction: string;
}

export interface ConnectionPath {
  from: string;
  to: string;
  path: string;
  strokeWidth: number;
  color: string;
  opacity: number;
  dashArray?: string;
}

export interface DynamicZone {
  name: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
}

export class AntigravityLayoutEngine {
  private canvasWidth = 1200;
  private canvasHeight = 800;

  private PALETTE = [
    '#9d4edd', // 보라
    '#06ffa5', // 민트
    '#ffbe0b', // 골드
    '#ff006e', // 핑크
    '#3a86ff', // 블루
    '#fb5607', // 오렌지
    '#8338ec', // 딥퍼플
    '#00b4d8', // 시안
  ];

  // ✅ 진영 추론 엔진
  inferFaction(character: any, allFactions: string[]): string {
    // 1순위: groups 데이터 있으면 첫 번째 값 사용
    if (character.groups && character.groups.length > 0) {
      return character.groups[0];
    }

    // 2순위: job + traits 키워드로 추론
    const text = [character.job, ...(character.traits ?? [])].join(' ').toLowerCase();

    const keywords = {
      PROTAG_ALLIANCE: ['주인공', '형사', '경찰', '검사', '의사', '기자', '선생', '히어로', '민우', '서아'],
      ANTAG_FORCE: ['빌런', '악당', '보스', '조직', '악역', '범죄', '살인', '재벌'],
      NEUTRAL_ZONE: ['중립', '기자', '목격자', '시민', '조력자', '정보원'],
    };

    for (const [faction, keys] of Object.entries(keywords)) {
      if (keys.some(k => text.includes(k))) return faction;
    }

    // 3순위: 기존 진영 중 가장 인원 적은 곳 (또는 기본값)
    return 'NEUTRAL_ZONE';
  }

  // ✅ 동적 존 생성 엔진
  buildDynamicZones(factionGroups: Map<string, any[]>): DynamicZone[] {
    const factionCount = factionGroups.size;
    const names = Array.from(factionGroups.keys());
    
    const ZONE_PRESETS: Record<number, any[]> = {
      1: [{ cx: 600, cy: 400, w: 900, h: 600 }],
      2: [
        { cx: 220, cy: 400, w: 350, h: 600 },
        { cx: 980, cy: 400, w: 350, h: 600 },
      ],
      3: [
        { cx: 200, cy: 430, w: 300, h: 580 },
        { cx: 1000, cy: 430, w: 300, h: 580 },
        { cx: 600, cy: 140, w: 650, h: 200 },
      ],
      4: [
        { cx: 200, cy: 400, w: 300, h: 560 },
        { cx: 1000, cy: 400, w: 300, h: 560 },
        { cx: 600, cy: 130, w: 650, h: 180 },
        { cx: 600, cy: 690, w: 650, h: 160 },
      ],
    };

    let baseZones;
    if (factionCount <= 4) {
      baseZones = ZONE_PRESETS[factionCount] || ZONE_PRESETS[1];
    } else {
      const cols = Math.ceil(Math.sqrt(factionCount));
      const rows = Math.ceil(factionCount / cols);
      const zoneW = Math.floor(1100 / cols);
      const zoneH = Math.floor(700 / rows);
      
      baseZones = Array.from({ length: factionCount }, (_, i) => ({
        cx: 80 + (i % cols) * zoneW + zoneW / 2,
        cy: 80 + Math.floor(i / cols) * zoneH + zoneH / 2,
        w: zoneW - 20,
        h: zoneH - 20,
      }));
    }

    return baseZones.map((z, i) => ({
      ...z,
      name: names[i],
      color: this.PALETTE[i % this.PALETTE.length]
    }));
  }

  // ✅ 노드 배치 계산 (동적 존 대응)
  calculatePositions(
    characters: NexusCharacter[]
  ): { positions: Record<string, LayoutPosition>, zones: DynamicZone[] } {
    const layoutMap: Record<string, LayoutPosition> = {};
    
    // 1. 진영 분류 및 데이터 보충 (ID, Faction, Missing Relations)
    const factionGroups = new Map<string, any[]>();
    const protagonist = [...characters].sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1))[0];

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      if (!char.id) char.id = char.name || `char-${i}`;
      
      // ✅ 데이터 보강: 진영이 없으면 강제로 할당
      if (!char.group && !char.faction) {
        if (char.id === protagonist?.id) char.group = "PROTAGONIST";
        else if (i === 1) char.group = "ANTAGONIST";
        else char.group = "NEUTRAL";
      }

      // ✅ 데이터 보강: 관계가 전혀 없으면 주인공과 강제 연결
      if (!char.relations || char.relations.length === 0) {
        if (char.id !== protagonist?.id && protagonist) {
          char.relations = [{
            target: protagonist.name,
            type: "ALLY",
            strength: 5,
            description: "Automatically linked for story continuity"
          }];
        }
      }
      
      const faction = this.inferFaction(char, Array.from(factionGroups.keys()));
      if (!factionGroups.has(faction)) factionGroups.set(faction, []);
      factionGroups.get(faction)!.push(char);
    }

    // 2. 동적 존 생성
    const dynamicZones = this.buildDynamicZones(factionGroups);
    const factionZoneMap = new Map<string, DynamicZone>();
    dynamicZones.forEach(z => factionZoneMap.set(z.name, z));

    // 3. 진영별 노드 배치
    factionGroups.forEach((members, factionName) => {
      const zone = factionZoneMap.get(factionName)!;
      const sorted = [...members].sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
      const n = sorted.length;
      
      const cols = n <= 2 ? 1 : (n <= 5 ? 2 : 3);

      sorted.forEach((char, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // ✅ 가독성 개선: 공백을 줄이기 위해 xOffset 및 ySpacing 조정
        const xOffset = (col - (cols - 1) / 2) * 110; 
        const ySpacing = Math.min(130, (zone.h - 100) / Math.ceil(n / cols));
        const yStart = zone.cy - (zone.h / 2) + 80;

        let posX = zone.cx + xOffset;
        let posY = yStart + row * ySpacing;

        // ✅ STEP 5: 개별 노드 좌표 클램핑
        posX = Math.max(80, Math.min(1120, posX));
        posY = Math.max(80, Math.min(720, posY));

        const importance = char.importance ?? 5;
        const nodeSize = importance >= 9 ? 85 : (importance >= 7 ? 75 : 65);

        layoutMap[char.id] = {
          x: posX,
          y: posY,
          size: nodeSize,
          color: zone.color,
          faction: factionName,
        };
      });
    });

    // 4. 충돌 해소
    this.resolveCollisions(Object.values(layoutMap));

    return { positions: layoutMap, zones: dynamicZones };
  }

  // ✅ 충돌 방지 (Force Relaxation)
  private resolveCollisions(nodes: LayoutPosition[], minDist = 110, iterationsCount = 40) {
    for (let iter = 0; iter < iterationsCount; iter++) {
      let moved = false;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          
          if (dist < minDist) {
            const push = (minDist - dist) / 2;
            const nx = (dx / dist) * push;
            const ny = (dy / dist) * push;
            
            nodes[j].x += nx;
            nodes[j].y += ny;
            nodes[i].x -= nx;
            nodes[i].y -= ny;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
  }

  calculateConnections(
    relationships: NexusRelationship[],
    positions: Record<string, LayoutPosition>
  ): ConnectionPath[] {
    // nexus-graph.tsx에서 직접 처리하도록 요청됨 (STEP 3)
    return [];
  }
}
