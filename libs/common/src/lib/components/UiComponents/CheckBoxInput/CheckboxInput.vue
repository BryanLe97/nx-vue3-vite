<template>
  <div class="checkbox-input" :class="className">
    <validation-provider v-if="formItem" v-slot="slotProps" :name="label" :rules="rules">
      <a-form-item :help="slotProps.errors[0]" :validate-status="resolveState(slotProps)">
        <a-checkbox
          :disabled="disabled"
          :checked="checked"
          @change="onChange($event, slotProps.validate)"
        >{{ label }}</a-checkbox>
      </a-form-item>
    </validation-provider>

    <a-checkbox v-else :disabled="disabled" :checked="checked" @change="onChange">{{ label }}</a-checkbox>
  </div>
</template>

<script>
export default {
  name: "CheckboxInput",

  props: {
    className: {
      type: [String, Object],
      default: "",
    },
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
    rules: {
      type: [Object, String],
      default: "",
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      checked: this.value,
    };
  },

  watch: {
    value(newVal) {
      this.checked = newVal;
    },
  },

  created() {
    this.checked = this.value;
  },

  methods: {
    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    setValue(newVal) {
      this.checked = newVal;
    },

    onChange(e, validate) {
      this.checked = e.target.checked;
      if (this.formItem) {
        validate();
      }
      this.$emit("change", this.checked);
    },
  },
};
</script>
