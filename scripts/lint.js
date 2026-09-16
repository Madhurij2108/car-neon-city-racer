/**
 * Lightweight syntax and lint validator for Car Neon City Racer
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const TARGET_DIRS = ['src', 'test', 'scripts'];
let errorsCount = 0;
let checkedCount = 0;

function checkFile(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.mjs')) return;
  checkedCount++;
  try {
    execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' });
  } catch (err) {
    console.error(`[LINT ERROR] Syntax check failed on: ${filePath}`);
    console.error(err.stderr ? err.stderr.toString() : err.message);
    errorsCount++;
  }
}

function scanDir(dir) {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return;
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(fullPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(path.relative(ROOT_DIR, entryPath));
    } else if (entry.isFile()) {
      checkFile(entryPath);
    }
  }
}

console.log('=== [AIDLC LINT] Verifying syntax and file structure ===');
for (const dir of TARGET_DIRS) {
  scanDir(dir);
}

if (errorsCount > 0) {
  console.error(`=== [AIDLC LINT] Failed with ${errorsCount} syntax errors ===`);
  process.exit(1);
} else {
  console.log(`=== [AIDLC LINT] Success: ${checkedCount} files verified cleanly ===`);
  process.exit(0);
}
