/* ============================================================
   OCTAVE AUDIO — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroSlider();
  initGallery();
  initStickyHeader();
  initCatalogFilter();
});

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.mobile-nav');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    overlay.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // Mobile accordion sub-menus
  document.querySelectorAll('.mobile-nav-link[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.toggle);
      if (!target) return;
      const open = target.style.display === 'block';
      target.style.display = open ? 'none' : 'block';
    });
  });
}

/* ============================================================
   HERO SLIDER
   ============================================================ */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 5500;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current]?.classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current]?.classList.add('is-active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  // Swipe support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });
  }

  goTo(0);
  startAuto();
}

/* ============================================================
   PRODUCT GALLERY
   ============================================================ */
function initGallery() {
  const main   = document.querySelector('.gallery-main img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (!main || !thumbs.length) return;

  function activate(thumb) {
    thumbs.forEach(t => t.classList.remove('is-active'));
    thumb.classList.add('is-active');

    main.classList.add('is-fading');
    setTimeout(() => {
      main.src = thumb.dataset.full || thumb.querySelector('img').src;
      main.alt = thumb.querySelector('img').alt;
      main.classList.remove('is-fading');
    }, 200);
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => activate(thumb));
    thumb.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(thumb); }
    });
    thumb.setAttribute('role', 'button');
    thumb.setAttribute('tabindex', '0');
  });

  // Activate first
  if (thumbs[0]) thumbs[0].classList.add('is-active');
}

/* ============================================================
   STICKY HEADER COMPACT ON SCROLL
   ============================================================ */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   CATALOG FILTER (products page)
   ============================================================ */
function initCatalogFilter() {
  const btns  = document.querySelectorAll('.catalog-nav-btn');
  const cards = document.querySelectorAll('.product-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const cat = btn.dataset.cat;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
