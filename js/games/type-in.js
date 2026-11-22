(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(array) {
    if (LernHub.Scheduler && typeof LernHub.Scheduler.shuffle === "function") {
      return LernHub.Scheduler.shuffle(array);
    }
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function normalizeInput(str) {
    return String(str || "")
      .replace(/[’‘`´ʼ]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function evaluateAnswer(rawInput, task) {
    const userNorm = normalizeInput(rawInput);
    const candidates = [task.answer].concat(Array.isArray(task.accept) ? task.accept : []).map(normalizeInput);
    const caseSensitive = Boolean(task.caseSensitive);

    let matchedExactCase = false;
    let matchedInsensitive = false;

    for (let i = 0; i < candidates.length; i++) {
      const target = candidates[i];
      if (userNorm === target) {
        matchedExactCase = true;
        matchedInsensitive = true;
        break;
      }
      if (!caseSensitive && userNorm.toLowerCase() === target.toLowerCase()) {
        matchedInsensitive = true;
      }
    }

    if (matchedExactCase || matchedInsensitive) {
      return {
        isCorrect: true,
        caseMinorDiff: !matchedExactCase,
        apostropheHint: false,
        userNorm: userNorm
      };
    }

    // Spezial-Diagnose bei Apostroph-Fehlern (z. B. are'nt oder arent statt aren't)
    const userNoApos = userNorm.replace(/'/g, "").toLowerCase();
    let apostropheHint = false;
    if (userNoApos.length > 0) {
      for (let i = 0; i < candidates.length; i++) {
        const targetNoApos = candidates[i].replace(/'/g, "").toLowerCase();
        if (userNoApos === targetNoApos) {
          apostropheHint = true;
          break;
        }
      }
    }

    return {
      isCorrect: false,
      caseMinorDiff: false,
      apostropheHint: apostropheHint,
      userNorm: userNorm
    };
  }

  function playSound(type, streak) {
    if (LernHub.Feedback && typeof LernHub.Feedback.play === "function") {
      LernHub.Feedback.play(type, streak);
    }
  }

  function canSpeak(mod) {
    return Boolean(
      mod && mod.lang === "en" && LernHub.Feedback && typeof LernHub.Feedback.canSpeak === "function" && LernHub.Feedback.canSpeak()
    );
  }

  const PRAISE = [
    "Tipptopp eingetippt!",
    "Fehlerfrei geschrieben! Klasse!",
    "Super! Das sitzt jetzt bombenfest!",
    "Genau richtig! Ein Stern für dich!"
  ];

  const ENCOURAGE = [
    "Fast geschafft – schau dir die Schreibweise genau an!",
    "Kein Problem, beim zweiten Versuch klappt's!"
  ];

  const engine = {
    evaluateAnswer: evaluateAnswer,
    normalizeInput: normalizeInput,

    render(container, moduleData, ctx) {
      let activeTasks = [];
      let retryQueue = [];
      let isRetryPhase = false;
      let initialCount = 0;
      let currentIndex = 0;
      let firstTryScore = 0;
      let retrySolvedCount = 0;
      let currentValue = "";
      let isChecked = false;
      let lastEval = null;
      let lastFullTarget = "";
      let hintVisible = false;
      let destroyed = false;

      function pickTasks() {
        if (LernHub.Scheduler && typeof LernHub.Scheduler.pickRound === "function") {
          return LernHub.Scheduler.pickRound(moduleData, {
            roundSize: ctx.roundSize || moduleData.roundSize || 10,
            mode: ctx.mode || "smart"
          });
        }
        return shuffle(moduleData.tasks || []).slice(0, ctx.roundSize || moduleData.roundSize || 10);
      }

      function startNewRound() {
        activeTasks = pickTasks();
        retryQueue = [];
        isRetryPhase = false;
        initialCount = activeTasks.length;
        currentIndex = 0;
        firstTryScore = 0;
        retrySolvedCount = 0;

        if (activeTasks.length === 0) {
          drawEmpty();
          return;
        }
        initTask();
      }

      function initTask() {
        currentValue = "";
        isChecked = false;
        lastEval = null;
        lastFullTarget = "";
        hintVisible = false;

        if (ctx.onProgress) {
          ctx.onProgress(currentIndex + 1, activeTasks.length, isRetryPhase);
        }
        if (ctx.onMascot) {
          ctx.onMascot(
            "happy",
            isRetryPhase
              ? "Zweite Chance! Jetzt tippst du es richtig!"
              : "Tippe die Lösung ein. Unten gibt's eine extra Apostroph-Taste (')."
          );
        }
        draw(true);
      }

      function checkAnswer() {
        if (isChecked || destroyed) return;
        const inputEl = container.querySelector("#type-in-input");
        if (inputEl) {
          currentValue = inputEl.value;
        }
        if (!normalizeInput(currentValue)) return;

        isChecked = true;
        const task = activeTasks[currentIndex];
        const evaluation = evaluateAnswer(currentValue, task);
        lastEval = evaluation;

        const fullTarget = [task.prefix, task.answer, task.suffix].filter(Boolean).join(" ");
        lastFullTarget = fullTarget;

        if (evaluation.isCorrect) {
          if (!isRetryPhase) {
            firstTryScore++;
          } else {
            retrySolvedCount++;
          }
        } else if (!isRetryPhase) {
          retryQueue.push(task);
        }

        const res = ctx.onAnswer ? ctx.onAnswer(task, evaluation.isCorrect, isRetryPhase) : { streak: 0 };
        playSound(evaluation.isCorrect ? "correct" : "wrong", res && res.streak);

        if (ctx.onMascot) {
          if (evaluation.isCorrect) {
            ctx.onMascot("cheer", PRAISE[Math.floor(Math.random() * PRAISE.length)]);
          } else if (evaluation.apostropheHint) {
            ctx.onMascot("think", "Fast! Deine Buchstaben stimmen – schau genau aufs Apostroph!");
          } else {
            ctx.onMascot("think", ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
          }
        }

        if (
          evaluation.isCorrect &&
          canSpeak(moduleData) &&
          LernHub.Storage &&
          LernHub.Storage.getSettings().autoSpeak
        ) {
          LernHub.Feedback.speak(fullTarget, moduleData.lang);
        }

        draw(false);
      }

      function nextTask() {
        if (!isChecked || destroyed) return;
        currentIndex++;
        if (currentIndex < activeTasks.length) {
          initTask();
          return;
        }
        if (!isRetryPhase && retryQueue.length > 0) {
          isRetryPhase = true;
          activeTasks = shuffle(retryQueue);
          retryQueue = [];
          currentIndex = 0;
          initTask();
          return;
        }

        if (ctx.onModuleComplete) {
          ctx.onModuleComplete(moduleData.id, firstTryScore, initialCount, retrySolvedCount);
        }
        drawSummary();
      }

      function insertApostrophe() {
        if (isChecked || destroyed) return;
        const inputEl = container.querySelector("#type-in-input");
        if (!inputEl) return;

        const start = typeof inputEl.selectionStart === "number" ? inputEl.selectionStart : inputEl.value.length;
        const end = typeof inputEl.selectionEnd === "number" ? inputEl.selectionEnd : inputEl.value.length;
        const val = inputEl.value;
        inputEl.value = val.slice(0, start) + "'" + val.slice(end);
        currentValue = inputEl.value;

        inputEl.focus();
        const newPos = start + 1;
        if (typeof inputEl.setSelectionRange === "function") {
          inputEl.setSelectionRange(newPos, newPos);
        }
        playSound("tap");

        const checkBtn = container.querySelector("#btn-type-check");
        if (checkBtn) checkBtn.disabled = normalizeInput(currentValue).length === 0;
      }

      function getCheerAvatar() {
        if (LernHub.Storage && typeof LernHub.Storage.getAvatarInfo === "function") {
          return LernHub.Storage.getAvatarInfo("cheer");
        }
        return { imgSrc: "assets/img/mascot-cheer.png", frameClass: "frame-classic", outfitName: "Lumi" };
      }

      function drawEmpty() {
        const av = getCheerAvatar();
        container.innerHTML = `
          <div class="summary-box">
            <div class="summary-visuals">
              <div class="summary-mascot-wrap ${escapeHtml(av.frameClass)}">
                <img src="${escapeHtml(av.imgSrc)}" alt="${escapeHtml(av.outfitName)}" class="summary-mascot" />
              </div>
            </div>
            <h3>Keine offenen Tipp-Fehler!</h3>
            <p>Alle kniffligen Aufgaben hier sind schon gemeistert. Starte eine neue Zufalls-Runde!</p>
            <div class="game-actions" style="justify-content: center; margin-top: 1.5rem;">
              <button id="btn-to-hub" class="btn btn-primary">← Zur Übersicht</button>
            </div>
          </div>
        `;
        const backBtn = container.querySelector("#btn-to-hub");
        if (backBtn) backBtn.addEventListener("click", () => ctx.onExit && ctx.onExit());
      }

      function draw(shouldFocus) {
        if (destroyed) return;
        const task = activeTasks[currentIndex];
        const speakAvailable = canSpeak(moduleData);
        const inputStateClass = isChecked ? (lastEval.isCorrect ? "input-correct" : "input-wrong") : "";

        container.innerHTML = `
          ${
            isRetryPhase
              ? `<div class="retry-banner">🔄 <strong>Zweite Chance!</strong> Noch ${activeTasks.length - currentIndex} knifflige Aufgabe(n) – jetzt knackst du sie!</div>`
              : ""
          }

          <div class="task-card-inner">
            <div class="prompt-box">
              <div class="prompt-top-row">
                <div class="prompt-label">${escapeHtml(task.label || "Tippe die Lösung ein")}</div>
                ${
                  task.hint && !hintVisible && !isChecked
                    ? `<button type="button" id="btn-show-hint" class="btn-hint">💡 Tipp</button>`
                    : ""
                }
              </div>
              <div class="prompt-text">${escapeHtml(task.prompt)}</div>
              ${
                task.hint && hintVisible
                  ? `<div class="prompt-hint reveal-anim">💡 Tipp: ${escapeHtml(task.hint)}</div>`
                  : ""
              }
            </div>

            <div class="sentence-frame-container ${isChecked ? (lastEval.isCorrect ? "frame-correct" : "frame-wrong") : ""}">
              ${task.prefix ? `<span class="frame-fixed-text">${escapeHtml(task.prefix)}</span>` : ""}
              <input
                type="text"
                id="type-in-input"
                class="type-in-input ${inputStateClass}"
                value="${escapeHtml(currentValue)}"
                placeholder="${escapeHtml(task.placeholder || "Hier tippen...")}"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                ${isChecked ? "disabled" : ""}
              />
              ${task.suffix ? `<span class="frame-fixed-text">${escapeHtml(task.suffix)}</span>` : ""}
            </div>

            ${
              !isChecked
                ? `<div class="type-helpers">
                    <button type="button" id="btn-apostrophe" class="btn-helper-key" title="Apostroph einfügen">
                      <strong>'</strong> Apostroph einfügen
                    </button>
                  </div>`
                : ""
            }

            ${
              isChecked
                ? `<div class="feedback-box ${lastEval.isCorrect ? "success" : "error"}">
                    <div class="feedback-content">
                      ${
                        lastEval.isCorrect
                          ? `✅ <strong>Super!</strong> ${
                              lastEval.caseMinorDiff
                                ? `Richtig! (Standard-Schreibweise: <strong>${escapeHtml(task.answer)}</strong>)`
                                : `Perfekt: <strong>${escapeHtml(lastFullTarget)}</strong>`
                            } ${task.explanation ? "<div class='feedback-explain'>" + task.explanation + "</div>" : ""}`
                          : lastEval.apostropheHint
                            ? `🧐 <strong>Fast! Deine Buchstaben stimmen – schau nur genau, wo das Apostroph (') sitzt!</strong><br>Richtig wäre: <strong>${escapeHtml(task.answer)}</strong> ${
                                task.explanation ? "<div class='feedback-explain'>" + task.explanation + "</div>" : ""
                              }`
                            : `❌ <strong>Nicht ganz!</strong> Richtig wäre: <strong>${escapeHtml(task.answer)}</strong> ${
                                task.explanation ? "<div class='feedback-explain'>" + task.explanation + "</div>" : ""
                              }`
                      }
                    </div>
                    ${
                      speakAvailable
                        ? `<button type="button" id="btn-speak" class="btn-speak" title="Auf Englisch anhören">🔊 Anhören</button>`
                        : ""
                    }
                  </div>`
                : ""
            }

            <div class="game-actions">
              ${
                !isChecked
                  ? `<button type="button" id="btn-type-check" class="btn btn-primary" ${
                      normalizeInput(currentValue).length === 0 ? "disabled" : ""
                    }>Überprüfen</button>`
                  : `<button type="button" id="btn-type-next" class="btn btn-primary">
                      ${
                        currentIndex + 1 < activeTasks.length
                          ? "Nächste Aufgabe →"
                          : !isRetryPhase && retryQueue.length > 0
                            ? "🔄 Zur Zweiten Chance →"
                            : "Ergebnis anzeigen →"
                      }
                    </button>`
              }
            </div>
          </div>
        `;

        const inputEl = container.querySelector("#type-in-input");
        const checkBtn = container.querySelector("#btn-type-check");
        if (inputEl) {
          inputEl.addEventListener("input", () => {
            currentValue = inputEl.value;
            if (checkBtn) {
              checkBtn.disabled = normalizeInput(currentValue).length === 0;
            }
          });
          if (shouldFocus && !isChecked) {
            setTimeout(() => {
              if (!destroyed && inputEl) inputEl.focus();
            }, 30);
          }
        }

        const aposBtn = container.querySelector("#btn-apostrophe");
        if (aposBtn) {
          aposBtn.addEventListener("mousedown", (e) => e.preventDefault());
          aposBtn.addEventListener("click", insertApostrophe);
        }

        const hintBtn = container.querySelector("#btn-show-hint");
        if (hintBtn) {
          hintBtn.addEventListener("click", () => {
            if (inputEl) currentValue = inputEl.value;
            hintVisible = true;
            playSound("tap");
            if (ctx.onMascot) ctx.onMascot("think", "Schau mal in den Tipp!");
            draw(true);
          });
        }

        if (checkBtn) checkBtn.addEventListener("click", checkAnswer);

        const nextBtn = container.querySelector("#btn-type-next");
        if (nextBtn) nextBtn.addEventListener("click", nextTask);

        const speakBtn = container.querySelector("#btn-speak");
        if (speakBtn) {
          speakBtn.addEventListener("click", () => {
            LernHub.Feedback.speak(lastFullTarget, moduleData.lang);
          });
        }
      }

      function drawSummary() {
        if (destroyed) return;
        const isPerfect = initialCount > 0 && firstTryScore === initialCount;
        const mastery =
          LernHub.Storage && typeof LernHub.Storage.getModuleMastery === "function"
            ? LernHub.Storage.getModuleMastery(moduleData)
            : null;

        playSound("complete");
        if (isPerfect && LernHub.Feedback && typeof LernHub.Feedback.confetti === "function") {
          LernHub.Feedback.confetti();
        }
        if (ctx.onMascot) {
          ctx.onMascot(
            "cheer",
            isPerfect ? "100 % perfekt eingetippt! Stark!" : "Tolles Schreib-Training!"
          );
        }

        const av = getCheerAvatar();
        container.innerHTML = `
          <div class="summary-box">
            <div class="summary-visuals">
              <div class="summary-mascot-wrap ${escapeHtml(av.frameClass)}">
                <img src="${escapeHtml(av.imgSrc)}" alt="${escapeHtml(av.outfitName)}" class="summary-mascot" />
              </div>
              ${isPerfect ? `<img src="assets/img/trophy-star.png" alt="Pokal" class="summary-trophy" />` : ""}
            </div>
            <h3>${isPerfect ? "🏆 Fehlerfreie Meister-Runde!" : "🎉 Schreib-Runde geschafft!"}</h3>
            <p class="summary-score">
              Du hast <strong>${firstTryScore} von ${initialCount}</strong> Aufgaben beim ersten Versuch richtig eingetippt!
            </p>
            ${
              retrySolvedCount > 0
                ? `<p class="summary-bonus">🎯 Und <strong>${retrySolvedCount}</strong> knifflige Aufgabe(n) in der Zweiten Chance geknackt!</p>`
                : ""
            }
            ${
              mastery
                ? `<div class="summary-mastery">
                    <span>Modul-Fortschritt: <strong>${mastery.mastered} / ${mastery.total}</strong> Aufgaben gemeistert (${mastery.percent} %)</span>
                    <div class="mini-progress-track"><div class="mini-progress-fill" style="width: ${mastery.percent}%"></div></div>
                  </div>`
                : ""
            }
            <div class="game-actions" style="justify-content: center; margin-top: 1.5rem;">
              <button type="button" id="btn-restart" class="btn btn-primary">🎲 Neue Zufalls-Runde</button>
              <button type="button" id="btn-to-hub" class="btn btn-secondary">← Zur Übersicht</button>
            </div>
          </div>
        `;

        container.querySelector("#btn-restart").addEventListener("click", () => {
          playSound("tap");
          startNewRound();
        });

        container.querySelector("#btn-to-hub").addEventListener("click", () => {
          playSound("tap");
          if (ctx.onExit) ctx.onExit();
        });
      }

      function onKeyDown(e) {
        if (destroyed) return;
        if (e.key === "Enter") {
          if (!isChecked) {
            const inputEl = container.querySelector("#type-in-input");
            const val = inputEl ? inputEl.value : currentValue;
            if (normalizeInput(val).length > 0) {
              e.preventDefault();
              checkAnswer();
            }
          } else {
            e.preventDefault();
            nextTask();
          }
        }
      }

      if (typeof document !== "undefined") {
        document.addEventListener("keydown", onKeyDown);
      }

      startNewRound();

      return {
        destroy() {
          destroyed = true;
          if (typeof document !== "undefined") {
            document.removeEventListener("keydown", onKeyDown);
          }
        }
      };
    }
  };

  LernHub.registerEngine("type-in", engine);
})(typeof window !== "undefined" ? window : globalThis);
