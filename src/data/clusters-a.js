// Dutch grammar — part 1 (clusters A)

window.GRAM_CLUSTERS_A = [
  {
    id: "articles",
    title_en: "Articles", title_hu: "Névelők",
    blurb_en: "de · het · een", blurb_hu: "de · het · een",
    color: "amber",
    nodes: [
      {
        id: "de_het",
        label_en: "de vs het", label_hu: "de vs het", level: "A1",
        rule_en: "Dutch has two common-gender 'de' words (~75%) and one neuter 'het' (~25%). Plurals are ALWAYS 'de'.",
        rule_hu: "Két nem: 'de' (közös, ~75%) és 'het' (semleges, ~25%). Többes szám MINDIG 'de'.",
        reason_en: "Masculine and feminine merged into 'de'; neuter stayed apart. You must memorize het-words — there is no reliable rule.",
        reason_hu: "A hímnem és nőnem összeolvadt 'de'-vé; a semleges külön. A 'het'-szavakat memorizálni kell.",
        examples: [
          { tokens: [["de","art"],["man","o"]], en: "the man", hu: "a férfi" },
          { tokens: [["de","art"],["vrouw","o"]], en: "the woman", hu: "a nő" },
          { tokens: [["het","art"],["kind","o"]], en: "the child (neuter)", hu: "a gyerek (semleges)" },
          { tokens: [["de","art"],["kinderen","o"]], en: "the children (plural → de)", hu: "a gyerekek (többes → de)" }
        ]
      },
      {
        id: "het_patterns",
        label_en: "het-word patterns", label_hu: "het-szó minták", level: "A2",
        rule_en: "Predictable het: diminutives (-je), verbs-as-noun (het lopen), languages (het Nederlands), most countries/cities, compounds take the gender of the LAST part.",
        rule_hu: "Kiszámítható het: kicsinyítők (-je), főnevesített igék, nyelvek, legtöbb ország/város, összetételeknél az UTOLSÓ rész dönt.",
        reason_en: "Morphology beats lexicon: -je turns anything neuter; a nominalized verb is treated like an abstract noun.",
        reason_hu: "A morfológia felülírja a szótári nemet.",
        examples: [
          { tokens: [["het","art"],["meisje","o"]], en: "the girl (-je → het)", hu: "a lány (-je → het)" },
          { tokens: [["het","art"],["zwemmen","o"]], en: "swimming (verb as noun)", hu: "az úszás" },
          { tokens: [["het","art"],["Engels","o"]], en: "English (language)", hu: "az angol" },
          { tokens: [["de","art"],["auto","o"]], en: "car", hu: "az autó" },
          { tokens: [["het","art"],["autootje","o"]], en: "little car (→ het)", hu: "a kis autó (→ het)" }
        ]
      },
      {
        id: "een",
        label_en: "een (indefinite)", label_hu: "een (határozatlan)", level: "A1",
        rule_en: "Single form 'een', no gender distinction, no plural article (drop it for plural indefinite).",
        rule_hu: "Egyetlen alak 'een'; többes határozatlanban nincs névelő.",
        reason_en: "'Een' comes from the numeral 'one'; plural 'ones' doesn't exist as an article.",
        reason_hu: "Az 'een' a számnévből ered — többesben értelmetlen.",
        examples: [
          { tokens: [["een","art"],["boek","o"]], en: "a book", hu: "egy könyv" },
          { tokens: [["boeken","o"]], en: "books (no article)", hu: "könyvek (nincs névelő)" }
        ]
      },
      {
        id: "no_article",
        label_en: "no article cases", label_hu: "névelő nélkül", level: "A2",
        rule_en: "Drop the article with professions after zijn/worden, with uncountables of general sense, and in set expressions.",
        rule_hu: "Nincs névelő: foglalkozás zijn/worden után, általános értelmű megszámlálhatatlanok, állandósult kifejezések.",
        reason_en: "The profession becomes a category label, not an instance — like 'she is doctor' in many languages.",
        reason_hu: "A foglalkozás kategória, nem példány.",
        examples: [
          { tokens: [["zij","s"],["is","vfin"],["arts","o"]], en: "she is a doctor (no article!)", hu: "orvos (nincs névelő!)" },
          { tokens: [["ik","s"],["drink","vfin"],["koffie","o"]], en: "I drink coffee (general)", hu: "kávét iszom (általános)" },
          { tokens: [["op","prep"],["tijd","o"]], en: "on time (set phrase)", hu: "időben (kifejezés)" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Two genders for one word",
        title_hu: "Egy szó, két nem",
        body_en: "A handful of nouns take BOTH with a meaning shift: 'de pad' = toad, 'het pad' = path.",
        body_hu: "Néhány főnév MINDKETTŐT kapja, jelentéskülönbséggel.",
        examples: [
          { tokens: [["de","art"],["pad","o"]], en: "the toad", hu: "a béka" },
          { tokens: [["het","art"],["pad","o"]], en: "the path", hu: "az ösvény" },
          { tokens: [["de","art"],["bal","o"]], en: "the ball", hu: "a labda" },
          { tokens: [["het","art"],["bal","o"]], en: "the ball (dance)", hu: "a bál" }
        ]
      }
    ]
  },

  {
    id: "nouns",
    title_en: "Nouns", title_hu: "Főnevek",
    blurb_en: "plural · diminutive · possessive", blurb_hu: "többes · kicsinyítő · birtokos",
    color: "amber",
    nodes: [
      {
        id: "plural_en",
        label_en: "plural: -en", label_hu: "többes: -en", level: "A1",
        rule_en: "Default plural. Apply spelling: double a short vowel's consonant (man → mannen); single long vowels (boom → bomen); devoice v→f, z→s for spelling only (huis → huizen; brief → brieven).",
        rule_hu: "Alap többes. Helyesírás: rövid magánhangzó után mássalhangzó kettőzés, hosszú után egyszerűsítés.",
        reason_en: "Dutch spelling encodes syllable structure: closed syllable = short vowel, open = long. Plurals re-open the syllable.",
        reason_hu: "A helyesírás szótagszerkezetet kódol: zárt = rövid, nyílt = hosszú.",
        examples: [
          { tokens: [["boek","o"],["→","x"],["boeken","o"]], en: "book → books", hu: "könyv → könyvek" },
          { tokens: [["man","o"],["→","x"],["mannen","o"]], en: "man → men (double)", hu: "férfi → férfiak (kettőz)" },
          { tokens: [["boom","o"],["→","x"],["bomen","o"]], en: "tree → trees (drop one o)", hu: "fa → fák" },
          { tokens: [["huis","o"],["→","x"],["huizen","o"]], en: "house → houses (s → z)", hu: "ház → házak" }
        ]
      },
      {
        id: "plural_s",
        label_en: "plural: -s", label_hu: "többes: -s", level: "A1",
        rule_en: "After unstressed vowels (-el, -em, -en, -er, -je), foreign loans, and acronyms.",
        rule_hu: "Hangsúlytalan végződés után, jövevényszavaknál, betűszavaknál.",
        reason_en: "Adding -en would create ugly clusters; -s keeps pronunciation smooth.",
        reason_hu: "Az -en csúnya torlódást hozna; az -s sima marad.",
        examples: [
          { tokens: [["tafel","o"],["→","x"],["tafels","o"]], en: "table → tables", hu: "asztal → asztalok" },
          { tokens: [["meisje","o"],["→","x"],["meisjes","o"]], en: "girl → girls", hu: "lány → lányok" },
          { tokens: [["auto","o"],["→","x"],["auto's","o"]], en: "car → cars (apostrophe!)", hu: "autó → autók (aposztróf!)" }
        ]
      },
      {
        id: "diminutive",
        label_en: "diminutive -je", label_hu: "kicsinyítő -je", level: "A2",
        rule_en: "Adds 'small / cute / a bit'. Five shapes by final sound: -je (default), -tje (long vowel / -l -n -r -w), -etje (after short vowel + -l/-m/-n/-ng/-r), -pje (after long -m), -kje (after -ing, drops the g).",
        rule_hu: "Kicsinyítő: 'kicsi / kedves / egy kis'. Öt változat a szóvégtől függően.",
        reason_en: "One of Dutch's most productive suffixes — it's also lexicalized in many gendered nouns (het meisje literally 'little maiden').",
        reason_hu: "A legtermékenyebb holland képző — sok főnév állandósult kicsinyítő.",
        examples: [
          { tokens: [["boek","o"],["→","x"],["boekje","o"]], en: "book → booklet", hu: "könyv → könyvecske" },
          { tokens: [["man","o"],["→","x"],["mannetje","o"]], en: "man → little man", hu: "férfi → emberke" },
          { tokens: [["stoel","o"],["→","x"],["stoeltje","o"]], en: "chair → small chair", hu: "szék → székecske" },
          { tokens: [["boom","o"],["→","x"],["boompje","o"]], en: "tree → little tree", hu: "fa → fácska" },
          { tokens: [["koning","o"],["→","x"],["koninkje","o"]], en: "king → kinglet", hu: "király → királyocska" }
        ]
      },
      {
        id: "possessive_s",
        label_en: "possessive 's", label_hu: "birtokos 's", level: "A2",
        rule_en: "For proper names: add 's (-s for consonants, 's for vowels). Impersonal: 'van + noun'.",
        rule_hu: "Tulajdonnevekhez: 's. Egyébként 'van + főnév'.",
        reason_en: "Proper-name possessive is a leftover of the old genitive — for common nouns, periphrastic 'van' took over.",
        reason_hu: "A tulajdonnévi birtokos a régi genitivusz maradványa.",
        examples: [
          { tokens: [["Jans","s"],["boek","o"]], en: "Jan's book", hu: "Jan könyve" },
          { tokens: [["Anna's","s"],["auto","o"]], en: "Anna's car", hu: "Anna autója" },
          { tokens: [["het","art"],["boek","o"],["van","prep"],["de","art"],["man","o"]], en: "the man's book", hu: "a férfi könyve" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Irregular plurals",
        title_hu: "Rendhagyó többesek",
        body_en: "kind → kinderen (adds -er- + -en), stad → steden (vowel shift), lid → leden. Old Indo-European patterns preserved in high-frequency words.",
        body_hu: "Régi indoeurópai minták magas gyakoriságú szavaknál.",
        examples: [
          { tokens: [["kind","o"],["→","x"],["kinderen","o"]], en: "child → children", hu: "gyerek → gyerekek" },
          { tokens: [["stad","o"],["→","x"],["steden","o"]], en: "city → cities", hu: "város → városok" },
          { tokens: [["schip","o"],["→","x"],["schepen","o"]], en: "ship → ships", hu: "hajó → hajók" }
        ]
      }
    ]
  },

  {
    id: "adjectives",
    title_en: "Adjectives", title_hu: "Melléknevek",
    blurb_en: "-e ending · comparison", blurb_hu: "-e rag · fokozás",
    color: "amber",
    nodes: [
      {
        id: "adj_e",
        label_en: "the -e rule", label_hu: "-e szabály", level: "A1",
        rule_en: "Attributive adjectives take -e, EXCEPT before a singular indefinite het-word (a/an + neuter). Predicative adjectives (after zijn/worden) never inflect.",
        rule_hu: "Jelzői melléknév -e végződést kap, KIVÉVE határozatlan egyes számú het-szó előtt. Állítmányi (zijn/worden után) sosem.",
        reason_en: "The missing -e marks neuter indefinites — the only place Dutch still signals a gender distinction on adjectives.",
        reason_hu: "A hiányzó -e jelöli a semleges határozatlant — az egyetlen nem-jelölés a mellékneveken.",
        examples: [
          { tokens: [["de","art"],["rode","adj"],["auto","o"]], en: "the red car (de-word → -e)", hu: "a piros autó" },
          { tokens: [["het","art"],["rode","adj"],["huis","o"]], en: "the red house (definite → -e)", hu: "a piros ház" },
          { tokens: [["een","art"],["rode","adj"],["auto","o"]], en: "a red car (de-word → -e)", hu: "egy piros autó" },
          { tokens: [["een","art"],["rood","adj"],["huis","o"]], en: "a red house (indef. het → no -e!)", hu: "egy piros ház (hat.-lan het → nincs -e!)" },
          { tokens: [["de","art"],["auto","s"],["is","vfin"],["rood","adj"]], en: "the car is red (predicative)", hu: "az autó piros (állítmányi)" }
        ]
      },
      {
        id: "adj_compare",
        label_en: "comparative / superlative", label_hu: "közép/felsőfok", level: "A2",
        rule_en: "Comparative: +er ('mooier'). Superlative: +st with 'het' ('het mooist'). 'Meer/meest' only for long foreign adjectives.",
        rule_hu: "Középfok: +er. Felsőfok: +st, 'het'-tel. 'Meer/meest' csak hosszú idegen mellékneveknél.",
        reason_en: "Germanic inflectional comparison is still alive; Dutch (unlike English) keeps it even for longish words.",
        reason_hu: "A germán ragozásos fokozás él; a holland a hosszabb szavaknál is megtartja.",
        examples: [
          { tokens: [["mooi","adj"],["·","x"],["mooier","adj"],["·","x"],["het","art"],["mooist","adj"]], en: "pretty / prettier / the prettiest", hu: "szép / szebb / a legszebb" },
          { tokens: [["groot","adj"],["·","x"],["groter","adj"],["·","x"],["het","art"],["grootst","adj"]], en: "big / bigger / biggest", hu: "nagy / nagyobb / legnagyobb" },
          { tokens: [["interessant","adj"],["·","x"],["interessanter","adj"],["·","x"],["het","art"],["interessantst","adj"]], en: "interesting / more / most", hu: "érdekes / érdekesebb / legérdekesebb" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "Invariable adjectives",
        title_hu: "Nem ragozódó melléknevek",
        body_en: "Never take -e: those ending in -en (wollen, open, eigen), most material adjectives, and adjectives from -er nouns (rechter, linker).",
        body_hu: "Sosem kapnak -e-t: -en végűek (wollen, open, eigen), legtöbb anyagnév, -er főnévből képzettek.",
        examples: [
          { tokens: [["een","art"],["open","adj"],["deur","o"]], en: "an open door (no -e)", hu: "egy nyitott ajtó" },
          { tokens: [["een","art"],["wollen","adj"],["trui","o"]], en: "a woolen sweater", hu: "egy gyapjúpulóver" }
        ]
      },
      {
        title_en: "Irregular comparisons",
        title_hu: "Rendhagyó fokozás",
        body_en: "goed → beter → best, veel → meer → meest, weinig → minder → minst, graag → liever → liefst.",
        body_hu: "goed → beter → best, veel → meer → meest, weinig → minder → minst, graag → liever → liefst.",
        examples: [
          { tokens: [["goed","adj"],["·","x"],["beter","adj"],["·","x"],["best","adj"]], en: "good / better / best", hu: "jó / jobb / legjobb" },
          { tokens: [["graag","adv"],["·","x"],["liever","adv"],["·","x"],["het","art"],["liefst","adv"]], en: "gladly / rather / most preferably", hu: "szívesen / inkább / legszívesebben" }
        ]
      }
    ]
  },

  {
    id: "pronouns",
    title_en: "Pronouns", title_hu: "Névmások",
    blurb_en: "subject · object · possessive · reflexive", blurb_hu: "alany · tárgy · birtokos · visszaható",
    color: "amber",
    nodes: [
      {
        id: "pron_sub_obj",
        label_en: "subject / object", label_hu: "alany / tárgy", level: "A1",
        rule_en: "Subject: ik, jij/je, u, hij, zij/ze, het, wij/we, jullie, zij/ze. Object: mij/me, jou/je, u, hem, haar, het, ons, jullie, hen/hun/ze.",
        rule_hu: "Alany: ik, jij/je, u, hij, zij/ze, het, wij/we, jullie, zij/ze. Tárgy: mij/me, jou/je, u, hem, haar, het, ons, jullie, hen/hun/ze.",
        reason_en: "Each person has a STRONG form (stress, contrast) and WEAK form (unstressed, faster). Weak forms often collapse to a schwa.",
        reason_hu: "Minden személynek van ERŐS (hangsúlyos, kontraszt) és GYENGE (hangsúlytalan) alakja.",
        examples: [
          { tokens: [["ik","s"],["zie","vfin"],["hem","o"]], en: "I see him", hu: "látom őt" },
          { tokens: [["hij","s"],["kent","vfin"],["mij","o"]], en: "he knows me (strong)", hu: "ismer engem (erős)" },
          { tokens: [["hij","s"],["kent","vfin"],["me","o"]], en: "he knows me (weak)", hu: "ismer (gyenge)" }
        ]
      },
      {
        id: "u",
        label_en: "u — formal 'you'", label_hu: "u — magázás", level: "A1",
        rule_en: "One formal form for sg AND pl. Verb always takes -t (u heeft/hebt, u bent/is).",
        rule_hu: "Egyetlen udvarias alak, egyes és többes számra. Ige -t-vel.",
        reason_en: "'U' started as an object form and got generalized for politeness — now a full-register choice.",
        reason_hu: "Az 'u' eredetileg tárgyeset, ma udvariassági forma.",
        examples: [
          { tokens: [["u","s"],["bent","vfin"],["welkom","adj"]], en: "you are welcome (formal)", hu: "üdvözlöm (magázó)" },
          { tokens: [["kent","vfin"],["u","s"],["hem","o"],["?","x"]], en: "do you know him?", hu: "ismeri őt?" }
        ]
      },
      {
        id: "possessive",
        label_en: "possessive pronouns", label_hu: "birtokos névmások", level: "A1",
        rule_en: "mijn, jouw/je, uw, zijn, haar, ons/onze, jullie, hun. 'Ons' only before singular het-words; 'onze' elsewhere.",
        rule_hu: "mijn, jouw/je, uw, zijn, haar, ons/onze, jullie, hun. 'Ons' csak egyes számú het-szó előtt.",
        reason_en: "'ons' is the last surviving gender split in the pronoun system — historical curiosity for learners.",
        reason_hu: "Az 'ons/onze' az utolsó nem-jelölés a névmásrendszerben.",
        examples: [
          { tokens: [["ons","adj"],["huis","o"]], en: "our house (het-word)", hu: "a mi házunk" },
          { tokens: [["onze","adj"],["auto","o"]], en: "our car (de-word)", hu: "a mi autónk" },
          { tokens: [["onze","adj"],["huizen","o"]], en: "our houses (plural)", hu: "a mi házaink" }
        ]
      },
      {
        id: "demonstrative",
        label_en: "deze / dit · die / dat", label_hu: "deze / dit · die / dat", level: "A1",
        rule_en: "Near: deze (de) / dit (het). Far: die (de) / dat (het). Choose by gender/number of the noun.",
        rule_hu: "Közeli: deze (de) / dit (het). Távoli: die (de) / dat (het).",
        reason_en: "Demonstratives inherit the de/het split; it's the one place neuter singular is ALWAYS visible.",
        reason_hu: "A mutató névmás mutatja a nemet egyes számban.",
        examples: [
          { tokens: [["deze","adj"],["auto","o"]], en: "this car (de)", hu: "ez az autó" },
          { tokens: [["dit","adj"],["huis","o"]], en: "this house (het)", hu: "ez a ház" },
          { tokens: [["die","adj"],["mannen","o"]], en: "those men", hu: "azok a férfiak" },
          { tokens: [["dat","adj"],["kind","o"]], en: "that child", hu: "az a gyerek" }
        ]
      }
    ],
    exceptions: [
      {
        title_en: "hen vs hun",
        title_hu: "hen vs hun",
        body_en: "Prescriptive: 'hen' = direct object / after prepositions; 'hun' = indirect object (to them). In speech both merge to 'ze'. Possessive 'hun' (their) is separate.",
        body_hu: "Előírt: 'hen' tárgy/elöljáró után; 'hun' részes. Beszédben 'ze'. A 'hun' birtokos is létezik.",
        examples: [
          { tokens: [["ik","s"],["zie","vfin"],["hen","o"]], en: "I see them (direct)", hu: "látom őket (tárgy)" },
          { tokens: [["ik","s"],["geef","vfin"],["hun","o"],["een","art"],["boek","o"]], en: "I give them a book (indirect)", hu: "adok nekik egy könyvet (részes)" },
          { tokens: [["hun","adj"],["huis","o"]], en: "their house (possessive)", hu: "az ő házuk (birtokos)" }
        ]
      }
    ]
  }
];
