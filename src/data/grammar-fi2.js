// Finnish grammar map — part 2: verb types, negation, tenses, conditional,
// imperative, passive, infinitives, participles, comparison, sentence patterns.
window.GRAM_FI2 = [
  {
    id: "fi_verbtypes", title_en: "The six verb types", blurb_en: "puhua · juoda · tulla · haluta · tarvita · vanheta", color: "rose",
    nodes: [
      { id: "fi_verb_t1", label_en: "type 1 — two vowels (puhua)", level: "A1",
        rule_en: "The biggest group. Drop the final -a/-ä and add the personal ending: puhua → puhu- → puhun, puhut, puhuu, puhumme, puhutte, puhuvat. Consonant gradation applies: ottaa → otan, lukea → luen.",
        reason_en: "Type 1 covers most Finnish verbs, so its pattern is the default your ear should expect. The other five types differ only in how you reach the stem.",
        examples: [
          { tokens: [["Puhun","vfin"],["suomea","o"]], en: "I speak Finnish" },
          { tokens: [["Hän","s"],["puhuu","vfin"],["suomea","o"]], en: "3rd person lengthens the vowel" },
          { tokens: [["Otan","vfin"],["kahvia","o"]], en: "ottaa → otan, tt → t" }
        ], links: ["fi_present_endings", "fi_grad_quant"] },
      { id: "fi_verb_t2_t3", label_en: "types 2 and 3 — juoda, tulla", level: "A1",
        rule_en: "Type 2 ends in -da/-dä: drop it (juoda → juon, syödä → syön, saada → saan). Type 3 ends in -la/-lä, -na/-nä, -ra/-rä, -sta/-stä: drop the last two letters and add -e- (tulla → tulen, mennä → menen, olla → olen, nousta → nousen).",
        reason_en: "That inserted -e- in type 3 is what makes 'tulen' look so unlike 'tulla'. Recognising the type tells you instantly where the extra vowel came from.",
        examples: [
          { tokens: [["Juon","vfin"],["kahvia","o"]], en: "type 2 — juoda" },
          { tokens: [["Tulen","vfin"],["huomenna","adv"]], en: "type 3 — tulla, stem tule-" },
          { tokens: [["Menemme","vfin"],["kotiin","adv"]], en: "mennä → mene-" }
        ] },
      { id: "fi_verb_t4", label_en: "types 4, 5 and 6", level: "A2",
        rule_en: "Type 4 (-ata/-ätä, -ota, -uta): drop -ta/-tä, add -a-/-ä- → haluta → haluan, tavata → tapaan. Type 5 (-ita/-itä): drop -ta, add -tse- → tarvita → tarvitsen, valita → valitsen. Type 6 (-eta/-etä): drop -ta, add -ne- → vanheta → vanhenen, paeta → pakenen.",
        reason_en: "All three show INVERSE gradation — weak in the infinitive, strong in the present — because it is the -ta/-tä ending that closes the syllable.",
        examples: [
          { tokens: [["Haluan","vfin"],["kahvia","o"]], en: "type 4 — haluta" },
          { tokens: [["Tapaan","vfin"],["hänet","o"]], en: "tavata → tapaan, v → p" },
          { tokens: [["Tarvitsen","vfin"],["apua","o"]], en: "type 5 — tarvita" }
        ], links: ["fi_grad_inverse"] },
      { id: "fi_present_endings", label_en: "the personal endings", level: "A1",
        rule_en: "-n, -t, (lengthen the final vowel), -mme, -tte, -vat/-vät. The third person singular has no ending of its own: it doubles the stem vowel (puhuu, tulee, haluaa) — or adds nothing if the stem already ends in a long vowel (saa, juo, syö).",
        reason_en: "Because the endings identify the person, Finnish drops minä and sinä freely. The pronoun only reappears for contrast or emphasis.",
        examples: [
          { tokens: [["Puhut","vfin"],["hyvin","adv"]], en: "you speak well" },
          { tokens: [["He","s"],["puhuvat","vfin"],["suomea","o"]], en: "they speak Finnish" },
          { tokens: [["Hän","s"],["saa","vfin"],["kirjan","o"]], en: "long vowel already → nothing added" }
        ] }
    ],
    exceptions: [
      { title_en: "olla, tehdä and nähdä", body_en: "olla: olen, olet, on, olemme, olette, ovat — note 'on' and 'ovat'. tehdä → teen, teet, tekee; nähdä → näen, näet, näkee. These three are worth learning as separate items.",
        examples: [
          { tokens: [["Hän","s"],["on","vfin"],["kotona","adv"]], en: "he/she is at home" },
          { tokens: [["Teen","vfin"],["työtä","o"]], en: "I'm working — tehdä" }
        ] },
      { title_en: "The third person plural is often replaced", body_en: "In speech, 'he puhuvat' becomes 'ne puhuu' — the singular verb with the plural pronoun. Very common, entirely non-standard in writing.",
        examples: [ { tokens: [["Ne","s"],["puhuu","vfin"],["suomea","o"]], en: "spoken form" } ] }
    ]
  },
  {
    id: "fi_negation", title_en: "Negation", blurb_en: "en · et · ei · emme · ette · eivät", color: "amber",
    nodes: [
      { id: "fi_neg_present", label_en: "the negative verb", level: "A1",
        rule_en: "Finnish negates with a VERB that conjugates: en, et, ei, emme, ette, eivät. The main verb then appears in its bare connegative form — the weak-grade stem with no ending at all: En puhu. Emme tule. He eivät ole täällä.",
        reason_en: "The person is carried by the negative word, so the main verb has nothing left to mark and strips down. This is why 'en puhun' is wrong — the ending would be duplicated.",
        examples: [
          { tokens: [["En","neg"],["puhu","vfin"],["saksaa","o"]], en: "I don't speak German" },
          { tokens: [["Hän","s"],["ei","neg"],["ole","vfin"],["täällä","adv"]], en: "He isn't here" },
          { tokens: [["Emme","neg"],["mene","vfin"],["kotiin","adv"]], en: "We're not going home" }
        ], links: ["fi_verb_t1"] },
      { id: "fi_neg_past", label_en: "negative past", level: "A2",
        rule_en: "Negative verb + the -nut/-nyt participle, which becomes -neet in the plural: en puhunut, emme puhuneet, he eivät tulleet. There is no separate negative imperfect form.",
        reason_en: "The past is expressed by the participle rather than by the negative word, which is why the negative word looks identical in present and past.",
        examples: [
          { tokens: [["En","neg"],["puhunut","vinf"]], en: "I didn't speak" },
          { tokens: [["Emme","neg"],["tulleet","vinf"]], en: "We didn't come — plural -neet" },
          { tokens: [["Hän","s"],["ei","neg"],["ollut","vinf"],["kotona","adv"]], en: "He wasn't home" }
        ], links: ["fi_nut_participle"] },
      { id: "fi_neg_object", label_en: "negation forces the partitive", level: "A2",
        rule_en: "The object of any negative sentence goes into the partitive, without exception: Ostan kirjan → En osta kirjaa. Minulla on auto → Minulla ei ole autoa.",
        reason_en: "If the action did not happen, no whole object was affected — so the partitive is the only logical case. This makes it one of the most reliable rules in Finnish.",
        examples: [
          { tokens: [["En","neg"],["osta","vfin"],["kirjaa","o"]], en: "I'm not buying the book" },
          { tokens: [["Minulla","adv"],["ei","neg"],["ole","vfin"],["autoa","s"]], en: "I don't have a car" },
          { tokens: [["En","neg"],["nähnyt","vinf"],["häntä","o"]], en: "I didn't see him" }
        ], links: ["fi_partitive_uses", "fi_object_partial"] }
    ],
    exceptions: [
      { title_en: "The negative imperative uses älä", body_en: "älä (sg) and älkää (pl) replace en/ette in commands: Älä mene! Älkää menkö! Note that the plural takes a special -ko/-kö form of the verb.",
        examples: [
          { tokens: [["Älä","neg"],["mene","vfin"]], en: "Don't go!" },
          { tokens: [["Älkää","neg"],["puhuko","vfin"]], en: "Don't speak! (plural)" }
        ] },
      { title_en: "One negative per clause", body_en: "'En nähnyt mitään' = I saw nothing. 'mitään', 'ketään', 'koskaan' and 'mihinkään' are not negatives themselves — they are the forms these words take INSIDE a negative sentence, and the 'en' is still required.",
        examples: [ { tokens: [["En","neg"],["nähnyt","vinf"],["mitään","o"]], en: "I didn't see anything" } ] }
    ]
  },
  {
    id: "fi_past", title_en: "The imperfect", blurb_en: "puhuin · tulin · olin", color: "indigo",
    nodes: [
      { id: "fi_imperfect_form", label_en: "the -i- past", level: "A1",
        rule_en: "Insert -i- between the stem and the ending: puhun → puhuin, tulen → tulin, olen → olin, menen → menin. Third person singular is the bare stem + i: puhui, tuli, oli.",
        reason_en: "This single tense covers everything English splits into 'I spoke', 'I was speaking' and 'I did speak'. Aspect is shown by the object's case instead.",
        examples: [
          { tokens: [["Puhuin","vfin"],["suomea","o"]], en: "I spoke Finnish" },
          { tokens: [["Hän","s"],["tuli","vfin"],["eilen","adv"]], en: "He came yesterday" },
          { tokens: [["Olimme","vfin"],["kotona","adv"]], en: "We were at home" }
        ], links: ["fi_object_partial"] },
      { id: "fi_imperfect_changes", label_en: "stem changes before -i-", level: "A2",
        rule_en: "The -i- disturbs the stem. A final -a/-ä usually disappears (ostaa → ostin, sanoa → sanoin keeps o), a final -e or -i disappears (lukea → luin, tulee → tuli), and a long vowel shortens (saada → sain).",
        reason_en: "Finnish does not allow certain vowel + i sequences, so the stem adjusts. Most changes are just deletion — the -i- pushes the previous vowel out.",
        examples: [
          { tokens: [["Ostin","vfin"],["kirjan","o"]], en: "ostaa → ostin, the a drops" },
          { tokens: [["Luin","vfin"],["kirjan","o"]], en: "lukea → luin" },
          { tokens: [["Sain","vfin"],["kirjeen","o"]], en: "saada → sain" }
        ] },
      { id: "fi_imperfect_si", label_en: "the -si- group", level: "B1",
        rule_en: "A set of verbs replaces a final -t- with -s- in the past: tietää → tiesin, ymmärtää → ymmärsin, löytää → löysin, kääntää → käänsin, tuntea → tunsin. Types 4, 5 and 6 also take -si-: haluta → halusin, tarvita → tarvitsin.",
        reason_en: "These look irregular but form a tight, predictable family: a -t- immediately before the past -i- turns into -s-.",
        examples: [
          { tokens: [["Tiesin","vfin"],["sen","o"]], en: "I knew it" },
          { tokens: [["Halusin","vfin"],["kahvia","o"]], en: "I wanted coffee" },
          { tokens: [["Löysin","vfin"],["avaimen","o"]], en: "I found the key" }
        ] }
    ],
    exceptions: [
      { title_en: "The truly irregular handful", body_en: "käydä → kävin, syödä → söin, tehdä → tein, nähdä → näin, juoda → join, viedä → vein, tuoda → toin. Short, common verbs — learn them one by one.",
        examples: [
          { tokens: [["Söin","vfin"],["aamiaista","o"]], en: "I ate breakfast" },
          { tokens: [["Kävin","vfin"],["kaupassa","adv"]], en: "I went to the shop" }
        ] }
    ]
  },
  {
    id: "fi_perfect", title_en: "Perfect and pluperfect", blurb_en: "olen puhunut · olin puhunut", color: "teal",
    nodes: [
      { id: "fi_nut_participle", label_en: "the -nut/-nyt participle", level: "A2",
        rule_en: "Add -nut/-nyt to the stem, or -neet in the plural: puhunut, tullut, mennyt, ollut, nähnyt; plural puhuneet, tulleet, olleet. Type 3 verbs assimilate the n into the preceding consonant: tulla → tullut, mennä → mennyt, nousta → noussut.",
        reason_en: "This one participle powers the perfect, the pluperfect and every negative past, so it repays learning properly.",
        examples: [
          { tokens: [["puhunut","vinf"]], en: "spoken (past participle)" },
          { tokens: [["tullut","vinf"]], en: "tulla → tullut, n assimilates" },
          { tokens: [["olleet","vinf"]], en: "plural of ollut" }
        ], links: ["fi_neg_past"] },
      { id: "fi_perfect_form", label_en: "perfect: olla + participle", level: "A2",
        rule_en: "Present of olla + the participle: olen puhunut, olemme puhuneet, hän on tullut. Used for something that started in the past and still matters now, and for experiences: Olen käynyt Suomessa.",
        reason_en: "It matches English 'have done' closely, which makes it one of the few Finnish tenses you can map directly onto your own language.",
        examples: [
          { tokens: [["Olen","vfin"],["asunut","vinf"],["täällä","adv"],["vuoden","adv"]], en: "I've lived here for a year" },
          { tokens: [["Oletko","vfin"],["käynyt","vinf"],["Suomessa","adv"]], en: "Have you been to Finland?" },
          { tokens: [["En","neg"],["ole","vfin"],["nähnyt","vinf"],["häntä","o"]], en: "I haven't seen him" }
        ] },
      { id: "fi_pluperfect", label_en: "pluperfect: olin + participle", level: "B1",
        rule_en: "Imperfect of olla + participle: olin puhunut, hän oli tullut. The past before another past: Kun tulin kotiin, hän oli jo lähtenyt.",
        reason_en: "Like its German and English counterparts, it exists purely to order two past events — it never appears alone.",
        examples: [
          { tokens: [["Hän","s"],["oli","vfin"],["jo","adv"],["lähtenyt","vinf"]], en: "He had already left" },
          { tokens: [["Olin","vfin"],["syönyt","vinf"],["ennen","prep"],["sitä","o"]], en: "I had eaten before that" }
        ] }
    ],
    exceptions: [
      { title_en: "Finnish prefers the imperfect", body_en: "Where English says 'I have already eaten', Finnish very often just uses the imperfect: 'Söin jo.' The perfect is reserved for genuine relevance to the present or an open-ended time span.",
        examples: [ { tokens: [["Söin","vfin"],["jo","adv"]], en: "I already ate / I've already eaten" } ] }
    ]
  },
  {
    id: "fi_conditional", title_en: "Conditional", blurb_en: "-isi- · olisin · haluaisin", color: "rose",
    nodes: [
      { id: "fi_conditional_form", label_en: "the -isi- marker", level: "A2",
        rule_en: "Insert -isi- between stem and ending: puhuisin, puhuisit, puhuisi, puhuisimme, puhuisitte, puhuisivat. olla → olisin. haluta → haluaisin. Negative: en puhuisi.",
        reason_en: "One marker, one meaning, no irregularity worth mentioning — the conditional is the easiest Finnish mood to build.",
        examples: [
          { tokens: [["Puhuisin","vfin"],["suomea","o"]], en: "I would speak Finnish" },
          { tokens: [["Se","s"],["olisi","vfin"],["hyvä","adj"]], en: "That would be good" },
          { tokens: [["En","neg"],["tekisi","vfin"],["sitä","o"]], en: "I wouldn't do that" }
        ] },
      { id: "fi_conditional_uses", label_en: "when to use it", level: "B1",
        rule_en: "Hypothetical situations, with 'jos' in BOTH halves: Jos minulla olisi rahaa, ostaisin talon. Also wishes (Haluaisin kahvin) and — very commonly — politeness (Voisitko auttaa minua?).",
        reason_en: "Like German, Finnish marks the hypothesis in both clauses. And as with German, the polite use is the one you will need first and most often.",
        examples: [
          { tokens: [["Jos","conn"],["olisi","vfin"],["aikaa","s"],["tulisin","vfin"]], en: "If there were time, I'd come" },
          { tokens: [["Haluaisin","vfin"],["kahvin","o"]], en: "I'd like a coffee" },
          { tokens: [["Voisitko","vfin"],["auttaa","vinf"]], en: "Could you help?" }
        ] }
    ],
    exceptions: [
      { title_en: "Past conditional", body_en: "'olisin + participle' covers regrets: Olisin tullut, jos olisin tiennyt (I would have come if I had known). One pattern serves for both 'would have' and 'had'.",
        examples: [ { tokens: [["Olisin","vfin"],["tullut","vinf"]], en: "I would have come" } ] }
    ]
  },
  {
    id: "fi_imperative", title_en: "Imperative", blurb_en: "puhu! · puhukaa! · älä puhu!", color: "amber",
    nodes: [
      { id: "fi_imperative_sg", label_en: "singular command", level: "A1",
        rule_en: "Use the bare weak-grade stem — the same form as the connegative: puhu! tule! mene! ota! anna! lue! ole! It is identical to what follows 'en'.",
        reason_en: "Two of the commonest forms in Finnish are the same shape, so learning the connegative gives you the imperative for free.",
        examples: [
          { tokens: [["Tule","vfin"],["tänne","adv"]], en: "Come here!" },
          { tokens: [["Anna","vfin"],["se","o"],["minulle","adv"]], en: "Give it to me!" },
          { tokens: [["Ole","vfin"],["hyvä","adj"]], en: "Here you are / you're welcome" }
        ], links: ["fi_neg_present", "fi_object_nominative"] },
      { id: "fi_imperative_pl", label_en: "plural and polite", level: "A2",
        rule_en: "Add -kaa/-kää to the stem: puhukaa! tulkaa! menkää! olkaa! This is also the polite form for one person you address as 'te'.",
        reason_en: "As in French or German, the plural doubles as the formal singular — though Finns use first names and 'sinä' far more readily than most.",
        examples: [
          { tokens: [["Tulkaa","vfin"],["sisään","adv"]], en: "Come in! (plural/polite)" },
          { tokens: [["Olkaa","vfin"],["hyvä","adj"]], en: "Here you are (polite)" }
        ] },
      { id: "fi_imperative_neg", label_en: "negative commands", level: "A1",
        rule_en: "älä + the singular imperative form: Älä mene! Älä puhu! Plural: älkää + the verb with -ko/-kö: Älkää menkö! Älkää puhuko!",
        reason_en: "'älä' is the imperative of the negative verb, which is why it conjugates for number just like en/ette.",
        examples: [
          { tokens: [["Älä","neg"],["huoli","vfin"]], en: "Don't worry" },
          { tokens: [["Älkää","neg"],["unohtako","vfin"]], en: "Don't forget! (plural)" }
        ] }
    ],
    exceptions: [
      { title_en: "'Let's' is the passive", body_en: "Spoken Finnish uses the passive for a first-person plural suggestion: Mennään! (let's go), Otetaan kahvia! (let's have coffee). The formal 'menkäämme' is almost never heard.",
        examples: [ { tokens: [["Mennään","vfin"]], en: "Let's go!" } ] },
      { title_en: "The object loses its -n", body_en: "After an imperative a total object takes the plain nominative: Osta kirja! not 'Osta kirjan'. Plural stays -t: Osta kirjat!",
        examples: [ { tokens: [["Osta","vfin"],["kirja","o"]], en: "Buy the book!" } ] }
    ]
  },
  {
    id: "fi_passive", title_en: "The passive", blurb_en: "puhutaan · puhuttiin · on puhuttu", color: "indigo",
    nodes: [
      { id: "fi_passive_present", label_en: "present passive", level: "B1",
        rule_en: "Stem + -taan/-tään: puhutaan, ostetaan, luetaan, tehdään, mennään, tarvitaan. It means 'one / people / they / we' — the doer is unknown or unimportant and can never be named.",
        reason_en: "This is not the English passive: there is no way to add 'by someone'. It is an impersonal form, closer to French 'on' or German 'man'.",
        examples: [
          { tokens: [["Suomessa","adv"],["puhutaan","vfin"],["suomea","o"]], en: "Finnish is spoken in Finland" },
          { tokens: [["Täällä","adv"],["ei","neg"],["tupakoida","vfin"]], en: "No smoking here — negative passive" }
        ] },
      { id: "fi_passive_past", label_en: "past and perfect passive", level: "B1",
        rule_en: "Past: -ttiin/-tiin — puhuttiin, ostettiin, mentiin, tehtiin. Perfect: on + the passive participle — on puhuttu, on tehty. Negative past: ei puhuttu.",
        reason_en: "The passive has a full tense system of its own, so anything you can say actively you can also say impersonally.",
        examples: [
          { tokens: [["Talo","o"],["rakennettiin","vfin"],["vuonna","adv"],["1950","adv"]], en: "The house was built in 1950" },
          { tokens: [["Se","o"],["on","vfin"],["jo","adv"],["tehty","vinf"]], en: "It has already been done" }
        ] },
      { id: "fi_passive_spoken", label_en: "the passive as 'we'", level: "A2",
        rule_en: "In everyday speech the passive replaces the first person plural entirely: Me mennään (we're going), Me ollaan kotona, Mennäänkö kahville?",
        reason_en: "You will hear this constantly and long before you meet the passive as a grammar topic — so it is worth recognising early, even though it never appears in writing.",
        examples: [
          { tokens: [["Me","s"],["mennään","vfin"],["kotiin","adv"]], en: "spoken: we're going home" },
          { tokens: [["Me","s"],["ollaan","vfin"],["täällä","adv"]], en: "spoken: we are here" }
        ] }
    ],
    exceptions: [
      { title_en: "The object keeps the nominative", body_en: "Like the imperative, the passive drops the -n from a total object: Kirja luettiin (the book was read), not 'kirjan luettiin'. Partitive rules are unchanged: Kirjaa luettiin.",
        examples: [ { tokens: [["Kirja","o"],["luettiin","vfin"]], en: "The book was read" } ] }
    ]
  },
  {
    id: "fi_infinitives", title_en: "Infinitives", blurb_en: "puhua · puhumaan · puhumassa · puhumalla", color: "teal",
    nodes: [
      { id: "fi_inf1", label_en: "the basic infinitive", level: "A1",
        rule_en: "The dictionary form. It follows verbs of wanting and being able, and the necessive expressions: Haluan puhua. Osaan puhua. Voin puhua. Minun täytyy puhua.",
        reason_en: "This is the only infinitive that behaves like English 'to do'. The others are really case forms of a verbal noun, which is why they mean so much more.",
        examples: [
          { tokens: [["Haluan","vfin"],["oppia","vinf"],["suomea","o"]], en: "I want to learn Finnish" },
          { tokens: [["Minun","adv"],["täytyy","vfin"],["mennä","vinf"]], en: "I have to go" }
        ], links: ["fi_object_nominative"] },
      { id: "fi_inf3", label_en: "the -ma- infinitive with cases", level: "A2",
        rule_en: "Stem + -ma/-mä + a local case. -maan/-mään after verbs of motion and starting (Menen syömään). -massa/-mässä = in the middle of (Olen syömässä). -masta/-mästä = away from (Tulen syömästä). -malla/-mällä = by doing (Opin lukemalla). -matta/-mättä = without doing (Lähdin sanomatta mitään).",
        reason_en: "It is a verbal noun taking exactly the same case endings as any other noun — so 'into eating', 'in eating', 'out of eating'. Once you see that, the five forms need no separate memorising.",
        examples: [
          { tokens: [["Menen","vfin"],["syömään","vinf"]], en: "I'm going to eat" },
          { tokens: [["Olen","vfin"],["syömässä","vinf"]], en: "I'm (out) eating right now" },
          { tokens: [["Opin","vfin"],["lukemalla","vinf"]], en: "I learn by reading" },
          { tokens: [["Lähdin","vfin"],["sanomatta","vinf"],["mitään","o"]], en: "I left without saying anything" }
        ], links: ["fi_inessive", "fi_adessive"] },
      { id: "fi_inf4", label_en: "-minen: the verbal noun", level: "B1",
        rule_en: "Stem + -minen turns a verb into a full noun that declines: lukeminen (reading), uiminen (swimming). Uiminen on hauskaa. Pidän lukemisesta.",
        reason_en: "It is the equivalent of the English -ing noun, and because it declines you can put it into any case a situation needs.",
        examples: [
          { tokens: [["Uiminen","s"],["on","vfin"],["hauskaa","adj"]], en: "Swimming is fun" },
          { tokens: [["Pidän","vfin"],["lukemisesta","adv"]], en: "I like reading" }
        ] }
    ],
    exceptions: [
      { title_en: "The verb decides which infinitive", body_en: "haluta, osata, voida, saattaa take the basic infinitive; mennä, tulla, oppia, alkaa, ruveta take -maan; lakata, väsyä, kieltää take -masta. It is fixed per verb, exactly like a preposition in English.",
        examples: [
          { tokens: [["Opin","vfin"],["puhumaan","vinf"]], en: "I learn to speak — -maan" },
          { tokens: [["Lakkasin","vfin"],["puhumasta","vinf"]], en: "I stopped speaking — -masta" }
        ] }
    ]
  },
  {
    id: "fi_participles", title_en: "Participles", blurb_en: "puhuva · puhunut · puhuttava · puhuttu", color: "rose",
    nodes: [
      { id: "fi_part_active", label_en: "active participles", level: "B1",
        rule_en: "Present active -va/-vä = doing (puhuva mies, the speaking man). Past active -nut/-nyt = having done (puhunut mies). Both decline like adjectives: puhuvalle miehelle.",
        reason_en: "Finnish uses participles where English uses relative clauses. 'Tuolla istuva mies' is literally 'the there-sitting man' — much more compact than 'the man who is sitting there'.",
        examples: [
          { tokens: [["juokseva","adj"],["koira","s"]], en: "a running dog" },
          { tokens: [["Tuolla","adv"],["istuva","adj"],["mies","s"]], en: "the man sitting over there" }
        ] },
      { id: "fi_part_passive", label_en: "passive participles", level: "B1",
        rule_en: "Present passive -tava/-ttävä = to be done, must be done (luettava kirja, a book to be read). Past passive -tu/-ty/-ttu/-tty = done (luettu kirja, tehty työ).",
        reason_en: "The -tava form carries a sense of obligation, which is why it turns up in signs and instructions: 'Säilytettävä kuivassa' — to be kept dry.",
        examples: [
          { tokens: [["luettava","adj"],["kirja","s"]], en: "a book to be read" },
          { tokens: [["tehty","adj"],["työ","s"]], en: "finished work" }
        ] },
      { id: "fi_part_clause", label_en: "participle instead of 'that'", level: "C1",
        rule_en: "A participle can replace a whole että-clause: Tiedän hänen tulevan (= Tiedän, että hän tulee). The subject goes into the genitive and the participle takes -van/-vän, or -neen for the past.",
        reason_en: "This is characteristic of formal written Finnish. Recognising it matters more than producing it — spoken Finnish uses 'että' almost always.",
        examples: [
          { tokens: [["Tiedän","vfin"],["hänen","adv"],["tulevan","vinf"]], en: "I know he's coming" },
          { tokens: [["Luulin","vfin"],["hänen","adv"],["lähteneen","vinf"]], en: "I thought he had left" }
        ] }
    ],
    exceptions: [
      { title_en: "Participles are also ordinary adjectives", body_en: "Many have simply become words in their own right: kiinnostava (interesting), väsynyt (tired), keitetty (boiled), avattu (opened). They decline and compare exactly like other adjectives.",
        examples: [
          { tokens: [["Olen","vfin"],["väsynyt","adj"]], en: "I'm tired" },
          { tokens: [["kiinnostava","adj"],["kirja","s"]], en: "an interesting book" }
        ] }
    ]
  },
  {
    id: "fi_comparison", title_en: "Comparison", blurb_en: "isompi · isoin · kuin", color: "amber",
    nodes: [
      { id: "fi_comparative", label_en: "comparative -mpi", level: "A2",
        rule_en: "Add -mpi to the stem; the inflecting stem is -mma-/-mmä-: iso → isompi → isomman, isompaa. Two-syllable adjectives in -a/-ä change it to -e-: vanha → vanhempi, kylmä → kylmempi.",
        reason_en: "The nominative -mpi and the stem -mma- look unrelated, so learn the pair together — you will need the stem for every case except the plain nominative.",
        examples: [
          { tokens: [["isompi","adj"],["talo","s"]], en: "a bigger house" },
          { tokens: [["isommassa","adj"],["talossa","adv"]], en: "in a bigger house" },
          { tokens: [["Sää","s"],["on","vfin"],["kylmempi","adj"]], en: "The weather is colder" }
        ] },
      { id: "fi_superlative", label_en: "superlative -in", level: "A2",
        rule_en: "Add -in; the inflecting stem is -imma-/-immä-: iso → isoin → isoimman. A final -a/-ä or -e disappears before it; -i becomes -e-: kaunis → kaunein, uusi → uusin.",
        reason_en: "Superlatives behave as adjectives, not as fixed phrases — so they take the case of whatever noun they describe, unlike English 'the biggest'.",
        examples: [
          { tokens: [["isoin","adj"],["talo","s"]], en: "the biggest house" },
          { tokens: [["isoimmassa","adj"],["talossa","adv"]], en: "in the biggest house" },
          { tokens: [["Se","s"],["oli","vfin"],["kaunein","adj"]], en: "It was the most beautiful" }
        ] },
      { id: "fi_comparison_case", label_en: "two ways to say 'than'", level: "B1",
        rule_en: "Either 'kuin' + the same case (Hän on isompi kuin minä) or put the thing compared into the PARTITIVE (Hän on minua isompi). Both are correct and equally common.",
        reason_en: "The partitive version is more compact and very characteristic of Finnish — 'he is bigger of-me'. Recognising it saves you from parsing it as an object.",
        examples: [
          { tokens: [["Hän","s"],["on","vfin"],["isompi","adj"],["kuin","conn"],["minä","s"]], en: "He is bigger than me" },
          { tokens: [["Hän","s"],["on","vfin"],["minua","adv"],["isompi","adj"]], en: "same meaning, partitive" }
        ] }
    ],
    exceptions: [
      { title_en: "The irregular ones", body_en: "hyvä → parempi → paras (good/better/best); pitkä → pidempi → pisin; lyhyt → lyhyempi → lyhin; paljon → enemmän → eniten; vähän → vähemmän → vähiten.",
        examples: [
          { tokens: [["Tämä","s"],["on","vfin"],["parempi","adj"]], en: "This is better" },
          { tokens: [["paras","adj"],["kirja","s"]], en: "the best book" }
        ] }
    ]
  },
  {
    id: "fi_sentence", title_en: "Sentence patterns", blurb_en: "existence · questions · postpositions", color: "indigo",
    nodes: [
      { id: "fi_existential", label_en: "existential sentences", level: "A2",
        rule_en: "Place first, then 'on', then the thing: Pöydällä on kirja. If the amount is indefinite the thing goes into the PARTITIVE and the verb stays singular: Pöydällä on kirjoja. Kadulla on ihmisiä.",
        reason_en: "This is how Finnish says 'there is / there are'. The singular verb with a plural partitive subject looks wrong to English eyes but is compulsory.",
        examples: [
          { tokens: [["Pöydällä","adv"],["on","vfin"],["kirja","s"]], en: "There's a book on the table" },
          { tokens: [["Pöydällä","adv"],["on","vfin"],["kirjoja","s"]], en: "There are books on the table — singular 'on'" },
          { tokens: [["Täällä","adv"],["ei","neg"],["ole","vfin"],["ketään","s"]], en: "There's nobody here" }
        ], links: ["fi_partitive_plural"] },
      { id: "fi_questions", label_en: "questions with -ko/-kö", level: "A1",
        rule_en: "Attach -ko/-kö to the word you are asking about and move it to the front: Puhutko sinä suomea? Onko sinulla aikaa? Sinäkö sen teit? With a question word (missä, kuka, milloin) no -ko is used.",
        reason_en: "Moving the -ko word is what focuses the question. 'Sinäkö tulet?' asks whether it is YOU who is coming, while 'Tuletko sinä?' asks whether you are coming at all.",
        examples: [
          { tokens: [["Puhutko","vfin"],["suomea","o"]], en: "Do you speak Finnish?" },
          { tokens: [["Onko","vfin"],["sinulla","adv"],["aikaa","s"]], en: "Do you have time?" },
          { tokens: [["Missä","q"],["sinä","s"],["asut","vfin"]], en: "Where do you live? — no -ko" }
        ] },
      { id: "fi_postpositions", label_en: "postpositions take the genitive", level: "A2",
        rule_en: "They come AFTER the word and require the genitive: talon edessä (in front of the house), pöydän alla (under the table), sinun kanssasi (with you), kaupan vieressä. A few are prepositions instead and take the partitive: ilman rahaa, ennen joulua.",
        reason_en: "Finnish has cases for most of what English does with prepositions, so what remains are relations no case covers — mostly precise spatial ones.",
        examples: [
          { tokens: [["talon","adv"],["edessä","adv"]], en: "in front of the house" },
          { tokens: [["pöydän","adv"],["alla","adv"]], en: "under the table" },
          { tokens: [["ilman","prep"],["rahaa","o"]], en: "without money — preposition + partitive" }
        ], links: ["fi_genitive"] },
      { id: "fi_numbers", label_en: "numbers", level: "A1",
        rule_en: "yksi, kaksi, kolme, neljä, viisi, kuusi, seitsemän, kahdeksan, yhdeksän, kymmenen. After any number above one the noun is SINGULAR PARTITIVE: kaksi kirjaa. If the phrase takes a case, both the number and the noun inflect: kahdessa talossa, kolmelle lapselle.",
        reason_en: "A number already states the quantity, so the noun does not need a plural — it names the kind of thing being counted, hence the partitive.",
        examples: [
          { tokens: [["kaksi","adj"],["kirjaa","o"]], en: "two books" },
          { tokens: [["kahdessa","adj"],["talossa","adv"]], en: "in two houses — both inflect" },
          { tokens: [["Kello","s"],["on","vfin"],["kaksi","adv"]], en: "It's two o'clock" }
        ], links: ["fi_partitive_uses"] }
    ],
    exceptions: [
      { title_en: "Word order carries emphasis, not grammar", body_en: "Because the cases show who does what, the order is free and is used for information flow: known first, new last. 'Kirja on pöydällä' answers where the book is; 'Pöydällä on kirja' answers what is on the table.",
        examples: [
          { tokens: [["Kirja","s"],["on","vfin"],["pöydällä","adv"]], en: "Where is the book?" },
          { tokens: [["Pöydällä","adv"],["on","vfin"],["kirja","s"]], en: "What's on the table?" }
        ] },
      { title_en: "Some postpositions can come first", body_en: "keskellä, lähellä, ympäri and a few others work either way: keskellä kaupunkia (partitive) or kaupungin keskellä (genitive). Both are standard.",
        examples: [ { tokens: [["keskellä","prep"],["kaupunkia","o"]], en: "in the middle of the city" } ] }
    ]
  }
];
