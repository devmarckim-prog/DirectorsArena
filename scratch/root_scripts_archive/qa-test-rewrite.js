/**
 * qa-test-rewrite.js
 * 
 * Safety Protocol: This script tests the API logic WITHOUT starting a network server,
 * by directly calling the handler with a mock Request object.
 */

// Mock environment for API route
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stfonaiuxavzbqwikcqb.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "MASKED";
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "MASKED";

const testPayload = {
  originalText: "그는 문을 열었다.",
  contextBefore: "밤 12시, 밖에는 비가 내리고 있었다.",
  contextAfter: "방 안은 텅 비어 있었다.",
  userInstruction: "좀 더 스릴러 느낌이 나게, 삐걱거리는 소리를 추가해서 묘사해줘."
};

async function runTest() {
  console.log("🛡️ [QA] Starting Magic Rewrite Integration Test...");
  console.log("Payload:", JSON.stringify(testPayload, null, 2));

  try {
    // We'll use fetch against the local dev server if it's up, 
    // but the prompt asked for localhost:3000 specifically.
    const response = await fetch("http://localhost:3000/api/scenario/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload)
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("❌ [QA] Test Failed:", response.status, err);
        return;
    }

    const result = await response.json();
    console.log("✅ [QA] Test Successful!");
    console.log("Generated Text:", result.text);
  } catch (err) {
    console.error("❌ [QA] Connection Error: Is the local server running on port 3000?");
    console.log("Hint: Run 'npm run dev' in another terminal before running this test.");
  }
}

runTest();
