LernHub.registerModule({
  id: "english-5-tobe-typing",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "to be",
  lang: "en",
  icon: "⌨️",
  badgeLabel: "Schreibtrainer",
  type: "type-in",
  title: "„to be“ & Kurzformen eintippen",
  description: "Tippe genau wie in der Klassenarbeit die richtige Form oder Kurzform in die Lücke – mit praktischem Apostroph-Helfer!",
  order: 4,
  shuffle: true,
  roundSize: 10,
  cheatSheet: {
    title: "Klassenarbeits-Checkliste fürs Eintippen",
    subtitle: "4 schnelle Checks vor dem Abschicken",
    sections: [
      {
        type: "tips",
        heading: "Darauf achtet die Lehrerin besonders",
        items: [
          "1. Langform oder Kurzform? Lies genau: Steht da 'Ohne Kurzform', schreibe 'I am / You are / He is' statt 'I'm'.",
          "2. Das Wort 'I' (ich) wird im Englischen IMMER großgeschrieben – auch mitten im Satz!",
          "3. Apostroph bei Verneinung immer zwischen 'n' und 't': aren't, isn't (auf dem Tablet hilft dir der extra '-Button).",
          "4. Bei Fragen zuerst das Verb: Am I...? / Is he...? / Are you...?"
        ]
      },
      {
        type: "table",
        heading: "Schnellblick Kurzformen",
        headers: ["Lang", "Kurz +", "Kurz -"],
        rows: [
          ["I am", "I'm", "I'm not"],
          ["You are", "You're", "You aren't"],
          ["He / She / It is", "He's / She's / It's", "isn't"],
          ["We / They are", "We're / They're", "aren't"]
        ]
      }
    ]
  },
  tasks: [
    {
      id: "s01",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: You are not",
      hint: "Das Apostroph ersetzt das 'o' in 'not' -> aren't!",
      answer: "You aren't",
      accept: ["You're not"],
      placeholder: "z. B. You ...",
      explanation: "💡 'are not' wird zu <strong>aren't</strong> – das Apostroph steht zwischen n und t."
    },
    {
      id: "s02",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: He is not",
      hint: "is + not -> isn't",
      answer: "He isn't",
      accept: ["He's not"],
      explanation: "💡 'is not' wird zu <strong>isn't</strong>."
    },
    {
      id: "s03",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: She is not",
      hint: "She + isn't",
      answer: "She isn't",
      accept: ["She's not"],
      explanation: "💡 Richtig: <strong>She isn't</strong>."
    },
    {
      id: "s04",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: It is not",
      hint: "It + isn't",
      answer: "It isn't",
      accept: ["It's not"],
      explanation: "💡 Richtig: <strong>It isn't</strong>."
    },
    {
      id: "s05",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: We are not",
      hint: "We + aren't",
      answer: "We aren't",
      accept: ["We're not"],
      explanation: "💡 Richtig: <strong>We aren't</strong>."
    },
    {
      id: "s06",
      label: "Kurzform mit Verneinung eintippen",
      prompt: "Kurzform von: They are not",
      hint: "They + aren't",
      answer: "They aren't",
      accept: ["They're not"],
      explanation: "💡 Richtig: <strong>They aren't</strong>."
    },
    {
      id: "s07",
      label: "Ausnahme bei 'I' eintippen",
      prompt: "Kurzform von: I am not",
      hint: "Es gibt kein 'amn't'! Man verkürzt 'I am' zu 'I'm'.",
      answer: "I'm not",
      explanation: "💡 Bei 'I' heißt die Kurzform immer <strong>I'm not</strong>."
    },
    {
      id: "s08",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: I am",
      hint: "Das 'a' wird durch ein Apostroph ersetzt.",
      answer: "I'm",
      explanation: "💡 I am -> <strong>I'm</strong>."
    },
    {
      id: "s09",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: You are",
      hint: "You + 're",
      answer: "You're",
      explanation: "💡 You are -> <strong>You're</strong>."
    },
    {
      id: "s10",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: He is",
      hint: "He + 's",
      answer: "He's",
      explanation: "💡 He is -> <strong>He's</strong>."
    },
    {
      id: "s11",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: She is",
      hint: "She + 's",
      answer: "She's",
      explanation: "💡 She is -> <strong>She's</strong>."
    },
    {
      id: "s12",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: We are",
      hint: "We + 're",
      answer: "We're",
      explanation: "💡 We are -> <strong>We're</strong>."
    },
    {
      id: "s13",
      label: "Positive Kurzform eintippen",
      prompt: "Kurzform von: They are",
      hint: "They + 're",
      answer: "They're",
      explanation: "💡 They are -> <strong>They're</strong>."
    },
    {
      id: "s14",
      label: "Langform von 'to be' eintippen",
      prompt: "Wir sind im Wohnzimmer, also pst.",
      prefix: "We",
      suffix: "in the living room, so pst.",
      hint: "Original-Aufgabe: Benutze die Langform bei 'We'.",
      answer: "are",
      explanation: "💡 We <strong>are</strong> in the living room, so pst."
    },
    {
      id: "s15",
      label: "Langform eintippen (Pronomen + to be)",
      prompt: "Ich bin in Klasse 5.",
      suffix: "in year 5.",
      hint: "Langform ohne Apostroph: I + ...",
      answer: "I am",
      explanation: "💡 <strong>I am</strong> in year 5."
    },
    {
      id: "s16",
      label: "Langform eintippen (Pronomen + to be)",
      prompt: "Er ist mein Bruder.",
      suffix: "my brother.",
      hint: "Langform ohne Apostroph: He + ...",
      answer: "He is",
      explanation: "💡 <strong>He is</strong> my brother."
    },
    {
      id: "s17",
      label: "Langform eintippen (Pronomen + to be)",
      prompt: "Sie ist meine Schwester.",
      suffix: "my sister.",
      hint: "Langform ohne Apostroph: She + ...",
      answer: "She is",
      explanation: "💡 <strong>She is</strong> my sister."
    },
    {
      id: "s18",
      label: "Langform eintippen (Achtung Falle!)",
      prompt: "Das ist mein Ball. Er ist rot.",
      prefix: "This is my ball.",
      suffix: "red.",
      hint: "Der Ball ist ein Gegenstand -> It + ... (ohne Apostroph).",
      answer: "It is",
      explanation: "💡 Gegenstände sind im Englischen 'It': This is my ball. <strong>It is</strong> red."
    },
    {
      id: "s19",
      label: "Langform eintippen (Achtung Falle!)",
      prompt: "Ihr seid glücklich.",
      suffix: "happy.",
      hint: "'Ihr seid' = You + ... (nicht 'They'!).",
      answer: "You are",
      explanation: "💡 'Ihr seid' heißt auf Englisch <strong>You are</strong>."
    },
    {
      id: "s20",
      label: "Langform eintippen (Pronomen + to be)",
      prompt: "Da sind meine Freunde. Sie sind glücklich.",
      prefix: "There are my friends.",
      suffix: "happy.",
      hint: "Mehrzahl 'meine Freunde' -> They + ...",
      answer: "They are",
      explanation: "💡 There are my friends. <strong>They are</strong> happy."
    },
    {
      id: "s21",
      label: "Frage eintippen (Verb + Pronomen)",
      prompt: "Ist sie aus Deutschland?",
      suffix: "from Germany?",
      hint: "Frage: Verb zuerst -> Is ...",
      answer: "Is she",
      explanation: "💡 Frage: <strong>Is she</strong> from Germany?"
    },
    {
      id: "s22",
      label: "Frage eintippen (Verb + Pronomen)",
      prompt: "Ist er in der Schule?",
      suffix: "at school?",
      hint: "Frage: Verb zuerst -> Is ...",
      answer: "Is he",
      explanation: "💡 Frage: <strong>Is he</strong> at school?"
    },
    {
      id: "s23",
      label: "Frage eintippen (Achtung Falle!)",
      prompt: "Seid ihr traurig?",
      suffix: "sad?",
      hint: "'Ihr' = 'you'! Und bei der Frage kommt 'Are' ganz nach vorne.",
      answer: "Are you",
      explanation: "💡 Frage mit 'ihr': <strong>Are you</strong> sad?"
    }
  ]
});
