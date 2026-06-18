// ── RESUME LANGUAGE PICKER ──
// Defined first so onclick="toggleLangPicker()" always finds it
function toggleLangPicker() {
    const picker = document.getElementById('lang-picker');
    if (picker) picker.classList.toggle('open');
}

// ── SECTION SWITCHING ──
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + name);
    if (target) {
        target.classList.add('active');
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = '';
    }
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.style.color = '';
        b.style.background = '';
    });
    if (name === 'home') typeLoop();
    if (name === 'resume') setTimeout(animateTimeline, 150);
}

// ── HAMBURGER ──
function closeMobile() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
}

// ── TIMELINE ANIMATION ──
function animateTimeline() {
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 150);
    });
}

// ── TYPED SUBTITLE ──
const phrases = [
    'CS student & help desk technician.',
    'Building cool stuff with code.',
    'Passionate about cybersecurity.',
    'Always learning, always shipping.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
    const typedEl = document.getElementById('typed-sub');
    if (!typedEl) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2200);
            return;
        }
    } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }
    setTimeout(typeLoop, deleting ? 40 : 72);
}


// ── COOKIE BANNER ──
function acceptCookies() {
    localStorage.setItem('cookies_accepted', 'true');
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('hidden');
        setTimeout(() => banner.remove(), 400);
    }
}

function initCookieBanner() {
    if (!localStorage.getItem('cookies_accepted')) {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = 'flex';
    } else {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.remove();
    }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {

    // Cursor glow
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');

        document.querySelectorAll('button, a, .proj-card, .stat-card, .chip').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '220px';
                cursor.style.height = '220px';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '160px';
                cursor.style.height = '160px';
            });
        });
    }

    // Parallax mountain
    const mountainBg = document.getElementById('mountain-bg');
    if (mountainBg) {
        document.addEventListener('mousemove', e => {
            const xPct = (e.clientX / window.innerWidth - 0.5) * 12;
            const yPct = (e.clientY / window.innerHeight - 0.5) * 6;
            mountainBg.style.transform = `translate(${xPct}px, ${yPct}px) scale(1.05)`;
        });
    }

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    // Scroll nav shadow
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('nav');
        if (nav) {
            nav.style.background = window.scrollY > 10
                ? 'rgba(10,10,12,0.95)'
                : 'rgba(10,10,12,0.7)';
        }
    });

    // Lang picker — close when clicking a language option
    document.querySelectorAll('.lang-option').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                const picker = document.getElementById('lang-picker');
                if (picker) picker.classList.remove('open');
            }, 300);
        });
    });

    // Close lang picker when clicking outside
    document.addEventListener('click', (e) => {
        const picker = document.getElementById('lang-picker');
        const btn = document.getElementById('download-btn');
        if (picker && !picker.contains(e.target) && e.target !== btn) {
            picker.classList.remove('open');
        }
    });

    // Init home section and typing
    const goTo = sessionStorage.getItem('goToSection');
    if (goTo) {
        sessionStorage.removeItem('goToSection');
        showSection(goTo);
    } else {
        showSection('home');
    }
    initCookieBanner();
    typeLoop();
});
