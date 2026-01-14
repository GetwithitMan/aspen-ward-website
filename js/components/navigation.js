import { SELECTORS } from '../config.js';

/**
 * Update navigation active state
 */
function updateNavState(id) {
  SELECTORS.navLinks().forEach((link) => {
    link.classList.toggle('active', link.dataset.scroll === id);
  });
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(targetId) {
  const element = document.getElementById(targetId);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Initialize navigation
 */
export function initNavigation() {
  const menuToggle = SELECTORS.menuToggle();
  const nav = SELECTORS.nav();
  const navLinks = SELECTORS.navLinks();

  const setMenuState = (isOpen) => {
    if (!menuToggle || !nav) return;
    menuToggle.classList.toggle('open', isOpen);
    nav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  setMenuState(false);

  // Handle nav link clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const { scroll } = event.currentTarget.dataset;
      updateNavState(scroll);
      smoothScrollTo(scroll);
      setMenuState(false);
    });
  });

  // Handle external nav links
  document
    .querySelectorAll('.nav-link:not([data-scroll])')
    .forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

  // Handle hero action buttons
  [
    ['program-scroll', 'program'],
    ['events-scroll', 'events']
  ].forEach(([id, target]) => {
    const trigger = document.getElementById(id);
    if (trigger) {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        updateNavState(target);
        smoothScrollTo(target);
      });
    }
  });

  // Menu toggle button
  menuToggle?.addEventListener('click', () => {
    const isOpen = !menuToggle.classList.contains('open');
    setMenuState(isOpen);
  });

  // Close menu on Escape
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });

  // Intersection observer for active section
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.scroll))
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateNavState(entry.target.id);
        }
      });
    }, { threshold: 0.55 });

    sections.forEach((section) => observer.observe(section));
  }
}
