<template>
  <div class="divider-line">
    <a-divider :style="dividerStyle" :orientation="orientation" :dashed="dashed">{{ text }}</a-divider>
  </div>
</template>

<script>
export default {
  name: "DividerLine",

  props: {
    text: {
      type: String,
      default: "",
    },
    dashed: {
      /** description: whether line is dashed. The value can be: true | false */
      type: Boolean,
      default: false,
    },
    orientation: {
      /** description: position of title inside divider. The value can be: left | right | center */
      type: String,
      default: "left",
    },
    dividerStyle: {
      type: [String, Object],
      default: () => {},
    },
  },
};
</script>
