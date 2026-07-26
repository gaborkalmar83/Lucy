// Lucy Voice mode.
//
// Three engines, because only some providers have a realtime speech API:
//
//   browser  — microphone → Web Speech recognition → whatever TEXT provider is
//              configured → Web Speech synthesis. Works with every provider,
//              including a local model. Turn-based, no barge-in.
//   azure    — Azure VoiceLive websocket. True speech-to-speech with server-side
//              voice activity detection, so it can be interrupted mid-sentence.
//   openai   — OpenAI Realtime websocket. Same wire shape as Azure.
//
// Azure and OpenAI share an event vocabulary (Azure's API follows OpenAI's
// Realtime one), so a single client drives both; only the URL, the credential
// and the voice field differ.

const VOICE_ENGINES = [
  { id:"browser", name:"Browser speech (works with any provider)" },
  { id:"azure",   name:"Azure VoiceLive (realtime)" },
  { id:"openai",  name:"OpenAI Realtime" }
];

// Azure "HD" neural voices are named like en-US-Ava:DragonHDLatestNeural; the
// OpenAI-style ones are bare words. A few sensible starting points per language.
const AZURE_VOICE_SUGGESTIONS = {
  nl: ["nl-NL-FennaNeural", "nl-NL-MaartenNeural", "nl-NL-ColetteNeural"],
  en: ["en-US-Ava:DragonHDLatestNeural", "en-US-AvaNeural", "en-GB-SoniaNeural"],
  hu: ["hu-HU-NoemiNeural", "hu-HU-TamasNeural"],
  de: ["de-DE-KatjaNeural", "de-DE-ConradNeural"],
  fr: ["fr-FR-DeniseNeural", "fr-FR-HenriNeural"],
  es: ["es-ES-ElviraNeural", "es-ES-AlvaroNeural"],
  it: ["it-IT-ElsaNeural", "it-IT-DiegoNeural"],
  pt: ["pt-PT-RaquelNeural"], sv: ["sv-SE-SofieNeural"], da: ["da-DK-ChristelNeural"],
  no: ["nb-NO-PernilleNeural"], pl: ["pl-PL-ZofiaNeural"], cs: ["cs-CZ-VlastaNeural"],
  fi: ["fi-FI-SelmaNeural"], el: ["el-GR-AthinaNeural"], mk: ["mk-MK-MarijaNeural"], sr: ["sr-RS-SophieNeural"]
};
const OPENAI_VOICES = ["alloy", "echo", "shimmer", "ballad", "coral", "sage", "verse"];

const RATE = 24000;   // both APIs speak PCM16 mono at 24 kHz

// ── PCM helpers ─────────────────────────────────────────────────────────────
function floatToPcm16Base64(float32) {
  const buf = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buf);
  for (let i = 0; i < float32.length; i++) {
    let s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function base64ToFloat32(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const view = new DataView(bytes.buffer);
  const out = new Float32Array(bytes.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = view.getInt16(i * 2, true) / 0x8000;
  return out;
}
// Cheap linear resample; only used when the browser refuses a 24 kHz context.
function resample(input, from, to) {
  if (from === to) return input;
  const ratio = from / to;
  const out = new Float32Array(Math.round(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const pos = i * ratio, i0 = Math.floor(pos), frac = pos - i0;
    out[i] = (input[i0] || 0) * (1 - frac) + (input[i0 + 1] || 0) * frac;
  }
  return out;
}

// ── Realtime client (Azure VoiceLive / OpenAI Realtime) ─────────────────────
class RealtimeVoice {
  constructor(S, handlers) {
    this.S = S; this.h = handlers || {};
    this.ws = null; this.micCtx = null; this.outCtx = null;
    this.node = null; this.stream = null;
    this.playHead = 0; this.sources = new Set();
    this.closed = false; this.activeResponse = false;
  }

  url() {
    const V = this.S.voice;
    if (V.engine === "openai") {
      return "wss://api.openai.com/v1/realtime?model=" + encodeURIComponent(V.model || "gpt-4o-realtime-preview");
    }
    // Azure: host may be pasted as https://x.services.ai.azure.com/ or already wss://
    let host = (V.azureEndpoint || "").trim().replace(/\/+$/, "");
    if (!host) throw new Error("Set the Azure VoiceLive endpoint in Settings → Voice");
    host = host.replace(/^https?:\/\//, "wss://");
    if (!/^wss:\/\//.test(host)) host = "wss://" + host;
    if (!/\/voice-live\/realtime/.test(host)) host += "/voice-live/realtime";
    const q = new URLSearchParams({
      "api-version": V.azureApiVersion || "2025-05-01-preview",
      model: V.model || "gpt-realtime"
    });
    // A browser cannot set headers on a WebSocket, so the key rides in the query.
    if (V.azureKey) q.set("api-key", V.azureKey);
    return host + "?" + q.toString();
  }

  protocols() {
    const V = this.S.voice;
    if (V.engine !== "openai") return undefined;
    // OpenAI's documented (and explicitly "insecure") browser auth path.
    return ["realtime", "openai-insecure-api-key." + (V.openaiKey || ""), "openai-beta.realtime-v1"];
  }

  sessionConfig(instructions) {
    const V = this.S.voice;
    const voice = V.engine === "openai"
      ? (V.voiceName || "alloy")
      : { name: V.voiceName || "en-US-Ava:DragonHDLatestNeural", type: "azure-standard" };
    const cfg = {
      modalities: ["text", "audio"],
      instructions,
      voice,
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      turn_detection: {
        type: "server_vad",
        threshold: Number(V.vadThreshold) || 0.5,
        prefix_padding_ms: Number(V.vadPrefixMs) || 300,
        silence_duration_ms: Number(V.vadSilenceMs) || 500
      },
      input_audio_transcription: { model: V.transcribeModel || "whisper-1" }
    };
    if (V.engine !== "openai") {
      // Azure-only server-side audio clean-up.
      if (V.echoCancel) cfg.input_audio_echo_cancellation = { type: "server_echo_cancellation" };
      if (V.noiseReduction) cfg.input_audio_noise_reduction = { type: "azure_deep_noise_suppression" };
    }
    // Escape hatch: anything the UI does not expose can be set as raw JSON and
    // is merged last, so a power user is never boxed in by our defaults.
    if (V.sessionJson && V.sessionJson.trim()) {
      try { Object.assign(cfg, JSON.parse(V.sessionJson)); }
      catch(e) { this.h.onError && this.h.onError("Session JSON override is not valid JSON — ignored"); }
    }
    return cfg;
  }

  async start(instructions) {
    const V = this.S.voice;
    if (V.engine === "openai" && !V.openaiKey) throw new Error("Set an OpenAI key in Settings → Voice");
    if (V.engine === "azure" && !V.azureKey) throw new Error("Set an Azure VoiceLive key in Settings → Voice");

    // Microphone first: if this is refused there is no point opening a socket.
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 }
    });

    const ws = new WebSocket(this.url(), this.protocols());
    this.ws = ws;
    ws.binaryType = "arraybuffer";

    await new Promise((res, rej) => {
      const to = setTimeout(() => rej(new Error("Timed out connecting to the voice endpoint")), 15000);
      ws.onopen = () => { clearTimeout(to); res(); };
      ws.onerror = () => { clearTimeout(to); rej(new Error("Could not connect — check the endpoint, key and api-version")); };
    });

    ws.onmessage = (ev) => { try { this.handle(JSON.parse(ev.data)); } catch(e){} };
    ws.onclose = () => { if (!this.closed) this.h.onClose && this.h.onClose(); };

    this.send({ type: "session.update", session: this.sessionConfig(instructions) });
    await this.startAudio();
    this.h.onState && this.h.onState("listening");
  }

  send(obj) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj)); }

  async startAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    try { this.micCtx = new AC({ sampleRate: RATE }); } catch(e) { this.micCtx = new AC(); }
    try { this.outCtx = new AC({ sampleRate: RATE }); } catch(e) { this.outCtx = new AC(); }
    await this.micCtx.resume(); await this.outCtx.resume();

    const src = this.micCtx.createMediaStreamSource(this.stream);
    // ScriptProcessor is deprecated but universally available and needs no
    // separate worklet file — which matters for the single-file build and for
    // the strict script-src policy on the hosted one.
    const node = this.micCtx.createScriptProcessor(4096, 1, 1);
    this.node = node;
    node.onaudioprocess = (e) => {
      if (!this.ws || this.ws.readyState !== 1) return;
      let data = e.inputBuffer.getChannelData(0);
      if (this.micCtx.sampleRate !== RATE) data = resample(data, this.micCtx.sampleRate, RATE);
      this.send({ type: "input_audio_buffer.append", audio: floatToPcm16Base64(data) });
    };
    src.connect(node);
    node.connect(this.micCtx.destination);   // required for the callback to fire
  }

  enqueue(b64) {
    const f32 = base64ToFloat32(b64);
    if (!f32.length || !this.outCtx) return;
    const buf = this.outCtx.createBuffer(1, f32.length, RATE);
    buf.getChannelData(0).set(f32);
    const node = this.outCtx.createBufferSource();
    node.buffer = buf;
    node.connect(this.outCtx.destination);
    const now = this.outCtx.currentTime;
    if (this.playHead < now) this.playHead = now + 0.05;
    node.start(this.playHead);
    this.playHead += buf.duration;
    this.sources.add(node);
    node.onended = () => this.sources.delete(node);
  }

  // Barge-in: drop everything queued and tell the server to stop generating.
  flush() {
    this.sources.forEach(n => { try { n.stop(); } catch(e){} });
    this.sources.clear();
    this.playHead = 0;
  }

  handle(ev) {
    const t = ev.type;
    if (t === "session.updated" || t === "session.created") { this.h.onState && this.h.onState("listening"); }
    else if (t === "input_audio_buffer.speech_started") {
      this.flush();
      if (this.activeResponse) this.send({ type: "response.cancel" });
      this.h.onState && this.h.onState("listening");
    }
    else if (t === "input_audio_buffer.speech_stopped") this.h.onState && this.h.onState("thinking");
    else if (t === "response.created") { this.activeResponse = true; }
    else if (t === "response.audio.delta" && ev.delta) { this.enqueue(ev.delta); this.h.onState && this.h.onState("speaking"); }
    else if (t === "response.audio_transcript.delta" && ev.delta) this.h.onAssistantDelta && this.h.onAssistantDelta(ev.delta);
    else if (t === "response.audio_transcript.done" && ev.transcript) this.h.onAssistant && this.h.onAssistant(ev.transcript);
    else if (t === "conversation.item.input_audio_transcription.completed" && ev.transcript) this.h.onUser && this.h.onUser(ev.transcript);
    else if (t === "response.done") { this.activeResponse = false; this.h.onState && this.h.onState("listening"); }
    else if (t === "error") {
      const msg = (ev.error && ev.error.message) || "unknown error";
      if (!/no active response/i.test(msg)) this.h.onError && this.h.onError(msg);
    }
  }

  stop() {
    this.closed = true;
    this.flush();
    try { if (this.node) { this.node.disconnect(); this.node.onaudioprocess = null; } } catch(e){}
    try { if (this.stream) this.stream.getTracks().forEach(t => t.stop()); } catch(e){}
    try { if (this.micCtx) this.micCtx.close(); } catch(e){}
    try { if (this.outCtx) this.outCtx.close(); } catch(e){}
    try { if (this.ws) this.ws.close(); } catch(e){}
    this.ws = null;
  }
}

// ── Voice panel ─────────────────────────────────────────────────────────────
// Owns a session for whichever engine is configured and reports transcript
// lines back to Lucy so the conversation stays in one place.
function VoicePanel({ S, instructions, onUser, onAssistant, onClose }) {
  const T = React.useContext(ThemeCtx);
  const V = S.voice || {};
  const realtime = V.engine === "azure" || V.engine === "openai";
  const [state, setState] = React.useState("idle");   // idle|connecting|listening|thinking|speaking
  const [err, setErr] = React.useState(null);
  const [lines, setLines] = React.useState([]);
  const clientRef = React.useRef(null);
  const partial = React.useRef("");

  const push = (role, text) => {
    if (!text || !text.trim()) return;
    setLines(l => [...l.slice(-40), { role, text: text.trim() }]);
    (role === "user" ? onUser : onAssistant)(text.trim());
  };

  // ── realtime engines ──
  const startRealtime = async () => {
    setErr(null); setState("connecting");
    const c = new RealtimeVoice(S, {
      onState: setState,
      onUser: (t) => push("user", t),
      onAssistantDelta: (d) => { partial.current += d; },
      onAssistant: (t) => { partial.current = ""; push("assistant", t); },
      onError: (m) => setErr(m),
      onClose: () => setState("idle")
    });
    clientRef.current = c;
    try { await c.start(instructions); }
    catch(e) { setErr(String(e.message || e)); setState("idle"); c.stop(); clientRef.current = null; }
  };

  // ── browser engine: listen → text model → speak → listen again ──
  const loopRef = React.useRef(false);
  const startBrowser = async () => {
    if (!sttOk()) { setErr(UI.micUnsupported); return; }
    setErr(null); loopRef.current = true;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const turn = async () => {
      if (!loopRef.current) return;
      setState("listening");
      const heard = await new Promise((resolve) => {
        const r = new SR();
        clientRef.current = { stop: () => { try { r.abort(); } catch(e){} } };
        r.lang = BCP47[S.target] || "en-GB";
        r.interimResults = false; r.continuous = false;
        let got = "";
        r.onresult = (e) => { got = Array.from(e.results).map(x => x[0].transcript).join(" "); };
        r.onerror = () => resolve("");
        r.onend = () => resolve(got);
        try { r.start(); } catch(e) { resolve(""); }
      });
      if (!loopRef.current) return;
      if (!heard.trim()) { turn(); return; }
      push("user", heard);
      setState("thinking");
      try {
        const { text } = await llmCall(S, { system: instructions, maxTokens: 500, task: "voice",
          messages: [{ role:"user", content: heard }] });
        if (!loopRef.current) return;
        // Only the target-language half is spoken; the translation is for reading.
        const spoken = text.split("\n").map(l => l.includes(" | ") ? l.split(" | ")[0] : l).join(" ");
        push("assistant", text);
        setState("speaking");
        await new Promise((res) => {
          if (!ttsOk()) return res();
          stopSpeaking();
          const u = new SpeechSynthesisUtterance(stripMarkup(spoken).slice(0, 600));
          u.lang = BCP47[S.target] || "en-GB";
          u.rate = (V.rate || S.speak.rate || 0.95);
          const want = S.speak && S.speak.voice;
          const v = speechSynthesis.getVoices().find(x => (want && x.name === want) || x.lang === u.lang);
          if (v) u.voice = v;
          u.onend = res; u.onerror = res;
          speechSynthesis.speak(u);
        });
      } catch(e) { setErr(String(e.message || e)); loopRef.current = false; setState("idle"); return; }
      if (loopRef.current) turn();
    };
    turn();
  };

  const start = () => realtime ? startRealtime() : startBrowser();
  const stop = () => {
    loopRef.current = false;
    stopSpeaking();
    if (clientRef.current) { try { clientRef.current.stop(); } catch(e){} clientRef.current = null; }
    setState("idle");
  };
  React.useEffect(() => stop, []);

  const running = state !== "idle";
  const label = { idle:UI.voiceIdle, connecting:UI.voiceConnecting, listening:UI.voiceListening,
    thinking:UI.voiceThinking, speaking:UI.voiceSpeaking }[state] || state;
  const dot = { listening:T.good, thinking:"#f59e0b", speaking:T.accent, connecting:T.faint, idle:T.faint }[state];

  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#0008", zIndex:120 }}></div>
      <div style={{ position:"fixed", left:"50%", bottom:0, transform:"translateX(-50%)", width:"min(560px,100%)",
        zIndex:121, background:T.panel, border:`1px solid ${T.border}`, borderRadius:"16px 16px 0 0",
        boxShadow:"0 -14px 50px #000b", padding:"16px 18px calc(18px + env(safe-area-inset-bottom))",
        maxHeight:"78vh", display:"flex", flexDirection:"column" }}>

        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:16, fontWeight:800, color:T.text }}>🎙️ {UI.voiceMode}</span>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.mute }}>
            <span style={{ width:8, height:8, borderRadius:99, background:dot,
              boxShadow: running ? `0 0 8px ${dot}` : "none" }}></span>{label}
          </span>
          <span style={{ flex:1 }}></span>
          <span style={{ fontSize:10.5, color:T.faint, fontFamily:"'JetBrains Mono',monospace" }}>
            {realtime ? (V.engine === "azure" ? "VoiceLive" : "OpenAI Realtime") : "browser"}</span>
          <button onClick={onClose} style={{ background:T.chip, border:"none", color:T.mute,
            width:30, height:30, borderRadius:8, cursor:"pointer" }}>×</button>
        </div>

        {err && <div style={{ marginTop:10, padding:"9px 12px", borderRadius:9, background:T.badBg,
          border:`1px solid ${T.badBd}`, color:T.bad, fontSize:12, lineHeight:1.5 }}>{err}</div>}

        <div style={{ flex:1, overflowY:"auto", margin:"12px 0", display:"flex", flexDirection:"column", gap:7, minHeight:80 }}>
          {lines.length === 0 && (
            <div style={{ color:T.faint, fontSize:12.5, lineHeight:1.6, textAlign:"center", margin:"auto", maxWidth:380 }}>
              {realtime ? UI.voiceHintRealtime : UI.voiceHintBrowser}
            </div>
          )}
          {lines.map((l, i) => (
            <div key={i} style={{ alignSelf: l.role === "user" ? "flex-end" : "flex-start", maxWidth:"88%",
              padding:"7px 11px", borderRadius:11, fontSize:13, lineHeight:1.5,
              background: l.role === "user" ? T.accent : T.panel2,
              color: l.role === "user" ? T.accentText : T.mute,
              border: l.role === "user" ? "none" : `1px solid ${T.border}`, whiteSpace:"pre-wrap" }}>
              {l.text}
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          {!running ? (
            <button onClick={start} style={{ flex:1, padding:"13px", fontSize:14.5, fontWeight:700, borderRadius:11,
              border:"none", background:T.accent, color:T.accentText, cursor:"pointer" }}>🎙️ {UI.voiceStart}</button>
          ) : (
            <button onClick={stop} style={{ flex:1, padding:"13px", fontSize:14.5, fontWeight:700, borderRadius:11,
              border:`1px solid ${T.bad}`, background:T.badBg, color:T.bad, cursor:"pointer" }}>■ {UI.voiceStop}</button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { VOICE_ENGINES, AZURE_VOICE_SUGGESTIONS, OPENAI_VOICES, RealtimeVoice, VoicePanel });
