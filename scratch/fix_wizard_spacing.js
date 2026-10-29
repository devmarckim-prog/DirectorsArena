const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'project-wizard', 'page.tsx');
let code = fs.readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');

// 1. Adjust wrapper and main padding
code = code.replace(
  '<div className="min-h-screen text-neutral-100 font-sans overflow-x-hidden relative selection:bg-brand-gold/30 selection:text-white pt-12">',
  '<div className="min-h-screen text-neutral-100 font-sans overflow-x-hidden relative selection:bg-brand-gold/30 selection:text-white pt-4">'
);

code = code.replace(
  '<main className="relative pt-4 pb-8 max-w-7xl mx-auto px-6 flex-1 flex flex-col">',
  '<main className="relative pt-2 pb-44 max-w-7xl mx-auto px-6 flex-1 flex flex-col">'
);

code = code.replace(
  '<div className="flex-1 flex flex-col pt-10">',
  '<div className="flex-1 flex flex-col pt-4">'
);

code = code.replace(
  '<div className="w-full mb-10">',
  '<div className="w-full mb-5">'
);

// 2. Adjust fixed bottom navigation bar position
code = code.replace(
  '<div className="fixed bottom-[73px] left-1/2 -translate-x-1/2 flex items-center space-x-6 z-[100] bg-neutral-950/60 backdrop-blur-3xl px-10 py-5 rounded-full border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">',
  '<div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-[100] bg-neutral-950/80 backdrop-blur-2xl px-8 py-3 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">'
);

fs.writeFileSync(file, code, 'utf-8');
console.log('Successfully adjusted project-wizard spacing and bottom navigation bar');
