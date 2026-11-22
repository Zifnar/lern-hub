(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});
  global.LERNHUB_MODULES = global.LERNHUB_MODULES || [];
  global.LERNHUB_ENGINES = global.LERNHUB_ENGINES || {};

  const modulesList = (LernHub.modules = LernHub.modules || []);
  const moduleMap = (LernHub._moduleMap = LernHub._moduleMap || {});
  const enginesMap = (LernHub.engines = LernHub.engines || {});

  const DEFAULT_SUBJECT_META = {
    englisch: { id: "englisch", label: "Englisch", icon: "🇬🇧", color: "#4f46e5", softBg: "#eef2ff" },
    mathe: { id: "mathe", label: "Mathematik", icon: "📐", color: "#0284c7", softBg: "#e0f2fe" },
    deutsch: { id: "deutsch", label: "Deutsch", icon: "📖", color: "#d97706", softBg: "#fef3c7" },
    nawi: { id: "nawi", label: "NaWi", icon: "🔬", color: "#059669", softBg: "#d1fae5" },
    latein: { id: "latein", label: "Latein", icon: "🏛️", color: "#7c3aed", softBg: "#ede9fe" }
  };

  function stableHash(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function inferSubjectId(subjectText) {
    if (!subjectText) return "englisch";
    const s = String(subjectText).toLowerCase();
    if (s.includes("mathe")) return "mathe";
    if (s.includes("deutsch")) return "deutsch";
    if (s.includes("nawi") || s.includes("bio") || s.includes("physik")) return "nawi";
    if (s.includes("latein")) return "latein";
    if (s.includes("englisch") || s.includes("english")) return "englisch";
    return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "englisch";
  }

  function normalizeModule(raw) {
    const mod = Object.assign({}, raw);
    const subjectId = mod.subjectId || inferSubjectId(mod.subject);
    const subjMeta = LernHub.getSubjectMeta(subjectId);

    mod.subjectId = subjectId;
    mod.subject = mod.subject || subjMeta.label;
    mod.grade = mod.grade !== undefined ? mod.grade : 5;
    mod.topic = mod.topic || "";
    mod.lang = mod.lang || (subjectId === "englisch" ? "en" : "de");
    mod.roundSize = typeof mod.roundSize === "number" && mod.roundSize > 0 ? mod.roundSize : 10;
    mod.shuffle = mod.shuffle !== false;
    mod.icon = mod.icon || subjMeta.icon || "📚";
    mod.badgeLabel = mod.badgeLabel || (mod.type === "quiz" ? "Quiz" : mod.type === "type-in" ? "Schreibtrainer" : "Satzbau");
    mod.order = typeof mod.order === "number" ? mod.order : (moduleMap[mod.id] ? moduleMap[mod.id].order : modulesList.length + 1);
    mod.cheatSheet = mod.cheatSheet && typeof mod.cheatSheet === "object" ? mod.cheatSheet : null;

    const tasks = Array.isArray(mod.tasks) ? mod.tasks : [];
    const seenIds = new Set();

    mod.tasks = tasks.map((rawTask, idx) => {
      const task = Object.assign({}, rawTask);
      let tid = task.id ? String(task.id) : "";
      if (!tid) {
        const sig = [
          task.prompt || task.question || "",
          task.prefix || "",
          task.suffix || "",
          task.answer || "",
          Array.isArray(task.words) ? task.words.join(" ") : ""
        ].join("|");
        tid = "t_" + stableHash(sig);
      }
      if (seenIds.has(tid)) {
        tid = tid + "_" + idx;
      }
      seenIds.add(tid);
      task.id = tid;
      task._key = mod.id + "::" + tid;
      return task;
    });

    mod._normalized = true;
    return mod;
  }

  LernHub.registerEngine = function (type, engineObj) {
    if (!type || !engineObj || typeof engineObj.render !== "function") {
      console.warn("[LernHub] Ungültige Spiel-Engine:", type);
      return;
    }
    enginesMap[type] = engineObj;
    global.LERNHUB_ENGINES[type] = engineObj;
  };

  LernHub.registerModule = function (moduleDef) {
    if (!moduleDef || !moduleDef.id || !moduleDef.type || !Array.isArray(moduleDef.tasks)) {
      console.warn("[LernHub] Modul konnte nicht registriert werden (Pflichtfelder id/type/tasks fehlen):", moduleDef);
      return null;
    }

    const normalized = normalizeModule(moduleDef);

    if (moduleMap[normalized.id]) {
      const idx = modulesList.findIndex((m) => m.id === normalized.id);
      if (idx !== -1) modulesList[idx] = normalized;
    } else {
      modulesList.push(normalized);
    }
    moduleMap[normalized.id] = normalized;

    // Spiegelung für Legacy-Zugriffe aktuell halten
    const legacyIdx = global.LERNHUB_MODULES.findIndex((m) => m && m.id === normalized.id);
    if (legacyIdx !== -1) {
      global.LERNHUB_MODULES[legacyIdx] = normalized;
    } else {
      global.LERNHUB_MODULES.push(normalized);
    }

    return normalized;
  };

  LernHub.syncLegacyModules = function () {
    const legacyArr = Array.isArray(global.LERNHUB_MODULES) ? global.LERNHUB_MODULES : [];
    for (let i = 0; i < legacyArr.length; i++) {
      const item = legacyArr[i];
      if (item && !item._normalized) {
        LernHub.registerModule(item);
      }
    }
    // Auch bereits registrierte Engines spiegeln
    const legacyEngines = global.LERNHUB_ENGINES || {};
    Object.keys(legacyEngines).forEach((type) => {
      if (!enginesMap[type]) {
        enginesMap[type] = legacyEngines[type];
      }
    });
  };

  LernHub.getModules = function () {
    return modulesList.slice();
  };

  LernHub.getModule = function (id) {
    return moduleMap[id] || null;
  };

  LernHub.getEngine = function (type) {
    return enginesMap[type] || (global.LERNHUB_ENGINES && global.LERNHUB_ENGINES[type]) || null;
  };

  LernHub.getSubjectMeta = function (subjectId) {
    const configSubjects = (global.LERNHUB_CONFIG && global.LERNHUB_CONFIG.subjects) || {};
    return (
      configSubjects[subjectId] ||
      DEFAULT_SUBJECT_META[subjectId] || {
        id: subjectId || "allgemein",
        label: subjectId || "Allgemein",
        icon: "📚",
        color: "#4f46e5",
        softBg: "#eef2ff"
      }
    );
  };
})(typeof window !== "undefined" ? window : globalThis);
