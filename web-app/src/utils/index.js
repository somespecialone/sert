/**
 * Round to 2 fractionDigits.
 * @param {number} value
 * @returns {number}
 */
export function myRound(value) {
  return Math.round(value * 100) / 100;
}
