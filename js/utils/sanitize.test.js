import { test } from 'node:test';
import assert from 'node:assert';
import { escapeHtml, sanitizeUrl } from './sanitize.js';

test('escapeHtml - escapes HTML entities', () => {
  const input = '<script>alert("xss")</script>';
  const expected = '&lt;script&gt;alert("xss")&lt;/script&gt;';
  const result = escapeHtml(input);
  assert.strictEqual(result, expected);
});

test('escapeHtml - escapes special characters', () => {
  const input = '< > & " \'';
  const result = escapeHtml(input);
  assert.ok(result.includes('&lt;'));
  assert.ok(result.includes('&gt;'));
  assert.ok(result.includes('&amp;'));
});

test('escapeHtml - handles empty string', () => {
  assert.strictEqual(escapeHtml(''), '');
});

test('sanitizeUrl - allows safe URLs', () => {
  assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com');
  assert.strictEqual(sanitizeUrl('http://example.com'), 'http://example.com');
  assert.strictEqual(sanitizeUrl('mailto:test@example.com'), 'mailto:test@example.com');
  assert.strictEqual(sanitizeUrl('/relative/path'), '/relative/path');
});

test('sanitizeUrl - blocks dangerous URLs', () => {
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
  assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '');
  assert.strictEqual(sanitizeUrl('vbscript:msgbox'), '');
  assert.strictEqual(sanitizeUrl('JAVASCRIPT:alert(1)'), '');
});

test('sanitizeUrl - handles empty/null', () => {
  assert.strictEqual(sanitizeUrl(''), '');
  assert.strictEqual(sanitizeUrl(null), '');
  assert.strictEqual(sanitizeUrl(undefined), '');
});

test('sanitizeUrl - trims whitespace', () => {
  assert.strictEqual(sanitizeUrl('  https://example.com  '), 'https://example.com');
});

test('sanitizeUrl - blocks relative URLs without slash', () => {
  assert.strictEqual(sanitizeUrl('example.com'), '');
  assert.strictEqual(sanitizeUrl('ftp://example.com'), '');
});
