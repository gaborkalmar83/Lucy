// Hungarian grammar map. Same shape as the Dutch data: clusters → nodes.
// Example `en` fields are English translations of the Hungarian sentence.
window.GRAM_HU = [
  {
    id: "hu_harmony", title_en: "Vowel harmony", blurb_en: "the rule behind every suffix", color: "amber",
    nodes: [
      { id: "hu_vh_basic", label_en: "back vs front words", level: "A1",
        rule_en: "Every vowel is back (a á o ó u ú) or front (e é i í ö ő ü ű). A word takes suffixes matching its own vowels: back words take back suffixes, front words take front ones. Almost every Hungarian suffix has two or three forms.",
        reason_en: "Harmony keeps a word pronounceable as one unit — the tongue stays in roughly one position instead of jumping front to back mid-word.",
        examples: [
          { tokens: [["ház","o"],["ban","part"]], en: "in the house — back word → -ban" },
          { tokens: [["kert","o"],["ben","part"]], en: "in the garden — front word → -ben" },
          { tokens: [["asztal","o"],["on","part"]], en: "on the table — back → -on" },
          { tokens: [["szék","o"],["en","part"]], en: "on the chair — front → -en" }
        ], links: ["hu_vh_three"] },
      { id: "hu_vh_three", label_en: "three-way suffixes", level: "A1",
        rule_en: "Some suffixes have a third form for front rounded vowels (ö ő ü ű): -on / -en / -ön, -hoz / -hez / -höz, -ok / -ek / -ök.",
        reason_en: "Lip rounding is copied too, not just tongue position, so the suffix vowel matches the last vowel as closely as possible.",
        examples: [
          { tokens: [["föld","o"],["ön","part"]], en: "on the ground — front rounded → -ön" },
          { tokens: [["könyv","o"],["höz","part"]], en: "to the book → -höz" },
          { tokens: [["ül","vfin"],["ök","part"]], en: "I sit → -ök" }
        ], links: ["hu_vh_basic"] },
      { id: "hu_vh_mixed", label_en: "mixed and neutral vowels", level: "A2",
        rule_en: "i, í and é are neutral: they can sit in back words without changing the harmony (híd → hídon). In mixed words the LAST non-neutral vowel usually decides.",
        reason_en: "The front unrounded vowels are articulatorily 'light' and historically did not force harmony.",
        examples: [
          { tokens: [["híd","o"],["on","part"]], en: "on the bridge — back suffix despite í" },
          { tokens: [["papír","o"],["on","part"]], en: "on the paper — last real vowel is back" }
        ] }
    ],
    exceptions: [
      { title_en: "Loanwords and a few natives break it", body_en: "Some words take front suffixes despite back vowels (e.g. férfi → férfinak is regular, but hotel → hotelben). A handful vary in usage; when in doubt follow the last vowel.",
        examples: [ { tokens: [["hotel","o"],["ben","part"]], en: "in the hotel" } ] }
    ]
  },
  {
    id: "hu_articles", title_en: "Articles", blurb_en: "a · az · egy", color: "indigo",
    nodes: [
      { id: "hu_a_az", label_en: "a vs az", level: "A1",
        rule_en: "The definite article is 'a' before a consonant and 'az' before a vowel. It never changes for gender or number — Hungarian has no grammatical gender at all.",
        reason_en: "Purely phonetic, exactly like English a/an: 'az' keeps two vowels from colliding.",
        examples: [
          { tokens: [["a","art"],["ház","o"]], en: "the house" },
          { tokens: [["az","art"],["ablak","o"]], en: "the window" },
          { tokens: [["a","art"],["házak","o"]], en: "the houses — same article in plural" }
        ], links: ["hu_def_conj"] },
      { id: "hu_egy", label_en: "egy (indefinite)", level: "A1",
        rule_en: "'egy' means both 'one' and 'a/an'. It is used far less than English 'a' — Hungarian often uses a bare noun where English needs an article.",
        reason_en: "The indefinite article grew out of the numeral 'one' and never became obligatory.",
        examples: [
          { tokens: [["egy","art"],["könyv","o"]], en: "a book / one book" },
          { tokens: [["Orvos","o"],["vagyok","vfin"]], en: "I am a doctor — no article in Hungarian" }
        ] },
      { id: "hu_art_names", label_en: "article with names and abstractions", level: "A2",
        rule_en: "Hungarian uses the definite article where English drops it: with abstract nouns, general statements, and often with personal names in colloquial speech.",
        reason_en: "The article marks definiteness of the concept, not just of a specific object.",
        examples: [
          { tokens: [["A","art"],["kutyák","s"],["hűségesek","adj"]], en: "Dogs are loyal — general truth takes 'a'" },
          { tokens: [["Szeretem","vfin"],["a","art"],["zenét","o"]], en: "I love music" }
        ] }
    ]
  },
  {
    id: "hu_cases_core", title_en: "Core cases", blurb_en: "-t · -nak/-nek · -val/-vel", color: "teal",
    nodes: [
      { id: "hu_acc", label_en: "accusative -t", level: "A1",
        rule_en: "The direct object takes -t, often with a linking vowel: -ot / -et / -öt / -at. Hungarian has no fixed word order, so this ending is what marks 'who does what to whom'.",
        reason_en: "Case endings carry the grammatical roles, which is exactly why word order is free to express emphasis instead.",
        examples: [
          { tokens: [["Kérek","vfin"],["egy","art"],["kávét","o"]], en: "I'd like a coffee" },
          { tokens: [["Látom","vfin"],["a","art"],["házat","o"]], en: "I see the house" },
          { tokens: [["A","art"],["könyvet","o"],["olvasom","vfin"]], en: "I'm reading the book — object fronted, -t still marks it" }
        ], links: ["hu_word_order", "hu_def_conj"] },
      { id: "hu_dat", label_en: "dative -nak / -nek", level: "A1",
        rule_en: "The indirect object ('to/for someone') takes -nak / -nek. It is also used for the possessor and after many adjectives.",
        reason_en: "One ending covers recipient, beneficiary and possessor because all three are 'the person the action points at'.",
        examples: [
          { tokens: [["Adok","vfin"],["Péternek","io"],["egy","art"],["könyvet","o"]], en: "I give Peter a book" },
          { tokens: [["Nekem","io"],["tetszik","vfin"]], en: "I like it (lit. it pleases to me)" }
        ], links: ["hu_have"] },
      { id: "hu_ins", label_en: "instrumental -val / -vel", level: "A2",
        rule_en: "'with' is the ending -val / -vel. After a consonant the v assimilates to it and doubles: busz + val → busszal, kés + vel → késsel.",
        reason_en: "The assimilation is ancient and completely regular — the v simply copies the preceding consonant.",
        examples: [
          { tokens: [["Busszal","adv"],["megyek","vfin"]], en: "I go by bus" },
          { tokens: [["Késsel","adv"],["vágom","vfin"]], en: "I cut it with a knife" },
          { tokens: [["Annával","adv"],["beszélek","vfin"]], en: "I'm speaking with Anna" }
        ] },
      { id: "hu_other_core", label_en: "-ért · -ig · -ként · -vá/-vé", level: "B1",
        rule_en: "-ért = for/for the sake of; -ig = until/as far as; -ként = as (in the role of); -vá / -vé = into (becoming something).",
        reason_en: "Hungarian marks with endings much of what English marks with prepositions.",
        examples: [
          { tokens: [["Érted","adv"],["csinálom","vfin"]], en: "I'm doing it for you" },
          { tokens: [["Hatig","adv"],["dolgozom","vfin"]], en: "I work until six" },
          { tokens: [["Tanárként","adv"],["dolgozik","vfin"]], en: "He works as a teacher" }
        ] }
    ],
    exceptions: [
      { title_en: "Pronouns take irregular case forms", body_en: "Personal pronouns do not simply add endings — each case has its own set: engem/téged/őt (accusative), nekem/neked/neki (dative), velem/veled/vele (instrumental). These must be memorised.",
        examples: [ { tokens: [["Engem","o"],["kérdezett","vfin"]], en: "He asked me" }, { tokens: [["Velem","adv"],["jössz","vfin"]], en: "Are you coming with me?" } ] }
    ]
  },
  {
    id: "hu_cases_place", title_en: "Place cases", blurb_en: "in · on · at × into · onto · to × from", color: "rose",
    nodes: [
      { id: "hu_place_system", label_en: "the 3 × 3 system", level: "A1",
        rule_en: "Nine endings form a grid: three positions (inside / on the surface / nearby) × three directions (where to / where at / where from).",
        reason_en: "Hungarian encodes precisely what English leaves vague: 'to the doctor' vs 'into the house' vs 'onto the table' are three different endings.",
        examples: [
          { tokens: [["házba","adv"]], en: "into the house (-ba/-be)" },
          { tokens: [["házban","adv"]], en: "in the house (-ban/-ben)" },
          { tokens: [["házból","adv"]], en: "out of the house (-ból/-ből)" }
        ], links: ["hu_place_in", "hu_place_on", "hu_place_at"] },
      { id: "hu_place_in", label_en: "inside: -ba/-be · -ban/-ben · -ból/-ből", level: "A1",
        rule_en: "Use the 'inside' set for enclosed spaces: -ba/-be (into), -ban/-ben (in), -ból/-ből (out of).",
        reason_en: "The final consonant marks direction: -b- into, -n stays, -l out of. The same pattern repeats in all three sets.",
        examples: [
          { tokens: [["A","art"],["szobában","adv"],["vagyok","vfin"]], en: "I'm in the room" },
          { tokens: [["A","art"],["szobába","adv"],["megyek","vfin"]], en: "I'm going into the room" },
          { tokens: [["A","art"],["szobából","adv"],["jövök","vfin"]], en: "I'm coming out of the room" }
        ] },
      { id: "hu_place_on", label_en: "surface: -ra/-re · -on/-en/-ön · -ról/-ről", level: "A1",
        rule_en: "Use the 'surface' set for things you are on: -ra/-re (onto), -on/-en/-ön (on), -ról/-ről (off / about).",
        reason_en: "Same directional logic. -ról/-ről doubles as 'about' a topic, as in English 'speak on a subject'.",
        examples: [
          { tokens: [["Az","art"],["asztalon","adv"],["van","vfin"]], en: "It's on the table" },
          { tokens: [["Az","art"],["asztalra","adv"],["teszem","vfin"]], en: "I put it onto the table" },
          { tokens: [["Erről","adv"],["beszélünk","vfin"]], en: "We're talking about this" }
        ] },
      { id: "hu_place_at", label_en: "nearby: -hoz/-hez/-höz · -nál/-nél · -tól/-től", level: "A2",
        rule_en: "Use the 'nearby' set for being at or near someone or something, especially people: -hoz/-hez/-höz (to), -nál/-nél (at), -tól/-től (from).",
        reason_en: "You are never 'inside' a person, so people almost always take this third set.",
        examples: [
          { tokens: [["Az","art"],["orvoshoz","adv"],["megyek","vfin"]], en: "I'm going to the doctor" },
          { tokens: [["Péternél","adv"],["vagyok","vfin"]], en: "I'm at Peter's place" },
          { tokens: [["Tőle","adv"],["kaptam","vfin"]], en: "I got it from him" }
        ] },
      { id: "hu_place_cities", label_en: "Hungarian towns take -on/-en", level: "B1",
        rule_en: "Most Hungarian place names take the surface set (Budapesten, Pécsett), while foreign cities take the inside set (Londonban, Bécsben).",
        reason_en: "A historical convention: settlements on the plain were conceived as surfaces, foreign cities were learned later with the default 'inside' ending.",
        examples: [
          { tokens: [["Budapesten","adv"],["lakom","vfin"]], en: "I live in Budapest" },
          { tokens: [["Londonban","adv"],["lakom","vfin"]], en: "I live in London" }
        ] }
    ],
    exceptions: [
      { title_en: "Szegeden, Győrött, Pécsett", body_en: "A few towns keep archaic locative endings (-ott/-ett/-ött) alongside the regular form. Both are heard; the regular -on/-en form is always safe.",
        examples: [ { tokens: [["Pécsett","adv"]], en: "in Pécs (archaic locative)" } ] }
    ]
  },
  {
    id: "hu_possession", title_en: "Possession", blurb_en: "no 'have' verb", color: "amber",
    nodes: [
      { id: "hu_poss_suffix", label_en: "possessive endings", level: "A1",
        rule_en: "Possession is marked on the thing owned, not the owner: ház → házam (my house), házad (your house), háza (his/her house), házunk, házatok, házuk.",
        reason_en: "Hungarian is agglutinative — relationships attach to the noun instead of needing a separate possessive word.",
        examples: [
          { tokens: [["a","art"],["házam","o"]], en: "my house" },
          { tokens: [["a","art"],["barátod","o"]], en: "your friend" },
          { tokens: [["a","art"],["könyvünk","o"]], en: "our book" }
        ], links: ["hu_have"] },
      { id: "hu_have", label_en: "'to have' = van + dative", level: "A1",
        rule_en: "There is no verb 'to have'. You say 'to me there is a…': Nekem van egy kutyám. The possessor takes the dative and the thing takes a possessive ending.",
        reason_en: "Existence plus a recipient covers the same ground, so no separate verb ever developed.",
        examples: [
          { tokens: [["Nekem","io"],["van","vfin"],["egy","art"],["kutyám","s"]], en: "I have a dog" },
          { tokens: [["Van","vfin"],["időd","s"]], en: "Do you have time?" },
          { tokens: [["Nincs","neg"],["pénzem","s"]], en: "I have no money" }
        ], links: ["hu_nincs"] },
      { id: "hu_poss_of", label_en: "X's Y — the -nak/-nek construction", level: "A2",
        rule_en: "'Peter's house' = Péter háza, or with the dative for emphasis or clarity: Péternek a háza. The possessed noun always carries the 3rd-person ending.",
        reason_en: "The possessive ending already signals the link, so the dative on the owner is optional except when the phrase would be ambiguous.",
        examples: [
          { tokens: [["Péter","s"],["háza","o"]], en: "Peter's house" },
          { tokens: [["a","art"],["ház","s"],["ablaka","o"]], en: "the window of the house" }
        ] }
    ]
  },
  {
    id: "hu_nouns", title_en: "Nouns & plurals", blurb_en: "-k · numerals", color: "indigo",
    nodes: [
      { id: "hu_plural", label_en: "plural -k", level: "A1",
        rule_en: "The plural is -k, usually with a linking vowel: ház → házak, kert → kertek, könyv → könyvek, autó → autók.",
        reason_en: "The linking vowel exists to avoid impossible consonant clusters and follows vowel harmony.",
        examples: [
          { tokens: [["házak","s"]], en: "houses" },
          { tokens: [["emberek","s"]], en: "people" },
          { tokens: [["autók","s"]], en: "cars" }
        ], links: ["hu_no_plural_num"] },
      { id: "hu_no_plural_num", label_en: "no plural after numbers", level: "A1",
        rule_en: "After a numeral or a quantity word the noun stays singular: két könyv (two book), sok ember (many person), néhány év.",
        reason_en: "The number already expresses plurality, so marking it twice is redundant.",
        examples: [
          { tokens: [["két","adj"],["könyv","o"]], en: "two books" },
          { tokens: [["sok","adj"],["ember","s"]], en: "many people" },
          { tokens: [["minden","adj"],["nap","adv"]], en: "every day" }
        ] },
      { id: "hu_no_gender", label_en: "no gender, no 'he/she'", level: "A1",
        rule_en: "Hungarian has no grammatical gender. The pronoun 'ő' means both he and she, and adjectives never agree with nouns.",
        reason_en: "Uralic languages never developed gender; context supplies it.",
        examples: [
          { tokens: [["Ő","s"],["orvos","o"]], en: "He/She is a doctor" },
          { tokens: [["a","art"],["nagy","adj"],["házak","s"]], en: "the big houses — adjective unchanged" }
        ] }
    ],
    exceptions: [
      { title_en: "Stem changes in the plural", body_en: "Some nouns shorten or change their stem vowel before endings: kéz → kezek (hand), víz → vizek (water), ló → lovak (horse), tó → tavak (lake). These are frequent everyday words, so they are worth learning individually.",
        examples: [ { tokens: [["kezek","s"]], en: "hands" }, { tokens: [["lovak","s"]], en: "horses" } ] }
    ]
  },
  {
    id: "hu_verbs_present", title_en: "Verbs — present", blurb_en: "the definite/indefinite split", color: "rose",
    nodes: [
      { id: "hu_indef_conj", label_en: "indefinite conjugation", level: "A1",
        rule_en: "Used when there is no object, or the object is indefinite. Endings: -ok/-ek/-ök, -sz, –, -unk/-ünk, -tok/-tek/-tök, -nak/-nek.",
        reason_en: "This is the default set; the definite set exists alongside it to mark a known object.",
        examples: [
          { tokens: [["Olvasok","vfin"],["egy","art"],["könyvet","o"]], en: "I'm reading a book (indefinite object)" },
          { tokens: [["Beszélsz","vfin"],["magyarul","adv"]], en: "You speak Hungarian" },
          { tokens: [["Futunk","vfin"]], en: "We run" }
        ], links: ["hu_def_conj"] },
      { id: "hu_def_conj", label_en: "definite conjugation", level: "A1",
        rule_en: "A second full set of endings is used when the object is definite: -om/-em/-öm, -od/-ed/-öd, -ja/-i, -juk/-jük, -játok/-itek, -ják/-ik. Compare olvasok (I read something) with olvasom (I read it).",
        reason_en: "The verb itself tells you whether the object is known, which is one reason Hungarian can drop pronouns and reorder freely.",
        examples: [
          { tokens: [["Olvasom","vfin"],["a","art"],["könyvet","o"]], en: "I'm reading the book" },
          { tokens: [["Látod","vfin"],["őt","o"]], en: "Do you see him/her?" },
          { tokens: [["Kérem","vfin"],["a","art"],["számlát","o"]], en: "I'd like the bill" }
        ], links: ["hu_def_when"] },
      { id: "hu_def_when", label_en: "when is an object definite?", level: "A2",
        rule_en: "Definite = with 'a/az', a proper name, a possessive form, a demonstrative, the pronouns őt/őket, or a clause introduced by 'azt, hogy'. Indefinite = 'egy', a bare noun, or engem/téged/minket/titeket.",
        reason_en: "The test is whether both speakers can identify the object, not whether it is grammatically third person.",
        examples: [
          { tokens: [["Látom","vfin"],["Pétert","o"]], en: "I see Peter — proper name → definite" },
          { tokens: [["Látok","vfin"],["egy","art"],["embert","o"]], en: "I see a man — indefinite" },
          { tokens: [["Tudom","vfin"],[",","x"],["hogy","conn"],["jössz","vfin"]], en: "I know that you're coming — clause → definite" }
        ] },
      { id: "hu_lak_ik", label_en: "-ik verbs", level: "A2",
        rule_en: "A group of verbs ends in -ik in the 3rd person singular: lakik, dolgozik, eszik, alszik. In careful speech their 1st person singular takes -om/-em/-öm even when indefinite.",
        reason_en: "Historically these were reflexive or middle-voice verbs; the ending survived as a class marker.",
        examples: [
          { tokens: [["Ő","s"],["Budapesten","adv"],["lakik","vfin"]], en: "He lives in Budapest" },
          { tokens: [["Dolgozom","vfin"]], en: "I work (careful form of dolgozok)" }
        ] },
      { id: "hu_van_omit", label_en: "'van' is dropped", level: "A1",
        rule_en: "In the 3rd person present, 'van/vannak' is omitted before a noun or adjective predicate: Ő orvos. A ház nagy. But it stays for location and existence: Itt van.",
        reason_en: "Simple identification needs no verb; only existence and position do.",
        examples: [
          { tokens: [["Ő","s"],["orvos","o"]], en: "He is a doctor — no verb" },
          { tokens: [["A","art"],["ház","s"],["nagy","adj"]], en: "The house is big" },
          { tokens: [["Itt","adv"],["van","vfin"]], en: "It's here — location keeps van" }
        ] }
    ],
    exceptions: [
      { title_en: "-lak/-lek: 'I … you'", body_en: "A unique ending covers a 1st-person subject acting on a 2nd-person object: Szeretlek (I love you), Látlak (I see you). No pronoun is needed.",
        examples: [ { tokens: [["Szeretlek","vfin"]], en: "I love you" } ] },
      { title_en: "Irregular but essential", body_en: "van (to be), megy (to go), jön (to come), eszik (to eat), iszik (to drink), tesz, vesz, hisz, visz are irregular and extremely common. Learn them as whole paradigms.",
        examples: [ { tokens: [["vagyok","vfin"]], en: "I am" }, { tokens: [["megyek","vfin"]], en: "I go" } ] }
    ]
  },
  {
    id: "hu_verbs_tense", title_en: "Past, future, mood", blurb_en: "-t · fog · -na/-ne · -j", color: "teal",
    nodes: [
      { id: "hu_past", label_en: "past tense -t / -tt", level: "A1",
        rule_en: "Hungarian has one past tense, formed with -t/-tt plus personal endings: olvastam, olvastál, olvasott, olvastunk, olvastatok, olvastak. Definite forms exist too: olvastam a könyvet.",
        reason_en: "The older past tenses died out; context and adverbs carry the finer distinctions English splits across several tenses.",
        examples: [
          { tokens: [["Tegnap","adv"],["olvastam","vfin"]], en: "I read yesterday" },
          { tokens: [["Megettem","vfin"],["a","art"],["almát","o"]], en: "I ate the apple" }
        ], links: ["hu_indef_conj"] },
      { id: "hu_future", label_en: "future with fog", level: "A1",
        rule_en: "The future is 'fog' conjugated plus the infinitive: fogok menni. Very often the plain present is used instead, with a time word doing the work: Holnap megyek.",
        reason_en: "The present already covers scheduled future, so the fog-form is reserved for emphasis or genuine prediction.",
        examples: [
          { tokens: [["Holnap","adv"],["megyek","vfin"]], en: "I'm going tomorrow — present used for future" },
          { tokens: [["Fogok","vfin"],["tanulni","vinf"]], en: "I will study" }
        ] },
      { id: "hu_cond", label_en: "conditional -na / -ne / -ná / -né", level: "A2",
        rule_en: "The conditional inserts -na/-ne (indefinite) or -ná/-né (definite) before the endings: mennék (I would go), olvasnám (I would read it). The past conditional adds 'volna'.",
        reason_en: "A single mood marker covers 'would', 'could' and polite requests.",
        examples: [
          { tokens: [["Elmennék","vfin"]], en: "I would go" },
          { tokens: [["Kérnék","vfin"],["egy","art"],["kávét","o"]], en: "I would like a coffee — polite" },
          { tokens: [["Elmentem","vfin"],["volna","part"]], en: "I would have gone" }
        ] },
      { id: "hu_imp", label_en: "imperative / subjunctive -j", level: "B1",
        rule_en: "The -j suffix forms both commands and subjunctive clauses after 'hogy': Olvass! (Read!), Azt akarom, hogy olvass. The j assimilates to a preceding s, sz, z: olvas + j → olvass.",
        reason_en: "Hungarian makes no split between 'command' and 'that you should…' — one mood serves both.",
        examples: [
          { tokens: [["Gyere","vfin"],["ide","adv"]], en: "Come here!" },
          { tokens: [["Azt","o"],["akarom","vfin"],[",","x"],["hogy","conn"],["maradj","vfin"]], en: "I want you to stay" }
        ] },
      { id: "hu_inf", label_en: "infinitive -ni", level: "A1",
        rule_en: "The infinitive ends in -ni: olvasni, menni, enni. It can take personal endings after certain words: Nekem el kell mennem (I have to go).",
        reason_en: "The personal infinitive lets an impersonal expression like 'kell' still say who is meant.",
        examples: [
          { tokens: [["Szeretek","vfin"],["olvasni","vinf"]], en: "I like to read" },
          { tokens: [["El","part"],["kell","vfin"],["mennem","vinf"]], en: "I have to go" }
        ] }
    ]
  },
  {
    id: "hu_prefix", title_en: "Verbal prefixes", blurb_en: "meg- · el- · ki- · be- · fel- · le-", color: "amber",
    nodes: [
      { id: "hu_prefix_basic", label_en: "what prefixes do", level: "A2",
        rule_en: "Prefixes change direction or completeness: ír (write) → megír (write it fully), megy (go) → elmegy (go away), jön → bejön (come in). 'meg-' most often marks a completed action.",
        reason_en: "They are the closest thing Hungarian has to aspect: meg- turns an ongoing activity into a finished one.",
        examples: [
          { tokens: [["Megírtam","vfin"],["a","art"],["levelet","o"]], en: "I wrote the letter (finished it)" },
          { tokens: [["Kimegyek","vfin"]], en: "I go out" },
          { tokens: [["Feláll","vfin"]], en: "He stands up" }
        ], links: ["hu_prefix_split"] },
      { id: "hu_prefix_split", label_en: "when the prefix detaches", level: "B1",
        rule_en: "The prefix jumps behind the verb whenever something else is in focus, in negation, and in questions with a question word: Elmegyek → Nem megyek el. Mikor mész el?",
        reason_en: "The position immediately before the verb is the focus slot. Anything moved into it pushes the prefix out.",
        examples: [
          { tokens: [["Elmegyek","vfin"]], en: "I'm leaving — neutral" },
          { tokens: [["Nem","neg"],["megyek","vfin"],["el","part"]], en: "I'm not leaving — negation splits it" },
          { tokens: [["Mikor","q"],["mész","vfin"],["el","part"]], en: "When are you leaving?" }
        ], links: ["hu_word_order"] }
    ],
    exceptions: [
      { title_en: "The prefix can change the meaning completely", body_en: "néz (look) → kinéz (look out / look like), ért (understand) → egyetért (agree), áll (stand) → kiáll (stand up for). Treat prefixed verbs as separate vocabulary, much like English phrasal verbs.",
        examples: [ { tokens: [["Jól","adv"],["kinézel","vfin"]], en: "You look good" } ] }
    ]
  },
  {
    id: "hu_order", title_en: "Word order & focus", blurb_en: "emphasis, not position", color: "indigo",
    nodes: [
      { id: "hu_word_order", label_en: "the focus position", level: "A2",
        rule_en: "Word order is not free — it is meaningful. The slot directly before the verb carries the emphasis. Moving a word there is how Hungarian does what English does with stress or cleft sentences.",
        reason_en: "Because case endings already mark grammatical roles, position was left free to encode information structure instead.",
        examples: [
          { tokens: [["Péter","s"],["olvassa","vfin"],["a","art"],["könyvet","o"]], en: "PETER is reading the book (it's Peter, not someone else)" },
          { tokens: [["A","art"],["könyvet","o"],["olvassa","vfin"],["Péter","s"]], en: "It's THE BOOK Peter is reading" },
          { tokens: [["Péter","s"],["a","art"],["könyvet","o"],["olvassa","vfin"]], en: "Peter is reading THE BOOK" }
        ], links: ["hu_prefix_split", "hu_neg"] },
      { id: "hu_neg", label_en: "negation with nem", level: "A1",
        rule_en: "'nem' goes immediately before the word being negated — usually the verb, but not always: Nem Péter jött (It wasn't Peter who came).",
        reason_en: "Negation targets the focus slot, so its position tells you exactly what is denied.",
        examples: [
          { tokens: [["Nem","neg"],["tudom","vfin"]], en: "I don't know" },
          { tokens: [["Nem","neg"],["Péter","s"],["jött","vfin"]], en: "It wasn't Peter who came" }
        ], links: ["hu_nincs"] },
      { id: "hu_nincs", label_en: "nincs / nincsenek", level: "A1",
        rule_en: "'nem van' is never said. Use 'nincs' (there isn't) and 'nincsenek' (there aren't). Likewise 'sincs' for 'isn't … either'.",
        reason_en: "The negative fused with the verb long ago, exactly as English 'is not' contracts to 'isn't'.",
        examples: [
          { tokens: [["Nincs","neg"],["idő","s"]], en: "There's no time" },
          { tokens: [["Nincsenek","neg"],["itthon","adv"]], en: "They're not at home" }
        ] },
      { id: "hu_double_neg", label_en: "double negation is required", level: "A2",
        rule_en: "Negative words demand 'nem' as well: Senki nem jött (Nobody came), Soha nem láttam. Leaving out 'nem' is ungrammatical.",
        reason_en: "Hungarian uses negative concord — every negative element agrees, rather than cancelling out.",
        examples: [
          { tokens: [["Senki","s"],["nem","neg"],["jött","vfin"]], en: "Nobody came" },
          { tokens: [["Soha","adv"],["nem","neg"],["láttam","vfin"]], en: "I have never seen it" }
        ] },
      { id: "hu_question", label_en: "yes/no questions", level: "A1",
        rule_en: "Word order does not change in a yes/no question — intonation does, rising on the second-to-last syllable. In writing only the question mark shows it. '-e' can be attached in indirect questions.",
        reason_en: "With free word order there is no inversion available, so intonation carries the load.",
        examples: [
          { tokens: [["Beszélsz","vfin"],["magyarul","adv"]], en: "Do you speak Hungarian?" },
          { tokens: [["Nem","neg"],["tudom","vfin"],[",","x"],["hogy","conn"],["jön","vfin"],["-e","part"]], en: "I don't know whether he's coming" }
        ] }
    ]
  },
  {
    id: "hu_adj", title_en: "Adjectives & postpositions", blurb_en: "-bb · leg- · után, előtt", color: "rose",
    nodes: [
      { id: "hu_adj_agree", label_en: "attributive vs predicative", level: "A1",
        rule_en: "Before a noun the adjective never changes: a nagy házak. After 'to be' it takes the plural: A házak nagyok.",
        reason_en: "Only a predicate agrees with its subject; an attribute sits inside the noun phrase and needs no marking.",
        examples: [
          { tokens: [["a","art"],["nagy","adj"],["házak","s"]], en: "the big houses" },
          { tokens: [["A","art"],["házak","s"],["nagyok","adj"]], en: "The houses are big" }
        ] },
      { id: "hu_compare", label_en: "comparative -bb, superlative leg-", level: "A1",
        rule_en: "Add -bb for the comparative and leg- … -bb for the superlative: nagy → nagyobb → legnagyobb. 'than' is 'mint', or the ablative: nagyobb nálam.",
        reason_en: "One suffix and one prefix cover the whole system, with no irregular forms beyond a handful.",
        examples: [
          { tokens: [["Ez","s"],["nagyobb","adj"]], en: "This is bigger" },
          { tokens: [["a","art"],["legnagyobb","adj"],["ház","s"]], en: "the biggest house" },
          { tokens: [["Magasabb","adj"],["nálam","adv"]], en: "He's taller than me" }
        ] },
      { id: "hu_postpos", label_en: "postpositions, not prepositions", level: "A2",
        rule_en: "Words like után (after), előtt (before), alatt (under), mellett (next to), között (between), nélkül (without) come AFTER the noun: a ház mögött.",
        reason_en: "Hungarian is consistently head-final — the relational word follows what it relates to, just as the case endings do.",
        examples: [
          { tokens: [["a","art"],["ház","o"],["mögött","prep"]], en: "behind the house" },
          { tokens: [["ebéd","o"],["után","prep"]], en: "after lunch" },
          { tokens: [["pénz","o"],["nélkül","prep"]], en: "without money" }
        ] }
    ],
    exceptions: [
      { title_en: "A few irregular comparatives", body_en: "jó → jobb (good → better), sok → több (much → more), kevés → kevesebb, kicsi → kisebb, szép → szebb, nehéz → nehezebb.",
        examples: [ { tokens: [["jobb","adj"]], en: "better" }, { tokens: [["több","adj"]], en: "more" } ] }
    ]
  }
];
