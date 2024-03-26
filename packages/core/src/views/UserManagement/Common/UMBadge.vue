<template>
  <span :class="'um-badge ' + className">{{ text }}</span>
</template>

<script>
const TYPES = {
  company: "orange",
  region: "blue",
  country: "purple",
  site: "green",
};

export default {
  name: "UMBadge",

  props: {
    text: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      className: "",
    };
  },

  mounted() {
    this.className = TYPES[this.type && this.type.toLowerCase()];
  },
};
</script>

<style lang="scss" scoped>
.um-badge {
  border: 1px solid transparent;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: initial;
  font-size: 12px;
}

.orange {
  background-color: #fff2e8;
  border-color: #ffbb96;
  color: #fa541c;
}

.blue {
  background-color: #e5efff;
  border-color: #99c0ff;
  color: #0062ff;
}

.green {
  background-color: #eefffa;
  border-color: #85e8c6;
  color: #15b982;
}

.purple {
  background-color: rgb(216, 193, 216);
  border-color: rgb(129, 76, 129);
  color: rgb(129, 25, 129);
}

.inactive > .um-badge {
  background-color: #f5f1f1;
  border-color: #afb9c5;
  color: #afb9c5;
}
</style>
