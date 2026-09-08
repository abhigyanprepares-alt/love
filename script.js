/* ==========================================================================
   ROMANTIC MASTERPIECE SCRIPT
   - Scroll-Driven Sacred Geometry Rose & Petals
   - Dreamy Web-Audio Synthesizer (No external mp3 needed)
   - Multi-Touch Floating Heart Particles
   - Live Relationship Stopwatch
   - Haptic Pulse Charge Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. BACKGROUND STARDUST & FLOATING FIREFLIES CANVAS
     -------------------------------------------------------------------------- */
  const starCanvas = document.getElementById('starfield-canvas');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 55;

  function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeStarCanvas);
  resizeStarCanvas();

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * starCanvas.width;
      this.y = Math.random() * starCanvas.height;
      this.size = Math.random() * 2 + 0.6;
      this.speedY = -(Math.random() * 0.35 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.color = Math.random() > 0.4 ? '#ff9bb2' : '#fcecd7';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < 0) this.y = starCanvas.height;
      if (this.x < 0) this.x = starCanvas.width;
      if (this.x > starCanvas.width) this.x = 0;
    }
    draw() {
      starCtx.beginPath();
      starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      starCtx.fillStyle = this.color;
      starCtx.globalAlpha = this.opacity;
      starCtx.shadowBlur = 8;
      starCtx.shadowColor = '#ff4b72';
      starCtx.fill();
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

  function animateStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (let s of stars) {
      s.update();
      s.draw();
    }
    requestAnimationFrame(animateStars);
  }
  animateStars();


  /* --------------------------------------------------------------------------
     2. TOUCH BURST OF HEARTS & SPARKS (Every tap on mobile)
     -------------------------------------------------------------------------- */
  const touchCanvas = document.getElementById('touch-canvas');
  const touchCtx = touchCanvas.getContext('2d');
  let touchParticles = [];

  function resizeTouchCanvas() {
    touchCanvas.width = window.innerWidth;
    touchCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeTouchCanvas);
  resizeTouchCanvas();

  class HeartParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 14 + 10;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 3.5 + 1.2;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 1.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.rotation += this.rotSpeed;
    }
    draw() {
      if (this.alpha <= 0) return;
      touchCtx.save();
      touchCtx.translate(this.x, this.y);
      touchCtx.rotate(this.rotation);
      touchCtx.globalAlpha = this.alpha;
      touchCtx.fillStyle = '#ff2b66';
      touchCtx.shadowBlur = 10;
      touchCtx.shadowColor = '#ff6088';

      // Draw SVG Heart path
      const s = this.size / 20;
      touchCtx.beginPath();
      touchCtx.moveTo(0, 0);
      touchCtx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      touchCtx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      touchCtx.fill();
      touchCtx.restore();
    }
  }

  function spawnHearts(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      touchParticles.push(new HeartParticle(x, y));
    }
    playDreamChime(); // Gentle sound cue
  }

  window.addEventListener('pointerdown', (e) => {
    spawnHearts(e.clientX, e.clientY, 6);
  });

  function renderTouchParticles() {
    touchCtx.clearRect(0, 0, touchCanvas.width, touchCanvas.height);
    for (let i = touchParticles.length - 1; i >= 0; i--) {
      touchParticles[i].update();
      touchParticles[i].draw();
      if (touchParticles[i].alpha <= 0) {
        touchParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderTouchParticles);
  }
  renderTouchParticles();


  /* --------------------------------------------------------------------------
     3. WEB AUDIO DREAM CHIMES (Pure synthesized celestial harp notes)
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isAudioActive = false;
  const audioBtn = document.getElementById('audio-toggle');

  const pentatonicFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playDreamChime(freq = null) {
    if (!isAudioActive) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const note = freq || pentatonicFrequencies[Math.floor(Math.random() * pentatonicFrequencies.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.6);
  }

  audioBtn.addEventListener('click', () => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isAudioActive = !isAudioActive;
    audioBtn.classList.toggle('playing', isAudioActive);
    audioBtn.querySelector('.music-text').textContent = isAudioActive ? 'Playing Music' : 'Ambient Chimes';
    if (isAudioActive) playDreamChime(523.25);
  });


  /* --------------------------------------------------------------------------
     4. SCROLL-DRIVEN BLOOMING SACRED ROSE ENGINE
     -------------------------------------------------------------------------- */
  const flowerCanvas = document.getElementById('flower-scroll-canvas');
  const flowerCtx = flowerCanvas.getContext('2d');
  const bloomPercentText = document.getElementById('bloom-percent');
  const bloomSection = document.querySelector('.scroll-bloom-section');

  function drawBloomingRose(progress) {
    const w = flowerCanvas.width;
    const h = flowerCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    flowerCtx.clearRect(0, 0, w, h);

    // Golden Ratio Spiraling Petals
    const maxPetals = 45;
    const petalsToDraw = Math.floor(progress * maxPetals);
    const goldenAngle = 137.5 * (Math.PI / 180);

    flowerCtx.save();
    flowerCtx.translate(cx, cy);

    for (let i = 0; i < petalsToDraw; i++) {
      const radius = Math.pow(i / maxPetals, 0.7) * (w * 0.38) * progress;
      const theta = i * goldenAngle;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const petalSize = (i / maxPetals) * 26 + 10;

      flowerCtx.save();
      flowerCtx.translate(x, y);
      flowerCtx.rotate(theta + Math.PI / 2);

      // Color shifts from golden heart to crimson velvet
      const gradient = flowerCtx.createRadialGradient(0, 0, 1, 0, 0, petalSize);
      if (i < 8) {
        gradient.addColorStop(0, '#ffe8b3');
        gradient.addColorStop(1, '#ff3b68');
      } else {
        gradient.addColorStop(0, '#ff4b72');
        gradient.addColorStop(0.7, '#c2003c');
        gradient.addColorStop(1, '#66001d');
      }

      flowerCtx.fillStyle = gradient;
      flowerCtx.shadowColor = '#ff2b5f';
      flowerCtx.shadowBlur = 12 * progress;

      // Draw soft organic curved petal
      flowerCtx.beginPath();
      flowerCtx.moveTo(0, 0);
      flowerCtx.quadraticCurveTo(-petalSize * 0.8, -petalSize * 0.6, 0, -petalSize * 1.3);
      flowerCtx.quadraticCurveTo(petalSize * 0.8, -petalSize * 0.6, 0, 0);
      flowerCtx.fill();

      flowerCtx.restore();
    }

    flowerCtx.restore();
  }

  function handleFlowerScroll() {
    const rect = bloomSection.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Calculate how far section is visible from 0 to 1
    let scrollProgress = (windowH - rect.top) / (windowH + rect.height * 0.6);
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));

    drawBloomingRose(scrollProgress);
    bloomPercentText.textContent = `${Math.floor(scrollProgress * 100)}% BLOOM`;
  }

  window.addEventListener('scroll', handleFlowerScroll, { passive: true });
  drawBloomingRose(0.15); // Initial seed bud


  /* --------------------------------------------------------------------------
     5. LIVE LOVE STOPWATCH
     -------------------------------------------------------------------------- */
  // CHANGE THIS DATE TO YOUR SPECIAL ANNIVERSARY / FIRST DATE!
  // Format: (Year, MonthIndex 0-11, Day, Hour, Min)
  const START_DATE = new Date(2023, 0, 1, 0, 0, 0); 

  function updateLoveCounter() {
    const now = new Date();
    const diffMs = now - START_DATE;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diffMs / (1000 * 60)) % 60);
    const secs = Math.floor((diffMs / 1000) % 60);

    document.getElementById('days-val').textContent = String(days).padStart(2, '0');
    document.getElementById('hours-val').textContent = String(hours).padStart(2, '0');
    document.getElementById('mins-val').textContent = String(mins).padStart(2, '0');
    document.getElementById('secs-val').textContent = String(secs).padStart(2, '0');
  }
  setInterval(updateLoveCounter, 1000);
  updateLoveCounter();


  /* --------------------------------------------------------------------------
     6. INTERACTIVE 3D LOVE LETTER
     -------------------------------------------------------------------------- */
  window.toggleEnvelope = function() {
    const envelope = document.getElementById('envelope-wrapper');
    const statusText = document.getElementById('letter-status-text');
    envelope.classList.toggle('is-open');

    if (envelope.classList.contains('is-open')) {
      statusText.textContent = 'Read my words, touch again to tuck away';
      playDreamChime(440);
      setTimeout(() => playDreamChime(659.25), 250);
    } else {
      statusText.textContent = 'Tap seal to open letter';
    }
  };


  /* --------------------------------------------------------------------------
     7. CARD FLIP RIPPLE
     -------------------------------------------------------------------------- */
  window.flipCard = function(card) {
    card.style.borderColor = '#ff4b72';
    card.style.boxShadow = '0 0 25px rgba(255, 75, 114, 0.4)';
    playDreamChime(587.33);
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 1200);
  };


  /* --------------------------------------------------------------------------
     8. HOLD-TO-PULSE LOVE ENGINE (Sensory Touch)
     -------------------------------------------------------------------------- */
  const pulseBtn = document.getElementById('heart-pulse-btn');
  const pulseFill = document.getElementById('pulse-fill');
  const pulseMsg = document.getElementById('pulse-message');
  let holdInterval = null;
  let charge = 0;

  function startHold(e) {
    e.preventDefault();
    charge = 0;
    pulseMsg.textContent = 'Transmitting your heartbeat to mine...';
    pulseBtn.style.transform = 'scale(0.9)';

    holdInterval = setInterval(() => {
      charge += 2.5;
      pulseFill.style.width = `${Math.min(charge, 100)}%`;

      if (charge % 20 < 3) {
        playDreamChime(329.63 + charge * 2);
      }

      if (charge >= 100) {
        clearInterval(holdInterval);
        pulseMsg.textContent = 'Received! My heart has never beaten louder for you. ❤️';
        pulseBtn.style.transform = 'scale(1.25)';
        
        // Massive celebratory firework burst of hearts
        const rect = pulseBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 35; i++) {
          touchParticles.push(new HeartParticle(cx, cy));
        }
      }
    }, 40);
  }

  function endHold() {
    if (charge < 100) {
      clearInterval(holdInterval);
      charge = 0;
      pulseFill.style.width = '0%';
      pulseMsg.textContent = 'Hold down a little longer...';
      pulseBtn.style.transform = 'scale(1)';
    }
  }

  pulseBtn.addEventListener('pointerdown', startHold);
  window.addEventListener('pointerup', endHold);
  window.addEventListener('pointercancel', endHold);

});