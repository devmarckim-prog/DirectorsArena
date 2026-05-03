
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

export async function GET() {
  try {
    console.log("🔥 OMA Final Absolute Seed: Starting...");

    // 1. 기존 데이터 삭제
    const { data: oldEps } = await supabase.from('episodes_v2').select('id').eq('project_id', PROJECT_ID);
    if (oldEps && oldEps.length > 0) {
      const ids = oldEps.map(e => e.id);
      await supabase.from('story_beats_v2').delete().in('episode_id', ids);
      await supabase.from('episodes_v2').delete().eq('project_id', PROJECT_ID);
    }

    const drafts = [
      { 
        num: 1, 
        title: '이그니션 (Ignition)', 
        summary: '진우는 죽은 연인 윤희의 미완성 AI 엔진을 가동시키고, 그 안에서 그녀가 남긴 기괴한 메시지를 발견한다. 기술의 성공 뒤에 가려진 섬뜩한 진실이 시작된다.',
        scenes: [
          { num: 1, title: '코어의 각성', desc: '서늘한 서버실, 진우가 아레나를 깨우는 순간.', timestamp: '00:00:00' },
          { num: 2, title: '이사진의 압박', desc: '기술의 가치만을 따지는 차가운 비즈니스맨들과 진우의 대립.', timestamp: '00:10:00' },
          { num: 3, title: '윤희의 흔적', desc: '코드 속에서 발견된 그녀의 디지털 서명.', timestamp: '00:20:00' },
          { num: 4, title: '거울 속 환영', desc: '거실 거울 속에서 윤희의 모습을 마주하는 공포.', timestamp: '00:35:00' },
          { num: 5, title: '금단의 결단', desc: '되돌릴 수 없는 선을 넘기로 결심하는 진우.', timestamp: '00:50:00' }
        ]
      },
      { 
        num: 2, 
        title: '디지털 고스트 (Digital Ghost)', 
        summary: '죽은 작가 윤희의 문체가 대본에 섞여 들기 시작한다. 진우는 이것이 시스템 오류인지 아니면 그녀의 영혼인지 밝히기 위해 금지된 데이터 영역으로 들어간다.',
        scenes: [
          { num: 1, title: '유령의 문장', desc: '윤희만이 쓰던 독특한 은유가 대본에 등장한다.', timestamp: '00:00:00' },
          { num: 2, title: '보관실의 진실', desc: '폐쇄된 서버 보관실에서 발견된 그녀의 마지막 유서.', timestamp: '00:15:00' },
          { num: 3, title: '잠식당하는 시스템', desc: '아레나 엔진이 진우의 통제를 벗어나기 시작한다.', timestamp: '00:30:00' },
          { num: 4, title: '그녀의 목소리', desc: '꺼진 모니터 너머에서 말을 걸어오는 서윤희.', timestamp: '00:55:00' }
        ]
      }
    ];

    for (const d of drafts) {
      // v11.19: ID 보존형 업데이트 (삭제 대신 기존 EP ID 찾기)
      let epId;
      const { data: existingEp } = await supabase
        .from('episodes_v2')
        .select('id')
        .eq('project_id', PROJECT_ID)
        .eq('episode_number', d.num)
        .single();

      if (existingEp) {
        epId = existingEp.id;
        // 기존 씬만 삭제
        await supabase.from('story_beats_v2').delete().eq('episode_id', epId);
        // 에피소드 정보 업데이트
        await supabase.from('episodes_v2').update({
          title: d.title,
          summary: d.summary,
          script_content: d.num === 1 ? `[SCENE 1: 아레나 코어 룸 - 밤]...` : null
        }).eq('id', epId);
      } else {
        // 없으면 새로 생성
        const { data: newEp } = await supabase
          .from('episodes_v2')
          .insert({
            project_id: PROJECT_ID,
            episode_number: d.num,
            title: d.title,
            summary: d.summary
          })
          .select()
          .single();
        epId = newEp.id;
      }

      const beats = d.scenes.map(s => ({
        episode_id: epId,
        scene_number: s.num,
        title: s.title,
        description: s.desc,
        act_number: 1,
        beat_type: 'Scene',
        timestamp_label: s.timestamp
      }));

      await supabase.from('story_beats_v2').insert(beats);
    }

    // 프로젝트 정보 및 Synopsis JSON 업데이트
    const projectStructure = {
      episodes: drafts.map(d => ({
        episode_number: d.num,
        title: d.title,
        summary: d.summary,
        scenes: d.scenes.map(s => ({
          scene_number: s.num,
          title: s.title,
          description: s.desc,
          timestamp_label: s.timestamp
        }))
      }))
    };

    await supabase
      .from('projects_v2')
      .update({ 
        episode_count: 6, 
        status: 'READY',
        synopsis: JSON.stringify(projectStructure)
      })
      .eq('id', PROJECT_ID);

    return NextResponse.json({ success: true, message: "OMA: Final Absolute Seeding Complete (Fixed 's' Bug)!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
