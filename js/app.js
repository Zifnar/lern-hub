(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyFrameClass(el, frameClass) {
    if (!el) return;
    const allFrames = ["frame-classic", "frame-gold", "frame-rainbow", "frame-galaxy", "frame-emerald"];
    allFrames.forEach((cls) => el.classList.remove(cls));
    el.classList.add(frameClass || "frame-classic");
  }

  function initApp() {
    const Storage = LernHub.Storage;
    const Feedback = LernHub.Feedback;

    let activeSubject = "all";
    let activeGrade = "all";
    let activeWardrobeTab = "outfits";
    let activeEngineHandle = null;
    let activeModule = null;

    const viewDashboard = document.getElementById("view-dashboard");
    const viewGame = document.getElementById("view-game");
    const moduleContainer = document.getElementById("module-container");
    const subjectTabsEl = document.getElementById("subject-tabs");
    const gradeFilterEl = document.getElementById("grade-filter");
    const viewModePillsEl = document.getElementById("view-mode-pills");
    const roundSizePillsEl = document.getElementById("round-size-pills");

    const totalStarsEl = document.getElementById("total-stars");
    const currentStreakEl = document.getElementById("current-streak");
    const totalCoinsEl = document.getElementById("total-coins");
    const badgesCountEl = document.getElementById("badges-count");
    const themeBtn = document.getElementById("btn-toggle-theme");
    const soundBtn = document.getElementById("btn-toggle-sound");

    const brandAvatarWrap = document.getElementById("brand-avatar-wrap");
    const brandAvatarImg = document.getElementById("brand-avatar-img");
    const heroMascotWrap = document.getElementById("hero-mascot-wrap");
    const heroMascotImg = document.getElementById("hero-mascot-img");

    const heroLevelBadge = document.getElementById("hero-level-badge");
    const heroDailyPill = document.getElementById("hero-daily-pill");
    const heroXpText = document.getElementById("hero-xp-text");
    const heroXpBar = document.getElementById("hero-xp-bar");
    const heroActionBtn = document.getElementById("btn-hero-action");
    const heroSubtitle = document.getElementById("hero-subtitle");

    const gameCheatBtn = document.getElementById("btn-game-cheatsheet");
    const mascotGameWrap = document.getElementById("mascot-game-wrap");
    const mascotGameImg = document.getElementById("mascot-game-img");
    const mascotMoodBadge = document.getElementById("mascot-mood-badge");
    const mascotGameBubble = document.getElementById("mascot-game-bubble");

    const modalBadges = document.getElementById("modal-badges");
    const modalStatsRow = document.getElementById("modal-stats-row");
    const badgesGrid = document.getElementById("badges-grid");
    const chkDarkMode = document.getElementById("chk-darkmode");
    const chkSound = document.getElementById("chk-sound");
    const chkAutoSpeak = document.getElementById("chk-autospeak");

    const modalWardrobe = document.getElementById("modal-wardrobe");
    const wardrobePreviewWrap = document.getElementById("wardrobe-preview-wrap");
    const wardrobePreviewImg = document.getElementById("wardrobe-preview-img");
    const wardrobeCoinsEl = document.getElementById("wardrobe-coins");
    const wardrobeEquippedText = document.getElementById("wardrobe-equipped-text");
    const wardrobeTabsEl = document.getElementById("wardrobe-tabs");
    const wardrobeGridEl = document.getElementById("wardrobe-grid");

    const modalCheatSheet = document.getElementById("modal-cheatsheet");
    const cheatSheetTitleEl = document.getElementById("cheatsheet-title");
    const cheatSheetSubEl = document.getElementById("cheatsheet-subtitle");
    const cheatSheetBodyEl = document.getElementById("cheatsheet-body");

    function cleanupActiveEngine() {
      if (activeEngineHandle && typeof activeEngineHandle.destroy === "function") {
        activeEngineHandle.destroy();
      }
      activeEngineHandle = null;
    }

    function applyTheme(theme) {
      const isDark = theme === "dark";
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      if (themeBtn) {
        themeBtn.textContent = isDark ? "☀️" : "🌙";
        themeBtn.title = isDark ? "Tag-Modus aktivieren" : "Abend-Modus (Dunkel) aktivieren";
      }
      if (chkDarkMode) {
        chkDarkMode.checked = isDark;
      }
    }

    function syncAllLumiAvatars() {
      const av = Storage.getAvatarInfo("happy");
      if (brandAvatarImg) brandAvatarImg.setAttribute("src", av.imgSrc);
      applyFrameClass(brandAvatarWrap, av.frameClass);

      if (heroMascotImg) heroMascotImg.setAttribute("src", av.imgSrc);
      applyFrameClass(heroMascotWrap, av.frameClass);

      applyFrameClass(mascotGameWrap, av.frameClass);
      if (mascotGameImg) mascotGameImg.setAttribute("src", av.imgSrc);

      if (wardrobePreviewImg) wardrobePreviewImg.setAttribute("src", av.imgSrc);
      applyFrameClass(wardrobePreviewWrap, av.frameClass);
    }

    function updateHeaderStats() {
      const st = Storage.getState();
      const unlocked = Storage.getUnlockedBadges();
      const settings = Storage.getSettings();

      totalStarsEl.textContent = st.stars;
      currentStreakEl.textContent = st.streak;
      totalCoinsEl.textContent = Storage.getCoins();
      badgesCountEl.textContent = `${unlocked.length}/${Storage.BADGES.length}`;
      soundBtn.textContent = settings.sound !== false ? "🔊" : "🔇";
      soundBtn.title = settings.sound !== false ? "Ton ausschalten" : "Ton einschalten";
      applyTheme(settings.theme || "light");
      syncAllLumiAvatars();
    }

    function updateHero() {
      const lvl = Storage.getLevelInfo();
      const daily = Storage.getDailyProgress();
      const weakTotal = Storage.getAllWeakCount();

      heroLevelBadge.textContent = `Level ${lvl.level} · ${lvl.title}`;
      heroDailyPill.textContent = daily.completed
        ? `✅ Tagesziel (${daily.count} / ${daily.goal})`
        : `🎯 Heute: ${daily.count} / ${daily.goal}`;
      heroDailyPill.classList.toggle("done", daily.completed);

      heroXpText.textContent =
        lvl.starsToNext > 0
          ? `${lvl.currentStars} / ${lvl.nextThreshold} ⭐ (noch ${lvl.starsToNext})`
          : `${lvl.currentStars} ⭐ · Höchstes Level!`;
      heroXpBar.style.width = `${lvl.progressPercent}%`;

      if (weakTotal > 0) {
        heroActionBtn.textContent = `🎯 Fehler-Training starten (${weakTotal})`;
        heroSubtitle.textContent =
          `Es warten noch ${weakTotal} knifflige Aufgabe(n) auf ihre Zweite Chance – oder wähle frei ein Thema!`;
      } else {
        heroActionBtn.textContent = "🎲 Zufalls-Übung starten";
        heroSubtitle.textContent =
          "Lumi hat frische Aufgaben für dich gemischt. Jede richtige Antwort bringt +1 ⭐ und +1 🪙 für Lumi!";
      }
    }

    function renderFilters(allModules) {
      const subjectIds = [];
      allModules.forEach((m) => {
        if (subjectIds.indexOf(m.subjectId) === -1) subjectIds.push(m.subjectId);
      });

      const tabs = [{ id: "all", label: "✨ Alle Fächer" }].concat(
        subjectIds.map((id) => {
          const meta = LernHub.getSubjectMeta(id);
          return { id: id, label: `${meta.icon} ${meta.label}` };
        })
      );

      subjectTabsEl.innerHTML = tabs
        .map(
          (t) =>
            `<button type="button" class="subject-tab ${activeSubject === t.id ? "active" : ""}" data-subj="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`
        )
        .join("");

      subjectTabsEl.querySelectorAll("[data-subj]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeSubject = btn.dataset.subj;
          Feedback.play("tap");
          renderDashboard();
        });
      });

      const grades = [];
      allModules.forEach((m) => {
        if (m.grade && grades.indexOf(m.grade) === -1) grades.push(m.grade);
      });
      grades.sort((a, b) => a - b);

      if (grades.length > 1) {
        gradeFilterEl.classList.remove("hidden");
        gradeFilterEl.innerHTML =
          `<option value="all">Alle Klassen</option>` +
          grades
            .map((g) => `<option value="${g}" ${String(activeGrade) === String(g) ? "selected" : ""}>Klasse ${g}</option>`)
            .join("");
      } else {
        gradeFilterEl.classList.add("hidden");
      }

      const settings = Storage.getSettings();
      const currentView = settings.viewMode || "path";
      viewModePillsEl.querySelectorAll("[data-view]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === currentView);
      });

      const currentSize = settings.roundSize || 10;
      roundSizePillsEl.querySelectorAll("[data-size]").forEach((btn) => {
        const val = parseInt(btn.dataset.size, 10);
        btn.classList.toggle("active", val === currentSize);
      });
    }

    function getFilteredModules(allModules) {
      return allModules.filter((m) => {
        if (activeSubject !== "all" && m.subjectId !== activeSubject) return false;
        if (activeGrade !== "all" && String(m.grade) !== String(activeGrade)) return false;
        return true;
      });
    }

    function bindModuleActionButtons(rootEl) {
      rootEl.querySelectorAll("[data-start-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          Feedback.play("tap");
          startModule(btn.dataset.startId, "smart");
        });
      });

      rootEl.querySelectorAll("[data-mistakes-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          Feedback.play("tap");
          startModule(btn.dataset.mistakesId, "mistakes");
        });
      });

      rootEl.querySelectorAll("[data-cheatsheet-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          Feedback.play("tap");
          const mod = LernHub.getModule(btn.dataset.cheatsheetId);
          if (mod) openCheatSheet(mod);
        });
      });
    }

    function renderLearningPath(filtered, preferredRoundSize) {
      // Gruppieren nach Fach + Klasse + Thema
      const groupMap = {};
      const groups = [];

      filtered.forEach((mod) => {
        const key = `${mod.subjectId}::${mod.grade || ""}::${mod.topic || "Allgemein"}`;
        if (!groupMap[key]) {
          groupMap[key] = {
            key: key,
            subjectId: mod.subjectId,
            subject: mod.subject,
            grade: mod.grade,
            topic: mod.topic || "Übungen",
            modules: []
          };
          groups.push(groupMap[key]);
        }
        groupMap[key].modules.push(mod);
      });

      const av = Storage.getAvatarInfo("happy");
      const ringRadius = 34;
      const circumference = 2 * Math.PI * ringRadius;

      const html = groups
        .map((grp) => {
          grp.modules.sort((a, b) => (a.order || 999) - (b.order || 999));
          const subjMeta = LernHub.getSubjectMeta(grp.subjectId);

          let masteredTotal = 0;
          let tasksTotal = 0;
          let currentIdx = -1;

          const enriched = grp.modules.map((mod, idx) => {
            const mastery = Storage.getModuleMastery(mod);
            const weakList = Storage.getWeakTasksForModule(mod);
            masteredTotal += mastery.mastered;
            tasksTotal += mastery.total;

            if (currentIdx === -1 && (mastery.percent < 80 || weakList.length > 0)) {
              currentIdx = idx;
            }
            return { mod: mod, mastery: mastery, weakList: weakList };
          });

          if (currentIdx === -1 && enriched.length > 0) {
            currentIdx = enriched.length - 1;
          }

          const chapterPercent = tasksTotal > 0 ? Math.round((masteredTotal / tasksTotal) * 100) : 0;

          const stepsHtml = enriched
            .map((entry, idx) => {
              const mod = entry.mod;
              const mastery = entry.mastery;
              const weakList = entry.weakList;
              const total = mod.tasks.length;
              const roundCount = Math.min(total, preferredRoundSize || mod.roundSize || 10);
              const best = Storage.getBestScore(mod.id, roundCount);

              const sideClass = idx % 2 === 0 ? "left" : "right";
              const isCurrent = idx === currentIdx;
              const isMastered = mastery.percent >= 80 && weakList.length === 0;
              const dashOffset = circumference - (mastery.percent / 100) * circumference;

              return `
                <div class="path-step ${sideClass} ${isCurrent ? "is-current" : ""} ${isMastered ? "is-mastered" : ""}">
                  <div class="path-node-col">
                    ${
                      isCurrent
                        ? `<div class="path-lumi-pin ${escapeHtml(av.frameClass)}" title="Hier bist du gerade!">
                            <img src="${escapeHtml(av.imgSrc)}" alt="Lumi" />
                          </div>`
                        : ""
                    }
                    <button type="button" class="path-node-btn" data-start-id="${escapeHtml(mod.id)}" title="${escapeHtml(mod.title)} starten">
                      <svg class="path-ring" viewBox="0 0 78 78" aria-hidden="true">
                        <circle class="path-ring-bg" cx="39" cy="39" r="${ringRadius}"></circle>
                        <circle class="path-ring-fill" cx="39" cy="39" r="${ringRadius}"
                          stroke-dasharray="${circumference.toFixed(2)}"
                          stroke-dashoffset="${dashOffset.toFixed(2)}"></circle>
                      </svg>
                      <span class="path-node-icon">${isMastered ? "✅" : escapeHtml(mod.icon)}</span>
                      <span class="path-node-num">Etappe ${idx + 1}</span>
                    </button>
                  </div>

                  <article class="path-step-card">
                    <div class="module-badges-row">
                      <span class="badge-type">${escapeHtml(mod.icon)} ${escapeHtml(mod.badgeLabel)}</span>
                      <span class="badge" style="background: ${escapeHtml(subjMeta.softBg)}; color: ${escapeHtml(subjMeta.color)}">
                        ${mastery.percent} % gemeistert
                      </span>
                    </div>
                    <h3>${escapeHtml(mod.title)}</h3>
                    <p class="path-step-desc">${escapeHtml(mod.description)}</p>
                    <div class="path-step-meta">
                      <span>🎲 ${roundCount} / Pool: ${total}</span>
                      <span>Rekord: ${best.bestScore}/${best.bestTotal} ⭐</span>
                    </div>
                    <div class="path-step-actions">
                      <button type="button" class="btn btn-primary btn-compact" data-start-id="${escapeHtml(mod.id)}">
                        ▶ Starten
                      </button>
                      ${
                        weakList.length > 0
                          ? `<button type="button" class="btn btn-mistakes btn-compact" data-mistakes-id="${escapeHtml(mod.id)}" title="Nur offene Fehler üben">
                              🔄 Fehler (${weakList.length})
                            </button>`
                          : ""
                      }
                      ${
                        mod.cheatSheet
                          ? `<button type="button" class="btn btn-secondary btn-compact" data-cheatsheet-id="${escapeHtml(mod.id)}" title="Spickzettel öffnen">
                              📖 Spickzettel
                            </button>`
                          : ""
                      }
                    </div>
                  </article>
                </div>
              `;
            })
            .join("");

          return `
            <section class="path-chapter">
              <div class="path-chapter-header">
                <div class="path-chapter-title">
                  <span class="path-chapter-icon" style="background: ${escapeHtml(subjMeta.softBg)}">${escapeHtml(subjMeta.icon)}</span>
                  <div>
                    <h2>${escapeHtml(grp.subject)}${grp.grade ? ` · Klasse ${escapeHtml(grp.grade)}` : ""}</h2>
                    <p>Themenpfad: ${escapeHtml(grp.topic)}</p>
                  </div>
                </div>
                <div class="path-chapter-progress">
                  <div class="path-chapter-progress-lbl">
                    <span>Pfad-Fortschritt</span>
                    <span>${masteredTotal} / ${tasksTotal} (${chapterPercent} %)</span>
                  </div>
                  <div class="mini-progress-track">
                    <div class="mini-progress-fill" style="width: ${chapterPercent}%"></div>
                  </div>
                </div>
              </div>
              <div class="path-track">${stepsHtml}</div>
            </section>
          `;
        })
        .join("");

      moduleContainer.innerHTML = `<div class="learning-path">${html}</div>`;
      bindModuleActionButtons(moduleContainer);
    }

    function renderModuleGrid(filtered, preferredRoundSize) {
      const sorted = filtered.slice().sort((a, b) => (a.order || 999) - (b.order || 999));

      const cardsHtml = sorted
        .map((mod) => {
          const subjMeta = LernHub.getSubjectMeta(mod.subjectId);
          const total = mod.tasks.length;
          const roundCount = Math.min(total, preferredRoundSize || mod.roundSize || 10);
          const best = Storage.getBestScore(mod.id, roundCount);
          const mastery = Storage.getModuleMastery(mod);
          const weakList = Storage.getWeakTasksForModule(mod);

          return `
            <article class="module-card">
              <div class="module-stripe" style="background: ${escapeHtml(subjMeta.color)}"></div>
              <div class="module-card-top">
                <div class="module-badges-row">
                  <span class="badge" style="background: ${escapeHtml(subjMeta.softBg)}; color: ${escapeHtml(subjMeta.color)}">
                    ${escapeHtml(subjMeta.icon)} ${escapeHtml(mod.subject)}${mod.grade ? ` · Kl. ${escapeHtml(mod.grade)}` : ""}
                  </span>
                  <span class="badge-type">${escapeHtml(mod.icon)} ${escapeHtml(mod.badgeLabel)}</span>
                </div>
                <h3>${escapeHtml(mod.title)}</h3>
                <p>${escapeHtml(mod.description)}</p>
              </div>

              <div>
                <div class="mastery-block">
                  <div class="mastery-header">
                    <span>Gemeistert: ${mastery.mastered} / ${mastery.total}</span>
                    <span>${mastery.percent} %</span>
                  </div>
                  <div class="mini-progress-track">
                    <div class="mini-progress-fill" style="width: ${mastery.percent}%"></div>
                  </div>
                </div>

                <div class="card-footer">
                  <span>🎲 ${roundCount} pro Runde · Pool: ${total}</span>
                  <span>Rekord: ${best.bestScore} / ${best.bestTotal} ⭐</span>
                </div>

                <div class="card-actions" style="flex-wrap: wrap;">
                  <button type="button" class="btn btn-primary" data-start-id="${escapeHtml(mod.id)}">
                    ▶ Starten
                  </button>
                  ${
                    weakList.length > 0
                      ? `<button type="button" class="btn btn-mistakes" data-mistakes-id="${escapeHtml(mod.id)}" title="Nur offene Fehler aus diesem Modul üben">
                          🔄 Fehler (${weakList.length})
                        </button>`
                      : ""
                  }
                  ${
                    mod.cheatSheet
                      ? `<button type="button" class="btn btn-secondary btn-compact" style="width: 100%;" data-cheatsheet-id="${escapeHtml(mod.id)}">
                          📖 Spickzettel ansehen
                        </button>`
                      : ""
                  }
                </div>
              </div>
            </article>
          `;
        })
        .join("");

      moduleContainer.innerHTML = `<div class="module-grid">${cardsHtml}</div>`;
      bindModuleActionButtons(moduleContainer);
    }

    function renderDashboard() {
      updateHeaderStats();
      updateHero();

      const allModules = LernHub.getModules();
      renderFilters(allModules);
      const filtered = getFilteredModules(allModules);
      const settings = Storage.getSettings();
      const preferredRoundSize = settings.roundSize || 10;
      const viewMode = settings.viewMode || "path";

      if (filtered.length === 0) {
        moduleContainer.innerHTML = `
          <div class="summary-box" style="background: var(--surface); border-radius: var(--radius); padding: 2rem;">
            <h3>Keine Module gefunden</h3>
            <p>Für diesen Filter gibt es aktuell noch keine Übungen.</p>
          </div>
        `;
        return;
      }

      if (viewMode === "grid") {
        renderModuleGrid(filtered, preferredRoundSize);
      } else {
        renderLearningPath(filtered, preferredRoundSize);
      }
    }

    function updateMascot(mood, message) {
      const av = Storage.getAvatarInfo(mood || "happy");
      applyFrameClass(mascotGameWrap, av.frameClass);

      if (mascotGameImg && mascotGameImg.getAttribute("src") !== av.imgSrc) {
        mascotGameImg.setAttribute("src", av.imgSrc);
        if (mascotGameWrap) {
          mascotGameWrap.classList.remove("mascot-pop");
          void mascotGameWrap.offsetWidth;
          mascotGameWrap.classList.add("mascot-pop");
        }
      }

      if (mascotMoodBadge) {
        if (av.moodBadge) {
          mascotMoodBadge.textContent = av.moodBadge;
          mascotMoodBadge.classList.remove("hidden");
        } else {
          mascotMoodBadge.classList.add("hidden");
        }
      }

      if (mascotGameBubble && message) {
        mascotGameBubble.textContent = message;
      }
    }

    function notifyRewards(newlyUnlockedBadges, dailyGoalJustReached) {
      if (dailyGoalJustReached) {
        Feedback.showToast("🎯", "Tagesziel erreicht!", "Super durchgehalten heute!");
      }
      if (Array.isArray(newlyUnlockedBadges) && newlyUnlockedBadges.length > 0) {
        Feedback.play("badge");
        newlyUnlockedBadges.forEach((b) => {
          Feedback.showToast(b.icon, `Neues Abzeichen: ${b.title}`, b.desc);
        });
      }
    }

    function showDashboard() {
      cleanupActiveEngine();
      activeModule = null;
      viewGame.classList.remove("active");
      viewDashboard.classList.add("active");
      renderDashboard();
    }

    function startModule(moduleId, mode) {
      const mod = LernHub.getModule(moduleId);
      if (!mod) return;

      const engine = LernHub.getEngine(mod.type);
      if (!engine) {
        alert(`Spiel-Engine "${mod.type}" wurde noch nicht geladen.`);
        return;
      }

      cleanupActiveEngine();
      activeModule = mod;

      const subjMeta = LernHub.getSubjectMeta(mod.subjectId);
      const badgeEl = document.getElementById("game-badge");
      badgeEl.textContent = `${subjMeta.icon} ${mod.subject}`;
      badgeEl.style.background = subjMeta.softBg;
      badgeEl.style.color = subjMeta.color;

      document.getElementById("game-title").textContent =
        mode === "mistakes" ? `${mod.title} (Fehler-Training)` : mod.title;

      if (gameCheatBtn) {
        gameCheatBtn.classList.toggle("hidden", !mod.cheatSheet);
      }

      viewDashboard.classList.remove("active");
      viewGame.classList.add("active");

      const stage = document.getElementById("game-stage");
      const progressText = document.getElementById("game-progress-text");
      const progressBar = document.getElementById("game-progress-bar");
      const roundSize = Storage.getSettings().roundSize || mod.roundSize || 10;

      activeEngineHandle = engine.render(stage, mod, {
        mode: mode || "smart",
        roundSize: roundSize,
        onProgress(current, total, isRetryPhase) {
          progressText.textContent = isRetryPhase ? `🔄 ${current} / ${total}` : `${current} / ${total}`;
          progressBar.style.width = `${total > 0 ? Math.round((current / total) * 100) : 0}%`;
        },
        onAnswer(task, isCorrect, isRetry) {
          const taskKey = (task && task._key) || `${mod.id}::unknown`;
          const res = Storage.recordTaskResult(taskKey, isCorrect, isRetry);
          updateHeaderStats();
          notifyRewards(res.newlyUnlockedBadges, res.dailyGoalJustReached);
          return res;
        },
        onMascot(mood, message) {
          updateMascot(mood, message);
        },
        onModuleComplete(id, score, total) {
          const res = Storage.recordModuleComplete(id, score, total);
          updateHeaderStats();
          notifyRewards(res.newlyUnlockedBadges, false);
        },
        onExit: showDashboard
      });
    }

    function openCheatSheet(mod) {
      if (!mod || !mod.cheatSheet) return;
      const sheet = mod.cheatSheet;

      cheatSheetTitleEl.textContent = `📖 ${sheet.title || mod.title}`;
      cheatSheetSubEl.textContent = sheet.subtitle || "";
      cheatSheetSubEl.classList.toggle("hidden", !sheet.subtitle);

      const sectionsHtml = (sheet.sections || [])
        .map((sec) => {
          if (sec.type === "table") {
            const headersHtml = (sec.headers || []).map((h) => `<th>${escapeHtml(h)}</th>`).join("");
            const rowsHtml = (sec.rows || [])
              .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
              .join("");
            return `
              <div class="cheatsheet-section">
                ${sec.heading ? `<h3>${escapeHtml(sec.heading)}</h3>` : ""}
                <div class="cheatsheet-table-wrap">
                  <table class="cheatsheet-table">
                    ${headersHtml ? `<thead><tr>${headersHtml}</tr></thead>` : ""}
                    <tbody>${rowsHtml}</tbody>
                  </table>
                </div>
              </div>
            `;
          }
          if (sec.type === "tips") {
            const itemsHtml = (sec.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
            return `
              <div class="cheatsheet-section">
                ${sec.heading ? `<h3>${escapeHtml(sec.heading)}</h3>` : ""}
                <ul class="cheatsheet-tips">${itemsHtml}</ul>
              </div>
            `;
          }
          return "";
        })
        .join("");

      cheatSheetBodyEl.innerHTML = sectionsHtml;
      modalCheatSheet.classList.remove("hidden");

      const res = Storage.recordCheatSheetOpened();
      updateHeaderStats();
      notifyRewards(res.newlyUnlockedBadges, false);
    }

    function closeCheatSheet() {
      modalCheatSheet.classList.add("hidden");
    }

    function renderWardrobeContents() {
      const st = Storage.getState();
      const coins = Storage.getCoins();
      const av = Storage.getAvatarInfo("happy");
      const currentOutfit = Storage.OUTFITS.find((o) => o.id === av.outfitId) || Storage.OUTFITS[0];
      const currentFrame = Storage.FRAMES.find((f) => f.id === av.frameId) || Storage.FRAMES[0];

      wardrobeCoinsEl.textContent = coins;
      wardrobePreviewImg.setAttribute("src", av.imgSrc);
      applyFrameClass(wardrobePreviewWrap, av.frameClass);
      wardrobeEquippedText.textContent = `Aktuell: ${currentOutfit.name} · ${currentFrame.name}`;

      wardrobeTabsEl.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === activeWardrobeTab);
      });

      if (activeWardrobeTab === "outfits") {
        wardrobeGridEl.innerHTML = Storage.OUTFITS.map((item) => {
          const unlocked = st.unlockedOutfits.indexOf(item.id) !== -1;
          const equipped = st.equippedOutfit === item.id;
          const canAfford = coins >= item.price;

          let btnHtml = "";
          if (equipped) {
            btnHtml = `<button type="button" class="btn btn-secondary" disabled>✅ Ausgewählt</button>`;
          } else if (unlocked) {
            btnHtml = `<button type="button" class="btn btn-primary" data-equip-outfit="${escapeHtml(item.id)}">Anziehen</button>`;
          } else if (canAfford) {
            btnHtml = `<button type="button" class="btn btn-gold" data-buy-outfit="${escapeHtml(item.id)}">🪙 ${item.price} Freischalten</button>`;
          } else {
            btnHtml = `<button type="button" class="btn btn-secondary" disabled>🔒 Noch ${item.price - coins} 🪙</button>`;
          }

          return `
            <div class="wardrobe-item ${equipped ? "equipped" : ""}">
              <div>
                <div class="wardrobe-item-preview">
                  <img src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.name)}" />
                </div>
                <div class="wardrobe-item-title">${escapeHtml(item.name)}</div>
                <div class="wardrobe-item-desc">${escapeHtml(item.desc)}</div>
              </div>
              <div>${btnHtml}</div>
            </div>
          `;
        }).join("");

        wardrobeGridEl.querySelectorAll("[data-equip-outfit], [data-buy-outfit]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.equipOutfit || btn.dataset.buyOutfit;
            const res = Storage.buyOrEquipOutfit(id);
            if (res.ok) {
              if (res.bought) {
                Feedback.play("badge");
                Feedback.confetti();
                Feedback.showToast("🦊", "Neues Lumi-Outfit!", "Sieht super aus!");
              } else {
                Feedback.play("tap");
              }
              updateHeaderStats();
              notifyRewards(res.newlyUnlockedBadges, false);
              renderWardrobeContents();
              if (viewDashboard.classList.contains("active")) renderDashboard();
            }
          });
        });
      } else {
        wardrobeGridEl.innerHTML = Storage.FRAMES.map((item) => {
          const unlocked = st.unlockedFrames.indexOf(item.id) !== -1;
          const equipped = st.equippedFrame === item.id;
          const canAfford = coins >= item.price;

          let btnHtml = "";
          if (equipped) {
            btnHtml = `<button type="button" class="btn btn-secondary" disabled>✅ Ausgewählt</button>`;
          } else if (unlocked) {
            btnHtml = `<button type="button" class="btn btn-primary" data-equip-frame="${escapeHtml(item.id)}">Anlegen</button>`;
          } else if (canAfford) {
            btnHtml = `<button type="button" class="btn btn-gold" data-buy-frame="${escapeHtml(item.id)}">🪙 ${item.price} Freischalten</button>`;
          } else {
            btnHtml = `<button type="button" class="btn btn-secondary" disabled>🔒 Noch ${item.price - coins} 🪙</button>`;
          }

          return `
            <div class="wardrobe-item ${equipped ? "equipped" : ""}">
              <div>
                <div class="wardrobe-frame-preview ${escapeHtml(item.cssClass)}">
                  <img src="${escapeHtml(av.imgSrc)}" alt="${escapeHtml(item.name)}" />
                </div>
                <div class="wardrobe-item-title">${escapeHtml(item.name)}</div>
                <div class="wardrobe-item-desc">${escapeHtml(item.desc)}</div>
              </div>
              <div>${btnHtml}</div>
            </div>
          `;
        }).join("");

        wardrobeGridEl.querySelectorAll("[data-equip-frame], [data-buy-frame]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.equipFrame || btn.dataset.buyFrame;
            const res = Storage.buyOrEquipFrame(id);
            if (res.ok) {
              if (res.bought) {
                Feedback.play("badge");
                Feedback.confetti();
                Feedback.showToast("✨", "Neuer Rahmen freigeschaltet!", "Richtig schick!");
              } else {
                Feedback.play("tap");
              }
              updateHeaderStats();
              notifyRewards(res.newlyUnlockedBadges, false);
              renderWardrobeContents();
              if (viewDashboard.classList.contains("active")) renderDashboard();
            }
          });
        });
      }
    }

    function openWardrobeModal() {
      renderWardrobeContents();
      modalWardrobe.classList.remove("hidden");
    }

    function closeWardrobeModal() {
      modalWardrobe.classList.add("hidden");
    }

    function openBadgesModal() {
      const st = Storage.getState();
      const daily = Storage.getDailyProgress();
      const unlockedIds = Storage.getUnlockedBadges();
      const settings = Storage.getSettings();

      modalStatsRow.innerHTML = `
        <div class="modal-stat-box">
          <div class="modal-stat-val">🔥 ${st.bestStreak || 0}</div>
          <div class="modal-stat-lbl">Beste Serie</div>
        </div>
        <div class="modal-stat-box">
          <div class="modal-stat-val">🎮 ${st.roundsCompleted || 0}</div>
          <div class="modal-stat-lbl">Gespielte Runden</div>
        </div>
        <div class="modal-stat-box">
          <div class="modal-stat-val">📅 ${daily.streakDays || 0}</div>
          <div class="modal-stat-lbl">Tage-Ziel-Serie</div>
        </div>
      `;

      badgesGrid.innerHTML = Storage.BADGES.map((b) => {
        const isUnlocked = unlockedIds.indexOf(b.id) !== -1;
        return `
          <div class="badge-tile ${isUnlocked ? "unlocked" : "locked"}">
            <div class="badge-tile-icon">${isUnlocked ? b.icon : "🔒"}</div>
            <div class="badge-tile-title">${escapeHtml(b.title)}</div>
            <div class="badge-tile-desc">${escapeHtml(b.desc)}</div>
          </div>
        `;
      }).join("");

      chkDarkMode.checked = settings.theme === "dark";
      chkSound.checked = settings.sound !== false;
      chkAutoSpeak.checked = Boolean(settings.autoSpeak);

      modalBadges.classList.remove("hidden");
    }

    function closeBadgesModal() {
      modalBadges.classList.add("hidden");
    }

    function toggleTheme() {
      const cur = Storage.getSettings().theme || "light";
      const next = cur === "dark" ? "light" : "dark";
      Storage.updateSettings({ theme: next });
      applyTheme(next);
      Feedback.play("tap");
    }

    // Event-Bindings
    document.getElementById("btn-home").addEventListener("click", () => {
      Feedback.play("tap");
      showDashboard();
    });

    document.getElementById("btn-back").addEventListener("click", () => {
      Feedback.play("tap");
      showDashboard();
    });

    themeBtn.addEventListener("click", toggleTheme);

    soundBtn.addEventListener("click", () => {
      const cur = Storage.getSettings().sound !== false;
      Storage.updateSettings({ sound: !cur });
      updateHeaderStats();
      if (!cur) Feedback.play("tap");
    });

    document.getElementById("btn-open-wardrobe").addEventListener("click", () => {
      Feedback.play("tap");
      openWardrobeModal();
    });

    document.getElementById("btn-hero-wardrobe").addEventListener("click", () => {
      Feedback.play("tap");
      openWardrobeModal();
    });

    document.getElementById("btn-close-wardrobe").addEventListener("click", closeWardrobeModal);
    document.getElementById("btn-wardrobe-done").addEventListener("click", closeWardrobeModal);
    modalWardrobe.addEventListener("click", (e) => {
      if (e.target === modalWardrobe) closeWardrobeModal();
    });

    wardrobeTabsEl.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeWardrobeTab = btn.dataset.tab;
        Feedback.play("tap");
        renderWardrobeContents();
      });
    });

    if (gameCheatBtn) {
      gameCheatBtn.addEventListener("click", () => {
        if (activeModule) {
          Feedback.play("tap");
          openCheatSheet(activeModule);
        }
      });
    }

    document.getElementById("btn-close-cheatsheet").addEventListener("click", closeCheatSheet);
    document.getElementById("btn-cheatsheet-done").addEventListener("click", closeCheatSheet);
    modalCheatSheet.addEventListener("click", (e) => {
      if (e.target === modalCheatSheet) closeCheatSheet();
    });

    document.getElementById("btn-open-badges").addEventListener("click", () => {
      Feedback.play("tap");
      openBadgesModal();
    });

    document.getElementById("btn-close-modal").addEventListener("click", closeBadgesModal);
    document.getElementById("btn-modal-done").addEventListener("click", closeBadgesModal);
    modalBadges.addEventListener("click", (e) => {
      if (e.target === modalBadges) closeBadgesModal();
    });

    chkDarkMode.addEventListener("change", () => {
      const next = chkDarkMode.checked ? "dark" : "light";
      Storage.updateSettings({ theme: next });
      applyTheme(next);
      Feedback.play("tap");
    });

    chkSound.addEventListener("change", () => {
      Storage.updateSettings({ sound: chkSound.checked });
      updateHeaderStats();
      if (chkSound.checked) Feedback.play("tap");
    });

    chkAutoSpeak.addEventListener("change", () => {
      Storage.updateSettings({ autoSpeak: chkAutoSpeak.checked });
      Feedback.play("tap");
    });

    document.getElementById("btn-reset-progress").addEventListener("click", () => {
      const confirmed = global.confirm(
        "Möchtest du wirklich alle Sterne, Münzen, Outfits, Abzeichen und deinen Lernfortschritt komplett zurücksetzen?"
      );
      if (confirmed) {
        Storage.resetAll();
        closeBadgesModal();
        showDashboard();
        Feedback.showToast("🗑️", "Fortschritt zurückgesetzt", "Viel Spaß beim neuen Start!");
      }
    });

    gradeFilterEl.addEventListener("change", () => {
      activeGrade = gradeFilterEl.value;
      Feedback.play("tap");
      renderDashboard();
    });

    viewModePillsEl.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.view === "grid" ? "grid" : "path";
        Storage.updateSettings({ viewMode: mode });
        Feedback.play("tap");
        renderDashboard();
      });
    });

    roundSizePillsEl.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = parseInt(btn.dataset.size, 10);
        Storage.updateSettings({ roundSize: size });
        Feedback.play("tap");
        renderDashboard();
      });
    });

    heroActionBtn.addEventListener("click", () => {
      Feedback.play("tap");
      const allModules = LernHub.getModules();
      let bestWeakMod = null;
      let maxWeak = 0;
      for (let i = 0; i < allModules.length; i++) {
        const w = Storage.getWeakTasksForModule(allModules[i]).length;
        if (w > maxWeak) {
          maxWeak = w;
          bestWeakMod = allModules[i];
        }
      }
      if (bestWeakMod && maxWeak > 0) {
        startModule(bestWeakMod.id, "mistakes");
        return;
      }
      const filtered = getFilteredModules(allModules);
      const pool = filtered.length > 0 ? filtered : allModules;
      if (pool.length === 0) return;
      const randomMod = pool[Math.floor(Math.random() * pool.length)];
      startModule(randomMod.id, "smart");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!modalCheatSheet.classList.contains("hidden")) closeCheatSheet();
        else if (!modalWardrobe.classList.contains("hidden")) closeWardrobeModal();
        else if (!modalBadges.classList.contains("hidden")) closeBadgesModal();
      }
    });

    if (LernHub.Loader && typeof LernHub.Loader.loadAll === "function") {
      LernHub.Loader.loadAll().then(renderDashboard);
    } else {
      if (typeof LernHub.syncLegacyModules === "function") {
        LernHub.syncLegacyModules();
      }
      renderDashboard();
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initApp);
    } else {
      initApp();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
