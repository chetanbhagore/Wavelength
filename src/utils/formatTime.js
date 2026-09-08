/**
 * Formats seconds into MM:SS display string
 * @param {number} seconds - Total seconds remaining
 * @returns {string} Formatted time string (e.g., "11:42")
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
