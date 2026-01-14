/**
 * Parse CSV text into a 2D array
 * Handles quoted fields and escaped quotes
 */
export function parseCSV(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid CSV payload');
  }

  // Check if Google Sheet returned HTML instead of CSV
  if (text.trim().startsWith('<!DOCTYPE html>')) {
    throw new Error('Google Sheet returned HTML instead of CSV. Ensure it is published as CSV.');
  }

  const rows = [];
  let cell = '';
  let row = [];
  let inQuotes = false;

  const commitCell = () => {
    row.push(cell.trim());
    cell = '';
  };

  const commitRow = () => {
    if (row.length && row.some(Boolean)) {
      rows.push(row);
    }
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      const next = text[i + 1];
      if (inQuotes && next === '"') {
        // Escaped quote
        cell += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      commitCell();
    } else if (!inQuotes && (char === '\n' || char === '\r')) {
      // End of row
      commitCell();
      commitRow();
      // Handle \r\n
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
    } else {
      cell += char;
    }
  }

  // Commit final cell and row
  if (cell.length || row.length) {
    commitCell();
    commitRow();
  }

  return rows;
}

/**
 * Test function for CSV parser
 */
export function testCSVParser() {
  const tests = [
    {
      input: 'a,b,c\n1,2,3',
      expected: [['a', 'b', 'c'], ['1', '2', '3']]
    },
    {
      input: '"quoted","with,comma","normal"\n"escape""quote",value,end',
      expected: [['quoted', 'with,comma', 'normal'], ['escape"quote', 'value', 'end']]
    },
    {
      input: 'a,b,c\r\n1,2,3',
      expected: [['a', 'b', 'c'], ['1', '2', '3']]
    }
  ];

  tests.forEach((test, i) => {
    const result = parseCSV(test.input);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    console.log(`Test ${i + 1}: ${passed ? 'PASS' : 'FAIL'}`, { result, expected: test.expected });
  });
}
