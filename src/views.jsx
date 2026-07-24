// LinguaMap v3 — Review (SRS), Progress, Reader, Practice, Command palette, Backup.

// ── Shared: speak button ─────────────────────────────────────────────────────
function SpeakBtn({ text, lang, S, size, title }) {
  const T = React.useContext(ThemeCtx);
  const [on, setOn] = React.useState(false);
  if (!ttsOk() || !text) return null;
  const go = (e) => {
    e && e.stopPropagation();
    if (on) { stopSpeaking(); setOn(false); return; }
    speak(text, lang || S.target, S); setOn(true);
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

      {u.calls > 0 && (
        <div style={{ marginTop:16, fontSize:11, color:T.faint, fontFamily:"'JetBrains Mono',monospace" }}>
          ◈ {(u.in+u.out).toLocaleString()} {UI.tokens} · {u.calls} calls · {u.last}
        </div>
      )}
    </div>
  );
}

// ── Reader: bring your own text ──────────────────────────────────────────────
function Reader({ S, nav, setLabInput, setLucySeed }) {
  const T = React.useContext(ThemeCtx);
  const [text, setText] = usePersistent(KEYS.readerText, "");
  const [editing, setEditing] = React.useState(!text);
  const [sel, setSel] = React.useState(null);          // { word, gloss|"loading" }
  const [vocab, setVocab] = React.useState(() => jget(KEYS.vocab, []));
  const tgt = TARGET_LANGS.find(l => l.code === S.target);

  // Sentence split without lookbehind — Safari before 16.4 throws on it, and
  // this app is meant to run on whatever phone the learner already has.
  const sentences = React.useMemo(() =>
    (text.match(/[^.!?…\n]+[.!?…]*/g) || []).map(s => s.trim()).filter(Boolean), [text]);

  const lookup = async (raw) => {
    const word = raw.replace(/[.,!?;:()"'«»„“”—–]/g, "");
    if (!word) return;
    setSel({ word, gloss:"loading" });
    speak(word, S.target, S);
    try {
      const { text: g } = await llmCall(S, { maxTokens:120,
        system:`You translate a single ${tgt.name} word into ${langName(S.primary)}. Reply with ONLY: base form, part of speech, and a 2-4 word gloss. No sentences.`,
        messages:[{ role:"user", content: word }] });
      setSel({ word, gloss:g.trim() });
    } catch(e) { setSel({ word, gloss:"⚠ " + e.message }); }
  };

  const addVocab = () => {
    if (!sel || !sel.gloss || sel.gloss === "loading") return;
    const n = [{ term:sel.word, gloss:sel.gloss, lang:S.target, ts:Date.now() }, ...vocab.filter(x => x.term !== sel.word)];
    setVocab(n); jset(KEYS.vocab, n);
    syncCards(n, jget(KEYS.mistakes, []));
    bumpDay({ lessons:1 });
    setSel(null);
  };

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"26px 18px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ fontSize:22, fontWeight:800, color:T.text, letterSpacing:-.5 }}>📖 {UI.reader}</div>
        <span style={{ fontSize:13, color:T.faint }}>{tgt.flag} {tgt.name}</span>
        <span style={{ flex:1 }}></span>
        {text && <SpeakBtn text={text.slice(0, 1200)} S={S} size={16} />}
        {text && <button onClick={() => setEditing(!editing)} style={{ ...btn(T), fontSize:12 }}>{editing ? "📖 Read" : "✎ Edit"}</button>}
      </div>

      {editing ? (
        <React.Fragment>
          <div style={{ fontSize:13, color:T.mute, marginTop:8, lineHeight:1.55 }}>{UI.readerHint}</div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={UI.readerPlaceholder}
            style={{ width:"100%", minHeight:220, marginTop:14, padding:"13px 15px", fontSize:14.5, lineHeight:1.7,
              borderRadius:12, border:`1px solid ${T.border}`, background:T.panel, color:T.text, outline:"none",
              fontFamily:"'IBM Plex Sans',sans-serif", resize:"vertical" }} />
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            <button onClick={() => setEditing(false)} disabled={!text.trim()}
              style={{ ...btn(T, !!text.trim()), padding:"9px 20px" }}>📖 {UI.reader} →</button>
            {text && <button onClick={() => { setText(""); setSel(null); }} style={btn(T)}>{UI.reset}</button>}
          </div>
        </React.Fragment>
      ) : (
        <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:12 }}>
          {sentences.map((s, si) => (
            <div key={si} style={{ padding:"11px 13px", borderRadius:11, background:T.panel,
              border:`1px solid ${T.border}`, lineHeight:1.9 }}>
              <div style={{ fontSize:15.5, color:T.text }}>
                {s.split(/(\s+)/).map((w, wi) => /^\s+$/.test(w) || !w ? w : (
                  <span key={wi} onClick={() => lookup(w)} style={{ cursor:"pointer",
                    borderBottom:`1px dotted ${T.faint}55`, padding:"0 1px",
                    background: sel && sel.word === w.replace(/[.,!?;:()"'«»„“”—–]/g,"") ? T.accent+"22" : "transparent" }}>{w}</span>
                ))}
              </div>
              <div style={{ display:"flex", gap:6, marginTop:7, flexWrap:"wrap" }}>
                <SpeakBtn text={s} S={S} size={13} />
                <button onClick={() => { setLabInput(s); nav("lab"); }} style={{ ...btn(T), fontSize:10.5, padding:"3px 9px" }}>🔬 {UI.analyze}</button>
                <button onClick={() => { setLucySeed("Explain this sentence for my level: " + s); nav("lucy"); }}
                  style={{ ...btn(T), fontSize:10.5, padding:"3px 9px" }}>✨ {UI.askLucy}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sel && (
        <div style={{ position:"fixed", left:0, right:0, bottom:46, zIndex:80, display:"flex", justifyContent:"center", padding:"0 14px" }}>
          <div style={{ maxWidth:460, width:"100%", padding:"12px 15px", borderRadius:13, background:T.panel,
            border:`1px solid ${T.border}`, boxShadow:"0 12px 40px #0009", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:15, fontWeight:800, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{sel.word}</span>
                <SpeakBtn text={sel.word} S={S} size={13} />
              </div>
              <div style={{ fontSize:12.5, color:T.mute, marginTop:2 }}>
                {sel.gloss === "loading" ? "…" : sel.gloss}</div>
            </div>
            {sel.gloss !== "loading" && !String(sel.gloss).startsWith("⚠") && (
              <button onClick={addVocab} style={{ ...btn(T, true), fontSize:11.5, padding:"6px 12px", flexShrink:0 }}>+ {UI.vocabTab}</button>
            )}
            <button onClick={() => setSel(null)} style={{ background:T.chip, border:"none", color:T.mute,
              width:28, height:28, borderRadius:8, cursor:"pointer", flexShrink:0 }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Practice: LLM-generated drills for one grammar rule ──────────────────────
function Practice({ S, ruleId, nav, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  const entry = NODE_INDEX[ruleId];
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
