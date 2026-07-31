// Inbound content from outside the app.
//
// Three routes in, one handler:
//   1. The browser extension — a content script running on this origin posts a
//      message into the page. Articles are far too big for a URL, so the payload
//      travels through extension storage and arrives as a postMessage.
//   2. Android's share sheet — the PWA registers as a share target, so "Share →
//      LinguaMap" from Chrome lands here as query parameters.
//   3. A plain link — ?lm=<action>&text=… for anything hand-rolled (bookmarklet,
//      Shortcuts, a link in a note).
//
// Everything arriving here is untrusted text from a web page. It is only ever
// treated as content to study: put in a textarea, sent to the tutor as a quoted
// sentence, or stored as a vocabulary item. Nothing in a payload chooses which
// provider is called or what happens to a key.

const HANDOFF_ACTIONS = ["article", "sentence", "discuss", "word"];
const EXT_ORIGIN_TAG = "linguamap-ext";

// Cap what a single handoff can carry. The Reader itself truncates at 20k, and
// an unbounded paste from a hostile page should not be able to fill localStorage.
const clampText = (s, n) => String(s == null ? "" : s).slice(0, n);

function normalizeHandoff(raw) {
  if (!raw || typeof raw !== "object") return null;
  const action = String(raw.action || "").toLowerCase();
  if (!HANDOFF_ACTIONS.includes(action)) return null;
  const text = clampText(raw.text, action === "article" ? 40000 : 2000).trim();
  if (!text) return null;
  return {
    action,
    text,
    url: clampText(raw.url, 500),
    title: clampText(raw.title, 300),
    mode: raw.mode === "voice" ? "voice" : "text",
    ts: Date.now()
  };
}

// Route 2 and 3: whatever is in the address bar when the app loads.
// Web Share Target (GET) delivers title/text/url; a share of an article often
// puts the URL in `text` rather than `url`, so both are checked.
function handoffFromUrl() {
  let params;
  try { params = new URLSearchParams(location.search); } catch (e) { return null; }
  if (!params.toString()) return null;
  const text = params.get("text") || "";
  const url = params.get("url") || "";
  const title = params.get("title") || "";
  let action = params.get("lm") || "";
  if (!action) {
    if (!text && !url && !title) return null;
    // Shared from the system share sheet with no explicit action: a bare URL is
    // an article to read, one word is vocabulary, a short run of text is a
    // sentence for the lab, anything longer is an article.
    const body = (text || url || title).trim();
    if (/^https?:\/\/\S+$/.test(body)) action = "article";
    else if (!/\s/.test(body)) action = "word";
    else if (body.length < 200) action = "sentence";
    else action = "article";
  }
  const out = normalizeHandoff({ action, text: text || title || url, url: url || (/^https?:\/\//.test(text) ? text : ""), title });
  // Leave a clean address bar behind, and do not re-fire on reload.
  try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {}
  return out;
}

// A shared URL with no article text still has to be fetched. The Reader already
// knows how; this just parks the URL there and lets the user press Fetch, which
// keeps the "we only contact the proxy when you ask" promise intact.
function applyHandoff(h, ctx) {
  const { S, nav, setLabInput, setLucySeed, setVoiceRequest, bumpReader, notify } = ctx;
  const tgtName = (TARGET_LANGS.find(l => l.code === S.target) || {}).name || S.target;

  if (h.action === "article") {
    const looksLikeUrl = /^https?:\/\/\S+$/.test(h.text);
    if (looksLikeUrl || (!h.text && h.url)) {
      jset(KEYS.readerUrl, looksLikeUrl ? h.text : h.url);
    } else {
      jset(KEYS.readerText, h.text);
      if (h.url) jset(KEYS.readerUrl, h.url);
    }
    nav("reader");
    // The Reader keeps its own copy of the text, so it has to be told to pick up
    // what was just written — whether it is about to mount or already open.
    ctx.bumpReader();
    notify(UI.handoffReader);
    return;
  }
  if (h.action === "sentence") {
    setLabInput(h.text);
    nav("lab");
    notify(UI.handoffLab);
    return;
  }
  if (h.action === "discuss") {
    const src = h.url ? `\n(source: ${h.url})` : "";
    setLucySeed(`Let's talk about this in ${tgtName}, at my level. First give me the gist in one or two sentences, then ask me a question about it:\n\n"${h.text}"${src}`);
    if (h.mode === "voice") setVoiceRequest(Date.now());
    nav("lucy");
    notify(UI.handoffLucy);
    return;
  }
  if (h.action === "word") {
    const term = cleanWord(h.text.split(/\s+/)[0] || h.text);
    if (!term) return;
    const add = (gloss) => {
      const vocab = jget(KEYS.vocab, []);
      const next = [{ term, gloss, lang: S.target, ts: Date.now(), src: h.url || "" },
        ...vocab.filter(x => x.term !== term)];
      jset(KEYS.vocab, next);
      syncCards(next, jget(KEYS.mistakes, []));      // straight into the review queue
      notify(UI.handoffVocab + " · " + term);
    };
    // Save immediately so nothing is lost if the lookup fails, then fill in the
    // meaning when it comes back.
    add("");
    lookupWord(term, S).then(g => {
      const vocab = jget(KEYS.vocab, []);
      const i = vocab.findIndex(x => x.term === term);
      if (i < 0) return;
      vocab[i] = { ...vocab[i], gloss: g.primary, gloss2: g.secondary || "", pos: g.pos || "" };
      jset(KEYS.vocab, vocab);
      syncCards(vocab, jget(KEYS.mistakes, []));
    }).catch(() => {});
  }
}

// A short confirmation, because every one of these actions navigates somewhere
// and silent navigation is disorienting.
function HandoffToast({ msg }) {
  const T = React.useContext(ThemeCtx);
  if (!msg) return null;
  return ReactDOM.createPortal(
    <div style={{ position:"fixed", left:"50%", transform:"translateX(-50%)", bottom:"calc(env(safe-area-inset-bottom) + 84px)",
      zIndex:200, padding:"9px 16px", borderRadius:99, fontSize:12.5, fontWeight:600,
      background:T.accent, color:T.accentText, boxShadow:"0 10px 30px #0008", pointerEvents:"none" }}>
      {msg}
    </div>, document.body);
}

function useHandoff(ctx) {
  const [toast, setToast] = React.useState(null);
  const ctxRef = React.useRef(ctx);
  ctxRef.current = ctx;

  const notify = React.useCallback((m) => {
    setToast(m);
    setTimeout(() => setToast(t => (t === m ? null : t)), 2600);
  }, []);

  const handle = React.useCallback((raw) => {
    const h = normalizeHandoff(raw);
    if (!h) return false;
    applyHandoff(h, { ...ctxRef.current, notify });
    return true;
  }, [notify]);

  React.useEffect(() => {
    const fromUrl = handoffFromUrl();
    if (fromUrl) handle(fromUrl);

    // The extension's content script shares this window. Same-origin only: a
    // message from an iframe or another window is ignored.
    const onMsg = (e) => {
      if (e.source !== window) return;
      const d = e.data;
      if (!d || d.source !== EXT_ORIGIN_TAG || !d.payload) return;
      const ok = handle(d.payload);
      // Tell the extension it landed, so the same article is not replayed on the
      // next visit.
      if (ok) window.postMessage({ source: "linguamap-app", ack: d.id || true }, location.origin);
    };
    window.addEventListener("message", onMsg);
    // The content script may have run before React mounted.
    window.postMessage({ source: "linguamap-app", ready: true }, location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, [handle]);

  return { toast };
}
