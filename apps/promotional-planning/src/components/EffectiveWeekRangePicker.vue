<template>
  <div class="effective-week-range-picker">
    <a-row>
      <a-col :xs="24">
        <label v-if="label && showLabel">{{ label }}</label>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 0]">
      <a-col :xs="24" :sm="12">
        <validation-provider
          v-slot="slotProps"
          name="From Week"
          :rules="fromWeekRules"
        >
          <a-form-item
            :colon="false"
            has-feedback
            :help="slotProps.errors[0]"
            :validate-status="resolveState(slotProps)"
          >
            <a-week-picker
              v-model="fromWeekValue"
              :disabled="disabled[0]"
              :placeholder="placeholder[0]"
              :format="dateFormat"
              :disabled-date="disableFromWeek"
              @change="onChangeFromWeek"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-week-picker>
          </a-form-item>
        </validation-provider>
      </a-col>
      <a-col :xs="24" :sm="12">
        <validation-provider
          v-slot="slotProps"
          name="To Week"
          :rules="toWeekRules"
        >
          <a-form-item
            :colon="false"
            has-feedback
            :help="slotProps.errors[0]"
            :validate-status="resolveState(slotProps)"
          >
            <a-week-picker
              v-model="toWeekValue"
              :disabled="disabled[1]"
              :placeholder="placeholder[1]"
              :format="dateFormat"
              :disabled-date="disableToWeek"
              @change="onChangeToWeek"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-week-picker>
          </a-form-item>
        </validation-provider>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import isNil from "lodash/isNil";

import { FORMAT_DATE_SECONDARY } from "@kraftheinz/common/src/constants";

import { PROMO_DATE_FORMAT_FOR_SALE } from "@/constants";
import { FormatDateTimeMixin } from "@/mixins";

export default {
  name: "EffectiveWeekRangePicker",

  inject: ["resourceProps"],

  mixins: [FormatDateTimeMixin],

  props: {
    disabled: {
      type: Array,
      default: () => [false, false],
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: Array,
      default: () => ["From Week", "To Week"],
    },
    label: {
      type: String,
      default: "",
    },
    dateFormat: {
      type: String,
      default: PROMO_DATE_FORMAT_FOR_SALE,
    },
    rules: {
      type: Array,
      default: () => ["", ""],
    },
    getLastDayOfToWeek: {
      /** by default, this component will emit the START day of the selected 'To Week'.
       * when turn this prop ON, this component will emit the END day of the selected 'To Week'
       */
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [null, null],
    },
  },

  data() {
    const dateRangeProps = this.resourceProps.find(
      (item) =>
        item.resourceName === "promotion-planning.common.date-range-product"
    );

    return {
      dateRangeProps,
      firstDay: null,
      lastDay: null,
      fromWeekValue: this.getDayFromValue(this.value, 0),
      toWeekValue: this.getDayFromValue(this.value, 1),
      listYearEnabled: [],
    };
  },

  computed: {
    fromWeekRules() {
      if (!this.rules || this.rules.length === 0) return "";

      return this.rules[0];
    },

    toWeekRules() {
      if (!this.rules || this.rules.length === 0) return "";

      if (this.rules.length === 1) return "";

      return this.rules[1];
    },

    listDateRange() {
      return this.dateRangeProps.crud.getList() || [];
    },
  },

  watch: {
    value(newVal) {
      this.fromWeekValue = this.getDayFromValue(newVal, 0);
      this.toWeekValue = this.getDayFromValue(newVal, 1);

      this.onChangeFromWeek(this.fromWeekValue);
      this.onChangeToWeek(this.toWeekValue);
    },
  },

  methods: {
    getDayFromValue(weekRange, index) {
      if (!weekRange || !weekRange[index]) {
        return null;
      }

      const item = weekRange[index];

      return typeof item === "string" ? this.$moment(item) : item;
    },

    resolveState({ errors }) {
      if (errors[0]) return "error";
      return "";
    },

    disableFromWeek(current) {
      return !this.listDateRange.some((dateRange) => {
        const rangeStart = this.$moment(dateRange.startDate);
        const rangeEnd = this.$moment(dateRange.endDate);

        return rangeStart <= current && current <= rangeEnd;
      });
    },

    disableToWeek(current) {
      if (this.listDateRange.length == 0) return;
      // TODO: tempDateRange is the date range that user can choose
      // because each date range is separated so user can't choose on 2 different date range

      const tempDateRange = this.listDateRange.filter((dateRange) => {
        const rangeStart = this.$moment(dateRange.startDate).format(
          FORMAT_DATE_SECONDARY
        );
        const rangeEnd = this.$moment(dateRange.endDate).format(
          FORMAT_DATE_SECONDARY
        );

        return rangeStart <= this.firstDay && this.firstDay <= rangeEnd;
      });
      if (tempDateRange.length == 0) return;
      const rangeStart = this.$moment(tempDateRange[0].startDate);
      const rangeEnd = this.$moment(tempDateRange[0].endDate);

      return !(rangeStart <= current && current <= rangeEnd);
    },

    onChangeFromWeek(val) {
      if (isNil(val)) {
        this.fromWeekValue = null;
        this.firstDay = null;
      } else {
        /** get first day of the week from the selected date */
        this.fromWeekValue = this.getTheFirstDayOfWeek(val);
        this.firstDay = this.fromWeekValue.format(FORMAT_DATE_SECONDARY);

        /** clear 'To Week' if 'From Week' value is GREATER than 'To Week' value */
        if (this.toWeekValue && this.fromWeekValue.isAfter(this.toWeekValue)) {
          this.toWeekValue = null;
          this.lastDay = null;
        }
      }

      this.disableToWeek();

      this.$emit("change", [this.firstDay, this.lastDay]);
    },

    onChangeToWeek(val) {
      if (isNil(val)) {
        this.toWeekValue = null;
        this.lastDay = null;
      } else {
        this.toWeekValue = this.getTheFirstDayOfWeek(val);

        if (this.getLastDayOfToWeek) {
          this.lastDay = this.getTheLastDayOfWeek(val, FORMAT_DATE_SECONDARY);
        } else {
          this.lastDay = this.toWeekValue.format(FORMAT_DATE_SECONDARY);
        }
      }

      this.$emit("change", [this.firstDay, this.lastDay]);
    },
  },
};
</script>
