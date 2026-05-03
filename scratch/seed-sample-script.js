
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedScript() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Forced Seeding Sample Script ---');
  
  // 1. Ensure Episode 1 exists
  const { data: ep } = await supabase
    .from('episodes_v2')
    .select('id')
    .eq('project_id', projectId)
    .eq('episode_number', 1)
    .single();

  if (!ep) {
    console.error('Episode 1 not found. Please click Generate Script in UI first to create record.');
    return;
  }

  const epId = ep.id;
  console.log('Target Episode ID:', epId);

  const sampleScript = `INT. 사무실 - 낮

철수가 창밖을 바라보고 있다. 그의 손에는 낡은 시나리오가 들려 있다.

철수
(혼잣말)
드디어 완성했어... 대본이 드디어 나온다구.

영희가 문을 열고 들어온다.

영희
철수야, 다 됐어?

철수
응, 이제 렌더링만 하면 돼.

INT. 복도 - 계속

영희가 기쁜 표정으로 복도를 달려나간다.`;

  // 2. Update Episode Script
  await supabase.from('episodes_v2').update({ script_content: sampleScript }).eq('id', epId);

  // 3. Update or Create Beats
  // We'll create 2 beats for this sample
  const beats = [
    {
      scene_number: 1,
      title: '오프닝: 사무실',
      description: '철수가 대본을 완성하고 기뻐하는 장면',
      script_content: `INT. 사무실 - 낮\n\n철수가 창밖을 바라보고 있다. 그의 손에는 낡은 시나리오가 들려 있다.\n\n철수\n(혼잣말)\n드디어 완성했어... 대본이 드디어 나온다구.\n\n영희가 문을 열고 들어온다.\n\n영희\n철수야, 다 됐어?\n\n철수\n응, 이제 렌더링만 하면 돼.`
    },
    {
      scene_number: 2,
      title: '복도: 환희',
      description: '영희가 소식을 알리러 뛰어가는 장면',
      script_content: `INT. 복도 - 계속\n\n영희가 기쁜 표정으로 복도를 달려나간다.`
    }
  ];

  for (const b of beats) {
    const { data: existing } = await supabase
      .from('story_beats_v2')
      .select('id')
      .eq('episode_id', epId)
      .eq('scene_number', b.scene_number)
      .single();

    if (existing) {
      await supabase.from('story_beats_v2').update(b).eq('id', existing.id);
    } else {
      await supabase.from('story_beats_v2').insert({
        ...b,
        project_id: projectId,
        episode_id: epId,
        timestamp_label: `00:0${b.scene_number}:00`,
        act_number: 1,
        beat_type: 'Scene'
      });
    }
  }

  console.log('Seeding Complete. Data injected.');
}

seedScript();
