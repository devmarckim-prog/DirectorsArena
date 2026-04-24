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

let allEvents = [];

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  console.log(`Reading ${file}...`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    if (data.events && Array.isArray(data.events)) {
      allEvents = allEvents.concat(data.events);
      console.log(`  Added ${data.events.length} events.`);
    } else {
      console.log(`  Warning: ${file} does not have an events array.`);
    }
  } catch (err) {
    console.error(`  Error reading or parsing ${file}:`, err.message);
    // If it's a JSON parse error, try to find the line
    if (err.name === 'SyntaxError') {
      const posMatch = err.message.match(/at position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const content = fs.readFileSync(filePath, 'utf8');
        const start = Math.max(0, pos - 100);
        const end = Math.min(content.length, pos + 100);
        console.error(`  Context around error: \n${content.substring(start, end)}`);
      }
    }
  }
});

console.log(`Total events collected: ${allEvents.length}`);

// Check for 1948 entry specifically
const events1948 = allEvents.filter(e => e.year === 1948);
console.log(`Events in 1948: ${events1948.length}`);
if (events1948.length > 0) {
  console.log('Sample 1948 entry:', JSON.stringify(events1948[0], null, 2));
}
