<template>
  <div :id="name" class="h-100"></div>
</template>

<script>
import { DualAxes } from "@antv/g2plot";

export default {
  name: "DualAxes",

  props: {
    name: {
      type: String,
      default: "",
    },

    config: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      dualAxes: undefined,
    };
  },

  watch: {
    config(newVal) {
      this.dualAxes.update(newVal);
    },
  },

  mounted() {
    this.dualAxes = new DualAxes(this.name, this.config);

    this.dualAxes.render();
  },
};
</script>

<style></style>
