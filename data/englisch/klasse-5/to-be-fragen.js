LernHub.registerModule({
  id: "english-5-questions-tobe",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "to be",
  lang: "en",
  icon: "❓",
  badgeLabel: "Satzbau",
  type: "sentence-builder",
  title: "Fragen mit „to be“ (Fragesatzbau)",
  description: "Fülle nur die Lücken mit der richtigen Form von 'to be' und dem Pronomen aus. Der Rest des Satzes steht schon da!",
  order: 2,
  shuffle: true,
  roundSize: 10,
  cheatSheet: {
    title: "Spickzettel: Fragen mit „to be“",
    subtitle: "Goldene Regel: Bei Fragen wandert das Verb nach ganz vorne!",
    sections: [
      {
        type: "table",
        heading: "Aussagesatz → Fragesatz (Tausch-Trick!)",
        headers: ["Aussagesatz", "Frage (Verb zuerst!)"],
        rows: [
          ["I am late.", "Am I late?"],
          ["You are sad.", "Are you sad?"],
          ["He is at school.", "Is he at school?"],
          ["She is from Germany.", "Is she from Germany?"],
          ["We are friends.", "Are we friends?"],
          ["They are in the garden.", "Are they in the garden?"]
        ]
      },
      {
        type: "table",
        heading: "Fragen mit Fragewort (W-Fragen)",
        headers: ["Fragewort", "Form von 'to be' + Person + Rest"],
        rows: [
          ["Where (Wo / Woher)", "Where are you from?"],
          ["How old (Wie alt)", "How old is she?"],
          ["Who (Wer)", "Who is this boy?"]
        ]
      },
      {
        type: "tips",
        heading: "Merk-Tipp gegen die 'ihr'-Falle",
        items: [
          "„Seid ihr traurig?“ → „ihr“ = you! Frage beginnt mit Are: Are you sad? (Niemals 'They you sad?')."
        ]
      }
    ]
  },
  tasks: [
    {
      id: "q01",
      prompt: "Ist sie aus Deutschland?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "from Germany?",
      hint: "Fragen beginnen mit dem Verb: Is + she",
      words: ["Is", "she"],
      distractors: ["Are", "he", "are", "you"]
    },
    {
      id: "q02",
      prompt: "Ist er in der Schule?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "at school?",
      hint: "Verb zuerst: Is + he",
      words: ["Is", "he"],
      distractors: ["Are", "she", "are", "you"]
    },
    {
      id: "q03",
      prompt: "Seid ihr traurig?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "sad?",
      hint: "Achtung Schul-Falle: 'ihr' ist im Englischen 'you'! Frage beginnt mit 'Are'.",
      words: ["Are", "you"],
      distractors: ["They", "Is", "she", "he"]
    },
    {
      id: "q04",
      prompt: "Bist du glücklich?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "happy?",
      hint: "'Bist du' = Are you",
      words: ["Are", "you"],
      distractors: ["Is", "he", "am"]
    },
    {
      id: "q05",
      prompt: "Sind sie im Garten?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "in the garden?",
      hint: "'sie' (Mehrzahl) = 'they'. Verb = 'Are'.",
      words: ["Are", "they"],
      distractors: ["Is", "you", "She"]
    },
    {
      id: "q06",
      prompt: "Ist das dein Ball?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "your ball?",
      hint: "Ist das = Is this",
      words: ["Is", "this"],
      distractors: ["Are", "it", "that"]
    },
    {
      id: "q07",
      prompt: "Bin ich zu spät?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "late?",
      hint: "Bei 'I' heißt die Frageform: 'Am I ...?'",
      words: ["Am", "I"],
      distractors: ["Are", "Is", "you"]
    },
    {
      id: "q08",
      prompt: "Sind wir Freunde?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "friends?",
      hint: "'Sind wir' = Are we",
      words: ["Are", "we"],
      distractors: ["Is", "they", "I"]
    },
    {
      id: "q09",
      prompt: "Ist dein Bruder zu Hause?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "your brother at home?",
      hint: "'dein Bruder' ist Einzahl (he), also startet die Frage mit 'Is'.",
      words: ["Is"],
      distractors: ["Are", "Am"]
    },
    {
      id: "q10",
      prompt: "Sind deine Eltern nett?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "your parents nice?",
      hint: "'Eltern' ist Mehrzahl (they), also beginnt die Frage mit 'Are'.",
      words: ["Are"],
      distractors: ["Is", "Am"]
    },
    {
      id: "q11",
      prompt: "Ist die Katze auf dem Tisch?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "the cat on the table?",
      hint: "Die Katze = Einzahl -> 'Is'",
      words: ["Is"],
      distractors: ["Are", "Am"]
    },
    {
      id: "q12",
      prompt: "Seid ihr im Klassenzimmer?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "in the classroom?",
      hint: "Denke daran: 'ihr' = 'you'. Also: 'Are you ...'",
      words: ["Are", "you"],
      distractors: ["They", "Is", "we"]
    },
    {
      id: "q13",
      prompt: "Ist Englisch dein Lieblingsfach?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "English your favourite subject?",
      hint: "'Englisch' ist Einzahl -> 'Is'",
      words: ["Is"],
      distractors: ["Are", "Am"]
    },
    {
      id: "q14",
      prompt: "Sind die Hunde im Park?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "the dogs in the park?",
      hint: "Mehrzahl 'die Hunde' -> 'Are'",
      words: ["Are"],
      distractors: ["Is", "Am"]
    },
    {
      id: "q15",
      prompt: "Woher kommst du? (Woher bist du?)",
      label: "Setze 'to be' und das Pronomen ein",
      prefix: "Where",
      suffix: "from?",
      hint: "Where + are you + from?",
      words: ["are", "you"],
      distractors: ["is", "he", "am"]
    },
    {
      id: "q16",
      prompt: "Wie alt ist sie?",
      label: "Setze 'to be' und das Pronomen ein",
      prefix: "How old",
      suffix: "?",
      hint: "How old + is she?",
      words: ["is", "she"],
      distractors: ["are", "he", "am"]
    },
    {
      id: "q17",
      prompt: "Wer ist dieser Junge?",
      label: "Form von 'to be' einsetzen",
      prefix: "Who",
      suffix: "this boy?",
      hint: "Einzahl 'dieser Junge' -> is",
      words: ["is"],
      distractors: ["are", "am"]
    },
    {
      id: "q18",
      prompt: "Wo ist mein Federmäppchen?",
      label: "Form von 'to be' einsetzen",
      prefix: "Where",
      suffix: "my pencil case?",
      hint: "Einzahl -> is",
      words: ["is"],
      distractors: ["are", "am"]
    },
    {
      id: "q19",
      prompt: "Ist das deine Schultasche?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "your schoolbag?",
      hint: "Ist das = Is this",
      words: ["Is", "this"],
      distractors: ["Are", "it", "that"]
    },
    {
      id: "q20",
      prompt: "Bist du zehn Jahre alt?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "ten years old?",
      hint: "Are + you",
      words: ["Are", "you"],
      distractors: ["Is", "he", "am"]
    },
    {
      id: "q21",
      prompt: "Sind Peter und Tom in London?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "Peter and Tom in London?",
      hint: "Zwei Personen = Mehrzahl -> 'Are'",
      words: ["Are"],
      distractors: ["Is", "Am"]
    },
    {
      id: "q22",
      prompt: "Ist heute Montag?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "today Monday?",
      hint: "Einzahl -> 'Is'",
      words: ["Is"],
      distractors: ["Are", "Am"]
    },
    {
      id: "q23",
      prompt: "Seid ihr bereit?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "ready?",
      hint: "Merke: 'ihr' = 'you'! Frage: 'Are you ...'",
      words: ["Are", "you"],
      distractors: ["They", "Is", "we"]
    },
    {
      id: "q24",
      prompt: "Ist Frau Müller deine Lehrerin?",
      label: "Frageform von 'to be' einsetzen",
      suffix: "Mrs Müller your teacher?",
      hint: "Einzahl Frau Müller -> 'Is'",
      words: ["Is"],
      distractors: ["Are", "Am"]
    },
    {
      id: "q25",
      prompt: "Sind wir in Gruppe 1?",
      label: "Frage übersetzen: Setze 'to be' und das Pronomen ein",
      suffix: "in group 1?",
      hint: "'Sind wir' = Are we",
      words: ["Are", "we"],
      distractors: ["Is", "they", "I"]
    }
  ]
});
