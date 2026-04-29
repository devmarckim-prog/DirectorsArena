const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSecretGarden() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, episode_count, synopsis')
    .ilike('title', '%시크릿%가든%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    data.forEach(p => {
      let synCount = 0;
      try {
        const syn = JSON.parse(p.synopsis);
        synCount = syn?.formData?.episodes || syn?.episodes?.length || 0;
      } catch(e) {}
      
      console.log(`Title: ${p.title}`);
      console.log(`DB episode_count: ${p.episode_count}`);
      console.log(`Synopsis episodes: ${synCount}`);
      console.log('---');
    });
  } else {
    console.log('No "Secret Garden" project found.');
  }
}

checkSecretGarden();
