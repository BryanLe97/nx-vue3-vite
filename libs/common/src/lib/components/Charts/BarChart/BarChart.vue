<template>
  <div :id="name" class="h-100"></div>
</template>

<script>
import { Bar } from "@antv/g2plot";

export default {
  name: "BarChart",

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
      bar: undefined,
    };
  },

  watch: {
    config(newVal) {
      this.bar.update(newVal);
    },
  },

  mounted() {
    this.bar = new Bar(this.name, this.config);

    this.bar.render();
  },
};
</script>

<style></style>
