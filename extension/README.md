# LinguaMap browser extension

Right-click anything on the web and send it to LinguaMap.

| What you do | What happens |
| --- | --- |
| Right-click a page → **Send this page to Reader** | The article text is extracted and lands in the Reader's edit box, ready to trim and read sentence by sentence |
| Select text → **Send selection to Reader** | Just that passage goes to the Reader |
| Select a sentence → **Send sentence to Sentence Lab** | Opens the Lab with the sentence loaded for a full breakdown |
| Select anything → **Discuss with Lucy** | Lucy summarises it at your level and asks you a question about it, in your target language |
| Select anything → **Discuss with Lucy (voice)** | Same, but the voice panel opens so you can talk it through out loud |
| Select a word → **Save word to vocabulary** | Looks up the meaning, saves it, and puts it in your review queue |

Right-clicking a **link** sends the link to the Reader, which fetches it for you.
The toolbar button offers the same actions when a right-click is awkward.

## It holds no API keys

The extension does not call any language model and stores no credentials. It
collects text and hands it to your LinguaMap tab; every translation, gloss and
conversation runs on the provider you configured *inside the app*, with the keys
stored (encrypted) there. One place to configure, one place keys live.

The permissions reflect that:

- `activeTab` — read the page you right-clicked, at the moment you right-click it.
- one host permission for **your LinguaMap address only**, granted by you on the
  options page. Without it the extension cannot hand anything over.
- `contextMenus`, `storage`, `scripting` — the menu, your app address, and the
  hand-off itself.

No analytics, no remote code, no network requests of its own.

## Installing (Chrome, Edge, Brave, any Chromium browser)

1. Open `chrome://extensions` (Edge: `edge://extensions`).
2. Turn on **Developer mode**, top right.
3. Click **Load unpacked** and pick this `extension` folder.
4. The options page opens — check the LinguaMap address and press
   **Save & grant access**. Approve the permission prompt.

Self-hosting or running locally? Put your own address in (for example
`http://localhost:4173/`) and grant access to that instead.

It is not on the Chrome Web Store, so it stays in developer mode. That is also
why nothing auto-updates: pull the repo and press the reload arrow on the
extension card.

## Firefox

Firefox supports this manifest, but loads unsigned extensions only temporarily.
`about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick
`manifest.json`. It disappears when Firefox restarts.

## On Android, use the share sheet instead

Chrome for Android has no extensions. Install LinguaMap as an app (Chrome menu →
*Add to Home screen*) and it registers as a **share target**: from any article or
selection, tap Share → LinguaMap. A bare link goes to the Reader, a sentence to
the Sentence Lab, a single word to your vocabulary, and a long passage to the
Reader — the same routing as the right-click menu.
