// LinguaMap browser extension — service worker.
//
// Deliberately thin: it collects text and hands it to the app. It holds no API
// keys and calls no model. Everything is done by whatever provider you have
// configured inside LinguaMap, using the keys stored (encrypted) there. That is
// the whole reason the payload travels to the app rather than the extension
// talking to a provider itself — one place to configure, one place keys live.

const DEFAULT_APP_URL = "https://gaborkalmar83.github.io/Lucy/";

const MENUS = [
  { id: "lm-article-page", title: "Send this page to Reader",        contexts: ["page", "link"] },
  { id: "lm-article-sel",  title: "Send selection to Reader",        contexts: ["selection"] },
  { id: "lm-sentence",     title: "Send sentence to Sentence Lab",   contexts: ["selection"] },
  { id: "lm-discuss",      title: "Discuss with Lucy",               contexts: ["selection", "page"] },
  { id: "lm-discuss-voice",title: "Discuss with Lucy (voice)",       contexts: ["selection", "page"] },
  { id: "lm-word",         title: "Save word to vocabulary",         contexts: ["selection"] }
];

async function appUrl() {
  const { appUrl } = await chrome.storage.sync.get("appUrl");
  return (appUrl || DEFAULT_APP_URL).trim();
}

function buildMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "lm-root", title: "LinguaMap", contexts: ["page", "selection", "link"] });
    MENUS.forEach(m => chrome.contextMenus.create({ ...m, parentId: "lm-root" }));
  });
}
chrome.runtime.onInstalled.addListener(buildMenus);
chrome.runtime.onStartup.addListener(buildMenus);

// ── Reading the page ─────────────────────────────────────────────────────────
// Runs inside the source page. Kept simple on purpose — the app's Reader does
// its own cleanup, and a heavyweight extractor bundled here would be one more
// thing to keep correct.
function extractArticle() {
  const pick = document.querySelector("article, main, [role=main]") || document.body;
  const clone = pick.cloneNode(true);
  clone.querySelectorAll("script,style,nav,header,footer,aside,form,noscript,iframe,figure,button").forEach(n => n.remove());
  const text = (clone.innerText || "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, title: document.title || "", url: location.href };
}

// ── Delivering to the app ────────────────────────────────────────────────────
// Injected into the LinguaMap tab. The app may still be booting, so this retries
// until the page acknowledges, then stops.
function deliver(payload) {
  let tries = 0;
  const id = "lm-" + Date.now();
  const onAck = (e) => {
    if (e.source === window && e.data && e.data.source === "linguamap-app" && e.data.ack) {
      window.removeEventListener("message", onAck);
      clearInterval(timer);
    }
  };
  window.addEventListener("message", onAck);
  const push = () => {
    if (++tries > 30) { clearInterval(timer); window.removeEventListener("message", onAck); return; }
    window.postMessage({ source: "linguamap-ext", id, payload }, location.origin);
  };
  const timer = setInterval(push, 300);
  push();
}

// Reuse an open LinguaMap tab instead of piling up new ones — the app keeps
// conversation and reader state, and a fresh tab would look like a reset.
async function openApp(url) {
  const base = new URL(url);
  const tabs = await chrome.tabs.query({});
  const match = tabs.find(t => {
    try { const u = new URL(t.url); return u.origin === base.origin && u.pathname === base.pathname; }
    catch (e) { return false; }
  });
  if (match) {
    await chrome.tabs.update(match.id, { active: true });
    await chrome.windows.update(match.windowId, { focused: true });
    return match.id;
  }
  const created = await chrome.tabs.create({ url });
  // Wait for the document to exist before injecting into it.
  await new Promise(res => {
    const done = (tabId, info) => {
      if (tabId === created.id && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(done); res();
      }
    };
    chrome.tabs.onUpdated.addListener(done);
    setTimeout(() => { chrome.tabs.onUpdated.removeListener(done); res(); }, 15000);
  });
  return created.id;
}

async function sendToApp(payload) {
  const url = await appUrl();
  const origin = new URL(url).origin + "/*";
  const granted = await chrome.permissions.contains({ origins: [origin] });
  if (!granted) {
    // Cannot inject without permission for the app's own origin. The options
    // page is where that is granted, so send the user there rather than failing
    // silently.
    chrome.runtime.openOptionsPage();
    return;
  }
  const tabId = await openApp(url);
  if (!tabId) return;
  await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: deliver,
    args: [payload]
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selection = (info.selectionText || "").trim();
  let payload = null;

  if (info.menuItemId === "lm-article-page" || (info.menuItemId === "lm-article-sel" && !selection)) {
    if (info.linkUrl && info.menuItemId === "lm-article-page" && !selection) {
      // Right-clicked a link: hand the URL over and let the Reader fetch it.
      payload = { action: "article", text: info.linkUrl, url: info.linkUrl };
    } else {
      const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractArticle });
      const got = res && res.result;
      if (!got || !got.text) return;
      payload = { action: "article", text: got.text, title: got.title, url: got.url };
    }
  } else if (info.menuItemId === "lm-article-sel") {
    payload = { action: "article", text: selection, url: info.pageUrl, title: tab && tab.title };
  } else if (info.menuItemId === "lm-sentence") {
    payload = { action: "sentence", text: selection, url: info.pageUrl };
  } else if (info.menuItemId === "lm-discuss" || info.menuItemId === "lm-discuss-voice") {
    let text = selection;
    if (!text) {
      const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractArticle });
      text = ((res && res.result && res.result.text) || "").slice(0, 4000);
    }
    if (!text) return;
    payload = { action: "discuss", text, url: info.pageUrl, title: tab && tab.title,
      mode: info.menuItemId === "lm-discuss-voice" ? "voice" : "text" };
  } else if (info.menuItemId === "lm-word") {
    payload = { action: "word", text: selection.split(/\s+/)[0] || selection, url: info.pageUrl };
  }

  if (payload) sendToApp(payload);
});

// The popup uses the same path, so the toolbar button and the context menu
// cannot drift apart.
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg && msg.type === "lm-send" && msg.payload) {
    sendToApp(msg.payload).then(() => respond({ ok: true })).catch(e => respond({ ok: false, error: String(e) }));
    return true;
  }
  if (msg && msg.type === "lm-menus") { buildMenus(); respond({ ok: true }); }
});
