const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k) env[k.trim()] = v.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAndCreateBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
    return;
  }
  
  const assetsBucket = buckets.find(b => b.name === 'assets');
  if (!assetsBucket) {
    console.log("Bucket 'assets' not found. Creating it...");
    const { data, error: createError } = await supabase.storage.createBucket('assets', { public: true });
    if (createError) {
      console.error("Failed to create bucket:", createError);
    } else {
      console.log("Successfully created 'assets' bucket!");
    }
  } else {
    console.log("Bucket 'assets' already exists.");
  }
}

checkAndCreateBucket();
