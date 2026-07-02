#!/usr/bin/env node
// session-start.mjs — SessionStart hook: injects slingshot ledgers as context.
// Zero dependencies. Node 18+.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Async stdin read with a 1s timeout: readFileSync(0) is unreliable with
// pipes on Windows, and a hook script must never hang a session start.
const readStdin = () =>
  new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve('');
    let input = '';
    const timer = setTimeout(() => resolve(input), 1000);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (input += c));
    process.stdin.once('end', () => {
      clearTimeout(timer);
      resolve(input);
    });
  });

let cwd = process.cwd();
try {
  // ﻿ strip: PowerShell 5.1 prefixes piped input with a BOM
  const input = (await readStdin()).replace(new RegExp('^\\uFEFF'), '').trim();
  if (input) cwd = JSON.parse(input).cwd || cwd;
} catch {
  // malformed input — keep process.cwd()
}

const CAP = 6000; // chars per ledger; ledgers are line-capped anyway
const readLedger = (file, label) => {
  try {
    const text = fs.readFileSync(file, 'utf8').trim();
    if (!text) return null;
    return `### ${label} (${file})\n${text.slice(0, CAP)}`;
  } catch {
    return null;
  }
};

const parts = [
  readLedger(path.join(os.homedir(), '.claude', 'slingshot', 'generic.md'), 'Generic ledger'),
  readLedger(path.join(cwd, '.claude', 'slingshot.md'), 'Project ledger'),
].filter(Boolean);

if (parts.length) {
  const header =
    '## Slingshot ledgers (auto-injected by SessionStart hook — consume silently; ' +
    'do NOT re-read the ledger files this session)';
  const payload = JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `${header}\n\n${parts.join('\n\n')}`,
    },
  });
  process.stdout.write(payload, () => process.exit(0));
} else {
  process.exit(0);
}
