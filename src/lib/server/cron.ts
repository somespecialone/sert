import { env } from '$env/dynamic/private';

import { CURRENCIES, RATES_PREFIX, HISTORY_PREFIX } from '$lib/constants';
import { chunkArray, myRound } from '$lib/utils';

import type Base from 'deta/dist/types/base/base';

type DbEntry = { key: string; history?: [number, number][]; updated: number; rate?: number };
type ListingData = { price: number; converted_price: number; currencyid: number };

export async function updateCurrencyRates(db: Base): Promise<DbEntry[]> {
	// constants
	const LISTING_ID = env.LISTING_ID;
	const ITEM_MARKET_NAME = env.ITEM_MARKET_NAME;
	const LISTING_FILTER_PARAM = env.LISTING_FILTER_PARAM || '';
	const LISTING_START_PARAM = env.LISTING_START_PARAM || '0';
	const CURRENCIES_TO_FETCH = env.CURRENCIES_TO_FETCH || 'EUR,PLN,UAH';
	const RATE_LIMIT = Number(env.RATE_LIMIT || 4);
	const STEAM_GAME_ID = env.STEAM_GAME_ID || '730';
	const HISTORY_SIZE = Number(env.HISTORY_SIZE || 150);

	const listingURL = `https://steamcommunity.com/market/listings/${STEAM_GAME_ID}/${encodeURIComponent(
		ITEM_MARKET_NAME
	)}`;

	const currenciesToFetch = CURRENCIES_TO_FETCH.split(',').reduce<[number, keyof typeof CURRENCIES][]>(
		(targetArr, curName) => {
			const trimmed = curName.trim() as keyof typeof CURRENCIES;
			trimmed in CURRENCIES && targetArr.push([CURRENCIES[trimmed], trimmed]);
			return targetArr;
		},
		[]
	);

	const items: DbEntry[] = [];
	let originalToUSDRate = 1; // original currency rate to USD

	const querySet = await db.fetch();
	const querySetItems = querySet.items as DbEntry[];

	// all histories, even not omitted
	const histories = querySetItems.reduce<{ [key: string]: [number, number][] }>((resObj, { key, history }) => {
		history && (resObj[key] = history);
		return resObj;
	}, {});

	const nowLocal = new Date();
	const nowUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);
	// @ts-ignore
	const toOmit: [keyof typeof CURRENCIES] = querySetItems.reduce((resArr, { key, updated }) => {
		if (key.startsWith(RATES_PREFIX)) {
			if (new Date(updated * 1000).toDateString() === nowUTC.toDateString()) {
				resArr.push(key.split(RATES_PREFIX)[1] as never); // omit
			}
		}
		return resArr;
	}, []);

	// if all updated in time there is no need to fetch something
	if (currenciesToFetch.every(([, currName]) => toOmit.includes(currName))) return items;

	let i = 0;
	for (const [currencyId, currencyName] of [[1, 'USD'], ...currenciesToFetch] as [number, keyof typeof CURRENCIES][]) {
		if (toOmit.includes(currencyName)) continue;
		if (i === RATE_LIMIT) break;

		const query = new URLSearchParams({
			start: LISTING_START_PARAM,
			count: '10',
			country: 'UA',
			language: 'english',
			currency: currencyId.toString(),
			filter: LISTING_FILTER_PARAM
		});

		const resp = await fetch(listingURL + '/render/?' + query, {
			method: 'GET',
			headers: { referer: listingURL }
		});
		i++;

		if (resp.ok) {
			const resJson: Record<string, Record<string, ListingData>> = await resp.json();
			const listingData = resJson['listinginfo'][LISTING_ID];
			if (!Object.entries(listingData).length) continue;

			// UTC ts in seconds
			const updated = Math.round(nowUTC.getTime() / 1000);

			if (currencyId === 1) {
				originalToUSDRate = myRound(listingData['price'] / listingData['converted_price']);

				// original listing currency if she in to fetch list and not omitted due to update time
				const originalCurrency = currenciesToFetch.find(([currId]) => currId === listingData['currencyid'] - 2000);
				if (originalCurrency?.length && !toOmit.includes(originalCurrency[1])) {
					const ratesKey = RATES_PREFIX + originalCurrency[1];
					const historyKey = HISTORY_PREFIX + originalCurrency[1];
					const originalHistory = historyKey in histories ? chunkArray(histories[historyKey], HISTORY_SIZE)[0] : [];
					originalHistory.unshift([originalToUSDRate, updated]);

					items.push({ key: ratesKey, updated, rate: originalToUSDRate });
					items.push({ key: historyKey, updated, history: originalHistory });

					toOmit.push(originalCurrency[1]);
				}
			} else {
				const ratesKey = RATES_PREFIX + currencyName;
				const historyKey = HISTORY_PREFIX + currencyName;
				const rate = myRound((listingData['converted_price'] / listingData['price']) * originalToUSDRate);
				const history = historyKey in histories ? chunkArray(histories[historyKey], HISTORY_SIZE)[0] : [];
				history.unshift([rate, updated]);

				items.push({ key: ratesKey, updated, rate });
				items.push({ key: historyKey, updated, history });
			}
		} else if (resp.status === 429) {
			console.warn(`Hit rate limit [i=${i}].`);
			break;
		}
	}

	// save chunks
	if (items.length) {
		for (const chunk of chunkArray(items, 25)) {
			await db.putMany(chunk);
		}
	}

	return items;
}
