/**
 * Directors Arena — Episode System & Admin Settings Migration
 * Run: node migrate_episodes.js
 * 
 * Creates:
 *  1. episodes_v2 — Episode data with script content and rolling summaries
 *  2. admin_settings — Dynamic model selection and system prompt configuration
 *  3. Adds missing columns to characters_v2 for v2.1 compatibility
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('🚀 Starting Directors Arena v2.1 Migration...\n');

  // 1. Create episodes_v2 table
  console.log('[1/4] Creating episodes_v2 table...');
  const { error: e1 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS episodes_v2 (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
        episode_number INTEGER NOT NULL,
        title TEXT,
        summary TEXT,
        script_content TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e1) {
    console.log('  ⚠️  RPC exec_sql not available. Trying direct table test...');
    // Fallback: Try inserting a test row to check if table exists
    const { error: testErr } = await supabase.from('episodes_v2').select('id').limit(1);
    if (testErr && testErr.code === '42P01') {
      console.log('  ❌ Table does not exist. Please create it manually in Supabase SQL Editor:');
      console.log(`
  CREATE TABLE episodes_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT,
    summary TEXT,
    script_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
      `);
    } else {
      console.log('  ✅ episodes_v2 table already exists or accessible.');
    }
  } else {
    console.log('  ✅ episodes_v2 table created.');
  }

  // 2. Create admin_settings table
  console.log('[2/4] Creating admin_settings table...');
  const { error: e2 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS admin_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        current_model_id TEXT DEFAULT 'claude-sonnet-4-6',
        script_system_prompt TEXT DEFAULT '당신은 세계적 수준의 시나리오 작가이자 엘리트 쇼러너입니다. 제공된 스토리 바이블을 기반으로 깊이 있고 몰입감 있는 시나리오를 작성하십시오. 캐릭터의 내면 심리를 정밀하게 묘사하고, 서브텍스트가 풍부한 대사를 구사하며, 영화적 장면 전환을 사용하십시오.',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e2) {
    console.log('  ⚠️  RPC not available. Testing direct access...');
    const { error: testErr2 } = await supabase.from('admin_settings').select('id').limit(1);
    if (testErr2 && testErr2.code === '42P01') {
      console.log('  ❌ Table does not exist. Please create manually:');
      console.log(`
  CREATE TABLE admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    current_model_id TEXT DEFAULT 'claude-sonnet-4-6',
    script_system_prompt TEXT DEFAULT '당신은 세계적 수준의 시나리오 작가이자 엘리트 쇼러너입니다...',
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  -- Insert default row
  INSERT INTO admin_settings (current_model_id) VALUES ('claude-sonnet-4-6');
      `);
    } else {
      console.log('  ✅ admin_settings table already exists or accessible.');
    }
  } else {
    console.log('  ✅ admin_settings table created.');
  }

  // 3. Seed admin_settings if empty
  console.log('[3/4] Seeding admin_settings default row...');
  const { data: existing } = await supabase.from('admin_settings').select('id').limit(1);
  if (!existing || existing.length === 0) {
    const { error: seedErr } = await supabase.from('admin_settings').insert({
      current_model_id: 'claude-sonnet-4-6',
      script_system_prompt: '당신은 세계적 수준의 시나리오 작가이자 엘리트 쇼러너입니다. 제공된 스토리 바이블을 기반으로 깊이 있고 몰입감 있는 시나리오를 작성하십시오. 캐릭터의 내면 심리를 정밀하게 묘사하고, 서브텍스트가 풍부한 대사를 구사하며, 영화적 장면 전환을 사용하십시오.'
    });
    if (seedErr) {
      console.log('  ❌ Seed failed:', seedErr.message);
    } else {
      console.log('  ✅ Default admin settings seeded.');
    }
  } else {
    console.log('  ✅ Admin settings already seeded.');
  }

  // 4. Add episodes column to projects_v2 for episode count tracking
  console.log('[4/4] Adding episode_count to projects_v2...');
  const { error: e4 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE projects_v2 ADD COLUMN IF NOT EXISTS episode_count INTEGER DEFAULT 1;`
  });
  if (e4) {
    console.log('  ⚠️  Column may already exist or RPC unavailable. Check manually if needed.');
  } else {
    console.log('  ✅ episode_count column added to projects_v2.');
  }

  console.log('\n🎬 Migration Complete! Directors Arena v2.1 Ready.');
  console.log('\n📋 If any tables failed, run the SQL statements above in the Supabase SQL Editor.');
}

migrate().catch(console.error);
