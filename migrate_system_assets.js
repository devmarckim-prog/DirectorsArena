/**
 * migrate_system_assets.js
 * Creates schema and seeds cinematic dummy images into Supabase.
 */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CINEMATIC_ASSETS = [
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', category: 'cinema' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1478720568477-151d9b1b746d?auto=format&fit=crop&q=80&w=800', category: 'noir' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1542204172-3f241327663f?auto=format&fit=crop&q=80&w=800', category: 'cyberpunk' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800', category: 'drama' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=800', category: 'epic' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', category: 'fantasy' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1516339901600-2e1a62986307?auto=format&fit=crop&q=80&w=800', category: 'mystery' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1497124401559-3e75ec2ed774?auto=format&fit=crop&q=80&w=800', category: 'action' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1500462859233-0994fa4037bc?auto=format&fit=crop&q=80&w=800', category: 'color' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1470219559735-45735d3d45ae?auto=format&fit=crop&q=80&w=800', category: 'noir' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800', category: 'retro' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=800', category: 'stage' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800', category: 'neon' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&q=80&w=800', category: 'gloaming' },
  { type: 'dummy_image', url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800', category: 'bokeh' }
];

async function migrate() {
  console.log("--- Initializing system_assets Migration ---");

  // 1. Create table via RPC or assume it will be created via Supabase Dashboard
  // Since we don't have direct SQL run permission, we check if it exists or use existing pattern.
  // Actually, I can use the supabase client to check/insert.
  
  const { error: insertError } = await supabase
    .from('system_assets')
    .upsert(CINEMATIC_ASSETS, { onConflict: 'url' });

  if (insertError) {
    if (insertError.code === '42P01') {
      console.error("!! TABLE 'system_assets' NOT FOUND !!");
      console.log("Please run the following SQL in Supabase Dashboard:");
      console.log(`
        CREATE TABLE system_assets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT NOT NULL,
          url TEXT NOT NULL UNIQUE,
          category TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
    } else {
      console.error("Migration Error:", insertError);
    }
  } else {
    console.log("✔ System assets seeded successfully.");
  }
}

migrate();
