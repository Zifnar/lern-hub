LernHub.registerModule({
  id: "english-unit1-sentences",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "Unit 1",
  lang: "en",
  icon: "💬",
  badgeLabel: "Satzbau",
  type: "sentence-builder",
  title: "Satzbau & Fragen (Unit 1)",
  description: "Bringe die englischen Wörter in die richtige Reihenfolge. Achte auf Stolperwörter!",
  order: 5,
  shuffle: true,
  roundSize: 5,
  cheatSheet: {
    title: "Spickzettel: Satzbau & Fragen (Unit 1)",
    subtitle: "Simple Present & Wortstellung im Englischen",
    sections: [
      {
        type: "tips",
        heading: "Wichtige Regeln für Unit 1",
        items: [
          "Ortsangaben vor Zeitangaben: Zeitangaben (z. B. 'every Tuesday', 'in the morning') stehen fast immer am Satzende.",
          "Fragen & Verneinung bei normalen Verben: Hilfsverb 'do / don't' (bei he/she/it: 'does / doesn't')."
        ]
      }
    ]
  },
  tasks: [
    {
      id: "u1_01",
      prompt: "Ich spiele jeden Dienstag Basketball.",
      hint: "Zeitangaben stehen im Englischen meistens ganz am Ende.",
      words: ["I", "play", "basketball", "every", "Tuesday."],
      distractors: ["plays", "at"]
    },
    {
      id: "u1_02",
      prompt: "Wo wohnst du?",
      hint: "Fragewort + Hilfsverb 'do' + Person + Verb",
      words: ["Where", "do", "you", "live?"],
      distractors: ["does", "are"]
    },
    {
      id: "u1_03",
      prompt: "Sie hat zwei Schwestern und einen Bruder.",
      hint: "Bei 'she' nutzt man 'has got'.",
      words: ["She", "has", "got", "two", "sisters", "and", "one", "brother."],
      distractors: ["have", "sister"]
    },
    {
      id: "u1_04",
      prompt: "Wir gehen morgens nicht zu Fuß zur Schule.",
      hint: "Verneinung mit 'don't'",
      words: ["We", "don't", "walk", "to", "school", "in", "the", "morning."],
      distractors: ["doesn't", "walks"]
    },
    {
      id: "u1_05",
      prompt: "Mag dein Bruder Hunde?",
      hint: "Frage bei 'he/she/it' startet mit 'Does'.",
      words: ["Does", "your", "brother", "like", "dogs?"],
      distractors: ["Do", "likes"]
    }
  ]
});
