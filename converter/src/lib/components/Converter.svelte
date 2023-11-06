<script lang="ts">
	import { tick } from 'svelte';
	import { myRound, rateIsExpired } from '$lib/utils';
	import { COLORS } from '$lib/constants';

	import ExpiredIco from '$lib/components/icons/ExpiredIco.svelte';

	type TRates = Record<string, number[]>;

	export let rates: TRates = {};
	const values: Record<string, number> = { USD: 1 };
	let focusedCurrency = '';
	let filled: boolean = false;

	async function updateValues(rates: TRates) {
		rates.USD = [1, 0];
		Object.entries(rates).forEach(([k, [v]]) => (values[k] = v));
		// wait until data is loaded
		if (Object.values(rates)[1]) {
			await tick(); // ensure that rates rendered
			filled = true;
		}
	}

	$: updateValues(rates);

	function handleChange(key: string, value: number) {
		if (!value) return; // ignore not numbers or 0
		const usdValue = myRound(value * (1 / rates[key][0]));
		values[key] = value;
		Object.keys(values).forEach((k) => key !== k && (values[k] = myRound(usdValue * rates[k][0])));
	}
</script>

<div id="converter" class:filled>
	{#each Object.entries(values) as [currency, value] (currency)}
		<div class="rate-line" class:focused={focusedCurrency === currency}>
			<label for={currency} style="color: {COLORS[currency]}">{currency}</label>
			<input
				id={currency}
				type="number"
				placeholder="😎"
				{value}
				on:input={(e) => handleChange(currency, Number(e.target.value))}
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
	#converter {
		$fz: 1.5rem;

		// smallest height
		height: 258.33px;

		padding: var(--pd);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		border-radius: var(--br) var(--br) 0 0;
		background: var(--bg-third);

		font-size: 2rem;
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

			label {
				margin: auto 0;
			}

			input {
				box-sizing: border-box;
				outline: none;
				border: none;

				background: none;

				font-family: 'Roboto', sans-serif;
				font-size: 2rem;
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

		// predefined height for 7 rate lines
		&.filled {
			height: auto;
		}

		@media (width > 355px) {
			height: 285.33px;

			font-size: $fz;

			.rate-line input {
				font-size: $fz;
			}
		}

		@media (width > 900px) {
			height: 368px;
		}
	}
</style>
