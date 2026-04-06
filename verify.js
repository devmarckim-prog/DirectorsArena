/**
 * Director's Arena: Environment Verification Script
 * Checks for required environment variables and core packages.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',
    success: '\x1b[32m%s\x1b[0m',
    error: '\x1b[31m%s\x1b[0m',
    warning: '\x1b[33m%s\x1b[0m',
  };
  console.log(colors[type] || colors.info, `[VERIFY] ${msg}`);
}

async function verify() {
  log('Starting Phase 1 Verification...', 'info');

  // 1. Check for .env or .env.local
  const envPath = fs.existsSync(path.join(process.cwd(), '.env.local')) 
    ? '.env.local' 
    : fs.existsSync(path.join(process.cwd(), '.env')) 
      ? '.env' 
      : null;

  if (!envPath) {
    log('CRITICAL: .env or .env.local file missing!', 'error');
    log('Please create a .env file based on .env.example', 'warning');
  } else {
    log(`Found environment file: ${envPath}`, 'success');
  }

  // 2. Check for required packages in package.json
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    log('CRITICAL: package.json missing!', 'error');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const required = ['next', 'zod', 'ai', '@supabase/supabase-js', 'tailwindcss'];

  for (const dep of required) {
    if (deps[dep]) {
      log(`Dependency check: ${dep} [INSTALLED]`, 'success');
    } else {
      log(`Dependency check: ${dep} [MISSING]`, 'warning');
    }
  }

  // 3. Verify directory structure
  const dirs = ['app', 'lib/ai', 'lib/schemas', 'lib/supabase', 'components/editor'];
  for (const dir of dirs) {
    if (fs.existsSync(path.join(process.cwd(), dir))) {
       log(`Directory check: /${dir} [OK]`, 'success');
    } else {
       log(`Directory check: /${dir} [MISSING]`, 'warning');
    }
  }

  log('Verification complete.', 'info');
}

verify().catch(err => {
  log(`Error during verification: ${err.message}`, 'error');
  process.exit(1);
});
