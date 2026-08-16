// Single source of truth for the Firebase connection.
//
// This config used to be copy-pasted into all six pages, so any change had to be
// made in six places. Import from here instead:
//
//   import { db } from '/js/firebase.js';
//   import { ref, get } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBbwlTuMoSMl2vfXA5aHkQM0RC2PUrKDXk",
  authDomain: "aspen-ward-missionary-dinner.firebaseapp.com",
  databaseURL: "https://aspen-ward-missionary-dinner-default-rtdb.firebaseio.com",
  projectId: "aspen-ward-missionary-dinner",
  storageBucket: "aspen-ward-missionary-dinner.firebasestorage.app",
  messagingSenderId: "350865820261",
  appId: "1:350865820261:web:26912e9b753852ae7ed48c",
  measurementId: "G-G9WT2W399C"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
