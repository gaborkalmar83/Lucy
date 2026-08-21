// German grammar map — part 2: adjectives, comparison, negation, questions,
// conjunctions, relative clauses, Konjunktiv, passive, reflexives, infinitive
// constructions and modal particles.
window.GRAM_DE2 = [
  {
    id: "de_adjectives", title_en: "Adjective endings", blurb_en: "weak · strong · mixed", color: "amber",
    nodes: [
      { id: "de_adj_none", label_en: "no ending after the verb", level: "A1",
        rule_en: "An adjective standing AFTER sein, werden or bleiben never takes an ending: Das Haus ist groß. Der Mann wird alt. Endings appear only when the adjective sits in front of a noun.",
        reason_en: "The ending exists to mark the noun's gender and case. With no noun following, there is nothing to mark — which is why this is the one easy position.",
        examples: [
          { tokens: [["Das","art"],["Haus","s"],["ist","vfin"],["groß","adj"]], en: "no ending" },
          { tokens: [["Das","art"],["große","adj"],["Haus","s"]], en: "before the noun → ending appears" }
        ], links: ["de_adj_weak"] },
      { id: "de_adj_weak", label_en: "weak endings (after der/die/das)", level: "A2",
        rule_en: "After a der-word (der, die, das, dieser, jeder, welcher, alle), the adjective takes only -e or -en. -e in the nominative singular of all three genders and the accusative of feminine and neuter; -en everywhere else.",
        reason_en: "The article has already shown the case, so the adjective only has to agree, not inform. That is why just two endings suffice.",
        examples: [
          { tokens: [["der","art"],["große","adj"],["Mann","s"]], en: "nominative → -e" },
          { tokens: [["den","art"],["großen","adj"],["Mann","o"]], en: "accusative masculine → -en" },
          { tokens: [["mit","prep"],["dem","art"],["großen","adj"],["Mann","adv"]], en: "dative → -en" }
        ], links: ["de_adj_mixed"] },
      { id: "de_adj_mixed", label_en: "mixed endings (after ein/kein/mein)", level: "B1",
        rule_en: "After ein-words the adjective takes the strong ending exactly where the article shows nothing: ein großER Mann, ein großES Kind. Everywhere else it behaves weakly with -e / -en.",
        reason_en: "'ein' has no ending in masculine nominative and neuter nominative/accusative, so the adjective steps in and carries the gender information instead.",
        examples: [
          { tokens: [["ein","art"],["großer","adj"],["Mann","s"]], en: "ein shows nothing → adjective shows -er" },
          { tokens: [["ein","art"],["großes","adj"],["Kind","s"]], en: "neuter -es" },
          { tokens: [["einen","art"],["großen","adj"],["Mann","o"]], en: "einen already marks it → weak -en" }
        ] },
      { id: "de_adj_strong", label_en: "strong endings (no article)", level: "B1",
        rule_en: "With no article at all, the adjective takes over the article's own endings: guter Wein, gutes Bier, gute Milch, mit gutem Wein, guten Weins. Common after numbers, quantities and in plurals: viele gute Bücher.",
        reason_en: "The information has to live somewhere. Remove the article and the adjective inherits its endings almost exactly — which makes the table easy to derive rather than memorise.",
        examples: [
          { tokens: [["guter","adj"],["Wein","s"]], en: "= der Wein pattern" },
          { tokens: [["mit","prep"],["gutem","adj"],["Wein","adv"]], en: "= dem pattern" },
          { tokens: [["kalte","adj"],["Milch","o"]], en: "no article, feminine" }
        ] },
      { id: "de_adj_noun", label_en: "adjectives used as nouns", level: "B1",
        rule_en: "Any adjective can become a noun: it is capitalised and keeps its adjective ending. der Deutsche, ein Deutscher, die Deutschen; der Alte, etwas Schönes, nichts Neues, viel Interessantes.",
        reason_en: "The noun is really still an adjective with the noun left out, which is why the ending keeps changing with case instead of freezing.",
        examples: [
          { tokens: [["ein","art"],["Deutscher","s"]], en: "a German man — mixed ending" },
          { tokens: [["der","art"],["Deutsche","s"]], en: "the German man — weak ending" },
          { tokens: [["etwas","adj"],["Schönes","o"]], en: "something beautiful" }
        ] }
    ],
    exceptions: [
      { title_en: "hoch and adjectives in -el / -er drop a vowel", body_en: "hoch → ein hoher Berg (the c disappears); dunkel → ein dunkles Zimmer; teuer → ein teures Auto. The base form is only used after the verb: Der Berg ist hoch.",
        examples: [
          { tokens: [["ein","art"],["hoher","adj"],["Berg","s"]], en: "not 'hocher'" },
          { tokens: [["ein","art"],["teures","adj"],["Auto","s"]], en: "teuer → teur-" }
        ] },
      { title_en: "City adjectives in -er never change", body_en: "der Kölner Dom, die Berliner Mauer, ein Wiener Schnitzel. They are capitalised and take no ending in any case.",
        examples: [ { tokens: [["in","prep"],["der","art"],["Berliner","adj"],["Mauer","adv"]], en: "no ending, ever" } ] }
    ]
  },
  {
    id: "de_comparison", title_en: "Comparison", blurb_en: "größer · am größten · so … wie", color: "indigo",
    nodes: [
      { id: "de_comparative", label_en: "comparative -er", level: "A2",
        rule_en: "Add -er to every adjective, however long: schnell → schneller, interessant → interessanter. Most one-syllable adjectives also add an umlaut: alt → älter, groß → größer, jung → jünger. 'than' is 'als'.",
        reason_en: "German never uses a 'mehr' construction the way English uses 'more' — 'mehr interessant' is wrong. The ending does all the work regardless of length.",
        examples: [
          { tokens: [["Er","s"],["ist","vfin"],["größer","adj"],["als","conn"],["ich","s"]], en: "He's taller than me" },
          { tokens: [["ein","art"],["interessanteres","adj"],["Buch","s"]], en: "comparative + adjective ending" }
        ] },
      { id: "de_superlative", label_en: "superlative: am … -sten", level: "A2",
        rule_en: "After the verb: am + adjective + -sten (am schnellsten, am größten). Before a noun: der/die/das + adjective + -ste (der schnellste Zug). Add -e- after t, d, s, ß, z: am ältesten.",
        reason_en: "The two forms are not interchangeable: 'am' is a frozen dative phrase used adverbially, while the der-form is a normal attributive adjective and needs normal endings.",
        examples: [
          { tokens: [["Er","s"],["läuft","vfin"],["am","prep"],["schnellsten","adj"]], en: "after the verb" },
          { tokens: [["der","art"],["schnellste","adj"],["Zug","s"]], en: "before a noun" },
          { tokens: [["am","prep"],["ältesten","adj"]], en: "-est- after t" }
        ] },
      { id: "de_comparison_structures", label_en: "so … wie · immer … · je … desto", level: "B1",
        rule_en: "Equality: so + basic form + wie (so groß wie). Difference: comparative + als. Growing change: immer + comparative (immer besser). Proportion: je + comparative …, desto/umso + comparative … — and the je-clause sends its verb to the end.",
        reason_en: "'wie' compares likeness, 'als' compares difference. Mixing them ('größer wie') is one of the most recognisable non-standard errors in German.",
        examples: [
          { tokens: [["Er","s"],["ist","vfin"],["so","adv"],["groß","adj"],["wie","conn"],["ich","s"]], en: "as tall as me" },
          { tokens: [["Es","s"],["wird","vfin"],["immer","adv"],["besser","adj"]], en: "better and better" },
          { tokens: [["Je","conn"],["mehr","adv"],["ich","s"],["lerne","vfin"],["desto","conn"],["besser","adj"],["verstehe","vfin"],["ich","s"]], en: "The more I learn, the better I understand" }
        ] }
    ],
    exceptions: [
      { title_en: "The irregular handful", body_en: "gut → besser → am besten; viel → mehr → am meisten; gern → lieber → am liebsten; hoch → höher → am höchsten; nah → näher → am nächsten. 'gern/lieber/am liebsten' is how German says what you prefer to do.",
        examples: [
          { tokens: [["Ich","s"],["trinke","vfin"],["lieber","adv"],["Tee","o"]], en: "I prefer tea" },
          { tokens: [["Das","s"],["ist","vfin"],["am","prep"],["besten","adj"]], en: "that's best" }
        ] }
    ]
  },
  {
    id: "de_negation", title_en: "Negation", blurb_en: "nicht vs kein · where nicht goes", color: "teal",
    nodes: [
      { id: "de_nicht_kein", label_en: "nicht or kein?", level: "A1",
        rule_en: "Use 'kein' to negate a noun that has 'ein' or no article at all: Ich habe kein Auto. Ich trinke keinen Kaffee. Use 'nicht' for everything else — verbs, adjectives, adverbs, and nouns that carry a definite article or a possessive.",
        reason_en: "'kein' is the negative article, so it competes with ein/nothing. Where an article is already present, there is no slot for kein and nicht takes over.",
        examples: [
          { tokens: [["Ich","s"],["habe","vfin"],["kein","art"],["Auto","o"]], en: "ein → kein" },
          { tokens: [["Ich","s"],["mag","vfin"],["das","art"],["Auto","o"],["nicht","neg"]], en: "definite article → nicht" },
          { tokens: [["Das","s"],["ist","vfin"],["nicht","neg"],["mein","art"],["Auto","adv"]], en: "possessive → nicht" }
        ], links: ["de_ein_kein"] },
      { id: "de_nicht_position", label_en: "where nicht goes", level: "A2",
        rule_en: "'nicht' goes as far right as it can — but always BEFORE the part that completes the meaning: a separable prefix, an infinitive, a participle, a predicate adjective, or a place phrase. To negate one specific element instead, put nicht directly in front of it.",
        reason_en: "German closes its sentences with the semantically heaviest element, and nicht has to precede that element to negate it rather than the whole sentence.",
        examples: [
          { tokens: [["Ich","s"],["kenne","vfin"],["ihn","o"],["nicht","neg"]], en: "nothing follows → nicht at the end" },
          { tokens: [["Ich","s"],["bin","vfin"],["nicht","neg"],["müde","adj"]], en: "before a predicate adjective" },
          { tokens: [["Ich","s"],["gehe","vfin"],["heute","adv"],["nicht","neg"],["ins","prep"],["Kino","adv"]], en: "before the place phrase" },
          { tokens: [["Ich","s"],["habe","vfin"],["ihn","o"],["nicht","neg"],["gesehen","vinf"]], en: "before the participle" }
        ] },
      { id: "de_negation_words", label_en: "nie · nichts · niemand · noch nicht", level: "B1",
        rule_en: "nie/niemals = never, nichts = nothing, niemand = nobody (declines: niemanden, niemandem), nirgends = nowhere, noch nicht = not yet, nicht mehr = no longer, kein … mehr = no more.",
        reason_en: "German uses ONE negative word per clause. 'Ich habe nichts nicht gesehen' is not emphatic, it is wrong — unlike some other European languages.",
        examples: [
          { tokens: [["Ich","s"],["habe","vfin"],["nichts","o"],["gesehen","vinf"]], en: "I saw nothing" },
          { tokens: [["Er","s"],["wohnt","vfin"],["nicht","neg"],["mehr","adv"],["hier","adv"]], en: "no longer lives here" },
          { tokens: [["Ich","s"],["habe","vfin"],["kein","art"],["Geld","o"],["mehr","adv"]], en: "no money left" }
        ] }
    ],
    exceptions: [
      { title_en: "doch answers a negative question", body_en: "German has a third answer word. 'Kommst du nicht?' — 'Doch!' means yes, I am coming (contradicting the negative). 'Nein' would confirm the negative. English has to say 'Yes I am' with stress.",
        examples: [
          { tokens: [["Hast","vfin"],["du","s"],["keine","art"],["Zeit","o"],["Doch","adv"]], en: "Yes, I do have time" }
        ] }
    ]
  },
  {
    id: "de_questions", title_en: "Questions", blurb_en: "W-Fragen · Ja/Nein · indirect", color: "rose",
    nodes: [
      { id: "de_w_questions", label_en: "W-questions", level: "A1",
        rule_en: "Question word first, verb second, subject third: wer, was, wo, wohin, woher, wann, wie, warum, wieso, welcher, wie viel/viele. 'wer' declines: wer / wen / wem / wessen.",
        reason_en: "The question word simply occupies the free first position, so the verb-second rule is unchanged — questions are not a special word order, they are the ordinary one.",
        examples: [
          { tokens: [["Wo","q"],["wohnst","vfin"],["du","s"]], en: "Where do you live?" },
          { tokens: [["Wen","q"],["hast","vfin"],["du","s"],["gesehen","vinf"]], en: "Whom did you see? — accusative" },
          { tokens: [["Wem","q"],["gehört","vfin"],["das","s"]], en: "Whose is that? — dative verb" }
        ], links: ["de_v2"] },
      { id: "de_yesno", label_en: "yes/no questions", level: "A1",
        rule_en: "Put the conjugated verb FIRST and the subject straight after: Kommst du? Hast du Zeit? Answer with ja, nein — or doch to contradict a negative.",
        reason_en: "With nothing in position one, the verb slides into it. That empty first slot is exactly what signals a question.",
        examples: [
          { tokens: [["Kommst","vfin"],["du","s"],["mit","part"]], en: "Are you coming along?" },
          { tokens: [["Hast","vfin"],["du","s"],["das","o"],["gemacht","vinf"]], en: "Did you do that?" }
        ] },
      { id: "de_indirect_questions", label_en: "indirect questions", level: "B1",
        rule_en: "Embed a question after a phrase like 'Ich weiß nicht' or 'Können Sie mir sagen' and the verb moves to the END. If there is no question word, use 'ob' (whether): Ich weiß nicht, ob er kommt.",
        reason_en: "The embedded question has become a subordinate clause, and every subordinate clause in German ends with its verb — the question form disappears entirely.",
        examples: [
          { tokens: [["Ich","s"],["weiß","vfin"],["nicht","neg"],["wo","conn"],["er","s"],["wohnt","vfin"]], en: "verb to the end" },
          { tokens: [["Weißt","vfin"],["du","s"],["ob","conn"],["sie","s"],["kommt","vfin"]], en: "no question word → ob" }
        ], links: ["de_subordinating"] }
    ],
    exceptions: [
      { title_en: "wo · wohin · woher", body_en: "German splits English 'where' by direction: wo = where (at), wohin = where to, woher = where from. In speech the parts often split around the sentence: 'Wo gehst du hin?' = Wohin gehst du?",
        examples: [
          { tokens: [["Wo","q"],["bist","vfin"],["du","s"]], en: "location" },
          { tokens: [["Wohin","q"],["gehst","vfin"],["du","s"]], en: "direction" }
        ] },
      { title_en: "welcher vs was für ein", body_en: "'welcher' asks which one out of a known set and declines like der. 'was für ein' asks what kind of, and the ein part takes the case of its own role — the 'für' has no effect on it.",
        examples: [
          { tokens: [["Welches","q"],["Buch","o"],["liest","vfin"],["du","s"]], en: "which book (of these)" },
          { tokens: [["Was","q"],["für","prep"],["ein","art"],["Auto","o"],["hast","vfin"],["du","s"]], en: "what kind of car" }
        ] }
    ]
  },
  {
    id: "de_conjunctions", title_en: "Conjunctions", blurb_en: "und · weil · deshalb — three word orders", color: "amber",
    nodes: [
      { id: "de_coordinating", label_en: "position 0: und, aber, denn, oder, sondern", level: "A1",
        rule_en: "und, aber, denn, oder, sondern do not count as a sentence element. The clause after them keeps completely normal main-clause order: subject, verb second.",
        reason_en: "They join two equal main clauses rather than subordinating one, so they sit outside the sentence frame — hence 'position zero'.",
        examples: [
          { tokens: [["Ich","s"],["bleibe","vfin"],["zu","prep"],["Hause","adv"],["denn","conn"],["ich","s"],["bin","vfin"],["krank","adj"]], en: "denn → normal order" },
          { tokens: [["Er","s"],["kommt","vfin"],["aber","conn"],["sie","s"],["bleibt","vfin"],["hier","adv"]], en: "aber → normal order" }
        ], links: ["de_v2"] },
      { id: "de_subordinating", label_en: "verb to the end: weil, dass, wenn, ob …", level: "A2",
        rule_en: "weil, dass, wenn, als, ob, obwohl, damit, bevor, nachdem, seitdem, während, falls, bis send the conjugated verb to the VERY END of their clause. A comma always separates the clauses.",
        reason_en: "This is the single biggest structural difference from English. The verb-final pattern is what marks the clause as dependent — no other signal is needed.",
        examples: [
          { tokens: [["Ich","s"],["bleibe","vfin"],["zu","prep"],["Hause","adv"],["weil","conn"],["ich","s"],["krank","adj"],["bin","vfin"]], en: "bin goes last" },
          { tokens: [["Ich","s"],["weiß","vfin"],["dass","conn"],["er","s"],["morgen","adv"],["kommt","vfin"]], en: "kommt goes last" },
          { tokens: [["Wenn","conn"],["ich","s"],["Zeit","o"],["habe","vfin"],["komme","vfin"],["ich","s"]], en: "clause first → main verb still second" }
        ], links: ["de_v2", "de_separable_present"] },
      { id: "de_adverbial_conn", label_en: "position 1: deshalb, trotzdem, dann", level: "B1",
        rule_en: "deshalb, deswegen, darum, trotzdem, dann, danach, außerdem, sonst are adverbs, not conjunctions. They occupy position one, so the verb comes straight after and the subject goes third.",
        reason_en: "Three connector types with three different word orders is what makes German linking tricky. Ask which type a word is BEFORE you write the clause.",
        examples: [
          { tokens: [["Ich","s"],["bin","vfin"],["krank","adj"],["deshalb","conn"],["bleibe","vfin"],["ich","s"],["zu","prep"],["Hause","adv"]], en: "deshalb → verb, then subject" },
          { tokens: [["Es","s"],["regnet","vfin"],["trotzdem","conn"],["gehen","vfin"],["wir","s"],["spazieren","vinf"]], en: "trotzdem → inversion" }
        ] },
      { id: "de_two_part", label_en: "two-part conjunctions", level: "B2",
        rule_en: "entweder … oder (either/or), weder … noch (neither/nor), sowohl … als auch (both/and), nicht nur … sondern auch (not only/but also), zwar … aber (admittedly/but), je … desto.",
        reason_en: "'weder … noch' is already negative, so no nicht or kein is added — a second negative would be an error.",
        examples: [
          { tokens: [["Ich","s"],["trinke","vfin"],["weder","conn"],["Kaffee","o"],["noch","conn"],["Tee","o"]], en: "neither … nor, no extra negation" },
          { tokens: [["Er","s"],["spricht","vfin"],["nicht","neg"],["nur","adv"],["Deutsch","o"],["sondern","conn"],["auch","adv"],["Französisch","o"]], en: "not only … but also" }
        ] }
    ],
    exceptions: [
      { title_en: "denn vs weil", body_en: "Both mean 'because'. 'denn' keeps normal word order and can never start a sentence; 'weil' sends the verb to the end and can start one. In casual speech you will hear 'weil' with main-clause order — widespread, but not standard.",
        examples: [
          { tokens: [["weil","conn"],["ich","s"],["müde","adj"],["bin","vfin"]], en: "standard: verb last" },
          { tokens: [["denn","conn"],["ich","s"],["bin","vfin"],["müde","adj"]], en: "denn: verb second" }
        ] },
      { title_en: "sondern, not aber, after a negative", body_en: "Use 'sondern' when you correct a negative statement: Das ist nicht Wein, sondern Saft. Use 'aber' for a plain contrast: Es ist teuer, aber gut.",
        examples: [ { tokens: [["nicht","neg"],["Wein","o"],["sondern","conn"],["Saft","o"]], en: "correction → sondern" } ] }
    ]
  },
  {
    id: "de_relative", title_en: "Relative clauses", blurb_en: "der, die, das … verb last", color: "indigo",
    nodes: [
      { id: "de_relative_basic", label_en: "the relative pronoun", level: "B1",
        rule_en: "The relative pronoun looks like the definite article. Its GENDER and NUMBER come from the noun it refers to, but its CASE comes from its job inside the relative clause. The verb goes to the end.",
        reason_en: "Two different sentences are being welded together, so the pronoun has to face both ways at once — that split is the whole difficulty.",
        examples: [
          { tokens: [["Der","art"],["Mann","s"],["der","pron"],["dort","adv"],["steht","vfin"]], en: "subject in its clause → der" },
          { tokens: [["Der","art"],["Mann","s"],["den","pron"],["ich","s"],["kenne","vfin"]], en: "object in its clause → den" },
          { tokens: [["Die","art"],["Frau","s"],["der","pron"],["ich","s"],["helfe","vfin"]], en: "dative verb → der" }
        ], links: ["de_subordinating", "de_dativ"] },
      { id: "de_relative_prep", label_en: "with a preposition", level: "B1",
        rule_en: "The preposition comes FIRST, immediately before the pronoun, and decides its case: der Mann, mit dem ich spreche; das Buch, über das wir reden. German never strands the preposition at the end the way English does.",
        reason_en: "German prepositions have to govern a case, so they cannot be separated from the word they govern — 'the man I spoke with' has no direct German equivalent.",
        examples: [
          { tokens: [["der","art"],["Mann","s"],["mit","prep"],["dem","pron"],["ich","s"],["spreche","vfin"]], en: "mit + dative" },
          { tokens: [["das","art"],["Haus","s"],["in","prep"],["dem","pron"],["ich","s"],["wohne","vfin"]], en: "location → dative" }
        ] },
      { id: "de_relative_dessen", label_en: "dessen · deren · denen", level: "B2",
        rule_en: "Three forms differ from the article: genitive masculine/neuter 'dessen', genitive feminine and plural 'deren', dative plural 'denen'. dessen/deren mean 'whose' and the noun after them takes NO article.",
        reason_en: "These are the leftovers of a fuller pronoun paradigm, and they are the forms that most often catch learners who assume the article table covers everything.",
        examples: [
          { tokens: [["der","art"],["Mann","s"],["dessen","pron"],["Auto","s"],["kaputt","adj"],["ist","vfin"]], en: "the man whose car is broken" },
          { tokens: [["die","art"],["Leute","s"],["denen","pron"],["ich","s"],["helfe","vfin"]], en: "dative plural" }
        ] },
      { id: "de_relative_was_wo", label_en: "was and wo", level: "B2",
        rule_en: "Use 'was' after alles, etwas, nichts, vieles, das, and after a whole clause: Das ist alles, was ich weiß. Use 'wo' for places instead of 'in dem': die Stadt, wo ich wohne.",
        reason_en: "Indefinite pronouns have no gender, so no der-form can agree with them — 'was' fills the gap.",
        examples: [
          { tokens: [["alles","o"],["was","pron"],["ich","s"],["weiß","vfin"]], en: "everything I know" },
          { tokens: [["die","art"],["Stadt","s"],["wo","pron"],["ich","s"],["wohne","vfin"]], en: "the town where I live" }
        ] }
    ],
    exceptions: [
      { title_en: "The comma is compulsory", body_en: "Unlike English, German always separates a relative clause with a comma, whether it is defining or not: Der Mann, der dort steht, ist mein Bruder. Leaving it out is a spelling error.",
        examples: [ { tokens: [["Der","art"],["Mann","s"],["der","pron"],["dort","adv"],["steht","vfin"],["ist","vfin"],["mein","art"],["Bruder","adv"]], en: "commas on both sides" } ] }
    ]
  },
  {
    id: "de_konjunktiv2", title_en: "Konjunktiv II", blurb_en: "würde · hätte · wäre · könnte", color: "teal",
    nodes: [
      { id: "de_k2_polite", label_en: "politeness", level: "A2",
        rule_en: "The most frequent use is simple courtesy: Ich hätte gern …, Ich möchte …, Könnten Sie mir helfen?, Würden Sie bitte …? It softens a request from a demand into an offer.",
        reason_en: "Learning this before the theory is worth it — you will use the polite forms daily long before you need irreal conditions.",
        examples: [
          { tokens: [["Ich","s"],["hätte","vfin"],["gern","adv"],["einen","art"],["Kaffee","o"]], en: "I'd like a coffee" },
          { tokens: [["Könnten","vfin"],["Sie","s"],["mir","io"],["helfen","vinf"]], en: "Could you help me?" }
        ] },
      { id: "de_k2_forms", label_en: "forming Konjunktiv II", level: "B1",
        rule_en: "For most verbs use 'würde' + infinitive. But the common verbs have their own forms, built from the Präteritum with an umlaut: sein → wäre, haben → hätte, können → könnte, müssen → müsste, werden → würde, wissen → wüsste, gehen → ginge, kommen → käme.",
        reason_en: "würde exists because the real forms of most verbs are now identical to the Präteritum and would be ambiguous. Where a distinct form survives, Germans use it.",
        examples: [
          { tokens: [["Ich","s"],["würde","vfin"],["das","o"],["machen","vinf"]], en: "würde for ordinary verbs" },
          { tokens: [["Ich","s"],["wäre","vfin"],["froh","adj"]], en: "never 'würde sein'" },
          { tokens: [["Ich","s"],["hätte","vfin"],["Zeit","o"]], en: "never 'würde haben'" }
        ] },
      { id: "de_k2_irreal", label_en: "unreal conditions", level: "B1",
        rule_en: "'Wenn' + Konjunktiv II in both halves: Wenn ich Zeit hätte, würde ich kommen. The wenn-clause sends its verb to the end; if it comes first, the main clause begins with its verb.",
        reason_en: "German marks the hypothesis in BOTH clauses, unlike English which keeps 'would' in only one. 'Wenn ich Zeit habe' would mean a real possibility instead.",
        examples: [
          { tokens: [["Wenn","conn"],["ich","s"],["Zeit","o"],["hätte","vfin"],["würde","vfin"],["ich","s"],["kommen","vinf"]], en: "If I had time I'd come" },
          { tokens: [["Wenn","conn"],["ich","s"],["du","s"],["wäre","vfin"]], en: "If I were you" }
        ] },
      { id: "de_k2_past", label_en: "unreal past: hätte/wäre + Partizip", level: "B2",
        rule_en: "For regrets about the past: hätte or wäre + Partizip II. Wenn ich mehr gelernt hätte, hätte ich die Prüfung bestanden. With a modal you get a double infinitive: Ich hätte kommen können.",
        reason_en: "There is only one past subjunctive in German, so this single pattern covers English 'would have', 'could have' and 'should have' alike.",
        examples: [
          { tokens: [["Ich","s"],["hätte","vfin"],["das","o"],["gesagt","vinf"]], en: "I would have said that" },
          { tokens: [["Er","s"],["wäre","vfin"],["gekommen","vinf"]], en: "He would have come" },
          { tokens: [["Ich","s"],["hätte","vfin"],["kommen","vinf"],["können","vinf"]], en: "I could have come" }
        ] }
    ],
    exceptions: [
      { title_en: "Beinahe and fast take Konjunktiv II", body_en: "'Ich wäre beinahe gefallen' — I almost fell. The event did not happen, so German marks it as unreal even though it describes something in the actual past.",
        examples: [ { tokens: [["Ich","s"],["wäre","vfin"],["fast","adv"],["gefallen","vinf"]], en: "I almost fell" } ] },
      { title_en: "als ob takes Konjunktiv II", body_en: "'Er tut so, als ob er alles wüsste' — he acts as if he knew everything. You may drop the 'ob', and then the verb moves right after 'als': als wüsste er alles.",
        examples: [ { tokens: [["als","conn"],["ob","conn"],["er","s"],["krank","adj"],["wäre","vfin"]], en: "as if he were ill" } ] }
    ]
  },
  {
    id: "de_konjunktiv1", title_en: "Konjunktiv I", blurb_en: "indirect speech in writing", color: "rose",
    nodes: [
      { id: "de_k1_forms", label_en: "forming Konjunktiv I", level: "C1",
        rule_en: "Take the infinitive stem and add -e, -est, -e, -en, -et, -en: er sage, er habe, er komme, er gehe. 'sein' is irregular and the only one used in all persons: ich sei, du seist, er sei, wir seien.",
        reason_en: "Only the er/sie/es-form is distinct from the indicative for most verbs, which is why it is the form you actually meet — usually in reported speech.",
        examples: [
          { tokens: [["Er","s"],["sagt","vfin"],["er","s"],["habe","vfin"],["keine","art"],["Zeit","o"]], en: "he says he has no time" },
          { tokens: [["Sie","s"],["sei","vfin"],["krank","adj"]], en: "she is (reportedly) ill" }
        ] },
      { id: "de_k1_usage", label_en: "reported speech", level: "C1",
        rule_en: "Journalism and formal writing use Konjunktiv I to report a claim without endorsing it: Der Minister sagte, die Lage sei stabil. In speech, people simply use 'dass' with the indicative instead.",
        reason_en: "It is a distancing device. Switching to Konjunktiv I signals 'these are their words, not mine' — a nuance English can only add with 'allegedly'.",
        examples: [
          { tokens: [["Der","art"],["Minister","s"],["sagte","vfin"],["die","art"],["Lage","s"],["sei","vfin"],["stabil","adj"]], en: "reported, not endorsed" },
          { tokens: [["Er","s"],["sagte","vfin"],["dass","conn"],["die","art"],["Lage","s"],["stabil","adj"],["ist","vfin"]], en: "spoken alternative" }
        ] }
    ],
    exceptions: [
      { title_en: "When Konjunktiv I looks like the indicative, switch to II", body_en: "'sie haben' is the same in both, so reported speech falls back on Konjunktiv II: 'Sie sagten, sie hätten keine Zeit.' This substitution is standard, not sloppy.",
        examples: [ { tokens: [["Sie","s"],["sagten","vfin"],["sie","s"],["hätten","vfin"],["keine","art"],["Zeit","o"]], en: "K1 would be ambiguous → K2" } ] }
    ]
  },
  {
    id: "de_passive", title_en: "Passive", blurb_en: "werden + Partizip II", color: "amber",
    nodes: [
      { id: "de_passive_present", label_en: "werden + Partizip II", level: "B1",
        rule_en: "The passive is werden (conjugated) + Partizip II at the end: Das Haus wird gebaut. The agent, if mentioned, takes 'von' + dative for a person and 'durch' + accusative for a means or cause.",
        reason_en: "German uses the passive far more than English in official and technical writing, precisely because it lets the agent disappear.",
        examples: [
          { tokens: [["Das","art"],["Haus","s"],["wird","vfin"],["gebaut","vinf"]], en: "The house is being built" },
          { tokens: [["Das","art"],["Buch","s"],["wird","vfin"],["von","prep"],["ihm","adv"],["gelesen","vinf"]], en: "by him — person → von" },
          { tokens: [["Die","art"],["Stadt","s"],["wurde","vfin"],["durch","prep"],["ein","art"],["Feuer","adv"],["zerstört","vinf"]], en: "by fire — cause → durch" }
        ], links: ["de_sein_haben_werden"] },
      { id: "de_passive_tenses", label_en: "passive in other tenses", level: "B1",
        rule_en: "Präteritum: wurde + PII. Perfekt: ist + PII + WORDEN (not geworden). Futur: wird + PII + werden. The odd 'worden' is the giveaway that you are reading a passive.",
        reason_en: "'worden' is a special participle of werden used only in the passive, which keeps it distinct from 'geworden' meaning 'became'.",
        examples: [
          { tokens: [["Das","art"],["Haus","s"],["wurde","vfin"],["gebaut","vinf"]], en: "was built" },
          { tokens: [["Das","art"],["Haus","s"],["ist","vfin"],["gebaut","vinf"],["worden","vinf"]], en: "has been built" },
          { tokens: [["Er","s"],["ist","vfin"],["Arzt","adv"],["geworden","vinf"]], en: "he became a doctor — different word" }
        ] },
      { id: "de_passive_modal", label_en: "passive with a modal", level: "B2",
        rule_en: "modal + Partizip II + werden, all at the end: Das muss gemacht werden. Das kann repariert werden. The modal is the only conjugated part.",
        reason_en: "The verb bracket simply gets longer — the pattern is the same as any modal, with the passive infinitive 'gemacht werden' filling the final slot.",
        examples: [
          { tokens: [["Das","s"],["muss","vfin"],["gemacht","vinf"],["werden","vinf"]], en: "That must be done" },
          { tokens: [["Es","s"],["kann","vfin"],["repariert","vinf"],["werden","vinf"]], en: "It can be repaired" }
        ] },
      { id: "de_zustandspassiv", label_en: "sein + Partizip II (the result)", level: "B2",
        rule_en: "'werden' describes the action happening; 'sein' describes the finished state. Die Tür wird geschlossen = it is being closed. Die Tür ist geschlossen = it is closed.",
        reason_en: "English uses 'is closed' for both, so this distinction has to be learned deliberately. Ask whether you mean the process or the result.",
        examples: [
          { tokens: [["Das","art"],["Geschäft","s"],["wird","vfin"],["geschlossen","vinf"]], en: "is being closed — action" },
          { tokens: [["Das","art"],["Geschäft","s"],["ist","vfin"],["geschlossen","vinf"]], en: "is closed — state" }
        ] }
    ],
    exceptions: [
      { title_en: "The subjectless passive", body_en: "German can build a passive with no subject at all, usually about activity in general: 'Hier wird gearbeitet' (work is going on here), 'Es wird getanzt'. The 'es' disappears as soon as anything else takes position one.",
        examples: [ { tokens: [["Hier","adv"],["wird","vfin"],["gearbeitet","vinf"]], en: "no subject at all" } ] },
      { title_en: "Common ways to avoid the passive", body_en: "man + active (Man baut das Haus), sich lassen + infinitive (Das lässt sich reparieren = that can be fixed), and adjectives in -bar (essbar, machbar). All three are more idiomatic in speech than the full passive.",
        examples: [ { tokens: [["Das","s"],["lässt","vfin"],["sich","refl"],["reparieren","vinf"]], en: "that can be repaired" } ] }
    ]
  },
  {
    id: "de_reflexive", title_en: "Reflexive verbs", blurb_en: "sich freuen · sich die Hände waschen", color: "indigo",
    nodes: [
      { id: "de_reflexive_akk", label_en: "accusative reflexive", level: "A2",
        rule_en: "mich, dich, sich, uns, euch, sich. Many German verbs are reflexive where English is not: sich freuen, sich setzen, sich erinnern, sich beeilen, sich fühlen, sich ausruhen, sich befinden.",
        reason_en: "The reflexive pronoun is part of the verb's identity here, not an object you could leave out — 'ich freue' is simply not a sentence.",
        examples: [
          { tokens: [["Ich","s"],["freue","vfin"],["mich","refl"]], en: "I'm glad" },
          { tokens: [["Setz","vfin"],["dich","refl"]], en: "Sit down" },
          { tokens: [["Er","s"],["erinnert","vfin"],["sich","refl"],["nicht","neg"]], en: "He doesn't remember" }
        ] },
      { id: "de_reflexive_dat", label_en: "dative reflexive", level: "B1",
        rule_en: "When the verb already has a direct object, the reflexive switches to dative: mir, dir, sich, uns, euch, sich. Ich wasche mich (I wash myself) vs Ich wasche mir die Hände (I wash my hands).",
        reason_en: "The accusative slot is taken by the real object, so the person benefiting moves to the dative — the same logic as any indirect object. Only mir/dir differ in form.",
        examples: [
          { tokens: [["Ich","s"],["wasche","vfin"],["mich","refl"]], en: "accusative — myself" },
          { tokens: [["Ich","s"],["wasche","vfin"],["mir","refl"],["die","art"],["Hände","o"]], en: "dative — the hands are the object" },
          { tokens: [["Ich","s"],["kaufe","vfin"],["mir","refl"],["ein","art"],["Auto","o"]], en: "I'm buying myself a car" }
        ], links: ["de_dativ"] },
      { id: "de_reciprocal", label_en: "each other", level: "B1",
        rule_en: "Plural reflexives are ambiguous between 'themselves' and 'each other'. Use 'einander' or 'gegenseitig' to force the reciprocal reading: Sie helfen einander. With a preposition it fuses: miteinander, voneinander.",
        reason_en: "'Sie waschen sich' could mean they wash themselves or each other; einander removes the doubt where it matters.",
        examples: [
          { tokens: [["Sie","s"],["helfen","vfin"],["einander","refl"]], en: "they help each other" },
          { tokens: [["Wir","s"],["sprechen","vfin"],["miteinander","adv"]], en: "we talk to each other" }
        ] }
    ],
    exceptions: [
      { title_en: "Reflexive verbs with a fixed preposition", body_en: "sich freuen AUF (look forward to) vs sich freuen ÜBER (be glad about); sich interessieren FÜR; sich kümmern UM; sich erinnern AN; sich gewöhnen AN; sich ärgern ÜBER. Learn verb + reflexive + preposition as one unit.",
        examples: [
          { tokens: [["Ich","s"],["freue","vfin"],["mich","refl"],["auf","prep"],["den","art"],["Urlaub","adv"]], en: "looking forward to" },
          { tokens: [["Ich","s"],["freue","vfin"],["mich","refl"],["über","prep"],["das","art"],["Geschenk","adv"]], en: "glad about" }
        ] },
      { title_en: "sich covers he, she, it and they", body_en: "There is no 'sie waschen sie' for 'they wash themselves' — the third person always uses 'sich', singular and plural, accusative and dative alike. It is also the only form that never changes.",
        examples: [ { tokens: [["Sie","s"],["waschen","vfin"],["sich","refl"]], en: "sich for all third persons" } ] }
    ]
  },
  {
    id: "de_infinitive", title_en: "Infinitive constructions", blurb_en: "zu · um … zu · ohne … zu", color: "teal",
    nodes: [
      { id: "de_zu_infinitive", label_en: "zu + Infinitiv", level: "A2",
        rule_en: "After verbs like versuchen, vergessen, anfangen, aufhören, hoffen, beschließen, and after adjectives (Es ist wichtig, …), the second verb takes 'zu' and goes to the end: Ich versuche, früh aufzustehen.",
        reason_en: "'zu' marks the infinitive as dependent on something else, exactly like English 'to'. The comma is optional in modern spelling but usual when the clause is long.",
        examples: [
          { tokens: [["Ich","s"],["versuche","vfin"],["zu","part"],["schlafen","vinf"]], en: "I'm trying to sleep" },
          { tokens: [["Es","s"],["ist","vfin"],["wichtig","adj"],["zu","part"],["üben","vinf"]], en: "It's important to practise" },
          { tokens: [["Ich","s"],["habe","vfin"],["vergessen","vinf"],["anzurufen","vinf"]], en: "an-zu-rufen, one word" }
        ], links: ["de_prefix_both"] },
      { id: "de_no_zu", label_en: "verbs that take no zu", level: "A2",
        rule_en: "No 'zu' after the modals, and none after werden, sehen, hören, lassen, gehen, fahren, bleiben, lernen, helfen: Ich höre ihn singen. Ich gehe schwimmen. Ich lasse das Auto reparieren.",
        reason_en: "These verbs treat the infinitive as a direct continuation of themselves rather than as a separate action, so nothing links them.",
        examples: [
          { tokens: [["Ich","s"],["gehe","vfin"],["schwimmen","vinf"]], en: "I'm going swimming" },
          { tokens: [["Ich","s"],["höre","vfin"],["ihn","o"],["singen","vinf"]], en: "I hear him singing" },
          { tokens: [["Ich","s"],["lasse","vfin"],["das","art"],["Auto","o"],["reparieren","vinf"]], en: "I'm having the car repaired" }
        ], links: ["de_modal_forms"] },
      { id: "de_um_zu", label_en: "um … zu (in order to)", level: "A2",
        rule_en: "'um … zu' expresses purpose and requires the SAME subject in both halves: Ich lerne Deutsch, um in Wien zu arbeiten. If the subjects differ, use 'damit' with a full clause instead.",
        reason_en: "The infinitive has no subject of its own, so it can only borrow the main clause's. Different subjects therefore need a conjunction that allows one.",
        examples: [
          { tokens: [["Ich","s"],["lerne","vfin"],["Deutsch","o"],["um","conn"],["dort","adv"],["zu","part"],["arbeiten","vinf"]], en: "same subject → um … zu" },
          { tokens: [["Ich","s"],["spreche","vfin"],["langsam","adv"],["damit","conn"],["du","s"],["mich","o"],["verstehst","vfin"]], en: "different subject → damit" }
        ] },
      { id: "de_ohne_statt_zu", label_en: "ohne … zu · (an)statt … zu", level: "B1",
        rule_en: "'ohne … zu' = without doing; '(an)statt … zu' = instead of doing. Both need the same subject in both halves, and both put 'zu' + infinitive at the end.",
        reason_en: "They work identically to um … zu, which makes them cheap to learn once that pattern is solid.",
        examples: [
          { tokens: [["Er","s"],["ging","vfin"],["ohne","conn"],["etwas","o"],["zu","part"],["sagen","vinf"]], en: "He left without saying anything" },
          { tokens: [["Statt","conn"],["zu","part"],["arbeiten","vinf"],["schläft","vfin"],["er","s"]], en: "Instead of working, he sleeps" }
        ] }
    ],
    exceptions: [
      { title_en: "brauchen + zu only in the negative", body_en: "'Du brauchst nicht zu kommen' = you don't need to come. Positively, German uses müssen instead: Du musst kommen. In casual speech the 'zu' is often dropped: Du brauchst nicht kommen.",
        examples: [ { tokens: [["Du","s"],["brauchst","vfin"],["nicht","neg"],["zu","part"],["kommen","vinf"]], en: "you don't need to come" } ] }
    ]
  },
  {
    id: "de_particles", title_en: "Modal particles", blurb_en: "doch · mal · ja · denn · halt", color: "rose",
    nodes: [
      { id: "de_particles_common", label_en: "doch · mal · ja · eben", level: "B1",
        rule_en: "Small unstressed words that colour the sentence rather than adding meaning: 'doch' (contradicting or urging), 'mal' (softening, casual), 'ja' (as we both know), 'eben/halt' (that's just how it is), 'schon' (reassuring).",
        reason_en: "Leaving them out is grammatically fine but makes German sound blunt or robotic. They are the main thing separating textbook German from natural German.",
        examples: [
          { tokens: [["Komm","vfin"],["doch","adv"],["mit","part"]], en: "Do come along — warmer than a plain imperative" },
          { tokens: [["Warte","vfin"],["mal","adv"]], en: "Hang on a sec" },
          { tokens: [["Das","s"],["ist","vfin"],["ja","adv"],["toll","adj"]], en: "Well that IS great — surprise" },
          { tokens: [["Das","s"],["ist","vfin"],["halt","adv"],["so","adv"]], en: "That's just how it is" }
        ] },
      { id: "de_particles_questions", label_en: "denn · eigentlich · wohl", level: "B2",
        rule_en: "'denn' in a question shows interest rather than interrogation (Wie heißt du denn?). 'eigentlich' means 'by the way, actually'. 'wohl' marks a guess (Er ist wohl krank = he's probably ill).",
        reason_en: "A German question without 'denn' can sound like an interrogation. Adding it is the difference between a police officer and a friend asking.",
        examples: [
          { tokens: [["Wo","q"],["warst","vfin"],["du","s"],["denn","adv"]], en: "So where were you? — curious, not accusing" },
          { tokens: [["Was","q"],["machst","vfin"],["du","s"],["eigentlich","adv"],["beruflich","adv"]], en: "What do you actually do for work?" },
          { tokens: [["Er","s"],["ist","vfin"],["wohl","adv"],["krank","adj"]], en: "He's probably ill" }
        ] }
    ],
    exceptions: [
      { title_en: "The same word can be a particle or a real word", body_en: "'doch' as an answer means 'yes I do' and is stressed; as a particle it is unstressed and untranslatable. 'ja' as an answer means yes; inside a sentence it means 'as you know'. Stress is what separates them.",
        examples: [
          { tokens: [["Doch","adv"]], en: "stressed: yes I do!" },
          { tokens: [["Komm","vfin"],["doch","adv"]], en: "unstressed: do come" }
        ] },
      { title_en: "They live in the middle field", body_en: "Particles never take position one and never come last. They sit right after the verb and the pronouns: 'Kannst du mir mal helfen?' — never 'Mal kannst du…'.",
        examples: [ { tokens: [["Kannst","vfin"],["du","s"],["mir","io"],["mal","adv"],["helfen","vinf"]], en: "after the pronouns" } ] }
    ]
  }
];
