// One-time setup for the teaching calendar: writes the classes and teacher
// logins to /teaching. It never touches /teaching/sundays, so rerunning cannot
// erase anyone's sign-ups, and it refuses to run if teachers already exist.
//
//   node scripts/seed-teaching.mjs
//
// Password = first name + last initial. The CSV below (kept OUTSIDE the repo)
// lists them; the database stores just a hash of each one.
import { writeFileSync } from 'node:fs';
import { firebaseConfig } from '../js/config.js';
import { hashLogin, makeUsername, makePassword } from '../js/teaching.js';

const CSV_PATH = new URL('../../teacher-logins.csv', import.meta.url);
const DB = firebaseConfig.databaseURL;

const CLASSES = [
  { id: 'nursery', name: 'Nursery', teams: [
    { label: 'Kitrick Galloway & Jordan Trane', members: ['Kitrick Galloway', 'Jordan Trane'] },
    { label: 'Shaunel & Brian Lewis', members: ['Shaunel Lewis', 'Brian Lewis'] },
  ] },
  { id: 'sunbeams', name: 'Sunbeams, CTR 4', teams: [
    { label: 'Emily White & Shileen Molde', members: ['Emily White', 'Shileen Molde'], pattern: { nth: [1, 2] } },
    { label: 'Jase & Kayse Craig', members: ['Jase Craig', 'Kayse Craig'], pattern: { nth: [3, 4] } },
  ] },
  { id: 'ctr56', name: 'CTR 5, CTR 6', teams: [
    { label: 'Porter & Kristen Romm', members: ['Porter Romm', 'Kristen Romm'] },
    { label: 'Devin & Dana Reed', members: ['Devin Reed', 'Dana Reed'] },
  ] },
  { id: 'valiant78', name: 'Valiant 7, Valiant 8', teams: [
    { label: 'Jackson Stuart & Charley Howell', members: ['Jackson Stuart', 'Charley Howell'], pattern: { every: true } },
  ] },
  { id: 'valiant9', name: 'Valiant 9', teams: [
    { label: 'Pam Holder & Jana Taggart', members: ['Pam Holder', 'Jana Taggart'], pattern: { nth: [2, 3] } },
    { label: 'Rod Ferree & Brant Richardson', members: ['Rod Ferree', 'Brant Richardson'], pattern: { nth: [1, 4] } },
  ] },
  { id: 'valiant10', name: 'Valiant 10', teams: [
    { label: 'Linda Fine & Alyssa Trane', members: ['Linda Fine', 'Alyssa Trane'], pattern: { nth: [3, 4] } },
    { label: 'Shaina Clawson & Lacee Cordova', members: ['Shaina Clawson', 'Lacee Cordova'], pattern: { nth: [1, 2] } },
  ] },
];

const existing = await (await fetch(`${DB}/teaching/people.json`)).json().catch(() => null);
if (existing) { console.error('Teachers already exist in /teaching/people. Use teaching-admin instead.'); process.exit(1); }

const classes = {}, people = {}, csv = ['Name,Class,Username,Password'];
CLASSES.forEach((c, i) => {
  classes[c.id] = { name: c.name, order: i, teams: {} };
  c.teams.forEach((t, ti) => { classes[c.id].teams[`t${ti + 1}`] = { label: t.label, members: t.members, ...(t.pattern && { pattern: t.pattern }) }; });
});

for (const c of CLASSES) for (const [ti, t] of c.teams.entries()) for (const name of t.members) {
  let username = makeUsername(name);
  // Devin and Dana Reed would both be "dreed": the later one gets two letters.
  if (people[username]) username = (name.slice(0, 2) + name.split(' ').pop()).toLowerCase();
  const password = makePassword(name);
  people[username] = { name, classId: c.id, teamId: `t${ti + 1}`, hash: await hashLogin(username, password) };
  csv.push([name, c.name, username, password].map(v => `"${v}"`).join(','));
}

for (const [path, body] of [['classes', classes], ['people', people]]) {
  const res = await fetch(`${DB}/teaching/${path}.json`, { method: 'PUT', body: JSON.stringify(body) });
  if (!res.ok) { console.error(`Writing ${path} failed: ${res.status} ${await res.text()}`); process.exit(1); }
}
writeFileSync(CSV_PATH, csv.join('\n') + '\n');
console.log(`Seeded ${CLASSES.length} classes and ${Object.keys(people).length} teachers.\nLogins: ${CSV_PATH.pathname}`);
