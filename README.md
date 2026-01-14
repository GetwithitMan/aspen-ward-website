# Aspen Ward Website

A modern, accessible website for displaying Sunday worship services, programs, announcements, and events for Aspen Ward.

## Features

- 🎨 **Modern Design**: Clean, elegant interface with light/dark theme support
- ♿ **Accessible**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Optimized performance with service worker caching
- 🔒 **Secure**: XSS protection with DOMPurify and URL sanitization
- 📊 **Dynamic Content**: Pulls data from Google Sheets
- 🎯 **SEO Optimized**: Meta tags for social sharing and search engines
- 🖨️ **Print Friendly**: Dedicated print stylesheet
- ♿ **Motion Sensitive**: Respects prefers-reduced-motion

## Project Structure

```
/Church Website/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── favicon.svg             # SVG favicon
├── package.json            # Build configuration
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── reset.css           # CSS reset and base styles
│   ├── layout.css          # Layout and grid system
│   ├── components.css      # UI components
│   ├── animations.css      # Animations and transitions
│   └── print.css           # Print styles
└── js/
    ├── app.js              # Main application entry
    ├── config.js           # Configuration and selectors
    ├── utils/
    │   ├── csv-parser.js   # CSV parsing utility
    │   ├── date-utils.js   # Date formatting utilities
    │   ├── sanitize.js     # XSS protection
    │   └── error-handler.js # Global error handling
    ├── services/
    │   └── data-service.js # Data fetching
    ├── components/
    │   ├── theme-toggle.js # Theme switcher
    │   ├── navigation.js   # Navigation handler
    │   ├── modal.js        # Modal dialogs
    │   ├── news-flash.js   # News banner
    │   └── loading.js      # Loading screens
    └── renderers/
        ├── ward-info-renderer.js
        ├── program-renderer.js
        ├── announcements-renderer.js
        └── events-renderer.js
```

## Getting Started

### Prerequisites

- Node.js 16+ (for development tools)
- A web server (development or production)

### Installation

1. Clone or download the repository

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:8080 in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run test` - Run unit tests
- `npm run lint` - Lint JavaScript files
- `npm run build` - Build for production
- `npm run build:prod` - Full production build with optimizations

### Testing

Unit tests are written using Node.js built-in test runner:

```bash
npm test
```

Tests are located in `js/utils/*.test.js`

### Code Quality

The project uses ESLint for code quality:

```bash
npm run lint
```

## Data Sources

The website pulls data from Google Sheets:

- **Ward Info**: Basic ward information (name, location, times)
- **Program**: Sunday program/sacrament meeting outline
- **Events**: Upcoming ward events and activities

### Google Sheets Format

Each sheet should be published as CSV. See the config.js file for URLs.

#### Ward Info Sheet
```
Key,Value
Ward Name,Aspen Ward
Subtitle,Sunday Worship
Location,Fruita, Colorado
Sacrament Start Time,9:00 AM
```

#### Program Sheet
```
Program,Details,Link,Accent
Opening Hymn,#123 "Amazing Grace",,
Speaker,John Smith,,
#SECTION:Banner,Announcements,,
Title,Description,Link,Color
Potluck,Join us this Saturday,https://example.com,#7c3aed
```

#### Events Sheet
```
Date,Title,Info,Icon,URL
January 15,Service Project,Meet at 10am at the church,🛠️,
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Skip links
- High contrast support
- Screen reader tested

## Security

- Content Security Policy headers recommended
- DOMPurify for HTML sanitization
- URL validation to prevent XSS
- No inline scripts in production
- Secure external resource loading

## Performance

- Service worker caching
- Lazy loading
- Optimized assets
- Minimal JavaScript
- No external dependencies (except fonts and DOMPurify)

## License

MIT License - Created for Aspen Ward members

## Contributing

This is a local ward project. For improvements or bug fixes:

1. Test changes locally
2. Ensure tests pass
3. Update documentation
4. Submit changes to ward tech team

## Support

For issues or questions, contact the ward tech coordinator.
