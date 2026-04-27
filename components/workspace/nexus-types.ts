// components/workspace/nexus-types.ts

export interface Character {
  id: string;
  name: string;
  job: string;
  traits?: string[];
  groups?: string[];  // AI가 주는 진영 데이터
  relations?: RelationItem[];  // AI가 주는 관계 데이터
  personality?: string;
  age?: number;
}

export interface RelationItem {
  target: string;
  type: string;
  description?: string;
  strength?: number;
}

export interface NexusCharacter {
  id: string;
  name: string;
  job: string;
  faction: string;
  importance: number;
  color: string;
}

export interface NexusRelationship {
  from: string;
  to: string;
  type: 'enemy' | 'ally' | 'family' | 'neutral';
  strength: number;
}

export interface NexusFaction {
  name: string;
  color: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}

export interface NexusData {
  characters: NexusCharacter[];
  relationships: NexusRelationship[];
  factions: NexusFaction[];
}

// ✅ 메인 변환 함수 (3단계 폴백)
export function deriveNexusData(rawCharacters: Character[]): NexusData {
  console.log('🔄 deriveNexusData 시작:', rawCharacters.length, '명');
  
  // 1단계: 빈 배열 방어
  if (!rawCharacters || rawCharacters.length === 0) {
    console.warn('⚠️ 캐릭터 데이터 없음 - 더미 데이터 생성');
    return createDummyData();
  }
  
  // 2단계: 진영 추론 (groups 우선 → job 키워드 폴백)
  const characters: NexusCharacter[] = rawCharacters.map((char, index) => {
    const faction = inferFaction(char);
    const importance = inferImportance(char, index);
    const color = getFactionColor(faction);
    
    return {
      id: char.id || `char-${index}-${char.name || 'unnamed'}`,
      name: char.name || `캐릭터 ${index + 1}`,
      job: char.job || '역할 미정',
      faction,
      importance,
      color
    };
  });
  
  // 3단계: 관계 추론 (relations 우선 → 자동 생성 폴백)
  const relationships = deriveRelationships(rawCharacters, characters);
  
  // 4단계: 진영 목록 생성
  const factions = deriveFactions(characters);
  
  console.log('✅ 변환 완료:', {
    characters: characters.length,
    relationships: relationships.length,
    factions: factions.length
  });
  
  return { characters, relationships, factions };
}

// ✅ 진영 추론 (3단계 폴백)
function inferFaction(char: Character): string {
  // 1단계: AI가 준 groups 사용
  if (char.groups && char.groups.length > 0) {
    return normalizeFactionName(char.groups[0]);
  }
  
  // 2단계: job 분석 (확장 키워드)
  const jobStr = char.job?.toLowerCase() || '';
  if (/(villain|enemy|dark|terror|assassin|traitor|shadow|killer|criminal)/i.test(jobStr)) return 'ANTAGONIST_FORCE';
  if (/(hero|protagonist|leader|police|detective|officer|guardian|savior)/i.test(jobStr)) return 'PROTAGONIST_ALLIANCE';
  
  // 3단계: traits 분석 (확장 키워드)
  const traitStr = (char.traits || []).join(' ').toLowerCase();
  if (/(evil|cruel|greedy|manipulative|aggressive|cold-blooded)/i.test(traitStr)) return 'ANTAGONIST_FORCE';
  if (/(brave|justice|kind|loyal|righteous|compassionate)/i.test(traitStr)) return 'PROTAGONIST_ALLIANCE';
  
  // 4단계: 기본값
  return 'NEUTRAL_ZONE';
}

// ✅ 진영명 정규화
function normalizeFactionName(rawName: string): string {
  const normalized = rawName.toUpperCase().replace(/\s+/g, '_');
  
  // 알려진 패턴 매칭
  if (normalized.includes('PROTAGONIST') || normalized.includes('HERO') || normalized.includes('주인공')) {
    return 'PROTAGONIST_ALLIANCE';
  }
  if (normalized.includes('ANTAGONIST') || normalized.includes('VILLAIN') || normalized.includes('악당')) {
    return 'ANTAGONIST_FORCE';
  }
  if (normalized.includes('NEUTRAL') || normalized.includes('중립')) {
    return 'NEUTRAL_ZONE';
  }
  
  // 그대로 사용
  return normalized;
}

// ✅ 중요도 추론
function inferImportance(char: Character, index: number): number {
  const job = (char.job || '').toLowerCase();
  
  if (job.includes('주인공') || job.includes('protagonist')) return 10;
  if (job.includes('악당') || job.includes('antagonist')) return 9;
  if (job.includes('멘토') || job.includes('mentor')) return 8;
  if (job.includes('조연') || job.includes('supporting')) return 6;
  
  // 등장 순서 기반 (첫 3명은 중요)
  if (index < 3) return 7;
  
  return 5;
}

// ✅ 진영 색상 매핑
function getFactionColor(faction: string): string {
  const colorMap: Record<string, string> = {
    'PROTAGONIST_ALLIANCE': '#06ffa5',  // 청록
    'ANTAGONIST_FORCE': '#ff006e',      // 핑크
    'NEUTRAL_ZONE': '#ffbe0b',          // 노랑
    'DIRECTORS_ARENA': '#d4af37',        // 골드 (기존 호환)
    'TVN_PLATFORM': '#ec4899',          // 핑크 (기존 호환)
    'TALENT_POOL': '#06b6d4',           // 시안 (기존 호환)
    'THE_ORACLE': '#a78bfa'             // 보라 (기존 호환)
  };
  
  return colorMap[faction] || '#888888';
}

// ✅ 관계 추론 (AI relations 우선 → 자동 생성 폴백)
function deriveRelationships(
  rawChars: Character[],
  nexusChars: NexusCharacter[]
): NexusRelationship[] {
  const relationships: NexusRelationship[] = [];
  const processed = new Set<string>();  // 중복 방지
  
  // 1단계: AI가 준 relations 사용
  rawChars.forEach(char => {
    if (!char.relations || char.relations.length === 0) return;
    
    char.relations.forEach(rel => {
      const fromChar = nexusChars.find(c => c.id === char.id);
      const toChar = nexusChars.find(c => c.name === rel.target);
      
      if (!fromChar || !toChar) {
        console.warn('관계 대상 미발견:', rel.target);
        return;
      }
      
      const key = [fromChar.id, toChar.id].sort().join('-');
      if (processed.has(key)) return;  // 중복 제거
      
      relationships.push({
        from: fromChar.id,
        to: toChar.id,
        type: normalizeRelationType(rel.type),
        strength: rel.strength || 5
      });
      
      processed.add(key);
    });
  });
  
  // 2단계: 자동 생성 (relations 없는 경우)
  if (relationships.length === 0) {
    console.log('📝 관계 데이터 없음 - 자동 생성');
    
    // 같은 진영끼리 ally
    nexusChars.forEach((char1, i) => {
      nexusChars.forEach((char2, j) => {
        if (i >= j) return;
        
        const key = [char1.id, char2.id].sort().join('-');
        if (processed.has(key)) return;
        
        if (char1.faction === char2.faction && char1.faction !== 'NEUTRAL_ZONE') {
          relationships.push({
            from: char1.id,
            to: char2.id,
            type: 'ally',
            strength: 6
          });
          processed.add(key);
        }
      });
    });
    
    // 적대 진영끼리 enemy
    const protagonist = nexusChars.find(c => c.importance === 10);
    const antagonist = nexusChars.find(c => c.faction === 'ANTAGONIST_FORCE');
    
    if (protagonist && antagonist) {
      const key = [protagonist.id, antagonist.id].sort().join('-');
      if (!processed.has(key)) {
        relationships.push({
          from: protagonist.id,
          to: antagonist.id,
          type: 'enemy',
          strength: 10
        });
      }
    }
  }
  
  console.log(`✅ 관계 ${relationships.length}개 생성`);
  return relationships;
}

// ✅ 관계 타입 정규화
function normalizeRelationType(rawType: string): 'enemy' | 'ally' | 'family' | 'neutral' {
  const normalized = rawType.toLowerCase();
  
  if (normalized.includes('enemy') || normalized.includes('적') || normalized.includes('rival')) {
    return 'enemy';
  }
  if (normalized.includes('ally') || normalized.includes('동료') || normalized.includes('friend')) {
    return 'ally';
  }
  if (normalized.includes('family') || normalized.includes('가족') || normalized.includes('혈연')) {
    return 'family';
  }
  
  return 'neutral';
}

// ✅ 진영 목록 생성 (주요 진영 고정 및 나머지 유동 배치)
function deriveFactions(characters: NexusCharacter[]): NexusFaction[] {
  const factionSet = new Set(characters.map(c => c.faction));
  const factionList: NexusFaction[] = [];
  
  // 1. 주요 진영 우선 배치
  const priorityFactions: Record<string, 'left' | 'right' | 'top' | 'bottom'> = {
    'PROTAGONIST_ALLIANCE': 'left',
    'ANTAGONIST_FORCE': 'right',
    'NEUTRAL_ZONE': 'top'
  };
  
  Object.entries(priorityFactions).forEach(([name, position]) => {
    if (factionSet.has(name)) {
      factionList.push({ name, color: getFactionColor(name), position });
      factionSet.delete(name);
    }
  });
  
  // 2. 나머지 진영 배치 (bottom부터 채움)
  const remainingPositions: ('left' | 'right' | 'top' | 'bottom')[] = ['bottom', 'top', 'left', 'right'];
  let idx = 0;
  
  factionSet.forEach(name => {
    factionList.push({ 
      name, 
      color: getFactionColor(name), 
      position: remainingPositions[idx % remainingPositions.length] 
    });
    idx++;
  });
  
  return factionList;
}

// ✅ 더미 데이터 생성 (최후 폴백)
function createDummyData(): NexusData {
  return {
    characters: [
      {
        id: 'dummy-1',
        name: '주인공',
        job: '히어로',
        faction: 'PROTAGONIST_ALLIANCE',
        importance: 10,
        color: '#06ffa5'
      },
      {
        id: 'dummy-2',
        name: '악당',
        job: '빌런',
        faction: 'ANTAGONIST_FORCE',
        importance: 9,
        color: '#ff006e'
      }
    ],
    relationships: [
      {
        from: 'dummy-1',
        to: 'dummy-2',
        type: 'enemy',
        strength: 10
      }
    ],
    factions: [
      { name: 'PROTAGONIST_ALLIANCE', color: '#06ffa5', position: 'left' },
      { name: 'ANTAGONIST_FORCE', color: '#ff006e', position: 'right' }
    ]
  };
}

// ✅ 결정론적 난수 (방어 로직 추가)
export function seededRandom(seed: string | undefined | null): number {
  if (!seed) return Math.random(); // 폴백: 일반 난수
  
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + charCode;
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100;
}
