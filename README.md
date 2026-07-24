# LinguaMap — Grammar Studio

A grammar map, sentence lab, AI tutor and spaced-repetition trainer for learning
European languages. Dutch ships with a fully curated grammar map (65 rules across
12 clusters); the other 13 languages work through the AI features.

Everything runs in the browser. No account, no server, no telemetry. Your
vocabulary, review schedule and API keys stay in your own browser's storage.

**Bring your own model:** Anthropic, OpenAI, OpenRouter (including its free tier),
or any OpenAI-compatible local server such as Ollama or LM Studio.

## Three ways to run it

| Where | How |
|---|---|
| **Website** | Publish `docs/` to GitHub Pages (Settings → Pages → *Deploy from a branch* → `main` / `docs`). |
| **Phone** | Open the site and use *Add to home screen*. It installs as a PWA and works offline. |
| **Single file** | `docs/linguamap-standalone.html` — one self-contained file, no server. Open it from disk or paste it into a Claude artifact. |

All three share the same code and the same URL structure, so a link to a rule
works everywhere.

## Features

**Learn**
- **Grammar Map** — 65 Dutch rules in 12 clusters, each with the rule, *why it
  exists*, colour-coded example sentences, exceptions and cross-links.
- **Sentence Lab** — write a sentence, get a verdict with the rules you applied
  correctly and the ones you broke, each linking back to the map.
- **Lucy** — a conversational tutor with 16 one-tap actions (conjugate, deep
  dive, timelines, roleplay, cloze drills, recap…), inline corrections and
  clickable word glosses.
- **Reader** — paste any text; tap a word for an instant gloss, or send a
  sentence to the Lab or to Lucy.
- **Practice** — generated multiple-choice drills for any individual rule.

**Remember**
- **Review** — SM-2 spaced repetition. Saved words and every correction Lucy
  makes become cards automatically.
- **Progress** — streak, XP, daily goal, a 12-week activity grid, and per-rule
  mastery that surfaces what needs work.

**Everywhere**
- Installable PWA, offline-capable, mobile tab bar and safe-area aware.
- Deep links: `#/map/de_het`, `#/review`, `#/practice/word_order_v2`.
- Session continuity — chat, lab results, reader text, search and filters all
  survive navigation, reloads and the phone killing the tab.
- Command palette (`Ctrl`/`Cmd`+`K`), number keys `1`–`6` to switch views.
- Text-to-speech throughout, speech input for the Lab and Lucy.
- 4 themes, 14 target languages, 10 explanation languages (+ a secondary
  anchor language), CEFR level filtering.
- Full export/import of all your data as JSON.

## Development

```bash
npm install
npm run build      # → docs/ (site) and docs/linguamap-standalone.html
npm run dev        # unminified build
npm start          # serve docs/ at http://localhost:4173
```

Source lives in `src/` and is concatenated in a fixed order (each file attaches
its exports to `window`), compiled from JSX with Babel and minified with Terser.
`docs/` is committed so GitHub Pages can serve it directly.

```
src/
  data/clusters-{a,b,c}.js   Dutch grammar data (65 rules)
  core.jsx                   themes, languages, i18n, LLM providers, usage
  store.jsx                  persistence, routing, SRS, progress, speech
  views.jsx                  Review · Progress · Reader · Practice · palette
  lab.jsx                    Sentence Lab
  lucy.jsx                   conversational tutor
  shell.jsx                  app shell, map, drawer, settings, navigation
```

## Privacy

API keys and all learning data are stored in `localStorage` in your browser and
are never sent anywhere except directly to the model provider you choose. Use
**Settings → Backup → Export** before clearing site data or switching device.

## Licence

MIT for the application code. The Dutch grammar content is authored for this
project.
