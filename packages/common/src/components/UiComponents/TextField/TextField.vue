<template>
  <div class="text-field" :dataIndex="dataIndex">
    <slot :value="value" :record="record">
      <div v-if="allowHtml" v-html="parsedContent" />

      <span v-else>{{ parsedContent }}</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: "TextField",

  props: {
    align: {
      type: String,
      default: "left",
    },
    value: {
      type: [String, Number, Object, Array, Boolean],
      default: "",
    },
    allowHtml: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
    title: {
      type: String,
      default: null,
    },
    dataIndex: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    sorter: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    parsedContent() {
      return this.parse(this.value, this.record);
    },
  },
};
</script>
