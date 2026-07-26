// Lucy — conversational tutor with full toolkit
function lucySystem(S) {
  const tgt = TARGET_LANGS.find(l=>l.code===S.target);
  const L = S.lucy;
  return `You are Lucy, a warm but direct ${tgt.name} tutor.
Learner: ${L.name||"(no name)"} · current level ${S.level} · goal ${S.targetLevel} · explanations in ${langName(S.primary)}${secondLang(S) ? ` · second explanation language: ${langName(secondLang(S))}` : ""}.
Style: ${L.style} (direct = 1-2 short target-language sentences, minimal small talk; medium = 2-3 warm sentences + one follow-up; chatty = 3-5 expressive sentences).
Tense focus: ${L.tense} (any = natural; present/past/future = keep conversation anchored there).

LANGUAGE CONTRACT (critical): You ALWAYS converse in ${tgt.name}. All explanations, grammar notes, rule names and translations are written in ${langName(S.primary)}. Never reply only in English unless English is one of these languages.${S.primary===S.target ? " Explanation language equals target language, so you may omit the ' | translation' part." : ""}${secondLang(S) ? `
BILINGUAL EXPLANATIONS ARE MANDATORY: the learner reads both ${langName(S.primary)} and ${langName(secondLang(S))}. EVERY grammar explanation, rule statement, correction and word gloss must appear in BOTH — ${langName(S.primary)} first, then the ${langName(secondLang(S))} version on its own line prefixed with "🌐 ". Write the ${langName(secondLang(S))} version for a ${langName(secondLang(S))} speaker, pointing out where ${langName(secondLang(S))} behaves the same or differently — not a word-for-word translation. This is not optional and applies above all when correcting a mistake. Ordinary conversation turns with no explanation in them do not need the 🌐 line.` : ""}

TRANSLATION QUALITY (critical): every translation must be what a NATIVE speaker of that language would actually say. Translate the meaning, not the words. Use that language's own word order, idioms, cases and set phrases — never mirror ${tgt.name} structure. A translation that is grammatical but sounds foreign is wrong. This matters most for languages structurally unlike ${tgt.name}${secondLang(S) ? `, especially ${langName(secondLang(S))}` : ""}: rebuild the sentence from scratch in that language rather than substituting word by word.

FORMAT RULES:
- Every ${tgt.name} sentence on its own line, then " | " and its ${langName(S.primary)} translation.
- If the user writes in ${langName(S.primary)} instead of ${tgt.name}, reply in ${tgt.name} AND append: "${tgt.flag} In het ${tgt.native}: [their sentence in ${tgt.name}]".
- Use markdown: **bold** key terms, tables for conjugations, - bullets for lists, ## for section headers.
- Stay on the current topic until the user changes it. Track the learner's mistakes for the recap.
- One correction per turn max — most important error only. Exact format:
✏️ Correctie:
❌ [what they said]
✅ [correct version]
📚 Regel: [rule name]${hasMapFor(S.target) ? " [[map:rule_id]] if it maps to a known rule id in the app's grammar map" : ""}
🕐 Tijd/vorm: [1-2 sentences why, in ${langName(S.primary)}]${secondLang(S) ? `
🌐 [the rule name AND the same 1-2 sentence explanation in ${langName(secondLang(S))} — REQUIRED, never skip this line]` : ""}
💬 Natiever: [1-2 more natural phrasings]

SPECIAL OUTPUTS:
- For "annotate", output ONE line: ANNOT: [["word","role"],...] using roles s,vfin,vinf,o,io,prep,neg,conn,adv,refl,part,art,q,pron,adj,x — then a normal explanation.
- For conjugations, output a markdown table: | pronoun | form | meaning | and mark irregulars with *.${S.showRoles ? "\n- ROLES MODE ON: in EVERY target-language sentence (the part before ' | '), tag each word with its role as word\u27e8role\u27e9 using the codes above, e.g. ik\u27e8s\u27e9 werk\u27e8vfin\u27e9 morgen\u27e8adv\u27e9. Never tag the translation after ' | '." : ""}
${hasMapFor(S.target) ? "- When a correction or deep dive refers to a rule in the app's grammar map, wrap its id as [[map:rule_id]] so the app can link it." : ""}`;
}

// [id,label,prompt]
const LUCY_ACTIONS = [
  ["explainLast","🔍 Explain last","Explain your last message word by word: translation, tense name, word-order breakdown, key words, tips."],
  ["example","💡 Example","Give me a fresh example sentence using the current word or rule."],
  ["flip","🔄 Ask me","Answer briefly, then flip it into a question for me to answer, staying on this topic."],
  ["simpler","🐢 Simpler","That was a bit hard — rephrase more simply and slow down one notch."],
  ["harder","🔥 Harder","I've got this — push me one level harder with richer vocabulary and structure."],
  ["annotate","🎨 Annotate","Annotate my last sentence with grammatical roles (use ANNOT: output), then explain briefly."],
  ["deepDive","📚 Deep dive","Do a grammar deep dive on the current point: rule, word order, key points, 2 examples, exceptions, and common mistakes for my mother tongue."],
  ["conj","📊 Conjugate","Conjugate the most relevant verb from our conversation in all main tenses as markdown tables, marking irregulars."],
  ["timelines","🕰️ Timelines","Rewrite my last sentence in all five time domains (present, perfect, imperfect, pluperfect, future) as '[tense] | sentence | translation'."],
  ["nearby","↔️ Nearby tenses","Show the nearby tenses for my last sentence and how the meaning shifts."],
  ["verbday","⭐ Verb of the day","Give me a useful verb for my level: meaning, full present conjugation, and 2 example sentences."],
  ["roleplay","🎭 Roleplay","Start a short roleplay scenario suitable for my level. Set the scene in one line, take a character, and prompt me to respond."],
  ["cloze","✏️ Fill the gaps","Give me 3 fill-in-the-blank sentences on our current grammar point. Show blanks as ___ and put the answer key at the very bottom under 'KEY:'."],
  ["vocab","🗂️ Vocab tip","Give me 3 vocabulary items for our current topic: word | meaning, each on its own line."],
  ["newTopic","🆕 New topic","Let's switch to a new topic — pick one suitable for my level and introduce it."],
  ["recap","📋 Recap","Give me a session recap: topics covered, my mistakes with the rules + corrections, my strengths, and what to focus on next."]
];

function ClickWord({ word, S, onSave, color, title }) {
  const T = React.useContext(ThemeCtx);
  const [pop, setPop] = React.useState(null); // null | "loading" | text
  const clean = word.replace(/[.,!?;:()"']/g,"");
  const translate = async (e) => {
    e.stopPropagation();
    if (pop && pop !== "err") { setPop(null); return; }
    setPop("loading");
    try {
      const { text } = await llmCall(S, { maxTokens:120,
        system:`You translate a single ${TARGET_LANGS.find(l=>l.code===S.target).name} word into ${langName(S.primary)}. Reply with ONLY: the base form, part of speech, and a 2-4 word gloss. No sentences.`,
        messages:[{ role:"user", content: clean }] });
      setPop(text.trim());
    } catch(err){ setPop("err"); }
  };
  return (
    <span style={{ position:"relative", display:"inline-block" }}>
      <span onClick={translate} title={title||""} style={{ cursor:"pointer", color: color||"inherit", borderBottom:`1px dotted ${T.faint}66` }}>{word}</span>
      {pop && (
        <span onClick={e=>e.stopPropagation()} style={{ position:"absolute", bottom:"130%", left:0, zIndex:40, minWidth:150,
          background:T.panel2, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 9px", boxShadow:"0 8px 24px #0009",
          fontSize:12, color:T.text, fontFamily:"'IBM Plex Sans',sans-serif", whiteSpace:"normal" }}>
          {pop==="loading" ? <span style={{ color:T.faint }}>…</span> : pop==="err" ? <span style={{ color:T.bad }}>?</span> : (
            <React.Fragment>
              <div style={{ marginBottom:5 }}>{pop}</div>
              <button onClick={() => { onSave({ term:clean, gloss:pop }); setPop(null); }} style={{ fontSize:10.5, padding:"2px 8px",
                borderRadius:5, border:`1px solid ${T.accent}`, background:"transparent", color:T.accent, cursor:"pointer" }}>+ vocab</button>
            </React.Fragment>
          )}
        </span>
      )}
    </span>
  );
}

// Uses the shared HoverWord so a word hovered here behaves exactly as it does
// in the Reader or the grammar map — same bilingual gloss, same cache.
function ClickableLine({ text, S, onSave }) {
  const T = React.useContext(ThemeCtx);
  return <span style={{ fontWeight:600 }}>{text.split(/(\s+)/).map((w,i) => {
    if (/\s+/.test(w) || !w) return w;
    const m = w.match(/^(.+?)⟨(\w+)⟩([.,!?;:]*)$/);
    if (m) {
      const r = ROLES[m[2]] || ROLES.x;
      return <span key={i}><HoverWord word={m[1]} role={m[2]} S={S} onSave={onSave} color={r.color||T.text} />{m[3]}</span>;
    }
    return <HoverWord key={i} word={w} S={S} onSave={onSave} color={T.text} />;
  })}</span>;
}

function LucyMsg({ m, S, onSave, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  if (m.role === "user") return (
    <div style={{ alignSelf:"flex-end", maxWidth:"85%", padding:"10px 14px", borderRadius:"14px 14px 4px 14px",
      background:T.accent, color:T.accentText, fontSize:14, lineHeight:1.55, whiteSpace:"pre-wrap" }}>{m.content}</div>
  );
  const renderMd = (s) => {
    // [[map:id]] chips
    const chunks = s.split(/(\[\[map:[a-z_0-9]+\]\])/g);
    return chunks.map((c, i) => {
      const mm = c.match(/^\[\[map:([a-z_0-9]+)\]\]$/);
      if (mm) { const entry = NODE_INDEX[mm[1]]; if (!entry) return null;
        return <button key={i} onClick={() => onOpenNode && onOpenNode(mm[1])} style={{ fontSize:11, padding:"1px 7px", margin:"0 3px",
          borderRadius:6, border:`1px solid ${T.accent}`, background:"transparent", color:T.accent, cursor:"pointer" }}>{entry.node.label_en} ↗</button>; }
      return <React.Fragment key={i}>{mdInline(c, T)}</React.Fragment>;
    });
  };
  const lines = m.content.split("\n");
  const out = []; let tableBuf = [];
  const flushTable = (k) => {
    if (!tableBuf.length) return;
    const rows = tableBuf.filter(r => !/^\s*\|?[\s:|-]+\|?\s*$/.test(r)).map(r => r.replace(/^\||\|$/g,"").split("|").map(c=>c.trim()));
    tableBuf = [];
    out.push(<table key={"t"+k} style={{ borderCollapse:"collapse", margin:"6px 0", fontSize:12.5 }}>
      <tbody>{rows.map((r,ri) => <tr key={ri}>{r.map((c,ci) => React.createElement(ri===0?"th":"td",
        { key:ci, style:{ border:`1px solid ${T.border}`, padding:"4px 9px", textAlign:"left", color: ri===0?T.faint:T.text,
          fontWeight: ri===0?700:500, background: ri===0?T.panel2:"transparent" } }, mdInline(c, T)))}</tr>)}</tbody></table>);
  };
  lines.forEach((ln, i) => {
    const trimmed = ln.trim();
    if (/^\|.*\|/.test(trimmed)) { tableBuf.push(trimmed); return; }
    flushTable(i);
    if (!trimmed) { out.push(<div key={i} style={{ height:6 }}></div>); return; }
    if (trimmed.startsWith("ANNOT:")) {
      try { const toks = JSON.parse(trimmed.slice(6).trim());
        out.push(<div key={i} style={{ margin:"4px 0", padding:"8px 10px", background:T.panel2, borderRadius:8 }}><Tokens tokens={toks} size={15} S={S} onSave={onSave} /></div>); return; }
      catch(e){}
    }
    if (/^[✏️❌✅📚🕐💬🌐]/.test(trimmed)) {
      const bad = trimmed.startsWith("❌"), good = trimmed.startsWith("✅");
      // 🌐 is the second-language restatement — same block, quieter styling so
      // it reads as a companion to the line above rather than a new point.
      const alt = trimmed.startsWith("🌐");
      out.push(<div key={i} style={{ fontSize: alt?12.5:13, padding:"3px 9px", margin:"1px 0",
        borderLeft:`3px solid ${bad?T.bad:good?T.good:alt?T.faint:T.accent}`,
        color: bad?T.bad:good?T.good:alt?T.faint:T.mute, fontStyle: alt?"italic":"normal",
        background: bad?T.badBg:good?T.goodBg:"transparent", borderRadius:4 }}>{renderMd(trimmed)}</div>); return;
    }
    const h = trimmed.match(/^(#{1,4})\s+(.*)/);
    if (h) { out.push(<div key={i} style={{ fontSize:15, fontWeight:800, color:T.text, margin:"8px 0 2px" }}>{renderMd(h[2])}</div>); return; }
    const b = trimmed.match(/^[-*•]\s+(.*)/);
    if (b) { out.push(<div key={i} style={{ display:"flex", gap:7, margin:"2px 0", color:T.mute }}><span style={{ color:T.accent }}>•</span><span style={{ flex:1 }}>{renderMd(b[1])}</span></div>); return; }
    const idx = ln.indexOf(" | ");
    if (idx > 0) { out.push(<div key={i} style={{ margin:"2px 0" }}>
      <ClickableLine text={ln.slice(0, idx).trim()} S={S} onSave={onSave} />
      <SpeakBtn text={ln.slice(0, idx).trim()} S={S} size={12} />
      <span style={{ color:T.faint }}> — </span>
      <span style={{ color:T.mute, fontSize:13 }}>{renderMd(ln.slice(idx+3).trim())}</span></div>); return; }
    out.push(<div key={i} style={{ color:T.mute, margin:"2px 0" }}>{renderMd(ln)}</div>);
  });
  flushTable("end");
  return (
    <div style={{ alignSelf:"flex-start", maxWidth:"88%", padding:"12px 15px", borderRadius:"14px 14px 14px 4px",
      background:T.panel, border:`1px solid ${T.border}`, fontSize:14, lineHeight:1.6 }}>{out}</div>
  );
}

const VOCAB_KEY = "dgs-vocab", MIST_KEY = "dgs-mistakes";
const loadStore = (k) => { try { return JSON.parse(localStorage.getItem(k)||"[]"); } catch(e){ return []; } };
const saveStore = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };

function SidePanel({ tab, setTab, vocab, setVocab, mistakes, setMistakes, onClose }) {
  const T = React.useContext(ThemeCtx);
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"#0006", zIndex:90 }}></div>
      <div style={{ position:"fixed", top:0, right:0, bottom:44, width:"min(360px,92vw)", zIndex:91, background:T.panel,
        borderLeft:`1px solid ${T.border}`, boxShadow:"-16px 0 48px #0009", overflowY:"auto", padding:"18px 16px 30px" }}>
        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {[["vocab","🗂️ Vocab ("+vocab.length+")"],["mistakes","⚠ Mistakes ("+mistakes.length+")"]].map(([id,l]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:"7px", fontSize:12, fontWeight:700, borderRadius:8, border:"none",
              cursor:"pointer", background: tab===id ? T.accent : T.chip, color: tab===id ? T.accentText : T.mute }}>{l}</button>
          ))}
          <button onClick={onClose} style={{ background:T.chip, border:"none", color:T.mute, width:32, borderRadius:8, cursor:"pointer" }}>×</button>
        </div>
        {tab==="vocab" ? (
          vocab.length===0 ? <div style={{ color:T.faint, fontSize:13, textAlign:"center", marginTop:30 }}>Click any word in Lucy's replies → “+ vocab”.</div> :
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {vocab.map((v,i) => (
              <div key={i} style={{ padding:"8px 10px", background:T.panel2, borderRadius:8, border:`1px solid ${T.border}`, display:"flex", gap:8 }}>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, color:T.text, fontSize:13 }}>{v.term}</div>
                  <div style={{ fontSize:11.5, color:T.mute }}>{v.gloss}</div></div>
                <button onClick={() => { const n=vocab.filter((_,j)=>j!==i); setVocab(n); saveStore(VOCAB_KEY,n); }}
                  style={{ background:"none", border:"none", color:T.faint, cursor:"pointer" }}>×</button>
              </div>
            ))}
          </div>
        ) : (
          mistakes.length===0 ? <div style={{ color:T.faint, fontSize:13, textAlign:"center", marginTop:30 }}>Corrections Lucy makes accumulate here across sessions.</div> :
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {mistakes.map((mk,i) => (
              <div key={i} style={{ padding:"8px 10px", background:T.panel2, borderRadius:8, border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:12, color:T.bad }}>❌ {mk.bad}</div>
                <div style={{ fontSize:12, color:T.good }}>✅ {mk.good}</div>
                {mk.rule && <div style={{ fontSize:11, color:T.faint, marginTop:2 }}>📚 {mk.rule}</div>}
              </div>
            ))}
            <button onClick={() => { setMistakes([]); saveStore(MIST_KEY,[]); }} style={{ marginTop:6, padding:"6px", fontSize:11,
              borderRadius:7, border:`1px solid ${T.border}`, background:"transparent", color:T.bad, cursor:"pointer" }}>Clear log</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

function Lucy({ S, setS, seed, clearSeed, onOpenNode }) {
  const T = React.useContext(ThemeCtx);
  const t = UI;
  const tgt = TARGET_LANGS.find(l=>l.code===S.target);
  // The conversation is persisted: leaving for the Map, Review or a phone lock
  // screen and coming back resumes the same lesson rather than starting over.
  const [msgs, setMsgs] = usePersistent(KEYS.lucyChat, []);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [vocab, setVocab] = React.useState(() => loadStore(VOCAB_KEY));
  const [mistakes, setMistakes] = React.useState(() => loadStore(MIST_KEY));
  const [panel, setPanel] = React.useState(null);
  const endRef = React.useRef(null);
  React.useEffect(() => { endRef.current && (endRef.current.parentNode.scrollTop = endRef.current.offsetTop); }, [msgs, busy]);
  const setLucy = (patch) => setS({ ...S, lucy: { ...S.lucy, ...patch } });
  const addVocab = (v) => {
    const n = [{ ...v, lang:S.target, ts:Date.now() }, ...vocab.filter(x=>x.term!==v.term)];
    setVocab(n); saveStore(VOCAB_KEY,n);
    syncCards(n, loadStore(MIST_KEY));      // saved word enters the review queue
  };

  const dictate = useDictation(S.target, (txt) => setInput(txt));
  const [voiceOpen, setVoiceOpen] = React.useState(false);

  // Voice mode shares Lucy's persona and level, but speaks instead of writing —
  // so the written formatting rules are replaced with spoken-conversation ones.
  const voiceInstructions = () => {
    const tgt = TARGET_LANGS.find(l => l.code === S.target) || {};
    const V = S.voice || {};
    const focus = V.focus || "flow";
    // Pronunciation is only ever drilled when explicitly asked for. Otherwise a
    // near-miss gets the correct form modelled once and the conversation moves on.
    const focusLine = focus === "grammar"
      ? `PRIORITY: grammar. Correct grammar mistakes that matter, one per turn, in a single short sentence, then continue the conversation.`
      : focus === "intonation"
      ? `PRIORITY: pronunciation and intonation. Point out mispronunciations, model the correct sound, and let the learner try again.`
      : `PRIORITY: keeping the conversation flowing. Correct only what genuinely blocks understanding.`;
    const pronLine = focus === "intonation" ? "" :
      `\nDO NOT drill pronunciation or intonation. If something is mispronounced but understandable, simply say the word correctly once in your reply and move on. Never ask the learner to repeat a word for pronunciation. Never stop the conversation over accent or a small sound.`;
    const style = V.style || "tutor";
    const styleLine = style === "strict"
      ? "Be concise and direct."
      : style === "immersive"
      ? `Speak only ${tgt.name} and rephrase rather than lecture.`
      : "Be warm and encouraging.";
    const spokenCorrections = (V.correctVia || "screen") === "spoken";
    // A bare CEFR letter is routinely ignored, so the level is spelled out as
    // concrete limits on sentence length, tense range and vocabulary.
    const LEVEL_RULES = {
      A1: "Use only the present tense and the most common 500 words. Sentences of 3-6 words. One idea per sentence. Speak slowly and repeat key words.",
      A2: "Present and simple past/perfect only. Everyday vocabulary. Sentences of 5-9 words. Avoid subordinate clauses.",
      B1: "Common tenses including future and conditional. Simple subordinate clauses. Sentences up to 12 words. Everyday and work vocabulary.",
      B2: "Full tense range and complex sentences, but keep idioms common and explain rare ones.",
      C1: "Natural adult speech, including idiom and nuance. Do not simplify.",
      C2: "Speak entirely naturally, as to a native speaker."
    };
    const lv = (S.level || "A2").replace("+", "");
    const levelLine = LEVEL_RULES[lv] || LEVEL_RULES.A2;
    return `You are Lucy, a warm ${tgt.name} tutor having a SPOKEN conversation with ${S.lucy.name || "a learner"}.

LEVEL — THIS IS A HARD CONSTRAINT: the learner is CEFR ${S.level}, working towards ${S.targetLevel}. ${levelLine}
Never exceed this level to sound natural. If you need a word above it, use a simpler one or explain it in one short phrase. Check every sentence against this before you say it.

Speak ${tgt.name}. ${styleLine}
${focusLine}${pronLine}
${spokenCorrections
  ? "Say corrections out loud as part of your reply, briefly, so the learner never has to look at the screen."
  : "Keep spoken corrections to an absolute minimum — a corrected rephrasing woven into your reply is enough. The learner reads the details on screen."}
LANGUAGE: speak ONLY ${tgt.name}. Never mix in another language mid-sentence.
If the learner is completely lost, you may explain briefly in ${langName(S.primary)}, then return to ${tgt.name}.${secondLang(S) ? ` They also read ${langName(secondLang(S))}.` : ""}
This is speech, not writing: short sentences, no markdown, no bullet points, no emoji, no spelling out. Never read punctuation aloud.
Keep each turn to a few sentences and end by inviting the learner to speak.${V.instructionsExtra ? "\n" + V.instructionsExtra : ""}${S.systemExtra ? "\n" + S.systemExtra : ""}`;
  };

  // Opening turn: greet, then offer to continue the existing thread or start fresh.
  const voiceOpener = () => {
    const tgt = TARGET_LANGS.find(l => l.code === S.target) || {};
    const recent = msgs.slice(-6).filter(m => m.content).map(m =>
      (m.role === "user" ? "Learner: " : "You: ") + stripMarkup(m.content).slice(0, 200)).join("\n");
    return recent
      ? `Greet the learner in ONE short ${tgt.name} sentence, then in one more sentence say what you were last talking about and ask whether to carry on with it or start something new. Nothing else.\n\nRecent conversation:\n${recent}`
      : `Greet the learner in ONE short ${tgt.name} sentence and ask in one more sentence what they would like to talk about today. Nothing else.`;
  };

  const logMistake = (reply) => {
    const l = reply.split("\n");
    const bad = (l.find(x=>x.trim().startsWith("❌"))||"").replace(/^\s*❌\s*/,"").trim();
    const good = (l.find(x=>x.trim().startsWith("✅"))||"").replace(/^\s*✅\s*/,"").trim();
    const rule = (l.find(x=>x.trim().startsWith("📚"))||"").replace(/^\s*📚\s*(Regel:)?\s*/,"").replace(/\[\[map:[a-z_0-9]+\]\]/g,"").trim();
    if (bad && good) {
      const n = [{ bad, good, rule, ts:Date.now() }, ...mistakes].slice(0,200);
      setMistakes(n); saveStore(MIST_KEY,n);
      syncCards(loadStore(VOCAB_KEY), n);   // every correction becomes a review card
    }
  };

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...msgs, { role:"user", content }];
    setMsgs(next); setBusy(true);
    try {
      const { text: reply } = await llmCall(S, { system: lucySystem(S), maxTokens: 2500,
        messages: next.slice(-16).map(m => ({ role:m.role, content:m.content })) });
      setMsgs([...next, { role:"assistant", content: reply }]);
      logMistake(reply);
      bumpDay({ chats:1, xp:2 });
      // Read the first target-language line aloud when auto-speak is on.
      if (S.speak && S.speak.auto) {
        const line = reply.split("\n").find(l => l.includes(" | "));
        if (line) speak(line.split(" | ")[0], S.target, S);
      }
    } catch (e) { setMsgs([...next, { role:"assistant", content: "⚠ " + e.message + "\nCheck provider settings (⚙)." }]); }
    setBusy(false);
  };

  // A sentence handed over from the Reader starts the conversation on arrival.
  React.useEffect(() => {
    if (seed) { send(seed); clearSeed && clearSeed(); }
  }, [seed]);

  const exportTranscript = () => {
    const md = msgs.map(m => (m.role==="user"?"**You:** ":"**Lucy:** ")+m.content).join("\n\n");
    const blob = new Blob(["# Lucy session — "+tgt.name+"\n\n"+md], { type:"text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "lucy-"+tgt.code+"-"+new Date().toISOString().slice(0,10)+".md"; a.click();
  };

  const Sel = ({ value, opts, onChange, label }) => (
    <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.faint }}>{label}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ padding:"3px 6px", fontSize:11, borderRadius:6,
        border:`1px solid ${T.border}`, background:T.panel, color:T.text }}>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
    </label>
  );

  return (
    <div style={{ maxWidth:820, margin:"0 auto", padding:"18px 20px 10px", display:"flex", flexDirection:"column",
      height:"calc(100dvh - 150px)", minHeight:360 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", paddingBottom:12, borderBottom:`1px solid ${T.border}` }}>
        <span style={{ fontSize:18, fontWeight:800, color:T.text }}>💬 Lucy <span style={{ fontSize:13, color:T.faint, fontWeight:500 }}>· {tgt.flag} {tgt.name}</span></span>
        <span style={{ flex:1 }}></span>
        <span style={{ fontSize:11, color:T.faint, fontFamily:"'JetBrains Mono',monospace" }}>{S.level}→{S.targetLevel}</span>
        <input value={S.lucy.name} onChange={e => setLucy({ name:e.target.value })} placeholder={t.name}
          style={{ width:76, padding:"3px 8px", fontSize:11, borderRadius:6, border:`1px solid ${T.border}`, background:T.panel, color:T.text }} />
        <Sel label={t.style} value={S.lucy.style} opts={["direct","medium","chatty"]} onChange={v => setLucy({ style:v })} />
        <Sel label={t.tenseFocus} value={S.lucy.tense} opts={["any","present","past","future"]} onChange={v => setLucy({ tense:v })} />
        <button onClick={() => setPanel("vocab")} title="Vocab & mistakes" style={{ padding:"5px 10px", fontSize:11, borderRadius:7,
          border:`1px solid ${T.border}`, background:T.panel, color:T.mute, cursor:"pointer" }}>🗂️ {vocab.length} · ⚠ {mistakes.length}</button>
        <button onClick={() => setVoiceOpen(true)} title={UI.voiceMode}
          style={{ padding:"5px 11px", fontSize:11, fontWeight:700, borderRadius:7, cursor:"pointer",
            border:`1px solid ${T.accent}`, background:T.accent+"1a", color:T.accent }}>🎙️ {UI.voiceMode}</button>
        {ttsOk() && (
          <button onClick={() => setS({ ...S, speak:{ ...S.speak, auto: !S.speak.auto } })}
            title="Auto-read Lucy's replies aloud" style={{ padding:"5px 9px", fontSize:11, borderRadius:7,
              border:`1px solid ${S.speak.auto ? T.accent : T.border}`,
              background: S.speak.auto ? T.accent+"22" : T.panel, color: S.speak.auto ? T.accent : T.mute, cursor:"pointer" }}>
            {S.speak.auto ? "🔊" : "🔇"}</button>
        )}
        {msgs.length>0 && <button onClick={exportTranscript} title="Export transcript" style={{ padding:"5px 9px", fontSize:11, borderRadius:7,
          border:`1px solid ${T.border}`, background:T.panel, color:T.mute, cursor:"pointer" }}>⬇</button>}
        {msgs.length>0 && <button onClick={() => { if (confirm(UI.newSession + "?")) { stopSpeaking(); setMsgs([]); } }}
          title={UI.newSession} style={{ padding:"5px 9px", fontSize:11, borderRadius:7,
          border:`1px solid ${T.border}`, background:T.panel, color:T.mute, cursor:"pointer" }}>🆕</button>}
      </div>

      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, padding:"16px 2px" }}>
        {msgs.length === 0 && (
          <div style={{ margin:"auto", textAlign:"center", maxWidth:420 }}>
            <div style={{ fontSize:40 }}>👩‍🏫</div>
            <div style={{ fontSize:14, color:T.mute, lineHeight:1.6, marginTop:8 }}>{t.lucyIntro}</div>
            <button onClick={() => send("Hi Lucy! Let's start.")} style={{ marginTop:14, padding:"9px 20px", fontSize:13, fontWeight:700,
              borderRadius:10, border:"none", background:T.accent, color:T.accentText, cursor:"pointer" }}>{t.startSession}</button>
          </div>
        )}
        {msgs.map((m,i) => <LucyMsg key={i} m={m} S={S} onSave={addVocab} onOpenNode={hasMapFor(S.target)?onOpenNode:null} />)}
        {busy && <div style={{ alignSelf:"flex-start", padding:"10px 16px", borderRadius:14, background:T.panel, border:`1px solid ${T.border}`, color:T.faint, fontSize:13 }}>…</div>}
        <div ref={endRef}></div>
      </div>

      {msgs.length > 0 && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingBottom:8, maxHeight:70, overflowY:"auto" }}>
          {LUCY_ACTIONS.map(([key, label, prompt]) => (
            <button key={key} onClick={() => send(prompt)} disabled={busy} style={{ padding:"4px 10px", fontSize:11, borderRadius:8,
              cursor:"pointer", border:`1px solid ${T.border}`, background:T.panel, color:T.mute, whiteSpace:"nowrap" }}>{(UI.lucyBtns&&UI.lucyBtns[key])||label}</button>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:8, paddingBottom:10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          placeholder={dictate.listening ? UI.micListening : t.lucyPlaceholder}
          style={{ flex:1, minWidth:0, padding:"11px 14px", fontSize:14, borderRadius:10,
            border:`1px solid ${dictate.listening ? T.accent : T.border}`, background:T.panel, color:T.text, outline:"none" }} />
        {dictate.supported && (
          <button onClick={() => dictate.listening ? dictate.stop() : dictate.start()}
            title={dictate.listening ? UI.micListening : UI.mic}
            style={{ padding:"11px 13px", fontSize:15, borderRadius:10, cursor:"pointer", flexShrink:0,
              border:`1px solid ${dictate.listening ? T.accent : T.border}`,
              background: dictate.listening ? T.accent+"22" : T.panel, color: dictate.listening ? T.accent : T.mute }}>
            🎤</button>
        )}
        <button onClick={() => send()} disabled={busy} style={{ padding:"11px 20px", fontSize:13, fontWeight:700, borderRadius:10,
          border:"none", background: busy ? T.chip : T.accent, color: busy ? T.mute : T.accentText, cursor:busy?"wait":"pointer" }}>{t.send}</button>
      </div>

      {voiceOpen && (
        <VoicePanel S={S} instructions={voiceInstructions()} opener={voiceOpener()} onClose={() => setVoiceOpen(false)}
          onUser={(t) => setMsgs(m => [...m, { role:"user", content:t }])}
          onAssistant={(t) => { setMsgs(m => [...m, { role:"assistant", content:t }]); logMistake(t); bumpDay({ chats:1, xp:2 }); }} />
      )}
      {panel && <SidePanel tab={panel} setTab={setPanel} vocab={vocab} setVocab={setVocab} mistakes={mistakes} setMistakes={setMistakes} onClose={() => setPanel(null)} />}
    </div>
  );
}
window.Lucy = Lucy;
