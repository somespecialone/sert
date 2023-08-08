/**
 * Round to 2 fractionDigits.
 */
export function myRound(value: number): number {
	return Math.round(value * 100) / 100;
}

/**
 * Make new array with chunks.
 * @see https://stackoverflow.com/a/37826698/19419998
 */
export function chunkArray<T>(inputArray: T[], chunkSize: number): T[][] {
	return inputArray.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / chunkSize);

		if (!resultArray[chunkIndex]) {
			// @ts-ignore
			resultArray[chunkIndex] = [];
		}
		// @ts-ignore
		resultArray[chunkIndex].push(item);
		return resultArray;
	}, []);
}

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

export function rateIsExpired(ts: number): boolean {
	return new Date(ts * 1000).toDateString() !== new Date().toDateString();
}
