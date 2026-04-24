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
    console.log("Syncing actual API costs based on projects...");
    
    const { data: projects } = await supabase.from('projects_v2').select('id, created_at, status');
    const { data: episodes } = await supabase.from('episodes_v2').select('id, created_at, script_content');

    const logs = [];

    // Project Generation Costs (Estimate $0.07 per project)
    projects.forEach(p => {
        if (p.status === 'READY' || p.status === 'COMPLETED') {
            logs.push({
                project_id: p.id,
                model_id: 'claude-3-5-sonnet-20241022',
                tokens_input: 1500,
                tokens_output: 3500,
                cost_usd: 0.068,
                created_at: p.created_at
            });
        }
    });

    // Episode Script Costs (Estimate $0.12 per script)
    episodes.forEach(e => {
        if (e.script_content) {
            logs.push({
                project_id: null,
                model_id: 'claude-3-5-sonnet-20241022',
                tokens_input: 3000,
                tokens_output: 5000,
                cost_usd: 0.125,
                created_at: e.created_at
            });
        }
    });

    if (logs.length > 0) {
        console.log(`Inserting ${logs.length} usage logs...`);
        const { error } = await supabase.from('api_usage_logs').insert(logs);
        if (error) console.error("Error inserting logs:", error);
        else console.log("Successfully synced costs.");
    } else {
        console.log("No projects/episodes found to sync.");
    }
}

syncCosts();
