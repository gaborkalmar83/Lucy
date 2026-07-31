// Encrypted credential vault.
//
// API keys used to sit in localStorage as plain text, which means anything that
// can read the origin's storage — a bookmarklet, a shared browser profile, a
// synced-and-then-exported storage dump, a screenshot of DevTools — reads the
// key. This module keeps them as AES-GCM ciphertext instead.
//
// Two modes, and the difference matters:
//
//   device  — the AES key is a non-extractable CryptoKey kept in IndexedDB. The
//             browser will not hand its bytes back to any script, so the key
//             cannot be copied out, and nothing readable ever touches disk.
//             It does NOT defend against code running on this origin: such code
//             can ask the browser to decrypt. It defends against everything that
//             merely *reads* storage.
//
//   pass    — the AES key is derived from a passphrase (PBKDF2-SHA256, 250k
//             iterations) and exists only in memory for the session. Nothing on
//             disk can be decrypted without the passphrase, including by someone
//             with the whole profile directory. This is the real protection.
//
// Honesty note carried into the UI: no browser-only app can hide a key from its
// own page. Encryption at rest raises the floor; it does not make a shared or
// compromised machine safe.

const VAULT_LS = "lm3:vault";
const VAULT_DB = "lm3-vault";
const VAULT_STORE = "keys";
const VAULT_ID = "master";
const VAULT_ITER = 250000;

// Every secret the app holds, as a path into the settings object.
const VAULT_FIELDS = ["anthropicKey", "openaiKey", "openrouterKey", "azureKey",
  "voice.azureKey", "voice.openaiKey"];

const Vault = (function () {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (buf) => { let s = ""; new Uint8Array(buf).forEach(b => s += String.fromCharCode(b)); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const subtle = () => (typeof crypto !== "undefined" && crypto.subtle) ? crypto.subtle : null;

  let KEY = null;            // CryptoKey, or null while locked
  let SECRETS = {};          // path → value, in memory only
  let MODE = "device";       // device | pass | plain
  let LOCKED = false;        // pass mode, not yet unlocked
  let SALT = null;
  let dirty = false, saving = null;

  // ── IndexedDB, just enough of it to hold one key ──────────────────────────
  function idb(mode, fn) {
    return new Promise((res, rej) => {
      if (typeof indexedDB === "undefined") return rej(new Error("no indexedDB"));
      const open = indexedDB.open(VAULT_DB, 1);
      open.onupgradeneeded = () => open.result.createObjectStore(VAULT_STORE);
      open.onerror = () => rej(open.error);
      open.onsuccess = () => {
        try {
          const db = open.result;
          const tx = db.transaction(VAULT_STORE, mode);
          const rq = fn(tx.objectStore(VAULT_STORE));
          rq.onsuccess = () => res(rq.result);
          rq.onerror = () => rej(rq.error);
          tx.oncomplete = () => db.close();
        } catch (e) { rej(e); }
      };
    });
  }
  async function deviceKey(create) {
    let k = null;
    try { k = await idb("readonly", st => st.get(VAULT_ID)); } catch (e) { k = null; }
    if (k) return k;
    if (!create) return null;
    k = await subtle().generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    try { await idb("readwrite", st => st.put(k, VAULT_ID)); } catch (e) { /* private mode → session-only key */ }
    return k;
  }
  async function passKey(pw, salt) {
    const base = await subtle().importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveKey"]);
    return subtle().deriveKey({ name: "PBKDF2", salt, iterations: VAULT_ITER, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }

  const meta = () => { try { return JSON.parse(localStorage.getItem(VAULT_LS) || "null"); } catch (e) { return null; } };
  const putMeta = (m) => { try { localStorage.setItem(VAULT_LS, JSON.stringify(m)); } catch (e) {} };

  async function encryptTo(key, obj, mode, salt) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await subtle().encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
    const m = { v: 1, mode, iv: b64(iv), ct: b64(ct) };
    if (salt) m.salt = b64(salt);
    return m;
  }
  async function decryptFrom(key, m) {
    const out = await subtle().decrypt({ name: "AES-GCM", iv: unb64(m.iv) }, key, unb64(m.ct));
    return JSON.parse(dec.decode(out));
  }

  // ── settings ↔ vault ──────────────────────────────────────────────────────
  const getPath = (o, p) => p.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
  function setPath(o, p, v) {
    const parts = p.split("."); let cur = o;
    for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...(cur[parts[i]] || {}) }; cur = cur[parts[i]]; }
    cur[parts[parts.length - 1]] = v;
  }

  function flush() {
    if (!dirty || LOCKED || !KEY) return saving || Promise.resolve();
    dirty = false;
    saving = (async () => {
      if (MODE === "plain") { putMeta({ v: 1, mode: "plain", data: SECRETS }); return; }
      putMeta(await encryptTo(KEY, SECRETS, MODE, MODE === "pass" ? SALT : null));
    })().catch(() => {});
    return saving;
  }

  return {
    // Boot: pick up the stored vault, or create a device key and migrate any
    // plaintext keys left over from an older version of the app.
    async init() {
      const m = meta();
      if (!subtle()) {
        // Insecure context (plain http, not localhost). Crypto is unavailable;
        // fall back to the old behaviour rather than losing the user's keys, and
        // flag it so the UI can say so plainly.
        MODE = "plain";
        SECRETS = (m && m.mode === "plain" && m.data) ? m.data : {};
      } else if (m && m.mode === "pass") {
        MODE = "pass"; LOCKED = true; SALT = unb64(m.salt);
      } else if (m && m.mode === "device") {
        MODE = "device";
        try {
          KEY = await deviceKey(false);
          SECRETS = KEY ? await decryptFrom(KEY, m) : {};
        } catch (e) { SECRETS = {}; }         // key gone (storage cleared) → keys are simply lost
        if (!KEY) KEY = await deviceKey(true);
      } else if (m && m.mode === "plain") {
        MODE = "device"; KEY = await deviceKey(true); SECRETS = m.data || {}; dirty = true;
      } else {
        MODE = "device"; KEY = await deviceKey(true); SECRETS = {};
      }
      this.migrate();
      await flush();
      return this.state();
    },

    // Older builds wrote the keys straight into the settings blob. Move them in
    // and blank them there, once.
    migrate() {
      if (LOCKED) return;
      let s = null;
      try { s = JSON.parse(localStorage.getItem("dgs2") || "null"); } catch (e) { return; }
      if (!s) return;
      let moved = false;
      VAULT_FIELDS.forEach(f => {
        const v = getPath(s, f);
        if (typeof v === "string" && v) { SECRETS[f] = v; setPath(s, f, ""); moved = true; }
      });
      if (moved) {
        dirty = true;
        try { localStorage.setItem("dgs2", JSON.stringify(s)); } catch (e) {}
      }
    },

    state() { return { mode: MODE, locked: LOCKED, encrypted: MODE !== "plain", hasPass: MODE === "pass" }; },
    locked() { return LOCKED; },
    mode() { return MODE; },

    // Give up on the passphrase for this session: the app runs, minus any
    // provider that needs a key.
    skip() { LOCKED = false; KEY = null; SECRETS = {}; },

    async unlock(pw) {
      const m = meta();
      if (!m || m.mode !== "pass") return false;
      const key = await passKey(pw, unb64(m.salt));
      let data;
      try { data = await decryptFrom(key, m); }
      catch (e) { return false; }             // wrong passphrase — GCM auth fails
      KEY = key; SECRETS = data || {}; SALT = unb64(m.salt); LOCKED = false;
      this.migrate(); await flush();
      return true;
    },

    async setPassphrase(pw) {
      if (!subtle()) throw new Error("Encryption is unavailable in this context");
      if (!pw || pw.length < 6) throw new Error("Use at least 6 characters");
      SALT = crypto.getRandomValues(new Uint8Array(16));
      KEY = await passKey(pw, SALT); MODE = "pass"; LOCKED = false;
      putMeta(await encryptTo(KEY, SECRETS, "pass", SALT));
      try { await idb("readwrite", st => st.delete(VAULT_ID)); } catch (e) {}
      return true;
    },
    // Drop back to the device key. Only possible while unlocked, so knowing the
    // passphrase is implied.
    async clearPassphrase() {
      if (LOCKED) throw new Error("Unlock first");
      MODE = "device"; SALT = null;
      KEY = await deviceKey(true);
      putMeta(await encryptTo(KEY, SECRETS, "device"));
      return true;
    },

    // Read secrets back into a settings object (a copy — never mutates input).
    inject(settings) {
      if (LOCKED) return settings;
      const out = { ...settings };
      VAULT_FIELDS.forEach(f => { if (SECRETS[f]) setPath(out, f, SECRETS[f]); });
      return out;
    },
    // Take secrets out of a settings object before it is written to disk.
    // Synchronous by design (saveSettings is sync); the encrypt is queued.
    absorb(settings) {
      if (LOCKED) return settings;
      const out = { ...settings };
      VAULT_FIELDS.forEach(f => {
        const v = getPath(settings, f);
        if (typeof v !== "string") return;
        if (SECRETS[f] !== v) { SECRETS[f] = v; dirty = true; }
        if (v) setPath(out, f, "");
      });
      flush();
      return out;
    },
    has(field) { return !!SECRETS[field]; },
    // Wipe every stored credential.
    async purge() {
      SECRETS = {}; dirty = true;
      await flush();
      try { localStorage.removeItem(VAULT_LS); } catch (e) {}
      try { await idb("readwrite", st => st.delete(VAULT_ID)); } catch (e) {}
      MODE = "device"; LOCKED = false; KEY = await deviceKey(true);
    }
  };
})();
window.Vault = Vault;
