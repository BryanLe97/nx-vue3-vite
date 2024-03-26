<template>
  <a-tag
    v-if="parsedContent"
    class="tag-field"
    :class="`ant-tag-${computedColor}`"
  >{{ parsedContent }}</a-tag>
</template>

<script>
export default {
  name: "TagField",

  props: {
    value: {
      type: [String, Number, Object, Array, Boolean],
      default: "",
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: [String, Function],
      default: "",
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
  },

  computed: {
    computedColor() {
      if (typeof this.color == "string") return this.color;
      return this.color(this.value, this.record);
    },

    parsedContent() {
      return this.parse(this.value, this.record);
    },
  },
};
</script>

<style lang="scss" scoped>
.ant-tag-gray,
.ant-tag-suspend {
  background-color: #eaedf0 !important;
  border-color: #bec6d0;
  color: #5c6c7f;
}

.ant-tag-success-6,
.ant-tag-approved {
  color: #15b982;
  background: #eefffa;
  border: 1px solid #85e8c6;
}

.ant-tag-primary-6,
.ant-tag-quarantine {
  color: #0062ff;
  background: #e5efff;
  border: 1px solid #99c0ff;
}

.ant-tag-hold {
  color: #fa8c16;
  background: #fff7e6;
  border: 1px solid #ffd591;
}

.ant-tag-error-6 {
  color: #f5222d;
  background: #fff1f0;
  border: 1px solid #f5222d;
}

.ant-tag-gold-6 {
  color: #faad14;
  background: #fffbe6;
  border: 1px solid #fff1b8;
}

.ant-tag-purple-6 {
  color: #722ed1;
  background: #f9f0ff;
  border: 1px solid #d3adf7;
}
.ant-tag-geekblue-6 {
  color: #2f54eb;
  background: #f0f5ff;
  border: 1px solid #adc6ff;
}
</style>
