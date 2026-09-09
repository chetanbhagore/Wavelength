/**
 * @module RoomService
 * Business logic layer for room operations — echo management, resonance
 * calculations, and session lifecycle. Separates domain logic from UI
 * components to enforce clean architecture boundaries.
 */

import {
  RESONANCE_INCREMENT,
  RESONANCE_DECAY,
  MAX_RESONANCE_LEVEL,
  MAX_MESSAGE_CHARS,
} from '../constants/index.js';

/**
 * Create a new user echo object for persistence.
 * @param {string} frequencyId - The frequency channel ID
 * @param {string} text - The echo text content
 * @returns {Object} Serializable echo object with id, frequencyId, and text
 */
export function createEcho(frequencyId, text) {
  return {
    id: `user_echo_${Date.now()}`,
    frequencyId,
    text: text.slice(0, MAX_MESSAGE_CHARS),
  };
}

/**
 * Create a new user message object for the room stream.
 * @param {string} text - The message text content
 * @returns {Object} Message object with id, sender, text, isUser flag, timestamp, and resonated flag
 */
export function createUserMessage(text) {
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    sender: 'you',
    text: text.slice(0, MAX_MESSAGE_CHARS),
    isUser: true,
    timestamp: Date.now(),
    resonated: false,
  };
}

/**
 * Create a system notification message (join/leave events).
 * @param {string} type - Event type: 'join' or 'leave'
 * @param {string} displayName - The participant's display name
 * @returns {Object} System message object
 */
export function createSystemMessage(type, displayName) {
  const templates = {
    join: `${displayName} tuned into this frequency`,
    leave: `${displayName} drifted back into the void`,
  };

  return {
    id: `sys_${type}_${Date.now()}`,
    isSystem: true,
    text: templates[type] || `${displayName} ${type}`,
  };
}

/**
 * Calculate the new resonance level after a resonance event.
 * Uses bounded increment with ceiling at MAX_RESONANCE_LEVEL.
 * @param {number} currentLevel - Current resonance energy (0 to 1)
 * @returns {number} Updated resonance level
 */
export function calculateResonanceIncrement(currentLevel) {
  return Math.min(currentLevel + RESONANCE_INCREMENT, MAX_RESONANCE_LEVEL);
}

/**
 * Calculate the new resonance level after natural decay.
 * Uses bounded decrement with floor at 0.
 * @param {number} currentLevel - Current resonance energy (0 to 1)
 * @returns {number} Updated resonance level after decay
 */
export function calculateResonanceDecay(currentLevel) {
  return Math.max(currentLevel - RESONANCE_DECAY, 0);
}

/**
 * Apply resonance to a specific message in the message list.
 * Returns a new array with the targeted message marked as resonated.
 * @param {Array} messages - Current message array
 * @param {string} messageId - ID of the message to resonate
 * @returns {Array} New message array with updated resonance flag
 */
export function applyResonance(messages, messageId) {
  return messages.map((msg) =>
    msg.id === messageId ? { ...msg, resonated: true } : msg
  );
}

/**
 * Calculate the dissolution progress for the room's final 30 seconds.
 * Returns 0 when outside dissolution phase, scales linearly from 0 to 1
 * during the final 30 seconds.
 * @param {number} timeRemaining - Seconds remaining in the session
 * @param {number} [dissolutionDuration=30] - Duration of the dissolution phase
 * @returns {number} Dissolution progress from 0 (start) to 1 (complete)
 */
export function calculateDissolution(timeRemaining, dissolutionDuration = 30) {
  if (timeRemaining > dissolutionDuration) return 0;
  return (dissolutionDuration - Math.max(0, timeRemaining)) / dissolutionDuration;
}

/**
 * Validate message text before sending.
 * @param {string} text - Raw input text
 * @returns {{ valid: boolean, trimmed: string }} Validation result and trimmed text
 */
export function validateMessage(text) {
  const trimmed = (text || '').trim();
  return {
    valid: trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_CHARS,
    trimmed,
  };
}

/**
 * Record a frequency visit in the history map.
 * @param {Object} history - Current frequency history map
 * @param {string} frequencyId - ID of the visited frequency
 * @returns {Object} Updated history map
 */
export function recordFrequencyVisit(history, frequencyId) {
  return {
    ...history,
    [frequencyId]: {
      count: (history[frequencyId]?.count || 0) + 1,
      lastVisited: Date.now(),
    },
  };
}
