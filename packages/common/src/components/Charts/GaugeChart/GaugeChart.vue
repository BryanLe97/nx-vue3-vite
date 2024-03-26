<template>
  <div
    :id="name"
    :class="
      size === 'small' ? 'oee-gauge-chart--small' : 'oee-gauge-chart--large'
    "
  ></div>
</template>

<script>
import { Gauge } from "@antv/g2plot";

export default {
  name: "GaugeChart",

  props: {
    name: {
      type: String,
      default: "",
    },
    data: {
      type: Number,
      default: null,
    },
    target: {
      type: Number,
      default: 50,
    },
    size: {
      type: String,
      default: "small",
    },
  },

  data() {
    return {
      gauge: undefined,
    };
  },

  computed: {
    config() {
      return {
        percent: this.data / 100,
        range: {
          color:
            this.data < this.target
              ? this.data <= 0
                ? "#E9EEF4"
                : "#FA8C16"
              : "#30BF78",
          width: 25,
        },
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
        indicator: null,
        statistic: {
          title: {
            offsetY: this.size === "small" ? -60 : -85,
            style: {
              fontSize: "24px",
              color: "#272D35",
            },
            formatter: () => `${this.data}%`,
          },
          content: {
            offsetY: this.size === "small" ? -35 : -60,
            style: {
              fontSize: "18px",
              lineHeight: "20px",
              textAlign: "center",
              color: "#272D35",
            },
            customHtml: () => {
              return `<div><span class='mb-0'>${this.name.slice(
                this.name.indexOf("_") + 1
              )}</span><p class='mb-0 mt-1'>Target ${this.target}%</áp></div>`;
            },
          },
        },
      };
    },
  },

  watch: {
    config(newVal) {
      this.gauge.update(newVal);
    },
  },

  mounted() {
    this.gauge = new Gauge(this.name, this.config);

    this.gauge.render();
  },
};
</script>

<style lang="scss" scoped>
.oee-gauge-chart--large {
  width: 362px;
  height: 181px;
}
.oee-gauge-chart--small {
  width: 246px;
  height: 125px;
}
</style>
