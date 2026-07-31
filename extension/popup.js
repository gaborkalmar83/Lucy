// Same four actions as the context menu, for when there is nothing selected or
// the right-click menu is awkward (touch screens, kiosk-ish pages).
const $ = (id) => document.getElementById(id);

function grabSelection() {
  const sel = String(window.getSelection() || "").trim();
  const pick = document.querySelector("article, main, [role=main]") || document.body;
  const clone = pick.cloneNode(true);
  clone.querySelectorAll("script,style,nav,header,footer,aside,form,noscript,iframe,figure,button").forEach(n => n.remove());
  return {
    selection: sel,
    text: (clone.innerText || "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(),
    title: document.title || "",
    url: location.href
  };
}

let page = null;

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;
  try {
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: grabSelection });
    page = res && res.result;
  } catch (e) { page = null; }
  if (!page) { $("sel").textContent = "cannot read this page"; return; }
  $("sel").textContent = page.selection ? "“" + page.selection.slice(0, 60) + "”" : "whole page";
  // Only meaningful with a selection.
  $("word").disabled = !page.selection;
  $("sentence").disabled = !page.selection;
}

const send = (payload) => {
  chrome.runtime.sendMessage({ type: "lm-send", payload }, () => window.close());
};
const body = () => (page.selection || page.text);

$("article").addEventListener("click", () => send({ action: "article", text: body(), title: page.title, url: page.url }));
$("sentence").addEventListener("click", () => send({ action: "sentence", text: page.selection, url: page.url }));
$("discuss").addEventListener("click", () => send({ action: "discuss", text: body().slice(0, 4000), url: page.url, title: page.title }));
$("voice").addEventListener("click", () => send({ action: "discuss", mode: "voice", text: body().slice(0, 4000), url: page.url, title: page.title }));
$("word").addEventListener("click", () => send({ action: "word", text: page.selection.split(/\s+/)[0], url: page.url }));
$("opts").addEventListener("click", () => chrome.runtime.openOptionsPage());

load();
