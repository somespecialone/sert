<script lang="ts">
	import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { Line } from 'svelte-chartjs';

	import type { LineProps } from 'svelte-chartjs/Line.svelte';
	import type { Options as DatalabelsOptions } from 'chartjs-plugin-datalabels/types/options';

	import { myRound } from '$lib/utils';
	import { COLORS } from '$lib/constants';

	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartDataLabels);

	// @ts-ignore
	const options: LineProps['options'] = {
		elements: {
			line: { tension: 0.4 },
			point: { pointStyle: 'rectRounded', radius: 4, hoverRadius: 6, hitRadius: 11 }
		},
		maintainAspectRatio: false,
		layout: {
			padding: { top: 12 * 1.5, right: 20 * 1.5, bottom: 12 * 1.5, left: 20 * 1.5 }
		},
		plugins: {
			datalabels: <DatalabelsOptions>{
				backgroundColor(ctx) {
					return ctx.dataset.backgroundColor;
				},
				borderRadius: 4,
				color: 'white',
				formatter(_, ctx) {
					// @ts-ignore
					return ctx.dataset.data![ctx.dataIndex].rate;
				},
				padding: 4,
				display: 'auto'
			},
			tooltip: {
				callbacks: {
					label(ctx) {
						// @ts-ignore
						const percentage = (ctx.raw.y > 0 ? '+' : '') + (ctx.raw.y * 100).toFixed();
						// @ts-ignore
						const points = (ctx.raw.changePoints > 0 ? '+' : '') + ctx.raw.changePoints;
						// @ts-ignore
						return ` ${ctx.dataset.label}: ${ctx.raw.rate} | ${percentage}% | ${points}`;
					}
				}
			}
		},
		scales: {
			x: { reverse: true, display: false },
			y: { reverse: true, display: false }
		}
	};

	type THistory = Record<string, number[][]>;
	export let history: THistory = {};
	let data: LineProps['data'] = { datasets: [] };

	function calcChangePercentPoints(oldValue: number, newValue: number): [number, number] {
		const changePoints = myRound(newValue - oldValue);
		return [myRound(changePoints / newValue), changePoints];
	}

	function updateChartData(history: THistory) {
		const datasets = Object.entries(history).reduce<DatalabelsOptions[]>((newArr, [currKey, entries]) => {
			const color = COLORS[currKey];
			newArr.push({
				// @ts-ignore
				label: currKey,
				backgroundColor: color,
				borderColor: color,
				data: entries.reduce<Record<string, any>[]>((newEntryArr, [rate, ts]) => {
					const [y, changePoints] = calcChangePercentPoints(entries[entries.length - 1][0], rate);
					newEntryArr.push({ y, x: new Date(ts * 1000).toDateString(), rate, changePoints });
					return newEntryArr;
				}, [])
			});
			return newArr;
		}, []);

		// @ts-ignore
		data = { datasets };
	}

	$: updateChartData(history);
</script>

<div id="rates-charts">
	<Line {options} {data} />
</div>

<style lang="scss">
	#rates-charts {
		height: 25vh;

		padding: calc(var(--pd) / 4);

		border-radius: 0 0 var(--br) var(--br);
		background: var(--bg-second);
	}
</style>
