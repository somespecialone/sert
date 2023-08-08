<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	import '$lib/assets/main.css';
	import '$lib/assets/variables.css';

	import { getRandomArbitrary } from '$lib/utils';

	let timeout: number;
	let animation = false;

	function animationWatcher(state: boolean) {
		timeout = setTimeout(() => (animation = !animation), state ? 501 : getRandomArbitrary(21e3, 36e3));
	}

	$: animationWatcher(animation);

	// sw
	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
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

	onMount(() => animationWatcher(animation));
	onDestroy(() => clearTimeout(timeout));
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<div id="app">
	<header>
		<div>STEAM EXCHANGE RATE CONVERTER</div>
		<a href="https://github.com/somespecialone/sert" target="_blank" rel="noreferrer" class:animation>
			<div class="gh-ico" />
		</a>
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
		position: fixed;

		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		background: var(--bg);

		color: var(--text);

		::selection {
			background: var(--accent);
			color: var(--bg-second);
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

			background: var(--bg-second);

			a {
				position: absolute;
				right: 1rem;

				&.animation {
					animation: quick 0.25s infinite reverse;
				}

				$s: rgba(0, 167, 255, 1);
				$w: rgba(235, 255, 0, 1);

				$d: 12%;
				$sd: darken($s, $d);
				$wd: darken($w, $d);

				&:hover :global(.gh-ico) {
					background: linear-gradient(180deg, $sd 0%, $sd 49%, $wd 50%, $wd 100%);
				}

				:global(.gh-ico) {
					width: 2rem;
					height: 2rem;

					background: linear-gradient(180deg, $s 0%, $s 49%, $w 50%, $w 100%);
					mask-image: url('/github.svg');
					-webkit-mask-image: url('/github.svg'); // Deta postcss won't polyfill this
				}
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

			background-color: black;

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

			:global(.rates-charts),
			:global(.converter) {
				width: 70%;
			}
		}

		@media screen and (max-width: 768px) {
			main :global(.rates-charts),
			main :global(.converter) {
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

	@keyframes quick {
		25% {
			transform: rotate(-15deg);
		}
		75% {
			transform: rotate(15deg);
		}
	}
</style>
