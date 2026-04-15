const { Client } = require('pg');
require('dotenv').config({ path: '../DirectorsArena/.env' }); // Load from 8081 to get DATABASE_URL

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
-- 1. Projects V2 (Next.js Schema)
CREATE TABLE IF NOT EXISTS public.projects_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    genre TEXT,
    platform TEXT,
    duration INTEGER,
    world TEXT,
    logline TEXT,
    synopsis TEXT,
    internal_conflict TEXT,
    external_conflict TEXT,
    status TEXT DEFAULT 'BAKING', -- 'BAKING', 'COMPLETED', 'ERROR'
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Characters V2 (Aligned with Next.js Zod Schema)
CREATE TABLE IF NOT EXISTS public.characters_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    job TEXT,
    gender TEXT,
    age INTEGER,
    secret TEXT,
    look TEXT,
    void TEXT,
    desire TEXT,
    relationship_target_id UUID,
    relationship_type TEXT,
    biometrics JSONB DEFAULT '{}'::jsonb
);

-- 3. Scenes V2 (Aligned with Timeline Rail)
CREATE TABLE IF NOT EXISTS public.scenes_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    location TEXT NOT NULL,
    time_of_day TEXT NOT NULL,
    summary TEXT,
    goal TEXT,
    status TEXT DEFAULT 'pending',
    qc_report JSONB
);

-- 4. Blocks (Individual Lines/Beats in a Script)
CREATE TABLE IF NOT EXISTS public.blocks_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID REFERENCES public.scenes_v2(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'action', 'dialogue', 'parenthetical', 'transition'
    character_name TEXT,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    metadata JSONB
);
`;

async function runMigration() {
  try {
    await client.connect();
    console.log("Connected to DB. Running V2 Migration...");
    await client.query(sql);
    console.log("Migration successful! V2 tables created.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

runMigration();
