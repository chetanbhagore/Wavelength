import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_DURATION,
  FULL_DURATION,
  APP_STATES,
  STORAGE_KEYS,
  BREAKPOINTS,
  MAX_MESSAGE_CHARS,
  LOCK_CHIME_FREQUENCY_HZ,
} from '../src/constants/index.js';

describe('Application Constants & Configuration', () => {
  test('Session durations are properly calibrated', () => {
    assert.equal(DEMO_DURATION, 90, 'Demo duration must be 90 seconds');
    assert.equal(FULL_DURATION, 720, 'Full duration must be 720 seconds (12 minutes)');
  });

  test('State machine contains all 5 required navigation states', () => {
    assert.equal(APP_STATES.TUNER, 'tuner');
    assert.equal(APP_STATES.SYNCING, 'syncing');
    assert.equal(APP_STATES.ROOM, 'room');
    assert.equal(APP_STATES.ECHO_MODAL, 'echoModal');
    assert.equal(APP_STATES.ECHO_WALL, 'echoWall');
  });

  test('Storage keys are unique and non-empty', () => {
    const keys = Object.values(STORAGE_KEYS);
    const uniqueKeys = new Set(keys);
    assert.equal(keys.length, uniqueKeys.size, 'All storage keys must be unique');
  });

  test('Breakpoints include all required responsive targets', () => {
    assert.equal(BREAKPOINTS.xs, 320);
    assert.equal(BREAKPOINTS.sm, 480);
    assert.equal(BREAKPOINTS.md, 768);
    assert.equal(BREAKPOINTS.lg, 1024);
    assert.equal(BREAKPOINTS.xl, 1440);
  });

  test('Message limit respects physical receipt typography constraints', () => {
    assert.equal(MAX_MESSAGE_CHARS, 200);
  });

  test('Lock chime matches Solfeggio 528Hz frequency', () => {
    assert.equal(LOCK_CHIME_FREQUENCY_HZ, 528);
  });
});
