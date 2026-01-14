# Enhanced Program Guide

## 🎉 New Features in Program Section

The program section now has **much better** design and functionality with clickable links for music, videos, and more!

## 📋 Google Sheets Format

Your Google Sheets **Program** tab should have these columns:

| Column A (Program) | Column B (Details) | Column C (Link) | Column D (Accent) |
|-------------------|-------------------|-----------------|-------------------|
| Opening Hymn | #123 "Amazing Grace" | https://www.youtube.com/... | |
| Invocation | Brother John Smith | | |
| Sacrament Hymn | #456 "In Remembrance of Thy Suffering" | https://music.churchofjesuschrist.org/... | |
| Speaker | Sister Jane Doe<br>Topic: Faith in Christ | https://docs.google.com/... | |

## 🎵 Link Types Automatically Detected

The website will automatically detect and style your links:

### YouTube Links
- **Icon**: 🎬
- **Button Color**: Blue gradient
- **Button Text**: "Watch Video"
- **Example**: `https://www.youtube.com/watch?v=abc123`

### Music Links
- **Icon**: 🎵
- **Button Color**: Pink/yellow gradient
- **Button Text**: "Listen"
- **Keywords**: "music", "hymn", "spotify"
- **Example**: `https://music.churchofjesuschrist.org/hymn/123`

### PDF Links
- **Icon**: 📄
- **Button Color**: Green gradient
- **Button Text**: "View PDF"
- **Example**: `https://example.com/talk.pdf`

### Google Docs
- **Icon**: 📝
- **Button Color**: Purple gradient
- **Button Text**: "Open Link"
- **Example**: `https://docs.google.com/document/...`

### Other Links
- **Icon**: 🔗
- **Button Color**: Purple gradient
- **Button Text**: "Open Link"

## 🏷️ Program Types (Auto-Detected)

The website automatically adds type badges based on the program item name:

- **"Hymn"** or **"Song"** → Music badge
- **"Speaker"** or **"Talk"** → Talk badge
- **"Prayer"** → Prayer badge
- **"Sacrament"** → Ordinance badge
- **"Testimony"** → Testimony badge

## 📝 Example Google Sheet Setup

```
Program         | Details                           | Link
----------------|-----------------------------------|----------------------------------
Opening Hymn    | #123 "Amazing Grace"              | https://www.youtube.com/watch?v=abc
Invocation      | Brother John Smith                |
Sacrament Hymn  | #456 "In Remembrance"             | https://music.churchofjesuschrist.org/hymn/456
Speaker         | Sister Jane Doe                   | https://docs.google.com/document/d/123/edit
Closing Hymn    | #789 "We Thank Thee"              | https://www.youtube.com/watch?v=xyz
Benediction     | Brother Tom Johnson               |
```

## 🎨 Visual Features

### Each Program Item Shows:
1. **Time/Title** - In a rounded badge (left side)
2. **Type Badge** - "Music", "Talk", "Prayer", etc. (right side)
3. **Main Title** - Bold, prominent text
4. **Description** - Optional subtitle/details (supports multi-line)
5. **Clickable Buttons** - Colorful gradient buttons for links
6. **Background Icon** - Decorative emoji based on type:
   - 🎵 for hymns/songs
   - 🎤 for speakers/talks
   - 🙏 for prayers

### Interactive Elements:
- **Tap any program item** → Mark as completed (grays out with checkmark ✓)
- **Tap again** → Unmark as completed
- **Tap link buttons** → Opens in new tab
- **Progress tracking** → Completed items saved automatically
- **Auto-reset** → Completed items clear each new Sunday
- **Colorful left border** → Each item has a different color
- **Smooth animations** → Items slide in on page load

## 📱 Mobile Optimized

- **Large tap targets** (44x44px minimum)
- **Full-width cards** for easy reading
- **Stacked layout** for mobile screens
- **Touch-responsive** with scale animation
- **Easy scrolling** with smooth transitions

## 🌈 Color Coding

Each program item gets a unique color automatically:
1. Pink (#FF6B9D)
2. Purple (#9B59B6)
3. Blue (#3498DB)
4. Green (#2ECC71)
5. Yellow (#FEC260)
6. (Repeats for more items)

## 💡 Pro Tips

### Multiple Lines in Details
Use line breaks in your Google Sheets cell (Alt+Enter) for subtitles:
```
Speaker             | Sister Jane Doe
                    | Topic: Faith in Christ
                    | 15 minutes
```

### No Link? No Problem!
Just leave the Link column empty - the button won't show:
```
Invocation          | Brother Smith          | (empty)
```

### Multiple Links
Add them in the Description with newlines:
```
Speaker             | Sister Jane Doe        | https://link1.com
                    | Additional resource:   |
                    | https://link2.com      |
```

## 🎯 Example with Everything

Here's a complete example showing all features:

| Program | Details | Link |
|---------|---------|------|
| Opening Hymn | #123 "Amazing Grace"<br>Sung by the ward choir | https://www.youtube.com/watch?v=abc123 |
| Invocation | Brother John Smith | |
| Ward Business | Sustaining of officers<br>New members | |
| Sacrament Hymn | #456 "In Remembrance of Thy Suffering" | https://music.churchofjesuschrist.org/hymn/456 |
| Sacrament | Blessing and passing the sacrament | |
| Speaker | Sister Jane Doe<br>Topic: Faith in Christ<br>15 minutes | https://docs.google.com/document/d/123/talk-outline |
| Speaker | Brother Tom Johnson<br>Topic: Service<br>10 minutes | |
| Closing Hymn | #789 "We Thank Thee, O God, for a Prophet" | https://www.youtube.com/watch?v=xyz789 |
| Benediction | Sister Mary Wilson | |

## 🚀 Result

Your program will display as beautiful, interactive cards with:
- ✅ Color-coded borders
- ✅ Type badges (Music, Talk, Prayer, etc.)
- ✅ Clickable gradient buttons for links
- ✅ Automatic icon detection
- ✅ Smooth animations
- ✅ Mobile-friendly layout
- ✅ Fun emoji reactions when tapped

**Perfect for GoHighLevel!** Just paste and go! 🎉
