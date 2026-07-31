const DEFAULT_APP_URL = "https://gaborkalmar83.github.io/Lucy/";
const $ = (id) => document.getElementById(id);

const originPattern = (url) => {
  const u = new URL(url);
  return u.origin + "/*";
};

function show(msg, cls) {
  const el = $("status");
  el.textContent = msg;
  el.className = "status " + (cls || "");
}

async function refresh() {
  const { appUrl } = await chrome.storage.sync.get("appUrl");
  const url = appUrl || DEFAULT_APP_URL;
  $("url").value = url;
  try {
    const has = await chrome.permissions.contains({ origins: [originPattern(url)] });
    show(has ? "✓ Ready — right-click any page to send it over." : "⚠ Access not granted yet. Press Save & grant access.",
      has ? "ok" : "warn");
  } catch (e) { show("That does not look like a valid address.", "warn"); }
}

$("save").addEventListener("click", async () => {
  const url = $("url").value.trim();
  let pattern;
  try { pattern = originPattern(url); }
  catch (e) { return show("That does not look like a valid address.", "warn"); }
  await chrome.storage.sync.set({ appUrl: url });
  // Must be requested from a user gesture, which is why it lives on the button.
  const granted = await chrome.permissions.request({ origins: [pattern] });
  chrome.runtime.sendMessage({ type: "lm-menus" });
  show(granted ? "✓ Saved. Right-click any page to send it over." : "⚠ Saved, but access was declined — sending will not work until it is granted.",
    granted ? "ok" : "warn");
});

$("open").addEventListener("click", async () => {
  const { appUrl } = await chrome.storage.sync.get("appUrl");
  chrome.tabs.create({ url: appUrl || DEFAULT_APP_URL });
});

refresh();
