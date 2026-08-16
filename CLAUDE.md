# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Tailwind watch + dev server on port 3000
npm run build        # Compile and minify CSS to dist/output.css
npm run watch        # Watch CSS changes only
```

Node version requirement: >= 18

## Deployment

Deploy to Vercel:
```bash
vercel --prod --yes
```

The site uses `cleanUrls: true` so `/classrooms` serves `classrooms.html`.

## Architecture

This is a static HTML website with Firebase Realtime Database for dynamic content. No SPA framework - each HTML page is self-contained with embedded JavaScript modules.

See `docs/ARCHITECTURE.md` for the full picture, including how the printable
program scales itself to two pages.

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main public page - program, events, announcements |
| `admin.html` | Admin panel for editing program/events/missionaries |
| `classrooms.html` | Public classroom finder with interactive floorplan |
| `classrooms-admin.html` | Admin for room assignments |
| `print.html` | Two-page printable program (scales content to fit) |
| `js/firebase.js` | Shared Firebase config - the only copy, import `db` from here |
| `src/input.css` | Tailwind source with design tokens |
| `dist/output.css` | Compiled CSS (auto-generated) |
| `public/assets/` | Favicon, ward logo, floorplans, Zoom screenshots |

### Conventions

- **Never paste the Firebase config into a page** - import from `js/firebase.js`.
- **Assets stay local.** Images used to be hot-linked from a third-party CDN the
  ward does not control; they now live in `public/assets/`.
- **Firebase may return objects instead of arrays** when keys are sparse. Code
  reading `events` or `missionaries` must handle both, or it renders empty and
  then saves that emptiness over the real data.
- **Details fields are multi-line.** Spacing and line breaks are preserved and
  carry through to the printed program; renderers use `white-space: pre-wrap`.
- **In `print.html`, never use a fixed `pt` size inside a fitted region** -
  write it as `calc(<base> * var(--fit, 1))` so it scales with the rest.

### Firebase Structure

```
Firebase Realtime Database
├── sundayProgram    # Sunday service data (sections, speakers, etc.)
├── events           # Ward activities and events
├── missionaries     # Missionary/military member info
├── classrooms       # Room assignments by schedule type
└── siteSettings     # Site-wide config (nav visibility, etc.)
```

**Firebase Project:** `aspen-ward-missionary-dinner`

### Authentication

Admin pages use simple password auth stored in sessionStorage:
- Key: `admin-auth` (shared between admin.html and classrooms-admin.html)
- Password is hardcoded in the HTML files

### CSS Design System

Uses CSS custom properties defined in `src/input.css`:
- `--bg`, `--surface`, `--stroke` - backgrounds/borders
- `--ink`, `--ink-soft`, `--ink-muted` - text colors
- `--accent`, `--accent-strong` - brand colors
- `--shadow-sm/md/lg`, `--radius-sm/md/lg` - effects

Light/dark themes via `[data-theme="dark"]` selector.

## Project Guidelines

- Always update CHANGELOG.md when making changes to the project
- At the end of each session, offer to summarize what was done
- Keep documentation clear and organized for future reference
