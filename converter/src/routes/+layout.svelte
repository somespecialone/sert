<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

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
		<div class="By">
			— BY <a href="https://somespecial.one" target="_blank" rel="noreferrer">SOMESPECIAL.ONE</a> WITH 💛 —
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
			justify-content: center;
			align-items: center;

			font-size: 1.55rem;
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

			background: var(--bg-second);

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

			background-color: var(--foter-bg);

			.By a {
				color: var(--accent-second);

				&:hover {
					color: var(--accent);
					text-decoration-line: underline;
					text-decoration-thickness: 1px;
					text-underline-offset: 0.3rem;
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
