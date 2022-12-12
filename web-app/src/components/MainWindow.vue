<script>
import Time from "./icons/Time.vue";
import RatesChart from "./RatesChart.vue";
import ConverterWindow from "./ConverterWindow.vue";

import { Backend } from "@/services";

export default {
  name: "MainWindow",
  components: { Time, RatesChart, ConverterWindow },
  data() {
    return {
      rates: {},
      history: {},
    };
  },
  async mounted() {
    await this.updateRates();
    await this.updateHistory();
  },
  methods: {
    async updateRates() {
      const rates = await Backend.getRates();
      rates.USD = [1, 0];
      this.rates = rates;
    },
    async updateHistory() {
      this.history = await Backend.getHistory();
    },
  },
};
</script>

<template>
  <div class="MainWindow">
    <ConverterWindow :rates="rates" />
    <RatesChart :history="history" />
  </div>
</template>

<style scoped lang="scss">
.MainWindow {
  width: 70%;
  margin: 0 auto;

  @media screen and (max-width: 768px) {
    & {
      width: 100%;

      & .Rates,
      .Charts {
        border-radius: 0 !important;
      }
    }
  }
}
</style>
