<script>
import { Line } from "vue-chartjs";
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { myRound } from "@/utils";
import { COLORS } from "@/constants";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartDataLabels);

const chartOptions = {
  elements: {
    line: { tension: 0.4 },
    point: { pointStyle: "rectRounded", radius: 4, hoverRadius: 6, hitRadius: 11 },
  },
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 12,
      right: 20,
      bottom: 12,
      left: 20,
    },
  },
  plugins: {
    datalabels: {
      backgroundColor(ctx) {
        return ctx.dataset.backgroundColor;
      },
      borderRadius: 4,
      color: "white",
      formatter(value, ctx) {
        return ctx.dataset.data[ctx.dataIndex].rate;
      },
      padding: 4,
      display: "auto",
    },
    tooltip: {
      callbacks: {
        label(ctx) {
          const percentage = (ctx.raw.y > 0 ? "+" : "") + ctx.raw.y * 100;
          const points = (ctx.raw.changePoints > 0 ? "+" : "") + ctx.raw.changePoints;
          return ` ${ctx.dataset.label}: ${ctx.raw.rate} | ${percentage}% | ${points}`;
        },
      },
    },
  },
  scales: {
    x: {
      reverse: true,
      display: false,
    },
    y: {
      reverse: true,
      display: false,
    },
  },
};

export default {
  name: "RatesChart",
  components: { Line },
  props: {
    history: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartData: {
        datasets: [],
      },
      chartOptions,
    };
  },
  watch: {
    history(newHistory) {
      const datasets = Object.entries(newHistory).reduce((newArr, [currKey, entries]) => {
        newArr.push({
          label: currKey,
          backgroundColor: COLORS[currKey],
          borderColor: COLORS[currKey],
          data: entries.reduce((newEntryArr, [rate, ts]) => {
            const [y, changePoints] = this.calcChangePercentPoints(entries[entries.length - 1][0], rate);
            newEntryArr.push({ y, x: new Date(ts * 1000).toDateString(), rate, changePoints });
            return newEntryArr;
          }, []),
        });
        return newArr;
      }, []);

      this.chartData = { datasets };
    },
  },
  methods: {
    calcChangePercentPoints(oldValue, newValue) {
      const changePoints = myRound(newValue - oldValue);
      return [myRound(changePoints / newValue), changePoints];
    },
  },
};
</script>

<template>
  <div class="Charts">
    <Line id="rates-change-chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<style scoped lang="scss">
.Charts {
  padding: var(--pd);

  border-radius: 0 0 var(--br) var(--br);
  background: rgba(0, 0, 0, 0.5);
}
</style>
