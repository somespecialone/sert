/**
 * Round to 2 fractionDigits.
 */
export function myRound(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * That's JS :)
 * @see https://stackoverflow.com/a/11964609/19419998
 */
export function getUTCDate(): Date {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000)
}

export function rateIsExpired(ts: number): boolean {
  return new Date(ts * 1000).toDateString() !== getUTCDate().toDateString()
}
