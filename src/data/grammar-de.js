// German grammar map — part 1: articles, cases, nouns, pronouns, present tense,
// word order, past tenses, future, modals, prefixes, prepositions.
// Same shape as the Dutch and English data: clusters → nodes (+ exceptions).
window.GRAM_DE = [
  {
    id: "de_articles", title_en: "Articles and gender", blurb_en: "der · die · das · ein · kein", color: "amber",
    nodes: [
      { id: "de_der_die_das", label_en: "der · die · das", level: "A1",
        rule_en: "Every noun has one of three genders and carries its article with it: der (masculine), die (feminine), das (neuter). In the plural all three become die. The gender is part of the word — learn 'die Tür', never bare 'Tür'.",
        reason_en: "German still marks case on the article rather than on the noun, so the article is the piece that does the grammatical work. Get the gender wrong and every case ending after it goes wrong too.",
        examples: [
          { tokens: [["der","art"],["Tisch","s"]], en: "the table — masculine" },
          { tokens: [["die","art"],["Tür","s"]], en: "the door — feminine" },
          { tokens: [["das","art"],["Fenster","s"]], en: "the window — neuter" },
          { tokens: [["die","art"],["Tische","s"]], en: "plural is die for every gender" }
        ], links: ["de_gender_clues", "de_nominativ_akkusativ"] },
      { id: "de_gender_clues", label_en: "guessing the gender", level: "A1",
        rule_en: "Endings predict gender reliably: -ung, -heit, -keit, -schaft, -ion, -tät, -ei are feminine; -chen and -lein are neuter (das Mädchen); -er for a male doer, -ling, -ismus are masculine; -ment, -um, -tum are neuter. Days, months, seasons and weather are masculine.",
        reason_en: "These endings are suffixes with a fixed gender of their own, so the gender is a property of the suffix, not of the meaning. That is why 'das Mädchen' (girl) is neuter — -chen wins over sense.",
        examples: [
          { tokens: [["die","art"],["Zeitung","s"]], en: "-ung → always feminine" },
          { tokens: [["das","art"],["Mädchen","s"]], en: "-chen → neuter, despite meaning 'girl'" },
          { tokens: [["der","art"],["Montag","s"]], en: "days of the week are masculine" }
        ], links: ["de_plural"] },
      { id: "de_ein_kein", label_en: "ein · eine · kein", level: "A1",
        rule_en: "'ein/eine' is the indefinite article and has no plural. 'kein/keine' is its negative and DOES have a plural — it is what you use to say 'no / not any' before a noun.",
        reason_en: "German negates nouns with a word of their own rather than with 'nicht'. 'kein' is literally 'ein' with a negative k- on the front, and it declines identically.",
        examples: [
          { tokens: [["ein","art"],["Hund","s"]], en: "a dog" },
          { tokens: [["Ich","s"],["habe","vfin"],["kein","art"],["Geld","o"]], en: "I have no money" },
          { tokens: [["keine","art"],["Kinder","s"]], en: "no children — kein has a plural, ein does not" }
        ], links: ["de_nicht_kein"] }
    ],
    exceptions: [
      { title_en: "Compound nouns take the gender of the LAST part", body_en: "die Hand + der Schuh = der Handschuh (glove). das Haus + die Tür = die Haustür. The final element decides the gender and the plural, which makes even very long compounds predictable.",
        examples: [
          { tokens: [["der","art"],["Handschuh","s"]], en: "der Schuh decides, not die Hand" },
          { tokens: [["die","art"],["Haustür","s"]], en: "die Tür decides" }
        ] },
      { title_en: "A few nouns have two genders and two meanings", body_en: "der See (lake) vs die See (sea); der Band (volume of a book) vs das Band (ribbon); der Leiter (manager) vs die Leiter (ladder); das Tor (gate, goal) vs der Tor (fool). The article is the only thing distinguishing them.",
        examples: [
          { tokens: [["der","art"],["See","s"]], en: "the lake" },
          { tokens: [["die","art"],["See","s"]], en: "the sea" }
        ] }
    ]
  },
  {
    id: "de_cases", title_en: "The four cases", blurb_en: "Nominativ · Akkusativ · Dativ · Genitiv", color: "indigo",
    nodes: [
      { id: "de_nominativ_akkusativ", label_en: "Nominativ vs Akkusativ", level: "A1",
        rule_en: "Nominative = who is doing it (the subject). Accusative = who or what it is being done to (the direct object). Only the masculine changes visibly: der → den, ein → einen. Feminine, neuter and plural look identical in both.",
        reason_en: "This is why word order can move around in German: the case ending, not the position, says who did what. 'Den Hund sieht der Mann' still means the man sees the dog.",
        examples: [
          { tokens: [["Der","art"],["Mann","s"],["sieht","vfin"],["den","art"],["Hund","o"]], en: "The man sees the dog" },
          { tokens: [["Den","art"],["Hund","o"],["sieht","vfin"],["der","art"],["Mann","s"]], en: "same meaning — the endings carry it, not the order" },
          { tokens: [["Ich","s"],["kaufe","vfin"],["einen","art"],["Tisch","o"]], en: "ein → einen in the accusative" }
        ], links: ["de_dativ", "de_v2"] },
      { id: "de_dativ", label_en: "Dativ", level: "A2",
        rule_en: "Dative = the receiver or beneficiary — the indirect object. Forms: der → dem, die → der, das → dem, plural die → den, and the plural noun adds -n (den Kindern). It is also forced by certain prepositions and certain verbs.",
        reason_en: "The dative marks who something happens FOR or TO, which is why it also fits 'to me', 'for the child' and location prepositions — all of them are about a point something reaches or rests at.",
        examples: [
          { tokens: [["Ich","s"],["gebe","vfin"],["dem","art"],["Kind","io"],["ein","art"],["Buch","o"]], en: "I give the child a book" },
          { tokens: [["mit","prep"],["der","art"],["Frau","adv"]], en: "die → der after a dative preposition" },
          { tokens: [["mit","prep"],["den","art"],["Kindern","adv"]], en: "dative plural adds -n to the noun too" }
        ], links: ["de_dative_verbs", "de_prep_dat"] },
      { id: "de_dative_verbs", label_en: "verbs that demand Dativ", level: "A2",
        rule_en: "Some verbs take a dative object where English uses a plain object: helfen, danken, gratulieren, antworten, folgen, gehören, gefallen, passen, schmecken, glauben (a person), begegnen. There is no logic to deduce — learn them as a list.",
        reason_en: "These verbs describe something directed AT a person rather than something done to them, which historically demanded the dative. Modern German keeps the case even where the sense has faded.",
        examples: [
          { tokens: [["Ich","s"],["helfe","vfin"],["dir","io"]], en: "I help you — dir, not dich" },
          { tokens: [["Das","s"],["gefällt","vfin"],["mir","io"]], en: "I like that (literally: that pleases to-me)" },
          { tokens: [["Das","s"],["Buch","s"],["gehört","vfin"],["dem","art"],["Lehrer","io"]], en: "The book belongs to the teacher" }
        ] },
      { id: "de_genitiv", label_en: "Genitiv", level: "B1",
        rule_en: "Genitive shows possession and follows a few prepositions. Forms: der/das → des (+ noun takes -s or -es), die → der, plural → der. In speech it is usually replaced by 'von' + dative.",
        reason_en: "The genitive is retreating from spoken German, so you meet it mostly in writing, fixed prepositions and set phrases — but you still have to read it.",
        examples: [
          { tokens: [["das","art"],["Auto","s"],["des","art"],["Mannes","adv"]], en: "the man's car — written style" },
          { tokens: [["das","art"],["Auto","s"],["von","prep"],["dem","art"],["Mann","adv"]], en: "same thing, spoken style" },
          { tokens: [["wegen","prep"],["des","art"],["Wetters","adv"]], en: "because of the weather" }
        ], links: ["de_prep_gen"] }
    ],
    exceptions: [
      { title_en: "Only masculine shows the accusative", body_en: "This is the single most useful shortcut in German: if the noun is feminine, neuter or plural, the nominative and accusative are spelled the same. All your accusative effort goes into masculine nouns.",
        examples: [
          { tokens: [["Ich","s"],["sehe","vfin"],["die","art"],["Frau","o"]], en: "die stays die" },
          { tokens: [["Ich","s"],["sehe","vfin"],["den","art"],["Mann","o"]], en: "der becomes den" }
        ] },
      { title_en: "Proper names take a plain -s for possession", body_en: "Annas Buch, Peters Auto — no apostrophe in standard German (Anna's Buch is a common error copied from English). If the name already ends in s, x or z, use an apostrophe: Max' Auto.",
        examples: [ { tokens: [["Annas","adv"],["Buch","s"]], en: "Anna's book — no apostrophe" } ] }
    ]
  },
  {
    id: "de_nouns", title_en: "Nouns", blurb_en: "capitals · plural · n-declension", color: "teal",
    nodes: [
      { id: "de_capitals", label_en: "every noun is capitalised", level: "A1",
        rule_en: "All nouns are written with a capital letter, wherever they appear. Anything turned into a noun is capitalised too: das Essen (the food/eating), das Schöne (the beautiful thing), beim Lesen (while reading).",
        reason_en: "It is a spelling rule with a grammatical payoff — capitalisation tells you instantly which word in a long sentence is the noun, which makes German easier to parse than it looks.",
        examples: [
          { tokens: [["Das","art"],["Haus","s"],["ist","vfin"],["groß","adj"]], en: "The house is big" },
          { tokens: [["beim","prep"],["Lesen","adv"]], en: "verb turned into a noun → capital" }
        ] },
      { id: "de_plural", label_en: "the five plural patterns", level: "A1",
        rule_en: "German has no single plural ending. Five patterns: -e (der Tisch → die Tische), -er + umlaut (das Kind → die Kinder, das Haus → die Häuser), -(e)n (die Frau → die Frauen), -s (das Auto → die Autos), and no ending, sometimes with umlaut (der Lehrer → die Lehrer, der Vater → die Väter).",
        reason_en: "The patterns are historical noun classes, not rules you can derive. One reliable hint: feminine nouns almost always take -(e)n, and -s is for recent loanwords.",
        examples: [
          { tokens: [["die","art"],["Tische","s"]], en: "-e" },
          { tokens: [["die","art"],["Häuser","s"]], en: "-er with umlaut" },
          { tokens: [["die","art"],["Frauen","s"]], en: "-(e)n — the feminine default" },
          { tokens: [["die","art"],["Autos","s"]], en: "-s for loanwords" }
        ], links: ["de_dativ"] },
      { id: "de_ndeklination", label_en: "n-declension (weak nouns)", level: "B1",
        rule_en: "A group of masculine nouns adds -(e)n in EVERY case except the nominative singular: der Junge → den/dem/des Jungen; der Student, der Kollege, der Mensch, der Nachbar, der Herr (den Herrn, plural die Herren).",
        reason_en: "These are the last survivors of an old weak declension. They are mostly masculine nouns for people, and mostly end in -e, -ent, -ist, -ant or -oge.",
        examples: [
          { tokens: [["Ich","s"],["sehe","vfin"],["den","art"],["Studenten","o"]], en: "not 'den Student'" },
          { tokens: [["mit","prep"],["dem","art"],["Kollegen","adv"]], en: "dative also takes -n" },
          { tokens: [["der","art"],["Name","s"],["des","art"],["Namens","adv"]], en: "der Name is mixed: -ns in the genitive" }
        ] }
    ],
    exceptions: [
      { title_en: "Nouns that exist only in the plural", body_en: "die Eltern (parents), die Leute (people), die Ferien (holidays), die Geschwister (siblings). There is no singular, so 'die Leute sind' — never 'die Leute ist'.",
        examples: [ { tokens: [["Die","art"],["Leute","s"],["sind","vfin"],["nett","adj"]], en: "always plural agreement" } ] },
      { title_en: "The plural -n is added again in the dative", body_en: "Dative plural nouns take an extra -n unless the plural already ends in -n or -s: die Kinder → mit den Kindern, die Häuser → in den Häusern. But die Frauen → mit den Frauen, die Autos → in den Autos.",
        examples: [ { tokens: [["in","prep"],["den","art"],["Häusern","adv"]], en: "Häuser + n" } ] }
    ]
  },
  {
    id: "de_pronouns", title_en: "Pronouns", blurb_en: "ich · mich · mir · du vs Sie · man", color: "rose",
    nodes: [
      { id: "de_personal_pronouns", label_en: "personal pronouns by case", level: "A1",
        rule_en: "Nominative ich, du, er, sie, es, wir, ihr, sie/Sie. Accusative mich, dich, ihn, sie, es, uns, euch, sie/Sie. Dative mir, dir, ihm, ihr, ihm, uns, euch, ihnen/Ihnen. Note er → ihn (accusative) → ihm (dative).",
        reason_en: "Pronouns preserve case distinctions that nouns have lost, so they are where the case system is most visible — and where mistakes are most audible.",
        examples: [
          { tokens: [["Ich","s"],["sehe","vfin"],["ihn","o"]], en: "I see him" },
          { tokens: [["Ich","s"],["helfe","vfin"],["ihm","io"]], en: "I help him — dative verb" },
          { tokens: [["Er","s"],["gibt","vfin"],["mir","io"],["das","art"],["Buch","o"]], en: "He gives me the book" }
        ], links: ["de_dative_verbs", "de_pronoun_order"] },
      { id: "de_du_sie", label_en: "du · ihr · Sie", level: "A1",
        rule_en: "'du' = one person you know; 'ihr' = several people you know; 'Sie' = formal, one or several, and always written with a capital S. Sie takes the same verb form as the plural 'sie' (Sie sind, sie sind).",
        reason_en: "Choosing wrongly is a social error rather than a grammatical one, which is why it matters more than most rules. Default to Sie with strangers and in writing until invited otherwise.",
        examples: [
          { tokens: [["Wie","q"],["heißt","vfin"],["du","s"]], en: "informal, one person" },
          { tokens: [["Wie","q"],["heißen","vfin"],["Sie","s"]], en: "formal — capital S always" },
          { tokens: [["Wo","q"],["seid","vfin"],["ihr","s"]], en: "informal plural" }
        ] },
      { id: "de_man_es", label_en: "man and dummy es", level: "A2",
        rule_en: "'man' = one / you / people in general, and always takes the er-form: man sagt, man kann. It is not 'ein Mann'. 'es' also fills an empty subject slot in weather and impersonal sentences: es regnet, es gibt, es geht mir gut.",
        reason_en: "German sentences need a subject in position one, so 'es' exists to occupy it when there is nothing real to put there — exactly like English 'it is raining'.",
        examples: [
          { tokens: [["Man","s"],["darf","vfin"],["hier","adv"],["nicht","neg"],["rauchen","vinf"]], en: "You may not smoke here" },
          { tokens: [["Es","s"],["regnet","vfin"]], en: "It's raining" },
          { tokens: [["Es","s"],["gibt","vfin"],["ein","art"],["Problem","o"]], en: "There is a problem — es gibt + accusative" }
        ] }
    ],
    exceptions: [
      { title_en: "Pronoun gender follows the noun, not the sense", body_en: "Because 'das Mädchen' is neuter, strict grammar calls it 'es'. Because 'der Tisch' is masculine, you refer to a table as 'er'. In everyday speech people often switch to 'sie' for a girl — but 'er' for a table is not optional.",
        examples: [ { tokens: [["Wo","q"],["ist","vfin"],["der","art"],["Tisch","s"],["Er","s"],["ist","vfin"],["dort","adv"]], en: "the table = 'he'" } ] }
    ]
  },
  {
    id: "de_present", title_en: "Present tense", blurb_en: "regular · stem change · sein/haben", color: "amber",
    nodes: [
      { id: "de_present_regular", label_en: "regular present endings", level: "A1",
        rule_en: "Take the infinitive, drop -en, add: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. machen → ich mache, du machst, er macht, wir machen, ihr macht, sie machen.",
        reason_en: "Only three distinct forms do most of the work (-e, -st, -t), which is why German present tense is far simpler than its reputation.",
        examples: [
          { tokens: [["Ich","s"],["mache","vfin"],["das","o"]], en: "I do that" },
          { tokens: [["Du","s"],["machst","vfin"],["das","o"]], en: "you do that" },
          { tokens: [["Wir","s"],["machen","vfin"],["das","o"]], en: "we do that" }
        ], links: ["de_present_future"] },
      { id: "de_stem_change", label_en: "vowel change in du/er forms", level: "A1",
        rule_en: "Many strong verbs change their stem vowel in the du- and er/sie/es-forms only: e → i (sprechen → du sprichst, er spricht), e → ie (sehen → du siehst, er sieht), a → ä (fahren → du fährst, er fährt), au → äu (laufen → er läuft).",
        reason_en: "The change is old vowel mutation triggered by an ending that has since disappeared. It never touches ich, wir, ihr or sie — so only two forms per verb need memorising.",
        examples: [
          { tokens: [["Er","s"],["spricht","vfin"],["Deutsch","o"]], en: "e → i" },
          { tokens: [["Du","s"],["fährst","vfin"],["nach","prep"],["Berlin","adv"]], en: "a → ä" },
          { tokens: [["Ich","s"],["fahre","vfin"],["nach","prep"],["Berlin","adv"]], en: "ich is untouched" }
        ] },
      { id: "de_sein_haben_werden", label_en: "sein · haben · werden", level: "A1",
        rule_en: "sein: bin, bist, ist, sind, seid, sind. haben: habe, hast, hat, haben, habt, haben. werden: werde, wirst, wird, werden, werdet, werden. These three are irregular and build the perfect, the future and the passive, so they are worth over-learning.",
        reason_en: "Almost every compound tense in German is one of these three plus another verb form, which is why they earn their irregularity.",
        examples: [
          { tokens: [["Ich","s"],["bin","vfin"],["müde","adj"]], en: "I'm tired" },
          { tokens: [["Er","s"],["hat","vfin"],["Zeit","o"]], en: "He has time" },
          { tokens: [["Es","s"],["wird","vfin"],["kalt","adj"]], en: "It's getting cold" }
        ], links: ["de_perfekt_form", "de_futur1", "de_passive_present"] }
    ],
    exceptions: [
      { title_en: "Stems ending in -t, -d or a consonant cluster add -e-", body_en: "arbeiten → du arbeitest, er arbeitet, ihr arbeitet. finden → du findest. atmen → du atmest. Without the extra -e- the ending would be unpronounceable.",
        examples: [ { tokens: [["Er","s"],["arbeitet","vfin"],["viel","adv"]], en: "arbeit + e + t" } ] },
      { title_en: "Stems ending in s, ß, z or x lose the -s of -st", body_en: "heißen → du heißt (not du heißst), sitzen → du sitzt, lesen → du liest. The du- and er-forms end up identical.",
        examples: [ { tokens: [["Du","s"],["heißt","vfin"],["Anna","adv"]], en: "du heißt, er heißt — same form" } ] }
    ]
  },
  {
    id: "de_wordorder", title_en: "Word order", blurb_en: "verb second · verb final · TeKaMoLo", color: "indigo",
    nodes: [
      { id: "de_v2", label_en: "the finite verb is second", level: "A1",
        rule_en: "In a main clause the conjugated verb is always the SECOND element — not the second word. Whatever you put first (subject, time, object, whole phrase), the verb follows immediately and the subject moves behind it.",
        reason_en: "This one rule explains most 'strange' German word order. Position one is a free slot for whatever you want to emphasise; position two is nailed down.",
        examples: [
          { tokens: [["Ich","s"],["gehe","vfin"],["morgen","adv"],["ins","prep"],["Kino","adv"]], en: "I'm going to the cinema tomorrow" },
          { tokens: [["Morgen","adv"],["gehe","vfin"],["ich","s"],["ins","prep"],["Kino","adv"]], en: "time first → verb still second, subject after it" },
          { tokens: [["Ins","prep"],["Kino","adv"],["gehe","vfin"],["ich","s"],["morgen","adv"]], en: "any element can take position one" }
        ], links: ["de_verb_bracket", "de_subordinating"] },
      { id: "de_verb_bracket", label_en: "the verb bracket (Satzklammer)", level: "A2",
        rule_en: "When a sentence has two verb parts, they split: the conjugated part stays in position two and the rest (infinitive, participle, separable prefix) goes to the very end. Everything else is trapped between them.",
        reason_en: "This is why German sentences feel suspenseful — the part that tells you what actually happened arrives last. Recognising the bracket is the key to understanding long sentences.",
        examples: [
          { tokens: [["Ich","s"],["habe","vfin"],["gestern","adv"],["einen","art"],["Film","o"],["gesehen","vinf"]], en: "habe … gesehen bracket the middle" },
          { tokens: [["Ich","s"],["muss","vfin"],["heute","adv"],["arbeiten","vinf"]], en: "modal … infinitive" },
          { tokens: [["Ich","s"],["stehe","vfin"],["um","prep"],["sieben","adv"],["auf","part"]], en: "separable prefix goes last" }
        ], links: ["de_separable_present", "de_perfekt_form"] },
      { id: "de_tekamolo", label_en: "TeKaMoLo — order of adverbials", level: "B1",
        rule_en: "When several adverbials appear in the middle field, the neutral order is Temporal (when) → Kausal (why) → Modal (how) → Lokal (where). Moving one out of order marks it as emphasised.",
        reason_en: "German has no fixed positions for adverbials, so it uses a default sequence instead. Break it deliberately and you have emphasis; break it accidentally and you sound foreign.",
        examples: [
          { tokens: [["Ich","s"],["fahre","vfin"],["morgen","adv"],["wegen","prep"],["der","art"],["Arbeit","adv"],["mit","prep"],["dem","art"],["Zug","adv"],["nach","prep"],["Köln","adv"]], en: "time → cause → manner → place" },
          { tokens: [["Er","s"],["kommt","vfin"],["heute","adv"],["mit","prep"],["dem","art"],["Auto","adv"]], en: "time before manner" }
        ] },
      { id: "de_pronoun_order", label_en: "two objects: which comes first", level: "B1",
        rule_en: "Two nouns → dative before accusative (Ich gebe dem Kind das Buch). Any pronoun jumps forward, and with two pronouns the ACCUSATIVE comes first (Ich gebe es ihm). Rule of thumb: pronouns early, and the shorter/known information first.",
        reason_en: "German orders the middle field by how known the information is, not by grammatical rank. Pronouns are maximally known, so they move left.",
        examples: [
          { tokens: [["Ich","s"],["gebe","vfin"],["dem","art"],["Kind","io"],["das","art"],["Buch","o"]], en: "noun + noun → dative first" },
          { tokens: [["Ich","s"],["gebe","vfin"],["es","o"],["dem","art"],["Kind","io"]], en: "accusative pronoun jumps ahead" },
          { tokens: [["Ich","s"],["gebe","vfin"],["es","o"],["ihm","io"]], en: "two pronouns → accusative first" }
        ] }
    ],
    exceptions: [
      { title_en: "Position one holds exactly one element", body_en: "'Gestern ich bin ins Kino gegangen' is wrong — gestern and ich cannot both be first. Pick one and the other goes after the verb. A whole subordinate clause, however, counts as a single element: 'Weil es regnet, bleibe ich zu Hause.'",
        examples: [
          { tokens: [["Weil","conn"],["es","s"],["regnet","vfin"],["bleibe","vfin"],["ich","s"],["zu","prep"],["Hause","adv"]], en: "the whole clause is element one, so bleibe is second" }
        ] },
      { title_en: "Yes/no questions and imperatives put the verb first", body_en: "The verb-second rule applies to statements. Questions without a question word, imperatives, and some conditional clauses start with the verb: 'Kommst du?', 'Komm her!', 'Hätte ich Zeit, …'.",
        examples: [ { tokens: [["Kommst","vfin"],["du","s"],["mit","part"]], en: "verb first = question" } ] }
    ]
  },
  {
    id: "de_perfekt", title_en: "Perfekt", blurb_en: "haben/sein + Partizip II", color: "teal",
    nodes: [
      { id: "de_perfekt_form", label_en: "building the Perfekt", level: "A1",
        rule_en: "haben or sein in position two + the Partizip II at the end. Weak verbs: ge- + stem + -t (gemacht). Strong verbs: ge- + stem + -en, often with a vowel change (gesehen, gefunden, gegangen).",
        reason_en: "The Perfekt is the normal spoken past in German — where English would say 'I did', German says 'I have done'. Do not read it as a present perfect.",
        examples: [
          { tokens: [["Ich","s"],["habe","vfin"],["das","o"],["gemacht","vinf"]], en: "I did that (spoken past)" },
          { tokens: [["Wir","s"],["haben","vfin"],["den","art"],["Film","o"],["gesehen","vinf"]], en: "strong verb → -en" },
          { tokens: [["Sie","s"],["hat","vfin"],["viel","o"],["gearbeitet","vinf"]], en: "stem in -t → -et" }
        ], links: ["de_haben_sein", "de_verb_bracket"] },
      { id: "de_haben_sein", label_en: "haben or sein?", level: "A2",
        rule_en: "Use 'sein' with verbs of motion from A to B (gehen, fahren, kommen, fliegen, laufen), verbs of change of state (aufstehen, einschlafen, sterben, wachsen), and with sein, werden, bleiben, passieren, gelingen. Everything else takes haben.",
        reason_en: "'sein' marks a change of position or condition — the subject ends up somewhere or something else than it started. That single idea covers almost the whole list.",
        examples: [
          { tokens: [["Ich","s"],["bin","vfin"],["nach","prep"],["Berlin","adv"],["gefahren","vinf"]], en: "motion A → B" },
          { tokens: [["Er","s"],["ist","vfin"],["eingeschlafen","vinf"]], en: "change of state" },
          { tokens: [["Ich","s"],["habe","vfin"],["Auto","o"],["gefahren","vinf"]], en: "same verb + object → haben (I drove a car)" }
        ] },
      { id: "de_partizip_special", label_en: "participles without ge-", level: "A2",
        rule_en: "No ge- for verbs ending in -ieren (studieren → studiert) and for inseparable prefixes be-, emp-, ent-, er-, ge-, miss-, ver-, zer- (verstehen → verstanden). Separable verbs put ge- in the MIDDLE: aufstehen → aufgestanden.",
        reason_en: "The ge- prefix only attaches to a stressed first syllable. -ieren and the inseparable prefixes are unstressed, so there is nowhere for ge- to sit.",
        examples: [
          { tokens: [["Ich","s"],["habe","vfin"],["Medizin","o"],["studiert","vinf"]], en: "-ieren → no ge-" },
          { tokens: [["Ich","s"],["habe","vfin"],["das","o"],["verstanden","vinf"]], en: "ver- → no ge-" },
          { tokens: [["Ich","s"],["bin","vfin"],["aufgestanden","vinf"]], en: "separable → ge- in the middle" }
        ], links: ["de_inseparable"] }
    ],
    exceptions: [
      { title_en: "North vs South", body_en: "Northern Germany uses the Perfekt for nearly all spoken past; the south and Austria use it even for sein and haben ('ich bin gewesen', 'ich habe gehabt') where the north often says 'ich war', 'ich hatte'. Both are correct.",
        examples: [ { tokens: [["Ich","s"],["bin","vfin"],["dort","adv"],["gewesen","vinf"]], en: "= ich war dort" } ] },
      { title_en: "Mixed verbs take both changes", body_en: "A handful change their vowel AND take the weak -t ending: bringen → gebracht, denken → gedacht, kennen → gekannt, wissen → gewusst, nennen → genannt, brennen → gebrannt.",
        examples: [ { tokens: [["Ich","s"],["habe","vfin"],["das","o"],["gedacht","vinf"]], en: "vowel change + -t" } ] }
    ]
  },
  {
    id: "de_praeteritum", title_en: "Präteritum and Plusquamperfekt", blurb_en: "war · hatte · machte · hatte gemacht", color: "rose",
    nodes: [
      { id: "de_praeteritum_weak", label_en: "regular Präteritum", level: "A2",
        rule_en: "Weak verbs insert -te- between the stem and the ending: machen → ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten. The ich- and er-forms are identical.",
        reason_en: "This is the written narrative past. In conversation, most of Germany uses the Perfekt instead — except for the verbs in the next card.",
        examples: [
          { tokens: [["Er","s"],["machte","vfin"],["das","o"],["gestern","adv"]], en: "written style" },
          { tokens: [["Wir","s"],["arbeiteten","vfin"],["lange","adv"]], en: "stem in -t → -ete-" }
        ], links: ["de_perfekt_form"] },
      { id: "de_praeteritum_strong", label_en: "strong Präteritum", level: "B1",
        rule_en: "Strong verbs change their stem vowel and take NO ending in the ich- and er-forms: gehen → ich ging, sein → ich war, sehen → ich sah, kommen → ich kam, finden → ich fand. Other endings: -st, -en, -t, -en.",
        reason_en: "The bare ich/er-form is the giveaway that a verb is strong: 'ich ging' has no -e, unlike weak 'ich machte'.",
        examples: [
          { tokens: [["Ich","s"],["ging","vfin"],["nach","prep"],["Hause","adv"]], en: "no ending on ich" },
          { tokens: [["Du","s"],["gingst","vfin"],["nach","prep"],["Hause","adv"]], en: "-st added to the changed stem" },
          { tokens: [["Sie","s"],["kamen","vfin"],["spät","adv"]], en: "plural -en" }
        ] },
      { id: "de_plusquamperfekt", label_en: "Plusquamperfekt", level: "B1",
        rule_en: "hatte or war + Partizip II — the past before another past. Almost always paired with 'nachdem' or a Präteritum clause: Nachdem ich gegessen hatte, ging ich schlafen.",
        reason_en: "It exists to order two past events. If both events are simply past, German uses one tense; the Plusquamperfekt appears only when the sequence matters.",
        examples: [
          { tokens: [["Nachdem","conn"],["ich","s"],["gegessen","vinf"],["hatte","vfin"],["ging","vfin"],["ich","s"],["schlafen","vinf"]], en: "After I had eaten, I went to bed" },
          { tokens: [["Er","s"],["war","vfin"],["schon","adv"],["gegangen","vinf"]], en: "He had already left" }
        ] }
    ],
    exceptions: [
      { title_en: "These verbs use Präteritum even in speech", body_en: "sein (war), haben (hatte), werden (wurde), the modals (konnte, musste, wollte, durfte, sollte) and es gibt (es gab). Saying 'ich habe gekonnt' instead of 'ich konnte' sounds wrong in ordinary conversation.",
        examples: [
          { tokens: [["Ich","s"],["war","vfin"],["krank","adj"]], en: "not 'ich bin krank gewesen' in normal speech" },
          { tokens: [["Ich","s"],["musste","vfin"],["arbeiten","vinf"]], en: "modals prefer Präteritum" }
        ] }
    ]
  },
  {
    id: "de_futur", title_en: "Talking about the future", blurb_en: "present + morgen · werden + Infinitiv", color: "amber",
    nodes: [
      { id: "de_present_future", label_en: "present tense for the future", level: "A1",
        rule_en: "The normal way to talk about the future is the PRESENT tense plus a time word: Morgen fahre ich nach Berlin. Nächste Woche fängt der Kurs an.",
        reason_en: "German does not need a future tense when the time is already clear from context, exactly like English 'I'm flying tomorrow'. Using werden every time sounds heavy.",
        examples: [
          { tokens: [["Morgen","adv"],["fahre","vfin"],["ich","s"],["nach","prep"],["Berlin","adv"]], en: "present form, future meaning" },
          { tokens: [["Nächstes","adj"],["Jahr","adv"],["ziehe","vfin"],["ich","s"],["um","part"]], en: "Next year I'm moving" }
        ] },
      { id: "de_futur1", label_en: "Futur I: werden + Infinitiv", level: "A2",
        rule_en: "werden (conjugated, position two) + infinitive at the end. Used for predictions, promises, intentions, and — very commonly — for present-day assumptions: Er wird wohl krank sein (he's probably ill).",
        reason_en: "Because the present already covers scheduled future, werden has drifted towards expressing certainty and supposition rather than time.",
        examples: [
          { tokens: [["Ich","s"],["werde","vfin"],["dir","io"],["helfen","vinf"]], en: "promise" },
          { tokens: [["Es","s"],["wird","vfin"],["morgen","adv"],["regnen","vinf"]], en: "prediction" },
          { tokens: [["Er","s"],["wird","vfin"],["wohl","adv"],["zu","prep"],["Hause","adv"],["sein","vinf"]], en: "assumption about NOW" }
        ], links: ["de_sein_haben_werden"] },
      { id: "de_futur2", label_en: "Futur II", level: "B2",
        rule_en: "werden + Partizip II + haben/sein: 'Er wird das vergessen haben.' Mostly used to guess about something already completed ('he'll have forgotten') rather than to place an event in the future.",
        reason_en: "Its literal 'will have done' meaning is rare; in practice it is the assumption form for the past, mirroring how Futur I is used for the present.",
        examples: [
          { tokens: [["Er","s"],["wird","vfin"],["das","o"],["vergessen","vinf"],["haben","vinf"]], en: "He'll have forgotten that" },
          { tokens: [["Sie","s"],["wird","vfin"],["schon","adv"],["angekommen","vinf"],["sein","vinf"]], en: "She'll have arrived by now" }
        ] }
    ],
    exceptions: [
      { title_en: "werden also means 'to become'", body_en: "As a full verb it takes a nominative complement: Er wird Arzt (he's becoming a doctor), Es wird kalt. Do not confuse it with the werden that builds the future or the passive.",
        examples: [ { tokens: [["Er","s"],["wird","vfin"],["Arzt","adv"]], en: "He's becoming a doctor" } ] }
    ]
  },
  {
    id: "de_modals", title_en: "Modal verbs", blurb_en: "können · müssen · dürfen · sollen · wollen · mögen", color: "indigo",
    nodes: [
      { id: "de_modal_forms", label_en: "modal forms", level: "A1",
        rule_en: "Modals change their vowel in the singular and take NO ending in ich and er/sie/es: ich kann, du kannst, er kann; ich muss, er muss; ich darf, er darf; ich will, er will; ich mag, er mag. Only sollen keeps its vowel (ich soll).",
        reason_en: "The missing -e on 'ich kann' is the same historical quirk as the strong Präteritum — modals were originally past-tense forms that shifted meaning.",
        examples: [
          { tokens: [["Ich","s"],["kann","vfin"],["schwimmen","vinf"]], en: "no -e on ich" },
          { tokens: [["Er","s"],["muss","vfin"],["arbeiten","vinf"]], en: "no -t on er" },
          { tokens: [["Wir","s"],["können","vfin"],["helfen","vinf"]], en: "plural is regular" }
        ], links: ["de_verb_bracket"] },
      { id: "de_modal_meaning", label_en: "what each modal means", level: "A2",
        rule_en: "können = ability/possibility; müssen = necessity; dürfen = permission; sollen = someone else's instruction; wollen = own will; mögen/möchte = liking/would like. Watch the negatives: 'nicht müssen' = don't have to, 'nicht dürfen' = must not.",
        reason_en: "The negative pair is the classic trap: English 'you mustn't' is German 'du darfst nicht', while 'du musst nicht' means you are free not to.",
        examples: [
          { tokens: [["Du","s"],["musst","vfin"],["nicht","neg"],["kommen","vinf"]], en: "you don't have to come" },
          { tokens: [["Du","s"],["darfst","vfin"],["nicht","neg"],["kommen","vinf"]], en: "you must not come" },
          { tokens: [["Ich","s"],["soll","vfin"],["mehr","adv"],["schlafen","vinf"]], en: "I'm supposed to sleep more" }
        ] },
      { id: "de_modal_perfekt", label_en: "modals in the past", level: "B1",
        rule_en: "In speech use the Präteritum: ich konnte, musste, wollte, durfte, sollte, mochte. If you do build a perfect with a second verb, you get a DOUBLE INFINITIVE at the end: Ich habe arbeiten müssen — never 'gemusst'.",
        reason_en: "The double infinitive is why almost everyone avoids the perfect here. The Präteritum says the same thing in fewer words, so it wins.",
        examples: [
          { tokens: [["Ich","s"],["musste","vfin"],["arbeiten","vinf"]], en: "normal spoken past" },
          { tokens: [["Ich","s"],["habe","vfin"],["arbeiten","vinf"],["müssen","vinf"]], en: "double infinitive, not 'gemusst'" },
          { tokens: [["Ich","s"],["habe","vfin"],["es","o"],["nicht","neg"],["gekonnt","vinf"]], en: "no second verb → normal participle" }
        ] }
    ],
    exceptions: [
      { title_en: "möchte is not the present of mögen", body_en: "'mögen' means to like something (Ich mag Kaffee). 'möchte' is really a subjunctive of mögen and means 'would like' (Ich möchte einen Kaffee). Its past is 'wollte'.",
        examples: [
          { tokens: [["Ich","s"],["mag","vfin"],["Kaffee","o"]], en: "I like coffee" },
          { tokens: [["Ich","s"],["möchte","vfin"],["einen","art"],["Kaffee","o"]], en: "I'd like a coffee" }
        ] },
      { title_en: "Modals can stand alone", body_en: "When the other verb is obvious it is simply left out: Ich kann Deutsch. Ich muss nach Hause. Er will nicht. Nothing is missing — this is standard.",
        examples: [ { tokens: [["Ich","s"],["muss","vfin"],["nach","prep"],["Hause","adv"]], en: "gehen is understood" } ] }
    ]
  },
  {
    id: "de_prefixes", title_en: "Separable and inseparable verbs", blurb_en: "aufstehen vs verstehen", color: "teal",
    nodes: [
      { id: "de_separable_present", label_en: "separable verbs", level: "A1",
        rule_en: "Stressed prefixes (ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, zu-, zurück-, weg-, hin-, her-) break off in a main clause and go to the very end: aufstehen → Ich stehe um sieben auf.",
        reason_en: "The prefix is a separate little word historically, and German main-clause order sends it to the end of the verb bracket. In a subordinate clause the verb rejoins it: …, weil ich um sieben aufstehe.",
        examples: [
          { tokens: [["Ich","s"],["stehe","vfin"],["um","prep"],["sieben","adv"],["auf","part"]], en: "prefix at the end" },
          { tokens: [["Der","art"],["Zug","s"],["kommt","vfin"],["um","prep"],["acht","adv"],["an","part"]], en: "ankommen → kommt … an" },
          { tokens: [["weil","conn"],["ich","s"],["um","prep"],["sieben","adv"],["aufstehe","vfin"]], en: "subordinate clause → back together" }
        ], links: ["de_verb_bracket", "de_subordinating"] },
      { id: "de_inseparable", label_en: "inseparable prefixes", level: "A2",
        rule_en: "be-, emp-, ent-, er-, ge-, miss-, ver-, zer- are unstressed and NEVER separate. They also take no ge- in the participle: verstehen → verstanden, bekommen → bekommen, erzählen → erzählt.",
        reason_en: "Stress is the whole test: if you stress the prefix it separates, if you stress the stem it does not. Say 'ÚMziehen' (to move house) versus 'umGÉHEN' (to circumvent) and you can hear it.",
        examples: [
          { tokens: [["Ich","s"],["verstehe","vfin"],["das","o"],["nicht","neg"]], en: "no separation" },
          { tokens: [["Er","s"],["hat","vfin"],["ein","art"],["Paket","o"],["bekommen","vinf"]], en: "no ge- in the participle" },
          { tokens: [["Sie","s"],["erzählt","vfin"],["eine","art"],["Geschichte","o"]], en: "er- stays attached" }
        ], links: ["de_partizip_special"] },
      { id: "de_prefix_both", label_en: "prefixes that do both", level: "B2",
        rule_en: "durch-, über-, um-, unter-, wieder- can be either, and the meaning changes with the stress. Separable = literal (Ich setze über — I cross over). Inseparable = figurative (Ich übersetze — I translate).",
        reason_en: "The literal reading keeps the prefix as a real direction word, so it behaves like one and separates. The figurative reading has fused into a single concept and stays whole.",
        examples: [
          { tokens: [["Ich","s"],["übersetze","vfin"],["den","art"],["Text","o"]], en: "I translate the text — inseparable" },
          { tokens: [["Der","art"],["Fährmann","s"],["setzt","vfin"],["uns","o"],["über","part"]], en: "he ferries us across — separable" },
          { tokens: [["Sie","s"],["umfährt","vfin"],["die","art"],["Stadt","o"]], en: "she drives around the city" }
        ] }
    ],
    exceptions: [
      { title_en: "zu goes INSIDE a separable verb", body_en: "anfangen → anzufangen, aufstehen → aufzustehen, einkaufen → einzukaufen. It is written as one word with zu wedged between prefix and stem.",
        examples: [ { tokens: [["Ich","s"],["versuche","vfin"],["früh","adv"],["aufzustehen","vinf"]], en: "auf-zu-stehen" } ] },
      { title_en: "The prefix can change the meaning completely", body_en: "stehen (stand) → verstehen (understand) → aufstehen (get up) → bestehen (pass an exam / consist of) → entstehen (come into being). Treat each as a separate word to learn, not as a variation.",
        examples: [ { tokens: [["Ich","s"],["habe","vfin"],["die","art"],["Prüfung","o"],["bestanden","vinf"]], en: "I passed the exam" } ] }
    ]
  },
  {
    id: "de_prepositions", title_en: "Prepositions", blurb_en: "which case does it take?", color: "rose",
    nodes: [
      { id: "de_prep_akk", label_en: "always Akkusativ", level: "A1",
        rule_en: "durch, für, gegen, ohne, um (and bis, entlang) always take the accusative. Memorise them as a block — 'durch für gegen ohne um' — because the case never varies.",
        reason_en: "These all express movement through, towards or against something, which is the accusative's original directional job.",
        examples: [
          { tokens: [["für","prep"],["meinen","art"],["Bruder","adv"]], en: "for my brother" },
          { tokens: [["ohne","prep"],["dich","adv"]], en: "without you" },
          { tokens: [["durch","prep"],["den","art"],["Park","adv"]], en: "through the park" }
        ] },
      { id: "de_prep_dat", label_en: "always Dativ", level: "A1",
        rule_en: "aus, außer, bei, mit, nach, seit, von, zu (and gegenüber) always take the dative. Another block worth learning by heart.",
        reason_en: "These describe origin, accompaniment or a fixed point, which is the dative's territory — nothing is crossing a boundary.",
        examples: [
          { tokens: [["mit","prep"],["dem","art"],["Auto","adv"]], en: "by car" },
          { tokens: [["bei","prep"],["meiner","art"],["Schwester","adv"]], en: "at my sister's" },
          { tokens: [["seit","prep"],["einem","art"],["Jahr","adv"]], en: "for a year now" }
        ], links: ["de_dativ"] },
      { id: "de_wechsel", label_en: "Wechselpräpositionen: Akk or Dat", level: "A2",
        rule_en: "an, auf, hinter, in, neben, über, unter, vor, zwischen take the ACCUSATIVE for movement into a new place (wohin?) and the DATIVE for position (wo?). Ich gehe in die Stadt vs Ich bin in der Stadt.",
        reason_en: "This is the clearest surviving use of the case system: accusative = crossing a boundary, dative = already there. Ask yourself 'wohin or wo' and the case follows.",
        examples: [
          { tokens: [["Ich","s"],["gehe","vfin"],["in","prep"],["die","art"],["Schule","adv"]], en: "wohin? → accusative" },
          { tokens: [["Ich","s"],["bin","vfin"],["in","prep"],["der","art"],["Schule","adv"]], en: "wo? → dative" },
          { tokens: [["Er","s"],["hängt","vfin"],["das","art"],["Bild","o"],["an","prep"],["die","art"],["Wand","adv"]], en: "putting it there → accusative" },
          { tokens: [["Das","art"],["Bild","s"],["hängt","vfin"],["an","prep"],["der","art"],["Wand","adv"]], en: "hanging there → dative" }
        ], links: ["de_nominativ_akkusativ", "de_dativ"] },
      { id: "de_prep_gen", label_en: "Genitiv prepositions", level: "B1",
        rule_en: "wegen, während, trotz, statt, innerhalb, außerhalb, aufgrund take the genitive in careful German. In speech, wegen and trotz are very often used with the dative instead.",
        reason_en: "These are relatively recent prepositions formed from nouns, which is why they still govern the genitive — and why the spoken language is quietly abandoning it.",
        examples: [
          { tokens: [["wegen","prep"],["des","art"],["Wetters","adv"]], en: "because of the weather — written" },
          { tokens: [["während","prep"],["der","art"],["Pause","adv"]], en: "during the break" },
          { tokens: [["trotz","prep"],["dem","art"],["Regen","adv"]], en: "spoken variant with dative" }
        ] },
      { id: "de_contractions", label_en: "contractions", level: "A1",
        rule_en: "Preposition + article fuse routinely: in + dem = im, in + das = ins, an + dem = am, an + das = ans, zu + dem = zum, zu + der = zur, bei + dem = beim, von + dem = vom, für + das = fürs.",
        reason_en: "The contraction is the normal form. Keeping them apart ('in dem Haus') is only done to stress THAT particular one.",
        examples: [
          { tokens: [["Ich","s"],["gehe","vfin"],["ins","prep"],["Kino","adv"]], en: "in + das" },
          { tokens: [["Wir","s"],["sind","vfin"],["im","prep"],["Park","adv"]], en: "in + dem" },
          { tokens: [["Ich","s"],["fahre","vfin"],["zur","prep"],["Arbeit","adv"]], en: "zu + der" }
        ] }
    ],
    exceptions: [
      { title_en: "Verbs come with a fixed preposition", body_en: "warten AUF (+Akk), denken AN (+Akk), sich freuen ÜBER (+Akk, about something that happened) vs sich freuen AUF (+Akk, looking forward), sprechen ÜBER/VON, teilnehmen AN (+Dat), sich interessieren FÜR. The preposition is part of the verb — learn them together.",
        examples: [
          { tokens: [["Ich","s"],["warte","vfin"],["auf","prep"],["den","art"],["Bus","adv"]], en: "wait FOR" },
          { tokens: [["Ich","s"],["freue","vfin"],["mich","refl"],["auf","prep"],["den","art"],["Urlaub","adv"]], en: "looking forward to the holiday" }
        ] },
      { title_en: "da- and wo- compounds replace pronouns for things", body_en: "You cannot say 'auf es' or 'auf was'. For a thing, fuse them: darauf, damit, davon, dafür — and for questions: worauf, womit, wovon, wofür. An -r- is inserted before a vowel (daran, worauf).",
        examples: [
          { tokens: [["Ich","s"],["warte","vfin"],["darauf","adv"]], en: "I'm waiting for it" },
          { tokens: [["Worauf","q"],["wartest","vfin"],["du","s"]], en: "What are you waiting for?" }
        ] }
    ]
  }
];
