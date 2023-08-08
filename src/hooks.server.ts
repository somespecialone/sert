import type { Handle } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { initDB } from '$lib/server/db';
import { CRON_MINUTES } from '$lib/constants';

export const handle = (async ({ event, resolve }) => {
	// CORS
	const isApiRoute = event.url.pathname.startsWith('/api');

	if (isApiRoute && event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
				'Access-Control-Allow-Headers': '*'
			}
		});
	}

	event.locals.db = initDB();
	const resp = await resolve(event);

	if (isApiRoute) {
		// expired at
		const now = new Date();
		const currentMinute = now.getMinutes();

		if (currentMinute <= CRON_MINUTES[0]) {
			now.setMinutes(CRON_MINUTES[0], 0, 0);
		} else if (currentMinute <= CRON_MINUTES[1]) {
			now.setMinutes(CRON_MINUTES[1], 0, 0);
		} else {
			const roundedToHour = Math.ceil(now.getTime() / (1000 * 60 * 60)) * 1000 * 60 * 60;
			now.setTime(roundedToHour + 1000 * 60 * CRON_MINUTES[0]); // + nearest minutes
		}

		resp.headers.set('X-Expired-At', now.toUTCString());
		resp.headers.set('Access-Control-Allow-Origin', env.ALLOW_ORIGIN || '*'); // CORS
	}

	return resp;
}) satisfies Handle;
