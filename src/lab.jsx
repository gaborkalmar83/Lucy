// Sentence Lab — provider-agnostic analyzer
function buildRuleCatalog() {
  let out = [];
  CLUSTERS.forEach(c => {
    c.nodes.forEach(n => out.push(`- id:${n.id} [${n.level}] ${n.label_en}: ${n.rule_en}`));
    (c.exceptions||[]).forEach((e,i) => out.push(`- id:${c.id}_exc${i} [EXC] ${e.title_en}: ${e.body_en}`));
  });
  return out.join("\n");
}
const LAB_EXAMPLES = { nl:["Ik heb gisteren een boek gekocht","Morgen ik ga naar huis","Hij hebt geen tijd omdat hij werkt veel"],
  any:["Write any sentence in your target language"] };

function SentenceLab({ S, input, setInput, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  const t = UI;
  const [busy, setBusy] = React.useState(false);
  // The last analysis is kept, so switching to Lucy and back doesn't discard it.
  const [result, setResult] = usePersistent(KEYS.labState + ":result", null);
  const [error, setError] = React.useState(null);
  const dictate = useDictation(S.target, (txt) => setInput(txt));
  const isNl = S.target === "nl";
  const tgt = TARGET_LANGS.find(l=>l.code===S.target);

  const analyze = async () => {
    if (!input.trim() || busy) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const expl = langName(S.primary) + (S.secondary ? ` (add a one-line note in ${langName(S.secondary)} where an analogy helps)` : "");
      const catalog = isNl ? `RULE CATALOG (cite these ids):\n${buildRuleCatalog()}\n\n` : "";
      const sys = `You are a ${tgt.name} grammar checker for a learner. Explanations in ${expl}.
${isNl ? "You get a rule catalog with ids — only cite ids from it." : "Name rules concisely (id = short slug you invent, e.g. 'v2-word-order')."}
Respond ONLY with valid JSON, no fences:
{"verdict":"correct"|"errors"|"not_target_language","corrected":"…","tokens":[["word","role"],…],
"applied":[{"id":"…","label":"rule name","note":"how it's correctly applied"}],
"violated":[{"id":"…","label":"rule name","note":"what went wrong + fix"}],
"explanation":"2-3 sentences"}
roles: s,vfin,vinf,o,io,prep,neg,conn,adv,refl,part,art,q,pron,adj,x. Pick 3-6 relevant applied rules; list every real violation.`;
      const { text } = await llmCall(S, { system: sys, maxTokens: 2000,
        messages: [{ role:"user", content: catalog + "SENTENCE: " + input.trim() }] });
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("no json");
      const parsed = JSON.parse(m[0]);
      setResult(parsed);
      // Each analysis is evidence about which rules the learner controls; this
      // is what fills the mastery bars and "needs work" list on Progress.
      (parsed.applied || []).forEach(it => bumpRule(it.id, true));
      (parsed.violated || []).forEach(it => bumpRule(it.id, false));
      bumpDay({ lessons:1, xp: parsed.verdict === "correct" ? 6 : 3 });
    } catch (e) { setError(t.errFail + " (" + e.message + ")"); }
    setBusy(false);
  };

  const RuleChip = ({ item, ok }) => {
    const entry = isNl ? NODE_INDEX[item.id] : null;
    const label = item.label || (entry ? entry.node.label_en : item.id);
    return (
      <div onClick={() => entry && onOpenNode(item.id)} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 12px",
        borderRadius:10, background: ok ? T.goodBg : T.badBg, border:`1px solid ${ok ? T.goodBd : T.badBd}`, cursor: entry ? "pointer" : "default" }}>
        <span style={{ fontSize:14, lineHeight:1.2, color: ok ? T.good : T.bad }}>{ok ? "✓" : "✕"}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12.5, fontWeight:700, color: ok ? T.good : T.bad, fontFamily:"'JetBrains Mono',monospace" }}>
            {label}{entry ? " ↗" : ""}</div>
          <div style={{ fontSize:12.5, color:T.mute, marginTop:3, lineHeight:1.5 }}>{item.note}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:"28px 20px 40px" }}>
      <div style={{ fontSize:22, fontWeight:800, color:T.text, letterSpacing:-.5 }}>{tgt.flag} {t.analyzeTitle}</div>
      <div style={{ fontSize:13, color:T.mute, marginTop:6, lineHeight:1.5 }}>{t.analyzeHint}</div>
      <div style={{ display:"flex", gap:8, marginTop:18 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && analyze()}
          placeholder={isNl ? "Ik heb gisteren een boek gekocht…" : "…"}
          style={{ flex:1, padding:"12px 14px", fontSize:15, borderRadius:10, border:`1px solid ${T.border}`,
            background:T.panel, color:T.text, fontFamily:"'JetBrains Mono',monospace", outline:"none" }} />
        {dictate.supported && (
          <button onClick={() => dictate.listening ? dictate.stop() : dictate.start()}
            title={dictate.listening ? UI.micListening : UI.mic}
            style={{ padding:"12px 14px", fontSize:15, borderRadius:10, cursor:"pointer",
              border:`1px solid ${dictate.listening ? T.accent : T.border}`,
              background: dictate.listening ? T.accent+"22" : T.panel, color: dictate.listening ? T.accent : T.mute }}>
            🎤</button>
        )}
        <button onClick={analyze} disabled={busy} style={{ padding:"12px 22px", fontSize:14, fontWeight:700, borderRadius:10,
          border:"none", background: busy ? T.chip : T.accent, color: busy ? T.mute : T.accentText, cursor: busy ? "wait" : "pointer" }}>
          {busy ? t.analyzing : t.analyzeBtn}</button>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:10, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:11, color:T.faint }}>{t.tryEx}</span>
        {(LAB_EXAMPLES[S.target]||LAB_EXAMPLES.any).slice(0,3).map(s => (
          <button key={s} onClick={() => setInput(s)} style={{ padding:"3px 10px", fontSize:11, borderRadius:6, cursor:"pointer",
            border:`1px dashed ${T.border}`, background:"transparent", color:T.mute }}>{s}</button>
        ))}
      </div>
      {error && <div style={{ marginTop:20, padding:14, borderRadius:10, background:T.badBg, border:`1px solid ${T.badBd}`, color:T.bad, fontSize:13 }}>{error}</div>}
      {result && (
        <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ padding:"16px 18px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>
              {t.verdict} · {result.verdict === "correct" ? "✓" : result.verdict === "errors" ? "✕" : "?"}</div>
            {result.tokens && <div style={{ marginBottom:10 }}><Tokens tokens={result.tokens} size={16} /></div>}
            {result.verdict !== "correct" && result.corrected && (
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:T.good,
                fontFamily:"'JetBrains Mono',monospace", padding:"8px 12px",
                background:T.goodBg, borderRadius:8, border:`1px solid ${T.goodBd}` }}>
                <span style={{ flex:1 }}>→ {result.corrected}</span>
                <SpeakBtn text={result.corrected} S={S} size={14} />
              </div>
            )}
            {result.verdict === "correct" && input.trim() && (
              <div style={{ marginTop:2 }}><SpeakBtn text={input.trim()} S={S} size={14} /></div>
            )}
            <div style={{ fontSize:13, color:T.mute, marginTop:10, lineHeight:1.6 }}>{result.explanation}</div>
          </div>
          {result.violated?.length > 0 && (
            <div>
              <div style={{ fontSize:11, color:T.bad, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>
                ✕ {t.wrong} ({result.violated.length})</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{result.violated.map((it,i) => <RuleChip key={i} item={it} ok={false} />)}</div>
            </div>
          )}
          {result.applied?.length > 0 && (
            <div>
              <div style={{ fontSize:11, color:T.good, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>
                ✓ {t.correct} ({result.applied.length})</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{result.applied.map((it,i) => <RuleChip key={i} item={it} ok={true} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
window.SentenceLab = SentenceLab;
