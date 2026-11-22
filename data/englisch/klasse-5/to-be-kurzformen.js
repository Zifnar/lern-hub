LernHub.registerModule({
  id: "english-5-shortforms-quiz",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "to be",
  lang: "en",
  icon: "⚡",
  badgeLabel: "Quiz",
  type: "quiz",
  title: "Kurzformen & Apostroph-Trainer (Quiz)",
  description: "Finde die richtige Schreibweise! Wo gehört das Apostroph hin? Trainiere Kurzformen von 'to be' und die häufigsten Klassenarbeits-Fallen.",
  order: 3,
  shuffle: true,
  roundSize: 10,
  cheatSheet: {
    title: "Spickzettel: Kurzformen & Apostroph (')",
    subtitle: "So sitzt das Apostroph garantiert immer an der richtigen Stelle!",
    sections: [
      {
        type: "tips",
        heading: "Der Apostroph-Trick",
        items: [
          "Das Apostroph (') ersetzt genau den Buchstaben, der weggefallen ist!",
          "Bei 'not' fällt das 'o' weg → deshalb steht das Apostroph zwischen 'n' und 't': aren't und isn't (NICHT are'nt!).",
          "Ausnahme bei 'I': Es gibt kein 'amn't'! Es heißt immer: I'm not."
        ]
      },
      {
        type: "table",
        heading: "Langform, positiv kurz & verneint kurz",
        headers: ["Langform", "Kurz (positiv)", "Kurz (verneint)"],
        rows: [
          ["I am", "I'm", "I'm not"],
          ["you are", "you're", "you aren't"],
          ["he is", "he's", "he isn't"],
          ["she is", "she's", "she isn't"],
          ["it is", "it's", "it isn't"],
          ["we are", "we're", "we aren't"],
          ["they are", "they're", "they aren't"]
        ]
      }
    ]
  },
  tasks: [
    {
      id: "k01",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'You are not'?",
      hint: "Schau genau, wo das Apostroph (') steht!",
      options: ["You aren't", "You are'nt", "You arn't", "You arent'"],
      answer: "You aren't",
      speechText: "You aren't",
      explanation: "💡 Merk-Regel: Das Apostroph ersetzt immer den Buchstaben, der wegfällt! Bei 'not' fällt das 'o' weg, also steht das Apostroph zwischen 'n' und 't': <strong>aren't</strong>."
    },
    {
      id: "k02",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'He is not'?",
      hint: "Das 'o' in 'not' wird durch das Apostroph ersetzt.",
      options: ["He isn't", "He is'nt", "He isn'ot", "He isnot"],
      answer: "He isn't",
      speechText: "He isn't",
      explanation: "💡 Richtig: 'is not' wird zu <strong>isn't</strong> (nicht 'is'nt')."
    },
    {
      id: "k03",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'She is not'?",
      hint: "is + not -> isn't",
      options: ["She isn't", "She is'nt", "She'is not", "She arent"],
      answer: "She isn't",
      speechText: "She isn't",
      explanation: "💡 Bei he/she/it heißt die verneinte Kurzform immer <strong>isn't</strong>."
    },
    {
      id: "k04",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'It is not'?",
      hint: "It + isn't",
      options: ["It isn't", "It is'nt", "It'isnt", "It arent"],
      answer: "It isn't",
      speechText: "It isn't",
      explanation: "💡 <strong>It isn't</strong> ist die richtige Form."
    },
    {
      id: "k05",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'We are not'?",
      hint: "are + not -> aren't",
      options: ["We aren't", "We are'nt", "We ar'nt", "We'arent"],
      answer: "We aren't",
      speechText: "We aren't",
      explanation: "💡 'are not' wird zu <strong>aren't</strong> mit dem Apostroph zwischen n und t!"
    },
    {
      id: "k06",
      category: "Kurzform mit Verneinung (not)",
      question: "Wie lautet die richtige Kurzform von 'They are not'?",
      hint: "are + not -> aren't",
      options: ["They aren't", "They are'nt", "They dont", "They arent'"],
      answer: "They aren't",
      speechText: "They aren't",
      explanation: "💡 <strong>They aren't</strong>."
    },
    {
      id: "k07",
      category: "Besonderheit bei 'I'",
      question: "Wie lautet die richtige Kurzform von 'I am not'?",
      hint: "Achtung Ausnahme: Es gibt im Englischen kein 'amn't'!",
      options: ["I'm not", "I amn't", "I am'not", "Im not"],
      answer: "I'm not",
      speechText: "I'm not",
      explanation: "💡 Wichtig: 'I am not' verkürzt man immer zu <strong>I'm not</strong>!"
    },
    {
      id: "k08",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'I am'?",
      hint: "Das 'a' fällt weg.",
      options: ["I'm", "Im'", "I'am", "Ime"],
      answer: "I'm",
      speechText: "I'm",
      explanation: "💡 I am -> <strong>I'm</strong>."
    },
    {
      id: "k09",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'You are'?",
      hint: "Das 'a' fällt weg und wird durch das Apostroph ersetzt.",
      options: ["You're", "Your'e", "You'r", "Youre'"],
      answer: "You're",
      speechText: "You're",
      explanation: "💡 You are -> <strong>You're</strong> (Achtung: nicht mit dem Possessivpronomen 'your' verwechseln!)."
    },
    {
      id: "k10",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'He is'?",
      hint: "Das 'i' fällt weg.",
      options: ["He's", "Hes'", "He'is", "H'es"],
      answer: "He's",
      speechText: "He's",
      explanation: "💡 He is -> <strong>He's</strong>."
    },
    {
      id: "k11",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'She is'?",
      hint: "She + 's",
      options: ["She's", "Shes'", "She'is", "Sh'es"],
      answer: "She's",
      speechText: "She's",
      explanation: "💡 She is -> <strong>She's</strong>."
    },
    {
      id: "k12",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'It is'?",
      hint: "It + 's",
      options: ["It's", "Its'", "It'is", "I'ts"],
      answer: "It's",
      speechText: "It's",
      explanation: "💡 It is -> <strong>It's</strong>."
    },
    {
      id: "k13",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'We are'?",
      hint: "We + 're",
      options: ["We're", "Wer'e", "We'r", "W'ere"],
      answer: "We're",
      speechText: "We're",
      explanation: "💡 We are -> <strong>We're</strong>."
    },
    {
      id: "k14",
      category: "Positive Kurzform",
      question: "Wie lautet die richtige Kurzform von 'They are'?",
      hint: "They + 're",
      options: ["They're", "Theyr'e", "They'r", "The'yre"],
      answer: "They're",
      speechText: "They're",
      explanation: "💡 They are -> <strong>They're</strong>."
    },
    {
      id: "k15",
      category: "Personalpronomen-Falle",
      question: "Welches Wort passt in die Lücke: 'This is my ball. ... is red.'?",
      subtext: "Auf Deutsch: 'Das ist mein Ball. Er ist rot.'",
      hint: "Dinge und Gegenstände sind im Englischen unbelebt!",
      options: ["It", "He", "She", "They"],
      answer: "It",
      speechText: "This is my ball. It is red.",
      explanation: "💡 Im Deutschen sagen wir 'der Ball -> er'. Im Englischen bekommen alle Gegenstände und Sachen das Pronomen <strong>It</strong>!"
    },
    {
      id: "k16",
      category: "Personalpronomen-Falle",
      question: "Wie übersetzt man den Satz: 'Ihr seid glücklich'?",
      hint: "'Ihr' (Mehrzahl von du) heißt im Englischen genauso wie 'du'.",
      options: ["You are happy.", "They are happy.", "She is happy.", "We are happy."],
      answer: "You are happy.",
      speechText: "You are happy.",
      explanation: "💡 Wichtige Falle: 'Ihr' ist auf Englisch <strong>you</strong> (nicht 'they', denn 'they' bedeutet 'sie')!"
    },
    {
      id: "k17",
      category: "Personalpronomen-Falle",
      question: "Welches Wort passt: 'Look at my schoolbag. ... is blue.'?",
      subtext: "Auf Deutsch: 'Schau dir meine Schultasche an. Sie ist blau.'",
      hint: "Eine Schultasche ist ein Gegenstand.",
      options: ["It", "She", "He", "They"],
      answer: "It",
      speechText: "Look at my schoolbag. It is blue.",
      explanation: "💡 Auch wenn es auf Deutsch 'die Tasche -> sie' heißt: Gegenstände sind im Englischen immer <strong>It</strong>!"
    },
    {
      id: "k18",
      category: "Personalpronomen-Falle",
      question: "Welches Wort passt: 'There are my friends. ... are nice.'?",
      subtext: "Auf Deutsch: 'Da sind meine Freunde. Sie sind nett.'",
      hint: "'Freunde' ist Mehrzahl.",
      options: ["They", "She", "He", "It"],
      answer: "They",
      speechText: "There are my friends. They are nice.",
      explanation: "💡 Für Personen in der Mehrzahl (sie = Plural) nutzt man <strong>They</strong>."
    },
    {
      id: "k19",
      category: "Fragen mit 'to be'",
      question: "Welche Frage ist grammatikalisch RICHTIG geschrieben?",
      subtext: "Ziel: 'Seid ihr traurig?'",
      hint: "Fragen mit 'to be' beginnen mit Am, Is oder Are!",
      options: ["Are you sad?", "They you sad?", "You are sad?", "Is you sad?"],
      answer: "Are you sad?",
      speechText: "Are you sad?",
      explanation: "💡 Frage mit 'ihr seid': Verb nach vorne -> <strong>Are you sad?</strong> (niemals 'They you sad?')."
    },
    {
      id: "k20",
      category: "Fragen mit 'to be'",
      question: "Welche Frage ist grammatikalisch RICHTIG geschrieben?",
      subtext: "Ziel: 'Ist sie aus Deutschland?'",
      hint: "Einzahl 'she' braucht 'Is'.",
      options: ["Is she from Germany?", "Are she from Germany?", "She is from Germany?", "From Germany is she?"],
      answer: "Is she from Germany?",
      speechText: "Is she from Germany?",
      explanation: "💡 Bei he/she/it beginnt die Frage mit <strong>Is</strong>: 'Is she from Germany?'."
    },
    {
      id: "k21",
      category: "Fragen mit 'to be'",
      question: "Welche Frage ist grammatikalisch RICHTIG geschrieben?",
      subtext: "Ziel: 'Ist er in der Schule?'",
      hint: "Verb zuerst!",
      options: ["Is he at school?", "Are he at school?", "He is at school?", "Does he at school?"],
      answer: "Is he at school?",
      speechText: "Is he at school?",
      explanation: "💡 Richtig: <strong>Is he at school?</strong>"
    },
    {
      id: "k22",
      category: "Fragen mit 'to be'",
      question: "Welche Frage ist grammatikalisch RICHTIG geschrieben?",
      subtext: "Ziel: 'Sind sie Freunde?'",
      hint: "Mehrzahl 'they' braucht 'Are'.",
      options: ["Are they friends?", "Is they friends?", "They are friends?", "Am they friends?"],
      answer: "Are they friends?",
      speechText: "Are they friends?",
      explanation: "💡 Richtig: <strong>Are they friends?</strong>"
    },
    {
      id: "k23",
      category: "Langform von 'to be'",
      question: "Welches Verb gehört in die Lücke: 'We ... in the living room, so pst.'?",
      hint: "Bei 'we' (wir) heißt die Form von 'to be'...",
      options: ["are", "is", "am", "be"],
      answer: "are",
      speechText: "We are in the living room.",
      explanation: "💡 We <strong>are</strong> in the living room."
    },
    {
      id: "k24",
      category: "Langform von 'to be'",
      question: "Welches Verb gehört in die Lücke: 'He ... my brother.'?",
      hint: "Bei 'he' (er) heißt die Form von 'to be'...",
      options: ["is", "are", "am", "be"],
      answer: "is",
      speechText: "He is my brother.",
      explanation: "💡 He <strong>is</strong> my brother."
    },
    {
      id: "k25",
      category: "Langform von 'to be'",
      question: "Welches Verb gehört in die Lücke: 'I ... in year 5.'?",
      hint: "Bei 'I' (ich) heißt die Form...",
      options: ["am", "is", "are", "be"],
      answer: "am",
      speechText: "I am in year 5.",
      explanation: "💡 I <strong>am</strong> in year 5."
    }
  ]
});
