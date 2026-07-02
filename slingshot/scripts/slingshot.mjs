#!/usr/bin/env node
// slingshot.mjs — install | update | status | uninstall
// Zero dependencies. Node 18+.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const cmd = args.find((a) => !a.startsWith('--')) ?? 'status';
const flag = (name, dflt) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return dflt;
  return hit.includes('=') ? hit.slice(name.length + 3) : true;
};

const scope = flag('scope', 'global');
const withHook = flag('hook', false) === true;
const projectDir = path.resolve(String(flag('project-dir', process.cwd())));
const globalRoot = path.join(os.homedir(), '.claude');

if (!['install', 'update', 'status', 'uninstall'].includes(cmd)) {
  console.error(`Unknown command "${cmd}". Use: install | update | status | uninstall`);
  process.exit(1);
}
if (!['global', 'project'].includes(scope)) {
  console.error(`--scope must be global or project, got "${scope}"`);
  process.exit(1);
}

const P =
  scope === 'project'
    ? {
        skillDir: path.join(projectDir, '.claude', 'skills', 'slingshot'),
        ruleFiles: [
          path.join(projectDir, 'CLAUDE.md'),
          ...(fs.existsSync(path.join(projectDir, 'AGENTS.md'))
            ? [path.join(projectDir, 'AGENTS.md')]
            : []),
        ],
        settings: path.join(projectDir, '.claude', 'settings.json'),
      }
    : {
        skillDir: path.join(globalRoot, 'skills', 'slingshot'),
        ruleFiles: [path.join(globalRoot, 'CLAUDE.md')],
        settings: path.join(globalRoot, 'settings.json'),
      };

const dataDir = path.join(globalRoot, 'slingshot');
const genericLedger = path.join(dataDir, 'generic.md');
const projectLedger = path.join(projectDir, '.claude', 'slingshot.md');

const BLOCK_RE = /<!-- SLINGSHOT:BEGIN[\s\S]*?<!-- SLINGSHOT:END -->/;

function readVersion(dir) {
  try {
    const m = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8').match(/^version:\s*(\S+)/m);
    return m ? m[1] : 'unknown';
  } catch {
    return null;
  }
}

function buildBlock(version) {
  const body = fs.readFileSync(path.join(SRC, 'rules', 'rule-block.md'), 'utf8').trim();
  return (
    `<!-- SLINGSHOT:BEGIN v${version} — managed block, do not edit by hand; ` +
    `refresh with \`node <skill>/scripts/slingshot.mjs update\` -->\n${body}\n<!-- SLINGSHOT:END -->`
  );
}

function injectRule(file, version) {
  const block = buildBlock(version);
  const existed = fs.existsSync(file);
  let text = existed ? fs.readFileSync(file, 'utf8') : '';
  const had = BLOCK_RE.test(text);
  text = had
    ? text.replace(BLOCK_RE, block)
    : text.trimEnd() + (text.trim() ? '\n\n' : '') + block + '\n';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return had ? 'replaced' : existed ? 'added' : 'created file + added';
}

function removeRule(file) {
  if (!fs.existsSync(file)) return 'absent';
  const text = fs.readFileSync(file, 'utf8');
  if (!BLOCK_RE.test(text)) return 'absent';
  fs.writeFileSync(file, text.replace(BLOCK_RE, '').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
  return 'removed';
}

function loadSettings() {
  if (!fs.existsSync(P.settings)) return {};
  try {
    return JSON.parse(fs.readFileSync(P.settings, 'utf8'));
  } catch (e) {
    console.error(`Cannot parse ${P.settings} (${e.message}). Fix it manually; not touching it.`);
    process.exit(1);
  }
}

const isOurHook = (h) =>
  typeof h?.hooks?.[0]?.command === 'string' && h.hooks[0].command.includes('session-start.mjs');

function installHook() {
  const settings = loadSettings();
  settings.hooks ??= {};
  const list = (settings.hooks.SessionStart ??= []);
  const entry = {
    hooks: [
      {
        type: 'command',
        command: `node "${path.join(P.skillDir, 'scripts', 'session-start.mjs')}"`,
      },
    ],
  };
  const kept = list.filter((h) => !isOurHook(h));
  settings.hooks.SessionStart = [...kept, entry];
  if (fs.existsSync(P.settings)) fs.copyFileSync(P.settings, P.settings + '.bak');
  fs.mkdirSync(path.dirname(P.settings), { recursive: true });
  fs.writeFileSync(P.settings, JSON.stringify(settings, null, 2) + '\n');
  return kept.length < list.length ? 'refreshed' : 'added';
}

function removeHook() {
  if (!fs.existsSync(P.settings)) return 'absent';
  const settings = loadSettings();
  const list = settings.hooks?.SessionStart;
  if (!Array.isArray(list)) return 'absent';
  const kept = list.filter((h) => !isOurHook(h));
  if (kept.length === list.length) return 'absent';
  settings.hooks.SessionStart = kept;
  fs.copyFileSync(P.settings, P.settings + '.bak');
  fs.writeFileSync(P.settings, JSON.stringify(settings, null, 2) + '\n');
  return 'removed';
}

function hookInstalled() {
  try {
    return (loadSettings().hooks?.SessionStart ?? []).some(isOurHook);
  } catch {
    return false;
  }
}

const ledgerStats = (file) => {
  if (!fs.existsSync(file)) return 'not created yet';
  const entries = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('- [')).length;
  return `${entries} entries`;
};

function install() {
  const prev = readVersion(P.skillDir);
  const next = readVersion(SRC);
  if (path.resolve(SRC) !== path.resolve(P.skillDir)) {
    fs.rmSync(P.skillDir, { recursive: true, force: true });
    fs.cpSync(SRC, P.skillDir, { recursive: true });
    console.log(`skill  : ${prev ? `${prev} -> ${next}` : `installed v${next}`} at ${P.skillDir}`);
  } else {
    console.log(`skill  : running from installed copy (v${next}); code copy skipped — run from a fresh source checkout to update code`);
  }
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(genericLedger)) {
    fs.copyFileSync(path.join(SRC, 'learnings', 'seed.md'), genericLedger);
    console.log(`ledger : seeded ${genericLedger}`);
  } else {
    console.log(`ledger : kept ${genericLedger} (${ledgerStats(genericLedger)})`);
  }
  for (const f of P.ruleFiles) console.log(`rule   : ${injectRule(f, next)} in ${f}`);
  if (withHook) console.log(`hook   : ${installHook()} in ${P.settings}`);
  else console.log(`hook   : skipped (pass --hook to auto-inject ledgers each session)`);
}

function status() {
  console.log(`source   : v${readVersion(SRC)} at ${SRC}`);
  const inst = readVersion(P.skillDir);
  console.log(`installed: ${inst ? `v${inst}` : 'no'} (${scope}) at ${P.skillDir}`);
  for (const f of P.ruleFiles) {
    const text = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
    const m = text.match(/<!-- SLINGSHOT:BEGIN (v\S+)/);
    console.log(`rule     : ${m ? `${m[1]} present` : 'MISSING'} in ${f}`);
  }
  console.log(`hook     : ${hookInstalled() ? 'installed' : 'not installed'} (${P.settings})`);
  console.log(`generic  : ${ledgerStats(genericLedger)} (${genericLedger})`);
  console.log(`project  : ${ledgerStats(projectLedger)} (${projectLedger})`);
}

function uninstall() {
  for (const f of P.ruleFiles) console.log(`rule   : ${removeRule(f)} in ${f}`);
  console.log(`hook   : ${removeHook()}`);
  if (path.resolve(SRC) !== path.resolve(P.skillDir)) {
    fs.rmSync(P.skillDir, { recursive: true, force: true });
    console.log(`skill  : removed ${P.skillDir}`);
  } else {
    console.log(`skill  : not removing ${P.skillDir} (script is running from it — delete manually)`);
  }
  console.log(`ledgers: KEPT — ${genericLedger} and ${projectLedger} are your data`);
}

({ install, update: install, status, uninstall })[cmd]();
