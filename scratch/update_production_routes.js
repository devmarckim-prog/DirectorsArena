const fs = require('fs');
const path = require('path');

function updateRoute(relPath, dummyFnName) {
  const filePath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');

  if (!code.includes('da_poc_admin=true')) {
    const target = 'if (!body?.projectId) return new Response("Missing projectId", { status: 400 });';
    const replacement = `if (!body?.projectId) return new Response("Missing projectId", { status: 400 });
    const cookieHeader = request.headers.get('cookie') || '';
    if (cookieHeader.includes('da_poc_admin=true')) {
      const { ${dummyFnName} } = require('@/lib/poc');
      return new Response(JSON.stringify({ success: true, data: ${dummyFnName}() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }`;

    code = code.replace(target, replacement);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log(`Updated ${relPath}`);
  }
}

updateRoute('app/api/production/casting/route.ts', 'getPocDummyCasting');
updateRoute('app/api/production/budget/route.ts', 'getPocDummyBudget');
updateRoute('app/api/production/ppl-location/route.ts', 'getPocDummyPplLocation');
