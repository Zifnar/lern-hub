(function (global) {
  const LernHub = (global.LernHub = global.LernHub || {});

  let audioCtx = null;

  function getAudioContext() {
    if (audioCtx) {
      if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
        audioCtx.resume().catch(function () {});
      }
      return audioCtx;
    }
    const Ctx = global.AudioContext || global.webkitAudioContext;
    if (!Ctx) return null;
    try {
      audioCtx = new Ctx();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function isSoundEnabled() {
    if (LernHub.Storage && typeof LernHub.Storage.getSettings === "function") {
      return LernHub.Storage.getSettings().sound !== false;
    }
    return true;
  }

  function playTone(ctx, freq, startOffset, duration, type, volume) {
    const now = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume || 0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function play(type, streak) {
    if (!isSoundEnabled()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      if (type === "tap") {
        playTone(ctx, 540, 0, 0.045, "sine", 0.07);
      } else if (type === "correct") {
        const boost = Math.min(streak || 0, 8) * 14;
        playTone(ctx, 523.25 + boost, 0, 0.11, "triangle", 0.13); // C5+
        playTone(ctx, 659.25 + boost, 0.09, 0.18, "triangle", 0.14); // E5+
      } else if (type === "wrong") {
        playTone(ctx, 329.63, 0, 0.14, "sine", 0.1); // E4 (warm)
        playTone(ctx, 293.66, 0.11, 0.2, "sine", 0.09); // D4
      } else if (type === "complete") {
        playTone(ctx, 523.25, 0, 0.13, "triangle", 0.12);
        playTone(ctx, 659.25, 0.1, 0.13, "triangle", 0.12);
        playTone(ctx, 783.99, 0.2, 0.13, "triangle", 0.13);
        playTone(ctx, 1046.5, 0.3, 0.32, "triangle", 0.15);
      } else if (type === "badge") {
        playTone(ctx, 783.99, 0, 0.12, "sine", 0.12);
        playTone(ctx, 987.77, 0.09, 0.12, "sine", 0.12);
        playTone(ctx, 1174.66, 0.18, 0.28, "sine", 0.14);
      }
    } catch (e) {
      // Audio-Fehler still ignorieren
    }
  }

  function canSpeak() {
    return typeof global.speechSynthesis !== "undefined" && typeof global.SpeechSynthesisUtterance !== "undefined";
  }

  function speak(text, lang) {
    if (!text || !canSpeak()) return;
    try {
      const synth = global.speechSynthesis;
      synth.cancel();

      const utter = new global.SpeechSynthesisUtterance(String(text));
      const targetLang = lang === "en" ? "en-GB" : lang || "en-GB";
      utter.lang = targetLang;
      utter.rate = 0.92;
      utter.pitch = 1.05;

      const voices = synth.getVoices ? synth.getVoices() : [];
      if (voices && voices.length > 0) {
        const match =
          voices.find((v) => v.lang && v.lang.toLowerCase() === targetLang.toLowerCase()) ||
          voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(targetLang.slice(0, 2).toLowerCase()));
        if (match) utter.voice = match;
      }

      synth.speak(utter);
    } catch (e) {
      // Sprachsynthese-Fehler still ignorieren
    }
  }

  function confetti() {
    if (typeof document === "undefined" || !document.body) return;
    if (global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";

    const width = (canvas.width = global.innerWidth || 800);
    const height = (canvas.height = global.innerHeight || 600);
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    const colors = ["#4f46e5", "#f59e0b", "#10b981", "#ec4899", "#3b82f6", "#8b5cf6"];
    const pieces = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * width,
        y: -20 - Math.random() * height * 0.4,
        w: 7 + Math.random() * 6,
        h: 5 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 4.5,
        vy: 3 + Math.random() * 4.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        color: colors[i % colors.length]
      });
    }

    const startTime = Date.now();
    const duration = 2200;

    function frame() {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        canvas.remove();
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const alpha = elapsed > duration - 500 ? Math.max(0, (duration - elapsed) / 500) : 1;
      ctx.globalAlpha = alpha;

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      global.requestAnimationFrame(frame);
    }

    global.requestAnimationFrame(frame);
  }

  function showToast(icon, title, subtitle) {
    if (typeof document === "undefined") return;
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast-card";
    toast.innerHTML = `
      <div class="toast-icon">${icon || "✨"}</div>
      <div class="toast-body">
        <div class="toast-title"></div>
        ${subtitle ? '<div class="toast-subtitle"></div>' : ""}
      </div>
    `;
    toast.querySelector(".toast-title").textContent = title || "";
    if (subtitle) {
      toast.querySelector(".toast-subtitle").textContent = subtitle;
    }

    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-leaving");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    }, 3400);
  }

  LernHub.Feedback = {
    play: play,
    speak: speak,
    canSpeak: canSpeak,
    confetti: confetti,
    showToast: showToast
  };
})(typeof window !== "undefined" ? window : globalThis);
