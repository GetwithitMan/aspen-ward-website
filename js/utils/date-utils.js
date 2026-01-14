/**
 * Format date for Google Calendar
 */
export function formatDateForCalendar(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate())
  ].join('') + 'T' + [
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds())
  ].join('') + 'Z';
}

/**
 * Check if text contains a date or day reference
 */
export function hasDateOrDay(value = '') {
  const text = value.toLowerCase();
  return /(sunday|monday|tuesday|wednesday|thursday|friday|saturday|every\s+\w+)/i.test(text) ||
    /(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(text) ||
    /\d{1,2}(st|nd|rd|th)/i.test(text);
}

/**
 * Parse event date from text
 */
export function parseEventDate(dateText = '', info = '') {
  const now = new Date();
  const currentYear = now.getFullYear();
  let eventDate = new Date(now);

  const text = `${dateText} ${info}`.trim();

  // Handle recurring days (e.g., "every Sunday")
  if (text.toLowerCase().includes('every ')) {
    const day = text.toLowerCase().match(/every\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/);
    if (day) {
      const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day[1]);
      eventDate = new Date(now);
      while (eventDate.getDay() !== dayIndex) {
        eventDate.setDate(eventDate.getDate() + 1);
      }
    }
  } else {
    // Handle specific dates (e.g., "January 15")
    const monthMatch = text.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i);
    if (monthMatch) {
      eventDate = new Date(`${monthMatch[0]}, ${currentYear}`);
      if (!Number.isFinite(eventDate.valueOf())) {
        eventDate = new Date(now);
      }
      if (eventDate < now) {
        eventDate.setFullYear(currentYear + 1);
      }
    }
  }

  // Parse time
  const parseTimeString = (input) => {
    if (!input) return null;
    const match = input.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2] ?? '0', 10);
    const period = match[3]?.toLowerCase();

    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    if (!period && hours === 24) hours = 0;

    return { hours, minutes };
  };

  // Parse time range (e.g., "2pm - 4pm")
  const rangeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  let startTime = parseTimeString(rangeMatch ? rangeMatch[1] : text);
  let endTime = rangeMatch ? parseTimeString(rangeMatch[2]) : null;

  if (!startTime) {
    startTime = { hours: 9, minutes: 0 };
  }

  eventDate.setHours(startTime.hours, startTime.minutes, 0, 0);

  const endDate = new Date(eventDate);
  if (endTime) {
    endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
  } else {
    endDate.setHours(endDate.getHours() + 1);
  }

  return { start: eventDate, end: endDate };
}

/**
 * Create Google Calendar link
 */
export function createCalendarLink({ title, description, start, end, location }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDateForCalendar(start)}/${formatDateForCalendar(end)}`,
    details: description
  });

  if (location) params.set('location', location);

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

/**
 * Get current Sunday date formatted
 */
export function getCurrentSunday() {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return sunday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
