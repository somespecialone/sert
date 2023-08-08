<script lang="ts">
	import { onMount } from 'svelte';

	import { getRandomColor } from '$lib/utils';
	import { COLORS } from '$lib/constants';

	import Converter from '$lib/components/Converter.svelte';
	import RatesCharts from '$lib/components/RatesCharts.svelte';

	let history: Record<string, number[][]> = {};
	let rates: Record<string, number[]> = {};

	onMount(async () => {
		const res = await fetch('/api/history');
		history = await res.json();
		Object.entries(history).forEach(([k, [[rate, ts]]]) => {
			!COLORS[k] && (COLORS[k] = getRandomColor().next().value); // generate color if there is not
			rates[k] = [rate, ts];
		});
	});
</script>

<Converter {rates} />
<RatesCharts {history} />
