<script>
import RatesChart from "./RatesChart.vue";
import ConverterWindow from "./ConverterWindow.vue";

import { Backend } from "@/services";

export default {
  name: "MainWindow",
  components: { RatesChart, ConverterWindow },
  data() {
    return {
      rates: {},
      history: {},
    };
  },
  async mounted() {
    await this.initData();
  },
  methods: {
    async initData() {
      this.history = await Backend.getHistory();
      const rates = { USD: [1, 0] };
      Object.entries(this.history).forEach(([k, v]) => (rates[k] = [v[0][0], v[0][1]]));
      this.rates = rates;
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
