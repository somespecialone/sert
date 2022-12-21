<script>
import Time from "@/components/icons/Time.vue";

import { myRound } from "@/utils";
import { COLORS } from "@/constants";

export default {
  name: "ConverterWindow",
  components: { Time },
  props: {
    rates: {
      rates: Object,
      required: true,
    },
  },
  data() {
    return {
      values: {},
    };
  },
  watch: {
    rates() {
      this.updateValues();
    },
  },
  methods: {
    pickColor(key) {
      return COLORS[key];
    },
    updateValues() {
      const values = { USD: 1 };
      Object.entries(this.rates).forEach(([k, [v, _]]) => (values[k] = v));
      this.values = values;
    },
    handleChange(key, value) {
      const usdValue = myRound(value * (1 / this.rates[key][0]));
      this.values[key] = value;
      Object.keys(this.values).forEach((k) => {
        if (key !== k) {
          this.values[k] = myRound(usdValue * this.rates[k][0]);
        }
      });
    },
    isExpired(ts) {
      return new Date(ts * 1000).toDateString() !== new Date().toDateString();
    },
  },
};
</script>

<template>
  <div class="Rates">
    <div ref="rateLines" class="RatesLine" v-for="([k, v], i) of Object.entries(this.values)">
      <span v-if="k !== 'USD'" :style="{ color: pickColor(k) }">#</span>
      <label :for="k">{{ k }}</label>
      <input
        :id="k"
        type="number"
        placeholder="😎"
        :value="v"
        @input="handleChange(k, $event.target.value)"
        @focusin="$refs.rateLines[i].style.borderColor = 'var(--accent-color)'"
        @focusout="$refs.rateLines[i].style.borderColor = ''"
      />
      <Time v-if="k !== 'USD' && isExpired(rates[k][1])" />
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

    transition: border-color 0.15s linear;
    border-bottom: 1.5px solid lightgrey;

    //&:has(input:focus) {
    //  border-color: var(--accent-color);
    //}

    > span {
      position: absolute;
      right: 101%;
    }

    svg {
      position: absolute;
      left: 101%;
      top: 50%;
      transform: translateY(-50%);

      width: 2rem;
      fill: orangered;
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
