const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\happy\\OneDrive\\문서\\99. App_Dev\\DirectorsArena_New\\HISTORY DATA';
const files = [
  'HISTORYDATA_Expanded.json',
  'HISTORYDATA_Expanded (1).json',
  'HISTORYDATA_Expanded (2).json',
  'HISTORYDATA_Expanded (3).json',
  'HISTORYDATA_Expanded (4).json'
];

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  const buffer = fs.readFileSync(filePath);
  console.log(`${file}: ${buffer[0].toString(16)} ${buffer[1].toString(16)} ${buffer[2].toString(16)}`);
});
