// Firebase SDK connection, for pages that need live updates or writes.
// Read-only pages should use js/db-read.js instead - it avoids the SDK bundle.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js';
import { firebaseConfig } from '/js/config.js';

export { firebaseConfig };
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
