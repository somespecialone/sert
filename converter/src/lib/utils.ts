export { myRound, rateIsExpired } from '../../../utils';

/**
 * Get random number between margins.
 */
export function getRandomArbitrary(min: number, max: number): number {
	return Math.ceil(Math.random() * (max - min) + min);
}

/**
 * @see https://stackoverflow.com/a/1484514
 */
export function* getRandomColor() {
	const letters = '0123456789ABCDEF';
	while (true) {
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		yield color;
	}
}
