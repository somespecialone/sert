/**
 * Round to 2 fractionDigits.
 * @param {number} value
 * @returns {number}
 */
export function myRound(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Get random number between margins.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}
