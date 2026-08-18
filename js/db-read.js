// One-shot database reads without the Firebase SDK.
//
// The Realtime Database answers plain HTTPS requests and returns exactly what
// snapshot.val() would, so pages that only read (the home page and the
// printable program) can skip the ~74 KB SDK bundle entirely.
//
// Pages needing live updates (the classroom finder) or writes (the admin
// panels) import js/firebase.js instead.
import { firebaseConfig } from '/js/config.js';

export async function readPath(path, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${firebaseConfig.databaseURL}/${path}.json`,
                                 { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Database read failed for ${path}: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
