const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'components', 'layout', 'header.tsx');
let code = fs.readFileSync(file, 'utf-8');
code = code.replace(/Build v10\.[0-9]+\.[0-9]+/g, 'Build v10.2.0 (POC)');
fs.writeFileSync(file, code, 'utf-8');
console.log('Updated header version to Build v10.2.0 (POC)');
