const projectId = '3b227bb4-bd11-424d-84c9-51f1daf29f84';
fetch(`http://localhost:3000/api/generate/${projectId}`, { method: 'POST' })
  .then(res => {
    console.log('Status:', res.status);
    const body = res.body;
    const reader = body.getReader();
    const decoder = new TextDecoder();
    
    let chunkCount = 0;
    
    function readChunk() {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream ended.');
          return;
        }
        chunkCount++;
        const text = decoder.decode(value, { stream: true });
        console.log(`[Chunk ${chunkCount}] length mapping: ${text.length}`);
        
        // Print first 100 chars of the text just to see
        if (chunkCount <= 3 || chunkCount % 10 === 0) {
            console.log(text.substring(0, 100));
        }

        readChunk();
      }).catch(err => {
        console.error('Stream read error:', err);
      });
    }
    
    readChunk();
  })
  .catch(err => console.error('Fetch error:', err));
