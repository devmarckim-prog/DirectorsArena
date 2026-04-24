const fs = require('fs');
const path = require('path');

async function testTmdb() {
  const envPath = path.resolve('.env.local');
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envConfig.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals) env[key.trim()] = vals.join('=').trim();
  });

  const apiKey = env.TMDB_API_KEY;
  const query = 'Succession';

  console.log(`--- Testing TMDB with API Key: "${apiKey}" ---`);
  
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=ko-KR`
    );
    
    const json = await res.json();
    if (json.results && json.results.length > 0) {
      const top = json.results[0];
      console.log('✅ Found result:');
      console.log('Title:', top.title || top.name);
      console.log('ID:', top.id);
      console.log('Poster:', top.poster_path);
      console.log('Vote:', top.vote_average);
      console.log('Release:', top.release_date || top.first_air_date);
    } else {
      console.log('❌ No results found or API error.');
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(json));
    }
  } catch (e) {
    console.error('❌ Fetch Error:', e.message);
  }
}

testTmdb();
