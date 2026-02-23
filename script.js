/* ========================================================
   BilliCouch – Interactive JavaScript
   ======================================================== */

'use strict';

// ── Utility ──────────────────────────────────────────────
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ── DOM ready ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroParticles();
  initHeroToggle();
  initScrollReveal();
  initTransformSection();
  initGallery();
  initContactForm();
  initCursorGlow();
  initHamburger();
  triggerHeroReveal();
});

/* ═══════════════════════════════════════════════════════
   NAVIGATION – scroll state + active link
═══════════════════════════════════════════════════════ */
function initNav() {
  const nav = qs('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };

  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════════════════ */
function initHamburger() {
  const btn  = qs('#hamburger');
  const menu = qs('#mobileMenu');
  if (!btn || !menu) return;

  const links = qsa('.mobile-link', menu);

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger to X
    const spans = qsa('span', btn);
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  on(btn, 'click', toggleMenu);

  links.forEach(link => {
    on(link, 'click', () => {
      menu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = qsa('span', btn);
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close on backdrop click
  on(menu, 'click', (e) => {
    if (e.target === menu) toggleMenu();
  });
}

/* ═══════════════════════════════════════════════════════
   HERO PARTICLES
═══════════════════════════════════════════════════════ */
function initHeroParticles() {
  const container = qs('#particles');
  if (!container) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 768 ? 12 : 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    const dur   = 15 + Math.random() * 25;
    const opacity = Math.random() * 0.15 + 0.05;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -5%;
      opacity: ${opacity};
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════
   HERO PRODUCT TOGGLE (couch ↔ billiard)
═══════════════════════════════════════════════════════ */
function initHeroToggle() {
  const art    = qs('#productArt');
  const dots   = qsa('.toggle-dot');
  if (!art || !dots.length) return;

  let currentMode = 'couch';
  let autoTimer   = null;

  const switchTo = (mode) => {
    currentMode = mode;
    art.classList.toggle('show-billiard', mode === 'billiard');
    dots.forEach(d => d.classList.toggle('active', d.dataset.mode === mode));
  };

  dots.forEach(dot => {
    on(dot, 'click', () => {
      clearTimeout(autoTimer);
      switchTo(dot.dataset.mode);
      scheduleAuto();
    });
  });

  // Auto-cycle every 3.5s
  const scheduleAuto = () => {
    autoTimer = setTimeout(() => {
      switchTo(currentMode === 'couch' ? 'billiard' : 'couch');
      scheduleAuto();
    }, 3500);
  };

  scheduleAuto();
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    qsa('.reveal-up, .reveal-left, .reveal-right, .reveal-card')
      .forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  qsa('.reveal-up, .reveal-left, .reveal-right, .reveal-card')
    .forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════
   HERO REVEAL (trigger immediately on load)
═══════════════════════════════════════════════════════ */
function triggerHeroReveal() {
  const heroItems = qsa('.hero .reveal-up');
  heroItems.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 120);
  });
}

/* ═══════════════════════════════════════════════════════
   TRANSFORM SECTION (Sticky scroll stages)
═══════════════════════════════════════════════════════ */
function initTransformSection() {
  const section  = qs('#transformSection');
  const bar      = qs('.transform-section__bar');
  const stages   = qsa('.transform-stage');
  const stepBtns = qsa('.step-btn');
  if (!section || !bar || !stages.length) return;

  let currentStage = 1;

  const showStage = (n) => {
    if (n === currentStage) return;
    currentStage = n;

    stages.forEach((s, i) => {
      s.classList.toggle('hidden', i !== n - 1);
    });

    stepBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step) === n);
    });
  };

  // Step buttons click
  stepBtns.forEach(btn => {
    on(btn, 'click', () => showStage(parseInt(btn.dataset.step)));
  });

  // Scroll-driven stage changes
  const onScroll = () => {
    const rect     = section.getBoundingClientRect();
    const sHeight  = section.offsetHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / (sHeight - window.innerHeight)));

    // Progress bar
    bar.style.width = `${Math.round(progress * 100)}%`;

    // Stage logic: 3 stages distributed evenly over scroll range
    const stageNum = progress < 0.33 ? 1 : progress < 0.66 ? 2 : 3;
    showStage(stageNum);
  };

  on(window, 'scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════
   GALLERY – drag scroll + dot nav + prev/next
═══════════════════════════════════════════════════════ */
function initGallery() {
  const track     = qs('#galleryTrack');
  const dotsWrap  = qs('#galleryDots');
  const prevBtn   = qs('#galleryPrev');
  const nextBtn   = qs('#galleryNext');
  if (!track) return;

  const items = qsa('.gallery__item', track);
  const total = items.length;

  // Create dots
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Obrázok ${i + 1}`);
    on(dot, 'click', () => scrollToIndex(i));
    dotsWrap && dotsWrap.appendChild(dot);
  });

  const getDots = () => qsa('.gallery__dot', dotsWrap);

  const scrollToIndex = (i) => {
    const item = items[i];
    if (!item) return;
    track.scrollTo({ left: item.offsetLeft - parseInt(getComputedStyle(track).paddingLeft), behavior: 'smooth' });
  };

  // Sync dots on scroll
  const syncDots = () => {
    const scrollLeft = track.scrollLeft;
    const trackPad   = parseInt(getComputedStyle(track).paddingLeft) || 20;
    let closest = 0;
    let minDist = Infinity;

    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - trackPad - scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });

    getDots().forEach((d, i) => d.classList.toggle('active', i === closest));
  };

  on(track, 'scroll', syncDots, { passive: true });

  // Prev / Next buttons
  on(prevBtn, 'click', () => {
    const dots = getDots();
    const active = dots.findIndex(d => d.classList.contains('active'));
    scrollToIndex(Math.max(0, active - 1));
  });

  on(nextBtn, 'click', () => {
    const dots = getDots();
    const active = dots.findIndex(d => d.classList.contains('active'));
    scrollToIndex(Math.min(total - 1, active + 1));
  });

  // Drag scroll (mouse)
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  on(track, 'mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.style.cursor = 'grabbing';
    track.style.scrollBehavior = 'auto';
  });

  on(window, 'mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  on(window, 'mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';
    track.style.scrollBehavior = '';
  });

  // Keyboard navigation
  on(track, 'keydown', (e) => {
    const dots = getDots();
    const active = dots.findIndex(d => d.classList.contains('active'));
    if (e.key === 'ArrowLeft')  scrollToIndex(Math.max(0, active - 1));
    if (e.key === 'ArrowRight') scrollToIndex(Math.min(total - 1, active + 1));
  });
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM (client-side UX, no actual submit)
═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form || !success) return;

  on(form, 'submit', (e) => {
    e.preventDefault();

    const btn = qs('button[type="submit"]', form);
    if (!btn) return;

    // Validate
    const email = qs('#email', form);
    const name  = qs('#name', form);

    if (!name.value.trim() || !email.value.trim()) {
      shakeField(name.value.trim() ? email : name);
      return;
    }

    if (!isValidEmail(email.value)) {
      shakeField(email);
      return;
    }

    // Loading state
    btn.disabled = true;
    const btnText = qs('.btn-text', btn);
    const btnIcon = qs('.btn-icon', btn);
    if (btnText) btnText.textContent = 'Odosielam…';
    if (btnIcon) btnIcon.textContent = '⏳';

    // Simulate async
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1400);
  });
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function shakeField(el) {
  if (!el) return;
  el.style.borderColor = '#e74c3c';
  el.style.boxShadow   = '0 0 0 3px rgba(231,76,60,0.15)';
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)' },
  ], { duration: 350, easing: 'ease-in-out' });
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 2000);
}

/* ═══════════════════════════════════════════════════════
   CURSOR GLOW (pointer devices only)
═══════════════════════════════════════════════════════ */
function initCursorGlow() {
  const glow = qs('#cursorGlow');
  if (!glow) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    glow.style.display = 'none';
    return;
  }

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let raf = null;

  const move = (e) => { mx = e.clientX; my = e.clientY; };
  on(document, 'mousemove', move, { passive: true });

  const tick = () => {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
}
