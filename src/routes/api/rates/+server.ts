import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { CURRENCIES, RATES_PREFIX } from '$lib/constants';

type RateItem = { key: string; updated: number; rate: number };

export const GET = (async ({ locals: { db } }) => {
	const { items } = await db.fetch({ 'key?pfx': RATES_PREFIX });

	return json(
		(items as RateItem[])
			.sort(
				(a, b) =>
					CURRENCIES[a.key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES] -
					CURRENCIES[b.key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES]
			)
			.reduce<{ [key in keyof typeof CURRENCIES]?: [number, number] }>((resObj, { key, rate, updated }) => {
				resObj[key.slice(RATES_PREFIX.length) as keyof typeof CURRENCIES] = [rate, updated];
				return resObj;
			}, {})
	);
}) satisfies RequestHandler;
