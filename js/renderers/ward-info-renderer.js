import { SELECTORS } from '../config.js';
import { getCurrentSunday } from '../utils/date-utils.js';

/**
 * Update DOM with ward information
 */
export function renderWardInfo(wardDetails) {
  const {
    wardName,
    subtitle,
    location,
    sacramentStart,
    hideEvents,
    hideBanner
  } = wardDetails;

  document.title = `${wardName} – ${subtitle}`;

  const brandTitle = SELECTORS.brandTitle();
  const brandSubtitle = SELECTORS.brandSubtitle();
  const heroTitle = SELECTORS.heroTitle();
  const heroSubtitle = SELECTORS.heroSubtitle();
  const heroMeta = SELECTORS.heroMeta();
  const programIntro = SELECTORS.programIntro();
  const footerCopy = SELECTORS.footerCopy();
  const eventsSection = SELECTORS.eventsSection();
  const eventsNavLink = SELECTORS.eventsNavLink();
  const modal = SELECTORS.modal();

  if (brandTitle) brandTitle.textContent = wardName;
  if (brandSubtitle) brandSubtitle.textContent = subtitle;
  if (heroTitle) heroTitle.textContent = `${wardName} Sunday Services`;
  if (heroSubtitle) {
    heroSubtitle.textContent = `${subtitle} · Welcome`;
  }
  if (heroMeta) {
    heroMeta.textContent = `🗓️ ${getCurrentSunday()} ⛪ ${location} ⏰ ${sacramentStart}`;
  }
  if (programIntro) {
    programIntro.textContent = "A quick look at today's service";
  }
  if (footerCopy) {
    footerCopy.textContent = `❖ Not an official site of The Church of Jesus Christ of Latter-day Saints. Intended for local ${wardName} use only.`;
  }

  if (hideEvents) {
    eventsSection?.setAttribute('hidden', '');
    eventsNavLink?.setAttribute('hidden', '');
  } else {
    eventsSection?.removeAttribute('hidden');
    eventsNavLink?.removeAttribute('hidden');
  }

  if (hideBanner && modal) {
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
  }

  return wardDetails;
}
