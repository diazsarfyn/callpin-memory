/* ============================================================
   MEMORY DATA
   Untuk mengganti foto: ubah nilai 'photo' menjadi path file
   gambar kamu, contoh: photo: 'foto1.jpg'
   atau URL: photo: 'https://...'
   Jika 'photo' diisi, gambar akan ditampilkan.
   Jika 'photo' kosong (''), emoji akan ditampilkan sebagai ganti.
============================================================ */
const memories = [
  {
    code:    'A1',
    label:   'First Photobox',
    emoji:   '<img src="flower1.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto1.jpeg',            // contoh: 'foto-first-date.jpg'
    title:   'First Photobox 🌷',
    message: 'Awal dari segalanya.Photobox pertama kita yang masih canggung tapi bikin kangen.<br><em>26-10-25</em>.',
    caption: '— our first chapter —'
  },
  {
    code:    'A2',
    label:   'Cute Moments',
    emoji:   '<img src="flower2.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto2.jpeg',            // contoh: 'foto-cute.jpg'
    title:   'Cute Moments',
    message: 'I see the beauty in the depths of your eyes... <br><em>13-12-25</em>.',
    caption: '— warmth in every frame —'
  },
  {
    code:    'A3',
    label:   'Random Happiness',
    emoji:   '<img src="flower3.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto3.jpeg',            // contoh: 'foto-funny.jpg'
    title:   'Random Happiness',
    message: 'Hidup aku jadi lebih baik sejak ketemu sama kamu. <br><em>31-01-26</em>.',
    caption: '— laugh & repeat —'
  },
  {
    code:    'A4',
    label:   'Made My Day',
    emoji:   '<img src="flower4.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto4.jpeg',            // contoh: 'foto-special.jpg'
    title:   'Made My Day',
    message: 'Photobox dadakan tanpa rencana, tapi hasilnya menurut aku jadi salah satu photobox yang lucu. <br><em>04-04-26</em>.',
    caption: '— a day to remember —'
  },
  {
    code:    'A5',
    label:   'Favorite Smile',
    emoji:   '<img src="sakura.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto5.jpeg',            // contoh: 'foto-random.jpg'
    title:   'Favorite Smile',
    message: 'Photobox favorit aku, dan ini salah satu foto terlucu kamu. <br><em>30-04-26</em>.',
    caption: '— unplanned, unforgettable —'
  },
  {
    code:    'A6',
    label:   'Sweet Smile',
    emoji:   '<img src="bunga6.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto6.jpeg',            // contoh: 'foto-smile.jpg'
    title:   'Sweet Smile',
    message: 'Semuanya terasa begitu hangat dan lembut saat kamu ada di dekatku. <br><em>06-07-26</em>.',
    caption: '— forever iconic —'
  },
  {
    code:    'A7',
    label:   'Forever Us',
    emoji:   '<img src="bunga7.png" class="item-icon-img" alt="A1">',
    /* Ganti '' dengan path/URL foto untuk memori ini */
    photo:   'poto7.jpeg',            // contoh: 'foto-forever.jpg'
    title:   'Forever Us',
    message: 'Dua orang, jutaan kenangan. Semoga photobox kita terus bertambah ya,I love you! <br><em>29-08-26</em>. ',
    caption: '— always & forever —'
  }
];

/* ============================================================
   STATE
============================================================ */
let coinInserted = false;
let isPlaying    = false;
let audioCtx     = null;
let bgmInterval  = null;
let bgmStep      = 0;

/* ============================================================
   WEB AUDIO API – INIT CONTEXT
============================================================ */
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/* ============================================================
   SOUND EFFECTS
============================================================ */
function playCoinSound() {
  const ctx = getAudioCtx();
  // Coin "clink" = quick high-frequency metallic tone, 3 hits
  const times = [0, 0.05, 0.12];
  times.forEach(t => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + t * 300, ctx.currentTime + t);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + t + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);

    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.2);
  });
}

function playMechanicalSound() {
  const ctx = getAudioCtx();

  // Ascending beep sequence
  const beeps = [
    { freq: 440,  t: 0,    dur: 0.08 },
    { freq: 660,  t: 0.1,  dur: 0.08 },
    { freq: 880,  t: 0.2,  dur: 0.12 },
    { freq: 1100, t: 0.35, dur: 0.18 },
  ];
  beeps.forEach(b => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(b.freq, ctx.currentTime + b.t);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + b.t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + b.t + b.dur);
    osc.start(ctx.currentTime + b.t);
    osc.stop(ctx.currentTime + b.t + b.dur + 0.05);
  });

  // Mechanical rumble noise
  const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.04;
  const src  = ctx.createBufferSource();
  const filt = ctx.createBiquadFilter();
  const gn   = ctx.createGain();
  src.buffer = buf;
  filt.type  = 'bandpass';
  filt.frequency.value = 180;
  src.connect(filt);
  filt.connect(gn);
  gn.connect(ctx.destination);
  gn.gain.setValueAtTime(0.3, ctx.currentTime);
  gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  src.start();
  src.stop(ctx.currentTime + 0.5);
}

/* ============================================================
   BGM – Synthesized lo-fi dreamy chord loop (Web Audio API)
============================================================ */
// Simple dreamy chord sequence (C – Dm – Em – C – F – Dm)
const bgmSequence = [
  [261.63, 329.63, 392.00], // C major
  [293.66, 349.23, 440.00], // D minor
  [329.63, 392.00, 493.88], // E minor
  [261.63, 329.63, 392.00], // C major
  [349.23, 440.00, 523.25], // F major
  [293.66, 349.23, 440.00], // D minor
];

function startBGM() {
  const ctx = getAudioCtx();
  if (bgmInterval) return;
  bgmStep = 0;

  const playChord = () => {
    const chord = bgmSequence[bgmStep % bgmSequence.length];
    chord.forEach(freq => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const dly  = ctx.createDelay(0.5);
      dly.delayTime.value = 0.3;

      osc.connect(gain);
      gain.connect(dly);
      dly.connect(ctx.destination);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq / 2; // one octave down for softness

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.7);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.3);
    });
    bgmStep++;
  };

  playChord();
  bgmInterval = setInterval(playChord, 1400);
}

function stopBGM() {
  if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; }
}

const bgmAudio = document.getElementById('bgmAudio');

function toggleMusic() {
    const btn = document.getElementById('btnPlay');
    const icon = document.getElementById('cassetteIcon');

    if (bgmAudio.paused) {
        bgmAudio.play();
        btn.textContent = '⏸ Pause';
        icon.classList.add('spinning');
        showToast('🎵 The song begins...');
    } else {
        bgmAudio.pause();
        btn.textContent = '▶ Play';
        icon.classList.remove('spinning');
    }
}

/* ============================================================
   COIN LOGIC
============================================================ */
function insertCoin() {
  if (coinInserted) {
    showToast('💕 Koin sudah dimasukkan, pilih memorinya!');
    return;
  }

  getAudioCtx();
  playCoinSound();

  // Drop coin animation
  const coinEl = document.getElementById('coinAnim');
  coinEl.classList.remove('drop');
  void coinEl.offsetWidth; // force reflow to restart animation
  coinEl.classList.add('drop');

  // Sparkle burst around the coin button
  spawnSparkles();

  setTimeout(() => {
    coinInserted = true;
    document.getElementById('coinStatus').textContent = 'Coin Entered! ✅';
    document.getElementById('btnCoin').disabled = true;

    // Activate all memory buttons
    document.querySelectorAll('.memory-btn').forEach(btn => {
      btn.classList.add('active');
    });

    showToast('Koin Cinta masuk! Pilih memorimu, Calla~');
  }, 500);
}

/* ============================================================
   SPARKLE EFFECT
============================================================ */
function spawnSparkles() {
  const container = document.getElementById('sparkleContainer');
  const emojis    = ['✨', '💕', '🌸', '⭐', '💫', '🎀'];
  const coinBtn   = document.getElementById('btnCoin');
  const rect      = coinBtn.getBoundingClientRect();

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left  = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 120) + 'px';
    el.style.top   = (rect.top  + (Math.random() - 0.5) * 80) + 'px';
    el.style.animationDelay = (Math.random() * 0.3) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

/* ============================================================
   MEMORY SELECTION
============================================================ */
function selectMemory(index) {
  if (!coinInserted) {
    showToast('💡 Masukkan Koin Cinta dulu ya, Syahla!');
    return;
  }

  const m = memories[index];
  playMechanicalSound();

  // Highlight selected button
  document.querySelectorAll('.memory-btn').forEach(b => b.style.outline = '');
  document.getElementById('mbtn-' + index).style.outline = '3px solid #FF8FAB';

  // Eject strip animation
  const slot       = document.getElementById('dispenserSlot');
  const strip      = document.getElementById('stripOut');
  const stripEmoji = document.getElementById('stripEmoji');
  const stripLabel = document.getElementById('stripLabel');

  strip.classList.remove('eject');
  slot.classList.remove('has-strip');

  /*
    =====================================================
    TAG GAMBAR DISPENSER MINI:
    Jika m.photo terisi, gambar ditampilkan di slot mini.
    Kosongkan m.photo pada array memories[] untuk
    menampilkan emoji sebagai gantinya.
    =====================================================
  */
  stripEmoji.innerHTML = m.photo
    ? `<img src="${m.photo}" alt="${m.label}" />`
    : m.emoji;
  stripLabel.textContent = m.label;

  setTimeout(() => {
    strip.classList.add('eject');
    slot.classList.add('has-strip');
  }, 300);

  // Open modal after the strip animation
  setTimeout(() => openModal(m), 800);
}

/* ============================================================
   MODAL
============================================================ */
function openModal(m) {
  document.getElementById('modalCode').textContent    = m.code + ' — ' + m.label;
  document.getElementById('modalTitle').textContent   = m.title;
  document.getElementById('modalMessage').innerHTML   = m.message;
  document.getElementById('modalCaption').textContent = m.caption;

  // Photo or emoji in modal
  const photoEl = document.getElementById('modalPhoto');
  const emojiEl = document.getElementById('modalEmoji');

  /*
    =====================================================
    TAG GAMBAR MODAL:
    Foto diambil dari nilai m.photo di array memories[].
    Jika diisi, <img> akan dibuat secara dinamis di sini.
    Contoh isi: photo: 'foto-first-date.jpg'
    =====================================================
  */
  if (m.photo) {
    emojiEl.style.display = 'none';
    const old = photoEl.querySelector('img');
    if (old) old.remove();
    const img = document.createElement('img');
    img.src = m.photo;
    img.alt = m.label;
    photoEl.appendChild(img);
  } else {
    emojiEl.style.display = '';
    emojiEl.textContent = m.emoji;
    const old = photoEl.querySelector('img');
    if (old) old.remove();
  }

  document.getElementById('modalOverlay').classList.add('open');

  // Reset coin & buttons after a short delay (so user can pick again)
  coinInserted = false;
  setTimeout(() => {
    document.getElementById('btnCoin').disabled = false;
    document.getElementById('coinStatus').textContent = 'Waiting for coin…';
    document.querySelectorAll('.memory-btn').forEach(b => {
      b.classList.remove('active');
      b.style.outline = '';
    });
    // Reset dispenser strip
    document.getElementById('stripOut').classList.remove('eject');
    document.getElementById('dispenserSlot').classList.remove('has-strip');
  }, 600);
}

function closeModal(event) {
  // Close only when clicking the dark overlay itself, or the close button (no event)
  if (event && event.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ============================================================
   FLOATING BACKGROUND HEARTS
============================================================ */
function spawnBgHeart() {
  const container = document.getElementById('bgHearts');
  const hearts    = ['💕', '🌸', '✨', '💗', '🎀', '💖', '🌷'];
  const el        = document.createElement('span');
  el.textContent  = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left   = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  const dur = 8 + Math.random() * 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay    = Math.random() * dur + 's';
  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + 2) * 1000);
}
setInterval(spawnBgHeart, 1200);
for (let i = 0; i < 8; i++) spawnBgHeart();

/* ============================================================
   INIT – BUILD MEMORY BUTTONS
============================================================ */
function buildGrid() {
  const grid = document.getElementById('memoryGrid');
  memories.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'memory-btn';
    btn.id = 'mbtn-' + i;
    btn.innerHTML = `
      <div class="led"></div>
      <span class="code">${m.code}</span>
      <span class="emoji">${m.emoji}</span>
      <span class="btn-label">${m.label}</span>
    `;
    btn.addEventListener('click', () => selectMemory(i));
    grid.appendChild(btn);
  });
}

// Entry point
buildGrid();
