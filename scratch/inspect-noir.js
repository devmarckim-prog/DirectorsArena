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

async function inspect() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const projectId = 'a648c10b-45ad-4fe4-9cd3-e285073e5000';
  
  console.log(`Deep Inspecting Project Data for: ${projectId}`);
  
  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .eq('id', projectId)
    .single();
    
  if (error) {
    console.error('Fetch Error:', error);
    return;
  }
  
  console.log('Project Data Keys:', Object.keys(data));
  console.log('Project Title:', data.title);
  console.log('Project Image:', data.image);
  console.log('Project Logline:', data.logline);
  
  // Search for "dashboard" in the entire JSON string
  const rawData = JSON.stringify(data);
  if (rawData.includes('dashboard')) {
    console.log('FOUND LEGACY STRING "dashboard" in project record!');
    // Find where it is
    for (const [k, v] of Object.entries(data)) {
      if (String(v).includes('dashboard')) {
        console.log(`Legacy string found in field: [${k}] -> ${v}`);
      }
    }
  } else {
    console.log('No legacy "dashboard" strings found in this specific project record.');
  }

  // Check system images too
  const { data: systemAssets } = await supabase.from('system_assets').select('*');
  const rawAssets = JSON.stringify(systemAssets);
  if (rawAssets.includes('dashboard')) {
    console.log('FOUND LEGACY STRING "dashboard" in system_assets!');
  }
}

inspect();
