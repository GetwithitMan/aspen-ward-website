# Changelog

## August 17, 2026

### Missionary Dinner Calendar Hidden

Temporarily taken off the site. It could not read its data in production —
anonymous sign-in succeeds but the database denies `/signups`, so the calendar
rendered empty and nobody could sign up.

- Removed the "Missionary" link from the main navigation.
- `/missionary` now redirects to the homepage, so the page is unreachable even
  for anyone with the URL bookmarked. The redirect is deliberately **temporary**
  rather than permanent, so browsers do not cache it and make the page hard to
  bring back.
- `missionary.html` is left in place and unchanged, with a comment at the top
  explaining why it is hidden and exactly how to restore it.

**Unaffected:** the "Missionaries & Military" list on the printed program and in
the admin panel is a separate feature and still works normally.

## August 16, 2026 (part 3)

### Unsaved Changes Are Now Visible in the Admin Panel

The admin panel does not auto-save, and there was nothing on screen indicating
that edits were still only in the browser.

- **Save buttons turn amber with a nudging arrow** the moment anything is
  edited, and return to green once saved. All twelve light up together, because
  every one of them runs `saveProgram()` and writes the entire form — they are
  not per-section saves, which was the source of the impression that each
  section had to be saved separately.

- **Logging out with unsaved edits now asks first.** It previously discarded
  them silently: the browser's unload warning never fired because logging out
  does not navigate away, it just swaps which panel is visible.

- Colour is not the only signal — the buttons also carry a
  "You have unsaved changes" tooltip, and the arrow stays visible (just still)
  under `prefers-reduced-motion`.

## August 16, 2026 (part 2)

### Printable Program Now Fits Its Two Pages

The printed program is two landscape sheets, each split into half-pages, and
every region has a fixed height with `overflow: hidden`. Anything too tall was
**silently cut off** — a speaker could simply disappear from the program with no
warning. Measured on a busy week (20 program rows, 7 announcements, 6 events,
7 missionaries), 10 items were being lost.

- **Every region now scales to fit.** Font sizes and spacing are expressed
  against a `--fit` multiplier, and each region binary-searches the largest
  value at which its content still fits. Same busy week now loses nothing.

- **The program section had no fit logic at all** — only `fitty`, which shrank
  names horizontally and did nothing about height. It is now fitted like every
  other region.

- **Fit checks width as well as height.** The events and missionaries lists use
  `column-count`, so overflow there spills sideways rather than downward and a
  height-only check missed it entirely.

- **Refits at the right moments** — after load, after web fonts finish loading
  (they change every measurement), on resize, and before printing. Previously a
  single fixed 500ms timeout.

- **Missionaries print in two columns** when there are four or more, roughly
  doubling capacity before any shrinking is needed.

- **Events and missionaries share space sensibly.** The rigid 2/3–1/3 split
  wasted room whenever one side was short; missionaries now take what they need
  up to 45% and events get the rest.

- **On-screen warning when content genuinely cannot fit.** Rather than printing
  a program with people missing, the preview shows a banner naming the region.
  Hidden when printing.

- **Removed the `fitty` dependency** and its CDN script — no longer needed now
  that regions scale as a whole, and one less third-party request.

### Multi-line Program Details

- **Details fields are now textareas.** Pressing Enter creates a real line
  break, and the field grows as you type instead of scrolling. Applies to
  program items, announcements, and event details.

- **Spacing is preserved exactly.** Line breaks and repeated spaces carry
  through to both the public page and the printed program (`white-space:
  pre-wrap` everywhere they are rendered). Only leading blank lines and trailing
  whitespace are stripped.

- **Long names wrap instead of shrinking.** `.row-name` was `white-space:
  nowrap` with `fitty` shrinking oversized text; it now wraps, which is both
  more legible and what makes typed line breaks work.

### Cleanup

- **One Firebase config.** It was copy-pasted into all six pages; it now lives
  in `js/firebase.js` and every page imports `db` from there.

- **Removed `mobile.html`** — 1,469 orphaned lines, linked from nowhere, still
  reading the pre-Firebase Google Sheets feed, but live at `/mobile` serving a
  stale program to anyone who found it.

- **Removed dead PWA scaffolding** — `public/service-worker.js` cached ~25 files
  that do not exist (`/css/variables.css`, `/js/app.js`, …) and
  `public/manifest.json` pointed at icons that were never generated. Neither was
  referenced by any page.

- **Images are hosted locally.** The building floorplans, ward logo, and Zoom
  screenshots were hot-linked from a third-party GoHighLevel CDN bucket the ward
  does not control. They now live in `public/assets/`.

- **Documentation matches reality.** Added `docs/ARCHITECTURE.md` describing how
  the site is actually built; flagged the older docs that describe a modular
  `css/` + `js/` + `tests/` structure that was planned but never built.

- **5th Sundays** no longer claim to be Priesthood/RS/YM/YW week in the
  classroom finder; they show the date without asserting a schedule.

## August 16, 2026

### Code Review Fixes

**Bug fixes**

- **Program introduction no longer gets overwritten** - `loadWardInfo()` and `loadProgram()` run in parallel, and the ward-info handler unconditionally replaced the intro with the hardcoded string "A quick look". Whichever request finished last won, so the message written in the admin panel appeared or vanished at random. The program's own introduction now always wins.

- **"Hide banner" and "hide events" switches now work reliably** - Both toggles live in the ward info sheet, but the banner and events code read them before that sheet had loaded. They now await ward info instead of racing it.

- **Fixed stray text in the hero subtitle** - The page rendered `"Sunday Worship Service · ."` with a dangling separator and period.

- **Fixed classroom highlight timer** - Selecting a room started a 15-second auto-clear that was never cancelled, so picking a second room inherited the first room's countdown and the highlight could vanish almost immediately. Tab switches now clear the highlight through the same path.

- **Missionary calendar no longer deletes data while rendering** - `clearPastSignups()` ran inside `renderCalendar()`, which is the Firebase listener callback, so every render issued deletes that re-triggered the listener. Pruning now happens once per page load.

- **Admin saves are atomic** - Four sequential `set()` calls were replaced with a single multi-path `update()`, so a mid-save failure can no longer leave the database half-written. Site settings are now written by key instead of replacing the whole `siteSettings` node.

- **Fixed data loss when Firebase returns objects** - Firebase returns an object rather than an array when keys are sparse. The admin panel only handled arrays, so it rendered an empty form and the next save wrote that emptiness over the real events and missionaries.

- **Removed the event icon workaround** - `renderEvents()` took positional arrays, which is how the icon column shifted links into the wrong slot (patched around on January 31 with an empty placeholder). It now takes records, and the admin panel preserves any stored icon instead of discarding it.

- **Unsaved changes warning in admin** - Navigating away mid-edit silently discarded everything.

- **Theme fixes** - The classroom finder wrote its auto-detected theme to localStorage, so the page permanently stopped following the operating system. It now stores only a deliberate toggle. Both public pages resolve the theme before first paint, removing the light-to-dark flash.

**Correctness / hardening**

- **HTML escaping on all rendered content** - `index.html` and `print.html` interpolated database text straight into `innerHTML`, so a `<`, `&`, or quote typed into an announcement broke the rendering. Added proper escaping; the misleadingly named `sanitize()` helper (which only converted newlines) is now `formatMultiline()`. Links are validated as `http(s)` before rendering.

- **Subresource integrity** on the `fitty` CDN script in the printable program.

**Polish**

- **Favicon is now linked** - `public/assets/favicon.svg` existed but no page referenced it.
- **Added meta descriptions and Open Graph tags** so shared links show a preview.
- **Admin and print pages marked `noindex`.**
- Removed dead code: `zoomToRoom()` and unused pan variables in the classroom finder, debug `console.log` calls in the printable program and missionary page.

## January 31, 2026

### Event Links Fix

- **Fixed event links not working** - Links added to events via admin were displaying as plain text instead of being clickable. The Firebase data conversion was missing the icon placeholder field, causing the link to be placed in the wrong position.

- **Link now applies to event title** - When an event has a link, the title (e.g., "Stake Adult Fireside") is now the clickable element instead of the time/details.

- **Added "Click for more info" indicator** - Events with links now display a small italic hint below the time to let users know the title is clickable.

## January 26, 2026

### Updates for Classroom Finder

- **New Classroom Finder Page** (`/classrooms`)
  - Interactive floorplan with room highlighting
  - Tab switching between Sunday School and Priesthood/RS/YM/YW schedules
  - Auto-selects correct tab based on which Sunday of the month
  - Mobile-optimized with pinch-to-zoom, drag-to-pan, and zoom controls
  - Selected room card displays prominently on mobile
  - Dark/light theme support

- **New Classroom Admin Page** (`/classrooms-admin`)
  - Password-protected admin interface (shares auth with main admin)
  - Add/remove room assignments for each schedule type
  - Dropdown room selector with all building rooms
  - Floorplan reference image for identifying room numbers
  - Saves directly to Firebase

- **Main Admin Updates** (`/admin`)
  - Added "Site Settings" section
  - Toggle to show/hide Classrooms link in main navigation
  - Direct link to Classroom Admin page

- **Navigation Updates** (`/index.html`)
  - Conditional "Classrooms" nav link (controlled via admin Site Settings)
  - Loads visibility setting from Firebase `siteSettings.showClassroomsNav`

- **Firebase Schema Additions**
  - `classrooms/sundaySchool` - Array of room assignments for 1st/3rd Sundays
  - `classrooms/quorumsClasses` - Array of room assignments for 2nd/4th Sundays
  - `siteSettings/showClassroomsNav` - Boolean for nav link visibility
