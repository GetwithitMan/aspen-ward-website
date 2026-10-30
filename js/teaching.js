// Shared helpers for the teaching calendar (teaching.html, teaching-admin.html).
//
// Database shape, all under /teaching:
//   classes/{classId}  { name, order, teams: { t1: { label, members[], pattern } } }
//   people/{username}  { name, classId?, teamId?, role?, hash }   role 'presidency' = admin; class optional
//   sundays/{YYYY-MM-DD}/{classId}  { teamId | sub, by, swap?, swapFor?, coverName?, coverFor?, covered? }
//     sub = typed-in substitute; swap = 'full' | 'partial' (true = full); coverName/coverFor = a sub covering one of a pair
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
// Case and surrounding spaces are ignored: phones capitalize the first letter.
export async function hashLogin(username, password) {
  const bytes = new TextEncoder().encode(`${username.trim().toLowerCase()}:${password.trim().toLowerCase()}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

// First initial + last name, lowercase letters only: "Kitrick Galloway" -> "kgalloway".
export function makeUsername(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  return (parts[0][0] + last).toLowerCase().replace(/[^a-z]/g, '');
}

// Full first name + last initial, lowercase: "Kitrick Galloway" -> "kitrickg".
export function makePassword(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  return (parts[0] + (last ? last[0] : '')).toLowerCase().replace(/[^a-z]/g, '');
}

export const firstName = n => String(n || '').trim().split(/\s+/)[0];

// A swap request is 'full' (the whole team needs cover) or 'partial' (one teacher
// of a pair needs a sub). Older requests were stored as `true`, which means full.
export function swapKind(claim) {
  if (!claim || !claim.swap) return null;
  return claim.swap === 'partial' ? 'partial' : 'full';
}

// Who a Sunday's claim shows as: a team's label, a typed-in sub's name, or the
// team with a sub covering one of them.
export function claimLabel(classes, classId, claim) {
  if (claim.sub) return `${claim.sub} (sub)`;
  const label = classes?.[classId]?.teams?.[claim.teamId]?.label || 'Unknown';
  return claim.coverName ? `${label} (${firstName(claim.coverName)} covering for ${firstName(claim.coverFor)})` : label;
}

// Usual-Sunday patterns a team can have. `value` is what is stored on the team.
export const PATTERNS = [
  { key: '', label: 'No fixed pattern (alternate by agreement)', value: null },
  { key: '12', label: '1st & 2nd Sundays', value: { nth: [1, 2] } },
  { key: '34', label: '3rd & 4th Sundays', value: { nth: [3, 4] } },
  { key: '23', label: '2nd & 3rd Sundays', value: { nth: [2, 3] } },
  { key: '14', label: '1st & 4th Sundays', value: { nth: [1, 4] } },
  { key: '13', label: '1st & 3rd Sundays', value: { nth: [1, 3] } },
  { key: '24', label: '2nd & 4th Sundays', value: { nth: [2, 4] } },
  { key: 'every', label: 'Every Sunday', value: { every: true } },
];
export function patternKey(p) {
  if (!p) return '';
  if (p.every) return 'every';
  return Array.isArray(p.nth) ? p.nth.join('') : '';
}

export const isFifth = d => nthOfMonth(d) === 5;

export function fmtSunday(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtMonth(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
