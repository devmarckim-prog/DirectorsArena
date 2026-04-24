const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

async function fix() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const projectId = 'a648c10b-45ad-4fe4-9cd3-e285073e5000';
  
  console.log(`Starting Force Reset for Project: ${projectId}`);
  
  // 1. Purge all related data
  await Promise.all([
    supabase.from('characters_v2').delete().eq('project_id', projectId),
    supabase.from('episodes_v2').delete().eq('project_id', projectId),
    supabase.from('story_beats_v2').delete().eq('project_id', projectId),
    supabase.from('scenes_v2').delete().eq('project_id', projectId),
    supabase.from('api_usage_logs').delete().eq('project_id', projectId)
  ]);
  
  console.log('Data Purge Complete.');

  // 2. Reset project status to COMPLETED (to unlock UI) and 0% progress
  const { error } = await supabase
    .from('projects_v2')
    .update({ 
      status: 'COMPLETED', 
      progress: 0,
      logline: '대기 중인 Noir 프로젝트입니다. 재생성을 눌러 시작하십시오.',
      synopsis: '{}'
    })
    .eq('id', projectId);
    
  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Project Status Reset to COMPLETED (Unlocked).');
  }
}

fix();
