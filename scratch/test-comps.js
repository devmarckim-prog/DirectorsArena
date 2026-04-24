const projectId = "d5cef2c4-f560-4933-8294-2a4440a4e5e4";

async function testComps() {
  console.log(`Testing Comps API for ${projectId}...`);
  
  try {
    const res = await fetch(`http://localhost:3000/api/scenario/comps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId })
    });
    
    console.log(`Status: ${res.status}`);
    const body = await res.json();
    console.log(`Response:`, JSON.stringify(body, null, 2));
  } catch (err) {
    console.error("Fetch Failed:", err.message);
  }
}

testComps();
