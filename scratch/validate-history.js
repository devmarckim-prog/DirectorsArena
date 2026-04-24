const { HISTORICAL_DATA } = require('./lib/constants/history');

console.log('Validating HISTORICAL_DATA...');
let errors = 0;
HISTORICAL_DATA.forEach((event, i) => {
  if (typeof event.year !== 'number') {
    console.error(`Row ${i}: Invalid year`, event);
    errors++;
  }
  if (!['POLITICS', 'WAR', 'TECHNOLOGY', 'ECONOMY', 'SOCIETY', 'CULTURE', 'SCIENCE', 'RELIGION', 'DISASTER'].includes(event.tag)) {
    console.error(`Row ${i}: Invalid tag`, event.tag);
    errors++;
  }
  if (!event.title || typeof event.title !== 'string') {
    console.error(`Row ${i}: Invalid title`, event.title);
    errors++;
  }
  if (!['kr', 'global'].includes(event.scope)) {
    console.error(`Row ${i}: Invalid scope`, event.scope);
    errors++;
  }
});

if (errors === 0) {
  console.log('✅ No structural errors found.');
} else {
  console.log(`❌ Found ${errors} errors.`);
}
