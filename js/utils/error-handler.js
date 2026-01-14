import { SELECTORS } from '../config.js';

/**
 * Global error handler that catches unhandled errors
 */
export function initErrorHandler() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorNotification('An unexpected error occurred. Please refresh the page.');
    event.preventDefault();
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorNotification('An unexpected error occurred. Please refresh the page.');
    event.preventDefault();
  });
}

/**
 * Show error notification to user
 */
export function showErrorNotification(message, duration = 5000) {
  const notification = SELECTORS.errorNotification();
  const messageEl = SELECTORS.errorMessage();
  const closeBtn = SELECTORS.errorClose();

  if (!notification || !messageEl) return;

  messageEl.textContent = message;
  notification.removeAttribute('hidden');

  const hideNotification = () => {
    notification.setAttribute('hidden', '');
  };

  // Auto-hide after duration
  const timeout = setTimeout(hideNotification, duration);

  // Close button handler
  const closeHandler = () => {
    clearTimeout(timeout);
    hideNotification();
    closeBtn?.removeEventListener('click', closeHandler);
  };

  closeBtn?.addEventListener('click', closeHandler);
}

/**
 * Show inline error in a specific container
 */
export function showInlineError(container, message) {
  if (!container) return;
  container.innerHTML = `<p class="error-text">${escapeHtml(message)}</p>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling(fn, errorMessage = 'An error occurred') {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      console.error(errorMessage, error);
      showErrorNotification(errorMessage);
      throw error;
    }
  };
}
