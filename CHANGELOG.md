# Changelog

## September 6, 2026 (part 10)

### A Label for the QR

Announcements gained an optional **QR label** — the caption printed under the
code — defaulting to **"Scan for more info."** Set it to "Scan to order," "Scan
to RSVP," "Scan to donate," or anything else per announcement. The same label
also names the link on the website (falling back to "Open details" there when
unset). Stored as an optional `linkLabel` field, absent unless used.

## September 6, 2026 (part 9)

### QR Codes and Split Announcements

Two ways to keep the printed program short without losing anything.

- **A link becomes a QR.** Give an announcement a link and the printed program
  prints a QR code beside it ("Scan to open") — the Empty Bowls fundraiser's
  "order online," a sign-up form, an event page. On the website the same link is
  just tappable, so the QR is print-only.
- **An "online only" box.** Each announcement now has a second text box that does
  not print. The program prints the first box plus a "Scan for the rest" QR that
  goes to the website's announcements section (which shows every announcement in
  full); the website shows both boxes together. So a long announcement — the ward
  history call for photos, say — prints as a short, clean teaser while the full
  text stays a scan away. An important announcement with nothing in the second
  box prints in full, as before.

The QR codes are generated on the page from a small library vendored into
`js/qrcode.js` (MIT), rendered as inline SVG — no third-party QR service, in
keeping with the assets-stay-local rule. Each code has a size floor so it stays
scannable even when the fit pass shrinks the surrounding type.

Data: an announcement item gains an optional `moreOnline` field (absent unless
used, so other program sections are untouched). The website carries it through
the existing rows conversion as a fifth field and shows it after the printed
text.

Seeded the Empty Bowls announcement and split the ward-history announcement into
a printed teaser plus its online remainder.

## September 6, 2026 (part 8)

### Stake and Ward Recommend Interviews, Separately

Recommend interviews come from two places — the stake (a scheduled time and
place) and the ward (usually by appointment) — and one combined list could not
say which was which. The interviews section is now two labeled blocks, **Stake**
and **Ward**, each with its own day/time rows plus a location, a note, and a
contact line. A block appears only when it has something in it.

- A new **2nd–5th** cadence was added for the common "every Sunday except fast
  Sunday" pattern, so the stake's Sunday interviews read "2nd–5th Sunday" rather
  than needing four separate rows.
- The **location** line covers cases like the stake interviews being held at the
  Fruita Building Stake office rather than the meetinghouse.
- The **note** line carries the by-appointment case ("By scheduling with the
  executive secretary") for a block with no fixed time, and the **contact** line
  gives a place for a name or number.

The `temple.interviews` field changed from a flat list to
`{ stake: { rows[], location, note, contact }, ward: { … } }`. The website shows
each as its own card; the printed program shows each as its own sub-heading under
the Temple section.

Seeded with the Grand Junction stake interviews (2nd–5th Sunday, 3:30–4:30 PM,
Fruita Building Stake office) and the ward's by-appointment line.

## September 6, 2026 (part 7)

### Temple Hours: a Real Schedule Builder

The first pass (part 6) linked out to the temple's official schedule. The ward
wanted the actual hours on the page and the printed program, so the Temple
section is now a proper schedule builder rather than a link.

**In the admin**, the Temple card holds three lists, all edited the same simple
way:

- **Hours** — add a day, pick open and close times with the native time picker,
  and set a cadence. A day with a break in the middle (open in the morning,
  again in the evening) gets a second time range with "Add time range," so
  Wednesday prints as "8:30 AM – 12:30 PM and 5:30 PM – 8:30 PM." Cadence covers
  the ordinary weekly day and the periodic one — set it to "3rd" and Friday
  prints as "3rd Friday."
- **Closures** — a start date, an optional end date for a range (a maintenance
  closure), and an optional reason. A single day prints with its weekday
  ("Saturday, October 3, 2026"); a range collapses sensibly ("October 5 – 19,
  2026").
- **Recommend interviews** — the same day/time builder, plus an optional note
  ("and by appointment") and a contact line.

Half-filled rows never reach the database: a day with no times, or a blank time
range, is dropped on save.

**On the website**, these render as cards in a Temple section styled like
Announcements — hours as a day/time list, closures flagged in red, interviews in
their own card.

**On the printed program**, the Temple section sits on the inside-left panel
below Ward Announcements, styled to match. The two now share that panel's
fitted region: a wrapper around both is measured as one unit, so a heavy
announcements week and a full set of temple hours scale together to fill the
space rather than colliding. The announcements' one-versus-two-column trial is
preserved.

The `temple` node grew to hold the new shape:
`{ show, templeName, address, scheduleUrl, hours[], closures[], interviews[],
interviewsNote, interviewsContact, notes }`, where each hours/interviews entry is
`{ day, cadence, ranges: [{ open, close }] }` and each closure is
`{ start, end, reason }`. Times are stored 24-hour and formatted to 12-hour for
display. It still needs a read/write rule in the Firebase console before it can
be populated.

## September 6, 2026 (part 6)

### A Temple Section, in One Place

Temple hours and recommend interviews used to be typed by hand into a weekly
announcement — which is why they felt unofficial and quietly went stale. They
now have their own home: a single **Temple** area in the admin that feeds both
the website and the printed program.

- **Hours point at the source of truth, not a copy.** Rather than re-typing
  session times that drift out of date, the admin holds a link to the temple's
  own page on ChurchofJesusChrist.org. That page is the authoritative schedule,
  so the hours are correct by construction and never need maintaining. On the
  website it renders as a "View temple schedule ↗" button; on the printed
  program, where a link cannot be clicked, it prints as a short readable
  address (`churchofjesuschrist.org/temples/…`).
- **Recommend interviews live beside it.** When and where the bishopric is
  available, plus an optional contact line, kept in the same section so the
  whole thing is changed in one place.
- **It reveals itself only when it has something to say.** A show/hide toggle,
  and the section stays hidden on the site and the program until it is turned on
  and given real content — matching how Announcements and Classrooms already
  appear only when populated. An interview-only week shows just the interviews,
  with no bare "Temple" heading left floating.
- **Built on the existing section engine.** The admin card registers as one more
  entry in `SECTION_SPEC` (a new `temple` kind), so it saves independently, marks
  itself dirty, and re-reads on open exactly like every other section — no new
  save machinery. The public side reuses the announcement-card styling, so it
  looks native and needed no new CSS (the build is unchanged).

Data lives in a new `temple` Firebase node:
`{ show, templeName, scheduleUrl, address, wardTempleDay, interviews,
interviewsContact, notes }`.

## September 6, 2026 (part 5)

### Small Things That Make It Feel Good to Read

The research here is [processing fluency](https://pages.ucsd.edu/~pwinkiel/reber-schwarz-winkielman-beauty-PSPR-2004.pdf)
(Reber, Schwarz & Winkielman): the more easily something is read, the more
pleasant it feels — and the reader never attributes the pleasure to the ease.
They credit the thing itself. So most of what makes a page *feel* good is the
same work that makes it easy to read, which the last four rounds of changes
already banked.

Two additions:

- **The line under the ward logo is set in small caps** instead of full
  capitals. "The Church of Jesus Christ of Latter-day Saints" is the longest
  line on the cover and the first thing anyone reads, and full capitals cost
  readers 10-20% of their reading speed — every word becomes the same rectangle,
  so the eye has to spell it out letter by letter instead of recognising the
  shape. Small caps keep the quiet, formal look and give the words their shapes
  back. It is also how the Church sets its own name.
- **One warm ink palette.** The greys had drifted into a mix of neutral (#222,
  #444, #555, #666) and warm. Warm greys read as softer than neutral ones, and
  one consistent family is easier to process than several. Every value was
  matched in lightness to the one it replaced, so nothing lost contrast — the
  two lightest gained a little (row labels 5.3:1 → 6.1:1).

Considered and left alone:

- **A warmer heading font.** Curved letterforms do read as friendlier than
  angular ones, but that research concerns shape extremes, not the difference
  between two classical serifs. Set side by side against Crimson Pro, Playfair
  Display's higher contrast gives "Aspen Ward" presence the warmer option loses,
  for no warmth anyone would notice.
- **The type scale.** Thirteen sizes sounded like too many, but no two sizes
  within 5% of each other ever appear in the same place, so nothing reads as an
  accident.

## September 6, 2026 (part 4)

### Typographic Polish

Small print-typography wins, each measured against the real program rather than
taken on faith:

- **Long announcements are hyphenated.** They were the only real running prose
  on the sheet and were losing a third of their width to ragged line ends. The
  same text now sets in 26 lines instead of 32, which the fit pass hands
  straight back as larger type (91.7% → 93.3%). Only three hyphens appear in
  this week's copy, so there is no ladder down the margin.
- **Paragraphs never end on a stranded word** (`text-wrap: pretty`), and a
  two-line heading splits evenly instead of dropping one word onto its own line
  (`text-wrap: balance`).
- **A heading can no longer be left at the foot of a column**, and a lone line
  of a paragraph cannot be stranded at the top or bottom of one, for the weeks
  when announcements fall back to two columns.

Two things were tested and deliberately **not** adopted:

- **Tabular figures.** The hope was that they would line up the temple hours.
  Measured, they move the columns by about 2px — the misalignment comes from the
  spaces typed into the admin panel, not from digit widths, so this would have
  been change for its own sake.
- **A different body font.** Crimson Pro has a smaller x-height than Georgia or
  Charter, which at first looks like a legibility argument for switching. But it
  is also proportionally narrower, and on a page that scales type to fill a
  fixed box what matters is x-height per unit of width. By that measure Crimson
  Pro (0.978) sits level with Charter (0.981) and ahead of Georgia (0.964).
  Switching would trade a bigger x-height for a smaller point size and gain
  nothing.

## September 6, 2026 (part 3)

### Three Fixes to the Printed Program

**Events could vanish entirely.** The print page only accepted the events list
as an array, but Firebase hands back an object whenever the keys are sparse —
delete the middle one of three events and the rest arrive as `{0:…, 2:…}`. A
page full of events then printed "No upcoming events." The home page and the
missionaries list already allowed for both shapes; the print page now does too.

**Missionaries were capped at 45% of the back page.** A long missionary list was
shrunk to fit that 45% even when the events above it ended halfway down and the
space was going spare. The column is now divided by what each side actually
needs — with nine missionaries and one event they get 78% of it instead of 45%,
and a side that needs less than its share hands the surplus back rather than
printing a gap. Neither side can be squeezed below a quarter of the column.

**A heavy announcements week only had one answer: shrink the type.** Announcements
now fall back to two columns, which hold roughly twice the text at a given size
— the same trick the events list already uses. Both layouts are measured and the
one that prints larger wins, so a normal week is untouched and stays in a single
column.

## September 6, 2026 (part 2)

### Easier to Read at a Glance

The program was a grid of same-sized rows: "Presiding" and "Brother Hardee"
were set in identical type, so nothing told the eye which was the question and
which was the answer.

- **Names lead, labels recede.** Labels are smaller and softer grey; the names
  people are actually looking for stay full size and near-black. Size and
  weight carry the hierarchy rather than colour, because the program is printed
  in greyscale and the green reduces to grey on paper.
- **No cost in type size.** The lighter labels open the page up on their own, so
  the scale-to-fit pass still runs at 94% and the names print at the same size
  as before.
- **"Administration of the Sacrament" is centred and italic.** It has no label,
  and right-aligned it read as an answer to a missing question.
- **The testimony passage is framed by hairline rules** instead of a grey panel.
  Browsers drop background fills when printing unless you tick "Background
  graphics", so the panel was only ever visible on screen — the rules print.
- **Announcement headings pick up the ward green**, with more space between
  announcements and roomier line spacing on the long ones.

## September 6, 2026

### Long Hymn Titles Stay on One Line

A hymn like `#62 - All Creatures Of Our God And King` was wider than the name
column on the printed program, so it wrapped and left "And King" stranded on a
line of its own.

The number and the title are now sized separately. The number keeps the row's
full size; the title shrinks only as far as it has to, so the hymn sits on one
line:

> Opening Hymn                #62 - All Creatures Of Our God And King

- **Only the hymns that need it shrink.** In this week's program, `#1007 - As
  Bread Is Broken` and `#134 - I Believe In Christ` already fit, and print
  untouched at full size.
- **The whole program gets bigger.** Recovering that wrapped line let the
  scale-to-fit pass raise the program from 92% to 97%, so every other row —
  speakers, presiding, benediction — prints slightly larger too.
- **A title too long to rescue wraps as before.** Below about three quarters of
  full size the title would be too small to read next to a full-size number, so
  it goes back to wrapping at full size rather than printing tiny *and*
  wrapped.
- Rows that are not hymns are untouched. A row only counts as a hymn if it
  starts with `#` and a number, or the label says hymn/song/musical — so
  `2 Nephi 2:25 - Men are that they might have joy` is left alone.

## August 18, 2026 (part 3)

### Prompt to Save When Leaving a Section

Switching sections used to just fold the current one away, leaving any unsaved
edits sitting there quietly. Easy to forget, and the longer edits sit unsaved
the more likely someone else saves that section first.

Leaving a section with unsaved changes now asks:

> You have unsaved changes in Opening.
> OK — save them now
> Cancel — leave them unsaved for the moment

- Applies both to opening a different section and to folding up the one you are
  editing.
- **Declining is safe** — the edits stay in the form and the section stays
  amber until you save or reload. Nothing is discarded either way.
- No prompt when the section has no changes, so it does not nag.

## August 18, 2026 (part 2)

### Two People Can Now Edit at the Same Time

Reported after real work was lost: one person saved, then the other saved and
the first person's changes vanished — even though they were editing different
sections.

**The cause.** Every "Save Changes" button wrote the *entire* form. All twelve
of them. So the sequence was:

1. Both admins open the panel and load the same snapshot.
2. He edits Speakers and saves. The database now has his speakers.
3. Your form still holds the speakers from when *you* loaded the page.
4. You edit something else and save — your save rewrites everything, stale
   speakers included, and his work is gone silently.

Working on different sections gave no protection at all, and the
section-labelled buttons made it look like it should have.

**The fix.** Each section now owns one database path and saves only that path:

- `Speakers` writes `sundayProgram/sections/speakers` and nothing else.
- **Opening a section re-reads it**, so a colleague's saved edits appear the
  moment you expand it.
- **One section open at a time.** Opening one closes the others, which is what
  makes the re-read on open reliable.
- **Saving re-reads that section**, so what you see is what is actually stored.
- **Only the section you changed turns amber**, which now matches what its
  button does. The header button saves just the changed sections — never the
  untouched ones, since writing those is what destroyed other people's work.
- Reopening a section with unsaved edits keeps your edits rather than
  overwriting them with the stored copy.
- The old whole-form writer was deleted outright, so it cannot be called again
  by accident.

**Verified** by driving two admin sessions at once against a scratch copy of the
data. With the new code both editors' work survives and each sees the other's on
expanding the section. Running the identical scenario against the previous code
loses the edits — confirming the test detects the bug rather than just passing.

Also added a `main` landmark to the printable program (accessibility 96 to 100).

## August 18, 2026

### Performance, Accessibility and Platform Update

Acting on the six-month review. Measured before and after in the same run with
caching disabled, on a simulated phone.

| Page | Before | After | |
|---|---|---|---|
| /zoom | 2,044 KB | 262 KB | **-87%** |
| /classrooms | 419 KB | 233 KB | **-44%** |
| / (home) | 166 KB | 100 KB | **-40%** |
| /print | 225 KB | 159 KB | **-29%** |

Lighthouse on the home page went from 75 / 91 / 100 / 100 to **98 / 100 / 100 /
100**. Every public page now scores 100 for accessibility.

**Images**

- Converted to WebP at sensible dimensions. The worst offender was the church
  logo on the Zoom page: a 3840x2160 PNG (847 KB) displayed at 150px wide, now
  15 KB. The annotated Zoom screenshot went 929 KB to 48 KB with its small text
  still legible at 1:1.
- The print cover logo was deliberately **left as JPEG** - WebP was no smaller
  at print quality, and that image goes on paper.
- Every image now declares width and height, so nothing reflows as they load.
  The two instruction screenshots load lazily.

**Layout stability (CLS 0.751 -> 0.076 first visit, 0.017 returning)**

The page used to jump badly while loading. Three separate causes, each measured
rather than guessed:

- The header grew ~59px when the Announcements nav link appeared, wrapping the
  nav onto a second row and shoving the whole page down. Announcements now
  default to shown, since a ward nearly always has them.
- The program, events and announcements areas render skeleton placeholders, and
  remember their previous height so returning visitors get the space reserved
  exactly.
- The hero subtitle and meta line reserve their height rather than growing when
  ward details arrive.

**Fonts**

- Self-hosted as variable fonts (one file per family instead of one per weight),
  removing a render-blocking third-party request. First contentful paint on the
  home page went from 464ms to 72ms; on the print page, 2,224ms to 40ms.

**Accessibility**

- Event cards were missing `role="listitem"`, so screen readers announced the
  events list as malformed.
- Muted text was 3.85:1 where 4.5:1 is required; the token is now 5.29:1.
- The Zoom button was 3.33:1 against white, and that page had no main landmark.

**Smaller pages, no SDK where it is not needed**

- The home and printable program pages only ever read, so they now use plain
  database requests instead of the ~74 KB Firebase SDK. Pages that need live
  updates (classroom finder) or write (admin panels) still use the SDK.

**Platform features new since this was built**

- `field-sizing: content` (Baseline June 2026) now handles the growing admin
  textareas natively; the JavaScript remains as a fallback for older browsers.
- Cross-document view transitions cross-fade navigation, and speculation rules
  prerender the public pages. Both degrade silently where unsupported.

**Housekeeping**

- Removed the dead `api.allorigins.win` fallback, which returned 5xx after 9-20
  seconds every time and could stall the events section. Requests are now
  bounded by a 6-second timeout.
- Added security headers, long cache lifetimes for fonts and images, a
  `robots.txt` and `sitemap.xml`, link-preview images and canonical URLs.
- Dependencies updated (Tailwind 4.1.18 to 4.3.3).

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
