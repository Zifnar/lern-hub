# Neue Tests & Aufgaben im Lern-Hub anlegen

Der Lern-Hub ist so aufgebaut, dass du **ohne Programmierkenntnisse und ohne Build-Tool** jederzeit neue Fächer, Klassenstufen und Tests ergänzen kannst (funktioniert direkt durch Öffnen von `index.html` im Browser).

---

## In 2 Schritten zu einem neuen Test

1. **Neue Aufgaben-Datei anlegen**
   Lege eine `.js`-Datei im passenden Ordner unter `data/` an, z. B.:
   * `data/englisch/klasse-5/have-got.js`
   * `data/mathe/klasse-5/einmaleins-quiz.js`
   * Nutze als Startpunkt einfach [`data/_template.js`](data/_template.js).

2. **In [`data/manifest.js`](data/manifest.js) eintragen**
   Füge den Pfad zu deiner neuen Datei in das Array `modules` ein:
   ```js
   modules: [
     "data/englisch/klasse-5/to-be-fragen.js",
     "data/englisch/klasse-5/have-got.js" // <-- neu hinzugefügt
   ]
   ```
   **Fertig!** Nach dem Neuladen im Browser erscheint das Modul automatisch im Dashboard, wird nach Fach & Klasse gefiltert und unterstützt sofort Sterne, Serien, „Zweite Chance“-Wiederholung, Abzeichen und schlaue Aufgaben-Auswahl.

---

## Die 3 verfügbaren Spiel-Engines

### 1. `sentence-builder` (Wörter- & Lücken-Klicker)
Ideal für Satzbau, Fragesätze oder 1–2-Wort-Lücken (ohne Frust durch Vokabel-Tippen).
* **Pflichtfelder pro Task:**
  * `prompt` *(String)*: Deutsche Aufgabe oder Frage.
  * `words` *(Array)*: Die gesuchten Bausteine in richtiger Reihenfolge, z. B. `["Is", "she"]`.
* **Optionale Felder:**
  * `id` *(String)*: Eindeutige ID (z. B. `"q01"`), damit der Lernfortschritt stabil bleibt.
  * `prefix` / `suffix` *(String)*: Fester Text vor bzw. nach den Lücken (z. B. `suffix: "from Germany?"`).
  * `distractors` *(Array)*: Falsche Ablenkungswörter (z. B. `["Are", "he"]`).
  * `hint` *(String)*: Tipp, der erst bei Klick auf `💡 Tipp` erscheint.
  * `label` *(String)*: Kleine Überschrift in der Aufgaben-Box.

### 2. `quiz` (Multiple Choice)
Ideal für Schreibweisen (Apostroph-Fallen!), Grammatik-Entscheidungen oder Vokabel-Auswahl.
* **Pflichtfelder pro Task:**
  * `question` *(String)*: Die Frage.
  * `options` *(Array)*: 2–4 Antwortmöglichkeiten (werden automatisch gemischt).
  * `answer` *(String)*: Exakter Text der richtigen Option aus `options`.
* **Optionale Felder:**
  * `id`, `category`, `subtext`, `hint`, `explanation` (HTML-Safe/einfaches `<strong>` möglich), `speechText` (englischer Satz zum Vorlesen), `shuffleOptions: false` (falls Reihenfolge fest bleiben soll).

### 3. `type-in` (Schreibtrainer)
Ideal kurz vor Klassenarbeiten, um Kurzformen, Verben oder Vokabeln aktiv einzutippen – inklusive **`'`-Schnelltaste** für iPads und automatischer Apostroph-Diagnose.
* **Pflichtfelder pro Task:**
  * `prompt` *(String)*: Aufgabenstellung.
  * `answer` *(String)*: Standardlösung.
* **Optionale Felder:**
  * `id`, `label`, `prefix`, `suffix`, `hint`, `explanation`, `placeholder`, `accept` *(Array alternativer richtiger Antworten)*, `caseSensitive: true` (Standard ist `false`, damit Groß-/Kleinschreibung nicht unnötig frustriert).

---

## Lernpfad-Reihenfolge & Spickzettel (`order` & `cheatSheet`)

Auf Modul-Ebene kannst du zusätzlich angeben:
* `order` *(Zahl, z. B. `1`, `2`, `3`)*: Bestimmt die Etappen-Reihenfolge in der Lernpfad-Ansicht.
* `cheatSheet` *(Objekt)*: Erzeugt automatisch einen `📖 Spickzettel`-Button auf der Etappe und im Spiel. Unterstützt `sections` vom Typ `"table"` (`headers`, `rows`) und `"tips"` (`items`) – siehe [`data/_template.js`](data/_template.js).

---

## Tipps für besonders schnelles Erstellen mit KI-Hilfe

Fotografiere einfach die nächste Buchseite oder das Arbeitsblatt deiner Tochter und schreibe:
> *„Erstelle mir für den Lern-Hub eine neue Datei unter `data/englisch/klasse-5/...` nach `data/_template.js` (passende Engine wählen) mit 20–25 Übungen und trage sie in `data/manifest.js` ein.“*
