# Quick Reference Guide

## Common Tasks

### Update Sunday Program

1. Open your Program Google Sheet
2. Edit the rows:
   - Column A: Program item (e.g., "Opening Hymn")
   - Column B: Details (e.g., "#123 'Amazing Grace'")
   - Column C: Optional link
   - Column D: Optional accent color
3. Save (changes publish automatically)
4. Refresh website to see updates

### Add Announcement

In your Program Sheet, add after `#SECTION:Announcements`:

```
Title              | Description           | Link (optional)
Church Potluck     | This Saturday at 6pm  |
```

### Add Event

In your Events Sheet:

```
Date              | Title          | Info                      | Icon | URL
January 15        | Service Day    | Meet at church at 10am    | 🛠️   |
Every Sunday      | Choir Practice | 8:00 AM in chapel         | 🎵   |
```

### Hide Events Section

In Ward Info Sheet, set:
```
Events | YES
```

### Hide Popup Banner

In Ward Info Sheet, set:
```
Pop Up Banner | YES
```

### Debug Banner

Add `?banner=debug` to URL to see banner even if already viewed today:
```
https://yoursite.com/?banner=debug
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check code quality
npm run lint

# Build for production
npm run build

# Full production build
npm run build:prod
```

---

## File Locations

### To Update Content
- Google Sheets (external)

### To Update Styling
- `css/variables.css` - Colors and spacing
- `css/components.css` - Component styles

### To Update Logic
- `js/app.js` - Main application
- `js/config.js` - Configuration
- `js/services/data-service.js` - Data URLs

### To Update Documentation
- `README.md` - Project info
- `SETUP.md` - Setup instructions

---

## Google Sheets URLs

Update these in `js/config.js`:

```javascript
export const CONFIG = {
  WARD_INFO_URL: 'YOUR_URL_HERE',
  PROGRAM_URL: 'YOUR_URL_HERE',
  EVENTS_URL: 'YOUR_URL_HERE'
};
```

---

## Troubleshooting

### Website not loading data
1. Check Google Sheets are published as CSV
2. Verify URLs in `js/config.js`
3. Check browser console (F12) for errors
4. Try adding `?t=timestamp` to force refresh

### Service worker issues
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Click "Unregister"
4. Hard refresh (Ctrl+Shift+R)

### Theme not saving
1. Clear browser localStorage
2. Check browser supports localStorage
3. Try incognito mode to test

### Icons not showing
1. Generate icons from favicon.svg
2. Place in `/icons` folder
3. Update paths in manifest.json

---

## Keyboard Shortcuts

- `Tab` - Navigate between links
- `Enter` - Activate link/button
- `Escape` - Close modal or menu
- `Space` - Activate button

---

## Browser DevTools

### Test Responsive Design
1. Open DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select device or enter custom size

### Check Performance
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"

### Debug Service Worker
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check status and errors

### View Cache
1. Open DevTools (F12)
2. Go to Application → Cache Storage
3. Expand cache to see files

---

## CSS Custom Properties

Edit colors in `css/variables.css`:

```css
/* Light theme */
--accent: #7c3aed;          /* Primary purple */
--accent-strong: #5b21b6;    /* Darker purple */
--bg: #f9f5ef;              /* Background cream */

/* Dark theme */
[data-theme="dark"] {
  --accent: #b8a4ff;        /* Light purple */
  --accent-strong: #9f87ff; /* Brighter purple */
  --bg: #1b1624;            /* Dark background */
}
```

---

## Git Workflow

```bash
# Clone repository
git clone [repository-url]

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit with message
git commit -m "Add feature description"

# Push to remote
git push origin feature/my-feature

# Create pull request (on GitHub/GitLab)
```

---

## Deployment Quick Start

### Netlify
1. Drag and drop folder to Netlify
2. Done!

### GitHub Pages
```bash
git checkout -b gh-pages
git push origin gh-pages
```

### Vercel
```bash
vercel --prod
```

### Traditional Server
1. Upload all files via FTP/SFTP
2. Ensure HTTPS is enabled
3. Test service worker

---

## Testing Checklist

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile device
- [ ] Check responsive breakpoints
- [ ] Verify all links work
- [ ] Test offline mode
- [ ] Check print layout
- [ ] Test with screen reader
- [ ] Verify keyboard navigation
- [ ] Test dark mode
- [ ] Check loading states

---

## Regular Maintenance

### Weekly
- [ ] Update program in Google Sheet
- [ ] Review events for accuracy
- [ ] Check announcements are current

### Monthly
- [ ] Test all functionality
- [ ] Review browser console for errors
- [ ] Check mobile experience
- [ ] Verify links still work

### Quarterly
- [ ] Run `npm update`
- [ ] Run `npm audit`
- [ ] Test on latest browsers
- [ ] Review and update documentation

---

## Support Resources

- **Documentation**: See README.md, SETUP.md
- **Icons**: See generate-icons.md
- **Changes**: See CHANGELOG.md
- **Improvements**: See IMPROVEMENTS.md

---

## Emergency Rollback

If something breaks:

1. **Revert to backup**:
   - Restore "Aspen Ward" (original file)
   - Copy to `index.html`

2. **Check recent changes**:
   ```bash
   git log --oneline
   git checkout [previous-commit]
   ```

3. **Clear browser cache**:
   - Hard refresh (Ctrl+Shift+R)
   - Clear site data in DevTools

---

## Performance Tips

1. **Optimize images**:
   - Use WebP format
   - Compress before upload
   - Use appropriate sizes

2. **Minimize requests**:
   - Combine CSS files in production
   - Bundle JavaScript
   - Use CDN for libraries

3. **Enable compression**:
   - Gzip/Brotli on server
   - Minify CSS/JS
   - Remove unused code

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Google Sheets URLs use HTTPS
- [ ] No sensitive data in client code
- [ ] Service worker updated when code changes
- [ ] Dependencies are up to date
- [ ] Error messages don't leak info

---

## Contact

For technical support or questions:
- Ward tech coordinator
- Check documentation files
- Review browser console errors
- Test in incognito mode first

---

Last Updated: 2026-01-11
Version: 2.0.0
