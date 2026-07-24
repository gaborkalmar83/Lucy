// LinguaMap v3 — persistence, hash routing, spaced repetition, progress tracking.
// Everything here is browser-local: no server, no account, works offline.

// ── Namespaced storage ───────────────────────────────────────────────────────
const NS = "lm3:";
const KEYS = {
  vocab:"dgs-vocab", mistakes:"dgs-mistakes", settings:"dgs2",   // v2 keys, kept for continuity
  cards:NS+"cards", days:NS+"days", ruleStats:NS+"ruleStats",
  lucyChat:NS+"lucyChat", labState:NS+"labState", readerText:NS+"readerText", ui:NS+"ui"
};
function jget(k, dflt){ try { const v = localStorage.getItem(k); return v==null ? dflt : JSON.parse(v); } catch(e){ return dflt; } }
function jset(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }

// ── Persistent React state ───────────────────────────────────────────────────
// Same signature as useState, but the value survives tab switches, reloads and
// the phone killing the tab in the background. This is what makes moving
// between Map → Lab → Lucy → Review feel like one continuous session.
function usePersistent(key, initial) {
  const [v, setV] = React.useState(() => {
    const stored = jget(key, undefined);
    return stored === undefined ? (typeof initial === "function" ? initial() : initial) : stored;
  });
  const set = React.useCallback((next) => {
    setV(prev => { const val = typeof next === "function" ? next(prev) : next; jset(key, val); return val; });
  }, [key]);
  return [v, set];
}

// ── Hash router ──────────────────────────────────────────────────────────────
// "#/map", "#/map/de_het", "#/practice/word_order_v2", "#/lucy" …
// Deep links are shareable and the browser/phone back button behaves.
const VIEWS = ["map","lab","lucy","review","progress","reader"];
function parseHash(h) {
  const raw = (h || location.hash || "").replace(/^#\/?/, "");
  const [view, ...rest] = raw.split("/").filter(Boolean);
  if (view === "practice") return { view:"practice", arg: rest[0] || "" };
  if (VIEWS.includes(view)) return { view, arg: rest[0] || "" };
  return { view:"map", arg:"" };
}
function buildHash(view, arg){ return "#/" + view + (arg ? "/" + arg : ""); }

function useRoute() {
  const [route, setRoute] = React.useState(() => parseHash());
  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    if (!location.hash) history.replaceState(null, "", buildHash("map",""));
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const nav = React.useCallback((view, arg) => {
    const h = buildHash(view, arg);
    if (location.hash !== h) location.hash = h; else setRoute(parseHash(h));
  }, []);
  // replace() changes the URL without stacking history — used when a drawer
  // closes, so "back" leaves the app section rather than replaying every card.
  const replace = React.useCallback((view, arg) => {
    history.replaceState(null, "", buildHash(view, arg));
    setRoute(parseHash(buildHash(view, arg)));
  }, []);
  return { route, nav, replace };
}

// ── Spaced repetition (SM-2) ─────────────────────────────────────────────────
// Grades: 0 again · 1 hard · 2 good · 3 easy
const DAY = 86400000;
const todayKey = (d) => new Date(d || Date.now()).toISOString().slice(0,10);
const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); };

function newCard(fields) {
  return { id: fields.id || (fields.type + ":" + fields.front + ":" + (fields.lang||"")),
    type:"vocab", front:"", back:"", lang:"", note:"",
    ease:2.5, interval:0, reps:0, lapses:0, due: Date.now(), created: Date.now(), lastGrade:null, ...fields };
}

function schedule(card, grade) {
  const c = { ...card, reps: card.reps + 1, lastGrade: grade, reviewed: Date.now() };
  if (grade === 0) {
    c.lapses += 1;
    c.interval = 0;                      // relearn today
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.due = Date.now() + 6e4;            // back in ~1 minute, same session
    return c;
  }
  const q = grade === 1 ? 3 : grade === 2 ? 4 : 5;                 // SM-2 quality
  c.ease = Math.max(1.3, c.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  if (card.interval === 0) c.interval = grade === 1 ? 1 : grade === 2 ? 1 : 4;
  else if (card.interval === 1) c.interval = grade === 1 ? 2 : grade === 2 ? 3 : 6;
  else c.interval = Math.round(card.interval * (grade === 1 ? 1.2 : c.ease) * (grade === 3 ? 1.3 : 1));
  c.interval = Math.min(c.interval, 365);
  c.due = startOfToday() + c.interval * DAY + Math.floor(Math.random() * 6 * 3600000); // small jitter
  return c;
}

const loadCards = () => jget(KEYS.cards, []);
const saveCards = (c) => jset(KEYS.cards, c);
const dueCards = (cards, now) => cards.filter(c => c.due <= (now || Date.now()));

// Cards are derived from what the learner already produced: saved vocab and
// Lucy's corrections. Re-running this is idempotent — existing scheduling is
// never clobbered.
function syncCards(vocab, mistakes) {
  const cards = loadCards();
  const byId = {};
  cards.forEach(c => { byId[c.id] = c; });
  let changed = false;
  (vocab || []).forEach(v => {
    const id = "vocab:" + (v.lang||"") + ":" + v.term;
    if (!byId[id]) { byId[id] = newCard({ id, type:"vocab", front:v.term, back:v.gloss, lang:v.lang }); changed = true; }
  });
  (mistakes || []).forEach(m => {
    const id = "mistake:" + m.bad;
    if (!byId[id]) { byId[id] = newCard({ id, type:"mistake", front:m.bad, back:m.good, note:m.rule||"" }); changed = true; }
  });
  const out = Object.values(byId);
  if (changed) saveCards(out);
  return out;
}

// ── Daily activity, streak, XP ───────────────────────────────────────────────
function loadDays(){ return jget(KEYS.days, {}); }
function bumpDay(patch) {
  const days = loadDays();
  const k = todayKey();
  const d = days[k] || { reviews:0, correct:0, xp:0, lessons:0, chats:0 };
  Object.entries(patch).forEach(([key, val]) => { d[key] = (d[key] || 0) + val; });
  days[k] = d; jset(KEYS.days, days);
  DAY_SUBS.forEach(f => f());
  return d;
}
const DAY_SUBS = new Set();
function useDays() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => { DAY_SUBS.add(force); return () => DAY_SUBS.delete(force); }, []);
  return loadDays();
}
function streakOf(days) {
  let n = 0;
  for (let i = 0; i < 3650; i++) {
    const k = todayKey(Date.now() - i * DAY);
    const d = days[k];
    const active = d && (d.reviews || d.chats || d.lessons);
    if (active) n++;
    else if (i > 0) break;      // today may legitimately be empty so far
    else if (i === 0) continue;
  }
  return n;
}

// ── Per-rule mastery ─────────────────────────────────────────────────────────
// Fed by the Sentence Lab (rules applied vs violated) and by Practice drills.
function loadRuleStats(){ return jget(KEYS.ruleStats, {}); }
function bumpRule(id, ok) {
  if (!id) return;
  const s = loadRuleStats();
  const r = s[id] || { ok:0, bad:0, last:0 };
  ok ? r.ok++ : r.bad++;
  r.last = Date.now();
  s[id] = r; jset(KEYS.ruleStats, s);
  return r;
}
const masteryOf = (r) => { if (!r || (r.ok + r.bad) === 0) return null; return r.ok / (r.ok + r.bad); };

// ── Backup / restore ─────────────────────────────────────────────────────────
const BACKUP_KEYS = Object.values(KEYS);
function exportAll() {
  const data = { _app:"linguamap", _version:3, _exported:new Date().toISOString() };
  BACKUP_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v != null) data[k] = v; });
  return data;
}
function importAll(obj) {
  if (!obj || obj._app !== "linguamap") throw new Error("Not a LinguaMap backup file");
  BACKUP_KEYS.forEach(k => { if (typeof obj[k] === "string") localStorage.setItem(k, obj[k]); });
  return true;
}
function downloadBackup() {
  const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "linguamap-backup-" + todayKey() + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function clearAllData(){ BACKUP_KEYS.forEach(k => localStorage.removeItem(k)); }

// ── Speech: output (TTS) and input (STT) ─────────────────────────────────────
const BCP47 = { nl:"nl-NL", de:"de-DE", fr:"fr-FR", es:"es-ES", it:"it-IT", pt:"pt-PT", sv:"sv-SE",
  da:"da-DK", no:"nb-NO", pl:"pl-PL", cs:"cs-CZ", hu:"hu-HU", fi:"fi-FI", el:"el-GR", en:"en-GB" };
const ttsOk = () => typeof speechSynthesis !== "undefined";

function speak(text, langCode, S) {
  if (!ttsOk() || !text) return false;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(stripMarkup(text));
    u.lang = BCP47[langCode] || langCode || "en-GB";
    u.rate = (S && S.speak && S.speak.rate) || 0.9;
    const want = S && S.speak && S.speak.voice;
    if (want) { const v = speechSynthesis.getVoices().find(x => x.name === want); if (v) u.voice = v; }
    else { const v = speechSynthesis.getVoices().find(x => x.lang === u.lang); if (v) u.voice = v; }
    speechSynthesis.speak(u);
    return true;
  } catch(e){ return false; }
}
const stopSpeaking = () => { if (ttsOk()) speechSynthesis.cancel(); };
// Strip the app's own annotation syntax so the voice reads real words only.
function stripMarkup(s) {
  return String(s)
    .replace(/⟨\w+⟩/g, "")
    .replace(/\[\[map:[a-z_0-9]+\]\]/g, "")
    .replace(/[*_`#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function useVoices() {
  const [voices, setVoices] = React.useState(() => ttsOk() ? speechSynthesis.getVoices() : []);
  React.useEffect(() => {
    if (!ttsOk()) return;
    const h = () => setVoices(speechSynthesis.getVoices());
    h(); speechSynthesis.addEventListener("voiceschanged", h);
    return () => speechSynthesis.removeEventListener("voiceschanged", h);
  }, []);
  return voices;
}

const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
const sttOk = () => !!SR;
function useDictation(langCode, onResult) {
  const [listening, setListening] = React.useState(false);
  const ref = React.useRef(null);
  const stop = React.useCallback(() => { if (ref.current) { try { ref.current.stop(); } catch(e){} } setListening(false); }, []);
  const start = React.useCallback(() => {
    if (!SR) return false;
    try {
      const r = new SR();
      ref.current = r;
      r.lang = BCP47[langCode] || "en-GB";
      r.interimResults = true;
      r.continuous = false;
      r.onresult = (e) => {
        const txt = Array.from(e.results).map(x => x[0].transcript).join("");
        onResult(txt, e.results[e.results.length-1].isFinal);
      };
      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);
      r.start(); setListening(true); return true;
    } catch(e){ setListening(false); return false; }
  }, [langCode, onResult]);
  React.useEffect(() => stop, [stop]);
  return { listening, start, stop, supported: !!SR };
}

// ── Online / offline ─────────────────────────────────────────────────────────
function useOnline() {
  const [on, setOn] = React.useState(() => navigator.onLine !== false);
  React.useEffect(() => {
    const up = () => setOn(true), down = () => setOn(false);
    window.addEventListener("online", up); window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return on;
}

// ── Install prompt (PWA) ─────────────────────────────────────────────────────
let deferredPrompt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; INSTALL_SUBS.forEach(f => f()); });
}
const INSTALL_SUBS = new Set();
function useInstallPrompt() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => { INSTALL_SUBS.add(force); return () => INSTALL_SUBS.delete(force); }, []);
  return { available: !!deferredPrompt, prompt: async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice;
    deferredPrompt = null; INSTALL_SUBS.forEach(f => f());
  } };
}

// ── Media query hook (mobile layout) ─────────────────────────────────────────
function useMedia(q) {
  const [m, setM] = React.useState(() => typeof matchMedia !== "undefined" && matchMedia(q).matches);
  React.useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const mq = matchMedia(q); const h = () => setM(mq.matches); h();
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    // Some embedded/headless viewports resize without emitting a matchMedia
    // "change", so track resize as well — h() is idempotent.
    window.addEventListener("resize", h);
    window.addEventListener("orientationchange", h);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h);
      window.removeEventListener("resize", h);
      window.removeEventListener("orientationchange", h);
    };
  }, [q]);
  return m;
}

Object.assign(window, { KEYS, jget, jset, usePersistent, useRoute, buildHash, parseHash, VIEWS,
  newCard, schedule, loadCards, saveCards, dueCards, syncCards, todayKey, DAY,
  loadDays, bumpDay, useDays, streakOf, loadRuleStats, bumpRule, masteryOf,
  exportAll, importAll, downloadBackup, clearAllData,
  speak, stopSpeaking, stripMarkup, ttsOk, sttOk, useVoices, useDictation, BCP47,
  useOnline, useInstallPrompt, useMedia });
