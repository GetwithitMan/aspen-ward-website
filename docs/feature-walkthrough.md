# Classroom Finder Feature Walkthrough

This document explains how the Classroom Finder feature works and how to configure it.

## Overview

The Classroom Finder allows ward members to quickly locate their Sunday meeting room on an interactive building floorplan. Admins can configure which rooms are assigned to which classes.

## User Experience

### Public Page (`/classrooms`)

1. **Automatic Schedule Detection**
   - The page automatically determines which Sunday of the month it is
   - 1st & 3rd Sundays → Sunday School tab selected
   - 2nd & 4th Sundays → Priesthood/RS/YM/YW tab selected

2. **Finding a Room**
   - User taps a class button (e.g., "Gospel Doctrine")
   - The room highlights on the floorplan with a pulsing animation
   - A label shows the room number and class name
   - Highlight auto-clears after 15 seconds

3. **Mobile Features**
   - Zoom controls (+, -, Reset buttons)
   - Pinch-to-zoom with two fingers
   - Drag-to-pan when zoomed in
   - Selected room card displays prominently at the top
   - Tap anywhere on the map to dismiss highlight

## Admin Configuration

### Step 1: Enable the Navigation Link

1. Go to `/admin` and log in
2. Scroll down to **Site Settings** section (click to expand)
3. Toggle **"Show Classrooms in Navigation"** ON
4. Click **Save Changes**

The "Classrooms" link will now appear in the main site navigation.

### Step 2: Configure Room Assignments

1. From the Site Settings section, click **"Open Classroom Admin"**
   - Or go directly to `/classrooms-admin`
   - If already logged into main admin, no password needed

2. **Sunday School (1st & 3rd Sundays)**
   - Expand this section
   - Click **"+ Add Room"** for each class
   - Select the room number from the dropdown
   - Enter the class/group name (e.g., "Gospel Doctrine", "Youth Sunday School")
   - Repeat for all Sunday School classes

3. **Priesthood / RS / YM / YW (2nd & 4th Sundays)**
   - Expand this section
   - Add room assignments for:
     - Elders Quorum
     - Relief Society
     - Young Men
     - Young Women
     - Primary classes
     - Any other meetings

4. Click **Save Changes**

### Step 3: Verify

1. Go to `/classrooms` (or click Classrooms in the navigation)
2. Test both tabs to ensure rooms highlight correctly
3. Test on mobile to verify zoom/pan functionality

## Technical Details

### Firebase Data Structure

```json
{
  "classrooms": {
    "sundaySchool": [
      { "roomId": "room127", "label": "Gospel Doctrine" },
      { "roomId": "room133", "label": "Youth Sunday School" }
    ],
    "quorumsClasses": [
      { "roomId": "room127", "label": "Elders Quorum" },
      { "roomId": "room133", "label": "Relief Society" },
      { "roomId": "room140", "label": "Young Men" },
      { "roomId": "room141", "label": "Young Women" }
    ]
  },
  "siteSettings": {
    "showClassroomsNav": true
  }
}
```

### Room Coordinate System

Room overlays are positioned using percentage-based coordinates relative to the floorplan image:

```javascript
const roomCoordinates = {
  room101: { top: 15.4, left: 77.75, width: 15, height: 5 },
  room103: { top: 20.75, left: 82, width: 10.9, height: 3.25 },
  // ... etc
};
```

This allows the overlays to scale correctly on any screen size.

### Available Room Numbers

The following rooms can be assigned:
- Room 101, 103, 104, 105
- Room 108, 109, 111, 113, 114, 115, 116, 118, 119
- Room 121, 122, 123, 124, 127, 128, 129, 130, 131, 133, 134
- Room 140, 141, 142, 143, 149, 151, 153

### Authentication

The classroom admin shares authentication with the main admin page:
- If logged into `/admin`, you're automatically logged into `/classrooms-admin`
- Both use `sessionStorage.getItem('admin-auth')`
- Session clears when browser tab is closed

## Firebase Rules

Ensure your Firebase Realtime Database rules allow read/write access to the new paths:

```json
{
  "rules": {
    "classrooms": {
      ".read": true,
      ".write": true
    },
    "siteSettings": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Troubleshooting

### Rooms not saving
- Check Firebase Console → Realtime Database → Rules
- Ensure `classrooms` path has write permission

### Navigation link not appearing
- Verify `siteSettings.showClassroomsNav` is `true` in Firebase
- Hard refresh the main page (Cmd+Shift+R or Ctrl+Shift+R)

### Room highlight in wrong position
- Room coordinates are percentage-based
- If floorplan image changes, coordinates may need adjustment
- Edit `roomCoordinates` object in `classrooms.html`

## Files

| File | Purpose |
|------|---------|
| `/classrooms.html` | Public classroom finder page |
| `/classrooms-admin.html` | Admin page for room assignments |
| `/admin.html` | Main admin (Site Settings section) |
| `/index.html` | Main page (conditional nav link) |
