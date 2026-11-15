// Edit these details for your best friend
const CONFIG = {
  friendName: "Louis",
  senderName: "Shreya",
  age: "20",
  fireworksLines: ["HAPPY", "20TH!", "LOUISS"],
  wishHeadline: "Happy 20th, MARIA LOUIS PANDIAN. Welcome out of the teens.",
  wishMessage:
  "Happiest Birthday to you louis uncle! ❤️😂 I honestly don't know what I'd do without you. Thank you for being there, for all the laughs, random conversations, stupid fights and countless memories. Life would definitely be a little less fun without you in it. No matter how much I tease you or annoy you, you know you mean a lot to me. I hope this year brings you all the happiness, success and everything you've been wishing for. Never change (okay, maybe improve a little 😂). Stay happy, stay crazy and keep being the amazing person you are. So lucky to have you as my best friend. Happy Birthday once again! ❤️",
  // Put your image filenames (e.g. "photo1.jpg") in the same folder
  photos: [
    { src: "photo 1.jpeg" },
    { src: "photo 2.jpeg" },
    { src: "photo 3.jpeg" },
  ],
};

// Views & Navigation
const views = {
  ask: document.getElementById("view-ask"),
  dodge: document.getElementById("view-dodge"),
  fireworks: document.getElementById("view-fireworks"),
  wish: document.getElementById("view-wish"),
};

let currentStep = "ask";
let stopFireworks = null;

function setStep(step) {
  currentStep = step;
  Object.entries(views).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== step);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const target = btn.dataset.step;
    const isActive =
      target === step || (target === "ask" && (step === "ask" || step === "dodge"));
    btn.classList.toggle("active", isActive);
  });

  if (step === "fireworks") {
    startFireworks();
  } else if (stopFireworks) {
    stopFireworks();
    stopFireworks = null;
  }
}

// Hydrate text from CONFIG
document.getElementById("brandBtn").textContent = `${CONFIG.friendName}'s ${CONFIG.age}th`;
document.getElementById("askAge").textContent = CONFIG.age;
document.getElementById("askEyebrow").textContent = `Level ${CONFIG.age} Unlocked · From ${CONFIG.senderName}`;
document.getElementById("askHeadline").textContent =
  `Yo ${CONFIG.friendName} — made something for your ${CONFIG.age}th. Ready?`;
document.getElementById("wishKicker").textContent =
  `Happy ${CONFIG.age}th Birthday, ${CONFIG.friendName} · From ${CONFIG.senderName}`;
document.getElementById("wishHeadline").textContent = CONFIG.wishHeadline;
document.getElementById("wishMessage").textContent = CONFIG.wishMessage;

// Photo Carousel
let photoIdx = 0;
const photoImg = document.getElementById("photoImg");
const photoFallback = document.getElementById("photoFallback");
const fallbackCaption = document.getElementById("fallbackCaption");
const photoMeta = document.getElementById("photoMeta");
const photoCaption = document.getElementById("photoCaption");

function renderPhoto() {
  const item = CONFIG.photos[photoIdx];
  photoImg.classList.remove("hidden");
  photoFallback.classList.add("hidden");
  photoImg.src = item.src;
  photoImg.alt = item.caption;
  photoMeta.textContent = `${item.year} · ${String(photoIdx + 1).padStart(2, "0")}/${String(
    CONFIG.photos.length
  ).padStart(2, "0")}`;
  photoCaption.textContent = item.caption;
  fallbackCaption.textContent = item.caption;
}

photoImg.addEventListener("error", () => {
  photoImg.classList.add("hidden");
  photoFallback.classList.remove("hidden");
});

document.getElementById("prevPhotoBtn").addEventListener("click", () => {
  photoIdx = (photoIdx - 1 + CONFIG.photos.length) % CONFIG.photos.length;
  renderPhoto();
});

document.getElementById("nextPhotoBtn").addEventListener("click", () => {
  photoIdx = (photoIdx + 1) % CONFIG.photos.length;
  renderPhoto();
});

renderPhoto();

// Web Audio Birthday Songs
const SONGS = [
  {
    name: "Happy Birthday to You · Classic 20th Chime",
    beatMs: 420,
    notes: [
      [261.63, 0.75, 130.81], [261.63, 0.25], [293.66, 1, 196], [261.63, 1], [349.23, 1, 174.61], [329.63, 2, 130.81],
      [261.63, 0.75, 130.81], [261.63, 0.25], [293.66, 1, 196], [261.63, 1], [392, 1, 196], [349.23, 2, 174.61],
      [261.63, 0.75, 130.81], [261.63, 0.25], [523.25, 1, 130.81], [440, 1, 174.61], [349.23, 1], [329.63, 1, 130.81], [293.66, 1.5, 196],
      [466.16, 0.75, 233.08], [466.16, 0.25], [440, 1, 174.61], [349.23, 1], [392, 1, 196], [349.23, 2.2, 174.61],
    ],
  },
  {
    name: "For He's a Jolly Good Fellow · Birthday Anthem",
    beatMs: 410,
    notes: [
      [261.63, 0.6, 130.81], [329.63, 1, 130.81], [329.63, 0.6], [329.63, 0.6], [293.66, 0.6, 196], [329.63, 0.6], [349.23, 1.5, 174.61], [329.63, 0.6],
      [293.66, 1, 196], [293.66, 0.6], [293.66, 0.6], [261.63, 0.6], [293.66, 0.6], [329.63, 1.5, 130.81], [261.63, 0.6],
      [329.63, 1, 130.81], [329.63, 0.6], [329.63, 0.6], [293.66, 0.6, 196], [329.63, 0.6], [349.23, 1.4, 174.61],
      [440, 1, 174.61], [392, 0.6, 196], [349.23, 0.6], [329.63, 0.8, 130.81], [293.66, 0.8, 196], [261.63, 2, 130.81],
    ],
  },
  {
    name: "Level 20 Fanfare · Upbeat Party Synth",
    beatMs: 360,
    notes: [
      [261.63, 0.5, 130.81], [329.63, 0.5], [392, 0.5], [523.25, 1, 130.81], [392, 0.5], [523.25, 1.4, 174.61],
      [349.23, 0.5, 174.61], [440, 0.5], [523.25, 0.5], [659.25, 1, 196], [587.33, 0.5], [523.25, 1.6, 130.81],
    ],
  },
];

let audioCtx = null;
let songTimer = null;
let songIdx = 0;
let isPlaying = false;

function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playNote(freq, durSec, bassFreq) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.32, durSec));
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durSec + 0.08);

  if (bassFreq) {
    const bOsc = ctx.createOscillator();
    const bGain = ctx.createGain();
    bOsc.type = "sine";
    bOsc.frequency.setValueAtTime(bassFreq, now);
    bGain.gain.setValueAtTime(0.0001, now);
    bGain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    bGain.gain.exponentialRampToValueAtTime(0.0001, now + durSec * 1.2);
    bOsc.connect(bGain);
    bGain.connect(ctx.destination);
    bOsc.start(now);
    bOsc.stop(now + durSec * 1.25 + 0.1);
  }
}

function playPopChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

function stopSong() {
  clearTimeout(songTimer);
  songTimer = null;
  isPlaying = false;
  document.getElementById("playSongBtn").textContent = "Play";
}

function startSong() {
  clearTimeout(songTimer);
  isPlaying = true;
  document.getElementById("playSongBtn").textContent = "Pause";
  const song = SONGS[songIdx];
  document.getElementById("songName").textContent = song.name;
  let i = 0;

  function next() {
    if (!isPlaying) return;
    const [freq, beats, bass] = song.notes[i];
    const ms = beats * song.beatMs;
    playNote(freq, ms / 1000, bass);
    i = (i + 1) % song.notes.length;
    songTimer = setTimeout(next, ms);
  }
  next();
}

document.getElementById("playSongBtn").addEventListener("click", () => {
  if (isPlaying) stopSong();
  else startSong();
});

document.getElementById("nextSongBtn").addEventListener("click", () => {
  songIdx = (songIdx + 1) % SONGS.length;
  document.getElementById("songName").textContent = SONGS[songIdx].name;
  if (isPlaying) startSong();
});

// Fireworks Canvas
function startFireworks() {
  if (stopFireworks) stopFireworks();
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let animId = 0;

  function resize() {
    width = canvas.parentElement.clientWidth || window.innerWidth;
    height = canvas.parentElement.clientHeight || window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const lines = CONFIG.fireworksLines.filter((l) => l.trim().length > 0);
  const maxLen = Math.max(...lines.map((l) => l.length), 6);
  const spacing = Math.min(58, Math.max(26, (width * 0.78) / maxLen));
  const lineGap = Math.min(84, Math.max(50, height * 0.14));
  const fontSize = Math.round(spacing * 0.94);
  const hues = [42, 195, 345, 155, 220, 25];

  const letters = [];
  const startY = height * 0.42 - ((lines.length - 1) * lineGap) / 2;
  let idx = 0;

  lines.forEach((line, row) => {
    const startX = width / 2 - ((line.length - 1) * spacing) / 2;
    for (let col = 0; col < line.length; col += 1) {
      if (line[col] === " ") continue;
      letters.push({
        char: line[col],
        x: startX + col * spacing,
        y: startY + row * lineGap,
        hue: hues[idx % hues.length],
        phase: "waiting",
        rocketY: height + 12,
        delay: idx * 90 + 150,
        pulse: idx * 0.45,
      });
      idx += 1;
    }
  });

  const shards = [];
  const rockets = [];

  function burst(bx, by, hue, count = 24) {
    for (let i = 0; i < count; i += 1) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.25;
      const sp = 1.5 + Math.random() * 3.8;
      shards.push({
        x: bx,
        y: by,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        alpha: 1,
        color: `hsl(${(hue + Math.random() * 26) % 360}, 95%, 64%)`,
        size: 1.8 + Math.random() * 2.4,
      });
    }
  }

  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    rockets.push({
      x: e.clientX - rect.left,
      y: height,
      targetY: e.clientY - rect.top,
      vy: -12 - Math.random() * 3,
      hue: hues[Math.floor(Math.random() * hues.length)],
    });
    playPopChime();
  }
  canvas.addEventListener("click", onClick);

  const t0 = performance.now();
  function frame(now) {
    const elapsed = now - t0;
    ctx.fillStyle = "rgba(13, 15, 23, 0.24)";
    ctx.fillRect(0, 0, width, height);

    let allLit = true;
    for (const l of letters) {
      if (l.phase === "waiting") {
        allLit = false;
        if (elapsed >= l.delay) l.phase = "launching";
      } else if (l.phase === "launching") {
        allLit = false;
        l.rocketY -= Math.max(8, (l.rocketY - l.y) * 0.16);
        ctx.beginPath();
        ctx.arc(l.x, l.rocketY, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${l.hue}, 96%, 68%)`;
        ctx.fill();
        if (l.rocketY <= l.y + 4) {
          l.phase = "lit";
          burst(l.x, l.y, l.hue, 22);
        }
      }
      if (l.phase === "lit") {
        const dy = Math.sin(elapsed * 0.0025 + l.pulse) * 3;
        ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = `hsl(${l.hue}, 95%, 60%)`;
        ctx.shadowBlur = 16;
        ctx.fillStyle = `hsl(${l.hue}, 96%, 70%)`;
        ctx.fillText(l.char, l.x, l.y + dy);
        ctx.shadowBlur = 0;
      }
    }

    if (allLit && Math.random() < 0.032) {
      rockets.push({
        x: width * (0.14 + Math.random() * 0.72),
        y: height,
        targetY: height * (0.15 + Math.random() * 0.55),
        vy: -10.5 - Math.random() * 3,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    for (let i = rockets.length - 1; i >= 0; i -= 1) {
      const r = rockets[i];
      r.y += r.vy;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${r.hue}, 96%, 70%)`;
      ctx.fill();
      if (r.y <= r.targetY) {
        burst(r.x, r.y, r.hue, 30);
        rockets.splice(i, 1);
      }
    }

    for (let i = shards.length - 1; i >= 0; i -= 1) {
      const s = shards[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.055;
      s.alpha -= 0.017;
      if (s.alpha <= 0) {
        shards.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    animId = requestAnimationFrame(frame);
  }
  animId = requestAnimationFrame(frame);

  stopFireworks = () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("click", onClick);
  };
}

// Button Listeners
document.getElementById("brandBtn").addEventListener("click", () => setStep("ask"));
document.getElementById("replayHeaderBtn").addEventListener("click", () => setStep("ask"));
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => setStep(btn.dataset.step));
});
document.getElementById("yesBtn").addEventListener("click", () => {
  playPopChime();
  setStep("fireworks");
});
document.getElementById("noBtn").addEventListener("click", () => setStep("dodge"));
document.getElementById("dodgeAcceptBtn").addEventListener("click", () => {
  playPopChime();
  setStep("fireworks");
});
document.getElementById("replayFireworksBtn").addEventListener("click", startFireworks);
document.getElementById("toWishBtn").addEventListener("click", () => {
  playPopChime();
  setStep("wish");
});
document.getElementById("launchSkyBtn").addEventListener("click", () => setStep("fireworks"));