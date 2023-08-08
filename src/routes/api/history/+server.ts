import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { CURRENCIES, HISTORY_PREFIX } from '$lib/constants';

type HistoryItem = { key: string; updated: number; history: [number, number][] };

export const GET = (async ({ url, locals: { db } }) => {
	const length = Number(url.searchParams.get('length') ?? Number(env.HISTORY_LENGTH || 30));
	const all = url.searchParams.has('all');

	if (length <= 0) throw error(400, 'Invalid "length" query param');

	const { items } = await db.fetch({ 'key?pfx': HISTORY_PREFIX });
	return json(
		(items as HistoryItem[])
			.sort(
				(a, b) =>
					CURRENCIES[a.key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES] -
					CURRENCIES[b.key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES]
			)
			.reduce((resObj, { key, history }) => {
				resObj[key.slice(HISTORY_PREFIX.length) as keyof typeof CURRENCIES] = history.slice(
					0,
					all ? undefined : length
				);
				return resObj;
			}, {} as Record<keyof typeof CURRENCIES, number[][]>)
	);
}) satisfies RequestHandler;
