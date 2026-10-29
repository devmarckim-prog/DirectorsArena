const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const publicDir = path.join('C:', 'Users', 'happy', 'OneDrive', '문서', '99. App_Dev', 'Directors_Areana', 'public');

const targets = [
  { url: 'http://localhost:3001/', out: 'screen_home.png' },
  { url: 'http://localhost:3001/project-wizard', out: 'screen_wizard.png' },
  { url: 'http://localhost:3001/admin', out: 'screen_admin.png' },
  { url: 'http://localhost:3001/project-list', out: 'screen_list.png' }
];

for (const t of targets) {
  const outFile = path.join(publicDir, t.out);
  console.log(`Capturing ${t.url} to ${outFile}...`);
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1600,1000 --screenshot="${outFile}" --virtual-time-budget=2500 "${t.url}"`;
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(outFile)) {
      console.log(`Success! File size: ${fs.statSync(outFile).size} bytes`);
    } else {
      console.log(`File not found: ${outFile}`);
    }
  } catch (err) {
    console.error(`Error capturing ${t.url}:`, err.message);
  }
}
