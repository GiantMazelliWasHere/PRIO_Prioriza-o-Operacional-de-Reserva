(function () {
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const progress = document.getElementById('scrollProgress');
  const deckSlides = Array.from(document.querySelectorAll(
    'main > section.deck-page:not(.deck-multi), main .deck-snap'
  ));
  const deckCurrent = document.getElementById('deckCurrent');
  const deckTotal = document.getElementById('deckTotal');
  const deckDots = document.getElementById('deckDots');
  const navAnchors = document.querySelectorAll('.nav-links a');

  let currentDeckIndex = 0;
  let isDeckNavigating = false;
  let deckNavCooldown = false;

  deckTotal.textContent = deckSlides.length;

  function getNavSectionId(slide) {
    return slide.dataset.navSection
      || slide.closest('section[id]')?.id
      || slide.id;
  }

  function findSlideIndexByHash(hash) {
    if (!hash) return -1;
    let idx = deckSlides.findIndex(s => s.id === hash);
    if (idx !== -1) return idx;
    idx = deckSlides.findIndex(s => getNavSectionId(s) === hash);
    return idx;
  }

  // Build dot navigation
  deckSlides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'deck-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', slide.dataset.deckTitle || 'Tela ' + (i + 1));
    dot.title = slide.dataset.deckTitle || '';
    dot.addEventListener('click', () => goToDeckSlide(i));
    deckDots.appendChild(dot);
  });

  function updateDeckUI(index) {
    currentDeckIndex = index;
    deckCurrent.textContent = index + 1;
    deckDots.querySelectorAll('.deck-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    const slide = deckSlides[index];
    const navSectionId = getNavSectionId(slide);
    document.body.classList.toggle(
      'slide-prototipo',
      slide.id === 'prototipo' || navSectionId === 'prototipo'
    );
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + navSectionId);
    });
    const hash = slide.id || navSectionId;
    if (history.replaceState) {
      history.replaceState(null, '', '#' + hash);
    } else {
      location.hash = hash;
    }
  }

  function goToDeckSlide(index, behavior) {
    if (index < 0 || index >= deckSlides.length) return;
    if (index === currentDeckIndex && isDeckNavigating) return;

    isDeckNavigating = true;
    deckNavCooldown = true;
    document.documentElement.classList.add('deck-navigating');

    deckSlides[index].scrollIntoView({
      behavior: behavior || 'smooth',
      block: 'start'
    });

    updateDeckUI(index);
    updateProgress();

    setTimeout(() => {
      isDeckNavigating = false;
      document.documentElement.classList.remove('deck-navigating');
    }, behavior === 'auto' ? 50 : 700);

    setTimeout(() => { deckNavCooldown = false; }, 650);
  }

  function nextPage() { goToDeckSlide(currentDeckIndex + 1); }
  function prevPage() { goToDeckSlide(currentDeckIndex - 1); }

  // Keyboard presentation navigation
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const nextKeys = ['ArrowDown', 'ArrowRight', 'PageDown', ' '];
    const prevKeys = ['ArrowUp', 'ArrowLeft', 'PageUp'];

    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      if (!deckNavCooldown) nextPage();
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      if (!deckNavCooldown) prevPage();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToDeckSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToDeckSlide(deckSlides.length - 1);
    }
  });

  // Sync index when user scrolls manually (mouse wheel / trackpad)
  const deckObserver = new IntersectionObserver((entries) => {
    if (isDeckNavigating) return;
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const idx = deckSlides.indexOf(entry.target);
        if (idx !== -1 && idx !== currentDeckIndex) {
          updateDeckUI(idx);
          updateProgress();
        }
      }
    });
  }, { threshold: [0.5, 0.65], rootMargin: '-12% 0px -12% 0px' });

  deckSlides.forEach(slide => deckObserver.observe(slide));

  // Hash on load / back button
  function syncFromHash() {
    const hash = location.hash.slice(1);
    if (!hash) return;
    const idx = findSlideIndexByHash(hash);
    if (idx !== -1) goToDeckSlide(idx, 'auto');
  }

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();

  // Nav links jump to first slide of that section
  navAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const idx = findSlideIndexByHash(href.slice(1));
      if (idx !== -1) {
        e.preventDefault();
        goToDeckSlide(idx);
        navLinks.classList.remove('open');
      }
    });
  });

  document.querySelectorAll('.hero-cta a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const idx = findSlideIndexByHash(a.getAttribute('href').slice(1));
      if (idx !== -1) { e.preventDefault(); goToDeckSlide(idx); }
    });
  });

  // Scroll progress (by slide step, not pixel)
  function updateProgress() {
    const pct = deckSlides.length > 1
      ? (currentDeckIndex / (deckSlides.length - 1)) * 100
      : 0;
    progress.style.width = pct + '%';
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', () => {
    if (!isDeckNavigating) updateProgress();
  }, { passive: true });
  updateProgress();

  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  revealEls.forEach(el => observerReveal.observe(el));

  // Animate chart bars when visible
  const chartBlocks = document.querySelectorAll('.chart-block');
  const observerCharts = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.chart-row').forEach(row => {
        const w = row.dataset.width;
        const bar = row.querySelector('.chart-bar');
        if (bar && w) bar.style.width = w + '%';
      });
      observerCharts.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  chartBlocks.forEach(block => observerCharts.observe(block));

  // Auto-hide presentation chrome (dots, counter, keyboard hint) after 3s idle
  const deckChrome = document.querySelectorAll('.deck-chrome');
  const CHROME_IDLE_MS = 3000;
  let chromeHideTimer = null;

  function showDeckChrome() {
    deckChrome.forEach(el => el.classList.remove('is-hidden'));
    clearTimeout(chromeHideTimer);
    chromeHideTimer = setTimeout(() => {
      deckChrome.forEach(el => el.classList.add('is-hidden'));
    }, CHROME_IDLE_MS);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(evt => {
    document.addEventListener(evt, showDeckChrome, { passive: true });
  });
  showDeckChrome();
})();
  
