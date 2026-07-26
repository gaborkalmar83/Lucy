// Dutch grammar — part 4 (clusters D): gaps in the original map.
// Prepositions, relative clauses, the imperative and modal particles.
window.GRAM_CLUSTERS_D = [
  {
    id: "prepositions",
    title_en: "Prepositions", title_hu: "Elöljárószók",
    blurb_en: "in · op · aan · bij · naar · van", blurb_hu: "in · op · aan · bij",
    color: "amber",
    nodes: [
      { id: "prep_place", label_en: "in · op · aan · bij", label_hu: "hely-elöljárók", level: "A1",
        rule_en: "'in' = inside; 'op' = on a surface, and for streets, islands and most public places (op school, op kantoor, op vakantie); 'aan' = attached to or bordering (aan de muur, aan zee); 'bij' = near, at someone's place.",
        rule_hu: "'in' = benne; 'op' = felületen, valamint utcákon, szigeteken; 'aan' = hozzáerősítve, mellette; 'bij' = -nál/-nél.",
        reason_en: "Dutch chooses by how the thing relates to the surface, not by the English word. 'op school' treats school as a platform you stand on, which is why it is not 'in school'.",
        examples: [
          { tokens: [["Het","art"],["boek","s"],["ligt","vfin"],["op","prep"],["tafel","adv"]], en: "The book is on the table", hu: "A könyv az asztalon van" },
          { tokens: [["Ik","s"],["ben","vfin"],["op","prep"],["kantoor","adv"]], en: "I'm at the office (not 'in')", hu: "Az irodában vagyok" },
          { tokens: [["De","art"],["foto","s"],["hangt","vfin"],["aan","prep"],["de","art"],["muur","adv"]], en: "The photo hangs on the wall", hu: "A fénykép a falon lóg" },
          { tokens: [["Ik","s"],["ben","vfin"],["bij","prep"],["Anna","adv"]], en: "I'm at Anna's", hu: "Annánál vagyok" }
        ], links: ["prep_fixed"] },
      { id: "prep_time", label_en: "time prepositions", label_hu: "idő-elöljárók", level: "A2",
        rule_en: "'om' + clock time (om drie uur), 'op' + day/date (op maandag), 'in' + month, season, year (in mei), 'over' = in … from now (over een week), 'sinds' = since, 'vanaf' = from … onwards.",
        rule_hu: "'om' + óra, 'op' + nap/dátum, 'in' + hónap/évszak/év, 'over' = múlva, 'sinds' = óta.",
        reason_en: "Each preposition matches the size of the time unit, the same logic as the place prepositions.",
        examples: [
          { tokens: [["om","prep"],["drie","adj"],["uur","adv"]], en: "at three o'clock", hu: "három órakor" },
          { tokens: [["op","prep"],["maandag","adv"]], en: "on Monday", hu: "hétfőn" },
          { tokens: [["over","prep"],["een","art"],["week","adv"]], en: "in a week from now", hu: "egy hét múlva" }
        ] },
      { id: "prep_fixed", label_en: "fixed verb + preposition", label_hu: "kötött vonzatok", level: "B1",
        rule_en: "Many verbs demand a specific preposition that you cannot deduce: wachten OP (wait for), denken AAN (think of), houden VAN (love), zoeken NAAR, luisteren NAAR, vragen OM, twijfelen AAN, zich interesseren VOOR.",
        rule_hu: "Sok ige kötött elöljárót kíván: wachten op, denken aan, houden van, luisteren naar.",
        reason_en: "These pairings are lexical, not logical — they must be learned with the verb, exactly like English 'depend ON' or 'listen TO'.",
        examples: [
          { tokens: [["Ik","s"],["wacht","vfin"],["op","prep"],["de","art"],["bus","o"]], en: "I'm waiting for the bus", hu: "A buszra várok" },
          { tokens: [["Zij","s"],["houdt","vfin"],["van","prep"],["muziek","o"]], en: "She loves music", hu: "Szereti a zenét" },
          { tokens: [["Denk","vfin"],["aan","prep"],["je","adj"],["moeder","o"]], en: "Think of your mother", hu: "Gondolj az anyádra" }
        ], links: ["rel_waar", "er_prep"] }
    ],
    exceptions: [
      { title_en: "naar vs in for movement", title_hu: "naar vs in mozgásnál",
        body_en: "Movement towards a place uses 'naar' (Ik ga naar Amsterdam), never 'in'. 'in' only marks where you already are. With 'huis' it is irregular: naar huis (home), thuis (at home).",
        body_hu: "Mozgás iránya: 'naar'. 'huis' rendhagyó: naar huis, thuis.",
        examples: [
          { tokens: [["Ik","s"],["ga","vfin"],["naar","prep"],["huis","adv"]], en: "I'm going home", hu: "Hazamegyek" },
          { tokens: [["Ik","s"],["ben","vfin"],["thuis","adv"]], en: "I'm at home", hu: "Otthon vagyok" }
        ] }
    ]
  },
  {
    id: "relative",
    title_en: "Relative clauses", title_hu: "Vonatkozó mellékmondatok",
    blurb_en: "die · dat · wat · waar+", blurb_hu: "die · dat · wat",
    color: "indigo",
    nodes: [
      { id: "rel_die_dat", label_en: "die vs dat", label_hu: "die vs dat", level: "A2",
        rule_en: "The relative pronoun follows the article of the noun: de-words and all plurals take 'die', het-words take 'dat'. The clause is a subclause, so the verb goes to the end.",
        rule_hu: "A vonatkozó névmás a névelőt követi: de-szó → die, het-szó → dat. A mellékmondatban az ige a végére kerül.",
        reason_en: "It is the same de/het split as the demonstratives — the pronoun simply agrees with the noun it replaces.",
        examples: [
          { tokens: [["de","art"],["man","s"],["die","pron"],["daar","adv"],["staat","vfin"]], en: "the man who is standing there", hu: "a férfi, aki ott áll" },
          { tokens: [["het","art"],["boek","s"],["dat","pron"],["ik","s"],["lees","vfin"]], en: "the book that I'm reading", hu: "a könyv, amit olvasok" },
          { tokens: [["de","art"],["kinderen","s"],["die","pron"],["spelen","vfin"]], en: "the children who are playing", hu: "a gyerekek, akik játszanak" }
        ], links: ["de_het", "sov"] },
      { id: "rel_wat", label_en: "wat after indefinites", label_hu: "wat határozatlan után", level: "B1",
        rule_en: "Use 'wat' — not 'dat' — after alles, iets, niets, veel, het beste, and when referring back to a whole clause.",
        rule_hu: "'wat' áll alles, iets, niets, veel után, és ha az egész mondatra utal vissza.",
        reason_en: "These antecedents have no gender to agree with, so the neutral 'wat' steps in.",
        examples: [
          { tokens: [["alles","s"],["wat","pron"],["ik","s"],["weet","vfin"]], en: "everything I know", hu: "minden, amit tudok" },
          { tokens: [["iets","s"],["wat","pron"],["mooi","adj"],["is","vfin"]], en: "something that is beautiful", hu: "valami, ami szép" }
        ] },
      { id: "rel_waar", label_en: "waarmee · waarop · waarin", label_hu: "waar + elöljáró", level: "B1",
        rule_en: "For THINGS, a preposition never combines with die/dat. Use waar + preposition as one word: de stoel waarop ik zit. For PEOPLE use the preposition + wie: de man met wie ik sprak.",
        rule_hu: "Tárgyaknál waar + elöljáró egy szóban; személyeknél elöljáró + wie.",
        reason_en: "Dutch treats 'waar' as the thing-pronoun for prepositions, exactly as it does with 'er' in ordinary sentences.",
        examples: [
          { tokens: [["de","art"],["stoel","s"],["waarop","pron"],["ik","s"],["zit","vfin"]], en: "the chair I'm sitting on", hu: "a szék, amelyen ülök" },
          { tokens: [["de","art"],["man","s"],["met","prep"],["wie","pron"],["ik","s"],["sprak","vfin"]], en: "the man I spoke with", hu: "a férfi, akivel beszéltem" }
        ], links: ["er_prep", "prep_fixed"] }
    ],
    exceptions: [
      { title_en: "The relative clause can be split off", title_hu: "A vonatkozó mondat elválhat",
        body_en: "In speech the relative clause is often pushed past the verb bracket to keep it next to its noun: Ik heb het boek gelezen dat je me gaf. Both orders are correct.",
        body_hu: "Beszédben a vonatkozó mondat gyakran a mondat végére kerül.",
        examples: [
          { tokens: [["Ik","s"],["heb","vfin"],["het","art"],["boek","o"],["gelezen","vinf"],["dat","pron"],["je","s"],["me","io"],["gaf","vfin"]], en: "I've read the book you gave me", hu: "Elolvastam a könyvet, amit adtál" }
        ] }
    ]
  },
  {
    id: "imperative",
    title_en: "Imperative", title_hu: "Felszólító mód",
    blurb_en: "commands · requests · let's", blurb_hu: "parancs · kérés",
    color: "rose",
    nodes: [
      { id: "imp_basic", label_en: "the bare stem", label_hu: "puszta igetŐ", level: "A1",
        rule_en: "The imperative is simply the verb stem, with no ending and no pronoun: Kom! Wacht! Ga weg! Separable verbs split, with the prefix at the end.",
        rule_hu: "A felszólítás maga az igetŐ, végződés és névmás nélkül. Az elváló igék prefixuma a végére kerül.",
        reason_en: "There is no subject to agree with, so the verb appears in its most basic form.",
        examples: [
          { tokens: [["Kom","vfin"],["hier","adv"]], en: "Come here!", hu: "Gyere ide!" },
          { tokens: [["Doe","vfin"],["de","art"],["deur","o"],["dicht","part"]], en: "Close the door! — separable verb splits", hu: "Csukd be az ajtót!" },
          { tokens: [["Wees","vfin"],["voorzichtig","adj"]], en: "Be careful! — irregular form of zijn", hu: "Légy óvatos!" }
        ], links: ["sep_basic"] },
      { id: "imp_polite", label_en: "polite and inclusive forms", label_hu: "udvarias alakok", level: "A2",
        rule_en: "With 'u' add -t and keep the pronoun: Komt u binnen. For 'let's', use Laten we + infinitive: Laten we gaan. Adding 'even' or 'maar' softens any command considerably.",
        rule_hu: "'u'-val -t és kitett névmás: Komt u binnen. 'Laten we' + főnévi igenév = csináljuk.",
        reason_en: "The formal imperative keeps the full verb form because it is really a polite invitation rather than an order.",
        examples: [
          { tokens: [["Komt","vfin"],["u","s"],["binnen","part"]], en: "Do come in (formal)", hu: "Jöjjön be" },
          { tokens: [["Laten","vfin"],["we","s"],["gaan","vinf"]], en: "Let's go", hu: "Menjünk" },
          { tokens: [["Wacht","vfin"],["even","part"]], en: "Hang on a moment — 'even' softens it", hu: "Várj egy kicsit" }
        ], links: ["particles_soft"] }
    ],
    exceptions: [
      { title_en: "A bare imperative sounds blunt", title_hu: "A puszta felszólítás nyers",
        body_en: "Dutch commands without a softener come across as brusque. In everyday speech people add even, maar, eens or nou, or reframe as a question: Kun je even helpen?",
        body_hu: "Lágyító szó nélkül a felszólítás nyersen hangzik: tegyél mellé even, maar, eens szót.",
        examples: [
          { tokens: [["Geef","vfin"],["me","io"],["eens","part"],["het","art"],["zout","o"]], en: "Pass me the salt, would you", hu: "Add ide a sót, légy szíves" }
        ] }
    ]
  },
  {
    id: "particles",
    title_en: "Modal particles", title_hu: "Módosítószók",
    blurb_en: "even · maar · eens · toch · wel", blurb_hu: "even · maar · toch",
    color: "teal",
    nodes: [
      { id: "particles_soft", label_en: "even · maar · eens", label_hu: "lágyító szavak", level: "A2",
        rule_en: "These little words carry no dictionary meaning here — they set the tone. 'even' = briefly, no trouble; 'maar' = go ahead, no objection; 'eens' = just, at some point. They normally sit right after the verb and object pronouns.",
        rule_hu: "Ezek a szavak a hangnemet állítják, nem a jelentést. Rendszerint az ige és a névmások után állnak.",
        reason_en: "Dutch marks politeness and attitude with particles rather than with longer polite phrases, so leaving them out is what makes learners sound abrupt.",
        examples: [
          { tokens: [["Kun","vfin"],["je","s"],["me","io"],["even","part"],["helpen","vinf"]], en: "Could you give me a quick hand?", hu: "Tudnál egy percre segíteni?" },
          { tokens: [["Ga","vfin"],["maar","part"],["zitten","vinf"]], en: "Do have a seat", hu: "Ülj csak le" },
          { tokens: [["Kom","vfin"],["eens","part"],["langs","part"]], en: "Do drop by sometime", hu: "Nézz be egyszer" }
        ], links: ["imp_polite"] },
      { id: "particles_toch", label_en: "toch · wel · hoor", label_hu: "toch · wel · hoor", level: "B1",
        rule_en: "'toch' = surely / after all / contrary to expectation; 'wel' = the positive answer to a negative, and a mild emphasiser; 'hoor' at the end reassures the listener.",
        rule_hu: "'toch' = mégis / ugye; 'wel' = de igen; 'hoor' = megnyugtató zárószó.",
        reason_en: "'wel' exists because Dutch needs an explicit opposite of 'niet' — English uses stressed 'do' instead.",
        examples: [
          { tokens: [["Je","s"],["komt","vfin"],["toch","part"]], en: "You are coming, aren't you?", hu: "Ugye jössz?" },
          { tokens: [["Ik","s"],["heb","vfin"],["het","o"],["wel","part"],["gedaan","vinf"]], en: "I DID do it (contradicting 'you didn't')", hu: "De igenis megcsináltam" },
          { tokens: [["Dat","s"],["is","vfin"],["goed","adj"],["hoor","part"]], en: "That's fine, honestly", hu: "Rendben van, tényleg" }
        ] }
    ],
    exceptions: [
      { title_en: "Never translate particles literally", title_hu: "Ne fordítsd szó szerint",
        body_en: "'even' is not 'even', 'maar' here is not 'but', 'eens' is not 'once'. Learn each one from the situations it appears in; a dictionary gloss will mislead you.",
        body_hu: "Ezeket ne szótárazd: a szituációból tanuld meg őket.",
        examples: [
          { tokens: [["Zeg","vfin"],["het","o"],["maar","part"]], en: "Go ahead, tell me — 'maar' is not 'but'", hu: "Mondd csak" }
        ] }
    ]
  }
];
