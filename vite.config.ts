import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import { MyExpPlugin } from './config/workbox';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			workbox: {
				navigateFallbackDenylist: [/^\/api/],
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.startsWith('/api'),
						handler: 'CacheFirst',
						options: { cacheName: 'api-cache', plugins: [new MyExpPlugin()] }
					}
				]
			},
			manifest: {
				name: 'Steam Exchange Rate Tracker',
				short_name: 'SERT | Converter',
				id: '/',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#171A21',
				lang: 'en',
				description:
					'Steam currency rate tracker and converter. ' +
					'Stay updated on Steam market prices and convert gaming currencies with easy!',
				theme_color: '#171A21',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			}
		})
	]
});
