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

  function playSound(type, streak) {
    if (LernHub.Feedback && typeof LernHub.Feedback.play === "function") {
      LernHub.Feedback.play(type, streak);
    }
  }

  function canSpeak(mod, task) {
    return Boolean(
      (task && task.speechText) || (mod && mod.lang === "en")
    ) && Boolean(LernHub.Feedback && typeof LernHub.Feedback.canSpeak === "function" && LernHub.Feedback.canSpeak());
  }

  const PRAISE = [
    "Genau richtig! Weiter so!",
    "Super aufgepasst!",
    "Top! Das hast du drauf!",
    "Klasse! Wieder ein Stern!"
  ];

  const ENCOURAGE = [
    "Gar kein Problem – schau dir den Tipp an!",
    "Knapp daneben! Gleich kommt die zweite Chance.",
    "Übung macht den Meister – weiter geht's!"
  ];

  const engine = {
    render(container, moduleData, ctx) {
      let activeTasks = [];
      let retryQueue = [];
      let isRetryPhase = false;
      let initialCount = 0;
      let currentIndex = 0;
      let firstTryScore = 0;
      let retrySolvedCount = 0;
      let selectedOptionIndex = null;
      let currentOptions = [];
      let isChecked = false;
      let lastIsCorrect = null;
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
        const task = activeTasks[currentIndex];
        currentOptions = task.shuffleOptions !== false ? shuffle(task.options || []) : (task.options || []).slice();
        selectedOptionIndex = null;
        isChecked = false;
        lastIsCorrect = null;
        hintVisible = false;

        if (ctx.onProgress) {
          ctx.onProgress(currentIndex + 1, activeTasks.length, isRetryPhase);
        }
        if (ctx.onMascot) {
          ctx.onMascot(
            "happy",
            isRetryPhase
              ? "Zweite Chance! Lies genau und schnapp dir den Punkt!"
              : "Wähle die richtige Antwort aus (oder drücke 1–4)."
          );
        }
        draw();
      }

      function selectOption(index) {
        if (isChecked || destroyed) return;
        if (index < 0 || index >= currentOptions.length) return;
        selectedOptionIndex = index;
        playSound("tap");
        draw();
      }

      function checkAnswer() {
        if (selectedOptionIndex === null || isChecked || destroyed) return;
        isChecked = true;
        const task = activeTasks[currentIndex];
        const selectedAnswer = currentOptions[selectedOptionIndex];
        const isCorrect = selectedAnswer === task.answer;
        lastIsCorrect = isCorrect;

        if (isCorrect) {
          if (!isRetryPhase) {
            firstTryScore++;
          } else {
            retrySolvedCount++;
          }
        } else if (!isRetryPhase) {
          retryQueue.push(task);
        }

        const res = ctx.onAnswer ? ctx.onAnswer(task, isCorrect, isRetryPhase) : { streak: 0 };
        playSound(isCorrect ? "correct" : "wrong", res && res.streak);

        if (ctx.onMascot) {
          if (isCorrect) {
            ctx.onMascot("cheer", PRAISE[Math.floor(Math.random() * PRAISE.length)]);
          } else {
            ctx.onMascot("think", ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
          }
        }

        if (
          isCorrect &&
          canSpeak(moduleData, task) &&
          LernHub.Storage &&
          LernHub.Storage.getSettings().autoSpeak
        ) {
          LernHub.Feedback.speak(task.speechText || task.answer, moduleData.lang);
        }

        draw();
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
            <h3>Keine offenen Fehler in diesem Quiz!</h3>
            <p>Du hast hier gerade keine offenen Fehler-Aufgaben. Starte einfach eine neue Zufalls-Runde!</p>
            <div class="game-actions" style="justify-content: center; margin-top: 1.5rem;">
              <button id="btn-to-hub" class="btn btn-primary">← Zur Übersicht</button>
            </div>
          </div>
        `;
        const backBtn = container.querySelector("#btn-to-hub");
        if (backBtn) backBtn.addEventListener("click", () => ctx.onExit && ctx.onExit());
      }

      function draw() {
        if (destroyed) return;
        const task = activeTasks[currentIndex];
        const speakAvailable = canSpeak(moduleData, task);

        container.innerHTML = `
          ${
            isRetryPhase
              ? `<div class="retry-banner">🔄 <strong>Zweite Chance!</strong> Noch ${activeTasks.length - currentIndex} knifflige Frage(n) – jetzt knackst du sie!</div>`
              : ""
          }

          <div class="task-card-inner">
            <div class="prompt-box">
              <div class="prompt-top-row">
                <div class="prompt-label">${escapeHtml(task.category || "Grammatik-Check")}</div>
                ${
                  task.hint && !hintVisible && !isChecked
                    ? `<button type="button" id="btn-show-hint" class="btn-hint">💡 Tipp</button>`
                    : ""
                }
              </div>
              <div class="prompt-text">${escapeHtml(task.question)}</div>
              ${task.subtext ? `<div class="prompt-subtext">${escapeHtml(task.subtext)}</div>` : ""}
              ${
                task.hint && hintVisible
                  ? `<div class="prompt-hint reveal-anim">💡 Tipp: ${escapeHtml(task.hint)}</div>`
                  : ""
              }
            </div>

            <div class="quiz-options">
              ${currentOptions
                .map((opt, idx) => {
                  let stateClass = "";
                  if (selectedOptionIndex === idx) stateClass = "selected";
                  if (isChecked) {
                    if (opt === task.answer) {
                      stateClass = "correct";
                    } else if (selectedOptionIndex === idx) {
                      stateClass = "wrong";
                    }
                  }
                  return `
                    <button type="button" class="quiz-option-btn ${stateClass}" data-opt-idx="${idx}" ${isChecked ? "disabled" : ""}>
                      <span class="quiz-option-marker">${String.fromCharCode(65 + idx)}</span>
                      <span class="quiz-option-text">${escapeHtml(opt)}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>

            ${
              isChecked
                ? `<div class="feedback-box ${lastIsCorrect ? "success" : "error"}">
                    <div class="feedback-content">
                      ${
                        lastIsCorrect
                          ? `✅ <strong>Richtig!</strong> ${task.explanation ? "<div class='feedback-explain'>" + task.explanation + "</div>" : ""}`
                          : `❌ <strong>Nicht ganz!</strong> Richtig ist: <strong>${escapeHtml(task.answer)}</strong>. ${
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
                  ? `<button type="button" id="btn-quiz-check" class="btn btn-primary" ${
                      selectedOptionIndex === null ? "disabled" : ""
                    }>Antwort prüfen</button>`
                  : `<button type="button" id="btn-quiz-next" class="btn btn-primary">
                      ${
                        currentIndex + 1 < activeTasks.length
                          ? "Nächste Frage →"
                          : !isRetryPhase && retryQueue.length > 0
                            ? "🔄 Zur Zweiten Chance →"
                            : "Ergebnis anzeigen →"
                      }
                    </button>`
              }
            </div>
          </div>
        `;

        container.querySelectorAll("[data-opt-idx]").forEach((btn) => {
          btn.addEventListener("click", () => selectOption(parseInt(btn.dataset.optIdx, 10)));
        });

        const hintBtn = container.querySelector("#btn-show-hint");
        if (hintBtn) {
          hintBtn.addEventListener("click", () => {
            hintVisible = true;
            playSound("tap");
            if (ctx.onMascot) ctx.onMascot("think", "Schau mal in den Tipp!");
            draw();
          });
        }

        const checkBtn = container.querySelector("#btn-quiz-check");
        if (checkBtn) checkBtn.addEventListener("click", checkAnswer);

        const nextBtn = container.querySelector("#btn-quiz-next");
        if (nextBtn) nextBtn.addEventListener("click", nextTask);

        const speakBtn = container.querySelector("#btn-speak");
        if (speakBtn) {
          speakBtn.addEventListener("click", () => {
            LernHub.Feedback.speak(task.speechText || task.answer, moduleData.lang);
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
            isPerfect ? "100 % fehlerfrei! Du bist ein Profi!" : "Super gemacht! Wieder viel gelernt!"
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
            <h3>${isPerfect ? "🏆 Fehlerfreie Meister-Runde!" : "🎉 Runde geschafft!"}</h3>
            <p class="summary-score">
              Du hast <strong>${firstTryScore} von ${initialCount}</strong> Fragen beim ersten Versuch richtig beantwortet!
            </p>
            ${
              retrySolvedCount > 0
                ? `<p class="summary-bonus">🎯 Und <strong>${retrySolvedCount}</strong> knifflige Frage(n) in der Zweiten Chance geknackt!</p>`
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
        const key = e.key ? e.key.toLowerCase() : "";

        if (!isChecked) {
          const num = parseInt(key, 10);
          if (num >= 1 && num <= 4) {
            if (num - 1 < currentOptions.length) {
              e.preventDefault();
              selectOption(num - 1);
            }
            return;
          }
          if (key === "a" || key === "b" || key === "c" || key === "d") {
            const idx = key.charCodeAt(0) - 97;
            if (idx < currentOptions.length) {
              e.preventDefault();
              selectOption(idx);
            }
            return;
          }
          if (e.key === "Enter" && selectedOptionIndex !== null) {
            e.preventDefault();
            checkAnswer();
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          nextTask();
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

  LernHub.registerEngine("quiz", engine);
})(typeof window !== "undefined" ? window : globalThis);
