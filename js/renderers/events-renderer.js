import { SELECTORS } from '../config.js';
import { hasDateOrDay, parseEventDate, createCalendarLink } from '../utils/date-utils.js';
import { sanitize } from '../utils/sanitize.js';
import { clearSkeletons } from '../components/loading.js';

/**
 * Render events timeline
 */
export function renderEvents(rows, wardDetails = {}) {
  const eventsTimeline = SELECTORS.eventsTimeline();
  if (!eventsTimeline) return;

  clearSkeletons(eventsTimeline);

  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'error-text';
    empty.textContent = 'No upcoming events were found. Check back soon!';
    eventsTimeline.appendChild(empty);
    return;
  }

  rows.forEach(([dateRaw = '', titleRaw = '', infoRaw = '', iconRaw = '', urlRaw = '']) => {
    const info = infoRaw.trim();
    if (!info) return;

    const date = dateRaw.trim();
    const title = titleRaw.trim();
    const icon = iconRaw.trim();
    const link = urlRaw.trim();

    const card = document.createElement('article');
    card.className = 'event-card';

    const header = document.createElement('div');
    header.className = 'event-header';

    const dateLabel = document.createElement('span');
    dateLabel.className = 'event-date';
    dateLabel.textContent = date || 'Date TBD';

    const name = document.createElement('h3');
    name.className = 'event-title';
    name.textContent = `${icon || '📅'} ${title || 'Ward Event'}`;

    header.append(dateLabel, name);

    const body = document.createElement('div');
    body.className = 'event-body';
    body.innerHTML = link.startsWith('http')
      ? `<a href="${link}" target="_blank" rel="noopener">${sanitize(info)}</a>`
      : sanitize(info);

    card.append(header, body);

    // Add calendar link if date is parseable
    if (hasDateOrDay(date) || hasDateOrDay(info)) {
      const { start, end } = parseEventDate(date, infoRaw);

      const calendarLink = document.createElement('a');
      calendarLink.href = createCalendarLink({
        title: title || 'Ward Event',
        description: info,
        start,
        end,
        location: wardDetails.location
      });
      calendarLink.target = '_blank';
      calendarLink.rel = 'noopener';
      calendarLink.className = 'calendar-link';
      calendarLink.textContent = 'Add to calendar';

      card.appendChild(calendarLink);
    }

    eventsTimeline.appendChild(card);
  });
}
