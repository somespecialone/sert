import { Deta } from 'deta';
import type Base from 'deta/dist/types/base/base';

import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

let db: Base;

export function initDB(): Base {
	if (!db) {
		const deta = Deta(building ? 'building' : env.DETA_PROJECT_KEY); // avoid error during building
		db = deta.Base(env.DETA_BASE_NAME || 'SERT');
	}
	return db;
}
