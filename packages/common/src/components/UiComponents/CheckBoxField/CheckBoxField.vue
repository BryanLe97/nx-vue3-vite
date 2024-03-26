<template>
  <div class="checkbox-field">
    <a-checkbox :disabled="disabled" :checked="parsedValue" />
  </div>
</template>

<script>
export default {
  name: "CheckBoxField",

  props: {
    value: {
      type: [String, Number, Object, Array, Boolean],
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
    disabled: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      parsedValue: this.parse(this.value),
    };
  },

  watch: {
    value(newVal) {
      this.parsedValue = this.parse(newVal);
    },
  },

  methods: {
    parse(value) {
      if (typeof value === "number") {
        if (value === 1) return true;
        return false;
      }
      return value;
    },
  },
};
</script>
