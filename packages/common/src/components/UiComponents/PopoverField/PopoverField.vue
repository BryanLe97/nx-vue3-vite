<template>
  <a-popover
    class="popover-field"
    placement="bottomLeft"
    :title="title"
    :overlay-style="{ width: `${width}px` }"
  >
    <template slot="content">
      <div class="popover-field__content">{{ value }}</div>
    </template>

    <div
      class="popover-field__content--truncated text-truncate"
      :style="{ width: width ? `${width * 0.9}px` : 'auto' }"
    >{{ value }}</div>
  </a-popover>
</template>

<script>
export default {
  name: "PopoverField",

  props: {
    value: {
      type: [String, Number, Object, Array],
      default: "",
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
  },
};
</script>
