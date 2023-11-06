/**
 * Round to 2 fractionDigits.
 */
export function myRound(value: number): number {
  return Math.round(value * 100) / 100
}
