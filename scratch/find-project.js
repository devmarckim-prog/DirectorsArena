const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function findProject() {
  console.log("Searching for '방구쟁이의 하루'...");
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, status, progress, created_at')
    .ilike('title', '%방구쟁이%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Search Error:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Found projects:");
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log("No projects found with that title.");
  }
}

findProject();
