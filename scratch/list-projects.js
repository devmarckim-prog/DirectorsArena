const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function listRecentProjects() {
  console.log("Listing recent projects...");
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, status, progress, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("List Error:", error);
    return;
  }

  console.log("Recent projects:");
  console.log(JSON.stringify(data, null, 2));
}

listRecentProjects();
