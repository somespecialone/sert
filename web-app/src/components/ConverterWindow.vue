<script>
import { myRound } from "@/utils";
import { COLORS } from "@/constants";

export default {
  name: "ConverterWindow",
  props: {
    rates: {
      rates: Object,
      required: true,
    },
  },
  data() {
    return {
      values: {},
      COLORS,
    };
  },
  watch: {
    rates(newRates) {
      const values = { USD: 1 };
      Object.entries(newRates).forEach(([k, [v, _]]) => (values[k] = v));
      this.values = values;
    },
  },
  methods: {
    handleChange(key, value) {
      const usdValue = myRound(value * (1 / this.rates[key][0]));
      this.values[key] = value;
      Object.entries(this.values).forEach(([k, _]) => {
        if (key !== k) {
          this.values[k] = myRound(usdValue * this.rates[k][0]);
        }
      });
    },
  },
};
</script>

<template>
  <div class="Rates">
    <div class="RatesLine" v-for="[currencyKey, currencyValue] of Object.entries(values)">
      <span v-if="currencyKey !== 'USD'" :style="{ color: COLORS[currencyKey] }">#</span>
      <label :for="currencyKey">{{ currencyKey }}</label>
      <input
        :id="currencyKey"
        type="number"
        placeholder="😎"
        :value="currencyValue"
        @input="handleChange(currencyKey, $event.target.value)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.Rates {
  $fz: 1.5rem;

  padding: var(--pd);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  border-radius: var(--br) var(--br) 0 0;
  background: rgba(255, 255, 255, 0.5);

  font-size: $fz;
  font-weight: 300;
  color: black;

  & .RatesLine {
    position: relative;
    width: fit-content;

    display: flex;
    justify-content: space-evenly;
    gap: 1rem;

    border-bottom: 1.5px solid lightgrey;

    > span {
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

      font-family: "Roboto", sans-serif;
      font-size: $fz;
      font-weight: 300;
    }
  }
}
</style>
