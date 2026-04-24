const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const GLOAMING_ID = '4dd61c93-ee40-4de1-a54b-e91cc009887a';

async function patch() {
  console.log('--- Patching The Gloaming Comps with Posters ---');

  const updates = [
    { 
      title: "The Lord of the Rings: The Two Towers", 
      poster_path: "https://image.tmdb.org/t/p/w780/56v2KjI5h9n9QCvAl6ybv3Yv7wk.jpg",
      vote_average: 8.4,
      release_date: "2002-12-18",
      genres: ["Adventure", "Fantasy", "Action"],
      media_type: "movie"
    },
    { 
      title: "Inception", 
      poster_path: "https://image.tmdb.org/t/p/w780/edv5CZvRjS99vS6Y6I6HjC1RSmY.jpg",
      vote_average: 8.4,
      release_date: "2010-07-15",
      genres: ["Action", "Sci-Fi", "Adventure"],
      media_type: "movie"
    },
    { 
      title: "Interstellar", 
      poster_path: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlSabaC.jpg",
      vote_average: 8.4,
      release_date: "2014-11-05",
      genres: ["Adventure", "Drama", "Sci-Fi"],
      media_type: "movie"
    }
  ];

  // Try to update existing or insert if missing
  for (const item of updates) {
    const { data: existing } = await supabase.from('similar_contents').select('id').eq('project_id', GLOAMING_ID).eq('title', item.title).single();
    if (existing) {
      await supabase.from('similar_contents').update(item).eq('id', existing.id);
      console.log(`✔ Updated: ${item.title}`);
    } else {
      await supabase.from('similar_contents').insert([{ ...item, project_id: GLOAMING_ID, similarity_reason: "Manual patch for high-fidelity verification." }]);
      console.log(`+ Inserted: ${item.title}`);
    }
  }

  console.log('✅ The Gloaming Comps patched successfully!');
}

patch();
