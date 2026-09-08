/**
 * Generates a stranger_XX pseudonym.
 * @returns {string} e.g. "stranger_17"
 */
export function generateStrangerName() {
  const num = Math.floor(Math.random() * 30) + 1;
  return `stranger_${num.toString().padStart(2, '0')}`;
}
