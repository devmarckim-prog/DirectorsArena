const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs');

async function test() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k) env[k.trim()] = v.join('=').trim();
  });

  const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  const models = ["claude-3-5-sonnet-20240620", "claude-3-haiku-20240307"];
  
  for (const model of models) {
    console.log(`Testing with model: ${model}...`);
    try {
      const msg = await anthropic.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: "user", content: "Hello" }],
      });
      console.log(`✅ Success for ${model}! Response:`, msg.content[0].text);
      return; // 하나라도 성공하면 종료
    } catch (err) {
      console.error(`❌ Failed for ${model}:`, err.message);
    }
  }
}

test();
