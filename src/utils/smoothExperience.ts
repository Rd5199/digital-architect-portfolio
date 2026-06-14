import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide "smooth experience" layer (kota.co.uk-style):
 *  - Lenis inertia smooth scrolling, synced with GSAP ScrollTrigger
 *  - Scroll-triggered reveal animations for sections, headings and cards
 *  - Magnetic hover effect on buttons
 *  - Smooth anchor navigation through Lenis
 */

let lenis: Lenis | null = null;

// Set to true to disable all smooth-scroll/reveal motion for users whose OS
// reports "prefers-reduced-motion: reduce" (e.g. Windows "Animation effects" off).
const RESPECT_REDUCED_MOTION = false;

const prefersReducedMotion = () =>
  RESPECT_REDUCED_MOTION &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------- Lenis --------------------------------- */

export function initSmoothScroll(): Lenis | null {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5
  });

  // Drive Lenis from GSAP's ticker so ScrollTrigger stays perfectly in sync
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, duration: immediate ? 0 : 1.4 });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  }
}

export function stopSmoothScroll() {
  lenis?.stop();
}

export function startSmoothScroll() {
  lenis?.start();
}

/* ----------------------- Smooth anchor link handling ----------------------- */

function handleAnchorClicks() {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    // Plain in-page anchors (#about) and router hash links (/#about)
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const path = href.slice(0, hashIndex);
    if (path && path !== '/' && path !== window.location.pathname) return;

    const hash = href.slice(hashIndex);
    if (hash.length < 2) return;

    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    e.preventDefault();
    history.pushState(null, '', hash);
    scrollToTarget(target);
  });
}

/* ------------------------- Scroll-triggered reveals ------------------------ */

const EASE = 'power3.out';
const revealed = new WeakSet<Element>();

function batchReveal(selector: string, vars: gsap.TweenVars, stagger = 0.08) {
  const items = Array.from(document.querySelectorAll(selector)).filter(
    (el) => !revealed.has(el)
  );
  if (!items.length) return;
  items.forEach((el) => revealed.add(el));

  // Suspend CSS hover transitions while GSAP owns the transform
  gsap.set(items, { ...vars, transition: 'none' });

  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: EASE,
        stagger,
        overwrite: true,
        clearProps: 'transform,transition,opacity'
      })
  });
}

export function initScrollReveals() {
  if (prefersReducedMotion()) return;

  // Headings & intro copy: soft rise
  batchReveal('.dev-section-title, .dev-section-subtitle', { opacity: 0, y: 40 }, 0.12);

  // Cards & grid items: staggered rise with slight scale
  batchReveal(
    [
      '.dev-service-card',
      '.dev-portfolio-item',
      '.dev-testimonial-card',
      '.dev-tech-category',
      '.dev-process-step',
      '.dev-package-card',
      '.dev-about-step-card',
      '.dev-work-card',
      '.dev-faq-item'
    ].join(', '),
    { opacity: 0, y: 60, scale: 0.96 },
    0.1
  );

  // Generic opt-in attribute for anything else
  batchReveal('[data-reveal]', { opacity: 0, y: 50 }, 0.1);

  // Content blocks
  batchReveal('.dev-about-content, .dev-contact-form', { opacity: 0, y: 50 }, 0.1);

  ScrollTrigger.refresh();
}

/* ----------------------------- Magnetic buttons ---------------------------- */

const magnetized = new WeakSet<Element>();

export function initMagneticButtons() {
  if (prefersReducedMotion()) return;
  // Only on devices with a real pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll<HTMLElement>('.dev-btn').forEach((btn) => {
    if (magnetized.has(btn)) return;
    magnetized.add(btn);

    const strength = 0.35;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      xTo(relX * strength);
      yTo(relY * strength);
    });

    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* --------------------------------- Bootstrap ------------------------------- */

let anchorsBound = false;

/** Call once after the app content is mounted, and again after route changes. */
export function initSmoothExperience() {
  initSmoothScroll();

  if (!anchorsBound) {
    handleAnchorClicks();
    anchorsBound = true;
  }

  // Let the DOM settle (3D scenes, images) before measuring
  requestAnimationFrame(() => {
    initScrollReveals();
    initMagneticButtons();
    ScrollTrigger.refresh();
  });
}

/** Re-scan for new elements after a route change. */
export function refreshSmoothExperience() {
  requestAnimationFrame(() => {
    initScrollReveals();
    initMagneticButtons();
    ScrollTrigger.refresh();
  });
}
