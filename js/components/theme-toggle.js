import { SELECTORS, STORAGE_KEYS } from '../config.js';

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.dataset.theme = theme;

  const themeToggle = SELECTORS.themeToggle();
  if (themeToggle) {
    const isDark = theme === 'dark';
    const next = isDark ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }
}

/**
 * Initialize theme toggle
 */
export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored === 'light' || stored === 'dark' ? stored : (prefersLight ? 'light' : 'dark');

  applyTheme(initial);

  const themeToggle = SELECTORS.themeToggle();
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  });
}
