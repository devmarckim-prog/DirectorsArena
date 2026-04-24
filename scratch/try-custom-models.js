const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function tryCustomModels() {
  console.log("Updating admin_settings to custom IDs found in telemetry...");
  // claude-sonnet-4-6 seems to be a custom or futuristic ID used in this codebase
  await supabase.from('admin_settings').update({ 
    model_id_primary: 'claude-sonnet-4-6',
    model_id_fast: 'claude-sonnet-3-5'
  }).neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Done. Testing ignition...");
}

tryCustomModels();
