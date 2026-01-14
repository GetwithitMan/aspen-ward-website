/**
 * Sanitize HTML using DOMPurify
 * Converts newlines to <br> tags and sanitizes HTML
 */
export function sanitize(text = '') {
  if (!text) return '';

  // Convert newlines to <br> tags
  const withBreaks = text.replace(/\n/g, '<br>');

  // Use DOMPurify if available, otherwise fall back to basic sanitization
  if (window.DOMPurify) {
    return window.DOMPurify.sanitize(withBreaks, {
      ALLOWED_TAGS: ['br', 'strong', 'em', 'a', 'p', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }

  // Fallback: basic sanitization
  return basicSanitize(withBreaks);
}

/**
 * Basic sanitization without DOMPurify
 * Only allows safe HTML tags
 */
function basicSanitize(html) {
  const div = document.createElement('div');
  div.textContent = html;
  let sanitized = div.innerHTML;

  // Allow <br> tags
  sanitized = sanitized.replace(/&lt;br&gt;/gi, '<br>');

  return sanitized;
}

/**
 * Escape all HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url) {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:')) {
    return '';
  }

  // Only allow http, https, and mailto
  if (!trimmed.startsWith('http://') &&
      !trimmed.startsWith('https://') &&
      !trimmed.startsWith('mailto:') &&
      !trimmed.startsWith('/')) {
    return '';
  }

  return url.trim();
}
