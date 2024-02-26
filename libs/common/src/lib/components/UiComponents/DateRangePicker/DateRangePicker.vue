<template>
  <div class="date-range-picker-input" :class="disabled ? 'disabled' : ''">
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
        :label="label"
        :validate-status="resolveState(slotProps)"
      >
        <a-range-picker
          v-model="inputValue"
          :disabled="disabled"
          :show-time="showTime"
          :format="formatDate"
          :placeholder="placeholder"
          :dropdown-class-name="dropdownClassName"
          :mode="mode"
          :disabled-date="disabledDate"
          :get-calendar-container="(trigger) => trigger.parentNode"
          @change="onChange($event)"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </a-form-item>
    </validation-provider>

    <template v-else>
      <label v-if="label">{{ label }}</label>

      <div>
        <a-range-picker
          v-model="inputValue"
          :disabled="disabled"
          :show-time="showTime"
          :format="formatDate"
          :placeholder="placeholder"
          :dropdown-class-name="dropdownClassName"
          :mode="mode"
          :disabled-date="disabledDate"
          :get-calendar-container="(trigger) => trigger.parentNode"
          @change="onChange"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "DateRangePicker",

  props: {
    value: {
      type: Array,
      default: null,
    },
    showTime: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    formatDate: {
      type: String,
      default: "DD/MM/YYYY",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: Array,
      default: () => ["Start date", "End date"],
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [String, Object],
      default: "",
    },
    startDateKey: {
      type: String,
      default: "startDate",
    },
    endDateKey: {
      type: String,
      default: "endDate",
    },
    mode: {
      type: Array,
      default: () => ["date", "date"],
    },
    dropdownClassName: {
      type: String,
      default: "",
    },
    receiveValueOnClear: {
      type: Boolean,
      default: false,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
  },

  data() {
    return {
      inputValue: this.value,
    };
  },

  watch: {
    value(newVal) {
      if (newVal) {
        this.inputValue = newVal.map((val) => this.convertValue(val));
      } else {
        this.inputValue = null;
      }
    },
  },

  methods: {
    convertValue(value) {
      return typeof value == "string" ? this.$moment(value) : value;
    },

    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    onChange(value) {
      const formatType = this.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
      if (value && value.length > 0) {
        this.$emit("change", {
          [this.startDateKey]: this.showTime
            ? value[0].utc().format(formatType)
            : value[0].format(formatType),
          [this.endDateKey]: this.showTime
            ? value[1].utc().format(formatType)
            : value[1].format(formatType),
        });
        return;
      }
      if (this.receiveValueOnClear) {
        this.$emit("change", null);
      }
    },
    clear() {
      this.inputValue = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.date-range-picker-input {
  .ant-calendar-picker {
    width: 100% !important;

    ::v-deep {
      .ant-calendar-range-picker-input {
        font-size: 14px;
      }
    }
  }
}
</style>
