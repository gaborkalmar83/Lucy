# LinguaMap — Grammar Studio

**A language-learning app that explains *why*, not just *what*.**

Most apps tell you a sentence is wrong. This one shows you which rule you broke,
why that rule exists, gives you drills for it, and then brings it back days later
when you're about to forget it.

**Dutch, English and Hungarian** each come with a hand-written grammar map —
75, 41 and 63 rules. Thirteen further European languages work through the AI
features.

Everything runs in your browser — no account, no server, no tracking — and you
plug in whichever AI model you like, including a free one or one running on your
own PC.

---

## What it actually does

### 🗺️ Grammar Map — the reference that explains itself

Hand-written maps for three languages:

| Language | Rules | Covers |
|---|---|---|
| 🇳🇱 Dutch | 75 in 22 clusters | *de/het*, word order, perfect vs imperfect, modals, separable verbs, prepositions, relative clauses, modal particles |
| 🇬🇧 English | 41 in 12 clusters | articles, tense system, perfect aspect, conditionals, phrasal verbs |
| 🇭🇺 Hungarian | 63 in 17 clusters | vowel harmony, the full case system, definite vs indefinite conjugation, possession, verbal prefixes, focus, participles, causatives, derivation |

Every rule gives you:

- **The rule**, in plain language
- **Why it exists** — the historical or structural reason, which is usually what
  makes it finally stick
- **Example sentences**, colour-coded by grammatical role (subject, finite verb,
  object…) so you can *see* the pattern
- **Exceptions and pitfalls**, flagged separately with ⚠
- **Links to related rules**, because grammar isn't a list, it's a web
- **Practice** and **Drill with Lucy** on every rule *and* every exception

Search it, filter by CEFR level (A1–C1), tap 🔊 to hear any example, and every
rule has its own link you can bookmark or share.

*Works fully offline with no AI and no setup.*

### 🔬 Sentence Lab — write a sentence, find out what you got wrong

Type or dictate a sentence. You get back:

- A verdict, and a corrected version you can listen to
- **Rules you applied correctly** ✓ — so you learn what you already know
- **Rules you broke** ✕, each explaining what went wrong and how to fix it
- Every rule links straight into the Grammar Map

Each analysis quietly feeds your mastery statistics, so the app builds a picture
of your actual weak spots over time.

### ✨ Lucy — a tutor you can talk to

A conversational tutor who replies in your target language with translations
line by line. When you slip, you get one correction — the most important one —
in a consistent format: what you said, what you should have said, the rule name,
and why.

Sixteen one-tap actions so you never have to think about what to ask:

| | | |
|---|---|---|
| 🔍 Explain last | 💡 Example | 🔄 Ask me |
| 🐢 Simpler | 🔥 Harder | 🎨 Annotate |
| 📚 Deep dive | 📊 Conjugate | 🕰️ Timelines |
| ↔️ Nearby tenses | ⭐ Verb of the day | 🎭 Roleplay |
| ✏️ Fill the gaps | 🗂️ Vocab tip | 🆕 New topic |
| 📋 Recap | | |

Tap any word in her replies for an instant meaning and a **+ vocab** button.
Speak to her with the microphone, have her read replies aloud, and export the
whole conversation as a transcript.

### 📖 Reader — learn from things you actually want to read

Paste a text **or pull an article straight from a URL** — a news story from
nos.nl, say. It is split into sentences and laid out in two columns, side by side:

- **Left:** the original, with word roles colour-coded when *Roles* is on
- **Right:** an idiomatic translation in both of your explanation languages
- **Hover any word** for its dictionary form, part of speech, grammatical role
  and meaning in both languages
- **+ vocab** on any word you don't know — straight into your review queue
- **🔬 Analyze** sends the sentence to the Sentence Lab; **✨ Ask Lucy** has it
  explained at your level

Translations are fetched per sentence, so you only pay for what you actually read.

### 🎙️ Voice mode — actually talk to Lucy

Open Lucy and press **🎙️ Voice mode**. Three engines, because only some
providers offer realtime speech:

| Engine | What you get | Who it works for |
|---|---|---|
| **Browser speech** | You speak, Lucy answers out loud, turn by turn | **Everyone** — including local models, OpenRouter, Anthropic |
| **Azure VoiceLive** | True speech-to-speech. Interrupt her mid-sentence and she stops and listens | Azure AI Foundry users |
| **OpenAI Realtime** | Same, on OpenAI | OpenAI API users |

Voice has its **own settings section**, separate from the text provider — its own
endpoint, key, model, voice and turn-detection tuning. Text mode and voice mode
work independently; they can use the same provider or two different ones.

Nothing is hard-coded: sensitivity, lead-in, silence-before-reply, echo
cancellation, noise suppression, speaking style and an extra instructions box
are all exposed, plus a raw **session JSON** override that is merged last for
anything the UI does not surface.

### 🔁 Review — so you don't forget it a week later

Proper spaced repetition (the SM-2 algorithm, same family as Anki). The clever
part: **you never build a deck.** Every word you save and every correction Lucy
makes becomes a card automatically. Grade each card *Again / Hard / Good / Easy*
and it comes back exactly when you're about to forget it.

### 📈 Progress — what to work on next

Streak, XP, daily goal and a 12-week activity grid. More usefully, a
**per-rule mastery** breakdown built from your real mistakes, with a
**"needs work"** list. Tap ✏️ next to any weak rule and the app generates
multiple-choice drills for exactly that rule.

It also reports **model usage**: tokens in and out, calls and tokens per second
broken down by provider and model, over the last 24 hours, 7 days or 30 days —
so you can see what a given model actually costs you.

### And throughout

- **Two explanation languages at once.** Set a second language (say Hungarian
  alongside English) and every explanation and correction appears in both —
  written for a speaker of that language, noting where it works the same or
  differently, never translated word for word.
- **Hover any word, anywhere** — in the map, in Lucy's replies, in the Reader —
  for its meaning in both languages plus its grammatical role. Lookups are
  cached, so a word is only ever fetched once.
- **Hear everything.** Any sentence, word, example or flashcard reads aloud.
- **Speak instead of typing** in the Lab and with Lucy.
- 17 target languages · 13 explanation languages (incl. Macedonian, Serbian and Russian) · 4 themes · CEFR levels
- **Any explanation language for the grammar map.** The maps are authored in
  English; pick any other language and it is translated once by your model and
  cached in your browser forever — never re-fetched, never leaves your device
- The word-roles bar can display in either of your explanation languages
- **Custom instructions** in Settings, added to every request (e.g. "always
  compare with German") without breaking the app's own output format
- **Debug readout** showing response time, tokens and tokens-per-second
- Works offline, installs to your phone or desktop like a real app

---

## Getting started

### 1. Open it

```
https://gaborkalmar83.github.io/Lucy/
```

The Grammar Map works instantly with no setup. The AI features — Lab, Lucy,
Reader lookups, Practice — need a language model, which you pick in **⚙ Settings**.

### 2. Choose who powers the AI

| Provider | Cost | Notes |
|---|---|---|
| **OpenRouter** | Free tier | Easiest start. Key from [openrouter.ai](https://openrouter.ai), paste it, click **Load models**, choose the **Free** tier. |
| **Anthropic** | Paid | Key from [console.anthropic.com](https://console.anthropic.com). |
| **OpenAI** | Paid | Key from [platform.openai.com](https://platform.openai.com). |
| **Azure AI Foundry** | Paid | Endpoint + key + deployment name. **Load deployments** fills the list for you. |
| **Local model** | Free, private | Ollama or LM Studio on your own PC — nothing leaves your machine. |
| **Built-in Claude** | — | Only inside the Claude app, not on the website. |

Your key is stored only in your browser and goes nowhere except to that provider.

### 3. Install it on your phone (Android)

Open the site in Chrome → **⋮** → **Add to Home screen**. It launches fullscreen
with a bottom tab bar and works offline. The Review tab shows a badge with how
many cards are due.

### 4. Install it on Windows

Open in Chrome or Edge and click the install icon in the address bar. You get a
Start-menu entry and its own window.

### Handy shortcuts (desktop)

| Key | Action |
|---|---|
| `Ctrl`+`K` | Command palette — jump to any rule or view |
| `1` – `6` | Switch view |
| `Ctrl`+`,` | Settings |
| `space` then `1`–`4` | Reveal and grade a review card |

---

## Setting up voice mode

### Azure VoiceLive (what you get if you already use Azure AI Foundry)

1. In the Azure portal, open your **Azure AI Foundry** resource (the same one
   whose endpoint looks like `https://<name>.services.ai.azure.com`).
2. Deploy a realtime voice model — `gpt-realtime` — in that resource.
3. Copy the resource **endpoint** and one of its **keys**.
4. In LinguaMap: **⚙ → Voice mode**, choose **Azure VoiceLive**, paste the
   endpoint and key, set the model to your deployment, and pick a voice
   (`nl-NL-FennaNeural` for Dutch, `en-US-Ava:DragonHDLatestNeural` for English).

The app connects to `wss://<your-resource>/voice-live/realtime` with the
api-version shown in Settings. If Microsoft moves the preview forward, change
that api-version field rather than waiting for an app update.

**Two things to know.** A browser cannot set headers on a WebSocket, so the key
travels as a query parameter — use a key you are willing to expose on your own
device, and rotate it if in doubt. And your resource may need this site added to
its **allowed origins / CORS** before the browser can connect.

### OpenAI Realtime

Choose **OpenAI Realtime**, paste an OpenAI key, model
`gpt-4o-realtime-preview`, and pick a voice (alloy, echo, shimmer…). OpenAI
authenticates browser WebSockets with a key in the subprotocol, which they
themselves label insecure — fine on your own machine, not on a shared one.

### Everyone else — local models, OpenRouter, Anthropic

These have no realtime speech API, so voice mode uses **browser speech**:
your microphone → the browser's speech recognition → your configured text model
→ the browser's speech synthesis. Nothing extra to set up, no additional key,
and it works with a model running on your own PC.

The trade-off is that it takes turns: Lucy waits for you to stop speaking before
replying, and you cannot interrupt her. Recognition quality is the browser's,
which is good in Chrome and weaker in Firefox.

### If voice will not start

- **Microphone blocked** — the site needs microphone permission, and browsers
  only grant it over https or on localhost.
- **Connects then drops** — usually a wrong api-version or a model that is not
  deployed in that resource. The error text is shown in the panel.
- **Silence** — lower the sensitivity, or raise "silence before reply" if she
  cuts you off mid-thought.

---

## Moving between your PC and phone

Your data lives in one browser — it does **not** sync automatically.

To move it: **⚙ → Backup → ⬇ Export all data**, then **⬆ Import data** on the
other device.

The normal export **deliberately leaves your API keys out**, so the file is safe
to email yourself or put in cloud storage; you re-enter the key once on the new
device. Importing a key-free backup never erases a key already set up there.

The `⬇ + 🔑` button includes keys — only for a backup you keep private.

---

## Using a local model (free, private, no key)

Nothing leaves your PC.

```powershell
winget install Ollama.Ollama
ollama pull llama3.1
```

Then **⚙ → Provider → Local LLM**, Base URL `http://localhost:11434/v1`, model
`llama3.1`. (LM Studio works too — use the URL its server shows.)

Two caveats:

- An **https** site can't call a plain **http://localhost** endpoint in some
  browsers. If that bites, use the standalone file below.
- Your **phone can't reach `localhost` on your PC** — use your PC's LAN address
  (e.g. `http://192.168.1.20:11434/v1`) and start Ollama with `OLLAMA_HOST=0.0.0.0`.

---

## The single-file version

`docs/linguamap-standalone.html` is the entire app — code, fonts and all — in one
file with **zero external requests**. Double-click to run it from disk, or paste
it into a Claude artifact. Same features, same links.

---

## Privacy

- No account, no server, no analytics, no trackers, no third-party scripts.
- Your vocabulary, review schedule, progress and API keys live in your browser's
  local storage and nowhere else.
- The only outbound request the app makes is to the AI provider you chose.
- Model replies are escaped, never injected as HTML, so a bad reply can't run
  code or read your key.
- A Content-Security-Policy restricts scripts, styles, images and fonts to the
  app's own origin.

Worth knowing: with a no-server app, calls to Anthropic/OpenAI send your key
straight from the browser, so it's visible in devtools. Use a key with a
spending cap. On a shared computer, prefer OpenRouter with a limit, or a local
model.

---

## Publishing your own copy

Fork or clone, then:

```powershell
git push
```

In your repo → **Settings** → **Pages** → Source **Deploy from a branch** →
branch `main`, folder **`/docs`** → **Save**. Live a minute later at
`https://<your-username>.github.io/<repo>/`.

`docs/` is committed pre-built, so Pages serves it with no build step. Run
`npm run build` before committing any source change.

---

## Development

```powershell
npm install
npm run build      # → docs/ (site) + docs/linguamap-standalone.html
npm run dev        # unminified, easier to debug
npm start          # serve docs/ at http://localhost:4173
```

Source in `src/` is concatenated in a fixed order (each file attaches its
exports to `window`), compiled from JSX with Babel, minified with Terser. No
framework tooling, no bundler config — one script does everything.

```
src/
  data/clusters-{a,b,c}.js   Dutch grammar data (65 rules)
  core.jsx                   themes, languages, i18n, LLM providers, usage
  store.jsx                  persistence, routing, spaced repetition, speech
  views.jsx                  Review · Progress · Reader · Practice · palette
  lab.jsx                    Sentence Lab
  lucy.jsx                   conversational tutor
  shell.jsx                  app shell, map, drawer, settings, navigation
tools/build.mjs              build script (site + standalone + service worker)
```

The browser loads `docs/`, not `src/` — always rebuild after editing.

## Supporting the project

LinguaMap is free and open source, and stays that way. If it is useful to you
and you would like to support the work:

**☕ [buymeacoffee.com/gaborkalmar](https://buymeacoffee.com/gaborkalmar)**

Entirely optional — every feature is and will remain available to everyone.

## Licence

MIT for the application code. The Dutch grammar content is written for this
project.
