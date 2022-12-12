<script>
import { Line } from "vue-chartjs";
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";

import { myRound } from "@/utils";
import { COLORS } from "@/constants";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const chartOptions = {
  elements: { line: { tension: 0.4 } },
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label(ctx) {
          const percentage = (ctx.raw.y > 0 ? "+" : "") + ctx.raw.y * 100;
          const points = (ctx.raw.changePoints > 0 ? "+" : "") + ctx.raw.changePoints;
          return `${ctx.dataset.label}: ${ctx.raw.rate} | ${percentage}% | ${points}`;
        },
      },
    },
  },
  scales: {
    x: {
      reverse: true,
      display: false,
    },
    y: { display: false },
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
            if (newEntryArr.length) {
              const prevRate = (newEntryArr[newEntryArr.length - 1] || { rate }).rate;
              const [y, changePoints] = this.calcChangePercentPoints(prevRate, rate);
              newEntryArr[newEntryArr.length - 1].y = y;
              newEntryArr[newEntryArr.length - 1].changePoints = changePoints;
            }
            newEntryArr.push({ y: 0, x: new Date(ts * 1000).toDateString(), rate, changePoints: 0 });
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
