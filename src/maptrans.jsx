// Grammar-map translation.
//
// The curated maps are written in English (with some Hungarian). Rather than
// shipping thousands of machine translations as if they were authored, the map
// is translated on demand into whichever explanation language is selected and
// cached permanently in this browser. Each rule is therefore paid for once,
// ever, and no unverified text is committed to the repository.

const MAPTRANS_KEY = "lm3:mapTrans";
let MAPTRANS = null;

function loadMapTrans() {
  if (MAPTRANS) return MAPTRANS;
  try { MAPTRANS = JSON.parse(localStorage.getItem(MAPTRANS_KEY) || "{}"); } catch(e) { MAPTRANS = {}; }
  return MAPTRANS;
}
function saveMapTrans() {
  try { localStorage.setItem(MAPTRANS_KEY, JSON.stringify(MAPTRANS || {})); } catch(e) {}
}
const mapTransKey = (mapCode, lang) => mapCode + "|" + lang;

// Languages that are already authored in the data files need no translation.
const AUTHORED = { en: true, hu: true };
const needsTranslation = (lang) => !AUTHORED[lang];

// What one node contributes to a translation request.
function nodePayload(n) {
  return { id: n.id, label: n.label_en, rule: n.rule_en, reason: n.reason_en || "",
    ex: (n.examples || []).map(e => e.en || "") };
}
function excPayload(c, e, i) {
  return { id: c.id + "__exc" + i, title: e.title_en, body: e.body_en,
    ex: (e.examples || []).map(x => x.en || "") };
}

// Translate one cluster at a time: small enough to stay reliable, large enough
// that a whole map is a handful of calls rather than hundreds.
async function translateCluster(cluster, lang, S) {
  const payload = {
    title: cluster.title_en, blurb: cluster.blurb_en || "",
    nodes: cluster.nodes.map(nodePayload),
    exceptions: (cluster.exceptions || []).map((e, i) => excPayload(cluster, e, i))
  };
  const target = (TARGET_LANGS.find(l => l.code === (S.target || "")) || {}).name || "the target language";
  const { text } = await llmCall(S, { maxTokens: 4000, task: "map-translate",
    system: `You translate grammar-reference material for learners of ${target} into ${langName(lang)}.
Return ONLY the same JSON structure with every English string replaced by its ${langName(lang)} translation. Keep all "id" values byte-identical. Keep the arrays the same length and order.
Write as a grammar book written for ${langName(lang)} speakers would: use that language's own grammatical terminology, and keep it concise and precise.
Never translate the example sentences themselves — the "ex" strings are English glosses OF ${target} examples, so translate the gloss into ${langName(lang)}.
Do not add commentary, do not wrap in code fences.`,
    messages: [{ role: "user", content: JSON.stringify(payload) }] });
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("translation was not JSON");
  return JSON.parse(m[0]);
}

// Fold a translated cluster back onto the live objects as label_<lang> etc, so
// every existing lookup (`node["label_"+lang] || node.label_en`) just works.
function applyCluster(cluster, tr, lang) {
  if (tr.title) cluster["title_" + lang] = tr.title;
  if (tr.blurb) cluster["blurb_" + lang] = tr.blurb;
  const byId = {};
  (tr.nodes || []).forEach(n => { byId[n.id] = n; });
  cluster.nodes.forEach(n => {
    const t = byId[n.id]; if (!t) return;
    if (t.label) n["label_" + lang] = t.label;
    if (t.rule) n["rule_" + lang] = t.rule;
    if (t.reason) n["reason_" + lang] = t.reason;
    (t.ex || []).forEach((g, i) => { if (g && n.examples[i]) n.examples[i][lang] = g; });
  });
  const excById = {};
  (tr.exceptions || []).forEach(e => { excById[e.id] = e; });
  (cluster.exceptions || []).forEach((e, i) => {
    const t = excById[cluster.id + "__exc" + i]; if (!t) return;
    if (t.title) e["title_" + lang] = t.title;
    if (t.body) e["body_" + lang] = t.body;
    (t.ex || []).forEach((g, j) => { if (g && e.examples && e.examples[j]) e.examples[j][lang] = g; });
  });
}

// Re-apply a cached translation to the in-memory map (called on every load).
function hydrateMapTranslations(mapCode, lang) {
  if (!needsTranslation(lang)) return false;
  const cache = loadMapTrans()[mapTransKey(mapCode, lang)];
  if (!cache) return false;
  const clusters = GRAM_MAPS[mapCode] || [];
  clusters.forEach(c => { if (cache[c.id]) applyCluster(c, cache[c.id], lang); });
  return true;
}

// How much of this map is already translated into this language?
function mapTransProgress(mapCode, lang) {
  const clusters = GRAM_MAPS[mapCode] || [];
  if (!clusters.length) return { done: 0, total: 0 };
  if (!needsTranslation(lang)) return { done: clusters.length, total: clusters.length };
  const cache = loadMapTrans()[mapTransKey(mapCode, lang)] || {};
  return { done: clusters.filter(c => cache[c.id]).length, total: clusters.length };
}

// Translate the whole map, cluster by cluster, reporting progress. Safe to stop
// and resume: finished clusters are cached as they complete.
async function translateMap(mapCode, lang, S, onProgress, shouldStop) {
  if (!needsTranslation(lang)) return { done: 0, total: 0 };
  const clusters = GRAM_MAPS[mapCode] || [];
  const store = loadMapTrans();
  const key = mapTransKey(mapCode, lang);
  const cache = store[key] || (store[key] = {});
  const todo = clusters.filter(c => !cache[c.id]);
  let done = 0;
  for (const c of todo) {
    if (shouldStop && shouldStop()) break;
    try {
      const tr = await translateCluster(c, lang, S);
      cache[c.id] = tr;
      applyCluster(c, tr, lang);
      saveMapTrans();
    } catch(e) {
      onProgress && onProgress({ done, total: todo.length, error: String(e.message || e) });
      throw e;
    }
    done++;
    onProgress && onProgress({ done, total: todo.length });
  }
  return { done, total: todo.length };
}

function clearMapTranslations(mapCode, lang) {
  const store = loadMapTrans();
  if (mapCode && lang) delete store[mapTransKey(mapCode, lang)];
  else MAPTRANS = {};
  saveMapTrans();
}

Object.assign(window, { loadMapTrans, hydrateMapTranslations, mapTransProgress, translateMap,
  clearMapTranslations, needsTranslation, MAPTRANS_KEY });
