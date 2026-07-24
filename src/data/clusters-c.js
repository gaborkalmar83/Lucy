// Dutch grammar — part 3 (clusters C: syntax + tenses)

window.GRAM_CLUSTERS_C = [
  {
    id: "tenses",
    title_en: "Tenses — Overview", title_hu: "Igeidők áttekintése",
    blurb_en: "6 tenses compared", blurb_hu: "6 igeidő összevetve",
    color: "indigo",
    nodes: [
      {
        id: "tense_present",
        label_en: "present (o.t.t.)", label_hu: "jelen (o.t.t.)", level: "A1",
        rule_en: "Covers: now, habits, general truths, AND near future. No separate progressive — 'ik werk' = I work AND I am working.",
        rule_hu: "Fedi: most, szokás, általános igazság ÉS közeli jövő. Nincs külön folyamatos.",
        reason_en: "Dutch marks progressivity optionally with 'aan het + infinitive' rather than a dedicated tense.",
        reason_hu: "A folyamatosságot opcionális 'aan het + főnévi igenév' fejezi ki.",
        examples: [
          { tokens: [["ik","s"],["werk","vfin"],["in","prep"],["Amsterdam","adv"]], en: "I work / am working in Amsterdam", hu: "Amszterdamban dolgozom" },
          { tokens: [["morgen","adv"],["ga","vfin"],["ik","s"],["zwemmen","vinf"]], en: "tomorrow I'm going swimming (present as future)", hu: "holnap megyek úszni" },
          { tokens: [["ik","s"],["ben","vfin"],["aan","prep"],["het","art"],["koken","vinf"]], en: "I am cooking (explicit progressive)", hu: "éppen főzök" }
        ]
      },
      {
        id: "tense_perfect",
        label_en: "perfect (v.t.t.)", label_hu: "befejezett jelen (v.t.t.)", level: "A2",
        rule_en: "hebben/zijn + participle. THE spoken past: single completed events, even long ago — where English uses simple past.",
        rule_hu: "hebben/zijn + mnév. A beszélt múlt: egyszeri befejezett esemény — ahol az angol Past Simple-t használ.",
        reason_en: "Dutch conversation defaults to the perfect; the imperfect is reserved for narration and description.",
        reason_hu: "A beszélt holland perfektummal él; az imperfektum elbeszélésre való.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["gisteren","adv"],["gewerkt","vinf"]], en: "I worked yesterday", hu: "tegnap dolgoztam" },
          { tokens: [["zij","s"],["is","vfin"],["naar","prep"],["Parijs","adv"],["gegaan","vinf"]], en: "she went to Paris (motion → zijn)", hu: "Párizsba ment" },
          { tokens: [["we","s"],["hebben","vfin"],["het","o"],["nog","adv"],["niet","neg"],["gezien","vinf"]], en: "we haven't seen it yet", hu: "még nem láttuk" }
        ],
        links: ["weak_past","hebben_zijn"]
      },
      {
        id: "tense_imperfect",
        label_en: "imperfect (o.v.t.)", label_hu: "elbeszélő múlt (o.v.t.)", level: "A2",
        rule_en: "One-word past (werkte / liep). Use for: narration, background scenery, habits, and after 'toen'.",
        rule_hu: "Egyszavas múlt (werkte / liep). Elbeszélés, háttér, szokás, 'toen' után.",
        reason_en: "Imperfect paints the scene; perfect reports events. Mixing them wrong is the #1 tense error for learners.",
        reason_hu: "Az imperfektum hátteret fest; a perfektum eseményt jelent. Ez az 1. számú igeidő-hiba.",
        examples: [
          { tokens: [["ik","s"],["werkte","vfin"],["elke","adv"],["dag","adv"]], en: "I worked every day (habit)", hu: "minden nap dolgoztam (szokás)" },
          { tokens: [["toen","conn"],["ik","s"],["klein","adj"],["was","vfin"]], en: "when I was little", hu: "amikor kicsi voltam" },
          { tokens: [["het","s"],["regende","vfin"],["hard","adv"]], en: "it was raining hard (scene)", hu: "erősen esett (háttér)" }
        ],
        links: ["weak_past","strong_past"]
      },
      {
        id: "tense_pluperfect",
        label_en: "pluperfect (v.v.t.)", label_hu: "régmúlt (v.v.t.)", level: "B1",
        rule_en: "had/waren + participle: an event completed BEFORE another past moment.",
        rule_hu: "had/waren + mnév: egy másik múltbeli pillanat ELŐTT befejezett esemény.",
        reason_en: "Same as English 'had done' — anchors sequence within the past.",
        reason_hu: "Mint az angol 'had done' — sorrendet rögzít a múltban.",
        examples: [
          { tokens: [["ik","s"],["had","vfin"],["al","adv"],["gegeten","vinf"],["toen","conn"],["hij","s"],["kwam","vfin"]], en: "I had already eaten when he came", hu: "már ettem, mire jött" },
          { tokens: [["zij","s"],["was","vfin"],["al","adv"],["vertrokken","vinf"]], en: "she had already left", hu: "már elment" }
        ]
      },
      {
        id: "tense_future",
        label_en: "future", label_hu: "jövő idő", level: "B1",
        rule_en: "Three ways: present + time adverb (most common), 'gaan + inf' (intention/plan), 'zullen + inf' (promise, prediction, formality).",
        rule_hu: "Három mód: jelen + időhatározó (leggyakoribb), 'gaan + inf' (szándék), 'zullen + inf' (ígéret, jóslat).",
        reason_en: "Future is modality in Dutch: the more certain or planned, the simpler the form.",
        reason_hu: "A jövő modalitás: minél biztosabb, annál egyszerűbb alak.",
        examples: [
          { tokens: [["morgen","adv"],["werk","vfin"],["ik","s"]], en: "tomorrow I work (present)", hu: "holnap dolgozom (jelen)" },
          { tokens: [["ik","s"],["ga","vfin"],["morgen","adv"],["winkelen","vinf"]], en: "I'm going shopping tomorrow (gaan)", hu: "holnap vásárolni megyek" },
          { tokens: [["ik","s"],["zal","vfin"],["het","o"],["doen","vinf"]], en: "I shall do it (promise)", hu: "meg fogom csinálni (ígéret)" }
        ]
      },
      {
        id: "tense_conditional",
        label_en: "conditional (zou)", label_hu: "feltételes (zou)", level: "B1",
        rule_en: "'zou/zouden + infinitive': would (counterfactual), politeness, hearsay ('reportedly').",
        rule_hu: "'zou/zouden + főnévi igenév': feltételes, udvariasság, mendemonda.",
        reason_en: "'Zou' = past of 'zullen'; the past-tense modal signals distance from reality.",
        reason_hu: "'Zou' a 'zullen' múltja; a múlt idejű modális távolít a valóságtól.",
        examples: [
          { tokens: [["ik","s"],["zou","vfin"],["het","o"],["doen","vinf"],["als","conn"],["ik","s"],["kon","vfin"]], en: "I would do it if I could", hu: "megtenném, ha tudnám" },
          { tokens: [["zou","vfin"],["u","s"],["me","io"],["kunnen","vinf"],["helpen","vinf"],["?","x"]], en: "could you help me? (polite)", hu: "tudna segíteni?" },
          { tokens: [["hij","s"],["zou","vfin"],["ziek","adj"],["zijn","vinf"]], en: "he is said to be ill (hearsay)", hu: "állítólag beteg" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Perfect vs imperfect — the real split",
        title_hu: "Perfektum vs imperfektum",
        body_en: "English past ≠ Dutch imperfect! 'I worked yesterday' → 'ik heb gisteren gewerkt' (perfect). Imperfect only for background/habit/narrative.",
        body_hu: "Az angol múlt ≠ holland imperfektum! 'I worked yesterday' → perfektum. Imperfektum csak háttér/szokás/elbeszélés.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["gisteren","adv"],["gewerkt","vinf"]], en: "I worked yesterday ✓ (event → perfect)", hu: "tegnap dolgoztam ✓" },
          { tokens: [["vroeger","adv"],["werkte","vfin"],["ik","s"],["daar","adv"]], en: "I used to work there ✓ (habit → imperfect)", hu: "régen ott dolgoztam ✓" }
        ]
      }
    ]
  },

  {
    id: "word_order",
    title_en: "Word Order", title_hu: "Szórend",
    blurb_en: "V2 · SOV · bracket · TMP", blurb_hu: "V2 · SOV · keret · TMP",
    color: "teal",
    nodes: [
      {
        id: "v2",
        label_en: "V2: verb second", label_hu: "V2: ige a 2. helyen", level: "A1",
        rule_en: "In main clauses the finite verb is ALWAYS the 2nd constituent, whatever comes first (subject, time, object).",
        rule_hu: "Főmondatban a ragozott ige MINDIG a 2. összetevő, bármi is áll elöl.",
        reason_en: "The signature Germanic constraint — it forces subject-verb inversion whenever anything else is fronted.",
        reason_hu: "A germán nyelvek jellegzetessége — kényszerű inverzió, ha nem az alany áll elöl.",
        examples: [
          { tokens: [["ik","s"],["eet","vfin"],["vandaag","adv"],["pasta","o"]], en: "I eat pasta today", hu: "ma tésztát eszem" },
          { tokens: [["vandaag","adv"],["eet","vfin"],["ik","s"],["pasta","o"]], en: "today I eat pasta (inversion!)", hu: "ma eszem tésztát (inverzió!)" },
          { tokens: [["pasta","o"],["eet","vfin"],["ik","s"],["vandaag","adv"]], en: "pasta I eat today (object fronted)", hu: "tésztát ma eszem (tárgy elöl)" }
        ]
      },
      {
        id: "sov",
        label_en: "SOV in subclauses", label_hu: "SOV mellékmondatban", level: "A2",
        rule_en: "After a subordinator (dat, omdat, als, toen, terwijl, hoewel…) ALL verbs go to the END of the clause.",
        rule_hu: "Alárendelő kötőszó után MINDEN ige a tagmondat VÉGÉRE kerül.",
        reason_en: "The subordinator fills the V2 slot, so the underlying verb-final (SOV) order surfaces.",
        reason_hu: "A kötőszó elfoglalja a V2 helyet — az alapszórend (SOV) felszínre kerül.",
        examples: [
          { tokens: [["…","x"],["omdat","conn"],["ik","s"],["pasta","o"],["eet","vfin"]], en: "… because I eat pasta", hu: "… mert tésztát eszem" },
          { tokens: [["ik","s"],["weet","vfin"],["dat","conn"],["hij","s"],["morgen","adv"],["komt","vfin"]], en: "I know that he's coming tomorrow", hu: "tudom, hogy holnap jön" },
          { tokens: [["als","conn"],["je","s"],["klaar","adj"],["bent","vfin"],[",","x"],["gaan","vfin"],["we","s"]], en: "when you're ready, we go", hu: "ha kész vagy, megyünk" }
        ]
      },
      {
        id: "bracket",
        label_en: "verb bracket", label_hu: "igekeret", level: "B1",
        rule_en: "Finite verb in V2 + non-finite verbs (participle/infinitive/prefix) at the END form a bracket; everything else fills the middle field.",
        rule_hu: "Ragozott ige V2-ben + nem ragozott igék a VÉGÉN keretet alkotnak; minden más a középmezőben.",
        reason_en: "The bracket exposes Dutch's underlying SOV: only the finite verb hops forward.",
        reason_hu: "A keret mutatja a mögöttes SOV-t: csak a ragozott ige ugrik előre.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["gisteren","adv"],["een","art"],["boek","o"],["gekocht","vinf"]], en: "I bought a book yesterday", hu: "tegnap vettem egy könyvet" },
          { tokens: [["ze","s"],["wil","vfin"],["morgen","adv"],["naar","prep"],["huis","adv"],["gaan","vinf"]], en: "she wants to go home tomorrow", hu: "holnap haza akar menni" }
        ]
      },
      {
        id: "tmp",
        label_en: "Time–Manner–Place", label_hu: "Idő–Mód–Hely", level: "A2",
        rule_en: "Adverbials order: TIME before MANNER before PLACE — opposite of English.",
        rule_hu: "Határozók sorrendje: IDŐ – MÓD – HELY — az angol fordítottja.",
        reason_en: "Time anchors, manner refines, place locates — Dutch builds the scene outward.",
        reason_hu: "Az idő keretez, a mód árnyal, a hely lokalizál.",
        examples: [
          { tokens: [["ik","s"],["ga","vfin"],["morgen","adv"],["met","prep"],["de","art"],["trein","adv"],["naar","prep"],["Amsterdam","adv"]], en: "I'm going to Amsterdam by train tomorrow (T-M-P)", hu: "holnap vonattal megyek Amszterdamba" }
        ]
      },
      {
        id: "om_te",
        label_en: "om … te + infinitive", label_hu: "om … te + főnévi igenév", level: "A2",
        rule_en: "'om + (objects) + te + infinitive' = purpose ('in order to'). Separable verbs wrap te inside: 'om op te staan'.",
        rule_hu: "'om + te + főnévi igenév' = cél. Elváló igék közrefogják: 'om op te staan'.",
        reason_en: "'te' is cognate with English 'to'; 'om' frames the clause as a goal.",
        reason_hu: "A 'te' az angol 'to' rokona; az 'om' célként keretezi.",
        examples: [
          { tokens: [["ik","s"],["ga","vfin"],["naar","prep"],["de","art"],["winkel","adv"],["om","conn"],["brood","o"],["te","part"],["kopen","vinf"]], en: "I go to the shop to buy bread", hu: "megyek a boltba kenyeret venni" }
        ],
        links: ["sep_te"]
      }
    ],
    exceptions: [
      {
        title_en: "Red vs Green order",
        title_hu: "Piros vs zöld sorrend",
        body_en: "Subclause with aux + participle allows both: 'dat hij gewerkt heeft' AND 'dat hij heeft gewerkt'. Both correct; NL leans one way, Flanders the other.",
        body_hu: "Mellékmondatban mindkét sorrend jó: 'dat hij gewerkt heeft' ÉS 'dat hij heeft gewerkt'.",
        examples: [
          { tokens: [["dat","conn"],["hij","s"],["gewerkt","vinf"],["heeft","vfin"]], en: "…that he has worked (green)", hu: "…hogy dolgozott (zöld)" },
          { tokens: [["dat","conn"],["hij","s"],["heeft","vfin"],["gewerkt","vinf"]], en: "…that he has worked (red)", hu: "…hogy dolgozott (piros)" }
        ]
      },
      {
        title_en: "IPP: double infinitive",
        title_hu: "IPP: kettős főnévi igenév",
        body_en: "Modal in perfect stays an infinitive: 'ik heb moeten werken' — never *gemoeten with another verb.",
        body_hu: "Modális perfektumban főnévi igenév marad: 'ik heb moeten werken'.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["hem","o"],["willen","vinf"],["helpen","vinf"]], en: "I wanted to help him", hu: "segíteni akartam neki" }
        ]
      }
    ]
  },

  {
    id: "negation",
    title_en: "Negation", title_hu: "Tagadás",
    blurb_en: "niet vs geen", blurb_hu: "niet vs geen",
    color: "teal",
    nodes: [
      {
        id: "geen",
        label_en: "geen", label_hu: "geen", level: "A1",
        rule_en: "Negates an INDEFINITE noun ('een X' or bare noun): 'geen' replaces 'een'.",
        rule_hu: "HATÁROZATLAN főnevet tagad: a 'geen' az 'een' helyébe lép.",
        reason_en: "Dutch has a dedicated negative article, like German 'kein' — English lacks this slot.",
        reason_hu: "A hollandnak külön tagadó névelője van, mint a német 'kein'.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["geen","neg"],["auto","o"]], en: "I don't have a car", hu: "nincs autóm" },
          { tokens: [["er","s"],["is","vfin"],["geen","neg"],["brood","o"]], en: "there is no bread", hu: "nincs kenyér" },
          { tokens: [["ik","s"],["drink","vfin"],["geen","neg"],["koffie","o"]], en: "I don't drink coffee", hu: "nem iszom kávét" }
        ]
      },
      {
        id: "niet",
        label_en: "niet", label_hu: "niet", level: "A1",
        rule_en: "Everything else: verbs, definite objects, adjectives, adverbs, whole clauses.",
        rule_hu: "Minden más: ige, határozott tárgy, melléknév, határozó, egész mondat.",
        reason_en: "'Niet' is general sentential negation, like English 'not'.",
        reason_hu: "'Niet' az általános mondattagadás.",
        examples: [
          { tokens: [["ik","s"],["zie","vfin"],["de","art"],["man","o"],["niet","neg"]], en: "I don't see the man", hu: "nem látom a férfit" },
          { tokens: [["ik","s"],["kom","vfin"],["niet","neg"]], en: "I'm not coming", hu: "nem jövök" },
          { tokens: [["het","s"],["is","vfin"],["niet","neg"],["leuk","adj"]], en: "it is not nice", hu: "nem jó" }
        ]
      },
      {
        id: "niet_place",
        label_en: "niet placement", label_hu: "niet helye", level: "B1",
        rule_en: "'Niet' goes before what it negates; before final verb clusters; AFTER definite objects and time adverbials.",
        rule_hu: "A 'niet' a tagadott elem előtt; a mondatvégi igecsoport előtt; a határozott tárgy és időhatározó UTÁN.",
        reason_en: "Position encodes scope: what follows 'niet' is what's negated.",
        reason_hu: "A pozíció hatókört jelöl.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["het","art"],["boek","o"],["niet","neg"],["gelezen","vinf"]], en: "I haven't read the book", hu: "nem olvastam el a könyvet" },
          { tokens: [["ik","s"],["ga","vfin"],["niet","neg"],["naar","prep"],["huis","adv"]], en: "I'm not going home", hu: "nem megyek haza" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "One negator per clause",
        title_hu: "Egy tagadó tagmondatonként",
        body_en: "Standard Dutch bans double negation: 'ik zie niemand' — never 'geen niemand'.",
        body_hu: "A sztenderd holland tiltja a kettős tagadást.",
        examples: [
          { tokens: [["ik","s"],["zie","vfin"],["niemand","o"]], en: "I see nobody", hu: "senkit sem látok" },
          { tokens: [["er","s"],["is","vfin"],["niets","o"]], en: "there is nothing", hu: "semmi sincs" }
        ]
      }
    ]
  },

  {
    id: "questions",
    title_en: "Questions", title_hu: "Kérdések",
    blurb_en: "yes/no · wh- · waar+prep", blurb_hu: "eldöntendő · kérdőszós",
    color: "teal",
    nodes: [
      {
        id: "yn_q",
        label_en: "yes/no: verb first", label_hu: "eldöntendő: ige elöl", level: "A1",
        rule_en: "Finite verb to position 1, subject right after. No 'do'-support.",
        rule_hu: "Ragozott ige az 1. helyre, utána az alany. Nincs 'do'.",
        reason_en: "V2 languages mark questions by pure inversion.",
        reason_hu: "A V2 nyelvek inverzióval jelölnek kérdést.",
        examples: [
          { tokens: [["werk","vfin"],["jij","s"],["morgen","adv"],["?","x"]], en: "are you working tomorrow? (note: no -t!)", hu: "dolgozol holnap? (nincs -t!)" },
          { tokens: [["heeft","vfin"],["hij","s"],["een","art"],["auto","o"],["?","x"]], en: "does he have a car?", hu: "van autója?" }
        ],
        links: ["inversion_t"]
      },
      {
        id: "wh_q",
        label_en: "wh-questions", label_hu: "kérdőszós kérdések", level: "A1",
        rule_en: "wie, wat, waar, wanneer, waarom, hoe, welk(e) in position 1; verb in position 2.",
        rule_hu: "Kérdőszó az 1. helyen, ige a 2. helyen.",
        reason_en: "Wh-fronting + V2 — the wh-word counts as the first constituent.",
        reason_hu: "A kérdőszó számít első összetevőnek.",
        examples: [
          { tokens: [["waar","q"],["woon","vfin"],["jij","s"],["?","x"]], en: "where do you live?", hu: "hol laksz?" },
          { tokens: [["waarom","q"],["ben","vfin"],["je","s"],["laat","adj"],["?","x"]], en: "why are you late?", hu: "miért késtél?" },
          { tokens: [["welk","q"],["boek","o"],["lees","vfin"],["je","s"],["?","x"]], en: "which book are you reading?", hu: "melyik könyvet olvasod?" }
        ]
      },
      {
        id: "wh_prep",
        label_en: "waar + preposition", label_hu: "waar + elöljáró", level: "B1",
        rule_en: "For THINGS: preposition + wat → waar+prep ('waarover'), often split: 'Waar praat je over?'",
        rule_hu: "DOLGOKRA: elöljáró + wat → waar+elöljáró, gyakran szétválva.",
        reason_en: "Dutch bans 'over wat' for things — like archaic English 'whereof', but fully alive.",
        reason_hu: "A holland tiltja az 'over wat'-ot dolgokra.",
        examples: [
          { tokens: [["waarover","q"],["praat","vfin"],["je","s"],["?","x"]], en: "what are you talking about?", hu: "miről beszélsz?" },
          { tokens: [["waar","q"],["praat","vfin"],["je","s"],["over","prep"],["?","x"]], en: "what are you talking about? (split)", hu: "miről beszélsz? (szétválva)" },
          { tokens: [["met","prep"],["wie","q"],["ga","vfin"],["je","s"],["?","x"]], en: "with whom are you going? (person → wie)", hu: "kivel mész? (személy → wie)" }
        ],
        links: ["er_prep"]
      }
    ]
  },

  {
    id: "er",
    title_en: "The word 'er'", title_hu: "Az 'er' szó",
    blurb_en: "5 functions, 1 tiny word", blurb_hu: "5 funkció, 1 szócska",
    color: "teal",
    nodes: [
      {
        id: "er_uses",
        label_en: "the 5 uses", label_hu: "az 5 használat", level: "B1",
        rule_en: "1 existential (er is…), 2 locative (unstressed 'there'), 3 prepositional (eraan, erover), 4 quantitative (ik heb er drie), 5 impersonal passive subject (er wordt gedanst).",
        rule_hu: "1 egzisztenciális, 2 helyhatározói, 3 elöljárós, 4 mennyiségi, 5 személytelen passzív alany.",
        reason_en: "Five unrelated grammatical jobs landed on one weak pronoun — historically an unstressed 'daar'.",
        reason_hu: "Öt különböző szerep egyetlen gyenge névmáson — történetileg hangsúlytalan 'daar'.",
        examples: [
          { tokens: [["er","adv"],["is","vfin"],["een","art"],["probleem","o"]], en: "1 · there is a problem", hu: "1 · van egy probléma" },
          { tokens: [["ik","s"],["ben","vfin"],["er","adv"],["geweest","vinf"]], en: "2 · I've been there", hu: "2 · voltam ott" },
          { tokens: [["ik","s"],["denk","vfin"],["er","adv"],["aan","prep"]], en: "3 · I think about it", hu: "3 · gondolok rá" },
          { tokens: [["ik","s"],["heb","vfin"],["er","adv"],["drie","o"]], en: "4 · I have three (of them)", hu: "4 · három van belőle" },
          { tokens: [["er","adv"],["wordt","vfin"],["gedanst","vinf"]], en: "5 · there is dancing", hu: "5 · táncolnak" }
        ]
      },
      {
        id: "er_prep",
        label_en: "er + preposition", label_hu: "er + elöljáró", level: "B1",
        rule_en: "Things after prepositions become er+prep (ermee, erover, eraan) — and usually SPLIT across the middle field.",
        rule_hu: "Elöljáró utáni dolgok: er+elöljáró (ermee, erover) — általában SZÉTVÁLIK.",
        reason_en: "Dutch bans preposition + het/dat for things; 'er' steps in as pro-form.",
        reason_hu: "A holland tiltja az elöljáró + het/dat kapcsolatot dolgokra.",
        examples: [
          { tokens: [["ik","s"],["denk","vfin"],["er","adv"],["vaak","adv"],["aan","prep"]], en: "I often think about it (split!)", hu: "gyakran gondolok rá (szétválva!)" },
          { tokens: [["ze","s"],["is","vfin"],["er","adv"],["blij","adj"],["mee","prep"]], en: "she is happy with it", hu: "örül neki" }
        ],
        links: ["wh_prep"]
      }
    ]
  },

  {
    id: "subordination",
    title_en: "Conjunctions", title_hu: "Kötőszavak",
    blurb_en: "coordinating vs subordinating", blurb_hu: "mellérendelő vs alárendelő",
    color: "rose",
    nodes: [
      {
        id: "coord",
        label_en: "coordinating: en maar want of dus", label_hu: "mellérendelő", level: "A1",
        rule_en: "en, maar, want, of, dus — join equal clauses, NO word-order change (V2 stays).",
        rule_hu: "en, maar, want, of, dus — egyenrangú tagmondatok, NINCS szórendváltozás.",
        reason_en: "No embedding = no verb-final. This is why 'want' and 'omdat' differ despite both meaning 'because'.",
        reason_hu: "Nincs beágyazás = nincs ige-vég.",
        examples: [
          { tokens: [["ik","s"],["ga","vfin"],[",","x"],["maar","conn"],["hij","s"],["blijft","vfin"]], en: "I'm going, but he's staying", hu: "megyek, de ő marad" },
          { tokens: [["ik","s"],["blijf","vfin"],["want","conn"],["ik","s"],["ben","vfin"],["moe","adj"]], en: "I'm staying because I'm tired (want → V2!)", hu: "maradok, mert fáradt vagyok (want → V2!)" }
        ]
      },
      {
        id: "subord",
        label_en: "subordinating: dat omdat als …", label_hu: "alárendelő", level: "A2",
        rule_en: "dat, omdat, als, toen, terwijl, hoewel, voordat, nadat, zodat… → verb(s) to the END.",
        rule_hu: "dat, omdat, als, toen… → igék a mondat VÉGÉRE.",
        reason_en: "See SOV: the subordinator occupies V2, forcing verb-final.",
        reason_hu: "L. SOV.",
        examples: [
          { tokens: [["ik","s"],["denk","vfin"],["dat","conn"],["hij","s"],["komt","vfin"]], en: "I think that he's coming", hu: "azt hiszem, jön" },
          { tokens: [["ik","s"],["blijf","vfin"],["omdat","conn"],["ik","s"],["moe","adj"],["ben","vfin"]], en: "I'm staying because I'm tired (omdat → verb-final!)", hu: "maradok, mert fáradt vagyok (omdat → ige-vég!)" }
        ],
        links: ["sov"]
      },
      {
        id: "of_conn",
        label_en: "'of' = or / whether", label_hu: "'of' = vagy / vajon", level: "A2",
        rule_en: "Coordinator 'of' = 'or' (V2 after). Subordinator 'of' = 'whether' (verb-final).",
        rule_hu: "Mellérendelő 'of' = 'vagy'. Alárendelő 'of' = 'vajon/-e' (ige-vég).",
        reason_en: "Same form, two jobs — the following word order tells you which.",
        reason_hu: "Egy alak, két szerep — a szórend dönt.",
        examples: [
          { tokens: [["koffie","o"],["of","conn"],["thee","o"],["?","x"]], en: "coffee or tea?", hu: "kávét vagy teát?" },
          { tokens: [["ik","s"],["weet","vfin"],["niet","neg"],["of","conn"],["hij","s"],["komt","vfin"]], en: "I don't know whether he's coming", hu: "nem tudom, jön-e" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "als vs toen vs wanneer",
        title_hu: "als vs toen vs wanneer",
        body_en: "toen = one specific PAST event. als = condition/repeated event. wanneer = question 'when' (or formal als).",
        body_hu: "toen = egyszeri múlt. als = feltétel/ismétlődő. wanneer = kérdő 'mikor'.",
        examples: [
          { tokens: [["toen","conn"],["ik","s"],["klein","adj"],["was","vfin"]], en: "when I was little (once, past)", hu: "amikor kicsi voltam" },
          { tokens: [["als","conn"],["het","s"],["regent","vfin"]], en: "when(ever) it rains", hu: "ha/amikor esik" },
          { tokens: [["wanneer","q"],["kom","vfin"],["je","s"],["?","x"]], en: "when are you coming?", hu: "mikor jössz?" }
        ]
      },
      {
        title_en: "want vs omdat",
        title_hu: "want vs omdat",
        body_en: "Both = 'because', but 'want' keeps V2, 'omdat' forces verb-final. Mixing them up is a classic error.",
        body_hu: "Mindkettő = 'mert', de 'want' V2-t tart, 'omdat' ige-véget kényszerít.",
        examples: [
          { tokens: [["…","x"],["want","conn"],["ik","s"],["ben","vfin"],["moe","adj"]], en: "…because I'm tired (want + V2)", hu: "…mert fáradt vagyok (V2)" },
          { tokens: [["…","x"],["omdat","conn"],["ik","s"],["moe","adj"],["ben","vfin"]], en: "…because I'm tired (omdat + verb-final)", hu: "…mert fáradt vagyok (ige-vég)" }
        ]
      }
    ]
  },

  {
    id: "passive",
    title_en: "Passive", title_hu: "Szenvedő",
    blurb_en: "worden · zijn · er", blurb_hu: "worden · zijn · er",
    color: "rose",
    nodes: [
      {
        id: "pass_worden",
        label_en: "worden-passive (process)", label_hu: "worden-passzív (folyamat)", level: "B1",
        rule_en: "worden + participle = action in progress being done. Agent with 'door'.",
        rule_hu: "worden + mnév = folyamatban lévő cselekvés. Ágens: 'door'.",
        reason_en: "'Worden' = 'become' — the passive literally reads 'becomes read'.",
        reason_hu: "'Worden' = 'válni' — szó szerint 'olvasottá válik'.",
        examples: [
          { tokens: [["het","art"],["boek","s"],["wordt","vfin"],["gelezen","vinf"]], en: "the book is being read", hu: "a könyvet olvassák" },
          { tokens: [["het","art"],["huis","s"],["wordt","vfin"],["gebouwd","vinf"],["door","prep"],["hen","o"]], en: "the house is being built by them", hu: "a házat ők építik" }
        ]
      },
      {
        id: "pass_zijn",
        label_en: "zijn-passive (state)", label_hu: "zijn-passzív (állapot)", level: "B1",
        rule_en: "zijn + participle = resulting state (already done).",
        rule_hu: "zijn + mnév = eredményállapot (már kész).",
        reason_en: "Compare: 'de deur wordt gesloten' (being closed) vs 'de deur is gesloten' (is closed).",
        reason_hu: "Vö.: folyamat vs állapot.",
        examples: [
          { tokens: [["de","art"],["deur","s"],["is","vfin"],["gesloten","vinf"]], en: "the door is closed (state)", hu: "az ajtó zárva van" },
          { tokens: [["de","art"],["deur","s"],["wordt","vfin"],["gesloten","vinf"]], en: "the door is being closed (process)", hu: "az ajtót éppen zárják" }
        ]
      },
      {
        id: "pass_impersonal",
        label_en: "impersonal: er wordt …", label_hu: "személytelen: er wordt …", level: "B2",
        rule_en: "Intransitive verbs passivize with 'er wordt + participle' — no subject, focus on the activity.",
        rule_hu: "Tárgyatlan igék: 'er wordt + mnév' — nincs alany.",
        reason_en: "English says 'there was dancing'; Dutch grammaticalized this with 'er' + passive.",
        reason_hu: "Az angol 'there was dancing' holland megfelelője.",
        examples: [
          { tokens: [["er","adv"],["wordt","vfin"],["hier","adv"],["veel","adv"],["gelachen","vinf"]], en: "there's a lot of laughing here", hu: "itt sokat nevetnek" },
          { tokens: [["er","adv"],["werd","vfin"],["gedanst","vinf"]], en: "there was dancing", hu: "táncoltak" }
        ],
        links: ["er_uses"]
      }
    ],
    exceptions: [
      {
        title_en: "krijgen-passive",
        title_hu: "krijgen-passzív",
        body_en: "The recipient (indirect object) can become subject with 'krijgen': 'hij krijgt een prijs uitgereikt'.",
        body_hu: "A címzett alannyá válhat 'krijgen'-nel.",
        examples: [
          { tokens: [["hij","s"],["krijgt","vfin"],["een","art"],["prijs","o"],["uitgereikt","vinf"]], en: "he is presented with a prize", hu: "díjat adnak át neki" }
        ]
      }
    ]
  },

  {
    id: "conditional",
    title_en: "Conditionals", title_hu: "Feltételes mód",
    blurb_en: "als · zou · hypotheticals", blurb_hu: "als · zou · hipotézisek",
    color: "rose",
    nodes: [
      {
        id: "als_cond",
        label_en: "als-clauses", label_hu: "als-mondatok", level: "B1",
        rule_en: "Real: als + present. Unreal now: als + imperfect → zou + inf. Unreal past: als + pluperfect → zou hebben/zijn + participle.",
        rule_hu: "Valós: als + jelen. Irreális jelen: als + imperfektum → zou + inf. Irreális múlt: als + régmúlt → zou + hebben/zijn + mnév.",
        reason_en: "Back-shifting (present → past → pluperfect) marks increasing distance from reality — same mechanism as English.",
        reason_hu: "A hátratolás (jelen → múlt → régmúlt) növekvő valótlanságot fejez ki.",
        examples: [
          { tokens: [["als","conn"],["het","s"],["regent","vfin"],[",","x"],["blijf","vfin"],["ik","s"],["thuis","adv"]], en: "if it rains, I stay home (real)", hu: "ha esik, otthon maradok (valós)" },
          { tokens: [["als","conn"],["ik","s"],["rijk","adj"],["was","vfin"],[",","x"],["zou","vfin"],["ik","s"],["reizen","vinf"]], en: "if I were rich, I'd travel (unreal now)", hu: "ha gazdag lennék, utaznék" },
          { tokens: [["als","conn"],["ik","s"],["het","o"],["had","vfin"],["geweten","vinf"],[",","x"],["zou","vfin"],["ik","s"],["gebeld","vinf"],["hebben","vinf"]], en: "if I had known, I would have called (unreal past)", hu: "ha tudtam volna, hívtalak volna" }
        ],
        links: ["tense_conditional","sov"]
      },
      {
        id: "zou_polite",
        label_en: "zou for politeness / hearsay", label_hu: "zou: udvariasság / mendemonda", level: "B1",
        rule_en: "'Zou u …?' = polite request. 'Hij zou ziek zijn' = reportedly ill.",
        rule_hu: "'Zou u …?' = udvarias kérés. 'Hij zou ziek zijn' = állítólag beteg.",
        reason_en: "The conditional's distance-from-reality reads as either deference or unverified information.",
        reason_hu: "A valóságtól való távolság udvariasságként vagy bizonytalanságként értelmeződik.",
        examples: [
          { tokens: [["zou","vfin"],["je","s"],["dat","o"],["kunnen","vinf"],["doen","vinf"],["?","x"]], en: "could you do that? (polite)", hu: "meg tudnád csinálni?" },
          { tokens: [["hij","s"],["zou","vfin"],["in","prep"],["Spanje","adv"],["wonen","vinf"]], en: "he supposedly lives in Spain", hu: "állítólag Spanyolországban él" }
        ]
      },
      {
        id: "mocht",
        label_en: "mocht (should it happen)", label_hu: "mocht (ha netán)", level: "B2",
        rule_en: "Formal conditional with inversion, no 'als' needed: 'Mocht je komen, bel me.'",
        rule_hu: "Formális feltételes inverzióval, 'als' nélkül.",
        reason_en: "Past modal + inversion = conditional flavor, like English 'should you come'.",
        reason_hu: "Múlt modális + inverzió = feltételes árnyalat, mint az angol 'should you come'.",
        examples: [
          { tokens: [["mocht","vfin"],["je","s"],["komen","vinf"],[",","x"],["bel","vfin"],["me","o"]], en: "should you come, call me", hu: "ha netán jössz, hívj fel" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Fossil subjunctives",
        title_hu: "Megkövült kötőmód",
        body_en: "The subjunctive survives only in fixed phrases: 'leve de koning', 'God zij dank', 'het zij zo', 'kome wat komt'.",
        body_hu: "A kötőmód csak állandósult kifejezésekben él.",
        examples: [
          { tokens: [["leve","vfin"],["de","art"],["koning","s"],["!","x"]], en: "long live the king!", hu: "éljen a király!" },
          { tokens: [["God","s"],["zij","vfin"],["dank","o"]], en: "thank God", hu: "hála Istennek" }
        ]
      }
    ]
  },

  {
    id: "reflexive_verbs",
    title_en: "Reflexive Verbs", title_hu: "Visszaható igék",
    blurb_en: "zich wassen · zich vergissen", blurb_hu: "zich wassen · zich vergissen",
    color: "indigo",
    nodes: [
      {
        id: "refl_true",
        label_en: "obligatory reflexives", label_hu: "kötelező visszaható", level: "A2",
        rule_en: "Some verbs ONLY exist with a reflexive pronoun: zich vergissen, zich herinneren, zich schamen, zich haasten.",
        rule_hu: "Néhány ige CSAK visszaható névmással létezik.",
        reason_en: "Dictionaries list them as 'zich X' — the pronoun is part of the verb, not a real object.",
        reason_hu: "A szótár 'zich X'-ként hozza — a névmás az ige része.",
        examples: [
          { tokens: [["ik","s"],["herinner","vfin"],["me","refl"],["die","adj"],["dag","o"]], en: "I remember that day", hu: "emlékszem arra a napra" },
          { tokens: [["hij","s"],["vergist","vfin"],["zich","refl"]], en: "he is mistaken", hu: "téved" },
          { tokens: [["we","s"],["schamen","vfin"],["ons","refl"]], en: "we are ashamed", hu: "szégyelljük magunkat" }
        ]
      },
      {
        id: "refl_optional",
        label_en: "optional reflexives", label_hu: "választható visszaható", level: "B1",
        rule_en: "Others work both ways with a meaning shift: 'ik was me' (myself) vs 'ik was de auto' (the car).",
        rule_hu: "Mások mindkét módon működnek, jelentéskülönbséggel.",
        reason_en: "The pronoun marks that the action returns to the subject.",
        reason_hu: "A névmás jelzi, hogy a cselekvés az alanyra hat vissza.",
        examples: [
          { tokens: [["ik","s"],["was","vfin"],["me","refl"]], en: "I wash myself", hu: "mosakszom" },
          { tokens: [["ik","s"],["was","vfin"],["de","art"],["auto","o"]], en: "I wash the car", hu: "autót mosok" },
          { tokens: [["ze","s"],["kleedt","vfin"],["zich","refl"],["aan","part"]], en: "she gets dressed", hu: "felöltözik" }
        ]
      },
      {
        id: "refl_order",
        label_en: "position of the pronoun", label_hu: "a névmás helye", level: "B1",
        rule_en: "The reflexive pronoun follows the finite verb in main clauses; follows the subject in subclauses. Never clause-final.",
        rule_hu: "A visszaható névmás főmondatban a ragozott ige után, mellékmondatban az alany után. Sosem a végén.",
        reason_en: "It's a weak pronoun — weak pronouns cluster early in the middle field.",
        reason_hu: "Gyenge névmás — ezek a középmező elejére kerülnek.",
        examples: [
          { tokens: [["gisteren","adv"],["heb","vfin"],["ik","s"],["me","refl"],["vergist","vinf"]], en: "yesterday I was mistaken", hu: "tegnap tévedtem" },
          { tokens: [["…","x"],["omdat","conn"],["ik","s"],["me","refl"],["vergiste","vfin"]], en: "…because I was mistaken", hu: "…mert tévedtem" }
        ]
      }
    ]
  }
];
