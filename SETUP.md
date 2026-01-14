# Setup Guide

## Quick Start

1. **Extract Files**: Ensure all files are in the correct directory structure

2. **Create Icons**: Generate PWA icons in various sizes:
   - Create an `/icons` folder
   - Generate icons from [favicon.svg](favicon.svg) in these sizes:
     - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
   - Use a tool like https://realfavicongenerator.net/ or ImageMagick

3. **Optional: Install Dependencies**:
   ```bash
   npm install
   ```

4. **Development Server**:
   ```bash
   # Option 1: Using npm
   npm run dev

   # Option 2: Using Python
   python -m http.server 8080

   # Option 3: Using any static server
   ```

5. **Open Browser**: Visit http://localhost:8080

## Google Sheets Setup

### 1. Create Google Sheets

Create three sheets with the following structures:

#### Ward Info Sheet
| Key | Value |
|-----|-------|
| Ward Name | Aspen Ward |
| Subtitle | Sunday Worship & Community |
| Location | Fruita, Colorado |
| Sacrament Start Time | 9:00 AM |
| Events | NO (YES to hide events section) |
| Pop Up Banner | NO (YES to hide popup banner) |

#### Program Sheet
| Program | Details | Link | Accent |
|---------|---------|------|--------|
| Presiding | Bishop John Smith | | |
| Opening Hymn | #123 "Amazing Grace" | | |
| Sacrament Hymn | #456 "In Remembrance" | | |
| Speaker | Jane Doe | | |
| Closing Hymn | #789 "We Thank Thee" | | |

Special sections:
- `#SECTION:Banner` - Creates popup banner
- `#SECTION:Announcements` - Creates announcements section

#### Events Sheet
| Date | Title | Info | Icon | URL |
|------|-------|------|------|-----|
| January 15 | Service Project | Meet at 10am at the church | 🛠️ | |
| Every Sunday | Choir Practice | 8:00 AM in the chapel | 🎵 | |

### 2. Publish Sheets as CSV

For each sheet:
1. Click **File → Share → Publish to web**
2. Select the specific sheet
3. Choose **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the URL

### 3. Update Configuration

Edit [js/config.js](js/config.js) and replace the URLs:

```javascript
export const CONFIG = {
  WARD_INFO_URL: 'YOUR_WARD_INFO_CSV_URL',
  PROGRAM_URL: 'YOUR_PROGRAM_CSV_URL',
  EVENTS_URL: 'YOUR_EVENTS_CSV_URL',
  CORS_PROXY: 'https://api.allorigins.win/raw?url='
};
```

## Production Deployment

### Option 1: Static Hosting (Recommended)

Deploy to any static host:
- **Netlify**: Drag and drop the folder
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push to gh-pages branch
- **Cloudflare Pages**: Connect GitHub repo

### Option 2: Build and Deploy

```bash
# Build production assets
npm run build:prod

# Deploy the dist/ folder
```

### Option 3: Traditional Web Server

1. Upload all files to your web server
2. Ensure the server serves `.js` files with correct MIME type
3. Configure HTTPS (required for service worker)

## Security Headers (Recommended)

Add these headers to your server configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://docs.google.com https://api.allorigins.win; img-src 'self' data:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Testing

### Test Locally

```bash
# Run unit tests
npm test

# Run linter
npm run lint
```

### Test Service Worker

1. Open Chrome DevTools → Application → Service Workers
2. Check "Update on reload"
3. Verify caching in Cache Storage

### Test Accessibility

1. Run Lighthouse audit in Chrome DevTools
2. Use screen reader (NVDA/JAWS/VoiceOver)
3. Test keyboard navigation (Tab, Enter, Escape)

### Test Responsiveness

- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

## Troubleshooting

### Service Worker Not Updating
- Clear cache and hard reload (Ctrl+Shift+R)
- Unregister service worker in DevTools
- Check HTTPS is enabled

### Google Sheets Not Loading
- Verify sheets are published as CSV
- Check URLs in config.js
- Test CORS proxy is working
- Check browser console for errors

### Dark Mode Not Working
- Clear localStorage
- Check browser supports prefers-color-scheme
- Verify theme-toggle.js is loaded

### Icons Not Showing
- Generate icons from favicon.svg
- Place in /icons folder
- Update manifest.json paths if needed

## Customization

### Colors
Edit [css/variables.css](css/variables.css):
- `--accent`: Primary color
- `--accent-strong`: Darker accent
- `--bg`: Background color

### Fonts
Update font imports in [index.html](index.html):
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT" rel="stylesheet">
```

### Ward Name
Update in Google Sheets or fallback in [js/services/data-service.js](js/services/data-service.js)

## Maintenance

### Weekly
- Update program in Google Sheet
- Check events are current
- Review announcements

### Monthly
- Test all links
- Check browser console for errors
- Review analytics (if configured)

### Quarterly
- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Test on multiple browsers

## Support

For technical issues:
1. Check browser console for errors
2. Verify Google Sheets URLs
3. Test with debug mode: `?banner=debug`
4. Contact ward tech coordinator

## License

MIT License - Free to use and modify for your ward.
