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

- **`js/config.js`** — the only place the Firebase connection details live. It
  deliberately has no imports, so a page can use it without pulling in the SDK.
  Do not paste the config into a page again.
- **`js/db-read.js`** — `readPath(path)`, a one-shot database read over plain
  HTTPS. The database returns exactly what `snapshot.val()` would. Read-only
  pages (home, printable program) use this and skip the ~74 KB SDK entirely.
- **`js/firebase.js`** — the SDK connection, for pages that need live updates
  (classroom finder) or that write (admin panels).
- **`public/assets/fonts/`** — self-hosted variable fonts, one file per family
  covering all weights. Self-hosting removes a render-blocking third-party
  request; variable files avoid one download per weight.
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
then save that emptiness over real data. `print.html` made the same mistake
independently — it required an array and printed "No upcoming events" for a full
list whenever a middle event had been deleted.

## The printable program

`print.html` renders two 11in x 8.5in landscape sheets, each split into two
half-pages, designed to be folded:

- **Sheet 1** — left: events + missionaries (the back when folded); right: cover
- **Sheet 2** — left: announcements; right: the program

### Scaling each region to its box

Every region is a fixed-height box with `overflow: hidden`, so content that is
too tall would be silently cut off. Each region therefore scales as a unit:

- All its font sizes and spacing are written as `calc(<base> * var(--fit, 1))`.
- `fitRegion()` binary-searches the largest `--fit` (down to `MIN_FIT`, 0.55)
  at which the region still fits, checking **both** height and width — the
  events, missionaries and announcements lists can all use `column-count`, so
  overflow there goes sideways rather than down.
- Refitting runs after load, after `document.fonts.ready` (web fonts change
  every measurement), on resize, and on `beforeprint`.
- If a region still cannot fit at `MIN_FIT`, an on-screen banner says so. It is
  hidden when printing, so the person preparing the program sees the problem
  instead of handing out a program with a speaker missing.

**Do not add fixed `pt` font sizes to a fitted region** — express them against
`var(--fit, 1)` or that element will not scale with the rest.

`fitAllRegions()` wraps three further passes around that search. They exist
because a single `--fit` per region cannot express everything the page needs.

### Hymn titles: a second scale inside the row

A hymn is entered as one string, `#62 - All Creatures Of Our God And King`, and
is wider than the name column. Wrapping it put "And King" on a line of its own.

`splitHymn()` divides the string into a number and a title at render time, and
`fitHymnTitles()` gives the title its own `--name-fit` multiplier so the number
keeps the row's full size while the title shrinks just enough to stay on one
line. The scale is a direct ratio of available width to natural width — measured
with a `Range` against a `nowrap` line — not a search.

Two things to know before changing it:

- The title must be re-fitted at **every** candidate `--fit`, which is why
  `fitRegion()` calls it through its `applyFit()` helper rather than once at the
  end. The column width is fixed in inches while the text scales, so the ratio
  changes at every step.
- Below `MIN_HYMN_FIT` (0.72) the title reverts to full size and wraps. Shrinking
  a title that is going to wrap anyway just makes it small *and* wrapped.

`createSectionHTML()` also marks a row with no label — "Administration of the
Sacrament" — as `.is-standalone`, which centres it in italic. Right-aligned it
read as an answer to a missing question.

### The back page: events over missionaries

`allocateBackPage()` divides the left half of sheet 1 between the events list and
the missionaries list. It measures both at natural height and full size, then:

- If both fit, events take the slack so missionaries stay against the bottom.
- Otherwise each side gets a share of the column proportional to what it needs,
  with a floor of `MIN_COLUMN_SHARE` (25%) so neither is pushed off the page. A
  side allocated more than it has content for hands the surplus back rather than
  printing a gap.

This replaced a fixed `max-height: 45%` on the missionaries section, which shrank
a long missionary list to fit 45% even when the events above it ended halfway
down the page.

### Announcements: two columns before small type

`fitAnnouncements()` fits the announcements once in a single column and, if that
lands below `ANNOUNCEMENT_COLUMN_THRESHOLD` (0.85), again in two, keeping
whichever prints larger. A second column holds roughly twice the text at a given
size, so a heavy week gets narrower measure instead of type at the 0.55 floor.
An ordinary week never leaves a single column.

### Line breaking

`.announcement-description` and `.event-info` are the two prose blocks on the
sheet. Both carry `hyphens: auto` (which needs the `lang` attribute on `<html>`)
and `text-wrap: pretty`; the announcements add `orphans`/`widows` for the
two-column case. Headings use `text-wrap: balance` and `break-after: avoid`.

Hyphenating the announcements is what pays for itself: this week's copy sets in
26 lines instead of 32, which the fit pass returns as larger type.

Hyphenation is deliberately **confined to prose**. Do not extend it to
`.row-name`, `.hymn-title` or `.missionary-contact` — people's names, hymn
titles and email addresses should never be broken across lines.

## Saving in the admin panel

Each section owns exactly one database path, listed in `SECTION_SPEC` in
`admin.html`, and its Save button writes **only that path**. This is what lets
two people edit at once: previously every button wrote the whole form, so
whoever saved second silently overwrote the other with the stale copy their
browser was holding.

Rules worth keeping:

- **Never reintroduce a whole-form write.** If you add a section, give it an
  entry in `SECTION_SPEC` and a `data-section` on its card; do not add a helper
  that writes several sections at once. The header button deliberately saves
  only the sections marked dirty.
- **Opening a section re-reads it** so other people's saves show up, and only
  one section is open at a time, which is what makes that reliable. A section
  with unsaved edits is *not* refreshed — your edits win until you save.
- Dirty state is tracked per section in `dirtySections`, which drives both the
  amber buttons and what the header button writes.
- **Leaving a section with unsaved edits prompts to save** (`offerToSaveBefore`),
  on both switching away and collapsing. Declining is deliberately harmless:
  collapsing is presentational, so the edits remain in the form and the section
  stays marked dirty.

## Free-text fields

Details entered in the admin panel are `<textarea>`s: line breaks and spacing
are preserved and carry through to both the public page and the printed program.
Anything rendering them uses `white-space: pre-wrap`, and `normalizeMultiline()`
strips only leading blank lines and trailing whitespace.

## Performance rules

These are easy to undo by accident:

- **Images are WebP at display size, with `width`/`height` on every `<img>`.**
  Those attributes are what stop the page reflowing as images load — if you add
  an image without them, layout shift comes back. Any CSS that sets an image's
  width also needs `height: auto`, or the aspect ratio breaks.
- **The print cover logo stays JPEG.** WebP was no smaller at print quality.
- **Content areas reserve their space.** The program, events and announcements
  containers render skeleton placeholders and remember their previous height in
  `localStorage`, so returning visitors see no jump. The renderers clear both.
- **The Announcements nav link and section default to shown.** An extra nav link
  appearing later wraps the nav to a second row and moves the whole page down.

## Known gaps

- Database rules allow unauthenticated writes to every content path.
- `signups` denies reads even to signed-in anonymous users, so the missionary
  dinner calendar cannot load its data in production.
- The admin password is a plaintext constant in the served HTML.
- Admin, print, and zoom pages still duplicate design tokens in inline CSS.
- `index.html` depends on `api.allorigins.win` as a CORS proxy for ward info.
