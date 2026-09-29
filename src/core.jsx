// Dutch Grammar Studio v2 — core: themes, languages, roles, i18n, LLM providers, usage tracking
// One curated map per language. CLUSTERS / NODE_INDEX point at the active one
// and are swapped when the target language changes; every consumer reads them
// at render time, so reassigning the bindings is enough.
const GRAM_MAPS = {
  nl: [...window.GRAM_CLUSTERS_A, ...window.GRAM_CLUSTERS_B, ...window.GRAM_CLUSTERS_C, ...(window.GRAM_CLUSTERS_D || [])],
  en: window.GRAM_EN || [],
  hu: [...(window.GRAM_HU || []), ...(window.GRAM_HU2 || [])],
  de: [...(window.GRAM_DE || []), ...(window.GRAM_DE2 || [])],
  fi: [...(window.GRAM_FI || []), ...(window.GRAM_FI2 || [])]
};
let CLUSTERS = [];
let NODE_INDEX = {};
let ACTIVE_MAP = "";
function setActiveMap(code) {
  if (code === ACTIVE_MAP) return;
  ACTIVE_MAP = code;
  CLUSTERS = GRAM_MAPS[code] || [];
  NODE_INDEX = {};
  CLUSTERS.forEach(c => c.nodes.forEach(n => { NODE_INDEX[n.id] = { node: n, cluster: c }; }));
  window.CLUSTERS = CLUSTERS; window.NODE_INDEX = NODE_INDEX;
}
setActiveMap("nl");
const hasMapFor = (code) => !!(GRAM_MAPS[code] && GRAM_MAPS[code].length);

const LEVELS = ["A1","A2","B1","B2","C1"];
const LEVEL_COLOR = { A1:"#34d399", A2:"#84cc16", B1:"#f59e0b", B2:"#f43f5e", C1:"#38bdf8" };
const CEFR_ALL = ["A1","A2","A2+","B1","B1+","B2","C1","C2"];

// Target languages (flag + name). Dutch has full grammar-map data; others work in Lab + Lucy via LLM.
const TARGET_LANGS = [
  { code:"nl", flag:"🇳🇱", name:"Dutch",      native:"Nederlands", hasMap:true },
  { code:"en", flag:"🇬🇧", name:"English",    native:"English",    hasMap:true },
  { code:"hu", flag:"🇭🇺", name:"Hungarian",  native:"Magyar",     hasMap:true },
  { code:"de", flag:"🇩🇪", name:"German",     native:"Deutsch",    hasMap:true },
  { code:"fr", flag:"🇫🇷", name:"French",     native:"Français" },
  { code:"es", flag:"🇪🇸", name:"Spanish",    native:"Español" },
  { code:"it", flag:"🇮🇹", name:"Italian",    native:"Italiano" },
  { code:"pt", flag:"🇵🇹", name:"Portuguese", native:"Português" },
  { code:"sv", flag:"🇸🇪", name:"Swedish",    native:"Svenska" },
  { code:"da", flag:"🇩🇰", name:"Danish",     native:"Dansk" },
  { code:"no", flag:"🇳🇴", name:"Norwegian",  native:"Norsk" },
  { code:"pl", flag:"🇵🇱", name:"Polish",     native:"Polski" },
  { code:"cs", flag:"🇨🇿", name:"Czech",      native:"Čeština" },
  { code:"fi", flag:"🇫🇮", name:"Finnish",    native:"Suomi",      hasMap:true },
  { code:"el", flag:"🇬🇷", name:"Greek",      native:"Ελληνικά" },
  { code:"mk", flag:"🇲🇰", name:"Macedonian", native:"Македонски" },
  { code:"sr", flag:"🇷🇸", name:"Serbian",    native:"Српски" },
  { code:"ru", flag:"🇷🇺", name:"Russian",    native:"Русский" }
];
const EXPLAIN_LANGS = [
  { code:"en", flag:"🇬🇧", name:"English" }, { code:"hu", flag:"🇭🇺", name:"Hungarian" },
  { code:"de", flag:"🇩🇪", name:"German" }, { code:"fr", flag:"🇫🇷", name:"French" },
  { code:"es", flag:"🇪🇸", name:"Spanish" }, { code:"it", flag:"🇮🇹", name:"Italian" },
  { code:"pt", flag:"🇵🇹", name:"Portuguese" }, { code:"pl", flag:"🇵🇱", name:"Polish" },
  { code:"sv", flag:"🇸🇪", name:"Swedish" }, { code:"nl", flag:"🇳🇱", name:"Dutch" },
  { code:"mk", flag:"🇲🇰", name:"Macedonian" }, { code:"sr", flag:"🇷🇸", name:"Serbian" },
  { code:"ru", flag:"🇷🇺", name:"Russian" }
];
const langName = (code) => (EXPLAIN_LANGS.find(l=>l.code===code) || TARGET_LANGS.find(l=>l.code===code) || {name:code}).name;
// Two explanation languages are only used when a second one is chosen AND the
// learner has opted in; otherwise everything stays in the primary language.
const bilingual = (S) => !!(S.bilingual && S.secondary && S.secondary !== S.primary);
const secondLang = (S) => bilingual(S) ? S.secondary : "";

// The grammar map is a different case from Lucy. The "bilingual" switch governs
// whether Lucy WRITES every explanation twice — a choice about generated text.
// The map is pre-written reference material, so if you named a second language
// under "explain in", you want to read the map in it. Gating the map on the
// bilingual opt-in meant a second language could be selected and then appear
// nowhere at all, with Settings offering no way to fix it.
const mapLangs = (S) => [S.primary, S.secondary]
  .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
const mapSecond = (S) => (S.secondary && S.secondary !== S.primary) ? S.secondary : "";

// Word roles: color + NL grammatical term + meanings. NO purple/violet anywhere.
const ROLES = {
  s:    { nl:"onderwerp", en:"subject", hu:"alany", de:"Subjekt", fr:"sujet", es:"sujeto", it:"soggetto",
          pt:"sujeito", pl:"podmiot", sv:"subjekt", mk:"подмет", sr:"субјекат", ru:"подлежащее", color:"#60a5fa" },
  vfin: { nl:"persoonsvorm", en:"finite verb", hu:"ragozott ige", de:"finites Verb", fr:"verbe conjugué",
          es:"verbo conjugado", it:"verbo coniugato", pt:"verbo conjugado", pl:"orzeczenie", sv:"finit verb",
          mk:"главен глагол", sr:"лични глаголски облик", ru:"сказуемое", color:"#ef4444" },
  vinf: { nl:"infinitief / deelwoord", en:"non-finite verb", hu:"nem ragozott ige", de:"Infinitiv / Partizip",
          fr:"infinitif / participe", es:"infinitivo / participio", it:"infinito / participio",
          pt:"infinitivo / particípio", pl:"bezokolicznik / imiesłów", sv:"infinitiv / particip",
          mk:"инфинитив / партицип", sr:"инфинитив / партицип", ru:"инфинитив / причастие", color:"#f97316" },
  v:    { nl:"werkwoord", en:"verb", hu:"ige", de:"Verb", fr:"verbe", es:"verbo", it:"verbo", pt:"verbo",
          pl:"czasownik", sv:"verb", mk:"глагол", sr:"глагол", ru:"глагол", color:"#ef4444" },
  o:    { nl:"lijdend voorwerp", en:"direct object", hu:"tárgy", de:"Akkusativobjekt", fr:"COD",
          es:"objeto directo", it:"complemento oggetto", pt:"objeto direto", pl:"dopełnienie bliższe",
          sv:"direkt objekt", mk:"директен објект", sr:"прави објекат", ru:"прямое дополнение", color:"#22c55e" },
  io:   { nl:"meewerkend voorwerp", en:"indirect obj.", hu:"részeshatározó", de:"Dativobjekt", fr:"COI",
          es:"objeto indirecto", it:"compl. di termine", pt:"objeto indireto", pl:"dopełnienie dalsze",
          sv:"indirekt objekt", mk:"индиректен објект", sr:"индиректни објекат", ru:"косвенное дополнение", color:"#14b8a6" },
  prep: { nl:"voorzetsel", en:"preposition", hu:"elöljáró", de:"Präposition", fr:"préposition",
          es:"preposición", it:"preposizione", pt:"preposição", pl:"przyimek", sv:"preposition",
          mk:"предлог", sr:"предлог", ru:"предлог", color:"#eab308" },
  neg:  { nl:"ontkenning", en:"negation", hu:"tagadás", de:"Negation", fr:"négation", es:"negación",
          it:"negazione", pt:"negação", pl:"przeczenie", sv:"negation", mk:"негација", sr:"негација", ru:"отрицание", color:"#ec4899" },
  conn: { nl:"voegwoord", en:"conjunction", hu:"kötőszó", de:"Konjunktion", fr:"conjonction",
          es:"conjunción", it:"congiunzione", pt:"conjunção", pl:"spójnik", sv:"konjunktion",
          mk:"сврзник", sr:"везник", ru:"союз", color:"#06b6d4" },
  adv:  { nl:"bepaling (tijd/plaats)", en:"adverbial", hu:"határozó", de:"adverbiale Bestimmung",
          fr:"complément circonstanciel", es:"complemento circunstancial", it:"complemento avverbiale",
          pt:"adjunto adverbial", pl:"okolicznik", sv:"adverbial", mk:"прилошка определба",
          sr:"прилошка одредба", ru:"обстоятельство", color:"#fde047" },
  refl: { nl:"wederkerend vnw.", en:"reflexive", hu:"visszaható", de:"Reflexivpronomen", fr:"pronom réfléchi",
          es:"pronombre reflexivo", it:"pronome riflessivo", pt:"pronome reflexo", pl:"zaimek zwrotny",
          sv:"reflexivt pronomen", mk:"повратна заменка", sr:"повратна заменица", ru:"возвратное местоимение", color:"#fda4af" },
  part: { nl:"partikel / te", en:"particle", hu:"igekötő / te", de:"Partikel", fr:"particule",
          es:"partícula", it:"particella", pt:"partícula", pl:"partykuła", sv:"partikel",
          mk:"честичка", sr:"речца", ru:"частица", color:"#fb7185" },
  art:  { nl:"lidwoord", en:"article", hu:"névelő", de:"Artikel", fr:"article", es:"artículo",
          it:"articolo", pt:"artigo", pl:"przedimek", sv:"artikel", mk:"член", sr:"члан", ru:"артикль", color:"#94a3b8" },
  q:    { nl:"vraagwoord", en:"question word", hu:"kérdőszó", de:"Fragewort", fr:"mot interrogatif",
          es:"palabra interrogativa", it:"parola interrogativa", pt:"palavra interrogativa",
          pl:"zaimek pytający", sv:"frågeord", mk:"прашален збор", sr:"упитна реч", ru:"вопросительное слово", color:"#f59e0b" },
  pron: { nl:"voornaamwoord", en:"pronoun", hu:"névmás", de:"Pronomen", fr:"pronom", es:"pronombre",
          it:"pronome", pt:"pronome", pl:"zaimek", sv:"pronomen", mk:"заменка", sr:"заменица", ru:"местоимение", color:"#7dd3fc" },
  adj:  { nl:"bijvoeglijk nw.", en:"adjective", hu:"melléknév", de:"Adjektiv", fr:"adjectif",
          es:"adjetivo", it:"aggettivo", pt:"adjetivo", pl:"przymiotnik", sv:"adjektiv",
          mk:"придавка", sr:"придев", ru:"прилагательное", color:"#a3e635" },
  x:    { nl:"", en:"", hu:"", color:"" }
};
const roleMeaning = (r, code) => r[code] || r.en;
// "subject · alany" — the role in both configured explanation languages.
function roleLabel(role, S) {
  const r = ROLES[role] || ROLES.x;
  if (!r.color) return "";
  const a = roleMeaning(r, S.primary);
  const b = secondLang(S) ? roleMeaning(r, secondLang(S)) : "";
  return b && b !== a ? a + " · " + b : a;
}

const CLUSTER_HUES = { amber:"#f59e0b", indigo:"#38bdf8", teal:"#2dd4bf", rose:"#fb7185" };

// ── Themes (no purple) ──
const THEMES = {
  night: { name:"Night", dark:true,  bg:"#020617", bgGrad:"radial-gradient(1100px 480px at 50% -100px, #0c4a6e33, transparent)",
    panel:"#0f172a", panel2:"#0b1120", chip:"#1e293b", border:"#1e293b", text:"#f1f5f9", mute:"#94a3b8", faint:"#64748b",
    accent:"#0ea5e9", accentText:"#ffffff", good:"#4ade80", goodBg:"#052e1a", goodBd:"#14532d", bad:"#f87171", badBg:"#3b0a12", badBd:"#7f1d1d",
    whyBg:"#082f49", whyBd:"#0369a166", whyTitle:"#7dd3fc", whyText:"#bae6fd" },
  day: { name:"Day", dark:false, bg:"#f5f7fa", bgGrad:"radial-gradient(1100px 480px at 50% -100px, #bae6fd44, transparent)",
    panel:"#ffffff", panel2:"#eef2f7", chip:"#e2e8f0", border:"#d7dee8", text:"#0f172a", mute:"#475569", faint:"#64748b",
    accent:"#0284c7", accentText:"#ffffff", good:"#15803d", goodBg:"#f0fdf4", goodBd:"#bbf7d0", bad:"#b91c1c", badBg:"#fef2f2", badBd:"#fecaca",
    whyBg:"#f0f9ff", whyBd:"#bae6fd", whyTitle:"#0369a1", whyText:"#075985" },
  paper: { name:"Paper", dark:false, bg:"#f6f1e7", bgGrad:"none",
    panel:"#fffdf7", panel2:"#efe8d8", chip:"#e8e0cd", border:"#ddd3bc", text:"#292018", mute:"#6b5d4b", faint:"#8a7a63",
    accent:"#b45309", accentText:"#ffffff", good:"#3f6212", goodBg:"#f7fee7", goodBd:"#d9f99d", bad:"#9f1239", badBg:"#fff1f2", badBd:"#fecdd3",
    whyBg:"#fef3c7", whyBd:"#fde68a", whyTitle:"#92400e", whyText:"#78350f" },
  deep: { name:"Deep Sea", dark:true, bg:"#04211f", bgGrad:"radial-gradient(1100px 480px at 50% -100px, #0f766e33, transparent)",
    panel:"#062e2b", panel2:"#041d1b", chip:"#0d4340", border:"#134e4a", text:"#ecfdf5", mute:"#8dd6c6", faint:"#5eaa9a",
    accent:"#14b8a6", accentText:"#022c26", good:"#4ade80", goodBg:"#052e1a", goodBd:"#14532d", bad:"#fb7185", badBg:"#3b0a12", badBd:"#7f1d1d",
    whyBg:"#042f2e", whyBd:"#0f766e", whyTitle:"#5eead4", whyText:"#99f6e4" }
};
const ThemeCtx = React.createContext(THEMES.night);

// ── Settings + LLM providers ──
const DEFAULT_SETTINGS = {
  theme:"night", target:"nl", primary:"en", secondary:"", // secondary explanation lang ("" = off)
  bilingual:false,                             // explain in BOTH languages, not just the primary
  level:"A2", targetLevel:"B2", showRoles:true,
  provider:"builtin", model:"claude-sonnet-4-5", orTier:"free",
  anthropicKey:"", openaiKey:"", openrouterKey:"", localUrl:"http://localhost:11434/v1", localModel:"",
  azureKey:"", azureEndpoint:"", azureDeployment:"", azureApiVersion:"2024-10-21",  // replaced by discovery
  lucy:{ name:"", style:"direct", tense:"any" },
  // ── added in v3 ──
  speak:{ auto:false, rate:0.9, voice:"" },   // text-to-speech
  dailyGoal:20,                                // SRS cards/day
  reduceMotion:false,
  uiLang:"",                                   // interface language ("" = follow the primary explanation language)
  profiles:{},                                 // per-provider model/endpoint memory
  lucyWide:false,                              // Lucy chat uses the full window width
  readerProxy:"https://r.jina.ai/",            // used to fetch article text past CORS
  systemExtra:"",                              // appended to every system prompt
  debug:false,                                 // show timing / tokens / tok-per-sec
  // Voice mode is configured separately from the text provider: the two are
  // different services, and only some vendors offer a realtime speech API.
  voice:{
    engine:"browser",                          // browser | azure | openai
    sameAsText:true,                           // reuse the text provider's credentials where they fit
    azureEndpoint:"", azureKey:"", azureApiVersion:"2025-05-01-preview",
    model:"gpt-realtime", voiceName:"",
    openaiKey:"",
    vadThreshold:0.5, vadPrefixMs:300, vadSilenceMs:500,
    echoCancel:true, noiseReduction:true,
    transcribeModel:"whisper-1", speechRegion:"",
    focus:"flow",                              // flow | grammar | intonation
    correctVia:"screen",                       // screen | spoken (hands-free)
    ttsScope:"voice",                          // voice | everywhere
    style:"tutor",                             // how chatty Lucy is out loud
    rate:0.95,
    instructionsExtra:"",
    sessionJson:""                             // raw session.update override
  }
};
const DONATE_URL = "https://buymeacoffee.com/gaborkalmar";

function loadSettings(){
  try {
    const saved = JSON.parse(localStorage.getItem("dgs2")||"{}");
    // API keys live in the encrypted vault, not in this blob — put them back.
    return Vault.inject({ ...DEFAULT_SETTINGS, ...saved,
      lucy:{ ...DEFAULT_SETTINGS.lucy, ...(saved.lucy||{}) },
      speak:{ ...DEFAULT_SETTINGS.speak, ...(saved.speak||{}) },
      profiles:{ ...(saved.profiles||{}) },
      voice:{ ...DEFAULT_SETTINGS.voice, ...(saved.voice||{}) } });
  } catch(e){ return { ...DEFAULT_SETTINGS }; }
}
function saveSettings(s){
  try { localStorage.setItem("dgs2", JSON.stringify(Vault.absorb(stampProfile(s)))); } catch(e){}
}

// ── Per-provider profiles ───────────────────────────────────────────────────
// Model, endpoint and deployment are provider-specific but were stored in one
// shared slot, so moving OpenAI → Azure → back left the OpenAI model behind.
// Each provider now keeps its own settings, restored on the way back. Keys are
// already per-provider fields and live in the vault; only the rest is here.
const PROFILE_FIELDS = {
  builtin:    ["model"],
  anthropic:  ["model"],
  openai:     ["model"],
  openrouter: ["model", "orTier"],
  azure:      ["model", "azureEndpoint", "azureDeployment", "azureApiVersion"],
  local:      ["model", "localUrl", "localModel"]
};
const profileFields = (id) => PROFILE_FIELDS[id] || ["model"];

// Called on every save, so the active provider's profile is always current
// without any explicit "remember this" step.
function stampProfile(s){
  const profiles = { ...(s.profiles || {}) };
  const cur = {};
  profileFields(s.provider).forEach(f => { cur[f] = s[f]; });
  profiles[s.provider] = cur;
  return { ...s, profiles };
}
// Switching provider: stash what is on screen, then restore that provider's own
// last-used configuration.
function switchProvider(S, id){
  const stamped = stampProfile(S);
  const saved = stamped.profiles[id];
  const next = { ...stamped, provider:id };
  if (saved) profileFields(id).forEach(f => { if (saved[f] !== undefined) next[f] = saved[f]; });
  else { const p = PROVIDERS.find(x => x.id === id); next.model = (p && p.models[0]) || S.model; }
  return next;
}

const PROVIDERS = [
  { id:"builtin",    name:"Built-in Claude (no key)", models:["claude-sonnet-4-5","claude-haiku-4-5"] },
  { id:"anthropic",  name:"Anthropic API",  models:["claude-sonnet-4-5","claude-haiku-4-5","claude-opus-4-1"] },
  { id:"openai",     name:"OpenAI API",     models:["gpt-4o","gpt-4o-mini","gpt-4.1","gpt-4.1-mini"] },
  { id:"openrouter", name:"OpenRouter",     models:["meta-llama/llama-3.3-70b-instruct:free","google/gemini-2.0-flash-exp:free","mistralai/mistral-small-3.1-24b-instruct:free","anthropic/claude-sonnet-4.5"] },
  { id:"azure",      name:"Azure AI Foundry / Azure OpenAI", models:[] },
  { id:"local",      name:"Local LLM (OpenAI-compatible)", models:[] }
];

// Azure endpoints get pasted in every shape going ("…azure.com", with a trailing
// slash, or already including /openai). Normalise to the bare resource origin.
function azureBase(endpoint) {
  return String(endpoint || "").trim().replace(/\/+$/, "").replace(/\/openai(\/v1)?$/, "");
}
// Azure's data-plane deployment list — the same key that runs completions can
// read it, so "add key → see your models" works without ARM credentials.
async function fetchAzureDeployments(endpoint, key) {
  const base = azureBase(endpoint);
  if (!base) throw new Error("Set the endpoint URL first");
  if (!key) throw new Error("Set the API key first");
  const res = await fetch(base + "/openai/deployments?api-version=2023-03-15-preview",
    { headers: { "api-key": key } });
  if (!res.ok) throw new Error("Azure " + res.status + ": " + (await res.text()).slice(0,160));
  const j = await res.json();
  return (j.data || []).map(d => ({ id: d.id || d.name, model: (d.model || d.id || "") }))
    .filter(d => d.id).sort((a,b) => a.id.localeCompare(b.id));
}

// ── Model discovery, per provider ───────────────────────────────────────────
// Every provider here exposes a list endpoint the same key can read, so nothing
// has to be typed from memory.
async function fetchProviderModels(S) {
  const getJson = async (url, headers) => {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(res.status + ": " + (await res.text()).slice(0, 160));
    return res.json();
  };
  switch (S.provider) {
    case "openai": {
      if (!S.openaiKey) throw new Error("Set the API key first");
      const d = await getJson("https://api.openai.com/v1/models", { authorization: "Bearer " + S.openaiKey });
      return (d.data || []).map(m => m.id)
        .filter(id => /^(gpt|o[134]|chatgpt)/.test(id) && !/audio|realtime|transcribe|tts|embed|moderation|image|dall/.test(id))
        .sort();
    }
    case "anthropic": {
      if (!S.anthropicKey) throw new Error("Set the API key first");
      const d = await getJson("https://api.anthropic.com/v1/models?limit=100", {
        "x-api-key": S.anthropicKey, "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true" });
      return (d.data || []).map(m => m.id);
    }
    case "local": {
      const base = (S.localUrl || "").replace(/\/$/, "");
      if (!base) throw new Error("Set the base URL first");
      const d = await getJson(base + "/models", {});
      return (d.data || []).map(m => m.id).sort();
    }
    case "azure": {
      const list = await fetchAzureDeployments(S.azureEndpoint, S.azureKey);
      return list.map(d => d.id);
    }
    case "openrouter": {
      const list = await fetchORModels();
      return list.map(m => m.id);
    }
    default: throw new Error("This provider has no model list");
  }
}

// A real round trip, so "it works" is proved rather than assumed.
async function testProvider(S) {
  const t0 = performance.now();
  const { text } = await llmCall(S, { maxTokens: 32, task: "test",
    system: "Reply with exactly: OK",
    messages: [{ role: "user", content: "Say OK" }] });
  return { ok: true, ms: Math.round(performance.now() - t0), reply: (text || "").trim().slice(0, 60) };
}

// Fetch the live OpenRouter catalogue (public, no key needed) → normalized list with a size/price tier
async function fetchORModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models");
  if (!res.ok) throw new Error("OpenRouter " + res.status);
  const j = await res.json();
  return (j.data || []).map(m => {
    const inP = parseFloat(m.pricing && m.pricing.prompt || "0") * 1e6;  // $ per 1M input tokens
    const outP = parseFloat(m.pricing && m.pricing.completion || "0") * 1e6;
    const free = inP === 0 && outP === 0;
    let tier;
    if (free) tier = "free";
    else if (inP < 0.5) tier = "small";
    else if (inP < 4) tier = "medium";
    else tier = "large";
    return { id: m.id, name: m.name || m.id, ctx: m.context_length || 0, inP, outP, free, tier };
  }).sort((a,b) => a.inP - b.inP || a.name.localeCompare(b.name));
}
const OR_TIERS = [["free","Free"],["small","Small ¢"],["medium","Medium $"],["large","Large $$$"]];

// The catalogue is cached so the model dropdown is correct on the very first
// render after a reload. Without it the list is empty until you press "Load
// models", and a saved model that isn't in the small fallback list makes the
// <select> fall back to showing its first option — i.e. silently displaying a
// different model from the one actually saved.
const OR_CACHE_KEY = "lm3:orModels";
function loadORCache() {
  try {
    const c = JSON.parse(localStorage.getItem(OR_CACHE_KEY) || "null");
    return c && Array.isArray(c.list) ? c : null;
  } catch(e){ return null; }
}
function saveORCache(list) {
  try { localStorage.setItem(OR_CACHE_KEY, JSON.stringify({ ts:Date.now(), list })); } catch(e){}
}
const USAGE = { in:0, out:0, calls:0, last:"", lastMs:0, lastTps:0, lastIn:0, lastOut:0, subs:new Set() };
const estTok = (s) => Math.ceil((s||"").length/4);

// Every call is appended to a rolling on-device log so Progress can break usage
// down by provider and model over the last day / week / month.
const USAGE_LOG_KEY = "lm3:usageLog";
function loadUsageLog() {
  try { const l = JSON.parse(localStorage.getItem(USAGE_LOG_KEY) || "[]"); return Array.isArray(l) ? l : []; }
  catch(e){ return []; }
}
function logUsage(entry) {
  try {
    const cutoff = Date.now() - 90 * 86400000;                 // keep 90 days, cap the size
    const kept = loadUsageLog().filter(e => e.ts > cutoff).slice(-5000);
    kept.push(entry);
    localStorage.setItem(USAGE_LOG_KEY, JSON.stringify(kept));
  } catch(e){}
}
function bumpUsage(inTok, outTok, label, meta) {
  USAGE.in += inTok; USAGE.out += outTok; USAGE.calls++; USAGE.last = label;
  USAGE.lastIn = inTok; USAGE.lastOut = outTok;
  USAGE.lastMs = (meta && meta.ms) || 0;
  USAGE.lastTps = USAGE.lastMs > 0 ? outTok / (USAGE.lastMs / 1000) : 0;
  logUsage({ ts: Date.now(), provider: (meta && meta.provider) || "", model: (meta && meta.model) || label,
    in: inTok, out: outTok, ms: USAGE.lastMs, task: (meta && meta.task) || "" });
  USAGE.subs.forEach(f => f());
}
function useUsage(){ const [,f] = React.useReducer(x=>x+1,0);
  React.useEffect(() => { USAGE.subs.add(f); return () => USAGE.subs.delete(f); }, []); return USAGE; }

// The zero-config "built-in Claude" provider only exists inside the Claude
// artifact host. On GitHub Pages or a file:// copy it is absent, so the app has
// to say so plainly instead of throwing "cannot read properties of undefined".
const builtinAvailable = () => typeof window.claude === "object" && window.claude !== null && typeof window.claude.complete === "function";

// Is the selected provider actually usable right now?
function providerReady(S) {
  switch (S.provider) {
    case "builtin":    return builtinAvailable();
    case "anthropic":  return !!S.anthropicKey;
    case "openai":     return !!S.openaiKey;
    case "openrouter": return !!S.openrouterKey;
    case "azure":      return !!(S.azureKey && S.azureEndpoint && S.azureDeployment);
    case "local":      return !!S.localUrl;
    default:           return false;
  }
}

// JSON Schema helpers for structured replies. Every object is closed and every
// listed property required, which is what the Anthropic API's structured outputs expect.
const STR = { type:"string" };
const TOKENS = { type:"array", items:{ type:"array", items:STR } };
const jsonObject = (properties) => ({ type:"object", additionalProperties:false, properties, required:Object.keys(properties) });
// Models that rejected `output_config.format` this session; they get the plain prompt from then on.
const NO_SCHEMA = new Set();

// unified LLM call → { text }
// `schema` (optional JSON Schema): on the direct Anthropic API the reply is constrained to it
// with structured outputs. Other providers keep the prompt's JSON instruction and the caller's parser.
async function llmCall(S, { system, messages, maxTokens=2000, task="", schema=null }) {
  const modelName = S.provider==="local" ? (S.localModel||"local")
    : S.provider==="azure" ? (S.azureDeployment||"azure") : S.model;
  const label = S.provider + " · " + modelName;
  // A user-supplied prompt is appended, never substituted, so the app's own
  // output contract (JSON shapes, correction format) cannot be broken by it.
  if (S.systemExtra && S.systemExtra.trim()) {
    system = system + "\n\nADDITIONAL INSTRUCTIONS FROM THE LEARNER (follow these too, but never at the expense of the output format required above):\n" + S.systemExtra.trim();
  }
  const meta = { provider:S.provider, model:modelName, task };
  const t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
  const took = () => Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);
  const inEst = estTok(system) + estTok(messages.map(m=>m.content).join(" "));
  if (S.provider === "builtin") {
    if (!builtinAvailable()) throw new Error(UI.builtinMissing);
    const text = await window.claude.complete({ model:S.model, max_tokens:maxTokens, system, messages });
    bumpUsage(inEst, estTok(text), label, { ...meta, ms:took() });
    return { text };
  }
  let url, headers, body, extract, usageOf;
  if (S.provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = { "content-type":"application/json", "x-api-key":S.anthropicKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" };
    body = { model:S.model, max_tokens:maxTokens, system, messages,
      ...(schema && !NO_SCHEMA.has(S.model) ? { output_config: { format: { type:"json_schema", schema } } } : {}) };
    extract = j => j.content.map(b=>b.text||"").join("");
    usageOf = j => j.usage ? [j.usage.input_tokens, j.usage.output_tokens] : null;
  } else if (S.provider === "azure") {
    // The deployment name is part of the path and the key rides in `api-key`,
    // not an Authorization header — otherwise it is the OpenAI wire format.
    url = azureBase(S.azureEndpoint) + "/openai/deployments/" + encodeURIComponent(S.azureDeployment)
        + "/chat/completions?api-version=" + encodeURIComponent(S.azureApiVersion || "2024-10-21");
    headers = { "content-type":"application/json", "api-key":S.azureKey };
    body = { max_tokens:maxTokens, messages: [{ role:"system", content:system }, ...messages] };
    extract = j => j.choices[0].message.content;
    usageOf = j => j.usage ? [j.usage.prompt_tokens, j.usage.completion_tokens] : null;
  } else {
    url = S.provider==="openai" ? "https://api.openai.com/v1/chat/completions"
        : S.provider==="openrouter" ? "https://openrouter.ai/api/v1/chat/completions"
        : (S.localUrl.replace(/\/$/,"") + "/chat/completions");
    const key = S.provider==="openai" ? S.openaiKey : S.provider==="openrouter" ? S.openrouterKey : "";
    headers = { "content-type":"application/json", ...(key ? { authorization:"Bearer "+key } : {}) };
    body = { model: S.provider==="local" ? (S.localModel||"default") : S.model, max_tokens:maxTokens,
      messages: [{ role:"system", content:system }, ...messages] };
    extract = j => j.choices[0].message.content;
    usageOf = j => j.usage ? [j.usage.prompt_tokens, j.usage.completion_tokens] : null;
  }
  let res = await fetch(url, { method:"POST", headers, body: JSON.stringify(body) });
  if (!res.ok && res.status === 400 && body.output_config) {
    // Older models don't take structured outputs: remember that, and resend with the prompt alone.
    const err = await res.text();
    if (!/output_config|format|schema/i.test(err)) throw new Error("API 400: " + err.slice(0,200));
    NO_SCHEMA.add(S.model);
    delete body.output_config;
    res = await fetch(url, { method:"POST", headers, body: JSON.stringify(body) });
  }
  if (!res.ok) throw new Error("API " + res.status + ": " + (await res.text()).slice(0,200));
  const j = await res.json();
  const text = extract(j);
  const u = usageOf(j);
  bumpUsage(u ? u[0] : inEst, u ? u[1] : estTok(text), label, { ...meta, ms:took() });
  return { text };
}

// ── UI strings — interface chrome localizes to the primary explanation language ──
const LUCY_BTN_KEYS = ["explainLast","example","flip","simpler","harder","annotate","deepDive","conj","timelines","nearby","verbday","roleplay","cloze","vocab","newTopic","recap"];
const UI_STRINGS = {
  en: {
    map:"Grammar Map", lab:"Sentence Lab", lucy:"Lucy", search:"Search rules, examples…", all:"all",
    examples:"Examples", exceptions:"Exceptions & pitfalls", why:"Why this rule exists", related:"Related",
    analyzeTitle:"Sentence Lab", analyzeHint:"Type a sentence in your target language (or an attempt). The model checks which rules apply — green = correct, red = violated.",
    analyzeBtn:"Analyze", analyzing:"Analyzing…", correct:"APPLIED CORRECTLY", wrong:"VIOLATED / MISSING",
    verdict:"VERDICT", corrected:"Corrected", tryEx:"Try:", errFail:"Analysis failed — check provider settings and try again.",
    exception:"EXCEPTION", settings:"Settings", provider:"Provider", modelLbl:"Model", apiKey:"API key", baseUrl:"Base URL",
    theme:"Theme", close:"Close", learning:"Learning", explainIn:"Explain in", secondary:"Secondary", none:"none",
    mapOnlyNl:"There is no curated grammar map for this language yet. Use the Sentence Lab and Lucy instead — more maps are on the roadmap.",
    tokens:"tokens", roles:"Word roles", send:"Send", lucyPlaceholder:"Write in your target language (or your own)…",
    level:"Level", targetLevel:"Goal", style:"Style", tenseFocus:"Tense", name:"Name",
    rolesOn:"Roles on", rolesOff:"Roles off", saveSession:"Save session", reset:"Reset", startSession:"Start session",
    target:"Target language", noLlm:"no LLM calls yet", keyNote:"Keys are stored only in your browser (localStorage). Built-in Claude needs no key but only works in the hosted app. Custom providers call directly from your browser.",
    lucyIntro:"Lucy is your conversational tutor — corrections with rules, conjugations, tense comparisons, recaps. Just start typing.",
    lucyBtns:{ explainLast:"🔍 Explain last", example:"💡 Example", flip:"🔄 Ask me", simpler:"🐢 Simpler", harder:"🔥 Harder",
      annotate:"🎨 Annotate", deepDive:"📚 Deep dive", conj:"📊 Conjugate", timelines:"🕰️ Timelines", nearby:"↔️ Nearby tenses",
      verbday:"⭐ Verb of the day", roleplay:"🎭 Roleplay", cloze:"✏️ Fill the gaps", vocab:"🗂️ Vocab tip", newTopic:"🆕 New topic", recap:"📋 Recap" }
  },
  hu: {
    map:"Nyelvtani térkép", lab:"Mondatlabor", lucy:"Lucy", search:"Keresés szabályok, példák közt…", all:"mind",
    examples:"Példák", exceptions:"Kivételek és buktatók", why:"Miért létezik ez a szabály", related:"Kapcsolódó",
    analyzeTitle:"Mondatlabor", analyzeHint:"Írj be egy mondatot a célnyelveden (vagy egy próbálkozást). A modell megmutatja, mely szabályok érvényesülnek — zöld = helyes, piros = hibás.",
    analyzeBtn:"Elemzés", analyzing:"Elemzés…", correct:"HELYESEN ALKALMAZVA", wrong:"MEGSÉRTVE / HIÁNYZIK",
    verdict:"ÍTÉLET", corrected:"Javítva", tryEx:"Próbáld:", errFail:"Az elemzés nem sikerült — ellenőrizd a szolgáltató beállításait, és próbáld újra.",
    exception:"KIVÉTEL", settings:"Beállítások", provider:"Szolgáltató", modelLbl:"Modell", apiKey:"API kulcs", baseUrl:"Alap URL",
    theme:"Téma", close:"Bezár", learning:"Tanulás", explainIn:"Magyarázat nyelve", secondary:"Másodlagos", none:"nincs",
    mapOnlyNl:"Ehhez a nyelvhez még nincs szerkesztett nyelvtani térkép. Használd addig a Mondatlabort és Lucyt — további térképek készülnek.",
    tokens:"token", roles:"Szófaji szerepek", send:"Küldés", lucyPlaceholder:"Írj a célnyelveden (vagy a sajátodon)…",
    level:"Szint", targetLevel:"Cél", style:"Stílus", tenseFocus:"Igeidő", name:"Név",
    rolesOn:"Szerepek be", rolesOff:"Szerepek ki", saveSession:"Munkamenet mentése", reset:"Alaphelyzet", startSession:"Munkamenet indítása",
    target:"Célnyelv", noLlm:"még nincs LLM-hívás", keyNote:"A kulcsok csak a böngésződben tárolódnak (localStorage). A beépített Claude nem igényel kulcsot, de csak a hosztolt appban működik. Az egyéni szolgáltatók közvetlenül a böngésződből hívódnak.",
    lucyIntro:"Lucy a beszélgetős tanárod — javítások szabályokkal, ragozások, igeidő-összevetések, összefoglalók. Csak kezdj el írni.",
    lucyBtns:{ explainLast:"🔍 Utolsó elemzése", example:"💡 Példa", flip:"🔄 Kérdezz", simpler:"🐢 Egyszerűbben", harder:"🔥 Nehezebben",
      annotate:"🎨 Jelölés", deepDive:"📚 Mélymerülés", conj:"📊 Ragozás", timelines:"🕰️ Idősíkok", nearby:"↔️ Közeli igeidők",
      verbday:"⭐ A nap igéje", roleplay:"🎭 Szerepjáték", cloze:"✏️ Hiányzó szavak", vocab:"🗂️ Szótipp", newTopic:"🆕 Új téma", recap:"📋 Összefoglaló" }
  },
  de: {
    map:"Grammatikkarte", lab:"Satzlabor", lucy:"Lucy", search:"Regeln, Beispiele suchen…", all:"alle",
    examples:"Beispiele", exceptions:"Ausnahmen & Fallstricke", why:"Warum diese Regel existiert", related:"Verwandt",
    analyzeTitle:"Satzlabor", analyzeHint:"Gib einen Satz in deiner Zielsprache ein (oder einen Versuch). Das Modell prüft, welche Regeln gelten — grün = richtig, rot = verletzt.",
    analyzeBtn:"Analysieren", analyzing:"Analysiere…", correct:"RICHTIG ANGEWENDET", wrong:"VERLETZT / FEHLT",
    verdict:"URTEIL", corrected:"Korrigiert", tryEx:"Versuch:", errFail:"Analyse fehlgeschlagen — prüfe die Anbietereinstellungen und versuche es erneut.",
    exception:"AUSNAHME", settings:"Einstellungen", provider:"Anbieter", modelLbl:"Modell", apiKey:"API-Schlüssel", baseUrl:"Basis-URL",
    theme:"Design", close:"Schließen", learning:"Lernen", explainIn:"Erklären auf", secondary:"Zweitsprache", none:"keine",
    mapOnlyNl:"Für diese Sprache gibt es noch keine kuratierte Grammatikkarte. Nutze so lange das Satzlabor und Lucy — weitere Karten sind geplant.",
    tokens:"Tokens", roles:"Wortrollen", send:"Senden", lucyPlaceholder:"Schreibe in deiner Zielsprache (oder deiner eigenen)…",
    level:"Niveau", targetLevel:"Ziel", style:"Stil", tenseFocus:"Zeitform", name:"Name",
    rolesOn:"Rollen an", rolesOff:"Rollen aus", saveSession:"Sitzung speichern", reset:"Zurücksetzen", startSession:"Sitzung starten",
    target:"Zielsprache", noLlm:"noch keine LLM-Aufrufe", keyNote:"Schlüssel werden nur in deinem Browser gespeichert (localStorage). Built-in Claude braucht keinen Schlüssel, funktioniert aber nur in der gehosteten App.",
    lucyIntro:"Lucy ist deine Gesprächstutorin — Korrekturen mit Regeln, Konjugationen, Zeitvergleiche, Zusammenfassungen. Fang einfach an zu tippen.",
    lucyBtns:{ explainLast:"🔍 Letztes erklären", example:"💡 Beispiel", flip:"🔄 Frag mich", simpler:"🐢 Einfacher", harder:"🔥 Schwerer",
      annotate:"🎨 Markieren", deepDive:"📚 Vertiefen", conj:"📊 Konjugieren", timelines:"🕰️ Zeitachsen", nearby:"↔️ Nahe Zeiten",
      verbday:"⭐ Verb des Tages", roleplay:"🎭 Rollenspiel", cloze:"✏️ Lücken füllen", vocab:"🗂️ Vokabeltipp", newTopic:"🆕 Neues Thema", recap:"📋 Rückblick" }
  },
  fr: {
    map:"Carte grammaticale", lab:"Labo de phrases", lucy:"Lucy", search:"Rechercher règles, exemples…", all:"tout",
    examples:"Exemples", exceptions:"Exceptions & pièges", why:"Pourquoi cette règle existe", related:"Liés",
    analyzeTitle:"Labo de phrases", analyzeHint:"Écris une phrase dans ta langue cible (ou un essai). Le modèle vérifie quelles règles s'appliquent — vert = correct, rouge = enfreint.",
    analyzeBtn:"Analyser", analyzing:"Analyse…", correct:"CORRECTEMENT APPLIQUÉ", wrong:"ENFREINT / MANQUANT",
    verdict:"VERDICT", corrected:"Corrigé", tryEx:"Essaie :", errFail:"Échec de l'analyse — vérifie les réglages du fournisseur et réessaie.",
    exception:"EXCEPTION", settings:"Réglages", provider:"Fournisseur", modelLbl:"Modèle", apiKey:"Clé API", baseUrl:"URL de base",
    theme:"Thème", close:"Fermer", learning:"Apprentissage", explainIn:"Expliquer en", secondary:"Secondaire", none:"aucune",
    mapOnlyNl:"Il n'y a pas encore de carte grammaticale pour cette langue. Utilise le Labo de phrases et Lucy en attendant — d'autres cartes sont prévues.",
    tokens:"tokens", roles:"Rôles des mots", send:"Envoyer", lucyPlaceholder:"Écris dans ta langue cible (ou la tienne)…",
    level:"Niveau", targetLevel:"Objectif", style:"Style", tenseFocus:"Temps", name:"Nom",
    rolesOn:"Rôles activés", rolesOff:"Rôles désactivés", saveSession:"Enregistrer la session", reset:"Réinitialiser", startSession:"Démarrer la session",
    target:"Langue cible", noLlm:"aucun appel LLM", keyNote:"Les clés sont stockées uniquement dans ton navigateur (localStorage). Claude intégré ne nécessite pas de clé mais ne marche que dans l'app hébergée.",
    lucyIntro:"Lucy est ta tutrice conversationnelle — corrections avec règles, conjugaisons, comparaisons de temps, récapitulatifs. Commence à écrire.",
    lucyBtns:{ explainLast:"🔍 Expliquer", example:"💡 Exemple", flip:"🔄 Interroge-moi", simpler:"🐢 Plus simple", harder:"🔥 Plus dur",
      annotate:"🎨 Annoter", deepDive:"📚 Approfondir", conj:"📊 Conjuguer", timelines:"🕰️ Chronologies", nearby:"↔️ Temps voisins",
      verbday:"⭐ Verbe du jour", roleplay:"🎭 Jeu de rôle", cloze:"✏️ Textes à trous", vocab:"🗂️ Astuce vocab", newTopic:"🆕 Nouveau sujet", recap:"📋 Récap" }
  },
  es: {
    map:"Mapa gramatical", lab:"Laboratorio de frases", lucy:"Lucy", search:"Buscar reglas, ejemplos…", all:"todo",
    examples:"Ejemplos", exceptions:"Excepciones y trampas", why:"Por qué existe esta regla", related:"Relacionado",
    analyzeTitle:"Laboratorio de frases", analyzeHint:"Escribe una frase en tu idioma meta (o un intento). El modelo comprueba qué reglas se aplican — verde = correcto, rojo = infringido.",
    analyzeBtn:"Analizar", analyzing:"Analizando…", correct:"APLICADO CORRECTAMENTE", wrong:"INFRINGIDO / FALTA",
    verdict:"VEREDICTO", corrected:"Corregido", tryEx:"Prueba:", errFail:"Análisis fallido — revisa la configuración del proveedor e inténtalo de nuevo.",
    exception:"EXCEPCIÓN", settings:"Ajustes", provider:"Proveedor", modelLbl:"Modelo", apiKey:"Clave API", baseUrl:"URL base",
    theme:"Tema", close:"Cerrar", learning:"Aprendizaje", explainIn:"Explicar en", secondary:"Secundario", none:"ninguno",
    mapOnlyNl:"Todavía no hay un mapa gramatical para este idioma. Usa mientras tanto el Laboratorio de frases y Lucy — habrá más mapas.",
    tokens:"tokens", roles:"Roles de palabras", send:"Enviar", lucyPlaceholder:"Escribe en tu idioma meta (o el tuyo)…",
    level:"Nivel", targetLevel:"Meta", style:"Estilo", tenseFocus:"Tiempo", name:"Nombre",
    rolesOn:"Roles activados", rolesOff:"Roles desactivados", saveSession:"Guardar sesión", reset:"Restablecer", startSession:"Iniciar sesión",
    target:"Idioma meta", noLlm:"aún sin llamadas LLM", keyNote:"Las claves se guardan solo en tu navegador (localStorage). Claude integrado no necesita clave pero solo funciona en la app alojada.",
    lucyIntro:"Lucy es tu tutora conversacional — correcciones con reglas, conjugaciones, comparaciones de tiempos, resúmenes. Empieza a escribir.",
    lucyBtns:{ explainLast:"🔍 Explicar", example:"💡 Ejemplo", flip:"🔄 Pregúntame", simpler:"🐢 Más simple", harder:"🔥 Más difícil",
      annotate:"🎨 Anotar", deepDive:"📚 Profundizar", conj:"📊 Conjugar", timelines:"🕰️ Líneas de tiempo", nearby:"↔️ Tiempos cercanos",
      verbday:"⭐ Verbo del día", roleplay:"🎭 Juego de rol", cloze:"✏️ Rellenar huecos", vocab:"🗂️ Consejo léxico", newTopic:"🆕 Nuevo tema", recap:"📋 Resumen" }
  },
  it: {
    map:"Mappa grammaticale", lab:"Laboratorio di frasi", lucy:"Lucy", search:"Cerca regole, esempi…", all:"tutto",
    examples:"Esempi", exceptions:"Eccezioni e trappole", why:"Perché esiste questa regola", related:"Correlati",
    analyzeTitle:"Laboratorio di frasi", analyzeHint:"Scrivi una frase nella lingua di studio (o un tentativo). Il modello controlla quali regole si applicano — verde = corretto, rosso = violato.",
    analyzeBtn:"Analizza", analyzing:"Analisi…", correct:"APPLICATO CORRETTAMENTE", wrong:"VIOLATO / MANCANTE",
    verdict:"VERDETTO", corrected:"Corretto", tryEx:"Prova:", errFail:"Analisi fallita — controlla le impostazioni del provider e riprova.",
    exception:"ECCEZIONE", settings:"Impostazioni", provider:"Provider", modelLbl:"Modello", apiKey:"Chiave API", baseUrl:"URL base",
    theme:"Tema", close:"Chiudi", learning:"Apprendimento", explainIn:"Spiega in", secondary:"Secondaria", none:"nessuna",
    mapOnlyNl:"Non c'è ancora una mappa grammaticale per questa lingua. Usa intanto il Laboratorio di frasi e Lucy — altre mappe sono in arrivo.",
    tokens:"token", roles:"Ruoli delle parole", send:"Invia", lucyPlaceholder:"Scrivi nella lingua di studio (o nella tua)…",
    level:"Livello", targetLevel:"Obiettivo", style:"Stile", tenseFocus:"Tempo", name:"Nome",
    rolesOn:"Ruoli attivi", rolesOff:"Ruoli spenti", saveSession:"Salva sessione", reset:"Reimposta", startSession:"Avvia sessione",
    target:"Lingua di studio", noLlm:"nessuna chiamata LLM", keyNote:"Le chiavi sono salvate solo nel tuo browser (localStorage). Claude integrato non richiede chiave ma funziona solo nell'app ospitata.",
    lucyIntro:"Lucy è la tua tutor conversazionale — correzioni con regole, coniugazioni, confronti tra tempi, riepiloghi. Inizia a scrivere.",
    lucyBtns:{ explainLast:"🔍 Spiega", example:"💡 Esempio", flip:"🔄 Interrogami", simpler:"🐢 Più semplice", harder:"🔥 Più difficile",
      annotate:"🎨 Annota", deepDive:"📚 Approfondisci", conj:"📊 Coniuga", timelines:"🕰️ Linee temporali", nearby:"↔️ Tempi vicini",
      verbday:"⭐ Verbo del giorno", roleplay:"🎭 Gioco di ruolo", cloze:"✏️ Riempi gli spazi", vocab:"🗂️ Consiglio lessico", newTopic:"🆕 Nuovo tema", recap:"📋 Riepilogo" }
  },
  pt: {
    map:"Mapa gramatical", lab:"Laboratório de frases", lucy:"Lucy", search:"Pesquisar regras, exemplos…", all:"tudo",
    examples:"Exemplos", exceptions:"Exceções e armadilhas", why:"Por que esta regra existe", related:"Relacionado",
    analyzeTitle:"Laboratório de frases", analyzeHint:"Escreva uma frase na sua língua-alvo (ou uma tentativa). O modelo verifica quais regras se aplicam — verde = correto, vermelho = violado.",
    analyzeBtn:"Analisar", analyzing:"Analisando…", correct:"APLICADO CORRETAMENTE", wrong:"VIOLADO / FALTANDO",
    verdict:"VEREDITO", corrected:"Corrigido", tryEx:"Tente:", errFail:"Falha na análise — verifique as configurações do provedor e tente novamente.",
    exception:"EXCEÇÃO", settings:"Configurações", provider:"Provedor", modelLbl:"Modelo", apiKey:"Chave API", baseUrl:"URL base",
    theme:"Tema", close:"Fechar", learning:"Aprendizagem", explainIn:"Explicar em", secondary:"Secundária", none:"nenhuma",
    mapOnlyNl:"Ainda não existe um mapa gramatical para esta língua. Use entretanto o Laboratório de frases e a Lucy — vêm aí mais mapas.",
    tokens:"tokens", roles:"Papéis das palavras", send:"Enviar", lucyPlaceholder:"Escreva na sua língua-alvo (ou na sua)…",
    level:"Nível", targetLevel:"Meta", style:"Estilo", tenseFocus:"Tempo", name:"Nome",
    rolesOn:"Papéis ativos", rolesOff:"Papéis desativados", saveSession:"Salvar sessão", reset:"Redefinir", startSession:"Iniciar sessão",
    target:"Língua-alvo", noLlm:"sem chamadas LLM ainda", keyNote:"As chaves são guardadas apenas no seu navegador (localStorage). O Claude integrado não precisa de chave mas só funciona na app hospedada.",
    lucyIntro:"A Lucy é a sua tutora de conversação — correções com regras, conjugações, comparações de tempos, resumos. Comece a escrever.",
    lucyBtns:{ explainLast:"🔍 Explicar", example:"💡 Exemplo", flip:"🔄 Pergunte-me", simpler:"🐢 Mais simples", harder:"🔥 Mais difícil",
      annotate:"🎨 Anotar", deepDive:"📚 Aprofundar", conj:"📊 Conjugar", timelines:"🕰️ Linhas do tempo", nearby:"↔️ Tempos próximos",
      verbday:"⭐ Verbo do dia", roleplay:"🎭 Roleplay", cloze:"✏️ Preencher lacunas", vocab:"🗂️ Dica de vocab", newTopic:"🆕 Novo tema", recap:"📋 Resumo" }
  },
  pl: {
    map:"Mapa gramatyki", lab:"Laboratorium zdań", lucy:"Lucy", search:"Szukaj reguł, przykładów…", all:"wszystko",
    examples:"Przykłady", exceptions:"Wyjątki i pułapki", why:"Dlaczego ta reguła istnieje", related:"Powiązane",
    analyzeTitle:"Laboratorium zdań", analyzeHint:"Wpisz zdanie w języku docelowym (lub próbę). Model sprawdza, które reguły obowiązują — zielony = poprawnie, czerwony = naruszone.",
    analyzeBtn:"Analizuj", analyzing:"Analiza…", correct:"POPRAWNIE ZASTOSOWANE", wrong:"NARUSZONE / BRAK",
    verdict:"WERDYKT", corrected:"Poprawione", tryEx:"Spróbuj:", errFail:"Analiza nie powiodła się — sprawdź ustawienia dostawcy i spróbuj ponownie.",
    exception:"WYJĄTEK", settings:"Ustawienia", provider:"Dostawca", modelLbl:"Model", apiKey:"Klucz API", baseUrl:"Bazowy URL",
    theme:"Motyw", close:"Zamknij", learning:"Nauka", explainIn:"Wyjaśniaj w", secondary:"Drugi język", none:"brak",
    mapOnlyNl:"Dla tego języka nie ma jeszcze mapy gramatyki. Skorzystaj na razie z Laboratorium zdań i Lucy — kolejne mapy są w planach.",
    tokens:"tokeny", roles:"Role wyrazów", send:"Wyślij", lucyPlaceholder:"Pisz w języku docelowym (lub swoim)…",
    level:"Poziom", targetLevel:"Cel", style:"Styl", tenseFocus:"Czas", name:"Imię",
    rolesOn:"Role wł.", rolesOff:"Role wył.", saveSession:"Zapisz sesję", reset:"Resetuj", startSession:"Rozpocznij sesję",
    target:"Język docelowy", noLlm:"brak wywołań LLM", keyNote:"Klucze są przechowywane tylko w Twojej przeglądarce (localStorage). Wbudowany Claude nie wymaga klucza, ale działa tylko w hostowanej aplikacji.",
    lucyIntro:"Lucy to Twoja konwersacyjna korepetytorka — poprawki z regułami, koniugacje, porównania czasów, podsumowania. Zacznij pisać.",
    lucyBtns:{ explainLast:"🔍 Wyjaśnij", example:"💡 Przykład", flip:"🔄 Zapytaj mnie", simpler:"🐢 Prościej", harder:"🔥 Trudniej",
      annotate:"🎨 Oznacz", deepDive:"📚 Pogłęb", conj:"📊 Odmień", timelines:"🕰️ Osie czasu", nearby:"↔️ Bliskie czasy",
      verbday:"⭐ Czasownik dnia", roleplay:"🎭 Odgrywanie ról", cloze:"✏️ Uzupełnianie", vocab:"🗂️ Wskazówka słow.", newTopic:"🆕 Nowy temat", recap:"📋 Podsumowanie" }
  },
  sv: {
    map:"Grammatikkarta", lab:"Meningslabb", lucy:"Lucy", search:"Sök regler, exempel…", all:"alla",
    examples:"Exempel", exceptions:"Undantag & fallgropar", why:"Varför regeln finns", related:"Relaterat",
    analyzeTitle:"Meningslabb", analyzeHint:"Skriv en mening på ditt målspråk (eller ett försök). Modellen kollar vilka regler som gäller — grönt = rätt, rött = brutet.",
    analyzeBtn:"Analysera", analyzing:"Analyserar…", correct:"KORREKT TILLÄMPAD", wrong:"BRUTEN / SAKNAS",
    verdict:"UTLÅTANDE", corrected:"Rättad", tryEx:"Testa:", errFail:"Analysen misslyckades — kontrollera leverantörsinställningarna och försök igen.",
    exception:"UNDANTAG", settings:"Inställningar", provider:"Leverantör", modelLbl:"Modell", apiKey:"API-nyckel", baseUrl:"Bas-URL",
    theme:"Tema", close:"Stäng", learning:"Lärande", explainIn:"Förklara på", secondary:"Sekundärt", none:"inget",
    mapOnlyNl:"Det finns ännu ingen grammatikkarta för det här språket. Använd Meningslabbet och Lucy så länge — fler kartor är på gång.",
    tokens:"tokens", roles:"Ordroller", send:"Skicka", lucyPlaceholder:"Skriv på ditt målspråk (eller ditt eget)…",
    level:"Nivå", targetLevel:"Mål", style:"Stil", tenseFocus:"Tempus", name:"Namn",
    rolesOn:"Roller på", rolesOff:"Roller av", saveSession:"Spara session", reset:"Återställ", startSession:"Starta session",
    target:"Målspråk", noLlm:"inga LLM-anrop än", keyNote:"Nycklar lagras bara i din webbläsare (localStorage). Inbyggda Claude behöver ingen nyckel men fungerar bara i den hostade appen.",
    lucyIntro:"Lucy är din samtalslärare — rättningar med regler, böjningar, tempusjämförelser, sammanfattningar. Börja bara skriva.",
    lucyBtns:{ explainLast:"🔍 Förklara", example:"💡 Exempel", flip:"🔄 Fråga mig", simpler:"🐢 Enklare", harder:"🔥 Svårare",
      annotate:"🎨 Markera", deepDive:"📚 Fördjupa", conj:"📊 Böj", timelines:"🕰️ Tidslinjer", nearby:"↔️ Närliggande tempus",
      verbday:"⭐ Dagens verb", roleplay:"🎭 Rollspel", cloze:"✏️ Lucktext", vocab:"🗂️ Ordtips", newTopic:"🆕 Nytt ämne", recap:"📋 Sammanfattning" }
  },
  nl: {
    map:"Grammaticakaart", lab:"Zinslab", lucy:"Lucy", search:"Zoek regels, voorbeelden…", all:"alle",
    examples:"Voorbeelden", exceptions:"Uitzonderingen & valkuilen", why:"Waarom deze regel bestaat", related:"Gerelateerd",
    analyzeTitle:"Zinslab", analyzeHint:"Typ een zin in je doeltaal (of een poging). Het model controleert welke regels gelden — groen = correct, rood = geschonden.",
    analyzeBtn:"Analyseer", analyzing:"Analyseren…", correct:"CORRECT TOEGEPAST", wrong:"GESCHONDEN / ONTBREEKT",
    verdict:"OORDEEL", corrected:"Gecorrigeerd", tryEx:"Probeer:", errFail:"Analyse mislukt — controleer de providerinstellingen en probeer opnieuw.",
    exception:"UITZONDERING", settings:"Instellingen", provider:"Provider", modelLbl:"Model", apiKey:"API-sleutel", baseUrl:"Basis-URL",
    theme:"Thema", close:"Sluiten", learning:"Leren", explainIn:"Uitleg in", secondary:"Tweede taal", none:"geen",
    mapOnlyNl:"Voor deze taal is er nog geen samengestelde grammaticakaart. Gebruik zolang het Zinslab en Lucy — er komen meer kaarten.",
    tokens:"tokens", roles:"Woordrollen", send:"Verstuur", lucyPlaceholder:"Schrijf in je doeltaal (of je eigen taal)…",
    level:"Niveau", targetLevel:"Doel", style:"Stijl", tenseFocus:"Tijd", name:"Naam",
    rolesOn:"Rollen aan", rolesOff:"Rollen uit", saveSession:"Sessie opslaan", reset:"Resetten", startSession:"Sessie starten",
    target:"Doeltaal", noLlm:"nog geen LLM-aanroepen", keyNote:"Sleutels worden alleen in je browser opgeslagen (localStorage). Ingebouwde Claude heeft geen sleutel nodig maar werkt alleen in de gehoste app.",
    lucyIntro:"Lucy is je gesprekstutor — correcties met regels, vervoegingen, tijdvergelijkingen, samenvattingen. Begin gewoon te typen.",
    lucyBtns:{ explainLast:"🔍 Leg laatste uit", example:"💡 Voorbeeld", flip:"🔄 Vraag mij", simpler:"🐢 Eenvoudiger", harder:"🔥 Moeilijker",
      annotate:"🎨 Annoteer", deepDive:"📚 Verdiep", conj:"📊 Vervoeg", timelines:"🕰️ Tijdlijnen", nearby:"↔️ Nabije tijden",
      verbday:"⭐ Werkwoord van de dag", roleplay:"🎭 Rollenspel", cloze:"✏️ Vul de gaten in", vocab:"🗂️ Woordtip", newTopic:"🆕 Nieuw onderwerp", recap:"📋 Samenvatting" }
  }
};
// ── v3 strings for the new views. Any language may omit keys — applyLang layers
// the English set underneath, so a partial translation degrades to English per
// key instead of rendering "undefined".
const UI_EXTRA = {
  en: { review:"Review", progress:"Progress", reader:"Reader", practice:"Practice",
    translate:"Translate", fetchArticle:"Fetch article", sentences:"sentences", edit:"Edit",
    hoverHint:"hover a word for its meaning and role", rolesBarLang:"Roles bar language", primaryLbl:"Primary", secondaryLbl:"Secondary",
    readerFetchHint:"the site may block outside access; try pasting the text instead", readerProxyNote:"Fetching sends the URL to the text-extraction service in Settings (default r.jina.ai). Clear that field to fetch directly — most news sites will refuse. Pasting text never contacts anyone.",
    support:"Support this project", supportNote:"LinguaMap is free and open source. If it helps you, you can buy me a coffee.",
    translateAll:"Translate all", runRoles:"Run roles", runRolesHint:"Colour-code this sentence by word role and translate it into both explanation languages",
    modelUsage:"Model usage", usageNote:"Counted on this device only. Token figures come from the provider when it reports them, otherwise they are estimated.",
    drillLucy:"Drill with Lucy", customPrompt:"Custom instructions",
    customPromptNote:"Added to every request on top of the app's own instructions — useful for things like \"always compare with German\" or \"keep examples about cooking\". It cannot override the output format the app depends on.",
    debugMode:"Debug readout", debugNote:"Shows response time, tokens and tokens-per-second for the last call in the bottom bar.",
    handoffReader:"Sent to Reader", handoffLab:"Sent to Sentence Lab",
    handoffLucy:"Sent to Lucy", handoffVocab:"Saved to vocabulary",
    keySecurity:"Key security", keyEncrypted:"Encrypted on this device",
    keyPassProtected:"Protected by your passphrase",
    keyPlain:"Not encrypted — this page is not on a secure origin",
    keyDeviceNote:"Keys are stored as AES-GCM ciphertext. The encryption key is held by the browser and cannot be read back by any script, so nothing readable ever reaches disk. Code running on this page can still ask the browser to decrypt — for a shared computer, add a passphrase.",
    keyPassNote:"Keys are unreadable without your passphrase, even to someone holding this whole browser profile. You will be asked for it each time the app starts. There is no recovery: forget it and the keys have to be entered again.",
    keyPlainNote:"AES encryption needs a secure origin (https, or localhost). Open the app over https to get encrypted key storage.",
    keySetPass:"Add a passphrase", keyRemovePass:"Remove passphrase", keyPurge:"Delete stored keys",
    keyPassPlaceholder:"Passphrase (6+ characters)", keyUnlock:"Unlock", keyUnlockTitle:"Unlock your API keys",
    keyUnlockNote:"Your keys are encrypted with a passphrase. Everything else — grammar map, vocabulary, progress — is already loaded.",
    keyWrongPass:"That passphrase does not match.", keySkip:"Continue without keys",
    keyPurgeConfirm:"Delete every stored API key from this device?",
    lucyWide:"Widescreen", lucyNarrow:"Narrow column",
    perProviderNote:"Model and endpoint are remembered per provider, so switching back restores what you had.",
    mapLanguage:"Grammar map language", mapAuthored:"written in this language",
    mapBuiltIn:"built into the app", mapMissingLang:"This map isn't available in {lang} yet",
    mapMissingAction:"Translate it",
    mapTranslate:"Translate map", 
    mapTranslateNote:"The {lang} map is written in English. Any other explanation language is translated once by your model and cached in this browser forever — it is never re-fetched and never leaves your device.",
    voiceFocus:"Conversation focus", focusFlow:"Natural flow", focusGrammar:"Grammar", focusIntonation:"Pronunciation",
    voiceFocusNote:"What Lucy prioritises. She never drills pronunciation unless you pick it — otherwise she models the right sound once and keeps talking.",
    voiceCorrectVia:"Corrections", correctScreen:"On screen", correctSpoken:"Spoken too",
    voiceCorrectNote:"Spoken corrections keep it hands-free; on-screen keeps the conversation flowing.",
    ttsScope:"Use this voice", ttsScopeVoice:"Voice mode only", ttsScopeAll:"Everywhere in the app",
    ttsScopeNote:"Everywhere means the 🔊 buttons on examples, cards and the Reader use your configured voice instead of the browser's.",
    regionDetect:"Detect", regionDetected:"Detected from your resource",
    interfaceLang:"Interface language", interfaceLangNote:"Menus, buttons and the word-roles bar. Defaults to your primary explanation language.",
    sameAsExplain:"Same as explanations",
    voicePause:"Pause", voiceResume:"Resume", voicePaused:"paused",
    bilingualLbl:"Explain everything in both languages",
    bilingualNote:"Corrections, rules and glosses appear in both explanation languages. Off = primary language only.",
    bilingualNeedsSecond:"Choose a second explanation language first.",
    loadModels:"Load models", testConn:"Test", modelsFound:"available", testOk:"Working",
    loadVoices:"Load voices", voicesFound:"voices", speechRegion:"Speech region",
    speechRegionNote:"Azure publishes its voice catalogue per region, not on the Foundry endpoint. Set the region to load the real list for your subscription.",
    apiVerDiscovered:"Discovered from the service", apiVerGuessed:"Not advertised by the service — probed",
    voiceViaBrowser:"speech via your browser",
    oneProvider:"One provider for everything", oneProviderNA:"only when text and voice use the same vendor",
    oneProviderNote:"Use my text provider's endpoint and key for voice too, instead of configuring it twice.",
    currently:"currently", detectApiVer:"Detect", apiVerFound:"Working api-version:",
    apiVerNone:"None of the known api-versions connected — check the endpoint, key and model.",
    voiceHear:"Hear this voice", voicePlaying:"Playing sample…", voicePickOne:"pick a voice…",
    voiceBrowserUses:"uses the browser voice from 🔊 above", voiceCustom:"or type a voice name",
    voiceFallback:"Browser voice",
    voiceFallbackNote:"Switch this conversation to browser speech if the realtime endpoint is not responding.",
    voiceMode:"Voice mode", voiceStart:"Start talking", voiceStop:"Stop",
    voiceIdle:"not started", voiceConnecting:"connecting…", voiceListening:"listening",
    voiceThinking:"thinking…", voiceSpeaking:"speaking",
    voiceHintRealtime:"Speak naturally — you can interrupt at any time and Lucy will stop and listen.",
    voiceHintBrowser:"Speak, pause, and Lucy will answer out loud. She waits for you to finish before replying.",
    voiceSettings:"Voice mode", voiceEngine:"Engine", voiceSameAsText:"Use my text provider's key where it fits",
    voiceVoice:"Voice", voiceVad:"Turn detection", voiceThreshold:"Sensitivity", voicePrefix:"Lead-in (ms)",
    voiceSilence:"Silence before reply (ms)", voiceEcho:"Echo cancellation", voiceNoise:"Noise suppression",
    voiceStyleLbl:"Speaking style", voiceAdvanced:"Advanced session JSON",
    voiceAdvancedNote:"Merged into session.update last, so it overrides everything above. Leave empty unless you know the API.",
    voiceEngineNote:"Azure VoiceLive and OpenAI Realtime are true speech-to-speech and can be interrupted mid-sentence. Browser speech works with every provider — including a local model — but takes turns instead.",
    voiceTest:"Test connection", voiceNoRealtime:"This provider has no realtime speech API. Browser speech is used instead.",
    due:"due", newCards:"new", noDue:"Nothing due — you're all caught up.", startReview:"Start review",
    again:"Again", hard:"Hard", good:"Good", easy:"Easy", showAnswer:"Show answer", endSession:"Finish",
    reviewDone:"Session complete", cardsLeft:"left", streak:"Streak", days:"days", xp:"XP",
    mastery:"Mastery", weakest:"Needs work", strongest:"Strong", activity:"Activity", noData:"No activity yet.",
    readerHint:"Paste any text in your target language. Tap a word for an instant gloss, or a sentence to send it to the Lab or Lucy.", readerPlaceholder:"Paste an article, a song, a chat message…",
    analyze:"Analyze", askLucy:"Ask Lucy", addVocab:"Add to vocab", speak:"Speak", stopSpeak:"Stop",
    practiceTitle:"Practice this rule", generate:"Generate drill", checkAnswers:"Check", nextDrill:"New drill",
    correctAns:"Correct", wrongAns:"Not quite", yourAnswer:"Your answer", answer:"Answer",
    backup:"Backup", exportAll:"Export all data", importAll:"Import data", copyLink:"Copy link",
    linkCopied:"Link copied", install:"Install app", search2:"Search rules, vocab, actions…",
    palette:"Command palette", offline:"Offline — cached content only", clearAll:"Clear all data",
    mic:"Speak", micListening:"Listening…", micUnsupported:"Speech input isn't available in this browser.",
    ttsUnsupported:"Speech output isn't available in this browser.", vocabTab:"Vocab", mistakesTab:"Mistakes",
    goalMet:"Daily goal reached!", dailyGoalLbl:"Daily goal", cards:"cards", accuracy:"Accuracy",
    resume:"Resume", newSession:"New session", confirmClear:"Delete ALL saved data (vocab, progress, settings)?",
    builtinMissing:"Built-in Claude is only available inside the Claude app. Open Settings (⚙) and choose a provider — an API key, OpenRouter's free tier, or a local model such as Ollama or LM Studio.",
    setupTitle:"Choose how to power the AI features",
    setupBody:"The Grammar Map works offline with no setup. The Sentence Lab, Lucy, Practice and word lookups need a language model — pick one in Settings. Your key stays in this browser.",
    setupBtn:"Open settings", dismiss:"Later", keyMissing:"Add an API key in Settings (⚙) to use this provider.",
    backupNote:"Your vocabulary, review schedule and progress live in this browser only. Export before switching device or clearing site data. The normal export leaves your API keys out — use ⬇ + 🔑 only for a backup you keep private.",
    exportKeysWarn:"This file will contain your API keys in plain text. Anyone who opens it can use your account. Only do this for a backup you keep private — never email it, upload it, or put it in a shared folder.\n\nContinue?" },
  hu: { review:"Ismétlés", progress:"Haladás", reader:"Olvasó", practice:"Gyakorlás",
    translate:"Fordítás", fetchArticle:"Cikk letöltése", sentences:"mondat", edit:"Szerkesztés",
    hoverHint:"vidd a szó fölé a jelentésért és szerepért", rolesBarLang:"Szerepek sáv nyelve", primaryLbl:"Elsődleges", secondaryLbl:"Másodlagos",
    readerFetchHint:"az oldal blokkolhatja a külső hozzáférést; próbáld beilleszteni a szöveget", readerProxyNote:"A letöltés elküldi az URL-t a Beállításokban megadott szolgáltatásnak (alapértelmezés: r.jina.ai). Írd üresre a közvetlen letöltéshez — a legtöbb híroldal ezt megtagadja. A beillesztés soha nem küld adatot.",
    support:"Támogasd a projektet", supportNote:"A LinguaMap ingyenes és nyílt forrású. Ha hasznos, meghívhatsz egy kávéra.",
    translateAll:"Mind lefordítása", runRoles:"Szerepek", runRolesHint:"Színkódolja a mondatot szófaji szerep szerint, és lefordítja mindkét magyarázó nyelvre",
    modelUsage:"Modellhasználat", usageNote:"Csak ezen az eszközön számolva. A tokenszámok a szolgáltatótól jönnek, ha jelenti őket, egyébként becsültek.",
    drillLucy:"Gyakorlás Lucyval", customPrompt:"Egyéni utasítások",
    customPromptNote:"Minden kéréshez hozzáadódik az alkalmazás saját utasításai mellé — például „mindig hasonlítsd össze a némettel”. A kimeneti formátumot nem írhatja felül.",
    debugMode:"Hibakeresési adatok", debugNote:"Az utolsó hívás válaszidejét, tokenszámát és token/másodperc értékét mutatja az alsó sávban.",
    due:"esedékes", newCards:"új", noDue:"Nincs esedékes kártya — mindennel megvagy.", startReview:"Ismétlés indítása",
    again:"Újra", hard:"Nehéz", good:"Jó", easy:"Könnyű", showAnswer:"Megoldás", endSession:"Befejezés",
    reviewDone:"Kész a kör", cardsLeft:"maradt", streak:"Sorozat", days:"nap", xp:"XP",
    mastery:"Tudásszint", weakest:"Gyakorlandó", strongest:"Erős", activity:"Aktivitás", noData:"Még nincs adat.",
    readerHint:"Illessz be bármilyen szöveget a célnyelveden. Koppints egy szóra a jelentéséért, vagy egy mondatra, hogy a Laborba vagy Lucyhoz küldd.", readerPlaceholder:"Cikk, dalszöveg, üzenet…",
    analyze:"Elemzés", askLucy:"Kérdezd Lucyt", addVocab:"Szótárba", speak:"Felolvas", stopSpeak:"Állj",
    practiceTitle:"Gyakorold ezt a szabályt", generate:"Feladat kérése", checkAnswers:"Ellenőrzés", nextDrill:"Új feladat",
    correctAns:"Helyes", wrongAns:"Nem egészen", yourAnswer:"A válaszod", answer:"Megoldás",
    backup:"Mentés", exportAll:"Adatok exportálása", importAll:"Adatok importálása", copyLink:"Link másolása",
    linkCopied:"Link másolva", install:"Alkalmazás telepítése", search2:"Keress szabályt, szót, műveletet…",
    palette:"Parancspaletta", offline:"Offline — csak a gyorsítótár", clearAll:"Minden adat törlése",
    mic:"Beszélj", micListening:"Hallgatlak…", micUnsupported:"A hangbevitel nem érhető el ebben a böngészőben.",
    ttsUnsupported:"A felolvasás nem érhető el ebben a böngészőben.", vocabTab:"Szavak", mistakesTab:"Hibák",
    goalMet:"Napi cél teljesítve!", dailyGoalLbl:"Napi cél", cards:"kártya", accuracy:"Pontosság",
    resume:"Folytatás", newSession:"Új munkamenet", confirmClear:"Töröljem az ÖSSZES mentett adatot (szavak, haladás, beállítások)?",
    builtinMissing:"A beépített Claude csak a Claude alkalmazásban érhető el. Nyisd meg a Beállításokat (⚙), és válassz szolgáltatót — API kulcsot, az OpenRouter ingyenes csomagját, vagy helyi modellt (Ollama, LM Studio).",
    setupTitle:"Válaszd ki, mi hajtsa az MI-funkciókat",
    setupBody:"A nyelvtani térkép beállítás nélkül, offline is működik. A Mondatlabor, Lucy, a gyakorlás és a szókikeresés nyelvi modellt igényel — válassz egyet a Beállításokban. A kulcs csak a böngésződben marad.",
    setupBtn:"Beállítások", dismiss:"Később", keyMissing:"Adj meg egy API kulcsot a Beállításokban (⚙).",
    backupNote:"A szavaid, ismétlési ütemterved és haladásod csak ebben a böngészőben él. Exportálj, mielőtt eszközt váltasz vagy törlöd az adatokat. A normál export nem tartalmazza az API kulcsokat — a ⬇ + 🔑 csak privát mentéshez való.",
    exportKeysWarn:"Ez a fájl nyílt szövegben tartalmazza az API kulcsaidat. Aki megnyitja, használhatja a fiókodat. Csak privát mentéshez — soha ne küldd e-mailben, ne töltsd fel, és ne tedd megosztott mappába.\n\nFolytatod?" },
  nl: { review:"Herhaling", progress:"Voortgang", reader:"Lezer", practice:"Oefenen",
    translate:"Vertalen", fetchArticle:"Artikel ophalen", sentences:"zinnen", edit:"Bewerken",
    hoverHint:"beweeg over een woord voor betekenis en rol", rolesBarLang:"Taal van de rollenbalk", primaryLbl:"Primair", secondaryLbl:"Secundair",
    readerFetchHint:"de site blokkeert mogelijk externe toegang; plak anders de tekst", readerProxyNote:"Ophalen stuurt de URL naar de tekstdienst uit Instellingen (standaard r.jina.ai). Maak dat veld leeg om direct op te halen — de meeste nieuwssites weigeren dat. Plakken verstuurt nooit iets.",
    support:"Steun dit project", supportNote:"LinguaMap is gratis en open source. Als het je helpt, kun je me een koffie aanbieden.",
    translateAll:"Alles vertalen", runRoles:"Rollen tonen", runRolesHint:"Kleur deze zin per woordrol en vertaal hem naar beide uitlegtalen",
    modelUsage:"Modelgebruik", usageNote:"Alleen op dit apparaat geteld. Tokenaantallen komen van de provider als die ze meldt, anders zijn ze geschat.",
    drillLucy:"Oefenen met Lucy", customPrompt:"Eigen instructies",
    customPromptNote:"Wordt bij elke aanvraag toegevoegd naast de eigen instructies van de app. Het kan het vereiste uitvoerformaat niet overschrijven.",
    debugMode:"Debug-info", debugNote:"Toont responstijd, tokens en tokens per seconde van de laatste aanroep in de onderbalk.",
    due:"te doen", newCards:"nieuw", noDue:"Niets te herhalen — je bent bij.", startReview:"Start herhaling",
    again:"Opnieuw", hard:"Moeilijk", good:"Goed", easy:"Makkelijk", showAnswer:"Toon antwoord", endSession:"Klaar",
    reviewDone:"Sessie klaar", cardsLeft:"over", streak:"Reeks", days:"dagen", xp:"XP",
    mastery:"Beheersing", weakest:"Oefenen", strongest:"Sterk", activity:"Activiteit", noData:"Nog geen activiteit.",
    readerHint:"Plak een tekst in je doeltaal. Tik op een woord voor de betekenis, of op een zin om die naar het Lab of Lucy te sturen.", readerPlaceholder:"Een artikel, songtekst, bericht…",
    analyze:"Analyseer", askLucy:"Vraag Lucy", addVocab:"Naar woordenlijst", speak:"Voorlezen", stopSpeak:"Stop",
    practiceTitle:"Oefen deze regel", generate:"Maak oefening", checkAnswers:"Controleer", nextDrill:"Nieuwe oefening",
    correctAns:"Goed", wrongAns:"Net niet", yourAnswer:"Jouw antwoord", answer:"Antwoord",
    backup:"Back-up", exportAll:"Alles exporteren", importAll:"Data importeren", copyLink:"Kopieer link",
    linkCopied:"Link gekopieerd", install:"App installeren", search2:"Zoek regels, woorden, acties…",
    palette:"Commandopalet", offline:"Offline — alleen cache", clearAll:"Alle data wissen",
    mic:"Spreek", micListening:"Ik luister…", micUnsupported:"Spraakinvoer werkt niet in deze browser.",
    ttsUnsupported:"Voorlezen werkt niet in deze browser.", vocabTab:"Woorden", mistakesTab:"Fouten",
    goalMet:"Dagdoel gehaald!", dailyGoalLbl:"Dagdoel", cards:"kaarten", accuracy:"Nauwkeurigheid",
    resume:"Hervatten", newSession:"Nieuwe sessie", confirmClear:"ALLE opgeslagen data verwijderen (woorden, voortgang, instellingen)?",
    builtinMissing:"Ingebouwde Claude bestaat alleen in de Claude-app. Open Instellingen (⚙) en kies een provider — een API-sleutel, de gratis laag van OpenRouter, of een lokaal model zoals Ollama of LM Studio.",
    setupTitle:"Kies wat de AI-functies aandrijft",
    setupBody:"De grammaticakaart werkt offline zonder instellingen. Het Zinslab, Lucy, oefeningen en woordopzoekingen hebben een taalmodel nodig — kies er een in Instellingen. Je sleutel blijft in deze browser.",
    setupBtn:"Instellingen", dismiss:"Later", keyMissing:"Voeg een API-sleutel toe in Instellingen (⚙).",
    backupNote:"Je woorden, herhalingsschema en voortgang staan alleen in deze browser. Exporteer voordat je van apparaat wisselt of sitegegevens wist. De gewone export bevat je API-sleutels niet — gebruik ⬇ + 🔑 alleen voor een privéback-up.",
    exportKeysWarn:"Dit bestand bevat je API-sleutels in leesbare tekst. Wie het opent kan je account gebruiken. Alleen voor een privéback-up — nooit mailen, uploaden of in een gedeelde map zetten.\n\nDoorgaan?" },
  de: { review:"Wiederholen", progress:"Fortschritt", reader:"Leser", practice:"Üben",
    due:"fällig", newCards:"neu", noDue:"Nichts fällig — alles erledigt.", startReview:"Wiederholung starten",
    again:"Nochmal", hard:"Schwer", good:"Gut", easy:"Leicht", showAnswer:"Antwort zeigen", endSession:"Fertig",
    streak:"Serie", days:"Tage", mastery:"Beherrschung", weakest:"Üben", strongest:"Stark", activity:"Aktivität",
    analyze:"Analysieren", askLucy:"Lucy fragen", speak:"Vorlesen", practiceTitle:"Diese Regel üben",
    generate:"Übung erzeugen", checkAnswers:"Prüfen", nextDrill:"Neue Übung", backup:"Sicherung", install:"App installieren" },
  fr: { review:"Révision", progress:"Progrès", reader:"Lecteur", practice:"Pratique",
    due:"à revoir", newCards:"nouveau", startReview:"Commencer", again:"Encore", hard:"Difficile", good:"Bien", easy:"Facile",
    showAnswer:"Voir la réponse", endSession:"Terminer", streak:"Série", days:"jours", mastery:"Maîtrise",
    analyze:"Analyser", askLucy:"Demander à Lucy", speak:"Lire à voix haute", checkAnswers:"Vérifier", install:"Installer l'app" },
  es: { review:"Repaso", progress:"Progreso", reader:"Lector", practice:"Práctica",
    due:"pendiente", newCards:"nuevo", startReview:"Empezar repaso", again:"Otra vez", hard:"Difícil", good:"Bien", easy:"Fácil",
    showAnswer:"Ver respuesta", endSession:"Terminar", streak:"Racha", days:"días", mastery:"Dominio",
    analyze:"Analizar", askLucy:"Preguntar a Lucy", speak:"Leer en voz alta", checkAnswers:"Comprobar", install:"Instalar app" }
};
const UI = { ...UI_STRINGS.en, ...UI_EXTRA.en };
// English underneath every language: a missing key falls back instead of vanishing.
// The interface follows its own setting; unset means "same as explanations".
const uiLangOf = (S) => S.uiLang || S.primary || "en";
function applyLang(code){
  // English first, then each per-language set, so a key missing from one
  // translation falls back on its own instead of blanking the label.
  Object.assign(UI, UI_STRINGS.en, UI_EXTRA.en,
    UI_STRINGS[code] || {}, UI_EXTRA[code] || {}, (window.UI_I18N || {})[code] || {});
}

// lightweight inline markdown → React (bold, italic, `code`)
function mdInline(text, T) {
  const parts = []; let i = 0, key = 0;
  const re = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`)/g;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > i) parts.push(text.slice(i, m.index));
    if (m[2] || m[3]) parts.push(<strong key={key++} style={{ fontWeight:800, color:T.text }}>{m[2]||m[3]}</strong>);
    else if (m[4] || m[5]) parts.push(<em key={key++} style={{ fontStyle:"italic" }}>{m[4]||m[5]}</em>);
    else if (m[6]) parts.push(<code key={key++} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.92em", background:T.chip, padding:"1px 4px", borderRadius:4 }}>{m[6]}</code>);
    i = m.index + m[0].length;
  }
  if (i < text.length) parts.push(text.slice(i));
  return parts;
}

// ── Word glosses: one shared, cached lookup for the whole app ───────────────
// Hovering any target-language word anywhere should explain it, so lookups are
// deduplicated and cached permanently — the same word is never paid for twice.
const GLOSS_KEY = "lm3:gloss";
let GLOSS_CACHE = null;
const glossKeyOf = (word, S) => `${S.target}|${S.primary}|${secondLang(S)||"-"}|${word.toLowerCase()}`;
function loadGloss() {
  if (GLOSS_CACHE) return GLOSS_CACHE;
  try { GLOSS_CACHE = JSON.parse(localStorage.getItem(GLOSS_KEY) || "{}"); } catch(e){ GLOSS_CACHE = {}; }
  return GLOSS_CACHE;
}
function saveGloss(key, val) {
  const c = loadGloss();
  c[key] = val;
  const keys = Object.keys(c);
  if (keys.length > 4000) keys.slice(0, 500).forEach(k => delete c[k]);   // keep it bounded
  try { localStorage.setItem(GLOSS_KEY, JSON.stringify(c)); } catch(e){}
}
const cleanWord = (w) => String(w).replace(/[.,!?;:()"'«»„“”—–…\[\]]/g, "").trim();

const GLOSS_PENDING = {};
// Returns { term, primary, secondary?, pos? } — both explanation languages at once.
async function lookupWord(word, S) {
  const term = cleanWord(word);
  if (!term) throw new Error("empty");
  const key = glossKeyOf(term, S);
  const cache = loadGloss();
  if (cache[key]) return cache[key];
  if (GLOSS_PENDING[key]) return GLOSS_PENDING[key];
  const tgt = (TARGET_LANGS.find(l => l.code === S.target) || {}).name || S.target;
  const p1 = langName(S.primary), p2 = secondLang(S) ? langName(secondLang(S)) : null;
  const sys = `You gloss a single ${tgt} word for a learner. Reply with ONLY compact JSON, no fences:
{"base":"dictionary form","pos":"noun|verb|adjective|adverb|pronoun|preposition|other","p1":"2-4 word meaning in ${p1}"${p2 ? `,"p2":"2-4 word meaning in ${p2}"` : ""}}
Give the meaning THIS word has, and translate idiomatically into each language — never word-for-word.`;
  GLOSS_PENDING[key] = (async () => {
    try {
      const schema = jsonObject({ base:STR, pos:{ type:"string", enum:["noun","verb","adjective","adverb","pronoun","preposition","other"] },
        p1:STR, ...(p2 ? { p2:STR } : {}) });
      const { text } = await llmCall(S, { system: sys, maxTokens: 150, schema, messages: [{ role:"user", content: term }] });
      const m = text.match(/\{[\s\S]*\}/);
      const j = m ? JSON.parse(m[0]) : {};
      const out = { term, base: j.base || term, pos: j.pos || "", primary: j.p1 || text.trim(), secondary: j.p2 || "" };
      saveGloss(key, out);
      return out;
    } finally { delete GLOSS_PENDING[key]; }
  })();
  return GLOSS_PENDING[key];
}

// Translate one spoken line into BOTH explanation languages. Cached, because a
// voice conversation repeats stock phrases constantly.
const LINE_CACHE = {};
async function translateLine(text, S) {
  const key = `${S.target}|${S.primary}|${secondLang(S) || "-"}|${text}`;
  if (LINE_CACHE[key]) return LINE_CACHE[key];
  const p1 = langName(S.primary), p2 = secondLang(S) ? langName(secondLang(S)) : null;
  LINE_CACHE[key] = (async () => {
    const { text: out } = await llmCall(S, { maxTokens: 300, task: "voice-translate",
      schema: jsonObject({ p1:STR, ...(p2 ? { p2:STR } : {}) }),
      system: `Translate the line into ${p1}${p2 ? ` and ${p2}` : ""}. Reply with ONLY compact JSON, no fences:
{"p1":"…"${p2 ? `,"p2":"…"` : ""}}
Translate the meaning as a native speaker of each language would say it — never word for word.`,
      messages: [{ role: "user", content: text }] });
    const m = out.match(/\{[\s\S]*\}/);
    const j = m ? JSON.parse(m[0]) : {};
    return { p1: j.p1 || "", p2: j.p2 || "" };
  })();
  return LINE_CACHE[key];
}

// Wraps any target-language word: hover (or tap) shows role + both meanings.
// The card is rendered into document.body through a portal and positioned with
// fixed coordinates. Anchoring it inside the word instead meant any scrolling
// or rounded-corner ancestor (the reader rows, the map drawer, Lucy's bubbles)
// clipped it — which it did, constantly.
function HoverWord({ word, role, S, onSave, color, style, children }) {
  const T = React.useContext(ThemeCtx);
  const [state, setState] = React.useState(null);   // null | "loading" | gloss | "err"
  const [pos, setPos] = React.useState(null);
  const timer = React.useRef(null);
  const ref = React.useRef(null);
  const term = cleanWord(word);
  const roleTxt = role ? roleLabel(role, S) : "";

  const place = () => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const W = 260, H = 130, pad = 8;
    const above = r.top > H + pad;                       // flip below when there's no room
    setPos({
      left: Math.min(Math.max(pad, r.left), innerWidth - W - pad),
      top: above ? r.top - pad : r.bottom + pad,
      anchor: above ? "bottom" : "top", width: W
    });
  };
  const open = () => {
    if (!term || state) return;
    place(); setState("loading");
    lookupWord(term, S).then(g => setState(g)).catch(() => setState("err"));
  };
  const close = () => { clearTimeout(timer.current); setState(null); setPos(null); };
  const enter = () => { clearTimeout(timer.current); timer.current = setTimeout(open, 320); };
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!state) return;
    const h = () => close();
    window.addEventListener("scroll", h, true); window.addEventListener("resize", h);
    return () => { window.removeEventListener("scroll", h, true); window.removeEventListener("resize", h); };
  }, [state]);

  const g = state && typeof state === "object" ? state : null;
  const card = state && pos && ReactDOM.createPortal(
    <div onMouseEnter={() => clearTimeout(timer.current)} onMouseLeave={close}
      onClick={e => e.stopPropagation()}
      style={{ position:"fixed", left:pos.left, [pos.anchor === "bottom" ? "bottom" : "top"]:
          pos.anchor === "bottom" ? (innerHeight - pos.top) : pos.top,
        zIndex:9999, width:pos.width, background:T.panel2, border:`1px solid ${T.border}`, borderRadius:10,
        padding:"9px 11px", boxShadow:"0 14px 40px #000b", fontSize:12, color:T.text,
        fontFamily:"'IBM Plex Sans',sans-serif", whiteSpace:"normal", textAlign:"left",
        fontWeight:500, fontStyle:"normal", lineHeight:1.5 }}>
      {roleTxt && (
        <div style={{ fontSize:10, color:(ROLES[role]||ROLES.x).color || T.faint,
          fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>{roleTxt}</div>
      )}
      {state === "loading" ? <span style={{ color:T.faint }}>…</span>
        : state === "err" ? <span style={{ color:T.bad }}>lookup failed — check ⚙</span>
        : (
        <React.Fragment>
          <div style={{ fontWeight:700 }}>
            {g.base}{g.pos ? <span style={{ color:T.faint, fontWeight:400, fontSize:11 }}> · {g.pos}</span> : null}
          </div>
          <div style={{ color:T.mute, marginTop:2 }}>{g.primary}</div>
          {g.secondary && <div style={{ color:T.faint, fontStyle:"italic", marginTop:1 }}>{g.secondary}</div>}
          <div style={{ display:"flex", gap:6, marginTop:7 }}>
            <button onClick={() => { speak(g.base || term, S.target, S); }}
              style={{ fontSize:10.5, padding:"2px 8px", borderRadius:5, border:`1px solid ${T.border}`,
                background:"transparent", color:T.mute, cursor:"pointer" }}>🔊</button>
            {onSave && (
              <button onClick={() => { onSave({ term: g.base || term, gloss: g.primary + (g.secondary ? " · " + g.secondary : "") }); close(); }}
                style={{ fontSize:10.5, padding:"2px 8px", borderRadius:5,
                  border:`1px solid ${T.accent}`, background:"transparent", color:T.accent, cursor:"pointer" }}>+ vocab</button>
            )}
          </div>
        </React.Fragment>
      )}
    </div>, document.body);

  return (
    <span ref={ref} style={{ position:"relative", display:"inline-block" }}
      onMouseEnter={enter} onMouseLeave={() => { clearTimeout(timer.current); timer.current = setTimeout(close, 220); }}
      onClick={(e) => { e.stopPropagation(); clearTimeout(timer.current); state ? close() : open(); }}>
      <span style={{ cursor:"help", color: color || "inherit", ...(style||{}) }}>{children || word}</span>
      {card}
    </span>
  );
}

function Tokens({ tokens, size, S, onSave }) {
  const T = React.useContext(ThemeCtx);
  return (
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:size||13, lineHeight:1.7 }}>
      {tokens.map(([text, role], i) => {
        const r = ROLES[role] || ROLES.x;
        const st = { color: r.color || T.text, fontWeight: role==="vfin"?700:500, marginRight:5 };
        // Without settings we cannot look anything up, so fall back to plain text.
        if (!S) return <span key={i} style={st} title={r.en}>{text}</span>;
        return <span key={i} style={{ marginRight:5 }}>
          <HoverWord word={text} role={role} S={S} onSave={onSave} color={r.color || T.text}
            style={{ fontWeight: role==="vfin"?700:500 }} />
        </span>;
      })}
    </span>
  );
}
function LevelBadge({ level }) {
  return <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:LEVEL_COLOR[level],
    border:`1px solid ${LEVEL_COLOR[level]}55`, borderRadius:3, padding:"1px 5px", letterSpacing:.5, flexShrink:0 }}>{level}</span>;
}

Object.assign(window, { CLUSTERS, NODE_INDEX, GRAM_MAPS, setActiveMap, hasMapFor,
  LEVELS, LEVEL_COLOR, CEFR_ALL, TARGET_LANGS, EXPLAIN_LANGS, langName, DONATE_URL, bilingual, secondLang, mapLangs, mapSecond, uiLangOf,
  ROLES, roleMeaning, roleLabel, lookupWord, HoverWord, cleanWord,
  CLUSTER_HUES, THEMES, ThemeCtx, DEFAULT_SETTINGS, loadSettings, saveSettings, PROVIDERS,
  USAGE, useUsage, llmCall, loadUsageLog, USAGE_LOG_KEY, estTok, builtinAvailable, providerReady, fetchORModels, OR_TIERS, loadORCache, saveORCache, azureBase, fetchAzureDeployments,
  fetchProviderModels, testProvider, translateLine, UI, UI_STRINGS, UI_EXTRA, applyLang, LUCY_BTN_KEYS, mdInline, Tokens, LevelBadge });
