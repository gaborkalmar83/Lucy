// Finnish grammar map — part 1: vowel harmony, consonant gradation, stems,
// the case system (nominative through the local cases), possession, pronouns.
window.GRAM_FI = [
  {
    id: "fi_harmony", title_en: "Vowel harmony", blurb_en: "a o u vs ä ö y · e i are neutral", color: "amber",
    nodes: [
      { id: "fi_harmony_basic", label_en: "back words and front words", level: "A1",
        rule_en: "Finnish vowels split into two camps: back (a, o, u) and front (ä, ö, y). A single word may contain only one camp, and every ending has two shapes to match: -ssa/-ssä, -lla/-llä, -ko/-kö. talo → talossa, metsä → metsässä.",
        reason_en: "This is a pronunciation constraint that hardened into grammar. Once you know which camp a word is in, you know which version of every ending it will ever take — so it costs nothing to learn and saves you constantly.",
        examples: [
          { tokens: [["talossa","adv"]], en: "in the house — back word, -ssa" },
          { tokens: [["metsässä","adv"]], en: "in the forest — front word, -ssä" },
          { tokens: [["autolla","adv"]], en: "by car — back" },
          { tokens: [["työllä","adv"]], en: "with work — front" }
        ], links: ["fi_harmony_neutral"] },
      { id: "fi_harmony_neutral", label_en: "e and i belong to neither", level: "A1",
        rule_en: "e and i are neutral: they appear in both kinds of word and do not decide anything. A word containing ONLY neutral vowels counts as a front word: meri → meressä, Helsinki → Helsingissä, tie → tiellä.",
        reason_en: "Historically e and i were front vowels that lost their back partners, which is why they still pull a word to the front camp when nothing else is present.",
        examples: [
          { tokens: [["Helsingissä","adv"]], en: "only neutral vowels → front ending" },
          { tokens: [["meressä","adv"]], en: "in the sea → -ssä" },
          { tokens: [["kirjeitä","o"]], en: "letters — neutral stem takes front endings" }
        ] },
      { id: "fi_harmony_compounds", label_en: "compounds harmonise separately", level: "A2",
        rule_en: "In a compound word each part keeps its own vowels, and the ENDING follows the last part only: työpöytä → työpöydällä; kirjakauppa → kirjakaupassa (back, because kauppa is back, even though kirja-…).",
        reason_en: "A compound is really two words glued together, so harmony never has to be reconciled across the seam — only the final element talks to the ending.",
        examples: [
          { tokens: [["työpöydällä","adv"]], en: "on the desk — pöytä is front → -llä" },
          { tokens: [["kirjakaupassa","adv"]], en: "in the bookshop — kauppa is back → -ssa" }
        ] }
    ],
    exceptions: [
      { title_en: "Loanwords can break the rule", body_en: "Recent borrowings sometimes mix camps: olympialaiset, amatööri, martyyri. When they take an ending, the LAST vowel of the stem usually decides: amatööri → amatöörinä.",
        examples: [ { tokens: [["amatöörinä","adv"]], en: "final ö → front ending" } ] }
    ]
  },
  {
    id: "fi_gradation", title_en: "Consonant gradation", blurb_en: "k · p · t change when the syllable closes", color: "indigo",
    nodes: [
      { id: "fi_grad_quant", label_en: "kk → k, pp → p, tt → t", level: "A1",
        rule_en: "A doubled k, p or t becomes single when an ending closes the syllable: kukka → kukan (flower), kauppa → kaupan (shop), tyttö → tytön (girl). The nominative has the strong grade; most other forms have the weak one.",
        reason_en: "The consonant weakens because the syllable it ends gets heavier. It is entirely mechanical — once you can see which syllable closes, you can predict the change.",
        examples: [
          { tokens: [["kukka","s"],["kukan","adv"]], en: "flower → of the flower" },
          { tokens: [["kauppa","s"],["kaupassa","adv"]], en: "shop → in the shop" },
          { tokens: [["tyttö","s"],["tytöllä","adv"]], en: "girl → the girl has" }
        ], links: ["fi_grad_qual", "fi_grad_when"] },
      { id: "fi_grad_qual", label_en: "single k, p, t change quality", level: "A2",
        rule_en: "Single consonants change rather than shorten: t → d (katu → kadun), p → v (leipä → leivän), k → nothing (lukea → luen). After a nasal or liquid they assimilate: nk → ng (Helsinki → Helsingin), mp → mm (lampi → lammen), lt → ll (ilta → illan), nt → nn (antaa → annan), rt → rr (parta → parran).",
        reason_en: "Each change is the easiest way to pronounce that consonant in a closed syllable — d, v and the doubled nasals all take less effort than the originals.",
        examples: [
          { tokens: [["katu","s"],["kadulla","adv"]], en: "street → on the street" },
          { tokens: [["leipä","s"],["leivän","adv"]], en: "bread → of the bread" },
          { tokens: [["ilta","s"],["illalla","adv"]], en: "evening → in the evening" },
          { tokens: [["Helsinki","s"],["Helsingissä","adv"]], en: "in Helsinki" }
        ] },
      { id: "fi_grad_when", label_en: "when the weak grade appears", level: "A2",
        rule_en: "Weak grade when the ending CLOSES the syllable (adds a consonant): genitive -n, accusative -n, the -ssa/-sta/-lla/-lta/-lle cases, and the -n of the first person verb. Strong grade stays before endings that begin a new open syllable: partitive -a, illative -on, plural -t.",
        reason_en: "This is why kukka → kukan but kukkaa (partitive) and kukat (plural) keep the double k. Learn the trigger, not the individual words.",
        examples: [
          { tokens: [["kukkaa","o"]], en: "partitive → strong grade stays" },
          { tokens: [["kukan","o"]], en: "genitive → weak grade" },
          { tokens: [["kukat","s"]], en: "plural -t → strong" },
          { tokens: [["kukissa","adv"]], en: "plural inessive → weak" }
        ] },
      { id: "fi_grad_inverse", label_en: "inverse gradation in verbs", level: "B1",
        rule_en: "Some verbs run the other way: the infinitive is WEAK and the present is STRONG. tavata → tapaan (to meet), hypätä → hyppään (to jump), ajatella → ajattelen (to think), paeta → pakenen (to flee).",
        reason_en: "The infinitive ending -ta/-tä closes the syllable, so the infinitive is the form that weakens. It is the same rule seen from the other end — not a second system.",
        examples: [
          { tokens: [["tavata","vinf"],["tapaan","vfin"]], en: "to meet → I meet (v → p)" },
          { tokens: [["ajatella","vinf"],["ajattelen","vfin"]], en: "to think → I think (t → tt)" },
          { tokens: [["hypätä","vinf"],["hyppään","vfin"]], en: "to jump → I jump (p → pp)" }
        ], links: ["fi_verb_t4"] }
    ],
    exceptions: [
      { title_en: "Not every k, p or t gradates", body_en: "Gradation only applies when the consonant starts the LAST syllable of the stem. In auto → auton, the t is not in that position, so nothing happens. Same with kartta → kartan (gradates) but karttaa (does not).",
        examples: [ { tokens: [["auto","s"],["auton","adv"]], en: "no change — t is not in the gradating position" } ] },
      { title_en: "New loanwords often skip it", body_en: "Recent borrowings resist gradation: banaani → banaanin, but auto, video, radio and many others simply never had a gradating consonant to begin with. When in doubt, a dictionary lists the genitive.",
        examples: [ { tokens: [["banaanin","adv"]], en: "no gradation" } ] }
    ]
  },
  {
    id: "fi_stems", title_en: "Finding the stem", blurb_en: "the dictionary form is not the base", color: "teal",
    nodes: [
      { id: "fi_stem_basic", label_en: "nominative vs inflectional stem", level: "A1",
        rule_en: "Endings are not added to the dictionary form but to the STEM, which you get from the genitive by removing -n: talo → talon → talo-; katu → kadun → kadu-. Learn every noun with its genitive and the whole case system follows.",
        reason_en: "This is the single most useful habit in Finnish. The nominative often hides gradation and stem changes; the genitive shows them, so it is the form worth memorising.",
        examples: [
          { tokens: [["talo","s"],["talon","adv"],["talossa","adv"]], en: "house → of the house → in the house" },
          { tokens: [["katu","s"],["kadun","adv"],["kadulla","adv"]], en: "street → of the street → on the street" }
        ], links: ["fi_genitive"] },
      { id: "fi_stem_e", label_en: "-i words with an e-stem", level: "A2",
        rule_en: "Many older words ending in -i take an -e- stem: kieli → kielen (language), suomi → suomen, järvi → järven, pieni → pienen. Newer loans keep the i: bussi → bussin, hotelli → hotellin.",
        reason_en: "The final -i is a worn-down old -e. Age is a good guide: everyday native words change, recognisably foreign ones do not.",
        examples: [
          { tokens: [["kieli","s"],["kielen","adv"],["kielessä","adv"]], en: "language → of the language → in the language" },
          { tokens: [["järvi","s"],["järvellä","adv"]], en: "lake → at the lake" },
          { tokens: [["bussi","s"],["bussilla","adv"]], en: "loanword → keeps the i" }
        ] },
      { id: "fi_stem_nen", label_en: "-nen words become -se-", level: "A2",
        rule_en: "Every word in -nen has the stem -se-: suomalainen → suomalaisen, nainen → naisen, punainen → punaisen, hevonen → hevosen. This covers nationalities, most adjectives in -inen, and many nouns.",
        reason_en: "It is a huge and completely regular group — one rule unlocks thousands of words, including every nationality you will ever need.",
        examples: [
          { tokens: [["suomalainen","s"],["suomalaisen","adv"]], en: "Finn → of the Finn" },
          { tokens: [["nainen","s"],["naisella","adv"]], en: "woman → the woman has" },
          { tokens: [["punaisessa","adj"],["talossa","adv"]], en: "in the red house — the adjective agrees" }
        ] },
      { id: "fi_stem_consonant", label_en: "words with two stems", level: "B1",
        rule_en: "Some words have a vowel stem and a consonant stem, and the partitive uses the consonant one: mies → miehen but miestä; vesi → veden but vettä; käsi → käden but kättä; huone → huoneen but huonetta.",
        reason_en: "The consonant stem is the older form, preserved before the -tä ending. It explains why the partitive of these words looks unrelated to their genitive.",
        examples: [
          { tokens: [["mies","s"],["miehen","adv"],["miestä","o"]], en: "man → of the man → (partitive)" },
          { tokens: [["vesi","s"],["veden","adv"],["vettä","o"]], en: "water → of the water → some water" }
        ], links: ["fi_partitive_form"] }
    ],
    exceptions: [
      { title_en: "Adjectives take the same case as their noun", body_en: "Finnish adjectives agree fully: isossa punaisessa talossa (in the big red house). Every adjective repeats the case and number of the noun — there is no short form.",
        examples: [ { tokens: [["isossa","adj"],["punaisessa","adj"],["talossa","adv"]], en: "all three carry -ssa" } ] }
    ]
  },
  {
    id: "fi_basic_cases", title_en: "Nominative, genitive, plural", blurb_en: "talo · talon · talot", color: "rose",
    nodes: [
      { id: "fi_nominative", label_en: "nominative", level: "A1",
        rule_en: "The dictionary form. It marks the subject of a sentence, and also the complement after 'olla': Talo on iso. Minä olen opettaja.",
        reason_en: "Finnish has no articles at all, so the bare nominative already means 'a house' or 'the house' depending on context and word order.",
        examples: [
          { tokens: [["Talo","s"],["on","vfin"],["iso","adj"]], en: "The house is big" },
          { tokens: [["Minä","s"],["olen","vfin"],["opettaja","adv"]], en: "I am a teacher" }
        ] },
      { id: "fi_genitive", label_en: "genitive -n", level: "A1",
        rule_en: "Add -n to the stem: talo → talon, katu → kadun. It marks possession (Annan auto = Anna's car), it is required by every postposition, and it is also the form of a complete singular object.",
        reason_en: "The genitive does three unrelated jobs, which is why it is worth learning early — and why the -n on an object does not mean possession.",
        examples: [
          { tokens: [["Annan","adv"],["auto","s"]], en: "Anna's car" },
          { tokens: [["talon","adv"],["edessä","adv"]], en: "in front of the house — postposition" },
          { tokens: [["Ostan","vfin"],["kirjan","o"]], en: "I'll buy the book — complete object" }
        ], links: ["fi_object_total", "fi_postpositions"] },
      { id: "fi_plural_t", label_en: "plural -t", level: "A1",
        rule_en: "The nominative plural adds -t to the stem, in the STRONG grade: talo → talot, kukka → kukat, katu → kadut… careful: kadut, because the -t closes the syllable. Used for subjects and complete plural objects.",
        reason_en: "This -t appears in the nominative only. Every other plural case uses a completely different marker, which is the next card.",
        examples: [
          { tokens: [["Talot","s"],["ovat","vfin"],["isoja","adj"]], en: "The houses are big" },
          { tokens: [["Ostan","vfin"],["kirjat","o"]], en: "I'll buy the books" }
        ] },
      { id: "fi_plural_i", label_en: "plural -i- in other cases", level: "B1",
        rule_en: "Outside the nominative, the plural marker is -i- inserted before the case ending: taloissa (in the houses), kaduilla (on the streets), kirjoille (to the books). Stem vowels change before it: o/u stay, a → o, e and i disappear.",
        reason_en: "Two different plural markers is one of Finnish's real difficulties. Seeing an -i- before a case ending is your signal that the word is plural.",
        examples: [
          { tokens: [["taloissa","adv"]], en: "in the houses (talo + i + ssa)" },
          { tokens: [["kaduilla","adv"]], en: "on the streets" },
          { tokens: [["kirjoissa","adv"]], en: "in the books — kirja + i → kirjoi-" }
        ] }
    ],
    exceptions: [
      { title_en: "Numbers take the singular", body_en: "After any number above one, the noun stays SINGULAR and goes into the partitive: kaksi kirjaa, viisi taloa, sata euroa. Only 'yksi' takes the plain nominative.",
        examples: [
          { tokens: [["kaksi","adj"],["kirjaa","o"]], en: "two books — singular partitive" },
          { tokens: [["viisi","adj"],["taloa","o"]], en: "five houses" }
        ] },
      { title_en: "Body parts and pairs are often plural", body_en: "silmälasit (glasses), housut (trousers), sakset (scissors), hiukset (hair). Like English 'trousers', they take plural agreement even for one item.",
        examples: [ { tokens: [["Housut","s"],["ovat","vfin"],["uudet","adj"]], en: "The trousers are new" } ] }
    ]
  },
  {
    id: "fi_partitive", title_en: "The partitive", blurb_en: "kirjaa · maata · huonetta", color: "amber",
    nodes: [
      { id: "fi_partitive_form", label_en: "forming the partitive", level: "A1",
        rule_en: "Three endings. -a/-ä after a stem ending in ONE short vowel (kala → kalaa, talo → taloa). -ta/-tä after two vowels or a consonant stem (maa → maata, työ → työtä, mies → miestä). -tta/-ttä after words ending in -e (huone → huonetta, perhe → perhettä).",
        reason_en: "Which ending you get is decided purely by the shape of the stem, so it is predictable once you can see the stem — another reason to learn words with their genitive.",
        examples: [
          { tokens: [["kalaa","o"]], en: "fish — single vowel → -a" },
          { tokens: [["maata","o"]], en: "land — two vowels → -ta" },
          { tokens: [["huonetta","o"]], en: "room — e-stem → -tta" }
        ], links: ["fi_stem_consonant"] },
      { id: "fi_partitive_uses", label_en: "when to use it", level: "A1",
        rule_en: "The partitive marks something incomplete or unbounded: an unspecified amount (Juon vettä), the object of a negative sentence (En juo kahvia), an ongoing action (Luen kirjaa), and the noun after any number above one (kolme kirjaa).",
        reason_en: "One idea underlies all of it — a PART rather than a whole. Once you hear the partitive as 'some of / not all of', the separate rules collapse into one.",
        examples: [
          { tokens: [["Juon","vfin"],["vettä","o"]], en: "I drink (some) water" },
          { tokens: [["En","neg"],["juo","vfin"],["kahvia","o"]], en: "I don't drink coffee — negation" },
          { tokens: [["Luen","vfin"],["kirjaa","o"]], en: "I'm reading a book — in progress" },
          { tokens: [["kolme","adj"],["kirjaa","o"]], en: "three books" }
        ], links: ["fi_object_partial", "fi_neg_object"] },
      { id: "fi_partitive_plural", label_en: "plural partitive", level: "A2",
        rule_en: "Endings -ja/-jä or -ia/-iä on the plural stem: kirja → kirjoja, talo → taloja, kieli → kieliä, suomalainen → suomalaisia. This is the form for 'some books', 'there are houses', and negative plural objects.",
        reason_en: "Plural partitive is extremely common because Finnish uses it for any indefinite plural quantity — which in practice is most plurals you will say.",
        examples: [
          { tokens: [["Luen","vfin"],["kirjoja","o"]], en: "I read books" },
          { tokens: [["Pöydällä","adv"],["on","vfin"],["kirjoja","s"]], en: "There are books on the table" },
          { tokens: [["Täällä","adv"],["on","vfin"],["suomalaisia","s"]], en: "There are Finns here" }
        ] },
      { id: "fi_partitive_verbs", label_en: "verbs that always take it", level: "A2",
        rule_en: "Some verbs describe unbounded activity and take a partitive object no matter what: rakastaa (love), odottaa (wait for), auttaa (help), katsoa (watch), kuunnella (listen to), etsiä (look for), harrastaa, ajatella, pelätä.",
        reason_en: "None of these actions has a natural finishing point, so a complete object would make no sense. Group them by that meaning rather than memorising a list.",
        examples: [
          { tokens: [["Rakastan","vfin"],["sinua","o"]], en: "I love you" },
          { tokens: [["Odotan","vfin"],["bussia","o"]], en: "I'm waiting for the bus" },
          { tokens: [["Katson","vfin"],["televisiota","o"]], en: "I'm watching television" }
        ] }
    ],
    exceptions: [
      { title_en: "The partitive is also a subject", body_en: "In existential sentences the thing that exists takes the partitive when the amount is indefinite, and the verb stays SINGULAR: Pöydällä on kirjoja. Kadulla on ihmisiä. Never 'ovat' here.",
        examples: [ { tokens: [["Kadulla","adv"],["on","vfin"],["ihmisiä","s"]], en: "There are people on the street" } ] },
      { title_en: "After adjectives of quantity", body_en: "paljon, vähän, vähän, monta, kilo, lasi and similar take the partitive: paljon rahaa, lasi maitoa, kilo omenoita. 'monta' is followed by the singular partitive: monta kirjaa.",
        examples: [ { tokens: [["paljon","adv"],["rahaa","o"]], en: "a lot of money" } ] }
    ]
  },
  {
    id: "fi_object", title_en: "The object: whole or part", blurb_en: "kirjan vs kirjaa vs kirjat", color: "indigo",
    nodes: [
      { id: "fi_object_total", label_en: "total object", level: "A2",
        rule_en: "If the action is complete and produces a result, the singular object takes the genitive form (-n) and the plural object the nominative (-t): Ostan kirjan. Ostan kirjat. Söin omenan.",
        reason_en: "Finnish marks aspect on the OBJECT rather than on the verb. Where English says 'I read' vs 'I was reading', Finnish changes the object's case instead.",
        examples: [
          { tokens: [["Ostan","vfin"],["kirjan","o"]], en: "I'll buy the book — complete" },
          { tokens: [["Luin","vfin"],["kirjan","o"]], en: "I read the book (all of it)" },
          { tokens: [["Ostan","vfin"],["kirjat","o"]], en: "plural total → -t" }
        ], links: ["fi_genitive"] },
      { id: "fi_object_partial", label_en: "partial object", level: "A2",
        rule_en: "Use the partitive if the action is unfinished, the amount is indefinite, or the sentence is negative: Luen kirjaa (I'm reading a book), Ostan kirjoja (I buy books), En osta kirjaa.",
        reason_en: "The contrast 'luin kirjan' vs 'luin kirjaa' is exactly 'I read the book' vs 'I was reading a book'. It is the closest thing Finnish has to a continuous tense.",
        examples: [
          { tokens: [["Luen","vfin"],["kirjaa","o"]], en: "I'm reading a book — ongoing" },
          { tokens: [["Luin","vfin"],["kirjan","o"]], en: "I read the book — finished" },
          { tokens: [["En","neg"],["lukenut","vinf"],["kirjaa","o"]], en: "negative → always partitive" }
        ] },
      { id: "fi_object_nominative", label_en: "nominative object", level: "B1",
        rule_en: "The total object appears in the plain NOMINATIVE (no -n) after an imperative, in the passive, and in necessive structures with täytyy / pitää / on pakko: Osta kirja! Kirja ostetaan. Minun täytyy ostaa kirja.",
        reason_en: "All three constructions lack an ordinary nominative subject, so the -n would be the only -n in the sentence and would read as a subject. Dropping it removes the ambiguity.",
        examples: [
          { tokens: [["Osta","vfin"],["kirja","o"]], en: "Buy the book! — imperative" },
          { tokens: [["Minun","adv"],["täytyy","vfin"],["ostaa","vinf"],["kirja","o"]], en: "I have to buy the book" },
          { tokens: [["Kirja","o"],["ostetaan","vfin"]], en: "The book will be bought — passive" }
        ], links: ["fi_imperative_sg", "fi_passive_present"] }
    ],
    exceptions: [
      { title_en: "Personal pronouns have their own object form", body_en: "Pronouns use a distinct -t accusative for a total object: minut, sinut, hänet, meidät, teidät, heidät. Näen hänet (I see him) vs Näen häntä (I see him — partitive, e.g. repeatedly).",
        examples: [
          { tokens: [["Näen","vfin"],["hänet","o"]], en: "total object pronoun" },
          { tokens: [["Rakastan","vfin"],["häntä","o"]], en: "partitive verb → häntä" }
        ] }
    ]
  },
  {
    id: "fi_inner_cases", title_en: "Inner local cases", blurb_en: "-ssa · -sta · -Vn", color: "teal",
    nodes: [
      { id: "fi_inessive", label_en: "inessive -ssa/-ssä (in)", level: "A1",
        rule_en: "Inside something: talossa (in the house), Suomessa (in Finland), koulussa (at school). Added to the weak-grade stem.",
        reason_en: "Finnish replaces prepositions with case endings. Six local cases cover in/out/into and on/off/onto, and each pair of three works the same way.",
        examples: [
          { tokens: [["Asun","vfin"],["Helsingissä","adv"]], en: "I live in Helsinki" },
          { tokens: [["Olen","vfin"],["koulussa","adv"]], en: "I'm at school" }
        ] },
      { id: "fi_elative", label_en: "elative -sta/-stä (out of, about)", level: "A1",
        rule_en: "Out of or from inside: talosta, Suomesta. It is also 'about' after verbs of speaking and liking: Puhun Suomesta. Pidän kahvista (I like coffee).",
        reason_en: "'pitää + elative' is how Finnish says 'like', which has no obvious logic in English — learn the verb together with the case it demands.",
        examples: [
          { tokens: [["Tulen","vfin"],["Suomesta","adv"]], en: "I come from Finland" },
          { tokens: [["Pidän","vfin"],["kahvista","adv"]], en: "I like coffee" },
          { tokens: [["Puhumme","vfin"],["työstä","adv"]], en: "We're talking about work" }
        ] },
      { id: "fi_illative", label_en: "illative (into)", level: "A1",
        rule_en: "Three shapes. Lengthen the final vowel + n after a short vowel: talo → taloon, Helsinki → Helsinkiin. Add -hVn to a one-syllable word ending in a long vowel: maa → maahan, työ → työhön. Add -seen to a long e-stem: huone → huoneeseen.",
        reason_en: "The illative is the least regular case, which is why it is worth drilling separately. The stem's ending, not its meaning, chooses the shape.",
        examples: [
          { tokens: [["Menen","vfin"],["taloon","adv"]], en: "I'm going into the house" },
          { tokens: [["Menen","vfin"],["Suomeen","adv"]], en: "I'm going to Finland" },
          { tokens: [["Menen","vfin"],["maahan","adv"]], en: "one syllable → -hVn" }
        ] }
    ],
    exceptions: [
      { title_en: "Inner or outer is fixed per place name", body_en: "Some places take inner cases, others outer, and it must be learned: Helsingissä but Tampereella; Suomessa but Venäjällä; koulussa but asemalla, torilla, postissa. There is no reliable rule.",
        examples: [
          { tokens: [["Tampereella","adv"]], en: "outer case, though it's a city" },
          { tokens: [["Helsingissä","adv"]], en: "inner case" }
        ] }
    ]
  },
  {
    id: "fi_outer_cases", title_en: "Outer local cases", blurb_en: "-lla · -lta · -lle", color: "rose",
    nodes: [
      { id: "fi_adessive", label_en: "adessive -lla/-llä (on, at, with)", level: "A1",
        rule_en: "On a surface or at a place: pöydällä (on the table), asemalla (at the station). Also the instrument: autolla (by car), kynällä (with a pen). And it builds possession: minulla on.",
        reason_en: "One ending covering location, instrument and possession looks odd until you see them all as 'in the vicinity of' — the thing is at my disposal, in my hand, in my possession.",
        examples: [
          { tokens: [["Kirja","s"],["on","vfin"],["pöydällä","adv"]], en: "The book is on the table" },
          { tokens: [["Menen","vfin"],["autolla","adv"]], en: "I'm going by car" },
          { tokens: [["Minulla","adv"],["on","vfin"],["auto","s"]], en: "I have a car" }
        ], links: ["fi_have"] },
      { id: "fi_ablative", label_en: "ablative -lta/-ltä (from, off)", level: "A1",
        rule_en: "Off a surface or away from a person: pöydältä (off the table), Annalta (from Anna). Also 'sound/taste like': Se näyttää hyvältä (it looks good), Se maistuu hyvältä.",
        reason_en: "The sensory use is a Finnish idiom worth learning as a block — every 'it seems/looks/tastes/smells + adjective' pattern uses this case.",
        examples: [
          { tokens: [["Sain","vfin"],["kirjan","o"],["Annalta","adv"]], en: "I got the book from Anna" },
          { tokens: [["Se","s"],["näyttää","vfin"],["hyvältä","adv"]], en: "It looks good" }
        ] },
      { id: "fi_allative", label_en: "allative -lle (onto, to)", level: "A1",
        rule_en: "Onto a surface or to a person: pöydälle (onto the table), Annalle (to Anna). It is the standard case for the recipient: Annan kirjan Annalle.",
        reason_en: "Finnish has no dative case; the allative does that job. Any verb of giving, saying, sending or showing uses it for the person receiving.",
        examples: [
          { tokens: [["Annan","vfin"],["kirjan","o"],["sinulle","adv"]], en: "I'll give you the book" },
          { tokens: [["Panen","vfin"],["kirjan","o"],["pöydälle","adv"]], en: "I'll put the book on the table" },
          { tokens: [["Soitan","vfin"],["äidille","adv"]], en: "I'll call mum" }
        ] }
    ],
    exceptions: [
      { title_en: "Days and times use the adessive", body_en: "maanantaina is essive, but time of day and many time expressions take -lla: aamulla (in the morning), illalla (in the evening), kello kahdelta (at two o'clock), viikolla (during the week).",
        examples: [
          { tokens: [["illalla","adv"]], en: "in the evening" },
          { tokens: [["aamulla","adv"]], en: "in the morning" }
        ] }
    ]
  },
  {
    id: "fi_other_cases", title_en: "Essive, translative and the rest", blurb_en: "-na · -ksi · -tta · -ine", color: "amber",
    nodes: [
      { id: "fi_essive", label_en: "essive -na/-nä (as, being)", level: "B1",
        rule_en: "A temporary role or state: opettajana (as a teacher), lapsena (as a child), sairaana (ill). Also days of the week and dates: maanantaina, jouluna.",
        reason_en: "The essive says 'in the capacity of' — a state you are in for a while, which is exactly why it also fits a particular day.",
        examples: [
          { tokens: [["Työskentelen","vfin"],["opettajana","adv"]], en: "I work as a teacher" },
          { tokens: [["Olen","vfin"],["sairaana","adv"]], en: "I'm ill (right now)" },
          { tokens: [["maanantaina","adv"]], en: "on Monday" }
        ] },
      { id: "fi_translative", label_en: "translative -ksi (becoming, into)", level: "B1",
        rule_en: "A change into a new state: Hän tuli opettajaksi (he became a teacher), Vesi muuttui jääksi. Also 'into a language': Käännän sen suomeksi. And it makes adverbs of language: puhun suomeksi.",
        reason_en: "Essive and translative form a pair: essive = the state you are in, translative = the state you move into. Keeping them as a pair makes both easier.",
        examples: [
          { tokens: [["Hän","s"],["tuli","vfin"],["opettajaksi","adv"]], en: "He became a teacher" },
          { tokens: [["Puhun","vfin"],["suomeksi","adv"]], en: "I speak in Finnish" },
          { tokens: [["Tule","vfin"],["kotiin","adv"],["illaksi","adv"]], en: "Come home for the evening" }
        ] },
      { id: "fi_rare_cases", label_en: "abessive, comitative, instructive", level: "B2",
        rule_en: "Abessive -tta/-ttä = without (rahatta) — but everyday Finnish says 'ilman rahaa'. Comitative -ine- + possessive suffix = accompanied by (perheineen, with his family) and is formal. Instructive -in survives in fixed phrases: omin käsin, jalan.",
        reason_en: "These three are the least used of the fifteen cases. Recognising them when reading is enough; you will rarely need to form them.",
        examples: [
          { tokens: [["ilman","prep"],["rahaa","o"]], en: "without money — the normal way" },
          { tokens: [["omin","adj"],["käsin","adv"]], en: "with one's own hands — instructive" }
        ] }
    ],
    exceptions: [
      { title_en: "The essive marks a temporary state only", body_en: "'Olen sairaana' = I'm ill at the moment. 'Olen sairas' (nominative) describes what you are more permanently. The same contrast: Olen opettaja (my profession) vs Olen täällä opettajana (my role here).",
        examples: [
          { tokens: [["Olen","vfin"],["opettaja","adv"]], en: "I am a teacher — profession" },
          { tokens: [["Olen","vfin"],["opettajana","adv"]], en: "I'm here as a teacher — role" }
        ] }
    ]
  },
  {
    id: "fi_possession", title_en: "Possession", blurb_en: "minulla on · taloni", color: "indigo",
    nodes: [
      { id: "fi_have", label_en: "there is no verb 'to have'", level: "A1",
        rule_en: "Possession is 'at me is': adessive + on + the thing in the nominative. Minulla on auto. Negatively the thing switches to the PARTITIVE: Minulla ei ole autoa.",
        reason_en: "Finnish treats having as a kind of location. The negative partitive is the same rule as every other negated object — nothing special is happening.",
        examples: [
          { tokens: [["Minulla","adv"],["on","vfin"],["auto","s"]], en: "I have a car" },
          { tokens: [["Minulla","adv"],["ei","neg"],["ole","vfin"],["autoa","s"]], en: "I don't have a car" },
          { tokens: [["Onko","vfin"],["sinulla","adv"],["aikaa","s"]], en: "Do you have time?" }
        ], links: ["fi_adessive", "fi_neg_present"] },
      { id: "fi_poss_suffix", label_en: "possessive suffixes", level: "A2",
        rule_en: "-ni (my), -si (your), -nsa/-nsä (his/her/its), -mme (our), -nne (your pl), -nsa/-nsä (their): taloni, talosi, talonsa. The stem stays in the STRONG grade: kauppa → kauppani, not kaupani.",
        reason_en: "The suffix adds a syllable that keeps the earlier syllable open, so gradation never fires. That is why possessive forms look like the nominative rather than the genitive.",
        examples: [
          { tokens: [["taloni","s"]], en: "my house" },
          { tokens: [["kauppani","s"]], en: "my shop — strong grade kept" },
          { tokens: [["Missä","q"],["on","vfin"],["kirjasi","s"]], en: "Where's your book?" }
        ] },
      { id: "fi_poss_with_case", label_en: "case ending first, then the suffix", level: "B1",
        rule_en: "The order is stem + case + possessive: talo-ssa-ni (in my house), auto-lla-ni (in my car), ystävä-lle-ni (to my friend). The word for the owner (minun, sinun) is optional and usually dropped.",
        reason_en: "The fixed order makes even long words readable: peel off the possessive suffix, then the case ending, and the stem is what remains.",
        examples: [
          { tokens: [["talossani","adv"]], en: "in my house" },
          { tokens: [["ystävälleni","adv"]], en: "to my friend" },
          { tokens: [["Minun","adv"],["autoni","s"],["on","vfin"],["vanha","adj"]], en: "My car is old — minun is optional" }
        ] }
    ],
    exceptions: [
      { title_en: "Spoken Finnish drops the suffix", body_en: "Everyday speech usually keeps only the pronoun: 'mun auto' instead of 'autoni', 'sun kirja' instead of 'kirjasi'. The suffixes remain fully alive in writing and formal speech.",
        examples: [ { tokens: [["mun","adv"],["auto","s"]], en: "spoken: my car" } ] },
      { title_en: "The 3rd person suffix can mean 'his own'", body_en: "'Hän näki talonsa' means he saw HIS OWN house. To say he saw someone else's, you need 'hänen talonsa' with a different referent made clear by context.",
        examples: [ { tokens: [["Hän","s"],["näki","vfin"],["talonsa","o"]], en: "he saw his own house" } ] }
    ]
  },
  {
    id: "fi_pronouns", title_en: "Pronouns", blurb_en: "minä · tämä · joka", color: "teal",
    nodes: [
      { id: "fi_personal", label_en: "personal pronouns", level: "A1",
        rule_en: "minä, sinä, hän, me, te, he. They decline like nouns: minun (my), minua (partitive), minulle (to me), minussa (in me), minut (total object). 'hän' covers he and she alike — Finnish has no gendered pronouns.",
        reason_en: "Because the verb ending already shows the person, the pronoun is often dropped in the first and second person: 'Puhun suomea' needs no minä.",
        examples: [
          { tokens: [["Puhun","vfin"],["suomea","o"]], en: "I speak Finnish — no pronoun needed" },
          { tokens: [["Hän","s"],["on","vfin"],["opettaja","adv"]], en: "He/she is a teacher" },
          { tokens: [["Anna","vfin"],["se","o"],["minulle","adv"]], en: "Give it to me" }
        ] },
      { id: "fi_demonstrative", label_en: "tämä · tuo · se", level: "A1",
        rule_en: "tämä (this, near me), tuo (that, over there), se (it / that already mentioned). Plurals: nämä, nuo, ne. They decline fully: tässä (here, in this), tuolla (over there), siinä.",
        reason_en: "Since there are no articles, these pronouns do much of the work English does with 'the' — 'se kirja' is close to 'the book'.",
        examples: [
          { tokens: [["Tämä","s"],["on","vfin"],["hyvä","adj"]], en: "This is good" },
          { tokens: [["Mikä","q"],["tuo","s"],["on","vfin"]], en: "What's that over there?" },
          { tokens: [["Se","s"],["on","vfin"],["pöydällä","adv"]], en: "It's on the table" }
        ] },
      { id: "fi_interrogative_relative", label_en: "kuka · mikä · joka", level: "A2",
        rule_en: "kuka = who (kenen, ketä, kenelle), mikä = what/which for things. The relative pronoun is 'joka' for a specific noun (mies, joka…) and 'mikä' after a whole clause, a superlative, or an indefinite word (kaikki, mikä…).",
        reason_en: "Finnish separates questioning and relating: 'kuka' asks, 'joka' relates. English uses 'who' for both, which is why learners reach for the wrong one.",
        examples: [
          { tokens: [["Kuka","q"],["sinä","s"],["olet","vfin"]], en: "Who are you?" },
          { tokens: [["mies","s"],["joka","pron"],["asuu","vfin"],["täällä","adv"]], en: "the man who lives here" },
          { tokens: [["kaikki","s"],["mikä","pron"],["on","vfin"],["hyvää","adj"]], en: "everything that is good" }
        ] }
    ],
    exceptions: [
      { title_en: "Spoken Finnish uses se and ne for people", body_en: "In everyday speech 'se' replaces hän and 'ne' replaces he: 'Se tuli eilen' = he/she came yesterday. This is normal, not rude — but it is not used in writing.",
        examples: [ { tokens: [["Se","s"],["tuli","vfin"],["eilen","adv"]], en: "spoken: he/she came yesterday" } ] },
      { title_en: "Spoken forms of the pronouns", body_en: "minä → mä, sinä → sä, minun → mun, sinun → sun, me → me, he → ne. You will hear these constantly and almost never see them written.",
        examples: [ { tokens: [["Mä","s"],["oon","vfin"],["täällä","adv"]], en: "spoken: minä olen täällä" } ] }
    ]
  }
];
