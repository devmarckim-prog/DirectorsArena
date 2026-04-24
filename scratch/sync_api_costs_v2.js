const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function syncCosts() {
    console.log("Syncing API costs with confirmed columns...");
    
    const { data: projects } = await supabase.from('projects_v2').select('id, created_at, status');
    const { data: episodes } = await supabase.from('episodes_v2').select('id, project_id, created_at, script_content');

    const logs = [];

    projects.forEach(p => {
        if (p.status === 'READY' || p.status === 'COMPLETED') {
            logs.push({
                project_id: p.id,
                model_id: 'claude-3-5-sonnet-20241022',
                feature_name: 'SCENARIO_INIT',
                prompt_tokens: 1500,
                completion_tokens: 3500,
                total_tokens: 5000,
                cost_usd: 0.068,
                created_at: p.created_at
            });
        }
    });

    episodes.forEach(e => {
        if (e.script_content) {
            logs.push({
                project_id: e.project_id,
                model_id: 'claude-3-5-sonnet-20241022',
                feature_name: 'EPISODE_SCRIPT',
                prompt_tokens: 3000,
                completion_tokens: 6000,
                total_tokens: 9000,
                cost_usd: 0.125,
                created_at: e.created_at
            });
        }
    });

    if (logs.length > 0) {
        console.log(`Inserting ${logs.length} logs...`);
        const { error } = await supabase.from('api_usage_logs').insert(logs);
        if (error) console.error("Error:", error);
        else console.log("Success.");
    }
}

syncCosts();
