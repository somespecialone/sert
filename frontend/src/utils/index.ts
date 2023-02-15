/**
 * Round to 2 fractionDigits.
 */
export function myRound(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Get random number between margins.
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.ceil(Math.random() * (max - min) + min);
}
