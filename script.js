/* ==========================================================================
   MERO MAYA - SPECIAL ANNIVERSARY INTERACTIVE SCRIPT
   - Purple Stardust & Floating Butterfly Canvas
   - Touch Sparkle & Purple Heart Trails
   - Pure Web-Audio Celestial Chimes (Zero external audio files needed)
   - Live Anniversary Countdown (From September 9, 2025)
   - Rain-Defying Paper Rose Revival Animation
   - Scratch-Off Love Card (Mobile Touch Supported)
   - Purple Memory Love Jar
   - 3D Wax Envelope & Hold-to-Hug Haptic Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
// Add right near the top of script.js
function makeCanvasCrisp(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
  /* --------------------------------------------------------------------------
     1. FLOATING PURPLE STARDUST & GLOWING MOTHS
     -------------------------------------------------------------------------- */
  const starCanvas = document.getElementById('stars-canvas');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];

  function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeStarCanvas);
  resizeStarCanvas();

  for (let i = 0; i < 45; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      r: Math.random() * 2 + 0.6,
      speedY: -(Math.random() * 0.35 + 0.1),
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


  /* --------------------------------------------------------------------------
     2. CONTINUOUS TOUCH TRAIL (PURPLE HEARTS & BUTTERFLIES)
     -------------------------------------------------------------------------- */
  const trailCanvas = document.getElementById('trail-canvas');
  const trailCtx = trailCanvas.getContext('2d');
  let trailParticles = [];

  function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeTrailCanvas);
  resizeTrailCanvas();

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
    draw() {
      if (this.alpha <= 0) return;
      trailCtx.save();
      trailCtx.translate(this.x, this.y);
      trailCtx.rotate(this.rotation);
      trailCtx.globalAlpha = this.alpha;
      trailCtx.fillStyle = this.color;
      trailCtx.shadowBlur = 10;
      trailCtx.shadowColor = '#9333ea';

      // Draw mini purple heart
      const s = this.size / 18;
      trailCtx.beginPath();
      trailCtx.moveTo(0, 0);
      trailCtx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 18 * s);
      trailCtx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      trailCtx.fill();

      trailCtx.restore();
    }
  }

  function spawnParticles(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      trailParticles.push(new PurpleParticle(x, y));
    }
  }

  window.addEventListener('pointermove', (e) => {
    spawnParticles(e.clientX, e.clientY, 2);
  });

  window.addEventListener('pointerdown', (e) => {
    spawnParticles(e.clientX, e.clientY, 8);
    playChime();
  });

  function renderTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      trailParticles[i].update();
      trailParticles[i].draw();
      if (trailParticles[i].alpha <= 0) {
        trailParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderTrail);
  }
  renderTrail();


  /* --------------------------------------------------------------------------
     3. AMBIENT CELESTIAL SOUND SYNTHESIZER
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isMusicPlaying = false;
  let tuneInterval = null;
  const musicBtn = document.getElementById('music-btn');
  const chordNotes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25]; // Dreamy Pentatonic Scale

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = null) {
    if (!isMusicPlaying && !freq) return;
    initAudio();

    const note = freq || chordNotes[Math.floor(Math.random() * chordNotes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    // Warm envelope curve
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.4);
  }

  musicBtn.addEventListener('click', () => {
    initAudio();
    isMusicPlaying = !isMusicPlaying;
    musicBtn.classList.toggle('playing', isMusicPlaying);
    musicBtn.querySelector('.music-text').textContent = isMusicPlaying ? 'Melody Playing 💜' : 'Play Melody 💜';

    if (isMusicPlaying) {
      playChime(523.25);
      tuneInterval = setInterval(() => {
        playChime();
      }, 1500);
    } else {
      clearInterval(tuneInterval);
    }
  });


  /* --------------------------------------------------------------------------
     4. LIVE ANNIVERSARY STOPWATCH (START: SEPTEMBER 9, 2025)
     -------------------------------------------------------------------------- */
  // September 9, 2025, 00:00:00 (Month index 8 = September)
  const ANNIVERSARY_DATE = new Date(2025, 8, 9, 0, 0, 0);

  function updateStopwatch() {
    const now = new Date();
    const diff = now - ANNIVERSARY_DATE;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      document.getElementById('d-val').textContent = String(days).padStart(2, '0');
      document.getElementById('h-val').textContent = String(hours).padStart(2, '0');
      document.getElementById('m-val').textContent = String(mins).padStart(2, '0');
      document.getElementById('s-val').textContent = String(secs).padStart(2, '0');
    }
  }
  setInterval(updateStopwatch, 1000);
  updateStopwatch();


  /* --------------------------------------------------------------------------
     5. MEMORY STORYBOARD TAP
     -------------------------------------------------------------------------- */
  window.tapStory = function(card) {
    card.style.borderColor = '#c084fc';
    card.style.boxShadow = '0 0 25px rgba(192, 132, 252, 0.6)';
    playChime(440);
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 900);
  };


  /* --------------------------------------------------------------------------
     6. THE IMMORTAL PAPER ROSE REVIVAL (RAIN CAN NEVER DESTROY THIS)
     -------------------------------------------------------------------------- */
  let roseBloomed = false;
  window.reviveRose = function() {
    const roseBox = document.querySelector('.rose-interactive-box');
    const roseStatus = document.getElementById('rose-status');
    const roseGlyph = roseBox.querySelector('.rose-glyph');

    roseBloomed = !roseBloomed;
    if (roseBloomed) {
      roseBox.classList.add('bloomed');
      roseGlyph.textContent = '🌹';
      roseGlyph.style.filter = 'drop-shadow(0 0 30px #c084fc)';
      roseStatus.innerHTML = '✨ <strong>Our rose is immortal now. No rain will ever ruin it.</strong> ✨';
      playChime(523.25);
      setTimeout(() => playChime(659.25), 200);

      // Heart burst
      const rect = roseBox.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 25; i++) {
        trailParticles.push(new PurpleParticle(cx, cy));
      }
    } else {
      roseBox.classList.remove('bloomed');
      roseGlyph.textContent = '🥀';
      roseGlyph.style.filter = '';
      roseStatus.textContent = 'Tap the rose to make it bloom forever 💜';
    }
  };


  /* --------------------------------------------------------------------------
     7. PHOTO FRAME GLOW
     -------------------------------------------------------------------------- */
  window.glowFrame = function(frame) {
    frame.style.boxShadow = '0 0 30px rgba(192, 132, 252, 0.85)';
    playChime(587.33);
    setTimeout(() => {
      frame.style.boxShadow = '';
    }, 1000);
  };


  /* --------------------------------------------------------------------------
     8. PURPLE LOVE JAR NOTES
     -------------------------------------------------------------------------- */
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

    noteIndex = (noteIndex + 1) % jarNotes.length;
    noteBox.style.transform = 'scale(0.85)';
    setTimeout(() => {
      noteText.textContent = `"${jarNotes[noteIndex]}"`;
      noteBox.style.transform = 'scale(1)';
      playChime(523.25);
    }, 150);
  };


  /* --------------------------------------------------------------------------
     9. SCRATCH-OFF CARD (TOUCH & MOUSE SUPPORTED)
     -------------------------------------------------------------------------- */
  const scratchCanvas = document.getElementById('scratch-pad');
  const scratchCtx = scratchCanvas.getContext('2d');
  let isScratching = false;

  function initScratchCard() {
    scratchCtx.fillStyle = '#6b21a8';
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Decorative text on scratch layer
    scratchCtx.fillStyle = '#fef08a';
    scratchCtx.font = 'bold 15px Nunito';
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


  /* --------------------------------------------------------------------------
     10. VINTAGE PURPLE LETTER
     -------------------------------------------------------------------------- */
  window.openEnvelope = function() {
    const env = document.getElementById('env-wrapper');
    const status = document.getElementById('env-status');
    env.classList.toggle('open');

    if (env.classList.contains('open')) {
      status.textContent = 'Touch again to close letter';
      playChime(392.00);
      setTimeout(() => playChime(523.25), 250);
    } else {
      status.textContent = 'Tap the purple seal to open';
    }
  };


  /* --------------------------------------------------------------------------
     11. HOLD-TO-HUG HAPTIC SENSORY ENGINE
     -------------------------------------------------------------------------- */
  const hugBtn = document.getElementById('hug-btn');
  const hugFill = document.getElementById('hug-fill');
  const hugTxt = document.getElementById('hug-txt');
  let hugInterval = null;
  let chargeProgress = 0;

  function handleHugStart(e) {
    e.preventDefault();
    chargeProgress = 0;
    hugTxt.textContent = 'Sending warm hugs across the border... Don\'t let go! 🤗';
    hugBtn.style.transform = 'scale(0.9)';

    // Phone vibration if supported
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

        // Burst of celebration hearts
        const rect = hugBtn.getBoundingClientRect();
        for (let i = 0; i < 28; i++) {
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
/* --------------------------------------------------------------------------
     NEW 1: DUAL-FINGER BORDER TOUCH ENGINE
     -------------------------------------------------------------------------- */
  const padIndia = document.getElementById('pad-india');
  const padNepal = document.getElementById('pad-nepal');
  const bridgeCanvas = document.getElementById('bridge-canvas');
  const bridgeStatus = document.getElementById('bridge-status');
  
  if (padIndia && padNepal && bridgeCanvas) {
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

      // Draw glowing electric zig-zag arc
      bridgeCtx.beginPath();
      bridgeCtx.moveTo(x1, y1);
      const segments = 10;
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


  /* --------------------------------------------------------------------------
     NEW 2: SEPTEMBER 9 CONSTELLATION LINKER
     -------------------------------------------------------------------------- */
  const constCanvas = document.getElementById('constellation-canvas');
  if (constCanvas) {
    const cCtx = constCanvas.getContext('2d');
    const constMsg = document.getElementById('constellation-msg');

    // 5 Stars forming a gentle arc
    const starsList = [
      { x: 50, y: 160, id: 1 },
      { x: 90, y: 80, id: 2 },
      { x: 150, y: 50, id: 3 },
      { x: 210, y: 80, id: 4 },
      { x: 250, y: 160, id: 5 }
    ];
    let linkedIndex = 0;
    let isLinking = false;

    function drawConstellationScene() {
      cCtx.clearRect(0, 0, constCanvas.width, constCanvas.height);

      // Draw connecting lines
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

      // Draw Star points
      starsList.forEach((st, idx) => {
        cCtx.beginPath();
        cCtx.arc(st.x, st.y, idx < linkedIndex ? 7 : 5, 0, Math.PI * 2);
        cCtx.fillStyle = idx < linkedIndex ? '#fef08a' : '#a855f7';
        cCtx.shadowBlur = idx < linkedIndex ? 14 : 6;
        cCtx.shadowColor = '#fef08a';
        cCtx.fill();

        // Label numbers
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
        if (dist < 26) {
          linkedIndex++;
          playChime(392 + linkedIndex * 45);
          drawConstellationScene();

          if (linkedIndex === starsList.length) {
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


  /* --------------------------------------------------------------------------
     NEW 3: TICKET TEAR GESTURE
     -------------------------------------------------------------------------- */
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

      // Tear threshold
      if (diffY > 60) {
        isDraggingStub = false;
        ticketStub.classList.add('torn');
        ticketStatus.innerHTML = '🎫 <strong>Ticket Confirmed! Unlimited visits to my Sanu forever.</strong>';
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
  /* --------------------------------------------------------------------------
     FUN 1: RUNAWAY "BLOCK ME" BUTTON LOGIC
     -------------------------------------------------------------------------- */
  const runawayBtn = document.getElementById('runaway-btn');
  const blockArena = document.getElementById('block-arena');
  const blockResult = document.getElementById('block-result-text');

  if (runawayBtn && blockArena) {
    function dodgeCursor() {
      const arenaRect = blockArena.getBoundingClientRect();
      const btnRect = runawayBtn.getBoundingClientRect();

      // Random position inside the arena box
      const maxX = arenaRect.width - btnRect.width - 25;
      const maxY = arenaRect.height - btnRect.height - 25;

      const randomX = Math.max(15, Math.floor(Math.random() * maxX));
      const randomY = Math.max(50, Math.floor(Math.random() * maxY));

      runawayBtn.style.left = `${randomX}px`;
      runawayBtn.style.top = `${randomY}px`;

      blockResult.textContent = "Nope! Can't block me ever again 😂";
      playChime(329.63);
      if (navigator.vibrate) navigator.vibrate(20);
    }

    // Dodges when her finger gets anywhere near it
    runawayBtn.addEventListener('pointerenter', dodgeCursor);
    runawayBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dodgeCursor();
    });
  }

  window.acceptLove = function() {
    blockResult.textContent = "Good choice! You're stuck with me for life, Sanu 💜";
    playChime(523.25);
    setTimeout(() => playChime(659.25), 180);
    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  };


  /* --------------------------------------------------------------------------
     FUN 2: DEVCHULI LEECH FLICK LOGIC
     -------------------------------------------------------------------------- */
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


  /* --------------------------------------------------------------------------
     FUN 3: RIGGED "WHO LOVES WHO MORE" BATTLE
     -------------------------------------------------------------------------- */
  let battleTaps = 0;
  const maxTaps = 12;

  window.tapBattle = function() {
    battleTaps++;
    const progress = Math.min((battleTaps / maxTaps) * 100, 100);
    
    document.getElementById('battle-fill').style.width = `${progress}%`;
    document.getElementById('tap-score').textContent = Math.floor(progress);
    playChime(261.63 + battleTaps * 25);

    if (battleTaps >= maxTaps) {
      const verdict = document.getElementById('battle-verdict');
      verdict.innerHTML = "⚠️ <strong>SYSTEM ERROR:</strong> No matter how fast you tap, I still love you 100x more. You lose! Now give me a kiss 💋";
      playChime(523.25);
      if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 120]);

      // Reset button
      const btn = document.getElementById('battle-btn');
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.textContent = 'He Won! ❤️';
    }
  };
  /* --------------------------------------------------------------------------
     GAME 1: BIOMETRIC SCANNER ENGINE
     -------------------------------------------------------------------------- */
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
      scanResults.style.display = 'none';
      scanStatus.textContent = 'Reading heartbeat & attitude frequency...';
      playChime(329.63);
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);

      scanTimer = setInterval(() => {
        scanPct += 4;
        scanBar.style.width = `${scanPct}%`;

        if (scanPct % 20 < 4) playChime(261.63 + scanPct * 2);

        if (scanPct >= 100) {
          clearInterval(scanTimer);
          scannerPad.classList.remove('scanning');
          scanStatus.textContent = 'Scan Complete! Results verified:';
          scanResults.style.display = 'flex';
          playChime(659.25);
          if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
        }
      }, 50);
    }

    function cancelScan() {
      if (scanPct < 100) {
        clearInterval(scanTimer);
        scanPct = 0;
        scanBar.style.width = '0%';
        scannerPad.classList.remove('scanning');
        scanStatus.textContent = 'Scan interrupted! Hold flat until complete.';
      }
    }

    scannerPad.addEventListener('pointerdown', startScan);
    window.addEventListener('pointerup', cancelScan);
    window.addEventListener('pointercancel', cancelScan);
  }


/* --------------------------------------------------------------------------
     GAME 2: ROULETTE WHEEL LOGIC (Dead-Center Alignment)
     -------------------------------------------------------------------------- */
  let currentRotation = 0;
  let isWheelSpinning = false;

  const wheelOptions = [
    "Order food together & eat on FaceTime 🍜",      // Slice 0: Eat Food
    "Send 5 cute kisses to the camera right now 💋", // Slice 1: Send Kiss
    "You have to sing 15 seconds of any song 🎤",    // Slice 2: Sing Song
    "Make the funniest ugly face screenshot 🤪",     // Slice 3: Make Face
    "Tell me a secret you haven't told me yet 🤫",   // Slice 4: Tell Secret
    "Pick a movie for our next virtual date night 🎬"// Slice 5: Movie Date
  ];

  window.spinDateWheel = function() {
    if (isWheelSpinning) return;
    isWheelSpinning = true;

    const wheel = document.getElementById('roulette-wheel');
    const resultText = document.getElementById('wheel-result');
    resultText.textContent = "Selecting our activity...";

    // 1. Choose the target slice (0 to 5)
    const winningIndex = Math.floor(Math.random() * wheelOptions.length);

    // 2. Exact angle to place slice 'winningIndex' dead center under pointer (0°)
    const targetAngle = (360 - winningIndex * 60) % 360;

    // 3. Compute continuous forward spin (5 full rotations + difference)
    const currentMod = currentRotation % 360;
    let delta = (targetAngle - currentMod + 360) % 360;
    if (delta === 0) delta = 360; // Keep spinning if it lands on the same slice

    currentRotation += (360 * 5) + delta;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    playChime(440);
    if (navigator.vibrate) navigator.vibrate(50);

    // 4. Reveal matching result exactly when it stops
    setTimeout(() => {
      isWheelSpinning = false;
      resultText.textContent = wheelOptions[winningIndex];
      playChime(659.25);
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    }, 3650);
  };


  /* --------------------------------------------------------------------------
     GAME 3: CATCH THE FLYING KISSES ARCADE
     -------------------------------------------------------------------------- */
  let kissScore = 0;
  let arcadeInterval = null;
  const arcadeField = document.getElementById('arcade-field');
  const scoreBoard = document.getElementById('kiss-score');
  const winBanner = document.getElementById('arcade-win');
  const idleText = document.getElementById('arcade-idle');
  const startBtn = document.getElementById('start-kiss-btn');

  window.startKissArcade = function() {
    kissScore = 0;
    scoreBoard.textContent = '0';
    winBanner.style.display = 'none';
    if (idleText) idleText.style.display = 'none';
    startBtn.style.display = 'none';

    // Spawn 1 kiss every 700ms
    arcadeInterval = setInterval(() => {
      if (kissScore >= 8) {
        clearInterval(arcadeInterval);
        return;
      }
      spawnKissTarget();
    }, 700);
  };

  function spawnKissTarget() {
    if (!arcadeField) return;
    const kiss = document.createElement('div');
    kiss.className = 'arcade-kiss-target';
    kiss.textContent = Math.random() > 0.3 ? '💋' : '💜';
    
    // Random horizontal position inside field
    const fieldW = arcadeField.offsetWidth - 40;
    const randomLeft = Math.floor(Math.random() * fieldW) + 10;
    kiss.style.left = `${randomLeft}px`;

    kiss.addEventListener('pointerdown', () => {
      kissScore++;
      scoreBoard.textContent = kissScore;
      playChime(392 + kissScore * 35);
      if (navigator.vibrate) navigator.vibrate(25);
      kiss.remove();

      if (kissScore >= 8) {
        clearInterval(arcadeInterval);
        // Clear remaining targets
        document.querySelectorAll('.arcade-kiss-target').forEach(el => el.remove());
        winBanner.style.display = 'block';
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Play Again ↻';
        playChime(659.25);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 150]);
      }
    });

    arcadeField.appendChild(kiss);

    // Auto remove after animation completes
    setTimeout(() => {
      if (kiss.parentElement) kiss.remove();
    }, 2800);
  }
  /* --------------------------------------------------------------------------
     MIDNIGHT SPICY DARES ENGINE (10 Dares Deck)
     -------------------------------------------------------------------------- */
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

    currentDareIndex = (currentDareIndex + 1) % spicyDares.length;

    // Card flip animation
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
});