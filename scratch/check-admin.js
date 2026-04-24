const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function checkAdminSettings() {
  console.log("Checking admin settings...");
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error("Settings Error:", error);
    return;
  }

  console.log("Admin Settings:");
  console.log(JSON.stringify(data, null, 2));
}

checkAdminSettings();
