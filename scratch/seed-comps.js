const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function seed() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k) env[k.trim()] = v.join('=').trim();
  });
  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: projects } = await sb.from('projects_v2').select('id, title').order('created_at', { ascending: false }).limit(1);
  if (!projects || projects.length === 0) return;
  const projectId = projects[0].id;

  await sb.from('similar_contents').delete().eq('project_id', projectId);

  const dummyComps = Array.from({ length: 10 }).map((_, i) => ({
    project_id: projectId,
    title: `Reference #${i + 1}`,
    similarity_reason: `Reason #${i + 1}: Cinematic alignment with ${projects[0].title}.`,
    viewer_stats: JSON.stringify({ note: 'Sample data' })
  }));

  const { error } = await sb.from('similar_contents').insert(dummyComps);
  if (error) console.error('Error:', error.message);
  else console.log(`✅ Seeded 10 comps for ${projects[0].title}`);
}

seed();
