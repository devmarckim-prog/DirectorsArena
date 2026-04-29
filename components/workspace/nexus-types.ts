// components/workspace/nexus-types.ts

export interface Character {
  id: string;
  name: string;
  gender?: string;
  ageGroup?: string;
  role: string;
  description?: string;
  relationshipToProtagonist?: string;  // ✅ 기존 필드 유지
  groups?: string[];  // ✅ 진영 정보
  relations?: RelationItem[];  // ✅ 새로운 관계 필드
}

export interface RelationItem {
  target: string;
  type: 'enemy' | 'ally' | 'family' | 'romantic' | 'friend' | 'mentor' | 'neutral';
  description?: string;
  strength?: number;
}

export interface NexusCharacter {
  id: string;
  name: string;
  role: string;
  faction: string;
  importance: number;
  color: string;
  ageGroup?: string;  // ✅ 타임라인 구분용
}

export interface NexusRelationship {
  from: string;
  to: string;
  type: 'enemy' | 'ally' | 'family' | 'romantic' | 'friend' | 'mentor' | 'neutral';
  strength: number;
  description?: string;
}

export interface NexusFaction {
  name: string;
  displayName: string;  // ✅ 한글 표시명
  color: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}

export interface NexusData {
  characters: NexusCharacter[];
  relationships: NexusRelationship[];
  factions: NexusFaction[];
}

// ✅ 메인 변환 함수
export function deriveNexusData(rawCharacters: Character[]): NexusData {
  console.log('🔄 deriveNexusData 시작:', rawCharacters);
  
  if (!rawCharacters || rawCharacters.length === 0) {
    console.warn('⚠️ 캐릭터 없음');
    return { characters: [], relationships: [], factions: [] };
  }
  
  // 1. 캐릭터 변환
  const characters: NexusCharacter[] = rawCharacters.map((char, index) => {
    const faction = inferFaction(char);
    const importance = inferImportance(char, index, rawCharacters);
    const color = getFactionColor(faction);
    
    return {
      id: char.id,
      name: char.name,
      role: char.role,
      faction,
      importance,
      color,
      ageGroup: char.ageGroup
    };
  });
  
  // 2. 관계 변환 (relations 필드 우선)
  const relationships = deriveRelationships(rawCharacters, characters);
  
  // 3. 진영 생성
  const factions = deriveFactions(characters, rawCharacters);
  
  console.log('✅ 변환 완료:', {
    characters: characters.length,
    relationships: relationships.length,
    factions: factions.length
  });
  
  return { characters, relationships, factions };
}

// ✅ 진영 추론 (groups 우선 → role 폴백)
function inferFaction(char: Character): string {
  // 1단계: groups 사용
  if (char.groups && char.groups.length > 0) {
    return char.groups[0];
  }
  
  // 2단계: ageGroup 기반 타임라인 구분
  const age = char.ageGroup?.toLowerCase() || '';
  if (age.includes('과거') || age.includes('20대')) {
    return '1985_노래방_창업팀';
  }
  if (age.includes('현재') || age.includes('60대')) {
    return '2025_현재';
  }
  if (age.includes('30대')) {
    return '2세대';
  }
  
  // 3단계: role 기반
  const role = char.role?.toLowerCase() || '';
  if (role.includes('주인공')) {
    return '주인공_진영';
  }
  if (role.includes('조연')) {
    return '조연_진영';
  }
  
  return '중립';
}

// ✅ 중요도 추론
function inferImportance(char: Character, index: number, all: Character[]): number {
  const role = char.role?.toLowerCase() || '';
  const relCount = char.relations?.length || 0;
  
  // 주인공
  if (role.includes('주인공') || role.includes('protagonist')) {
    return 10;
  }
  
  // 관계가 많을수록 중요
  if (relCount >= 3) return 9;
  if (relCount === 2) return 7;
  if (relCount === 1) return 6;
  
  // 등장 순서
  if (index < 2) return 8;
  
  return 5;
}

// ✅ 진영 색상 (타임라인별 구분)
function getFactionColor(faction: string): string {
  const colorMap: Record<string, string> = {
    // 과거 타임라인
    '1985_노래방_창업팀': '#06ffa5',
    '과거_주인공_진영': '#06ffa5',
    
    // 현재 타임라인
    '2025_현재': '#ff006e',
    '현재_기업가': '#ff006e',
    '현재_음악교사': '#a78bfa',
    
    // 2세대
    '2세대': '#ffbe0b',
    '현재_2세대': '#ffbe0b',
    
    // 기본
    '주인공_진영': '#06ffa5',
    '조연_진영': '#888888',
    '중립': '#666666'
  };
  
  return colorMap[faction] || '#888888';
}

// ✅ 관계 변환 (핵심 로직)
function deriveRelationships(
  rawChars: Character[],
  nexusChars: NexusCharacter[]
): NexusRelationship[] {
  const relationships: NexusRelationship[] = [];
  const processed = new Set<string>();
  
  // 1단계: relations 필드에서 추출
  rawChars.forEach(char => {
    if (!char.relations || char.relations.length === 0) return;
    
    char.relations.forEach(rel => {
      const fromChar = nexusChars.find(c => c.name === char.name);
      const toChar = nexusChars.find(c => c.name === rel.target);
      
      if (!fromChar || !toChar) {
        console.warn('⚠️ 관계 대상 미발견:', char.name, '→', rel.target);
        return;
      }
      
      // 중복 방지 (양방향 처리)
      const key1 = `${fromChar.id}-${toChar.id}`;
      const key2 = `${toChar.id}-${fromChar.id}`;
      
      if (processed.has(key1) || processed.has(key2)) return;
      
      relationships.push({
        from: fromChar.id,
        to: toChar.id,
        type: normalizeRelationType(rel.type),
        strength: rel.strength || 5,
        description: rel.description
      });
      
      processed.add(key1);
      processed.add(key2);
    });
  });
  
  console.log(`✅ ${relationships.length}개 관계 생성`);
  
  // 2단계: 폴백 (relations 없는 경우 자동 생성)
  if (relationships.length === 0) {
    console.log('📝 relations 없음 - 자동 생성');
    return generateFallbackRelationships(nexusChars);
  }
  
  return relationships;
}

// ✅ 관계 타입 정규화
function normalizeRelationType(rawType: string): NexusRelationship['type'] {
  const normalized = rawType.toLowerCase();
  
  if (normalized.includes('romantic') || normalized.includes('사랑') || normalized.includes('연인')) {
    return 'romantic';
  }
  if (normalized.includes('family') || normalized.includes('가족') || normalized.includes('부모') || normalized.includes('자식')) {
    return 'family';
  }
  if (normalized.includes('friend') || normalized.includes('친구') || normalized.includes('절친')) {
    return 'friend';
  }
  if (normalized.includes('mentor') || normalized.includes('스승') || normalized.includes('멘토')) {
    return 'mentor';
  }
  if (normalized.includes('enemy') || normalized.includes('적') || normalized.includes('라이벌')) {
    return 'enemy';
  }
  if (normalized.includes('ally') || normalized.includes('동맹') || normalized.includes('협력')) {
    return 'ally';
  }
  
  return 'neutral';
}

// ✅ 폴백: 자동 관계 생성
function generateFallbackRelationships(chars: NexusCharacter[]): NexusRelationship[] {
  const rels: NexusRelationship[] = [];
  const processed = new Set<string>();
  
  // 같은 진영끼리 연결
  chars.forEach((c1, i) => {
    chars.forEach((c2, j) => {
      if (i >= j) return;
      
      const key = `${c1.id}-${c2.id}`;
      if (processed.has(key)) return;
      
      if (c1.faction === c2.faction && c1.faction !== '중립') {
        rels.push({
          from: c1.id,
          to: c2.id,
          type: 'ally',
          strength: 6
        });
        processed.add(key);
      }
    });
  });
  
  return rels;
}

// ✅ 진영 생성
function deriveFactions(chars: NexusCharacter[], rawChars: Character[]): NexusFaction[] {
  const factionSet = new Set(chars.map(c => c.faction));
  const factions: NexusFaction[] = [];
  
  const factionConfig: Record<string, { displayName: string, position: 'left' | 'right' | 'top' | 'bottom' }> = {
    '1985_노래방_창업팀': { displayName: '1985 노래방 창업팀', position: 'left' },
    '과거_주인공_진영': { displayName: '과거 주인공 진영', position: 'left' },
    '2025_현재': { displayName: '2025 현재', position: 'right' },
    '현재_기업가': { displayName: '현재 기업가', position: 'right' },
    '현재_음악교사': { displayName: '현재 음악교사', position: 'right' },
    '2세대': { displayName: '2세대', position: 'bottom' },
    '현재_2세대': { displayName: '2세대', position: 'bottom' },
    '주인공_진영': { displayName: '주인공', position: 'left' },
    '조연_진영': { displayName: '조연', position: 'right' }
  };
  
  let posIndex = 0;
  const positions: ('left' | 'right' | 'top' | 'bottom')[] = ['left', 'right', 'top', 'bottom'];
  
  factionSet.forEach(name => {
    const config = factionConfig[name];
    const color = getFactionColor(name);
    
    factions.push({
      name,
      displayName: config?.displayName || name,
      color,
      position: config?.position || positions[posIndex++ % 4]
    });
  });
  
  return factions;
}

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100;
}
