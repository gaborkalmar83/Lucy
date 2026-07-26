// Hungarian grammar map — part 2. Derivation, participles, pronouns,
// subordination, modality, numbers and adverbs.
window.GRAM_HU2 = [
  {
    id: "hu_pronouns", title_en: "Pronouns & demonstratives", blurb_en: "én · ez · az · agreement", color: "indigo",
    nodes: [
      { id: "hu_pers_pron", label_en: "personal pronouns are usually dropped", level: "A1",
        rule_en: "Én, te, ő, mi, ti, ők exist but are normally left out, because the verb ending already says who acts. They are used for contrast or emphasis: ÉN megyek (I'm the one going).",
        reason_en: "Hungarian is a pro-drop language: putting the pronoun in is a deliberate act of emphasis, not the neutral option.",
        examples: [
          { tokens: [["Megyek","vfin"]], en: "I'm going — no pronoun needed" },
          { tokens: [["Én","s"],["megyek","vfin"]], en: "I'M the one going — contrastive" },
          { tokens: [["Ő","s"],["orvos","o"]], en: "He/She is a doctor — no gender distinction" }
        ], links: ["hu_indef_conj"] },
      { id: "hu_pron_cases", label_en: "pronouns have their own case forms", level: "A2",
        rule_en: "Pronouns do not take endings like nouns; each case has a separate set: engem/téged/őt/minket/titeket/őket, nekem/neked/neki…, velem/veled/vele…, rólam/rólad/róla…",
        reason_en: "These are frozen old forms — the ending fused with the pronoun stem long ago, so they must be memorised as whole words.",
        examples: [
          { tokens: [["Engem","o"],["kérdezett","vfin"]], en: "He asked me" },
          { tokens: [["Neked","io"],["adom","vfin"]], en: "I'm giving it to you" },
          { tokens: [["Róla","adv"],["beszélünk","vfin"]], en: "We're talking about him/her" }
        ] },
      { id: "hu_dem_agree", label_en: "ez / az agree in case", level: "A2",
        rule_en: "A demonstrative before a noun repeats the noun's case AND keeps the article: ez a ház → ebben a házban, arra a székre, ezzel a könyvvel.",
        reason_en: "The demonstrative is grammatically a separate phrase standing next to the noun phrase, so it must carry the same case to show they belong together.",
        examples: [
          { tokens: [["ez","adj"],["a","art"],["ház","o"]], en: "this house" },
          { tokens: [["ebben","adv"],["a","art"],["házban","adv"]], en: "in this house — both marked" },
          { tokens: [["arra","adv"],["a","art"],["székre","adv"]], en: "onto that chair" }
        ], links: ["hu_place_in"] },
      { id: "hu_poss_pron", label_en: "enyém · tiéd — possessive pronouns", level: "B1",
        rule_en: "Standalone 'mine/yours' are enyém, tiéd, övé, mienk, tietek, övék. Used when the possessed noun is not repeated: Ez a könyv az enyém.",
        reason_en: "They are the possessive endings turned into independent words, so they can stand alone as a predicate.",
        examples: [
          { tokens: [["Ez","s"],["az","art"],["enyém","o"]], en: "This is mine" },
          { tokens: [["A","art"],["tiéd","s"],["jobb","adj"]], en: "Yours is better" }
        ], links: ["hu_poss_suffix"] }
    ]
  },
  {
    id: "hu_modality", title_en: "Ability, permission, necessity", blurb_en: "-hat/-het · kell · lehet · tud", color: "rose",
    nodes: [
      { id: "hu_potential", label_en: "-hat / -het = can / may", level: "A2",
        rule_en: "Instead of a separate modal verb, Hungarian inserts -hat/-het into the verb before the personal ending: olvasok → olvashatok (I can/may read), megyek → mehetek, látom → láthatom.",
        reason_en: "Hungarian builds meaning by stacking suffixes, so possibility is a layer inside the verb rather than a helper word beside it.",
        examples: [
          { tokens: [["Mehetek","vfin"]], en: "I may/can go" },
          { tokens: [["Itt","adv"],["dohányozhat","vfin"]], en: "You may smoke here" },
          { tokens: [["Nem","neg"],["láthatom","vfin"]], en: "I can't see it" }
        ], links: ["hu_tud_ismer"] },
      { id: "hu_kell", label_en: "kell + personal infinitive", level: "A2",
        rule_en: "'kell' (must) is impersonal — the person is shown on the infinitive: el kell mennem / menned / mennie / mennünk / mennetek / menniük. The dative may be added for clarity: Nekem el kell mennem.",
        reason_en: "Since 'kell' itself cannot be conjugated for the person who must act, the infinitive takes the personal ending instead.",
        examples: [
          { tokens: [["El","part"],["kell","vfin"],["mennem","vinf"]], en: "I have to go" },
          { tokens: [["Tanulnod","vinf"],["kell","vfin"]], en: "You have to study" },
          { tokens: [["Nem","neg"],["kell","vfin"],["sietni","vinf"]], en: "There's no need to hurry" }
        ], links: ["hu_inf"] },
      { id: "hu_lehet_szabad", label_en: "lehet · szabad · muszáj", level: "B1",
        rule_en: "'lehet' = it is possible, 'szabad' = it is allowed, 'muszáj' = it is unavoidable. All are impersonal and take an infinitive.",
        reason_en: "These are adjective-like predicates rather than verbs, which is why they never conjugate.",
        examples: [
          { tokens: [["Szabad","vfin"],["bejönni","vinf"]], en: "May I come in?" },
          { tokens: [["Nem","neg"],["lehet","vfin"],["tudni","vinf"]], en: "There's no way to know" }
        ] },
      { id: "hu_tud_ismer", label_en: "tud vs ismer — two kinds of 'know'", level: "A2",
        rule_en: "'tud' = know a fact, or be able to do something (Tudok úszni = I can swim). 'ismer' = be acquainted with a person or place. Never mix them.",
        reason_en: "The split mirrors German wissen/kennen and French savoir/connaître — factual knowledge versus familiarity.",
        examples: [
          { tokens: [["Tudok","vfin"],["úszni","vinf"]], en: "I can swim" },
          { tokens: [["Ismerem","vfin"],["őt","o"]], en: "I know him/her" },
          { tokens: [["Tudom","vfin"],[",","x"],["hol","q"],["van","vfin"]], en: "I know where it is" }
        ] }
    ],
    exceptions: [
      { title_en: "-hat/-het also softens a request", body_en: "The potential suffix is the polite way to ask: Segíthetek? (May I help?), Kérhetek egy kávét? It is not only about literal ability.",
        examples: [ { tokens: [["Segíthetek","vfin"]], en: "Can I help you?" } ] }
    ]
  },
  {
    id: "hu_participles", title_en: "Participles & causatives", blurb_en: "-ó/-ő · -t/-tt · -va/-ve · -tat/-tet", color: "teal",
    nodes: [
      { id: "hu_part_present", label_en: "present participle -ó / -ő", level: "B1",
        rule_en: "Added to the stem it forms an adjective or an agent noun: olvas → olvasó (reading / reader), dolgozik → dolgozó, fut → futó.",
        reason_en: "Hungarian prefers a participle where English uses a relative clause: 'the reading man' rather than 'the man who is reading'.",
        examples: [
          { tokens: [["az","art"],["olvasó","adj"],["ember","s"]], en: "the man who is reading" },
          { tokens: [["egy","art"],["futó","adj"],["kutya","s"]], en: "a running dog" }
        ], links: ["hu_relative"] },
      { id: "hu_part_past", label_en: "past participle -t / -tt", level: "B1",
        rule_en: "The same form as the past tense stem, used adjectivally: írt levél (a written letter), főtt tojás (a boiled egg), elveszett kulcs (a lost key).",
        reason_en: "It describes the state left behind by a completed action, so it naturally shares the past-tense marker.",
        examples: [
          { tokens: [["egy","art"],["írt","adj"],["levél","s"]], en: "a written letter" },
          { tokens: [["főtt","adj"],["tojás","s"]], en: "a boiled egg" }
        ] },
      { id: "hu_part_adv", label_en: "adverbial participle -va / -ve", level: "B1",
        rule_en: "Describes a resulting state or an accompanying circumstance: nyitva (open), zárva (closed), állva (standing), sietve (hurriedly).",
        reason_en: "It turns a verb into a description of how or in what state, filling the role of English '-ing' after a verb of position.",
        examples: [
          { tokens: [["Az","art"],["ajtó","s"],["nyitva","adv"],["van","vfin"]], en: "The door is open" },
          { tokens: [["Sietve","adv"],["indult","vfin"],["el","part"]], en: "He left in a hurry" }
        ] },
      { id: "hu_causative", label_en: "causative -tat / -tet", level: "B2",
        rule_en: "Makes 'have something done by someone': mos → mosat, ír → írat, csinál → csináltat, épít → építtet. Short one-syllable stems take -at/-et, longer ones -tat/-tet.",
        reason_en: "Rather than a helper verb like English 'have/make', Hungarian marks causation inside the verb itself.",
        examples: [
          { tokens: [["Levágattam","vfin"],["a","art"],["hajam","o"]], en: "I had my hair cut" },
          { tokens: [["Házat","o"],["építtet","vfin"]], en: "He is having a house built" }
        ] }
    ]
  },
  {
    id: "hu_subord", title_en: "Subordination", blurb_en: "hogy · mert · ha · aki · ami", color: "amber",
    nodes: [
      { id: "hu_hogy", label_en: "hogy = that", level: "A2",
        rule_en: "Subordinate clauses are introduced by 'hogy', and a comma before it is compulsory in writing. The main clause often contains a pointer word: Azt mondtam, hogy…",
        reason_en: "The pointer word 'azt' fills the object slot in the main clause, which is also why the verb there takes the definite conjugation.",
        examples: [
          { tokens: [["Azt","o"],["mondtam","vfin"],[",","x"],["hogy","conn"],["jövök","vfin"]], en: "I said that I'm coming" },
          { tokens: [["Tudom","vfin"],[",","x"],["hogy","conn"],["igazad","s"],["van","vfin"]], en: "I know you're right" }
        ], links: ["hu_def_when"] },
      { id: "hu_conj", label_en: "mert · ha · bár · mielőtt", level: "A2",
        rule_en: "mert (because), ha (if/when), bár (although), mielőtt (before), miután (after), amíg (while/until), ezért (therefore). Word order inside the clause stays normal.",
        reason_en: "Unlike German or Dutch, a Hungarian subordinate clause does not reorder its verb — only the conjunction marks it.",
        examples: [
          { tokens: [["Nem","neg"],["megyek","vfin"],[",","x"],["mert","conn"],["beteg","adj"],["vagyok","vfin"]], en: "I'm not going because I'm ill" },
          { tokens: [["Ha","conn"],["esik","vfin"],[",","x"],["itthon","adv"],["maradok","vfin"]], en: "If it rains, I'll stay home" }
        ] },
      { id: "hu_relative", label_en: "aki · ami · amely · ahol", level: "B1",
        rule_en: "'aki' for people, 'ami' for things and for referring back to a whole clause, 'amely' as a formal variant, plus ahol (where), amikor (when), amelyik (which one). They take case endings as needed: akinek, amiről.",
        reason_en: "Each is the question word with a- prefixed, which is why they line up so neatly with ki, mi, hol, mikor.",
        examples: [
          { tokens: [["a","art"],["férfi","s"],[",","x"],["aki","pron"],["ott","adv"],["áll","vfin"]], en: "the man who is standing there" },
          { tokens: [["a","art"],["könyv","s"],[",","x"],["amit","pron"],["olvasok","vfin"]], en: "the book that I'm reading" },
          { tokens: [["a","art"],["ház","s"],[",","x"],["ahol","pron"],["lakom","vfin"]], en: "the house where I live" }
        ], links: ["hu_question"] },
      { id: "hu_indirect_q", label_en: "indirect questions with -e", level: "B1",
        rule_en: "Report a yes/no question with the particle -e attached to the verb: Nem tudom, hogy jön-e. It is written with a hyphen and never stressed.",
        reason_en: "There is no word order change available for questions, so a particle carries the job instead.",
        examples: [
          { tokens: [["Kérdezd","vfin"],["meg","part"],[",","x"],["hogy","conn"],["jön","vfin"],["-e","part"]], en: "Ask whether he's coming" }
        ] }
    ]
  },
  {
    id: "hu_numbers", title_en: "Numbers & time", blurb_en: "-kor · dates · ordinals", color: "indigo",
    nodes: [
      { id: "hu_numerals", label_en: "numerals and kettő / két", level: "A1",
        rule_en: "'kettő' stands alone, 'két' comes before a noun: Kettő. — Két könyv. Ordinals end in -dik: második, harmadik, but 'első' (first) is irregular.",
        reason_en: "The short form exists purely because the full form is clumsy before a noun.",
        examples: [
          { tokens: [["két","adj"],["könyv","o"]], en: "two books" },
          { tokens: [["Kettő","s"]], en: "Two. (standing alone)" },
          { tokens: [["a","art"],["harmadik","adj"],["emelet","s"]], en: "the third floor" }
        ], links: ["hu_no_plural_num"] },
      { id: "hu_kor", label_en: "-kor and other invariable suffixes", level: "A2",
        rule_en: "'-kor' (at a point in time) never harmonises: ötkor, hatkor, karácsonykor. Neither do -ig (until) or -ért (for).",
        reason_en: "These entered the language later than the harmony system and were never absorbed into it.",
        examples: [
          { tokens: [["Ötkor","adv"],["találkozunk","vfin"]], en: "We're meeting at five" },
          { tokens: [["Karácsonykor","adv"],["hazamegyek","vfin"]], en: "I'm going home at Christmas" }
        ], links: ["hu_vh_basic"] },
      { id: "hu_dates", label_en: "dates and days", level: "A2",
        rule_en: "Dates run big to small: 2024. május 3. Days take -n or -án/-én: hétfőn, május harmadikán. Years take -ben: 2024-ben.",
        reason_en: "The order matches the general Hungarian pattern of putting the larger frame first, as in surname-then-given-name.",
        examples: [
          { tokens: [["hétfőn","adv"]], en: "on Monday" },
          { tokens: [["2024-ben","adv"]], en: "in 2024" },
          { tokens: [["május","adv"],["harmadikán","adv"]], en: "on the third of May" }
        ] }
    ],
    exceptions: [
      { title_en: "Hungarian names are reversed", body_en: "The family name comes first: Nagy Péter, Szabó Anna. Foreign names keep their original order.",
        examples: [ { tokens: [["Nagy","s"],["Péter","s"]], en: "Peter Nagy — surname first" } ] }
    ]
  },
  {
    id: "hu_derivation", title_en: "Word formation", blurb_en: "-ság · -ás · -i · -talan", color: "rose",
    nodes: [
      { id: "hu_deriv_noun", label_en: "-ság / -ség and -ás / -és", level: "B1",
        rule_en: "'-ság/-ség' turns an adjective into an abstract noun (szép → szépség, barát → barátság). '-ás/-és' turns a verb into the name of the action (olvas → olvasás, épít → építés).",
        reason_en: "Two highly regular suffixes generate a large part of the vocabulary, so recognising them unlocks many words at once.",
        examples: [
          { tokens: [["szépség","s"]], en: "beauty ← szép (beautiful)" },
          { tokens: [["olvasás","s"]], en: "reading ← olvas (to read)" },
          { tokens: [["barátság","s"]], en: "friendship ← barát (friend)" }
        ] },
      { id: "hu_deriv_adj", label_en: "-i, -s, -talan / -telen", level: "B1",
        rule_en: "'-i' makes a relational adjective (Budapest → budapesti, ma → mai). '-s' means 'having' (só → sós, pénz → pénzes). '-talan/-telen' means 'without' (boldog → boldogtalan, víz → víztelen).",
        reason_en: "These correspond to English -ish/-al, -y and -less, and are just as productive.",
        examples: [
          { tokens: [["budapesti","adj"]], en: "from Budapest" },
          { tokens: [["sós","adj"]], en: "salty ← só (salt)" },
          { tokens: [["boldogtalan","adj"]], en: "unhappy ← boldog (happy)" }
        ] },
      { id: "hu_adverb_form", label_en: "making adverbs", level: "A2",
        rule_en: "'-n / -an / -en' turns an adjective into an adverb of manner (gyors → gyorsan, szép → szépen). '-ul / -ül' is used for languages and some manners (magyar → magyarul, rossz → rosszul).",
        reason_en: "The -ul/-ül ending originally meant 'in the manner of', which is why it survives for languages.",
        examples: [
          { tokens: [["Gyorsan","adv"],["beszél","vfin"]], en: "He speaks quickly" },
          { tokens: [["Magyarul","adv"],["tanulok","vfin"]], en: "I'm learning Hungarian" }
        ] }
    ],
    exceptions: [
      { title_en: "Compounds are written as one word", body_en: "Hungarian joins compounds solidly: vasútállomás (railway station), lakóhely, munkahely. If the result exceeds six syllables and three parts, a hyphen is used.",
        examples: [ { tokens: [["vasútállomás","s"]], en: "railway station = vas + út + állomás" } ] }
    ]
  }
];
