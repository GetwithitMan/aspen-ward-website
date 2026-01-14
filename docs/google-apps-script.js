/**
 * Google Apps Script for Aspen Ward Admin API
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vSv7a_sC6S7ytGdHJSEZMHqCPsKhOY-C7hp6K1d-rpUsAUj8LV3Ss3lE89p-IAfEdtFcpOhrOng3LWw
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Choose "Web app" as the type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Update the SCRIPT_URL in admin.html with this URL
 */

const ADMIN_PASSWORD = '1Givethanks';
const PROGRAM_SHEET_NAME = 'Sunday Program'; // Your actual sheet tab name

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Get parameters from either GET or POST
    let params = e.parameter || {};

    // For POST, also check postData if available
    if (method === 'POST' && e.postData) {
      try {
        // Try parsing as JSON first
        const postParams = JSON.parse(e.postData.contents);
        params = { ...params, ...postParams };
      } catch (jsonErr) {
        // Not JSON, use form parameters (already in e.parameter)
      }
    }

    const action = params.action;

    // Check password for all actions except 'ping'
    if (action !== 'ping' && params.password !== ADMIN_PASSWORD) {
      return output.setContent(JSON.stringify({
        success: false,
        error: 'Invalid password'
      }));
    }

    let result;

    switch (action) {
      case 'ping':
        result = { success: true, message: 'API is working' };
        break;

      case 'login':
        result = { success: true, message: 'Login successful' };
        break;

      case 'read':
        result = readProgram();
        break;

      case 'save':
        const data = JSON.parse(params.data);
        result = saveProgram(data);
        break;

      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }

    return output.setContent(JSON.stringify(result));

  } catch (error) {
    return output.setContent(JSON.stringify({
      success: false,
      error: error.toString()
    }));
  }
}

function readProgram() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(PROGRAM_SHEET_NAME);

  if (!sheet) {
    // Try to find the sheet by checking common names
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(s => s.getName());
    return {
      success: false,
      error: 'Sheet "' + PROGRAM_SHEET_NAME + '" not found. Available sheets: ' + sheetNames.join(', ')
    };
  }

  const data = sheet.getDataRange().getValues();

  // Convert to array of objects for easier handling
  const rows = data.map((row, index) => ({
    rowIndex: index,
    program: row[0] || '',
    details: row[1] || '',
    link: row[2] || '',
    accent: row[3] || ''
  }));

  return {
    success: true,
    data: rows,
    sheetName: sheet.getName()
  };
}

function saveProgram(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(PROGRAM_SHEET_NAME);

  if (!sheet) {
    return { success: false, error: 'Sheet not found' };
  }

  // Clear existing content (except header if you want to keep it)
  sheet.clear();

  // Write all rows
  if (data.length > 0) {
    const values = data.map(row => [
      row.program || '',
      row.details || '',
      row.link || '',
      row.accent || ''
    ]);

    sheet.getRange(1, 1, values.length, 4).setValues(values);
  }

  return {
    success: true,
    message: 'Saved ' + data.length + ' rows'
  };
}

// Test function - run this to verify the script works
function testRead() {
  const result = readProgram();
  Logger.log(JSON.stringify(result, null, 2));
}
