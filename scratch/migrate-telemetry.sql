-- v7.2 API Usage Tracking Infrastructure
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

-- Index for fast daily aggregation
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_project_id ON api_usage_logs(project_id);
