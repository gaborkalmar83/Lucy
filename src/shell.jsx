// Dutch Grammar Studio v2 — map view, drawer, dropdowns, settings, bottom bar, app shell

function NodeCard({ node, onOpen, lang }) {
  const T = React.useContext(ThemeCtx);
  return (
    <button onClick={() => onOpen(node.id)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%",
      textAlign:"left", padding:"8px 10px", border:"none", borderTop:`1px solid ${T.border}`, background:"transparent",
      cursor:"pointer", transition:"background .12s" }}
      onMouseEnter={e => e.currentTarget.style.background=T.chip+"66"}
      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
      <LevelBadge level={node.level} />
      <span style={{ flex:1, fontSize:13, color:T.text, fontWeight:500 }}>{node["label_"+lang] || node.label_en}</span>
      {node.links && <span style={{ fontSize:10, color:T.faint }}>↔</span>}
      <span style={{ fontSize:12, color:T.faint }}>›</span>
    </button>
  );
}

function ClusterCard({ cluster, levelCap, onOpen, onOpenExc, query, lang }) {
  const T = React.useContext(ThemeCtx);
  const hue = CLUSTER_HUES[cluster.color];
  const capIdx = levelCap === "all" ? 99 : LEVELS.indexOf(levelCap);
  const q = query.toLowerCase();
  const matches = (n) => !q || (n.label_en + n.rule_en + n.examples.map(e => e.tokens.map(x=>x[0]).join(" ")+e.en).join(" ")).toLowerCase().includes(q);
  const nodes = cluster.nodes.filter(n => LEVELS.indexOf(n.level) <= capIdx && matches(n));
  const excs = (cluster.exceptions||[]).filter(e => !q || (e.title_en+e.body_en).toLowerCase().includes(q));
  if (!nodes.length && !excs.length) return null;
  return (
    <div style={{ background:T.panel, borderRadius:14, border:`1px solid ${T.border}`, overflow:"hidden",
      boxShadow: T.dark ? "0 4px 24px #00000040" : "0 2px 12px #0f172a12", breakInside:"avoid", marginBottom:18 }}>
      <div style={{ padding:"13px 14px 11px", background:`linear-gradient(135deg, ${hue}18, transparent 60%)`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:9, height:9, borderRadius:99, background:hue, boxShadow:`0 0 10px ${hue}` }}></span>
          <span style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:-.3 }}>{cluster["title_"+lang] || cluster.title_en}</span>
        </div>
        <div style={{ fontSize:11, color:T.faint, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{cluster["blurb_"+lang] || cluster.blurb_en}</div>
      </div>
      <div>{nodes.map(n => <NodeCard key={n.id} node={n} onOpen={onOpen} lang={lang} />)}</div>
      {excs.length > 0 && (
        <div style={{ borderTop:`1px dashed ${T.bad}55`, padding:"6px 0" }}>
          {excs.map((e,i) => (
            <button key={i} onClick={() => onOpenExc(cluster.id, cluster.exceptions.indexOf(e))} style={{ display:"flex", alignItems:"center", gap:8, width:"100%",
              textAlign:"left", padding:"7px 10px", border:"none", background:"transparent", cursor:"pointer" }}>
              <span style={{ fontSize:10, fontWeight:700, color:T.bad, fontFamily:"'JetBrains Mono',monospace",
                border:`1px solid ${T.bad}55`, borderRadius:3, padding:"1px 5px" }}>⚠</span>
              <span style={{ flex:1, fontSize:12.5, color:T.bad }}>{e["title_"+lang] || e.title_en}</span>
              <span style={{ fontSize:12, color:T.faint }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExampleBlock({ ex, S }) {
  const T = React.useContext(ThemeCtx);
  const sec = S.secondary && ex[S.secondary];
  const prim = ex[S.primary] || ex.en;
  const sentence = ex.tokens.map(t => t[0]).join(" ");
  return (
    <div style={{ padding:"10px 14px", background:T.panel2, borderRadius:10, border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:6 }}>
        <span style={{ flex:1 }}><Tokens tokens={ex.tokens} size={14.5} S={S} /></span>
        <SpeakBtn text={sentence} S={S} size={13} />
      </div>
      <div style={{ fontSize:12, color:T.mute, marginTop:5 }}>{prim}</div>
      {sec && sec !== prim && <div style={{ fontSize:11.5, color:T.faint, marginTop:2, fontStyle:"italic" }}>{sec}</div>}
      {ex.note_en && <div style={{ fontSize:11, color:T.faint, marginTop:3 }}>· {ex.note_en}</div>}
    </div>
  );
}

// Exceptions are addressed as "<clusterId>__excN" so Practice can resolve them
// the same way it resolves a rule node.
const excPracticeId = (cid, idx) => cid + "__exc" + idx;
function resolvePractice(id) {
  if (NODE_INDEX[id]) return { kind:"node", node: NODE_INDEX[id].node, cluster: NODE_INDEX[id].cluster };
  const m = String(id || "").match(/^(.+)__exc(\d+)$/);
  if (m) {
    const cluster = CLUSTERS.find(c => c.id === m[1]);
    const exc = cluster && (cluster.exceptions || [])[Number(m[2])];
    if (exc) return { kind:"exception", exc, cluster };
  }
  return null;
}

function Drawer({ target, S, onClose, onOpen, onPractice, onDrill }) {
  const T = React.useContext(ThemeCtx);
  const lang = S.primary, sec = S.secondary;
  if (!target) return null;
  const pick = (o, k) => o[k+"_"+lang] || o[k+"_en"];
  const pickSec = (o, k) => sec && o[k+"_"+sec];
  let title, level, rule, ruleSec, reason, reasonSec, examples, links, isExc=false, excBody, excBodySec;
  if (target.type === "node") {
    const { node, cluster } = NODE_INDEX[target.id];
    title = pick(node,"label"); level = node.level;
    rule = pick(node,"rule"); ruleSec = pickSec(node,"rule");
    reason = pick(node,"reason"); reasonSec = pickSec(node,"reason");
    examples = node.examples; links = node.links;
    var clusterExc = cluster.exceptions || [];
    var clusterId = cluster.id;
  } else {
    const cluster = CLUSTERS.find(c => c.id === target.cid); const e = cluster.exceptions[target.idx];
    title = pick(e,"title"); isExc = true; excBody = pick(e,"body"); excBodySec = pickSec(e,"body"); examples = e.examples || [];
  }
  const practiceId = isExc ? excPracticeId(target.cid, target.idx) : target.id;
  const drillPrompt = isExc
    ? `Let's drill this exception until I have it: "${title}". ${excBody || ""}\nStart by explaining it briefly, then give me one short exercise at a time, wait for my answer, correct it, and keep going.`
    : `Let's drill this rule until I have it: "${title}". ${rule || ""}\nStart by explaining it briefly, then give me one short exercise at a time, wait for my answer, correct it, and keep going.`;
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#0006", zIndex:90, backdropFilter:"blur(2px)" }}></div>
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:"min(440px, 92vw)", zIndex:91, background:T.panel,
        borderLeft:`1px solid ${T.border}`, boxShadow:"-16px 0 48px #0009", overflowY:"auto", padding:"22px 22px 60px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          {isExc ? <span style={{ fontSize:11, fontWeight:700, color:T.bad, fontFamily:"'JetBrains Mono',monospace",
            border:`1px solid ${T.bad}55`, borderRadius:4, padding:"2px 7px" }}>⚠ {UI.exception}</span> : <LevelBadge level={level} />}
          <span style={{ flex:1, fontSize:18, fontWeight:800, color:T.text, letterSpacing:-.3 }}>{title}</span>
          <button onClick={onClose} style={{ background:T.chip, border:"none", color:T.mute, width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:15 }}>×</button>
        </div>
        {onPractice && (
          <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
            {/* Practice and drill work for exceptions too — an exception is
                exactly the kind of thing worth drilling. */}
            <button onClick={() => onPractice(practiceId)} style={{ padding:"6px 13px", fontSize:12,
              fontWeight:700, borderRadius:9, border:"none", background:T.accent, color:T.accentText, cursor:"pointer" }}>
              ✏️ {UI.practice}</button>
            <button onClick={() => onDrill && onDrill(drillPrompt)} style={{ padding:"6px 13px", fontSize:12,
              fontWeight:700, borderRadius:9, border:`1px solid ${T.accent}`, background:"transparent",
              color:T.accent, cursor:"pointer" }}>✨ {UI.drillLucy}</button>
            {!isExc && (
              <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(
                location.href.split("#")[0] + buildHash("map", target.id)); }} title={UI.copyLink}
                style={{ padding:"6px 12px", fontSize:12, borderRadius:9, border:`1px solid ${T.border}`,
                  background:T.panel2, color:T.mute, cursor:"pointer" }}>🔗</button>
            )}
          </div>
        )}
        {isExc ? (
          <div>
            <div style={{ fontSize:13.5, color:T.text, lineHeight:1.65 }}>{excBody}</div>
            {excBodySec && <div style={{ fontSize:12.5, color:T.faint, lineHeight:1.6, marginTop:6, fontStyle:"italic" }}>{excBodySec}</div>}
          </div>
        ) : (
          <React.Fragment>
            <div style={{ fontSize:13.5, color:T.text, lineHeight:1.65 }}>{rule}</div>
            {ruleSec && <div style={{ fontSize:12.5, color:T.faint, lineHeight:1.6, marginTop:6, fontStyle:"italic" }}>{ruleSec}</div>}
            {reason && (
              <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:T.whyBg, border:`1px solid ${T.whyBd}` }}>
                <div style={{ fontSize:10, color:T.whyTitle, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:5 }}>{UI.why.toUpperCase()}</div>
                <div style={{ fontSize:13, color:T.whyText, lineHeight:1.6 }}>{reason}</div>
                {reasonSec && <div style={{ fontSize:12, color:T.whyText, opacity:.8, lineHeight:1.55, marginTop:5, fontStyle:"italic" }}>{reasonSec}</div>}
              </div>
            )}
          </React.Fragment>
        )}
        {examples?.length > 0 && (
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>{UI.examples.toUpperCase()}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{examples.map((ex,i) => <ExampleBlock key={i} ex={ex} S={S} />)}</div>
          </div>
        )}
        {!isExc && clusterExc && clusterExc.length > 0 && (
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:10, color:T.bad, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>⚠ {UI.exceptions.toUpperCase()}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {clusterExc.map((e,i) => (
                <div key={i} style={{ padding:"10px 12px", borderRadius:10, background:T.badBg, border:`1px solid ${T.badBd}` }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.bad }}>{e["title_"+lang] || e.title_en}</div>
                  <div style={{ fontSize:12.5, color:T.mute, marginTop:4, lineHeight:1.55 }}>{e["body_"+lang] || e.body_en}</div>
                  {(e.examples||[]).length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                      {e.examples.map((ex,j) => <ExampleBlock key={j} ex={ex} S={S} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {links?.length > 0 && (
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>{UI.related.toUpperCase()}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {links.filter(id => NODE_INDEX[id]).map(id => (
                <button key={id} onClick={() => onOpen(id)} style={{ padding:"5px 11px", fontSize:12, borderRadius:8, cursor:"pointer",
                  border:`1px solid ${T.border}`, background:T.chip, color:T.accent }}>{NODE_INDEX[id].node["label_"+lang] || NODE_INDEX[id].node.label_en} ↗</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

// Flag dropdown
function LangDropdown({ value, options, onChange, allowNone, T, width }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => { const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const cur = options.find(o => o.code === value);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", fontSize:12.5,
        borderRadius:8, border:`1px solid ${T.border}`, background:T.panel, color:T.text, cursor:"pointer", minWidth:width||0, whiteSpace:"nowrap" }}>
        <span style={{ fontSize:15 }}>{cur ? cur.flag : "∅"}</span>
        <span style={{ flex:1, textAlign:"left" }}>{cur ? cur.name : UI.none}</span>
        <span style={{ color:T.faint, fontSize:10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"110%", left:0, zIndex:120, minWidth:170, maxHeight:320, overflowY:"auto",
          background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, boxShadow:"0 12px 40px #0008", padding:4 }}>
          {allowNone && (
            <button onClick={() => { onChange(""); setOpen(false); }} style={optRow(T, value==="")}>
              <span style={{ fontSize:15 }}>∅</span><span>{UI.none}</span></button>
          )}
          {options.map(o => (
            <button key={o.code} onClick={() => { onChange(o.code); setOpen(false); }} style={optRow(T, value===o.code)}>
              <span style={{ fontSize:15 }}>{o.flag}</span>
              <span style={{ flex:1, textAlign:"left" }}>{o.name}</span>
              {o.native && <span style={{ fontSize:11, color:T.faint }}>{o.native}</span>}
              {o.hasMap && <span style={{ fontSize:9, color:T.accent, fontFamily:"'JetBrains Mono',monospace" }}>MAP</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
const optRow = (T, active) => ({ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 9px", fontSize:12.5,
  border:"none", borderRadius:7, background: active ? T.chip : "transparent", color:T.text, cursor:"pointer" });

const SPEAK_SAMPLE = { nl:"Ik heb gisteren een boek gekocht.", de:"Ich habe gestern ein Buch gekauft.",
  fr:"J'ai acheté un livre hier.", es:"Ayer compré un libro.", it:"Ieri ho comprato un libro.",
  pt:"Ontem comprei um livro.", sv:"Jag köpte en bok igår.", da:"Jeg købte en bog i går.",
  no:"Jeg kjøpte en bok i går.", pl:"Wczoraj kupiłem książkę.", cs:"Včera jsem koupil knihu.",
  hu:"Tegnap vettem egy könyvet.", fi:"Ostin eilen kirjan.", el:"Χθες αγόρασα ένα βιβλίο." };

// Hoisted out of Settings: when this lived inside the component it was a new
// component type on every render, so React remounted the subtree and text
// inputs (API keys, base URL) lost focus after each keystroke.
function Field({ label, children }) {
  const T = React.useContext(ThemeCtx);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>{label}</div>
      {children}
    </div>
  );
}

// Voice is configured on its own: it is a different service from the text
// model, and only Azure and OpenAI offer a realtime speech API at all.
function VoiceSettings({ S, setS, T, inp, inp2 }) {
  const V = S.voice;
  const setV = (patch) => setS({ ...S, voice: { ...V, ...patch } });
  const realtime = V.engine === "azure" || V.engine === "openai";
  const suggestions = V.engine === "openai" ? OPENAI_VOICES : (AZURE_VOICE_SUGGESTIONS[S.target] || []);
  const row = { display:"flex", gap:10, alignItems:"center", marginTop:8, flexWrap:"wrap" };
  const lbl = { fontSize:11, color:T.faint, minWidth:118 };

  return (
    <React.Fragment>
      <Field label={"🎙️ " + UI.voiceSettings + " — " + UI.voiceEngine}>
        <select value={V.engine} onChange={e => setV({ engine:e.target.value })} style={inp}>
          {VOICE_ENGINES.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
        <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{UI.voiceEngineNote}</div>
      </Field>

      {V.engine === "azure" && (
        <React.Fragment>
          <Field label="Azure VoiceLive endpoint">
            <input value={V.azureEndpoint} onChange={e => setV({ azureEndpoint:e.target.value })}
              placeholder="https://my-resource.services.ai.azure.com" style={inp} />
          </Field>
          <Field label={UI.apiKey + " (VoiceLive)"}>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              <input type="password" value={V.azureKey} onChange={e => setV({ azureKey:e.target.value })}
                placeholder="Azure key" style={{ ...inp, flex:"1 1 180px" }} />
              {S.azureKey && S.azureKey !== V.azureKey && (
                <button onClick={() => setV({ azureKey:S.azureKey, azureEndpoint: V.azureEndpoint || S.azureEndpoint })}
                  style={{ padding:"8px 12px", fontSize:11.5, borderRadius:8, border:`1px solid ${T.border}`,
                    background:T.panel2, color:T.mute, cursor:"pointer", whiteSpace:"nowrap" }}>↙ {UI.voiceSameAsText}</button>
              )}
            </div>
          </Field>
          <div style={row}>
            <span style={lbl}>model</span>
            <input value={V.model} onChange={e => setV({ model:e.target.value })} placeholder="gpt-realtime"
              style={{ ...inp, flex:1 }} />
          </div>
          <div style={row}>
            <span style={lbl}>api-version</span>
            <input value={V.azureApiVersion} onChange={e => setV({ azureApiVersion:e.target.value })}
              placeholder="2025-05-01-preview" style={{ ...inp, flex:1 }} />
          </div>
        </React.Fragment>
      )}

      {V.engine === "openai" && (
        <React.Fragment>
          <Field label={UI.apiKey + " (OpenAI Realtime)"}>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              <input type="password" value={V.openaiKey} onChange={e => setV({ openaiKey:e.target.value })}
                placeholder="sk-…" style={{ ...inp, flex:"1 1 180px" }} />
              {S.openaiKey && S.openaiKey !== V.openaiKey && (
                <button onClick={() => setV({ openaiKey:S.openaiKey })}
                  style={{ padding:"8px 12px", fontSize:11.5, borderRadius:8, border:`1px solid ${T.border}`,
                    background:T.panel2, color:T.mute, cursor:"pointer", whiteSpace:"nowrap" }}>↙ {UI.voiceSameAsText}</button>
              )}
            </div>
          </Field>
          <div style={row}>
            <span style={lbl}>model</span>
            <input value={V.model} onChange={e => setV({ model:e.target.value })}
              placeholder="gpt-4o-realtime-preview" style={{ ...inp, flex:1 }} />
          </div>
        </React.Fragment>
      )}

      <Field label={UI.voiceVoice}>
        <input value={V.voiceName} onChange={e => setV({ voiceName:e.target.value })}
          placeholder={realtime ? (suggestions[0] || "voice name") : "uses the browser voice from 🔊 above"}
          style={inp} disabled={!realtime} />
        {realtime && suggestions.length > 0 && (
          <div style={{ display:"flex", gap:5, marginTop:7, flexWrap:"wrap" }}>
            {suggestions.map(v => (
              <button key={v} onClick={() => setV({ voiceName:v })} style={{ padding:"3px 9px", fontSize:10.5,
                borderRadius:6, cursor:"pointer", border:`1px solid ${V.voiceName===v ? T.accent : T.border}`,
                background: V.voiceName===v ? T.accent+"22" : "transparent", color: V.voiceName===v ? T.accent : T.mute }}>{v}</button>
            ))}
          </div>
        )}
      </Field>

      <Field label={UI.voiceStyleLbl}>
        <div style={{ display:"flex", gap:6 }}>
          {[["tutor","Tutor"],["strict","Strict"],["immersive","Immersive"]].map(([id,l]) => (
            <button key={id} onClick={() => setV({ style:id })} style={{ flex:1, padding:"6px", fontSize:11.5,
              fontWeight:700, borderRadius:8, cursor:"pointer",
              border:`1px solid ${V.style===id ? T.accent : T.border}`,
              background: V.style===id ? T.accent+"22" : "transparent", color:T.text }}>{l}</button>
          ))}
        </div>
      </Field>

      {realtime && (
        <Field label={UI.voiceVad}>
          <div style={row}>
            <span style={lbl}>{UI.voiceThreshold} {Number(V.vadThreshold).toFixed(2)}</span>
            <input type="range" min="0.1" max="0.9" step="0.05" value={V.vadThreshold}
              onChange={e => setV({ vadThreshold:Number(e.target.value) })} style={{ flex:1 }} />
          </div>
          <div style={row}>
            <span style={lbl}>{UI.voicePrefix}</span>
            <input type="number" min="0" max="1000" step="50" value={V.vadPrefixMs}
              onChange={e => setV({ vadPrefixMs:Number(e.target.value) })} style={inp2} />
            <span style={lbl}>{UI.voiceSilence}</span>
            <input type="number" min="100" max="3000" step="50" value={V.vadSilenceMs}
              onChange={e => setV({ vadSilenceMs:Number(e.target.value) })} style={inp2} />
          </div>
          <div style={{ display:"flex", gap:14, marginTop:9, flexWrap:"wrap" }}>
            <label style={{ fontSize:11.5, color:T.mute, display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
              <input type="checkbox" checked={!!V.echoCancel} onChange={e => setV({ echoCancel:e.target.checked })} />
              {UI.voiceEcho}</label>
            <label style={{ fontSize:11.5, color:T.mute, display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
              <input type="checkbox" checked={!!V.noiseReduction} onChange={e => setV({ noiseReduction:e.target.checked })} />
              {UI.voiceNoise}</label>
          </div>
        </Field>
      )}

      <Field label={UI.customPrompt + " — " + UI.voiceMode}>
        <textarea value={V.instructionsExtra} onChange={e => setV({ instructionsExtra:e.target.value })}
          placeholder="e.g. Always start by asking how my day was. Never speak English."
          style={{ ...inp, minHeight:56, resize:"vertical", fontFamily:"'IBM Plex Sans',sans-serif" }} />
      </Field>

      {realtime && (
        <Field label={UI.voiceAdvanced}>
          <textarea value={V.sessionJson} onChange={e => setV({ sessionJson:e.target.value })}
            placeholder='{"temperature":0.8}'
            style={{ ...inp, minHeight:52, resize:"vertical" }} />
          <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{UI.voiceAdvancedNote}</div>
        </Field>
      )}
    </React.Fragment>
  );
}

function Settings({ S, setS, onClose }) {
  const T = React.useContext(ThemeCtx);
  const voices = useVoices();
  const prov = PROVIDERS.find(p => p.id === S.provider);
  // Seed from cache so the dropdown is already correct on first render.
  const [orModels, setOrModels] = React.useState(() => (loadORCache() || {}).list || []);
  const [orLoading, setOrLoading] = React.useState(false);
  const [orErr, setOrErr] = React.useState(null);
  const loadOR = async (keepModel) => {
    setOrLoading(true); setOrErr(null);
    try {
      const list = await fetchORModels();
      setOrModels(list); saveORCache(list);
      // Only pick a default when the saved model is gone from the catalogue —
      // refreshing the list must never silently change the user's choice.
      const stillValid = list.some(m => m.id === S.model);
      if (!keepModel && !stillValid) {
        const first = list.find(m => m.tier === S.orTier) || list[0];
        if (first) setS({ ...S, model:first.id });
      }
    } catch(e){ setOrErr(e.message); }
    setOrLoading(false);
  };
  // Refresh in the background when the catalogue is missing or over a day old.
  React.useEffect(() => {
    if (S.provider !== "openrouter") return;
    const c = loadORCache();
    if (!c || !c.list.length || Date.now() - c.ts > 864e5) loadOR(true);
  }, [S.provider]);

  const [azModels, setAzModels] = React.useState([]);
  const [azLoading, setAzLoading] = React.useState(false);
  const [azErr, setAzErr] = React.useState(null);
  const loadAzure = async () => {
    setAzLoading(true); setAzErr(null);
    try {
      const list = await fetchAzureDeployments(S);
      setAzModels(list);
      if (list.length && !list.some(d => d.id === S.azureDeployment)) setS({ ...S, azureDeployment:list[0].id });
      if (!list.length) setAzErr("No deployments found on this resource.");
    } catch(e){ setAzErr(e.message); }
    setAzLoading(false);
  };
  const inp ={ width:"100%", padding:"8px 11px", fontSize:13, borderRadius:8, border:`1px solid ${T.border}`, background:T.panel2, color:T.text, outline:"none", fontFamily:"'JetBrains Mono',monospace" };
  const inp2 = { padding:"4px 7px", fontSize:12, borderRadius:6, border:`1px solid ${T.border}`, background:T.panel2, color:T.text, outline:"none" };
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#0007", zIndex:130 }}></div>
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(460px,94vw)", maxHeight:"88vh", overflowY:"auto",
        zIndex:131, background:T.panel, border:`1px solid ${T.border}`, borderRadius:16, padding:22, boxShadow:"0 24px 70px #000b" }}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
          <span style={{ flex:1, fontSize:18, fontWeight:800, color:T.text }}>⚙ {UI.settings}</span>
          <button onClick={onClose} style={{ background:T.chip, border:"none", color:T.mute, width:30, height:30, borderRadius:8, cursor:"pointer" }}>×</button>
        </div>

        <Field label={UI.learning}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <LangDropdown value={S.target} options={TARGET_LANGS} onChange={v => setS({ ...S, target:v })} T={T} width={120} />
            <span style={{ fontSize:11, color:T.faint }}>{UI.explainIn} →</span>
            <LangDropdown value={S.primary} options={EXPLAIN_LANGS} onChange={v => setS({ ...S, primary:v })} T={T} />
            <LangDropdown value={S.secondary} options={EXPLAIN_LANGS} onChange={v => setS({ ...S, secondary:v })} allowNone T={T} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:10, alignItems:"center" }}>
            <label style={{ fontSize:11, color:T.faint, display:"flex", alignItems:"center", gap:5 }}>{UI.level}
              <select value={S.level} onChange={e => setS({ ...S, level:e.target.value })} style={inp2}>{CEFR_ALL.map(l => <option key={l}>{l}</option>)}</select></label>
            <label style={{ fontSize:11, color:T.faint, display:"flex", alignItems:"center", gap:5 }}>{UI.targetLevel}
              <select value={S.targetLevel} onChange={e => setS({ ...S, targetLevel:e.target.value })} style={inp2}>{CEFR_ALL.map(l => <option key={l}>{l}</option>)}</select></label>
            <label style={{ fontSize:11, color:T.faint, display:"flex", alignItems:"center", gap:6, marginLeft:"auto", cursor:"pointer" }}>
              <input type="checkbox" checked={S.showRoles} onChange={e => setS({ ...S, showRoles:e.target.checked })} /> {UI.roles}</label>
          </div>
        </Field>

        <Field label={UI.theme}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {Object.entries(THEMES).map(([id, th]) => (
              <button key={id} onClick={() => setS({ ...S, theme:id })} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                fontSize:12, borderRadius:8, cursor:"pointer", border:`1px solid ${S.theme===id ? th.accent : T.border}`,
                background: S.theme===id ? th.accent+"22" : "transparent", color:T.text }}>
                <span style={{ width:12, height:12, borderRadius:99, background:th.bg, border:`2px solid ${th.accent}` }}></span>{th.name}</button>
            ))}
          </div>
        </Field>

        <Field label={UI.provider}>
          <select value={S.provider} onChange={e => { const p = PROVIDERS.find(x=>x.id===e.target.value);
            setS({ ...S, provider:e.target.value, model: p.models[0] || S.model }); }} style={inp}>
            {PROVIDERS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}{p.id === "builtin" && !builtinAvailable() ? " — not available here" : ""}
              </option>
            ))}
          </select>
        </Field>
        {S.provider !== "openrouter" && prov.models.length > 0 && (
          <Field label={UI.modelLbl}>
            <select value={S.model} onChange={e => setS({ ...S, model:e.target.value })} style={inp}>
              {prov.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
        )}
        {S.provider === "openrouter" && (() => {
          const filtered = orModels.filter(m => m.tier === S.orTier);
          const chosen = orModels.find(m => m.id === S.model);
          // The saved model is always an option, even when it sits outside the
          // selected tier — a <select> whose value matches no option renders
          // its first entry instead, which is what made saved settings look lost.
          const opts = filtered.length ? filtered : PROVIDERS.find(p => p.id === "openrouter").models.map(id => ({ id, name:id }));
          const withCurrent = S.model && !opts.some(m => m.id === S.model)
            ? [chosen || { id:S.model, name:S.model }, ...opts] : opts;
          return (
            <Field label={UI.modelLbl + " — OpenRouter"}>
              <div style={{ display:"flex", gap:5, marginBottom:8 }}>
                {OR_TIERS.map(([id,l]) => (
                  <button key={id} onClick={() => setS({ ...S, orTier:id })}
                    style={{ flex:1, padding:"5px 6px", fontSize:11, fontWeight:700, borderRadius:7, cursor:"pointer",
                      border:`1px solid ${S.orTier===id ? T.accent : T.border}`, background: S.orTier===id ? T.accent+"22" : "transparent", color:T.text }}>{l}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                <button onClick={() => loadOR(false)} disabled={orLoading} style={{ padding:"7px 12px", fontSize:12, fontWeight:700, borderRadius:8,
                  border:"none", background: orLoading?T.chip:T.accent, color: orLoading?T.mute:T.accentText, cursor: orLoading?"wait":"pointer", whiteSpace:"nowrap" }}>
                  {orLoading ? "…" : (orModels.length ? "↻ Reload" : "⬇ Load models")}</button>
                <span style={{ fontSize:11, color:T.faint, alignSelf:"center" }}>{orModels.length ? filtered.length + " / " + orModels.length : "live catalogue"}</span>
              </div>
              {orErr && <div style={{ fontSize:11, color:T.bad, marginBottom:8 }}>{orErr}</div>}
              <select value={S.model} onChange={e => setS({ ...S, model:e.target.value })} style={inp}>
                {withCurrent.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.free ? " · free" : typeof m.inP === "number" ? " · $"+m.inP.toFixed(2)+"/M" : ""}
                    {m.id === S.model && !filtered.some(f => f.id === m.id) ? "  (saved)" : ""}
                  </option>
                ))}
              </select>
              <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>
                {S.model ? <React.Fragment>Using <b style={{ color:T.mute }}>{S.model}</b>. </React.Fragment> : null}
                Tiers filter the list; your saved model stays selected either way.
              </div>
            </Field>
          );
        })()}
        {S.provider === "azure" && (
          <React.Fragment>
            <Field label="Endpoint (Azure AI Foundry / Azure OpenAI)">
              <input value={S.azureEndpoint} onChange={e => setS({ ...S, azureEndpoint:e.target.value })}
                placeholder="https://my-resource.openai.azure.com" style={inp} />
            </Field>
            <Field label={UI.apiKey + " (Azure)"}>
              <input type="password" value={S.azureKey} onChange={e => setS({ ...S, azureKey:e.target.value })}
                placeholder="your Azure API key" style={inp} />
            </Field>
            <Field label="Deployment">
              <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                <button onClick={loadAzure} disabled={azLoading || !S.azureKey || !S.azureEndpoint}
                  style={{ padding:"7px 12px", fontSize:12, fontWeight:700, borderRadius:8, border:"none", whiteSpace:"nowrap",
                    background: (azLoading || !S.azureKey || !S.azureEndpoint) ? T.chip : T.accent,
                    color: (azLoading || !S.azureKey || !S.azureEndpoint) ? T.mute : T.accentText,
                    cursor: azLoading ? "wait" : "pointer" }}>
                  {azLoading ? "…" : (azModels.length ? "↻ Reload" : "⬇ Load deployments")}</button>
                <span style={{ fontSize:11, color:T.faint, alignSelf:"center" }}>
                  {azModels.length ? azModels.length + " found" : "reads your resource"}</span>
              </div>
              {azErr && <div style={{ fontSize:11, color:T.bad, marginBottom:8 }}>{azErr}</div>}
              {azModels.length ? (
                <select value={S.azureDeployment} onChange={e => setS({ ...S, azureDeployment:e.target.value })} style={inp}>
                  {!azModels.some(d => d.id === S.azureDeployment) && S.azureDeployment &&
                    <option value={S.azureDeployment}>{S.azureDeployment}  (saved)</option>}
                  {azModels.map(d => <option key={d.id} value={d.id}>{d.id}{d.model ? " · " + d.model : ""}</option>)}
                </select>
              ) : (
                <input value={S.azureDeployment} onChange={e => setS({ ...S, azureDeployment:e.target.value })}
                  placeholder="gpt-4o  (your deployment name)" style={inp} />
              )}
            </Field>
            <Field label="API version">
              <input value={S.azureApiVersion} onChange={e => setS({ ...S, azureApiVersion:e.target.value })}
                placeholder="2024-10-21" style={inp} />
            </Field>
            <div style={{ fontSize:10.5, color:T.faint, marginTop:-6, marginBottom:12, lineHeight:1.5 }}>
              Use the <b>deployment name</b> you gave the model in Azure, not the model name — they often differ.
              If loading fails, your resource may block browser origins; add this site under
              CORS / allowed origins in the Azure portal.
            </div>
          </React.Fragment>
        )}
        {S.provider === "anthropic" && <Field label={UI.apiKey + " (Anthropic)"}><input type="password" value={S.anthropicKey} onChange={e => setS({ ...S, anthropicKey:e.target.value })} placeholder="sk-ant-…" style={inp} /></Field>}
        {S.provider === "openai" && <Field label={UI.apiKey + " (OpenAI)"}><input type="password" value={S.openaiKey} onChange={e => setS({ ...S, openaiKey:e.target.value })} placeholder="sk-…" style={inp} /></Field>}
        {S.provider === "openrouter" && <Field label={UI.apiKey + " (OpenRouter)"}><input type="password" value={S.openrouterKey} onChange={e => setS({ ...S, openrouterKey:e.target.value })} placeholder="sk-or-…" style={inp} /></Field>}
        {S.provider === "local" && (
          <React.Fragment>
            <Field label={UI.baseUrl}><input value={S.localUrl} onChange={e => setS({ ...S, localUrl:e.target.value })} placeholder="http://localhost:11434/v1" style={inp} /></Field>
            <Field label={UI.modelLbl + " (local)"}><input value={S.localModel} onChange={e => setS({ ...S, localModel:e.target.value })} placeholder="llama3.1 / qwen2.5…" style={inp} /></Field>
          </React.Fragment>
        )}
        <div style={{ fontSize:11, color:T.faint, lineHeight:1.5, marginTop:4 }}>{UI.keyNote}</div>

        <div style={{ height:1, background:T.border, margin:"18px 0 16px" }}></div>

        <Field label={"🔊 " + UI.speak}>
          {ttsOk() ? (
            <React.Fragment>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                <select value={S.speak.voice} onChange={e => setS({ ...S, speak:{ ...S.speak, voice:e.target.value } })}
                  style={{ ...inp, flex:1, minWidth:150 }}>
                  <option value="">auto ({BCP47[S.target] || S.target})</option>
                  {voices.filter(v => !S.target || v.lang.slice(0,2) === S.target).map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
                <button onClick={() => speak(SPEAK_SAMPLE[S.target] || "Hallo!", S.target, S)}
                  style={{ padding:"8px 13px", fontSize:12, borderRadius:8, border:`1px solid ${T.border}`,
                    background:T.panel2, color:T.text, cursor:"pointer", whiteSpace:"nowrap" }}>▶ test</button>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:10 }}>
                <span style={{ fontSize:11, color:T.faint, whiteSpace:"nowrap" }}>speed {S.speak.rate.toFixed(2)}×</span>
                <input type="range" min="0.5" max="1.4" step="0.05" value={S.speak.rate}
                  onChange={e => setS({ ...S, speak:{ ...S.speak, rate:Number(e.target.value) } })} style={{ flex:1 }} />
              </div>
            </React.Fragment>
          ) : <div style={{ fontSize:11.5, color:T.faint }}>{UI.ttsUnsupported}</div>}
        </Field>

        <Field label={"🎨 " + UI.rolesBarLang}>
          <div style={{ display:"flex", gap:6 }}>
            {[["primary", UI.primaryLbl + " · " + langName(S.primary)],
              ["secondary", UI.secondaryLbl + (S.secondary ? " · " + langName(S.secondary) : "")]].map(([id, l]) => (
              <button key={id} onClick={() => setS({ ...S, rolesLang:id })} disabled={id === "secondary" && !S.secondary}
                style={{ flex:1, padding:"7px 8px", fontSize:11.5, fontWeight:700, borderRadius:8,
                  cursor: (id === "secondary" && !S.secondary) ? "not-allowed" : "pointer",
                  opacity: (id === "secondary" && !S.secondary) ? .45 : 1,
                  border:`1px solid ${S.rolesLang===id ? T.accent : T.border}`,
                  background: S.rolesLang===id ? T.accent+"22" : "transparent", color:T.text }}>{l}</button>
            ))}
          </div>
        </Field>

        <Field label={"📖 " + UI.reader}>
          <input value={S.readerProxy} onChange={e => setS({ ...S, readerProxy:e.target.value })}
            placeholder="https://r.jina.ai/" style={inp} />
          <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{UI.readerProxyNote}</div>
        </Field>

        <div style={{ height:1, background:T.border, margin:"18px 0 16px" }}></div>
        <VoiceSettings S={S} setS={setS} T={T} inp={inp} inp2={inp2} />

        <Field label={"📝 " + UI.customPrompt}>
          <textarea value={S.systemExtra} onChange={e => setS({ ...S, systemExtra:e.target.value })}
            placeholder="e.g. Always compare Dutch word order with German. Keep examples about cooking."
            style={{ ...inp, minHeight:70, resize:"vertical", fontFamily:"'IBM Plex Sans',sans-serif" }} />
          <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{UI.customPromptNote}</div>
        </Field>

        <Field label={"🐞 " + UI.debugMode}>
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:12.5, color:T.text, cursor:"pointer" }}>
            <input type="checkbox" checked={!!S.debug} onChange={e => setS({ ...S, debug:e.target.checked })} />
            {UI.debugNote}
          </label>
        </Field>

        <Field label={"🔁 " + UI.dailyGoalLbl}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input type="range" min="5" max="100" step="5" value={S.dailyGoal}
              onChange={e => setS({ ...S, dailyGoal:Number(e.target.value) })} style={{ flex:1 }} />
            <span style={{ fontSize:12, color:T.text, fontFamily:"'JetBrains Mono',monospace", minWidth:64 }}>
              {S.dailyGoal} {UI.cards}</span>
          </div>
        </Field>

        <Field label={"💾 " + UI.backup}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            <button onClick={() => downloadBackup(false)} style={{ padding:"8px 13px", fontSize:12, borderRadius:8,
              border:`1px solid ${T.border}`, background:T.panel2, color:T.text, cursor:"pointer" }}>⬇ {UI.exportAll}</button>
            <button onClick={() => { if (confirm(UI.exportKeysWarn)) downloadBackup(true); }}
              title={UI.exportKeysWarn} style={{ padding:"8px 13px", fontSize:12, borderRadius:8,
                border:`1px solid ${T.border}`, background:"transparent", color:T.faint, cursor:"pointer" }}>⬇ + 🔑</button>
            <label style={{ padding:"8px 13px", fontSize:12, borderRadius:8, border:`1px solid ${T.border}`,
              background:T.panel2, color:T.text, cursor:"pointer" }}>
              ⬆ {UI.importAll}
              <input type="file" accept="application/json,.json" style={{ display:"none" }} onChange={e => {
                const f = e.target.files && e.target.files[0]; if (!f) return;
                const r = new FileReader();
                r.onload = () => { try { importAll(JSON.parse(r.result)); location.reload(); }
                  catch(err){ alert(err.message); } };
                r.readAsText(f);
              }} />
            </label>
            <button onClick={() => { if (confirm(UI.confirmClear)) { clearAllData(); location.reload(); } }}
              style={{ padding:"8px 13px", fontSize:12, borderRadius:8, border:`1px solid ${T.badBd}`,
                background:"transparent", color:T.bad, cursor:"pointer" }}>{UI.clearAll}</button>
          </div>
          <div style={{ fontSize:10.5, color:T.faint, marginTop:7, lineHeight:1.5 }}>
            {UI.backupNote}
          </div>
        </Field>

        <div style={{ marginTop:16, padding:"12px 14px", borderRadius:11, background:T.panel2,
          border:`1px solid ${T.border}`, display:"flex", gap:11, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:20 }}>☕</span>
          <div style={{ flex:"1 1 180px", minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.text }}>{UI.support}</div>
            <div style={{ fontSize:11, color:T.faint, lineHeight:1.5, marginTop:2 }}>{UI.supportNote}</div>
          </div>
          <a href={DONATE_URL} target="_blank" rel="noopener noreferrer"
            style={{ padding:"7px 14px", fontSize:12, fontWeight:700, borderRadius:9, textDecoration:"none",
              border:`1px solid ${T.accent}`, color:T.accent, whiteSpace:"nowrap" }}>Buy me a coffee ↗</a>
        </div>

        <div style={{ display:"flex", gap:8, marginTop:18 }}>
          <button onClick={() => { saveSettings(S); onClose(); }} style={{ flex:1, padding:"10px", fontSize:13, fontWeight:700, borderRadius:9,
            border:"none", background:T.accent, color:T.accentText, cursor:"pointer" }}>💾 {UI.saveSession}</button>
          <button onClick={() => { if (confirm(UI.reset + "?")) { setS({ ...DEFAULT_SETTINGS }); } }}
            style={{ padding:"10px 16px", fontSize:13, fontWeight:700, borderRadius:9, border:`1px solid ${T.border}`,
            background:"transparent", color:T.bad, cursor:"pointer" }}>{UI.reset}</button>
        </div>
      </div>
    </React.Fragment>
  );
}

// Persistent bottom bar: word roles + token/context usage
function BottomBar({ S, dueCount, nav }) {
  const T = React.useContext(ThemeCtx);
  const u = useUsage();
  const roles = Object.entries(ROLES).filter(([k,v]) => v.color && k !== "v");
  const total = u.in + u.out;
  return (
    <div style={{ position:"fixed", left:0, right:0, bottom:0, zIndex:75, background:T.panel+"f2", backdropFilter:"blur(10px)",
      borderTop:`1px solid ${T.border}`, padding:"6px 14px", display:"flex", alignItems:"center", gap:12, overflowX:"auto" }}>
      {S.showRoles ? (
        <React.Fragment>
          <span style={{ fontSize:9, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, flexShrink:0 }}>{UI.roles.toUpperCase()}</span>
          <div style={{ display:"flex", flexWrap:"nowrap", gap:"0 10px", flex:1, alignItems:"center" }}>
            {roles.map(([k,v]) => {
              // Which language the bar itself is written in is a setting; the
              // tooltip always shows both so nothing is lost either way.
              const lang = S.rolesLang === "secondary" && S.secondary ? S.secondary : S.primary;
              return (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }} title={roleLabel(k, S)}>
                  <span style={{ width:8, height:8, borderRadius:99, background:v.color, flexShrink:0 }}></span>
                  <span style={{ fontSize:10, color:T.text, whiteSpace:"nowrap" }}>{roleMeaning(v, lang)}</span>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ) : <span style={{ flex:1 }}></span>}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8, fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.faint }}>
        {dueCount > 0 && nav && (
          <button onClick={() => nav("review")} title={UI.review}
            style={{ padding:"2px 9px", fontSize:10, fontWeight:700, borderRadius:99, cursor:"pointer",
              border:`1px solid ${T.accent}66`, background:T.accent+"1a", color:T.accent,
              fontFamily:"'JetBrains Mono',monospace" }}>🔁 {dueCount} {UI.due}</button>
        )}
        {S.debug && u.calls > 0 && (
          <span style={{ color:"#f59e0b" }} title="last call: time · in/out tokens · output tokens per second">
            🐞 {u.lastMs}ms ↑{u.lastIn} ↓{u.lastOut} {u.lastTps ? u.lastTps.toFixed(1)+" tok/s" : ""}
          </span>
        )}
        {u.calls > 0 ? (
          <React.Fragment>
            <span title="context this session" style={{ color:T.accent }}>◈ {total.toLocaleString()} {UI.tokens}</span>
            <span>↑{u.in.toLocaleString()} ↓{u.out.toLocaleString()}</span>
            <span>· {u.calls} calls</span>
            <span style={{ opacity:.7 }}>· {u.last}</span>
          </React.Fragment>
        ) : <span style={{ opacity:.6 }}>◇ {UI.noLlm}</span>}
      </div>
    </div>
  );
}

// Primary navigation, shared by the desktop header tabs and the mobile tab bar.
const NAV_ITEMS = [
  { id:"map",      icon:"🗺️", key:"map" },
  { id:"lab",      icon:"🔬", key:"lab" },
  { id:"lucy",     icon:"✨", key:"lucy" },
  { id:"review",   icon:"🔁", key:"review" },
  { id:"reader",   icon:"📖", key:"reader" },
  { id:"progress", icon:"📈", key:"progress" }
];

function MobileNav({ view, nav, T, dueCount }) {
  return (
    <div style={{ position:"fixed", left:0, right:0, bottom:0, zIndex:78, background:T.panel+"f5",
      backdropFilter:"blur(12px)", borderTop:`1px solid ${T.border}`, display:"flex",
      paddingBottom:"env(safe-area-inset-bottom)" }}>
      {NAV_ITEMS.map(it => {
        const on = view === it.id;
        return (
          <button key={it.id} onClick={() => nav(it.id)} style={{ flex:1, padding:"7px 2px 6px", border:"none",
            background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            color: on ? T.accent : T.faint, position:"relative" }}>
            <span style={{ fontSize:17, opacity: on ? 1 : .75 }}>{it.icon}</span>
            <span style={{ fontSize:9.5, fontWeight: on ? 700 : 500, whiteSpace:"nowrap" }}>{UI[it.key]}</span>
            {it.id === "review" && dueCount > 0 && (
              <span style={{ position:"absolute", top:4, right:"50%", marginRight:-18, minWidth:15, height:15,
                borderRadius:99, background:T.accent, color:T.accentText, fontSize:9, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>
                {dueCount > 99 ? "99+" : dueCount}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Shown when the selected provider cannot answer — the common case for a fresh
// GitHub Pages visitor, whose default "built-in Claude" does not exist outside
// the Claude app. The Grammar Map still works, so this informs rather than blocks.
function SetupNotice({ onSettings, onDismiss }) {
  const T = React.useContext(ThemeCtx);
  return (
    <div style={{ maxWidth:1280, margin:"14px auto 0", padding:"0 16px" }}>
      <div style={{ padding:"14px 16px", borderRadius:12, background:T.whyBg, border:`1px solid ${T.whyBd}`,
        display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>🔌</span>
        <div style={{ flex:"1 1 260px", minWidth:0 }}>
          <div style={{ fontSize:13.5, fontWeight:800, color:T.whyTitle }}>{UI.setupTitle}</div>
          <div style={{ fontSize:12.5, color:T.whyText, lineHeight:1.55, marginTop:4 }}>{UI.setupBody}</div>
        </div>
        <div style={{ display:"flex", gap:7, flexShrink:0 }}>
          <button onClick={onSettings} style={{ padding:"7px 14px", fontSize:12.5, fontWeight:700, borderRadius:9,
            border:"none", background:T.accent, color:T.accentText, cursor:"pointer", whiteSpace:"nowrap" }}>⚙ {UI.setupBtn}</button>
          <button onClick={onDismiss} style={{ padding:"7px 12px", fontSize:12.5, borderRadius:9,
            border:`1px solid ${T.whyBd}`, background:"transparent", color:T.whyText, cursor:"pointer", whiteSpace:"nowrap" }}>{UI.dismiss}</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [S, setSraw] = React.useState(loadSettings);
  applyLang(S.primary);
  setActiveMap(S.target);   // point CLUSTERS / NODE_INDEX at this language's map
  const setS = (next) => { setSraw(next); saveSettings(next); };
  const T = THEMES[S.theme] || THEMES.night;

  const { route, nav, replace } = useRoute();
  const view = route.view;
  const mobile = useMedia("(max-width: 720px)");
  const online = useOnline();
  const install = useInstallPrompt();

  // Map browsing state persists, so returning from Lucy or Review lands you
  // exactly where you left the map — same query, same level filter.
  const [query, setQuery] = usePersistent(KEYS.ui + ":query", "");
  const [levelCap, setLevelCap] = usePersistent(KEYS.ui + ":levelCap", "all");
  const [drawer, setDrawer] = React.useState(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const [setupDismissed, setSetupDismissed] = usePersistent(KEYS.ui + ":setupDismissed", false);
  const needsSetup = !providerReady(S) && !setupDismissed;

  // Cross-view handoffs: Reader → Lab, Reader → Lucy.
  const [labInput, setLabInput] = usePersistent(KEYS.labState + ":input", "");
  const [lucySeed, setLucySeed] = React.useState("");

  const tgt = TARGET_LANGS.find(l => l.code === S.target) || TARGET_LANGS[0];
  const mapAvailable = tgt.hasMap;

  // A rule is addressable: #/map/de_het opens the map with that drawer open, so
  // links survive reloads and can be shared or bookmarked from any device.
  const openNode = React.useCallback((id) => {
    if (NODE_INDEX[id]) nav("map", id);
  }, [nav]);
  React.useEffect(() => {
    if (view !== "map") return;
    if (route.arg && NODE_INDEX[route.arg]) setDrawer({ type:"node", id:route.arg });
    else if (!route.arg) setDrawer(d => (d && d.type === "node") ? null : d);
  }, [view, route.arg]);
  const closeDrawer = () => { setDrawer(null); if (view === "map" && route.arg) replace("map", ""); };

  const [dueCount, setDueCount] = React.useState(0);
  React.useEffect(() => {
    const recount = () => setDueCount(dueCards(syncCards(jget(KEYS.vocab, []), jget(KEYS.mistakes, []))).length);
    recount();
    const iv = setInterval(recount, 30000);
    return () => clearInterval(iv);
  }, [view]);

  React.useEffect(() => { document.body.style.background = T.bg; }, [T]);
  React.useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", T.bg);
  }, [T]);

  // Global shortcuts: ⌘/Ctrl-K palette, ⌘/Ctrl-, settings, 1-6 jump to a view.
  React.useEffect(() => {
    const h = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette(p => !p); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === ",") { e.preventDefault(); setShowSettings(true); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= NAV_ITEMS.length) { nav(NAV_ITEMS[n-1].id); }
      else if (e.key === "Escape") { setPalette(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [nav]);

  const TabBtn = ({ id, label }) => (
    <button onClick={() => nav(id)}
      style={{ padding:"6px 13px", fontSize:12.5, fontWeight:700, borderRadius:8, border:"none", cursor:"pointer",
        background: view===id ? T.accent : "transparent", color: view===id ? T.accentText : T.mute, whiteSpace:"nowrap" }}>{label}</button>
  );

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ minHeight:"100vh", background: T.bgGrad !== "none" ? `${T.bgGrad}, ${T.bg}` : T.bg,
        fontFamily:"'IBM Plex Sans',sans-serif", paddingBottom: mobile ? 96 : 44 }}>
        <div style={{ position:"sticky", top:0, zIndex:70, background:T.bg+"e8", backdropFilter:"blur(10px)",
          borderBottom:`1px solid ${T.border}`, padding:"0 14px", paddingTop:"env(safe-area-inset-top)" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", gap:10, height: mobile ? 52 : 58 }}>
            <button onClick={() => nav("map")} style={{ background:"none", border:"none", cursor:"pointer", padding:0,
              fontSize:15, fontWeight:800, color:T.text, letterSpacing:-.3, whiteSpace:"nowrap" }}>
              <span style={{ color:T.accent }}>Lingua</span>Map</button>
            {!mobile && (
              <div style={{ display:"flex", gap:2, background:T.panel, borderRadius:10, padding:3 }}>
                <TabBtn id="map" label={UI.map} />
                <TabBtn id="lab" label={UI.lab} />
                <TabBtn id="lucy" label={"✨ " + UI.lucy} />
                <TabBtn id="review" label={UI.review + (dueCount ? " · " + dueCount : "")} />
                <TabBtn id="reader" label={UI.reader} />
                <TabBtn id="progress" label={UI.progress} />
              </div>
            )}
            <span style={{ flex:1 }}></span>
            {!online && <span title={UI.offline} style={{ fontSize:11, color:"#f59e0b" }}>⚡</span>}
            {install.available && (
              <button onClick={install.prompt} title={UI.install} style={{ padding:"6px 10px", fontSize:12, borderRadius:9,
                cursor:"pointer", border:`1px solid ${T.accent}`, background:"transparent", color:T.accent, whiteSpace:"nowrap" }}>
                ⬇{mobile ? "" : " " + UI.install}</button>
            )}
            <button onClick={() => setPalette(true)} title={UI.palette + " (Ctrl+K)"}
              style={{ padding:"6px 10px", fontSize:12, borderRadius:9, cursor:"pointer",
                border:`1px solid ${T.border}`, background:T.panel, color:T.mute }}>🔎</button>
            {!mobile && (
              <button onClick={() => setS({ ...S, showRoles: !S.showRoles })} title="Toggle word roles bar"
                style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 11px", fontSize:12, borderRadius:9, cursor:"pointer",
                  border:`1px solid ${S.showRoles ? T.accent : T.border}`, background: S.showRoles ? T.accent+"22" : T.panel, color: S.showRoles ? T.accent : T.mute }}>
                🎨 <span style={{ whiteSpace:"nowrap" }}>{S.showRoles ? UI.rolesOn : UI.rolesOff}</span></button>
            )}
            <button onClick={() => setShowSettings(true)} title={`${tgt.flag} ${tgt.name} → ${langName(S.primary)}`}
              style={{ display:"flex", alignItems:"center", gap:6, background:T.panel, border:`1px solid ${T.border}`, color:T.text,
                padding:"6px 11px", height:34, borderRadius:9, cursor:"pointer", fontSize:13, flexShrink:0 }}>
              <span style={{ fontSize:15 }}>{tgt.flag}</span>
              {!mobile && <React.Fragment><span style={{ color:T.faint }}>→</span>{langName(S.primary)}</React.Fragment>}
              <span style={{ marginLeft:2 }}>⚙</span></button>
          </div>
          {view === "map" && mapAvailable && (
            <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", gap:10, paddingBottom:11, flexWrap:"wrap" }}>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={UI.search}
                style={{ flex:1, minWidth:140, padding:"8px 14px", fontSize:13, borderRadius:10, border:`1px solid ${T.border}`, background:T.panel, color:T.text, outline:"none" }} />
              <div style={{ display:"flex", gap:2, background:T.panel, borderRadius:8, padding:3 }}>
                {["all",...LEVELS].map(l => (
                  <button key={l} onClick={() => setLevelCap(l)} style={{ padding:"4px 9px", fontSize:10.5, fontWeight:700, borderRadius:6, border:"none", cursor:"pointer",
                    fontFamily:"'JetBrains Mono',monospace", background: levelCap===l ? (LEVEL_COLOR[l]||T.accent) : "transparent",
                    color: levelCap===l ? "#04121f" : (LEVEL_COLOR[l]||T.mute) }}>{l==="all"?UI.all:l}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {needsSetup && <SetupNotice onSettings={() => setShowSettings(true)} onDismiss={() => setSetupDismissed(true)} />}

        {view === "map" && (mapAvailable ? (
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"22px 16px 40px", columnWidth: mobile ? "auto" : 330, columnGap:18 }}>
            {CLUSTERS.map(c => <ClusterCard key={c.id} cluster={c} levelCap={levelCap} query={query} lang={S.primary}
              onOpen={openNode} onOpenExc={(cid, idx) => setDrawer({ type:"exc", cid, idx })} />)}
          </div>
        ) : (
          <div style={{ maxWidth:560, margin:"60px auto", padding:"0 20px", textAlign:"center" }}>
            <div style={{ fontSize:48 }}>{tgt.flag}</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.text, marginTop:10 }}>{tgt.name}</div>
            <div style={{ fontSize:14, color:T.mute, lineHeight:1.6, marginTop:10 }}>{UI.mapOnlyNl}</div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:20, flexWrap:"wrap" }}>
              <button onClick={() => nav("lab")} style={{ padding:"9px 18px", fontSize:13, fontWeight:700, borderRadius:10, border:`1px solid ${T.border}`, background:T.panel, color:T.text, cursor:"pointer" }}>{UI.lab} →</button>
              <button onClick={() => nav("lucy")} style={{ padding:"9px 18px", fontSize:13, fontWeight:700, borderRadius:10, border:"none", background:T.accent, color:T.accentText, cursor:"pointer" }}>✨ {UI.lucy} →</button>
            </div>
          </div>
        ))}
        {view === "lab" && <SentenceLab S={S} input={labInput} setInput={setLabInput} onOpenNode={openNode} />}
        {view === "lucy" && <Lucy S={S} setS={setS} seed={lucySeed} clearSeed={() => setLucySeed("")} onOpenNode={openNode} />}
        {view === "review" && <Review S={S} nav={nav} />}
        {view === "progress" && <Progress S={S} nav={nav} onOpenNode={openNode} />}
        {view === "reader" && <Reader S={S} nav={nav} setLabInput={setLabInput} setLucySeed={setLucySeed} />}
        {view === "practice" && <Practice S={S} ruleId={route.arg} nav={nav} onOpenNode={openNode} />}

        <Drawer target={drawer} S={S} onClose={closeDrawer} onOpen={openNode}
          onPractice={id => { setDrawer(null); nav("practice", id); }}
          onDrill={prompt => { setDrawer(null); setLucySeed(prompt); nav("lucy"); }} />
        {showSettings && <Settings S={S} setS={setS} onClose={() => setShowSettings(false)} />}
        <CommandPalette open={palette} setOpen={setPalette} S={S} nav={nav} onOpenNode={openNode}
          onSettings={() => setShowSettings(true)} />
        {mobile ? <MobileNav view={view} nav={nav} T={T} dueCount={dueCount} /> : <BottomBar S={S} dueCount={dueCount} nav={nav} />}
      </div>
    </ThemeCtx.Provider>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
