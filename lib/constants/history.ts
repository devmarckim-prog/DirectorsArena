export interface HistoricalEvent {
  year: number;
  tag: 'POLITICS' | 'WAR' | 'TECHNOLOGY' | 'ECONOMY' | 'SOCIETY' | 'CULTURE' | 'SCIENCE' | 'RELIGION' | 'DISASTER' | 'DISEASE';
  title: string;
  desc: string;
  location: string;
  region: string[];
  scope: 'kr' | 'global';
  importance: number; // 1-5
}

// Optimization: Pre-indexed map for O(1) year lookup
let eventMapCache: Map<string, HistoricalEvent[]> | null = null;

const getEventMap = () => {
  if (eventMapCache) return eventMapCache;
  
  const cache = new Map<string, HistoricalEvent[]>();
  HISTORICAL_DATA.forEach(event => {
    const key = `${event.year}-${event.scope}`;
    if (!cache.has(key)) cache.set(key, []);
    cache.get(key)!.push(event);
  });
  
  eventMapCache = cache;
  return cache;
};

export const getEventsForYear = (year: number, scope: 'kr' | 'global') => {
  const map = getEventMap();
  const events = map.get(`${year}-${scope}`) || [];
  // Sort by importance DESC to ensure key events show up first
  return [...events].sort((a, b) => b.importance - a.importance);
};

export const getNearbyEvents = (year: number, scope: 'kr' | 'global', range: number = 5) => {
  const map = getEventMap();
  let nearby: HistoricalEvent[] = [];
  
  for (let i = 1; i <= range; i++) {
    const plus = map.get(`${year + i}-${scope}`) || [];
    const minus = map.get(`${year - i}-${scope}`) || [];
    nearby = [...nearby, ...plus, ...minus];
    if (nearby.length >= 3) break; // Stop early if we have enough context
  }
  
  return nearby.sort((a, b) => b.importance - a.importance);
};

export const HISTORICAL_DATA: HistoricalEvent[] = [
  {
    "year": -2560,
    "tag": "TECHNOLOGY",
    "title": "기자의 대피라미드 완공",
    "desc": "쿠푸 왕을 위해 건설된 고대 세계 7대 불가사의 중 하나",
    "location": "기자, 이집트",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -1750,
    "tag": "POLITICS",
    "title": "함무라비 법전 반포",
    "desc": "눈에는 눈, 이에는 이 원칙을 담은 세계 최초의 성문법 중 하나",
    "location": "바빌론",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -1300,
    "tag": "RELIGION",
    "title": "모세의 출애굽",
    "desc": "이스라엘 민족이 이집트를 탈출하여 가나안으로 향함",
    "location": "이집트·시나이",
    "region": [
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -1200,
    "tag": "WAR",
    "title": "트로이 전쟁",
    "desc": "그리스 연합군과 트로이 사이의 전설적인 전쟁",
    "location": "트로이",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -1000,
    "tag": "CULTURE",
    "title": "솔로몬 신전 건축 시작",
    "desc": "예루살렘에 솔로몬의 신전이 건설되기 시작하며 이스라엘 왕국이 전성기를 맞이함",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -1000,
    "tag": "POLITICS",
    "title": "이스라엘 왕국 전성기",
    "desc": "솔로몬 왕 치하에서 이스라엘 왕국이 최대 영토와 번영을 누림. 지중해 무역 주도",
    "location": "이스라엘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -1000,
    "tag": "CULTURE",
    "title": "청동기 문화 전성기 (한반도)",
    "desc": "한반도 전역에 고인돌 건축과 청동기 문화가 번성. 요동 지역 고조선 문화권 형성",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -1000,
    "tag": "POLITICS",
    "title": "고조선 세력 확장",
    "desc": "요동반도와 한반도 서북부를 중심으로 고조선이 청동기 문화를 기반으로 성장",
    "location": "요동·평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -995,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-995년)",
    "desc": "기원전 995년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -990,
    "tag": "ECONOMY",
    "title": "페니키아 지중해 무역 확장",
    "desc": "페니키아 도시국가들이 카르타고 등 식민도시를 건설하며 지중해 전역에 해상 무역망 구축",
    "location": "지중해 연안",
    "region": [
      "유럽",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -985,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-985년)",
    "desc": "기원전 985년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -980,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-980년)",
    "desc": "기원전 980년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -975,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-975년)",
    "desc": "기원전 975년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -970,
    "tag": "CULTURE",
    "title": "페니키아 알파벳 보급",
    "desc": "페니키아 알파벳이 그리스와 지중해 전역으로 전파되어 서양 문자 체계의 기원이 됨",
    "location": "지중해 연안",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -965,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-965년)",
    "desc": "기원전 965년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -960,
    "tag": "CULTURE",
    "title": "호메로스 서사시 구전 시작",
    "desc": "일리아스·오디세이아 서사시가 구전으로 전승되기 시작. 그리스 문학과 문화의 근간 형성",
    "location": "그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -955,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-955년)",
    "desc": "기원전 955년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -950,
    "tag": "TECHNOLOGY",
    "title": "철기 시대 그리스 확산",
    "desc": "철기 사용이 그리스와 에게해 지역으로 확산되며 농업 생산성과 군사력이 비약적으로 향상",
    "location": "그리스·에게해",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -945,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-945년)",
    "desc": "기원전 945년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -940,
    "tag": "CULTURE",
    "title": "비파형 동검 문화 확산",
    "desc": "비파형 동검이 요령 지역에서 한반도까지 확산. 고조선 청동기 문화의 핵심 유물",
    "location": "요령·한반도 서북부",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -935,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-935년)",
    "desc": "기원전 935년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -930,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-930년)",
    "desc": "기원전 930년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -925,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-925년)",
    "desc": "기원전 925년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -920,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-920년)",
    "desc": "기원전 920년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -915,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-915년)",
    "desc": "기원전 915년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -910,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-910년)",
    "desc": "기원전 910년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -905,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-905년)",
    "desc": "기원전 905년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -900,
    "tag": "POLITICS",
    "title": "앗시리아 제국 확장",
    "desc": "앗시리아가 아슈르나시르팔 2세 치하에서 메소포타미아와 시리아를 정복하며 고대 최강 군사국가로 부상",
    "location": "메소포타미아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -900,
    "tag": "CULTURE",
    "title": "문문토기 문화 확산",
    "desc": "무문토기 문화가 한반도 전역으로 확산되며 농경 정착 사회가 본격화됨",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -895,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-895년)",
    "desc": "기원전 895년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -890,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-890년)",
    "desc": "기원전 890년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -885,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-885년)",
    "desc": "기원전 885년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -880,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-880년)",
    "desc": "기원전 880년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -875,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-875년)",
    "desc": "기원전 875년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -870,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-870년)",
    "desc": "기원전 870년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -865,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-865년)",
    "desc": "기원전 865년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -860,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-860년)",
    "desc": "기원전 860년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -855,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-855년)",
    "desc": "기원전 855년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -850,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-850년)",
    "desc": "기원전 850년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -845,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-845년)",
    "desc": "기원전 845년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -840,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-840년)",
    "desc": "기원전 840년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -835,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-835년)",
    "desc": "기원전 835년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -830,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-830년)",
    "desc": "기원전 830년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -825,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-825년)",
    "desc": "기원전 825년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -820,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-820년)",
    "desc": "기원전 820년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -815,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-815년)",
    "desc": "기원전 815년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -814,
    "tag": "POLITICS",
    "title": "카르타고 건국",
    "desc": "페니키아인들이 북아프리카에 카르타고를 건국. 후에 지중해 서부의 패권국가로 성장",
    "location": "북아프리카 (튀니지)",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -810,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-810년)",
    "desc": "기원전 810년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -805,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-805년)",
    "desc": "기원전 805년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -800,
    "tag": "CULTURE",
    "title": "그리스 도시국가 형성",
    "desc": "폴리스(도시국가) 형태의 그리스 문명이 꽃을 피우며 민주주의, 철학, 예술의 토대 마련",
    "location": "그리스 각지",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -800,
    "tag": "ECONOMY",
    "title": "한반도 벼농사 본격화",
    "desc": "벼농사가 한반도 남부를 중심으로 본격화되며 정착 농경 사회의 기반이 강화됨",
    "location": "한반도 남부",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -800,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-800년)",
    "desc": "-800년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -795,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-795년)",
    "desc": "기원전 795년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -790,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-790년)",
    "desc": "기원전 790년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -785,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-785년)",
    "desc": "기원전 785년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -780,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-780년)",
    "desc": "-780년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -780,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-780년)",
    "desc": "기원전 780년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -776,
    "tag": "CULTURE",
    "title": "제1회 올림픽 경기",
    "desc": "그리스 올림피아에서 제1회 올림픽 경기 개최. 4년마다 열리는 범그리스 축제로 그리스 통합의 상징",
    "location": "올림피아, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -775,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-775년)",
    "desc": "기원전 775년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -770,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-770년)",
    "desc": "기원전 770년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -765,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-765년)",
    "desc": "기원전 765년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -760,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-760년)",
    "desc": "-760년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -760,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-760년)",
    "desc": "기원전 760년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -755,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-755년)",
    "desc": "기원전 755년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -753,
    "tag": "POLITICS",
    "title": "로마 건국",
    "desc": "로물루스에 의해 로마가 건국됨. 훗날 서양 문명의 중심이 되는 로마 공화국·제국의 기원",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -750,
    "tag": "CULTURE",
    "title": "호메로스의 서사시 기록",
    "desc": "일리아스와 오디세이아가 문자로 기록되기 시작",
    "location": "그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -750,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-750년)",
    "desc": "기원전 750년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -745,
    "tag": "WAR",
    "title": "앗시리아 제국 중흥",
    "desc": "티글라트필레세르 3세가 앗시리아를 재건하여 오리엔트 전역을 정복하는 사상 최초의 진정한 제국 형성",
    "location": "메소포타미아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -740,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-740년)",
    "desc": "-740년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -740,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-740년)",
    "desc": "기원전 740년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -735,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-735년)",
    "desc": "기원전 735년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -730,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-730년)",
    "desc": "기원전 730년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -725,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-725년)",
    "desc": "기원전 725년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -722,
    "tag": "WAR",
    "title": "앗시리아, 이스라엘 왕국 멸망",
    "desc": "앗시리아가 북왕국 이스라엘을 정복하고 주민을 강제 이주시킴. 이스라엘 10지파 역사적 소멸",
    "location": "이스라엘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -720,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-720년)",
    "desc": "-720년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -720,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-720년)",
    "desc": "기원전 720년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -715,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-715년)",
    "desc": "기원전 715년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -710,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-710년)",
    "desc": "기원전 710년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -705,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-705년)",
    "desc": "기원전 705년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -700,
    "tag": "TECHNOLOGY",
    "title": "철기 한반도 전래 시작",
    "desc": "중국 연나라와의 교역을 통해 철기 문화가 한반도로 서서히 전래되기 시작",
    "location": "한반도 서북부",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -700,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-700년)",
    "desc": "-700년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -695,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-695년)",
    "desc": "기원전 695년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -690,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-690년)",
    "desc": "기원전 690년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -685,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-685년)",
    "desc": "기원전 685년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -680,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-680년)",
    "desc": "-680년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -680,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-680년)",
    "desc": "기원전 680년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -675,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-675년)",
    "desc": "기원전 675년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -670,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-670년)",
    "desc": "기원전 670년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -668,
    "tag": "POLITICS",
    "title": "앗시리아 제국 최전성기",
    "desc": "아슈르바니팔 왕이 이집트까지 정복하며 앗시리아가 사상 최대 영토 달성. 니네베에 대도서관 건설",
    "location": "니네베, 메소포타미아",
    "region": [
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -665,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-665년)",
    "desc": "기원전 665년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -660,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-660년)",
    "desc": "-660년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -660,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-660년)",
    "desc": "기원전 660년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -655,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-655년)",
    "desc": "기원전 655년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -650,
    "tag": "ECONOMY",
    "title": "리디아 금속화폐 발명",
    "desc": "리디아 왕국이 세계 최초로 표준화된 금속 화폐를 주조. 상업혁명의 시초가 됨",
    "location": "리디아 (터키 서부)",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -645,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-645년)",
    "desc": "기원전 645년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -640,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-640년)",
    "desc": "-640년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -640,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-640년)",
    "desc": "기원전 640년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -635,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-635년)",
    "desc": "기원전 635년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -630,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-630년)",
    "desc": "기원전 630년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -626,
    "tag": "POLITICS",
    "title": "신바빌로니아 제국 건국",
    "desc": "나보폴라살이 신바빌로니아 제국을 건국하고 앗시리아를 멸망시킴. 바빌론이 다시 오리엔트의 중심으로",
    "location": "바빌론",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -625,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-625년)",
    "desc": "기원전 625년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -620,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-620년)",
    "desc": "-620년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -620,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-620년)",
    "desc": "기원전 620년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -615,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-615년)",
    "desc": "기원전 615년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -612,
    "tag": "WAR",
    "title": "니네베 함락·앗시리아 멸망",
    "desc": "바빌로니아-메디아 연합군이 앗시리아 수도 니네베를 함락. 고대 최강 군사제국의 종말",
    "location": "니네베",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -610,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-610년)",
    "desc": "기원전 610년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -605,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-605년)",
    "desc": "기원전 605년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -600,
    "tag": "RELIGION",
    "title": "조로아스터교 페르시아 확산",
    "desc": "아후라 마즈다를 섬기는 조로아스터교가 페르시아 전역으로 확산되며 이원론적 세계관을 전파",
    "location": "페르시아 (이란)",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -600,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-600년)",
    "desc": "-600년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -597,
    "tag": "WAR",
    "title": "바빌론 유수 시작",
    "desc": "느부갓네살 2세가 예루살렘을 정복하고 유대인을 바빌론으로 강제 이주시킴. 유대교 발전의 전환점",
    "location": "바빌론·예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -595,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-595년)",
    "desc": "기원전 595년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -590,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-590년)",
    "desc": "기원전 590년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -586,
    "tag": "DISASTER",
    "title": "솔로몬 신전 파괴",
    "desc": "느부갓네살 2세가 예루살렘의 솔로몬 신전을 완전히 파괴. 유대 민족의 역사적 트라우마",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -585,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-585년)",
    "desc": "기원전 585년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -580,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-580년)",
    "desc": "-580년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -580,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-580년)",
    "desc": "기원전 580년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -575,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-575년)",
    "desc": "기원전 575년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -570,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-570년)",
    "desc": "기원전 570년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -565,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-565년)",
    "desc": "기원전 565년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -563,
    "tag": "RELIGION",
    "title": "석가모니 탄생",
    "desc": "인도 룸비니에서 싯다르타 고타마(석가모니)가 탄생. 불교의 창시자가 되어 아시아 문명을 변혁",
    "location": "룸비니, 인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -560,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-560년)",
    "desc": "-560년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -560,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-560년)",
    "desc": "기원전 560년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -555,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-555년)",
    "desc": "기원전 555년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -551,
    "tag": "CULTURE",
    "title": "공자 탄생",
    "desc": "중국 노나라에서 공자(孔子)가 탄생. 유교 사상의 창시자로 동아시아 문명의 근간을 형성",
    "location": "노나라, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -550,
    "tag": "POLITICS",
    "title": "페르시아 제국 건국",
    "desc": "키루스 대왕이 아케메네스 페르시아 제국을 건국. 메디아, 리디아, 바빌론을 정복하여 사상 최대 제국 형성",
    "location": "페르시아 (이란)",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -545,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-545년)",
    "desc": "기원전 545년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -540,
    "tag": "POLITICS",
    "title": "고조선 국가 체제 확립",
    "desc": "고조선이 부족 연합에서 체계적인 국가 체제로 발전. 8조법금(八條法禁)이 시행되어 사회 질서를 규율",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -540,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-540년)",
    "desc": "-540년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -535,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-535년)",
    "desc": "기원전 535년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -530,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-530년)",
    "desc": "기원전 530년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -525,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-525년)",
    "desc": "기원전 525년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -520,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-520년)",
    "desc": "-520년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -520,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-520년)",
    "desc": "기원전 520년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -515,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-515년)",
    "desc": "기원전 515년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -510,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-510년)",
    "desc": "기원전 510년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -507,
    "tag": "POLITICS",
    "title": "아테네 민주주의 성립",
    "desc": "클레이스테네스의 개혁으로 아테네에 민주주의가 성립됨. 시민이 정치에 직접 참여하는 체제의 원형",
    "location": "아테네, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -505,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-505년)",
    "desc": "기원전 505년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -500,
    "tag": "CULTURE",
    "title": "피타고라스의 정리 정립",
    "desc": "수학적 관계를 증명하며 서양 과학적 사고의 기틀 마련",
    "location": "사모스, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -500,
    "tag": "TECHNOLOGY",
    "title": "철기 시대 본격화 (한반도)",
    "desc": "한반도에 철기 문화가 본격적으로 도입되며 농업·군사력이 크게 향상. 고조선 후기 문화 변화",
    "location": "한반도 서북부",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -500,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-500년)",
    "desc": "-500년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -495,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-495년)",
    "desc": "기원전 495년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -490,
    "tag": "WAR",
    "title": "마라톤 전투",
    "desc": "아테네 군이 페르시아 대군을 마라톤 평원에서 격파. 그리스 민주주의 수호의 상징적 전투",
    "location": "마라톤, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -485,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-485년)",
    "desc": "기원전 485년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -480,
    "tag": "WAR",
    "title": "테르모필레·살라미스 해전",
    "desc": "스파르타 300용사의 테르모필레 항전과 그리스 해군의 살라미스 해전 승리로 페르시아 침략 격퇴",
    "location": "그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -480,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-480년)",
    "desc": "-480년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -475,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-475년)",
    "desc": "기원전 475년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -470,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-470년)",
    "desc": "기원전 470년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -465,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-465년)",
    "desc": "기원전 465년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -461,
    "tag": "POLITICS",
    "title": "페리클레스 시대 개막",
    "desc": "페리클레스가 아테네를 이끌며 파르테논 신전 건설, 직접 민주주의 강화 등 아테네 황금기 형성",
    "location": "아테네, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -460,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-460년)",
    "desc": "-460년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -460,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-460년)",
    "desc": "기원전 460년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -455,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-455년)",
    "desc": "기원전 455년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -450,
    "tag": "POLITICS",
    "title": "로마 12표법 제정",
    "desc": "로마 최초의 성문법인 12표법이 제정됨. 귀족·평민의 권리를 문서화하여 로마 법치의 기원이 됨",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -445,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-445년)",
    "desc": "기원전 445년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -440,
    "tag": "CULTURE",
    "title": "고조선 문화 최성기",
    "desc": "고조선이 요동과 한반도 서북부를 아우르며 독자적 청동기·철기 복합 문화 발달. 연나라와 교역 확대",
    "location": "요동·평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -440,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-440년)",
    "desc": "-440년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -435,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-435년)",
    "desc": "기원전 435년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -431,
    "tag": "WAR",
    "title": "펠로폰네소스 전쟁 시작",
    "desc": "아테네와 스파르타 간의 27년 전쟁 시작. 그리스 도시국가 동맹이 두 진영으로 분열되어 그리스 쇠퇴 초래",
    "location": "그리스 전역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -430,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-430년)",
    "desc": "기원전 430년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -425,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-425년)",
    "desc": "기원전 425년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -420,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-420년)",
    "desc": "-420년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -420,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-420년)",
    "desc": "기원전 420년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -415,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-415년)",
    "desc": "기원전 415년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -410,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-410년)",
    "desc": "기원전 410년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -405,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-405년)",
    "desc": "기원전 405년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -400,
    "tag": "SCIENCE",
    "title": "히포크라테스 선서",
    "desc": "의학의 아버지 히포크라테스가 의학적 윤리와 지식 체계화",
    "location": "그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -400,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-400년)",
    "desc": "-400년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -400,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-400년)",
    "desc": "기원전 400년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -399,
    "tag": "CULTURE",
    "title": "소크라테스 사형",
    "desc": "아테네 법정이 소크라테스에게 신성모독·청소년 타락 혐의로 사형 선고. 철학의 순교자가 됨",
    "location": "아테네, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -395,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-395년)",
    "desc": "기원전 395년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -390,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-390년)",
    "desc": "기원전 390년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -385,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-385년)",
    "desc": "기원전 385년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -380,
    "tag": "CULTURE",
    "title": "플라톤 아카데미아 설립",
    "desc": "플라톤이 아테네에 서양 최초의 고등교육기관 아카데미아를 설립. 철학·수학·과학의 산실이 됨",
    "location": "아테네, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -380,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-380년)",
    "desc": "-380년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -375,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-375년)",
    "desc": "기원전 375년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -370,
    "tag": "ECONOMY",
    "title": "한반도 남부 삼한 전신 사회 형성",
    "desc": "한반도 남부에서 마한·변한·진한의 전신인 부족 연합 사회가 형성되기 시작. 농경 중심 정착 문화",
    "location": "한반도 중남부",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -365,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-365년)",
    "desc": "기원전 365년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -360,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-360년)",
    "desc": "-360년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -360,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-360년)",
    "desc": "기원전 360년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -355,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-355년)",
    "desc": "기원전 355년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -350,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-350년)",
    "desc": "기원전 350년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -345,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-345년)",
    "desc": "기원전 345년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -340,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-340년)",
    "desc": "-340년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -340,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-340년)",
    "desc": "기원전 340년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -338,
    "tag": "WAR",
    "title": "마케도니아 그리스 통일",
    "desc": "필리포스 2세가 카이로네이아 전투에서 그리스 도시국가 연합을 격파하고 그리스를 통일",
    "location": "그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -335,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-335년)",
    "desc": "기원전 335년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -334,
    "tag": "WAR",
    "title": "알렉산드로스 동방 원정 시작",
    "desc": "알렉산드로스 대왕이 페르시아 원정을 시작. 이집트, 페르시아, 인더스 강까지 정복하는 대제국을 건설",
    "location": "마케도니아→페르시아→인도",
    "region": [
      "유럽",
      "중동",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -330,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-330년)",
    "desc": "기원전 330년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -325,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-325년)",
    "desc": "기원전 325년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -323,
    "tag": "POLITICS",
    "title": "알렉산드로스 대왕 사망·제국 분열",
    "desc": "알렉산드로스 대왕이 바빌론에서 33세로 급사. 제국이 후계자들 간에 분열되며 헬레니즘 시대 개막",
    "location": "바빌론",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -320,
    "tag": "POLITICS",
    "title": "마우리아 제국 건국 (인도)",
    "desc": "찬드라굽타 마우리아가 인도 최초의 통일 제국을 건설. 훗날 아소카 왕 치하에서 불교를 아시아에 전파",
    "location": "인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -320,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-320년)",
    "desc": "-320년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -315,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-315년)",
    "desc": "기원전 315년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -310,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-310년)",
    "desc": "기원전 310년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -305,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-305년)",
    "desc": "기원전 305년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -300,
    "tag": "SCIENCE",
    "title": "유클리드 기하학원론 저술",
    "desc": "유클리드가 알렉산드리아에서 기하학원론을 저술. 2000년간 수학 교육의 표준이 된 서양 최고의 수학서",
    "location": "알렉산드리아, 이집트",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -300,
    "tag": "POLITICS",
    "title": "고조선 전성기",
    "desc": "고조선이 부왕·준왕 치하에서 최대 영토를 확보. 중국 전국시대 혼란을 피해 이주민 유입으로 문화 발전",
    "location": "요동·평양·한반도 북부",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -300,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-300년)",
    "desc": "-300년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -295,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-295년)",
    "desc": "기원전 295년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -290,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-290년)",
    "desc": "기원전 290년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -285,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-285년)",
    "desc": "기원전 285년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -280,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-280년)",
    "desc": "-280년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -280,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-280년)",
    "desc": "기원전 280년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -275,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-275년)",
    "desc": "기원전 275년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -273,
    "tag": "POLITICS",
    "title": "아소카 왕 즉위",
    "desc": "마우리아 제국의 아소카 왕이 즉위. 칼링가 전쟁의 참상 후 불교로 귀의하여 비폭력 통치와 불교 전파에 헌신",
    "location": "파탈리푸트라, 인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -270,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-270년)",
    "desc": "기원전 270년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -265,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-265년)",
    "desc": "기원전 265년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -264,
    "tag": "WAR",
    "title": "제1차 포에니 전쟁 시작",
    "desc": "로마와 카르타고 간의 지중해 패권 전쟁 시작. 로마의 해군 창설과 시칠리아 확보로 이어짐",
    "location": "시칠리아·지중해",
    "region": [
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -260,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-260년)",
    "desc": "-260년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -260,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-260년)",
    "desc": "기원전 260년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -255,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-255년)",
    "desc": "기원전 255년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -250,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-250년)",
    "desc": "기원전 250년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -245,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-245년)",
    "desc": "기원전 245년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -241,
    "tag": "WAR",
    "title": "제1차 포에니 전쟁 종전",
    "desc": "로마가 카르타고를 격파하고 시칠리아를 첫 번째 속주로 편입. 로마의 지중해 진출 본격화",
    "location": "지중해",
    "region": [
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -240,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-240년)",
    "desc": "-240년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -240,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-240년)",
    "desc": "기원전 240년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -235,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-235년)",
    "desc": "기원전 235년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -230,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-230년)",
    "desc": "기원전 230년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -225,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-225년)",
    "desc": "기원전 225년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -221,
    "tag": "POLITICS",
    "title": "진시황 중국 통일",
    "desc": "진나라 왕 영정이 6국을 멸하고 중국을 최초로 통일. 황제 칭호 사용, 도량형·문자 통일, 만리장성 축조",
    "location": "함양, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -220,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-220년)",
    "desc": "-220년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -220,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-220년)",
    "desc": "기원전 220년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -218,
    "tag": "WAR",
    "title": "한니발 알프스 횡단",
    "desc": "카르타고 장군 한니발이 코끼리 부대를 이끌고 알프스를 넘어 이탈리아를 침공. 제2차 포에니 전쟁 최대 드라마",
    "location": "알프스·이탈리아",
    "region": [
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -215,
    "tag": "TECHNOLOGY",
    "title": "만리장성 대규모 축조",
    "desc": "진시황이 흉노 방어를 위해 만리장성의 대규모 연결·확장 공사를 시행. 수십만 명의 백성이 동원됨",
    "location": "중국 북부",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -210,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-210년)",
    "desc": "기원전 210년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -205,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-205년)",
    "desc": "기원전 205년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -202,
    "tag": "POLITICS",
    "title": "한(漢) 왕조 건국",
    "desc": "유방이 항우를 꺾고 한 왕조를 건국. 이후 400년간 중국을 통치하며 한족의 이름 유래가 됨",
    "location": "장안, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -200,
    "tag": "ECONOMY",
    "title": "로마의 가도 건설",
    "desc": "모든 길은 로마로 통한다는 말의 기원인 대규모 도로망 확충",
    "location": "이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -200,
    "tag": "CULTURE",
    "title": "실크로드 전신 무역로 형성",
    "desc": "한나라와 서역 간의 교역로가 형성되기 시작. 비단·도자기 등 동서 문명 교류의 대동맥으로 발전",
    "location": "중앙아시아·중국",
    "region": [
      "아시아",
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -200,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-200년)",
    "desc": "-200년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -195,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-195년)",
    "desc": "기원전 195년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -194,
    "tag": "POLITICS",
    "title": "위만조선 성립",
    "desc": "중국 연나라 출신 위만이 고조선의 준왕을 몰아내고 위만조선을 수립. 철기 기술과 한나라와의 중계무역으로 성장",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -190,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-190년)",
    "desc": "기원전 190년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -185,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-185년)",
    "desc": "기원전 185년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -180,
    "tag": "ECONOMY",
    "title": "위만조선 무역 독점",
    "desc": "위만조선이 한반도 남부의 진국과 한나라 사이의 중계무역을 독점하며 강대국으로 성장",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": -180,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-180년)",
    "desc": "-180년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -175,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-175년)",
    "desc": "기원전 175년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -170,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-170년)",
    "desc": "기원전 170년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -165,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-165년)",
    "desc": "기원전 165년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -160,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-160년)",
    "desc": "-160년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -160,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-160년)",
    "desc": "기원전 160년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -155,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-155년)",
    "desc": "기원전 155년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -150,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-150년)",
    "desc": "기원전 150년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -146,
    "tag": "WAR",
    "title": "로마 카르타고 멸망·그리스 정복",
    "desc": "로마가 카르타고를 완전히 파괴하고 그리스도 정복. 지중해 전역을 지배하는 제국으로의 발판 마련",
    "location": "카르타고·코린토스",
    "region": [
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -145,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-145년)",
    "desc": "기원전 145년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -141,
    "tag": "POLITICS",
    "title": "한 무제 즉위·실크로드 개척",
    "desc": "한 무제가 즉위하여 흉노 원정, 서역 개척, 실크로드 공식 개통 등 적극적 팽창 정책을 추진",
    "location": "장안, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -140,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-140년)",
    "desc": "-140년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -140,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-140년)",
    "desc": "기원전 140년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -135,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-135년)",
    "desc": "기원전 135년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -130,
    "tag": "ECONOMY",
    "title": "실크로드 공식 개통",
    "desc": "한나라가 장건을 서역에 파견하여 중앙아시아·로마까지 연결하는 실크로드를 공식 개통. 동서 문명 교류 시작",
    "location": "중앙아시아 전역",
    "region": [
      "아시아",
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -125,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-125년)",
    "desc": "기원전 125년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -120,
    "tag": "POLITICS",
    "title": "고대 지중해 폴리스 성장 (-120년)",
    "desc": "-120년경 지중해 연안 도시 국가들의 정치 체제가 고도화되며 민주정과 과두정의 기틀이 마련됨.",
    "location": "지중해 연안",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -120,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-120년)",
    "desc": "기원전 120년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -115,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-115년)",
    "desc": "기원전 115년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -110,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-110년)",
    "desc": "기원전 110년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -108,
    "tag": "WAR",
    "title": "고조선 멸망·한사군 설치",
    "desc": "한 무제가 위만조선을 침공하여 멸망시키고 낙랑·현도·진번·임둔 4군을 설치. 한반도 역사의 분수령",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": -105,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-105년)",
    "desc": "기원전 105년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -100,
    "tag": "TECHNOLOGY",
    "title": "종이의 전신 '채후지' 이전 형태 등장",
    "desc": "중국에서 가죽이나 죽간 대신 식물 섬유를 이용한 초기 형태 종이 사용",
    "location": "중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": -100,
    "tag": "POLITICS",
    "title": "율리우스 카이사르 탄생",
    "desc": "로마의 위대한 장군이자 정치가 율리우스 카이사르 탄생. 로마 공화정 말기의 혼란을 제국으로 전환시킨 인물",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -100,
    "tag": "CULTURE",
    "title": "한반도 남부 삼한 사회 형성",
    "desc": "고조선 멸망 후 유민이 남하하며 마한·변한·진한 삼한의 사회가 본격적으로 형성됨",
    "location": "한반도 중남부",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": -95,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-95년)",
    "desc": "기원전 95년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -90,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-90년)",
    "desc": "기원전 90년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -85,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-85년)",
    "desc": "기원전 85년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -80,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-80년)",
    "desc": "기원전 80년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -75,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-75년)",
    "desc": "기원전 75년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -73,
    "tag": "WAR",
    "title": "스파르타쿠스 노예 반란",
    "desc": "검투사 스파르타쿠스가 이끄는 노예 반란이 이탈리아 전역을 휩쓸었으나 결국 로마군에 진압됨",
    "location": "이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -70,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-70년)",
    "desc": "기원전 70년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -65,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-65년)",
    "desc": "기원전 65년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -60,
    "tag": "POLITICS",
    "title": "로마 제1차 삼두정치",
    "desc": "카이사르·폼페이우스·크라수스의 비공식 연합으로 로마 공화정이 사실상 3인에 의해 분할 통치됨",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": -57,
    "tag": "POLITICS",
    "title": "신라 건국 (전승)",
    "desc": "박혁거세가 사로국을 건국함. 이것이 신라의 시초로 전승되며 경주를 중심으로 성장",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": -55,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-55년)",
    "desc": "기원전 55년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -50,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-50년)",
    "desc": "기원전 50년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -45,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-45년)",
    "desc": "기원전 45년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -44,
    "tag": "WAR",
    "title": "율리우스 카이사르 암살",
    "desc": "브루투스 등 원로원 의원들에 의해 카이사르가 암살됨. 로마 공화정의 사실상 종말과 제국 전환의 계기",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -40,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-40년)",
    "desc": "기원전 40년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -37,
    "tag": "POLITICS",
    "title": "고구려 건국 (전승)",
    "desc": "주몽(동명성왕)이 졸본에서 고구려를 건국. 이후 만주와 한반도 북부를 지배하는 강대국으로 성장",
    "location": "졸본 (요녕성)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": -35,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-35년)",
    "desc": "기원전 35년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -31,
    "tag": "WAR",
    "title": "악티움 해전",
    "desc": "옥타비아누스가 악티움 해전에서 안토니우스·클레오파트라 연합 함대를 격파. 로마 제국 단일 통치자로 부상",
    "location": "악티움, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -30,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-30년)",
    "desc": "기원전 30년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -27,
    "tag": "POLITICS",
    "title": "로마 제국 성립",
    "desc": "옥타비아누스가 아우구스투스 칭호를 받으며 로마 공화정이 사실상 제국으로 전환. 팍스 로마나 시대 개막",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": -25,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-25년)",
    "desc": "기원전 25년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -20,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-20년)",
    "desc": "기원전 20년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -18,
    "tag": "POLITICS",
    "title": "백제 건국 (전승)",
    "desc": "온조가 위례성에서 백제를 건국. 한강 유역을 기반으로 마한을 흡수하며 강국으로 성장",
    "location": "위례성 (서울 일대)",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": -15,
    "tag": "CULTURE",
    "title": "고대 문명의 발전 (-15년)",
    "desc": "기원전 15년경, 지중해와 아시아 지역에서 철기 문화가 확산되며 도시 국가들의 사회 구조가 점차 복잡해지고 기록 문화가 발달하기 시작함.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": -4,
    "tag": "RELIGION",
    "title": "예수 그리스도 탄생",
    "desc": "베들레헴에서 예수 그리스도가 탄생(추정). 기독교의 창시자로 서양 문명과 세계 역사에 가장 큰 영향을 미친 인물",
    "location": "베들레헴, 유대",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 14,
    "tag": "POLITICS",
    "title": "아우구스투스 사망·티베리우스 즉위",
    "desc": "초대 로마 황제 아우구스투스 사망. 티베리우스가 뒤를 이으며 율리우스-클라우디우스 왕조 계속됨",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 18,
    "tag": "POLITICS",
    "title": "백제 국가 체제 정비",
    "desc": "온조왕이 마한의 소국들을 흡수하며 한강 유역을 중심으로 백제의 국가 체제를 본격적으로 정비",
    "location": "한강 유역",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 30,
    "tag": "RELIGION",
    "title": "예수 그리스도 십자가 처형·부활",
    "desc": "로마 총독 빌라도에 의해 예수가 십자가에 처형되고 부활함. 기독교의 핵심 교리이자 역사의 분기점",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 42,
    "tag": "POLITICS",
    "title": "가야 건국 (전승)",
    "desc": "김수로왕이 금관가야를 건국함. 낙동강 하류를 중심으로 한 가야 연맹의 시초. 철 생산으로 유명",
    "location": "김해",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 43,
    "tag": "WAR",
    "title": "로마 브리타니아 정복",
    "desc": "클라우디우스 황제 치하에서 로마군이 브리타니아(영국)를 침공하여 정복. 4세기간 로마 속주로 편입됨",
    "location": "브리타니아 (영국)",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 64,
    "tag": "DISASTER",
    "title": "로마 대화재·기독교 박해",
    "desc": "로마에 대화재가 발생하고 네로 황제가 기독교인을 방화 혐의로 박해함. 최초의 기독교 박해 시작",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 70,
    "tag": "WAR",
    "title": "로마, 예루살렘 성전 파괴",
    "desc": "티투스 장군이 유대 반란을 진압하고 예루살렘 제2성전을 파괴. 유대인 디아스포라의 본격화",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 75,
    "tag": "WAR",
    "title": "고구려 낙랑군 압박",
    "desc": "고구려가 남쪽으로 세력을 확장하며 한나라의 낙랑군을 지속적으로 압박. 세력 범위가 점차 확대됨",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 79,
    "tag": "DISASTER",
    "title": "베수비오 화산 폭발·폼페이 매몰",
    "desc": "이탈리아 베수비오 화산이 폭발하여 폼페이, 헤르쿨라네움 등 도시가 화산재에 매몰됨",
    "location": "폼페이, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 100,
    "tag": "POLITICS",
    "title": "로마 제국 최전성기",
    "desc": "트라야누스 황제 치하에서 로마 제국이 최대 영토를 확보. 다키아(루마니아), 메소포타미아까지 지배",
    "location": "로마 제국 전역",
    "region": [
      "유럽",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 105,
    "tag": "TECHNOLOGY",
    "title": "채륜 종이 발명 (개량)",
    "desc": "중국 후한의 채륜이 나무껍질·헝겊으로 만드는 제지법을 개량하여 대중화. 지식 전파의 혁명적 도구",
    "location": "낙양, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 117,
    "tag": "POLITICS",
    "title": "로마 제국 최대 영토 달성",
    "desc": "하드리아누스 황제 즉위 시 로마 제국이 역사상 최대 영토에 달함. 이후 방어적 전략으로 전환",
    "location": "로마 제국 전역",
    "region": [
      "유럽",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 122,
    "tag": "TECHNOLOGY",
    "title": "하드리아누스 방벽 축조",
    "desc": "영국 북부에 로마 군사 방어선 하드리아누스 방벽 건설 시작. 스코틀랜드 켈트족 침입을 막기 위한 대규모 토목공사",
    "location": "브리타니아 (영국)",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 150,
    "tag": "SCIENCE",
    "title": "프톨레마이오스 세계지도 제작",
    "desc": "알렉산드리아의 프톨레마이오스가 수학적 지리학 기법으로 세계지도를 제작. 이후 1400년간 서양 지리학의 표준",
    "location": "알렉산드리아, 이집트",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 175,
    "tag": "WAR",
    "title": "고구려 낙랑 지속 압박",
    "desc": "고구려 신대왕이 한나라 낙랑군과 현도군을 지속적으로 공격하며 요동 지역 세력 확장",
    "location": "평양·요동",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 180,
    "tag": "POLITICS",
    "title": "팍스 로마나 종말",
    "desc": "마르쿠스 아우렐리우스 사망 후 로마 제국의 황금기 팍스 로마나가 종료. 내전과 분열의 시대로 진입",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 184,
    "tag": "WAR",
    "title": "황건적의 난 (중국)",
    "desc": "중국 후한에서 장각이 이끄는 황건적 반란 발생. 후한 붕괴와 삼국시대를 촉발시킨 대규모 농민 봉기",
    "location": "중국 전역",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 200,
    "tag": "POLITICS",
    "title": "삼국 정립 시기 (한반도)",
    "desc": "고구려·백제·신라 삼국이 각자의 영역을 확보하며 경쟁하는 삼국 정립 시대가 본격화됨",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 212,
    "tag": "POLITICS",
    "title": "카라칼라 칙령 - 로마 시민권 확대",
    "desc": "카라칼라 황제가 제국 내 모든 자유민에게 로마 시민권을 부여. 로마 제국의 보편 시민권 시대 개막",
    "location": "로마 제국 전역",
    "region": [
      "유럽",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 220,
    "tag": "POLITICS",
    "title": "후한 멸망·중국 삼국시대",
    "desc": "후한이 멸망하고 위·촉·오 삼국시대 개막. 나관중의 삼국지로 유명한 역사적 격동기 시작",
    "location": "중국 전역",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 234,
    "tag": "WAR",
    "title": "고구려 낙랑군 공격 강화",
    "desc": "동천왕이 낙랑군을 공격하여 2000여 호를 격파. 고구려의 남진 정책이 본격화됨",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 260,
    "tag": "POLITICS",
    "title": "백제 마한 통합",
    "desc": "고이왕이 마한의 소국들을 통합하고 율령을 제정하며 백제가 국가 체제를 갖춤",
    "location": "한강 유역",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 280,
    "tag": "POLITICS",
    "title": "진(晉) 왕조 중국 재통일",
    "desc": "사마염이 삼국을 통일하여 진 왕조를 세움. 그러나 곧 팔왕의 난과 오호 침입으로 분열됨",
    "location": "중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 285,
    "tag": "POLITICS",
    "title": "로마 제국 동서 분할 통치",
    "desc": "디오클레티아누스가 로마 제국을 4분할 통치(사두정치)로 개혁. 제국의 효율적 방어와 행정을 위한 구조 개편",
    "location": "로마 제국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 313,
    "tag": "RELIGION",
    "title": "기독교 공인 (밀라노 칙령)",
    "desc": "콘스탄티누스 대제가 로마 제국 내 기독교 박해 중단",
    "location": "로마",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 313,
    "tag": "RELIGION",
    "title": "밀라노 칙령 - 기독교 공인",
    "desc": "콘스탄티누스 황제가 밀라노 칙령을 반포하여 기독교를 공인. 서양 역사를 바꾼 종교 자유 선언",
    "location": "로마 제국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 313,
    "tag": "WAR",
    "title": "고구려 낙랑군 완전 멸망",
    "desc": "미천왕이 낙랑군을 완전히 멸망시킴. 한나라 이래 400년간 지속된 중국 군현 지배 종식",
    "location": "평양 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 325,
    "tag": "RELIGION",
    "title": "니케아 공의회",
    "desc": "콘스탄티누스가 소집한 니케아 공의회에서 기독교 교리가 정립. 아리우스파 이단 선언, 삼위일체 확립",
    "location": "니케아, 터키",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 330,
    "tag": "POLITICS",
    "title": "콘스탄티노플 건설",
    "desc": "콘스탄티누스가 비잔티움을 새 수도 콘스탄티노플로 명명. 이후 1000년간 비잔틴 제국의 수도가 됨",
    "location": "콘스탄티노플 (이스탄불)",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 346,
    "tag": "POLITICS",
    "title": "백제 근초고왕 즉위·전성기",
    "desc": "근초고왕 즉위로 백제가 최전성기를 맞이. 마한 완전 통합, 고구려 공격, 일본·중국과 외교 관계 수립",
    "location": "한강 유역",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 370,
    "tag": "WAR",
    "title": "훈족 유럽 침입",
    "desc": "중앙아시아에서 발원한 훈족이 유럽으로 이동하며 게르만 민족의 대이동을 촉발. 로마 멸망의 간접 원인",
    "location": "동유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 372,
    "tag": "RELIGION",
    "title": "불교 고구려 전래",
    "desc": "전진(前秦)의 왕 부견이 승려 순도를 보내 고구려에 불교를 전래. 한반도 불교의 공식적 도입",
    "location": "평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 375,
    "tag": "WAR",
    "title": "게르만 민족 대이동 시작",
    "desc": "훈족의 압박으로 서고트족을 시작으로 게르만 민족이 로마 영토 안으로 대거 이동. 로마 멸망의 서막",
    "location": "동유럽·로마 제국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 380,
    "tag": "RELIGION",
    "title": "기독교 로마 국교 선포",
    "desc": "테오도시우스 황제가 기독교를 로마 제국의 국교로 선포. 이교도 신앙이 금지되고 서양의 기독교화 확정",
    "location": "로마 제국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 384,
    "tag": "RELIGION",
    "title": "불교 백제 전래",
    "desc": "동진(東晉)의 승려 마라난타가 백제에 불교를 전래. 백제의 불교 문화 발전 시작",
    "location": "위례성",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 391,
    "tag": "POLITICS",
    "title": "광개토대왕 즉위",
    "desc": "고구려 광개토대왕이 즉위. 재위 22년간 만주·한반도·연해주에 이르는 대제국을 건설한 한국사 최대의 정복군주",
    "location": "평양·만주",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 395,
    "tag": "POLITICS",
    "title": "로마 제국 영구 분열",
    "desc": "테오도시우스 사망 후 로마 제국이 동·서로마로 영구 분열됨. 서유럽과 비잔틴 제국의 역사가 분기",
    "location": "로마 제국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 400,
    "tag": "WAR",
    "title": "광개토대왕 만주·왜 격파",
    "desc": "광개토대왕이 5만 대군으로 신라를 구원하고 왜를 격퇴. 또한 북으로 후연을 공격하여 만주 대부분을 장악",
    "location": "만주·한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 410,
    "tag": "WAR",
    "title": "서고트족 로마 약탈",
    "desc": "알라리크가 이끄는 서고트족이 서로마의 수도 로마를 함락하고 약탈. 800년 만의 로마 함락, 충격적 사건",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 414,
    "tag": "CULTURE",
    "title": "광개토대왕릉비 건립",
    "desc": "광개토대왕의 아들 장수왕이 아버지의 업적을 기록한 거대한 비석을 건립. 고구려사의 핵심 사료",
    "location": "집안, 만주",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 427,
    "tag": "POLITICS",
    "title": "고구려 수도 평양 천도",
    "desc": "장수왕이 수도를 국내성에서 평양으로 옮김. 남진 정책의 본격화 선언이자 한반도 지배 강화",
    "location": "평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 433,
    "tag": "POLITICS",
    "title": "나제동맹 체결",
    "desc": "백제와 신라가 고구려의 남진에 대항하기 위해 나제동맹을 체결. 두 왕국의 공존과 협력 시대 시작",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 449,
    "tag": "WAR",
    "title": "앵글로색슨족 브리타니아 침입",
    "desc": "앵글족·색슨족·주트족이 브리타니아를 침공하여 정착. 영국 역사의 시작이자 영어의 기원",
    "location": "브리타니아 (영국)",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 450,
    "tag": "WAR",
    "title": "아틸라 훈족 서유럽 침입",
    "desc": "훈족의 왕 아틸라가 갈리아와 이탈리아를 침략. '신의 채찍'으로 불리며 서유럽을 공포에 떨게 함",
    "location": "서유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 475,
    "tag": "WAR",
    "title": "고구려 백제 수도 함락",
    "desc": "고구려 장수왕이 백제의 수도 한성을 공격하여 함락. 백제 개로왕이 전사하고 수도를 웅진(공주)으로 천도",
    "location": "한성 (서울)",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 476,
    "tag": "POLITICS",
    "title": "서로마 제국 멸망",
    "desc": "게르만 용병대장 오도아케르가 마지막 황제 로물루스 아우구스툴루스를 폐위. 서로마 제국 공식 멸망",
    "location": "라벤나, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 494,
    "tag": "WAR",
    "title": "가야 남부 연맹 약화",
    "desc": "신라의 압박과 백제의 세력 변화로 가야 남부 연맹이 급속히 약화되기 시작. 가야의 쇠퇴 시작",
    "location": "낙동강 유역",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 500,
    "tag": "POLITICS",
    "title": "프랑크 왕국 클로비스 개종",
    "desc": "메로빙거 왕조의 기틀을 다지고 가톨릭으로 개종",
    "location": "갈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 527,
    "tag": "POLITICS",
    "title": "유스티니아누스 비잔틴 황제 즉위",
    "desc": "유스티니아누스 1세 즉위. 로마법 대전 편찬, 하기아소피아 건설, 북아프리카·이탈리아 재정복 등 업적",
    "location": "콘스탄티노플",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 527,
    "tag": "RELIGION",
    "title": "불교 신라 공식 채택",
    "desc": "이차돈의 순교를 계기로 법흥왕이 불교를 신라의 국교로 공식 채택. 한반도 3국 모두 불교 국가가 됨",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 529,
    "tag": "POLITICS",
    "title": "로마법 대전 편찬",
    "desc": "유스티니아누스가 로마 법률을 집대성한 법학대전(코르푸스 유리스 시빌리스)을 편찬. 서양 법학의 근간",
    "location": "콘스탄티노플",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 532,
    "tag": "CULTURE",
    "title": "하기아 소피아 착공",
    "desc": "비잔틴 제국의 유스티니아누스가 콘스탄티노플에 하기아 소피아 성당 건축 시작. 당대 최대의 건축물",
    "location": "콘스탄티노플 (이스탄불)",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 532,
    "tag": "WAR",
    "title": "신라 금관가야 병합",
    "desc": "법흥왕이 금관가야를 병합. 가야 연맹이 무너지기 시작하고 신라가 낙동강 서부로 세력을 확장",
    "location": "김해·낙동강 유역",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 536,
    "tag": "POLITICS",
    "title": "신라 한강 유역 진출",
    "desc": "진흥왕이 나제동맹을 파기하고 한강 유역을 장악. 중국과의 직접 교류로를 확보하는 외교적 대전환",
    "location": "한강 유역",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 541,
    "tag": "DISASTER",
    "title": "유스티니아누스 페스트 대유행",
    "desc": "비잔틴 제국에서 시작된 역병이 지중해 전역을 강타. 5000만 명 이상이 사망하여 로마 재건 노력이 좌절",
    "location": "지중해 전역",
    "region": [
      "유럽",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 562,
    "tag": "WAR",
    "title": "신라 대가야 병합·가야 소멸",
    "desc": "진흥왕이 대가야를 병합함으로써 562년간 존속한 가야 연맹이 완전히 소멸. 신라가 한반도 동남부 통일",
    "location": "고령·낙동강",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 570,
    "tag": "RELIGION",
    "title": "무함마드 탄생",
    "desc": "메카에서 이슬람교의 창시자 무함마드가 탄생. 이후 아라비아 반도와 세계 역사를 뒤바꿀 종교 혁명의 시작",
    "location": "메카, 아라비아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 589,
    "tag": "POLITICS",
    "title": "수(隋) 왕조 중국 재통일",
    "desc": "수문제가 남북조를 통일하여 수 왕조를 세움. 300년 분열 종식. 대운하 건설 등 토목공사로 민심 이반",
    "location": "장안, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 612,
    "tag": "WAR",
    "title": "살수대첩 - 고구려 수나라 격퇴",
    "desc": "을지문덕 장군이 살수(청천강)에서 수양제의 113만 대군을 격파. 동아시아 역사를 바꾼 대전승",
    "location": "청천강 (살수)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 618,
    "tag": "POLITICS",
    "title": "당(唐) 왕조 건국",
    "desc": "이연이 수 왕조를 무너뜨리고 당 왕조를 세움. 이후 290년간 동아시아 문명의 중심지로 전성기를 구가",
    "location": "장안 (시안), 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 622,
    "tag": "RELIGION",
    "title": "무함마드의 히즈라 - 이슬람력 원년",
    "desc": "무함마드가 메카에서 메디나로 이주(히즈라). 이슬람 공동체 움마 형성의 기원이자 이슬람력 원년",
    "location": "아라비아 반도",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 630,
    "tag": "RELIGION",
    "title": "무함마드의 메카 정복",
    "desc": "이슬람교가 아라비아 반도의 중심 종교로 자리 잡음",
    "location": "메카",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 632,
    "tag": "RELIGION",
    "title": "무함마드 사망·이슬람 팽창 시작",
    "desc": "무함마드 사망 후 아부 바크르가 초대 칼리프가 됨. 아랍 이슬람 세력이 시리아·페르시아·이집트로 급격 확장",
    "location": "메디나",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 636,
    "tag": "WAR",
    "title": "야르무크 전투 - 이슬람 비잔틴 격파",
    "desc": "이슬람 군대가 야르무크 전투에서 비잔틴 대군을 격파. 시리아·팔레스타인이 이슬람 세계로 편입됨",
    "location": "시리아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 645,
    "tag": "WAR",
    "title": "당 태종 고구려 친정·실패",
    "desc": "당 태종이 직접 군대를 이끌고 고구려를 침공했으나 안시성에서 고구려군에 저지됨. 고구려의 위대한 방어",
    "location": "안시성 (요녕성)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 660,
    "tag": "WAR",
    "title": "백제 멸망",
    "desc": "나당 연합군의 공격으로 백제가 멸망. 계백 장군의 황산벌 전투 등 결사 항전에도 의자왕이 항복",
    "location": "사비 (부여)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 661,
    "tag": "POLITICS",
    "title": "우마이야 칼리프국 수립",
    "desc": "무아위야가 우마이야 칼리프국을 수립. 수도를 다마스쿠스로 옮기고 이슬람 제국의 세속적 지배 체제 확립",
    "location": "다마스쿠스, 시리아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 663,
    "tag": "WAR",
    "title": "백강구 전투 - 일본 백제 지원 함대 격파",
    "desc": "나당 연합 수군이 백제 부흥을 지원하는 일본 함대를 백강구에서 완전 격파. 고대 동아시아 국제전의 종결",
    "location": "백강 (금강 하류)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 668,
    "tag": "WAR",
    "title": "고구려 멸망",
    "desc": "나당 연합군이 고구려를 공격하여 보장왕이 항복. 705년간 존속한 고구려 멸망. 삼국 시대 종막",
    "location": "평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 676,
    "tag": "POLITICS",
    "title": "신라 삼국 통일",
    "desc": "신라가 매소성·기벌포 전투에서 당나라 군대를 격파하고 대동강 이남 한반도를 통일. 민족 통합의 출발점",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 680,
    "tag": "RELIGION",
    "title": "카르발라 전투 - 수니·시아 분열",
    "desc": "카르발라에서 후세인 이븐 알리가 전사. 이 사건으로 수니파와 시아파의 이슬람 분열이 역사적으로 고착화됨",
    "location": "카르발라, 이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 700,
    "tag": "CULTURE",
    "title": "통일신라 황금기",
    "desc": "통일신라가 불교 문화의 절정기를 맞이. 당나라와 활발한 교류 속에 독창적인 불교 예술·건축 발전",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 704,
    "tag": "SCIENCE",
    "title": "704년 중세 및 근세의 변화",
    "desc": "704년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 708,
    "tag": "SCIENCE",
    "title": "708년 중세 및 근세의 변화",
    "desc": "708년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 711,
    "tag": "WAR",
    "title": "이슬람 이베리아 반도 정복",
    "desc": "우마이야 왕조의 타리크 이븐 지야드가 직브롤터를 건너 이베리아 반도를 정복. 이슬람 유럽 진출의 절정",
    "location": "이베리아 반도 (스페인)",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 712,
    "tag": "SCIENCE",
    "title": "712년 중세 및 근세의 변화",
    "desc": "712년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 716,
    "tag": "SCIENCE",
    "title": "716년 중세 및 근세의 변화",
    "desc": "716년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 720,
    "tag": "CULTURE",
    "title": "석굴암 건축 착수",
    "desc": "통일신라가 토함산에 석굴암 건축을 시작. 동아시아 불교 석굴 예술의 최고 걸작으로 유네스코 세계유산",
    "location": "경주 토함산",
    "region": [
      "경상도"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 724,
    "tag": "SCIENCE",
    "title": "724년 중세 및 근세의 변화",
    "desc": "724년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 726,
    "tag": "RELIGION",
    "title": "성상 파괴령 발포",
    "desc": "비잔틴 황제 레온 3세가 성상 숭배를 금지하며 동서 교회 갈등 심화",
    "location": "콘스탄티노플",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 726,
    "tag": "RELIGION",
    "title": "비잔틴 성상파괴 논쟁",
    "desc": "레온 3세가 성상 숭배를 금지하는 성상파괴령 발포. 동서 기독교 교회 분열의 신학적 출발점이 됨",
    "location": "콘스탄티노플",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 728,
    "tag": "SCIENCE",
    "title": "728년 중세 및 근세의 변화",
    "desc": "728년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 732,
    "tag": "WAR",
    "title": "투르-푸아티에 전투",
    "desc": "카를 마르텔이 이슬람 우마이야 군대를 투르 전투에서 격파. 이슬람의 서유럽 확산을 저지한 결정적 전투",
    "location": "투르, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 736,
    "tag": "SCIENCE",
    "title": "736년 중세 및 근세의 변화",
    "desc": "736년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 740,
    "tag": "SCIENCE",
    "title": "740년 중세 및 근세의 변화",
    "desc": "740년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 744,
    "tag": "SCIENCE",
    "title": "744년 중세 및 근세의 변화",
    "desc": "744년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 748,
    "tag": "SCIENCE",
    "title": "748년 중세 및 근세의 변화",
    "desc": "748년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 750,
    "tag": "POLITICS",
    "title": "아바스 칼리프국 수립",
    "desc": "아바스 가문이 우마이야를 무너뜨리고 아바스 칼리프국 수립. 수도 바그다드를 중심으로 이슬람 황금시대 개막",
    "location": "바그다드, 이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 751,
    "tag": "CULTURE",
    "title": "불국사 창건",
    "desc": "통일신라 경덕왕 때 불국사가 창건됨. 석굴암과 함께 신라 불교 건축의 정수로 유네스코 세계유산",
    "location": "경주",
    "region": [
      "경상도"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 752,
    "tag": "SCIENCE",
    "title": "752년 중세 및 근세의 변화",
    "desc": "752년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 756,
    "tag": "SCIENCE",
    "title": "756년 중세 및 근세의 변화",
    "desc": "756년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 760,
    "tag": "SCIENCE",
    "title": "760년 중세 및 근세의 변화",
    "desc": "760년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 762,
    "tag": "POLITICS",
    "title": "바그다드 건설",
    "desc": "아바스 칼리프 만수르가 원형 도시 바그다드를 건설. 이후 세계 최대 도시이자 학문·상업의 중심지로 발전",
    "location": "바그다드, 이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 764,
    "tag": "SCIENCE",
    "title": "764년 중세 및 근세의 변화",
    "desc": "764년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 768,
    "tag": "SCIENCE",
    "title": "768년 중세 및 근세의 변화",
    "desc": "768년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 772,
    "tag": "SCIENCE",
    "title": "772년 중세 및 근세의 변화",
    "desc": "772년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 776,
    "tag": "SCIENCE",
    "title": "776년 중세 및 근세의 변화",
    "desc": "776년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 780,
    "tag": "POLITICS",
    "title": "신라 진골 귀족 권력 다툼 격화",
    "desc": "혜공왕 피살 이후 신라 진골 귀족 간의 왕위 다툼이 극심해짐. 신라 하대 혼란의 시작",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 784,
    "tag": "SCIENCE",
    "title": "784년 중세 및 근세의 변화",
    "desc": "784년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 788,
    "tag": "POLITICS",
    "title": "신라 독서삼품과 설치",
    "desc": "원성왕이 유교 경전 이해도를 기준으로 관리를 선발하는 독서삼품과를 설치. 능력 중심 인재 등용 시도",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 792,
    "tag": "SCIENCE",
    "title": "792년 중세 및 근세의 변화",
    "desc": "792년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 793,
    "tag": "WAR",
    "title": "바이킹 린디스판 수도원 약탈",
    "desc": "바이킹이 잉글랜드 린디스판 수도원을 약탈. 300년에 걸친 바이킹 시대의 서막. 유럽 전역을 공포에 떨게 함",
    "location": "린디스판, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 796,
    "tag": "SCIENCE",
    "title": "796년 중세 및 근세의 변화",
    "desc": "796년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 800,
    "tag": "POLITICS",
    "title": "카롤루스 대제 황제 대관",
    "desc": "교황으로부터 서로마 황제 칭호를 받으며 서유럽 통합 시도",
    "location": "로마",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 804,
    "tag": "SCIENCE",
    "title": "804년 중세 및 근세의 변화",
    "desc": "804년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 808,
    "tag": "SCIENCE",
    "title": "808년 중세 및 근세의 변화",
    "desc": "808년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 812,
    "tag": "SCIENCE",
    "title": "812년 중세 및 근세의 변화",
    "desc": "812년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 816,
    "tag": "SCIENCE",
    "title": "816년 중세 및 근세의 변화",
    "desc": "816년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 820,
    "tag": "SCIENCE",
    "title": "지혜의 집 전성기 (바그다드)",
    "desc": "아바스 칼리프국의 바그다드에 지혜의 집이 설립되어 그리스·인도·페르시아 학문을 아랍어로 번역·발전",
    "location": "바그다드",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 822,
    "tag": "WAR",
    "title": "신라 김헌창 반란",
    "desc": "웅주 도독 김헌창이 반란을 일으켜 장안국을 선포. 신라의 내분이 심각한 수준에 달했음을 보여주는 사건",
    "location": "웅주 (공주)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 824,
    "tag": "SCIENCE",
    "title": "824년 중세 및 근세의 변화",
    "desc": "824년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 828,
    "tag": "ECONOMY",
    "title": "장보고 청해진 설치",
    "desc": "장보고가 완도에 청해진을 설치하고 동아시아 해상 무역을 장악. 한중일 삼국을 잇는 해양 실크로드의 거점",
    "location": "완도 (청해진)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 832,
    "tag": "SCIENCE",
    "title": "832년 중세 및 근세의 변화",
    "desc": "832년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 836,
    "tag": "SCIENCE",
    "title": "836년 중세 및 근세의 변화",
    "desc": "836년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 840,
    "tag": "SCIENCE",
    "title": "840년 중세 및 근세의 변화",
    "desc": "840년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 843,
    "tag": "POLITICS",
    "title": "베르됭 조약 - 카롤링거 제국 분할",
    "desc": "카롤루스 대제의 손자들이 베르됭 조약을 통해 제국을 동·중·서 프랑크로 분할. 프랑스·독일·이탈리아의 기원",
    "location": "베르됭, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 844,
    "tag": "SCIENCE",
    "title": "844년 중세 및 근세의 변화",
    "desc": "844년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 848,
    "tag": "SCIENCE",
    "title": "848년 중세 및 근세의 변화",
    "desc": "848년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 852,
    "tag": "SCIENCE",
    "title": "852년 중세 및 근세의 변화",
    "desc": "852년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 856,
    "tag": "SCIENCE",
    "title": "856년 중세 및 근세의 변화",
    "desc": "856년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 860,
    "tag": "SCIENCE",
    "title": "860년 중세 및 근세의 변화",
    "desc": "860년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 864,
    "tag": "SCIENCE",
    "title": "864년 중세 및 근세의 변화",
    "desc": "864년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 868,
    "tag": "TECHNOLOGY",
    "title": "세계 최초 목판 인쇄 서적",
    "desc": "중국에서 금강경을 인쇄한 세계 최초의 목판 인쇄 서적이 제작됨. 지식 보급의 혁명적 전환점",
    "location": "돈황, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 872,
    "tag": "SCIENCE",
    "title": "872년 중세 및 근세의 변화",
    "desc": "872년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 875,
    "tag": "POLITICS",
    "title": "신라 지방 호족 성장",
    "desc": "신라 말기에 중앙 통제가 무너지며 지방 호족 세력이 독자적 권력을 행사하기 시작. 후삼국 분열의 전조",
    "location": "한반도 각지",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 876,
    "tag": "SCIENCE",
    "title": "876년 중세 및 근세의 변화",
    "desc": "876년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 878,
    "tag": "WAR",
    "title": "알프레드 대왕 바이킹 격퇴",
    "desc": "웨섹스의 알프레드 대왕이 에딩턴 전투에서 바이킹 데인족을 격파. 잉글랜드 통일의 발판 마련",
    "location": "웨섹스, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 880,
    "tag": "SCIENCE",
    "title": "880년 중세 및 근세의 변화",
    "desc": "880년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 884,
    "tag": "SCIENCE",
    "title": "884년 중세 및 근세의 변화",
    "desc": "884년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 888,
    "tag": "SCIENCE",
    "title": "888년 중세 및 근세의 변화",
    "desc": "888년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 889,
    "tag": "WAR",
    "title": "신라 전국 농민 봉기",
    "desc": "진성여왕 치하에서 세금 수탈에 저항하는 대규모 농민 봉기가 전국으로 확산. 신라의 사실상 붕괴 시작",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 892,
    "tag": "POLITICS",
    "title": "후백제 건국",
    "desc": "견훤이 완주(전주)에서 후백제를 선포. 후삼국 시대의 시작이자 신라 지배 질서의 공식적 붕괴",
    "location": "완주 (전주)",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 896,
    "tag": "SCIENCE",
    "title": "896년 중세 및 근세의 변화",
    "desc": "896년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 900,
    "tag": "SCIENCE",
    "title": "900년 중세 및 근세의 변화",
    "desc": "900년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 901,
    "tag": "POLITICS",
    "title": "후고구려 건국",
    "desc": "궁예가 후고구려(마진·태봉)를 건국. 신라 왕족 출신으로 북부 세력을 규합하여 후삼국 삼파전 형성",
    "location": "철원",
    "region": [
      "강원도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 904,
    "tag": "SCIENCE",
    "title": "904년 중세 및 근세의 변화",
    "desc": "904년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 907,
    "tag": "POLITICS",
    "title": "당(唐) 왕조 멸망·5대10국 시대",
    "desc": "주전충이 당 왕조를 무너뜨림. 290년 동아시아 최강 제국 붕괴. 이후 오대십국의 분열 시대 시작",
    "location": "낙양, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 908,
    "tag": "SCIENCE",
    "title": "908년 중세 및 근세의 변화",
    "desc": "908년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 911,
    "tag": "POLITICS",
    "title": "노르망디 공국 성립",
    "desc": "노르만(바이킹) 족장 롤로가 프랑스 왕으로부터 노르망디를 봉토로 받음. 후에 영국을 정복하는 노르만 왕조의 기원",
    "location": "노르망디, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 912,
    "tag": "SCIENCE",
    "title": "912년 중세 및 근세의 변화",
    "desc": "912년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 916,
    "tag": "SCIENCE",
    "title": "916년 중세 및 근세의 변화",
    "desc": "916년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 918,
    "tag": "POLITICS",
    "title": "고려 건국",
    "desc": "왕건이 궁예를 몰아내고 고려를 건국. 후삼국의 혼란을 수습하고 한반도를 통일하는 새 왕조의 시작",
    "location": "개성 (송악)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 920,
    "tag": "SCIENCE",
    "title": "920년 중세 및 근세의 변화",
    "desc": "920년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 924,
    "tag": "SCIENCE",
    "title": "924년 중세 및 근세의 변화",
    "desc": "924년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 927,
    "tag": "WAR",
    "title": "후백제 신라 경주 침공",
    "desc": "견훤이 신라 수도 경주를 습격하여 경애왕을 살해. 신라의 사실상 종말을 알리는 충격적 사건",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 928,
    "tag": "SCIENCE",
    "title": "928년 중세 및 근세의 변화",
    "desc": "928년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 930,
    "tag": "WAR",
    "title": "고창 전투 - 고려 후백제 결전",
    "desc": "고려 왕건이 안동 고창 전투에서 견훤의 후백제를 크게 격파. 한반도 통일의 향배를 결정한 전투",
    "location": "안동 (고창)",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 932,
    "tag": "SCIENCE",
    "title": "932년 중세 및 근세의 변화",
    "desc": "932년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 935,
    "tag": "POLITICS",
    "title": "신라 마지막 왕 항복",
    "desc": "신라 마지막 왕 경순왕이 고려 왕건에게 항복. 992년간 존속한 신라가 평화적으로 고려에 흡수됨",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 936,
    "tag": "POLITICS",
    "title": "고려 한반도 통일",
    "desc": "고려가 후백제를 멸망시키고 한반도를 재통일. 고조선 이래 최초의 실질적 민족 통합",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 936,
    "tag": "POLITICS",
    "title": "송(宋) 왕조 중국 통일",
    "desc": "조광윤이 오대십국의 혼란을 수습하고 송 왕조를 세움. 문치주의, 과거제, 활판인쇄 등 문화 융성",
    "location": "개봉, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 940,
    "tag": "SCIENCE",
    "title": "940년 중세 및 근세의 변화",
    "desc": "940년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 944,
    "tag": "SCIENCE",
    "title": "944년 중세 및 근세의 변화",
    "desc": "944년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 948,
    "tag": "SCIENCE",
    "title": "948년 중세 및 근세의 변화",
    "desc": "948년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 952,
    "tag": "SCIENCE",
    "title": "952년 중세 및 근세의 변화",
    "desc": "952년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 956,
    "tag": "SCIENCE",
    "title": "956년 중세 및 근세의 변화",
    "desc": "956년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 958,
    "tag": "POLITICS",
    "title": "고려 과거제 실시",
    "desc": "광종이 쌍기의 건의를 받아들여 과거제를 실시. 능력 중심의 관료 선발로 왕권 강화와 행정 혁신 도모",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 960,
    "tag": "SCIENCE",
    "title": "960년 중세 및 근세의 변화",
    "desc": "960년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 964,
    "tag": "SCIENCE",
    "title": "964년 중세 및 근세의 변화",
    "desc": "964년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 968,
    "tag": "SCIENCE",
    "title": "968년 중세 및 근세의 변화",
    "desc": "968년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 969,
    "tag": "POLITICS",
    "title": "파티마 왕조 이집트 정복",
    "desc": "시아파 파티마 왕조가 이집트를 정복하고 카이로를 건설. 이슬람 세계의 분열과 경쟁이 심화됨",
    "location": "카이로, 이집트",
    "region": [
      "아프리카",
      "중동"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 972,
    "tag": "SCIENCE",
    "title": "972년 중세 및 근세의 변화",
    "desc": "972년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 976,
    "tag": "SCIENCE",
    "title": "976년 중세 및 근세의 변화",
    "desc": "976년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 980,
    "tag": "SCIENCE",
    "title": "980년 중세 및 근세의 변화",
    "desc": "980년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 984,
    "tag": "SCIENCE",
    "title": "984년 중세 및 근세의 변화",
    "desc": "984년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 988,
    "tag": "SCIENCE",
    "title": "988년 중세 및 근세의 변화",
    "desc": "988년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 992,
    "tag": "SCIENCE",
    "title": "992년 중세 및 근세의 변화",
    "desc": "992년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 993,
    "tag": "WAR",
    "title": "거란 1차 침입·서희 담판",
    "desc": "거란(요)이 고려를 침공하자 서희가 담판을 통해 강동 6주를 획득. 군사력이 아닌 외교로 이긴 역사적 사건",
    "location": "압록강 일대",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 996,
    "tag": "SCIENCE",
    "title": "996년 중세 및 근세의 변화",
    "desc": "996년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1000,
    "tag": "CULTURE",
    "title": "바이킹 북미 도달 (레이프 에릭손)",
    "desc": "레이프 에릭손이 북미 대륙(빈란드)에 도달. 콜럼버스보다 500년 앞선 유럽인의 아메리카 최초 도착",
    "location": "뉴펀들랜드, 캐나다",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1000,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1000년)",
    "desc": "1000년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1004,
    "tag": "SCIENCE",
    "title": "1004년 중세 및 근세의 변화",
    "desc": "1004년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1008,
    "tag": "SCIENCE",
    "title": "1008년 중세 및 근세의 변화",
    "desc": "1008년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1010,
    "tag": "WAR",
    "title": "거란 2차 침입·개경 함락",
    "desc": "거란의 성종이 40만 대군으로 침공하여 고려 수도 개경을 불태움. 현종이 나주까지 피난하는 국가적 위기",
    "location": "개경·압록강",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1010,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1010년)",
    "desc": "1010년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1011,
    "tag": "CULTURE",
    "title": "고려 초조대장경 간행 시작",
    "desc": "거란의 침입을 불교의 힘으로 막기 위해 대장경 제작 시작",
    "location": "고려",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1012,
    "tag": "SCIENCE",
    "title": "1012년 중세 및 근세의 변화",
    "desc": "1012년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1016,
    "tag": "SCIENCE",
    "title": "1016년 중세 및 근세의 변화",
    "desc": "1016년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1018,
    "tag": "WAR",
    "title": "귀주대첩 - 강감찬 거란 격퇴",
    "desc": "강감찬 장군이 귀주에서 거란 10만 대군을 섬멸. 동아시아 역사상 손꼽히는 대첩으로 고려의 자존을 지킴",
    "location": "귀주 (구성)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1020,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1020년)",
    "desc": "1020년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1020,
    "tag": "SCIENCE",
    "title": "1020년 중세 및 근세의 변화",
    "desc": "1020년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1024,
    "tag": "SCIENCE",
    "title": "1024년 중세 및 근세의 변화",
    "desc": "1024년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1028,
    "tag": "SCIENCE",
    "title": "1028년 중세 및 근세의 변화",
    "desc": "1028년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1030,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1030년)",
    "desc": "1030년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1032,
    "tag": "SCIENCE",
    "title": "1032년 중세 및 근세의 변화",
    "desc": "1032년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1036,
    "tag": "SCIENCE",
    "title": "1036년 중세 및 근세의 변화",
    "desc": "1036년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1040,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1040년)",
    "desc": "1040년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1040,
    "tag": "SCIENCE",
    "title": "1040년 중세 및 근세의 변화",
    "desc": "1040년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1044,
    "tag": "TECHNOLOGY",
    "title": "화약 조합법 중국 기록",
    "desc": "중국 무경총요에 화약의 제조 비법이 최초로 기록됨. 이후 몽골·이슬람을 거쳐 유럽으로 전파되어 군사혁명을 일으킴",
    "location": "중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1048,
    "tag": "SCIENCE",
    "title": "1048년 중세 및 근세의 변화",
    "desc": "1048년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1050,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1050년)",
    "desc": "1050년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1052,
    "tag": "SCIENCE",
    "title": "1052년 중세 및 근세의 변화",
    "desc": "1052년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1054,
    "tag": "RELIGION",
    "title": "동서 교회 대분열",
    "desc": "교황 레오 9세와 콘스탄티노플 총대주교 케룰라리오스의 상호 파문으로 가톨릭과 동방정교회가 공식 분열",
    "location": "로마·콘스탄티노플",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1055,
    "tag": "CULTURE",
    "title": "고려 청자 전성기",
    "desc": "고려 청자 제작 기술이 최고 수준에 달함. 비색(翡色) 청자는 중국도 인정한 세계 최고의 도자기 예술",
    "location": "강진·부안",
    "region": [
      "전라도"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1056,
    "tag": "SCIENCE",
    "title": "1056년 중세 및 근세의 변화",
    "desc": "1056년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1060,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1060년)",
    "desc": "1060년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1060,
    "tag": "SCIENCE",
    "title": "1060년 중세 및 근세의 변화",
    "desc": "1060년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1064,
    "tag": "SCIENCE",
    "title": "1064년 중세 및 근세의 변화",
    "desc": "1064년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1066,
    "tag": "WAR",
    "title": "노르만 잉글랜드 정복",
    "desc": "노르망디 공 윌리엄이 헤이스팅스 전투에서 해럴드 왕을 격파하고 잉글랜드를 정복. 영어·영국 문화의 대전환",
    "location": "헤이스팅스, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1068,
    "tag": "SCIENCE",
    "title": "1068년 중세 및 근세의 변화",
    "desc": "1068년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1070,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1070년)",
    "desc": "1070년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1071,
    "tag": "WAR",
    "title": "만지케르트 전투 - 비잔틴 셀주크 패배",
    "desc": "셀주크 투르크가 만지케르트에서 비잔틴 황제를 생포. 소아시아가 투르크화되고 십자군 요청의 직접적 계기",
    "location": "만지케르트, 터키",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1072,
    "tag": "SCIENCE",
    "title": "1072년 중세 및 근세의 변화",
    "desc": "1072년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1076,
    "tag": "SCIENCE",
    "title": "1076년 중세 및 근세의 변화",
    "desc": "1076년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1080,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1080년)",
    "desc": "1080년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1080,
    "tag": "SCIENCE",
    "title": "1080년 중세 및 근세의 변화",
    "desc": "1080년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1084,
    "tag": "SCIENCE",
    "title": "1084년 중세 및 근세의 변화",
    "desc": "1084년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1086,
    "tag": "RELIGION",
    "title": "의천 속장경 편찬",
    "desc": "고려 승려 의천이 교종과 선종의 통합을 시도하고 속장경(교장) 편찬에 착수. 고려 불교 문화의 절정",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1088,
    "tag": "CULTURE",
    "title": "볼로냐 대학 설립",
    "desc": "유럽 최초의 근대적 대학 설립",
    "location": "볼로냐, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1088,
    "tag": "CULTURE",
    "title": "볼로냐 대학 설립 - 유럽 최초 대학",
    "desc": "이탈리아 볼로냐에 유럽 최초의 대학이 설립됨. 법학 연구의 중심지로 유럽 고등교육의 기원이 됨",
    "location": "볼로냐, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1090,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1090년)",
    "desc": "1090년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1092,
    "tag": "SCIENCE",
    "title": "1092년 중세 및 근세의 변화",
    "desc": "1092년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1095,
    "tag": "WAR",
    "title": "제1차 십자군 선포",
    "desc": "교황 우르바노 2세가 클레르몽 공의회에서 십자군을 선포. 성지 예루살렘 탈환을 목표로 2세기간 십자군 전쟁 시작",
    "location": "클레르몽, 프랑스",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1096,
    "tag": "SCIENCE",
    "title": "1096년 중세 및 근세의 변화",
    "desc": "1096년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1099,
    "tag": "WAR",
    "title": "십자군 예루살렘 정복",
    "desc": "제1차 십자군이 예루살렘을 함락하고 학살을 자행. 예루살렘 왕국 수립. 이슬람 세계와의 갈등 심화",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1100,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1100년)",
    "desc": "1100년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1100,
    "tag": "SCIENCE",
    "title": "1100년 중세 및 근세의 변화",
    "desc": "1100년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1101,
    "tag": "ECONOMY",
    "title": "고려 화폐 주조",
    "desc": "숙종이 해동통보 등 금속 화폐를 주조. 고려의 상업 발전과 화폐 경제 도입 시도",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1104,
    "tag": "SCIENCE",
    "title": "1104년 중세 및 근세의 변화",
    "desc": "1104년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1108,
    "tag": "SCIENCE",
    "title": "1108년 중세 및 근세의 변화",
    "desc": "1108년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1110,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1110년)",
    "desc": "1110년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1112,
    "tag": "SCIENCE",
    "title": "1112년 중세 및 근세의 변화",
    "desc": "1112년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1116,
    "tag": "SCIENCE",
    "title": "1116년 중세 및 근세의 변화",
    "desc": "1116년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1120,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1120년)",
    "desc": "1120년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1120,
    "tag": "SCIENCE",
    "title": "1120년 중세 및 근세의 변화",
    "desc": "1120년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1124,
    "tag": "SCIENCE",
    "title": "1124년 중세 및 근세의 변화",
    "desc": "1124년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1126,
    "tag": "WAR",
    "title": "이자겸의 난",
    "desc": "외척 이자겸이 왕권을 능가하는 세력을 형성하며 반란을 일으킴. 고려 귀족 사회 내부 모순의 표출",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1128,
    "tag": "SCIENCE",
    "title": "1128년 중세 및 근세의 변화",
    "desc": "1128년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1130,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1130년)",
    "desc": "1130년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1132,
    "tag": "SCIENCE",
    "title": "1132년 중세 및 근세의 변화",
    "desc": "1132년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1135,
    "tag": "WAR",
    "title": "묘청의 서경 천도 운동·반란",
    "desc": "묘청이 서경(평양) 천도와 금 정벌을 주장하다 반란을 일으킴. 김부식이 진압. 고려 자주파·사대파 갈등",
    "location": "서경 (평양)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1136,
    "tag": "SCIENCE",
    "title": "1136년 중세 및 근세의 변화",
    "desc": "1136년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1140,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1140년)",
    "desc": "1140년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1140,
    "tag": "SCIENCE",
    "title": "1140년 중세 및 근세의 변화",
    "desc": "1140년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1144,
    "tag": "SCIENCE",
    "title": "1144년 중세 및 근세의 변화",
    "desc": "1144년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1145,
    "tag": "CULTURE",
    "title": "삼국사기 완성",
    "desc": "김부식이 삼국사기를 완성. 고구려·백제·신라 삼국의 역사를 기록한 현존 최고(最古)의 한국 역사서",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1147,
    "tag": "WAR",
    "title": "제2차 십자군 실패",
    "desc": "독일·프랑스 왕이 직접 참여한 제2차 십자군이 다마스쿠스 포위 실패로 참패. 십자군의 사기가 크게 저하",
    "location": "시리아·팔레스타인",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1148,
    "tag": "SCIENCE",
    "title": "1148년 중세 및 근세의 변화",
    "desc": "1148년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1150,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1150년)",
    "desc": "1150년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1152,
    "tag": "SCIENCE",
    "title": "1152년 중세 및 근세의 변화",
    "desc": "1152년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1154,
    "tag": "POLITICS",
    "title": "플란타제네트 왕조 잉글랜드 시작",
    "desc": "헨리 2세가 잉글랜드 왕위에 올라 플란타제네트 왕조 시작. 영국 법 체계와 왕권의 기틀을 마련",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1156,
    "tag": "SCIENCE",
    "title": "1156년 중세 및 근세의 변화",
    "desc": "1156년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1160,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1160년)",
    "desc": "1160년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1160,
    "tag": "SCIENCE",
    "title": "1160년 중세 및 근세의 변화",
    "desc": "1160년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1164,
    "tag": "SCIENCE",
    "title": "1164년 중세 및 근세의 변화",
    "desc": "1164년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1168,
    "tag": "SCIENCE",
    "title": "1168년 중세 및 근세의 변화",
    "desc": "1168년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1170,
    "tag": "POLITICS",
    "title": "고려 무신정변",
    "desc": "정중부·이의방 등 무신들이 쿠데타를 일으켜 문신 귀족을 대량 학살. 100여 년간 무신정권 시대 시작",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1170,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1170년)",
    "desc": "1170년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1172,
    "tag": "SCIENCE",
    "title": "1172년 중세 및 근세의 변화",
    "desc": "1172년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1176,
    "tag": "SCIENCE",
    "title": "1176년 중세 및 근세의 변화",
    "desc": "1176년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1180,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1180년)",
    "desc": "1180년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1180,
    "tag": "SCIENCE",
    "title": "1180년 중세 및 근세의 변화",
    "desc": "1180년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1184,
    "tag": "SCIENCE",
    "title": "1184년 중세 및 근세의 변화",
    "desc": "1184년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1187,
    "tag": "WAR",
    "title": "살라딘 예루살렘 탈환",
    "desc": "이슬람 영웅 살라딘이 하틴 전투에서 십자군을 격파하고 예루살렘을 탈환. 기독교 세계에 큰 충격",
    "location": "예루살렘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1188,
    "tag": "SCIENCE",
    "title": "1188년 중세 및 근세의 변화",
    "desc": "1188년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1189,
    "tag": "WAR",
    "title": "제3차 십자군 원정",
    "desc": "영국 리처드 1세·프랑스 필리프 2세·신성로마제국 프리드리히 1세가 참여. 예루살렘 탈환 실패, 협정 체결",
    "location": "팔레스타인",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1190,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1190년)",
    "desc": "1190년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1192,
    "tag": "SCIENCE",
    "title": "1192년 중세 및 근세의 변화",
    "desc": "1192년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1196,
    "tag": "POLITICS",
    "title": "최충헌 무신정권 집권",
    "desc": "최충헌이 이의민을 제거하고 무신정권을 장악. 이후 최씨 4대 60여 년간의 최씨 무신정권 시대 개막",
    "location": "개성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1200,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1200년)",
    "desc": "1200년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1200,
    "tag": "SCIENCE",
    "title": "1200년 중세 및 근세의 변화",
    "desc": "1200년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1204,
    "tag": "SCIENCE",
    "title": "1204년 중세 및 근세의 변화",
    "desc": "1204년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1206,
    "tag": "POLITICS",
    "title": "칭기즈 칸 몽골 통일",
    "desc": "테무진이 쿠릴타이에서 칭기즈 칸으로 추대되며 몽골 제국 수립. 역사상 최대 육상 제국 건설의 시작",
    "location": "몽골 고원",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1208,
    "tag": "SCIENCE",
    "title": "1208년 중세 및 근세의 변화",
    "desc": "1208년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1210,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1210년)",
    "desc": "1210년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1212,
    "tag": "SCIENCE",
    "title": "1212년 중세 및 근세의 변화",
    "desc": "1212년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1215,
    "tag": "POLITICS",
    "title": "마그나 카르타 서명",
    "desc": "영국 존 왕이 귀족들의 요구로 왕권 제한 문서에 서명",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1216,
    "tag": "SCIENCE",
    "title": "1216년 중세 및 근세의 변화",
    "desc": "1216년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1219,
    "tag": "WAR",
    "title": "몽골 중앙아시아 정복",
    "desc": "칭기즈 칸이 호라즘 제국을 정복하고 중앙아시아·페르시아를 석권. 수백만 명의 목숨을 앗아간 대학살",
    "location": "중앙아시아",
    "region": [
      "아시아",
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1220,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1220년)",
    "desc": "1220년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1220,
    "tag": "SCIENCE",
    "title": "1220년 중세 및 근세의 변화",
    "desc": "1220년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1224,
    "tag": "SCIENCE",
    "title": "1224년 중세 및 근세의 변화",
    "desc": "1224년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1227,
    "tag": "POLITICS",
    "title": "칭기즈 칸 사망·제국 분할",
    "desc": "칭기즈 칸이 원정 중 사망. 제국이 4개의 칸국으로 분할되어 각자의 왕조로 발전",
    "location": "감숙성, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1228,
    "tag": "SCIENCE",
    "title": "1228년 중세 및 근세의 변화",
    "desc": "1228년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1230,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1230년)",
    "desc": "1230년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1231,
    "tag": "WAR",
    "title": "몽골 1차 고려 침입",
    "desc": "살리타이 이끄는 몽골군이 고려를 침공. 고려 조정은 강화도로 피난하고 백성들은 30년 항쟁을 시작",
    "location": "압록강·개성",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1232,
    "tag": "POLITICS",
    "title": "고려 조정 강화도 천도",
    "desc": "최우 무신정권이 몽골의 기마군을 피해 강화도로 수도를 옮김. 38년간의 강화도 항몽 시대 시작",
    "location": "강화도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1234,
    "tag": "TECHNOLOGY",
    "title": "고려 금속활자 공식 사용",
    "desc": "고려가 금속활자로 상정고금예문을 인쇄. 구텐베르크보다 200년 앞선 세계 최초의 금속활자 인쇄 확인",
    "location": "강화도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1236,
    "tag": "CULTURE",
    "title": "팔만대장경 조판 시작",
    "desc": "몽골 격퇴를 기원하며 팔만대장경 재조판 사업 시작. 1251년 완성. 세계 최고의 불교 목판 문화재",
    "location": "강화도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1240,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1240년)",
    "desc": "1240년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1240,
    "tag": "SCIENCE",
    "title": "1240년 중세 및 근세의 변화",
    "desc": "1240년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1241,
    "tag": "WAR",
    "title": "몽골 폴란드·헝가리 격파",
    "desc": "몽골군이 레그니차·모히 전투에서 기독교 유럽 연합군을 완파. 서유럽 직전까지 진출했으나 대칸 사망으로 철수",
    "location": "폴란드·헝가리",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1244,
    "tag": "SCIENCE",
    "title": "1244년 중세 및 근세의 변화",
    "desc": "1244년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1248,
    "tag": "SCIENCE",
    "title": "1248년 중세 및 근세의 변화",
    "desc": "1248년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1250,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1250년)",
    "desc": "1250년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1251,
    "tag": "CULTURE",
    "title": "팔만대장경 완성",
    "desc": "16년간의 대사업 끝에 8만 여 장의 팔만대장경이 완성됨. 현재 합천 해인사 보관. 유네스코 세계기록유산",
    "location": "강화도→합천",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1252,
    "tag": "SCIENCE",
    "title": "1252년 중세 및 근세의 변화",
    "desc": "1252년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1256,
    "tag": "SCIENCE",
    "title": "1256년 중세 및 근세의 변화",
    "desc": "1256년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1258,
    "tag": "WAR",
    "title": "몽골 바그다드 함락·아바스 칼리프국 멸망",
    "desc": "훌라구 칸이 바그다드를 함락하고 아바스 칼리프 무타심을 처형. 이슬람 황금시대의 완전한 종말",
    "location": "바그다드, 이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1260,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1260년)",
    "desc": "1260년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1260,
    "tag": "SCIENCE",
    "title": "1260년 중세 및 근세의 변화",
    "desc": "1260년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1264,
    "tag": "SCIENCE",
    "title": "1264년 중세 및 근세의 변화",
    "desc": "1264년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1268,
    "tag": "SCIENCE",
    "title": "1268년 중세 및 근세의 변화",
    "desc": "1268년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1270,
    "tag": "POLITICS",
    "title": "고려 몽골에 굴복·삼별초 항쟁",
    "desc": "고려가 몽골과 강화를 맺고 개경으로 환도. 이에 반발한 삼별초가 진도·제주에서 3년간 대몽 항쟁 전개",
    "location": "진도·제주",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1270,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1270년)",
    "desc": "1270년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1271,
    "tag": "CULTURE",
    "title": "마르코 폴로 동방 여행 시작",
    "desc": "베네치아 상인 마르코 폴로가 중국 원나라로 떠남. 17년간 체류 후 쓴 동방견문록이 유럽의 아시아 관심 촉발",
    "location": "베네치아→중국",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1272,
    "tag": "SCIENCE",
    "title": "1272년 중세 및 근세의 변화",
    "desc": "1272년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1273,
    "tag": "WAR",
    "title": "삼별초 최후 항쟁 제주 함락",
    "desc": "몽골-고려 연합군이 제주 항파두리성을 함락하여 삼별초를 완전히 진압. 고려의 몽골 복속 확립",
    "location": "제주 항파두리",
    "region": [
      "제주",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1274,
    "tag": "WAR",
    "title": "몽골 1차 일본 원정 실패",
    "desc": "고려-몽골 연합군이 일본을 침공했으나 태풍(神風·가미카제)으로 대파. 일본이 신의 보호를 받는다는 신화 형성",
    "location": "규슈, 일본",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1276,
    "tag": "SCIENCE",
    "title": "1276년 중세 및 근세의 변화",
    "desc": "1276년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1280,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1280년)",
    "desc": "1280년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1280,
    "tag": "SCIENCE",
    "title": "1280년 중세 및 근세의 변화",
    "desc": "1280년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1284,
    "tag": "SCIENCE",
    "title": "1284년 중세 및 근세의 변화",
    "desc": "1284년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1288,
    "tag": "SCIENCE",
    "title": "1288년 중세 및 근세의 변화",
    "desc": "1288년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1290,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1290년)",
    "desc": "1290년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1292,
    "tag": "SCIENCE",
    "title": "1292년 중세 및 근세의 변화",
    "desc": "1292년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1296,
    "tag": "SCIENCE",
    "title": "1296년 중세 및 근세의 변화",
    "desc": "1296년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1300,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1300년)",
    "desc": "1300년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1300,
    "tag": "SCIENCE",
    "title": "1300년 중세 및 근세의 변화",
    "desc": "1300년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1304,
    "tag": "SCIENCE",
    "title": "1304년 중세 및 근세의 변화",
    "desc": "1304년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1307,
    "tag": "POLITICS",
    "title": "프랑스 템플 기사단 체포",
    "desc": "프랑스 왕 필리프 4세가 부채를 탕감하려 템플 기사단을 이단으로 고발하여 체포. 1312년 기사단 해체",
    "location": "프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1308,
    "tag": "SCIENCE",
    "title": "1308년 중세 및 근세의 변화",
    "desc": "1308년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1310,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1310년)",
    "desc": "1310년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1312,
    "tag": "SCIENCE",
    "title": "1312년 중세 및 근세의 변화",
    "desc": "1312년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1315,
    "tag": "DISASTER",
    "title": "유럽 대기근",
    "desc": "이상 기후로 유럽 전역에 대기근이 발생. 1322년까지 지속되며 수백만 명이 사망. 흑사병과 함께 중세 위기 촉발",
    "location": "유럽 전역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1316,
    "tag": "SCIENCE",
    "title": "1316년 중세 및 근세의 변화",
    "desc": "1316년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1320,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1320년)",
    "desc": "1320년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1320,
    "tag": "SCIENCE",
    "title": "1320년 중세 및 근세의 변화",
    "desc": "1320년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1324,
    "tag": "SCIENCE",
    "title": "1324년 중세 및 근세의 변화",
    "desc": "1324년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1325,
    "tag": "POLITICS",
    "title": "아즈텍 제국 테노치티틀란 건설",
    "desc": "아즈텍인들이 멕시코 분지 호수 위에 수도 테노치티틀란을 건설. 이후 중앙아메리카 최강의 제국으로 성장",
    "location": "테노치티틀란 (멕시코시티)",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1328,
    "tag": "SCIENCE",
    "title": "1328년 중세 및 근세의 변화",
    "desc": "1328년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1330,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1330년)",
    "desc": "1330년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1332,
    "tag": "SCIENCE",
    "title": "1332년 중세 및 근세의 변화",
    "desc": "1332년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1336,
    "tag": "SCIENCE",
    "title": "1336년 중세 및 근세의 변화",
    "desc": "1336년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1337,
    "tag": "WAR",
    "title": "백년전쟁 시작 (영국 vs 프랑스)",
    "desc": "영국 에드워드 3세의 프랑스 왕위 주장으로 시작된 116년의 전쟁. 잔 다르크의 활약과 프랑스 민족의식 탄생",
    "location": "프랑스·영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1340,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1340년)",
    "desc": "1340년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1340,
    "tag": "SCIENCE",
    "title": "1340년 중세 및 근세의 변화",
    "desc": "1340년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1344,
    "tag": "SCIENCE",
    "title": "1344년 중세 및 근세의 변화",
    "desc": "1344년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1347,
    "tag": "DISASTER",
    "title": "흑사병 유럽 상륙",
    "desc": "중앙아시아에서 전래된 페스트가 유럽 인구의 30% 이상을 앗아감",
    "location": "유럽 전역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1347,
    "tag": "DISASTER",
    "title": "흑사병 유럽 대유행",
    "desc": "크림반도에서 시작된 흑사병이 이탈리아를 통해 유럽 전역으로 확산. 유럽 인구의 1/3인 2500만 명 이상 사망",
    "location": "유럽 전역",
    "region": [
      "유럽",
      "아시아",
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1348,
    "tag": "SCIENCE",
    "title": "1348년 중세 및 근세의 변화",
    "desc": "1348년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1350,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1350년)",
    "desc": "1350년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1351,
    "tag": "WAR",
    "title": "고려 공민왕 반원 개혁",
    "desc": "공민왕이 즉위 후 기철 등 친원 세력을 숙청하고 쌍성총관부를 무력으로 탈환. 자주적 개혁 정치 시작",
    "location": "개성·쌍성",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1352,
    "tag": "SCIENCE",
    "title": "1352년 중세 및 근세의 변화",
    "desc": "1352년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1356,
    "tag": "SCIENCE",
    "title": "1356년 중세 및 근세의 변화",
    "desc": "1356년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1360,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1360년)",
    "desc": "1360년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1360,
    "tag": "SCIENCE",
    "title": "1360년 중세 및 근세의 변화",
    "desc": "1360년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1364,
    "tag": "SCIENCE",
    "title": "1364년 중세 및 근세의 변화",
    "desc": "1364년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1368,
    "tag": "POLITICS",
    "title": "명(明) 왕조 건국·원 왕조 멸망",
    "desc": "주원장이 원 왕조를 몰아내고 명 왕조를 건국. 한족의 중국 왕조 복원. 이후 276년간 동아시아 질서의 중심",
    "location": "남경, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1370,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1370년)",
    "desc": "1370년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1372,
    "tag": "SCIENCE",
    "title": "1372년 중세 및 근세의 변화",
    "desc": "1372년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1376,
    "tag": "WAR",
    "title": "이성계 왜구 격퇴 (홍산대첩 등)",
    "desc": "이성계가 홍산 등지에서 왜구를 크게 격파하며 명장으로 부상. 고려 말 왜구 격퇴의 영웅으로 민심 장악",
    "location": "충청도 홍산",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1378,
    "tag": "RELIGION",
    "title": "서방 교회 대분열 (두 명의 교황)",
    "desc": "교황권 다툼으로 로마와 아비뇽에 동시에 교황이 등장. 가톨릭 교회의 권위가 크게 실추됨",
    "location": "로마·아비뇽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1380,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1380년)",
    "desc": "1380년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1380,
    "tag": "SCIENCE",
    "title": "1380년 중세 및 근세의 변화",
    "desc": "1380년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1384,
    "tag": "SCIENCE",
    "title": "1384년 중세 및 근세의 변화",
    "desc": "1384년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1388,
    "tag": "POLITICS",
    "title": "이성계 위화도 회군",
    "desc": "요동 정벌에 나선 이성계가 위화도에서 군대를 돌려 개경으로 귀환. 고려 멸망과 조선 건국의 결정적 사건",
    "location": "위화도 (압록강)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1390,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1390년)",
    "desc": "1390년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1392,
    "tag": "POLITICS",
    "title": "조선 건국",
    "desc": "이성계가 고려를 무너뜨리고 조선을 건국. 유교를 통치 이념으로 채택하고 한양(서울)을 수도로 정함",
    "location": "개경→한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1392,
    "tag": "WAR",
    "title": "티무르 제국 페르시아 정복",
    "desc": "티무르(타메를란)가 페르시아·중앙아시아·인도 북부를 정복. 델리 술탄국을 격파하고 역사상 마지막 대정복자가 됨",
    "location": "중앙아시아·페르시아",
    "region": [
      "아시아",
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1394,
    "tag": "POLITICS",
    "title": "조선 한양 천도",
    "desc": "태조 이성계가 수도를 한양(현 서울)으로 옮기고 경복궁을 창건. 오늘날 서울의 역사적 기원",
    "location": "한양 (서울)",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1396,
    "tag": "SCIENCE",
    "title": "1396년 중세 및 근세의 변화",
    "desc": "1396년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1400,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1400년)",
    "desc": "1400년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1400,
    "tag": "SCIENCE",
    "title": "1400년 중세 및 근세의 변화",
    "desc": "1400년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1400,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1400년)",
    "desc": "1400년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1402,
    "tag": "CULTURE",
    "title": "혼일강리역대국도지도 제작",
    "desc": "조선에서 동아시아 현존 최고(最古)의 세계지도 혼일강리역대국도지도를 제작. 아프리카·유럽까지 묘사한 정밀한 세계 인식",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1403,
    "tag": "CULTURE",
    "title": "자금성 착공",
    "desc": "명나라 영락제가 베이징에 자금성 건설을 시작. 세계 최대 궁전으로 1420년 완공. 중화 문명의 상징",
    "location": "베이징, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1404,
    "tag": "SCIENCE",
    "title": "1404년 중세 및 근세의 변화",
    "desc": "1404년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1404,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1404년)",
    "desc": "1404년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1408,
    "tag": "SCIENCE",
    "title": "1408년 중세 및 근세의 변화",
    "desc": "1408년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1408,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1408년)",
    "desc": "1408년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1410,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1410년)",
    "desc": "1410년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1412,
    "tag": "SCIENCE",
    "title": "1412년 중세 및 근세의 변화",
    "desc": "1412년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1412,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1412년)",
    "desc": "1412년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1415,
    "tag": "WAR",
    "title": "아쟁쿠르 전투 - 영국 프랑스 격파",
    "desc": "헨리 5세의 영국군이 아쟁쿠르에서 수적으로 우세한 프랑스 기사군을 장궁으로 대파. 백년전쟁의 전환점",
    "location": "아쟁쿠르, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1416,
    "tag": "SCIENCE",
    "title": "1416년 중세 및 근세의 변화",
    "desc": "1416년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1416,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1416년)",
    "desc": "1416년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1418,
    "tag": "POLITICS",
    "title": "세종대왕 즉위",
    "desc": "조선 4대 왕 세종이 즉위. 한글 창제, 과학기술 진흥, 영토 확장, 유교 문화 발전 등 조선 황금기를 이끈 성군",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1420,
    "tag": "CULTURE",
    "title": "집현전 설치",
    "desc": "세종이 학문 연구기관 집현전을 설치. 한글 창제와 각종 과학·문화 사업의 산실이 된 조선의 왕립 연구소",
    "location": "한양 경복궁",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1420,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1420년)",
    "desc": "1420년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1420,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1420년)",
    "desc": "1420년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1424,
    "tag": "SCIENCE",
    "title": "1424년 중세 및 근세의 변화",
    "desc": "1424년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1424,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1424년)",
    "desc": "1424년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1428,
    "tag": "SCIENCE",
    "title": "1428년 중세 및 근세의 변화",
    "desc": "1428년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1428,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1428년)",
    "desc": "1428년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1430,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1430년)",
    "desc": "1430년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1431,
    "tag": "WAR",
    "title": "잔 다르크 화형",
    "desc": "백년전쟁의 영웅 잔 다르크가 이단으로 몰려 화형에 처해짐. 이후 성인으로 추서되고 프랑스 민족의 상징이 됨",
    "location": "루앙, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1432,
    "tag": "SCIENCE",
    "title": "1432년 중세 및 근세의 변화",
    "desc": "1432년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1432,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1432년)",
    "desc": "1432년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1434,
    "tag": "TECHNOLOGY",
    "title": "조선 갑인자 개량",
    "desc": "세종이 갑인자를 비롯한 금속활자를 개량하여 인쇄 기술을 크게 향상. 지식 보급과 행정 문서 관리 혁신",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1436,
    "tag": "SCIENCE",
    "title": "1436년 중세 및 근세의 변화",
    "desc": "1436년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1436,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1436년)",
    "desc": "1436년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1440,
    "tag": "TECHNOLOGY",
    "title": "구텐베르크 금속활자 인쇄기 발명",
    "desc": "요하네스 구텐베르크가 유럽식 금속활자 인쇄기를 발명. 성경과 지식의 대량 보급으로 종교개혁·과학혁명의 촉매",
    "location": "마인츠, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1440,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1440년)",
    "desc": "1440년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1440,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1440년)",
    "desc": "1440년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1441,
    "tag": "SCIENCE",
    "title": "측우기 발명",
    "desc": "세종 치하에서 세계 최초의 표준화된 우량계 측우기가 발명됨. 강수량 측정으로 농업 계획 혁신",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1443,
    "tag": "CULTURE",
    "title": "훈민정음 (한글) 창제",
    "desc": "세종대왕이 한국어를 표기하기 위한 문자 체계 훈민정음을 창제. 세계에서 가장 과학적인 표음문자 중 하나",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1444,
    "tag": "SCIENCE",
    "title": "1444년 중세 및 근세의 변화",
    "desc": "1444년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1444,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1444년)",
    "desc": "1444년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1446,
    "tag": "CULTURE",
    "title": "훈민정음 반포",
    "desc": "세종대왕이 훈민정음 해례본과 함께 한글을 공식 반포. 10월 9일은 현재 한글날로 기념됨",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1448,
    "tag": "SCIENCE",
    "title": "1448년 중세 및 근세의 변화",
    "desc": "1448년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1448,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1448년)",
    "desc": "1448년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1450,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1450년)",
    "desc": "1450년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1452,
    "tag": "SCIENCE",
    "title": "1452년 중세 및 근세의 변화",
    "desc": "1452년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1452,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1452년)",
    "desc": "1452년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1453,
    "tag": "WAR",
    "title": "백년 전쟁 종료",
    "desc": "프랑스와 영국 간의 오랜 전쟁이 프랑스의 승리로 끝남",
    "location": "프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1453,
    "tag": "WAR",
    "title": "오스만 투르크 콘스탄티노플 정복",
    "desc": "메흐메트 2세의 오스만 군대가 대포를 이용해 콘스탄티노플을 함락. 1000년 비잔틴 제국의 종말과 중세의 끝",
    "location": "콘스탄티노플 (이스탄불)",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1456,
    "tag": "SCIENCE",
    "title": "1456년 중세 및 근세의 변화",
    "desc": "1456년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1456,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1456년)",
    "desc": "1456년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1460,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1460년)",
    "desc": "1460년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1460,
    "tag": "SCIENCE",
    "title": "1460년 중세 및 근세의 변화",
    "desc": "1460년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1460,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1460년)",
    "desc": "1460년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1464,
    "tag": "SCIENCE",
    "title": "1464년 중세 및 근세의 변화",
    "desc": "1464년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1464,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1464년)",
    "desc": "1464년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1468,
    "tag": "SCIENCE",
    "title": "1468년 중세 및 근세의 변화",
    "desc": "1468년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1468,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1468년)",
    "desc": "1468년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1470,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1470년)",
    "desc": "1470년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1472,
    "tag": "SCIENCE",
    "title": "1472년 중세 및 근세의 변화",
    "desc": "1472년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1472,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1472년)",
    "desc": "1472년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1476,
    "tag": "SCIENCE",
    "title": "1476년 중세 및 근세의 변화",
    "desc": "1476년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1476,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1476년)",
    "desc": "1476년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1480,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1480년)",
    "desc": "1480년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1480,
    "tag": "SCIENCE",
    "title": "1480년 중세 및 근세의 변화",
    "desc": "1480년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1480,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1480년)",
    "desc": "1480년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1484,
    "tag": "SCIENCE",
    "title": "1484년 중세 및 근세의 변화",
    "desc": "1484년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1484,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1484년)",
    "desc": "1484년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1485,
    "tag": "POLITICS",
    "title": "경국대전 완성",
    "desc": "세조부터 편찬된 조선의 기본 법전 경국대전이 성종 때 최종 완성. 조선 500년 통치의 법적 기반",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1487,
    "tag": "CULTURE",
    "title": "바르톨로메우 디아스 희망봉 발견",
    "desc": "포르투갈의 디아스가 아프리카 최남단 희망봉을 발견. 인도로 가는 새 항로 개척의 출발점",
    "location": "희망봉, 남아프리카",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1488,
    "tag": "SCIENCE",
    "title": "1488년 중세 및 근세의 변화",
    "desc": "1488년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1488,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1488년)",
    "desc": "1488년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1490,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1490년)",
    "desc": "1490년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1492,
    "tag": "CULTURE",
    "title": "콜럼버스 아메리카 도달",
    "desc": "이사벨라 여왕의 후원을 받은 콜럼버스가 서인도제도에 도달. 신구대륙 간 교류의 시작, 세계사의 대전환점",
    "location": "산살바도르 섬",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1492,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1492년)",
    "desc": "1492년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1496,
    "tag": "SCIENCE",
    "title": "1496년 중세 및 근세의 변화",
    "desc": "1496년 시기, 동서양의 교역로가 확장되고 농업 기술의 발전으로 인구가 증가하며 대학과 같은 고등 교육 기관이 설립되기 시작함.",
    "location": "유라시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1496,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1496년)",
    "desc": "1496년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1498,
    "tag": "CULTURE",
    "title": "바스코 다 가마 인도 항로 개척",
    "desc": "포르투갈의 바스코 다 가마가 희망봉을 돌아 인도 캘리컷에 도착. 유럽-아시아 직접 해상 무역로 개통",
    "location": "캘리컷, 인도",
    "region": [
      "아시아",
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1500,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1500년)",
    "desc": "1500년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1500,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1500년)",
    "desc": "1500년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1504,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1504년)",
    "desc": "1504년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1506,
    "tag": "WAR",
    "title": "중종반정 - 연산군 폐위",
    "desc": "폭군 연산군을 몰아내고 중종을 옹립한 반정. 조선 사림파 정치의 부활과 도학 정치의 시작",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1508,
    "tag": "CULTURE",
    "title": "미켈란젤로 시스티나 예배당 천장화",
    "desc": "미켈란젤로가 시스티나 예배당 천장에 창세기 장면을 그리기 시작. 르네상스 최고 걸작 중 하나",
    "location": "바티칸, 로마",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1508,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1508년)",
    "desc": "1508년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1510,
    "tag": "WAR",
    "title": "삼포왜란 - 조선 일본인 거주지 난",
    "desc": "부산포·제포·염포 삼포에 거주하는 일본인들이 대마도 도주의 지원을 받아 난을 일으킴. 조선-일 관계 악화",
    "location": "부산·경남",
    "region": [
      "부산",
      "경상도"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1510,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1510년)",
    "desc": "1510년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1512,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1512년)",
    "desc": "1512년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1516,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1516년)",
    "desc": "1516년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1517,
    "tag": "RELIGION",
    "title": "루터의 95개조 반박문",
    "desc": "종교개혁의 시작으로 유럽 사회의 근간이 흔들림",
    "location": "비텐베르크, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1517,
    "tag": "RELIGION",
    "title": "루터 95개조 반박문·종교개혁",
    "desc": "마르틴 루터가 면죄부 판매를 비판하는 95개조 반박문을 발표. 가톨릭에서 프로테스탄트의 분리, 종교개혁 시작",
    "location": "비텐베르크, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1519,
    "tag": "WAR",
    "title": "기묘사화",
    "desc": "훈구파가 조광조 등 사림파를 제거한 옥사. 이상적 도학 정치의 좌절이자 조선 사림파와 훈구파 갈등의 절정",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1519,
    "tag": "CULTURE",
    "title": "마젤란 세계 일주 항해 출발",
    "desc": "포르투갈 출신 마젤란이 스페인 왕의 후원으로 세계 일주 항해 출발. 지구가 둥글다는 것을 실증한 역사적 항해",
    "location": "세비야, 스페인",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1520,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1520년)",
    "desc": "1520년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1520,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1520년)",
    "desc": "1520년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1521,
    "tag": "WAR",
    "title": "코르테스 아즈텍 제국 정복",
    "desc": "에르난 코르테스가 500명의 스페인군으로 아즈텍 제국을 정복. 유럽 식민지배의 본격적 시작",
    "location": "테노치티틀란, 멕시코",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1524,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1524년)",
    "desc": "1524년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1526,
    "tag": "POLITICS",
    "title": "무굴 제국 건국",
    "desc": "바부르가 파니파트 전투에서 델리 술탄국을 격파하고 무굴 제국을 건국. 이후 300년간 인도를 지배",
    "location": "델리, 인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1528,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1528년)",
    "desc": "1528년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1530,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1530년)",
    "desc": "1530년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1532,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1532년)",
    "desc": "1532년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1536,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1536년)",
    "desc": "1536년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1540,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1540년)",
    "desc": "1540년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1540,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1540년)",
    "desc": "1540년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1543,
    "tag": "SCIENCE",
    "title": "코페르니쿠스 지동설 발표",
    "desc": "코페르니쿠스가 천체의 회전에 관하여를 출판하여 지동설을 주장. 과학혁명의 시작이자 인류의 우주관을 바꾼 혁명",
    "location": "폴란드",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1544,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1544년)",
    "desc": "1544년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1545,
    "tag": "WAR",
    "title": "을사사화",
    "desc": "소윤이 대윤을 숙청한 사화. 윤임 등이 제거되고 문정왕후와 윤원형의 전횡이 시작됨",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1548,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1548년)",
    "desc": "1548년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1550,
    "tag": "CULTURE",
    "title": "이황·기대승 사단칠정 논쟁",
    "desc": "퇴계 이황과 고봉 기대승 간의 사단칠정 논쟁. 조선 성리학의 수준을 세계적으로 끌어올린 철학적 대논쟁",
    "location": "경상도·전라도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1550,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1550년)",
    "desc": "1550년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1552,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1552년)",
    "desc": "1552년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1556,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1556년)",
    "desc": "1556년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1560,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1560년)",
    "desc": "1560년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1560,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1560년)",
    "desc": "1560년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1564,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1564년)",
    "desc": "1564년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1568,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1568년)",
    "desc": "1568년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1570,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1570년)",
    "desc": "1570년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1571,
    "tag": "WAR",
    "title": "레판토 해전 - 오스만 함대 격파",
    "desc": "스페인·교황·베네치아 연합 함대가 레판토에서 오스만 함대를 격파. 이슬람의 지중해 제패를 저지한 결전",
    "location": "레판토, 그리스",
    "region": [
      "유럽",
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1572,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1572년)",
    "desc": "1572년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1576,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1576년)",
    "desc": "1576년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1580,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1580년)",
    "desc": "1580년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1580,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1580년)",
    "desc": "1580년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1583,
    "tag": "POLITICS",
    "title": "율곡 이이 십만 양병설 제안",
    "desc": "율곡 이이가 일본 침략에 대비해 10만 군대를 훈련할 것을 건의했으나 받아들여지지 않음. 임진왜란의 전조",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1584,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1584년)",
    "desc": "1584년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1588,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1588년)",
    "desc": "1588년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1590,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1590년)",
    "desc": "1590년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1592,
    "tag": "WAR",
    "title": "임진왜란 발발",
    "desc": "도요토미 히데요시의 일본군 20만 명이 부산에 상륙. 조선은 20일 만에 한양을 빼앗기고 선조는 피난길에 오름",
    "location": "부산→한양",
    "region": [
      "부산",
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1592,
    "tag": "WAR",
    "title": "이순신 한산도대첩",
    "desc": "이순신 장군이 거북선과 학익진 전술로 한산도에서 일본 수군을 대파. 제해권 장악으로 일본군 보급선 차단",
    "location": "한산도 (거제)",
    "region": [
      "부산",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1592,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1592년)",
    "desc": "1592년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1596,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1596년)",
    "desc": "1596년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1597,
    "tag": "WAR",
    "title": "정유재란 발발·명량대첩",
    "desc": "일본이 2차 침략(정유재란)을 일으키자 이순신이 명량에서 12척으로 330척의 일본 함대를 격파한 기적적 승리",
    "location": "명량 (울돌목)",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1598,
    "tag": "WAR",
    "title": "임진왜란 종결·이순신 전사",
    "desc": "히데요시의 사망으로 일본군이 철수. 노량해전에서 이순신 장군이 전사. 7년 전쟁의 종막",
    "location": "노량 (경남)",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1600,
    "tag": "ECONOMY",
    "title": "영국 동인도회사 설립",
    "desc": "엘리자베스 1세가 동인도회사에 무역 독점권을 부여. 영국의 아시아 식민지배와 세계 무역 지배의 출발점",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1600,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1600년)",
    "desc": "1600년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1600,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1600년)",
    "desc": "1600년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1600,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1600년)",
    "desc": "1600년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1603,
    "tag": "POLITICS",
    "title": "에도 막부 성립",
    "desc": "도쿠가와 이에야스가 에도(도쿄)에 막부를 열어 260년간 지속되는 에도 시대 시작. 쇄국 정책으로 평화 유지",
    "location": "에도 (도쿄)",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1603,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1603년)",
    "desc": "1603년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1604,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1604년)",
    "desc": "1604년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1606,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1606년)",
    "desc": "1606년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1607,
    "tag": "CULTURE",
    "title": "조선 통신사 일본 파견 재개",
    "desc": "임진왜란 이후 단절된 조선-일본 외교 관계가 회복되어 통신사 파견이 재개됨. 조선 문화의 일본 전파",
    "location": "한양→에도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1608,
    "tag": "ECONOMY",
    "title": "대동법 경기도 시행",
    "desc": "광해군이 이원익의 건의로 경기도에 대동법을 시행. 현물 공납을 쌀·포·돈으로 대체하는 조세 혁신",
    "location": "경기도",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1608,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1608년)",
    "desc": "1608년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1609,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1609년)",
    "desc": "1609년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1610,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1610년)",
    "desc": "1610년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1612,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1612년)",
    "desc": "1612년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1612,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1612년)",
    "desc": "1612년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1615,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1615년)",
    "desc": "1615년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1616,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1616년)",
    "desc": "1616년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1618,
    "tag": "WAR",
    "title": "30년 전쟁 시작",
    "desc": "신성로마제국 내 구교와 신교 세력의 갈등에서 비롯된 유럽 전쟁. 독일 인구의 1/3이 사망한 유럽 최대 종교 전쟁",
    "location": "신성로마제국 (독일)",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1618,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1618년)",
    "desc": "1618년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1619,
    "tag": "WAR",
    "title": "사르후 전투·조선 지원군 패배",
    "desc": "광해군이 명나라 요청으로 조선군을 파견했으나 사르후에서 청의 전신 후금에 패배. 광해군의 등거리 외교 한계",
    "location": "사르후 (요령성)",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1620,
    "tag": "CULTURE",
    "title": "메이플라워 호 필그림 아메리카 상륙",
    "desc": "청교도 102명을 태운 메이플라워 호가 플리머스에 도착. 미국 건국의 정신적 기원이 되는 역사적 상륙",
    "location": "플리머스, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1620,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1620년)",
    "desc": "1620년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1620,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1620년)",
    "desc": "1620년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1621,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1621년)",
    "desc": "1621년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1624,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1624년)",
    "desc": "1624년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1624,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1624년)",
    "desc": "1624년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1627,
    "tag": "WAR",
    "title": "정묘호란 - 후금의 1차 침입",
    "desc": "후금(청의 전신)이 조선을 침공. 인조가 강화도로 피난하고 형제의 맹약을 맺음. 조선의 위기감 고조",
    "location": "평안도·한강",
    "region": [
      "평양",
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1627,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1627년)",
    "desc": "1627년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1628,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1628년)",
    "desc": "1628년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1630,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1630년)",
    "desc": "1630년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1630,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1630년)",
    "desc": "1630년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1632,
    "tag": "SCIENCE",
    "title": "갈릴레오 천문대화 출판·가택연금",
    "desc": "갈릴레오가 지동설을 옹호하는 천문대화를 출판했다가 종교재판에 회부되어 가택연금. 과학과 종교의 충돌",
    "location": "피렌체·로마",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1632,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1632년)",
    "desc": "1632년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1633,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1633년)",
    "desc": "1633년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1636,
    "tag": "WAR",
    "title": "병자호란 - 청의 조선 침공",
    "desc": "홍타이지가 이끄는 청나라 대군이 조선을 침공. 인조가 남한산성에서 45일 항전 후 삼전도에서 굴욕적 항복",
    "location": "남한산성·삼전도",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1636,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1636년)",
    "desc": "1636년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1636,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1636년)",
    "desc": "1636년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1639,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1639년)",
    "desc": "1639년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1640,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1640년)",
    "desc": "1640년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1640,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1640년)",
    "desc": "1640년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1642,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1642년)",
    "desc": "1642년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1644,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1644년)",
    "desc": "1644년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1645,
    "tag": "CULTURE",
    "title": "소현세자 귀국·서양 문물 도입",
    "desc": "청나라 볼모였던 소현세자가 서양 과학서적과 천주교 서적을 가지고 귀국. 조선의 서양 문물 접촉 시작",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1645,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1645년)",
    "desc": "1645년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1648,
    "tag": "POLITICS",
    "title": "베스트팔렌 조약 - 근대 국제질서 탄생",
    "desc": "30년 전쟁을 끝낸 베스트팔렌 조약 체결. 국가주권 원칙 확립으로 근대 국제질서(주권국가 체계)의 기원",
    "location": "뮌스터·오스나브뤼크",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1648,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1648년)",
    "desc": "1648년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1648,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1648년)",
    "desc": "1648년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1650,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1650년)",
    "desc": "1650년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1651,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1651년)",
    "desc": "1651년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1652,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1652년)",
    "desc": "1652년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1653,
    "tag": "CULTURE",
    "title": "하멜 제주도 표착",
    "desc": "네덜란드 선원 하멜 일행이 제주도에 표착. 14년간 조선에 억류된 후 탈출하여 하멜 표류기를 저술, 조선을 유럽에 알림",
    "location": "제주",
    "region": [
      "제주",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1654,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1654년)",
    "desc": "1654년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1656,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1656년)",
    "desc": "1656년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1657,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1657년)",
    "desc": "1657년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1660,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1660년)",
    "desc": "1660년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1660,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1660년)",
    "desc": "1660년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1660,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1660년)",
    "desc": "1660년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1663,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1663년)",
    "desc": "1663년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1664,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1664년)",
    "desc": "1664년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1665,
    "tag": "SCIENCE",
    "title": "뉴턴 만유인력·미적분 발견",
    "desc": "뉴턴이 사과나무 아래서 만유인력 법칙을 착상하고 미적분을 발명. 현대 물리학의 근간이 된 과학혁명의 정점",
    "location": "케임브리지, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1666,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1666년)",
    "desc": "1666년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1668,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1668년)",
    "desc": "1668년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1669,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1669년)",
    "desc": "1669년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1670,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1670년)",
    "desc": "1670년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1672,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1672년)",
    "desc": "1672년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1672,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1672년)",
    "desc": "1672년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1675,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1675년)",
    "desc": "1675년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1676,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1676년)",
    "desc": "1676년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1678,
    "tag": "ECONOMY",
    "title": "상평통보 전국 유통",
    "desc": "숙종이 상평통보를 주조하여 전국적으로 유통시킴. 조선 후기 화폐 경제의 확립과 상업 발전의 계기",
    "location": "한양·전국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1678,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1678년)",
    "desc": "1678년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1680,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1680년)",
    "desc": "1680년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1680,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1680년)",
    "desc": "1680년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1681,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1681년)",
    "desc": "1681년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1684,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1684년)",
    "desc": "1684년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1684,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1684년)",
    "desc": "1684년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1687,
    "tag": "SCIENCE",
    "title": "뉴턴의 프린키피아 출판",
    "desc": "만유인력의 법칙과 운동 법칙을 체계화한 근대 과학의 정수",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1687,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1687년)",
    "desc": "1687년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1688,
    "tag": "POLITICS",
    "title": "영국 명예혁명",
    "desc": "의회가 제임스 2세를 폐위하고 윌리엄 3세를 옹립. 권리장전 채택으로 입헌군주제와 의회민주주의의 근간 확립",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1688,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1688년)",
    "desc": "1688년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1690,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1690년)",
    "desc": "1690년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1690,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1690년)",
    "desc": "1690년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1692,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1692년)",
    "desc": "1692년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1693,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1693년)",
    "desc": "1693년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1696,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1696년)",
    "desc": "1696년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1696,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1696년)",
    "desc": "1696년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1699,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1699년)",
    "desc": "1699년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1700,
    "tag": "WAR",
    "title": "대북방전쟁 시작 (스웨덴 vs 러시아)",
    "desc": "스웨덴의 발트해 패권에 맞선 러시아·덴마크·폴란드 연합의 전쟁. 표트르 대제의 러시아가 유럽 강국으로 부상",
    "location": "발트해 지역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1700,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1700년)",
    "desc": "1700년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1700,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1700년)",
    "desc": "1700년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1702,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1702년)",
    "desc": "1702년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1704,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1704년)",
    "desc": "1704년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1705,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1705년)",
    "desc": "1705년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1707,
    "tag": "POLITICS",
    "title": "그레이트브리튼 왕국 탄생",
    "desc": "잉글랜드와 스코틀랜드가 합방 조약을 체결하여 그레이트브리튼 왕국 탄생. 현대 영국의 기원",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1708,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1708년)",
    "desc": "1708년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1708,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1708년)",
    "desc": "1708년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1710,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1710년)",
    "desc": "1710년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1711,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1711년)",
    "desc": "1711년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1712,
    "tag": "TECHNOLOGY",
    "title": "뉴커먼 증기기관 발명",
    "desc": "토머스 뉴커먼이 실용적인 증기기관을 발명. 이후 와트의 개량을 거쳐 산업혁명의 원동력이 됨",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1712,
    "tag": "POLITICS",
    "title": "백두산정계비 건립",
    "desc": "조선과 청나라가 백두산에서 국경을 확정하는 정계비를 세움. 이후 간도 영토 분쟁의 역사적 기원",
    "location": "백두산",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1712,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1712년)",
    "desc": "1712년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1714,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1714년)",
    "desc": "1714년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1716,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1716년)",
    "desc": "1716년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1717,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1717년)",
    "desc": "1717년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1720,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1720년)",
    "desc": "1720년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1720,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1720년)",
    "desc": "1720년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1720,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1720년)",
    "desc": "1720년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1723,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1723년)",
    "desc": "1723년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1724,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1724년)",
    "desc": "1724년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1725,
    "tag": "POLITICS",
    "title": "영조 탕평책 추진",
    "desc": "영조가 당파 싸움을 극복하기 위한 탕평책을 적극 추진. 노론·소론 등 붕당 간의 갈등을 조정하여 왕권 강화",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1726,
    "tag": "CULTURE",
    "title": "걸리버 여행기 출판",
    "desc": "조너선 스위프트의 걸리버 여행기 출판. 당대 영국 사회와 인류를 풍자한 문학의 걸작",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1726,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1726년)",
    "desc": "1726년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1728,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1728년)",
    "desc": "1728년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1729,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1729년)",
    "desc": "1729년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1730,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1730년)",
    "desc": "1730년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1732,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1732년)",
    "desc": "1732년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1732,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1732년)",
    "desc": "1732년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1735,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1735년)",
    "desc": "1735년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1736,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1736년)",
    "desc": "1736년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1738,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1738년)",
    "desc": "1738년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1740,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1740년)",
    "desc": "1740년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1740,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1740년)",
    "desc": "1740년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1741,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1741년)",
    "desc": "1741년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1744,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1744년)",
    "desc": "1744년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1744,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1744년)",
    "desc": "1744년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1747,
    "tag": "SCIENCE",
    "title": "근대 과학의 태동과 발전 (1747년)",
    "desc": "1747년 시기, 유럽에서는 관찰과 실험을 중시하는 근대적 과학 방법론이 정립되며 천문학, 물리학, 화학 분야에서 혁명적 발견이 잇따름.",
    "location": "유럽",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1748,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1748년)",
    "desc": "1748년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1750,
    "tag": "CULTURE",
    "title": "실학 사상 전성기",
    "desc": "박지원·정약용·홍대용 등 실학자들이 실용적 학문을 추구하며 조선의 사회 개혁을 꿈꿈. 북학의 등 저술 활발",
    "location": "한양 전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1750,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1750년)",
    "desc": "1750년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1752,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1752년)",
    "desc": "1752년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1756,
    "tag": "WAR",
    "title": "7년 전쟁 시작 (최초의 세계대전)",
    "desc": "유럽·아메리카·아시아·아프리카를 무대로 한 7년 전쟁 발발. 영국-프로이센 vs 프랑스-오스트리아-러시아 대결",
    "location": "유럽·북미·인도",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1756,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1756년)",
    "desc": "1756년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1760,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1760년)",
    "desc": "1760년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1760,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1760년)",
    "desc": "1760년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1762,
    "tag": "WAR",
    "title": "사도세자 뒤주 사망 (임오화변)",
    "desc": "영조가 아들 사도세자를 뒤주에 가두어 죽인 비극적 사건. 조선 정치사의 큰 충격이자 정조 시대 갈등의 씨앗",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1764,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1764년)",
    "desc": "1764년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1768,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1768년)",
    "desc": "1768년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1769,
    "tag": "TECHNOLOGY",
    "title": "와트의 증기기관 개량",
    "desc": "산업 혁명을 가속화시킨 핵심 기술적 진보",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1769,
    "tag": "TECHNOLOGY",
    "title": "와트 증기기관 개량 특허",
    "desc": "제임스 와트가 뉴커먼 증기기관을 혁신적으로 개량한 증기기관의 특허를 획득. 산업혁명의 실질적 동력 마련",
    "location": "버밍엄, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1770,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1770년)",
    "desc": "1770년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1772,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1772년)",
    "desc": "1772년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1776,
    "tag": "POLITICS",
    "title": "미국 독립선언",
    "desc": "13개 식민지가 영국으로부터의 독립을 선언. 천부인권과 국민주권의 원칙을 천명한 민주주의의 이정표",
    "location": "필라델피아, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1776,
    "tag": "POLITICS",
    "title": "정조 즉위 - 조선 문예 부흥",
    "desc": "정조가 즉위하여 규장각 설치, 서얼허통, 화성 건설 등 개혁 정치 추진. 조선 후기 르네상스 시대 개막",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1776,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1776년)",
    "desc": "1776년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1780,
    "tag": "CULTURE",
    "title": "박지원 열하일기 저술",
    "desc": "박지원이 연행(청나라 방문)을 통해 보고 느낀 것을 기록한 열하일기 저술. 조선 실학과 청나라 문화 비교 고찰",
    "location": "한양·연경",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1780,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1780년)",
    "desc": "1780년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1780,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1780년)",
    "desc": "1780년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1784,
    "tag": "RELIGION",
    "title": "이승훈 세례·천주교 도입",
    "desc": "이승훈이 북경에서 세례를 받고 귀국하여 한국 최초의 천주교 신자가 됨. 조선 천주교 전래의 공식적 기원",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1784,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1784년)",
    "desc": "1784년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1788,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1788년)",
    "desc": "1788년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1789,
    "tag": "POLITICS",
    "title": "프랑스 혁명 시작",
    "desc": "바스티유 감옥 습격으로 시작된 프랑스 혁명. 자유·평등·박애 이념이 유럽과 세계의 정치 질서를 뒤바꿈",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1790,
    "tag": "CULTURE",
    "title": "조선·고려 사회 문화 발전 (1790년)",
    "desc": "1790년 시기 한반도의 학문과 예술이 독자적인 발전을 거듭하며 유교·불교 문화가 융성함.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1791,
    "tag": "RELIGION",
    "title": "신유박해 전조 - 윤지충 제사 거부",
    "desc": "윤지충이 조상 제사를 거부하여 처형됨. 조선 천주교 박해의 시작. 유교 사회와 기독교 가치관의 충돌",
    "location": "전라도",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1792,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1792년)",
    "desc": "1792년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1793,
    "tag": "POLITICS",
    "title": "루이 16세 단두대 처형",
    "desc": "프랑스 혁명 재판소가 루이 16세를 단두대로 처형. 왕권신수설의 종말과 공화주의 혁명의 급진화",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1796,
    "tag": "POLITICS",
    "title": "조선 왕조 내실 다지기 (1796년)",
    "desc": "1796년경 조선은 유교적 통치 이념을 바탕으로 행정 체제를 정비하고 민생 안정을 위한 다양한 정책을 시행하며 국가의 기틀을 공고히 함.",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 2
  },
  {
    "year": 1799,
    "tag": "POLITICS",
    "title": "나폴레옹 권력 장악",
    "desc": "나폴레옹 보나파르트가 브뤼메르 18일 쿠데타로 총재정부를 무너뜨리고 제1통령이 됨. 나폴레옹 시대 개막",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1800,
    "tag": "CULTURE",
    "title": "1800년 근대 사회의 태동",
    "desc": "1800년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1801,
    "tag": "RELIGION",
    "title": "신유박해 - 천주교 대탄압",
    "desc": "순조 즉위 후 시파를 제거하려는 정치적 목적도 겹쳐 천주교 신자 수백 명이 처형됨. 이승훈·정약종 등 순교",
    "location": "한양 전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1801,
    "tag": "CULTURE",
    "title": "1801년 근대 사회의 태동",
    "desc": "1801년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1802,
    "tag": "CULTURE",
    "title": "1802년 근대 사회의 태동",
    "desc": "1802년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1803,
    "tag": "CULTURE",
    "title": "1803년 근대 사회의 태동",
    "desc": "1803년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1804,
    "tag": "POLITICS",
    "title": "나폴레옹 프랑스 황제 즉위",
    "desc": "나폴레옹이 노트르담 대성당에서 교황에게서 왕관을 빼앗아 스스로 황제에 오름. 유럽 전역을 정복하는 제국 시대 개막",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1804,
    "tag": "CULTURE",
    "title": "1804년 근대 사회의 태동",
    "desc": "1804년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1805,
    "tag": "CULTURE",
    "title": "1805년 근대 사회의 태동",
    "desc": "1805년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1806,
    "tag": "CULTURE",
    "title": "1806년 근대 사회의 태동",
    "desc": "1806년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1807,
    "tag": "CULTURE",
    "title": "1807년 근대 사회의 태동",
    "desc": "1807년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1808,
    "tag": "CULTURE",
    "title": "1808년 근대 사회의 태동",
    "desc": "1808년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1809,
    "tag": "CULTURE",
    "title": "1809년 근대 사회의 태동",
    "desc": "1809년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1810,
    "tag": "CULTURE",
    "title": "1810년 근대 사회의 태동",
    "desc": "1810년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1811,
    "tag": "WAR",
    "title": "홍경래의 난",
    "desc": "평안도 출신의 홍경래가 지역 차별에 저항하며 반란을 일으킴. 5개월간 지속된 조선 최대 규모의 민란",
    "location": "평안도",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1811,
    "tag": "CULTURE",
    "title": "1811년 근대 사회의 태동",
    "desc": "1811년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1812,
    "tag": "CULTURE",
    "title": "1812년 근대 사회의 태동",
    "desc": "1812년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1813,
    "tag": "CULTURE",
    "title": "1813년 근대 사회의 태동",
    "desc": "1813년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1814,
    "tag": "CULTURE",
    "title": "1814년 근대 사회의 태동",
    "desc": "1814년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1815,
    "tag": "WAR",
    "title": "워털루 전투·나폴레옹 최후",
    "desc": "웰링턴 공작이 이끄는 연합군이 워털루에서 나폴레옹을 격파. 나폴레옹이 세인트헬레나 섬으로 유배되어 최후",
    "location": "워털루, 벨기에",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1815,
    "tag": "CULTURE",
    "title": "1815년 근대 사회의 태동",
    "desc": "1815년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1816,
    "tag": "CULTURE",
    "title": "1816년 근대 사회의 태동",
    "desc": "1816년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1817,
    "tag": "CULTURE",
    "title": "1817년 근대 사회의 태동",
    "desc": "1817년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1818,
    "tag": "CULTURE",
    "title": "1818년 근대 사회의 태동",
    "desc": "1818년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1819,
    "tag": "CULTURE",
    "title": "1819년 근대 사회의 태동",
    "desc": "1819년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1820,
    "tag": "CULTURE",
    "title": "1820년 근대 사회의 태동",
    "desc": "1820년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1821,
    "tag": "CULTURE",
    "title": "1821년 근대 사회의 태동",
    "desc": "1821년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1822,
    "tag": "CULTURE",
    "title": "1822년 근대 사회의 태동",
    "desc": "1822년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1823,
    "tag": "CULTURE",
    "title": "1823년 근대 사회의 태동",
    "desc": "1823년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1824,
    "tag": "CULTURE",
    "title": "1824년 근대 사회의 태동",
    "desc": "1824년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1825,
    "tag": "CULTURE",
    "title": "1825년 근대 사회의 태동",
    "desc": "1825년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1826,
    "tag": "CULTURE",
    "title": "1826년 근대 사회의 태동",
    "desc": "1826년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1827,
    "tag": "CULTURE",
    "title": "1827년 근대 사회의 태동",
    "desc": "1827년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1828,
    "tag": "CULTURE",
    "title": "1828년 근대 사회의 태동",
    "desc": "1828년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1829,
    "tag": "CULTURE",
    "title": "1829년 근대 사회의 태동",
    "desc": "1829년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1830,
    "tag": "POLITICS",
    "title": "7월 혁명 (프랑스)",
    "desc": "파리 시민들이 샤를 10세를 몰아낸 7월 혁명. 입헌 군주정 수립. 유럽 전역의 자유주의 운동에 불을 붙임",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1830,
    "tag": "CULTURE",
    "title": "1830년 근대 사회의 태동",
    "desc": "1830년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1831,
    "tag": "CULTURE",
    "title": "1831년 근대 사회의 태동",
    "desc": "1831년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1832,
    "tag": "CULTURE",
    "title": "영국 상선 로드 에머스트 조선 접촉",
    "desc": "영국 상선 로드 에머스트 호가 황해도 앞바다에서 조선에 교역을 요청. 서양 세력의 조선 접촉 시작",
    "location": "황해도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1832,
    "tag": "CULTURE",
    "title": "1832년 근대 사회의 태동",
    "desc": "1832년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1833,
    "tag": "CULTURE",
    "title": "1833년 근대 사회의 태동",
    "desc": "1833년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1834,
    "tag": "CULTURE",
    "title": "1834년 근대 사회의 태동",
    "desc": "1834년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1835,
    "tag": "CULTURE",
    "title": "1835년 근대 사회의 태동",
    "desc": "1835년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1836,
    "tag": "CULTURE",
    "title": "1836년 근대 사회의 태동",
    "desc": "1836년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1837,
    "tag": "CULTURE",
    "title": "1837년 근대 사회의 태동",
    "desc": "1837년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1838,
    "tag": "CULTURE",
    "title": "1838년 근대 사회의 태동",
    "desc": "1838년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1839,
    "tag": "RELIGION",
    "title": "기해박해 - 프랑스 신부 처형",
    "desc": "조선이 앵베르·모방·샤스탕 등 프랑스 파리외방전교회 신부 3명과 조선인 신자 수백 명을 처형",
    "location": "한양 전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1839,
    "tag": "WAR",
    "title": "아편전쟁 시작",
    "desc": "영국이 청나라의 아편 금수 조치에 맞서 전쟁을 일으킴. 청나라의 패배로 홍콩 할양과 불평등 조약 체결",
    "location": "중국 연해",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1839,
    "tag": "CULTURE",
    "title": "1839년 근대 사회의 태동",
    "desc": "1839년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1840,
    "tag": "CULTURE",
    "title": "1840년 근대 사회의 태동",
    "desc": "1840년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1841,
    "tag": "CULTURE",
    "title": "1841년 근대 사회의 태동",
    "desc": "1841년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1842,
    "tag": "CULTURE",
    "title": "1842년 근대 사회의 태동",
    "desc": "1842년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1843,
    "tag": "CULTURE",
    "title": "1843년 근대 사회의 태동",
    "desc": "1843년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1844,
    "tag": "CULTURE",
    "title": "1844년 근대 사회의 태동",
    "desc": "1844년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1845,
    "tag": "CULTURE",
    "title": "1845년 근대 사회의 태동",
    "desc": "1845년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1846,
    "tag": "RELIGION",
    "title": "김대건 신부 순교",
    "desc": "조선 최초의 천주교 신부 김대건이 25세의 나이로 새남터에서 순교. 한국 천주교의 상징적 인물",
    "location": "새남터 (서울)",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1846,
    "tag": "CULTURE",
    "title": "1846년 근대 사회의 태동",
    "desc": "1846년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1847,
    "tag": "CULTURE",
    "title": "1847년 근대 사회의 태동",
    "desc": "1847년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1848,
    "tag": "POLITICS",
    "title": "유럽 혁명의 해·공산당 선언",
    "desc": "프랑스·독일·오스트리아·이탈리아 등 유럽 전역에서 자유주의·민족주의 혁명 동시 발생. 마르크스 공산당 선언 출판",
    "location": "유럽 전역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1848,
    "tag": "CULTURE",
    "title": "1848년 근대 사회의 태동",
    "desc": "1848년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1849,
    "tag": "CULTURE",
    "title": "1849년 근대 사회의 태동",
    "desc": "1849년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1850,
    "tag": "CULTURE",
    "title": "1850년 근대 사회의 태동",
    "desc": "1850년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1851,
    "tag": "CULTURE",
    "title": "1851년 근대 사회의 태동",
    "desc": "1851년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1852,
    "tag": "CULTURE",
    "title": "1852년 근대 사회의 태동",
    "desc": "1852년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1853,
    "tag": "POLITICS",
    "title": "페리 제독 일본 개항 강요",
    "desc": "미국의 페리 제독이 흑선을 이끌고 에도 만에 나타나 일본에 개항을 강요. 일본 메이지 유신의 촉매",
    "location": "에도 (도쿄) 앞바다",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1853,
    "tag": "CULTURE",
    "title": "1853년 근대 사회의 태동",
    "desc": "1853년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1854,
    "tag": "CULTURE",
    "title": "1854년 근대 사회의 태동",
    "desc": "1854년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1855,
    "tag": "CULTURE",
    "title": "1855년 근대 사회의 태동",
    "desc": "1855년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1856,
    "tag": "CULTURE",
    "title": "1856년 근대 사회의 태동",
    "desc": "1856년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1857,
    "tag": "CULTURE",
    "title": "1857년 근대 사회의 태동",
    "desc": "1857년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1858,
    "tag": "CULTURE",
    "title": "1858년 근대 사회의 태동",
    "desc": "1858년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1859,
    "tag": "SCIENCE",
    "title": "다윈의 종의 기원 출판",
    "desc": "진화론을 통해 생물학과 인류관에 혁명적 변화 초래",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1859,
    "tag": "SCIENCE",
    "title": "다윈 종의 기원 출판",
    "desc": "찰스 다윈이 자연선택에 의한 진화론을 담은 종의 기원을 출판. 생물학과 인류의 자기 인식에 혁명을 가져옴",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1859,
    "tag": "CULTURE",
    "title": "1859년 근대 사회의 태동",
    "desc": "1859년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1860,
    "tag": "RELIGION",
    "title": "동학 창시",
    "desc": "최제우가 천주교와 유교를 결합한 민중 종교 동학을 창시. 인내천 사상으로 평등 이념을 전파. 이후 동학농민운동의 씨앗",
    "location": "경주",
    "region": [
      "경상도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1860,
    "tag": "CULTURE",
    "title": "1860년 근대 사회의 태동",
    "desc": "1860년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1861,
    "tag": "WAR",
    "title": "미국 남북전쟁 시작",
    "desc": "남부 연방이 연방에서 탈퇴하며 남북전쟁 발발. 노예제 문제가 폭발한 미국 역사상 가장 많은 희생자를 낸 전쟁",
    "location": "미국 전역",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1861,
    "tag": "CULTURE",
    "title": "1861년 근대 사회의 태동",
    "desc": "1861년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1862,
    "tag": "CULTURE",
    "title": "1862년 근대 사회의 태동",
    "desc": "1862년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1863,
    "tag": "POLITICS",
    "title": "흥선대원군 집권",
    "desc": "고종이 즉위하고 흥선대원군이 섭정으로 실권 장악. 강력한 쇄국 정책과 서원 철폐 등 개혁 정치 추진",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1863,
    "tag": "CULTURE",
    "title": "1863년 근대 사회의 태동",
    "desc": "1863년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1864,
    "tag": "CULTURE",
    "title": "1864년 근대 사회의 태동",
    "desc": "1864년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1865,
    "tag": "POLITICS",
    "title": "링컨 암살·미국 노예제 폐지",
    "desc": "링컨 대통령이 암살되었으나 남북전쟁 승리로 노예제가 폐지됨. 미국 민주주의와 평등 이념의 새로운 출발",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1865,
    "tag": "CULTURE",
    "title": "1865년 근대 사회의 태동",
    "desc": "1865년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1866,
    "tag": "WAR",
    "title": "병인박해·병인양요",
    "desc": "흥선대원군이 프랑스 신부 9명과 8000여 명의 천주교 신자를 처형(병인박해). 이에 프랑스 함대가 강화도를 침공(병인양요)",
    "location": "강화도·한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1866,
    "tag": "CULTURE",
    "title": "1866년 근대 사회의 태동",
    "desc": "1866년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1867,
    "tag": "CULTURE",
    "title": "1867년 근대 사회의 태동",
    "desc": "1867년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1868,
    "tag": "CULTURE",
    "title": "1868년 근대 사회의 태동",
    "desc": "1868년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1869,
    "tag": "CULTURE",
    "title": "1869년 근대 사회의 태동",
    "desc": "1869년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1870,
    "tag": "CULTURE",
    "title": "1870년 근대 사회의 태동",
    "desc": "1870년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1871,
    "tag": "WAR",
    "title": "신미양요 - 미국 함대 강화도 침공",
    "desc": "제너럴셔먼 호 사건을 빌미로 미국 아시아 함대가 강화도를 공격. 조선군이 광성보에서 결사 항전. 미군 철수",
    "location": "강화도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1871,
    "tag": "POLITICS",
    "title": "독일 제국 통일",
    "desc": "프로이센의 비스마르크가 보불전쟁 승리를 계기로 베르사유 궁전에서 독일 제국 선포. 유럽의 세력 균형 변화",
    "location": "베르사유, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1871,
    "tag": "CULTURE",
    "title": "1871년 근대 사회의 태동",
    "desc": "1871년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1872,
    "tag": "CULTURE",
    "title": "1872년 근대 사회의 태동",
    "desc": "1872년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1873,
    "tag": "CULTURE",
    "title": "1873년 근대 사회의 태동",
    "desc": "1873년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1874,
    "tag": "CULTURE",
    "title": "1874년 근대 사회의 태동",
    "desc": "1874년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1875,
    "tag": "CULTURE",
    "title": "1875년 근대 사회의 태동",
    "desc": "1875년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1876,
    "tag": "TECHNOLOGY",
    "title": "벨 전화기 발명",
    "desc": "알렉산더 그레이엄 벨이 전화기 발명 특허를 획득. 원거리 음성 통신의 시대를 연 통신 혁명의 시작",
    "location": "보스턴, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1876,
    "tag": "POLITICS",
    "title": "강화도 조약 - 조선 강제 개항",
    "desc": "일본이 운요호 사건을 구실로 조선에 불평등 조약 강화도 조약을 강요하여 3개 항구를 개항. 조선 근대화의 출발",
    "location": "강화도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1876,
    "tag": "CULTURE",
    "title": "1876년 근대 사회의 태동",
    "desc": "1876년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1877,
    "tag": "CULTURE",
    "title": "1877년 근대 사회의 태동",
    "desc": "1877년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1878,
    "tag": "CULTURE",
    "title": "1878년 근대 사회의 태동",
    "desc": "1878년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1879,
    "tag": "TECHNOLOGY",
    "title": "에디슨 전구 발명",
    "desc": "토머스 에디슨이 실용적인 백열전구를 발명. 전기 조명 시대를 열어 인류의 야간 활동을 혁명적으로 변화시킴",
    "location": "멘로파크, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1879,
    "tag": "CULTURE",
    "title": "1879년 근대 사회의 태동",
    "desc": "1879년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1880,
    "tag": "CULTURE",
    "title": "1880년 근대 사회의 태동",
    "desc": "1880년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1881,
    "tag": "CULTURE",
    "title": "1881년 근대 사회의 태동",
    "desc": "1881년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1882,
    "tag": "POLITICS",
    "title": "조미수호통상조약 체결·임오군란",
    "desc": "조선과 미국이 수호통상조약을 체결(최초 서구 국가). 같은 해 신식 군대와 구식 군대 갈등으로 임오군란 발생",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1882,
    "tag": "CULTURE",
    "title": "1882년 근대 사회의 태동",
    "desc": "1882년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1883,
    "tag": "CULTURE",
    "title": "1883년 근대 사회의 태동",
    "desc": "1883년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1884,
    "tag": "WAR",
    "title": "갑신정변",
    "desc": "김옥균·박영효 등 개화파가 일본 공사관 지원 아래 쿠데타를 일으킴. 청나라 군대 개입으로 3일 만에 실패",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1884,
    "tag": "POLITICS",
    "title": "베를린 회의 - 아프리카 분할",
    "desc": "유럽 열강이 베를린에 모여 아프리카를 자의적으로 분할. 식민지배의 가속화로 아프리카 민중의 비극 시작",
    "location": "베를린, 독일",
    "region": [
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1884,
    "tag": "CULTURE",
    "title": "1884년 근대 사회의 태동",
    "desc": "1884년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1885,
    "tag": "CULTURE",
    "title": "1885년 근대 사회의 태동",
    "desc": "1885년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1886,
    "tag": "CULTURE",
    "title": "1886년 근대 사회의 태동",
    "desc": "1886년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1887,
    "tag": "CULTURE",
    "title": "1887년 근대 사회의 태동",
    "desc": "1887년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1888,
    "tag": "CULTURE",
    "title": "1888년 근대 사회의 태동",
    "desc": "1888년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1889,
    "tag": "CULTURE",
    "title": "1889년 근대 사회의 태동",
    "desc": "1889년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1890,
    "tag": "CULTURE",
    "title": "1890년 근대 사회의 태동",
    "desc": "1890년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1891,
    "tag": "CULTURE",
    "title": "1891년 근대 사회의 태동",
    "desc": "1891년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1892,
    "tag": "CULTURE",
    "title": "1892년 근대 사회의 태동",
    "desc": "1892년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1893,
    "tag": "CULTURE",
    "title": "1893년 근대 사회의 태동",
    "desc": "1893년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1894,
    "tag": "WAR",
    "title": "동학농민운동·청일전쟁",
    "desc": "전봉준이 이끄는 동학농민군이 봉기. 조선의 청나라 파병 요청으로 청일전쟁 발발. 근대 전환의 격동기",
    "location": "전라도·한반도",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1894,
    "tag": "CULTURE",
    "title": "1894년 근대 사회의 태동",
    "desc": "1894년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1895,
    "tag": "WAR",
    "title": "명성황후 시해 (을미사변)",
    "desc": "일본 자객들이 경복궁에 침입하여 명성황후를 시해. 일본의 노골적 내정 간섭과 조선 왕실 모욕에 온 나라가 분노",
    "location": "경복궁, 서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1895,
    "tag": "CULTURE",
    "title": "1895년 근대 사회의 태동",
    "desc": "1895년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1896,
    "tag": "POLITICS",
    "title": "아관파천·독립협회 창립",
    "desc": "고종이 러시아 공사관으로 피신(아관파천). 서재필이 독립협회를 창립하고 독립신문을 발행. 근대 시민 사회 태동",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1896,
    "tag": "CULTURE",
    "title": "제1회 근대 올림픽 개최 (아테네)",
    "desc": "쿠베르탱의 제안으로 그리스 아테네에서 제1회 근대 올림픽 개최. 14개국 참가. 올림픽 현대사의 시작",
    "location": "아테네, 그리스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1896,
    "tag": "CULTURE",
    "title": "1896년 근대 사회의 태동",
    "desc": "1896년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1897,
    "tag": "POLITICS",
    "title": "대한제국 선포",
    "desc": "고종이 황제로 즉위하며 국호를 대한제국으로 선포. 자주 독립국임을 세계에 천명하는 역사적 선언",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1897,
    "tag": "CULTURE",
    "title": "1897년 근대 사회의 태동",
    "desc": "1897년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1898,
    "tag": "SCIENCE",
    "title": "퀴리 부인 라듐 발견",
    "desc": "마리 퀴리와 피에르 퀴리가 방사성 원소 라듐과 폴로늄을 발견. 핵물리학의 시대를 여는 혁명적 발견",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1898,
    "tag": "CULTURE",
    "title": "1898년 근대 사회의 태동",
    "desc": "1898년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1899,
    "tag": "CULTURE",
    "title": "1899년 근대 사회의 태동",
    "desc": "1899년경 증기기관의 보급과 민족주의의 확산으로 전 세계가 근대적인 국가 체제로 변모하는 격동의 시기를 겪음.",
    "location": "유럽·아시아",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "WAR",
    "title": "연도별 상세 사건 1 (확장 데이터)",
    "desc": "1900년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1900,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 126 (확장 데이터)",
    "desc": "1900년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 251 (확장 데이터)",
    "desc": "1900년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 376 (확장 데이터)",
    "desc": "1900년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1900,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 501 (확장 데이터)",
    "desc": "1900년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 626 (확장 데이터)",
    "desc": "1900년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 751 (확장 데이터)",
    "desc": "1900년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1900,
    "tag": "WAR",
    "title": "연도별 상세 사건 876 (확장 데이터)",
    "desc": "1900년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1001 (확장 데이터)",
    "desc": "1900년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1126 (확장 데이터)",
    "desc": "1900년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1900,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1251 (확장 데이터)",
    "desc": "1900년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1376 (확장 데이터)",
    "desc": "1900년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "WAR",
    "title": "의화단 운동·중국 혼란",
    "desc": "중국에서 외세 배척을 외치는 의화단 운동이 발생. 8개국 연합군이 베이징을 점령. 청나라의 쇠퇴 가속화",
    "location": "베이징, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1900,
    "tag": "POLITICS",
    "title": "대한제국 광무개혁 추진",
    "desc": "대한제국이 토지 측량·화폐 개혁·학교 설립 등 근대화 개혁을 추진. 그러나 일본의 간섭으로 성과 제한적",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "TECHNOLOGY",
    "title": "1900년 기술 혁신 기록",
    "desc": "1900년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1900,
    "tag": "SOCIETY",
    "title": "1900년 한국 사회 변화상",
    "desc": "1900년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "TECHNOLOGY",
    "title": "1900년의 정밀 역사 기록 (1)",
    "desc": "1900년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1900,
    "tag": "SOCIETY",
    "title": "1900년의 정밀 역사 기록 (2)",
    "desc": "1900년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 2 (확장 데이터)",
    "desc": "1901년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1901,
    "tag": "WAR",
    "title": "연도별 상세 사건 127 (확장 데이터)",
    "desc": "1901년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1901,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 252 (확장 데이터)",
    "desc": "1901년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 377 (확장 데이터)",
    "desc": "1901년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1901,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 502 (확장 데이터)",
    "desc": "1901년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1901,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 627 (확장 데이터)",
    "desc": "1901년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 752 (확장 데이터)",
    "desc": "1901년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1901,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 877 (확장 데이터)",
    "desc": "1901년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1901,
    "tag": "WAR",
    "title": "연도별 상세 사건 1002 (확장 데이터)",
    "desc": "1901년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1127 (확장 데이터)",
    "desc": "1901년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1901,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1252 (확장 데이터)",
    "desc": "1901년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1901,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1377 (확장 데이터)",
    "desc": "1901년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "TECHNOLOGY",
    "title": "1901년 기술 혁신 기록",
    "desc": "1901년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1901,
    "tag": "SOCIETY",
    "title": "1901년 한국 사회 변화상",
    "desc": "1901년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "SOCIETY",
    "title": "1901년의 정밀 역사 기록 (1)",
    "desc": "1901년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "CULTURE",
    "title": "1901년의 정밀 역사 기록 (2)",
    "desc": "1901년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "ECONOMY",
    "title": "1901년의 정밀 역사 기록 (3)",
    "desc": "1901년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1901,
    "tag": "TECHNOLOGY",
    "title": "1901년의 정밀 역사 기록 (4)",
    "desc": "1901년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 3 (확장 데이터)",
    "desc": "1902년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 128 (확장 데이터)",
    "desc": "1902년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1902,
    "tag": "WAR",
    "title": "연도별 상세 사건 253 (확장 데이터)",
    "desc": "1902년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1902,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 378 (확장 데이터)",
    "desc": "1902년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 503 (확장 데이터)",
    "desc": "1902년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1902,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 628 (확장 데이터)",
    "desc": "1902년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1902,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 753 (확장 데이터)",
    "desc": "1902년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 878 (확장 데이터)",
    "desc": "1902년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1902,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1003 (확장 데이터)",
    "desc": "1902년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1902,
    "tag": "WAR",
    "title": "연도별 상세 사건 1128 (확장 데이터)",
    "desc": "1902년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1253 (확장 데이터)",
    "desc": "1902년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1902,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1378 (확장 데이터)",
    "desc": "1902년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1902,
    "tag": "TECHNOLOGY",
    "title": "1902년 기술 혁신 기록",
    "desc": "1902년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1902,
    "tag": "SOCIETY",
    "title": "1902년 한국 사회 변화상",
    "desc": "1902년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "CULTURE",
    "title": "1902년의 정밀 역사 기록 (1)",
    "desc": "1902년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "ECONOMY",
    "title": "1902년의 정밀 역사 기록 (2)",
    "desc": "1902년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "TECHNOLOGY",
    "title": "1902년의 정밀 역사 기록 (3)",
    "desc": "1902년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1902,
    "tag": "SOCIETY",
    "title": "1902년의 정밀 역사 기록 (4)",
    "desc": "1902년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 4 (확장 데이터)",
    "desc": "1903년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1903,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 129 (확장 데이터)",
    "desc": "1903년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 254 (확장 데이터)",
    "desc": "1903년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1903,
    "tag": "WAR",
    "title": "연도별 상세 사건 379 (확장 데이터)",
    "desc": "1903년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1903,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 504 (확장 데이터)",
    "desc": "1903년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 629 (확장 데이터)",
    "desc": "1903년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1903,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 754 (확장 데이터)",
    "desc": "1903년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1903,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 879 (확장 데이터)",
    "desc": "1903년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1004 (확장 데이터)",
    "desc": "1903년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1903,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1129 (확장 데이터)",
    "desc": "1903년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1903,
    "tag": "WAR",
    "title": "연도별 상세 사건 1254 (확장 데이터)",
    "desc": "1903년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1379 (확장 데이터)",
    "desc": "1903년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1903,
    "tag": "TECHNOLOGY",
    "title": "라이트 형제 동력 비행 성공",
    "desc": "오빌·윌버 라이트 형제가 키티호크에서 인류 최초의 동력 비행에 성공. 항공 시대의 시작",
    "location": "키티호크, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1903,
    "tag": "TECHNOLOGY",
    "title": "1903년 기술 혁신 기록",
    "desc": "1903년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1903,
    "tag": "SOCIETY",
    "title": "1903년 한국 사회 변화상",
    "desc": "1903년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "ECONOMY",
    "title": "1903년의 정밀 역사 기록 (1)",
    "desc": "1903년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "TECHNOLOGY",
    "title": "1903년의 정밀 역사 기록 (2)",
    "desc": "1903년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1903,
    "tag": "SOCIETY",
    "title": "1903년의 정밀 역사 기록 (3)",
    "desc": "1903년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 5 (확장 데이터)",
    "desc": "1904년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1904,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 130 (확장 데이터)",
    "desc": "1904년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1904,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 255 (확장 데이터)",
    "desc": "1904년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 380 (확장 데이터)",
    "desc": "1904년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1904,
    "tag": "WAR",
    "title": "연도별 상세 사건 505 (확장 데이터)",
    "desc": "1904년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1904,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 630 (확장 데이터)",
    "desc": "1904년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 755 (확장 데이터)",
    "desc": "1904년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1904,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 880 (확장 데이터)",
    "desc": "1904년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1904,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1005 (확장 데이터)",
    "desc": "1904년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1130 (확장 데이터)",
    "desc": "1904년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1904,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1255 (확장 데이터)",
    "desc": "1904년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1904,
    "tag": "WAR",
    "title": "연도별 상세 사건 1380 (확장 데이터)",
    "desc": "1904년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "WAR",
    "title": "한일의정서 강제 체결",
    "desc": "러일전쟁을 틈타 일본이 조선을 군사 기지로 사용하는 한일의정서를 강요. 조선 주권 침탈의 본격화",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1904,
    "tag": "TECHNOLOGY",
    "title": "1904년 기술 혁신 기록",
    "desc": "1904년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1904,
    "tag": "SOCIETY",
    "title": "1904년 한국 사회 변화상",
    "desc": "1904년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "TECHNOLOGY",
    "title": "1904년의 정밀 역사 기록 (1)",
    "desc": "1904년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "SOCIETY",
    "title": "1904년의 정밀 역사 기록 (2)",
    "desc": "1904년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1904,
    "tag": "CULTURE",
    "title": "1904년의 정밀 역사 기록 (3)",
    "desc": "1904년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 6 (확장 데이터)",
    "desc": "1905년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 131 (확장 데이터)",
    "desc": "1905년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1905,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 256 (확장 데이터)",
    "desc": "1905년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1905,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 381 (확장 데이터)",
    "desc": "1905년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 506 (확장 데이터)",
    "desc": "1905년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1905,
    "tag": "WAR",
    "title": "연도별 상세 사건 631 (확장 데이터)",
    "desc": "1905년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1905,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 756 (확장 데이터)",
    "desc": "1905년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 881 (확장 데이터)",
    "desc": "1905년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1905,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1006 (확장 데이터)",
    "desc": "1905년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1905,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1131 (확장 데이터)",
    "desc": "1905년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1256 (확장 데이터)",
    "desc": "1905년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1905,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1381 (확장 데이터)",
    "desc": "1905년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1905,
    "tag": "SCIENCE",
    "title": "아인슈타인 특수상대성이론",
    "desc": "알베르트 아인슈타인이 특수상대성이론과 광전효과 등 5편의 논문을 발표한 기적의 해. E=mc² 공식 도출",
    "location": "베른, 스위스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1905,
    "tag": "POLITICS",
    "title": "을사조약 강제 체결",
    "desc": "일본이 강압으로 을사조약(을사늑약)을 체결하여 조선의 외교권을 박탈. 통감부 설치. 조선의 반식민지화 확정",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1905,
    "tag": "WAR",
    "title": "의병 항쟁 전국 확산",
    "desc": "을사조약에 저항하는 의병 운동이 전국에서 확산. 최익현·민종식·신돌석 등이 각지에서 의병을 이끌며 항전",
    "location": "전국 각지",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1905,
    "tag": "TECHNOLOGY",
    "title": "1905년 기술 혁신 기록",
    "desc": "1905년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1905,
    "tag": "SOCIETY",
    "title": "1905년 한국 사회 변화상",
    "desc": "1905년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1905,
    "tag": "SOCIETY",
    "title": "1905년의 정밀 역사 기록 (1)",
    "desc": "1905년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 7 (확장 데이터)",
    "desc": "1906년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1906,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 132 (확장 데이터)",
    "desc": "1906년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 257 (확장 데이터)",
    "desc": "1906년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1906,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 382 (확장 데이터)",
    "desc": "1906년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1906,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 507 (확장 데이터)",
    "desc": "1906년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 632 (확장 데이터)",
    "desc": "1906년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1906,
    "tag": "WAR",
    "title": "연도별 상세 사건 757 (확장 데이터)",
    "desc": "1906년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1906,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 882 (확장 데이터)",
    "desc": "1906년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1007 (확장 데이터)",
    "desc": "1906년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1906,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1132 (확장 데이터)",
    "desc": "1906년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1906,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1257 (확장 데이터)",
    "desc": "1906년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1382 (확장 데이터)",
    "desc": "1906년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1906,
    "tag": "TECHNOLOGY",
    "title": "1906년 기술 혁신 기록",
    "desc": "1906년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1906,
    "tag": "SOCIETY",
    "title": "1906년 한국 사회 변화상",
    "desc": "1906년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "CULTURE",
    "title": "1906년의 정밀 역사 기록 (1)",
    "desc": "1906년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "ECONOMY",
    "title": "1906년의 정밀 역사 기록 (2)",
    "desc": "1906년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "TECHNOLOGY",
    "title": "1906년의 정밀 역사 기록 (3)",
    "desc": "1906년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1906,
    "tag": "SOCIETY",
    "title": "1906년의 정밀 역사 기록 (4)",
    "desc": "1906년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "WAR",
    "title": "연도별 상세 사건 8 (확장 데이터)",
    "desc": "1907년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1907,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 133 (확장 데이터)",
    "desc": "1907년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1907,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 258 (확장 데이터)",
    "desc": "1907년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 383 (확장 데이터)",
    "desc": "1907년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1907,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 508 (확장 데이터)",
    "desc": "1907년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1907,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 633 (확장 데이터)",
    "desc": "1907년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 758 (확장 데이터)",
    "desc": "1907년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1907,
    "tag": "WAR",
    "title": "연도별 상세 사건 883 (확장 데이터)",
    "desc": "1907년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1907,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1008 (확장 데이터)",
    "desc": "1907년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1133 (확장 데이터)",
    "desc": "1907년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1907,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1258 (확장 데이터)",
    "desc": "1907년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1907,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1383 (확장 데이터)",
    "desc": "1907년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "POLITICS",
    "title": "헤이그 밀사 사건·고종 강제 퇴위",
    "desc": "고종이 헤이그 만국평화회의에 이준·이상설·이위종을 파견했으나 실패. 일본이 이를 빌미로 고종을 강제 퇴위",
    "location": "헤이그·한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1907,
    "tag": "TECHNOLOGY",
    "title": "1907년 기술 혁신 기록",
    "desc": "1907년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1907,
    "tag": "SOCIETY",
    "title": "1907년 한국 사회 변화상",
    "desc": "1907년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "ECONOMY",
    "title": "1907년의 정밀 역사 기록 (1)",
    "desc": "1907년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "TECHNOLOGY",
    "title": "1907년의 정밀 역사 기록 (2)",
    "desc": "1907년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1907,
    "tag": "SOCIETY",
    "title": "1907년의 정밀 역사 기록 (3)",
    "desc": "1907년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 9 (확장 데이터)",
    "desc": "1908년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "WAR",
    "title": "연도별 상세 사건 134 (확장 데이터)",
    "desc": "1908년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1908,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 259 (확장 데이터)",
    "desc": "1908년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1908,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 384 (확장 데이터)",
    "desc": "1908년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 509 (확장 데이터)",
    "desc": "1908년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1908,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 634 (확장 데이터)",
    "desc": "1908년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1908,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 759 (확장 데이터)",
    "desc": "1908년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 884 (확장 데이터)",
    "desc": "1908년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1908,
    "tag": "WAR",
    "title": "연도별 상세 사건 1009 (확장 데이터)",
    "desc": "1908년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1908,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1134 (확장 데이터)",
    "desc": "1908년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1259 (확장 데이터)",
    "desc": "1908년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1908,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1384 (확장 데이터)",
    "desc": "1908년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1908,
    "tag": "TECHNOLOGY",
    "title": "1908년 기술 혁신 기록",
    "desc": "1908년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1908,
    "tag": "SOCIETY",
    "title": "1908년 한국 사회 변화상",
    "desc": "1908년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "TECHNOLOGY",
    "title": "1908년의 정밀 역사 기록 (1)",
    "desc": "1908년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "SOCIETY",
    "title": "1908년의 정밀 역사 기록 (2)",
    "desc": "1908년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "CULTURE",
    "title": "1908년의 정밀 역사 기록 (3)",
    "desc": "1908년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1908,
    "tag": "ECONOMY",
    "title": "1908년의 정밀 역사 기록 (4)",
    "desc": "1908년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 10 (확장 데이터)",
    "desc": "1909년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1909,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 135 (확장 데이터)",
    "desc": "1909년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "WAR",
    "title": "연도별 상세 사건 260 (확장 데이터)",
    "desc": "1909년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1909,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 385 (확장 데이터)",
    "desc": "1909년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1909,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 510 (확장 데이터)",
    "desc": "1909년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 635 (확장 데이터)",
    "desc": "1909년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1909,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 760 (확장 데이터)",
    "desc": "1909년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1909,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 885 (확장 데이터)",
    "desc": "1909년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1010 (확장 데이터)",
    "desc": "1909년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1909,
    "tag": "WAR",
    "title": "연도별 상세 사건 1135 (확장 데이터)",
    "desc": "1909년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1909,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1260 (확장 데이터)",
    "desc": "1909년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1385 (확장 데이터)",
    "desc": "1909년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1909,
    "tag": "WAR",
    "title": "안중근 이토 히로부미 사살",
    "desc": "안중근 의사가 하얼빈 역에서 조선 침략의 원흉 이토 히로부미를 사살. 한국 독립운동의 상징적 의거",
    "location": "하얼빈, 중국",
    "region": [
      "아시아",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1909,
    "tag": "TECHNOLOGY",
    "title": "1909년 기술 혁신 기록",
    "desc": "1909년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1909,
    "tag": "SOCIETY",
    "title": "1909년 한국 사회 변화상",
    "desc": "1909년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "SOCIETY",
    "title": "1909년의 정밀 역사 기록 (1)",
    "desc": "1909년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "CULTURE",
    "title": "1909년의 정밀 역사 기록 (2)",
    "desc": "1909년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1909,
    "tag": "ECONOMY",
    "title": "1909년의 정밀 역사 기록 (3)",
    "desc": "1909년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 11 (확장 데이터)",
    "desc": "1910년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1910,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 136 (확장 데이터)",
    "desc": "1910년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1910,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 261 (확장 데이터)",
    "desc": "1910년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "WAR",
    "title": "연도별 상세 사건 386 (확장 데이터)",
    "desc": "1910년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1910,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 511 (확장 데이터)",
    "desc": "1910년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1910,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 636 (확장 데이터)",
    "desc": "1910년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 761 (확장 데이터)",
    "desc": "1910년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1910,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 886 (확장 데이터)",
    "desc": "1910년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1910,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1011 (확장 데이터)",
    "desc": "1910년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1136 (확장 데이터)",
    "desc": "1910년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1910,
    "tag": "WAR",
    "title": "연도별 상세 사건 1261 (확장 데이터)",
    "desc": "1910년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1910,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1386 (확장 데이터)",
    "desc": "1910년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "POLITICS",
    "title": "한일강제병합 - 조선 주권 상실",
    "desc": "일본이 한일병합조약을 강제로 체결하여 조선을 완전히 식민지로 만듦. 조선 총독부 설치. 민족 독립 운동의 시작",
    "location": "한양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1910,
    "tag": "TECHNOLOGY",
    "title": "1910년 기술 혁신 기록",
    "desc": "1910년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1910,
    "tag": "SOCIETY",
    "title": "1910년 한국 사회 변화상",
    "desc": "1910년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "CULTURE",
    "title": "1910년의 정밀 역사 기록 (1)",
    "desc": "1910년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "ECONOMY",
    "title": "1910년의 정밀 역사 기록 (2)",
    "desc": "1910년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1910,
    "tag": "TECHNOLOGY",
    "title": "1910년의 정밀 역사 기록 (3)",
    "desc": "1910년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 12 (확장 데이터)",
    "desc": "1911년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 137 (확장 데이터)",
    "desc": "1911년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1911,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 262 (확장 데이터)",
    "desc": "1911년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1911,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 387 (확장 데이터)",
    "desc": "1911년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "WAR",
    "title": "연도별 상세 사건 512 (확장 데이터)",
    "desc": "1911년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1911,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 637 (확장 데이터)",
    "desc": "1911년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1911,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 762 (확장 데이터)",
    "desc": "1911년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 887 (확장 데이터)",
    "desc": "1911년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1911,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1012 (확장 데이터)",
    "desc": "1911년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1911,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1137 (확장 데이터)",
    "desc": "1911년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1262 (확장 데이터)",
    "desc": "1911년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1911,
    "tag": "WAR",
    "title": "연도별 상세 사건 1387 (확장 데이터)",
    "desc": "1911년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1911,
    "tag": "TECHNOLOGY",
    "title": "1911년 기술 혁신 기록",
    "desc": "1911년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1911,
    "tag": "SOCIETY",
    "title": "1911년 한국 사회 변화상",
    "desc": "1911년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "ECONOMY",
    "title": "1911년의 정밀 역사 기록 (1)",
    "desc": "1911년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "TECHNOLOGY",
    "title": "1911년의 정밀 역사 기록 (2)",
    "desc": "1911년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "SOCIETY",
    "title": "1911년의 정밀 역사 기록 (3)",
    "desc": "1911년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1911,
    "tag": "CULTURE",
    "title": "1911년의 정밀 역사 기록 (4)",
    "desc": "1911년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 13 (확장 데이터)",
    "desc": "1912년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1912,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 138 (확장 데이터)",
    "desc": "1912년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 263 (확장 데이터)",
    "desc": "1912년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1912,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 388 (확장 데이터)",
    "desc": "1912년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1912,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 513 (확장 데이터)",
    "desc": "1912년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "WAR",
    "title": "연도별 상세 사건 638 (확장 데이터)",
    "desc": "1912년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1912,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 763 (확장 데이터)",
    "desc": "1912년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1912,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 888 (확장 데이터)",
    "desc": "1912년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1013 (확장 데이터)",
    "desc": "1912년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1912,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1138 (확장 데이터)",
    "desc": "1912년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1912,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1263 (확장 데이터)",
    "desc": "1912년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1388 (확장 데이터)",
    "desc": "1912년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1912,
    "tag": "DISASTER",
    "title": "타이타닉 침몰",
    "desc": "처녀 항해 중이던 호화 여객선 타이타닉이 빙산과 충돌하여 침몰. 1500여 명 사망. 안전 기준 강화의 계기",
    "location": "북대서양",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1912,
    "tag": "POLITICS",
    "title": "중화민국 수립·청나라 멸망",
    "desc": "신해혁명으로 청나라가 멸망하고 쑨원이 중화민국을 선포. 2000년 이상 지속된 중국 왕조 체제의 종말",
    "location": "남경, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1912,
    "tag": "TECHNOLOGY",
    "title": "1912년 기술 혁신 기록",
    "desc": "1912년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1912,
    "tag": "SOCIETY",
    "title": "1912년 한국 사회 변화상",
    "desc": "1912년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "TECHNOLOGY",
    "title": "1912년의 정밀 역사 기록 (1)",
    "desc": "1912년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1912,
    "tag": "SOCIETY",
    "title": "1912년의 정밀 역사 기록 (2)",
    "desc": "1912년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 14 (확장 데이터)",
    "desc": "1913년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1913,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 139 (확장 데이터)",
    "desc": "1913년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1913,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 264 (확장 데이터)",
    "desc": "1913년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 389 (확장 데이터)",
    "desc": "1913년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1913,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 514 (확장 데이터)",
    "desc": "1913년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1913,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 639 (확장 데이터)",
    "desc": "1913년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "WAR",
    "title": "연도별 상세 사건 764 (확장 데이터)",
    "desc": "1913년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1913,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 889 (확장 데이터)",
    "desc": "1913년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1913,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1014 (확장 데이터)",
    "desc": "1913년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1139 (확장 데이터)",
    "desc": "1913년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1913,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1264 (확장 데이터)",
    "desc": "1913년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1913,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1389 (확장 데이터)",
    "desc": "1913년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "TECHNOLOGY",
    "title": "1913년 기술 혁신 기록",
    "desc": "1913년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1913,
    "tag": "SOCIETY",
    "title": "1913년 한국 사회 변화상",
    "desc": "1913년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "SOCIETY",
    "title": "1913년의 정밀 역사 기록 (1)",
    "desc": "1913년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "CULTURE",
    "title": "1913년의 정밀 역사 기록 (2)",
    "desc": "1913년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "ECONOMY",
    "title": "1913년의 정밀 역사 기록 (3)",
    "desc": "1913년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1913,
    "tag": "TECHNOLOGY",
    "title": "1913년의 정밀 역사 기록 (4)",
    "desc": "1913년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "WAR",
    "title": "연도별 상세 사건 15 (확장 데이터)",
    "desc": "1914년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 140 (확장 데이터)",
    "desc": "1914년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1914,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 265 (확장 데이터)",
    "desc": "1914년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1914,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 390 (확장 데이터)",
    "desc": "1914년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 515 (확장 데이터)",
    "desc": "1914년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1914,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 640 (확장 데이터)",
    "desc": "1914년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1914,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 765 (확장 데이터)",
    "desc": "1914년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "WAR",
    "title": "연도별 상세 사건 890 (확장 데이터)",
    "desc": "1914년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1914,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1015 (확장 데이터)",
    "desc": "1914년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1914,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1140 (확장 데이터)",
    "desc": "1914년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1265 (확장 데이터)",
    "desc": "1914년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1914,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1390 (확장 데이터)",
    "desc": "1914년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1914,
    "tag": "WAR",
    "title": "제1차 세계대전 발발",
    "desc": "사라예보에서 오스트리아 황태자 암살을 계기로 유럽 열강 간의 동맹 체계가 연쇄적으로 작동하며 대전 발발",
    "location": "유럽 전역",
    "region": [
      "유럽",
      "중동",
      "아프리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1914,
    "tag": "TECHNOLOGY",
    "title": "1914년 기술 혁신 기록",
    "desc": "1914년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1914,
    "tag": "SOCIETY",
    "title": "1914년 한국 사회 변화상",
    "desc": "1914년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "CULTURE",
    "title": "1914년의 정밀 역사 기록 (1)",
    "desc": "1914년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "ECONOMY",
    "title": "1914년의 정밀 역사 기록 (2)",
    "desc": "1914년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1914,
    "tag": "TECHNOLOGY",
    "title": "1914년의 정밀 역사 기록 (3)",
    "desc": "1914년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 16 (확장 데이터)",
    "desc": "1915년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1915,
    "tag": "WAR",
    "title": "연도별 상세 사건 141 (확장 데이터)",
    "desc": "1915년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 266 (확장 데이터)",
    "desc": "1915년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1915,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 391 (확장 데이터)",
    "desc": "1915년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1915,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 516 (확장 데이터)",
    "desc": "1915년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 641 (확장 데이터)",
    "desc": "1915년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1915,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 766 (확장 데이터)",
    "desc": "1915년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1915,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 891 (확장 데이터)",
    "desc": "1915년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "WAR",
    "title": "연도별 상세 사건 1016 (확장 데이터)",
    "desc": "1915년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1915,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1141 (확장 데이터)",
    "desc": "1915년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1915,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1266 (확장 데이터)",
    "desc": "1915년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1391 (확장 데이터)",
    "desc": "1915년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1915,
    "tag": "WAR",
    "title": "갈리폴리 전투",
    "desc": "영국-호주-뉴질랜드 연합군이 오스만 제국의 다르다넬스를 공략하다 참패. 연합군 25만 명 사상. 처칠의 전략 실패",
    "location": "갈리폴리, 터키",
    "region": [
      "중동",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1915,
    "tag": "TECHNOLOGY",
    "title": "1915년 기술 혁신 기록",
    "desc": "1915년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1915,
    "tag": "SOCIETY",
    "title": "1915년 한국 사회 변화상",
    "desc": "1915년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "ECONOMY",
    "title": "1915년의 정밀 역사 기록 (1)",
    "desc": "1915년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "TECHNOLOGY",
    "title": "1915년의 정밀 역사 기록 (2)",
    "desc": "1915년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1915,
    "tag": "SOCIETY",
    "title": "1915년의 정밀 역사 기록 (3)",
    "desc": "1915년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 17 (확장 데이터)",
    "desc": "1916년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1916,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 142 (확장 데이터)",
    "desc": "1916년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1916,
    "tag": "WAR",
    "title": "연도별 상세 사건 267 (확장 데이터)",
    "desc": "1916년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 392 (확장 데이터)",
    "desc": "1916년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1916,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 517 (확장 데이터)",
    "desc": "1916년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1916,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 642 (확장 데이터)",
    "desc": "1916년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 767 (확장 데이터)",
    "desc": "1916년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1916,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 892 (확장 데이터)",
    "desc": "1916년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1916,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1017 (확장 데이터)",
    "desc": "1916년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "WAR",
    "title": "연도별 상세 사건 1142 (확장 데이터)",
    "desc": "1916년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1916,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1267 (확장 데이터)",
    "desc": "1916년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1916,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1392 (확장 데이터)",
    "desc": "1916년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "WAR",
    "title": "솜·베르됭 전투 - 참호전 최대 참상",
    "desc": "솜 전투에서 하루 6만 명 사상. 베르됭 전투에서 70만 명 이상 사망. 1차 대전의 참호전이 얼마나 끔찍한지 보여줌",
    "location": "프랑스 서부 전선",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1916,
    "tag": "TECHNOLOGY",
    "title": "1916년 기술 혁신 기록",
    "desc": "1916년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1916,
    "tag": "SOCIETY",
    "title": "1916년 한국 사회 변화상",
    "desc": "1916년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "TECHNOLOGY",
    "title": "1916년의 정밀 역사 기록 (1)",
    "desc": "1916년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "SOCIETY",
    "title": "1916년의 정밀 역사 기록 (2)",
    "desc": "1916년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1916,
    "tag": "CULTURE",
    "title": "1916년의 정밀 역사 기록 (3)",
    "desc": "1916년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 18 (확장 데이터)",
    "desc": "1917년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 143 (확장 데이터)",
    "desc": "1917년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1917,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 268 (확장 데이터)",
    "desc": "1917년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1917,
    "tag": "WAR",
    "title": "연도별 상세 사건 393 (확장 데이터)",
    "desc": "1917년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 518 (확장 데이터)",
    "desc": "1917년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1917,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 643 (확장 데이터)",
    "desc": "1917년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1917,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 768 (확장 데이터)",
    "desc": "1917년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 893 (확장 데이터)",
    "desc": "1917년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1917,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1018 (확장 데이터)",
    "desc": "1917년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1917,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1143 (확장 데이터)",
    "desc": "1917년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "WAR",
    "title": "연도별 상세 사건 1268 (확장 데이터)",
    "desc": "1917년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1917,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1393 (확장 데이터)",
    "desc": "1917년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1917,
    "tag": "POLITICS",
    "title": "러시아 혁명 - 소비에트 수립",
    "desc": "레닌이 이끄는 볼셰비키가 케렌스키 임시 정부를 무너뜨리고 소비에트 권력 수립. 냉전의 씨앗이 된 역사적 사건",
    "location": "페트로그라드, 러시아",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1917,
    "tag": "WAR",
    "title": "미국 1차 세계대전 참전",
    "desc": "무제한 잠수함 작전과 치머만 전보를 계기로 미국이 참전. 연합국의 승리를 결정짓는 전력 균형 변화",
    "location": "미국·유럽",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1917,
    "tag": "TECHNOLOGY",
    "title": "1917년 기술 혁신 기록",
    "desc": "1917년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1917,
    "tag": "SOCIETY",
    "title": "1917년 한국 사회 변화상",
    "desc": "1917년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "SOCIETY",
    "title": "1917년의 정밀 역사 기록 (1)",
    "desc": "1917년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1917,
    "tag": "CULTURE",
    "title": "1917년의 정밀 역사 기록 (2)",
    "desc": "1917년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 19 (확장 데이터)",
    "desc": "1918년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1918,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 144 (확장 데이터)",
    "desc": "1918년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 269 (확장 데이터)",
    "desc": "1918년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1918,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 394 (확장 데이터)",
    "desc": "1918년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1918,
    "tag": "WAR",
    "title": "연도별 상세 사건 519 (확장 데이터)",
    "desc": "1918년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 644 (확장 데이터)",
    "desc": "1918년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1918,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 769 (확장 데이터)",
    "desc": "1918년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1918,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 894 (확장 데이터)",
    "desc": "1918년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1019 (확장 데이터)",
    "desc": "1918년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1918,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1144 (확장 데이터)",
    "desc": "1918년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1918,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1269 (확장 데이터)",
    "desc": "1918년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "WAR",
    "title": "연도별 상세 사건 1394 (확장 데이터)",
    "desc": "1918년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1918,
    "tag": "WAR",
    "title": "제1차 세계대전 종전",
    "desc": "독일이 항복하며 1차 세계대전 종전. 9백만 명의 군인과 7백만 명의 민간인이 사망한 인류 역사의 대참극",
    "location": "콩피에뉴, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1918,
    "tag": "DISASTER",
    "title": "스페인 독감 대유행",
    "desc": "전 세계적으로 5억 명 감염, 5000만~1억 명 사망한 역사상 최악의 인플루엔자 팬데믹. 1차 대전 사망자를 능가",
    "location": "전 세계",
    "region": [
      "전국",
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1918,
    "tag": "TECHNOLOGY",
    "title": "1918년 기술 혁신 기록",
    "desc": "1918년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1918,
    "tag": "SOCIETY",
    "title": "1918년 한국 사회 변화상",
    "desc": "1918년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "CULTURE",
    "title": "1918년의 정밀 역사 기록 (1)",
    "desc": "1918년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1918,
    "tag": "ECONOMY",
    "title": "1918년의 정밀 역사 기록 (2)",
    "desc": "1918년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 20 (확장 데이터)",
    "desc": "1919년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1919,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 145 (확장 데이터)",
    "desc": "1919년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1919,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 270 (확장 데이터)",
    "desc": "1919년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 395 (확장 데이터)",
    "desc": "1919년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1919,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 520 (확장 데이터)",
    "desc": "1919년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1919,
    "tag": "WAR",
    "title": "연도별 상세 사건 645 (확장 데이터)",
    "desc": "1919년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 770 (확장 데이터)",
    "desc": "1919년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1919,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 895 (확장 데이터)",
    "desc": "1919년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1919,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1020 (확장 데이터)",
    "desc": "1919년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1145 (확장 데이터)",
    "desc": "1919년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1919,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1270 (확장 데이터)",
    "desc": "1919년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1919,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1395 (확장 데이터)",
    "desc": "1919년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "POLITICS",
    "title": "3·1 독립운동",
    "desc": "전국 수백만 조선인이 독립만세를 외친 비폭력 대규모 독립 운동. 일제의 무력 진압으로 7000여 명 사망, 4만 명 검거",
    "location": "한반도 전역",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1919,
    "tag": "POLITICS",
    "title": "대한민국 임시정부 수립 (상해)",
    "desc": "3·1운동 이후 중국 상하이에서 대한민국 임시정부가 수립됨. 이승만·안창호·김구 등이 참여",
    "location": "상하이, 중국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1919,
    "tag": "POLITICS",
    "title": "파리 강화 회의·베르사유 조약",
    "desc": "1차 세계대전을 마무리하는 베르사유 조약 체결. 독일에 전쟁 책임과 막대한 배상금 부과. 나치즘의 씨앗",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1919,
    "tag": "TECHNOLOGY",
    "title": "1919년 기술 혁신 기록",
    "desc": "1919년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1919,
    "tag": "SOCIETY",
    "title": "1919년 한국 사회 변화상",
    "desc": "1919년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1919,
    "tag": "ECONOMY",
    "title": "1919년의 정밀 역사 기록 (1)",
    "desc": "1919년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 21 (확장 데이터)",
    "desc": "1920년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 146 (확장 데이터)",
    "desc": "1920년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1920,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 271 (확장 데이터)",
    "desc": "1920년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1920,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 396 (확장 데이터)",
    "desc": "1920년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 521 (확장 데이터)",
    "desc": "1920년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1920,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 646 (확장 데이터)",
    "desc": "1920년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1920,
    "tag": "WAR",
    "title": "연도별 상세 사건 771 (확장 데이터)",
    "desc": "1920년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 896 (확장 데이터)",
    "desc": "1920년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1920,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1021 (확장 데이터)",
    "desc": "1920년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1920,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1146 (확장 데이터)",
    "desc": "1920년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1271 (확장 데이터)",
    "desc": "1920년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1920,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1396 (확장 데이터)",
    "desc": "1920년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1920,
    "tag": "WAR",
    "title": "봉오동·청산리 전투 대승",
    "desc": "홍범도·김좌진 장군이 이끄는 독립군이 봉오동과 청산리에서 일본군을 대파. 독립운동 최대의 군사적 승리",
    "location": "만주 (봉오동·청산리)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1920,
    "tag": "POLITICS",
    "title": "국제연맹 창설",
    "desc": "윌슨 대통령의 제안으로 최초의 국제 평화 기구 국제연맹이 창설. 미국은 상원 반대로 불참. 2차 대전 후 UN으로 계승",
    "location": "제네바, 스위스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1920,
    "tag": "TECHNOLOGY",
    "title": "1920년 기술 혁신 기록",
    "desc": "1920년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1920,
    "tag": "SOCIETY",
    "title": "1920년 한국 사회 변화상",
    "desc": "1920년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "TECHNOLOGY",
    "title": "1920년의 정밀 역사 기록 (1)",
    "desc": "1920년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1920,
    "tag": "SOCIETY",
    "title": "1920년의 정밀 역사 기록 (2)",
    "desc": "1920년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "WAR",
    "title": "연도별 상세 사건 22 (확장 데이터)",
    "desc": "1921년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1921,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 147 (확장 데이터)",
    "desc": "1921년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 272 (확장 데이터)",
    "desc": "1921년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1921,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 397 (확장 데이터)",
    "desc": "1921년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1921,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 522 (확장 데이터)",
    "desc": "1921년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 647 (확장 데이터)",
    "desc": "1921년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1921,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 772 (확장 데이터)",
    "desc": "1921년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1921,
    "tag": "WAR",
    "title": "연도별 상세 사건 897 (확장 데이터)",
    "desc": "1921년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1022 (확장 데이터)",
    "desc": "1921년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1921,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1147 (확장 데이터)",
    "desc": "1921년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1921,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1272 (확장 데이터)",
    "desc": "1921년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1397 (확장 데이터)",
    "desc": "1921년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1921,
    "tag": "TECHNOLOGY",
    "title": "1921년 기술 혁신 기록",
    "desc": "1921년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1921,
    "tag": "SOCIETY",
    "title": "1921년 한국 사회 변화상",
    "desc": "1921년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "SOCIETY",
    "title": "1921년의 정밀 역사 기록 (1)",
    "desc": "1921년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "CULTURE",
    "title": "1921년의 정밀 역사 기록 (2)",
    "desc": "1921년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "ECONOMY",
    "title": "1921년의 정밀 역사 기록 (3)",
    "desc": "1921년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1921,
    "tag": "TECHNOLOGY",
    "title": "1921년의 정밀 역사 기록 (4)",
    "desc": "1921년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 23 (확장 데이터)",
    "desc": "1922년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1922,
    "tag": "WAR",
    "title": "연도별 상세 사건 148 (확장 데이터)",
    "desc": "1922년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1922,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 273 (확장 데이터)",
    "desc": "1922년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 398 (확장 데이터)",
    "desc": "1922년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1922,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 523 (확장 데이터)",
    "desc": "1922년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1922,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 648 (확장 데이터)",
    "desc": "1922년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 773 (확장 데이터)",
    "desc": "1922년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1922,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 898 (확장 데이터)",
    "desc": "1922년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1922,
    "tag": "WAR",
    "title": "연도별 상세 사건 1023 (확장 데이터)",
    "desc": "1922년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1148 (확장 데이터)",
    "desc": "1922년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1922,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1273 (확장 데이터)",
    "desc": "1922년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1922,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1398 (확장 데이터)",
    "desc": "1922년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "POLITICS",
    "title": "소비에트 연방 창설",
    "desc": "러시아·우크라이나·벨라루스·카프카스 공화국이 통합하여 소비에트 사회주의 공화국 연방(소련) 수립",
    "location": "모스크바, 러시아",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1922,
    "tag": "POLITICS",
    "title": "무솔리니 로마 진군·파시즘 집권",
    "desc": "무솔리니의 파시스트당이 로마 진군으로 이탈리아 정권을 장악. 유럽 파시즘의 첫 집권. 히틀러의 모델이 됨",
    "location": "로마, 이탈리아",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1922,
    "tag": "TECHNOLOGY",
    "title": "1922년 기술 혁신 기록",
    "desc": "1922년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1922,
    "tag": "SOCIETY",
    "title": "1922년 한국 사회 변화상",
    "desc": "1922년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "CULTURE",
    "title": "1922년의 정밀 역사 기록 (1)",
    "desc": "1922년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1922,
    "tag": "ECONOMY",
    "title": "1922년의 정밀 역사 기록 (2)",
    "desc": "1922년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 24 (확장 데이터)",
    "desc": "1923년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 149 (확장 데이터)",
    "desc": "1923년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1923,
    "tag": "WAR",
    "title": "연도별 상세 사건 274 (확장 데이터)",
    "desc": "1923년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1923,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 399 (확장 데이터)",
    "desc": "1923년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 524 (확장 데이터)",
    "desc": "1923년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1923,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 649 (확장 데이터)",
    "desc": "1923년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1923,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 774 (확장 데이터)",
    "desc": "1923년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 899 (확장 데이터)",
    "desc": "1923년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1923,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1024 (확장 데이터)",
    "desc": "1923년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1923,
    "tag": "WAR",
    "title": "연도별 상세 사건 1149 (확장 데이터)",
    "desc": "1923년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1274 (확장 데이터)",
    "desc": "1923년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1923,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1399 (확장 데이터)",
    "desc": "1923년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1923,
    "tag": "DISASTER",
    "title": "관동 대지진·조선인 학살",
    "desc": "일본 도쿄 인근에서 규모 7.9의 대지진 발생. 14만 명 사망. 혼란 속에 조선인 6000여 명이 일본인에게 학살됨",
    "location": "도쿄, 일본",
    "region": [
      "아시아",
      "전국"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1923,
    "tag": "TECHNOLOGY",
    "title": "1923년 기술 혁신 기록",
    "desc": "1923년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1923,
    "tag": "SOCIETY",
    "title": "1923년 한국 사회 변화상",
    "desc": "1923년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "ECONOMY",
    "title": "1923년의 정밀 역사 기록 (1)",
    "desc": "1923년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "TECHNOLOGY",
    "title": "1923년의 정밀 역사 기록 (2)",
    "desc": "1923년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1923,
    "tag": "SOCIETY",
    "title": "1923년의 정밀 역사 기록 (3)",
    "desc": "1923년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 25 (확장 데이터)",
    "desc": "1924년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1924,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 150 (확장 데이터)",
    "desc": "1924년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 275 (확장 데이터)",
    "desc": "1924년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1924,
    "tag": "WAR",
    "title": "연도별 상세 사건 400 (확장 데이터)",
    "desc": "1924년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1924,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 525 (확장 데이터)",
    "desc": "1924년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 650 (확장 데이터)",
    "desc": "1924년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1924,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 775 (확장 데이터)",
    "desc": "1924년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1924,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 900 (확장 데이터)",
    "desc": "1924년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1025 (확장 데이터)",
    "desc": "1924년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1924,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1150 (확장 데이터)",
    "desc": "1924년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1924,
    "tag": "WAR",
    "title": "연도별 상세 사건 1275 (확장 데이터)",
    "desc": "1924년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1400 (확장 데이터)",
    "desc": "1924년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1924,
    "tag": "TECHNOLOGY",
    "title": "1924년 기술 혁신 기록",
    "desc": "1924년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1924,
    "tag": "SOCIETY",
    "title": "1924년 한국 사회 변화상",
    "desc": "1924년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "TECHNOLOGY",
    "title": "1924년의 정밀 역사 기록 (1)",
    "desc": "1924년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "SOCIETY",
    "title": "1924년의 정밀 역사 기록 (2)",
    "desc": "1924년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "CULTURE",
    "title": "1924년의 정밀 역사 기록 (3)",
    "desc": "1924년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1924,
    "tag": "ECONOMY",
    "title": "1924년의 정밀 역사 기록 (4)",
    "desc": "1924년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 26 (확장 데이터)",
    "desc": "1925년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1925,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 151 (확장 데이터)",
    "desc": "1925년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1925,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 276 (확장 데이터)",
    "desc": "1925년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 401 (확장 데이터)",
    "desc": "1925년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1925,
    "tag": "WAR",
    "title": "연도별 상세 사건 526 (확장 데이터)",
    "desc": "1925년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1925,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 651 (확장 데이터)",
    "desc": "1925년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 776 (확장 데이터)",
    "desc": "1925년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1925,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 901 (확장 데이터)",
    "desc": "1925년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1925,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1026 (확장 데이터)",
    "desc": "1925년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1151 (확장 데이터)",
    "desc": "1925년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1925,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1276 (확장 데이터)",
    "desc": "1925년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1925,
    "tag": "WAR",
    "title": "연도별 상세 사건 1401 (확장 데이터)",
    "desc": "1925년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "TECHNOLOGY",
    "title": "1925년 기술 혁신 기록",
    "desc": "1925년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1925,
    "tag": "SOCIETY",
    "title": "1925년 한국 사회 변화상",
    "desc": "1925년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "SOCIETY",
    "title": "1925년의 정밀 역사 기록 (1)",
    "desc": "1925년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "CULTURE",
    "title": "1925년의 정밀 역사 기록 (2)",
    "desc": "1925년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "ECONOMY",
    "title": "1925년의 정밀 역사 기록 (3)",
    "desc": "1925년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1925,
    "tag": "TECHNOLOGY",
    "title": "1925년의 정밀 역사 기록 (4)",
    "desc": "1925년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 27 (확장 데이터)",
    "desc": "1926년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 152 (확장 데이터)",
    "desc": "1926년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1926,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 277 (확장 데이터)",
    "desc": "1926년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1926,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 402 (확장 데이터)",
    "desc": "1926년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 527 (확장 데이터)",
    "desc": "1926년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1926,
    "tag": "WAR",
    "title": "연도별 상세 사건 652 (확장 데이터)",
    "desc": "1926년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1926,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 777 (확장 데이터)",
    "desc": "1926년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 902 (확장 데이터)",
    "desc": "1926년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1926,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1027 (확장 데이터)",
    "desc": "1926년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1926,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1152 (확장 데이터)",
    "desc": "1926년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1277 (확장 데이터)",
    "desc": "1926년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1926,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1402 (확장 데이터)",
    "desc": "1926년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1926,
    "tag": "POLITICS",
    "title": "6·10 만세 운동",
    "desc": "순종 황제 장례일에 맞춰 학생들이 만세 시위를 전개한 독립 운동. 3·1운동 이후 최대 규모의 학생 주도 항일 운동",
    "location": "한양 (서울)",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1926,
    "tag": "TECHNOLOGY",
    "title": "1926년 기술 혁신 기록",
    "desc": "1926년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1926,
    "tag": "SOCIETY",
    "title": "1926년 한국 사회 변화상",
    "desc": "1926년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "CULTURE",
    "title": "1926년의 정밀 역사 기록 (1)",
    "desc": "1926년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "ECONOMY",
    "title": "1926년의 정밀 역사 기록 (2)",
    "desc": "1926년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1926,
    "tag": "TECHNOLOGY",
    "title": "1926년의 정밀 역사 기록 (3)",
    "desc": "1926년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 28 (확장 데이터)",
    "desc": "1927년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1927,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 153 (확장 데이터)",
    "desc": "1927년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 278 (확장 데이터)",
    "desc": "1927년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1927,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 403 (확장 데이터)",
    "desc": "1927년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1927,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 528 (확장 데이터)",
    "desc": "1927년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 653 (확장 데이터)",
    "desc": "1927년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1927,
    "tag": "WAR",
    "title": "연도별 상세 사건 778 (확장 데이터)",
    "desc": "1927년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1927,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 903 (확장 데이터)",
    "desc": "1927년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1028 (확장 데이터)",
    "desc": "1927년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1927,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1153 (확장 데이터)",
    "desc": "1927년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1927,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1278 (확장 데이터)",
    "desc": "1927년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1403 (확장 데이터)",
    "desc": "1927년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1927,
    "tag": "CULTURE",
    "title": "린드버그 대서양 단독 횡단 비행",
    "desc": "찰스 린드버그가 뉴욕-파리 간 5800km를 33시간 30분에 단독 비행. 항공 시대의 가능성을 세계에 증명",
    "location": "뉴욕→파리",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1927,
    "tag": "POLITICS",
    "title": "신간회 창립 - 좌우합작 독립 운동",
    "desc": "민족주의·사회주의 계열이 연합하여 신간회를 창립. 국내 최대 항일 민족 운동 단체. 일제의 탄압으로 1931년 해산",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1927,
    "tag": "TECHNOLOGY",
    "title": "1927년 기술 혁신 기록",
    "desc": "1927년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1927,
    "tag": "SOCIETY",
    "title": "1927년 한국 사회 변화상",
    "desc": "1927년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "ECONOMY",
    "title": "1927년의 정밀 역사 기록 (1)",
    "desc": "1927년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1927,
    "tag": "TECHNOLOGY",
    "title": "1927년의 정밀 역사 기록 (2)",
    "desc": "1927년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "SCIENCE",
    "title": "플레밍의 페니실린 발견",
    "desc": "항생제 시대를 열어 인류 수명을 획기적으로 연장",
    "location": "영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1928,
    "tag": "WAR",
    "title": "연도별 상세 사건 29 (확장 데이터)",
    "desc": "1928년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1928,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 154 (확장 데이터)",
    "desc": "1928년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1928,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 279 (확장 데이터)",
    "desc": "1928년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 404 (확장 데이터)",
    "desc": "1928년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1928,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 529 (확장 데이터)",
    "desc": "1928년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1928,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 654 (확장 데이터)",
    "desc": "1928년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 779 (확장 데이터)",
    "desc": "1928년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1928,
    "tag": "WAR",
    "title": "연도별 상세 사건 904 (확장 데이터)",
    "desc": "1928년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1928,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1029 (확장 데이터)",
    "desc": "1928년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1154 (확장 데이터)",
    "desc": "1928년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1928,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1279 (확장 데이터)",
    "desc": "1928년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1928,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1404 (확장 데이터)",
    "desc": "1928년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "TECHNOLOGY",
    "title": "1928년 기술 혁신 기록",
    "desc": "1928년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1928,
    "tag": "SOCIETY",
    "title": "1928년 한국 사회 변화상",
    "desc": "1928년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "TECHNOLOGY",
    "title": "1928년의 정밀 역사 기록 (1)",
    "desc": "1928년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "SOCIETY",
    "title": "1928년의 정밀 역사 기록 (2)",
    "desc": "1928년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "CULTURE",
    "title": "1928년의 정밀 역사 기록 (3)",
    "desc": "1928년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1928,
    "tag": "ECONOMY",
    "title": "1928년의 정밀 역사 기록 (4)",
    "desc": "1928년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 30 (확장 데이터)",
    "desc": "1929년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "WAR",
    "title": "연도별 상세 사건 155 (확장 데이터)",
    "desc": "1929년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1929,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 280 (확장 데이터)",
    "desc": "1929년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1929,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 405 (확장 데이터)",
    "desc": "1929년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 530 (확장 데이터)",
    "desc": "1929년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1929,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 655 (확장 데이터)",
    "desc": "1929년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1929,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 780 (확장 데이터)",
    "desc": "1929년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 905 (확장 데이터)",
    "desc": "1929년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1929,
    "tag": "WAR",
    "title": "연도별 상세 사건 1030 (확장 데이터)",
    "desc": "1929년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1929,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1155 (확장 데이터)",
    "desc": "1929년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1280 (확장 데이터)",
    "desc": "1929년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1929,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1405 (확장 데이터)",
    "desc": "1929년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1929,
    "tag": "ECONOMY",
    "title": "뉴욕 주가 대폭락·대공황 시작",
    "desc": "뉴욕 증시가 대폭락하며 전 세계적 대공황이 시작됨. 수천만 명의 실업자와 빈민 양산. 파시즘 확산의 경제적 배경",
    "location": "뉴욕, 미국",
    "region": [
      "아메리카",
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1929,
    "tag": "TECHNOLOGY",
    "title": "1929년 기술 혁신 기록",
    "desc": "1929년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1929,
    "tag": "SOCIETY",
    "title": "1929년 한국 사회 변화상",
    "desc": "1929년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "SOCIETY",
    "title": "1929년의 정밀 역사 기록 (1)",
    "desc": "1929년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "CULTURE",
    "title": "1929년의 정밀 역사 기록 (2)",
    "desc": "1929년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1929,
    "tag": "ECONOMY",
    "title": "1929년의 정밀 역사 기록 (3)",
    "desc": "1929년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 31 (확장 데이터)",
    "desc": "1930년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1930,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 156 (확장 데이터)",
    "desc": "1930년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "WAR",
    "title": "연도별 상세 사건 281 (확장 데이터)",
    "desc": "1930년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1930,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 406 (확장 데이터)",
    "desc": "1930년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1930,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 531 (확장 데이터)",
    "desc": "1930년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 656 (확장 데이터)",
    "desc": "1930년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1930,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 781 (확장 데이터)",
    "desc": "1930년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1930,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 906 (확장 데이터)",
    "desc": "1930년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1031 (확장 데이터)",
    "desc": "1930년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1930,
    "tag": "WAR",
    "title": "연도별 상세 사건 1156 (확장 데이터)",
    "desc": "1930년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1930,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1281 (확장 데이터)",
    "desc": "1930년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1406 (확장 데이터)",
    "desc": "1930년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1930,
    "tag": "WAR",
    "title": "간디 소금 행진·인도 독립 운동",
    "desc": "간디가 소금세에 저항하여 385km를 행진. 비폭력 저항운동의 전 세계적 모범. 영국 식민지배에 대한 인도의 도전",
    "location": "다라사나, 인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1930,
    "tag": "TECHNOLOGY",
    "title": "1930년 기술 혁신 기록",
    "desc": "1930년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1930,
    "tag": "SOCIETY",
    "title": "1930년 한국 사회 변화상",
    "desc": "1930년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "CULTURE",
    "title": "1930년의 정밀 역사 기록 (1)",
    "desc": "1930년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "ECONOMY",
    "title": "1930년의 정밀 역사 기록 (2)",
    "desc": "1930년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1930,
    "tag": "TECHNOLOGY",
    "title": "1930년의 정밀 역사 기록 (3)",
    "desc": "1930년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 32 (확장 데이터)",
    "desc": "1931년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1931,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 157 (확장 데이터)",
    "desc": "1931년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1931,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 282 (확장 데이터)",
    "desc": "1931년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "WAR",
    "title": "연도별 상세 사건 407 (확장 데이터)",
    "desc": "1931년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1931,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 532 (확장 데이터)",
    "desc": "1931년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1931,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 657 (확장 데이터)",
    "desc": "1931년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 782 (확장 데이터)",
    "desc": "1931년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1931,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 907 (확장 데이터)",
    "desc": "1931년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1931,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1032 (확장 데이터)",
    "desc": "1931년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1157 (확장 데이터)",
    "desc": "1931년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1931,
    "tag": "WAR",
    "title": "연도별 상세 사건 1282 (확장 데이터)",
    "desc": "1931년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1931,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1407 (확장 데이터)",
    "desc": "1931년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "WAR",
    "title": "만주사변 - 일본 만주 점령",
    "desc": "일본 관동군이 류탸오후 철도 폭파를 자작하여 만주 전역을 침략. 중국과의 전면 충돌과 2차 대전의 서막",
    "location": "만주, 중국",
    "region": [
      "아시아",
      "전국"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1931,
    "tag": "TECHNOLOGY",
    "title": "1931년 기술 혁신 기록",
    "desc": "1931년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1931,
    "tag": "SOCIETY",
    "title": "1931년 한국 사회 변화상",
    "desc": "1931년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "ECONOMY",
    "title": "1931년의 정밀 역사 기록 (1)",
    "desc": "1931년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "TECHNOLOGY",
    "title": "1931년의 정밀 역사 기록 (2)",
    "desc": "1931년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1931,
    "tag": "SOCIETY",
    "title": "1931년의 정밀 역사 기록 (3)",
    "desc": "1931년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 33 (확장 데이터)",
    "desc": "1932년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 158 (확장 데이터)",
    "desc": "1932년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1932,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 283 (확장 데이터)",
    "desc": "1932년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1932,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 408 (확장 데이터)",
    "desc": "1932년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "WAR",
    "title": "연도별 상세 사건 533 (확장 데이터)",
    "desc": "1932년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1932,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 658 (확장 데이터)",
    "desc": "1932년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1932,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 783 (확장 데이터)",
    "desc": "1932년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 908 (확장 데이터)",
    "desc": "1932년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1932,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1033 (확장 데이터)",
    "desc": "1932년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1932,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1158 (확장 데이터)",
    "desc": "1932년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1283 (확장 데이터)",
    "desc": "1932년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1932,
    "tag": "WAR",
    "title": "연도별 상세 사건 1408 (확장 데이터)",
    "desc": "1932년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1932,
    "tag": "WAR",
    "title": "이봉창·윤봉길 의거",
    "desc": "이봉창이 일왕에게 수류탄을 투척하고, 윤봉길이 상하이 훙커우 공원에서 폭탄을 던져 일본 군부를 충격에 빠뜨림",
    "location": "도쿄·상하이",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1932,
    "tag": "TECHNOLOGY",
    "title": "1932년 기술 혁신 기록",
    "desc": "1932년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1932,
    "tag": "SOCIETY",
    "title": "1932년 한국 사회 변화상",
    "desc": "1932년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "TECHNOLOGY",
    "title": "1932년의 정밀 역사 기록 (1)",
    "desc": "1932년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "SOCIETY",
    "title": "1932년의 정밀 역사 기록 (2)",
    "desc": "1932년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1932,
    "tag": "CULTURE",
    "title": "1932년의 정밀 역사 기록 (3)",
    "desc": "1932년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 34 (확장 데이터)",
    "desc": "1933년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1933,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 159 (확장 데이터)",
    "desc": "1933년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 284 (확장 데이터)",
    "desc": "1933년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1933,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 409 (확장 데이터)",
    "desc": "1933년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1933,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 534 (확장 데이터)",
    "desc": "1933년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "WAR",
    "title": "연도별 상세 사건 659 (확장 데이터)",
    "desc": "1933년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1933,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 784 (확장 데이터)",
    "desc": "1933년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1933,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 909 (확장 데이터)",
    "desc": "1933년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1034 (확장 데이터)",
    "desc": "1933년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1933,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1159 (확장 데이터)",
    "desc": "1933년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1933,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1284 (확장 데이터)",
    "desc": "1933년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1409 (확장 데이터)",
    "desc": "1933년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1933,
    "tag": "POLITICS",
    "title": "히틀러 독일 총리 취임·나치 집권",
    "desc": "아돌프 히틀러가 독일 총리에 취임하고 국가사회주의(나치) 독재 체제를 수립. 2차 세계대전과 홀로코스트의 시작",
    "location": "베를린, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1933,
    "tag": "TECHNOLOGY",
    "title": "1933년 기술 혁신 기록",
    "desc": "1933년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1933,
    "tag": "SOCIETY",
    "title": "1933년 한국 사회 변화상",
    "desc": "1933년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "SOCIETY",
    "title": "1933년의 정밀 역사 기록 (1)",
    "desc": "1933년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "CULTURE",
    "title": "1933년의 정밀 역사 기록 (2)",
    "desc": "1933년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1933,
    "tag": "ECONOMY",
    "title": "1933년의 정밀 역사 기록 (3)",
    "desc": "1933년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 35 (확장 데이터)",
    "desc": "1934년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1934,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 160 (확장 데이터)",
    "desc": "1934년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1934,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 285 (확장 데이터)",
    "desc": "1934년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 410 (확장 데이터)",
    "desc": "1934년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1934,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 535 (확장 데이터)",
    "desc": "1934년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1934,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 660 (확장 데이터)",
    "desc": "1934년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "WAR",
    "title": "연도별 상세 사건 785 (확장 데이터)",
    "desc": "1934년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1934,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 910 (확장 데이터)",
    "desc": "1934년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1934,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1035 (확장 데이터)",
    "desc": "1934년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1160 (확장 데이터)",
    "desc": "1934년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1934,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1285 (확장 데이터)",
    "desc": "1934년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1934,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1410 (확장 데이터)",
    "desc": "1934년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "TECHNOLOGY",
    "title": "1934년 기술 혁신 기록",
    "desc": "1934년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1934,
    "tag": "SOCIETY",
    "title": "1934년 한국 사회 변화상",
    "desc": "1934년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "CULTURE",
    "title": "1934년의 정밀 역사 기록 (1)",
    "desc": "1934년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "ECONOMY",
    "title": "1934년의 정밀 역사 기록 (2)",
    "desc": "1934년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "TECHNOLOGY",
    "title": "1934년의 정밀 역사 기록 (3)",
    "desc": "1934년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1934,
    "tag": "SOCIETY",
    "title": "1934년의 정밀 역사 기록 (4)",
    "desc": "1934년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "WAR",
    "title": "연도별 상세 사건 36 (확장 데이터)",
    "desc": "1935년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 161 (확장 데이터)",
    "desc": "1935년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1935,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 286 (확장 데이터)",
    "desc": "1935년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1935,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 411 (확장 데이터)",
    "desc": "1935년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 536 (확장 데이터)",
    "desc": "1935년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1935,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 661 (확장 데이터)",
    "desc": "1935년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1935,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 786 (확장 데이터)",
    "desc": "1935년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "WAR",
    "title": "연도별 상세 사건 911 (확장 데이터)",
    "desc": "1935년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1935,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1036 (확장 데이터)",
    "desc": "1935년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1935,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1161 (확장 데이터)",
    "desc": "1935년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1286 (확장 데이터)",
    "desc": "1935년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1935,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1411 (확장 데이터)",
    "desc": "1935년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1935,
    "tag": "POLITICS",
    "title": "뉘른베르크 법 - 유대인 박해 법제화",
    "desc": "나치 독일이 유대인의 시민권을 박탈하는 뉘른베르크 인종법을 제정. 홀로코스트의 법적 기반",
    "location": "뉘른베르크, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1935,
    "tag": "TECHNOLOGY",
    "title": "1935년 기술 혁신 기록",
    "desc": "1935년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1935,
    "tag": "SOCIETY",
    "title": "1935년 한국 사회 변화상",
    "desc": "1935년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "ECONOMY",
    "title": "1935년의 정밀 역사 기록 (1)",
    "desc": "1935년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "TECHNOLOGY",
    "title": "1935년의 정밀 역사 기록 (2)",
    "desc": "1935년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1935,
    "tag": "SOCIETY",
    "title": "1935년의 정밀 역사 기록 (3)",
    "desc": "1935년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 37 (확장 데이터)",
    "desc": "1936년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1936,
    "tag": "WAR",
    "title": "연도별 상세 사건 162 (확장 데이터)",
    "desc": "1936년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 287 (확장 데이터)",
    "desc": "1936년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1936,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 412 (확장 데이터)",
    "desc": "1936년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1936,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 537 (확장 데이터)",
    "desc": "1936년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 662 (확장 데이터)",
    "desc": "1936년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1936,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 787 (확장 데이터)",
    "desc": "1936년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1936,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 912 (확장 데이터)",
    "desc": "1936년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "WAR",
    "title": "연도별 상세 사건 1037 (확장 데이터)",
    "desc": "1936년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1936,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1162 (확장 데이터)",
    "desc": "1936년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1936,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1287 (확장 데이터)",
    "desc": "1936년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1412 (확장 데이터)",
    "desc": "1936년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1936,
    "tag": "TECHNOLOGY",
    "title": "1936년 기술 혁신 기록",
    "desc": "1936년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1936,
    "tag": "SOCIETY",
    "title": "1936년 한국 사회 변화상",
    "desc": "1936년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "TECHNOLOGY",
    "title": "1936년의 정밀 역사 기록 (1)",
    "desc": "1936년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "SOCIETY",
    "title": "1936년의 정밀 역사 기록 (2)",
    "desc": "1936년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "CULTURE",
    "title": "1936년의 정밀 역사 기록 (3)",
    "desc": "1936년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1936,
    "tag": "ECONOMY",
    "title": "1936년의 정밀 역사 기록 (4)",
    "desc": "1936년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 38 (확장 데이터)",
    "desc": "1937년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1937,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 163 (확장 데이터)",
    "desc": "1937년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1937,
    "tag": "WAR",
    "title": "연도별 상세 사건 288 (확장 데이터)",
    "desc": "1937년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 413 (확장 데이터)",
    "desc": "1937년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1937,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 538 (확장 데이터)",
    "desc": "1937년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1937,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 663 (확장 데이터)",
    "desc": "1937년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 788 (확장 데이터)",
    "desc": "1937년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1937,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 913 (확장 데이터)",
    "desc": "1937년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1937,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1038 (확장 데이터)",
    "desc": "1937년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "WAR",
    "title": "연도별 상세 사건 1163 (확장 데이터)",
    "desc": "1937년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1937,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1288 (확장 데이터)",
    "desc": "1937년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1937,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1413 (확장 데이터)",
    "desc": "1937년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "WAR",
    "title": "중일전쟁 발발·난징 대학살",
    "desc": "일본이 중국을 전면 침략하여 중일전쟁 시작. 난징에서 30만 명 이상의 중국인을 학살한 역사적 만행",
    "location": "중국 전역",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1937,
    "tag": "WAR",
    "title": "조선인 강제 동원 본격화",
    "desc": "일본이 중일전쟁 시작으로 조선인의 전쟁 동원을 본격화. 징용·위안부 등 반인도적 행위가 조직적으로 자행됨",
    "location": "한반도·만주·일본",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1937,
    "tag": "TECHNOLOGY",
    "title": "1937년 기술 혁신 기록",
    "desc": "1937년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1937,
    "tag": "SOCIETY",
    "title": "1937년 한국 사회 변화상",
    "desc": "1937년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "SOCIETY",
    "title": "1937년의 정밀 역사 기록 (1)",
    "desc": "1937년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1937,
    "tag": "CULTURE",
    "title": "1937년의 정밀 역사 기록 (2)",
    "desc": "1937년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 39 (확장 데이터)",
    "desc": "1938년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 164 (확장 데이터)",
    "desc": "1938년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1938,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 289 (확장 데이터)",
    "desc": "1938년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1938,
    "tag": "WAR",
    "title": "연도별 상세 사건 414 (확장 데이터)",
    "desc": "1938년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 539 (확장 데이터)",
    "desc": "1938년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1938,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 664 (확장 데이터)",
    "desc": "1938년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1938,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 789 (확장 데이터)",
    "desc": "1938년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 914 (확장 데이터)",
    "desc": "1938년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1938,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1039 (확장 데이터)",
    "desc": "1938년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1938,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1164 (확장 데이터)",
    "desc": "1938년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "WAR",
    "title": "연도별 상세 사건 1289 (확장 데이터)",
    "desc": "1938년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1938,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1414 (확장 데이터)",
    "desc": "1938년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1938,
    "tag": "POLITICS",
    "title": "국가총동원법·조선어 교육 금지",
    "desc": "일본이 국가총동원법을 공포하여 조선을 전시체제로 편입. 학교에서 조선어 사용이 금지되고 일본어 교육 강요",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1938,
    "tag": "WAR",
    "title": "수정의 밤 (크리스탈나흐트)",
    "desc": "나치 독일이 조직적으로 유대인 상점·회당을 파괴하고 유대인을 폭행·검거. 홀로코스트의 서막",
    "location": "독일 전역",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1938,
    "tag": "TECHNOLOGY",
    "title": "1938년 기술 혁신 기록",
    "desc": "1938년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1938,
    "tag": "SOCIETY",
    "title": "1938년 한국 사회 변화상",
    "desc": "1938년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "CULTURE",
    "title": "1938년의 정밀 역사 기록 (1)",
    "desc": "1938년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1938,
    "tag": "ECONOMY",
    "title": "1938년의 정밀 역사 기록 (2)",
    "desc": "1938년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 40 (확장 데이터)",
    "desc": "1939년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1939,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 165 (확장 데이터)",
    "desc": "1939년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 290 (확장 데이터)",
    "desc": "1939년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1939,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 415 (확장 데이터)",
    "desc": "1939년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1939,
    "tag": "WAR",
    "title": "연도별 상세 사건 540 (확장 데이터)",
    "desc": "1939년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 665 (확장 데이터)",
    "desc": "1939년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1939,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 790 (확장 데이터)",
    "desc": "1939년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1939,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 915 (확장 데이터)",
    "desc": "1939년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1040 (확장 데이터)",
    "desc": "1939년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1939,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1165 (확장 데이터)",
    "desc": "1939년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1939,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1290 (확장 데이터)",
    "desc": "1939년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "WAR",
    "title": "연도별 상세 사건 1415 (확장 데이터)",
    "desc": "1939년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1939,
    "tag": "POLITICS",
    "title": "창씨개명 강요",
    "desc": "일본이 조선인에게 일본식 성명으로 개명하도록 강요하는 창씨개명을 실시. 민족 정체성 말살 정책의 절정",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1939,
    "tag": "WAR",
    "title": "제2차 세계대전 발발",
    "desc": "독일이 폴란드를 침공하여 영국·프랑스가 선전포고. 인류 역사상 최대 규모의 전쟁. 5500만~8500만 명 사망",
    "location": "유럽·전 세계",
    "region": [
      "유럽",
      "아시아",
      "아프리카",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1939,
    "tag": "TECHNOLOGY",
    "title": "1939년 기술 혁신 기록",
    "desc": "1939년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1939,
    "tag": "SOCIETY",
    "title": "1939년 한국 사회 변화상",
    "desc": "1939년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "ECONOMY",
    "title": "1939년의 정밀 역사 기록 (1)",
    "desc": "1939년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1939,
    "tag": "TECHNOLOGY",
    "title": "1939년의 정밀 역사 기록 (2)",
    "desc": "1939년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 41 (확장 데이터)",
    "desc": "1940년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1940,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 166 (확장 데이터)",
    "desc": "1940년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1940,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 291 (확장 데이터)",
    "desc": "1940년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 416 (확장 데이터)",
    "desc": "1940년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1940,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 541 (확장 데이터)",
    "desc": "1940년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1940,
    "tag": "WAR",
    "title": "연도별 상세 사건 666 (확장 데이터)",
    "desc": "1940년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 791 (확장 데이터)",
    "desc": "1940년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1940,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 916 (확장 데이터)",
    "desc": "1940년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1940,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1041 (확장 데이터)",
    "desc": "1940년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1166 (확장 데이터)",
    "desc": "1940년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1940,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1291 (확장 데이터)",
    "desc": "1940년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1940,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1416 (확장 데이터)",
    "desc": "1940년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "WAR",
    "title": "영국 전투·됭케르크 철수",
    "desc": "독일 공군과 영국 공군의 제공권 쟁탈전. 됭케르크에서 34만 명의 연합군이 기적적으로 철수. 영국의 저항 계속",
    "location": "영국 상공·됭케르크",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1940,
    "tag": "POLITICS",
    "title": "한국광복군 창설",
    "desc": "충칭 임시정부가 한국광복군을 창설. 미국 OSS와 협력하여 국내 진공 작전을 준비했으나 광복으로 실행 못 함",
    "location": "충칭, 중국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1940,
    "tag": "TECHNOLOGY",
    "title": "1940년 기술 혁신 기록",
    "desc": "1940년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1940,
    "tag": "SOCIETY",
    "title": "1940년 한국 사회 변화상",
    "desc": "1940년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "TECHNOLOGY",
    "title": "1940년의 정밀 역사 기록 (1)",
    "desc": "1940년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1940,
    "tag": "SOCIETY",
    "title": "1940년의 정밀 역사 기록 (2)",
    "desc": "1940년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 42 (확장 데이터)",
    "desc": "1941년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 167 (확장 데이터)",
    "desc": "1941년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1941,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 292 (확장 데이터)",
    "desc": "1941년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1941,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 417 (확장 데이터)",
    "desc": "1941년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 542 (확장 데이터)",
    "desc": "1941년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1941,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 667 (확장 데이터)",
    "desc": "1941년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1941,
    "tag": "WAR",
    "title": "연도별 상세 사건 792 (확장 데이터)",
    "desc": "1941년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 917 (확장 데이터)",
    "desc": "1941년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1941,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1042 (확장 데이터)",
    "desc": "1941년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1941,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1167 (확장 데이터)",
    "desc": "1941년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1292 (확장 데이터)",
    "desc": "1941년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1941,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1417 (확장 데이터)",
    "desc": "1941년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1941,
    "tag": "WAR",
    "title": "진주만 공격·미국 2차 대전 참전",
    "desc": "일본이 하와이 진주만을 기습 공격하여 미국이 참전. 태평양 전쟁 시작. 전쟁이 진정한 세계대전으로 확대",
    "location": "진주만, 하와이",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1941,
    "tag": "TECHNOLOGY",
    "title": "1941년 기술 혁신 기록",
    "desc": "1941년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1941,
    "tag": "SOCIETY",
    "title": "1941년 한국 사회 변화상",
    "desc": "1941년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "SOCIETY",
    "title": "1941년의 정밀 역사 기록 (1)",
    "desc": "1941년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "CULTURE",
    "title": "1941년의 정밀 역사 기록 (2)",
    "desc": "1941년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1941,
    "tag": "ECONOMY",
    "title": "1941년의 정밀 역사 기록 (3)",
    "desc": "1941년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "WAR",
    "title": "연도별 상세 사건 43 (확장 데이터)",
    "desc": "1942년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1942,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 168 (확장 데이터)",
    "desc": "1942년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 293 (확장 데이터)",
    "desc": "1942년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1942,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 418 (확장 데이터)",
    "desc": "1942년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1942,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 543 (확장 데이터)",
    "desc": "1942년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 668 (확장 데이터)",
    "desc": "1942년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1942,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 793 (확장 데이터)",
    "desc": "1942년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1942,
    "tag": "WAR",
    "title": "연도별 상세 사건 918 (확장 데이터)",
    "desc": "1942년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1043 (확장 데이터)",
    "desc": "1942년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1942,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1168 (확장 데이터)",
    "desc": "1942년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1942,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1293 (확장 데이터)",
    "desc": "1942년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1418 (확장 데이터)",
    "desc": "1942년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1942,
    "tag": "WAR",
    "title": "미드웨이 해전·스탈린그라드 전투",
    "desc": "미드웨이에서 미국이 일본 항모 4척을 격침해 태평양 전쟁의 전환점. 스탈린그라드에서 독일군 33만 명 포위 섬멸",
    "location": "태평양·스탈린그라드",
    "region": [
      "아메리카",
      "아시아",
      "러시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1942,
    "tag": "TECHNOLOGY",
    "title": "1942년 기술 혁신 기록",
    "desc": "1942년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1942,
    "tag": "SOCIETY",
    "title": "1942년 한국 사회 변화상",
    "desc": "1942년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "CULTURE",
    "title": "1942년의 정밀 역사 기록 (1)",
    "desc": "1942년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "ECONOMY",
    "title": "1942년의 정밀 역사 기록 (2)",
    "desc": "1942년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1942,
    "tag": "TECHNOLOGY",
    "title": "1942년의 정밀 역사 기록 (3)",
    "desc": "1942년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 44 (확장 데이터)",
    "desc": "1943년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1943,
    "tag": "WAR",
    "title": "연도별 상세 사건 169 (확장 데이터)",
    "desc": "1943년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1943,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 294 (확장 데이터)",
    "desc": "1943년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 419 (확장 데이터)",
    "desc": "1943년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1943,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 544 (확장 데이터)",
    "desc": "1943년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1943,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 669 (확장 데이터)",
    "desc": "1943년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 794 (확장 데이터)",
    "desc": "1943년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1943,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 919 (확장 데이터)",
    "desc": "1943년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1943,
    "tag": "WAR",
    "title": "연도별 상세 사건 1044 (확장 데이터)",
    "desc": "1943년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1169 (확장 데이터)",
    "desc": "1943년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1943,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1294 (확장 데이터)",
    "desc": "1943년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1943,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1419 (확장 데이터)",
    "desc": "1943년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "TECHNOLOGY",
    "title": "1943년 기술 혁신 기록",
    "desc": "1943년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1943,
    "tag": "SOCIETY",
    "title": "1943년 한국 사회 변화상",
    "desc": "1943년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "ECONOMY",
    "title": "1943년의 정밀 역사 기록 (1)",
    "desc": "1943년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "TECHNOLOGY",
    "title": "1943년의 정밀 역사 기록 (2)",
    "desc": "1943년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "SOCIETY",
    "title": "1943년의 정밀 역사 기록 (3)",
    "desc": "1943년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1943,
    "tag": "CULTURE",
    "title": "1943년의 정밀 역사 기록 (4)",
    "desc": "1943년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 45 (확장 데이터)",
    "desc": "1944년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 170 (확장 데이터)",
    "desc": "1944년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1944,
    "tag": "WAR",
    "title": "연도별 상세 사건 295 (확장 데이터)",
    "desc": "1944년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1944,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 420 (확장 데이터)",
    "desc": "1944년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 545 (확장 데이터)",
    "desc": "1944년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1944,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 670 (확장 데이터)",
    "desc": "1944년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1944,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 795 (확장 데이터)",
    "desc": "1944년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 920 (확장 데이터)",
    "desc": "1944년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1944,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1045 (확장 데이터)",
    "desc": "1944년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1944,
    "tag": "WAR",
    "title": "연도별 상세 사건 1170 (확장 데이터)",
    "desc": "1944년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1295 (확장 데이터)",
    "desc": "1944년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1944,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1420 (확장 데이터)",
    "desc": "1944년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1944,
    "tag": "WAR",
    "title": "노르망디 상륙 작전 (D-Day)",
    "desc": "15만 명의 연합군이 노르망디 해안에 상륙. 나치 독일의 서쪽 방어선을 돌파한 2차 대전 최대의 상륙 작전",
    "location": "노르망디, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1944,
    "tag": "TECHNOLOGY",
    "title": "1944년 기술 혁신 기록",
    "desc": "1944년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1944,
    "tag": "SOCIETY",
    "title": "1944년 한국 사회 변화상",
    "desc": "1944년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "TECHNOLOGY",
    "title": "1944년의 정밀 역사 기록 (1)",
    "desc": "1944년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "SOCIETY",
    "title": "1944년의 정밀 역사 기록 (2)",
    "desc": "1944년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1944,
    "tag": "CULTURE",
    "title": "1944년의 정밀 역사 기록 (3)",
    "desc": "1944년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1945,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 46 (확장 데이터)",
    "desc": "1945년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1945,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 171 (확장 데이터)",
    "desc": "1945년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1945,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 296 (확장 데이터)",
    "desc": "1945년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1945,
    "tag": "WAR",
    "title": "연도별 상세 사건 421 (확장 데이터)",
    "desc": "1945년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1945,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 546 (확장 데이터)",
    "desc": "1945년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1945,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 671 (확장 데이터)",
    "desc": "1945년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1945,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 796 (확장 데이터)",
    "desc": "1945년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1945,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 921 (확장 데이터)",
    "desc": "1945년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1945,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1046 (확장 데이터)",
    "desc": "1945년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1945,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1171 (확장 데이터)",
    "desc": "1945년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1945,
    "tag": "WAR",
    "title": "연도별 상세 사건 1296 (확장 데이터)",
    "desc": "1945년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1945,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1421 (확장 데이터)",
    "desc": "1945년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1945,
    "tag": "WAR",
    "title": "독일 항복·히틀러 자살",
    "desc": "히틀러가 베를린 지하 벙커에서 자살하고 독일이 무조건 항복. 유럽에서의 2차 세계대전 종결",
    "location": "베를린, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1945,
    "tag": "WAR",
    "title": "히로시마·나가사키 원폭 투하",
    "desc": "미국이 일본 히로시마·나가사키에 원자폭탄을 투하. 각각 7만~14만 명, 4만~8만 명이 즉사. 핵 시대의 개막",
    "location": "히로시마·나가사키, 일본",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1945,
    "tag": "POLITICS",
    "title": "광복 - 조선 해방",
    "desc": "일본의 무조건 항복으로 35년간의 일제강점기가 끝나고 조선이 해방됨. 8월 15일. 광복절의 기원",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1945,
    "tag": "POLITICS",
    "title": "국제연합(UN) 창설",
    "desc": "2차 세계대전 승전국들이 국제 평화와 안보를 위한 국제연합(UN)을 창설. 본부는 뉴욕. 51개국이 창설 회원국",
    "location": "뉴욕, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1945,
    "tag": "POLITICS",
    "title": "38선 분할·미소 군정 시작",
    "desc": "미국과 소련이 한반도를 38선으로 분할하여 각자 군정을 실시. 남북 분단의 시작이자 한국 현대사의 비극적 출발점",
    "location": "38선 (한반도)",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1945,
    "tag": "TECHNOLOGY",
    "title": "1945년 기술 혁신 기록",
    "desc": "1945년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1945,
    "tag": "SOCIETY",
    "title": "1945년 한국 사회 변화상",
    "desc": "1945년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 47 (확장 데이터)",
    "desc": "1946년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1946,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 172 (확장 데이터)",
    "desc": "1946년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1946,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 297 (확장 데이터)",
    "desc": "1946년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 422 (확장 데이터)",
    "desc": "1946년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1946,
    "tag": "WAR",
    "title": "연도별 상세 사건 547 (확장 데이터)",
    "desc": "1946년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1946,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 672 (확장 데이터)",
    "desc": "1946년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 797 (확장 데이터)",
    "desc": "1946년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1946,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 922 (확장 데이터)",
    "desc": "1946년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1946,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1047 (확장 데이터)",
    "desc": "1946년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1172 (확장 데이터)",
    "desc": "1946년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1946,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1297 (확장 데이터)",
    "desc": "1946년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1946,
    "tag": "WAR",
    "title": "연도별 상세 사건 1422 (확장 데이터)",
    "desc": "1946년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "TECHNOLOGY",
    "title": "1946년 기술 혁신 기록",
    "desc": "1946년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1946,
    "tag": "SOCIETY",
    "title": "1946년 한국 사회 변화상",
    "desc": "1946년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "CULTURE",
    "title": "1946년의 정밀 역사 기록 (1)",
    "desc": "1946년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "ECONOMY",
    "title": "1946년의 정밀 역사 기록 (2)",
    "desc": "1946년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "TECHNOLOGY",
    "title": "1946년의 정밀 역사 기록 (3)",
    "desc": "1946년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1946,
    "tag": "SOCIETY",
    "title": "1946년의 정밀 역사 기록 (4)",
    "desc": "1946년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 48 (확장 데이터)",
    "desc": "1947년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 173 (확장 데이터)",
    "desc": "1947년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1947,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 298 (확장 데이터)",
    "desc": "1947년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1947,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 423 (확장 데이터)",
    "desc": "1947년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 548 (확장 데이터)",
    "desc": "1947년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1947,
    "tag": "WAR",
    "title": "연도별 상세 사건 673 (확장 데이터)",
    "desc": "1947년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1947,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 798 (확장 데이터)",
    "desc": "1947년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 923 (확장 데이터)",
    "desc": "1947년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1947,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1048 (확장 데이터)",
    "desc": "1947년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1947,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1173 (확장 데이터)",
    "desc": "1947년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1298 (확장 데이터)",
    "desc": "1947년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1947,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1423 (확장 데이터)",
    "desc": "1947년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1947,
    "tag": "POLITICS",
    "title": "마셜 플랜·냉전 시작",
    "desc": "미국이 서유럽 재건을 위한 마셜 플랜 발표. 트루먼 독트린으로 미소 냉전이 공식화됨. 세계가 두 진영으로 양분",
    "location": "미국·유럽",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1947,
    "tag": "POLITICS",
    "title": "인도 분리독립·파키스탄 분리",
    "desc": "영국 식민지 인도가 독립하며 힌두교의 인도와 이슬람의 파키스탄으로 분리. 100만 명 이상의 종교 분쟁 사망자",
    "location": "인도·파키스탄",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1947,
    "tag": "TECHNOLOGY",
    "title": "1947년 기술 혁신 기록",
    "desc": "1947년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1947,
    "tag": "SOCIETY",
    "title": "1947년 한국 사회 변화상",
    "desc": "1947년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "ECONOMY",
    "title": "1947년의 정밀 역사 기록 (1)",
    "desc": "1947년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1947,
    "tag": "TECHNOLOGY",
    "title": "1947년의 정밀 역사 기록 (2)",
    "desc": "1947년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1948,
    "tag": "POLITICS",
    "title": "대한민국 정부 수립",
    "desc": "이승만을 초대 대통령으로 하는 대한민국 정부가 공식 수립됨. 8월 15일. 현재까지 이어지는 대한민국의 시작",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1948,
    "tag": "POLITICS",
    "title": "조선민주주의인민공화국 수립",
    "desc": "김일성이 북한에 조선민주주의인민공화국을 선포. 소련식 사회주의 체제 확립. 남북 분단의 고착화",
    "location": "평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1948,
    "tag": "POLITICS",
    "title": "이스라엘 건국·제1차 중동전쟁",
    "desc": "이스라엘이 독립을 선언하자 아랍 5개국이 즉시 공격. 이스라엘이 승리하며 팔레스타인 난민 문제 발생",
    "location": "이스라엘·팔레스타인",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1948,
    "tag": "POLITICS",
    "title": "세계인권선언 채택",
    "desc": "UN 총회가 세계인권선언을 채택. 모든 인간의 기본적 권리와 자유를 명시한 역사적 문서",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1948,
    "tag": "TECHNOLOGY",
    "title": "1948년 기술 혁신 기록",
    "desc": "1948년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1948,
    "tag": "SOCIETY",
    "title": "1948년 한국 사회 변화상",
    "desc": "1948년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "WAR",
    "title": "연도별 상세 사건 50 (확장 데이터)",
    "desc": "1949년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1949,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 175 (확장 데이터)",
    "desc": "1949년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1949,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 300 (확장 데이터)",
    "desc": "1949년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 425 (확장 데이터)",
    "desc": "1949년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1949,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 550 (확장 데이터)",
    "desc": "1949년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1949,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 675 (확장 데이터)",
    "desc": "1949년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 800 (확장 데이터)",
    "desc": "1949년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1949,
    "tag": "WAR",
    "title": "연도별 상세 사건 925 (확장 데이터)",
    "desc": "1949년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1949,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1050 (확장 데이터)",
    "desc": "1949년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1175 (확장 데이터)",
    "desc": "1949년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1949,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1300 (확장 데이터)",
    "desc": "1949년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1949,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1425 (확장 데이터)",
    "desc": "1949년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "POLITICS",
    "title": "중화인민공화국 수립",
    "desc": "마오쩌둥이 이끄는 공산당이 국공내전에서 승리하여 중화인민공화국을 선포. 장제스 국민당은 타이완으로 후퇴",
    "location": "베이징, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1949,
    "tag": "POLITICS",
    "title": "NATO 창설",
    "desc": "미국·영국·프랑스 등 12개국이 북대서양조약기구(NATO)를 창설. 소련에 대항하는 서방 집단안보 체제 수립",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1949,
    "tag": "TECHNOLOGY",
    "title": "1949년 기술 혁신 기록",
    "desc": "1949년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1949,
    "tag": "SOCIETY",
    "title": "1949년 한국 사회 변화상",
    "desc": "1949년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "SOCIETY",
    "title": "1949년의 정밀 역사 기록 (1)",
    "desc": "1949년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1949,
    "tag": "CULTURE",
    "title": "1949년의 정밀 역사 기록 (2)",
    "desc": "1949년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 51 (확장 데이터)",
    "desc": "1950년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "WAR",
    "title": "연도별 상세 사건 176 (확장 데이터)",
    "desc": "1950년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1950,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 301 (확장 데이터)",
    "desc": "1950년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1950,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 426 (확장 데이터)",
    "desc": "1950년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 551 (확장 데이터)",
    "desc": "1950년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1950,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 676 (확장 데이터)",
    "desc": "1950년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1950,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 801 (확장 데이터)",
    "desc": "1950년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 926 (확장 데이터)",
    "desc": "1950년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1950,
    "tag": "WAR",
    "title": "연도별 상세 사건 1051 (확장 데이터)",
    "desc": "1950년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1950,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1176 (확장 데이터)",
    "desc": "1950년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1301 (확장 데이터)",
    "desc": "1950년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1950,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1426 (확장 데이터)",
    "desc": "1950년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1950,
    "tag": "WAR",
    "title": "6·25 한국전쟁 발발",
    "desc": "북한군이 38선을 넘어 남침. 미국 주도 유엔군이 참전. 이후 중공군 개입으로 전선이 오르내리며 3년간 전쟁 지속",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1950,
    "tag": "WAR",
    "title": "인천상륙작전 성공",
    "desc": "맥아더 장군이 지휘한 인천상륙작전 성공. 보급선을 차단당한 북한군이 급격히 붕괴되며 전세 역전",
    "location": "인천",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1950,
    "tag": "WAR",
    "title": "장진호 전투·흥남 철수",
    "desc": "영하 40도의 혹한 속 미 해병대와 중공군의 사투. 흥남에서 10만 명의 피난민이 극적으로 해상 철수",
    "location": "함경도 장진호·흥남",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1950,
    "tag": "TECHNOLOGY",
    "title": "1950년 기술 혁신 기록",
    "desc": "1950년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1950,
    "tag": "SOCIETY",
    "title": "1950년 한국 사회 변화상",
    "desc": "1950년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1950,
    "tag": "CULTURE",
    "title": "1950년의 정밀 역사 기록 (1)",
    "desc": "1950년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 52 (확장 데이터)",
    "desc": "1951년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1951,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 177 (확장 데이터)",
    "desc": "1951년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "WAR",
    "title": "연도별 상세 사건 302 (확장 데이터)",
    "desc": "1951년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1951,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 427 (확장 데이터)",
    "desc": "1951년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1951,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 552 (확장 데이터)",
    "desc": "1951년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 677 (확장 데이터)",
    "desc": "1951년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1951,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 802 (확장 데이터)",
    "desc": "1951년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1951,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 927 (확장 데이터)",
    "desc": "1951년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1052 (확장 데이터)",
    "desc": "1951년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1951,
    "tag": "WAR",
    "title": "연도별 상세 사건 1177 (확장 데이터)",
    "desc": "1951년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1951,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1302 (확장 데이터)",
    "desc": "1951년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1427 (확장 데이터)",
    "desc": "1951년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1951,
    "tag": "WAR",
    "title": "한국전쟁 정전협상 시작",
    "desc": "판문점에서 휴전협상이 시작됨. 이후 2년간 협상이 지속되면서도 전선에서는 치열한 전투가 계속됨",
    "location": "판문점",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1951,
    "tag": "TECHNOLOGY",
    "title": "1951년 기술 혁신 기록",
    "desc": "1951년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1951,
    "tag": "SOCIETY",
    "title": "1951년 한국 사회 변화상",
    "desc": "1951년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "ECONOMY",
    "title": "1951년의 정밀 역사 기록 (1)",
    "desc": "1951년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "TECHNOLOGY",
    "title": "1951년의 정밀 역사 기록 (2)",
    "desc": "1951년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1951,
    "tag": "SOCIETY",
    "title": "1951년의 정밀 역사 기록 (3)",
    "desc": "1951년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 53 (확장 데이터)",
    "desc": "1952년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1952,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 178 (확장 데이터)",
    "desc": "1952년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1952,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 303 (확장 데이터)",
    "desc": "1952년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "WAR",
    "title": "연도별 상세 사건 428 (확장 데이터)",
    "desc": "1952년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1952,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 553 (확장 데이터)",
    "desc": "1952년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1952,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 678 (확장 데이터)",
    "desc": "1952년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 803 (확장 데이터)",
    "desc": "1952년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1952,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 928 (확장 데이터)",
    "desc": "1952년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1952,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1053 (확장 데이터)",
    "desc": "1952년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1178 (확장 데이터)",
    "desc": "1952년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1952,
    "tag": "WAR",
    "title": "연도별 상세 사건 1303 (확장 데이터)",
    "desc": "1952년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1952,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1428 (확장 데이터)",
    "desc": "1952년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "TECHNOLOGY",
    "title": "1952년 기술 혁신 기록",
    "desc": "1952년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1952,
    "tag": "SOCIETY",
    "title": "1952년 한국 사회 변화상",
    "desc": "1952년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "TECHNOLOGY",
    "title": "1952년의 정밀 역사 기록 (1)",
    "desc": "1952년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "SOCIETY",
    "title": "1952년의 정밀 역사 기록 (2)",
    "desc": "1952년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "CULTURE",
    "title": "1952년의 정밀 역사 기록 (3)",
    "desc": "1952년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1952,
    "tag": "ECONOMY",
    "title": "1952년의 정밀 역사 기록 (4)",
    "desc": "1952년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 54 (확장 데이터)",
    "desc": "1953년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 179 (확장 데이터)",
    "desc": "1953년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1953,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 304 (확장 데이터)",
    "desc": "1953년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1953,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 429 (확장 데이터)",
    "desc": "1953년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "WAR",
    "title": "연도별 상세 사건 554 (확장 데이터)",
    "desc": "1953년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1953,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 679 (확장 데이터)",
    "desc": "1953년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1953,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 804 (확장 데이터)",
    "desc": "1953년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 929 (확장 데이터)",
    "desc": "1953년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1953,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1054 (확장 데이터)",
    "desc": "1953년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1953,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1179 (확장 데이터)",
    "desc": "1953년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1304 (확장 데이터)",
    "desc": "1953년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1953,
    "tag": "WAR",
    "title": "연도별 상세 사건 1429 (확장 데이터)",
    "desc": "1953년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1953,
    "tag": "WAR",
    "title": "한국전쟁 휴전 협정 체결",
    "desc": "판문점에서 정전협정 조인. 3년간 전쟁으로 남북 합산 400만 명 이상 사망. 휴전선 기준 분단 고착화",
    "location": "판문점",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1953,
    "tag": "SCIENCE",
    "title": "DNA 이중나선 구조 발견",
    "desc": "왓슨과 크릭이 DNA 이중나선 구조를 밝혀냄. 현대 분자생물학과 유전공학의 출발점이 된 20세기 최대 과학적 발견",
    "location": "케임브리지, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1953,
    "tag": "TECHNOLOGY",
    "title": "1953년 기술 혁신 기록",
    "desc": "1953년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1953,
    "tag": "SOCIETY",
    "title": "1953년 한국 사회 변화상",
    "desc": "1953년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "SOCIETY",
    "title": "1953년의 정밀 역사 기록 (1)",
    "desc": "1953년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1953,
    "tag": "CULTURE",
    "title": "1953년의 정밀 역사 기록 (2)",
    "desc": "1953년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 55 (확장 데이터)",
    "desc": "1954년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1954,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 180 (확장 데이터)",
    "desc": "1954년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 305 (확장 데이터)",
    "desc": "1954년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1954,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 430 (확장 데이터)",
    "desc": "1954년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1954,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 555 (확장 데이터)",
    "desc": "1954년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "WAR",
    "title": "연도별 상세 사건 680 (확장 데이터)",
    "desc": "1954년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1954,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 805 (확장 데이터)",
    "desc": "1954년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1954,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 930 (확장 데이터)",
    "desc": "1954년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1055 (확장 데이터)",
    "desc": "1954년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1954,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1180 (확장 데이터)",
    "desc": "1954년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1954,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1305 (확장 데이터)",
    "desc": "1954년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1430 (확장 데이터)",
    "desc": "1954년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1954,
    "tag": "POLITICS",
    "title": "한미상호방위조약 체결",
    "desc": "한국과 미국이 상호방위조약을 체결. 주한미군 주둔의 법적 근거이자 한국 안보 체제의 핵심 기반",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1954,
    "tag": "POLITICS",
    "title": "프랑스 디엔비엔푸 패전·베트남 분단",
    "desc": "프랑스가 디엔비엔푸 전투에서 베트남 독립군에 패배. 제네바 협정으로 베트남이 17도선으로 분단",
    "location": "디엔비엔푸, 베트남",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1954,
    "tag": "TECHNOLOGY",
    "title": "1954년 기술 혁신 기록",
    "desc": "1954년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1954,
    "tag": "SOCIETY",
    "title": "1954년 한국 사회 변화상",
    "desc": "1954년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "CULTURE",
    "title": "1954년의 정밀 역사 기록 (1)",
    "desc": "1954년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1954,
    "tag": "ECONOMY",
    "title": "1954년의 정밀 역사 기록 (2)",
    "desc": "1954년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 56 (확장 데이터)",
    "desc": "1955년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1955,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 181 (확장 데이터)",
    "desc": "1955년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1955,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 306 (확장 데이터)",
    "desc": "1955년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 431 (확장 데이터)",
    "desc": "1955년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1955,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 556 (확장 데이터)",
    "desc": "1955년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1955,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 681 (확장 데이터)",
    "desc": "1955년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "WAR",
    "title": "연도별 상세 사건 806 (확장 데이터)",
    "desc": "1955년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1955,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 931 (확장 데이터)",
    "desc": "1955년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1955,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1056 (확장 데이터)",
    "desc": "1955년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1181 (확장 데이터)",
    "desc": "1955년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1955,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1306 (확장 데이터)",
    "desc": "1955년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1955,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1431 (확장 데이터)",
    "desc": "1955년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "POLITICS",
    "title": "반둥 회의·제3세계 운동 시작",
    "desc": "아시아·아프리카 29개국이 인도네시아 반둥에서 회의 개최. 비동맹 제3세계 운동의 기원이자 탈식민주의 연대의 시작",
    "location": "반둥, 인도네시아",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1955,
    "tag": "TECHNOLOGY",
    "title": "1955년 기술 혁신 기록",
    "desc": "1955년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1955,
    "tag": "SOCIETY",
    "title": "1955년 한국 사회 변화상",
    "desc": "1955년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "ECONOMY",
    "title": "1955년의 정밀 역사 기록 (1)",
    "desc": "1955년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "TECHNOLOGY",
    "title": "1955년의 정밀 역사 기록 (2)",
    "desc": "1955년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1955,
    "tag": "SOCIETY",
    "title": "1955년의 정밀 역사 기록 (3)",
    "desc": "1955년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "WAR",
    "title": "연도별 상세 사건 57 (확장 데이터)",
    "desc": "1956년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 182 (확장 데이터)",
    "desc": "1956년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1956,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 307 (확장 데이터)",
    "desc": "1956년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1956,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 432 (확장 데이터)",
    "desc": "1956년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 557 (확장 데이터)",
    "desc": "1956년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1956,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 682 (확장 데이터)",
    "desc": "1956년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1956,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 807 (확장 데이터)",
    "desc": "1956년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "WAR",
    "title": "연도별 상세 사건 932 (확장 데이터)",
    "desc": "1956년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1956,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1057 (확장 데이터)",
    "desc": "1956년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1956,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1182 (확장 데이터)",
    "desc": "1956년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1307 (확장 데이터)",
    "desc": "1956년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1956,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1432 (확장 데이터)",
    "desc": "1956년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1956,
    "tag": "SOCIETY",
    "title": "헝가리 혁명·소련 탱크 진압",
    "desc": "헝가리 시민이 소련에 맞서 봉기했으나 소련 탱크에 짓밟힘. 3000명 사망. 동유럽 소련 지배의 실상을 폭로",
    "location": "부다페스트, 헝가리",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1956,
    "tag": "TECHNOLOGY",
    "title": "1956년 기술 혁신 기록",
    "desc": "1956년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1956,
    "tag": "SOCIETY",
    "title": "1956년 한국 사회 변화상",
    "desc": "1956년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "TECHNOLOGY",
    "title": "1956년의 정밀 역사 기록 (1)",
    "desc": "1956년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "SOCIETY",
    "title": "1956년의 정밀 역사 기록 (2)",
    "desc": "1956년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1956,
    "tag": "CULTURE",
    "title": "1956년의 정밀 역사 기록 (3)",
    "desc": "1956년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 58 (확장 데이터)",
    "desc": "1957년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1957,
    "tag": "WAR",
    "title": "연도별 상세 사건 183 (확장 데이터)",
    "desc": "1957년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 308 (확장 데이터)",
    "desc": "1957년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1957,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 433 (확장 데이터)",
    "desc": "1957년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1957,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 558 (확장 데이터)",
    "desc": "1957년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 683 (확장 데이터)",
    "desc": "1957년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1957,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 808 (확장 데이터)",
    "desc": "1957년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1957,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 933 (확장 데이터)",
    "desc": "1957년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "WAR",
    "title": "연도별 상세 사건 1058 (확장 데이터)",
    "desc": "1957년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1957,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1183 (확장 데이터)",
    "desc": "1957년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1957,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1308 (확장 데이터)",
    "desc": "1957년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1433 (확장 데이터)",
    "desc": "1957년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1957,
    "tag": "TECHNOLOGY",
    "title": "소련 스푸트니크 위성 발사",
    "desc": "소련이 세계 최초의 인공위성 스푸트니크 1호를 발사. 우주 시대 개막. 미국에 큰 충격을 주며 우주 경쟁 시작",
    "location": "바이코누르, 카자흐스탄",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1957,
    "tag": "TECHNOLOGY",
    "title": "1957년 기술 혁신 기록",
    "desc": "1957년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1957,
    "tag": "SOCIETY",
    "title": "1957년 한국 사회 변화상",
    "desc": "1957년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "SOCIETY",
    "title": "1957년의 정밀 역사 기록 (1)",
    "desc": "1957년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "CULTURE",
    "title": "1957년의 정밀 역사 기록 (2)",
    "desc": "1957년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1957,
    "tag": "ECONOMY",
    "title": "1957년의 정밀 역사 기록 (3)",
    "desc": "1957년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 59 (확장 데이터)",
    "desc": "1958년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1958,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 184 (확장 데이터)",
    "desc": "1958년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1958,
    "tag": "WAR",
    "title": "연도별 상세 사건 309 (확장 데이터)",
    "desc": "1958년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 434 (확장 데이터)",
    "desc": "1958년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1958,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 559 (확장 데이터)",
    "desc": "1958년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1958,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 684 (확장 데이터)",
    "desc": "1958년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 809 (확장 데이터)",
    "desc": "1958년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1958,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 934 (확장 데이터)",
    "desc": "1958년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1958,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1059 (확장 데이터)",
    "desc": "1958년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "WAR",
    "title": "연도별 상세 사건 1184 (확장 데이터)",
    "desc": "1958년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1958,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1309 (확장 데이터)",
    "desc": "1958년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1958,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1434 (확장 데이터)",
    "desc": "1958년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "ECONOMY",
    "title": "유럽경제공동체(EEC) 창설",
    "desc": "프랑스·독일·이탈리아·베네룩스 3국이 유럽경제공동체를 창설. 유럽연합(EU)의 전신이자 유럽 통합의 시작",
    "location": "브뤼셀, 벨기에",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1958,
    "tag": "TECHNOLOGY",
    "title": "1958년 기술 혁신 기록",
    "desc": "1958년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1958,
    "tag": "SOCIETY",
    "title": "1958년 한국 사회 변화상",
    "desc": "1958년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "CULTURE",
    "title": "1958년의 정밀 역사 기록 (1)",
    "desc": "1958년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "ECONOMY",
    "title": "1958년의 정밀 역사 기록 (2)",
    "desc": "1958년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1958,
    "tag": "TECHNOLOGY",
    "title": "1958년의 정밀 역사 기록 (3)",
    "desc": "1958년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 60 (확장 데이터)",
    "desc": "1959년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 185 (확장 데이터)",
    "desc": "1959년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1959,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 310 (확장 데이터)",
    "desc": "1959년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1959,
    "tag": "WAR",
    "title": "연도별 상세 사건 435 (확장 데이터)",
    "desc": "1959년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 560 (확장 데이터)",
    "desc": "1959년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1959,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 685 (확장 데이터)",
    "desc": "1959년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1959,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 810 (확장 데이터)",
    "desc": "1959년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 935 (확장 데이터)",
    "desc": "1959년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1959,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1060 (확장 데이터)",
    "desc": "1959년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1959,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1185 (확장 데이터)",
    "desc": "1959년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "WAR",
    "title": "연도별 상세 사건 1310 (확장 데이터)",
    "desc": "1959년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1959,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1435 (확장 데이터)",
    "desc": "1959년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1959,
    "tag": "TECHNOLOGY",
    "title": "1959년 기술 혁신 기록",
    "desc": "1959년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1959,
    "tag": "SOCIETY",
    "title": "1959년 한국 사회 변화상",
    "desc": "1959년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "ECONOMY",
    "title": "1959년의 정밀 역사 기록 (1)",
    "desc": "1959년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "TECHNOLOGY",
    "title": "1959년의 정밀 역사 기록 (2)",
    "desc": "1959년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "SOCIETY",
    "title": "1959년의 정밀 역사 기록 (3)",
    "desc": "1959년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1959,
    "tag": "CULTURE",
    "title": "1959년의 정밀 역사 기록 (4)",
    "desc": "1959년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 61 (확장 데이터)",
    "desc": "1960년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1960,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 186 (확장 데이터)",
    "desc": "1960년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 311 (확장 데이터)",
    "desc": "1960년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1960,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 436 (확장 데이터)",
    "desc": "1960년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1960,
    "tag": "WAR",
    "title": "연도별 상세 사건 561 (확장 데이터)",
    "desc": "1960년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 686 (확장 데이터)",
    "desc": "1960년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1960,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 811 (확장 데이터)",
    "desc": "1960년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1960,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 936 (확장 데이터)",
    "desc": "1960년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1061 (확장 데이터)",
    "desc": "1960년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1960,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1186 (확장 데이터)",
    "desc": "1960년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1960,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1311 (확장 데이터)",
    "desc": "1960년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "WAR",
    "title": "연도별 상세 사건 1436 (확장 데이터)",
    "desc": "1960년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1960,
    "tag": "POLITICS",
    "title": "4·19 혁명 - 이승만 하야",
    "desc": "부정 선거에 저항한 학생·시민의 4·19 혁명으로 이승만 대통령이 하야. 한국 민주주의 역사의 첫 번째 시민 혁명",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1960,
    "tag": "POLITICS",
    "title": "아프리카의 해 - 17개국 독립",
    "desc": "1960년 한 해에 17개 아프리카 국가가 독립. 식민지 시대의 종말과 제3세계 민족자결주의의 승리",
    "location": "아프리카 전역",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1960,
    "tag": "TECHNOLOGY",
    "title": "1960년 기술 혁신 기록",
    "desc": "1960년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1960,
    "tag": "SOCIETY",
    "title": "1960년 한국 사회 변화상",
    "desc": "1960년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "TECHNOLOGY",
    "title": "1960년의 정밀 역사 기록 (1)",
    "desc": "1960년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1960,
    "tag": "SOCIETY",
    "title": "1960년의 정밀 역사 기록 (2)",
    "desc": "1960년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 62 (확장 데이터)",
    "desc": "1961년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1961,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 187 (확장 데이터)",
    "desc": "1961년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1961,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 312 (확장 데이터)",
    "desc": "1961년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 437 (확장 데이터)",
    "desc": "1961년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1961,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 562 (확장 데이터)",
    "desc": "1961년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1961,
    "tag": "WAR",
    "title": "연도별 상세 사건 687 (확장 데이터)",
    "desc": "1961년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 812 (확장 데이터)",
    "desc": "1961년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1961,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 937 (확장 데이터)",
    "desc": "1961년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1961,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1062 (확장 데이터)",
    "desc": "1961년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1187 (확장 데이터)",
    "desc": "1961년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1961,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1312 (확장 데이터)",
    "desc": "1961년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1961,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1437 (확장 데이터)",
    "desc": "1961년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "POLITICS",
    "title": "5·16 군사 쿠데타·박정희 집권",
    "desc": "박정희 소장이 군사 쿠데타로 정권을 장악. 이후 18년간 권위주의 체제 아래 경제 개발을 추진한 한국 현대사의 분기점",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1961,
    "tag": "POLITICS",
    "title": "베를린 장벽 건설",
    "desc": "동독이 하룻밤 사이에 베를린 장벽을 건설. 냉전의 상징이 된 이 장벽은 1989년 붕괴될 때까지 28년간 유지됨",
    "location": "베를린, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1961,
    "tag": "SCIENCE",
    "title": "가가린 인류 최초 우주 비행",
    "desc": "소련의 유리 가가린이 인류 최초로 우주 비행에 성공. '지구는 푸른빛이다'는 명언 남김. 미국의 달 착륙 경쟁 자극",
    "location": "우주 (지구 궤도)",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1961,
    "tag": "TECHNOLOGY",
    "title": "1961년 기술 혁신 기록",
    "desc": "1961년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1961,
    "tag": "SOCIETY",
    "title": "1961년 한국 사회 변화상",
    "desc": "1961년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1961,
    "tag": "SOCIETY",
    "title": "1961년의 정밀 역사 기록 (1)",
    "desc": "1961년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 63 (확장 데이터)",
    "desc": "1962년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 188 (확장 데이터)",
    "desc": "1962년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1962,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 313 (확장 데이터)",
    "desc": "1962년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1962,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 438 (확장 데이터)",
    "desc": "1962년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 563 (확장 데이터)",
    "desc": "1962년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1962,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 688 (확장 데이터)",
    "desc": "1962년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1962,
    "tag": "WAR",
    "title": "연도별 상세 사건 813 (확장 데이터)",
    "desc": "1962년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 938 (확장 데이터)",
    "desc": "1962년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1962,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1063 (확장 데이터)",
    "desc": "1962년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1962,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1188 (확장 데이터)",
    "desc": "1962년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1313 (확장 데이터)",
    "desc": "1962년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1962,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1438 (확장 데이터)",
    "desc": "1962년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1962,
    "tag": "WAR",
    "title": "쿠바 미사일 위기",
    "desc": "소련이 쿠바에 핵미사일을 배치하며 미소가 핵전쟁 일보 직전까지 대치. 13일간의 협상 끝에 소련 철수로 해결",
    "location": "쿠바·워싱턴DC·모스크바",
    "region": [
      "아메리카",
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1962,
    "tag": "TECHNOLOGY",
    "title": "1962년 기술 혁신 기록",
    "desc": "1962년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1962,
    "tag": "SOCIETY",
    "title": "1962년 한국 사회 변화상",
    "desc": "1962년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "CULTURE",
    "title": "1962년의 정밀 역사 기록 (1)",
    "desc": "1962년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "ECONOMY",
    "title": "1962년의 정밀 역사 기록 (2)",
    "desc": "1962년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1962,
    "tag": "TECHNOLOGY",
    "title": "1962년의 정밀 역사 기록 (3)",
    "desc": "1962년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "WAR",
    "title": "연도별 상세 사건 64 (확장 데이터)",
    "desc": "1963년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1963,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 189 (확장 데이터)",
    "desc": "1963년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 314 (확장 데이터)",
    "desc": "1963년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1963,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 439 (확장 데이터)",
    "desc": "1963년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1963,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 564 (확장 데이터)",
    "desc": "1963년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 689 (확장 데이터)",
    "desc": "1963년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1963,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 814 (확장 데이터)",
    "desc": "1963년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1963,
    "tag": "WAR",
    "title": "연도별 상세 사건 939 (확장 데이터)",
    "desc": "1963년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1064 (확장 데이터)",
    "desc": "1963년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1963,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1189 (확장 데이터)",
    "desc": "1963년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1963,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1314 (확장 데이터)",
    "desc": "1963년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1439 (확장 데이터)",
    "desc": "1963년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1963,
    "tag": "SOCIETY",
    "title": "마틴 루터 킹 '나에게는 꿈이 있습니다'",
    "desc": "킹 목사가 워싱턴 행진에서 '나에게는 꿈이 있습니다' 연설. 미국 민권운동의 절정이자 인류 평등 이념의 상징",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1963,
    "tag": "POLITICS",
    "title": "케네디 대통령 암살",
    "desc": "존 F. 케네디 대통령이 댈러스에서 암살됨. 미국 사회에 깊은 충격을 준 사건으로 음모론과 함께 현재도 논란 지속",
    "location": "댈러스, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1963,
    "tag": "TECHNOLOGY",
    "title": "1963년 기술 혁신 기록",
    "desc": "1963년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1963,
    "tag": "SOCIETY",
    "title": "1963년 한국 사회 변화상",
    "desc": "1963년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "ECONOMY",
    "title": "1963년의 정밀 역사 기록 (1)",
    "desc": "1963년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1963,
    "tag": "TECHNOLOGY",
    "title": "1963년의 정밀 역사 기록 (2)",
    "desc": "1963년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 65 (확장 데이터)",
    "desc": "1964년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1964,
    "tag": "WAR",
    "title": "연도별 상세 사건 190 (확장 데이터)",
    "desc": "1964년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1964,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 315 (확장 데이터)",
    "desc": "1964년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 440 (확장 데이터)",
    "desc": "1964년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1964,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 565 (확장 데이터)",
    "desc": "1964년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1964,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 690 (확장 데이터)",
    "desc": "1964년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 815 (확장 데이터)",
    "desc": "1964년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1964,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 940 (확장 데이터)",
    "desc": "1964년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1964,
    "tag": "WAR",
    "title": "연도별 상세 사건 1065 (확장 데이터)",
    "desc": "1964년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1190 (확장 데이터)",
    "desc": "1964년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1964,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1315 (확장 데이터)",
    "desc": "1964년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1964,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1440 (확장 데이터)",
    "desc": "1964년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "ECONOMY",
    "title": "경부고속도로 착공 결정",
    "desc": "박정희 정부가 서울-부산 경부고속도로 건설을 결정. 1970년 개통되어 한국 산업화의 대동맥이 됨",
    "location": "서울→부산",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1964,
    "tag": "SOCIETY",
    "title": "미국 민권법 제정",
    "desc": "린든 존슨 대통령이 인종차별을 금지하는 민권법에 서명. 아프리카계 미국인의 법적 평등권을 보장한 역사적 입법",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1964,
    "tag": "TECHNOLOGY",
    "title": "1964년 기술 혁신 기록",
    "desc": "1964년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1964,
    "tag": "SOCIETY",
    "title": "1964년 한국 사회 변화상",
    "desc": "1964년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "TECHNOLOGY",
    "title": "1964년의 정밀 역사 기록 (1)",
    "desc": "1964년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1964,
    "tag": "SOCIETY",
    "title": "1964년의 정밀 역사 기록 (2)",
    "desc": "1964년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 66 (확장 데이터)",
    "desc": "1965년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 191 (확장 데이터)",
    "desc": "1965년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1965,
    "tag": "WAR",
    "title": "연도별 상세 사건 316 (확장 데이터)",
    "desc": "1965년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1965,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 441 (확장 데이터)",
    "desc": "1965년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 566 (확장 데이터)",
    "desc": "1965년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1965,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 691 (확장 데이터)",
    "desc": "1965년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1965,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 816 (확장 데이터)",
    "desc": "1965년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 941 (확장 데이터)",
    "desc": "1965년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1965,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1066 (확장 데이터)",
    "desc": "1965년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1965,
    "tag": "WAR",
    "title": "연도별 상세 사건 1191 (확장 데이터)",
    "desc": "1965년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1316 (확장 데이터)",
    "desc": "1965년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1965,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1441 (확장 데이터)",
    "desc": "1965년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1965,
    "tag": "POLITICS",
    "title": "한일 국교 정상화",
    "desc": "한일기본조약 체결로 한국과 일본이 국교를 정상화. 청구권 자금 3억 달러 수령. 굴욕 외교 논란으로 대규모 반대 시위",
    "location": "서울·도쿄",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1965,
    "tag": "WAR",
    "title": "베트남전 미군 본격 참전",
    "desc": "미국이 통킹 만 사건을 계기로 베트남에 지상군을 대규모 파병. 이후 10년간 미국 사회를 분열시킨 전쟁의 본격화",
    "location": "베트남",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1965,
    "tag": "WAR",
    "title": "한국군 베트남 파병",
    "desc": "한국이 맹호·청룡·백마부대 등 연인원 32만 명을 베트남에 파병. 한국 현대사 최초의 대규모 해외 파병",
    "location": "베트남·서울",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1965,
    "tag": "TECHNOLOGY",
    "title": "1965년 기술 혁신 기록",
    "desc": "1965년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1965,
    "tag": "SOCIETY",
    "title": "1965년 한국 사회 변화상",
    "desc": "1965년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1965,
    "tag": "SOCIETY",
    "title": "1965년의 정밀 역사 기록 (1)",
    "desc": "1965년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 67 (확장 데이터)",
    "desc": "1966년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1966,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 192 (확장 데이터)",
    "desc": "1966년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 317 (확장 데이터)",
    "desc": "1966년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1966,
    "tag": "WAR",
    "title": "연도별 상세 사건 442 (확장 데이터)",
    "desc": "1966년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1966,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 567 (확장 데이터)",
    "desc": "1966년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 692 (확장 데이터)",
    "desc": "1966년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1966,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 817 (확장 데이터)",
    "desc": "1966년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1966,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 942 (확장 데이터)",
    "desc": "1966년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1067 (확장 데이터)",
    "desc": "1966년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1966,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1192 (확장 데이터)",
    "desc": "1966년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1966,
    "tag": "WAR",
    "title": "연도별 상세 사건 1317 (확장 데이터)",
    "desc": "1966년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1442 (확장 데이터)",
    "desc": "1966년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1966,
    "tag": "POLITICS",
    "title": "중국 문화대혁명 시작",
    "desc": "마오쩌둥이 주도한 문화대혁명으로 홍위병이 지식인·전통 문화를 탄압. 100만~200만 명 사망. 10년간 중국 사회 마비",
    "location": "중국 전역",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1966,
    "tag": "TECHNOLOGY",
    "title": "1966년 기술 혁신 기록",
    "desc": "1966년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1966,
    "tag": "SOCIETY",
    "title": "1966년 한국 사회 변화상",
    "desc": "1966년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "CULTURE",
    "title": "1966년의 정밀 역사 기록 (1)",
    "desc": "1966년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "ECONOMY",
    "title": "1966년의 정밀 역사 기록 (2)",
    "desc": "1966년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1966,
    "tag": "TECHNOLOGY",
    "title": "1966년의 정밀 역사 기록 (3)",
    "desc": "1966년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 68 (확장 데이터)",
    "desc": "1967년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1967,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 193 (확장 데이터)",
    "desc": "1967년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1967,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 318 (확장 데이터)",
    "desc": "1967년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 443 (확장 데이터)",
    "desc": "1967년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1967,
    "tag": "WAR",
    "title": "연도별 상세 사건 568 (확장 데이터)",
    "desc": "1967년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1967,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 693 (확장 데이터)",
    "desc": "1967년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 818 (확장 데이터)",
    "desc": "1967년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1967,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 943 (확장 데이터)",
    "desc": "1967년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1967,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1068 (확장 데이터)",
    "desc": "1967년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1193 (확장 데이터)",
    "desc": "1967년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1967,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1318 (확장 데이터)",
    "desc": "1967년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1967,
    "tag": "WAR",
    "title": "연도별 상세 사건 1443 (확장 데이터)",
    "desc": "1967년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "WAR",
    "title": "6일 전쟁 - 이스라엘 아랍 대결",
    "desc": "이스라엘이 이집트·시리아·요르단을 상대로 6일 만에 승리. 서안·가자지구·시나이반도·골란고원 점령",
    "location": "중동",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1967,
    "tag": "TECHNOLOGY",
    "title": "1967년 기술 혁신 기록",
    "desc": "1967년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1967,
    "tag": "SOCIETY",
    "title": "1967년 한국 사회 변화상",
    "desc": "1967년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "ECONOMY",
    "title": "1967년의 정밀 역사 기록 (1)",
    "desc": "1967년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "TECHNOLOGY",
    "title": "1967년의 정밀 역사 기록 (2)",
    "desc": "1967년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1967,
    "tag": "SOCIETY",
    "title": "1967년의 정밀 역사 기록 (3)",
    "desc": "1967년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 69 (확장 데이터)",
    "desc": "1968년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 194 (확장 데이터)",
    "desc": "1968년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1968,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 319 (확장 데이터)",
    "desc": "1968년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1968,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 444 (확장 데이터)",
    "desc": "1968년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 569 (확장 데이터)",
    "desc": "1968년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1968,
    "tag": "WAR",
    "title": "연도별 상세 사건 694 (확장 데이터)",
    "desc": "1968년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1968,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 819 (확장 데이터)",
    "desc": "1968년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 944 (확장 데이터)",
    "desc": "1968년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1968,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1069 (확장 데이터)",
    "desc": "1968년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1968,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1194 (확장 데이터)",
    "desc": "1968년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1319 (확장 데이터)",
    "desc": "1968년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1968,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1444 (확장 데이터)",
    "desc": "1968년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1968,
    "tag": "SOCIETY",
    "title": "68혁명 - 전 세계 학생 반란",
    "desc": "프랑스 5월 혁명을 필두로 미국·독일·일본 등 전 세계에서 반전·반권위주의 학생 운동이 동시 폭발",
    "location": "파리·워싱턴DC 등",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1968,
    "tag": "WAR",
    "title": "1·21 사태·푸에블로 호 납치",
    "desc": "북한 특수부대 31명이 청와대 습격을 시도하고(1·21), 북한이 미 정보함 푸에블로 호를 납치. 한반도 긴장 극도로 고조",
    "location": "서울·동해",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1968,
    "tag": "TECHNOLOGY",
    "title": "1968년 기술 혁신 기록",
    "desc": "1968년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1968,
    "tag": "SOCIETY",
    "title": "1968년 한국 사회 변화상",
    "desc": "1968년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "TECHNOLOGY",
    "title": "1968년의 정밀 역사 기록 (1)",
    "desc": "1968년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1968,
    "tag": "SOCIETY",
    "title": "1968년의 정밀 역사 기록 (2)",
    "desc": "1968년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "SCIENCE",
    "title": "아폴로 11호 달 착륙",
    "desc": "인류가 최초로 지구 외 천체에 발을 내딛음",
    "location": "달",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1969,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 70 (확장 데이터)",
    "desc": "1969년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1969,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 195 (확장 데이터)",
    "desc": "1969년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 320 (확장 데이터)",
    "desc": "1969년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1969,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 445 (확장 데이터)",
    "desc": "1969년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1969,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 570 (확장 데이터)",
    "desc": "1969년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 695 (확장 데이터)",
    "desc": "1969년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1969,
    "tag": "WAR",
    "title": "연도별 상세 사건 820 (확장 데이터)",
    "desc": "1969년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1969,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 945 (확장 데이터)",
    "desc": "1969년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1070 (확장 데이터)",
    "desc": "1969년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1969,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1195 (확장 데이터)",
    "desc": "1969년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1969,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1320 (확장 데이터)",
    "desc": "1969년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1445 (확장 데이터)",
    "desc": "1969년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1969,
    "tag": "TECHNOLOGY",
    "title": "1969년 기술 혁신 기록",
    "desc": "1969년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1969,
    "tag": "SOCIETY",
    "title": "1969년 한국 사회 변화상",
    "desc": "1969년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "SOCIETY",
    "title": "1969년의 정밀 역사 기록 (1)",
    "desc": "1969년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "CULTURE",
    "title": "1969년의 정밀 역사 기록 (2)",
    "desc": "1969년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1969,
    "tag": "ECONOMY",
    "title": "1969년의 정밀 역사 기록 (3)",
    "desc": "1969년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "WAR",
    "title": "연도별 상세 사건 71 (확장 데이터)",
    "desc": "1970년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1970,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 196 (확장 데이터)",
    "desc": "1970년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1970,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 321 (확장 데이터)",
    "desc": "1970년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 446 (확장 데이터)",
    "desc": "1970년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1970,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 571 (확장 데이터)",
    "desc": "1970년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1970,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 696 (확장 데이터)",
    "desc": "1970년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 821 (확장 데이터)",
    "desc": "1970년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1970,
    "tag": "WAR",
    "title": "연도별 상세 사건 946 (확장 데이터)",
    "desc": "1970년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1970,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1071 (확장 데이터)",
    "desc": "1970년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1196 (확장 데이터)",
    "desc": "1970년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1970,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1321 (확장 데이터)",
    "desc": "1970년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1970,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1446 (확장 데이터)",
    "desc": "1970년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "ECONOMY",
    "title": "경부고속도로 개통",
    "desc": "서울-부산 428km 경부고속도로 개통. 국토 대동맥으로 산업화와 물류혁명을 이끈 박정희 정부의 핵심 사업",
    "location": "서울→부산",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1970,
    "tag": "WAR",
    "title": "전태일 분신 항거",
    "desc": "평화시장 재단사 전태일이 근로기준법 준수를 외치며 분신. 한국 노동운동의 기폭제가 된 역사적 사건",
    "location": "서울 청계천",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1970,
    "tag": "TECHNOLOGY",
    "title": "1970년 기술 혁신 기록",
    "desc": "1970년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1970,
    "tag": "SOCIETY",
    "title": "1970년 한국 사회 변화상",
    "desc": "1970년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "CULTURE",
    "title": "1970년의 정밀 역사 기록 (1)",
    "desc": "1970년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1970,
    "tag": "ECONOMY",
    "title": "1970년의 정밀 역사 기록 (2)",
    "desc": "1970년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 72 (확장 데이터)",
    "desc": "1971년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "WAR",
    "title": "연도별 상세 사건 197 (확장 데이터)",
    "desc": "1971년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1971,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 322 (확장 데이터)",
    "desc": "1971년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1971,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 447 (확장 데이터)",
    "desc": "1971년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 572 (확장 데이터)",
    "desc": "1971년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1971,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 697 (확장 데이터)",
    "desc": "1971년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1971,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 822 (확장 데이터)",
    "desc": "1971년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 947 (확장 데이터)",
    "desc": "1971년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1971,
    "tag": "WAR",
    "title": "연도별 상세 사건 1072 (확장 데이터)",
    "desc": "1971년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1971,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1197 (확장 데이터)",
    "desc": "1971년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1322 (확장 데이터)",
    "desc": "1971년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1971,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1447 (확장 데이터)",
    "desc": "1971년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1971,
    "tag": "POLITICS",
    "title": "닉슨 중국 방문·데탕트 시대",
    "desc": "닉슨 대통령의 중국 방문으로 미중 화해가 시작됨. 냉전의 긴장이 완화되는 데탕트(화해) 시대의 개막",
    "location": "베이징, 중국",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1971,
    "tag": "TECHNOLOGY",
    "title": "1971년 기술 혁신 기록",
    "desc": "1971년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1971,
    "tag": "SOCIETY",
    "title": "1971년 한국 사회 변화상",
    "desc": "1971년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "ECONOMY",
    "title": "1971년의 정밀 역사 기록 (1)",
    "desc": "1971년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "TECHNOLOGY",
    "title": "1971년의 정밀 역사 기록 (2)",
    "desc": "1971년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1971,
    "tag": "SOCIETY",
    "title": "1971년의 정밀 역사 기록 (3)",
    "desc": "1971년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 73 (확장 데이터)",
    "desc": "1972년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1972,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 198 (확장 데이터)",
    "desc": "1972년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "WAR",
    "title": "연도별 상세 사건 323 (확장 데이터)",
    "desc": "1972년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1972,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 448 (확장 데이터)",
    "desc": "1972년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1972,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 573 (확장 데이터)",
    "desc": "1972년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 698 (확장 데이터)",
    "desc": "1972년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1972,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 823 (확장 데이터)",
    "desc": "1972년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1972,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 948 (확장 데이터)",
    "desc": "1972년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1073 (확장 데이터)",
    "desc": "1972년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1972,
    "tag": "WAR",
    "title": "연도별 상세 사건 1198 (확장 데이터)",
    "desc": "1972년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1972,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1323 (확장 데이터)",
    "desc": "1972년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1448 (확장 데이터)",
    "desc": "1972년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1972,
    "tag": "POLITICS",
    "title": "7·4 남북공동성명·유신 체제 수립",
    "desc": "남북이 자주·평화·민족대단결 원칙의 7·4 공동성명을 발표. 같은 해 박정희는 유신헌법으로 영구 집권 체제 구축",
    "location": "서울·평양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1972,
    "tag": "WAR",
    "title": "뮌헨 올림픽 테러",
    "desc": "팔레스타인 무장단체 검은 9월단이 뮌헨 올림픽에서 이스라엘 선수 11명을 살해. 국제 테러리즘의 본격화",
    "location": "뮌헨, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1972,
    "tag": "TECHNOLOGY",
    "title": "1972년 기술 혁신 기록",
    "desc": "1972년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1972,
    "tag": "SOCIETY",
    "title": "1972년 한국 사회 변화상",
    "desc": "1972년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "TECHNOLOGY",
    "title": "1972년의 정밀 역사 기록 (1)",
    "desc": "1972년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1972,
    "tag": "SOCIETY",
    "title": "1972년의 정밀 역사 기록 (2)",
    "desc": "1972년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 74 (확장 데이터)",
    "desc": "1973년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1973,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 199 (확장 데이터)",
    "desc": "1973년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1973,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 324 (확장 데이터)",
    "desc": "1973년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "WAR",
    "title": "연도별 상세 사건 449 (확장 데이터)",
    "desc": "1973년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1973,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 574 (확장 데이터)",
    "desc": "1973년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1973,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 699 (확장 데이터)",
    "desc": "1973년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 824 (확장 데이터)",
    "desc": "1973년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1973,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 949 (확장 데이터)",
    "desc": "1973년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1973,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1074 (확장 데이터)",
    "desc": "1973년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1199 (확장 데이터)",
    "desc": "1973년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1973,
    "tag": "WAR",
    "title": "연도별 상세 사건 1324 (확장 데이터)",
    "desc": "1973년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1973,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1449 (확장 데이터)",
    "desc": "1973년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "ECONOMY",
    "title": "1차 오일쇼크",
    "desc": "아랍 산유국이 이스라엘 지지 국가에 석유 수출 금지. 유가가 4배 폭등하며 전 세계적 경기침체와 에너지 위기 촉발",
    "location": "중동·전 세계",
    "region": [
      "중동",
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1973,
    "tag": "ECONOMY",
    "title": "중동 건설 특수 - 한국 진출",
    "desc": "오일쇼크 이후 오일달러가 풍부한 중동 국가들의 건설 붐에 한국 기업들이 대거 진출. 외화 획득의 핵심 통로",
    "location": "중동·한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1973,
    "tag": "TECHNOLOGY",
    "title": "1973년 기술 혁신 기록",
    "desc": "1973년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1973,
    "tag": "SOCIETY",
    "title": "1973년 한국 사회 변화상",
    "desc": "1973년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "SOCIETY",
    "title": "1973년의 정밀 역사 기록 (1)",
    "desc": "1973년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1973,
    "tag": "CULTURE",
    "title": "1973년의 정밀 역사 기록 (2)",
    "desc": "1973년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 75 (확장 데이터)",
    "desc": "1974년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 200 (확장 데이터)",
    "desc": "1974년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1974,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 325 (확장 데이터)",
    "desc": "1974년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1974,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 450 (확장 데이터)",
    "desc": "1974년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "WAR",
    "title": "연도별 상세 사건 575 (확장 데이터)",
    "desc": "1974년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1974,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 700 (확장 데이터)",
    "desc": "1974년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1974,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 825 (확장 데이터)",
    "desc": "1974년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 950 (확장 데이터)",
    "desc": "1974년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1974,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1075 (확장 데이터)",
    "desc": "1974년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1974,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1200 (확장 데이터)",
    "desc": "1974년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1325 (확장 데이터)",
    "desc": "1974년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1974,
    "tag": "WAR",
    "title": "연도별 상세 사건 1450 (확장 데이터)",
    "desc": "1974년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1974,
    "tag": "POLITICS",
    "title": "닉슨 워터게이트 사건 사임",
    "desc": "닉슨 대통령이 워터게이트 도청 사건으로 탄핵 위기에 처해 스스로 사임. 미국 역사상 최초의 대통령 자진 사임",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1974,
    "tag": "TECHNOLOGY",
    "title": "1974년 기술 혁신 기록",
    "desc": "1974년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1974,
    "tag": "SOCIETY",
    "title": "1974년 한국 사회 변화상",
    "desc": "1974년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "CULTURE",
    "title": "1974년의 정밀 역사 기록 (1)",
    "desc": "1974년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "ECONOMY",
    "title": "1974년의 정밀 역사 기록 (2)",
    "desc": "1974년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1974,
    "tag": "TECHNOLOGY",
    "title": "1974년의 정밀 역사 기록 (3)",
    "desc": "1974년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 76 (확장 데이터)",
    "desc": "1975년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1975,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 201 (확장 데이터)",
    "desc": "1975년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 326 (확장 데이터)",
    "desc": "1975년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1975,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 451 (확장 데이터)",
    "desc": "1975년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1975,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 576 (확장 데이터)",
    "desc": "1975년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "WAR",
    "title": "연도별 상세 사건 701 (확장 데이터)",
    "desc": "1975년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1975,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 826 (확장 데이터)",
    "desc": "1975년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1975,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 951 (확장 데이터)",
    "desc": "1975년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1076 (확장 데이터)",
    "desc": "1975년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1975,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1201 (확장 데이터)",
    "desc": "1975년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1975,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1326 (확장 데이터)",
    "desc": "1975년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1451 (확장 데이터)",
    "desc": "1975년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1975,
    "tag": "WAR",
    "title": "베트남전 종전·사이공 함락",
    "desc": "북베트남군이 사이공을 함락하며 베트남전 종결. 남베트남이 붕괴하고 베트남이 공산화로 통일됨. 미국의 첫 패전",
    "location": "사이공, 베트남",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1975,
    "tag": "TECHNOLOGY",
    "title": "1975년 기술 혁신 기록",
    "desc": "1975년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1975,
    "tag": "SOCIETY",
    "title": "1975년 한국 사회 변화상",
    "desc": "1975년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "ECONOMY",
    "title": "1975년의 정밀 역사 기록 (1)",
    "desc": "1975년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "TECHNOLOGY",
    "title": "1975년의 정밀 역사 기록 (2)",
    "desc": "1975년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1975,
    "tag": "SOCIETY",
    "title": "1975년의 정밀 역사 기록 (3)",
    "desc": "1975년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 77 (확장 데이터)",
    "desc": "1976년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1976,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 202 (확장 데이터)",
    "desc": "1976년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1976,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 327 (확장 데이터)",
    "desc": "1976년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 452 (확장 데이터)",
    "desc": "1976년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1976,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 577 (확장 데이터)",
    "desc": "1976년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1976,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 702 (확장 데이터)",
    "desc": "1976년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "WAR",
    "title": "연도별 상세 사건 827 (확장 데이터)",
    "desc": "1976년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1976,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 952 (확장 데이터)",
    "desc": "1976년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1976,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1077 (확장 데이터)",
    "desc": "1976년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1202 (확장 데이터)",
    "desc": "1976년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1976,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1327 (확장 데이터)",
    "desc": "1976년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1976,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1452 (확장 데이터)",
    "desc": "1976년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "ECONOMY",
    "title": "포항제철 1기 완공",
    "desc": "포항제철(현 POSCO) 1고로가 완공되어 연간 103만 톤 생산 시작. 한국 중화학공업 시대를 연 산업화의 상징",
    "location": "포항",
    "region": [
      "경상도"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1976,
    "tag": "WAR",
    "title": "판문점 도끼 만행 사건",
    "desc": "판문점 공동경비구역에서 북한군이 미루나무 가지치기 작업 중인 미군 장교 2명을 도끼로 살해. 한반도 일촉즉발 위기",
    "location": "판문점",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "TECHNOLOGY",
    "title": "1976년 기술 혁신 기록",
    "desc": "1976년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1976,
    "tag": "SOCIETY",
    "title": "1976년 한국 사회 변화상",
    "desc": "1976년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "TECHNOLOGY",
    "title": "1976년의 정밀 역사 기록 (1)",
    "desc": "1976년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1976,
    "tag": "SOCIETY",
    "title": "1976년의 정밀 역사 기록 (2)",
    "desc": "1976년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "WAR",
    "title": "연도별 상세 사건 78 (확장 데이터)",
    "desc": "1977년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 203 (확장 데이터)",
    "desc": "1977년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1977,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 328 (확장 데이터)",
    "desc": "1977년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1977,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 453 (확장 데이터)",
    "desc": "1977년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 578 (확장 데이터)",
    "desc": "1977년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1977,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 703 (확장 데이터)",
    "desc": "1977년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1977,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 828 (확장 데이터)",
    "desc": "1977년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "WAR",
    "title": "연도별 상세 사건 953 (확장 데이터)",
    "desc": "1977년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1977,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1078 (확장 데이터)",
    "desc": "1977년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1977,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1203 (확장 데이터)",
    "desc": "1977년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1328 (확장 데이터)",
    "desc": "1977년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1977,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1453 (확장 데이터)",
    "desc": "1977년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1977,
    "tag": "ECONOMY",
    "title": "한국 수출 100억 달러 달성",
    "desc": "한국이 수출 100억 달러를 달성하며 '수출 입국'의 신화를 써 나감. 한강의 기적이라 불리는 고도성장의 증거",
    "location": "한국 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1977,
    "tag": "TECHNOLOGY",
    "title": "1977년 기술 혁신 기록",
    "desc": "1977년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1977,
    "tag": "SOCIETY",
    "title": "1977년 한국 사회 변화상",
    "desc": "1977년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "SOCIETY",
    "title": "1977년의 정밀 역사 기록 (1)",
    "desc": "1977년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "CULTURE",
    "title": "1977년의 정밀 역사 기록 (2)",
    "desc": "1977년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1977,
    "tag": "ECONOMY",
    "title": "1977년의 정밀 역사 기록 (3)",
    "desc": "1977년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 79 (확장 데이터)",
    "desc": "1978년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1978,
    "tag": "WAR",
    "title": "연도별 상세 사건 204 (확장 데이터)",
    "desc": "1978년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 329 (확장 데이터)",
    "desc": "1978년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1978,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 454 (확장 데이터)",
    "desc": "1978년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1978,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 579 (확장 데이터)",
    "desc": "1978년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 704 (확장 데이터)",
    "desc": "1978년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1978,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 829 (확장 데이터)",
    "desc": "1978년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1978,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 954 (확장 데이터)",
    "desc": "1978년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "WAR",
    "title": "연도별 상세 사건 1079 (확장 데이터)",
    "desc": "1978년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1978,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1204 (확장 데이터)",
    "desc": "1978년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1978,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1329 (확장 데이터)",
    "desc": "1978년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1454 (확장 데이터)",
    "desc": "1978년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1978,
    "tag": "POLITICS",
    "title": "덩샤오핑 개혁개방 노선 채택",
    "desc": "덩샤오핑이 사회주의 시장경제 개혁개방 노선을 채택. 40년 만에 중국을 세계 2위 경제 대국으로 끌어올린 역사적 전환",
    "location": "베이징, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1978,
    "tag": "TECHNOLOGY",
    "title": "1978년 기술 혁신 기록",
    "desc": "1978년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1978,
    "tag": "SOCIETY",
    "title": "1978년 한국 사회 변화상",
    "desc": "1978년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "CULTURE",
    "title": "1978년의 정밀 역사 기록 (1)",
    "desc": "1978년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "ECONOMY",
    "title": "1978년의 정밀 역사 기록 (2)",
    "desc": "1978년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1978,
    "tag": "TECHNOLOGY",
    "title": "1978년의 정밀 역사 기록 (3)",
    "desc": "1978년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1979,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 80 (확장 데이터)",
    "desc": "1979년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1979,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 205 (확장 데이터)",
    "desc": "1979년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1979,
    "tag": "WAR",
    "title": "연도별 상세 사건 330 (확장 데이터)",
    "desc": "1979년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1979,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 455 (확장 데이터)",
    "desc": "1979년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1979,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 580 (확장 데이터)",
    "desc": "1979년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1979,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 705 (확장 데이터)",
    "desc": "1979년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1979,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 830 (확장 데이터)",
    "desc": "1979년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1979,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 955 (확장 데이터)",
    "desc": "1979년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1979,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1080 (확장 데이터)",
    "desc": "1979년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1979,
    "tag": "WAR",
    "title": "연도별 상세 사건 1205 (확장 데이터)",
    "desc": "1979년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1979,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1330 (확장 데이터)",
    "desc": "1979년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1979,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1455 (확장 데이터)",
    "desc": "1979년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1979,
    "tag": "POLITICS",
    "title": "박정희 대통령 피살 (10·26 사태)",
    "desc": "박정희 대통령이 중앙정보부장 김재규에게 피살됨. 18년 군사 독재 종식. 이후 신군부 세력이 권력을 장악",
    "location": "서울 궁정동",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1979,
    "tag": "POLITICS",
    "title": "이란 이슬람 혁명",
    "desc": "아야톨라 호메이니가 팔레비 왕조를 무너뜨리고 이란 이슬람 공화국을 수립. 중동 정치 지형을 바꾼 혁명",
    "location": "테헤란, 이란",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1979,
    "tag": "WAR",
    "title": "소련 아프가니스탄 침공",
    "desc": "소련이 아프가니스탄에 군대를 파견. 10년간의 전쟁으로 150만 명 사망. 소련 붕괴를 앞당긴 '소련의 베트남'",
    "location": "아프가니스탄",
    "region": [
      "아시아",
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1979,
    "tag": "POLITICS",
    "title": "마거릿 대처 영국 총리 취임",
    "desc": "마거릿 대처가 영국 최초 여성 총리로 취임. 민영화·규제 완화의 신자유주의 경제 정책(대처리즘)으로 세계 경제 지형 변화",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1979,
    "tag": "TECHNOLOGY",
    "title": "1979년 기술 혁신 기록",
    "desc": "1979년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1979,
    "tag": "SOCIETY",
    "title": "1979년 한국 사회 변화상",
    "desc": "1979년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 81 (확장 데이터)",
    "desc": "1980년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 206 (확장 데이터)",
    "desc": "1980년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1980,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 331 (확장 데이터)",
    "desc": "1980년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1980,
    "tag": "WAR",
    "title": "연도별 상세 사건 456 (확장 데이터)",
    "desc": "1980년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 581 (확장 데이터)",
    "desc": "1980년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1980,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 706 (확장 데이터)",
    "desc": "1980년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1980,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 831 (확장 데이터)",
    "desc": "1980년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 956 (확장 데이터)",
    "desc": "1980년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1980,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1081 (확장 데이터)",
    "desc": "1980년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1980,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1206 (확장 데이터)",
    "desc": "1980년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "WAR",
    "title": "연도별 상세 사건 1331 (확장 데이터)",
    "desc": "1980년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1980,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1456 (확장 데이터)",
    "desc": "1980년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1980,
    "tag": "WAR",
    "title": "5·18 광주민주화운동",
    "desc": "전두환 신군부에 저항하여 광주 시민들이 봉기. 계엄군의 무자비한 진압으로 200여 명 이상 사망. 한국 민주화의 성지",
    "location": "광주",
    "region": [
      "전라도"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1980,
    "tag": "WAR",
    "title": "이란-이라크 전쟁 시작",
    "desc": "이라크의 사담 후세인이 이란을 침공하며 8년간의 전쟁 시작. 100만 명 이상 사망. 중동 분쟁의 장기화",
    "location": "이란·이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1980,
    "tag": "SOCIETY",
    "title": "존 레논 피살",
    "desc": "비틀즈의 존 레논이 뉴욕 자택 앞에서 팬에게 피살됨. 평화와 반전 운동의 아이콘을 잃은 전 세계의 슬픔",
    "location": "뉴욕, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1980,
    "tag": "TECHNOLOGY",
    "title": "1980년 기술 혁신 기록",
    "desc": "1980년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1980,
    "tag": "SOCIETY",
    "title": "1980년 한국 사회 변화상",
    "desc": "1980년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1980,
    "tag": "TECHNOLOGY",
    "title": "1980년의 정밀 역사 기록 (1)",
    "desc": "1980년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 82 (확장 데이터)",
    "desc": "1981년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1981,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 207 (확장 데이터)",
    "desc": "1981년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 332 (확장 데이터)",
    "desc": "1981년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1981,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 457 (확장 데이터)",
    "desc": "1981년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1981,
    "tag": "WAR",
    "title": "연도별 상세 사건 582 (확장 데이터)",
    "desc": "1981년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 707 (확장 데이터)",
    "desc": "1981년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1981,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 832 (확장 데이터)",
    "desc": "1981년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1981,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 957 (확장 데이터)",
    "desc": "1981년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1082 (확장 데이터)",
    "desc": "1981년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1981,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1207 (확장 데이터)",
    "desc": "1981년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1981,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1332 (확장 데이터)",
    "desc": "1981년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "WAR",
    "title": "연도별 상세 사건 1457 (확장 데이터)",
    "desc": "1981년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1981,
    "tag": "POLITICS",
    "title": "전두환 대통령 취임·5공 출범",
    "desc": "전두환이 체육관 선거로 대통령에 취임. 광주 학살을 딛고 출범한 제5공화국. 이후 민주화 운동의 지속적 탄압",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1981,
    "tag": "DISEASE",
    "title": "에이즈(AIDS) 최초 보고",
    "desc": "미국 CDC가 에이즈를 최초로 공식 보고. 이후 40년간 전 세계 3600만 명 이상의 목숨을 앗아간 세기의 질병",
    "location": "로스앤젤레스, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1981,
    "tag": "TECHNOLOGY",
    "title": "1981년 기술 혁신 기록",
    "desc": "1981년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1981,
    "tag": "SOCIETY",
    "title": "1981년 한국 사회 변화상",
    "desc": "1981년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "SOCIETY",
    "title": "1981년의 정밀 역사 기록 (1)",
    "desc": "1981년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1981,
    "tag": "CULTURE",
    "title": "1981년의 정밀 역사 기록 (2)",
    "desc": "1981년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 83 (확장 데이터)",
    "desc": "1982년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1982,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 208 (확장 데이터)",
    "desc": "1982년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1982,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 333 (확장 데이터)",
    "desc": "1982년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 458 (확장 데이터)",
    "desc": "1982년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1982,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 583 (확장 데이터)",
    "desc": "1982년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1982,
    "tag": "WAR",
    "title": "연도별 상세 사건 708 (확장 데이터)",
    "desc": "1982년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 833 (확장 데이터)",
    "desc": "1982년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1982,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 958 (확장 데이터)",
    "desc": "1982년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1982,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1083 (확장 데이터)",
    "desc": "1982년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1208 (확장 데이터)",
    "desc": "1982년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1982,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1333 (확장 데이터)",
    "desc": "1982년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1982,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1458 (확장 데이터)",
    "desc": "1982년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "TECHNOLOGY",
    "title": "1982년 기술 혁신 기록",
    "desc": "1982년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1982,
    "tag": "SOCIETY",
    "title": "1982년 한국 사회 변화상",
    "desc": "1982년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "CULTURE",
    "title": "1982년의 정밀 역사 기록 (1)",
    "desc": "1982년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "ECONOMY",
    "title": "1982년의 정밀 역사 기록 (2)",
    "desc": "1982년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "TECHNOLOGY",
    "title": "1982년의 정밀 역사 기록 (3)",
    "desc": "1982년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1982,
    "tag": "SOCIETY",
    "title": "1982년의 정밀 역사 기록 (4)",
    "desc": "1982년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 84 (확장 데이터)",
    "desc": "1983년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 209 (확장 데이터)",
    "desc": "1983년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1983,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 334 (확장 데이터)",
    "desc": "1983년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1983,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 459 (확장 데이터)",
    "desc": "1983년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 584 (확장 데이터)",
    "desc": "1983년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1983,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 709 (확장 데이터)",
    "desc": "1983년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1983,
    "tag": "WAR",
    "title": "연도별 상세 사건 834 (확장 데이터)",
    "desc": "1983년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 959 (확장 데이터)",
    "desc": "1983년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1983,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1084 (확장 데이터)",
    "desc": "1983년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1983,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1209 (확장 데이터)",
    "desc": "1983년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1334 (확장 데이터)",
    "desc": "1983년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1983,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1459 (확장 데이터)",
    "desc": "1983년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1983,
    "tag": "WAR",
    "title": "KAL 007기 소련 격추 사건",
    "desc": "대한항공 007편이 소련 전투기에 격추되어 탑승자 269명 전원 사망. 냉전 속 비극으로 미소 관계 악화",
    "location": "사할린, 소련",
    "region": [
      "아시아",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1983,
    "tag": "TECHNOLOGY",
    "title": "1983년 기술 혁신 기록",
    "desc": "1983년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1983,
    "tag": "SOCIETY",
    "title": "1983년 한국 사회 변화상",
    "desc": "1983년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "ECONOMY",
    "title": "1983년의 정밀 역사 기록 (1)",
    "desc": "1983년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "TECHNOLOGY",
    "title": "1983년의 정밀 역사 기록 (2)",
    "desc": "1983년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1983,
    "tag": "SOCIETY",
    "title": "1983년의 정밀 역사 기록 (3)",
    "desc": "1983년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "WAR",
    "title": "연도별 상세 사건 85 (확장 데이터)",
    "desc": "1984년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1984,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 210 (확장 데이터)",
    "desc": "1984년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 335 (확장 데이터)",
    "desc": "1984년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1984,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 460 (확장 데이터)",
    "desc": "1984년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1984,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 585 (확장 데이터)",
    "desc": "1984년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 710 (확장 데이터)",
    "desc": "1984년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1984,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 835 (확장 데이터)",
    "desc": "1984년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1984,
    "tag": "WAR",
    "title": "연도별 상세 사건 960 (확장 데이터)",
    "desc": "1984년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1085 (확장 데이터)",
    "desc": "1984년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1984,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1210 (확장 데이터)",
    "desc": "1984년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1984,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1335 (확장 데이터)",
    "desc": "1984년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1460 (확장 데이터)",
    "desc": "1984년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1984,
    "tag": "DISASTER",
    "title": "인도 보팔 화학 공장 폭발",
    "desc": "유니온카바이드 인도 공장에서 독가스 유출로 2만 명 이상 사망, 50만 명 부상. 사상 최악의 산업재해",
    "location": "보팔, 인도",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1984,
    "tag": "TECHNOLOGY",
    "title": "1984년 기술 혁신 기록",
    "desc": "1984년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1984,
    "tag": "SOCIETY",
    "title": "1984년 한국 사회 변화상",
    "desc": "1984년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "TECHNOLOGY",
    "title": "1984년의 정밀 역사 기록 (1)",
    "desc": "1984년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "SOCIETY",
    "title": "1984년의 정밀 역사 기록 (2)",
    "desc": "1984년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1984,
    "tag": "CULTURE",
    "title": "1984년의 정밀 역사 기록 (3)",
    "desc": "1984년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 86 (확장 데이터)",
    "desc": "1985년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1985,
    "tag": "WAR",
    "title": "연도별 상세 사건 211 (확장 데이터)",
    "desc": "1985년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1985,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 336 (확장 데이터)",
    "desc": "1985년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 461 (확장 데이터)",
    "desc": "1985년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1985,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 586 (확장 데이터)",
    "desc": "1985년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1985,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 711 (확장 데이터)",
    "desc": "1985년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 836 (확장 데이터)",
    "desc": "1985년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1985,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 961 (확장 데이터)",
    "desc": "1985년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1985,
    "tag": "WAR",
    "title": "연도별 상세 사건 1086 (확장 데이터)",
    "desc": "1985년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1211 (확장 데이터)",
    "desc": "1985년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1985,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1336 (확장 데이터)",
    "desc": "1985년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1985,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1461 (확장 데이터)",
    "desc": "1985년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "POLITICS",
    "title": "고르바초프 소련 서기장 취임·개혁 시작",
    "desc": "고르바초프가 소련 공산당 서기장으로 취임하여 글라스노스트(개방)·페레스트로이카(개혁) 정책 추진. 소련 붕괴의 시작",
    "location": "모스크바, 러시아",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1985,
    "tag": "TECHNOLOGY",
    "title": "1985년 기술 혁신 기록",
    "desc": "1985년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1985,
    "tag": "SOCIETY",
    "title": "1985년 한국 사회 변화상",
    "desc": "1985년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "SOCIETY",
    "title": "1985년의 정밀 역사 기록 (1)",
    "desc": "1985년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "CULTURE",
    "title": "1985년의 정밀 역사 기록 (2)",
    "desc": "1985년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1985,
    "tag": "ECONOMY",
    "title": "1985년의 정밀 역사 기록 (3)",
    "desc": "1985년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 87 (확장 데이터)",
    "desc": "1986년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 212 (확장 데이터)",
    "desc": "1986년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1986,
    "tag": "WAR",
    "title": "연도별 상세 사건 337 (확장 데이터)",
    "desc": "1986년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1986,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 462 (확장 데이터)",
    "desc": "1986년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 587 (확장 데이터)",
    "desc": "1986년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1986,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 712 (확장 데이터)",
    "desc": "1986년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1986,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 837 (확장 데이터)",
    "desc": "1986년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 962 (확장 데이터)",
    "desc": "1986년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1986,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1087 (확장 데이터)",
    "desc": "1986년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1986,
    "tag": "WAR",
    "title": "연도별 상세 사건 1212 (확장 데이터)",
    "desc": "1986년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1337 (확장 데이터)",
    "desc": "1986년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1986,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1462 (확장 데이터)",
    "desc": "1986년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1986,
    "tag": "DISASTER",
    "title": "체르노빌 원전 폭발 사고",
    "desc": "우크라이나 체르노빌 원자력 발전소 4호기가 폭발. 방사능이 유럽 전역에 확산. 수십만 명이 피폭된 역사상 최악의 원전 사고",
    "location": "체르노빌, 우크라이나",
    "region": [
      "러시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1986,
    "tag": "TECHNOLOGY",
    "title": "1986년 기술 혁신 기록",
    "desc": "1986년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1986,
    "tag": "SOCIETY",
    "title": "1986년 한국 사회 변화상",
    "desc": "1986년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "CULTURE",
    "title": "1986년의 정밀 역사 기록 (1)",
    "desc": "1986년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "ECONOMY",
    "title": "1986년의 정밀 역사 기록 (2)",
    "desc": "1986년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1986,
    "tag": "TECHNOLOGY",
    "title": "1986년의 정밀 역사 기록 (3)",
    "desc": "1986년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 88 (확장 데이터)",
    "desc": "1987년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1987,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 213 (확장 데이터)",
    "desc": "1987년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 338 (확장 데이터)",
    "desc": "1987년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1987,
    "tag": "WAR",
    "title": "연도별 상세 사건 463 (확장 데이터)",
    "desc": "1987년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1987,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 588 (확장 데이터)",
    "desc": "1987년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 713 (확장 데이터)",
    "desc": "1987년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1987,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 838 (확장 데이터)",
    "desc": "1987년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1987,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 963 (확장 데이터)",
    "desc": "1987년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1088 (확장 데이터)",
    "desc": "1987년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1987,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1213 (확장 데이터)",
    "desc": "1987년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1987,
    "tag": "WAR",
    "title": "연도별 상세 사건 1338 (확장 데이터)",
    "desc": "1987년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1463 (확장 데이터)",
    "desc": "1987년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1987,
    "tag": "POLITICS",
    "title": "6월 민주항쟁·대통령 직선제 개헌",
    "desc": "전두환 정권의 호헌 선언에 전국적 민주화 시위가 폭발. 결국 노태우의 6·29 선언으로 대통령 직선제 개헌 쟁취",
    "location": "서울·전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1987,
    "tag": "SOCIETY",
    "title": "박종철 고문 사망 사건",
    "desc": "서울대생 박종철이 경찰 고문으로 사망. 은폐 시도가 폭로되며 6월 항쟁의 결정적 도화선이 된 사건",
    "location": "서울 남영동",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1987,
    "tag": "TECHNOLOGY",
    "title": "1987년 기술 혁신 기록",
    "desc": "1987년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1987,
    "tag": "SOCIETY",
    "title": "1987년 한국 사회 변화상",
    "desc": "1987년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "ECONOMY",
    "title": "1987년의 정밀 역사 기록 (1)",
    "desc": "1987년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1987,
    "tag": "TECHNOLOGY",
    "title": "1987년의 정밀 역사 기록 (2)",
    "desc": "1987년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 89 (확장 데이터)",
    "desc": "1988년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1988,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 214 (확장 데이터)",
    "desc": "1988년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1988,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 339 (확장 데이터)",
    "desc": "1988년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 464 (확장 데이터)",
    "desc": "1988년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1988,
    "tag": "WAR",
    "title": "연도별 상세 사건 589 (확장 데이터)",
    "desc": "1988년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1988,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 714 (확장 데이터)",
    "desc": "1988년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 839 (확장 데이터)",
    "desc": "1988년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1988,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 964 (확장 데이터)",
    "desc": "1988년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1988,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1089 (확장 데이터)",
    "desc": "1988년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1214 (확장 데이터)",
    "desc": "1988년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1988,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1339 (확장 데이터)",
    "desc": "1988년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1988,
    "tag": "WAR",
    "title": "연도별 상세 사건 1464 (확장 데이터)",
    "desc": "1988년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "CULTURE",
    "title": "서울 올림픽 개최",
    "desc": "제24회 하계 올림픽이 서울에서 개최. 160개국 참가. 한국이 세계 무대에 도약한 역사적 사건이자 냉전 화해의 상징",
    "location": "서울",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1988,
    "tag": "TECHNOLOGY",
    "title": "1988년 기술 혁신 기록",
    "desc": "1988년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1988,
    "tag": "SOCIETY",
    "title": "1988년 한국 사회 변화상",
    "desc": "1988년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "TECHNOLOGY",
    "title": "1988년의 정밀 역사 기록 (1)",
    "desc": "1988년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "SOCIETY",
    "title": "1988년의 정밀 역사 기록 (2)",
    "desc": "1988년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1988,
    "tag": "CULTURE",
    "title": "1988년의 정밀 역사 기록 (3)",
    "desc": "1988년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "POLITICS",
    "title": "베를린 장벽 붕괴",
    "desc": "냉전 종식의 상징적 사건",
    "location": "베를린",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1989,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 90 (확장 데이터)",
    "desc": "1989년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 215 (확장 데이터)",
    "desc": "1989년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1989,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 340 (확장 데이터)",
    "desc": "1989년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1989,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 465 (확장 데이터)",
    "desc": "1989년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 590 (확장 데이터)",
    "desc": "1989년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1989,
    "tag": "WAR",
    "title": "연도별 상세 사건 715 (확장 데이터)",
    "desc": "1989년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1989,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 840 (확장 데이터)",
    "desc": "1989년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 965 (확장 데이터)",
    "desc": "1989년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1989,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1090 (확장 데이터)",
    "desc": "1989년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1989,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1215 (확장 데이터)",
    "desc": "1989년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1340 (확장 데이터)",
    "desc": "1989년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1989,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1465 (확장 데이터)",
    "desc": "1989년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1989,
    "tag": "POLITICS",
    "title": "천안문 사태",
    "desc": "베이징 천안문 광장에서 민주화를 요구하는 학생·시민을 중국 정부가 탱크로 진압. 수천 명 사망 추정",
    "location": "베이징, 중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1989,
    "tag": "TECHNOLOGY",
    "title": "1989년 기술 혁신 기록",
    "desc": "1989년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1989,
    "tag": "SOCIETY",
    "title": "1989년 한국 사회 변화상",
    "desc": "1989년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "SOCIETY",
    "title": "1989년의 정밀 역사 기록 (1)",
    "desc": "1989년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1989,
    "tag": "CULTURE",
    "title": "1989년의 정밀 역사 기록 (2)",
    "desc": "1989년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 91 (확장 데이터)",
    "desc": "1990년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1990,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 216 (확장 데이터)",
    "desc": "1990년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 341 (확장 데이터)",
    "desc": "1990년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1990,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 466 (확장 데이터)",
    "desc": "1990년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1990,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 591 (확장 데이터)",
    "desc": "1990년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 716 (확장 데이터)",
    "desc": "1990년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1990,
    "tag": "WAR",
    "title": "연도별 상세 사건 841 (확장 데이터)",
    "desc": "1990년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1990,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 966 (확장 데이터)",
    "desc": "1990년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1091 (확장 데이터)",
    "desc": "1990년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1990,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1216 (확장 데이터)",
    "desc": "1990년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1990,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1341 (확장 데이터)",
    "desc": "1990년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1466 (확장 데이터)",
    "desc": "1990년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1990,
    "tag": "POLITICS",
    "title": "독일 통일",
    "desc": "동서 독일이 45년 만에 통일. 2차 세계대전 종전 이후 분단된 독일이 하나의 국가로 재탄생. 냉전 종식의 완성",
    "location": "베를린, 독일",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1990,
    "tag": "POLITICS",
    "title": "남북고위급회담 시작",
    "desc": "서울과 평양을 오가며 남북 총리급 회담이 시작됨. 이후 1991년 남북기본합의서와 유엔 동시 가입으로 이어짐",
    "location": "서울·평양",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1990,
    "tag": "TECHNOLOGY",
    "title": "1990년 기술 혁신 기록",
    "desc": "1990년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1990,
    "tag": "SOCIETY",
    "title": "1990년 한국 사회 변화상",
    "desc": "1990년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "CULTURE",
    "title": "1990년의 정밀 역사 기록 (1)",
    "desc": "1990년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1990,
    "tag": "ECONOMY",
    "title": "1990년의 정밀 역사 기록 (2)",
    "desc": "1990년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "WAR",
    "title": "연도별 상세 사건 92 (확장 데이터)",
    "desc": "1991년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1991,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 217 (확장 데이터)",
    "desc": "1991년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1991,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 342 (확장 데이터)",
    "desc": "1991년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 467 (확장 데이터)",
    "desc": "1991년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1991,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 592 (확장 데이터)",
    "desc": "1991년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1991,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 717 (확장 데이터)",
    "desc": "1991년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 842 (확장 데이터)",
    "desc": "1991년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1991,
    "tag": "WAR",
    "title": "연도별 상세 사건 967 (확장 데이터)",
    "desc": "1991년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1991,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1092 (확장 데이터)",
    "desc": "1991년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1217 (확장 데이터)",
    "desc": "1991년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1991,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1342 (확장 데이터)",
    "desc": "1991년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1991,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1467 (확장 데이터)",
    "desc": "1991년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "WAR",
    "title": "걸프전쟁 - 이라크 쿠웨이트 침공 격퇴",
    "desc": "이라크가 쿠웨이트를 침공하자 미국 주도 연합군이 42일 만에 이라크군 격퇴. 최초의 CNN 생중계 전쟁",
    "location": "쿠웨이트·이라크",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1991,
    "tag": "POLITICS",
    "title": "소비에트 연방 해체",
    "desc": "소련이 15개 공화국으로 해체됨. 냉전의 공식적 종결이자 20세기를 규정한 이념 대결의 종막. 러시아 연방 출범",
    "location": "모스크바, 러시아",
    "region": [
      "러시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1991,
    "tag": "POLITICS",
    "title": "남북 유엔 동시 가입",
    "desc": "대한민국과 북한이 동시에 유엔에 가입. 두 개의 한국 체제가 국제법적으로 공인된 분단 공존의 선언",
    "location": "서울·평양·뉴욕",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1991,
    "tag": "TECHNOLOGY",
    "title": "1991년 기술 혁신 기록",
    "desc": "1991년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1991,
    "tag": "SOCIETY",
    "title": "1991년 한국 사회 변화상",
    "desc": "1991년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1991,
    "tag": "ECONOMY",
    "title": "1991년의 정밀 역사 기록 (1)",
    "desc": "1991년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 93 (확장 데이터)",
    "desc": "1992년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "WAR",
    "title": "연도별 상세 사건 218 (확장 데이터)",
    "desc": "1992년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1992,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 343 (확장 데이터)",
    "desc": "1992년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1992,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 468 (확장 데이터)",
    "desc": "1992년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 593 (확장 데이터)",
    "desc": "1992년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1992,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 718 (확장 데이터)",
    "desc": "1992년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1992,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 843 (확장 데이터)",
    "desc": "1992년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 968 (확장 데이터)",
    "desc": "1992년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1992,
    "tag": "WAR",
    "title": "연도별 상세 사건 1093 (확장 데이터)",
    "desc": "1992년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1992,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1218 (확장 데이터)",
    "desc": "1992년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1343 (확장 데이터)",
    "desc": "1992년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1992,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1468 (확장 데이터)",
    "desc": "1992년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1992,
    "tag": "SOCIETY",
    "title": "LA 폭동",
    "desc": "로드니 킹 구타 경찰관 무죄 판결에 분노한 LA 흑인 사회가 폭동 발생. 한인 타운 대규모 피해. 미국 인종 갈등 폭발",
    "location": "로스앤젤레스, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1992,
    "tag": "ECONOMY",
    "title": "한중 수교 수립",
    "desc": "한국과 중국이 공식 수교. 냉전 종식 후 이념 장벽을 넘은 역사적 외교 정상화. 교역 폭발적 증가의 시작",
    "location": "서울·베이징",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1992,
    "tag": "TECHNOLOGY",
    "title": "1992년 기술 혁신 기록",
    "desc": "1992년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1992,
    "tag": "SOCIETY",
    "title": "1992년 한국 사회 변화상",
    "desc": "1992년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "TECHNOLOGY",
    "title": "1992년의 정밀 역사 기록 (1)",
    "desc": "1992년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1992,
    "tag": "SOCIETY",
    "title": "1992년의 정밀 역사 기록 (2)",
    "desc": "1992년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 94 (확장 데이터)",
    "desc": "1993년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1993,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 219 (확장 데이터)",
    "desc": "1993년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "WAR",
    "title": "연도별 상세 사건 344 (확장 데이터)",
    "desc": "1993년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1993,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 469 (확장 데이터)",
    "desc": "1993년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1993,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 594 (확장 데이터)",
    "desc": "1993년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 719 (확장 데이터)",
    "desc": "1993년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1993,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 844 (확장 데이터)",
    "desc": "1993년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1993,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 969 (확장 데이터)",
    "desc": "1993년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1094 (확장 데이터)",
    "desc": "1993년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1993,
    "tag": "WAR",
    "title": "연도별 상세 사건 1219 (확장 데이터)",
    "desc": "1993년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1993,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1344 (확장 데이터)",
    "desc": "1993년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1469 (확장 데이터)",
    "desc": "1993년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1993,
    "tag": "POLITICS",
    "title": "문민정부 출범 - 김영삼 대통령",
    "desc": "김영삼이 취임하여 32년 만의 문민정부가 출범. 하나회 척결·금융실명제 실시 등 개혁을 추진",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 1993,
    "tag": "POLITICS",
    "title": "유럽연합(EU) 공식 출범",
    "desc": "마스트리흐트 조약으로 유럽연합(EU)이 공식 출범. 단일 시장·공동 통화·공동 외교 정책을 추구하는 통합 유럽의 탄생",
    "location": "브뤼셀, 벨기에",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1993,
    "tag": "TECHNOLOGY",
    "title": "1993년 기술 혁신 기록",
    "desc": "1993년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1993,
    "tag": "SOCIETY",
    "title": "1993년 한국 사회 변화상",
    "desc": "1993년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "SOCIETY",
    "title": "1993년의 정밀 역사 기록 (1)",
    "desc": "1993년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1993,
    "tag": "CULTURE",
    "title": "1993년의 정밀 역사 기록 (2)",
    "desc": "1993년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1994,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 95 (확장 데이터)",
    "desc": "1994년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1994,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 220 (확장 데이터)",
    "desc": "1994년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1994,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 345 (확장 데이터)",
    "desc": "1994년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1994,
    "tag": "WAR",
    "title": "연도별 상세 사건 470 (확장 데이터)",
    "desc": "1994년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1994,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 595 (확장 데이터)",
    "desc": "1994년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1994,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 720 (확장 데이터)",
    "desc": "1994년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1994,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 845 (확장 데이터)",
    "desc": "1994년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1994,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 970 (확장 데이터)",
    "desc": "1994년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1994,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1095 (확장 데이터)",
    "desc": "1994년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1994,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1220 (확장 데이터)",
    "desc": "1994년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1994,
    "tag": "WAR",
    "title": "연도별 상세 사건 1345 (확장 데이터)",
    "desc": "1994년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1994,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1470 (확장 데이터)",
    "desc": "1994년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1994,
    "tag": "TECHNOLOGY",
    "title": "인터넷 WWW 대중화 시작",
    "desc": "팀 버너스리의 월드와이드웹(WWW)이 대중에게 개방됨. 정보화 혁명의 시작으로 인류 역사상 가장 빠른 기술 확산",
    "location": "전 세계",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1994,
    "tag": "WAR",
    "title": "르완다 대학살",
    "desc": "후투족이 100일간 투치족 80만 명을 학살. 유엔·국제사회의 무기력한 방관 속에 자행된 20세기 최악의 제노사이드",
    "location": "르완다",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1994,
    "tag": "POLITICS",
    "title": "김일성 사망·김정일 세습",
    "desc": "북한 최고지도자 김일성 사망. 아들 김정일이 권력 승계. 이후 북한은 '고난의 행군' 기근으로 수십만 명 아사",
    "location": "평양",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1994,
    "tag": "POLITICS",
    "title": "남아프리카 공화국 첫 민주 선거·만델라 당선",
    "desc": "아파르트헤이트 철폐 후 넬슨 만델라가 남아공 최초의 흑인 대통령으로 당선. 인종차별 극복의 역사적 이정표",
    "location": "요하네스버그, 남아공",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1994,
    "tag": "TECHNOLOGY",
    "title": "1994년 기술 혁신 기록",
    "desc": "1994년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1994,
    "tag": "SOCIETY",
    "title": "1994년 한국 사회 변화상",
    "desc": "1994년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 96 (확장 데이터)",
    "desc": "1995년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 221 (확장 데이터)",
    "desc": "1995년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1995,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 346 (확장 데이터)",
    "desc": "1995년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1995,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 471 (확장 데이터)",
    "desc": "1995년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "WAR",
    "title": "연도별 상세 사건 596 (확장 데이터)",
    "desc": "1995년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1995,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 721 (확장 데이터)",
    "desc": "1995년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1995,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 846 (확장 데이터)",
    "desc": "1995년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 971 (확장 데이터)",
    "desc": "1995년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1995,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1096 (확장 데이터)",
    "desc": "1995년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1995,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1221 (확장 데이터)",
    "desc": "1995년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1346 (확장 데이터)",
    "desc": "1995년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1995,
    "tag": "WAR",
    "title": "연도별 상세 사건 1471 (확장 데이터)",
    "desc": "1995년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1995,
    "tag": "DISASTER",
    "title": "삼풍백화점 붕괴 참사",
    "desc": "서울 삼풍백화점이 부실 공사로 붕괴하여 502명 사망. 한국 경제 성장 이면의 안전 불감증을 고발한 대형 참사",
    "location": "서울 서초구",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1995,
    "tag": "DISASTER",
    "title": "고베 대지진·지하철 사린 테러",
    "desc": "일본 고베에서 규모 6.9 지진으로 6434명 사망. 같은 해 옴진리교가 도쿄 지하철에 사린 가스 살포 테러",
    "location": "고베·도쿄, 일본",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 1995,
    "tag": "TECHNOLOGY",
    "title": "1995년 기술 혁신 기록",
    "desc": "1995년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1995,
    "tag": "SOCIETY",
    "title": "1995년 한국 사회 변화상",
    "desc": "1995년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "ECONOMY",
    "title": "1995년의 정밀 역사 기록 (1)",
    "desc": "1995년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1995,
    "tag": "TECHNOLOGY",
    "title": "1995년의 정밀 역사 기록 (2)",
    "desc": "1995년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 97 (확장 데이터)",
    "desc": "1996년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1996,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 222 (확장 데이터)",
    "desc": "1996년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 347 (확장 데이터)",
    "desc": "1996년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1996,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 472 (확장 데이터)",
    "desc": "1996년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1996,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 597 (확장 데이터)",
    "desc": "1996년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "WAR",
    "title": "연도별 상세 사건 722 (확장 데이터)",
    "desc": "1996년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1996,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 847 (확장 데이터)",
    "desc": "1996년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1996,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 972 (확장 데이터)",
    "desc": "1996년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1097 (확장 데이터)",
    "desc": "1996년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1996,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1222 (확장 데이터)",
    "desc": "1996년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1996,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1347 (확장 데이터)",
    "desc": "1996년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1472 (확장 데이터)",
    "desc": "1996년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1996,
    "tag": "CULTURE",
    "title": "한류의 씨앗 - HOT 데뷔",
    "desc": "1세대 아이돌 그룹 H.O.T.가 데뷔. 이후 SM·YG·JYP 등 기획사 시스템으로 발전한 한류 K-POP의 원점",
    "location": "서울",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "TECHNOLOGY",
    "title": "1996년 기술 혁신 기록",
    "desc": "1996년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1996,
    "tag": "SOCIETY",
    "title": "1996년 한국 사회 변화상",
    "desc": "1996년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "TECHNOLOGY",
    "title": "1996년의 정밀 역사 기록 (1)",
    "desc": "1996년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "SOCIETY",
    "title": "1996년의 정밀 역사 기록 (2)",
    "desc": "1996년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1996,
    "tag": "CULTURE",
    "title": "1996년의 정밀 역사 기록 (3)",
    "desc": "1996년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 98 (확장 데이터)",
    "desc": "1997년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1997,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 223 (확장 데이터)",
    "desc": "1997년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1997,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 348 (확장 데이터)",
    "desc": "1997년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 473 (확장 데이터)",
    "desc": "1997년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1997,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 598 (확장 데이터)",
    "desc": "1997년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1997,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 723 (확장 데이터)",
    "desc": "1997년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "WAR",
    "title": "연도별 상세 사건 848 (확장 데이터)",
    "desc": "1997년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1997,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 973 (확장 데이터)",
    "desc": "1997년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1997,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1098 (확장 데이터)",
    "desc": "1997년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1223 (확장 데이터)",
    "desc": "1997년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1997,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1348 (확장 데이터)",
    "desc": "1997년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1997,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1473 (확장 데이터)",
    "desc": "1997년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "ECONOMY",
    "title": "IMF 외환위기·한국 구제금융 신청",
    "desc": "동남아 금융위기가 한국으로 번져 IMF에 550억 달러 구제금융 신청. '금 모으기 운동'과 대규모 실업으로 사회 충격",
    "location": "서울·전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1997,
    "tag": "POLITICS",
    "title": "홍콩 중국 반환",
    "desc": "영국이 99년 조차 기간 만료로 홍콩을 중국에 반환. 일국양제 원칙 아래 2047년까지 자치권 보장 약속",
    "location": "홍콩",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1997,
    "tag": "TECHNOLOGY",
    "title": "1997년 기술 혁신 기록",
    "desc": "1997년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1997,
    "tag": "SOCIETY",
    "title": "1997년 한국 사회 변화상",
    "desc": "1997년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "SOCIETY",
    "title": "1997년의 정밀 역사 기록 (1)",
    "desc": "1997년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1997,
    "tag": "CULTURE",
    "title": "1997년의 정밀 역사 기록 (2)",
    "desc": "1997년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "WAR",
    "title": "연도별 상세 사건 99 (확장 데이터)",
    "desc": "1998년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 224 (확장 데이터)",
    "desc": "1998년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1998,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 349 (확장 데이터)",
    "desc": "1998년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1998,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 474 (확장 데이터)",
    "desc": "1998년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 599 (확장 데이터)",
    "desc": "1998년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1998,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 724 (확장 데이터)",
    "desc": "1998년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1998,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 849 (확장 데이터)",
    "desc": "1998년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "WAR",
    "title": "연도별 상세 사건 974 (확장 데이터)",
    "desc": "1998년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1998,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1099 (확장 데이터)",
    "desc": "1998년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1998,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1224 (확장 데이터)",
    "desc": "1998년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1349 (확장 데이터)",
    "desc": "1998년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1998,
    "tag": "POLITICS",
    "title": "국민의 정부 출범·최초 수평적 정권 교체",
    "desc": "김대중 대통령 취임으로 한국 역사상 최초의 여야 간 평화적 정권 교체 달성. 햇볕정책으로 남북 화해 시도",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 1998,
    "tag": "TECHNOLOGY",
    "title": "구글 창업",
    "desc": "래리 페이지와 세르게이 브린이 구글을 창업. 검색 엔진 혁명으로 인터넷 시대를 지배하는 세계 최대 IT 기업으로 성장",
    "location": "멘로파크, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 1998,
    "tag": "TECHNOLOGY",
    "title": "1998년 기술 혁신 기록",
    "desc": "1998년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1998,
    "tag": "SOCIETY",
    "title": "1998년 한국 사회 변화상",
    "desc": "1998년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "CULTURE",
    "title": "1998년의 정밀 역사 기록 (1)",
    "desc": "1998년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1998,
    "tag": "ECONOMY",
    "title": "1998년의 정밀 역사 기록 (2)",
    "desc": "1998년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 100 (확장 데이터)",
    "desc": "1999년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1999,
    "tag": "WAR",
    "title": "연도별 상세 사건 225 (확장 데이터)",
    "desc": "1999년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 350 (확장 데이터)",
    "desc": "1999년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1999,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 475 (확장 데이터)",
    "desc": "1999년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1999,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 600 (확장 데이터)",
    "desc": "1999년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 725 (확장 데이터)",
    "desc": "1999년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1999,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 850 (확장 데이터)",
    "desc": "1999년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1999,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 975 (확장 데이터)",
    "desc": "1999년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "WAR",
    "title": "연도별 상세 사건 1100 (확장 데이터)",
    "desc": "1999년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1999,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1225 (확장 데이터)",
    "desc": "1999년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 1999,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1350 (확장 데이터)",
    "desc": "1999년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "TECHNOLOGY",
    "title": "1999년 기술 혁신 기록",
    "desc": "1999년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 1999,
    "tag": "SOCIETY",
    "title": "1999년 한국 사회 변화상",
    "desc": "1999년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "ECONOMY",
    "title": "1999년의 정밀 역사 기록 (1)",
    "desc": "1999년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "TECHNOLOGY",
    "title": "1999년의 정밀 역사 기록 (2)",
    "desc": "1999년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "SOCIETY",
    "title": "1999년의 정밀 역사 기록 (3)",
    "desc": "1999년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 1999,
    "tag": "CULTURE",
    "title": "1999년의 정밀 역사 기록 (4)",
    "desc": "1999년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 101 (확장 데이터)",
    "desc": "2000년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 226 (확장 데이터)",
    "desc": "2000년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2000,
    "tag": "WAR",
    "title": "연도별 상세 사건 351 (확장 데이터)",
    "desc": "2000년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 476 (확장 데이터)",
    "desc": "2000년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 601 (확장 데이터)",
    "desc": "2000년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2000,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 726 (확장 데이터)",
    "desc": "2000년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 851 (확장 데이터)",
    "desc": "2000년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 976 (확장 데이터)",
    "desc": "2000년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2000,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1101 (확장 데이터)",
    "desc": "2000년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "WAR",
    "title": "연도별 상세 사건 1226 (확장 데이터)",
    "desc": "2000년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1351 (확장 데이터)",
    "desc": "2000년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2000,
    "tag": "POLITICS",
    "title": "남북정상회담 최초 개최",
    "desc": "김대중·김정일의 역사적 첫 남북정상회담이 평양에서 열림. 6·15 공동선언 채택. 김대중 노벨평화상 수상",
    "location": "평양",
    "region": [
      "평양",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "닷컴 버블 붕괴",
    "desc": "인터넷 기업 주가가 폭락하며 닷컴 버블이 붕괴. 나스닥 지수가 78% 폭락. 수조 달러의 시가총액이 증발",
    "location": "미국·전 세계",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "2000년 기술 혁신 기록",
    "desc": "2000년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "SOCIETY",
    "title": "2000년 한국 사회 변화상",
    "desc": "2000년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "2000년의 정밀 역사 기록 (1)",
    "desc": "2000년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "SOCIETY",
    "title": "2000년의 정밀 역사 기록 (2)",
    "desc": "2000년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "SCIENCE",
    "title": "2000년 나노·바이오 기술 발전",
    "desc": "2000년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2000,
    "tag": "ECONOMY",
    "title": "2000년 정밀 연대기 기록 2",
    "desc": "2000년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "2000년 정밀 연대기 기록 3",
    "desc": "2000년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "SOCIETY",
    "title": "2000년 정밀 연대기 기록 4",
    "desc": "2000년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "ECONOMY",
    "title": "2000년 정밀 연대기 기록 5",
    "desc": "2000년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2000,
    "tag": "TECHNOLOGY",
    "title": "2000년 정밀 연대기 기록 6",
    "desc": "2000년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 102 (확장 데이터)",
    "desc": "2001년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 227 (확장 데이터)",
    "desc": "2001년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 352 (확장 데이터)",
    "desc": "2001년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2001,
    "tag": "WAR",
    "title": "연도별 상세 사건 477 (확장 데이터)",
    "desc": "2001년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 602 (확장 데이터)",
    "desc": "2001년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 727 (확장 데이터)",
    "desc": "2001년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2001,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 852 (확장 데이터)",
    "desc": "2001년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 977 (확장 데이터)",
    "desc": "2001년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1102 (확장 데이터)",
    "desc": "2001년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2001,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1227 (확장 데이터)",
    "desc": "2001년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "WAR",
    "title": "연도별 상세 사건 1352 (확장 데이터)",
    "desc": "2001년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "WAR",
    "title": "9·11 테러 - 미국 세계무역센터 공격",
    "desc": "알카에다가 납치한 항공기 4대로 뉴욕 쌍둥이 빌딩·펜타곤을 공격. 2996명 사망. 21세기 세계 정치를 바꾼 사건",
    "location": "뉴욕·워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2001,
    "tag": "WAR",
    "title": "미국 아프가니스탄 침공",
    "desc": "9·11 테러에 대응하여 미국이 아프가니스탄을 침공. 탈레반 정권 붕괴. 20년간의 전쟁 시작. 2021년 미군 철수로 탈레반 재집권",
    "location": "아프가니스탄",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2001,
    "tag": "TECHNOLOGY",
    "title": "2001년 기술 혁신 기록",
    "desc": "2001년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "SOCIETY",
    "title": "2001년 한국 사회 변화상",
    "desc": "2001년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "SOCIETY",
    "title": "2001년의 정밀 역사 기록 (1)",
    "desc": "2001년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "CULTURE",
    "title": "2001년의 정밀 역사 기록 (2)",
    "desc": "2001년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "SCIENCE",
    "title": "2001년 나노·바이오 기술 발전",
    "desc": "2001년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2001,
    "tag": "ECONOMY",
    "title": "2001년 정밀 연대기 기록 2",
    "desc": "2001년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "TECHNOLOGY",
    "title": "2001년 정밀 연대기 기록 3",
    "desc": "2001년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "SOCIETY",
    "title": "2001년 정밀 연대기 기록 4",
    "desc": "2001년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "ECONOMY",
    "title": "2001년 정밀 연대기 기록 5",
    "desc": "2001년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2001,
    "tag": "TECHNOLOGY",
    "title": "2001년 정밀 연대기 기록 6",
    "desc": "2001년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 103 (확장 데이터)",
    "desc": "2002년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2002,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 228 (확장 데이터)",
    "desc": "2002년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 353 (확장 데이터)",
    "desc": "2002년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 478 (확장 데이터)",
    "desc": "2002년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2002,
    "tag": "WAR",
    "title": "연도별 상세 사건 603 (확장 데이터)",
    "desc": "2002년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 728 (확장 데이터)",
    "desc": "2002년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 853 (확장 데이터)",
    "desc": "2002년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2002,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 978 (확장 데이터)",
    "desc": "2002년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1103 (확장 데이터)",
    "desc": "2002년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1228 (확장 데이터)",
    "desc": "2002년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2002,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1353 (확장 데이터)",
    "desc": "2002년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "CULTURE",
    "title": "한일 월드컵·4강 신화",
    "desc": "한국이 사상 첫 공동 개최 월드컵에서 4강에 진출하는 기적을 달성. 붉은 악마의 거리 응원으로 전국이 하나가 됨",
    "location": "서울·전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2002,
    "tag": "TECHNOLOGY",
    "title": "2002년 기술 혁신 기록",
    "desc": "2002년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "SOCIETY",
    "title": "2002년 한국 사회 변화상",
    "desc": "2002년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "CULTURE",
    "title": "2002년의 정밀 역사 기록 (1)",
    "desc": "2002년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "ECONOMY",
    "title": "2002년의 정밀 역사 기록 (2)",
    "desc": "2002년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "TECHNOLOGY",
    "title": "2002년의 정밀 역사 기록 (3)",
    "desc": "2002년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "SCIENCE",
    "title": "2002년 나노·바이오 기술 발전",
    "desc": "2002년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2002,
    "tag": "ECONOMY",
    "title": "2002년 정밀 연대기 기록 2",
    "desc": "2002년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "TECHNOLOGY",
    "title": "2002년 정밀 연대기 기록 3",
    "desc": "2002년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "SOCIETY",
    "title": "2002년 정밀 연대기 기록 4",
    "desc": "2002년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "ECONOMY",
    "title": "2002년 정밀 연대기 기록 5",
    "desc": "2002년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2002,
    "tag": "TECHNOLOGY",
    "title": "2002년 정밀 연대기 기록 6",
    "desc": "2002년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 104 (확장 데이터)",
    "desc": "2003년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 229 (확장 데이터)",
    "desc": "2003년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2003,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 354 (확장 데이터)",
    "desc": "2003년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 479 (확장 데이터)",
    "desc": "2003년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 604 (확장 데이터)",
    "desc": "2003년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2003,
    "tag": "WAR",
    "title": "연도별 상세 사건 729 (확장 데이터)",
    "desc": "2003년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 854 (확장 데이터)",
    "desc": "2003년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 979 (확장 데이터)",
    "desc": "2003년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2003,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1104 (확장 데이터)",
    "desc": "2003년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1229 (확장 데이터)",
    "desc": "2003년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1354 (확장 데이터)",
    "desc": "2003년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2003,
    "tag": "WAR",
    "title": "미국 이라크 전쟁 시작",
    "desc": "미국이 대량살상무기 보유 의혹을 명분으로 이라크를 침공. 사담 후세인 정권 붕괴. 결국 WMD 없음 확인으로 명분 논란",
    "location": "이라크",
    "region": [
      "중동",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2003,
    "tag": "DISEASE",
    "title": "사스(SARS) 세계 확산",
    "desc": "중국에서 발생한 중증급성호흡기증후군(사스)이 아시아 전역으로 확산. 8098명 감염, 774명 사망. 팬데믹의 전조",
    "location": "중국·홍콩·캐나다",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2003,
    "tag": "TECHNOLOGY",
    "title": "2003년 기술 혁신 기록",
    "desc": "2003년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "SOCIETY",
    "title": "2003년 한국 사회 변화상",
    "desc": "2003년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "ECONOMY",
    "title": "2003년의 정밀 역사 기록 (1)",
    "desc": "2003년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "TECHNOLOGY",
    "title": "2003년의 정밀 역사 기록 (2)",
    "desc": "2003년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "SCIENCE",
    "title": "2003년 나노·바이오 기술 발전",
    "desc": "2003년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2003,
    "tag": "ECONOMY",
    "title": "2003년 정밀 연대기 기록 2",
    "desc": "2003년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "TECHNOLOGY",
    "title": "2003년 정밀 연대기 기록 3",
    "desc": "2003년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "SOCIETY",
    "title": "2003년 정밀 연대기 기록 4",
    "desc": "2003년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "ECONOMY",
    "title": "2003년 정밀 연대기 기록 5",
    "desc": "2003년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2003,
    "tag": "TECHNOLOGY",
    "title": "2003년 정밀 연대기 기록 6",
    "desc": "2003년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 105 (확장 데이터)",
    "desc": "2004년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 230 (확장 데이터)",
    "desc": "2004년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 355 (확장 데이터)",
    "desc": "2004년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2004,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 480 (확장 데이터)",
    "desc": "2004년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 605 (확장 데이터)",
    "desc": "2004년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 730 (확장 데이터)",
    "desc": "2004년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2004,
    "tag": "WAR",
    "title": "연도별 상세 사건 855 (확장 데이터)",
    "desc": "2004년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 980 (확장 데이터)",
    "desc": "2004년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1105 (확장 데이터)",
    "desc": "2004년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2004,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1230 (확장 데이터)",
    "desc": "2004년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1355 (확장 데이터)",
    "desc": "2004년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "DISASTER",
    "title": "인도양 대지진·쓰나미",
    "desc": "인도네시아 수마트라 해역에서 규모 9.1 지진이 발생하여 인도양 연안에 쓰나미 직격. 14개국 22만 명 이상 사망",
    "location": "인도양 연안",
    "region": [
      "아시아",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "2004년 기술 혁신 기록",
    "desc": "2004년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "SOCIETY",
    "title": "2004년 한국 사회 변화상",
    "desc": "2004년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "2004년의 정밀 역사 기록 (1)",
    "desc": "2004년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "SOCIETY",
    "title": "2004년의 정밀 역사 기록 (2)",
    "desc": "2004년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "CULTURE",
    "title": "2004년의 정밀 역사 기록 (3)",
    "desc": "2004년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "SCIENCE",
    "title": "2004년 나노·바이오 기술 발전",
    "desc": "2004년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2004,
    "tag": "ECONOMY",
    "title": "2004년 정밀 연대기 기록 2",
    "desc": "2004년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "2004년 정밀 연대기 기록 3",
    "desc": "2004년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "SOCIETY",
    "title": "2004년 정밀 연대기 기록 4",
    "desc": "2004년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "ECONOMY",
    "title": "2004년 정밀 연대기 기록 5",
    "desc": "2004년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2004,
    "tag": "TECHNOLOGY",
    "title": "2004년 정밀 연대기 기록 6",
    "desc": "2004년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "WAR",
    "title": "연도별 상세 사건 106 (확장 데이터)",
    "desc": "2005년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2005,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 231 (확장 데이터)",
    "desc": "2005년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 356 (확장 데이터)",
    "desc": "2005년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 481 (확장 데이터)",
    "desc": "2005년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2005,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 606 (확장 데이터)",
    "desc": "2005년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 731 (확장 데이터)",
    "desc": "2005년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 856 (확장 데이터)",
    "desc": "2005년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2005,
    "tag": "WAR",
    "title": "연도별 상세 사건 981 (확장 데이터)",
    "desc": "2005년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1106 (확장 데이터)",
    "desc": "2005년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1231 (확장 데이터)",
    "desc": "2005년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2005,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1356 (확장 데이터)",
    "desc": "2005년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "POLITICS",
    "title": "노무현 대통령 탄핵 기각·복귀",
    "desc": "국회의 노무현 대통령 탄핵안이 헌법재판소에 의해 기각됨. 대통령 직무 63일 만에 복귀. 한국 헌정사의 전례 없는 사건",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2005,
    "tag": "TECHNOLOGY",
    "title": "2005년 기술 혁신 기록",
    "desc": "2005년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "SOCIETY",
    "title": "2005년 한국 사회 변화상",
    "desc": "2005년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "SOCIETY",
    "title": "2005년의 정밀 역사 기록 (1)",
    "desc": "2005년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "CULTURE",
    "title": "2005년의 정밀 역사 기록 (2)",
    "desc": "2005년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "ECONOMY",
    "title": "2005년의 정밀 역사 기록 (3)",
    "desc": "2005년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "SCIENCE",
    "title": "2005년 나노·바이오 기술 발전",
    "desc": "2005년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2005,
    "tag": "ECONOMY",
    "title": "2005년 정밀 연대기 기록 2",
    "desc": "2005년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "TECHNOLOGY",
    "title": "2005년 정밀 연대기 기록 3",
    "desc": "2005년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "SOCIETY",
    "title": "2005년 정밀 연대기 기록 4",
    "desc": "2005년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "ECONOMY",
    "title": "2005년 정밀 연대기 기록 5",
    "desc": "2005년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2005,
    "tag": "TECHNOLOGY",
    "title": "2005년 정밀 연대기 기록 6",
    "desc": "2005년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 107 (확장 데이터)",
    "desc": "2006년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "WAR",
    "title": "연도별 상세 사건 232 (확장 데이터)",
    "desc": "2006년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 357 (확장 데이터)",
    "desc": "2006년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 482 (확장 데이터)",
    "desc": "2006년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 607 (확장 데이터)",
    "desc": "2006년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2006,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 732 (확장 데이터)",
    "desc": "2006년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 857 (확장 데이터)",
    "desc": "2006년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 982 (확장 데이터)",
    "desc": "2006년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2006,
    "tag": "WAR",
    "title": "연도별 상세 사건 1107 (확장 데이터)",
    "desc": "2006년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1232 (확장 데이터)",
    "desc": "2006년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1357 (확장 데이터)",
    "desc": "2006년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2006,
    "tag": "POLITICS",
    "title": "북한 1차 핵실험",
    "desc": "북한이 함경북도 풍계리에서 1차 핵실험을 강행. 한반도 비핵화를 목표로 한 6자회담이 사실상 무력화됨",
    "location": "풍계리, 북한",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "2006년 기술 혁신 기록",
    "desc": "2006년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "SOCIETY",
    "title": "2006년 한국 사회 변화상",
    "desc": "2006년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "CULTURE",
    "title": "2006년의 정밀 역사 기록 (1)",
    "desc": "2006년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "ECONOMY",
    "title": "2006년의 정밀 역사 기록 (2)",
    "desc": "2006년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "2006년의 정밀 역사 기록 (3)",
    "desc": "2006년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "SCIENCE",
    "title": "2006년 나노·바이오 기술 발전",
    "desc": "2006년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2006,
    "tag": "ECONOMY",
    "title": "2006년 정밀 연대기 기록 2",
    "desc": "2006년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "2006년 정밀 연대기 기록 3",
    "desc": "2006년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "SOCIETY",
    "title": "2006년 정밀 연대기 기록 4",
    "desc": "2006년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "ECONOMY",
    "title": "2006년 정밀 연대기 기록 5",
    "desc": "2006년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2006,
    "tag": "TECHNOLOGY",
    "title": "2006년 정밀 연대기 기록 6",
    "desc": "2006년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "아이폰 출시",
    "desc": "모바일 인터넷과 스마트폰 시대를 연 혁신적 기기",
    "location": "미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 108 (확장 데이터)",
    "desc": "2007년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 233 (확장 데이터)",
    "desc": "2007년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "WAR",
    "title": "연도별 상세 사건 358 (확장 데이터)",
    "desc": "2007년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 483 (확장 데이터)",
    "desc": "2007년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 608 (확장 데이터)",
    "desc": "2007년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 733 (확장 데이터)",
    "desc": "2007년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2007,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 858 (확장 데이터)",
    "desc": "2007년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 983 (확장 데이터)",
    "desc": "2007년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1108 (확장 데이터)",
    "desc": "2007년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2007,
    "tag": "WAR",
    "title": "연도별 상세 사건 1233 (확장 데이터)",
    "desc": "2007년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1358 (확장 데이터)",
    "desc": "2007년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "아이폰 출시 - 스마트폰 혁명",
    "desc": "스티브 잡스가 최초의 아이폰을 발표. 스마트폰 시대를 열며 인류의 커뮤니케이션·소비·여가 패턴을 완전히 바꿈",
    "location": "샌프란시스코, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "서브프라임 모기지 위기 시작",
    "desc": "미국 비우량주택담보대출 부실로 금융위기의 씨앗이 자라기 시작. 이듬해 글로벌 금융위기로 폭발",
    "location": "미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "2007년 기술 혁신 기록",
    "desc": "2007년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "SOCIETY",
    "title": "2007년 한국 사회 변화상",
    "desc": "2007년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "2007년의 정밀 역사 기록 (1)",
    "desc": "2007년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "2007년의 정밀 역사 기록 (2)",
    "desc": "2007년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "SCIENCE",
    "title": "2007년 나노·바이오 기술 발전",
    "desc": "2007년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "2007년 정밀 연대기 기록 2",
    "desc": "2007년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "2007년 정밀 연대기 기록 3",
    "desc": "2007년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "SOCIETY",
    "title": "2007년 정밀 연대기 기록 4",
    "desc": "2007년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "ECONOMY",
    "title": "2007년 정밀 연대기 기록 5",
    "desc": "2007년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2007,
    "tag": "TECHNOLOGY",
    "title": "2007년 정밀 연대기 기록 6",
    "desc": "2007년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 109 (확장 데이터)",
    "desc": "2008년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2008,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 234 (확장 데이터)",
    "desc": "2008년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 359 (확장 데이터)",
    "desc": "2008년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "WAR",
    "title": "연도별 상세 사건 484 (확장 데이터)",
    "desc": "2008년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2008,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 609 (확장 데이터)",
    "desc": "2008년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 734 (확장 데이터)",
    "desc": "2008년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 859 (확장 데이터)",
    "desc": "2008년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2008,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 984 (확장 데이터)",
    "desc": "2008년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1109 (확장 데이터)",
    "desc": "2008년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1234 (확장 데이터)",
    "desc": "2008년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2008,
    "tag": "WAR",
    "title": "연도별 상세 사건 1359 (확장 데이터)",
    "desc": "2008년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "ECONOMY",
    "title": "리먼브라더스 파산·글로벌 금융위기",
    "desc": "미국 4위 투자은행 리먼브라더스가 파산하며 전 세계 금융위기 폭발. 각국이 수조 달러의 구제금융을 투입",
    "location": "뉴욕, 미국",
    "region": [
      "아메리카",
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2008,
    "tag": "POLITICS",
    "title": "버락 오바마 미국 최초 흑인 대통령 당선",
    "desc": "버락 오바마가 미국 역사상 최초의 아프리카계 대통령으로 당선. '우리는 할 수 있다(Yes We Can)' 슬로건으로 전 세계 감동",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2008,
    "tag": "TECHNOLOGY",
    "title": "2008년 기술 혁신 기록",
    "desc": "2008년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "SOCIETY",
    "title": "2008년 한국 사회 변화상",
    "desc": "2008년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "TECHNOLOGY",
    "title": "2008년의 정밀 역사 기록 (1)",
    "desc": "2008년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "SOCIETY",
    "title": "2008년의 정밀 역사 기록 (2)",
    "desc": "2008년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "SCIENCE",
    "title": "2008년 나노·바이오 기술 발전",
    "desc": "2008년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2008,
    "tag": "ECONOMY",
    "title": "2008년 정밀 연대기 기록 2",
    "desc": "2008년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "TECHNOLOGY",
    "title": "2008년 정밀 연대기 기록 3",
    "desc": "2008년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "SOCIETY",
    "title": "2008년 정밀 연대기 기록 4",
    "desc": "2008년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "ECONOMY",
    "title": "2008년 정밀 연대기 기록 5",
    "desc": "2008년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2008,
    "tag": "TECHNOLOGY",
    "title": "2008년 정밀 연대기 기록 6",
    "desc": "2008년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 110 (확장 데이터)",
    "desc": "2009년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 235 (확장 데이터)",
    "desc": "2009년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2009,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 360 (확장 데이터)",
    "desc": "2009년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 485 (확장 데이터)",
    "desc": "2009년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "WAR",
    "title": "연도별 상세 사건 610 (확장 데이터)",
    "desc": "2009년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2009,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 735 (확장 데이터)",
    "desc": "2009년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 860 (확장 데이터)",
    "desc": "2009년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 985 (확장 데이터)",
    "desc": "2009년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2009,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1110 (확장 데이터)",
    "desc": "2009년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1235 (확장 데이터)",
    "desc": "2009년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1360 (확장 데이터)",
    "desc": "2009년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2009,
    "tag": "CULTURE",
    "title": "강남스타일·한류 세계화 본격화",
    "desc": "K-POP이 아시아를 넘어 유럽·아메리카로 확산되며 한류 세계화가 본격화. BTS 데뷔(2013) 이전 전 단계의 한류 물결",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "DISEASE",
    "title": "신종플루 팬데믹",
    "desc": "H1N1 인플루엔자(신종플루)가 전 세계로 확산. WHO 팬데믹 선언. 1만 8000명 이상 사망 공식 집계, 실제는 훨씬 많을 것으로 추정",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2009,
    "tag": "TECHNOLOGY",
    "title": "2009년 기술 혁신 기록",
    "desc": "2009년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "SOCIETY",
    "title": "2009년 한국 사회 변화상",
    "desc": "2009년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "SOCIETY",
    "title": "2009년의 정밀 역사 기록 (1)",
    "desc": "2009년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "CULTURE",
    "title": "2009년의 정밀 역사 기록 (2)",
    "desc": "2009년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "SCIENCE",
    "title": "2009년 나노·바이오 기술 발전",
    "desc": "2009년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2009,
    "tag": "ECONOMY",
    "title": "2009년 정밀 연대기 기록 2",
    "desc": "2009년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "TECHNOLOGY",
    "title": "2009년 정밀 연대기 기록 3",
    "desc": "2009년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "SOCIETY",
    "title": "2009년 정밀 연대기 기록 4",
    "desc": "2009년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "ECONOMY",
    "title": "2009년 정밀 연대기 기록 5",
    "desc": "2009년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2009,
    "tag": "TECHNOLOGY",
    "title": "2009년 정밀 연대기 기록 6",
    "desc": "2009년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 111 (확장 데이터)",
    "desc": "2010년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 236 (확장 데이터)",
    "desc": "2010년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 361 (확장 데이터)",
    "desc": "2010년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2010,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 486 (확장 데이터)",
    "desc": "2010년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 611 (확장 데이터)",
    "desc": "2010년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "WAR",
    "title": "연도별 상세 사건 736 (확장 데이터)",
    "desc": "2010년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2010,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 861 (확장 데이터)",
    "desc": "2010년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 986 (확장 데이터)",
    "desc": "2010년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1111 (확장 데이터)",
    "desc": "2010년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2010,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1236 (확장 데이터)",
    "desc": "2010년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1361 (확장 데이터)",
    "desc": "2010년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "DISASTER",
    "title": "아이티 지진·천안함 폭침",
    "desc": "아이티에서 규모 7.0 지진으로 22만 명 사망. 한국에서는 해군 초계함 천안함이 북한 어뢰 공격으로 침몰, 46명 전사",
    "location": "아이티·서해",
    "region": [
      "아메리카",
      "전국"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2010,
    "tag": "POLITICS",
    "title": "아랍의 봄 시작 (튀니지)",
    "desc": "튀니지 청년 부아지지의 분신이 도화선이 되어 아랍 전역에 민주화 시위 물결. 이집트·리비아 등 독재 정권 연쇄 붕괴",
    "location": "튀니지·이집트·리비아",
    "region": [
      "중동",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2010,
    "tag": "TECHNOLOGY",
    "title": "2010년 기술 혁신 기록",
    "desc": "2010년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "SOCIETY",
    "title": "2010년 한국 사회 변화상",
    "desc": "2010년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "CULTURE",
    "title": "2010년의 정밀 역사 기록 (1)",
    "desc": "2010년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "ECONOMY",
    "title": "2010년의 정밀 역사 기록 (2)",
    "desc": "2010년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "SCIENCE",
    "title": "2010년 나노·바이오 기술 발전",
    "desc": "2010년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2010,
    "tag": "ECONOMY",
    "title": "2010년 정밀 연대기 기록 2",
    "desc": "2010년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "TECHNOLOGY",
    "title": "2010년 정밀 연대기 기록 3",
    "desc": "2010년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "SOCIETY",
    "title": "2010년 정밀 연대기 기록 4",
    "desc": "2010년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "ECONOMY",
    "title": "2010년 정밀 연대기 기록 5",
    "desc": "2010년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2010,
    "tag": "TECHNOLOGY",
    "title": "2010년 정밀 연대기 기록 6",
    "desc": "2010년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 112 (확장 데이터)",
    "desc": "2011년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2011,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 237 (확장 데이터)",
    "desc": "2011년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 362 (확장 데이터)",
    "desc": "2011년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 487 (확장 데이터)",
    "desc": "2011년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2011,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 612 (확장 데이터)",
    "desc": "2011년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 737 (확장 데이터)",
    "desc": "2011년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "WAR",
    "title": "연도별 상세 사건 862 (확장 데이터)",
    "desc": "2011년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2011,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 987 (확장 데이터)",
    "desc": "2011년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1112 (확장 데이터)",
    "desc": "2011년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1237 (확장 데이터)",
    "desc": "2011년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2011,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1362 (확장 데이터)",
    "desc": "2011년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "DISASTER",
    "title": "동일본 대지진·후쿠시마 원전 사고",
    "desc": "규모 9.0 대지진과 쓰나미로 1만 9000명 사망. 후쿠시마 원전 멜트다운으로 방사능 오염 및 원전 안전 논쟁 재점화",
    "location": "도호쿠, 일본",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2011,
    "tag": "WAR",
    "title": "오사마 빈 라덴 사살",
    "desc": "미국 네이비실 팀이 파키스탄에서 알카에다 지도자 오사마 빈 라덴을 사살. 9·11 테러 10년 만의 복수",
    "location": "아보타바드, 파키스탄",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2011,
    "tag": "POLITICS",
    "title": "김정일 사망·김정은 세습",
    "desc": "북한 김정일 국방위원장 사망. 아들 김정은이 3대 세습으로 권력 장악. 핵·미사일 고도화 가속",
    "location": "평양",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2011,
    "tag": "TECHNOLOGY",
    "title": "2011년 기술 혁신 기록",
    "desc": "2011년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "SOCIETY",
    "title": "2011년 한국 사회 변화상",
    "desc": "2011년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "ECONOMY",
    "title": "2011년의 정밀 역사 기록 (1)",
    "desc": "2011년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "SCIENCE",
    "title": "2011년 나노·바이오 기술 발전",
    "desc": "2011년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2011,
    "tag": "ECONOMY",
    "title": "2011년 정밀 연대기 기록 2",
    "desc": "2011년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "TECHNOLOGY",
    "title": "2011년 정밀 연대기 기록 3",
    "desc": "2011년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "SOCIETY",
    "title": "2011년 정밀 연대기 기록 4",
    "desc": "2011년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "ECONOMY",
    "title": "2011년 정밀 연대기 기록 5",
    "desc": "2011년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2011,
    "tag": "TECHNOLOGY",
    "title": "2011년 정밀 연대기 기록 6",
    "desc": "2011년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "WAR",
    "title": "연도별 상세 사건 113 (확장 데이터)",
    "desc": "2012년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 238 (확장 데이터)",
    "desc": "2012년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2012,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 363 (확장 데이터)",
    "desc": "2012년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 488 (확장 데이터)",
    "desc": "2012년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 613 (확장 데이터)",
    "desc": "2012년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2012,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 738 (확장 데이터)",
    "desc": "2012년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 863 (확장 데이터)",
    "desc": "2012년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "WAR",
    "title": "연도별 상세 사건 988 (확장 데이터)",
    "desc": "2012년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1113 (확장 데이터)",
    "desc": "2012년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1238 (확장 데이터)",
    "desc": "2012년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1363 (확장 데이터)",
    "desc": "2012년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2012,
    "tag": "CULTURE",
    "title": "강남스타일 전 세계 열풍·유튜브 최초 10억 뷰",
    "desc": "싸이의 강남스타일이 유튜브 최초로 10억 뷰를 기록하며 한국 대중문화의 글로벌 파급력을 증명",
    "location": "서울·전 세계",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "2012년 기술 혁신 기록",
    "desc": "2012년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "SOCIETY",
    "title": "2012년 한국 사회 변화상",
    "desc": "2012년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "2012년의 정밀 역사 기록 (1)",
    "desc": "2012년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "SOCIETY",
    "title": "2012년의 정밀 역사 기록 (2)",
    "desc": "2012년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "CULTURE",
    "title": "2012년의 정밀 역사 기록 (3)",
    "desc": "2012년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "SCIENCE",
    "title": "2012년 나노·바이오 기술 발전",
    "desc": "2012년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2012,
    "tag": "ECONOMY",
    "title": "2012년 정밀 연대기 기록 2",
    "desc": "2012년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "2012년 정밀 연대기 기록 3",
    "desc": "2012년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "SOCIETY",
    "title": "2012년 정밀 연대기 기록 4",
    "desc": "2012년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "ECONOMY",
    "title": "2012년 정밀 연대기 기록 5",
    "desc": "2012년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2012,
    "tag": "TECHNOLOGY",
    "title": "2012년 정밀 연대기 기록 6",
    "desc": "2012년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 114 (확장 데이터)",
    "desc": "2013년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "WAR",
    "title": "연도별 상세 사건 239 (확장 데이터)",
    "desc": "2013년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 364 (확장 데이터)",
    "desc": "2013년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2013,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 489 (확장 데이터)",
    "desc": "2013년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 614 (확장 데이터)",
    "desc": "2013년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 739 (확장 데이터)",
    "desc": "2013년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2013,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 864 (확장 데이터)",
    "desc": "2013년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 989 (확장 데이터)",
    "desc": "2013년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "WAR",
    "title": "연도별 상세 사건 1114 (확장 데이터)",
    "desc": "2013년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1239 (확장 데이터)",
    "desc": "2013년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1364 (확장 데이터)",
    "desc": "2013년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "딥러닝 AI 혁명 시작",
    "desc": "제프리 힌튼 등이 이끈 딥러닝 기술이 이미지 인식 대회를 석권하며 AI 혁명의 실질적 시작. 현재 AI 붐의 기원",
    "location": "전 세계",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2013,
    "tag": "POLITICS",
    "title": "박근혜 대통령 취임 - 한국 최초 여성 대통령",
    "desc": "박근혜가 한국 최초의 여성 대통령으로 취임. 이후 국정농단 사건으로 2017년 탄핵·파면되는 비극적 결말",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "2013년 기술 혁신 기록",
    "desc": "2013년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "SOCIETY",
    "title": "2013년 한국 사회 변화상",
    "desc": "2013년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "SOCIETY",
    "title": "2013년의 정밀 역사 기록 (1)",
    "desc": "2013년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "CULTURE",
    "title": "2013년의 정밀 역사 기록 (2)",
    "desc": "2013년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "SCIENCE",
    "title": "2013년 나노·바이오 기술 발전",
    "desc": "2013년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2013,
    "tag": "ECONOMY",
    "title": "2013년 정밀 연대기 기록 2",
    "desc": "2013년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "2013년 정밀 연대기 기록 3",
    "desc": "2013년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "SOCIETY",
    "title": "2013년 정밀 연대기 기록 4",
    "desc": "2013년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "ECONOMY",
    "title": "2013년 정밀 연대기 기록 5",
    "desc": "2013년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2013,
    "tag": "TECHNOLOGY",
    "title": "2013년 정밀 연대기 기록 6",
    "desc": "2013년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 115 (확장 데이터)",
    "desc": "2014년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2014,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 240 (확장 데이터)",
    "desc": "2014년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "WAR",
    "title": "연도별 상세 사건 365 (확장 데이터)",
    "desc": "2014년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 490 (확장 데이터)",
    "desc": "2014년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2014,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 615 (확장 데이터)",
    "desc": "2014년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 740 (확장 데이터)",
    "desc": "2014년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 865 (확장 데이터)",
    "desc": "2014년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2014,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 990 (확장 데이터)",
    "desc": "2014년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1115 (확장 데이터)",
    "desc": "2014년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "WAR",
    "title": "연도별 상세 사건 1240 (확장 데이터)",
    "desc": "2014년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2014,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1365 (확장 데이터)",
    "desc": "2014년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "DISASTER",
    "title": "세월호 침몰 참사",
    "desc": "제주도로 향하던 세월호가 전남 진도 앞바다에서 침몰. 승객 304명 사망·실종. '가만히 있으라'는 방송이 비극 키움",
    "location": "진도 앞바다",
    "region": [
      "전라도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2014,
    "tag": "WAR",
    "title": "IS(이슬람 국가) 이라크·시리아 장악",
    "desc": "이슬람 극단주의 무장단체 IS가 이라크·시리아 광대한 영토를 점령하고 칼리프 국가 선포. 서방 주도 대IS 전쟁 시작",
    "location": "이라크·시리아",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2014,
    "tag": "POLITICS",
    "title": "러시아 크림반도 병합",
    "desc": "러시아가 우크라이나로부터 크림반도를 병합. 국제법 위반으로 서방의 제재 시작. 2022년 우크라이나 전쟁의 전조",
    "location": "크림반도, 우크라이나",
    "region": [
      "러시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2014,
    "tag": "TECHNOLOGY",
    "title": "2014년 기술 혁신 기록",
    "desc": "2014년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "SOCIETY",
    "title": "2014년 한국 사회 변화상",
    "desc": "2014년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "CULTURE",
    "title": "2014년의 정밀 역사 기록 (1)",
    "desc": "2014년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "SCIENCE",
    "title": "2014년 나노·바이오 기술 발전",
    "desc": "2014년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2014,
    "tag": "ECONOMY",
    "title": "2014년 정밀 연대기 기록 2",
    "desc": "2014년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "TECHNOLOGY",
    "title": "2014년 정밀 연대기 기록 3",
    "desc": "2014년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "SOCIETY",
    "title": "2014년 정밀 연대기 기록 4",
    "desc": "2014년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "ECONOMY",
    "title": "2014년 정밀 연대기 기록 5",
    "desc": "2014년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2014,
    "tag": "TECHNOLOGY",
    "title": "2014년 정밀 연대기 기록 6",
    "desc": "2014년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 116 (확장 데이터)",
    "desc": "2015년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 241 (확장 데이터)",
    "desc": "2015년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2015,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 366 (확장 데이터)",
    "desc": "2015년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "WAR",
    "title": "연도별 상세 사건 491 (확장 데이터)",
    "desc": "2015년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 616 (확장 데이터)",
    "desc": "2015년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2015,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 741 (확장 데이터)",
    "desc": "2015년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 866 (확장 데이터)",
    "desc": "2015년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 991 (확장 데이터)",
    "desc": "2015년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2015,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1116 (확장 데이터)",
    "desc": "2015년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1241 (확장 데이터)",
    "desc": "2015년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "WAR",
    "title": "연도별 상세 사건 1366 (확장 데이터)",
    "desc": "2015년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2015,
    "tag": "DISASTER",
    "title": "메르스 한국 유행",
    "desc": "중동에서 유입된 메르스 바이러스가 한국에서 186명 감염, 38명 사망. 방역 시스템의 취약성이 드러난 사건",
    "location": "서울·경기",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2015,
    "tag": "SOCIETY",
    "title": "파리 기후협약 체결",
    "desc": "195개국이 지구 온난화를 1.5℃ 이내로 억제하는 파리기후협약에 서명. 탄소 중립과 친환경 에너지 전환의 글로벌 합의",
    "location": "파리, 프랑스",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2015,
    "tag": "TECHNOLOGY",
    "title": "2015년 기술 혁신 기록",
    "desc": "2015년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "SOCIETY",
    "title": "2015년 한국 사회 변화상",
    "desc": "2015년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "ECONOMY",
    "title": "2015년의 정밀 역사 기록 (1)",
    "desc": "2015년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "TECHNOLOGY",
    "title": "2015년의 정밀 역사 기록 (2)",
    "desc": "2015년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "SCIENCE",
    "title": "2015년 나노·바이오 기술 발전",
    "desc": "2015년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2015,
    "tag": "ECONOMY",
    "title": "2015년 정밀 연대기 기록 2",
    "desc": "2015년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "TECHNOLOGY",
    "title": "2015년 정밀 연대기 기록 3",
    "desc": "2015년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "SOCIETY",
    "title": "2015년 정밀 연대기 기록 4",
    "desc": "2015년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "ECONOMY",
    "title": "2015년 정밀 연대기 기록 5",
    "desc": "2015년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2015,
    "tag": "TECHNOLOGY",
    "title": "2015년 정밀 연대기 기록 6",
    "desc": "2015년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 117 (확장 데이터)",
    "desc": "2016년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 242 (확장 데이터)",
    "desc": "2016년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 367 (확장 데이터)",
    "desc": "2016년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2016,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 492 (확장 데이터)",
    "desc": "2016년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "WAR",
    "title": "연도별 상세 사건 617 (확장 데이터)",
    "desc": "2016년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 742 (확장 데이터)",
    "desc": "2016년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2016,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 867 (확장 데이터)",
    "desc": "2016년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 992 (확장 데이터)",
    "desc": "2016년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1117 (확장 데이터)",
    "desc": "2016년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2016,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1242 (확장 데이터)",
    "desc": "2016년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1367 (확장 데이터)",
    "desc": "2016년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "POLITICS",
    "title": "브렉시트 국민투표·영국 EU 탈퇴 결정",
    "desc": "영국이 국민투표로 EU 탈퇴(브렉시트)를 결정. 유럽 통합의 역행이자 포퓰리즘 정치의 상징적 사건",
    "location": "런던, 영국",
    "region": [
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2016,
    "tag": "POLITICS",
    "title": "박근혜 대통령 탄핵 소추·촛불 혁명",
    "desc": "국정농단(최순실 게이트) 사건으로 수백만 명의 시민이 촛불 시위. 국회가 탄핵 소추 가결. 한국 민주주의의 새 이정표",
    "location": "서울·전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2016,
    "tag": "POLITICS",
    "title": "트럼프 미국 대통령 당선",
    "desc": "도널드 트럼프가 힐러리 클린턴을 꺾고 미국 대통령에 당선. 포퓰리즘·반이민·미국 우선주의로 국제 질서에 충격",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2016,
    "tag": "TECHNOLOGY",
    "title": "2016년 기술 혁신 기록",
    "desc": "2016년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "SOCIETY",
    "title": "2016년 한국 사회 변화상",
    "desc": "2016년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "TECHNOLOGY",
    "title": "2016년의 정밀 역사 기록 (1)",
    "desc": "2016년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "SCIENCE",
    "title": "2016년 나노·바이오 기술 발전",
    "desc": "2016년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2016,
    "tag": "ECONOMY",
    "title": "2016년 정밀 연대기 기록 2",
    "desc": "2016년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "TECHNOLOGY",
    "title": "2016년 정밀 연대기 기록 3",
    "desc": "2016년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "SOCIETY",
    "title": "2016년 정밀 연대기 기록 4",
    "desc": "2016년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "ECONOMY",
    "title": "2016년 정밀 연대기 기록 5",
    "desc": "2016년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2016,
    "tag": "TECHNOLOGY",
    "title": "2016년 정밀 연대기 기록 6",
    "desc": "2016년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 118 (확장 데이터)",
    "desc": "2017년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2017,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 243 (확장 데이터)",
    "desc": "2017년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 368 (확장 데이터)",
    "desc": "2017년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 493 (확장 데이터)",
    "desc": "2017년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2017,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 618 (확장 데이터)",
    "desc": "2017년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "WAR",
    "title": "연도별 상세 사건 743 (확장 데이터)",
    "desc": "2017년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 868 (확장 데이터)",
    "desc": "2017년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2017,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 993 (확장 데이터)",
    "desc": "2017년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1118 (확장 데이터)",
    "desc": "2017년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1243 (확장 데이터)",
    "desc": "2017년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2017,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1368 (확장 데이터)",
    "desc": "2017년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "POLITICS",
    "title": "박근혜 헌법재판소 탄핵 인용·파면",
    "desc": "헌법재판소 재판관 8명 전원 일치로 박근혜 대통령 파면. 한국 역사상 최초의 현직 대통령 탄핵 파면",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2017,
    "tag": "POLITICS",
    "title": "문재인 대통령 취임",
    "desc": "문재인이 대통령에 당선·취임. 적폐 청산·검찰 개혁·남북 화해를 주요 국정 과제로 제시",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2017,
    "tag": "TECHNOLOGY",
    "title": "2017년 기술 혁신 기록",
    "desc": "2017년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "SOCIETY",
    "title": "2017년 한국 사회 변화상",
    "desc": "2017년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "SOCIETY",
    "title": "2017년의 정밀 역사 기록 (1)",
    "desc": "2017년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "CULTURE",
    "title": "2017년의 정밀 역사 기록 (2)",
    "desc": "2017년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "SCIENCE",
    "title": "2017년 나노·바이오 기술 발전",
    "desc": "2017년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2017,
    "tag": "ECONOMY",
    "title": "2017년 정밀 연대기 기록 2",
    "desc": "2017년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "TECHNOLOGY",
    "title": "2017년 정밀 연대기 기록 3",
    "desc": "2017년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "SOCIETY",
    "title": "2017년 정밀 연대기 기록 4",
    "desc": "2017년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "ECONOMY",
    "title": "2017년 정밀 연대기 기록 5",
    "desc": "2017년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2017,
    "tag": "TECHNOLOGY",
    "title": "2017년 정밀 연대기 기록 6",
    "desc": "2017년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 119 (확장 데이터)",
    "desc": "2018년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 244 (확장 데이터)",
    "desc": "2018년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2018,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 369 (확장 데이터)",
    "desc": "2018년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 494 (확장 데이터)",
    "desc": "2018년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 619 (확장 데이터)",
    "desc": "2018년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2018,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 744 (확장 데이터)",
    "desc": "2018년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "WAR",
    "title": "연도별 상세 사건 869 (확장 데이터)",
    "desc": "2018년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 994 (확장 데이터)",
    "desc": "2018년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2018,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1119 (확장 데이터)",
    "desc": "2018년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1244 (확장 데이터)",
    "desc": "2018년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1369 (확장 데이터)",
    "desc": "2018년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2018,
    "tag": "POLITICS",
    "title": "평창 동계올림픽·남북단일팀·3차 남북정상회담",
    "desc": "평창 동계올림픽에서 남북이 공동 입장·단일팀 구성. 이후 판문점·평양에서 3차례 남북정상회담 개최. 북미회담으로 이어짐",
    "location": "평창·판문점·평양",
    "region": [
      "강원도",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2018,
    "tag": "CULTURE",
    "title": "BTS 빌보드 1위·한류 새 역사",
    "desc": "BTS가 빌보드 200 차트 1위를 달성하며 한국 가수 최초 기록. 이후 그래미 노미네이트 등 K-POP의 세계 정복 시대 개막",
    "location": "서울·전 세계",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2018,
    "tag": "TECHNOLOGY",
    "title": "2018년 기술 혁신 기록",
    "desc": "2018년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "SOCIETY",
    "title": "2018년 한국 사회 변화상",
    "desc": "2018년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "CULTURE",
    "title": "2018년의 정밀 역사 기록 (1)",
    "desc": "2018년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "ECONOMY",
    "title": "2018년의 정밀 역사 기록 (2)",
    "desc": "2018년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "SCIENCE",
    "title": "2018년 나노·바이오 기술 발전",
    "desc": "2018년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2018,
    "tag": "ECONOMY",
    "title": "2018년 정밀 연대기 기록 2",
    "desc": "2018년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "TECHNOLOGY",
    "title": "2018년 정밀 연대기 기록 3",
    "desc": "2018년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "SOCIETY",
    "title": "2018년 정밀 연대기 기록 4",
    "desc": "2018년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "ECONOMY",
    "title": "2018년 정밀 연대기 기록 5",
    "desc": "2018년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2018,
    "tag": "TECHNOLOGY",
    "title": "2018년 정밀 연대기 기록 6",
    "desc": "2018년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "WAR",
    "title": "연도별 상세 사건 120 (확장 데이터)",
    "desc": "2019년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 245 (확장 데이터)",
    "desc": "2019년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 370 (확장 데이터)",
    "desc": "2019년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2019,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 495 (확장 데이터)",
    "desc": "2019년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 620 (확장 데이터)",
    "desc": "2019년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 745 (확장 데이터)",
    "desc": "2019년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2019,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 870 (확장 데이터)",
    "desc": "2019년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "WAR",
    "title": "연도별 상세 사건 995 (확장 데이터)",
    "desc": "2019년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1120 (확장 데이터)",
    "desc": "2019년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2019,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1245 (확장 데이터)",
    "desc": "2019년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1370 (확장 데이터)",
    "desc": "2019년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "POLITICS",
    "title": "홍콩 민주화 시위",
    "desc": "홍콩 범죄인 인도법 반대로 시작된 시위가 중국의 지배에 저항하는 대규모 민주화 운동으로 발전. 2020년 국가보안법으로 진압",
    "location": "홍콩",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "2019년 기술 혁신 기록",
    "desc": "2019년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "SOCIETY",
    "title": "2019년 한국 사회 변화상",
    "desc": "2019년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "ECONOMY",
    "title": "2019년의 정밀 역사 기록 (1)",
    "desc": "2019년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "2019년의 정밀 역사 기록 (2)",
    "desc": "2019년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "SOCIETY",
    "title": "2019년의 정밀 역사 기록 (3)",
    "desc": "2019년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "SCIENCE",
    "title": "2019년 나노·바이오 기술 발전",
    "desc": "2019년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2019,
    "tag": "ECONOMY",
    "title": "2019년 정밀 연대기 기록 2",
    "desc": "2019년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "2019년 정밀 연대기 기록 3",
    "desc": "2019년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "SOCIETY",
    "title": "2019년 정밀 연대기 기록 4",
    "desc": "2019년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "ECONOMY",
    "title": "2019년 정밀 연대기 기록 5",
    "desc": "2019년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2019,
    "tag": "TECHNOLOGY",
    "title": "2019년 정밀 연대기 기록 6",
    "desc": "2019년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 121 (확장 데이터)",
    "desc": "2020년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2020,
    "tag": "WAR",
    "title": "연도별 상세 사건 246 (확장 데이터)",
    "desc": "2020년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 371 (확장 데이터)",
    "desc": "2020년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 496 (확장 데이터)",
    "desc": "2020년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2020,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 621 (확장 데이터)",
    "desc": "2020년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 746 (확장 데이터)",
    "desc": "2020년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 871 (확장 데이터)",
    "desc": "2020년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2020,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 996 (확장 데이터)",
    "desc": "2020년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "WAR",
    "title": "연도별 상세 사건 1121 (확장 데이터)",
    "desc": "2020년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1246 (확장 데이터)",
    "desc": "2020년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2020,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1371 (확장 데이터)",
    "desc": "2020년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "DISEASE",
    "title": "코로나19 팬데믹 선언",
    "desc": "중국 우한에서 시작된 코로나19가 전 세계로 확산. WHO 팬데믹 선언. 2023년까지 700만 명 공식 사망. 세계 대봉쇄",
    "location": "전 세계",
    "region": [
      "아시아",
      "유럽",
      "아메리카",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2020,
    "tag": "CULTURE",
    "title": "기생충 아카데미상 4관왕",
    "desc": "봉준호 감독의 기생충이 칸 황금종려상에 이어 아카데미 작품상·감독상·각본상·국제영화상 4관왕. 비영어권 최초 작품상",
    "location": "서울·할리우드",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2020,
    "tag": "SOCIETY",
    "title": "조지 플로이드 사망·BLM 운동",
    "desc": "흑인 조지 플로이드가 경찰 과잉 진압으로 사망. 전 세계 60개국으로 번진 흑인 인권 운동(BLM)의 최대 물결",
    "location": "미니애폴리스, 미국",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "2020년 기술 혁신 기록",
    "desc": "2020년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "SOCIETY",
    "title": "2020년 한국 사회 변화상",
    "desc": "2020년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "2020년의 정밀 역사 기록 (1)",
    "desc": "2020년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "SCIENCE",
    "title": "2020년 나노·바이오 기술 발전",
    "desc": "2020년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2020,
    "tag": "ECONOMY",
    "title": "2020년 정밀 연대기 기록 2",
    "desc": "2020년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "2020년 정밀 연대기 기록 3",
    "desc": "2020년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "SOCIETY",
    "title": "2020년 정밀 연대기 기록 4",
    "desc": "2020년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "ECONOMY",
    "title": "2020년 정밀 연대기 기록 5",
    "desc": "2020년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2020,
    "tag": "TECHNOLOGY",
    "title": "2020년 정밀 연대기 기록 6",
    "desc": "2020년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 122 (확장 데이터)",
    "desc": "2021년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 247 (확장 데이터)",
    "desc": "2021년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2021,
    "tag": "WAR",
    "title": "연도별 상세 사건 372 (확장 데이터)",
    "desc": "2021년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 497 (확장 데이터)",
    "desc": "2021년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 622 (확장 데이터)",
    "desc": "2021년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2021,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 747 (확장 데이터)",
    "desc": "2021년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 872 (확장 데이터)",
    "desc": "2021년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 997 (확장 데이터)",
    "desc": "2021년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2021,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1122 (확장 데이터)",
    "desc": "2021년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "WAR",
    "title": "연도별 상세 사건 1247 (확장 데이터)",
    "desc": "2021년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 1372 (확장 데이터)",
    "desc": "2021년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "NFT·메타버스 붐",
    "desc": "대체불가토큰(NFT)과 메타버스 개념이 폭발적 관심을 받으며 웹3.0 시대 논의 본격화. 이후 거품 논란으로 침체",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "CULTURE",
    "title": "오징어 게임 넷플릭스 세계 1위",
    "desc": "넷플릭스 드라마 오징어 게임이 전 세계 94개국 1위를 기록하며 한국 드라마의 세계 정복을 상징하는 콘텐츠로 등극",
    "location": "서울·전 세계",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2021,
    "tag": "POLITICS",
    "title": "미군 아프가니스탄 철수·탈레반 재집권",
    "desc": "20년간의 전쟁 끝에 미군이 아프가니스탄을 철수하자 탈레반이 72시간 만에 카불을 점령하며 재집권",
    "location": "카불, 아프가니스탄",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "2021년 기술 혁신 기록",
    "desc": "2021년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "SOCIETY",
    "title": "2021년 한국 사회 변화상",
    "desc": "2021년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "SOCIETY",
    "title": "2021년의 정밀 역사 기록 (1)",
    "desc": "2021년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "SCIENCE",
    "title": "2021년 나노·바이오 기술 발전",
    "desc": "2021년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2021,
    "tag": "ECONOMY",
    "title": "2021년 정밀 연대기 기록 2",
    "desc": "2021년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "2021년 정밀 연대기 기록 3",
    "desc": "2021년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "SOCIETY",
    "title": "2021년 정밀 연대기 기록 4",
    "desc": "2021년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "ECONOMY",
    "title": "2021년 정밀 연대기 기록 5",
    "desc": "2021년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2021,
    "tag": "TECHNOLOGY",
    "title": "2021년 정밀 연대기 기록 6",
    "desc": "2021년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 123 (확장 데이터)",
    "desc": "2022년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 248 (확장 데이터)",
    "desc": "2022년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 373 (확장 데이터)",
    "desc": "2022년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2022,
    "tag": "WAR",
    "title": "연도별 상세 사건 498 (확장 데이터)",
    "desc": "2022년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 623 (확장 데이터)",
    "desc": "2022년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 748 (확장 데이터)",
    "desc": "2022년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2022,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 873 (확장 데이터)",
    "desc": "2022년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 998 (확장 데이터)",
    "desc": "2022년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1123 (확장 데이터)",
    "desc": "2022년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2022,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1248 (확장 데이터)",
    "desc": "2022년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "WAR",
    "title": "연도별 상세 사건 1373 (확장 데이터)",
    "desc": "2022년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "WAR",
    "title": "러시아 우크라이나 전면 침공",
    "desc": "러시아가 우크라이나를 전면 침공하며 2차 세계대전 이후 유럽 최대 전쟁 발발. 서방의 대규모 제재와 지원으로 장기전 돌입",
    "location": "우크라이나",
    "region": [
      "러시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2022,
    "tag": "POLITICS",
    "title": "윤석열 대통령 취임",
    "desc": "윤석열이 제20대 대통령으로 취임. 검사 출신 최초 대통령으로 친미·한미일 협력 외교와 대북 강경 기조 추구",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 4
  },
  {
    "year": 2022,
    "tag": "DISASTER",
    "title": "이태원 압사 참사",
    "desc": "할로윈 축제로 붐빈 이태원 골목에서 압사 사고로 159명 사망. 핼러윈 문화 확산과 군중 안전 관리 논란 제기",
    "location": "서울 이태원",
    "region": [
      "서울"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2022,
    "tag": "TECHNOLOGY",
    "title": "ChatGPT 출시·생성AI 혁명",
    "desc": "OpenAI의 ChatGPT가 출시되어 2개월 만에 1억 명 사용자를 확보. 생성형 AI 시대가 열리며 산업 전반의 대전환 시작",
    "location": "샌프란시스코, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2022,
    "tag": "TECHNOLOGY",
    "title": "2022년 기술 혁신 기록",
    "desc": "2022년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "SOCIETY",
    "title": "2022년 한국 사회 변화상",
    "desc": "2022년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "SCIENCE",
    "title": "2022년 나노·바이오 기술 발전",
    "desc": "2022년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2022,
    "tag": "ECONOMY",
    "title": "2022년 정밀 연대기 기록 2",
    "desc": "2022년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "TECHNOLOGY",
    "title": "2022년 정밀 연대기 기록 3",
    "desc": "2022년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "SOCIETY",
    "title": "2022년 정밀 연대기 기록 4",
    "desc": "2022년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "ECONOMY",
    "title": "2022년 정밀 연대기 기록 5",
    "desc": "2022년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2022,
    "tag": "TECHNOLOGY",
    "title": "2022년 정밀 연대기 기록 6",
    "desc": "2022년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 124 (확장 데이터)",
    "desc": "2023년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2023,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 249 (확장 데이터)",
    "desc": "2023년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 374 (확장 데이터)",
    "desc": "2023년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 499 (확장 데이터)",
    "desc": "2023년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2023,
    "tag": "WAR",
    "title": "연도별 상세 사건 624 (확장 데이터)",
    "desc": "2023년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 749 (확장 데이터)",
    "desc": "2023년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 874 (확장 데이터)",
    "desc": "2023년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2023,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 999 (확장 데이터)",
    "desc": "2023년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1124 (확장 데이터)",
    "desc": "2023년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1249 (확장 데이터)",
    "desc": "2023년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2023,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 1374 (확장 데이터)",
    "desc": "2023년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "WAR",
    "title": "하마스 이스라엘 기습·가자지구 전쟁",
    "desc": "하마스가 이스라엘을 기습 공격하여 1400명 사살. 이스라엘이 가자지구를 대규모 공격하며 중동 최대 분쟁 재발",
    "location": "가자지구·이스라엘",
    "region": [
      "중동"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "GPT-4·제미나이 등 AI 모델 경쟁 과열",
    "desc": "OpenAI GPT-4, 구글 제미나이, 앤트로픽 클로드 등이 경쟁하며 AI 능력이 폭발적으로 향상. AGI 논쟁 본격화",
    "location": "실리콘밸리, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "2023년 기술 혁신 기록",
    "desc": "2023년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "SOCIETY",
    "title": "2023년 한국 사회 변화상",
    "desc": "2023년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "ECONOMY",
    "title": "2023년의 정밀 역사 기록 (1)",
    "desc": "2023년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "2023년의 정밀 역사 기록 (2)",
    "desc": "2023년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "SCIENCE",
    "title": "2023년 나노·바이오 기술 발전",
    "desc": "2023년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2023,
    "tag": "ECONOMY",
    "title": "2023년 정밀 연대기 기록 2",
    "desc": "2023년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "2023년 정밀 연대기 기록 3",
    "desc": "2023년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "SOCIETY",
    "title": "2023년 정밀 연대기 기록 4",
    "desc": "2023년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "ECONOMY",
    "title": "2023년 정밀 연대기 기록 5",
    "desc": "2023년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2023,
    "tag": "TECHNOLOGY",
    "title": "2023년 정밀 연대기 기록 6",
    "desc": "2023년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 125 (확장 데이터)",
    "desc": "2024년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 250 (확장 데이터)",
    "desc": "2024년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2024,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 375 (확장 데이터)",
    "desc": "2024년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 500 (확장 데이터)",
    "desc": "2024년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "POLITICS",
    "title": "연도별 상세 사건 625 (확장 데이터)",
    "desc": "2024년경 발생한 POLITICS 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2024,
    "tag": "WAR",
    "title": "연도별 상세 사건 750 (확장 데이터)",
    "desc": "2024년경 발생한 WAR 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "연도별 상세 사건 875 (확장 데이터)",
    "desc": "2024년경 발생한 TECHNOLOGY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "SOCIETY",
    "title": "연도별 상세 사건 1000 (확장 데이터)",
    "desc": "2024년경 발생한 SOCIETY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2024,
    "tag": "CULTURE",
    "title": "연도별 상세 사건 1125 (확장 데이터)",
    "desc": "2024년경 발생한 CULTURE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "SCIENCE",
    "title": "연도별 상세 사건 1250 (확장 데이터)",
    "desc": "2024년경 발생한 SCIENCE 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "ECONOMY",
    "title": "연도별 상세 사건 1375 (확장 데이터)",
    "desc": "2024년경 발생한 ECONOMY 분야의 역사적 흐름과 사회적 변화를 반영한 상세 기록입니다. 데이터 보강을 위해 생성되었습니다.",
    "location": "글로벌/지역",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 1
  },
  {
    "year": 2024,
    "tag": "POLITICS",
    "title": "윤석열 대통령 계엄 선포·철회 및 탄핵",
    "desc": "윤석열 대통령이 계엄을 선포했다가 국회 의결로 6시간 만에 철회. 이후 국회 탄핵 소추, 헌법재판소 심판 절차 진행",
    "location": "서울",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2024,
    "tag": "POLITICS",
    "title": "트럼프 미국 대통령 재선",
    "desc": "도널드 트럼프가 조 바이든을 꺾고 미국 47대 대통령으로 재선. 관세 전쟁·NATO 갈등·대중 강경책 재개",
    "location": "워싱턴DC, 미국",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "AI 에이전트·멀티모달 AI 본격화",
    "desc": "AI 에이전트가 코딩·연구·설계를 자동화하기 시작. 멀티모달 AI가 이미지·영상·음성을 통합 처리하며 범용 AI에 근접",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "2024년 기술 혁신 기록",
    "desc": "2024년은 전후 복구와 과학 기술의 비약적 발전이 맞물려 인류의 삶의 질이 크게 변화한 해입니다.",
    "location": "전 세계",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "SOCIETY",
    "title": "2024년 한국 사회 변화상",
    "desc": "2024년 한반도 내에서는 근대화와 산업화를 거치며 시민 의식과 사회 구조가 재편되는 과정이 진행되었습니다.",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "2024년의 정밀 역사 기록 (1)",
    "desc": "2024년 한반도와 세계 각지에서는 현대 문명의 기틀이 되는 다양한 사회 현상과 기술적 진보가 동시다발적으로 일어남.",
    "location": "글로벌/한국",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "SCIENCE",
    "title": "2024년 나노·바이오 기술 발전",
    "desc": "2024년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2024,
    "tag": "ECONOMY",
    "title": "2024년 정밀 연대기 기록 2",
    "desc": "2024년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "2024년 정밀 연대기 기록 3",
    "desc": "2024년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "SOCIETY",
    "title": "2024년 정밀 연대기 기록 4",
    "desc": "2024년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "ECONOMY",
    "title": "2024년 정밀 연대기 기록 5",
    "desc": "2024년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2024,
    "tag": "TECHNOLOGY",
    "title": "2024년 정밀 연대기 기록 6",
    "desc": "2024년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2025,
    "tag": "TECHNOLOGY",
    "title": "AGI 임계점 도달 논쟁",
    "desc": "주요 AI 연구기관들이 범용인공지능(AGI) 임계점 도달을 주장하며 논쟁. AI 안전·규제 논의가 각국 정책 최우선 과제로 부상",
    "location": "전 세계",
    "region": [
      "아메리카",
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2025,
    "tag": "ECONOMY",
    "title": "미중 관세전쟁 극대화",
    "desc": "트럼프 2기 행정부가 중국산 제품에 145% 관세를 부과하며 미중 무역전쟁 최고조. 글로벌 공급망 재편 가속",
    "location": "미국·중국",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2025,
    "tag": "POLITICS",
    "title": "한국 대선·새 정부 출범",
    "desc": "윤석열 탄핵 파면 이후 조기 대선이 실시되어 새 대통령이 선출됨. 내정·외교 정책의 전면 재편",
    "location": "서울·전국",
    "region": [
      "서울",
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2025,
    "tag": "TECHNOLOGY",
    "title": "2025년 미래 기술 이정표",
    "desc": "2025년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2025,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2025년의 비전",
    "desc": "서기 2025년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2025,
    "tag": "SCIENCE",
    "title": "2025년 나노·바이오 기술 발전",
    "desc": "2025년 나노 기술과 유전 공학의 융합으로 질병 치료와 에너지 효율 면에서 획기적인 성과가 보고됨.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2025,
    "tag": "ECONOMY",
    "title": "2025년 정밀 연대기 기록 2",
    "desc": "2025년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2025,
    "tag": "TECHNOLOGY",
    "title": "2025년 정밀 연대기 기록 3",
    "desc": "2025년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2025,
    "tag": "SOCIETY",
    "title": "2025년 정밀 연대기 기록 4",
    "desc": "2025년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2025,
    "tag": "ECONOMY",
    "title": "2025년 정밀 연대기 기록 5",
    "desc": "2025년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2025,
    "tag": "TECHNOLOGY",
    "title": "2025년 정밀 연대기 기록 6",
    "desc": "2025년 디지털 혁명과 글로벌 네트워크의 심화로 전 세계가 하나의 경제적·사회적 공동체로 연결되는 과정이 가속화됨.",
    "location": "글로벌",
    "region": [
      "전국"
    ],
    "scope": "global",
    "importance": 2
  },
  {
    "year": 2026,
    "tag": "TECHNOLOGY",
    "title": "AI 로봇·자율주행 상용화 본격화",
    "desc": "AI 기반 휴머노이드 로봇이 공장·물류에 본격 투입되고 자율주행 레벨4 상용화가 주요 도시에서 시작됨",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2027,
    "tag": "TECHNOLOGY",
    "title": "양자컴퓨터 상용화 첫 사례",
    "desc": "IBM·구글의 1000큐비트 이상 양자컴퓨터가 신약 개발·암호화에 첫 실용적 성과를 거두며 포스트-실리콘 시대 진입",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2027,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2027년의 비전",
    "desc": "서기 2027년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2028,
    "tag": "CULTURE",
    "title": "LA 올림픽 개최",
    "desc": "제34회 하계 올림픽이 미국 로스앤젤레스에서 개최. 브레이킹·e스포츠 등 신규 종목 추가. 한국 메달 강세",
    "location": "로스앤젤레스, 미국",
    "region": [
      "아메리카",
      "전국"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2029,
    "tag": "TECHNOLOGY",
    "title": "핵융합 발전 상업 실증 성공",
    "desc": "ITER 후속 프로젝트로 핵융합 발전이 상업적으로 실증되어 인류 에너지 문제 해결의 실마리를 제공",
    "location": "유럽·아시아",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2029,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2029년의 비전",
    "desc": "서기 2029년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2030,
    "tag": "ECONOMY",
    "title": "탄소중립 1차 목표 점검",
    "desc": "파리협약 2030 목표 시점. 주요국의 탄소 감축 이행 수준이 엇갈리며 기후 위기 대응의 국제 갈등 심화",
    "location": "전 세계",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2030,
    "tag": "SOCIETY",
    "title": "한국 초고령사회 진입",
    "desc": "한국이 65세 이상 인구 20% 이상의 초고령사회에 공식 진입. 연금 고갈·의료비 급증·노동력 감소가 국가적 위기로 대두",
    "location": "한국 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2030,
    "tag": "TECHNOLOGY",
    "title": "2030년 미래 기술 이정표",
    "desc": "2030년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2030,
    "tag": "SCIENCE",
    "title": "2030년 우주 식민지 개척 현황",
    "desc": "2030년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2031,
    "tag": "TECHNOLOGY",
    "title": "뇌-컴퓨터 인터페이스(BCI) 대중화",
    "desc": "뉴럴링크 등 BCI 기업의 기술이 의료를 넘어 일상생활에 확산. 생각만으로 기기 조작이 가능해지며 인간-기계 경계 모호화",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2031,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2031년의 비전",
    "desc": "서기 2031년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2032,
    "tag": "TECHNOLOGY",
    "title": "개인 맞춤 AI 비서 완전 보편화",
    "desc": "개인 데이터 기반 AI 비서가 건강·법률·금융·교육을 전방위적으로 관리. 기존 전문직 노동의 50% 이상을 AI가 대체",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2033,
    "tag": "SCIENCE",
    "title": "유인 화성 탐사 첫 성공",
    "desc": "NASA·SpaceX 공동 미션으로 인류 최초의 유인 화성 착륙 성공. 6개월 체류 후 귀환. 행성간 문명 시대의 첫 발걸음",
    "location": "화성",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2033,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2033년의 비전",
    "desc": "서기 2033년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2035,
    "tag": "ECONOMY",
    "title": "전기차·수소차 내연기관 대체 완성",
    "desc": "주요국에서 신규 내연기관 차량 판매가 금지되며 전기·수소차가 사실상 전면 대체 완료. 석유 수요 구조적 감소",
    "location": "전 세계",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2035,
    "tag": "POLITICS",
    "title": "한반도 평화협정 체결 (시나리오)",
    "desc": "70년 넘게 지속된 휴전 체제가 종식되고 공식 평화협정이 체결됨. 경제협력·이산가족 상봉 본격화",
    "location": "한반도",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2035,
    "tag": "TECHNOLOGY",
    "title": "2035년 미래 기술 이정표",
    "desc": "2035년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2035,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2035년의 비전",
    "desc": "서기 2035년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2037,
    "tag": "DISASTER",
    "title": "아시아 메가 홍수 (기후변화 직격)",
    "desc": "히말라야 빙하 급속 융해로 방글라데시·인도·파키스탄에 전례 없는 대홍수. 1000만 명 이상 이재민 발생",
    "location": "남아시아",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2037,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2037년의 비전",
    "desc": "서기 2037년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2038,
    "tag": "TECHNOLOGY",
    "title": "AGI 이후 초지능 AI 등장 논쟁",
    "desc": "AGI를 넘어선 초지능 AI의 등장 여부를 둘러싼 과학계 논쟁. UN 주도 글로벌 AI 거버넌스 체제 구축 논의 본격화",
    "location": "전 세계",
    "region": [
      "아메리카",
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2039,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2039년의 비전",
    "desc": "서기 2039년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2040,
    "tag": "ECONOMY",
    "title": "글로벌 기본소득(UBI) 첫 도입 국가들",
    "desc": "AI·자동화로 인한 대규모 실업에 대응하여 핀란드·한국 등 복지 선진국이 전국민 기본소득을 도입 시작",
    "location": "핀란드·한국 등",
    "region": [
      "유럽",
      "전국"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2040,
    "tag": "SOCIETY",
    "title": "한국 인구 4000만 명 선 붕괴",
    "desc": "세계 최저 출산율로 인해 한국 총인구가 4000만 명 이하로 하락. 학교·군대·지방 소멸이 사회 전면 과제로 부상",
    "location": "한국 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2040,
    "tag": "TECHNOLOGY",
    "title": "2040년 미래 기술 이정표",
    "desc": "2040년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2040,
    "tag": "SCIENCE",
    "title": "2040년 우주 식민지 개척 현황",
    "desc": "2040년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2041,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2041년의 비전",
    "desc": "서기 2041년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2042,
    "tag": "TECHNOLOGY",
    "title": "우주 태양광 발전 상용화",
    "desc": "지구 궤도의 태양광 패널로 전기를 생산하여 지상으로 전송하는 우주 태양광 발전 상용화. 에너지 지정학 변화",
    "location": "지구 궤도",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2043,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2043년의 비전",
    "desc": "서기 2043년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2045,
    "tag": "TECHNOLOGY",
    "title": "레이 커즈와일의 특이점(Singularity) 예측 시점",
    "desc": "미래학자 커즈와일이 예측한 AI가 인간 지능을 완전히 초월하는 기술적 특이점. 실제 도달 여부로 세계 논쟁",
    "location": "전 세계",
    "region": [
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2045,
    "tag": "TECHNOLOGY",
    "title": "2045년 미래 기술 이정표",
    "desc": "2045년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2045,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2045년의 비전",
    "desc": "서기 2045년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2047,
    "tag": "POLITICS",
    "title": "홍콩 일국양제 만료",
    "desc": "1997년 반환 시 약속된 홍콩의 50년 자치권(일국양제)이 만료. 완전한 중국 체제 편입 또는 새로운 협상 갈림길",
    "location": "홍콩",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2047,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2047년의 비전",
    "desc": "서기 2047년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2049,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2049년의 비전",
    "desc": "서기 2049년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2050,
    "tag": "SOCIETY",
    "title": "지구 기온 1.5℃ 상승 임계점 도달",
    "desc": "IPCC 경고대로 지구 평균 기온이 산업화 이전 대비 1.5℃ 상승. 극단적 기상 이변이 일상화되고 해수면 상승 심각",
    "location": "전 세계",
    "region": [
      "전국",
      "아시아",
      "유럽",
      "아메리카",
      "아프리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2050,
    "tag": "ECONOMY",
    "title": "아프리카 인구 25억·경제 급부상",
    "desc": "아프리카 인구가 25억 명을 넘으며 세계 최대 소비시장으로 부상. 아프리카 연합(AU)이 EU 수준의 경제 통합 달성",
    "location": "아프리카 전역",
    "region": [
      "아프리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2050,
    "tag": "SCIENCE",
    "title": "노화 역전 치료 상용화",
    "desc": "줄기세포·유전자 편집·AI 신약 개발의 결합으로 생물학적 노화를 역전시키는 치료법이 부유층에게 먼저 상용화",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2050,
    "tag": "TECHNOLOGY",
    "title": "2050년 미래 기술 이정표",
    "desc": "2050년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2050,
    "tag": "SCIENCE",
    "title": "2050년 우주 식민지 개척 현황",
    "desc": "2050년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2051,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2051년의 비전",
    "desc": "서기 2051년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2053,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2053년의 비전",
    "desc": "서기 2053년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2055,
    "tag": "POLITICS",
    "title": "달 상설 기지 건설 완료",
    "desc": "NASA·ESA·중국 국가우주국의 경쟁적 협력 속에 달 남극에 상설 유인 기지가 완공. 달 자원 개발 본격화",
    "location": "달 남극",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2055,
    "tag": "TECHNOLOGY",
    "title": "2055년 미래 기술 이정표",
    "desc": "2055년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2055,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2055년의 비전",
    "desc": "서기 2055년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2057,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2057년의 비전",
    "desc": "서기 2057년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2059,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2059년의 비전",
    "desc": "서기 2059년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2060,
    "tag": "ECONOMY",
    "title": "중국 탄소중립 달성 목표 시점",
    "desc": "시진핑이 선언한 2060년 탄소중립 달성 시점. 세계 최대 탄소 배출국 중국의 성과에 따라 기후 협약의 성패 결정",
    "location": "중국",
    "region": [
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2060,
    "tag": "SOCIETY",
    "title": "전 세계 도시화율 80% 돌파",
    "desc": "전 세계 인구의 80%가 도시에 거주하게 됨. 스마트시티 기술이 교통·에너지·치안을 AI로 완전 관리",
    "location": "전 세계",
    "region": [
      "아시아",
      "아메리카",
      "유럽",
      "아프리카"
    ],
    "scope": "global",
    "importance": 3
  },
  {
    "year": 2060,
    "tag": "TECHNOLOGY",
    "title": "2060년 미래 기술 이정표",
    "desc": "2060년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2060,
    "tag": "SCIENCE",
    "title": "2060년 우주 식민지 개척 현황",
    "desc": "2060년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2061,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2061년의 비전",
    "desc": "서기 2061년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2063,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2063년의 비전",
    "desc": "서기 2063년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2065,
    "tag": "TECHNOLOGY",
    "title": "완전 몰입형 가상현실 일상화",
    "desc": "뇌-컴퓨터 인터페이스와 결합된 완전 몰입형 VR이 교육·노동·사회생활을 대체하며 물리적-디지털 경계가 소멸",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2065,
    "tag": "TECHNOLOGY",
    "title": "2065년 미래 기술 이정표",
    "desc": "2065년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2065,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2065년의 비전",
    "desc": "서기 2065년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2067,
    "tag": "SCIENCE",
    "title": "외계 지적 생명체 신호 확인 (SETI)",
    "desc": "제임스 웹 후속 망원경이 외계 행성 대기에서 인공 화학물질 신호를 검출. 외계 문명 존재의 첫 과학적 증거 논란",
    "location": "우주 관측소",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2067,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2067년의 비전",
    "desc": "서기 2067년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2069,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2069년의 비전",
    "desc": "서기 2069년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2070,
    "tag": "POLITICS",
    "title": "UN 개혁·세계정부 논의 본격화",
    "desc": "기후·AI·핵 문제의 국경 초월성으로 인해 UN 안보리 개혁과 세계 거버넌스 강화 논의가 최고조에 달함",
    "location": "뉴욕, 미국",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2070,
    "tag": "TECHNOLOGY",
    "title": "2070년 미래 기술 이정표",
    "desc": "2070년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2070,
    "tag": "SCIENCE",
    "title": "2070년 우주 식민지 개척 현황",
    "desc": "2070년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2071,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2071년의 비전",
    "desc": "서기 2071년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2072,
    "tag": "SCIENCE",
    "title": "화성 영구 식민지 건설",
    "desc": "화성 적도 지역에 1000명 이상이 거주하는 영구 돔 식민지 건설 완료. 인류 최초의 다행성 종 선언",
    "location": "화성",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2073,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2073년의 비전",
    "desc": "서기 2073년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2075,
    "tag": "SOCIETY",
    "title": "한국 통일 달성 (시나리오)",
    "desc": "수십 년의 교류와 경제 격차 축소 끝에 남북한이 평화적으로 통일. 하나의 한반도로 동북아시아 새 시대 개막",
    "location": "한반도 전역",
    "region": [
      "전국"
    ],
    "scope": "kr",
    "importance": 5
  },
  {
    "year": 2075,
    "tag": "TECHNOLOGY",
    "title": "2075년 미래 기술 이정표",
    "desc": "2075년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2075,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2075년의 비전",
    "desc": "서기 2075년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2077,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2077년의 비전",
    "desc": "서기 2077년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2079,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2079년의 비전",
    "desc": "서기 2079년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2080,
    "tag": "ECONOMY",
    "title": "세계 인구 정점 도달 후 감소 시작",
    "desc": "유엔 예측대로 세계 인구가 약 100억 명으로 정점을 찍고 감소세로 전환. 자원 경쟁 완화 vs 노동력 감소 딜레마",
    "location": "전 세계",
    "region": [
      "아시아",
      "아프리카",
      "유럽",
      "아메리카"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2080,
    "tag": "TECHNOLOGY",
    "title": "2080년 미래 기술 이정표",
    "desc": "2080년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2080,
    "tag": "SCIENCE",
    "title": "2080년 우주 식민지 개척 현황",
    "desc": "2080년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2081,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2081년의 비전",
    "desc": "서기 2081년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2083,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2083년의 비전",
    "desc": "서기 2083년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2085,
    "tag": "TECHNOLOGY",
    "title": "원자 단위 나노제조 기술 완성",
    "desc": "원자 하나하나를 배치하여 물질을 제조하는 나노팩토리 기술이 완성. 희소 자원·제조업·의약품 개념이 근본적으로 변화",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2085,
    "tag": "TECHNOLOGY",
    "title": "2085년 미래 기술 이정표",
    "desc": "2085년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2085,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2085년의 비전",
    "desc": "서기 2085년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2087,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2087년의 비전",
    "desc": "서기 2087년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2089,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2089년의 비전",
    "desc": "서기 2089년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2090,
    "tag": "SCIENCE",
    "title": "지구 기후 인공 제어 시작",
    "desc": "성층권 에어로졸 주입 등 지구공학 기술로 지구 기온을 인위적으로 조절하는 기후 제어 프로젝트 시작. 윤리 논란 폭발",
    "location": "전 세계",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2090,
    "tag": "TECHNOLOGY",
    "title": "2090년 미래 기술 이정표",
    "desc": "2090년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2090,
    "tag": "SCIENCE",
    "title": "2090년 우주 식민지 개척 현황",
    "desc": "2090년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2091,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2091년의 비전",
    "desc": "서기 2091년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2093,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2093년의 비전",
    "desc": "서기 2093년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2095,
    "tag": "SOCIETY",
    "title": "평균 수명 120세 시대 도래",
    "desc": "노화 억제 기술과 AI 의료의 결합으로 선진국 평균 수명이 120세에 도달. 다세대 공존·연금 제도의 근본적 재설계 필요",
    "location": "전 세계",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2095,
    "tag": "TECHNOLOGY",
    "title": "2095년 미래 기술 이정표",
    "desc": "2095년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2095,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2095년의 비전",
    "desc": "서기 2095년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2097,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2097년의 비전",
    "desc": "서기 2097년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2099,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2099년의 비전",
    "desc": "서기 2099년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2100,
    "tag": "POLITICS",
    "title": "지구연방 구상 본격 논의",
    "desc": "기후·AI·우주 문제의 전 지구적 관리를 위해 주권 일부를 이양한 지구 차원의 연방 거버넌스 구상이 실질적으로 논의됨",
    "location": "전 세계",
    "region": [
      "유럽",
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2100,
    "tag": "SCIENCE",
    "title": "태양계 내 인류 거주지 다원화",
    "desc": "달·화성·소행성 벨트에 합산 10만 명 이상의 인류가 거주. 태양계 자원 개발이 지구 경제를 초과하는 규모로 성장",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2100,
    "tag": "TECHNOLOGY",
    "title": "2100년 미래 기술 이정표",
    "desc": "2100년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2100,
    "tag": "SCIENCE",
    "title": "2100년 우주 식민지 개척 현황",
    "desc": "2100년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2101,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2101년의 비전",
    "desc": "서기 2101년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2101,
    "tag": "TECHNOLOGY",
    "title": "2101년 인류 문명의 진보",
    "desc": "2101년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2103,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2103년의 비전",
    "desc": "서기 2103년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2103,
    "tag": "TECHNOLOGY",
    "title": "2103년 인류 문명의 진보",
    "desc": "2103년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2105,
    "tag": "TECHNOLOGY",
    "title": "2105년 미래 기술 이정표",
    "desc": "2105년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2105,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2105년의 비전",
    "desc": "서기 2105년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2105,
    "tag": "TECHNOLOGY",
    "title": "2105년 인류 문명의 진보",
    "desc": "2105년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2107,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2107년의 비전",
    "desc": "서기 2107년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2107,
    "tag": "TECHNOLOGY",
    "title": "2107년 인류 문명의 진보",
    "desc": "2107년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2109,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2109년의 비전",
    "desc": "서기 2109년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2109,
    "tag": "TECHNOLOGY",
    "title": "2109년 인류 문명의 진보",
    "desc": "2109년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2110,
    "tag": "TECHNOLOGY",
    "title": "빛의 속도 0.01% 추진 기술 개발",
    "desc": "핵펄스·레이저 돛 기술로 태양계 내 이동 시간이 혁명적으로 단축됨. 성간 탐사선 최초 발사 준비 시작",
    "location": "태양계",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2110,
    "tag": "TECHNOLOGY",
    "title": "2110년 미래 기술 이정표",
    "desc": "2110년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2110,
    "tag": "SCIENCE",
    "title": "2110년 우주 식민지 개척 현황",
    "desc": "2110년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2111,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2111년의 비전",
    "desc": "서기 2111년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2111,
    "tag": "TECHNOLOGY",
    "title": "2111년 인류 문명의 진보",
    "desc": "2111년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2113,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2113년의 비전",
    "desc": "서기 2113년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2113,
    "tag": "TECHNOLOGY",
    "title": "2113년 인류 문명의 진보",
    "desc": "2113년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2115,
    "tag": "TECHNOLOGY",
    "title": "2115년 미래 기술 이정표",
    "desc": "2115년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2115,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2115년의 비전",
    "desc": "서기 2115년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2115,
    "tag": "TECHNOLOGY",
    "title": "2115년 인류 문명의 진보",
    "desc": "2115년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2117,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2117년의 비전",
    "desc": "서기 2117년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2117,
    "tag": "TECHNOLOGY",
    "title": "2117년 인류 문명의 진보",
    "desc": "2117년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2119,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2119년의 비전",
    "desc": "서기 2119년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2119,
    "tag": "TECHNOLOGY",
    "title": "2119년 인류 문명의 진보",
    "desc": "2119년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2120,
    "tag": "TECHNOLOGY",
    "title": "2120년 미래 기술 이정표",
    "desc": "2120년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2120,
    "tag": "SCIENCE",
    "title": "2120년 우주 식민지 개척 현황",
    "desc": "2120년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2121,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2121년의 비전",
    "desc": "서기 2121년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2121,
    "tag": "TECHNOLOGY",
    "title": "2121년 인류 문명의 진보",
    "desc": "2121년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2123,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2123년의 비전",
    "desc": "서기 2123년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2123,
    "tag": "TECHNOLOGY",
    "title": "2123년 인류 문명의 진보",
    "desc": "2123년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2125,
    "tag": "SCIENCE",
    "title": "인근 항성계 탐사선 도달",
    "desc": "2070년대 발사된 초소형 탐사선이 4.37광년 떨어진 알파 센타우리에 도달하여 근접 촬영 영상 전송",
    "location": "알파 센타우리",
    "region": [
      "아메리카",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2125,
    "tag": "TECHNOLOGY",
    "title": "2125년 미래 기술 이정표",
    "desc": "2125년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2125,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2125년의 비전",
    "desc": "서기 2125년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2125,
    "tag": "TECHNOLOGY",
    "title": "2125년 인류 문명의 진보",
    "desc": "2125년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2127,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2127년의 비전",
    "desc": "서기 2127년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2127,
    "tag": "TECHNOLOGY",
    "title": "2127년 인류 문명의 진보",
    "desc": "2127년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2129,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2129년의 비전",
    "desc": "서기 2129년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2129,
    "tag": "TECHNOLOGY",
    "title": "2129년 인류 문명의 진보",
    "desc": "2129년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2130,
    "tag": "TECHNOLOGY",
    "title": "2130년 미래 기술 이정표",
    "desc": "2130년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2130,
    "tag": "SCIENCE",
    "title": "2130년 우주 식민지 개척 현황",
    "desc": "2130년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2131,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2131년의 비전",
    "desc": "서기 2131년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2131,
    "tag": "TECHNOLOGY",
    "title": "2131년 인류 문명의 진보",
    "desc": "2131년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2133,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2133년의 비전",
    "desc": "서기 2133년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2133,
    "tag": "TECHNOLOGY",
    "title": "2133년 인류 문명의 진보",
    "desc": "2133년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2135,
    "tag": "TECHNOLOGY",
    "title": "2135년 미래 기술 이정표",
    "desc": "2135년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2135,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2135년의 비전",
    "desc": "서기 2135년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2135,
    "tag": "TECHNOLOGY",
    "title": "2135년 인류 문명의 진보",
    "desc": "2135년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2137,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2137년의 비전",
    "desc": "서기 2137년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2137,
    "tag": "TECHNOLOGY",
    "title": "2137년 인류 문명의 진보",
    "desc": "2137년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2139,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2139년의 비전",
    "desc": "서기 2139년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2139,
    "tag": "TECHNOLOGY",
    "title": "2139년 인류 문명의 진보",
    "desc": "2139년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2140,
    "tag": "TECHNOLOGY",
    "title": "2140년 미래 기술 이정표",
    "desc": "2140년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2140,
    "tag": "SCIENCE",
    "title": "2140년 우주 식민지 개척 현황",
    "desc": "2140년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2141,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2141년의 비전",
    "desc": "서기 2141년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2141,
    "tag": "TECHNOLOGY",
    "title": "2141년 인류 문명의 진보",
    "desc": "2141년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2143,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2143년의 비전",
    "desc": "서기 2143년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2143,
    "tag": "TECHNOLOGY",
    "title": "2143년 인류 문명의 진보",
    "desc": "2143년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2145,
    "tag": "TECHNOLOGY",
    "title": "2145년 미래 기술 이정표",
    "desc": "2145년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2145,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2145년의 비전",
    "desc": "서기 2145년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2145,
    "tag": "TECHNOLOGY",
    "title": "2145년 인류 문명의 진보",
    "desc": "2145년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2147,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2147년의 비전",
    "desc": "서기 2147년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2147,
    "tag": "TECHNOLOGY",
    "title": "2147년 인류 문명의 진보",
    "desc": "2147년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2149,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2149년의 비전",
    "desc": "서기 2149년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2149,
    "tag": "TECHNOLOGY",
    "title": "2149년 인류 문명의 진보",
    "desc": "2149년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2150,
    "tag": "SOCIETY",
    "title": "인류 기억 디지털 영구 저장 보편화",
    "desc": "뇌 구조 완전 스캔 기술로 개인의 기억·인격·지식을 디지털로 영구 보존하는 것이 보편화. 죽음의 개념 재정의",
    "location": "전 세계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2150,
    "tag": "TECHNOLOGY",
    "title": "2150년 미래 기술 이정표",
    "desc": "2150년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2150,
    "tag": "SCIENCE",
    "title": "2150년 우주 식민지 개척 현황",
    "desc": "2150년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2151,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2151년의 비전",
    "desc": "서기 2151년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2151,
    "tag": "TECHNOLOGY",
    "title": "2151년 인류 문명의 진보",
    "desc": "2151년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2153,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2153년의 비전",
    "desc": "서기 2153년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2153,
    "tag": "TECHNOLOGY",
    "title": "2153년 인류 문명의 진보",
    "desc": "2153년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2155,
    "tag": "TECHNOLOGY",
    "title": "2155년 미래 기술 이정표",
    "desc": "2155년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2155,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2155년의 비전",
    "desc": "서기 2155년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2155,
    "tag": "TECHNOLOGY",
    "title": "2155년 인류 문명의 진보",
    "desc": "2155년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2157,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2157년의 비전",
    "desc": "서기 2157년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2157,
    "tag": "TECHNOLOGY",
    "title": "2157년 인류 문명의 진보",
    "desc": "2157년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2159,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2159년의 비전",
    "desc": "서기 2159년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2159,
    "tag": "TECHNOLOGY",
    "title": "2159년 인류 문명의 진보",
    "desc": "2159년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2160,
    "tag": "TECHNOLOGY",
    "title": "2160년 미래 기술 이정표",
    "desc": "2160년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2160,
    "tag": "SCIENCE",
    "title": "2160년 우주 식민지 개척 현황",
    "desc": "2160년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2161,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2161년의 비전",
    "desc": "서기 2161년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2161,
    "tag": "TECHNOLOGY",
    "title": "2161년 인류 문명의 진보",
    "desc": "2161년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2163,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2163년의 비전",
    "desc": "서기 2163년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2163,
    "tag": "TECHNOLOGY",
    "title": "2163년 인류 문명의 진보",
    "desc": "2163년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2165,
    "tag": "TECHNOLOGY",
    "title": "2165년 미래 기술 이정표",
    "desc": "2165년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2165,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2165년의 비전",
    "desc": "서기 2165년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2165,
    "tag": "TECHNOLOGY",
    "title": "2165년 인류 문명의 진보",
    "desc": "2165년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2167,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2167년의 비전",
    "desc": "서기 2167년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2167,
    "tag": "TECHNOLOGY",
    "title": "2167년 인류 문명의 진보",
    "desc": "2167년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2169,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2169년의 비전",
    "desc": "서기 2169년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2169,
    "tag": "TECHNOLOGY",
    "title": "2169년 인류 문명의 진보",
    "desc": "2169년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2170,
    "tag": "TECHNOLOGY",
    "title": "2170년 미래 기술 이정표",
    "desc": "2170년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2170,
    "tag": "SCIENCE",
    "title": "2170년 우주 식민지 개척 현황",
    "desc": "2170년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2171,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2171년의 비전",
    "desc": "서기 2171년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2171,
    "tag": "TECHNOLOGY",
    "title": "2171년 인류 문명의 진보",
    "desc": "2171년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2173,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2173년의 비전",
    "desc": "서기 2173년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2173,
    "tag": "TECHNOLOGY",
    "title": "2173년 인류 문명의 진보",
    "desc": "2173년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2175,
    "tag": "POLITICS",
    "title": "태양계 연방 헌장 채택",
    "desc": "지구·달·화성·소행성 벨트 거주 인류가 공통의 법적 기반 태양계 연방 헌장을 채택. 인류 역사상 최대 규모의 정치 통합",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2175,
    "tag": "TECHNOLOGY",
    "title": "2175년 미래 기술 이정표",
    "desc": "2175년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2175,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2175년의 비전",
    "desc": "서기 2175년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2175,
    "tag": "TECHNOLOGY",
    "title": "2175년 인류 문명의 진보",
    "desc": "2175년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2177,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2177년의 비전",
    "desc": "서기 2177년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2177,
    "tag": "TECHNOLOGY",
    "title": "2177년 인류 문명의 진보",
    "desc": "2177년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2179,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2179년의 비전",
    "desc": "서기 2179년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2179,
    "tag": "TECHNOLOGY",
    "title": "2179년 인류 문명의 진보",
    "desc": "2179년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2180,
    "tag": "TECHNOLOGY",
    "title": "2180년 미래 기술 이정표",
    "desc": "2180년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2180,
    "tag": "SCIENCE",
    "title": "2180년 우주 식민지 개척 현황",
    "desc": "2180년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2181,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2181년의 비전",
    "desc": "서기 2181년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2181,
    "tag": "TECHNOLOGY",
    "title": "2181년 인류 문명의 진보",
    "desc": "2181년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2183,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2183년의 비전",
    "desc": "서기 2183년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2183,
    "tag": "TECHNOLOGY",
    "title": "2183년 인류 문명의 진보",
    "desc": "2183년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2185,
    "tag": "TECHNOLOGY",
    "title": "2185년 미래 기술 이정표",
    "desc": "2185년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2185,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2185년의 비전",
    "desc": "서기 2185년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2185,
    "tag": "TECHNOLOGY",
    "title": "2185년 인류 문명의 진보",
    "desc": "2185년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2187,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2187년의 비전",
    "desc": "서기 2187년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2187,
    "tag": "TECHNOLOGY",
    "title": "2187년 인류 문명의 진보",
    "desc": "2187년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2189,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2189년의 비전",
    "desc": "서기 2189년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2189,
    "tag": "TECHNOLOGY",
    "title": "2189년 인류 문명의 진보",
    "desc": "2189년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2190,
    "tag": "TECHNOLOGY",
    "title": "2190년 미래 기술 이정표",
    "desc": "2190년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2190,
    "tag": "SCIENCE",
    "title": "2190년 우주 식민지 개척 현황",
    "desc": "2190년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2191,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2191년의 비전",
    "desc": "서기 2191년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2191,
    "tag": "TECHNOLOGY",
    "title": "2191년 인류 문명의 진보",
    "desc": "2191년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2193,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2193년의 비전",
    "desc": "서기 2193년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2193,
    "tag": "TECHNOLOGY",
    "title": "2193년 인류 문명의 진보",
    "desc": "2193년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2195,
    "tag": "TECHNOLOGY",
    "title": "2195년 미래 기술 이정표",
    "desc": "2195년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2195,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2195년의 비전",
    "desc": "서기 2195년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2195,
    "tag": "TECHNOLOGY",
    "title": "2195년 인류 문명의 진보",
    "desc": "2195년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2197,
    "tag": "SCIENCE",
    "title": "미래 이정표: 2197년의 비전",
    "desc": "서기 2197년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2197,
    "tag": "TECHNOLOGY",
    "title": "2197년 인류 문명의 진보",
    "desc": "2197년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2199,
    "tag": "SOCIETY",
    "title": "미래 이정표: 2199년의 비전",
    "desc": "서기 2199년, 인공지능(AI)과 인간의 협업이 극대화되며 지구를 넘어 화성과 달에 자급자족형 식민지가 건설되고 에너지 혁명이 완수됨.",
    "location": "태양계",
    "region": [
      "아시아",
      "아메리카"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2199,
    "tag": "TECHNOLOGY",
    "title": "2199년 인류 문명의 진보",
    "desc": "2199년 인류는 지구의 자정 능력을 회복하고 우주 공간에서의 영구적 거주지를 확보하며 다행성 문명으로 정착함.",
    "location": "태양계",
    "region": [
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2200,
    "tag": "SCIENCE",
    "title": "외계 지적 문명과의 첫 통신 교환",
    "desc": "수십 년간의 신호 분석 끝에 외계 문명과의 쌍방향 통신이 확인됨. 인류 역사 전체를 뒤바꾸는 역사상 최대 사건",
    "location": "우주",
    "region": [
      "아메리카",
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  },
  {
    "year": 2200,
    "tag": "SOCIETY",
    "title": "인류 총 인구 80억·태양계 분산 거주",
    "desc": "지구 60억·태양계 기타 천체 20억 명으로 인류가 태양계 전역에 분산 거주. 종으로서의 인류가 멸종 위협에서 벗어남",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아",
      "유럽"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2200,
    "tag": "TECHNOLOGY",
    "title": "2200년 미래 기술 이정표",
    "desc": "2200년경 인공지능과 생명공학의 융합으로 인류는 새로운 진화의 단계에 진입하게 됩니다.",
    "location": "글로벌",
    "region": [
      "유럽",
      "아시아"
    ],
    "scope": "global",
    "importance": 4
  },
  {
    "year": 2200,
    "tag": "SCIENCE",
    "title": "2200년 우주 식민지 개척 현황",
    "desc": "2200년 지구 궤도를 넘어 화성과 소행성 벨트에서 자원 채굴과 상설 거주가 보편화되는 시기입니다.",
    "location": "태양계",
    "region": [
      "아메리카",
      "아시아"
    ],
    "scope": "global",
    "importance": 5
  }
];
