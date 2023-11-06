// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	module 'virtual:pwa-info' {
		import { PwaInfo } from 'vite-plugin-pwa/info';
		export const pwaInfo: PwaInfo | undefined;
	}

	module 'virtual:pwa-register' {
		import { RegisterSWOptions } from 'vite-plugin-pwa/types';
		export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

// don't know why types of import from `svelte` isn't work, so this fix
export * from 'svelte';
