<script lang="ts">
	import { myRound, rateIsExpired } from '$lib/utils';
	import { COLORS } from '$lib/constants';

	import ExpiredIco from '$lib/components/icons/ExpiredIco.svelte';

	type TRates = Record<string, number[]>;

	export let rates: TRates = {};
	let values: Record<string, number> = {};
	let focusedCurrency = '';

	function updateValues(rates: TRates) {
		values = { USD: 1 };
		Object.entries(rates).forEach(([k, [v]]) => (values[k] = v));
	}

	$: updateValues(rates);

	function handleChange(key: string, value: number) {
		const usdValue = myRound(value * (1 / rates[key][0]));
		values[key] = value;
		Object.keys(values).forEach((k) => key !== k && (values[k] = myRound(usdValue * rates[k][0])));
	}
</script>

<div class="converter">
	{#each Object.entries(values) as [currency, value] (currency)}
		<div class="rate-line" class:focused={focusedCurrency === currency}>
			{#if currency !== 'USD'}
				<span style="color: {COLORS[currency]}">#</span>
			{/if}
			<label for={currency}>{currency}</label>
			<input
				id={currency}
				type="number"
				placeholder="😎"
				{value}
				on:input={(e) => handleChange(currency, e.target.value)}
				on:focusin={() => (focusedCurrency = currency)}
				on:focusout={() => (focusedCurrency = '')}
			/>
			{#if currency !== 'USD' && rateIsExpired(rates[currency][1])}
				<ExpiredIco />
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.converter {
		$fz: 1.5rem;

		padding: var(--pd);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		border-radius: var(--br) var(--br) 0 0;
		background: var(--bg-third);

		font-size: $fz;
		font-weight: 300;

		.rate-line {
			position: relative;

			width: fit-content;

			display: flex;
			justify-content: space-evenly;
			gap: 1rem;

			border-bottom: 1.5px solid var(--accent-second);

			&.focused {
				border-color: var(--accent);

				label {
					color: var(--accent);
				}

				input {
					color: var(--text-active);
				}
			}

			span {
				position: absolute;
				right: 101%;
			}

			label {
				margin: auto 0;
			}

			input {
				box-sizing: border-box;
				outline: none;
				border: none;

				background: none;

				font-family: 'Roboto', sans-serif;
				font-size: $fz;
				font-weight: 300;

				color: var(--accent-second);
			}

			:global(svg) {
				position: absolute;
				left: 101%;
				top: 50%;
				transform: translateY(-50%);

				width: 2rem;
				color: var(--orange-base);
			}
		}
	}
</style>
