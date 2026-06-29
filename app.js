// ── LANG PICKER ───────────────────────────────────────────────────────
function toggleLangPicker() {
  document.getElementById('lang-picker')?.classList.toggle('open');
}

// ── SECTION SWITCHING ─────────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('section-' + name);
  if (target) {
    target.classList.add('active');
    // Re-trigger the CSS animation by removing and re-adding
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }
  if (name === 'home')   typeLoop();
  if (name === 'resume') setTimeout(animateTimeline, 150);
}

// ── MOBILE MENU ───────────────────────────────────────────────────────
function closeMobile() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('mobile-menu')?.classList.remove('open');
}

// ── TIMELINE ANIMATION ────────────────────────────────────────────────
function animateTimeline() {
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 160);
  });
}

// ── TYPING EFFECT ─────────────────────────────────────────────────────
const phrases = [
  'CS student & help desk technician.',
  'Building cool stuff with code.',
  'Passionate about cybersecurity.',
  'Always learning, always shipping.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const el = document.getElementById('typed-sub');
  if (!el) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 72);
}

// ── COOKIE BANNER ─────────────────────────────────────────────────────
function acceptCookies() {
  localStorage.setItem('cookies_accepted', 'true');
  const b = document.getElementById('cookie-banner');
  if (b) { b.classList.add('hidden'); setTimeout(() => b.remove(), 400); }
}
function initCookieBanner() {
  const b = document.getElementById('cookie-banner');
  if (!b) return;
  if (!localStorage.getItem('cookies_accepted')) {
    b.style.display = 'flex';
  } else {
    b.remove();
  }
}

// ── STARFIELD CANVAS ──────────────────────────────────────────────────
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shootingStars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.12 + 0.02,
      opacity: Math.random() * 0.8 + 0.1,
      twinkleRate: Math.random() * 0.015 + 0.004,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      // tiny color tint — most stars white, a few slightly blue/cyan
      hue: Math.random() > 0.85 ? `rgba(180,220,255,` : `rgba(255,255,255,`,
    };
  }

  function makeShootingStar() {
    const angle = Math.PI / 5 + (Math.random() * Math.PI / 6);
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 8 + 6,
      opacity: 1,
      angle,
      dx: Math.cos(angle),
      dy: Math.sin(angle),
      life: 1, // 1 → 0
    };
  }

  function buildStars() {
    stars = Array.from({ length: 220 }, makeStar);
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Draw regular stars
    stars.forEach(s => {
      // Twinkle
      s.opacity += s.twinkleRate * s.twinkleDir;
      if (s.opacity > 0.95 || s.opacity < 0.05) s.twinkleDir *= -1;

      // Slow upward drift
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue + s.opacity + ')';
      ctx.fill();

      // Tiny glow on bigger stars
      if (s.r > 1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.hue + (s.opacity * 0.12) + ')';
        ctx.fill();
      }
    });

    // Draw shooting stars
    shootingStars.forEach((ss, i) => {
      ss.life -= 0.025;
      ss.x += ss.dx * ss.speed;
      ss.y += ss.dy * ss.speed;

      if (ss.life <= 0) { shootingStars.splice(i, 1); return; }

      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - ss.dx * ss.len,
        ss.y - ss.dy * ss.len
      );
      grad.addColorStop(0, `rgba(0,212,255,${ss.life * 0.9})`);
      grad.addColorStop(0.4, `rgba(255,255,255,${ss.life * 0.5})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.dx * ss.len, ss.y - ss.dy * ss.len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(drawFrame);
  }

  // Randomly spawn shooting stars
  function spawnShootingStars() {
    if (Math.random() < 0.3) { // 30% chance each interval
      shootingStars.push(makeShootingStar());
    }
    setTimeout(spawnShootingStars, Math.random() * 4000 + 2000);
  }

  resize();
  buildStars();
  drawFrame();
  spawnShootingStars();
  window.addEventListener('resize', () => { resize(); buildStars(); });
}

// ── CURSOR GLOW ───────────────────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  document.addEventListener('mouseenter', () => cursor.classList.add('active'));

  const hoverEls = 'button, a, .proj-card, .stat-card, .chip, .pill, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) cursor.classList.add('expanded');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) cursor.classList.remove('expanded');
  });
}

// ── ORRERY — parametric ellipse animation ────────────────────────────
// Each planet's position is computed every frame with:
//   x = cx + rx * cos(angle)
//   y = cy + ry * sin(angle)
// This guarantees the planet is always exactly on its ellipse ring.
// Depth: sin(angle) < 0 means planet is at the "back" (behind the star),
//        sin(angle) > 0 means it's at the "front" (in front of the star).
function initOrrery() {
  const container = document.getElementById('orrery');
  if (!container) return;

  const jupiter = document.getElementById('orb-jupiter');
  const mars    = document.getElementById('orb-mars');
  const earth   = document.getElementById('orb-earth');
  if (!jupiter || !mars || !earth) return;

  // Orbit definitions.
  // rxRatio = (ring CSS width  / 2) / orrery CSS width   e.g. 90/420  = 0.214
  // ryRatio = (ring CSS height / 2) / orrery CSS height  e.g. 32/260  = 0.123
  // CSS rings: or1 180×64, or2 296×106, or3 410×147 — orrery 420×260
  const orbits = [
    { el: jupiter, rxRatio: 0.214, ryRatio: 0.123, period: 7000,  phase: 0.5 },
    { el: mars,    rxRatio: 0.352, ryRatio: 0.204, period: 17000, phase: 2.1 },
    { el: earth,   rxRatio: 0.488, ryRatio: 0.283, period: 30000, phase: 4.4 },
  ];

  function tick(ts) {
    const W  = container.offsetWidth;
    const H  = container.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;

    orbits.forEach(o => {
      const rx = W * o.rxRatio;
      const ry = H * o.ryRatio;
      const angle = (ts / o.period) * Math.PI * 2 + o.phase;

      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);

      o.el.style.left = x + 'px';
      o.el.style.top  = y + 'px';

      // Depth effect: behind star (top of ellipse) = sin < 0 → z-index 1, scale down
      //               in front  (bottom)           = sin > 0 → z-index 3, full scale
      const sinA   = Math.sin(angle);
      const depth  = (sinA + 1) / 2;           // 0 (back) → 1 (front)
      const scale  = 0.82 + depth * 0.18;      // 0.82 → 1.0
      const zIndex = sinA < 0 ? 1 : 3;

      o.el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      o.el.style.zIndex    = zIndex;
      o.el.style.opacity   = (0.75 + depth * 0.25).toFixed(3);
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ── SUBTLE ORRERY PARALLAX on mouse move ─────────────────────────────
function initOrreryTilt() {
  const orrery = document.querySelector('.orrery');
  if (!orrery) return;
  document.addEventListener('mousemove', e => {
    const xPct = (e.clientX / window.innerWidth  - 0.5);
    const yPct = (e.clientY / window.innerHeight - 0.5);
    orrery.style.transform = `translate(${xPct * -10}px, ${yPct * -6}px)`;
  });
}

// ── NAV SCROLL EFFECT ─────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 10
      ? 'rgba(2,2,9,0.97)'
      : 'rgba(2,2,9,0.7)';
  });
}

// ── HAMBURGER ─────────────────────────────────────────────────────────
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
}

// ── LANG PICKER CLOSE OUTSIDE ─────────────────────────────────────────
function initLangPicker() {
  document.addEventListener('click', e => {
    const picker = document.getElementById('lang-picker');
    const btn    = document.getElementById('download-btn');
    if (picker && !picker.contains(e.target) && e.target !== btn) {
      picker.classList.remove('open');
    }
  });
  document.querySelectorAll('.lang-option').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => document.getElementById('lang-picker')?.classList.remove('open'), 300);
    });
  });
}

// ── CARD TILT EFFECT (3D hover on project cards) ─────────────────────
// Each card tilts slightly toward the mouse for a premium feel
function initCardTilt() {
  document.querySelectorAll('.proj-card:not(.proj-card-soon)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── INTERSECTION OBSERVER for stat-cards (fade in when visible) ───────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity .5s ${i * 0.1}s ease, transform .5s ${i * 0.1}s ease`;
    obs.observe(el);
  });
}

// ── INIT ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initCursor();
  initOrrery();
  initOrreryTilt();
  initNavScroll();
  initHamburger();
  initLangPicker();
  initCardTilt();
  initScrollReveal();

  // Start on home
  const goTo = sessionStorage.getItem('goToSection');
  if (goTo) { sessionStorage.removeItem('goToSection'); showSection(goTo); }
  else       { showSection('home'); }

  initCookieBanner();
  typeLoop();
});
