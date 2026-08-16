# Architecture (current)

This is the accurate description of how the site is actually built. Several older
docs in this folder describe a modular `css/` + `js/` + `tests/` structure that
was planned but never built — treat this file as the source of truth.

## What it is

A static site: one self-contained HTML file per page, each with its own inline
`<style>` and a single `<script type="module">`. No framework, no bundler, no
build step other than Tailwind compiling `src/input.css` to `dist/output.css`.

Dynamic content comes from a Firebase Realtime Database, read directly from the
browser.

## Pages

| File | Route | Purpose |
|------|-------|---------|
| `index.html` | `/` | Public home — program, announcements, events |
| `classrooms.html` | `/classrooms` | Classroom finder with interactive floorplan |
| `missionary.html` | `/missionary` | Missionary dinner signup calendar |
| `zoom.html` | `/zoom` | Zoom link and audio instructions |
| `print.html` | `/print` | Two-page printable program (landscape, folded) |
| `admin.html` | `/admin` | Edits program, events, missionaries, site settings |
| `classrooms-admin.html` | `/classrooms-admin` | Edits room assignments |

`vercel.json` sets `cleanUrls: true`, so `/classrooms` serves `classrooms.html`.

## Shared code

- **`js/firebase.js`** — the only place the Firebase config lives. Every page
  imports `db` from here. Do not paste the config into a page again.
- **`src/input.css`** — Tailwind source and the design tokens. Compiled to
  `dist/output.css` by `npm run build`.
- **`public/assets/`** — favicon, ward logo, floorplans, Zoom screenshots. These
  used to be hot-linked from a third-party CDN the ward does not control; they
  are local now, so keep them that way.

Only `index.html`, `classrooms.html`, and `missionary.html` link
`dist/output.css`. The admin, print, and zoom pages carry their own inline CSS.
Consolidating those is still an open cleanup.

## Database shape

```
sundayProgram    # { introduction, isTestimonyMeeting, testimonyMessage, sections, lastUpdated }
events           # [{ type, date, title, info, link, icon }]
missionaries     # [{ type, name, location, email, address }]
classrooms       # { sundaySchool: [...], quorumsClasses: [...] }
siteSettings     # { showClassroomsNav }
signups          # { "YYYY-M-D": { firstName, lastName, phone } }  (auth required)
```

Firebase returns an **object** rather than an array when keys are sparse, so any
code reading `events` or `missionaries` must handle both. `admin.html` has a
`toArray()` helper for this; skipping it caused the form to render empty and
then save that emptiness over real data.

## The printable program

`print.html` renders two 11in x 8.5in landscape sheets, each split into two
half-pages, designed to be folded:

- **Sheet 1** — left: events + missionaries (the back when folded); right: cover
- **Sheet 2** — left: announcements; right: the program

Every region is a fixed-height box with `overflow: hidden`, so content that is
too tall would be silently cut off. Each region therefore scales as a unit:

- All its font sizes and spacing are written as `calc(<base> * var(--fit, 1))`.
- `fitRegion()` binary-searches the largest `--fit` (down to `MIN_FIT`, 0.55)
  at which the region still fits, checking **both** height and width — the
  events and missionaries lists use `column-count`, so overflow there goes
  sideways rather than down.
- Refitting runs after load, after `document.fonts.ready` (web fonts change
  every measurement), on resize, and on `beforeprint`.
- If a region still cannot fit at `MIN_FIT`, an on-screen banner says so. It is
  hidden when printing, so the person preparing the program sees the problem
  instead of handing out a program with a speaker missing.

**Do not add fixed `pt` font sizes to a fitted region** — express them against
`var(--fit, 1)` or that element will not scale with the rest.

## Free-text fields

Details entered in the admin panel are `<textarea>`s: line breaks and spacing
are preserved and carry through to both the public page and the printed program.
Anything rendering them uses `white-space: pre-wrap`, and `normalizeMultiline()`
strips only leading blank lines and trailing whitespace.

## Known gaps

- Database rules allow unauthenticated writes to every content path.
- `signups` denies reads even to signed-in anonymous users, so the missionary
  dinner calendar cannot load its data in production.
- The admin password is a plaintext constant in the served HTML.
- Admin, print, and zoom pages still duplicate design tokens in inline CSS.
- `index.html` depends on `api.allorigins.win` as a CORS proxy for ward info.
