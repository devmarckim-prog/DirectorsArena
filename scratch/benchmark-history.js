const { HISTORICAL_DATA, getEventsForYear } = require('./lib/constants/history');

console.log('Benchmarking getEventsForYear...');
const start = performance.now();
for (let i = 0; i < 1000; i++) {
  getEventsForYear(1948, 'kr');
}
const end = performance.now();
console.log(`Time for 1000 lookups: ${(end - start).toFixed(2)}ms`);
console.log(`Average time per lookup: ${((end - start) / 1000).toFixed(4)}ms`);
