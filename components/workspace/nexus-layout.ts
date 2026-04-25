import type { NexusCharacter, NexusFaction, NexusRelationship, NodeLayout, FactionPosition } from './nexus-types';
import { hashString } from './nexus-types';

export const CANVAS_W = 900;
export const CANVAS_H = 600;

interface ZoneDef {
  baseX: number;
  baseY: number;
  spreadX: number;
  spreadY: number;
}

const ZONE_DEFS: Record<FactionPosition, ZoneDef> = {
  left:   { baseX: 160, baseY: 300, spreadX: 90,  spreadY: 170 },
  right:  { baseX: 740, baseY: 300, spreadX: 90,  spreadY: 170 },
  center: { baseX: 450, baseY: 280, spreadX: 70,  spreadY: 130 },
  bottom: { baseX: 450, baseY: 510, spreadX: 150, spreadY: 45  },
};

export interface ConnectionLayout {
  path: string;
  color: string;
  strokeWidth: number;
  dashArray: string;
  opacity: number;
  from: string;
  to: string;
}

export const RELATIONSHIP_STYLES: Record<string, { color: string; dashArray: string }> = {
  enemy:   { color: '#ff006e', dashArray: '6 4' },
  ally:    { color: '#06d6a0', dashArray: '0'   },
  family:  { color: '#9d4edd', dashArray: '0'   },
  romance: { color: '#f72585', dashArray: '4 3' },
  neutral: { color: '#52525b', dashArray: '2 4' },
};

export class AntigravityLayoutEngine {
  calculatePositions(
    characters: NexusCharacter[],
    factions: NexusFaction[]
  ): Record<string, NodeLayout> {
    const positions: Record<string, NodeLayout> = {};

    const factionColorMap = new Map(factions.map((f) => [f.name, f.color]));
    const factionPositionMap = new Map(factions.map((f) => [f.name, f.position]));

    // Group characters by faction
    const groups = new Map<string, NexusCharacter[]>();
    characters.forEach((c) => {
      const arr = groups.get(c.faction) ?? [];
      arr.push(c);
      groups.set(c.faction, arr);
    });

    groups.forEach((members, factionName) => {
      const position: FactionPosition = factionPositionMap.get(factionName) ?? 'center';
      const zone = ZONE_DEFS[position];
      const color = factionColorMap.get(factionName) ?? '#C5A059';

      // Sort by importance descending (most important nearest zone center)
      const sorted = [...members].sort((a, b) => b.importance - a.importance);
      const total = sorted.length;

      sorted.forEach((char, index) => {
        const importance = char.importance / 10;
        const size = 40 + Math.round(importance * 30); // 40–70px (Improved readability)

        // Vertical spread around zone center
        const yOffset = total === 1 ? 0 : ((index / (total - 1)) - 0.5) * zone.spreadY * 2;

        // Deterministic X jitter — no Math.random()
        const seed = hashString(char.id);
        const jitter = ((seed % 1000) / 1000 - 0.5) * zone.spreadX * 2;

        positions[char.id] = {
          x: Math.max(55, Math.min(CANVAS_W - 55, zone.baseX + jitter)),
          y: Math.max(55, Math.min(CANVAS_H - 55, zone.baseY + yOffset)),
          size,
          color,
          faction: factionName,
        };
      });
    });

    return positions;
  }

  private curvedPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const curvature = dist * 0.2;
    const cpX = midX - (dy / dist) * curvature;
    const cpY = midY + (dx / dist) * curvature;
    return `M ${from.x},${from.y} Q ${cpX},${cpY} ${to.x},${to.y}`;
  }

  buildConnections(
    relationships: NexusRelationship[],
    positions: Record<string, NodeLayout>
  ): ConnectionLayout[] {
    const connections: ConnectionLayout[] = [];

    relationships.forEach((rel) => {
      const fromPos = positions[rel.from];
      const toPos = positions[rel.to];
      if (!fromPos || !toPos) return;

      const style = RELATIONSHIP_STYLES[rel.type] ?? RELATIONSHIP_STYLES.neutral;
      connections.push({
        path: this.curvedPath(fromPos, toPos),
        color: style.color,
        strokeWidth: Math.max(0.8, rel.strength / 4),
        dashArray: style.dashArray,
        opacity: 0.25 + (rel.strength / 10) * 0.4,
        from: rel.from,
        to: rel.to,
      });
    });

    return connections;
  }
}
