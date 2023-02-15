<script lang='ts'>
	import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { Line } from 'svelte-chartjs';

	import { myRound } from '@/utils';
	import { COLORS } from '@/constants';

	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartDataLabels);

	const options = {
		elements: {
			line: { tension: 0.4 },
			point: { pointStyle: 'rectRounded', radius: 4, hoverRadius: 6, hitRadius: 11 }
		},
		maintainAspectRatio: false,
		layout: {
			padding: {
				top: 12 * 1.5,
				right: 20 * 1.5,
				bottom: 12 * 1.5,
				left: 20 * 1.5
			}
		},
		plugins: {
			datalabels: {
				backgroundColor(ctx) {
					return ctx.dataset.backgroundColor;
				},
				borderRadius: 4,
				color: 'white',
				formatter(value, ctx) {
					return ctx.dataset.data[ctx.dataIndex].rate;
				},
				padding: 4,
				display: 'auto'
			},
			tooltip: {
				callbacks: {
					label(ctx) {
						const percentage = (ctx.raw.y > 0 ? '+' : '') + ctx.raw.y * 100;
						const points = (ctx.raw.changePoints > 0 ? '+' : '') + ctx.raw.changePoints;
						return ` ${ctx.dataset.label}: ${ctx.raw.rate} | ${percentage}% | ${points}`;
					}
				}
			}
		},
		scales: {
			x: {
				reverse: true,
				display: false
			},
			y: {
				reverse: true,
				display: false
			}
		}
	};

	type THistory = Record<string, number[][]>
	export let history: THistory = {};
	let data = { datasets: [] };

	function calcChangePercentPoints(oldValue, newValue) {
		const changePoints = myRound(newValue - oldValue);
		return [myRound(changePoints / newValue), changePoints];
	}

	function updateChartData(history: THistory) {
		const datasets = Object.entries(history).reduce((newArr, [currKey, entries]) => {
			const color = COLORS[currKey];
			newArr.push({
				label: currKey,
				backgroundColor: color,
				borderColor: color,
				data: entries.reduce((newEntryArr, [rate, ts]) => {
					const [y, changePoints] = calcChangePercentPoints(entries[entries.length - 1][0], rate);
					newEntryArr.push({ y, x: new Date(ts * 1000).toDateString(), rate, changePoints });
					return newEntryArr;
				}, [])
			});
			return newArr;
		}, []);

		data = { datasets };
	}

	$: updateChartData(history);

</script>

<div class='RatesCharts'>
	<Line id='rates-change-chart' {options} {data} />
</div>

<style lang='scss'>
  .RatesCharts {
    height: 25vh;

    padding: calc(var(--pd) / 4);

    border-radius: 0 0 var(--br) var(--br);
    background: var(--bg-second);
  }
</style>
