# Icon Generation Guide

## Quick Method: Online Generator

1. Go to https://realfavicongenerator.net/
2. Upload the [favicon.svg](favicon.svg) file
3. Download the generated package
4. Extract the files to the project root

## Manual Method: Using ImageMagick

If you have ImageMagick installed:

```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Create icons directory
mkdir -p icons

# Generate PNG icons from SVG
convert -density 300 -background none favicon.svg -resize 72x72 icons/icon-72x72.png
convert -density 300 -background none favicon.svg -resize 96x96 icons/icon-96x96.png
convert -density 300 -background none favicon.svg -resize 128x128 icons/icon-128x128.png
convert -density 300 -background none favicon.svg -resize 144x144 icons/icon-144x144.png
convert -density 300 -background none favicon.svg -resize 152x152 icons/icon-152x152.png
convert -density 300 -background none favicon.svg -resize 192x192 icons/icon-192x192.png
convert -density 300 -background none favicon.svg -resize 384x384 icons/icon-384x384.png
convert -density 300 -background none favicon.svg -resize 512x512 icons/icon-512x512.png

# Generate standard favicon
convert -density 300 -background none favicon.svg -resize 32x32 favicon.png

# Generate Apple touch icon
convert -density 300 -background none favicon.svg -resize 180x180 apple-touch-icon.png
```

## Using Node.js (sharp library)

Create a file `generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory
if (!fs.existsSync('icons')) {
  fs.mkdirSync('icons');
}

// Generate icons
sizes.forEach(size => {
  sharp('favicon.svg')
    .resize(size, size)
    .png()
    .toFile(`icons/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size}:`, err));
});

// Generate standard favicon
sharp('favicon.svg')
  .resize(32, 32)
  .png()
  .toFile('favicon.png')
  .then(() => console.log('Generated favicon.png'))
  .catch(err => console.error('Error generating favicon:', err));

// Generate Apple touch icon
sharp('favicon.svg')
  .resize(180, 180)
  .png()
  .toFile('apple-touch-icon.png')
  .then(() => console.log('Generated apple-touch-icon.png'))
  .catch(err => console.error('Error generating Apple icon:', err));
```

Install sharp and run:
```bash
npm install sharp
node generate-icons.js
```

## Using Inkscape

```bash
# Install Inkscape (macOS)
brew install --cask inkscape

# Generate icons
for size in 72 96 128 144 152 192 384 512; do
  inkscape favicon.svg --export-type=png --export-filename=icons/icon-${size}x${size}.png -w $size -h $size
done

# Generate standard favicon
inkscape favicon.svg --export-type=png --export-filename=favicon.png -w 32 -h 32

# Generate Apple touch icon
inkscape favicon.svg --export-type=png --export-filename=apple-touch-icon.png -w 180 -h 180
```

## Customizing the Icon

The current favicon shows "AW" for Aspen Ward. To customize:

1. Open [favicon.svg](favicon.svg) in a text editor
2. Change the text content from "AW" to your ward initials
3. Adjust colors by modifying the gradient stops:
   - `stop-color:#7c3aed` (purple) - change to your preferred color
   - `stop-color:#5b21b6` (darker purple) - change to a darker shade
4. Save and regenerate icons

Example customization:

```svg
<!-- Change AW to your initials -->
<text x="50" y="65" ... >XY</text>

<!-- Change colors -->
<stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
<stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
```

## Verifying Icons

After generation, verify:

1. Check file sizes are reasonable (< 50KB each)
2. Open icons in an image viewer
3. Test transparency is preserved
4. Verify sharpness at each size

## Troubleshooting

### Blurry Icons
- Increase density: `-density 600` instead of 300
- Use PNG instead of JPEG
- Ensure source SVG is high quality

### Missing Transparency
- Add `-background none` flag
- Check SVG doesn't have background fill
- Use PNG format, not JPEG

### Wrong Colors
- Edit the SVG gradient colors
- Ensure color space is RGB
- Test in different browsers

## Platform-Specific Icons

### iOS
- Needs `apple-touch-icon.png` (180x180)
- Place in root directory
- No transparency (fill with background color)

### Android
- Needs various sizes in manifest
- Supports transparency
- Test on actual devices

### Windows
- May need `browserconfig.xml`
- Tile images for Start menu
- Consider larger sizes (270x270, 558x558)

### macOS
- Safari pinned tab icon (SVG)
- Create `safari-pinned-tab.svg` (monochrome)

## Future Updates

When updating the icon:

1. Update [favicon.svg](favicon.svg)
2. Regenerate all sizes
3. Clear browser cache
4. Update service worker cache version
5. Test on all platforms
