// Shared helpers for the teaching calendar (teaching.html, teaching-admin.html).
//
// Database shape, all under /teaching:
//   classes/{classId}  { name, order, teams: { t1: { label, members[], pattern } } }
//   people/{username}  { name, classId, teamId, hash }
//   sundays/{YYYY-MM-DD}/{classId}  { teamId, by, swap }
//
// `pattern` on a team is { nth: [1, 2] } (those Sundays of the month),
// { every: true }, or empty when the team just alternates weeks by agreement.

export const SUNDAYS_AHEAD = 52;

// "YYYY-MM-DD" in local time. Sundays are keyed by date, never by timestamp,
// so a teacher in another timezone cannot shift a claim to the wrong week.
export function dateKey(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// The Sunday just past (or today, if today is Sunday), then `count` Sundays on.
// Matches the printed program, which also dates to the most recent Sunday.
export function upcomingSundays(count = SUNDAYS_AHEAD) {
  const first = new Date();
  first.setHours(0, 0, 0, 0);
  first.setDate(first.getDate() - first.getDay());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    return d;
  });
}

// Which Sunday of the month: 1-5.
export function nthOfMonth(d) {
  return Math.ceil(d.getDate() / 7);
}

export function isPatternSunday(team, d) {
  const p = team && team.pattern;
  if (!p) return false;
  if (p.every) return true;
  return Array.isArray(p.nth) && p.nth.includes(nthOfMonth(d));
}

// Firebase returns an object instead of an array for sparse keys.
export function toArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v.filter(x => x != null) : Object.values(v);
}

// Passwords are never stored. The database keeps only this hash, so a teacher
// reading /teaching/people cannot see anyone else's password.
export async function hashLogin(username, password) {
  const bytes = new TextEncoder().encode(`${username.toLowerCase()}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

// First initial + last name, lowercase letters only: "Kitrick Galloway" -> "kgalloway".
export function makeUsername(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  return (parts[0][0] + last).toLowerCase().replace(/[^a-z]/g, '');
}

// Easy to read aloud over the phone: word + 4 digits.
export function makePassword() {
  const words = ['aspen', 'teach', 'sunday', 'class', 'lesson', 'maple'];
  const word = words[Math.floor(Math.random() * words.length)];
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return word + String(n).padStart(4, '0');
}

export function fmtSunday(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtMonth(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
