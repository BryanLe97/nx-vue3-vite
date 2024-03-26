<template>
  <div :class="{ overflow: `hidden` }">
    <div :id="name" class="progress-bar my-4 py-2">
      <div class="progress-bar__min-value neutral-10--text">0</div>
      <div class="progress-bar__max-value neutral-10--text">
        <template v-if="tooltip">
          <a-tooltip>
            <template #title>{{ tooltip.actual }}</template>
            {{ parseNumber(data) + suffix }} /
          </a-tooltip>
          <a-tooltip>
            <template #title>{{ tooltip.expect }}</template>
            {{ parseNumber(maxValue) + suffix }}
          </a-tooltip>
        </template>
        <span v-else>
          {{ parseNumber(data) + suffix }} /
          {{ parseNumber(maxValue) + suffix }}
        </span>
      </div>
      <!-- <div
        class="progress-bar__current-value neutral-10--text"
        :style="{ left: (data / maxValue) * 100 + '%' }"
      >
        {{ parseNumber(data) + suffix }}
      </div>-->
      <div
        class="progress-bar__target-value neutral-10--text"
        :style="{ left: (target / maxValue) * 100 + '%' }"
      >
        <a-tooltip v-if="tooltip">
          <template #title>{{ tooltip.target }}</template>
          {{ parseNumber(target) + suffix }}
        </a-tooltip>
        <span v-else>{{ parseNumber(target) + suffix }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from "numeral";
import { Progress } from "@antv/g2plot";

export default {
  name: "ProgressWithTarget",

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
      default: null,
    },
    maxValue: {
      type: Number,
      default: null,
    },
    suffix: {
      type: String,
      default: "",
    },
    formatNumber: {
      type: String,
      default: "",
    },
    //ex: tooltip: { actual: "this is actual value", expect: "this is max value", target: "this is target value" }
    tooltip: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      progress: undefined,
    };
  },

  computed: {
    config() {
      const targetPercent = (this.target / this.maxValue) * 100 + "%";
      return {
        height: 30,
        percent: this.data / this.maxValue,
        barWidthRatio: 0.7,
        color: this.data < this.target ? "#FA8C16" : "#30BF78",
        annotations: [
          {
            type: "line",
            start: [targetPercent, "0%"],
            end: [targetPercent, "100%"],
            style: {
              stroke: "#f00",
              lineWidth: 2,
            },
          },
        ],
      };
    },
  },

  watch: {
    config(newVal) {
      this.progress.update(newVal);
    },
  },

  mounted() {
    this.progress = new Progress(this.name, this.config);
    this.progress.render();
  },

  methods: {
    parseNumber(value) {
      return numeral(value).format(this.formatNumber);
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  position: relative;
  &__min-value,
  &__max-value,
  &__current-value,
  &__target-value {
    position: absolute;
    z-index: 10;
  }

  &__min-value {
    top: 100%;
    left: 0;
  }
  &__max-value {
    top: 100%;
    right: 0;
  }
  // &__current-value {
  //   left: 0;
  //   bottom: 50%;
  //   transform: translate(-100%, 50%);
  //   font-weight: 700;
  // }
  &__target-value {
    bottom: 100%;
    transform: translateX(-50%);
  }
}
</style>
