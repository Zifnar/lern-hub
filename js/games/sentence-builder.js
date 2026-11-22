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

  function canSpeak(mod) {
    return Boolean(
      mod && mod.lang === "en" && LernHub.Feedback && typeof LernHub.Feedback.canSpeak === "function" && LernHub.Feedback.canSpeak()
    );
  }

  const PRAISE = [
    "Super gemacht! Weiter so!",
    "Volltreffer! Das sitzt!",
    "Genau richtig gebaut!",
    "Stark! Du wirst immer sicherer!",
    "Perfekt! Ein Stern für dich!"
  ];

  const ENCOURAGE = [
    "Kein Problem – üben macht den Meister!",
    "Fast! Schau dir die richtige Lösung kurz an.",
    "Nicht schlimm! Die Aufgabe kommt gleich nochmal dran."
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
      let selectedTokens = [];
      let poolTokens = [];
      let isChecked = false;
      let lastIsCorrect = null;
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
        const task = activeTasks[currentIndex];
        const allWords = (task.words || []).concat(task.distractors || []);
        poolTokens = shuffle(
          allWords.map((word, idx) => ({
            id: `${currentIndex}-${idx}-${word}`,
            text: word,
            used: false
          }))
        );
        selectedTokens = [];
        isChecked = false;
        lastIsCorrect = null;
        lastFullTarget = "";
        hintVisible = false;

        if (ctx.onProgress) {
          ctx.onProgress(currentIndex + 1, activeTasks.length, isRetryPhase);
        }
        if (ctx.onMascot) {
          ctx.onMascot(
            "happy",
            isRetryPhase
              ? "Zweite Chance! Jetzt knackst du diese Aufgabe!"
              : "Klicke die passenden Wörter in die Lücken."
          );
        }
        draw();
      }

      function selectWord(tokenId) {
        if (isChecked || destroyed) return;
        const task = activeTasks[currentIndex];
        if (selectedTokens.length >= task.words.length) return;

        const token = poolTokens.find((t) => t.id === tokenId);
        if (!token || token.used) return;
        token.used = true;
        selectedTokens.push(token);
        playSound("tap");
        draw();
      }

      function removeWord(tokenId) {
        if (isChecked || destroyed) return;
        const idx = selectedTokens.findIndex((t) => t.id === tokenId);
        if (idx === -1) return;
        const removed = selectedTokens.splice(idx, 1)[0];
        removed.used = false;
        playSound("tap");
        draw();
      }

      function clearSelection() {
        if (isChecked || destroyed) return;
        poolTokens.forEach((t) => (t.used = false));
        selectedTokens = [];
        playSound("tap");
        draw();
      }

      function checkAnswer() {
        if (isChecked || destroyed) return;
        const task = activeTasks[currentIndex];
        if (selectedTokens.length < task.words.length) return;

        isChecked = true;
        const builtWords = selectedTokens.map((t) => t.text).join(" ");
        const targetWords = task.words.join(" ");
        const isCorrect = builtWords === targetWords;
        const fullTarget = [task.prefix, targetWords, task.suffix].filter(Boolean).join(" ");

        lastIsCorrect = isCorrect;
        lastFullTarget = fullTarget;

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
            const msg = PRAISE[Math.floor(Math.random() * PRAISE.length)];
            ctx.onMascot("cheer", msg);
          } else {
            const msg = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
            ctx.onMascot("think", msg);
          }
        }

        if (isCorrect && canSpeak(moduleData) && LernHub.Storage && LernHub.Storage.getSettings().autoSpeak) {
          LernHub.Feedback.speak(fullTarget, moduleData.lang);
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
            <h3>Keine offenen Fehler in diesem Modul!</h3>
            <p>Du hast hier gerade keine offenen Fehler-Aufgaben. Starte einfach eine normale Zufalls-Runde!</p>
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
        const neededCount = task.words.length;
        const emptySlotsCount = Math.max(0, neededCount - selectedTokens.length);
        const isFull = selectedTokens.length >= neededCount;
        const speakAvailable = canSpeak(moduleData);

        container.innerHTML = `
          ${
            isRetryPhase
              ? `<div class="retry-banner">🔄 <strong>Zweite Chance!</strong> Noch ${activeTasks.length - currentIndex} knifflige Aufgabe(n) – jetzt knackst du sie!</div>`
              : ""
          }

          <div class="task-card-inner">
            <div class="prompt-box">
              <div class="prompt-top-row">
                <div class="prompt-label">${escapeHtml(task.label || "Setze die fehlenden Wörter ein")}</div>
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

            <div class="sentence-frame-container ${isChecked ? (lastIsCorrect ? "frame-correct" : "frame-wrong") : ""}">
              ${task.prefix ? `<span class="frame-fixed-text">${escapeHtml(task.prefix)}</span>` : ""}
              <div class="answer-zone" id="answer-zone">
                ${selectedTokens
                  .map((t, idx) => {
                    let chipState = "in-answer";
                    if (isChecked) {
                      chipState += t.text === task.words[idx] ? " chip-correct" : " chip-wrong";
                    }
                    return `<button type="button" class="word-chip ${chipState}" data-remove-id="${escapeHtml(t.id)}" ${
                      isChecked ? "disabled" : 'title="Klicken zum Entfernen"'
                    }>${escapeHtml(t.text)}</button>`;
                  })
                  .join("")}
                ${Array.from({ length: emptySlotsCount }, () => `<span class="slot-placeholder">[ ? ]</span>`).join("")}
              </div>
              ${task.suffix ? `<span class="frame-fixed-text">${escapeHtml(task.suffix)}</span>` : ""}
            </div>

            <div class="word-bank" id="word-bank">
              ${poolTokens
                .map(
                  (t) =>
                    `<button type="button" class="word-chip" data-add-id="${escapeHtml(t.id)}" ${
                      t.used || isFull || isChecked ? "disabled" : ""
                    }>${escapeHtml(t.text)}</button>`
                )
                .join("")}
            </div>

            ${
              isChecked
                ? `<div class="feedback-box ${lastIsCorrect ? "success" : "error"}">
                    <div class="feedback-content">
                      ${
                        lastIsCorrect
                          ? `✅ <strong>Perfekt!</strong> Richtig: <strong>${escapeHtml(lastFullTarget)}</strong>`
                          : `❌ <strong>Fast!</strong> Richtig wäre: <strong>${escapeHtml(lastFullTarget)}</strong>`
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
                  ? `<button type="button" id="btn-check" class="btn btn-primary" ${
                      !isFull ? "disabled" : ""
                    }>Überprüfen</button>
                     <button type="button" id="btn-clear" class="btn btn-secondary" ${
                       selectedTokens.length === 0 ? "disabled" : ""
                     }>Zurücksetzen</button>`
                  : `<button type="button" id="btn-next" class="btn btn-primary">
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

        container.querySelectorAll("[data-add-id]").forEach((btn) => {
          btn.addEventListener("click", () => selectWord(btn.dataset.addId));
        });

        container.querySelectorAll("[data-remove-id]").forEach((btn) => {
          btn.addEventListener("click", () => removeWord(btn.dataset.removeId));
        });

        const hintBtn = container.querySelector("#btn-show-hint");
        if (hintBtn) {
          hintBtn.addEventListener("click", () => {
            hintVisible = true;
            playSound("tap");
            if (ctx.onMascot) ctx.onMascot("think", "Hier ist ein kleiner Tipp für dich!");
            draw();
          });
        }

        const checkBtn = container.querySelector("#btn-check");
        if (checkBtn) checkBtn.addEventListener("click", checkAnswer);

        const clearBtn = container.querySelector("#btn-clear");
        if (clearBtn) clearBtn.addEventListener("click", clearSelection);

        const nextBtn = container.querySelector("#btn-next");
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
            isPerfect ? "Wahnsinn! 100 % fehlerfrei gelöst!" : "Klasse durchgehalten! Eine tolle Runde!"
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
              Du hast <strong>${firstTryScore} von ${initialCount}</strong> Aufgaben beim ersten Versuch richtig gelöst!
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
          const activeTag = document.activeElement && document.activeElement.tagName;
          if (activeTag === "BUTTON" && document.activeElement.id !== "btn-check" && document.activeElement.id !== "btn-next") {
            return;
          }
          if (!isChecked) {
            const task = activeTasks[currentIndex];
            if (task && selectedTokens.length >= task.words.length) {
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

  LernHub.registerEngine("sentence-builder", engine);
})(typeof window !== "undefined" ? window : globalThis);
