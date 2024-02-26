<template>
  <div class="Week-picker-input" :class="disabled ? 'disabled' : ''">
    <validation-provider v-if="formItem" v-slot="slotProps" :name="label" :rules="rules">
      <a-form-item
        :colon="false"
        has-feedback
        :help="slotProps.errors[0]"
        :label="showLabel ? label : ''"
        :validate-status="resolveState(slotProps)"
      >
        <a-week-picker
          v-model="inputValue"
          :disabled="disabled"
          :disabled-date="disableDate"
          :placeholder="placeholder"
          :format="formatDate"
          @change="onChange"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-week-picker>
      </a-form-item>
    </validation-provider>

    <template v-else>
      <label v-if="label && showLabel">{{ label }}</label>

      <div>
        <a-week-picker
          v-model="inputValue"
          :disabled="disabled"
          :disabled-date="disableDate"
          :placeholder="placeholder"
          :format="formatDate"
          @change="onChange"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-week-picker>
      </div>
    </template>
  </div>
</template>

<script>
import isNil from "lodash/isNil";
import { FORMAT_DATE_SECONDARY } from "@kraftheinz/common/src/constants";

export default {
  name: "WeekPicker",

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    formatDate: {
      type: String,
      default: "YYYY-wo",
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: "",
    },
    showStartOfWeek: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    rules: {
      type: [String, Object],
      default: "",
    },
    value: {
      type: [Object, String],
      default: null,
    },
    disableDate: {
      type: Function,
      default: () => false
    }
  },

  data() {
    return {
      inputValue: this.convertValue(this.value),
    };
  },

  watch: {
    value(newVal) {
      this.inputValue = this.convertValue(newVal);
    },
  },

  methods: {
    convertValue(value) {
      return typeof value == "string"
        ? this.showStartOfWeek
          ? this.$moment(this.$moment(value).startOf("isoWeek"))
          : this.$moment(value)
        : value;
    },

    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    onChange(value) {
      if (isNil(value)) {
        this.inputValue = null;
        this.$emit("change", null);
      } else if (this.showStartOfWeek) {
        this.inputValue = this.$moment(value).startOf("isoWeek");
        this.$emit("change", this.inputValue.format(FORMAT_DATE_SECONDARY));
      } else {
        this.inputValue = value;
        this.$emit("change", value.format(FORMAT_DATE_SECONDARY));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.date-picker-input {
  .ant-calendar-picker {
    width: 100%;
  }
  &.disabled {
    ::v-deep {
      .anticon {
        display: none;
      }
    }
  }
}
</style>
