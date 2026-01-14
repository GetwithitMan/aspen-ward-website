import { SELECTORS } from '../config.js';
import { sanitize } from '../utils/sanitize.js';

/**
 * Render announcements section
 */
export function renderAnnouncements(items = []) {
  const announcementsSection = SELECTORS.announcementsSection();
  const announcementsList = SELECTORS.announcementsList();
  const announcementsNavLink = SELECTORS.announcementsNavLink();

  if (!announcementsSection || !announcementsList) return;

  announcementsList.innerHTML = '';

  if (!items || !items.length) {
    announcementsSection.setAttribute('hidden', '');
    announcementsSection.setAttribute('aria-hidden', 'true');
    announcementsNavLink?.setAttribute('hidden', '');
    return;
  }

  announcementsSection.removeAttribute('hidden');
  announcementsSection.setAttribute('aria-hidden', 'false');
  announcementsNavLink?.removeAttribute('hidden');

  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'announcement-card';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${index * 70}ms`;

    if (item.accent) {
      card.style.setProperty('--announcement-accent', item.accent);
    } else {
      card.style.removeProperty('--announcement-accent');
    }

    const title = document.createElement('h3');
    title.className = 'announcement-title';
    title.textContent = item.title || 'Announcement';
    card.appendChild(title);

    if (item.description) {
      const body = document.createElement('p');
      body.className = 'announcement-body';
      body.innerHTML = sanitize(item.description);
      card.appendChild(body);
    }

    if (item.link && item.link.startsWith('http')) {
      const link = document.createElement('a');
      link.className = 'announcement-link';
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `Open details for ${item.title || 'announcement'}`);
      link.innerHTML = 'Open details <span aria-hidden="true">↗</span>';
      card.appendChild(link);
    }

    announcementsList.appendChild(card);
  });
}
