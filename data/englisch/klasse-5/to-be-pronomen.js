LernHub.registerModule({
  id: "english-5-pronouns-tobe",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "to be",
  lang: "en",
  icon: "🧩",
  badgeLabel: "Satzbau",
  type: "sentence-builder",
  title: "Pronomen & „to be“ (Satzbau & Aussagen)",
  description: "Trage nur das Personalpronomen und die Form von 'to be' ein. Achte auf die Fallen: 'ihr seid = you are', Dinge/Tiere = 'it' und Mehrzahl = 'they'!",
  order: 1,
  shuffle: true,
  roundSize: 10,
  cheatSheet: {
    title: "Spickzettel: Personalpronomen & „to be“",
    subtitle: "Die wichtigste Tabelle für Englisch in Klasse 5",
    sections: [
      {
        type: "table",
        heading: "Alle Personen & Formen von 'to be'",
        headers: ["Deutsch", "Englisch (Langform)", "Beispiel"],
        rows: [
          ["ich bin", "I am", "I am in year 5."],
          ["du bist", "you are", "You are my classmate."],
          ["er ist (Junge/Mann)", "he is", "He is my brother."],
          ["sie ist (Mädchen/Frau)", "she is", "She is my sister."],
          ["es ist (Ding / Tier)", "it is", "The ball → It is red."],
          ["wir sind", "we are", "We are friends."],
          ["ihr seid (ACHTUNG!)", "you are", "You are happy."],
          ["sie sind (Mehrzahl)", "they are", "My friends → They are happy."]
        ]
      },
      {
        type: "tips",
        heading: "Die 2 häufigsten Klassenarbeits-Fallen",
        items: [
          "Dinge & Tiere sind immer 'it' (auch wenn wir auf Deutsch 'der Ball → er' oder 'die Tasche → sie' sagen!).",
          "'Ihr seid' heißt auf Englisch IMMER 'you are' – verwechsle es nicht mit 'they are' ('sie sind')!"
        ]
      }
    ]
  },
  tasks: [
    {
      id: "p01",
      prompt: "Ich bin in Klasse 5.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "in year 5.",
      hint: "'Ich bin' = I am.",
      words: ["I", "am"],
      distractors: ["He", "is", "are", "We"]
    },
    {
      id: "p02",
      prompt: "Du bist mein Klassenkamerad.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "my classmate.",
      hint: "'Du bist' = You are.",
      words: ["You", "are"],
      distractors: ["He", "is", "They", "am"]
    },
    {
      id: "p03",
      prompt: "Ihr seid glücklich.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "happy.",
      hint: "Schul-Stolperfalle! 'Ihr seid' heißt auf Englisch 'You are' (nicht 'They')!",
      words: ["You", "are"],
      distractors: ["They", "is", "We", "He"]
    },
    {
      id: "p04",
      prompt: "Er ist mein Bruder.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "my brother.",
      hint: "'Er ist' = He is.",
      words: ["He", "is"],
      distractors: ["She", "are", "They", "am"]
    },
    {
      id: "p05",
      prompt: "Sie ist meine Schwester.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "my sister.",
      hint: "'Sie ist' = She is.",
      words: ["She", "is"],
      distractors: ["He", "are", "It", "They"]
    },
    {
      id: "p06",
      prompt: "Das ist mein Ball. Er ist rot.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "This is my ball.",
      suffix: "red.",
      hint: "Schul-Stolperfalle! Dinge wie 'der Ball' sind im Englischen unbelebt: 'It is' (nicht 'He')!",
      words: ["It", "is"],
      distractors: ["He", "are", "She", "They"]
    },
    {
      id: "p07",
      prompt: "Wir sind Freunde.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "friends.",
      hint: "'Wir sind' = We are.",
      words: ["We", "are"],
      distractors: ["They", "is", "I", "am"]
    },
    {
      id: "p08",
      prompt: "Da sind meine Freunde. Sie sind glücklich.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "There are my friends.",
      suffix: "happy.",
      hint: "Mehrzahl 'meine Freunde' -> 'They are'.",
      words: ["They", "are"],
      distractors: ["She", "is", "You", "He"]
    },
    {
      id: "p09",
      prompt: "Das ist meine Schultasche. Sie ist blau.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "This is my schoolbag.",
      suffix: "blue.",
      hint: "Gegenstände wie Taschen sind im Englischen immer 'It'!",
      words: ["It", "is"],
      distractors: ["She", "are", "He", "They"]
    },
    {
      id: "p10",
      prompt: "Ihr seid tolle Freunde.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "great friends.",
      hint: "Achtung: 'Ihr' ist 'You'!",
      words: ["You", "are"],
      distractors: ["They", "is", "We", "am"]
    },
    {
      id: "p11",
      prompt: "Sie sind in der Küche.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "in the kitchen.",
      hint: "Mehrzahl Personen = They are.",
      words: ["They", "are"],
      distractors: ["She", "is", "We", "He"]
    },
    {
      id: "p12",
      prompt: "Das ist mein Hund. Er ist schwarz und weiß.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "This is my dog.",
      suffix: "black and white.",
      hint: "Tiere werden in der 5. Klasse meist mit 'It' bezeichnet.",
      words: ["It", "is"],
      distractors: ["He", "are", "She", "They"]
    },
    {
      id: "p13",
      prompt: "Ich bin zehn Jahre alt.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "ten years old.",
      hint: "I + am",
      words: ["I", "am"],
      distractors: ["He", "is", "are", "You"]
    },
    {
      id: "p14",
      prompt: "Wir sind im Wohnzimmer, also pst.",
      label: "Form von 'to be' einsetzen",
      prefix: "We",
      suffix: "in the living room, so pst.",
      hint: "Original Schulaufgabe: Bei 'We' gehört 'are' in die Lücke.",
      words: ["are"],
      distractors: ["is", "am"]
    },
    {
      id: "p15",
      prompt: "Emma ist meine beste Freundin. Sie ist nett.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "Emma is my best friend.",
      suffix: "nice.",
      hint: "Mädchen (Emma) = She is.",
      words: ["She", "is"],
      distractors: ["He", "are", "They", "It"]
    },
    {
      id: "p16",
      prompt: "Tom und Ben sind Brüder. Sie sind in Klasse 5.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "Tom and Ben are brothers.",
      suffix: "in year 5.",
      hint: "Zwei Jungen zusammen = They are.",
      words: ["They", "are"],
      distractors: ["He", "is", "You", "We"]
    },
    {
      id: "p17",
      prompt: "Das ist mein Fahrrad. Es ist neu.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "This is my bike.",
      suffix: "new.",
      hint: "Gegenstand = It is.",
      words: ["It", "is"],
      distractors: ["He", "She", "are", "They"]
    },
    {
      id: "p18",
      prompt: "Du und ich sind ein gutes Team.",
      label: "Form von 'to be' einsetzen",
      prefix: "You and I",
      suffix: "a good team.",
      hint: "Zusammen sind wir 'wir', also Verb 'are'!",
      words: ["are"],
      distractors: ["am", "is"]
    },
    {
      id: "p19",
      prompt: "Das ist Frau Weber. Sie ist unsere Englischlehrerin.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "This is Mrs Weber.",
      suffix: "our English teacher.",
      hint: "Frau Weber = She is.",
      words: ["She", "is"],
      distractors: ["He", "are", "It", "They"]
    },
    {
      id: "p20",
      prompt: "Wir sind nicht müde.",
      label: "Form von 'to be' einsetzen",
      prefix: "We",
      suffix: "not tired.",
      hint: "We + are",
      words: ["are"],
      distractors: ["is", "am"]
    },
    {
      id: "p21",
      prompt: "Ihr seid heute im Garten.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "in the garden today.",
      hint: "'Ihr seid' = You are.",
      words: ["You", "are"],
      distractors: ["They", "is", "He", "We"]
    },
    {
      id: "p22",
      prompt: "Das Buch ist spannend. Es ist auf Englisch.",
      label: "Pronomen + Form von 'to be' einsetzen",
      prefix: "The book is exciting.",
      suffix: "in English.",
      hint: "Das Buch (Gegenstand) = It is.",
      words: ["It", "is"],
      distractors: ["He", "are", "She", "They"]
    },
    {
      id: "p23",
      prompt: "Mein Name ist Luca und ich bin elf.",
      label: "Form von 'to be' einsetzen",
      prefix: "My name is Luca and I",
      suffix: "eleven.",
      hint: "Bei 'I' gehört 'am' in die Lücke.",
      words: ["am"],
      distractors: ["is", "are"]
    },
    {
      id: "p24",
      prompt: "Sie sind zu spät für die Schule.",
      label: "Pronomen + Form von 'to be' einsetzen",
      suffix: "late for school.",
      hint: "Mehrzahl Personen = They are.",
      words: ["They", "are"],
      distractors: ["He", "is", "She", "We"]
    }
  ]
});
