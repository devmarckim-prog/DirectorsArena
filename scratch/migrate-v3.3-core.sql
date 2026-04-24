-- v3.3 Core Narrative Infrastructure
CREATE TABLE IF NOT EXISTS story_beats_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
    act_number INTEGER NOT NULL,
    beat_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    timestamp_label TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for timeline ordering
CREATE INDEX IF NOT EXISTS idx_story_beats_v2_project_id ON story_beats_v2(project_id);
CREATE INDEX IF NOT EXISTS idx_story_beats_v2_order ON story_beats_v2(project_id, order_index);

-- v7.2 API Usage Tracking Infrastructure (Telemetry)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v2(id) ON DELETE SET NULL,
    model_id TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(12, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_project_id ON api_usage_logs(project_id);
