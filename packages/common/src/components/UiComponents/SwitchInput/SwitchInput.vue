<template>
  <div class="switch-input">
    <validation-provider v-if="formItem" v-slot="slotProps" :name="label" :rules="rules">
      <a-form-item
        :colon="false"
        :help="slotProps.errors[0]"
        :label="label"
        :validate-status="resolveState(slotProps)"
      >
        <a-switch v-model="inputValue" :disabled="disabled" @change="onChange" />
      </a-form-item>
    </validation-provider>

    <div v-else :class="{ 'd-flex align-items-center': labelHorizontal }">
      <label
        v-if="label"
        :class="{
          'order-0 mr-3': labelHorizontal == 'left',
          'order-1 ml-3': labelHorizontal == 'right'
        }"
      >{{ label }}</label>

      <div
        :class="{
          'mt-1': !labelHorizontal,
          'order-1': labelHorizontal == 'left',
          'order-0': labelHorizontal == 'right'
        }"
      >
        <a-switch v-model="inputValue" :disabled="disabled" @change="onChange" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SwitchInput",

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    labelHorizontal: {
      type: String,
      default: "",
    },
    parse: {
      type: Function,
      default: (value) => value,
    },
    parseOnChange: {
      type: Function,
      default: (value) => value,
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    value: {
      type: [Boolean, Number],
      default: false,
    },
  },

  data() {
    return {
      inputValue: this.parse(this.value),
    };
  },

  watch: {
    value(newVal) {
      this.inputValue = this.parse(newVal);
    },
  },

  methods: {
    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    onChange(checked) {
      this.$emit("change", this.parseOnChange(checked));
    },
  },
};
</script>
