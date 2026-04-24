const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

const projectId = "d5cef2c4-f560-4933-8294-2a4440a4e5e4";

async function inspectProjectFailure() {
  console.log(`Inspecting project ${projectId}...`);
  
  const [p, c, e, b, l] = await Promise.all([
    supabase.from('projects_v2').select('*').eq('id', projectId).single(),
    supabase.from('characters_v2').select('*').eq('project_id', projectId),
    supabase.from('episodes_v2').select('*').eq('project_id', projectId),
    supabase.from('story_beats_v2').select('*').eq('project_id', projectId),
    supabase.from('api_usage_logs').select('*').eq('project_id', projectId)
  ]);

  console.log("\n--- PROJECT RECORD ---");
  console.log(JSON.stringify(p.data, null, 2));

  console.log("\n--- CHARACTERS ---");
  console.log(`Count: ${c.data?.length || 0}`);

  console.log("\n--- EPISODES ---");
  console.log(`Count: ${e.data?.length || 0}`);

  console.log("\n--- STORY BEATS ---");
  console.log(`Count: ${b.data?.length || 0}`);

  console.log("\n--- USAGE LOGS ---");
  console.log(JSON.stringify(l.data, null, 2));
}

inspectProjectFailure();
