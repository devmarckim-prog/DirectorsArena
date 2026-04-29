const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrateEpisodeCount() {
  console.log('--- [OMA] DATABASE DATA RECOVERY: EPISODE COUNT ---');
  
  // 1. 모든 프로젝트 가져오기
  const { data: projects, error } = await supabase
    .from('projects_v2')
    .select('id, synopsis, episode_count');

  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }

  console.log(`Found ${projects.length} projects to check.`);

  for (const project of projects) {
    let extractedCount = 0;
    
    // 시놉시스에서 에피소드 설정값 추출
    if (project.synopsis) {
      try {
        const syn = JSON.parse(project.synopsis);
        extractedCount = syn?.formData?.episodes || syn?.episodes?.length || 0;
      } catch (e) {
        // Not a JSON string or other error
      }
    }

    // 만약 DB의 episode_count가 비어있거나 0이고, 추출된 값이 있다면 업데이트
    if ((!project.episode_count || project.episode_count === 0) && extractedCount > 0) {
      console.log(`Project [${project.id}]: Updating episode_count to ${extractedCount}`);
      const { error: updateError } = await supabase
        .from('projects_v2')
        .update({ episode_count: extractedCount })
        .eq('id', project.id);
      
      if (updateError) console.error(`Failed to update ${project.id}:`, updateError);
    } else {
      console.log(`Project [${project.id}]: Already has count or no data found. (Count: ${project.episode_count}, Extracted: ${extractedCount})`);
    }
  }

  console.log('--- RECOVERY COMPLETE ---');
}

migrateEpisodeCount();
