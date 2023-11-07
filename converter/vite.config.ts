import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			injectRegister: false,
			registerType: 'autoUpdate',
			manifest: {
				name: 'Steam Exchange Rate Converter',
				short_name: 'Converter',
				id: '/',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#171A21',
				lang: 'en',
				description:
					'Steam currency rate converter. Stay updated on Steam market prices and convert currencies with easy!',
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
