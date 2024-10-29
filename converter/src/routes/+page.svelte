<script lang="ts">
	import { onMount } from 'svelte';

	import { getRandomColor } from '$lib/utils';
	import { COLORS } from '$lib/constants';

	import Converter from '$lib/components/Converter.svelte';
	import RatesCharts from '$lib/components/RatesCharts.svelte';

	import { PUBLIC_API_BASE_URL } from '$env/static/public';

	let history: Record<string, number[][]> = {};
	let rates: Record<string, number[]> = {};

	onMount(async () => {
		const res = await fetch(`${PUBLIC_API_BASE_URL}/history`);
		history = await res.json();
		Object.entries(history).forEach(([k, [[rate, ts]]]) => {
			// generate color if there is not
			if (!COLORS[k]) {
				COLORS[k] = <string>getRandomColor().next().value;
			}
			rates[k] = [rate, ts];
		});
	});
</script>

<Converter {rates} />
<RatesCharts {history} />
