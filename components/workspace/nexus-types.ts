export type Archetype = 'PROTAGONIST' | 'ALLY' | 'VILLAIN' | 'NEUTRAL';
export type RelationshipType = 'enemy' | 'ally' | 'neutral' | 'family' | 'romance';
export type FactionPosition = 'left' | 'right' | 'center' | 'bottom';

export interface NexusCharacter {
  id: string;
  name: string;
  job: string;
  faction: string;
  archetype: Archetype;
  importance: number; // 1-10
  secret?: string;
  desire?: string;
  traits?: string[];
}

export interface NexusRelationship {
  from: string;
  to: string;
  type: RelationshipType;
  strength: number; // 1-10
  description?: string;
}

export interface NexusFaction {
  name: string;
  color: string;
  position: FactionPosition;
}

export interface NexusData {
  characters: NexusCharacter[];
  relationships: NexusRelationship[];
  factions: NexusFaction[];
}

export interface NodeLayout {
  x: number;
  y: number;
  size: number;
  color: string;
  faction: string;
}

// ── Deterministic hash (no Math.random() outside useMemo) ──
export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Constants ──
const FACTION_COLORS = ['#C5A059', '#9d4edd', '#ff006e', '#06d6a0', '#3B82F6', '#f72585'];
const FACTION_POSITIONS: FactionPosition[] = ['left', 'right', 'center', 'bottom'];

// ── Archetype inference from job string ──
function inferArchetype(job: string): Archetype {
  const j = (job ?? '').toLowerCase();
  if (j.includes('protagonist') || j.includes('주인공') || j.includes('hero')) return 'PROTAGONIST';
  if (j.includes('antagonist') || j.includes('villain') || j.includes('enemy') || j.includes('rival') || j.includes('악당')) return 'VILLAIN';
  if (j.includes('ally') || j.includes('mentor') || j.includes('friend') || j.includes('family') || j.includes('조력자')) return 'ALLY';
  return 'NEUTRAL';
}

function inferImportance(archetype: Archetype, idx: number): number {
  if (archetype === 'PROTAGONIST') return 10;
  if (archetype === 'VILLAIN') return 8;
  if (archetype === 'ALLY') return 6;
  return Math.max(3, 5 - idx);
}

function inferRelType(type: string): RelationshipType {
  const t = (type ?? '').toLowerCase();
  if (t.includes('enemy') || t.includes('rival') || t.includes('conflict') || t.includes('antagonist')) return 'enemy';
  if (t.includes('romance') || t.includes('love')) return 'romance';
  if (t.includes('family') || t.includes('blood') || t.includes('sibling')) return 'family';
  if (t.includes('ally') || t.includes('friend') || t.includes('mentor')) return 'ally';
  return 'neutral';
}

// ── Main derivation function ──
export function deriveNexusData(rawChars: any[]): NexusData {
  if (!rawChars || rawChars.length === 0) {
    return { characters: [], relationships: [], factions: [] };
  }

  // 1. Build faction map
  const factionMap = new Map<string, { color: string; position: FactionPosition }>();
  rawChars.forEach((c) => {
    const groupName: string = c.group ?? c.groups?.[0] ?? 'Independent';
    if (!factionMap.has(groupName)) {
      const idx = factionMap.size;
      factionMap.set(groupName, {
        color: FACTION_COLORS[idx % FACTION_COLORS.length],
        position: FACTION_POSITIONS[idx % FACTION_POSITIONS.length],
      });
    }
  });

  // 2. Build NexusFaction[]
  const factions: NexusFaction[] = Array.from(factionMap.entries()).map(([name, meta]) => ({
    name,
    color: meta.color,
    position: meta.position,
  }));

  // 3. Build NexusCharacter[]
  const characters: NexusCharacter[] = rawChars.map((c, idx) => {
    const archetype = inferArchetype(c.job ?? '');
    const faction: string = c.group ?? c.groups?.[0] ?? 'Independent';
    return {
      id: c.id ?? `char_${idx}`,
      name: c.name ?? 'Unknown',
      job: c.job ?? '',
      faction,
      archetype,
      importance: c.importance ?? inferImportance(archetype, idx),
      secret: c.secret,
      desire: c.desire,
      traits: c.traits,
    };
  });

  // 4. Build NexusRelationship[] from explicit relations field
  const relationships: NexusRelationship[] = [];
  rawChars.forEach((c) => {
    const rels: any[] = c.relations ?? [];
    rels.forEach((rel) => {
      const target = rawChars.find((rc) => rc.name === rel.target || rc.id === rel.to);
      if (!target) return;
      relationships.push({
        from: c.id,
        to: target.id,
        type: inferRelType(rel.type ?? ''),
        strength: rel.strength ?? 5,
        description: rel.description,
      });
    });
  });

  // 5. Generate implicit relationships when none exist
  if (relationships.length === 0 && characters.length > 1) {
    const protagonist = characters.find((c) => c.archetype === 'PROTAGONIST') ?? characters[0];
    characters.forEach((c) => {
      if (c.id === protagonist.id) return;
      const type: RelationshipType =
        c.archetype === 'VILLAIN' ? 'enemy' :
        c.archetype === 'ALLY' ? 'ally' : 'neutral';
      relationships.push({
        from: protagonist.id,
        to: c.id,
        type,
        strength: c.archetype === 'VILLAIN' ? 9 : c.archetype === 'ALLY' ? 7 : 4,
      });
    });
  }

  return { characters, relationships, factions };
}
