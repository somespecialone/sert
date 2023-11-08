<script lang="ts">
	import Icon from '@iconify/svelte';

	import { browser } from '$app/environment';

	// @ts-ignore
	let theme: 'dark' | 'light' = browser ? localStorage.getItem('theme')! : 'dark';

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		document.body.setAttribute('data-theme', theme);
		document.head
			.querySelector('meta[name="theme-color"]')!
			.setAttribute('content', theme === 'dark' ? '#171A21' : '#7c87a1');
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="theme-btn" on:click={toggleTheme}>
	<Icon icon={theme === 'light' ? 'mdi:light-switch' : 'mdi:light-switch-off'} height="2rem" />
</div>

<style lang="scss">
	.theme-btn {
		cursor: pointer;
	}
</style>
