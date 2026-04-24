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
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    if (data.events && Array.isArray(data.events)) {
      allEvents = allEvents.concat(data.events);
    }
  } catch (err) {
    console.error(`Error in ${file}: ${err.message}`);
  }
});

// Deduplicate and filter
// Rule: If multiple events have the same (year, title), keep one.
// Rule: Prioritize events without "(확장 데이터)" in the title.
const eventMap = new Map();

allEvents.forEach(event => {
  const key = `${event.year}|${event.title}`;
  const isPlaceholder = event.title.includes('(확장 데이터)') || event.title.includes('상세 사건');
  
  if (!eventMap.has(key)) {
    eventMap.set(key, event);
  } else {
    const existing = eventMap.get(key);
    const existingIsPlaceholder = existing.title.includes('(확장 데이터)') || existing.title.includes('상세 사건');
    
    if (existingIsPlaceholder && !isPlaceholder) {
      eventMap.set(key, event);
    }
  }
});

let finalEvents = Array.from(eventMap.values());

// Sort by year
finalEvents.sort((a, b) => a.year - b.year);

// Fix the "1948 flaw"
// Based on the user's request, let's look for any 1948 entry that might be broken.
// I'll also ensure all fields are correctly formatted.
finalEvents = finalEvents.map(event => {
  if (event.year === 1948) {
    // Ensure all strings are trimmed
    if (event.title) event.title = event.title.trim();
    if (event.desc) event.desc = event.desc.trim();
    // Fix any potential issues with region array
    if (Array.isArray(event.region)) {
      event.region = event.region.map(r => r.trim()).filter(r => r.length > 0);
    }
  }
  return event;
});

// Output as TypeScript constant
const tsContent = `export interface HistoricalEvent {
  year: number;
  tag: 'POLITICS' | 'WAR' | 'TECHNOLOGY' | 'ECONOMY' | 'SOCIETY' | 'CULTURE' | 'SCIENCE' | 'RELIGION' | 'DISASTER';
  title: string;
  desc: string;
  location: string;
  region: string[];
  scope: 'kr' | 'global';
  importance: number; // 1-5
}

export const HISTORICAL_DATA: HistoricalEvent[] = ${JSON.stringify(finalEvents, null, 2)};
`;

fs.writeFileSync('C:\\Users\\happy\\OneDrive\\문서\\99. App_Dev\\Directors_Areana\\lib\\constants\\history.ts', tsContent);
console.log(`Successfully merged ${finalEvents.length} events into history.ts`);
