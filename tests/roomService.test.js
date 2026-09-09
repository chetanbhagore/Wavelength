import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createEcho,
  createUserMessage,
  createSystemMessage,
  calculateResonanceIncrement,
  calculateResonanceDecay,
  applyResonance,
  calculateDissolution,
  validateMessage,
  recordFrequencyVisit,
} from '../src/services/RoomService.js';
import { MAX_RESONANCE_LEVEL, MAX_MESSAGE_CHARS } from '../src/constants/index.js';

describe('RoomService Business Domain Layer', () => {
  test('createEcho generates serializable echo object', () => {
    const echo = createEcho('freq_88_5', 'A thought left in the ether');
    assert.equal(echo.frequencyId, 'freq_88_5');
    assert.equal(echo.text, 'A thought left in the ether');
    assert.ok(echo.id.startsWith('user_echo_'), 'Echo ID must follow naming schema');
  });

  test('createEcho clamps text to MAX_MESSAGE_CHARS', () => {
    const longText = 'a'.repeat(300);
    const echo = createEcho('freq_88_5', longText);
    assert.equal(echo.text.length, MAX_MESSAGE_CHARS);
  });

  test('createUserMessage marks message as user and unresonated', () => {
    const msg = createUserMessage('Hello strangers');
    assert.equal(msg.sender, 'you');
    assert.equal(msg.isUser, true);
    assert.equal(msg.resonated, false);
    assert.ok(msg.timestamp > 0);
  });

  test('createSystemMessage creates join/leave announcements', () => {
    const joinMsg = createSystemMessage('join', 'stranger_42');
    assert.equal(joinMsg.isSystem, true);
    assert.match(joinMsg.text, /stranger_42 tuned into this frequency/);

    const leaveMsg = createSystemMessage('leave', 'stranger_99');
    assert.match(leaveMsg.text, /stranger_99 drifted back into the void/);
  });

  test('calculateResonanceIncrement clamps to ceiling', () => {
    const next = calculateResonanceIncrement(0.95);
    assert.equal(next, MAX_RESONANCE_LEVEL);
  });

  test('calculateResonanceDecay clamps to zero', () => {
    const next = calculateResonanceDecay(0.02);
    assert.equal(next, 0);
  });

  test('applyResonance updates targeted message immutably', () => {
    const messages = [
      { id: '1', text: 'first', resonated: false },
      { id: '2', text: 'second', resonated: false },
    ];
    const updated = applyResonance(messages, '2');
    assert.equal(updated[0].resonated, false);
    assert.equal(updated[1].resonated, true);
    assert.notEqual(messages, updated, 'Array must be immutably copied');
  });

  test('calculateDissolution behaves linearly in final 30 seconds', () => {
    assert.equal(calculateDissolution(45), 0, 'No dissolution before 30s');
    assert.equal(calculateDissolution(30), 0, 'Zero dissolution at 30s mark');
    assert.equal(calculateDissolution(15), 0.5, 'Half dissolution at 15s');
    assert.equal(calculateDissolution(0), 1, 'Full dissolution at 0s');
  });

  test('validateMessage rejects empty and whitespace-only strings', () => {
    assert.equal(validateMessage('').valid, false);
    assert.equal(validateMessage('   ').valid, false);
    assert.equal(validateMessage('valid text').valid, true);
    assert.equal(validateMessage('a'.repeat(201)).valid, false);
  });

  test('recordFrequencyVisit tracks visit count and timestamp', () => {
    const history = {};
    const step1 = recordFrequencyVisit(history, 'freq_88_5');
    assert.equal(step1['freq_88_5'].count, 1);

    const step2 = recordFrequencyVisit(step1, 'freq_88_5');
    assert.equal(step2['freq_88_5'].count, 2);
  });
});
