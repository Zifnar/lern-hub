(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (typeof document === "undefined") {
        resolve({ src: src, ok: false });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = function () {
        resolve({ src: src, ok: true });
      };
      script.onerror = function () {
        console.warn("[LernHub] Modul-Datei konnte nicht geladen werden:", src);
        resolve({ src: src, ok: false });
      };
      document.body.appendChild(script);
    });
  }

  LernHub.Loader = {
    loadAll: function () {
      const config = global.LERNHUB_CONFIG || {};
      const files = Array.isArray(config.modules) ? config.modules : [];

      return Promise.all(files.map(loadScript)).then(function (results) {
        if (typeof LernHub.syncLegacyModules === "function") {
          LernHub.syncLegacyModules();
        }
        return results;
      });
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
