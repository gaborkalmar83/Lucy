// Generate STATIC grammar-map translations and commit them to the repo.
//
// The app can translate a map at runtime and cache it in one browser, but that
// costs every user their own API calls and never leaves their device. This
// script does the same work once, offline, and writes the result into
// src/data/maptrans.gen.js — which is bundled, so from then on the language is
// simply part of the app: no key, no wait, works offline, same on every device.
//
// Usage:
//   node tools/translate-maps.mjs --map de --lang hu
//   node tools/translate-maps.mjs --map de,fi --lang hu,nl,de
//   node tools/translate-maps.mjs --all                 (every map × every language)
//
// Provider comes from the environment so no key is ever written to disk:
//   LM_PROVIDER  openai | anthropic | azure | openrouter | local   (default openai)
//   LM_KEY       API key
//   LM_MODEL     model or Azure deployment name
//   LM_ENDPOINT  azure resource URL, or local base URL (e.g. http://localhost:11434/v1)
//   LM_API_VERSION  azure only (default 2024-10-21)
//
// Resumable: clusters already present in maptrans.gen.js are skipped, and the
// file is rewritten after every cluster, so an interrupted run loses nothing.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUTFILE = path.join(SRC, 'data', 'maptrans.gen.js');

const DATA_FILES = ['data/clusters-a.js', 'data/clusters-b.js', 'data/clusters-c.js', 'data/clusters-d.js',
  'data/grammar-en.js', 'data/grammar-hu.js', 'data/grammar-hu2.js',
  'data/grammar-de.js', 'data/grammar-de2.js', 'data/grammar-fi.js', 'data/grammar-fi2.js'];

// Kept in step with core.jsx. Maps are authored in English (the Dutch one also
// in Hungarian), so those pairs need no translation.
const AUTHORED = { nl: { en: 1, hu: 1 }, en: { en: 1 }, hu: { en: 1 }, de: { en: 1 }, fi: { en: 1 } };
const TARGET_NAME = { nl: 'Dutch', en: 'English', hu: 'Hungarian', de: 'German', fi: 'Finnish' };
const LANG_NAME = { en: 'English', hu: 'Hungarian', de: 'German', fr: 'French', es: 'Spanish',
  it: 'Italian', pt: 'Portuguese', pl: 'Polish', sv: 'Swedish', nl: 'Dutch',
  mk: 'Macedonian', sr: 'Serbian', ru: 'Russian' };
const ALL_LANGS = Object.keys(LANG_NAME);

// ── load the map data by running the data files ─────────────────────────────
function loadMaps() {
  const w = {};
  for (const f of DATA_FILES) {
    const code = fs.readFileSync(path.join(SRC, f), 'utf8');
    new Function('window', code)(w);
  }
  return {
    nl: [...w.GRAM_CLUSTERS_A, ...w.GRAM_CLUSTERS_B, ...w.GRAM_CLUSTERS_C, ...w.GRAM_CLUSTERS_D],
    en: w.GRAM_EN,
    hu: [...w.GRAM_HU, ...w.GRAM_HU2],
    de: [...w.GRAM_DE, ...w.GRAM_DE2],
    fi: [...w.GRAM_FI, ...w.GRAM_FI2]
  };
}

// ── existing output, so a run is resumable ──────────────────────────────────
function loadExisting() {
  if (!fs.existsSync(OUTFILE)) return {};
  const w = {};
  try { new Function('window', fs.readFileSync(OUTFILE, 'utf8'))(w); } catch (e) { return {}; }
  return w.MAP_I18N || {};
}
function writeOut(data) {
  const header = `// GENERATED FILE — do not edit by hand.
//
// Static grammar-map translations, produced by tools/translate-maps.mjs and
// committed to the repo. Anything in here ships with the app: it costs the user
// no API calls, works offline, and is identical on every device.
//
// Shape: MAP_I18N[targetLanguage][explanationLanguage][clusterId] = { title,
// blurb, nodes:[{id,label,rule,reason,ex[]}], exceptions:[{id,title,body,ex[]}] }
// — exactly what translateCluster() returns at runtime, so both paths share the
// same apply code.
//
// To add a language:  npm run translate -- --map de --lang hu
window.MAP_I18N = `;
  fs.writeFileSync(OUTFILE, header + JSON.stringify(data, null, 1) + ';\n');
}

// ── provider ────────────────────────────────────────────────────────────────
const P = {
  provider: process.env.LM_PROVIDER || 'openai',
  key: process.env.LM_KEY || '',
  model: process.env.LM_MODEL || '',
  endpoint: (process.env.LM_ENDPOINT || '').replace(/\/+$/, ''),
  apiVersion: process.env.LM_API_VERSION || '2024-10-21'
};

async function call(system, user) {
  let url, headers, body;
  if (P.provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages';
    headers = { 'content-type': 'application/json', 'x-api-key': P.key, 'anthropic-version': '2023-06-01' };
    body = { model: P.model || 'claude-sonnet-4-5', max_tokens: 8000, system, messages: [{ role: 'user', content: user }] };
  } else {
    if (P.provider === 'azure') {
      url = `${P.endpoint}/openai/deployments/${P.model}/chat/completions?api-version=${P.apiVersion}`;
      headers = { 'content-type': 'application/json', 'api-key': P.key };
    } else if (P.provider === 'local') {
      url = `${P.endpoint || 'http://localhost:11434/v1'}/chat/completions`;
      headers = { 'content-type': 'application/json' };
    } else if (P.provider === 'openrouter') {
      url = 'https://openrouter.ai/api/v1/chat/completions';
      headers = { 'content-type': 'application/json', authorization: 'Bearer ' + P.key };
    } else {
      url = 'https://api.openai.com/v1/chat/completions';
      headers = { 'content-type': 'application/json', authorization: 'Bearer ' + P.key };
    }
    body = { model: P.model || 'gpt-4o', max_tokens: 8000,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }] };
  }
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  return P.provider === 'anthropic'
    ? (j.content || []).map(b => b.text || '').join('')
    : ((j.choices || [])[0] || {}).message?.content || '';
}

// ── one cluster ─────────────────────────────────────────────────────────────
// Same prompt as the in-app path, so the two produce comparable output.
async function translateCluster(cluster, lang, mapCode) {
  const payload = {
    title: cluster.title_en, blurb: cluster.blurb_en || '',
    nodes: cluster.nodes.map(n => ({ id: n.id, label: n.label_en, rule: n.rule_en,
      reason: n.reason_en || '', ex: (n.examples || []).map(e => e.en || '') })),
    exceptions: (cluster.exceptions || []).map((e, i) => ({ id: cluster.id + '__exc' + i,
      title: e.title_en, body: e.body_en, ex: (e.examples || []).map(x => x.en || '') }))
  };
  const target = TARGET_NAME[mapCode] || mapCode;
  const L = LANG_NAME[lang] || lang;
  const system = `You translate grammar-reference material for learners of ${target} into ${L}.
Return ONLY the same JSON structure with every English string replaced by its ${L} translation. Keep all "id" values byte-identical. Keep the arrays the same length and order.
Write as a grammar book written for ${L} speakers would: use that language's own grammatical terminology, and keep it concise and precise.
Never translate the example sentences themselves — the "ex" strings are English glosses OF ${target} examples, so translate the gloss into ${L}.
Do not add commentary, do not wrap in code fences.`;
  const text = await call(system, JSON.stringify(payload));
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('response was not JSON');
  const tr = JSON.parse(m[0]);
  // Structural check: a truncated or reordered reply would corrupt the map.
  if ((tr.nodes || []).length !== payload.nodes.length) throw new Error('node count changed');
  if ((tr.exceptions || []).length !== payload.exceptions.length) throw new Error('exception count changed');
  return tr;
}

// ── main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const argVal = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const list = (v) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : null);

const MAPS = loadMaps();
const wantMaps = args.includes('--all') ? Object.keys(MAPS) : (list(argVal('--map')) || []);
const wantLangs = args.includes('--all') ? ALL_LANGS : (list(argVal('--lang')) || []);

if (!wantMaps.length || !wantLangs.length) {
  console.log('Usage: node tools/translate-maps.mjs --map de,fi --lang hu,nl   (or --all)');
  console.log('Maps:', Object.keys(MAPS).join(', '), '  Languages:', ALL_LANGS.join(', '));
  process.exit(1);
}
if (P.provider !== 'local' && !P.key) {
  console.error('Set LM_KEY (and LM_MODEL / LM_ENDPOINT as needed). Nothing was written.');
  process.exit(1);
}

const out = loadExisting();
let translated = 0, skipped = 0, failed = 0;

for (const mapCode of wantMaps) {
  const clusters = MAPS[mapCode];
  if (!clusters) { console.log(`unknown map: ${mapCode}`); continue; }
  for (const lang of wantLangs) {
    if ((AUTHORED[mapCode] || {})[lang]) { console.log(`${mapCode} → ${lang}: authored, skipping`); continue; }
    out[mapCode] = out[mapCode] || {};
    const bucket = out[mapCode][lang] = out[mapCode][lang] || {};
    const todo = clusters.filter(c => !bucket[c.id]);
    if (!todo.length) { console.log(`${mapCode} → ${lang}: already complete (${clusters.length})`); continue; }
    console.log(`${mapCode} → ${lang}: ${todo.length} of ${clusters.length} clusters to do`);
    for (const c of todo) {
      process.stdout.write(`  ${c.id} … `);
      try {
        bucket[c.id] = await translateCluster(c, lang, mapCode);
        writeOut(out);                       // save after each one: resumable
        translated++; console.log('ok');
      } catch (e) {
        failed++; console.log('FAILED — ' + e.message);
      }
    }
    skipped += clusters.length - todo.length;
  }
}
writeOut(out);
console.log(`\n${translated} clusters translated, ${skipped} already present, ${failed} failed.`);
console.log(`Written to ${path.relative(ROOT, OUTFILE)} — run "npm run build" and commit it.`);
