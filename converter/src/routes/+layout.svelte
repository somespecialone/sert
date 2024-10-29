<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	import Icon from '@iconify/svelte';

	import '$lib/assets/main.css';
	import '$lib/assets/variables.css';

	import ThemeBtn from '$lib/components/ThemeBtn.svelte';
	import GhRepoBtn from '$lib/components/GhRepoBtn.svelte';

	// sw
	$: webManifest = pwaInfo?.webManifest.linkTag || '';
	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegisterError(error) {
					console.error(error);
				}
			});
		}
	});
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<div id="app">
	<header>
		<ThemeBtn />
		<div>STEAM EXCHANGE RATE CONVERTER</div>
		<GhRepoBtn />
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<div class="made-by">
			Made by <a href="https://somespecial.one" target="_blank" rel="noreferrer">somespecial.one</a>
		</div>
		—
		<div class="made-with">
			with
			<a href="https://svelte.dev/" target="_blank" rel="noreferrer"><Icon icon="ri:svelte-fill" height="1.4rem" /></a>
			<a href="https://nitro.unjs.io/" target="_blank" rel="noreferrer"><Icon icon="unjs:nitro" height="1.4rem" /></a>
			<a href="https://www.cloudflare.com/" target="_blank" rel="noreferrer">
				<Icon icon="devicon-plain:cloudflare" height="1.4rem" />
			</a>
			<a href="https://github.com/" target="_blank" rel="noreferrer"><Icon icon="mdi:github" height="1.4rem" /></a>
			<Icon icon="mdi:heart" height="1.4rem" color="#ffce24" />
		</div>
	</footer>
</div>

<style lang="scss">
	#app {
		width: 100%;
		min-height: 100vh;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		background: var(--bg);

		color: var(--text);

		:global(::selection) {
			// steam style
			background: var(--accent);
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6666666667);
			color: white;
		}

		header,
		footer {
			position: relative;
			height: 4rem;

			display: flex;
			align-items: center;

			font-weight: 300;

			&:after,
			&:before {
				--shadow-height: 0.5rem;
			}
		}

		header {
			position: relative;
			top: 0;

			margin-bottom: 2.5rem;

			justify-content: center;

			background: var(--bg-second);

			font-size: 1.55rem;

			:global(.theme-btn) {
				position: absolute;
				left: 1rem;
			}

			:global(.gh-repo-btn) {
				position: absolute;
				right: 1rem;
			}

			&:after {
				content: '';
				position: absolute;
				width: 100%;
				height: var(--shadow-height);
				bottom: calc(-1 * var(--shadow-height));
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 30%, transparent 100%);
			}
		}

		footer {
			bottom: 0;

			justify-content: space-between;

			background-color: var(--foter-bg);

			font-size: 1.15rem;

			a {
				color: var(--accent-second);

				&:hover {
					color: var(--accent);
					text-decoration-line: underline;
					text-decoration-thickness: 1px;
					text-underline-offset: 0.3rem;
				}
			}

			div {
				padding: 0 1rem;
			}

			.made-with {
				display: flex;
				align-items: center;
				gap: 0.4rem;

				a {
					height: 1.4rem;
				}
			}

			&:before {
				content: '';
				position: absolute;
				width: 100%;
				height: var(--shadow-height);
				top: calc(-1 * var(--shadow-height));
				background: linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 30%, transparent 100%);
			}
		}

		main {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			:global(#rates-charts),
			:global(#converter) {
				width: 70%;
			}
		}

		@media screen and (max-width: 768px) {
			main :global(#rates-charts),
			main :global(#converter) {
				width: 100%;
				border-radius: 0 !important;
			}
		}

		@media screen and (max-width: 400px) {
			header,
			footer {
				font-size: 1.35rem;
			}
		}

		@media screen and (max-width: 320px) {
			header,
			footer {
				font-size: 1.4rem;
			}
		}
	}
</style>
