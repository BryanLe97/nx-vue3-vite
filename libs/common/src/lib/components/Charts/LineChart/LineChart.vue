<template>
  <div :id="name" class="h-100"></div>
</template>

<script>
import { Line } from "@antv/g2plot";

export default {
  name: "LineChart",

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
      line: undefined,
    };
  },

  watch: {
    config(newVal) {
      this.line.update(newVal);
    },
  },

  mounted() {
    this.line = new Line(this.name, this.config);

    this.line.render();
  },
};
</script>

<style></style>
