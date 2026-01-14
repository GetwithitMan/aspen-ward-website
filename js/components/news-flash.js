import { SELECTORS } from '../config.js';

/**
 * Close news flash banner
 */
function closeNewsFlash() {
  const newsFlash = SELECTORS.newsFlash();
  if (newsFlash) {
    newsFlash.setAttribute('hidden', '');
    newsFlash.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Render scrolling news flash banner
 */
export function renderNewsFlash({ announcements, hideBanner = false }) {
  const newsFlash = SELECTORS.newsFlash();
  const newsFlashContent = SELECTORS.newsFlashContent();
  const newsFlashClose = SELECTORS.newsFlashClose();

  if (!newsFlash || !newsFlashContent || !Array.isArray(announcements) || !announcements.length) return;
  if (hideBanner) return;

  newsFlashContent.innerHTML = '';

  const defaultColors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];

  const content = announcements.map((item, index) => {
    const titleText = item.title || 'Announcement';
    const descriptionText = item.description || '';
    const linkText = item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener">${descriptionText}</a>`
      : descriptionText;
    const color = item.accent || defaultColors[index % defaultColors.length];

    return `<span style="color: ${color}; padding-right: 3rem;">${titleText}: ${linkText}</span>`;
  }).join(' ••• ');

  newsFlashContent.innerHTML = content;

  newsFlash.removeAttribute('hidden');
  newsFlash.setAttribute('aria-hidden', 'false');

  // Calculate scroll duration based on content width
  const contentWidth = newsFlashContent.offsetWidth;
  const windowWidth = window.innerWidth;
  const scrollDuration = Math.max(10, (contentWidth / windowWidth) * 15);
  newsFlashContent.style.animationDuration = `${scrollDuration}s`;

  // Auto-dismiss after scroll completes
  const autoDismiss = setTimeout(() => {
    closeNewsFlash();
  }, scrollDuration * 1000);

  // Close button handler
  const closeHandler = () => {
    clearTimeout(autoDismiss);
    closeNewsFlash();
  };

  newsFlashClose?.addEventListener('click', closeHandler, { once: true });
}
