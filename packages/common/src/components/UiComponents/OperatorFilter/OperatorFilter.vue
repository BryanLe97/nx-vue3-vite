<template>
  <div class="operator-filter">
    <a-row :gutter="8">
      <a-col :span="24">
        <label>{{ label }}</label>
      </a-col>
    </a-row>

    <a-row :gutter="8">
      <a-col :span="12">
        <select-input
          :data-source="filterOptions"
          source="value"
          source-label="text"
          :value="value.operator"
          @change="onSelectionChange"
        />
      </a-col>

      <a-col :span="12">
        <date-picker
          v-if="showDatePicker"
          :placeholder="placeholder ? placeholder : 'Select Date'"
          :year-only="yearOnly"
          :value="dateInputValue"
          :format-date="formatDate"
          @change="onDateInputChange"
        />
        <auto-complete-input
          v-else-if="autoCompleteInput"
          :reference="autoCompleteInput.reference"
          :custom-query="autoCompleteInput.customQuery || ''"
          :only-custom-query="autoCompleteInput.onlyCustomQuery || false"
          :delete-filter="autoCompleteInput.deleteFilter || ''"
          :placeholder="autoCompleteInput.placeholder || textInputPlaceholder"
          :source="autoCompleteInput.source"
          :search-by="autoCompleteInput.searchBy"
          :value="textInputValue"
          @change="onAutoCompleteChange"
        />
        <text-input
          v-else
          :placeholder="textInputPlaceholder"
          :value="textInputValue"
          @change="onTextInputChange"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import {
    FILTERS_EQUAL,
    FILTERS_NOT_EQUAL,
    FILTERS_GREATER_THAN,
    FILTERS_LESS_THAN,
    FILTERS_CONTAINS,
    FILTERS_STARTS_WITH,
    FILTERS_ENDS_WITH,
  } from "@/constants/index.js";

  const getFiltersForType = (type) => {
    switch (type) {
      case "string":
        return [
          {
            text: "Equal",
            value: FILTERS_EQUAL,
          },
          {
            text: "Not equal",
            value: FILTERS_NOT_EQUAL,
          },
          {
            text: "Contains",
            value: FILTERS_CONTAINS,
          },
          {
            text: "Starts with",
            value: FILTERS_STARTS_WITH,
          },
          {
            text: "Ends with",
            value: FILTERS_ENDS_WITH,
          },
        ];

      case "number":
        return [
          {
            text: "Equal",
            value: FILTERS_EQUAL,
          },
          {
            text: "Not equal",
            value: FILTERS_NOT_EQUAL,
          },
          {
            text: "Greater than",
            value: FILTERS_GREATER_THAN,
          },
          {
            text: "Less than",
            value: FILTERS_LESS_THAN,
          },
        ];

      case "date":
        return [
          {
            text: "Same",
            value: FILTERS_EQUAL,
          },
          {
            text: "Not same",
            value: FILTERS_NOT_EQUAL,
          },
          {
            text: "Before",
            value: FILTERS_LESS_THAN,
          },
          {
            text: "After",
            value: FILTERS_GREATER_THAN,
          },
        ];

      case "queryString":
        return [
          {
            text: "Equal",
            value: FILTERS_EQUAL,
          },
        ];

      default:
        throw new Error("No filter available for this data type");
    }
  };

  export default {
    name: "OperatorFilter",

    props: {
      type: {
        type: String,
        required: true,
        validator(value) {
          return ["string", "number", "date", "queryString"].includes(value);
        },
      },
      label: {
        type: String,
        default: "",
      },
      placeholder: {
        type: String,
        default: "",
      },
      value: {
        type: Object,
        default: () => ({
          operator: FILTERS_EQUAL,
          value: null,
        }),
      },
      reference: {
        type: String,
        default: null,
      },
      autoCompleteInput: {
        type: Object,
        default: null,
      },
      yearOnly: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        formatDate: this.yearOnly ? "YYYY" : "YYYY-MM-DD",
      };
    },

    computed: {
      dateInputValue() {
        const { value } = this.value;

        if (!value) return value;
        return this.$moment(value);
      },

      filterOptions() {
        return getFiltersForType(this.type);
      },

      showDatePicker() {
        return this.type == "date";
      },

      textInputPlaceholder() {
        if (this.placeholder) {
          return this.placeholder;
        }

        switch (this.type) {
          case "number":
            return "Type Number";

          case "date":
            return "Select Date";

          default:
            return "Type Anything";
        }
      },

      textInputValue() {
        return this.value.value;
      },
    },

    methods: {
      onSelectionChange(value) {
        const filter = {
          ...this.value,
          operator: value,
        };

        this.$emit("change", filter);
      },

      onDateInputChange(date) {
        const filter = {
          ...this.value,
          value: this.$moment(date).format(this.formatDate),
        };

        this.$emit("change", filter);
      },

      onTextInputChange(value) {
        const filter = {
          ...this.value,
          value: value,
        };

        this.$emit("change", filter);
      },

      onAutoCompleteChange(value) {
        const filter = {
          ...this.value,
          value: value,
        };
        this.$emit("change", filter);
      },
    },
  };
</script>
