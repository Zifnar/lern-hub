(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function getStat(taskKey) {
    if (LernHub.Storage && typeof LernHub.Storage.getTaskStat === "function") {
      return LernHub.Storage.getTaskStat(taskKey);
    }
    return { attempts: 0, correct: 0, wrong: 0, streak: 0, lastSeen: 0 };
  }

  function pickRound(mod, options) {
    const opts = options || {};
    const tasks = Array.isArray(mod && mod.tasks) ? mod.tasks.slice() : [];
    if (tasks.length === 0) return [];

    const mode = opts.mode || "smart";
    const defaultSize = (mod && mod.roundSize) || 10;
    const requestedSize = typeof opts.roundSize === "number" && opts.roundSize > 0 ? opts.roundSize : defaultSize;
    const targetSize = Math.min(tasks.length, requestedSize);

    if (mode === "mistakes") {
      const weakOnly = tasks.filter((t) => {
        const st = getStat(t._key);
        return st.wrong > 0 && st.streak < 2;
      });
      return shuffle(weakOnly);
    }

    if (mode === "all") {
      return mod && mod.shuffle === false ? tasks : shuffle(tasks);
    }

    if (mod && mod.shuffle === false) {
      return tasks.slice(0, targetSize);
    }

    // Smart-Spaced-Selection
    const weak = [];
    const unseen = [];
    const learning = [];
    const mastered = [];

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const st = getStat(t._key);
      if (!st || st.attempts === 0) {
        unseen.push(t);
      } else if (st.streak >= 2) {
        mastered.push({ task: t, lastSeen: st.lastSeen || 0 });
      } else if (st.wrong > 0) {
        weak.push(t);
      } else {
        learning.push(t);
      }
    }

    const weakShuffled = shuffle(weak);
    const unseenShuffled = shuffle(unseen);
    const learningShuffled = shuffle(learning);

    // Mastered nach ältestem lastSeen sortieren, aber mit leichtem Zufalls-Mix in Blöcken
    mastered.sort((a, b) => a.lastSeen - b.lastSeen);
    const masteredTasks = mastered.map((m) => m.task);

    const picked = [];
    const usedKeys = new Set();

    function addFrom(list, maxCount) {
      let added = 0;
      for (let i = 0; i < list.length && picked.length < targetSize && added < maxCount; i++) {
        const item = list[i];
        if (!usedKeys.has(item._key)) {
          picked.push(item);
          usedKeys.add(item._key);
          added++;
        }
      }
    }

    // Bis zu 50 % Schwachstellen, damit es fordernd aber motivierend bleibt
    const maxWeak = Math.max(1, Math.floor(targetSize * 0.5));
    addFrom(weakShuffled, maxWeak);
    addFrom(unseenShuffled, targetSize);
    addFrom(learningShuffled, targetSize);
    addFrom(masteredTasks, targetSize);

    // Falls noch Platz frei ist (z. B. wenn fast alles Schwachstellen waren), restliche Schwachstellen auffüllen
    if (picked.length < targetSize) {
      addFrom(weakShuffled, targetSize);
    }

    return shuffle(picked);
  }

  LernHub.Scheduler = {
    shuffle: shuffle,
    pickRound: pickRound
  };
})(typeof window !== "undefined" ? window : globalThis);
