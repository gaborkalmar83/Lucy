// LinguaMap v3 — Review (SRS), Progress, Reader, Practice, Command palette, Backup.

// ── Shared: speak button ─────────────────────────────────────────────────────
function SpeakBtn({ text, lang, S, size, title }) {
  const T = React.useContext(ThemeCtx);
  const [on, setOn] = React.useState(false);
  if (!ttsOk() || !text) return null;
  const go = (e) => {
    e && e.stopPropagation();
    if (on) { stopSpeaking(); setOn(false); return; }
    // "Everywhere" routes the 🔊 buttons through the configured cloud voice;
    // anything else (or a failure) uses the browser's own synthesis.
    const V = S.voice || {};
    if (V.ttsScope === "everywhere" && V.engine === "azure" && V.voiceName && V.speechRegion) {
      azureSpeak(text, S).catch(() => speak(text, lang || S.target, S));
    } else speak(text, lang || S.target, S);
    setOn(true);
    const iv = setInterval(() => { if (!speechSynthesis.speaking) { setOn(false); clearInterval(iv); } }, 400);
  };
  return (
    <button onClick={go} title={title || UI.speak} style={{ background:"transparent", border:"none", cursor:"pointer",
      color: on ? T.accent : T.faint, fontSize: size || 14, padding:"2px 4px", lineHeight:1, flexShrink:0 }}>
      {on ? "◼" : "🔊"}
    </button>
  );
}

// ── Review: spaced repetition ────────────────────────────────────────────────
function Review({ S, nav }) {
  const T = React.useContext(ThemeCtx);
  const [cards, setCards] = React.useState(() => syncCards(jget(KEYS.vocab, []), jget(KEYS.mistakes, [])));
  const [queue, setQueue] = React.useState(null);       // null = not started
  const [idx, setIdx] = React.useState(0);
  const [shown, setShown] = React.useState(false);
  const [tally, setTally] = React.useState({ done:0, good:0 });
  const days = useDays();
  const today = days[todayKey()] || { reviews:0 };

  const due = dueCards(cards);
  const card = queue && queue[idx];

  const start = () => {
    const q = dueCards(syncCards(jget(KEYS.vocab, []), jget(KEYS.mistakes, [])))
      .sort((a,b) => a.due - b.due).slice(0, Math.max(S.dailyGoal || 20, 1));
    setQueue(q); setIdx(0); setShown(false); setTally({ done:0, good:0 });
  };

  const grade = (g) => {
    if (!card) return;
    const updated = schedule(card, g);
    const all = loadCards().map(c => c.id === updated.id ? updated : c);
    saveCards(all); setCards(all);
    bumpDay({ reviews:1, correct: g > 0 ? 1 : 0, xp: g === 0 ? 1 : g === 1 ? 3 : g === 2 ? 5 : 7 });
    setTally(t => ({ done:t.done+1, good:t.good + (g>0?1:0) }));
    // A lapsed card comes back at the end of this same session.
    if (g === 0) setQueue(q => [...q.slice(0, idx), ...q.slice(idx+1), updated]);
    else setQueue(q => [...q.slice(0, idx), ...q.slice(idx+1)]);
    setShown(false);
    setIdx(i => (i >= (queue.length - 1) ? 0 : i));
  };

  // Keyboard: space reveals, 1-4 grades. Makes desktop review fast.
  React.useEffect(() => {
    if (!queue || !card) return;
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); setShown(true); }
      else if (shown && ["1","2","3","4"].includes(e.key)) { e.preventDefault(); grade(Number(e.key) - 1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [queue, card, shown, idx]);

  const wrap = { maxWidth:640, margin:"0 auto", padding:"26px 18px 40px" };

  if (!queue) return (
    <div style={wrap}>
      <div style={{ fontSize:22, fontWeight:800, color:T.text, letterSpacing:-.5 }}>🔁 {UI.review}</div>
      <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
        <Stat label={UI.due} value={due.length} color={due.length ? T.accent : T.faint} T={T} />
        <Stat label={UI.cards} value={cards.length} T={T} />
        <Stat label={UI.dailyGoalLbl} value={(today.reviews||0) + " / " + (S.dailyGoal||20)} T={T} />
      </div>
      {due.length === 0 ? (
        <div style={{ marginTop:26, padding:"22px 18px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}`,
          color:T.mute, fontSize:14, textAlign:"center", lineHeight:1.6 }}>
          {cards.length === 0
            ? "No cards yet. Save words from Lucy or the Reader (“+ vocab”) — Lucy's corrections become cards automatically."
            : UI.noDue}
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:14, flexWrap:"wrap" }}>
            <button onClick={() => nav("lucy")} style={btn(T, true)}>✨ {UI.lucy}</button>
            <button onClick={() => nav("reader")} style={btn(T)}>📖 {UI.reader}</button>
          </div>
        </div>
      ) : (
        <button onClick={start} style={{ ...btn(T, true), marginTop:22, padding:"13px 26px", fontSize:15 }}>
          {UI.startReview} · {Math.min(due.length, S.dailyGoal||20)}
        </button>
      )}
      {cards.length > 0 && <CardList cards={cards} setCards={setCards} S={S} T={T} />}
    </div>
  );

  if (!card) return (
    <div style={{ ...wrap, textAlign:"center" }}>
      <div style={{ fontSize:46 }}>🎉</div>
      <div style={{ fontSize:20, fontWeight:800, color:T.text, marginTop:8 }}>{UI.reviewDone}</div>
      <div style={{ fontSize:14, color:T.mute, marginTop:6 }}>
        {tally.done} {UI.cards} · {UI.accuracy} {tally.done ? Math.round(tally.good/tally.done*100) : 0}%
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:18, flexWrap:"wrap" }}>
        <button onClick={() => setQueue(null)} style={btn(T, true)}>← {UI.review}</button>
        <button onClick={() => nav("progress")} style={btn(T)}>📈 {UI.progress}</button>
      </div>
    </div>
  );

  const isMistake = card.type === "mistake";
  return (
    <div style={wrap}>
      <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:11, color:T.faint,
        fontFamily:"'JetBrains Mono',monospace" }}>
        <span>{queue.length} {UI.cardsLeft}</span>
        <div style={{ flex:1, height:4, background:T.chip, borderRadius:9 }}>
          <div style={{ width: (tally.done/(tally.done+queue.length)*100 || 0)+"%", height:"100%",
            background:T.accent, borderRadius:9, transition:"width .3s" }}></div>
        </div>
        <button onClick={() => setQueue(null)} style={{ ...btn(T), padding:"3px 10px", fontSize:11 }}>{UI.endSession}</button>
      </div>

      <div style={{ marginTop:20, padding:"32px 22px", borderRadius:16, background:T.panel,
        border:`1px solid ${T.border}`, textAlign:"center", minHeight:210,
        display:"flex", flexDirection:"column", justifyContent:"center", gap:14 }}>
        <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5 }}>
          {isMistake ? "⚠ " + UI.mistakesTab : "🗂️ " + UI.vocabTab}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:24, fontWeight:800, color: isMistake ? T.bad : T.text,
            fontFamily:"'JetBrains Mono',monospace", textDecoration: isMistake ? "line-through" : "none" }}>{card.front}</span>
          {!isMistake && <SpeakBtn text={card.front} lang={card.lang || S.target} S={S} size={18} />}
        </div>
        {shown ? (
          <React.Fragment>
            <div style={{ height:1, background:T.border }}></div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:18, color: isMistake ? T.good : T.mute, fontWeight:600 }}>{card.back}</span>
              {isMistake && <SpeakBtn text={card.back} lang={S.target} S={S} size={16} />}
            </div>
            {card.note && <div style={{ fontSize:12, color:T.faint }}>📚 {card.note}</div>}
          </React.Fragment>
        ) : (
          <button onClick={() => setShown(true)} style={{ ...btn(T, true), alignSelf:"center", padding:"10px 22px" }}>
            {UI.showAnswer} <span style={{ opacity:.6, fontSize:11 }}>space</span>
          </button>
        )}
      </div>

      {shown && (
        <div style={{ display:"flex", gap:7, marginTop:14 }}>
          {[[0,UI.again,T.bad],[1,UI.hard,"#f59e0b"],[2,UI.good,T.good],[3,UI.easy,T.accent]].map(([g,l,c]) => (
            <button key={g} onClick={() => grade(g)} style={{ flex:1, padding:"12px 6px", fontSize:13, fontWeight:700,
              borderRadius:10, cursor:"pointer", border:`1px solid ${c}55`, background:c+"1a", color:c }}>
              {l}<div style={{ fontSize:9, opacity:.65, fontWeight:500, marginTop:2 }}>{g+1}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CardList({ cards, setCards, S, T }) {
  const [open, setOpen] = React.useState(false);
  const sorted = [...cards].sort((a,b) => a.due - b.due);
  return (
    <div style={{ marginTop:26 }}>
      <button onClick={() => setOpen(!open)} style={{ ...btn(T), fontSize:12 }}>
        {open ? "▾" : "▸"} {cards.length} {UI.cards}
      </button>
      {open && (
        <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:10 }}>
          {sorted.map(c => {
            const overdue = c.due <= Date.now();
            return (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 11px",
                background:T.panel2, borderRadius:9, border:`1px solid ${T.border}` }}>
                <span style={{ fontSize:11, flexShrink:0 }}>{c.type === "mistake" ? "⚠" : "🗂️"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, color:T.text, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.front}</div>
                  <div style={{ fontSize:11, color:T.faint, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.back}</div>
                </div>
                <span style={{ fontSize:9.5, color: overdue ? T.accent : T.faint, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>
                  {overdue ? UI.due : "+" + Math.max(1, Math.round((c.due - Date.now())/DAY)) + "d"}
                </span>
                <button onClick={() => { const n = cards.filter(x => x.id !== c.id); saveCards(n); setCards(n); }}
                  style={{ background:"none", border:"none", color:T.faint, cursor:"pointer", flexShrink:0 }}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Progress dashboard ───────────────────────────────────────────────────────
function Stat({ label, value, color, T, sub }) {
  return (
    <div style={{ flex:"1 1 110px", minWidth:100, padding:"12px 14px", borderRadius:12,
      background:T.panel, border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:9.5, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.2 }}>{String(label).toUpperCase()}</div>
      <div style={{ fontSize:22, fontWeight:800, color: color || T.text, marginTop:3, letterSpacing:-.5 }}>{value}</div>
      {sub && <div style={{ fontSize:10.5, color:T.faint, marginTop:1 }}>{sub}</div>}
    </div>
  );
}

function Progress({ S, nav, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  const days = useDays();
  const u = useUsage();
  const cards = loadCards();
  const stats = loadRuleStats();
  const today = days[todayKey()] || { reviews:0, correct:0, xp:0 };
  const streak = streakOf(days);
  const totalXp = Object.values(days).reduce((a,d) => a + (d.xp||0), 0);
  const totalRev = Object.values(days).reduce((a,d) => a + (d.reviews||0), 0);
  const totalOk = Object.values(days).reduce((a,d) => a + (d.correct||0), 0);
  const goalPct = Math.min(100, Math.round((today.reviews||0) / Math.max(1, S.dailyGoal||20) * 100));

  const ranked = Object.entries(stats)
    .map(([id, r]) => ({ id, r, m: masteryOf(r), n: r.ok + r.bad, node: NODE_INDEX[id] }))
    .filter(x => x.node && x.n >= 2)
    .sort((a,b) => a.m - b.m);
  const weakest = ranked.slice(0, 6);
  const strongest = [...ranked].reverse().slice(0, 4);

  // 12-week activity grid
  const weeks = 12, cells = [];
  const end = new Date(); end.setHours(0,0,0,0);
  for (let i = weeks*7 - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i*DAY);
    const k = todayKey(d.getTime());
    const v = days[k];
    cells.push({ k, n: v ? (v.reviews||0) + (v.chats||0) + (v.lessons||0) : 0 });
  }
  const max = Math.max(1, ...cells.map(c => c.n));

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"26px 18px 40px" }}>
      <div style={{ fontSize:22, fontWeight:800, color:T.text, letterSpacing:-.5 }}>📈 {UI.progress}</div>

      <div style={{ display:"flex", gap:10, marginTop:18, flexWrap:"wrap" }}>
        <Stat label={UI.streak} value={streak} sub={UI.days} color={streak ? "#f59e0b" : T.faint} T={T} />
        <Stat label={UI.xp} value={totalXp.toLocaleString()} T={T} />
        <Stat label={UI.cards} value={cards.length} sub={dueCards(cards).length + " " + UI.due} T={T} />
        <Stat label={UI.accuracy} value={(totalRev ? Math.round(totalOk/totalRev*100) : 0) + "%"}
          sub={totalRev + " " + UI.review.toLowerCase()} T={T} />
      </div>

      <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:T.mute }}>
          <span style={{ fontWeight:700, color:T.text }}>{UI.dailyGoalLbl}</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>{today.reviews||0} / {S.dailyGoal||20}</span>
          {goalPct >= 100 && <span style={{ color:T.good, fontSize:11.5 }}>✓ {UI.goalMet}</span>}
          <span style={{ flex:1 }}></span>
          <button onClick={() => nav("review")} style={{ ...btn(T, goalPct < 100), fontSize:11.5, padding:"5px 12px" }}>🔁 {UI.review}</button>
        </div>
        <div style={{ height:7, background:T.chip, borderRadius:9, marginTop:9, overflow:"hidden" }}>
          <div style={{ width:goalPct+"%", height:"100%", background: goalPct>=100 ? T.good : T.accent, transition:"width .4s" }}></div>
        </div>
      </div>

      <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}`, overflowX:"auto" }}>
        <div style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.4, marginBottom:9 }}>
          {UI.activity.toUpperCase()}</div>
        <div style={{ display:"grid", gridTemplateRows:"repeat(7, 11px)", gridAutoFlow:"column", gap:3, minWidth:"max-content" }}>
          {cells.map(c => (
            <div key={c.k} title={c.k + " · " + c.n} style={{ width:11, height:11, borderRadius:2.5,
              background: c.n === 0 ? T.chip : T.accent, opacity: c.n === 0 ? .5 : 0.35 + 0.65*(c.n/max) }}></div>
          ))}
        </div>
      </div>

      {weakest.length > 0 ? (
        <div style={{ display:"flex", gap:14, marginTop:16, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 300px", padding:"14px 16px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.bad, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.4, marginBottom:10 }}>
              {UI.weakest.toUpperCase()}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {weakest.map(x => (
                <div key={x.id} style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <LevelBadge level={x.node.node.level} />
                  <button onClick={() => onOpenNode(x.id)} style={{ flex:1, textAlign:"left", background:"none", border:"none",
                    color:T.text, fontSize:12.5, cursor:"pointer", padding:0 }}>
                    {x.node.node["label_"+S.primary] || x.node.node.label_en}</button>
                  <div style={{ width:52, height:5, background:T.chip, borderRadius:9, flexShrink:0 }}>
                    <div style={{ width:(x.m*100)+"%", height:"100%", borderRadius:9,
                      background: x.m < .5 ? T.bad : x.m < .8 ? "#f59e0b" : T.good }}></div>
                  </div>
                  <button onClick={() => nav("practice", x.id)} title={UI.practice}
                    style={{ ...btn(T), padding:"2px 8px", fontSize:11, flexShrink:0 }}>✏️</button>
                </div>
              ))}
            </div>
          </div>
          {strongest.length > 0 && (
            <div style={{ flex:"1 1 220px", padding:"14px 16px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:10, color:T.good, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.4, marginBottom:10 }}>
                {UI.strongest.toUpperCase()}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {strongest.map(x => (
                  <div key={x.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:T.good, fontSize:12 }}>✓</span>
                    <button onClick={() => onOpenNode(x.id)} style={{ flex:1, textAlign:"left", background:"none", border:"none",
                      color:T.mute, fontSize:12.5, cursor:"pointer", padding:0 }}>
                      {x.node.node["label_"+S.primary] || x.node.node.label_en}</button>
                    <span style={{ fontSize:10.5, color:T.faint, fontFamily:"'JetBrains Mono',monospace" }}>{Math.round(x.m*100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop:16, padding:"18px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}`,
          color:T.faint, fontSize:13, textAlign:"center", lineHeight:1.6 }}>
          {UI.noData} <br />
          <span style={{ fontSize:12 }}>Analyze sentences in the Lab or run Practice drills — mastery per rule shows up here.</span>
        </div>
      )}

      <UsageReport T={T} />
    </div>
  );
}

// ── Model usage: what was spent, on which provider and model ────────────────
function UsageReport({ T }) {
  const [days, setDays] = React.useState(7);
  const log = React.useMemo(() => loadUsageLog(), []);
  const since = Date.now() - days * 86400000;
  const rows = log.filter(e => e.ts >= since);

  const byModel = {};
  let tIn = 0, tOut = 0, tMs = 0;
  rows.forEach(e => {
    const k = (e.provider || "?") + " · " + (e.model || "?");
    const b = byModel[k] || (byModel[k] = { calls:0, in:0, out:0, ms:0 });
    b.calls++; b.in += e.in || 0; b.out += e.out || 0; b.ms += e.ms || 0;
    tIn += e.in || 0; tOut += e.out || 0; tMs += e.ms || 0;
  });
  const list = Object.entries(byModel).sort((a,b) => (b[1].in + b[1].out) - (a[1].in + a[1].out));
  const tps = tMs > 0 ? (tOut / (tMs / 1000)) : 0;

  return (
    <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:10 }}>
        <span style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.4 }}>
          {UI.modelUsage.toUpperCase()}</span>
        <span style={{ flex:1 }}></span>
        {[[1,"24h"],[7,"7d"],[30,"30d"]].map(([d,l]) => (
          <button key={d} onClick={() => setDays(d)} style={{ padding:"3px 11px", fontSize:11, fontWeight:700,
            borderRadius:7, cursor:"pointer", border:`1px solid ${days===d ? T.accent : T.border}`,
            background: days===d ? T.accent+"22" : "transparent", color: days===d ? T.accent : T.mute }}>{l}</button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div style={{ fontSize:12.5, color:T.faint }}>{UI.noLlm}</div>
      ) : (
        <React.Fragment>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:12, color:T.mute,
            fontFamily:"'JetBrains Mono',monospace", marginBottom:10 }}>
            <span style={{ color:T.accent }}>◈ {(tIn+tOut).toLocaleString()} {UI.tokens}</span>
            <span>↑{tIn.toLocaleString()}</span>
            <span>↓{tOut.toLocaleString()}</span>
            <span>{rows.length} calls</span>
            {tps > 0 && <span>{tps.toFixed(1)} tok/s avg</span>}
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ borderCollapse:"collapse", fontSize:11.5, width:"100%", minWidth:400 }}>
              <tbody>
                <tr>{[UI.modelLbl, "calls", "↑ in", "↓ out", "tok/s"].map((h,i) => (
                  <th key={i} style={{ textAlign: i===0?"left":"right", padding:"4px 8px", color:T.faint,
                    fontFamily:"'JetBrains Mono',monospace", fontWeight:500, borderBottom:`1px solid ${T.border}` }}>{h}</th>
                ))}</tr>
                {list.map(([k, b]) => (
                  <tr key={k}>
                    <td style={{ padding:"4px 8px", color:T.text, borderBottom:`1px solid ${T.border}44` }}>{k}</td>
                    {[b.calls, b.in.toLocaleString(), b.out.toLocaleString(),
                      b.ms > 0 ? (b.out/(b.ms/1000)).toFixed(1) : "—"].map((v,i) => (
                      <td key={i} style={{ padding:"4px 8px", textAlign:"right", color:T.mute,
                        fontFamily:"'JetBrains Mono',monospace", borderBottom:`1px solid ${T.border}44` }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize:10, color:T.faint, marginTop:8 }}>{UI.usageNote}</div>
        </React.Fragment>
      )}
    </div>
  );
}

// ── Reader: bring your own text, or pull an article ──────────────────────────
const sentencesOf = (text) =>
  // No lookbehind: Safari before 16.4 throws on it.
  (String(text).match(/[^.!?…\n]+[.!?…]*/g) || []).map(s => s.trim()).filter(Boolean);

// One call per sentence returns an idiomatic translation in BOTH explanation
// languages plus role tags for the original. Roles are only *shown* when the
// global toggle is on, or when this row was asked for them explicitly.
async function analyseSentence(sentence, S) {
  const tgt = TARGET_LANGS.find(l => l.code === S.target) || {};
  const p1 = langName(S.primary), p2 = secondLang(S) ? langName(secondLang(S)) : null;
  const { text } = await llmCall(S, { maxTokens: 700, task: "reader",
    system: `You translate one ${tgt.name} sentence for a learner and label its grammar.
Reply with ONLY compact JSON, no fences:
{"p1":"idiomatic ${p1} translation"${p2 ? `,"p2":"idiomatic ${p2} translation"` : ""},"tokens":[["word","role"],…]}
roles: s,vfin,vinf,o,io,prep,neg,conn,adv,refl,part,art,q,pron,adj,x — tokens must cover every word of the ORIGINAL ${tgt.name} sentence, in order, so its word order can be colour-coded.
Translate the MEANING as a native speaker of each language would say it. Never translate word for word; use each language's own word order and idiom.`,
    messages: [{ role:"user", content: sentence }] });
  const m = text.match(/\{[\s\S]*\}/);
  const j = m ? JSON.parse(m[0]) : {};
  return { p1: j.p1 || "", p2: j.p2 || "", tokens: Array.isArray(j.tokens) ? j.tokens : null };
}

function ReaderRow({ sentence, idx, S, row, onRun, nav, setLabInput, setLucySeed, onSave, mobile }) {
  const T = React.useContext(ThemeCtx);
  const st = row && row.status;
  const showRoles = (S.showRoles || (row && row.roles)) && row && row.tokens;
  const words = sentence.split(/(\s+)/);

  const left = (
    <div style={{ flex:"1 1 0", minWidth:0, padding:"11px 13px" }}>
      <div style={{ fontSize:15.5, color:T.text, lineHeight:2 }}>
        {showRoles
          ? <Tokens tokens={row.tokens} size={15} S={S} onSave={onSave} />
          : words.map((w, wi) => /^\s+$/.test(w) || !w ? w
              : <HoverWord key={wi} word={w} S={S} onSave={onSave}
                  style={{ borderBottom:`1px dotted ${T.faint}55` }} />)}
      </div>
      <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:10, color:T.faint, fontFamily:"'JetBrains Mono',monospace" }}>{idx + 1}</span>
        <SpeakBtn text={sentence} S={S} size={13} />
        <button onClick={() => onRun(idx, false)} style={{ ...btn(T), fontSize:10.5, padding:"3px 9px" }}>
          {st === "loading" ? "…" : "🌐 " + UI.translate}</button>
        {!S.showRoles && (
          <button onClick={() => onRun(idx, true)} title={UI.runRolesHint}
            style={{ ...btn(T), fontSize:10.5, padding:"3px 9px",
              border:`1px solid ${row && row.roles ? T.accent : T.border}`,
              color: row && row.roles ? T.accent : T.mute }}>🎨 {UI.runRoles}</button>
        )}
        <button onClick={() => { setLabInput(sentence); nav("lab"); }}
          style={{ ...btn(T), fontSize:10.5, padding:"3px 9px" }}>🔬 {UI.analyze}</button>
        <button onClick={() => { setLucySeed("Explain this sentence for my level: " + sentence); nav("lucy"); }}
          style={{ ...btn(T), fontSize:10.5, padding:"3px 9px" }}>✨ {UI.askLucy}</button>
      </div>
    </div>
  );

  const right = (
    <div style={{ flex:"1 1 0", minWidth:0, padding:"11px 13px",
      borderLeft: mobile ? "none" : `1px solid ${T.border}`,
      borderTop: mobile ? `1px dashed ${T.border}` : "none",
      background: T.panel2 + "80" }}>
      {!row && <button onClick={() => onRun(idx, false)} style={{ ...btn(T), fontSize:11 }}>🌐 {UI.translate}</button>}
      {st === "loading" && <span style={{ color:T.faint, fontSize:13 }}>…</span>}
      {st === "err" && <span style={{ color:T.bad, fontSize:12 }}>{UI.errFail}</span>}
      {st === "done" && (
        <React.Fragment>
          <div style={{ fontSize:14, color:T.mute, lineHeight:1.6 }}>{row.p1}</div>
          {row.p2 && <div style={{ fontSize:13, color:T.faint, lineHeight:1.55, marginTop:5,
            fontStyle:"italic", borderTop:`1px dashed ${T.border}`, paddingTop:5 }}>{row.p2}</div>}
        </React.Fragment>
      )}
    </div>
  );

  // No overflow:hidden — it clipped the word-gloss cards.
  return (
    <div style={{ display:"flex", flexDirection: mobile ? "column" : "row", borderRadius:11,
      background:T.panel, border:`1px solid ${T.border}` }}>
      {left}{right}
    </div>
  );
}

function Reader({ S, nav, setLabInput, setLucySeed, handoff, onHandoffDone }) {
  const T = React.useContext(ThemeCtx);
  const mobile = useMedia("(max-width: 820px)");
  const [text, setText] = usePersistent(KEYS.readerText, "");
  const [url, setUrl] = usePersistent(KEYS.readerUrl, "");
  const [editing, setEditing] = React.useState(!text);
  const [fetching, setFetching] = React.useState(false);
  const [fetchErr, setFetchErr] = React.useState(null);
  const [vocab, setVocab] = React.useState(() => jget(KEYS.vocab, []));
  const [rows, setRows] = React.useState({});          // idx → {status,p1,p2,tokens,roles}
  const [bulk, setBulk] = React.useState(null);        // {done,total} while translating all
  const cancelBulk = React.useRef(false);
  const tgt = TARGET_LANGS.find(l => l.code === S.target) || {};

  const sentences = React.useMemo(() => sentencesOf(text), [text]);
  React.useEffect(() => { setRows({}); setBulk(null); }, [text]);   // new text → drop cached rows

  // An article arriving from the extension or the phone's share sheet. It lands
  // in the edit box rather than straight in a reading session, so the menus and
  // cookie banners that come with any scraped page can be trimmed first — the
  // same behaviour as fetching a URL. Works whether or not the Reader was
  // already open, and is consumed once so revisiting the tab does not reopen it.
  React.useEffect(() => {
    if (!handoff) return;
    setText(jget(KEYS.readerText, ""));
    setUrl(jget(KEYS.readerUrl, ""));
    setEditing(true);
    onHandoffDone && onHandoffDone();
  }, [handoff]);

  const runRow = React.useCallback(async (idx, wantRoles) => {
    const sentence = sentences[idx];
    if (!sentence) return;
    let skip = false;
    setRows(r => {
      const cur = r[idx];
      if (cur && cur.status === "loading") { skip = true; return r; }
      if (cur && cur.status === "done") { skip = true; return wantRoles ? { ...r, [idx]: { ...cur, roles:true } } : r; }
      return { ...r, [idx]: { status:"loading", roles: !!wantRoles } };
    });
    if (skip) return;
    try {
      const out = await analyseSentence(sentence, S);
      setRows(r => ({ ...r, [idx]: { ...out, status:"done", roles: !!wantRoles || !!(r[idx] && r[idx].roles) } }));
      bumpDay({ lessons: 1 });
    } catch(e) {
      setRows(r => ({ ...r, [idx]: { status:"err" } }));
    }
  }, [sentences, S]);

  // Sequential on purpose: a 60-sentence article fired in parallel trips the
  // rate limit on every free tier there is.
  const runAll = async () => {
    cancelBulk.current = false;
    const todo = sentences.map((_, i) => i).filter(i => !rows[i] || rows[i].status !== "done");
    setBulk({ done: 0, total: todo.length });
    for (let n = 0; n < todo.length; n++) {
      if (cancelBulk.current) break;
      await runRow(todo[n], S.showRoles);
      setBulk({ done: n + 1, total: todo.length });
    }
    setBulk(null);
  };

  const addVocab = (v) => {
    const n = [{ ...v, lang:S.target, ts:Date.now() }, ...vocab.filter(x => x.term !== v.term)];
    setVocab(n); jset(KEYS.vocab, n);
    syncCards(n, jget(KEYS.mistakes, []));       // straight into the review queue
  };

  // Browsers block cross-origin reads, so an article has to come through a
  // text-extraction proxy. It is configurable and can be emptied out entirely.
  const pull = async () => {
    const u = url.trim();
    if (!u) return;
    setFetching(true); setFetchErr(null);
    try {
      const proxy = (S.readerProxy || "").trim();
      const target = proxy ? proxy.replace(/\/?$/, "/") + u.replace(/^https?:\/\//, m => m) : u;
      const res = await fetch(target, { headers: { accept: "text/plain,text/html;q=0.9" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      let body = await res.text();
      if (/^\s*</.test(body)) {                   // raw HTML → strip to text
        const doc = new DOMParser().parseFromString(body, "text/html");
        doc.querySelectorAll("script,style,nav,header,footer,aside,form,noscript").forEach(n => n.remove());
        body = (doc.querySelector("article") || doc.body || doc).textContent || "";
      }
      body = body.replace(/^Title:.*$/m, "").replace(/^URL Source:.*$/m, "")
                 .replace(/^Markdown Content:.*$/m, "")
                 .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // markdown links → text
                 .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
                 .replace(/[#*_>`]/g, "")
                 .replace(/\n{3,}/g, "\n\n").trim();
      if (!body) throw new Error("nothing readable came back");
      // Stay in edit mode: the text lands in the box so it can be checked and
      // trimmed before committing to a reading session.
      setText(body.slice(0, 20000));
    } catch(e) {
      setFetchErr(String(e.message || e) + " — " + UI.readerFetchHint);
    }
    setFetching(false);
  };

  return (
    <div style={{ maxWidth: mobile ? 760 : 1100, margin:"0 auto", padding:"26px 18px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.text, letterSpacing:-.5 }}>📖 {UI.reader}</div>
        <span style={{ fontSize:13, color:T.faint }}>{tgt.flag} {tgt.name}</span>
        <span style={{ flex:1 }}></span>
        {text && <SpeakBtn text={text.slice(0, 1200)} S={S} size={16} />}
        {text && <button onClick={() => setEditing(!editing)} style={{ ...btn(T), fontSize:12 }}>
          {editing ? "📖 " + UI.reader : "✎ " + UI.edit}</button>}
      </div>

      {editing && (
        <React.Fragment>
          <div style={{ fontSize:13, color:T.mute, marginTop:8, lineHeight:1.55 }}>{UI.readerHint}</div>

          <div style={{ display:"flex", gap:7, marginTop:14, flexWrap:"wrap" }}>
            <input value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && pull()}
              placeholder="https://nos.nl/artikel/…"
              style={{ flex:"1 1 260px", minWidth:0, padding:"10px 13px", fontSize:13.5, borderRadius:10,
                border:`1px solid ${T.border}`, background:T.panel, color:T.text, outline:"none" }} />
            <button onClick={pull} disabled={fetching || !url.trim()}
              style={{ ...btn(T, !fetching && !!url.trim()), padding:"10px 18px" }}>
              {fetching ? "…" : "⬇ " + UI.fetchArticle}</button>
          </div>
          {fetchErr && <div style={{ marginTop:8, padding:"9px 12px", borderRadius:9, background:T.badBg,
            border:`1px solid ${T.badBd}`, color:T.bad, fontSize:12, lineHeight:1.5 }}>{fetchErr}</div>}
          <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{UI.readerProxyNote}</div>

          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={UI.readerPlaceholder}
            style={{ width:"100%", minHeight:200, marginTop:14, padding:"13px 15px", fontSize:14.5, lineHeight:1.7,
              borderRadius:12, border:`1px solid ${T.border}`, background:T.panel, color:T.text, outline:"none",
              fontFamily:"'IBM Plex Sans',sans-serif", resize:"vertical" }} />
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            <button onClick={() => setEditing(false)} disabled={!text.trim()}
              style={{ ...btn(T, !!text.trim()), padding:"9px 20px" }}>📖 {UI.reader} →</button>
            {text && <button onClick={() => setText("")} style={btn(T)}>{UI.reset}</button>}
          </div>
        </React.Fragment>
      )}

      {!editing && (
        <React.Fragment>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:12, flexWrap:"wrap",
            fontSize:11, color:T.faint }}>
            <span>{sentences.length} {UI.sentences}</span>
            <span>· {UI.hoverHint}</span>
            <span style={{ flex:1 }}></span>
            {bulk ? (
              <React.Fragment>
                <span style={{ color:T.accent }}>{bulk.done} / {bulk.total}</span>
                <button onClick={() => { cancelBulk.current = true; }} style={{ ...btn(T), fontSize:11 }}>{UI.stopSpeak}</button>
              </React.Fragment>
            ) : (
              <button onClick={runAll} style={{ ...btn(T, true), fontSize:11.5 }}>🌐 {UI.translateAll}</button>
            )}
          </div>
          <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
            {sentences.map((s, si) => (
              <ReaderRow key={si} sentence={s} idx={si} S={S} nav={nav} mobile={mobile} row={rows[si]} onRun={runRow}
                setLabInput={setLabInput} setLucySeed={setLucySeed} onSave={addVocab} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

// ── Practice: LLM-generated drills for one grammar rule ──────────────────────
function Practice({ S, ruleId, nav, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  // An id may name a rule node or an exception ("<cluster>__excN") — exceptions
  // are exactly the sort of thing worth drilling, so both get drills.
  const res = resolvePractice(ruleId);
  const isExc = !!(res && res.kind === "exception");
  const entry = res && res.kind === "node" ? { node: res.node } : null;
  const excTitle = isExc ? (res.exc["title_" + S.primary] || res.exc.title_en) : "";
  const excBody = isExc ? (res.exc["body_" + S.primary] || res.exc.body_en) : "";
  const [drill, setDrill] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [checked, setChecked] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const tgt = TARGET_LANGS.find(l => l.code === S.target);

  const generate = async () => {
    setBusy(true); setErr(null); setChecked(false); setAnswers({}); setDrill(null);
    try {
      const ctx = entry
        ? `RULE: ${entry.node.label_en} [${entry.node.level}]\n${entry.node.rule_en}`
        : isExc
        ? `EXCEPTION / PITFALL: ${res.exc.title_en}\n${res.exc.body_en}\nEvery item must hinge on exactly this exception.`
        : `Pick a grammar point suitable for CEFR ${S.level}.`;
      const { text } = await llmCall(S, { maxTokens:1400,
        system:`You write short grammar drills for a ${tgt.name} learner at CEFR ${S.level}. Explanations in ${langName(S.primary)}.
Respond ONLY with valid JSON, no fences:
{"title":"…","items":[{"q":"sentence with ___ for the blank","options":["a","b","c"],"answer":"a","why":"one line in ${langName(S.primary)}"}]}
Exactly 5 items. Each has 3 plausible options. The answer must be one of the options verbatim.`,
        messages:[{ role:"user", content: ctx }] });
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("no json");
      const d = JSON.parse(m[0]);
      if (!d.items || !d.items.length) throw new Error("no items");
      setDrill(d);
    } catch(e) { setErr(UI.errFail + " (" + e.message + ")"); }
    setBusy(false);
  };

  const check = () => {
    setChecked(true);
    let ok = 0;
    drill.items.forEach((it, i) => { if (answers[i] === it.answer) ok++; });
    // Feeds the mastery bars on the Progress page.
    for (let i = 0; i < drill.items.length; i++) bumpRule(ruleId, answers[i] === drill.items[i].answer);
    bumpDay({ lessons:1, xp: ok * 4, reviews:0 });
  };

  const score = drill && checked ? drill.items.filter((it,i) => answers[i] === it.answer).length : 0;

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"26px 18px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <button onClick={() => nav("map")} style={{ ...btn(T), fontSize:12 }}>←</button>
        <div style={{ fontSize:20, fontWeight:800, color:T.text, letterSpacing:-.4 }}>✏️ {UI.practiceTitle}</div>
      </div>

      {isExc && (
        <div style={{ marginTop:14, padding:"13px 15px", borderRadius:12, background:T.badBg, border:`1px solid ${T.badBd}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.bad, fontFamily:"'JetBrains Mono',monospace",
              border:`1px solid ${T.bad}55`, borderRadius:4, padding:"2px 7px" }}>⚠ {UI.exception}</span>
            <span style={{ flex:1, fontSize:15, fontWeight:800, color:T.text }}>{excTitle}</span>
          </div>
          <div style={{ fontSize:13, color:T.mute, marginTop:7, lineHeight:1.6 }}>{excBody}</div>
        </div>
      )}
      {entry && (
        <div style={{ marginTop:14, padding:"13px 15px", borderRadius:12, background:T.panel, border:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <LevelBadge level={entry.node.level} />
            <span style={{ flex:1, fontSize:15, fontWeight:800, color:T.text }}>
              {entry.node["label_"+S.primary] || entry.node.label_en}</span>
            <button onClick={() => onOpenNode(ruleId)} style={{ ...btn(T), fontSize:11 }}>{UI.map} ↗</button>
          </div>
          <div style={{ fontSize:13, color:T.mute, marginTop:7, lineHeight:1.6 }}>
            {entry.node["rule_"+S.primary] || entry.node.rule_en}</div>
        </div>
      )}

      {!drill && (
        <button onClick={generate} disabled={busy} style={{ ...btn(T, !busy), marginTop:16, padding:"12px 24px", fontSize:14 }}>
          {busy ? UI.analyzing : "✏️ " + UI.generate}</button>
      )}
      {err && <div style={{ marginTop:16, padding:13, borderRadius:10, background:T.badBg,
        border:`1px solid ${T.badBd}`, color:T.bad, fontSize:13 }}>{err}</div>}

      {drill && (
        <div style={{ marginTop:18 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:12 }}>{drill.title}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {drill.items.map((it, i) => {
              const picked = answers[i];
              const right = checked && picked === it.answer;
              const wrong = checked && picked && picked !== it.answer;
              return (
                <div key={i} style={{ padding:"13px 15px", borderRadius:12, background:T.panel,
                  border:`1px solid ${right ? T.goodBd : wrong ? T.badBd : T.border}` }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                    <span style={{ fontSize:11, color:T.faint, fontFamily:"'JetBrains Mono',monospace", marginTop:3 }}>{i+1}</span>
                    <span style={{ flex:1, fontSize:14.5, color:T.text, lineHeight:1.6,
                      fontFamily:"'JetBrains Mono',monospace" }}>{it.q}</span>
                    <SpeakBtn text={String(it.q).replace(/_+/g, it.answer)} S={S} size={13} />
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                    {(it.options||[]).map(o => {
                      const isPick = picked === o, isAns = checked && o === it.answer;
                      return (
                        <button key={o} onClick={() => !checked && setAnswers(a => ({ ...a, [i]:o }))} disabled={checked}
                          style={{ padding:"6px 13px", fontSize:13, borderRadius:8, cursor: checked ? "default" : "pointer",
                            fontFamily:"'JetBrains Mono',monospace",
                            border:`1px solid ${isAns ? T.good : isPick && wrong ? T.bad : T.border}`,
                            background: isAns ? T.goodBg : isPick ? (wrong ? T.badBg : T.chip) : "transparent",
                            color: isAns ? T.good : isPick && wrong ? T.bad : T.text }}>{o}</button>
                      );
                    })}
                  </div>
                  {checked && it.why && (
                    <div style={{ fontSize:12, color: right ? T.good : T.mute, marginTop:9, lineHeight:1.55 }}>
                      {right ? "✓ " : "→ "}{it.why}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16, alignItems:"center", flexWrap:"wrap" }}>
            {!checked ? (
              <button onClick={check} disabled={Object.keys(answers).length === 0}
                style={{ ...btn(T, Object.keys(answers).length > 0), padding:"11px 24px", fontSize:14 }}>{UI.checkAnswers}</button>
            ) : (
              <React.Fragment>
                <span style={{ fontSize:15, fontWeight:800, color: score === drill.items.length ? T.good : T.text }}>
                  {score} / {drill.items.length}</span>
                <button onClick={generate} disabled={busy} style={{ ...btn(T, true), padding:"9px 18px" }}>
                  {busy ? "…" : "↻ " + UI.nextDrill}</button>
                <button onClick={() => nav("progress")} style={btn(T)}>📈 {UI.progress}</button>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Command palette (Ctrl/Cmd-K) ─────────────────────────────────────────────
function CommandPalette({ open, setOpen, S, nav, onOpenNode, onSettings }) {
  const T = React.useContext(ThemeCtx);
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);

  const items = React.useMemo(() => {
    const out = [
      { k:"v:map", icon:"🗺️", label:UI.map, hint:"view", run:() => nav("map") },
      { k:"v:lab", icon:"🔬", label:UI.lab, hint:"view", run:() => nav("lab") },
      { k:"v:lucy", icon:"✨", label:UI.lucy, hint:"view", run:() => nav("lucy") },
      { k:"v:review", icon:"🔁", label:UI.review, hint:"view", run:() => nav("review") },
      { k:"v:progress", icon:"📈", label:UI.progress, hint:"view", run:() => nav("progress") },
      { k:"v:reader", icon:"📖", label:UI.reader, hint:"view", run:() => nav("reader") },
      { k:"a:settings", icon:"⚙", label:UI.settings, hint:"action", run:onSettings },
      { k:"a:export", icon:"💾", label:UI.exportAll, hint:"action", run:downloadBackup }
    ];
    if (S.target === "nl") {
      CLUSTERS.forEach(c => c.nodes.forEach(n => out.push({
        k:"n:"+n.id, icon:"·", label: n["label_"+S.primary] || n.label_en,
        hint: (c["title_"+S.primary] || c.title_en) + " · " + n.level,
        run:() => onOpenNode(n.id)
      })));
    }
    const s = q.trim().toLowerCase();
    if (!s) return out.slice(0, 8);
    return out.filter(i => (i.label + " " + i.hint).toLowerCase().includes(s)).slice(0, 30);
  }, [q, S.target, S.primary]);

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") { setOpen(false); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(i => Math.min(i+1, items.length-1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(i => Math.max(i-1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); const it = items[sel]; if (it) { it.run(); setOpen(false); } }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, items, sel]);

  if (!open) return null;
  return (
    <React.Fragment>
      <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, background:"#0008", zIndex:150 }}></div>
      <div style={{ position:"fixed", top:"12vh", left:"50%", transform:"translateX(-50%)", width:"min(560px,94vw)",
        zIndex:151, background:T.panel, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:"0 24px 70px #000b", overflow:"hidden" }}>
        <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setSel(0); }} placeholder={UI.search2}
          style={{ width:"100%", padding:"15px 18px", fontSize:15, border:"none", borderBottom:`1px solid ${T.border}`,
            background:"transparent", color:T.text, outline:"none" }} />
        <div style={{ maxHeight:"46vh", overflowY:"auto", padding:5 }}>
          {items.length === 0 && <div style={{ padding:"18px", textAlign:"center", color:T.faint, fontSize:13 }}>—</div>}
          {items.map((it, i) => (
            <button key={it.k} onClick={() => { it.run(); setOpen(false); }} onMouseEnter={() => setSel(i)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 12px", fontSize:13.5,
                border:"none", borderRadius:9, cursor:"pointer", textAlign:"left",
                background: i === sel ? T.chip : "transparent", color:T.text }}>
              <span style={{ fontSize:14, width:18, textAlign:"center", flexShrink:0 }}>{it.icon}</span>
              <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{it.label}</span>
              <span style={{ fontSize:10.5, color:T.faint, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{it.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

const btn = (T, primary) => ({ padding:"7px 14px", fontSize:12.5, fontWeight:700, borderRadius:9, cursor:"pointer",
  border: primary ? "none" : `1px solid ${T.border}`, background: primary ? T.accent : T.panel,
  color: primary ? T.accentText : T.mute, whiteSpace:"nowrap" });

Object.assign(window, { SpeakBtn, Review, Progress, Reader, Practice, CommandPalette, Stat, btn });
