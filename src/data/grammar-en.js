// English grammar map. Same shape as the Dutch data: clusters → nodes.
// Example `en` fields are short glosses on nuance, since the sentences are English.
window.GRAM_EN = [
  {
    id: "en_articles", title_en: "Articles", blurb_en: "a · an · the · zero", color: "amber",
    nodes: [
      { id: "en_a_an", label_en: "a vs an", level: "A1",
        rule_en: "Use 'an' before a vowel SOUND, 'a' before a consonant sound. It is the sound that counts, not the letter: an hour, a university, an MP.",
        reason_en: "The n exists purely to stop two vowels colliding, so it follows pronunciation rather than spelling.",
        examples: [
          { tokens: [["an","art"],["hour","o"]], en: "silent h → vowel sound" },
          { tokens: [["a","art"],["university","o"]], en: "starts with a 'yoo' sound → a" },
          { tokens: [["an","art"],["honest","adj"],["answer","o"]], en: "silent h again" }
        ], links: ["en_the"] },
      { id: "en_the", label_en: "the (definite)", level: "A1",
        rule_en: "'the' marks something both speaker and listener can identify: mentioned before, unique, or made specific by context.",
        reason_en: "English has no case endings, so articles do much of the work of signalling what is already known.",
        examples: [
          { tokens: [["I","s"],["bought","vfin"],["a","art"],["book","o"]], en: "first mention → a" },
          { tokens: [["The","art"],["book","s"],["was","vfin"],["good","adj"]], en: "second mention → the" },
          { tokens: [["the","art"],["sun","o"]], en: "unique thing → the" }
        ], links: ["en_zero"] },
      { id: "en_zero", label_en: "zero article", level: "A2",
        rule_en: "Use no article for plural and uncountable nouns spoken about in general: Dogs are loyal. Water is wet. Also with most meals, languages, and 'go to bed/work/school'.",
        reason_en: "A general class is not a specific identifiable thing, so nothing needs marking.",
        examples: [
          { tokens: [["Dogs","s"],["are","vfin"],["loyal","adj"]], en: "dogs in general" },
          { tokens: [["I","s"],["go","vfin"],["to","prep"],["bed","o"]], en: "institution, not the object" },
          { tokens: [["She","s"],["speaks","vfin"],["Spanish","o"]], en: "languages take no article" }
        ] }
    ],
    exceptions: [
      { title_en: "the with superlatives, rivers and plural countries", body_en: "Always 'the' before a superlative (the best), before rivers, seas and mountain ranges (the Danube, the Alps), and before plural country names (the Netherlands, the USA) — but not singular ones (Hungary, France).",
        examples: [ { tokens: [["the","art"],["Netherlands","o"]], en: "plural name → the" }, { tokens: [["the","art"],["best","adj"],["one","o"]], en: "superlative always takes the" } ] }
    ]
  },
  {
    id: "en_nouns", title_en: "Nouns", blurb_en: "plural · countable · possessive", color: "indigo",
    nodes: [
      { id: "en_plural", label_en: "regular plural -s", level: "A1",
        rule_en: "Add -s; add -es after s, x, z, ch, sh; a consonant + y becomes -ies (city → cities).",
        reason_en: "The -es forms exist because an extra vowel is needed to pronounce the s at all after a hissing sound.",
        examples: [
          { tokens: [["books","s"]], en: "regular" },
          { tokens: [["boxes","s"]], en: "after x → -es" },
          { tokens: [["cities","s"]], en: "consonant + y → -ies" }
        ] },
      { id: "en_countable", label_en: "countable vs uncountable", level: "A2",
        rule_en: "Uncountable nouns take no plural and no 'a': information, advice, furniture, news, money, luggage. Quantify them with a phrase: a piece of advice.",
        reason_en: "These nouns name substances or masses rather than separable units, so counting them needs a container word.",
        examples: [
          { tokens: [["some","adj"],["advice","o"]], en: "never 'advices'" },
          { tokens: [["a","art"],["piece","o"],["of","prep"],["furniture","o"]], en: "counted via a unit word" },
          { tokens: [["The","art"],["news","s"],["is","vfin"],["good","adj"]], en: "news is singular" }
        ], links: ["en_quantifiers"] },
      { id: "en_possessive", label_en: "possessive 's", level: "A1",
        rule_en: "Add 's to a singular noun, and just an apostrophe to a plural already ending in s: the boy's book, the boys' books.",
        reason_en: "It is the worn-down remains of an Old English genitive ending, not a contraction of 'his'.",
        examples: [
          { tokens: [["the","art"],["boy's","s"],["book","o"]], en: "one boy" },
          { tokens: [["the","art"],["boys'","s"],["books","o"]], en: "several boys" },
          { tokens: [["the","art"],["children's","s"],["room","o"]], en: "irregular plural → 's" }
        ] },
      { id: "en_quantifiers", label_en: "much · many · few · little", level: "A2",
        rule_en: "'many / few / fewer' go with countables, 'much / little / less' with uncountables. 'A few' means some; 'few' means not enough.",
        reason_en: "The split mirrors the countable distinction, and the article changes 'few' from negative to positive.",
        examples: [
          { tokens: [["many","adj"],["people","o"]], en: "countable" },
          { tokens: [["much","adj"],["time","o"]], en: "uncountable" },
          { tokens: [["a","art"],["few","adj"],["friends","o"]], en: "some friends — positive" }
        ] }
    ],
    exceptions: [
      { title_en: "Irregular plurals", body_en: "man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice, person → people. A few are unchanged: sheep, fish, series, species.",
        examples: [ { tokens: [["children","s"]], en: "not 'childs'" }, { tokens: [["two","adj"],["sheep","s"]], en: "unchanged in plural" } ] }
    ]
  },
  {
    id: "en_present", title_en: "Present tenses", blurb_en: "simple vs continuous", color: "teal",
    nodes: [
      { id: "en_pres_simple", label_en: "present simple", level: "A1",
        rule_en: "Used for habits, permanent situations and general truths. Add -s in the third person singular: he works. Questions and negatives use do/does.",
        reason_en: "The -s is all that survives of a full set of Old English person endings.",
        examples: [
          { tokens: [["I","s"],["work","vfin"],["every","adj"],["day","adv"]], en: "habit" },
          { tokens: [["She","s"],["works","vfin"],["in","prep"],["Utrecht","adv"]], en: "third person -s" },
          { tokens: [["Water","s"],["boils","vfin"],["at","prep"],["100°C","adv"]], en: "general truth" }
        ], links: ["en_pres_cont", "en_do_support"] },
      { id: "en_pres_cont", label_en: "present continuous", level: "A1",
        rule_en: "am/is/are + -ing, for what is happening now or around now, and for temporary situations and fixed future arrangements.",
        reason_en: "The -ing form describes an action in progress, so it frames the moment rather than the habit.",
        examples: [
          { tokens: [["I","s"],["am","vfin"],["working","vinf"],["now","adv"]], en: "in progress" },
          { tokens: [["She","s"],["is","vfin"],["living","vinf"],["here","adv"],["this","adj"],["year","adv"]], en: "temporary" },
          { tokens: [["We","s"],["are","vfin"],["meeting","vinf"],["at","prep"],["six","adv"]], en: "fixed arrangement → future" }
        ], links: ["en_stative"] },
      { id: "en_stative", label_en: "stative verbs", level: "A2",
        rule_en: "Verbs of state are not normally used in the continuous: know, believe, want, need, like, love, hate, own, seem, understand.",
        reason_en: "A state has no progress to be in the middle of, so the continuous has nothing to describe.",
        examples: [
          { tokens: [["I","s"],["know","vfin"],["the","art"],["answer","o"]], en: "not 'I am knowing'" },
          { tokens: [["She","s"],["wants","vfin"],["coffee","o"]], en: "not 'is wanting'" }
        ] },
      { id: "en_do_support", label_en: "do-support", level: "A1",
        rule_en: "Simple tenses need do/does/did to form questions and negatives, and the main verb goes back to its base form: She works → Does she work? She doesn't work.",
        reason_en: "English lost the ability to invert ordinary verbs, so a dummy auxiliary took over the job.",
        examples: [
          { tokens: [["Do","vfin"],["you","s"],["speak","vinf"],["Dutch","o"]], en: "question" },
          { tokens: [["She","s"],["doesn't","neg"],["work","vinf"],["here","adv"]], en: "-s moves to does, not work" },
          { tokens: [["I","s"],["didn't","neg"],["see","vinf"],["it","o"]], en: "past: didn't + base form" }
        ] }
    ]
  },
  {
    id: "en_past", title_en: "Past tenses", blurb_en: "simple · continuous · used to", color: "rose",
    nodes: [
      { id: "en_past_simple", label_en: "past simple", level: "A1",
        rule_en: "Regular verbs add -ed; irregular verbs change form. Used for finished actions at a finished time: I saw him yesterday.",
        reason_en: "The -ed ending is the regular ('weak') pattern that gradually replaced older vowel-change verbs.",
        examples: [
          { tokens: [["I","s"],["worked","vfin"],["yesterday","adv"]], en: "regular" },
          { tokens: [["She","s"],["went","vfin"],["home","adv"]], en: "irregular: go → went" },
          { tokens: [["We","s"],["saw","vfin"],["the","art"],["film","o"]], en: "finished time" }
        ], links: ["en_pres_perf"] },
      { id: "en_past_cont", label_en: "past continuous", level: "A2",
        rule_en: "was/were + -ing, for an action in progress in the past, often interrupted by a past simple: I was cooking when he called.",
        reason_en: "The continuous supplies the background; the simple supplies the event that cuts into it.",
        examples: [
          { tokens: [["I","s"],["was","vfin"],["cooking","vinf"],["when","conn"],["he","s"],["called","vfin"]], en: "background + interruption" },
          { tokens: [["They","s"],["were","vfin"],["waiting","vinf"]], en: "in progress in the past" }
        ] },
      { id: "en_used_to", label_en: "used to / would", level: "B1",
        rule_en: "'used to' describes past habits and past states that are no longer true. 'would' can replace it for repeated actions, but not for states.",
        reason_en: "'would' expresses repetition, and a state is not repeated, so 'I would live there' does not work.",
        examples: [
          { tokens: [["I","s"],["used","vfin"],["to","part"],["smoke","vinf"]], en: "former habit, now stopped" },
          { tokens: [["We","s"],["would","vfin"],["play","vinf"],["outside","adv"]], en: "repeated past action" }
        ] }
    ],
    exceptions: [
      { title_en: "High-frequency irregular verbs", body_en: "go→went→gone, be→was/were→been, have→had→had, do→did→done, see→saw→seen, take→took→taken, come→came→come, get→got→got(ten), give→gave→given, make→made→made. Roughly 200 exist, but a few dozen cover most speech.",
        examples: [ { tokens: [["went","vfin"]], en: "past of go" }, { tokens: [["taken","vinf"]], en: "past participle of take" } ] }
    ]
  },
  {
    id: "en_perfect", title_en: "Perfect tenses", blurb_en: "the hardest area for most learners", color: "amber",
    nodes: [
      { id: "en_pres_perf", label_en: "present perfect", level: "A2",
        rule_en: "have/has + past participle. Used when the past event still matters now: unfinished time, life experience, or a present result. Never with a finished time expression.",
        reason_en: "The tense links past to present, so naming a closed past time ('yesterday') contradicts it.",
        examples: [
          { tokens: [["I","s"],["have","vfin"],["lost","vinf"],["my","adj"],["keys","o"]], en: "present result: they're still lost" },
          { tokens: [["She","s"],["has","vfin"],["been","vinf"],["to","prep"],["Japan","adv"]], en: "life experience" },
          { tokens: [["I","s"],["saw","vfin"],["him","o"],["yesterday","adv"]], en: "finished time → past simple, NOT perfect" }
        ], links: ["en_for_since", "en_past_simple"] },
      { id: "en_for_since", label_en: "for vs since", level: "A2",
        rule_en: "'for' + a length of time (for three years), 'since' + a starting point (since 2020). Both usually go with the present perfect for situations still going on.",
        reason_en: "One measures duration, the other fixes an origin; the perfect ties both to now.",
        examples: [
          { tokens: [["I've","s"],["lived","vfin"],["here","adv"],["for","prep"],["ten","adj"],["years","adv"]], en: "duration" },
          { tokens: [["I've","s"],["known","vfin"],["her","o"],["since","prep"],["2010","adv"]], en: "starting point" }
        ] },
      { id: "en_perf_cont", label_en: "present perfect continuous", level: "B1",
        rule_en: "have/has been + -ing, emphasising the duration or the ongoing nature of an activity rather than its result: I've been waiting for an hour.",
        reason_en: "The simple perfect points at the outcome; the continuous points at the stretch of time itself.",
        examples: [
          { tokens: [["I've","s"],["been","vfin"],["waiting","vinf"],["for","prep"],["an","art"],["hour","adv"]], en: "duration is the point" },
          { tokens: [["I've","s"],["written","vfin"],["three","adj"],["emails","o"]], en: "result is the point → simple perfect" }
        ] },
      { id: "en_past_perf", label_en: "past perfect", level: "B1",
        rule_en: "had + past participle, for an event earlier than another past event: When I arrived, she had already left.",
        reason_en: "It creates a second layer of past, making the order of two past events explicit.",
        examples: [
          { tokens: [["She","s"],["had","vfin"],["left","vinf"],["before","conn"],["I","s"],["arrived","vfin"]], en: "leaving happened first" }
        ] }
    ],
    exceptions: [
      { title_en: "British and American usage differ", body_en: "British English prefers the present perfect with just, already and yet (I've just eaten). American English often uses the past simple (I just ate). Both are accepted internationally.",
        examples: [ { tokens: [["I've","s"],["just","adv"],["eaten","vinf"]], en: "BrE" }, { tokens: [["I","s"],["just","adv"],["ate","vfin"]], en: "AmE" } ] }
    ]
  },
  {
    id: "en_future", title_en: "Future", blurb_en: "will · going to · continuous", color: "indigo",
    nodes: [
      { id: "en_will", label_en: "will", level: "A1",
        rule_en: "'will' + base form: for decisions made at the moment of speaking, offers, promises and predictions without present evidence.",
        reason_en: "'will' began as a verb of wanting, which is why it still carries volition in offers and promises.",
        examples: [
          { tokens: [["I'll","s"],["help","vinf"],["you","o"]], en: "spontaneous offer" },
          { tokens: [["It","s"],["will","vfin"],["rain","vinf"],["tomorrow","adv"]], en: "prediction" }
        ], links: ["en_going_to"] },
      { id: "en_going_to", label_en: "going to", level: "A1",
        rule_en: "'be going to' + base form: for existing plans and intentions, and for predictions based on evidence you can see right now.",
        reason_en: "It is literally a movement toward the event, so it implies the process has already begun.",
        examples: [
          { tokens: [["I'm","s"],["going","vfin"],["to","part"],["study","vinf"],["medicine","o"]], en: "existing intention" },
          { tokens: [["Look","vfin"],["!","x"],["It's","s"],["going","vfin"],["to","part"],["fall","vinf"]], en: "evidence right now" }
        ] },
      { id: "en_fut_arrange", label_en: "present forms for the future", level: "A2",
        rule_en: "The present continuous states fixed personal arrangements (I'm meeting her at six); the present simple states timetables (The train leaves at nine).",
        reason_en: "Something already scheduled is treated as a present fact rather than a prediction.",
        examples: [
          { tokens: [["I'm","s"],["seeing","vfin"],["the","art"],["dentist","o"],["tomorrow","adv"]], en: "arrangement" },
          { tokens: [["The","art"],["train","s"],["leaves","vfin"],["at","prep"],["nine","adv"]], en: "timetable" }
        ] }
    ]
  },
  {
    id: "en_modals", title_en: "Modal verbs", blurb_en: "can · must · should · might", color: "teal",
    nodes: [
      { id: "en_modal_form", label_en: "how modals behave", level: "A2",
        rule_en: "Modals take no -s, no 'to' and no do-support: She can swim. Can she swim? She can't swim.",
        reason_en: "They are survivors of an old verb class that never took the ordinary endings.",
        examples: [
          { tokens: [["She","s"],["can","vfin"],["swim","vinf"]], en: "no 'to', no -s" },
          { tokens: [["Can","vfin"],["she","s"],["swim","vinf"]], en: "inverts directly, no 'do'" }
        ], links: ["en_do_support"] },
      { id: "en_must_have_to", label_en: "must vs have to", level: "A2",
        rule_en: "'must' = obligation from the speaker; 'have to' = obligation from outside rules. Crucially, 'mustn't' (prohibition) and 'don't have to' (no obligation) mean opposite things.",
        reason_en: "The negation attaches to different parts: mustn't negates the action, don't have to negates the obligation.",
        examples: [
          { tokens: [["You","s"],["mustn't","neg"],["smoke","vinf"],["here","adv"]], en: "prohibited" },
          { tokens: [["You","s"],["don't","neg"],["have","vfin"],["to","part"],["come","vinf"]], en: "optional — not a prohibition" }
        ] },
      { id: "en_modal_deduce", label_en: "must / might / can't for deduction", level: "B1",
        rule_en: "'must be' = I'm sure it is; 'might/may/could be' = possible; 'can't be' = I'm sure it isn't. Note that 'mustn't' is never used for deduction.",
        reason_en: "English splits certainty across modals, using 'can't' rather than 'mustn't' as the negative of 'must'.",
        examples: [
          { tokens: [["He","s"],["must","vfin"],["be","vinf"],["tired","adj"]], en: "confident conclusion" },
          { tokens: [["She","s"],["can't","neg"],["be","vinf"],["serious","adj"]], en: "confident negative conclusion" }
        ] },
      { id: "en_modal_past", label_en: "modal + have + participle", level: "B2",
        rule_en: "For past speculation or regret: must have been (sure it happened), might have gone (possible), should have told (regret or criticism).",
        reason_en: "Modals have no past form of their own, so 'have + participle' supplies the past instead.",
        examples: [
          { tokens: [["You","s"],["should","vfin"],["have","vinf"],["told","vinf"],["me","o"]], en: "criticism about the past" },
          { tokens: [["They","s"],["must","vfin"],["have","vinf"],["left","vinf"]], en: "confident conclusion about the past" }
        ] }
    ]
  },
  {
    id: "en_cond", title_en: "Conditionals", blurb_en: "if-clauses", color: "rose",
    nodes: [
      { id: "en_cond_01", label_en: "zero and first conditional", level: "A2",
        rule_en: "Zero: if + present, present — for things always true. First: if + present, will — for a real future possibility. Never use 'will' inside the if-clause.",
        reason_en: "The if-clause states the condition as a fact under discussion, and English marks that with the present.",
        examples: [
          { tokens: [["If","conn"],["you","s"],["heat","vfin"],["ice","o"],[",","x"],["it","s"],["melts","vfin"]], en: "always true" },
          { tokens: [["If","conn"],["it","s"],["rains","vfin"],[",","x"],["we'll","s"],["stay","vinf"],["home","adv"]], en: "real possibility" }
        ], links: ["en_cond_23"] },
      { id: "en_cond_23", label_en: "second and third conditional", level: "B1",
        rule_en: "Second: if + past, would + base — for unreal or unlikely present. Third: if + past perfect, would have + participle — for an impossible past.",
        reason_en: "Shifting the tense one step back signals distance from reality rather than distance in time.",
        examples: [
          { tokens: [["If","conn"],["I","s"],["had","vfin"],["money","o"],[",","x"],["I'd","s"],["travel","vinf"]], en: "unreal present" },
          { tokens: [["If","conn"],["I","s"],["had","vfin"],["known","vinf"],[",","x"],["I","s"],["would","vfin"],["have","vinf"],["come","vinf"]], en: "impossible past" }
        ] },
      { id: "en_wish", label_en: "wish and if only", level: "B2",
        rule_en: "'wish' + past for an unreal present (I wish I had more time), 'wish' + past perfect for regret (I wish I had studied), 'wish' + would for annoyance at someone's behaviour.",
        reason_en: "Same backshift as the conditionals: one step back means unreal, not past.",
        examples: [
          { tokens: [["I","s"],["wish","vfin"],["I","s"],["knew","vfin"]], en: "but I don't — present" },
          { tokens: [["I","s"],["wish","vfin"],["I","s"],["had","vfin"],["studied","vinf"]], en: "regret about the past" }
        ] }
    ],
    exceptions: [
      { title_en: "'were' for all persons", body_en: "In the second conditional, formal English uses 'were' for every person: If I were you… 'If I was' is common in speech but avoided in writing.",
        examples: [ { tokens: [["If","conn"],["I","s"],["were","vfin"],["you","o"]], en: "fixed expression" } ] }
    ]
  },
  {
    id: "en_order", title_en: "Word order & questions", blurb_en: "SVO · inversion · tags", color: "amber",
    nodes: [
      { id: "en_svo", label_en: "subject–verb–object is fixed", level: "A1",
        rule_en: "English has almost no case endings, so position is what marks meaning. The dog bit the man and The man bit the dog are entirely different.",
        reason_en: "When the old endings eroded, word order had to take over their job — the opposite trade-off from Hungarian.",
        examples: [
          { tokens: [["The","art"],["dog","s"],["bit","vfin"],["the","art"],["man","o"]], en: "position determines who did it" }
        ], links: ["en_adv_place"] },
      { id: "en_questions", label_en: "question formation", level: "A1",
        rule_en: "Invert the subject and the auxiliary: She is here → Is she here? With no auxiliary, add do/does/did. Question words go first: Where do you live?",
        reason_en: "Only auxiliaries can move in modern English, which is why 'do' has to be inserted when none is present.",
        examples: [
          { tokens: [["Where","q"],["do","vfin"],["you","s"],["live","vinf"]], en: "question word + do" },
          { tokens: [["Have","vfin"],["you","s"],["seen","vinf"],["it","o"]], en: "auxiliary already present" }
        ], links: ["en_do_support", "en_indirect_q"] },
      { id: "en_indirect_q", label_en: "indirect questions keep statement order", level: "B1",
        rule_en: "After phrases like 'Do you know…' or 'I wonder…', do NOT invert: Do you know where he lives? — not 'where does he live'.",
        reason_en: "The inner clause is an object, not a question, so it keeps normal statement order.",
        examples: [
          { tokens: [["Do","vfin"],["you","s"],["know","vinf"],["where","q"],["he","s"],["lives","vfin"]], en: "no inversion inside" },
          { tokens: [["I","s"],["wonder","vfin"],["what","q"],["time","o"],["it","s"],["is","vfin"]], en: "statement order" }
        ] },
      { id: "en_adj_order", label_en: "adjective order", level: "B1",
        rule_en: "Multiple adjectives follow a fixed sequence: opinion, size, age, shape, colour, origin, material, purpose — a lovely little old round red Italian wooden table.",
        reason_en: "The order runs from most subjective to most inherent to the object.",
        examples: [
          { tokens: [["a","art"],["nice","adj"],["big","adj"],["old","adj"],["house","o"]], en: "opinion, size, age" },
          { tokens: [["a","art"],["red","adj"],["Italian","adj"],["car","o"]], en: "colour before origin" }
        ] },
      { id: "en_adv_place", label_en: "adverb placement", level: "A2",
        rule_en: "Adverbs of frequency go before the main verb but after 'be': She always works. She is always late. Never split the verb from its object.",
        reason_en: "'be' behaves like an auxiliary, and auxiliaries attract the adverb to their right.",
        examples: [
          { tokens: [["She","s"],["always","adv"],["works","vfin"],["late","adv"]], en: "before the main verb" },
          { tokens: [["She","s"],["is","vfin"],["always","adv"],["late","adj"]], en: "after 'be'" },
          { tokens: [["I","s"],["speak","vfin"],["English","o"],["well","adv"]], en: "not 'speak well English'" }
        ] },
      { id: "en_tags", label_en: "question tags", level: "B1",
        rule_en: "A tag reverses the polarity of the main clause and repeats its auxiliary: You're coming, aren't you? She doesn't smoke, does she?",
        reason_en: "The tag is a compressed question, so it needs the auxiliary the statement would use.",
        examples: [
          { tokens: [["You're","s"],["coming","vfin"],[",","x"],["aren't","neg"],["you","s"]], en: "positive → negative tag" },
          { tokens: [["He","s"],["can't","neg"],["swim","vinf"],[",","x"],["can","vfin"],["he","s"]], en: "negative → positive tag" }
        ] }
    ]
  },
  {
    id: "en_nonfinite", title_en: "Gerunds & infinitives", blurb_en: "-ing vs to-", color: "indigo",
    nodes: [
      { id: "en_ger_inf", label_en: "which verbs take which", level: "B1",
        rule_en: "Some verbs take -ing (enjoy, avoid, finish, suggest, mind), others take 'to' (want, decide, hope, promise, agree). All prepositions are followed by -ing.",
        reason_en: "Broadly, -ing suits actions viewed as ongoing or already real; 'to' suits ones still ahead or intended.",
        examples: [
          { tokens: [["I","s"],["enjoy","vfin"],["reading","vinf"]], en: "enjoy + -ing" },
          { tokens: [["I","s"],["want","vfin"],["to","part"],["read","vinf"]], en: "want + to" },
          { tokens: [["good","adj"],["at","prep"],["cooking","vinf"]], en: "preposition → -ing" }
        ], links: ["en_ger_meaning"] },
      { id: "en_ger_meaning", label_en: "verbs that change meaning", level: "B2",
        rule_en: "A few verbs take both with different meanings: stop smoking (quit) vs stop to smoke (pause in order to); remember posting (memory) vs remember to post (obligation).",
        reason_en: "The -ing form points back at something real; the to-form points forward at a purpose.",
        examples: [
          { tokens: [["He","s"],["stopped","vfin"],["smoking","vinf"]], en: "he quit" },
          { tokens: [["He","s"],["stopped","vfin"],["to","part"],["smoke","vinf"]], en: "he paused in order to smoke" }
        ] }
    ]
  },
  {
    id: "en_passive", title_en: "Passive & reported speech", blurb_en: "be + participle · backshift", color: "teal",
    nodes: [
      { id: "en_passive_form", label_en: "the passive", level: "B1",
        rule_en: "be + past participle. Used when the doer is unknown, obvious or unimportant. Add the doer with 'by' only if it matters.",
        reason_en: "It promotes the affected thing to subject position, which is where English puts what a sentence is about.",
        examples: [
          { tokens: [["The","art"],["house","s"],["was","vfin"],["built","vinf"],["in","prep"],["1920","adv"]], en: "doer irrelevant" },
          { tokens: [["My","adj"],["bike","s"],["has","vfin"],["been","vinf"],["stolen","vinf"]], en: "doer unknown" }
        ] },
      { id: "en_reported", label_en: "reported speech", level: "B1",
        rule_en: "Tenses usually shift one step back: present → past, past → past perfect, will → would. Pronouns and time words shift too: tomorrow → the next day.",
        reason_en: "Reporting moves the vantage point into the past, so everything is measured from there instead.",
        examples: [
          { tokens: [["He","s"],["said","vfin"],["he","s"],["was","vfin"],["tired","adj"]], en: "'I am tired' → backshifted" },
          { tokens: [["She","s"],["asked","vfin"],["where","q"],["I","s"],["lived","vfin"]], en: "no inversion in reported questions" }
        ], links: ["en_indirect_q"] }
    ],
    exceptions: [
      { title_en: "No backshift for things still true", body_en: "If the statement is still valid, the tense may stay: He said he lives in London (and still does). Both forms are correct.",
        examples: [ { tokens: [["He","s"],["said","vfin"],["he","s"],["lives","vfin"],["here","adv"]], en: "still true → no shift needed" } ] }
    ]
  },
  {
    id: "en_prep", title_en: "Prepositions & phrasal verbs", blurb_en: "in · on · at · get up", color: "rose",
    nodes: [
      { id: "en_prep_time", label_en: "in / on / at — time", level: "A1",
        rule_en: "'at' for clock times (at six), 'on' for days and dates (on Monday), 'in' for longer periods (in July, in 2020, in the morning).",
        reason_en: "The scale grows with the preposition: a point, a surface-like day, a container-like month.",
        examples: [
          { tokens: [["at","prep"],["six","adv"]], en: "clock time" },
          { tokens: [["on","prep"],["Monday","adv"]], en: "day" },
          { tokens: [["in","prep"],["July","adv"]], en: "month" }
        ] },
      { id: "en_prep_place", label_en: "in / on / at — place", level: "A1",
        rule_en: "'in' for enclosed spaces (in the room), 'on' for surfaces and lines (on the table, on the bus), 'at' for points and locations (at the station, at work).",
        reason_en: "The same point / surface / container logic applies to space as to time.",
        examples: [
          { tokens: [["in","prep"],["the","art"],["room","adv"]], en: "enclosed" },
          { tokens: [["on","prep"],["the","art"],["table","adv"]], en: "surface" },
          { tokens: [["at","prep"],["the","art"],["station","adv"]], en: "point" }
        ] },
      { id: "en_phrasal", label_en: "phrasal verbs: separable or not", level: "B1",
        rule_en: "Many phrasal verbs can be split: turn the light off / turn off the light. But a PRONOUN must go in the middle: turn it off, never 'turn off it'.",
        reason_en: "Pronouns carry no new information, so English refuses to leave them in the stressed final position.",
        examples: [
          { tokens: [["Turn","vfin"],["off","part"],["the","art"],["light","o"]], en: "either order with a noun" },
          { tokens: [["Turn","vfin"],["it","o"],["off","part"]], en: "pronoun must split the verb" }
        ] }
    ],
    exceptions: [
      { title_en: "Inseparable phrasal verbs", body_en: "Some never split, even with a pronoun: look after (someone), look for, get on with, run into. You say 'look after him', never 'look him after'.",
        examples: [ { tokens: [["look","vfin"],["after","part"],["him","o"]], en: "cannot be split" } ] }
    ]
  }
];
