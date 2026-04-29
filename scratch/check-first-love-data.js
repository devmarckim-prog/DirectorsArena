const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProjectData() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .eq('id', 'd61778ff-59ae-467e-9179-15b701bff5cd')
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return;
  }

  console.log('Project ID:', data.id);
  console.log('Episode Count Column:', data.episode_count);
  console.log('Episodes Count Column:', data.episodes_count);
  
  if (data.synopsis) {
    try {
      const syn = JSON.parse(data.synopsis);
      console.log('--- Synopsis Structure ---');
      console.log('Keys:', Object.keys(syn));
      if (syn.formData) console.log('formData.episodes:', syn.formData.episodes);
      if (syn.metadata) console.log('metadata.episodes:', syn.metadata.episodes);
      if (syn.episodes) console.log('episodes length:', syn.episodes.length);
    } catch (e) {
      console.log('Synopsis is not JSON or corrupted.');
    }
  }
}

checkProjectData();
