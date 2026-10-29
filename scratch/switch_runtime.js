const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'app', 'api', 'ignite', '[id]', 'route.ts');
let code = fs.readFileSync(file, 'utf-8');
code = code.replace("export const runtime = 'edge';", "export const runtime = 'nodejs';");
fs.writeFileSync(file, code, 'utf-8');
console.log('Switched runtime to nodejs');
