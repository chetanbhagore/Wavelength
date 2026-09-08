import mockData from '../data/mockParticipants.json';

/**
 * Picks a random subset of mock participants for a room.
 * @param {number} count - Number of participants to pick (default 4-6, randomized)
 * @returns {Array} Array of participant objects
 */
export function pickMockParticipants(count) {
  const pool = [...mockData.participants];
  const n = count || (Math.floor(Math.random() * 3) + 4); // 4-6

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, n);
}

/**
 * Gets the message pool for a specific frequency.
 * @param {string} frequencyId
 * @returns {string[]} Array of pre-written messages
 */
export function getMessagesForFrequency(frequencyId) {
  return mockData.messagesByFrequency[frequencyId] || [];
}
