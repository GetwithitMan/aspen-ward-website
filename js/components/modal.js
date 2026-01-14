import { SELECTORS, STORAGE_KEYS } from '../config.js';

let lastFocusedElement = null;

/**
 * Check if banner should be shown today
 */
function shouldShowBanner(debugMode = false) {
  if (debugMode) return true;

  const lastShown = localStorage.getItem(STORAGE_KEYS.BANNER_SEEN);
  if (!lastShown) return true;

  const lastDate = new Date(parseInt(lastShown, 10));
  const today = new Date();
  return lastDate.toDateString() !== today.toDateString();
}

/**
 * Close modal
 */
function closeModal() {
  const modal = SELECTORS.modal();
  if (!modal) return;

  modal.setAttribute('hidden', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.removeProperty('overflow');

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

/**
 * Trap focus within modal
 */
function trapFocus(event) {
  const modal = SELECTORS.modal();
  if (event.key !== 'Tab' || !modal || modal.hasAttribute('hidden')) return;

  const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Initialize modal
 */
export function initModal() {
  const modal = SELECTORS.modal();
  const modalDismiss = SELECTORS.modalDismiss();
  const modalClose = SELECTORS.modalClose();

  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
  }

  modalDismiss?.addEventListener('click', closeModal);
  modalClose?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal?.addEventListener('keydown', trapFocus);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

/**
 * Render banner modal
 */
export function renderBanner({ title, announcements }, debugMode = false) {
  const modal = SELECTORS.modal();
  const modalTitle = SELECTORS.modalTitle();
  const modalBody = SELECTORS.modalBody();
  const modalDismiss = SELECTORS.modalDismiss();

  if (!modal || !Array.isArray(announcements) || !announcements.length) return;
  if (!shouldShowBanner(debugMode)) return;

  modalTitle.textContent = title || 'Announcements';
  modalBody.innerHTML = '';

  announcements.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'banner-row';

    if (item.accent) {
      row.style.borderColor = item.accent;
    }

    const heading = document.createElement('div');
    heading.className = 'banner-title';
    heading.textContent = item.title;

    if (item.accent) {
      heading.style.color = item.accent;
    }

    const copy = document.createElement('div');
    copy.innerHTML = item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener">${item.description}</a>`
      : item.description;

    row.append(heading, copy);
    modalBody.appendChild(row);
  });

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.setProperty('overflow', 'hidden');

  requestAnimationFrame(() => {
    modalDismiss?.focus();
  });

  if (!debugMode) {
    localStorage.setItem(STORAGE_KEYS.BANNER_SEEN, Date.now().toString());
  }
}
