/**
 * Green Cycle Environmental — TVG-Inspired Homepage Interactions
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const navbar = document.getElementById('navbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const yearSpan = document.getElementById('year');
  const counters = document.querySelectorAll('.counter');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach((anchor) => {
          anchor.classList.remove('active');
          if (anchor.getAttribute('href') === `#${id}`) {
            anchor.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });

  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.target;
    });
    return;
  }

  // Disable complex scroll animations on mobile for better performance and UX
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    // Show all elements immediately on mobile - no scroll-triggered animations
    gsap.set('.hero-label, .hero-title .line, .hero-subtitle, .hero-text, .hero-content .btn, .hero-diagonal', { opacity: 1, x: 0, y: 0 });
    gsap.set('.transparency .vertical-accent', { opacity: 1, height: 'auto' });
    gsap.set('.transparency-content > *', { opacity: 1, y: 0 });
    gsap.set('.transparency-image img', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', scale: 1 });
    gsap.set('.cycle-point', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.capability-image img, .capability-svg', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', scale: 1 });
    gsap.set('.capability-content > *', { opacity: 1, y: 0 });
    gsap.set('.advantage-card', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.impact-item', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.cta-content > *', { opacity: 1, y: 0 });
    
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.target;
    });
    return;
  }

  /**
   * Helper: animate SVG strokes by drawing them on scroll.
   * Accepts a selector string or an iterable of elements.
   */
  function animateStrokeDraw(selectorOrElements, options) {
    const defaults = { duration: 1.2, stagger: 0.15, ease: 'power2.out', start: 'top 75%' };
    const config = Object.assign({}, defaults, options);
    const paths = typeof selectorOrElements === 'string'
      ? document.querySelectorAll(selectorOrElements)
      : Array.from(selectorOrElements);

    if (!paths.length) return;

    paths.forEach((path) => {
      try {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      } catch (e) {
        // getTotalLength can fail on non-rendered elements; skip in that case
      }
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: {
        trigger: config.trigger,
        start: config.start,
      },
    });
  }

  // Hero entrance animation
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, immediateRender: false })
    .fromTo('.hero-title .line', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.9, stagger: 0.12, immediateRender: false }, '-=0.4')
    .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, immediateRender: false }, '-=0.5')
    .fromTo('.hero-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, immediateRender: false }, '-=0.5')
    .fromTo('.hero-content .btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, immediateRender: false }, '-=0.4')
    .fromTo('.hero-visual', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, '-=0.6')
    .fromTo('.hero-diagonal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');

  // Hero parallax
  gsap.to('.hero-visual', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Transparency section
  gsap.from('.transparency .vertical-accent', {
    opacity: 0,
    height: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.transparency',
      start: 'top 75%',
    },
  });

  gsap.from('.transparency-content > *', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.transparency',
      start: 'top 70%',
    },
  });

  // Mission image: diagonal clip-path reveal + subtle parallax
  gsap.fromTo(
    '.transparency-image img',
    { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', scale: 1.1 },
    {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      scale: 1,
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.transparency',
        start: 'top 65%',
      },
    }
  );

  gsap.to('.transparency-image img', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.transparency',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Cycle section
  gsap.from('.cycle-header', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cycle',
      start: 'top 75%',
    },
  });

  gsap.from('.cycle-svg', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cycle-diagram',
      start: 'top 75%',
    },
  });

  // Draw cycle arrows on scroll
  animateStrokeDraw('.cycle-svg path[marker-end]', {
    trigger: '.cycle-diagram',
    duration: 1.4,
    stagger: 0.2,
    start: 'top 75%',
  });

  gsap.fromTo('.cycle-point',
    { opacity: 0, scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.cycle-points',
        start: 'top 80%',
      },
    }
  );

  // Capabilities section
  document.querySelectorAll('.capability-row').forEach((row, index) => {
    const image = row.querySelector('.capability-image');
    const img = row.querySelector('.capability-image img');
    const content = row.querySelector('.capability-content');
    const listItems = row.querySelectorAll('.capability-list li');
    const xOffset = index % 2 === 0 ? -60 : 60;
    const clipFrom = index % 2 === 0
      ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
      : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
    const clipTo = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';

    // Content fade-up
    gsap.from(content, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 75%',
      },
    });

    // Image slide + clip reveal
    gsap.fromTo(
      image,
      { opacity: 0, x: xOffset },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 70%',
        },
      }
    );

    if (img) {
      gsap.fromTo(
        img,
        { clipPath: clipFrom, scale: 1.1 },
        {
          clipPath: clipTo,
          scale: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: row,
            start: 'top 68%',
          },
        }
      );

      // Subtle image parallax
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Draw strokes inside capability SVGs
    const svgPaths = row.querySelectorAll('.capability-svg path[stroke]');
    if (svgPaths.length) {
      animateStrokeDraw(svgPaths, {
        trigger: row,
        duration: 1,
        stagger: 0.1,
        start: 'top 70%',
      });
    }

    // Staggered list items
    gsap.from(listItems, {
      opacity: 0,
      x: index % 2 === 0 ? -30 : 30,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 65%',
      },
    });
  });

  // Advantage section
  gsap.from('.advantage-header > *', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.advantage',
      start: 'top 75%',
    },
  });

  gsap.from('.advantage-card', {
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.advantage-grid',
      start: 'top 80%',
    },
  });

  // Impact counters
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out',
          onUpdate: function () {
            counter.textContent = Math.round(this.targets()[0].innerText).toLocaleString();
          },
        });
      },
    });
  });

  gsap.from('.impact-item', {
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.impact-grid',
      start: 'top 80%',
    },
  });

  // CTA section
  gsap.from('.cta-content > *', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 70%',
    },
  });

  // Subtle parallax on CTA background
  gsap.to('.cta-section', {
    backgroundPositionY: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Footer
  gsap.from('.footer > .container > *', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 85%',
    },
  });

  // Refresh ScrollTrigger on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
})();
