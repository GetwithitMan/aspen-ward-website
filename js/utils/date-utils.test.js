import { test } from 'node:test';
import assert from 'node:assert';
import { hasDateOrDay, formatDateForCalendar, getCurrentSunday } from './date-utils.js';

test('hasDateOrDay - detects days of week', () => {
  assert.strictEqual(hasDateOrDay('Sunday at 9am'), true);
  assert.strictEqual(hasDateOrDay('Every Monday'), true);
  assert.strictEqual(hasDateOrDay('wednesday evening'), true);
  assert.strictEqual(hasDateOrDay('No date here'), false);
});

test('hasDateOrDay - detects months', () => {
  assert.strictEqual(hasDateOrDay('January 15'), true);
  assert.strictEqual(hasDateOrDay('december 25th'), true);
  assert.strictEqual(hasDateOrDay('March'), true);
  assert.strictEqual(hasDateOrDay('Random text'), false);
});

test('hasDateOrDay - detects ordinal dates', () => {
  assert.strictEqual(hasDateOrDay('15th'), true);
  assert.strictEqual(hasDateOrDay('1st of the month'), true);
  assert.strictEqual(hasDateOrDay('22nd'), true);
  assert.strictEqual(hasDateOrDay('33rd'), true);
  assert.strictEqual(hasDateOrDay('no ordinal'), false);
});

test('formatDateForCalendar - formats correctly', () => {
  const date = new Date('2024-01-15T10:30:00Z');
  const result = formatDateForCalendar(date);
  assert.strictEqual(result, '20240115T103000Z');
});

test('formatDateForCalendar - handles padding', () => {
  const date = new Date('2024-03-05T09:05:00Z');
  const result = formatDateForCalendar(date);
  assert.strictEqual(result, '20240305T090500Z');
});

test('getCurrentSunday - returns formatted date', () => {
  const result = getCurrentSunday();
  assert.match(result, /^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
});

test('getCurrentSunday - returns a string', () => {
  const result = getCurrentSunday();
  assert.strictEqual(typeof result, 'string');
  assert.ok(result.length > 0);
});
