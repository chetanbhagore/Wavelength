import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from '../src/utils/formatTime.js';

describe('Time Formatter Utility', () => {
  test('Formats 12-minute session boundary correctly', () => {
    assert.equal(formatTime(720), '12:00');
  });

  test('Formats 90-second demo session boundary correctly', () => {
    assert.equal(formatTime(90), '01:30');
  });

  test('Formats single digit seconds with leading zero', () => {
    assert.equal(formatTime(65), '01:05');
    assert.equal(formatTime(9), '00:09');
  });

  test('Formats zero remaining time as 00:00', () => {
    assert.equal(formatTime(0), '00:00');
  });
});
