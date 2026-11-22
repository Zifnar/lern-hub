/**
 * KOPIERVORLAGE für neue Lern-Hub Module
 * -------------------------------------
 * 1. Kopiere diese Datei in einen passenden Ordner, z. B.:
 *    data/mathe/klasse-5/bruchrechnen.js
 * 2. Vergib eine eindeutige `id` (keine Leerzeichen!) und wähle `type`:
 *    - "sentence-builder" (Lückenwörter oder Sätze zusammenklicken)
 *    - "quiz"             (Multiple-Choice mit 2–4 Antworten)
 *    - "type-in"          (Antwort selbst eintippen, z. B. Vokabeln/Kurzformen/Mathe)
 * 3. Trage den Dateipfad in data/manifest.js im Array `modules` ein.
 */

/* === BEISPIEL 1: SATZBAU / LÜCKEN-KLICKER ("sentence-builder") === */
LernHub.registerModule({
  id: "fach-klasse-thema-satzbau",
  subjectId: "englisch",        // "englisch" | "mathe" | "deutsch" | "nawi" | "latein"
  subject: "Englisch",
  grade: 5,
  topic: "Mein Thema",
  lang: "en",                   // "en" für Vorlese-Button auf Englisch, sonst "de"
  icon: "🧩",
  badgeLabel: "Satzbau",
  type: "sentence-builder",
  title: "Titel der Übung",
  description: "Kurze Erklärung für dein Kind.",
  order: 1,                     // Reihenfolge auf dem Lernpfad (1, 2, 3...)
  shuffle: true,
  roundSize: 10,
  cheatSheet: {                 // Optionaler Grammatik-Spickzettel
    title: "Spickzettel",
    subtitle: "Kurzüberblick vor der Runde",
    sections: [
      {
        type: "table",
        heading: "Übersicht",
        headers: ["Deutsch", "Englisch"],
        rows: [["Beispiel", "Example"]]
      },
      {
        type: "tips",
        heading: "Wichtige Tipps",
        items: ["Merksatz 1", "Merksatz 2"]
      }
    ]
  },
  tasks: [
    {
      id: "t01",                // Optional, aber empfohlen (damit der Lernstand stabil bleibt)
      label: "Aufgaben-Hinweis",
      prompt: "Deutsche Vorgabe / Aufgabe",
      prefix: "Fester Text davor (optional)",
      suffix: "Fester Text danach (optional)",
      hint: "Tipp (wird erst auf Klick angezeigt)",
      words: ["Wort1", "Wort2"],
      distractors: ["Falsch1", "Falsch2"]
    }
  ]
});

/* === BEISPIEL 2: QUIZ ("quiz") ===
LernHub.registerModule({
  id: "fach-klasse-thema-quiz",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "Mein Thema",
  lang: "en",
  icon: "⚡",
  badgeLabel: "Quiz",
  type: "quiz",
  title: "Quiz-Titel",
  description: "Kurze Beschreibung.",
  shuffle: true,
  roundSize: 10,
  tasks: [
    {
      id: "q01",
      category: "Kategorie",
      question: "Wie lautet ...?",
      subtext: "Optionaler Zusatztext",
      hint: "Optionaler Tipp",
      options: ["Richtig", "Falsch A", "Falsch B", "Falsch C"],
      answer: "Richtig",
      speechText: "Optionaler englischer Satz zum Vorlesen",
      explanation: "Kurze Erklärung, warum die Lösung stimmt."
    }
  ]
});
*/

/* === BEISPIEL 3: SCHREIBTRAINER ("type-in") ===
LernHub.registerModule({
  id: "fach-klasse-thema-tippen",
  subjectId: "englisch",
  subject: "Englisch",
  grade: 5,
  topic: "Mein Thema",
  lang: "en",
  icon: "⌨️",
  badgeLabel: "Schreibtrainer",
  type: "type-in",
  title: "Eintipp-Übung",
  description: "Tippe die fehlenden Wörter ein.",
  shuffle: true,
  roundSize: 10,
  tasks: [
    {
      id: "s01",
      label: "Schreibtrainer",
      prompt: "Kurzform von: You are not",
      prefix: "",
      suffix: "",
      hint: "Achte auf das Apostroph!",
      answer: "You aren't",
      accept: ["You're not"],    // Weitere gültige Varianten (optional)
      explanation: "Erklärung nach dem Prüfen."
    }
  ]
});
*/
