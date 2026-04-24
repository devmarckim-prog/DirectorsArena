const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProject() {
    console.log("Checking latest projects...");
    const { data, error } = await supabase
        .from('projects_v2')
        .select('id, title, status, progress, created_at, synopsis')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching projects:", error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

checkProject();
