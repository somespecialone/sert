<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getRandomArbitrary } from '$lib/utils';

	let timeout: ReturnType<typeof setTimeout>;
	let animation = false;

	function animationWatcher(state: boolean) {
		timeout = setTimeout(() => (animation = !animation), state ? 501 : getRandomArbitrary(21e3, 36e3));
	}

	$: animationWatcher(animation);

	onDestroy(() => clearTimeout(timeout));
</script>

<a class="gh-repo-btn" href="https://github.com/somespecialone/sert" target="_blank" rel="noreferrer" class:animation>
	<div class="gh-ico" />
</a>

<style lang="scss">
	.gh-repo-btn {
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
			-webkit-mask-image: url('/github.svg');
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
