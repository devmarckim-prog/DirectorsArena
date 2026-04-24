const projectId = "d5cef2c4-f560-4933-8294-2a4440a4e5e4";

async function retryIgnitionWithLogging() {
  console.log(`[OMA] RE-IGNITING ENGINE FOR ${projectId}...`);
  console.log(`[OMA] PHASE 1: HEARTBEAT HANDSHAKE START`);
  
  try {
    const res = await fetch(`http://localhost:3000/api/ignite/${projectId}`, {
      method: 'POST'
    });
    
    console.log(`[OMA] STATUS: ${res.status}`);
    
    if (!res.body) {
      console.error("[OMA] NO STREAM BODY RECEIVED");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let chunkCount = 0;
    let totalLength = 0;

    console.log(`[OMA] PHASE 2: STREAMING STARTED. LISTENING FOR CHUNKS...`);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log(`[OMA] STREAM COMPLETE. TOTAL CHUNKS: ${chunkCount}, TOTAL LENGTH: ${totalLength}`);
        break;
      }

      const chunk = decoder.decode(value);
      chunkCount++;
      totalLength += chunk.length;
      
      // Log only the first 5 chunks to avoid console flooding, then summary every 10
      if (chunkCount <= 5 || chunkCount % 10 === 0) {
        console.log(`[CHUNK #${chunkCount}] RECEIVED ${chunk.length} BYTES`);
        // Just show a snippet of the message
        const snippet = chunk.substring(0, 50).replace(/\n/g, "\\n");
        console.log(`   DATA SNIPPET: ${snippet}...`);
      }
    }

  } catch (err) {
    console.error("[OMA] FATAL FETCH ERROR:", err.message);
  }
}

retryIgnitionWithLogging();
