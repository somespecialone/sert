<script lang="ts">
	import SwitchOff from '$lib/components/icons/SwitchOff.svelte';
	import SwitchOn from '$lib/components/icons/SwitchOn.svelte';

	import { browser } from '$app/environment';

	// @ts-ignore
	let theme: 'dark' | 'light' = browser ? localStorage.getItem('theme')! : 'dark';

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		document.body.setAttribute('data-theme', theme);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="theme-btn" on:click={toggleTheme}>
	<svelte:component this={theme === 'light' ? SwitchOn : SwitchOff} />
</div>

<style lang="scss">
	.theme-btn {
		cursor: pointer;

		:global(svg) {
			height: 2rem;
		}
	}
</style>
