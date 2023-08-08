// CRON job route for Deta

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { updateCurrencyRates } from '$lib/server/cron';

export const POST = (async ({ request, locals: { db } }) => {
	const { event } = await request.json();
	if (event?.id === 'update-rates') {
		return json(await updateCurrencyRates(db));
	} else {
		return json(null, { status: 400 });
	}
}) satisfies RequestHandler;
