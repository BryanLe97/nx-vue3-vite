<template>
  <a-tooltip
    class="tooltip-field"
    :placement="placement"
    :overlay-style="{ width: `${width}px` }"
  >
    <template slot="title">
      <div class="tooltip-field__content">{{ parsedContent }}</div>
    </template>

    <div
      class="tooltip-field__content--truncated text-truncate"
      :style="{ width: width ? `${width * 0.9}px` : 'auto' }"
    >
      {{ value }}
    </div>
  </a-tooltip>
</template>

<script>
export default {
  name: "TooltipField",

  props: {
    value: {
      type: [String, Number, Object, Array],
      default: "",
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: null,
    },
    placement: {
      type: String,
      default: "bottomLeft",
    },
    width: {
      type: Number,
      default: null,
    },
  },

  computed: {
    parsedContent() {
      return this.parse(this.value, this.record);
    },
  },
};
</script>
