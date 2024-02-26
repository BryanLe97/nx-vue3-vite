<template>
  <div class="radio-group-input">
    <validation-provider v-if="formItem" v-slot="slotProps" :name="label" :rules="rules">
      <a-form-item
        :colon="false"
        has-feedback
        :help="slotProps.errors[0]"
        :label="showLabel ? label : undefined"
        :validate-status="resolveState(slotProps)"
      >
        <a-radio-group
          v-model="inputValue"
          :button-style="radioButtonStyle"
          :disabled="disabled"
          :name="name"
          @change="onChange"
        >
          <component
            :is="radioComponent"
            v-for="option in options"
            :key="option[source]"
            :disabled="disableOption(option)"
            :style="radioStyle"
            :value="option[source]"
          >{{ generateLabel(option) }}</component>
        </a-radio-group>
      </a-form-item>
    </validation-provider>

    <template v-else>
      <label v-if="label">{{ label }}</label>

      <div>
        <a-radio-group
          v-model="inputValue"
          :button-style="radioButtonStyle"
          :disabled="disabled"
          :name="name"
          @change="onChange"
        >
          <component
            :is="radioComponent"
            v-for="option in options"
            :key="option[source]"
            :disabled="disableOption(option)"
            :style="radioStyle"
            :value="option[source]"
          >{{ generateLabel(option) }}</component>
        </a-radio-group>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "RadioGroupInput",

  props: {
    source: {
      type: String,
      required: true,
    },
    buttonStyle: {
      type: String,
      default: "outline",
      validator: (value) => ["outline", "solid"].includes(value),
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disableOption: {
      type: Function,
      default: () => false,
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      default: undefined,
    },
    type: {
      type: String,
      default: "default",
      validator: (value) => ["default", "button"].includes(value),
    },
    radioStyle: {
      type: Object,
      default: undefined,
    },
    rules: {
      type: [String, Object],
      default: undefined,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    sourceLabel: {
      type: [String, Function],
      default: undefined,
    },
    value: {
      type: [Boolean, Number, String],
      default: undefined,
    },
  },

  data() {
    return {
      inputValue: this.value,
    };
  },

  computed: {
    options() {
      return this.dataSource;
    },

    radioButtonStyle() {
      if (this.type == "button") return this.buttonStyle;
      return undefined;
    },

    radioComponent() {
      return this.type == "button" ? "a-radio-button" : "a-radio";
    },
  },

  watch: {
    value(newVal) {
      this.inputValue = newVal;
    },
  },

  methods: {
    generateLabel(option) {
      if (!this.sourceLabel) return option[this.source];

      if (typeof this.sourceLabel == "function")
        return this.sourceLabel(option);

      return option[this.sourceLabel];
    },

    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    onChange(e) {
      this.$emit("change", e.target.value);
    },
  },
};
</script>
