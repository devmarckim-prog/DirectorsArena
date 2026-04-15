/**
 * Directors Arena v3.1 — Relational Schema Migration
 * Run: node migrate_production.js
 * 
 * Creates strictly relational tables for Production Modules.
 * DO NOT USE JSONB for core data relationships.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log('🚀 Starting Directors Arena v3.1 Production Migration...\n');

  // 1. admin_settings (CRITICAL REDESIGN)
  console.log('[1/6] Recreating admin_settings table with distinct prompt columns...');
  const { error: e1 } = await supabase.rpc('exec_sql', {
    sql: `
      DROP TABLE IF EXISTS admin_settings;
      CREATE TABLE admin_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        model_id_primary TEXT DEFAULT 'claude-sonnet-4-6',
        model_id_fast TEXT DEFAULT 'claude-haiku-4-5-20251001',
        prompt_scenario_init TEXT DEFAULT '당신은 엘리트 쇼러너입니다...',
        prompt_similar_content TEXT DEFAULT '유사한 작품 3개를 추천하십시오...',
        prompt_episode_outline TEXT DEFAULT '각 회차별 아웃라인을 작성하십시오...',
        prompt_episode_script TEXT DEFAULT '업계 표준 포맷으로 대본을 작성하십시오...',
        prompt_prod_casting TEXT DEFAULT '캐릭터에 어울리는 실존 배우를 추천하십시오...',
        prompt_prod_budget TEXT DEFAULT '예상 제작비 예산을 산출하십시오...',
        prompt_prod_breakdown TEXT DEFAULT '대본을 분석하여 소품, 의상, VFX, 엑스트라를 추출하십시오...',
        prompt_prod_ppl_location TEXT DEFAULT 'PPL 카테고리와 구글 맵 검색용 로케이션 쿼리를 추천하십시오...',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      INSERT INTO admin_settings (model_id_primary) VALUES ('claude-sonnet-4-6');
    `
  });
  if (e1) console.log('  ⚠️ SQL Error or RPC not enabled on admin_settings:', e1.message);
  else console.log('  ✅ admin_settings table recreated successfully.');

  // 2. similar_contents
  console.log('[2/6] Creating similar_contents table...');
  const { error: e2 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS similar_contents (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        viewer_stats TEXT,
        similarity_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e2) console.log('  ⚠️ Error:', e2.message); else console.log('  ✅ similar_contents created.');

  // 3. production_casting
  console.log('[3/6] Creating production_casting table...');
  const { error: e3 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS production_casting (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
        character_id UUID REFERENCES characters_v2(id) ON DELETE CASCADE,
        recommended_actor TEXT NOT NULL,
        reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e3) console.log('  ⚠️ Error:', e3.message); else console.log('  ✅ production_casting created.');

  // 4. production_budgets
  console.log('[4/6] Creating production_budgets table...');
  const { error: e4 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS production_budgets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
        estimated_cost BIGINT NOT NULL,
        breakdown_json JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e4) console.log('  ⚠️ Error:', e4.message); else console.log('  ✅ production_budgets created.');

  // 5. production_script_breakdowns
  console.log('[5/6] Creating production_script_breakdowns table...');
  const { error: e5 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS production_script_breakdowns (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        episode_id UUID REFERENCES episodes_v2(id) ON DELETE CASCADE,
        scene_number INTEGER,
        props TEXT,
        wardrobe TEXT,
        vfx TEXT,
        extras TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e5) console.log('  ⚠️ Error:', e5.message); else console.log('  ✅ production_script_breakdowns created.');

  // 6. production_ppl_locations
  console.log('[6/6] Creating production_ppl_locations table...');
  const { error: e6 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS production_ppl_locations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        episode_id UUID REFERENCES episodes_v2(id) ON DELETE CASCADE,
        scene_number INTEGER,
        ppl_category TEXT,
        location_query TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (e6) console.log('  ⚠️ Error:', e6.message); else console.log('  ✅ production_ppl_locations created.');

  console.log('\n🎬 Migration Preparation Complete!');
  console.log('📋 Ensure RPC is enabled or run the standard SQL output in your Supabase Editor.');
}

migrate().catch(console.error);
