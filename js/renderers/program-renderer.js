import { SELECTORS } from '../config.js';
import { sanitize } from '../utils/sanitize.js';
import { clearSkeletons } from '../components/loading.js';
import { renderAnnouncements } from './announcements-renderer.js';
import { renderBanner } from '../components/modal.js';
import { renderNewsFlash } from '../components/news-flash.js';

/**
 * Render program section
 */
export function renderProgram(rows, wardDetails = {}) {
  const programGrid = SELECTORS.programGrid();
  if (!programGrid) return;

  clearSkeletons(programGrid);

  const cards = [];
  let bannerTitle = 'Announcements';
  const bannerItems = [];
  const announcementItems = [];

  for (let i = 0; i < rows.length; i++) {
    const [program = '', details = '', link = '', accent = ''] = rows[i];

    if (!program.trim()) continue;

    // Handle special sections
    if (program.startsWith('#SECTION:')) {
      const sectionName = program.replace('#SECTION:', '').trim().toLowerCase();

      if (sectionName === 'banner') {
        bannerTitle = details || bannerTitle;
        let j = i + 1;

        while (rows[j] && !rows[j][0]?.startsWith('#SECTION:')) {
          const [title, description, url, color] = rows[j];
          bannerItems.push({
            title: (title || 'Announcement').trim(),
            description: (description || '').trim(),
            link: (url || '').trim(),
            accent: (color || accent || '').trim()
          });
          j++;
        }
        i = j - 1;
      } else if (sectionName === 'announcements') {
        let j = i + 1;

        while (rows[j] && !rows[j][0]?.startsWith('#SECTION:')) {
          const [title, description, url, color] = rows[j];
          const rawTitle = (title || '').trim();
          const trimmedDescription = (description || '').trim();
          const trimmedLink = (url || '').trim();
          const trimmedAccent = (color || accent || '').trim();

          if (!rawTitle && !trimmedDescription && !trimmedLink) {
            j++;
            continue;
          }

          announcementItems.push({
            title: rawTitle || 'Announcement',
            description: trimmedDescription,
            link: trimmedLink,
            accent: trimmedAccent
          });
          j++;
        }
        i = j - 1;
      }
      continue;
    }

    if (!details.trim()) continue;

    // Create program card
    const card = document.createElement('article');
    card.className = 'program-card';
    card.setAttribute('role', 'listitem');

    const heading = document.createElement('p');
    heading.className = 'program-title';
    heading.textContent = program.trim();

    const description = document.createElement('p');
    description.className = 'program-detail';

    const trimmedLink = link.trim();
    const html = trimmedLink.startsWith('http')
      ? `<a href="${trimmedLink}" target="_blank" rel="noopener">${sanitize(details)}</a>`
      : sanitize(details);

    description.innerHTML = html;

    card.append(heading, description);
    cards.push(card);
  }

  if (!cards.length) {
    const empty = document.createElement('p');
    empty.className = 'error-text';
    empty.textContent = 'Program information will be available shortly.';
    programGrid.appendChild(empty);
  } else {
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 70}ms`;
      programGrid.appendChild(card);
    });
  }

  // Render related components
  renderAnnouncements(announcementItems);

  const debugMode = new URLSearchParams(window.location.search).get('banner') === 'debug';

  if (!wardDetails.hideBanner && bannerItems.length) {
    renderBanner({ title: bannerTitle, announcements: bannerItems }, debugMode);
    renderNewsFlash({ announcements: bannerItems, hideBanner: wardDetails.hideBanner });
  }
}
