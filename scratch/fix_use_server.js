const fs = require('fs');
const path = require('path');

function fixUseServer(relPath) {
  const filePath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(/"use server";\n?/g, '');
  content = `"use server";\n\n` + content.trimStart();
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed "use server" in ${relPath}`);
}

fixUseServer('lib/actions/generation.ts');
fixUseServer('lib/actions/project.ts');
