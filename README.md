# LinguaMap — Grammar Studio

A grammar map, sentence lab, AI tutor and spaced-repetition trainer for learning
European languages. Dutch ships with a fully curated grammar map (65 rules across
12 clusters); the other 13 languages work through the AI features.

Everything runs in your browser. No account, no server, no tracking. Your
vocabulary, review schedule and API keys stay in your own browser's storage and
are never sent anywhere except to the model provider you pick.

---

## Quick start for users

### 1. Open it

Visit the site (see [Publishing](#publishing-to-github-pages) for your own copy):

```
https://<your-github-username>.github.io/<repo-name>/
```

The **Grammar Map** works immediately, offline, with no setup at all.
The AI features — Sentence Lab, Lucy, Practice, word lookups — need a language
model, which you choose in **Settings (⚙)**.

### 2. Pick a model provider

Open **⚙ → Provider**. Options, easiest first:

| Provider | Cost | Notes |
|---|---|---|
| **OpenRouter** | Free tier available | Easiest start. Sign up at [openrouter.ai](https://openrouter.ai), create a key, paste it in, click **Load models**, choose the **Free** tier. |
| **Anthropic** | Paid | Key from [console.anthropic.com](https://console.anthropic.com). |
| **OpenAI** | Paid | Key from [platform.openai.com](https://platform.openai.com). |
| **Local LLM** | Free, private | Ollama or LM Studio on your PC. No key, nothing leaves your machine. See below. |
| **Built-in Claude** | — | Only works inside the Claude app, not on the website. |

Your key is stored only in your browser. It is never uploaded anywhere except
directly to that provider.

### 3. Install it on your Android phone

1. Open the site in **Chrome** on Android.
2. Tap the **⋮** menu → **Add to Home screen** (or tap the **⬇ Install** button
   in the app's header when it appears).
3. Launch it from the home screen — it opens fullscreen, like an app, and works
   offline.

The bottom tab bar gives you Map · Lab · Lucy · Review · Reader · Progress. The
Review tab shows a badge with how many cards are due.

> **Tip:** set your provider up on the PC first, then use **⚙ → Backup** to move
> your data across (see [Moving between devices](#moving-between-devices)).

### 4. Install it on Windows

Open the site in **Chrome** or **Edge**, then click the **install icon** in the
address bar (or **⋮ → Cast, save and share → Install page as app** in Chrome;
**⋯ → Apps → Install this site as an app** in Edge). It gets a Start-menu entry
and its own window.

---

## Using it day to day

**Grammar Map** — 65 Dutch rules in 12 clusters. Each rule has the rule itself,
*why it exists*, colour-coded example sentences, exceptions and cross-links.
Search and filter by CEFR level. Tap 🔊 to hear any example.

**Sentence Lab** — write a sentence, get a verdict: which rules you applied
correctly and which you broke, each linking back to the map. Feeds your mastery
stats. 🎤 lets you dictate instead of typing.

**Lucy** — a conversational tutor. 16 one-tap actions (conjugate, deep dive,
timelines, roleplay, cloze drills, recap…). Tap any word in her replies for a
gloss and a **+ vocab** button. Her corrections become review cards automatically.

**Reader** — paste any text (an article, song lyrics, a WhatsApp message). Tap a
word for an instant gloss, or send a whole sentence to the Lab or to Lucy.

**Review** — spaced repetition (SM-2). Everything you save and every correction
Lucy makes turns up here at the right time. Grade with **Again / Hard / Good /
Easy**; on a keyboard, `space` reveals and `1`–`4` grade.

**Progress** — streak, XP, daily goal, a 12-week activity grid, and per-rule
mastery showing exactly what needs work. Tap ✏️ next to a weak rule to drill it.

### Shortcuts (desktop)

| Key | Action |
|---|---|
| `Ctrl`+`K` | Command palette — jump to any rule or view |
| `1` – `6` | Switch view |
| `Ctrl`+`,` | Settings |
| `space` / `1`–`4` | Reveal / grade a review card |

### Deep links

Every rule has its own address, so you can bookmark or share it:

```
#/map/de_het          a specific rule
#/review              today's review session
#/practice/de_het     drills for one rule
```

---

## Moving between devices

Your data lives in one browser only — it does **not** sync automatically between
your PC and your phone.

To move it: **⚙ → Backup → ⬇ Export all data**, then open the file on the other
device with **⬆ Import data**.

The normal export **deliberately leaves your API keys out**, so the file is safe
to email to yourself or drop in cloud storage. You just re-enter the key once on
the new device. Importing a key-free backup never erases a key already set up on
that device.

The `⬇ + 🔑` button includes the keys. Only use it for a backup you keep
private — never email it, upload it, or put it in a shared folder.

---

## Using a local model (private, free, no key)

Nothing leaves your PC with this setup.

**Ollama** (Windows):

```powershell
winget install Ollama.Ollama
ollama pull llama3.1
```

Ollama serves an OpenAI-compatible API on `http://localhost:11434/v1`. In
LinguaMap: **⚙ → Provider → Local LLM**, Base URL `http://localhost:11434/v1`,
Model `llama3.1`.

**LM Studio**: start its local server, then use the URL it shows (usually
`http://localhost:1234/v1`).

Two caveats:

- A site served over **https** cannot call a plain **http://localhost** endpoint
  in some browsers. If a local model fails on the hosted site, use the
  `linguamap-standalone.html` file (below) or run the site locally instead.
- Your phone can't reach `localhost` on your PC. Use your PC's LAN address
  (e.g. `http://192.168.1.20:11434/v1`) and configure Ollama to listen on it
  (`OLLAMA_HOST=0.0.0.0`).

---

## The single-file version

`docs/linguamap-standalone.html` is the whole app — code, fonts and all — in one
file with **zero external requests**. Double-click it to run from disk, or paste
it into a Claude artifact. Same features, same URL structure.

---

## Publishing to GitHub Pages

Everything below is run from the project folder in **PowerShell**.

### One-time setup

**1. Install Git** (if you haven't):

```powershell
winget install Git.Git
```

Close and reopen PowerShell afterwards.

**2. Tell Git who you are:**

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**3. Create an empty repository on GitHub** at
[github.com/new](https://github.com/new). Name it e.g. `linguamap`. Do **not**
tick "Add a README" — this project already has one.

**4. Connect and push:**

```powershell
git remote add origin https://github.com/<your-username>/linguamap.git
git branch -M main
git push -u origin main
```

Git will open a browser window to sign you in the first time.

**5. Turn on Pages:** in your repository → **Settings** → **Pages** →
**Source: Deploy from a branch** → Branch **`main`**, folder **`/docs`** → **Save**.

Wait a minute, then your app is live at
`https://<your-username>.github.io/linguamap/`.

### Publishing changes later

```powershell
npm run build
git add -A
git commit -m "Describe what changed"
git push
```

GitHub Pages redeploys automatically within a minute. The app's service worker
picks up new versions on the next load.

> **Why there is no CI workflow.** `docs/` is committed already built, so Pages
> can serve it directly with **Source: Deploy from a branch**. A GitHub Actions
> workflow would need **Source: GitHub Actions** instead — and if the two are
> mismatched the run fails with *"Get Pages site failed… verify that the
> repository has Pages enabled and configured to build using GitHub Actions"*.
> One method, no ambiguity. Just remember to run `npm run build` before you
> commit.

---

## Security and privacy

What was checked and what holds:

- **No secrets in the repository.** The code contains no API keys, and none of
  the committed files reference one. Keys only ever exist in your browser's
  `localStorage`, typed in by you.
- **Backups exclude keys by default** (see [Moving between devices](#moving-between-devices)),
  so the file you carry between your PC and phone can't leak a credential.
- **No third-party code at runtime.** React is vendored into the repository; no
  CDN, no analytics, no trackers, no fonts fetched from Google. The app makes
  exactly one kind of outbound request: to the model provider you configured.
- **A Content-Security-Policy** on the hosted page restricts scripts, styles,
  images and fonts to the app's own origin. `connect-src` stays open because you
  choose the model endpoint, including one on your own network.
- **Model output is escaped**, not injected as HTML. There is no
  `innerHTML`, no `eval`, and no `dangerouslySetInnerHTML` anywhere in the code,
  so a malicious model reply cannot execute script or read your key.
- **The service worker never caches provider responses** — it ignores every
  cross-origin request, so your conversations are not written to disk by it.

Things worth knowing:

- **Your published site is public.** Anyone can visit it, but they'd use their
  own key — there is nothing of yours on the server, because there is no server.
  Do not commit a key "to make it easier for friends"; it would be public
  immediately and permanently in the Git history.
- **Anyone with access to your unlocked browser profile can read the key**, as
  with any browser-stored credential. On a shared computer, prefer OpenRouter
  with a spend limit, or a local model.
- **Direct browser calls to Anthropic/OpenAI** send your key from the browser, so
  it is visible in the browser's own network inspector. That is inherent to a
  no-server app. Use a key with a spending cap, and revoke it if in doubt.
- `.claude/settings.local.json` is machine-specific and is **not** committed.

---

## Development

```powershell
npm install
npm run build      # → docs/ (site) and docs/linguamap-standalone.html
npm run dev        # unminified build, easier to debug
npm start          # serve docs/ at http://localhost:4173
```

Source lives in `src/` and is concatenated in a fixed order (each file attaches
its exports to `window`), compiled from JSX with Babel and minified with Terser.
`docs/` is committed so GitHub Pages can serve it with no build step.

```
src/
  data/clusters-{a,b,c}.js   Dutch grammar data (65 rules)
  core.jsx                   themes, languages, i18n, LLM providers, usage
  store.jsx                  persistence, routing, SRS, progress, speech
  views.jsx                  Review · Progress · Reader · Practice · palette
  lab.jsx                    Sentence Lab
  lucy.jsx                   conversational tutor
  shell.jsx                  app shell, map, drawer, settings, navigation
tools/build.mjs              build script (site + standalone + service worker)
```

After editing anything in `src/`, run `npm run build` — the browser loads
`docs/`, not `src/`.

## Licence

MIT for the application code. The Dutch grammar content is authored for this
project.
