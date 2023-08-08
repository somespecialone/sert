// ws cache plugin
import type { WorkboxPlugin } from 'workbox-core';

export class MyExpPlugin implements WorkboxPlugin {
	cachedResponseWillBeUsed: WorkboxPlugin['cachedResponseWillBeUsed'] = async ({ cachedResponse }) => {
		return cachedResponse && new Date(cachedResponse.headers.get('X-Expired-At')!) > new Date() ? cachedResponse : null;
	};
}
