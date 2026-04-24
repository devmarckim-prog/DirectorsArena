const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const epScripts = {
  1: `
S#1. 강남 최고급 레스토랑 - 낮

조재현과 오서영, 긴장된 표정으로 앉아있다. 마주 앉은 김병수, 여유롭게 와인잔을 굴린다.

김병수
정말 tvN 편성을 원하십니까?

조재현
그게 아니면 여기까지 오지도 않았습니다.

(효과음) E. 와인잔 부딪히는 소리

오서영
우리가 보여드릴 수 있는 건 '가치'입니다.

S#2. tvN 방송국 로비 - 오후

강동욱 CP, 서류를 바닥에 내팽개친다.

강동욱
이딴 기획안으로 편성시간을 달라고?!

조재현
(이를 꽉 물며)
단 한 번의 기회만 주십시오. 파일럿 시청률이 안 나오면 전액 우리가 책임지겠습니다.

S#3. 디렉터즈 아레나 사무실 - 밤

어두운 사무실. 달빛만 창문으로 스며든다. 조재현, 화이트보드에 적힌 타임라인을 멍하니 바라본다. 

오서영 (O.S)
아직 안 끝났어요.

오서영, 커피 두 잔을 들고 들어온다.
`,
};

const episodeSummaries = {
  1: '제1화: 야심의 조우. 메이저 방송사 tvN 메인 편성을 쟁취하기 위해 야심만만한 스타 PD 조재현과 PPL 업계의 거물 오서영이 피 튀기는 프레젠테이션 전쟁의 포문을 여는 첫날의 치열한 비하인드 스토리.',
  2: '제2화: 모래성의 위기. 펀딩을 약속했던 투자자들의 갑작스러운 배신. 거대 기획사의 방해 공작 속에서 제작비가 바닥난 룰루랄라 스튜디오는 지하 사무실을 전전하며 오디션 참가자들을 모으기 위한 극단적 선택을 시도한다.',
  3: '제3화: 폭발하는 오디션. 마침내 막을 올린 신개념 숏드라마 서바이벌. 개성 넘치는 괴짜 도전자들이 예측 불가능한 돌발 상황을 연이어 터뜨리며 첫 촬영장부터 카메라 스태프 전원의 정신력을 벼랑 끝으로 몰아넣는다.',
  4: '제4화: 배신의 그림자. 제작사 내부에서 불거진 치명적인 예산 회계 스캔들. 조재현의 제작 철학과 오서영의 상업적 생존 논리가 정면으로 충돌하고, 전략 컨설턴트 김병수가 내민 위험한 동아줄을 잡을 것인가 갈등한다.',
  5: '제5화: 마녀의 역습. 경쟁사의 더티플레이로 인해 방송 전날 VOD 클립이 통째로 유출되는 초유의 사태가 발생! 이혜인 메인 PD가 기지를 발휘해 24시간 동안 밤샘 라이브 스트리밍이라는 파격적 구조변경을 단행한다.',
  6: '제6화: 정상에서의 추락. 파일럿 방영 후 압도적인 1위 시청률과 함께 대승을 거둔 듯 했지만, 최종 투자 계약식 당일 강동욱 CP로부터 충격적인 해고 통보를 받는 두 사람. 모든 것은 판을 뒤집으려는 방송국의 계략이었다.',
  7: '제7화: 잿더미의 반란. 바닥까지 떨어졌던 이들이 다시 모여 잃어버린 판권을 되찾기 위한 무모한 게릴라 편성을 기획한다. 이번엔 TV가 아닌 뉴미디어 연합체에 독점 송출하는 방식으로 거대 골리앗에 맞서기 시작한다.',
  8: '제8화: 불멸의 아레나. 마지막 생방송, 시청률 그래프가 미친듯이 요동치는 가운데 무대에 오르는 최종 도전자. 결국 크리에이터의 영혼이 담긴 스토리텔링이 승리함을 증명해내며 숏드라마 시장의 새로운 전설을 창조해낸다.'
};

const scenesByEp = {
  1: [
    { title: '야심의 조우', description: '화려한 라운지 바. 실패를 맛본 재현과 새로운 먹거리를 찾는 서영이 우연을 가장한 만남을 갖는다. 냉랭한 탐색전 속에서 서로의 결핍을 간파하고 위태로운 동맹을 맺는 시발점.' },
    { title: '제작사 설립', description: '창고 수준의 허름한 지하 스튜디오에 첫 명패를 다는 날. 화려했던 과거와 대비되는 현실 속에서 둘은 서로의 자존심을 긁어가며 업무 분장을 두고 팽팽한 기싸움을 벌인다.' },
    { title: '배신의 안개', description: '유일하게 믿었던 투자사 대표가 경쟁사의 압박에 못 이겨 구두 약속을 뒤집고 잠적한다. 눈앞에서 10억 클럽의 예산이 날아가는 모습을 목격한 재현의 분노 폭발.' },
    { title: '승부수 PT', description: '편성의 열쇠를 쥔 방송국 강동욱 CP 앞, 서영이 준비한 예의 바른 PT를 끊고 재현이 파격적인 도발을 시전한다. 정적과 함께 CP의 입가에서 알 수 없는 미소가 번진다.' }
  ],
  2: [
    { title: '통장 잔고 0원', description: '법인 통장이 바닥을 보이고 스태프들의 식대마저 끊길 위기에 처하자, 라면으로 끼니를 때우던 서영이 사채 명함을 꺼내들며 위험천만한 도박을 고려하는 긴박한 상황.' },
    { title: '도전자 집결', description: '오디션 포스터 한 장을 보고 몰려든 정체불명의 참가자 군단. 아이돌 준비생부터 연극판에서 30년 구른 기인까지, 이력서 심사 자리에서부터 대환장 파티가 펼쳐진다.' },
    { title: '내부 스파이', description: '촬영 정보를 몰래 빼돌리던 막내 작가의 수상한 동선을 혜인 PD가 포착한다. 하지만 그 배후가 업계 선배임을 알게 되며 충격과 번민에 휩싸여 침묵을 지킨다.' },
    { title: '김병수의 제안', description: '자금난의 수렁에 빠진 재현 앞에 김병수가 나타나 50억짜리 불법 리베이트 서류를 들이민다. 악마의 거래를 수락해야만 당장의 위기를 넘길 수 있는 딜레마.' }
  ],
  3: [
    { title: '카메라 ON', description: '첫날 스튜디오 촬영 스탠바이 완료. 그러나 대기실에서 도전자들 간에 주먹다짐이 발생하고, 유혈 사태 속에 재현은 이를 리얼리티 카메라로 밀어붙일지 윤리를 지킬지 결단한다.' },
    { title: '천재 혹은 악마', description: '통제 불능인 트러블메이커 도전자 박민규가 대본을 집어던지고, 즉석에서 소름 끼치는 신들린 연기를 쏟아내며 전체 샷을 완벽하게 장악해버리는 명장면.' },
    { title: '조회수의 폭주', description: '티저 한 편이 틱톡에서 500만 뷰를 넘으며 바이럴에 성공하지만, 그와 동시에 심각한 악플러들의 조작 논란 공격이 시작되어 제작진은 사이버 대응실을 긴급 가동한다.' },
    { title: '자정의 소주잔', description: '모든 촬영이 끝난 녹초가 된 밤, 길거리 포장마차에서 서로의 진심을 조금씩 털어놓으며 재현과 서영 사이의 차가웠던 벽이 한 꺼풀 녹아내리는 감성적인 휴구.' }
  ],
  4: [
    { title: 'PPL 대란', description: '스폰서 측에서 대본의 흐름을 박살내는 황당한 냉장고 PPL 삽입을 고집한다. 빡친 재현과 위약금을 막아야 하는 서영이 메인 감독실에서 고성에 문을 걷어차며 격돌한다.' },
    { title: '서영의 반격', description: '재현 몰래 광고주를 직접 찾아간 서영. 특유의 달콤하고도 무서운 협상력으로 광고주의 숨겨진 니즈를 파고들어 PPL을 자연스러운 서사로 둔갑시키는 소름돋는 수완을 발휘한다.' },
    { title: '추락하는 민규', description: '강력한 우승 후보 박민규의 과거 학폭 폭로글이 인터넷을 강타한다. 프로그램 포기 직전까지 몰린 상황에서, 혜인 PD가 그와 직접 독대하며 진실의 무게를 묻는다.' },
    { title: '결정의 순간', description: '편집실 모니터 앞. 민규의 분량을 전액 날릴 것인지, 정면 돌파할 것인지 최종 렌더링 버튼을 두고 팀 전원이 숨죽인 채 재현의 검지손가락 움직임만을 쳐다본다.' }
  ],
  5: [
    { title: '사이버 테러', description: '방송을 불과 8시간 앞두고 마스터본 데이터가 서버에서 통째로 딜리트되는 대형 테러가 발생. 백업본마저 손상된 절망의 끝에서 해커 추적이 시작된다.' },
    { title: '해커의 조롱', description: '복구 업체를 불렀으나 스크린에는 기괴한 이모티콘과 조롱 텍스트만 뜬다. 그 순간, 세라라는 천재 해커를 알고 있던 김병수가 혜성처럼 나타나 불법 루팅을 시도한다.' },
    { title: '스탠바이 실패', description: '방송 30분 전까지 영상 렌더링이 완료되지 못했다. 편성표 구멍이 확정되려는 찰나, 서영은 스튜디오에 출연자들을 전부 불러모아 무대포 리딩 방송으로 송출을 돌려버린다.' },
    { title: '시청률의 기적', description: '위기가 기회가 된 기적의 라이브 방송. 출연자들의 생생한 리딩 당황하는 모습이 날것 그대로 전파를 타며 오히려 동시간대 시청자들을 미친듯이 끌어모아 시청률 15%를 달성한다.' }
  ],
  6: [
    { title: '샴페인 없는 축배', description: '첫 방영의 대성공. 하지만 샴페인을 터뜨리려는 순간, 방송사 국장의 서면 지시가 내려온다. 외주 제작사의 지분을 모조리 몰수하고 기획안 명의를 방송국 내부로 귀속시키는 폭거.' },
    { title: '동욱의 배신', description: '자신들에게 기회를 줬던 강동욱 CP마저 이사로 승진하는 조건 하에 그들을 버렸다는 사실을 안 재현. 방송실 앞 복도에서 동욱의 멱살을 잡고 절규하지만 경호원들에게 끌려나간다.' },
    { title: '비 내리는 밤', description: '폭우가 쏟아지는 여의도 거리에 내팽개쳐진 재현과 서영, 그리고 혜인 PD. 모든 걸 잃은 그들이 비에 젖은 채로 텅 빈 하늘을 올려다보며 쓰디쓴 분노와 고통의 눈물을 토해낸다.' },
    { title: '재시동의 스위치', description: '허름한 차박용 밴 안에서, 꽁꽁 언 손으로 타버린 기획서를 다시 펴는 서영. "판이 더럽다면, 보드부터 우리가 새로 짠다" 독기 어린 눈빛으로 다음 반격을 설계한다.' }
  ],
  7: [
    { title: '언더그라운드 연합', description: 'TV 편성을 버리고 유튜브와 OTT 인디 진영의 수장들을 하나씩 설득하러 다니는 언더독 작전. 과거의 앙금을 잊고 모두의 힘을 모으는 화해와 결속의 장이 펼쳐진다.' },
    { title: '거대 언론의 횡포', description: '방송사가 언론을 통제하여 룰루랄라 측을 악덕 사기꾼 집단으로 매도하는 기사를 펑펑 쏟아낸다. 여론이 악화되는 한편, 팀 내 스태프들의 동요와 이탈자가 발생한다.' }
  ],
  8: [
    { title: '아레나의 부활', description: '최종 파이널 공연. 방송사 서버를 해킹(우회경로)하여 동시 방영 프레임을 띄워버리는 미친 결단. 시청자 백만 명이 실시간으로 운집하며 트래픽 폭주가 발생한다.' }
  ]
};

async function seed() {
  console.log('Seeding rich episode and scene meta to DB...', PROJECT_ID);

  // 1. Fetch current project to get synopsis json object
  const { data: projData, error: projErr } = await supabase.from('projects_v2').select('synopsis').eq('id', PROJECT_ID).single();
  
  if (projErr || !projData) {
    console.error('Project fetch error:', projErr);
    return;
  }
  
  let synopsisObj = {};
  if (projData.synopsis) {
    try {
      synopsisObj = typeof projData.synopsis === 'string' ? JSON.parse(projData.synopsis) : projData.synopsis;
    } catch(e) {}
  }
  
  // Inject scenes by episodes into project synopsis
  synopsisObj.scenes_per_episode = scenesByEp;
  
  await supabase.from('projects_v2').update({ synopsis: JSON.stringify(synopsisObj) }).eq('id', PROJECT_ID);
  
  console.log('Project synopsis successfully updated with scene data.');

  // 2. Fetch existing episodes to update them, or delete and recreate
  await supabase.from('episodes_v2').delete().eq('project_id', PROJECT_ID);

  const episodes = [];
  for (let i = 1; i <= 8; i++) {
    episodes.push({
      project_id: PROJECT_ID,
      episode_number: i,
      title: episodeSummaries[i] ? episodeSummaries[i].split('.')[0] : '제' + i + '화',
      summary: episodeSummaries[i] ? episodeSummaries[i].split('.').slice(1).join('.').trim() : '이 에피소드의 상세 내용은 아직 작성되지 않았습니다.',
      script_content: epScripts[i] || "S#1. 복도 - 밤\n\n(대본 준비중)"
    });
  }

  const { error: epErr } = await supabase.from('episodes_v2').insert(episodes);
  if (epErr) {
    console.error('Ep Error:', epErr);
  } else {
    console.log('Recreated 8 detailed episodes successfully.');
  }
}

seed();
