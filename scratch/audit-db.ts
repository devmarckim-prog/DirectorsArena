// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Force load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function audit() {
  console.log("--- Directors Arena Forensic Audit ---");
  
  // 1. Get the latest project
  const { data: project, error: pErr } = await supabase
    .from('projects_v2')
    .select('id, title, status, progress, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (pErr) {
    console.error("Project Fetch Error:", pErr.message);
    return;
  }

  console.log(`\n[Project Found]`);
  console.log(`ID: ${project.id}`);
  console.log(`Title: ${project.title}`);
  console.log(`Status: ${project.status}`);
  console.log(`Progress: ${project.progress}%`);
  console.log(`Created At: ${project.created_at}`);

  // 2. Check API Usage Logs
  const { data: logs, error: lErr } = await supabase
    .from('api_usage_logs')
    .select('*')
    .eq('project_id', project.id);

  console.log(`\n[API Calls]`);
  if (lErr) console.error("Log Fetch Error:", lErr.message);
  else {
    console.log(`Count: ${logs.length}`);
    logs.forEach(log => {
      console.log(`- Feature: ${log.feature_name}, Cost: ${log.cost_usd} USD, Model: ${log.model_id}`);
    });
  }

  // 3. Check Data Persistence
  const { count: charCount } = await supabase.from('characters_v2').select('*', { count: 'exact', head: true }).eq('project_id', project.id);
  const { count: epCount } = await supabase.from('episodes_v2').select('*', { count: 'exact', head: true }).eq('project_id', project.id);
  const { count: beatCount } = await supabase.from('story_beats_v2').select('*', { count: 'exact', head: true }).eq('project_id', project.id);

  console.log(`\n[Data Persisted]`);
  console.log(`Characters: ${charCount}`);
  console.log(`Episodes: ${epCount}`);
  console.log(`Story Beats: ${beatCount}`);

  if (project.progress === 10 && logs.length === 0) {
    console.log("\n[DIAGNOSIS] API call initiated but never finished (no usage log). Potential Timeout or Silent Hang during streaming.");
  } else if (project.progress === 10 && logs.length > 0) {
    console.log("\n[DIAGNOSIS] API finished (log exists) but Progress was not updated to 100%. Persistence layer might have failed.");
  }
}

audit();
