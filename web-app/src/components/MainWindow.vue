<script>
import Time from "./icons/Time.vue";

import { myRound } from "../utils";

export default {
  name: "MainWindow",
  components: { Time },
  data() {
    return {
      rates: {},
      values: {},
    };
  },
  async mounted() {
    const resp = await fetch(import.meta.env.VITE_API_URL + "/currencies");
    const rates = await resp.json();
    const values = { USD: rates.USD[0] };
    for (const [currencyKey, currencyValue] of Object.entries(rates)) {
      if (currencyKey !== "USD") {
        values[currencyKey] = currencyValue[0];
      }
    }

    this.rates = rates;
    this.values = values;
  },
  methods: {
    handleChange(key, value) {
      value = myRound(value);
      const toUSDCoef = this.rates.USD[0] / this.rates[key][0]; // 0.027
      const usdValue = myRound(value * toUSDCoef);
      this.values[key] = value;
      for (const [currencyKey, _] of Object.entries(this.values)) {
        if (key !== currencyKey) {
          this.values[currencyKey] = myRound(usdValue * this.rates[currencyKey][0]);
        }
      }
    },
    isExpired(key, expired = 24 * 60 * 60) {
      return new Date().getTime() / 1000 - this.rates[key][1] >= expired;
    },
  },
};
</script>

<template>
  <div class="ContainerInner">
    <div class="Name">Steam Market exchange converter</div>
    <div class="Window">
      <div class="CurrencyLine" v-for="[currencyKey, currencyValue] of Object.entries(values)">
        <label :for="currencyKey">{{ currencyKey }}</label>
        <input
          :id="currencyKey"
          type="number"
          placeholder="value"
          :value="currencyValue"
          @change="handleChange(currencyKey, $event.target.value)"
        />
        <Time :style="{ fill: isExpired(currencyKey) ? 'red' : 'limegreen' }" />
      </div>
    </div>
    <div class="By">
      — By <a href="https://github.com/somespecialone" target="_blank">somespecialone</a> —
    </div>
  </div>
</template>

<style scoped lang="scss">
.ContainerInner {
  position: absolute;
  left: 50%;
  top: 50%;

  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 70vh;
  width: 50vw;

  transform: translate(-50%, -50%);

  font-size: 3rem;
  font-weight: 100;
  color: white;

  > div {
    text-align: center;

    > a {
      transition: color 0.15s linear;

      &:hover {
        color: teal;
      }
    }
  }

  & .Window {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6);

    font-size: 1.5rem;
    font-weight: 300;
    color: black;

    padding: 2%;

    & .CurrencyLine {
      margin: 0.5rem auto;
      width: 50%;

      display: flex;
      justify-content: space-between;
      vertical-align: center;

      input {
        box-sizing: border-box;
        outline: none;
        border: none;
        border-bottom: 2px solid teal;

        background: none;

        font-family: "Roboto", sans-serif;
        font-size: 1.5rem;
        font-weight: 300;
      }

      svg {
        margin: auto 0;
      }
    }
  }
}
</style>
