import { SELECTORS } from '../config.js';

/**
 * Show loading screen
 */
export function showLoading() {
  const loadingScreen = SELECTORS.loadingScreen();
  if (loadingScreen) {
    loadingScreen.removeAttribute('hidden');
    loadingScreen.setAttribute('aria-busy', 'true');
  }
}

/**
 * Hide loading screen with fade out animation
 */
export function hideLoading() {
  const loadingScreen = SELECTORS.loadingScreen();
  if (!loadingScreen) return;

  loadingScreen.classList.add('hide');
  loadingScreen.setAttribute('aria-busy', 'false');

  // Remove from DOM after animation
  setTimeout(() => {
    loadingScreen.setAttribute('hidden', '');
    loadingScreen.classList.remove('hide');
  }, 300);
}

/**
 * Clear skeleton loaders and show actual content
 */
export function clearSkeletons(container) {
  if (!container) return;

  const skeletons = container.querySelectorAll('.skeleton-card, .skeleton-event, .skeleton-text');
  skeletons.forEach(skeleton => skeleton.remove());

  // Add fade-in animation to new content
  container.classList.add('fade-in');
}
