<template>
  <div class="textarea-input">
    <validation-provider
      v-if="formItem"
      v-slot="slotProps"
      :name="label"
      :rules="rules"
    >
      <a-form-item
        :colon="false"
        has-feedback
        :help="slotProps.errors[0]"
        :label="showLabel ? label : ''"
        :validate-status="resolveState(slotProps)"
      >
        <a-textarea
          :disabled="disabled"
          :max-length="maxLength"
          :placeholder="placeholder"
          :rows="rows"
          :value="inputValue"
          @blur="onBlur"
          @change="onChange"
          @paste="onPaste"
        />
      </a-form-item>
    </validation-provider>

    <template v-else>
      <label v-if="showLabel && label">{{ label }}</label>

      <a-textarea
        :disabled="disabled"
        :max-length="maxLength"
        :placeholder="placeholder"
        :rows="rows"
        :value="inputValue"
        @blur="onBlur"
        @change="onChange"
        @paste="onPaste"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "TextArea",

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
    maxLength: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    rows: {
      type: [String, Number],
      default: 2,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      inputValue: this.value ? this.value.toString().trim() : this.value,
    };
  },

  watch: {
    value(newVal) {
      this.inputValue = newVal;
    },
  },

  methods: {
    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    onBlur() {
      this.inputValue = this.inputValue.trim();
      this.$emit("blur", this.inputValue);
    },

    onChange({ target: { value } }) {
      this.inputValue = value;
      this.$emit("change", value);
    },

    onPaste(event) {
      /**
       * Handle a case when user paste a value with spaces
       */
      event.preventDefault();
      this.inputValue = event.clipboardData.getData("text").trim();
      this.$emit("change", this.inputValue);
    },
  },
};
</script>
