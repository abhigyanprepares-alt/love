/* ==========================================================================
   MERO MAYA - HIGH PRECISION TOUCH & INTERACTION ENGINE
   ========================================================================== */

// Audio Synthesizer Setup (Available immediately)
let audioCtx = null;
let isMusicPlaying = false;
let tuneInterval = null;
const chordNotes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playChime(freq = null) {
  try {
    initAudio();
    const note = freq || chordNotes[Math.floor(Math.random() * chordNotes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    // Audio contexts ignored if user has not interacted
  }
}

// Particle Class
class PurpleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 12 + 8;
    this.vx = (Math.random() - 0.5) * 2.5;
    this.vy = (Math.random() - 0.5) * 2.5 - 1.2;
    this.alpha = 1;
    this.decay = Math.random() * 0.025 + 0.015;
    this.color = Math.random() > 0.3 ? '#c084fc' : '#e9d5ff';
    this.rotation = Math.random() * Math.PI;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.rotation += 0.04;
  }
  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#9333ea';

    const s = this.size / 18;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 18 * s);
    ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
    ctx.fill();

    ctx.restore();
  }
}

let trailParticles = [];

/* ==========================================================================
   GLOBAL CLICK HANDLERS (DEFINED AT ROOT LEVEL FOR HTML ONCLICK COMPATIBILITY)
   ========================================================================== */

window.tapStory = function(card) {
  card.style.borderColor = '#c084fc';
  card.style.boxShadow = '0 0 25px rgba(192, 132, 252, 0.6)';
  playChime(440);
  setTimeout(() => {
    card.style.borderColor = '';
    card.style.boxShadow = '';
  }, 900);
};

let roseBloomed = false;
window.reviveRose = function() {
  const roseBox = document.querySelector('.rose-interactive-box');
  const roseStatus = document.getElementById('rose-status');
  const roseGlyph = roseBox ? roseBox.querySelector('.rose-glyph') : null;
  if (!roseBox || !roseGlyph) return;

  roseBloomed = !roseBloomed;
  if (roseBloomed) {
    roseBox.classList.add('bloomed');
    roseGlyph.textContent = '🌹';
    roseGlyph.style.filter = 'drop-shadow(0 0 30px #c084fc)';
    roseStatus.innerHTML = '✨ <strong>Our rose is immortal now. No rain will ever ruin it.</strong> ✨';
    playChime(523.25);
    setTimeout(() => playChime(659.25), 200);

    const rect = roseBox.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      trailParticles.push(new PurpleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2));
    }
  } else {
    roseBox.classList.remove('bloomed');
    roseGlyph.textContent = '🥀';
    roseGlyph.style.filter = '';
    roseStatus.textContent = 'Tap the rose to make it bloom forever 💜';
  }
};

window.glowFrame = function(frame) {
  frame.style.boxShadow = '0 0 30px rgba(192, 132, 252, 0.85)';
  playChime(587.33);
  setTimeout(() => {
    frame.style.boxShadow = '';
  }, 1000);
};

const jarNotes = [
  "I'd hike Devchuli with 1,000 leeches again if it means holding your hand at the top.",
  "Eating boiled eggs with piro chow chow with you on the mountain was better than any 5-star restaurant.",
  "Remember when we panicked about your purse and my money? We survived it together like champions.",
  "Watching Dhamaal 4 on our very first day... I barely watched the movie because I was looking at you.",
  "Our sexy kiss pictures near Narayanghat will forever be the most special photos I own.",
  "Walking through Unnati Village beside you felt like walking into peace.",
  "I know long-distance is tough, but no border or distance between India and Nepal can ever change my love for you."
];
let noteIndex = 0;

window.popJarNote = function() {
  const noteBox = document.getElementById('love-note-box');
  const noteText = document.getElementById('note-msg');
  if (!noteBox || !noteText) return;

  noteIndex = (noteIndex + 1) % jarNotes.length;
  noteBox.style.transform = 'scale(0.88)';
  setTimeout(() => {
    noteText.textContent = `"${jarNotes[noteIndex]}"`;
    noteBox.style.transform = 'scale(1)';
    playChime(523.25);
  }, 150);
};

window.openEnvelope = function() {
  const env = document.getElementById('env-wrapper');
  const status = document.getElementById('env-status');
  if (!env || !status) return;

  env.classList.toggle('open');
  if (env.classList.contains('open')) {
    status.textContent = 'Touch again to close letter';
    playChime(392.00);
    setTimeout(() => playChime(523.25), 220);
  } else {
    status.textContent = 'Tap the purple seal to open';
  }
};

window.acceptLove = function() {
  const blockResult = document.getElementById('block-result-text');
  if (blockResult) blockResult.textContent = "Good choice! You're stuck with me for life, Sanu 💜";
  playChime(523.25);
  setTimeout(() => playChime(659.25), 180);
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
};

let remainingLeeches = 3;
window.flickLeech = function(leechElem) {
  if (leechElem.classList.contains('flicked')) return;

  leechElem.classList.add('flicked');
  remainingLeeches--;
  playChime(440 + (3 - remainingLeeches) * 80);
  if (navigator.vibrate) navigator.vibrate(30);

  const countText = document.getElementById('leech-count');
  if (countText) countText.textContent = `Leeches Left: ${remainingLeeches}`;

  if (remainingLeeches === 0) {
    setTimeout(() => {
      if (countText) countText.style.display = 'none';
      const reward = document.getElementById('chow-reward');
      if (reward) reward.style.display = 'flex';
      playChime(659.25);
    }, 400);
  }
};

let battleTaps = 0;
const maxTaps = 12;
window.tapBattle = function() {
  battleTaps++;
  const progress = Math.min((battleTaps / maxTaps) * 100, 100);
  
  const fill = document.getElementById('battle-fill');
  const score = document.getElementById('tap-score');
  if (fill) fill.style.width = `${progress}%`;
  if (score) score.textContent = Math.floor(progress);
  playChime(261.63 + battleTaps * 25);

  if (battleTaps >= maxTaps) {
    const verdict = document.getElementById('battle-verdict');
    if (verdict) verdict.innerHTML = "⚠️ <strong>SYSTEM ERROR:</strong> No matter how fast you tap, I still love you 100x more. You lose! Now give me a kiss 💋";
    playChime(523.25);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 120]);

    const btn = document.getElementById('battle-btn');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.textContent = 'He Won! ❤️';
    }
  }
};

let currentRotation = 0;
let isWheelSpinning = false;
const wheelOptions = [
  "Order food together & eat on FaceTime 🍜",
  "Send 5 cute kisses to the camera right now 💋",
  "You have to sing 15 seconds of any song 🎤",
  "Make the funniest ugly face screenshot 🤪",
  "Tell me a secret you haven't told me yet 🤫",
  "Pick a movie for our next virtual date night 🎬"
];

window.spinDateWheel = function() {
  if (isWheelSpinning) return;
  isWheelSpinning = true;

  const wheel = document.getElementById('roulette-wheel');
  const resultText = document.getElementById('wheel-result');
  if (resultText) resultText.textContent = "Selecting our activity...";

  const winningIndex = Math.floor(Math.random() * wheelOptions.length);
  const targetAngle = (360 - winningIndex * 60) % 360;

  const currentMod = currentRotation % 360;
  let delta = (targetAngle - currentMod + 360) % 360;
  if (delta === 0) delta = 360;

  currentRotation += (360 * 5) + delta;
  if (wheel) wheel.style.transform = `rotate(${currentRotation}deg)`;

  playChime(440);
  if (navigator.vibrate) navigator.vibrate(50);

  setTimeout(() => {
    isWheelSpinning = false;
    if (resultText) resultText.textContent = wheelOptions[winningIndex];
    playChime(659.25);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
  }, 3650);
};

let kissScore = 0;
let arcadeInterval = null;
window.startKissArcade = function() {
  kissScore = 0;
  const scoreBoard = document.getElementById('kiss-score');
  const winBanner = document.getElementById('arcade-win');
  const idleText = document.getElementById('arcade-idle');
  const startBtn = document.getElementById('start-kiss-btn');
  const arcadeField = document.getElementById('arcade-field');

  if (scoreBoard) scoreBoard.textContent = '0';
  if (winBanner) winBanner.style.display = 'none';
  if (idleText) idleText.style.display = 'none';
  if (startBtn) startBtn.style.display = 'none';

  arcadeInterval = setInterval(() => {
    if (kissScore >= 8) {
      clearInterval(arcadeInterval);
      return;
    }
    if (!arcadeField) return;

    const kiss = document.createElement('div');
    kiss.className = 'arcade-kiss-target';
    kiss.textContent = Math.random() > 0.3 ? '💋' : '💜';
    
    const fieldW = arcadeField.offsetWidth - 45;
    const randomLeft = Math.floor(Math.random() * Math.max(fieldW, 20)) + 10;
    kiss.style.left = `${randomLeft}px`;

    const catchKiss = () => {
      kissScore++;
      if (scoreBoard) scoreBoard.textContent = kissScore;
      playChime(392 + kissScore * 35);
      if (navigator.vibrate) navigator.vibrate(25);
      kiss.remove();

      if (kissScore >= 8) {
        clearInterval(arcadeInterval);
        document.querySelectorAll('.arcade-kiss-target').forEach(el => el.remove());
        if (winBanner) winBanner.style.display = 'block';
        if (startBtn) {
          startBtn.style.display = 'inline-block';
          startBtn.textContent = 'Play Again ↻';
        }
        playChime(659.25);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 150]);
      }
    };

    kiss.addEventListener('pointerdown', catchKiss);
    arcadeField.appendChild(kiss);

    setTimeout(() => {
      if (kiss.parentElement) kiss.remove();
    }, 2800);
  }, 700);
};

const spicyDares = [
  "Bite your lower lip and hold unbroken eye contact through the camera for 10 seconds without smiling.",
  "Whisper the most attractive thing about me in your softest voice right into your mic.",
  "Show your collarbone and neck, then tilt your head slowly while looking at the screen.",
  "Give your best slow, flirty wink and blow 3 warm kisses to the camera.",
  "Confess one secret thought you had about me when we were alone during our July trip.",
  "Do your most seductive model pose right now so I can take a screenshot.",
  "Take a cute, slightly spicy selfie right now and send it to my WhatsApp without checking it twice.",
  "Tell me the exact first thing you want to do the second we get into the hotel room on our next trip.",
  "Put your lips right against your phone's microphone and whisper 'Mero Maya' softly.",
  "Show me which outfit you plan to wear on our very next date night."
];
let currentDareIndex = 0;

window.nextDare = function() {
  const dareBox = document.getElementById('dare-box');
  const dareText = document.getElementById('dare-text');
  const dareNum = document.getElementById('dare-number');
  if (!dareBox || !dareText || !dareNum) return;

  currentDareIndex = (currentDareIndex + 1) % spicyDares.length;
  dareBox.style.transform = 'scale(0.85) rotate(-3deg)';
  playChime(392);
  if (navigator.vibrate) navigator.vibrate(35);

  setTimeout(() => {
    dareText.textContent = `"${spicyDares[currentDareIndex]}"`;
    dareNum.textContent = currentDareIndex + 1;
    dareBox.style.transform = 'scale(1) rotate(0deg)';
    playChime(587.33);
  }, 180);
};

/* ==========================================================================
   DOM LIFECYCLE INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. STARDUST CANVAS */
  const starCanvas = document.getElementById('stars-canvas');
  if (starCanvas) {
    const starCtx = starCanvas.getContext('2d');
    let stars = [];

    function resizeStarCanvas() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeStarCanvas);
    resizeStarCanvas();

    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 2 + 0.6,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.4 ? '#c084fc' : '#fef08a'
      });
    }

    function renderStars() {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      for (let s of stars) {
        s.y += s.speedY;
        s.x += s.speedX;
        if (s.y < 0) s.y = starCanvas.height;
        if (s.x < 0) s.x = starCanvas.width;
        if (s.x > starCanvas.width) s.x = 0;

        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = s.color;
        starCtx.globalAlpha = s.alpha;
        starCtx.shadowBlur = 8;
        starCtx.shadowColor = '#a855f7';
        starCtx.fill();
      }
      requestAnimationFrame(renderStars);
    }
    renderStars();
  }

  /* 2. TOUCH TRAIL CANVAS */
  const trailCanvas = document.getElementById('trail-canvas');
  if (trailCanvas) {
    const trailCtx = trailCanvas.getContext('2d');

    function resizeTrailCanvas() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeTrailCanvas);
    resizeTrailCanvas();

    function spawnParticles(x, y, count = 2) {
      for (let i = 0; i < count; i++) {
        trailParticles.push(new PurpleParticle(x, y));
      }
    }

    window.addEventListener('pointermove', (e) => {
      spawnParticles(e.clientX, e.clientY, 1);
    });

    window.addEventListener('pointerdown', (e) => {
      spawnParticles(e.clientX, e.clientY, 6);
    });

    function renderTrail() {
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        trailParticles[i].update();
        trailParticles[i].draw(trailCtx);
        if (trailParticles[i].alpha <= 0) {
          trailParticles.splice(i, 1);
        }
      }
      requestAnimationFrame(renderTrail);
    }
    renderTrail();
  }

  /* 3. AUDIO PLAY BUTTON */
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      initAudio();
      isMusicPlaying = !isMusicPlaying;
      musicBtn.classList.toggle('playing', isMusicPlaying);
      const txt = musicBtn.querySelector('.music-text');
      if (txt) txt.textContent = isMusicPlaying ? 'Melody Playing 💜' : 'Play Melody 💜';

      if (isMusicPlaying) {
        playChime(523.25);
        tuneInterval = setInterval(() => playChime(), 1600);
      } else {
        clearInterval(tuneInterval);
      }
    });
  }

  /* 4. SCRATCH PAD */
  const scratchCanvas = document.getElementById('scratch-pad');
  if (scratchCanvas) {
    const scratchCtx = scratchCanvas.getContext('2d');
    let isScratching = false;

    function initScratchCard() {
      scratchCtx.fillStyle = '#6b21a8';
      scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      scratchCtx.fillStyle = '#fef08a';
      scratchCtx.font = 'bold 14px Nunito';
      scratchCtx.textAlign = 'center';
      scratchCtx.fillText('✨ Rub with your finger to reveal ✨', 150, 95);
    }
    initScratchCard();

    function scratchMove(e) {
      if (!isScratching) return;
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      scratchCtx.globalCompositeOperation = 'destination-out';
      scratchCtx.beginPath();
      scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
      scratchCtx.fill();
    }

    scratchCanvas.addEventListener('pointerdown', (e) => {
      isScratching = true;
      scratchMove(e);
    });
    window.addEventListener('pointermove', scratchMove);
    window.addEventListener('pointerup', () => isScratching = false);
  }

  /* 5. HOLD-TO-HUG ENGINE */
  const hugBtn = document.getElementById('hug-btn');
  const hugFill = document.getElementById('hug-fill');
  const hugTxt = document.getElementById('hug-txt');
  let hugInterval = null;
  let chargeProgress = 0;

  if (hugBtn && hugFill && hugTxt) {
    function handleHugStart(e) {
      e.preventDefault();
      chargeProgress = 0;
      hugTxt.textContent = 'Sending warm hugs across the border... Don\'t let go! 🤗';
      hugBtn.style.transform = 'scale(0.9)';
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

      hugInterval = setInterval(() => {
        chargeProgress += 3;
        hugFill.style.width = `${Math.min(chargeProgress, 100)}%`;

        if (chargeProgress % 25 < 3) playChime(329.63 + chargeProgress);

        if (chargeProgress >= 100) {
          clearInterval(hugInterval);
          hugTxt.textContent = 'Hug received! My arms are wrapped right around you, Sanu. 💜';
          hugBtn.style.transform = 'scale(1.22)';
          if (navigator.vibrate) navigator.vibrate(250);

          const rect = hugBtn.getBoundingClientRect();
          for (let i = 0; i < 24; i++) {
            trailParticles.push(new PurpleParticle(rect.left + rect.width / 2, rect.top + rect.height / 2));
          }
        }
      }, 40);
    }

    function handleHugEnd() {
      if (chargeProgress < 100) {
        clearInterval(hugInterval);
        chargeProgress = 0;
        hugFill.style.width = '0%';
        hugTxt.textContent = 'Hold down a bit longer to deliver the full hug!';
        hugBtn.style.transform = 'scale(1)';
      }
    }

    hugBtn.addEventListener('pointerdown', handleHugStart);
    window.addEventListener('pointerup', handleHugEnd);
    window.addEventListener('pointercancel', handleHugEnd);
  }

  /* 6. DUAL-FINGER BORDER BRIDGE */
  const padIndia = document.getElementById('pad-india');
  const padNepal = document.getElementById('pad-nepal');
  const bridgeCanvas = document.getElementById('bridge-canvas');
  const bridgeStatus = document.getElementById('bridge-status');

  if (padIndia && padNepal && bridgeCanvas && bridgeStatus) {
    const bridgeCtx = bridgeCanvas.getContext('2d');
    let indiaPressed = false;
    let nepalPressed = false;
    let bridgeAnimFrame = null;

    function renderElectricCurrent() {
      bridgeCtx.clearRect(0, 0, bridgeCanvas.width, bridgeCanvas.height);
      const x1 = padIndia.offsetLeft + padIndia.offsetWidth / 2;
      const y1 = padIndia.offsetTop + padIndia.offsetHeight / 2;
      const x2 = padNepal.offsetLeft + padNepal.offsetWidth / 2;
      const y2 = padNepal.offsetTop + padNepal.offsetHeight / 2;

      bridgeCtx.beginPath();
      bridgeCtx.moveTo(x1, y1);
      const segments = 8;
      for (let i = 1; i < segments; i++) {
        const tx = x1 + (x2 - x1) * (i / segments);
        const ty = y1 + (y2 - y1) * (i / segments) + (Math.random() - 0.5) * 16;
        bridgeCtx.lineTo(tx, ty);
      }
      bridgeCtx.lineTo(x2, y2);
      bridgeCtx.strokeStyle = '#c084fc';
      bridgeCtx.lineWidth = 3;
      bridgeCtx.shadowBlur = 15;
      bridgeCtx.shadowColor = '#a855f7';
      bridgeCtx.stroke();

      if (indiaPressed && nepalPressed) {
        bridgeAnimFrame = requestAnimationFrame(renderElectricCurrent);
      }
    }

    function checkBridge() {
      if (indiaPressed && nepalPressed) {
        bridgeStatus.textContent = '⚡ Connected across India & Nepal! Distance = 0 km 💜';
        playChime(659.25);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        cancelAnimationFrame(bridgeAnimFrame);
        renderElectricCurrent();
      } else {
        cancelAnimationFrame(bridgeAnimFrame);
        bridgeCtx.clearRect(0, 0, bridgeCanvas.width, bridgeCanvas.height);
        bridgeStatus.textContent = 'Touch and hold both pads with two fingers...';
      }
    }

    padIndia.addEventListener('pointerdown', (e) => {
      indiaPressed = true;
      padIndia.classList.add('active');
      padIndia.setPointerCapture(e.pointerId);
      checkBridge();
    });
    padIndia.addEventListener('pointerup', () => {
      indiaPressed = false;
      padIndia.classList.remove('active');
      checkBridge();
    });

    padNepal.addEventListener('pointerdown', (e) => {
      nepalPressed = true;
      padNepal.classList.add('active');
      padNepal.setPointerCapture(e.pointerId);
      checkBridge();
    });
    padNepal.addEventListener('pointerup', () => {
      nepalPressed = false;
      padNepal.classList.remove('active');
      checkBridge();
    });
  }

  /* 7. CONSTELLATION LINKER */
  const constCanvas = document.getElementById('constellation-canvas');
  if (constCanvas) {
    const cCtx = constCanvas.getContext('2d');
    const constMsg = document.getElementById('constellation-msg');
    const starsList = [
      { x: 45, y: 155, id: 1 },
      { x: 90, y: 80, id: 2 },
      { x: 150, y: 50, id: 3 },
      { x: 210, y: 80, id: 4 },
      { x: 255, y: 155, id: 5 }
    ];
    let linkedIndex = 0;
    let isLinking = false;

    function drawConstellationScene() {
      cCtx.clearRect(0, 0, constCanvas.width, constCanvas.height);
      cCtx.beginPath();
      cCtx.strokeStyle = '#c084fc';
      cCtx.lineWidth = 2.5;
      cCtx.shadowBlur = 12;
      cCtx.shadowColor = '#c084fc';

      for (let i = 0; i < linkedIndex; i++) {
        if (i === 0) cCtx.moveTo(starsList[0].x, starsList[0].y);
        else cCtx.lineTo(starsList[i].x, starsList[i].y);
      }
      cCtx.stroke();

      starsList.forEach((st, idx) => {
        cCtx.beginPath();
        cCtx.arc(st.x, st.y, idx < linkedIndex ? 7 : 5, 0, Math.PI * 2);
        cCtx.fillStyle = idx < linkedIndex ? '#fef08a' : '#a855f7';
        cCtx.shadowBlur = idx < linkedIndex ? 14 : 6;
        cCtx.shadowColor = '#fef08a';
        cCtx.fill();

        cCtx.font = 'bold 11px Nunito';
        cCtx.fillStyle = '#ffffff';
        cCtx.fillText(st.id, st.x - 3, st.y - 10);
      });
    }
    drawConstellationScene();

    function checkConstellationTouch(x, y) {
      if (linkedIndex < starsList.length) {
        const target = starsList[linkedIndex];
        const dist = Math.hypot(x - target.x, y - target.y);
        if (dist < 28) {
          linkedIndex++;
          playChime(392 + linkedIndex * 45);
          drawConstellationScene();

          if (linkedIndex === starsList.length && constMsg) {
            constMsg.innerHTML = '✨ <strong>September 9, 2025: The night our fate locked in.</strong> ✨';
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
          }
        }
      }
    }

    constCanvas.addEventListener('pointerdown', (e) => {
      isLinking = true;
      const rect = constCanvas.getBoundingClientRect();
      checkConstellationTouch(e.clientX - rect.left, e.clientY - rect.top);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isLinking) return;
      const rect = constCanvas.getBoundingClientRect();
      checkConstellationTouch(e.clientX - rect.left, e.clientY - rect.top);
    });

    window.addEventListener('pointerup', () => isLinking = false);
  }

  /* 8. TICKET TEAR GESTURE */
  const ticketStub = document.getElementById('ticket-stub');
  const ticketStatus = document.getElementById('ticket-status');

  if (ticketStub) {
    let startY = 0;
    let isDraggingStub = false;

    ticketStub.addEventListener('pointerdown', (e) => {
      isDraggingStub = true;
      startY = e.clientY;
      ticketStub.setPointerCapture(e.pointerId);
    });

    ticketStub.addEventListener('pointermove', (e) => {
      if (!isDraggingStub) return;
      const diffY = e.clientY - startY;
      if (diffY > 0) {
        ticketStub.style.transform = `translateY(${diffY}px) rotate(${diffY * 0.1}deg)`;
      }
      if (diffY > 55) {
        isDraggingStub = false;
        ticketStub.classList.add('torn');
        if (ticketStatus) ticketStatus.innerHTML = '🎫 <strong>Ticket Confirmed! Unlimited visits to my Sanu forever.</strong>';
        playChime(523.25);
        if (navigator.vibrate) navigator.vibrate(120);
      }
    });

    window.addEventListener('pointerup', () => {
      if (isDraggingStub) {
        isDraggingStub = false;
        ticketStub.style.transform = '';
      }
    });
  }

  /* 9. RUNAWAY BLOCK BUTTON RADAR */
  const runawayBtn = document.getElementById('runaway-btn');
  const blockArena = document.getElementById('block-arena');
  const blockResult = document.getElementById('block-result-text');

  if (runawayBtn && blockArena) {
    const teaseMessages = [
      "Nope! Can't block me ever again 😂",
      "Too slow, Sanu! 😜",
      "Nice try! Still stuck with me 💜",
      "Missed again! Hahaha",
      "Not happening in this lifetime! 🙅‍♂️",
      "You're stuck with me forever! ❤️"
    ];
    let teaseIdx = 0;

    function dodge(pointerX, pointerY) {
      const arenaRect = blockArena.getBoundingClientRect();
      const btnRect = runawayBtn.getBoundingClientRect();

      runawayBtn.style.right = 'auto';

      const padding = 12;
      const maxX = arenaRect.width - btnRect.width - padding;
      const maxY = arenaRect.height - btnRect.height - padding;

      let bestX = padding;
      let bestY = 40;
      let maxDist = -1;

      for (let i = 0; i < 5; i++) {
        const testX = Math.floor(Math.random() * (maxX - padding)) + padding;
        const testY = Math.floor(Math.random() * (maxY - 40)) + 40;

        const candCenterX = arenaRect.left + testX + btnRect.width / 2;
        const candCenterY = arenaRect.top + testY + btnRect.height / 2;

        const dist = Math.hypot(candCenterX - pointerX, candCenterY - pointerY);
        if (dist > maxDist) {
          maxDist = dist;
          bestX = testX;
          bestY = testY;
        }
      }

      runawayBtn.style.left = `${bestX}px`;
      runawayBtn.style.top = `${bestY}px`;

      teaseIdx = (teaseIdx + 1) % teaseMessages.length;
      if (blockResult) blockResult.textContent = teaseMessages[teaseIdx];

      playChime(329.63 + Math.random() * 120);
      if (navigator.vibrate) navigator.vibrate(25);
    }

    blockArena.addEventListener('pointermove', (e) => {
      const btnRect = runawayBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      if (dist < 75) {
        dodge(e.clientX, e.clientY);
      }
    });

    ['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
      runawayBtn.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches ? e.touches[0] : e;
        dodge(touch.clientX || 0, touch.clientY || 0);
      }, { passive: false });
    });
  }

  /* 10. BIOMETRIC SCANNER */
  const scannerPad = document.getElementById('scanner-pad');
  const scanBar = document.getElementById('scan-progress');
  const scanStatus = document.getElementById('scan-status');
  const scanResults = document.getElementById('scan-results');
  let scanTimer = null;
  let scanPct = 0;

  if (scannerPad) {
    function startScan(e) {
      e.preventDefault();
      scanPct = 0;
      scannerPad.classList.add('scanning');
      if (scanResults) scanResults.style.display = 'none';
      if (scanStatus) scanStatus.textContent = 'Reading heartbeat & attitude frequency...';
      playChime(329.63);
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);

      scanTimer = setInterval(() => {
        scanPct += 4;
        if (scanBar) scanBar.style.width = `${scanPct}%`;

        if (scanPct % 20 < 4) playChime(261.63 + scanPct * 2);

        if (scanPct >= 100) {
          clearInterval(scanTimer);
          scannerPad.classList.remove('scanning');
          if (scanStatus) scanStatus.textContent = 'Scan Complete! Results verified:';
          if (scanResults) scanResults.style.display = 'flex';
          playChime(659.25);
          if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
        }
      }, 50);
    }

    function cancelScan() {
      if (scanPct < 100) {
        clearInterval(scanTimer);
        scanPct = 0;
        if (scanBar) scanBar.style.width = '0%';
        scannerPad.classList.remove('scanning');
        if (scanStatus) scanStatus.textContent = 'Scan interrupted! Hold flat until complete.';
      }
    }

    scannerPad.addEventListener('pointerdown', startScan);
    window.addEventListener('pointerup', cancelScan);
    window.addEventListener('pointercancel', cancelScan);
  }

});