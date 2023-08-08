// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type Base from 'deta/dist/types/base/base';

declare global {
	module 'virtual:pwa-info' {
		import type { PwaInfo } from 'vite-plugin-pwa/info';
		const pwaInfo: PwaInfo | undefined;
	}

	module 'virtual:pwa-register' {
		import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
		function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			db: Base;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
