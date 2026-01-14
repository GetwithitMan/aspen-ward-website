import { test } from 'node:test';
import assert from 'node:assert';
import { parseCSV } from './csv-parser.js';

test('parseCSV - simple CSV', () => {
  const input = 'a,b,c\n1,2,3';
  const expected = [['a', 'b', 'c'], ['1', '2', '3']];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - quoted fields', () => {
  const input = '"quoted","with,comma","normal"';
  const expected = [['quoted', 'with,comma', 'normal']];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - escaped quotes', () => {
  const input = '"escape""quote",value,end';
  const expected = [['escape"quote', 'value', 'end']];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - CRLF line endings', () => {
  const input = 'a,b,c\r\n1,2,3';
  const expected = [['a', 'b', 'c'], ['1', '2', '3']];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - empty cells', () => {
  const input = 'a,,c\n1,2,';
  const expected = [['a', '', 'c'], ['1', '2', '']];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - empty input', () => {
  const input = '';
  const expected = [];
  const result = parseCSV(input);
  assert.deepStrictEqual(result, expected);
});

test('parseCSV - HTML error', () => {
  const input = '<!DOCTYPE html><html></html>';
  assert.throws(() => parseCSV(input), /HTML instead of CSV/);
});

test('parseCSV - invalid input', () => {
  assert.throws(() => parseCSV(null), /Invalid CSV payload/);
  assert.throws(() => parseCSV(undefined), /Invalid CSV payload/);
  assert.throws(() => parseCSV(123), /Invalid CSV payload/);
});
