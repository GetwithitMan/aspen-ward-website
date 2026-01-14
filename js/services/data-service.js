import { CONFIG } from '../config.js';
import { parseCSV } from '../utils/csv-parser.js';

/**
 * Fetch data with fallback to CORS proxy
 */
export async function fetchWithFallback(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.warn(`Direct fetch failed for ${url}. Retrying with proxy`, error);

    try {
      const proxyResponse = await fetch(`${CONFIG.CORS_PROXY}${encodeURIComponent(url)}`);
      if (!proxyResponse.ok) {
        throw new Error(`Proxy fetch failed: ${proxyResponse.status} ${proxyResponse.statusText}`);
      }
      return proxyResponse;
    } catch (proxyError) {
      console.error(`Unable to retrieve ${url}`, proxyError);
      throw new Error('We were unable to load the latest information. Please try again soon.');
    }
  }
}

/**
 * Fetch and parse CSV data
 */
export async function fetchCSV(url) {
  const response = await fetchWithFallback(url);
  const text = await response.text();
  return parseCSV(text);
}

/**
 * Load ward information
 */
export async function loadWardInfo() {
  try {
    const rows = await fetchCSV(CONFIG.WARD_INFO_URL);

    if (!rows.length) {
      throw new Error('Ward info sheet is empty');
    }

    const wardInfo = {};
    rows.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        const key = row[i]?.trim().toLowerCase();
        if (!key) continue;
        const value = row[i + 1]?.trim();
        if (value) {
          wardInfo[key] = value;
        }
      }
    });

    return {
      wardName: wardInfo['ward name'] ?? 'Aspen Ward',
      subtitle: wardInfo['subtitle'] ?? '',
      location: wardInfo['location'] ?? 'Fruita, Colorado',
      sacramentStart: wardInfo['sacrament start time'] ?? '9:00 AM',
      hideEvents: wardInfo['events']?.toUpperCase() === 'YES',
      hideBanner: wardInfo['pop up banner']?.toUpperCase() === 'YES'
    };
  } catch (error) {
    console.error('Ward info failed to load', error);

    // Return fallback data
    return {
      wardName: 'Aspen Ward',
      subtitle: 'Sunday Worship Service',
      location: 'Fruita, Colorado',
      sacramentStart: '9:00 AM',
      hideEvents: false,
      hideBanner: false
    };
  }
}

/**
 * Load program data
 */
export async function loadProgram() {
  const rows = await fetchCSV(CONFIG.PROGRAM_URL);

  if (!rows.length) {
    throw new Error('Program sheet is empty');
  }

  // Skip header row if it exists
  if (rows[0][0]?.toLowerCase().includes('program')) {
    rows.shift();
  }

  return rows;
}

/**
 * Load events data
 */
export async function loadEvents() {
  const rows = await fetchCSV(CONFIG.EVENTS_URL);

  // Skip header row if it exists
  if (rows[0]?.[0]?.toLowerCase().includes('date')) {
    rows.shift();
  }

  return rows;
}
