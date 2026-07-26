// Dutch grammar — part 2 (clusters B)

window.GRAM_CLUSTERS_B = [
  {
    id: "verbs_present",
    title_en: "Verbs — Present", title_hu: "Igék — jelen",
    blurb_en: "stem · endings", blurb_hu: "tő · ragok",
    color: "indigo",
    nodes: [
      {
        id: "stem",
        label_en: "finding the stem", label_hu: "tő megtalálása", level: "A1",
        rule_en: "Infinitive minus -en, then spelling fixes: keep long vowel by closing the syllable (maken → maak); devoice final v→f, z→s (leven → leef, lezen → lees).",
        rule_hu: "Főnévi igenév mínusz -en, majd helyesírás: hosszú magánhangzó megőrzése (maken → maak); szóvégi v→f, z→s.",
        reason_en: "Dutch forbids v/z at word-end; vowel doubling preserves length when a syllable closes.",
        reason_hu: "A v/z nem állhat szó végén; a kettőzés megőrzi a hosszúságot zárt szótagban.",
        examples: [
          { tokens: [["werken","vinf"],["→","x"],["werk","v"]], en: "to work → work (stem)", hu: "dolgozni → dolgoz-" },
          { tokens: [["maken","vinf"],["→","x"],["maak","v"]], en: "to make → make (vowel doubled)", hu: "csinálni → csinál- (kettőz)" },
          { tokens: [["schrijven","vinf"],["→","x"],["schrijf","v"]], en: "to write → write (v → f)", hu: "írni → ír- (v → f)" },
          { tokens: [["reizen","vinf"],["→","x"],["reis","v"]], en: "to travel → travel (z → s)", hu: "utazni → utaz- (z → s)" }
        ]
      },
      {
        id: "present_conj",
        label_en: "conjugation pattern", label_hu: "ragozási minta", level: "A1",
        rule_en: "ik = stem · jij/u/hij/zij/het = stem + t · wij/jullie/zij = infinitive. Three plurals are all identical to the infinitive.",
        rule_hu: "ik = tő · jij/u/hij/zij/het = tő + t · wij/jullie/zij = főnévi igenév.",
        reason_en: "Dutch collapsed Middle Dutch's richer agreement — plural forms merged with the infinitive, so learners only need three slots.",
        reason_hu: "A holland összevonta a középholland ragokat — a többes a főnévi igenévvel egybeesik.",
        examples: [
          { tokens: [["ik","s"],["werk","vfin"]], en: "I work", hu: "dolgozom" },
          { tokens: [["jij","s"],["werkt","vfin"]], en: "you work", hu: "dolgozol" },
          { tokens: [["hij","s"],["werkt","vfin"]], en: "he works", hu: "dolgozik" },
          { tokens: [["wij","s"],["werken","vfin"]], en: "we work (= infinitive)", hu: "dolgozunk (= főnévi igenév)" }
        ]
      },
      {
        id: "inversion_t",
        label_en: "inversion drops -t", label_hu: "inverzióban nincs -t", level: "A1",
        rule_en: "When 'jij/je' comes AFTER its verb (inversion, question), the verb LOSES its -t: 'jij werkt' → 'werk jij?'.",
        rule_hu: "Ha a 'jij/je' az ige UTÁN áll (inverzió, kérdés), az ige elveszti a -t-t.",
        reason_en: "Historically the -t fused the verb with an enclitic 'du' (old 'you'); when the pronoun moves behind, the -t becomes redundant.",
        reason_hu: "Az -t régen az ige + enklitikus 'du' (régi 'te') összeolvadása — ha a névmás mögé kerül, feleslegessé válik.",
        examples: [
          { tokens: [["jij","s"],["werkt","vfin"],["vandaag","adv"]], en: "you work today (statement)", hu: "ma dolgozol" },
          { tokens: [["werk","vfin"],["jij","s"],["vandaag","adv"],["?","x"]], en: "do you work today? (inversion, no -t)", hu: "dolgozol ma? (inverzió)" },
          { tokens: [["morgen","adv"],["werk","vfin"],["jij","s"]], en: "tomorrow you work (inversion after adv.)", hu: "holnap dolgozol (inverzió határozó után)" }
        ],
        links: ["v2"]
      },
      {
        id: "no_continuous",
        label_en: "no -ing form", label_hu: "nincs -ing alak", level: "A1",
        rule_en: "Dutch uses simple present where English uses 'am/is/are + -ing'. If progressive matters: 'aan het + infinitive' or posture verb + 'te + infinitive'.",
        rule_hu: "A holland jelent használ ott, ahol az angol '-ing'. Ha fontos: 'aan het + főn.ign.' vagy testhelyzet + 'te + főn.ign.'.",
        reason_en: "Dutch aspect is optional and periphrastic — context decides duration.",
        reason_hu: "Holland aspektus opcionális, körülírt — a kontextus dönt.",
        examples: [
          { tokens: [["ik","s"],["eet","vfin"]], en: "I eat / am eating", hu: "eszem / éppen eszem" },
          { tokens: [["ik","s"],["ben","vfin"],["aan","prep"],["het","art"],["eten","vinf"]], en: "I am eating (explicit progressive)", hu: "éppen eszem (kifejezett)" },
          { tokens: [["ik","s"],["sta","vfin"],["te","part"],["wachten","vinf"]], en: "I stand waiting", hu: "állva várok" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Stem already ends in -t",
        title_hu: "A tő már -t-re végződik",
        body_en: "No double -t: 'hij zit', not 'hij zitt'. One is enough for 2sg/3sg.",
        body_hu: "Nem duplázunk -t-t: 'hij zit', nem 'zitt'.",
        examples: [
          { tokens: [["zitten","vinf"],["→","x"],["hij","s"],["zit","vfin"]], en: "to sit → he sits", hu: "ülni → ő ül" }
        ]
      },
      {
        title_en: "Stem ends in -d → -dt",
        title_hu: "A tő -d-re végződik → -dt",
        body_en: "2sg/3sg is spelled '-dt' (two letters, one sound). In the past the -d is already part of -de, so no extra.",
        body_hu: "2/3. sz. egyes: '-dt' (két betű, egy hang). Múltban a -d a -de része, nincs extra.",
        examples: [
          { tokens: [["worden","vinf"],["→","x"],["hij","s"],["wordt","vfin"]], en: "to become → he becomes", hu: "válik → ő válik" },
          { tokens: [["antwoorden","vinf"],["→","x"],["ik","s"],["antwoord","vfin"]], en: "to answer → I answer", hu: "válaszolni → válaszolok" }
        ]
      }
    ]
  },

  {
    id: "verbs_past",
    title_en: "Verbs — Past Formation", title_hu: "Igék — múlt képzése",
    blurb_en: "weak · strong · participles", blurb_hu: "gyenge · erős · igenevek",
    color: "indigo",
    nodes: [
      {
        id: "weak_past",
        label_en: "weak: -te / -de", label_hu: "gyenge: -te / -de", level: "A2",
        rule_en: "Add -te(n) after unvoiced stem (t, k, f, s, ch, p); else -de(n). Participle: ge- + stem + -t / -d by the same rule.",
        rule_hu: "Zöngétlen mássalhangzó után -te(n), máshol -de(n). Mnév: ge- + tő + -t / -d.",
        reason_en: "The dental suffix agrees in voicing with the preceding consonant.",
        reason_hu: "A foghang-rag hangosságban egyezik az előtte álló mássalhangzóval.",
        examples: [
          { tokens: [["werken","vinf"],["→","x"],["werkte","vfin"],["·","x"],["gewerkt","vinf"]], en: "to work → worked / worked", hu: "dolgozni → dolgozott / dolgozott" },
          { tokens: [["horen","vinf"],["→","x"],["hoorde","vfin"],["·","x"],["gehoord","vinf"]], en: "to hear → heard", hu: "hallani → hallott" },
          { tokens: [["pakken","vinf"],["→","x"],["pakte","vfin"],["·","x"],["gepakt","vinf"]], en: "to grab → grabbed", hu: "megfogni → megfogott" }
        ]
      },
      {
        id: "kofschip",
        label_en: "'t kofschip mnemonic", label_hu: "'t kofschip szabály", level: "A2",
        rule_en: "Memorize unvoiced consonants via the fake word 't kofschip (t, k, f, s, ch, p). Modern: 'fokschaap' adds x.",
        rule_hu: "A zöngétlen mássalhangzókat a 't kofschip szóval jegyezd meg. Modern: 'fokschaap' (x is).",
        reason_en: "It's a memory aid — the rule IS voicing agreement; the mnemonic makes it retrievable.",
        reason_hu: "Csak memóriakulcs — a szabály a zöngésség egyeztetése.",
        examples: [
          { tokens: [["s","x"],["in","prep"],["kus","vinf"],["→","x"],["kuste","vfin"]], en: "s (unvoiced) → -te", hu: "s (zöngétlen) → -te" },
          { tokens: [["n","x"],["in","prep"],["bellen","vinf"],["→","x"],["belde","vfin"]], en: "n (voiced) → -de", hu: "n (zöngés) → -de" }
        ]
      },
      {
        id: "strong_past",
        label_en: "strong: vowel change", label_hu: "erős: magánhangzó-váltás", level: "A2",
        rule_en: "~200 verbs mark past by ablaut, not by suffix. Participle ends in -en, not -t/-d. Memorize in sets (inf · imperf · part).",
        rule_hu: "Kb. 200 ige ablauttal, nem raggal. Mnév -en-re. Sorban tanulandó.",
        reason_en: "Inherited from Proto-Germanic — ancient ablaut series shared by English/German/Dutch (schrijven ~ write ~ schreiben).",
        reason_hu: "Ősgermán örökség — angol/német/holland közös ablaut-sorai.",
        examples: [
          { tokens: [["lopen","vinf"],["→","x"],["liep","vfin"],["→","x"],["gelopen","vinf"]], en: "to walk → walked → walked", hu: "menni → ment → ment" },
          { tokens: [["zingen","vinf"],["→","x"],["zong","vfin"],["→","x"],["gezongen","vinf"]], en: "to sing → sang → sung", hu: "énekelni → énekelt → énekelt" },
          { tokens: [["geven","vinf"],["→","x"],["gaf","vfin"],["→","x"],["gegeven","vinf"]], en: "to give → gave → given", hu: "adni → adott → adott" }
        ],
        links: ["strong_classes"]
      },
      {
        id: "strong_classes",
        label_en: "7 ablaut classes", label_hu: "7 ablaut-osztály", level: "B1",
        rule_en: "Strong verbs cluster into 7 historic patterns. Learn one anchor per class → recognize the rest.",
        rule_hu: "Az erős igék 7 mintába. Horgony-ige osztályonként.",
        reason_en: "Classes reflect Proto-Germanic vowel alternations — same patterns as English sing/sang/sung.",
        reason_hu: "Ősgermán magánhangzó-váltakozások — mint az angolban.",
        examples: [
          { tokens: [["I","x"],["schrijven","vinf"],["·","x"],["schreef","vfin"],["·","x"],["geschreven","vinf"]], en: "Class I: ij → ee → ee (write)", hu: "I. o.: ij → ee → ee" },
          { tokens: [["II","x"],["bieden","vinf"],["·","x"],["bood","vfin"],["·","x"],["geboden","vinf"]], en: "Class II: ie → oo → oo (offer)", hu: "II. o.: ie → oo → oo" },
          { tokens: [["III","x"],["zingen","vinf"],["·","x"],["zong","vfin"],["·","x"],["gezongen","vinf"]], en: "Class III: i → o → o (sing)", hu: "III. o.: i → o → o" },
          { tokens: [["IV","x"],["nemen","vinf"],["·","x"],["nam","vfin"],["·","x"],["genomen","vinf"]], en: "Class IV: e → a → o (take)", hu: "IV. o.: e → a → o" },
          { tokens: [["V","x"],["geven","vinf"],["·","x"],["gaf","vfin"],["·","x"],["gegeven","vinf"]], en: "Class V: e → a → e (give)", hu: "V. o.: e → a → e" }
        ]
      },
      {
        id: "perfect",
        label_en: "perfect tense", label_hu: "perfektum", level: "A2",
        rule_en: "hebben/zijn (finite) + past participle (clause-final). Finite aux in V2; participle at the end.",
        rule_hu: "hebben/zijn (ragozott) + mnév (mondat végén).",
        reason_en: "Classic verb bracket: finite V2, non-finite last, everything else in the middle.",
        reason_hu: "Igekeret: ragozott V2, nem ragozott hátul.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["een","art"],["boek","o"],["gelezen","vinf"]], en: "I have read a book", hu: "olvastam egy könyvet" },
          { tokens: [["zij","s"],["is","vfin"],["naar","prep"],["huis","adv"],["gegaan","vinf"]], en: "she has gone home", hu: "hazament" }
        ],
        links: ["tense_perfect","bracket"]
      },
      {
        id: "hebben_zijn",
        label_en: "hebben vs zijn", label_hu: "hebben vs zijn", level: "A2",
        rule_en: "'zijn' selects when the verb expresses motion TO a destination OR change of state (gaan, komen, worden, beginnen, sterven, blijven). Otherwise 'hebben'.",
        rule_hu: "'zijn' célba irányuló mozgás vagy állapotváltozás igéivel. Egyébként 'hebben'.",
        reason_en: "Mirrors French (être) and German (sein). Some verbs shift: fietsen without destination → hebben; with destination → zijn.",
        reason_hu: "Francia/német analógia. Egyes igék kettősek: cél nélkül hebben, céllal zijn.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["gefietst","vinf"]], en: "I cycled (activity → hebben)", hu: "bicikliztem (tevékenység)" },
          { tokens: [["ik","s"],["ben","vfin"],["naar","prep"],["huis","adv"],["gefietst","vinf"]], en: "I cycled home (destination → zijn)", hu: "hazabicikliztem (cél → zijn)" },
          { tokens: [["hij","s"],["is","vfin"],["oud","adj"],["geworden","vinf"]], en: "he has gotten old", hu: "megöregedett" }
        ]
      },
      {
        id: "past_usage",
        label_en: "perfect vs imperfect", label_hu: "perfektum vs imperfektum", level: "B1",
        rule_en: "Perfect: single, recent, or mentioned-once events in speech. Imperfect: narration, background, habits.",
        rule_hu: "Perfektum: egyszeri, beszélt. Imperfektum: elbeszélés, háttér, szokás.",
        reason_en: "Rule of thumb: if English says 'used to / was -ing / while …' → imperfect; if discrete event in conversation → perfect.",
        reason_hu: "Ökölszabály: 'used to / was -ing' → imperfektum; egyszeri esemény → perfektum.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["gisteren","adv"],["gewerkt","vinf"]], en: "I worked yesterday", hu: "tegnap dolgoztam" },
          { tokens: [["ik","s"],["werkte","vfin"],["elke","adv"],["dag","adv"]], en: "I worked every day", hu: "minden nap dolgoztam" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "No ge- after unstressed prefixes",
        title_hu: "Nincs ge- hangsúlytalan előtag után",
        body_en: "Verbs with be-, ver-, ont-, her-, er-, ge- don't take another ge- in the participle.",
        body_hu: "be-, ver-, ont-, her-, er-, ge- kezdetű igék nem kapnak ge-et a mnév-ben.",
        examples: [
          { tokens: [["betalen","vinf"],["→","x"],["betaald","vinf"]], en: "to pay → paid (no ge-)", hu: "fizetni → fizetett" },
          { tokens: [["vergeten","vinf"],["→","x"],["vergeten","vinf"]], en: "to forget → forgotten", hu: "elfelejteni → elfelejtett" }
        ]
      },
      {
        title_en: "Mixed verbs: vowel change + weak ending",
        title_hu: "Vegyes igék",
        body_en: "Small group: vowel change AND -t. Inherited irregulars.",
        body_hu: "Kis csoport: magánhangzó-váltás ÉS -t rag.",
        examples: [
          { tokens: [["brengen","vinf"],["→","x"],["bracht","vfin"],["→","x"],["gebracht","vinf"]], en: "to bring → brought", hu: "hozni → hozott" },
          { tokens: [["denken","vinf"],["→","x"],["dacht","vfin"],["→","x"],["gedacht","vinf"]], en: "to think → thought", hu: "gondolni → gondolt" },
          { tokens: [["kopen","vinf"],["→","x"],["kocht","vfin"],["→","x"],["gekocht","vinf"]], en: "to buy → bought", hu: "venni → vett" }
        ]
      }
    ]
  },

  {
    id: "modals",
    title_en: "Modal Verbs", title_hu: "Módbeli segédigék",
    blurb_en: "kunnen · moeten · mogen · willen · zullen", blurb_hu: "kunnen · moeten · mogen · willen · zullen",
    color: "indigo",
    nodes: [
      {
        id: "modals_list",
        label_en: "the six modals", label_hu: "a hat modális ige", level: "A1",
        rule_en: "kunnen (can), moeten (must), mogen (may), willen (want), zullen (shall), and the negative-only 'hoeven' (need). Each adds a meaning layer to a main infinitive at the END of the clause.",
        rule_hu: "kunnen, moeten, mogen, willen, zullen + a csak tagadóan 'hoeven'. Jelentésréteg a mondatvégi főnévi igenéven.",
        reason_en: "Modals are old preterite-presents: their present forms look like past forms of other verbs — hence no -t in 1sg and an irregular paradigm.",
        reason_hu: "Préterito-prezens igék: jelen alakjuk múlt forma — ezért nincs -t 1. sz.-ben.",
        examples: [
          { tokens: [["ik","s"],["kan","vfin"],["zwemmen","vinf"]], en: "I can swim", hu: "tudok úszni" },
          { tokens: [["hij","s"],["moet","vfin"],["werken","vinf"]], en: "he has to work", hu: "dolgoznia kell" },
          { tokens: [["we","s"],["willen","vfin"],["naar","prep"],["huis","adv"],["gaan","vinf"]], en: "we want to go home", hu: "haza akarunk menni" }
        ]
      },
      {
        id: "modals_past",
        label_en: "modal pasts", label_hu: "modálisok múltja", level: "A2",
        rule_en: "kon, moest, mocht, wilde/wou, zou. 'Zou' specializes as conditional marker.",
        rule_hu: "kon, moest, mocht, wilde/wou, zou.",
        reason_en: "All past forms are strong — another mark of their ancient origin.",
        reason_hu: "Mind erős — régi eredetű.",
        examples: [
          { tokens: [["ik","s"],["kon","vfin"],["niet","neg"],["komen","vinf"]], en: "I couldn't come", hu: "nem tudtam jönni" },
          { tokens: [["we","s"],["moesten","vfin"],["wachten","vinf"]], en: "we had to wait", hu: "várnunk kellett" }
        ]
      },
      {
        id: "modals_perfect",
        label_en: "modals in perfect (IPP)", label_hu: "modálisok perfektumban (IPP)", level: "B1",
        rule_en: "Modal + main infinitive in perfect: BOTH appear as infinitives (not a participle of the modal). Called IPP — infinitive instead of participle.",
        rule_hu: "Modális + főnévi igenév perfektumban: MINDKETTŐ főnévi igenév. IPP — infinitívusz a mnév helyett.",
        reason_en: "Germanic quirk shared with German: stacking modal + verb in perfect triggers a repair — expected *gemoeten is replaced by 'moeten'.",
        reason_hu: "Germán közös sajátosság — a várt *gemoeten helyett 'moeten'.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["het","o"],["moeten","vinf"],["doen","vinf"]], en: "I had to do it (IPP)", hu: "meg kellett tennem (IPP)" },
          { tokens: [["hij","s"],["heeft","vfin"],["haar","o"],["willen","vinf"],["helpen","vinf"]], en: "he wanted to help her", hu: "segíteni akart neki" }
        ],
        links: ["sep_te"]
      }
    ],
    exceptions: [
      {
        title_en: "hoeven: only negative, takes 'te'",
        title_hu: "hoeven: csak tagadóan, 'te'-vel",
        body_en: "'Hoeven' = 'need' but only in negative/restrictive contexts. Requires 'te' before infinitive.",
        body_hu: "'hoeven' = 'kell', csak tagadóan. 'te'-t kíván.",
        examples: [
          { tokens: [["je","s"],["hoeft","vfin"],["niet","neg"],["te","part"],["komen","vinf"]], en: "you don't have to come", hu: "nem kell jönnöd" },
          { tokens: [["hij","s"],["hoeft","vfin"],["alleen","adv"],["maar","adv"],["te","part"],["vragen","vinf"]], en: "he only has to ask", hu: "csak kérnie kell" }
        ]
      },
      {
        title_en: "mag niet vs moet niet",
        title_hu: "mag niet vs moet niet",
        body_en: "'Mag niet' = 'may not / is not allowed'. 'Moet niet' in NL = 'shouldn't / doesn't need to'. In BE it can mean 'must not'.",
        body_hu: "'Mag niet' = 'nem szabad'. 'Moet niet' NL-ben 'nem kell/kellene'; BE-ben 'tilos' is lehet.",
        examples: [
          { tokens: [["je","s"],["mag","vfin"],["hier","adv"],["niet","neg"],["roken","vinf"]], en: "you may not smoke here (forbidden)", hu: "itt nem szabad dohányozni" },
          { tokens: [["je","s"],["moet","vfin"],["niet","neg"],["zo","adv"],["zeuren","vinf"]], en: "you shouldn't whine like that (NL)", hu: "ne nyafogj (NL)" }
        ]
      }
    ]
  },

  {
    id: "separable",
    title_en: "Separable Verbs", title_hu: "Elváló igék",
    blurb_en: "opstaan · meegaan · aankomen", blurb_hu: "opstaan · meegaan · aankomen",
    color: "indigo",
    nodes: [
      {
        id: "sep_basic",
        label_en: "separable prefix", label_hu: "elváló előtag", level: "A1",
        rule_en: "A stressed prefix splits off and goes to the END of a main clause in finite forms. Rejoins in infinitives and subordinate clauses.",
        rule_hu: "A hangsúlyos előtag elválik, főmondatban a VÉGÉRE. Főnévi igenévben és mellékmondatban újra együtt.",
        reason_en: "V2 forces the finite verb to position 2, but the prefix carries the semantic core — so it drops to the rear, forming a bracket.",
        reason_hu: "A V2 kényszeríti a ragozott igét a 2. helyre, de az előtag viszi a jelentést — így a végére kerül.",
        examples: [
          { tokens: [["ik","s"],["sta","vfin"],["om","prep"],["7","adv"],["uur","adv"],["op","part"]], en: "I get up at 7 (split)", hu: "7-kor kelek föl (elválik)" },
          { tokens: [["…","x"],["dat","conn"],["ik","s"],["opsta","vfin"]], en: "… that I get up (rejoined)", hu: "… hogy fölkelek (együtt)" },
          { tokens: [["ik","s"],["wil","vfin"],["opstaan","vinf"]], en: "I want to get up (infinitive joined)", hu: "fel akarok kelni" }
        ]
      },
      {
        id: "sep_pp",
        label_en: "past participle: ge- in the middle", label_hu: "mnév: ge- középen", level: "A2",
        rule_en: "In the participle, ge- slots BETWEEN the prefix and the stem.",
        rule_hu: "A melléknévi igenévben a ge- az előtag ÉS a tő KÖZÉ kerül.",
        reason_en: "ge- attached historically to the verb root; the prefix is separate, so ge- can only go between.",
        reason_hu: "A ge- a tőhöz tapadt; az előtag külön — csak közéjük illeszkedhet.",
        examples: [
          { tokens: [["opstaan","vinf"],["→","x"],["opgestaan","vinf"]], en: "got up", hu: "felkelt" },
          { tokens: [["meebrengen","vinf"],["→","x"],["meegebracht","vinf"]], en: "brought along", hu: "elhozott" }
        ]
      },
      {
        id: "sep_te",
        label_en: "'te' inside the prefix", label_hu: "'te' az előtagban", level: "B1",
        rule_en: "With separable verb + 'te + infinitive', 'te' slots BETWEEN prefix and stem.",
        rule_hu: "Elváló igénél a 'te' az előtag és a tő KÖZÉ kerül.",
        reason_en: "Same logic as ge-: 'te' attaches to the verb root, not the prefix.",
        reason_hu: "Mint a ge-nél.",
        examples: [
          { tokens: [["ik","s"],["probeer","vfin"],["op","part"],["te","part"],["staan","vinf"]], en: "I'm trying to get up", hu: "próbálok fölkelni" },
          { tokens: [["het","s"],["is","vfin"],["tijd","o"],["om","conn"],["op","part"],["te","part"],["staan","vinf"]], en: "it's time to get up", hu: "ideje fölkelni" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Inseparable prefixes",
        title_hu: "Nem elváló előtagok",
        body_en: "be-, ver-, ont-, her-, ge-, er- are UNSTRESSED and NEVER split. They block ge- in the participle.",
        body_hu: "be-, ver-, ont-, her-, ge-, er- HANGSÚLYTALAN és SOHA nem válnak el.",
        examples: [
          { tokens: [["vertellen","vinf"],["→","x"],["verteld","vinf"]], en: "told (NOT geverteld)", hu: "mesélt (NEM geverteld)" },
          { tokens: [["ik","s"],["vertel","vfin"],["een","art"],["verhaal","o"]], en: "I tell a story (no split)", hu: "mesélek egy történetet" }
        ]
      },
      {
        title_en: "Stress-ambiguous prefixes",
        title_hu: "Hangsúly-kettős előtagok",
        body_en: "door-, om-, onder-, over-, voor- can be either. Stress decides; meaning differs.",
        body_hu: "door-, om-, onder-, over-, voor- lehet elváló vagy nem. A hangsúly dönt.",
        examples: [
          { tokens: [["ómrijden","vinf"]], en: "to detour (separable)", hu: "kerülővel (elváló)" },
          { tokens: [["omríjden","vinf"]], en: "to run over (inseparable)", hu: "elgázolni (nem elváló)" }
        ]
      }
    ]
  },

  {
    id: "irregular",
    title_en: "Irregular Verbs", title_hu: "Rendhagyó igék",
    blurb_en: "zijn · hebben · gaan · doen · zien", blurb_hu: "zijn · hebben · gaan · doen · zien",
    color: "indigo",
    nodes: [
      {
        id: "zijn",
        label_en: "zijn (to be)", label_hu: "zijn (lenni)", level: "A1",
        rule_en: "Most irregular Dutch verb. Present: ben/bent/is/zijn. Imperfect: was/waren. Participle: geweest. Perfect auxiliary is 'zijn' itself.",
        rule_hu: "Legrendhagyóbb. Jelen: ben/bent/is/zijn. Múlt: was/waren. Mnév: geweest.",
        reason_en: "Like English 'be', fuses three old roots: *es- (is), *wes- (was), *bheu- (ben).",
        reason_hu: "Mint az angol 'be' — három régi tő: *es-, *wes-, *bheu-.",
        examples: [
          { tokens: [["ik","s"],["ben","vfin"],["ziek","adj"]], en: "I am ill", hu: "beteg vagyok" },
          { tokens: [["jij","s"],["bent","vfin"],["laat","adj"]], en: "you are late", hu: "késésben vagy" },
          { tokens: [["we","s"],["waren","vfin"],["er","adv"]], en: "we were there", hu: "ott voltunk" },
          { tokens: [["ik","s"],["ben","vfin"],["daar","adv"],["geweest","vinf"]], en: "I have been there", hu: "ott voltam" }
        ]
      },
      {
        id: "hebben",
        label_en: "hebben (to have)", label_hu: "hebben (birtokolni)", level: "A1",
        rule_en: "Present: heb/hebt/heeft/hebben. Imperfect: had/hadden. Participle: gehad. Default perfect auxiliary for non-motion verbs.",
        rule_hu: "Jelen: heb/hebt/heeft/hebben. Múlt: had/hadden. Mnév: gehad.",
        reason_en: "Cognate with English 'have' — shared Germanic roles: possession and perfect-auxiliary.",
        reason_hu: "Rokon 'have'-vel — közös germán szerep.",
        examples: [
          { tokens: [["ik","s"],["heb","vfin"],["een","art"],["auto","o"]], en: "I have a car", hu: "van autóm" },
          { tokens: [["hij","s"],["heeft","vfin"],["honger","o"]], en: "he is hungry (lit. has hunger)", hu: "éhes" },
          { tokens: [["we","s"],["hadden","vfin"],["geluk","o"]], en: "we were lucky (lit. had luck)", hu: "szerencsénk volt" }
        ]
      },
      {
        id: "mono_inf",
        label_en: "gaan / staan / slaan / doen / zien", label_hu: "gaan / staan / slaan / doen / zien", level: "A2",
        rule_en: "Monosyllabic infinitives. Stem = strip -n (not -en). Present: ga/gaat/gaan.",
        rule_hu: "Egyszótagos főnévi igenevek. Tő: -n-t veszünk el.",
        reason_en: "Remnants of eroded two-syllable verbs. Stem extraction differs from regular verbs.",
        reason_hu: "Lekopott kétszótagosok. Tőképzésük eltér.",
        examples: [
          { tokens: [["ik","s"],["ga","vfin"],["·","x"],["jij","s"],["gaat","vfin"],["·","x"],["wij","s"],["gaan","vfin"]], en: "I / you / we go", hu: "megyek / mégy / megyünk" },
          { tokens: [["ik","s"],["doe","vfin"],["het","o"],["nu","adv"]], en: "I do it now", hu: "most csinálom" },
          { tokens: [["hij","s"],["ziet","vfin"],["me","o"]], en: "he sees me", hu: "lát engem" }
        ]
      }
    ]
  }
];
