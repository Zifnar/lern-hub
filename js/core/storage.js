(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  const STORAGE_KEY = "lernhub_progress_v2";
  const LEGACY_STORAGE_KEY = "lernhub_progress_v1";

  const LEVELS = [
    { threshold: 0, level: 1, title: "Sternen-Starter" },
    { threshold: 15, level: 2, title: "Wort-Entdecker" },
    { threshold: 40, level: 3, title: "Satz-Baumeister" },
    { threshold: 80, level: 4, title: "Grammatik-Profi" },
    { threshold: 140, level: 5, title: "Sprach-Champion" },
    { threshold: 220, level: 6, title: "Super-Stern" }
  ];

  const BADGES = [
    { id: "first-round", icon: "🚀", title: "Erster Schritt", desc: "Erste Runde erfolgreich beendet" },
    { id: "streak-5", icon: "🔥", title: "Heißer Lauf", desc: "5 Aufgaben am Stück richtig gelöst" },
    { id: "streak-10", icon: "⚡", title: "Unaufhaltsam", desc: "10 Aufgaben am Stück richtig gelöst" },
    { id: "perfect-round", icon: "💯", title: "Fehlerfrei!", desc: "100 % in einer ganzen Runde erreicht" },
    { id: "stars-25", icon: "⭐", title: "Sternen-Sammler", desc: "25 Sterne gesammelt" },
    { id: "stars-100", icon: "🌟", title: "Sternen-Meister", desc: "100 Sterne gesammelt" },
    { id: "mistake-crusher", icon: "🎯", title: "Fehler-Bezwinger", desc: "Eine „Zweite Chance“-Aufgabe geknackt" },
    { id: "daily-goal", icon: "🏆", title: "Tages-Champion", desc: "Das Tagesziel erreicht" },
    { id: "fashion-fan", icon: "🎨", title: "Lumi-Stylist", desc: "Erstes Outfit oder neuen Rahmen freigeschaltet" },
    { id: "cheatsheet-reader", icon: "📖", title: "Schlauer Fuchs", desc: "Einen Grammatik-Spickzettel genutzt" }
  ];

  const OUTFITS = [
    { id: "classic", name: "Klassik-Lumi", desc: "Reagiert mit 3 Stimmungen!", price: 0, preview: "assets/img/mascot-happy.png" },
    { id: "wizard", name: "Zauberer-Lumi", desc: "Mit magischem Sternenhut", price: 15, preview: "assets/img/lumi-wizard.png" },
    { id: "cool", name: "Superstar-Lumi", desc: "Mit Brille & Kopfhörern", price: 30, preview: "assets/img/lumi-cool.png" },
    { id: "astro", name: "Weltraum-Lumi", desc: "Bereit für die Galaxie!", price: 50, preview: "assets/img/lumi-astro.png" },
    { id: "royal", name: "Königs-Lumi", desc: "Mit goldener Meisterkrone", price: 80, preview: "assets/img/lumi-royal.png" }
  ];

  const FRAMES = [
    { id: "classic", name: "Standard-Ring", desc: "Schlicht & klar", price: 0, cssClass: "frame-classic" },
    { id: "gold", name: "Sternengold", desc: "Warmer goldener Glanz", price: 10, cssClass: "frame-gold" },
    { id: "rainbow", name: "Regenbogen", desc: "Bunter Zauberring", price: 25, cssClass: "frame-rainbow" },
    { id: "galaxy", name: "Nachthimmel", desc: "Leuchtende Indigo-Aura", price: 40, cssClass: "frame-galaxy" },
    { id: "emerald", name: "Smaragd-Funkeln", desc: "Frischer Mint-Schimmer", price: 60, cssClass: "frame-emerald" }
  ];

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function todayStr() {
    return formatDate(new Date());
  }

  function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDate(d);
  }

  function createDefaultState() {
    return {
      version: 2,
      stars: 0,
      coins: 0,
      streak: 0,
      bestStreak: 0,
      roundsCompleted: 0,
      daily: {
        date: todayStr(),
        count: 0,
        goal: 15,
        streakDays: 0,
        lastGoalMetDate: ""
      },
      bestScores: {},
      taskStats: {},
      badges: [],
      unlockedOutfits: ["classic"],
      equippedOutfit: "classic",
      unlockedFrames: ["classic"],
      equippedFrame: "classic",
      settings: {
        sound: true,
        autoSpeak: false,
        roundSize: 10,
        theme: "light",
        viewMode: "path"
      }
    };
  }

  function getLocalStorage() {
    try {
      return global.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function migrateFromV1(v1) {
    const base = createDefaultState();
    if (!v1 || typeof v1 !== "object") return base;

    base.stars = typeof v1.stars === "number" ? v1.stars : 0;
    base.coins = base.stars;
    base.streak = typeof v1.streak === "number" ? v1.streak : 0;
    base.bestStreak = base.streak;

    if (v1.bestScores && typeof v1.bestScores === "object") {
      Object.keys(v1.bestScores).forEach((modId) => {
        const val = v1.bestScores[modId];
        if (typeof val === "number") {
          base.bestScores[modId] = { bestScore: val, bestTotal: 10, plays: 1 };
        } else if (val && typeof val === "object") {
          base.bestScores[modId] = val;
        }
      });
    }
    return base;
  }

  function normalizeDaily(st) {
    const today = todayStr();
    const yesterday = yesterdayStr();
    if (!st.daily) {
      st.daily = createDefaultState().daily;
      return;
    }
    if (st.daily.date !== today) {
      if (st.daily.lastGoalMetDate !== yesterday && st.daily.lastGoalMetDate !== today) {
        st.daily.streakDays = 0;
      }
      st.daily.date = today;
      st.daily.count = 0;
    }
    if (typeof st.daily.goal !== "number" || st.daily.goal < 1) {
      st.daily.goal = 15;
    }
  }

  function loadState() {
    const ls = getLocalStorage();
    if (!ls) return createDefaultState();

    try {
      const rawV2 = ls.getItem(STORAGE_KEY);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        const merged = Object.assign(createDefaultState(), parsed);
        merged.daily = Object.assign(createDefaultState().daily, parsed.daily || {});
        merged.settings = Object.assign(createDefaultState().settings, parsed.settings || {});
        merged.bestScores = parsed.bestScores || {};
        merged.taskStats = parsed.taskStats || {};
        merged.badges = Array.isArray(parsed.badges) ? parsed.badges : [];

        // Nahtlose Migration für bestehende v2-Stände ohne Münzen/Garderobe
        if (typeof parsed.coins !== "number") {
          merged.coins = merged.stars || 0;
        }
        merged.unlockedOutfits = Array.isArray(parsed.unlockedOutfits) ? parsed.unlockedOutfits : ["classic"];
        if (merged.unlockedOutfits.indexOf("classic") === -1) merged.unlockedOutfits.unshift("classic");
        merged.equippedOutfit =
          merged.unlockedOutfits.indexOf(parsed.equippedOutfit) !== -1 ? parsed.equippedOutfit : "classic";

        merged.unlockedFrames = Array.isArray(parsed.unlockedFrames) ? parsed.unlockedFrames : ["classic"];
        if (merged.unlockedFrames.indexOf("classic") === -1) merged.unlockedFrames.unshift("classic");
        merged.equippedFrame =
          merged.unlockedFrames.indexOf(parsed.equippedFrame) !== -1 ? parsed.equippedFrame : "classic";

        normalizeDaily(merged);
        return merged;
      }

      const rawV1 = ls.getItem(LEGACY_STORAGE_KEY);
      if (rawV1) {
        const migrated = migrateFromV1(JSON.parse(rawV1));
        saveRawState(migrated);
        return migrated;
      }
    } catch (e) {
      console.warn("[LernHub] Konnte Speicherstand nicht laden:", e);
    }
    return createDefaultState();
  }

  function saveRawState(st) {
    const ls = getLocalStorage();
    if (!ls) return;
    try {
      ls.setItem(STORAGE_KEY, JSON.stringify(st));
    } catch (e) {
      console.warn("[LernHub] Konnte Speicherstand nicht sichern:", e);
    }
  }

  let state = loadState();

  function saveState() {
    normalizeDaily(state);
    saveRawState(state);
  }

  function unlockBadge(badgeId, list) {
    if (state.badges.indexOf(badgeId) === -1) {
      state.badges.push(badgeId);
      const meta = BADGES.find((b) => b.id === badgeId);
      if (meta) list.push(meta);
    }
  }

  function checkBadges(context) {
    const newlyUnlocked = [];
    if (state.roundsCompleted >= 1) unlockBadge("first-round", newlyUnlocked);
    if (state.streak >= 5) unlockBadge("streak-5", newlyUnlocked);
    if (state.streak >= 10) unlockBadge("streak-10", newlyUnlocked);
    if (state.stars >= 25) unlockBadge("stars-25", newlyUnlocked);
    if (state.stars >= 100) unlockBadge("stars-100", newlyUnlocked);

    if (context) {
      if (context.perfectRound) unlockBadge("perfect-round", newlyUnlocked);
      if (context.retrySolved) unlockBadge("mistake-crusher", newlyUnlocked);
      if (context.dailyGoalJustReached) unlockBadge("daily-goal", newlyUnlocked);
      if (context.fashionFan) unlockBadge("fashion-fan", newlyUnlocked);
      if (context.cheatSheetOpened) unlockBadge("cheatsheet-reader", newlyUnlocked);
    }
    return newlyUnlocked;
  }

  LernHub.Storage = {
    LEVELS: LEVELS,
    BADGES: BADGES,
    OUTFITS: OUTFITS,
    FRAMES: FRAMES,

    reload() {
      state = loadState();
      return state;
    },

    getState() {
      normalizeDaily(state);
      return state;
    },

    getCoins() {
      return state.coins || 0;
    },

    getSettings() {
      return Object.assign({}, state.settings);
    },

    updateSettings(partial) {
      state.settings = Object.assign({}, state.settings, partial || {});
      saveState();
      return this.getSettings();
    },

    getLevelInfo() {
      const stars = state.stars || 0;
      let current = LEVELS[0];
      let next = null;
      for (let i = 0; i < LEVELS.length; i++) {
        if (stars >= LEVELS[i].threshold) {
          current = LEVELS[i];
          next = LEVELS[i + 1] || null;
        }
      }
      if (!next) {
        return {
          level: current.level,
          title: current.title,
          currentStars: stars,
          nextThreshold: current.threshold,
          progressPercent: 100,
          starsToNext: 0
        };
      }
      const span = next.threshold - current.threshold;
      const done = stars - current.threshold;
      return {
        level: current.level,
        title: current.title,
        currentStars: stars,
        nextThreshold: next.threshold,
        progressPercent: Math.min(100, Math.max(0, Math.round((done / span) * 100))),
        starsToNext: Math.max(0, next.threshold - stars)
      };
    },

    getDailyProgress() {
      normalizeDaily(state);
      const count = state.daily.count || 0;
      const goal = state.daily.goal || 15;
      return {
        date: state.daily.date,
        count: count,
        goal: goal,
        percent: Math.min(100, Math.round((count / goal) * 100)),
        completed: count >= goal,
        streakDays: state.daily.streakDays || 0
      };
    },

    getTaskStat(taskKey) {
      return state.taskStats[taskKey] || { attempts: 0, correct: 0, wrong: 0, streak: 0, lastSeen: 0 };
    },

    recordTaskResult(taskKey, isCorrect, isRetry) {
      normalizeDaily(state);
      const prev = state.taskStats[taskKey] || { attempts: 0, correct: 0, wrong: 0, streak: 0, lastSeen: 0 };
      prev.attempts += 1;
      prev.lastSeen = Date.now();

      let dailyGoalJustReached = false;

      if (isCorrect) {
        prev.correct += 1;
        prev.streak += 1;
        state.stars += 1;
        state.coins = (state.coins || 0) + 1;
        state.streak += 1;
        if (state.streak > state.bestStreak) {
          state.bestStreak = state.streak;
        }
        state.daily.count += 1;

        const today = todayStr();
        if (state.daily.count >= state.daily.goal && state.daily.lastGoalMetDate !== today) {
          const yesterday = yesterdayStr();
          if (state.daily.lastGoalMetDate === yesterday) {
            state.daily.streakDays = (state.daily.streakDays || 0) + 1;
          } else {
            state.daily.streakDays = 1;
          }
          state.daily.lastGoalMetDate = today;
          dailyGoalJustReached = true;
        }
      } else {
        prev.wrong += 1;
        prev.streak = 0;
        state.streak = 0;
      }

      if (taskKey) {
        state.taskStats[taskKey] = prev;
      }

      const newlyUnlockedBadges = checkBadges({
        retrySolved: Boolean(isCorrect && isRetry),
        dailyGoalJustReached: dailyGoalJustReached
      });

      saveState();

      return {
        stars: state.stars,
        coins: state.coins,
        streak: state.streak,
        newlyUnlockedBadges: newlyUnlockedBadges,
        dailyGoalJustReached: dailyGoalJustReached
      };
    },

    recordModuleComplete(moduleId, score, total) {
      state.roundsCompleted += 1;
      const existing = state.bestScores[moduleId] || { bestScore: 0, bestTotal: total || 10, plays: 0 };
      existing.plays = (existing.plays || 0) + 1;

      const safeTotal = total > 0 ? total : existing.bestTotal || 10;
      const prevRatio = existing.bestTotal > 0 ? existing.bestScore / existing.bestTotal : 0;
      const newRatio = score / safeTotal;

      if (newRatio > prevRatio || (newRatio === prevRatio && score > existing.bestScore)) {
        existing.bestScore = score;
        existing.bestTotal = safeTotal;
      }
      state.bestScores[moduleId] = existing;

      const newlyUnlockedBadges = checkBadges({
        perfectRound: safeTotal > 0 && score === safeTotal
      });

      saveState();
      return { newlyUnlockedBadges: newlyUnlockedBadges };
    },

    buyOrEquipOutfit(outfitId) {
      const item = OUTFITS.find((o) => o.id === outfitId);
      if (!item) return { ok: false, bought: false, newlyUnlockedBadges: [] };

      if (state.unlockedOutfits.indexOf(outfitId) !== -1) {
        state.equippedOutfit = outfitId;
        saveState();
        return { ok: true, bought: false, newlyUnlockedBadges: [] };
      }

      if ((state.coins || 0) < item.price) {
        return { ok: false, bought: false, newlyUnlockedBadges: [] };
      }

      state.coins -= item.price;
      state.unlockedOutfits.push(outfitId);
      state.equippedOutfit = outfitId;

      const newlyUnlockedBadges = checkBadges({ fashionFan: true });
      saveState();
      return { ok: true, bought: true, newlyUnlockedBadges: newlyUnlockedBadges };
    },

    buyOrEquipFrame(frameId) {
      const item = FRAMES.find((f) => f.id === frameId);
      if (!item) return { ok: false, bought: false, newlyUnlockedBadges: [] };

      if (state.unlockedFrames.indexOf(frameId) !== -1) {
        state.equippedFrame = frameId;
        saveState();
        return { ok: true, bought: false, newlyUnlockedBadges: [] };
      }

      if ((state.coins || 0) < item.price) {
        return { ok: false, bought: false, newlyUnlockedBadges: [] };
      }

      state.coins -= item.price;
      state.unlockedFrames.push(frameId);
      state.equippedFrame = frameId;

      const newlyUnlockedBadges = checkBadges({ fashionFan: true });
      saveState();
      return { ok: true, bought: true, newlyUnlockedBadges: newlyUnlockedBadges };
    },

    recordCheatSheetOpened() {
      const newlyUnlockedBadges = checkBadges({ cheatSheetOpened: true });
      saveState();
      return { newlyUnlockedBadges: newlyUnlockedBadges };
    },

    getAvatarInfo(mood) {
      const outfitId = state.equippedOutfit || "classic";
      const outfit = OUTFITS.find((o) => o.id === outfitId) || OUTFITS[0];
      const frameId = state.equippedFrame || "classic";
      const frame = FRAMES.find((f) => f.id === frameId) || FRAMES[0];

      let imgSrc = outfit.preview;
      let moodBadge = "";

      if (outfit.id === "classic") {
        if (mood === "cheer") imgSrc = "assets/img/mascot-cheer.png";
        else if (mood === "think") imgSrc = "assets/img/mascot-think.png";
        else imgSrc = "assets/img/mascot-happy.png";
      } else {
        if (mood === "cheer") moodBadge = "✨";
        else if (mood === "think") moodBadge = "💡";
      }

      return {
        imgSrc: imgSrc,
        frameClass: frame.cssClass,
        outfitId: outfit.id,
        outfitName: outfit.name,
        frameId: frame.id,
        moodBadge: moodBadge
      };
    },

    getBestScore(moduleId, fallbackTotal) {
      const rec = state.bestScores[moduleId];
      if (!rec) return { bestScore: 0, bestTotal: fallbackTotal || 10, plays: 0 };
      return rec;
    },

    getModuleMastery(mod) {
      const tasks = (mod && mod.tasks) || [];
      const total = tasks.length;
      let mastered = 0;
      let weak = 0;
      let unseen = 0;
      let learning = 0;

      for (let i = 0; i < total; i++) {
        const t = tasks[i];
        const stat = state.taskStats[t._key];
        if (!stat || stat.attempts === 0) {
          unseen += 1;
        } else if (stat.streak >= 2) {
          mastered += 1;
        } else if (stat.wrong > 0) {
          weak += 1;
        } else {
          learning += 1;
        }
      }

      return {
        mastered: mastered,
        weak: weak,
        unseen: unseen,
        learning: learning,
        total: total,
        percent: total > 0 ? Math.round((mastered / total) * 100) : 0
      };
    },

    getWeakTasksForModule(mod) {
      const tasks = (mod && mod.tasks) || [];
      return tasks.filter((t) => {
        const stat = state.taskStats[t._key];
        return stat && stat.wrong > 0 && stat.streak < 2;
      });
    },

    getAllWeakCount() {
      const mods = (LernHub.getModules && LernHub.getModules()) || [];
      let totalWeak = 0;
      for (let i = 0; i < mods.length; i++) {
        totalWeak += this.getWeakTasksForModule(mods[i]).length;
      }
      return totalWeak;
    },

    getUnlockedBadges() {
      return state.badges.slice();
    },

    resetAll() {
      state = createDefaultState();
      saveRawState(state);
      const ls = getLocalStorage();
      if (ls) {
        try {
          ls.removeItem(LEGACY_STORAGE_KEY);
        } catch (e) {}
      }
      return state;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
