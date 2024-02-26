<template>
  <div class="select-filter" :class="className">
    <select-input
      :advanced-filters="advancedFilters"
      all-in-value
      :allow-clear="allowClear"
      :clear-data-on-destroy="clearDataOnDestroy"
      :data-source="dataSource"
      :default-active-first-option="defaultActiveFirstOption"
      :delete-filter="deleteFilter"
      :disabled="disabled"
      :form-item="formItem"
      :label="label"
      :lazy="lazy"
      :mode="mode"
      :option-filter="optionFilter"
      :placeholder="placeholder"
      :queries="queries"
      :reference="reference"
      :rules="rules"
      :search-by="searchBy"
      :search-by-depends-on-value="searchByDependsOnValue"
      :source="source"
      :source-label="sourceLabel"
      :source-description="sourceDescription"
      :value="inputValue"
      :use-source-label="useSourceLabel"
      :on-select-change="onSelectChange"
      @change="onChange"
    />
  </div>
</template>

<script>
import { FILTERS_EQUAL, FILTERS_IN } from "@/constants";

export default {
  name: "SelectFilter",

  props: {
    source: {
      type: String,
      required: true,
    },
    advancedFilters: {
      type: Array,
      default: null,
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    clearDataOnDestroy: {
      type: Boolean,
      default: true,
    },
    deleteFilter: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "default",
    },
    placeholder: {
      type: String,
      default: "",
    },
    queries: {
      type: Array,
      default: null,
    },
    reference: {
      type: String,
      default: "",
    },
    sourceLabel: {
      type: [String, Function],
      default: "",
    },
    sourceDescription: {
      type: String,
      default: "",
    },
    useSourceLabel: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    searchBy: {
      type: String,
      default: "",
    },
    searchByDependsOnValue: {
      type: Boolean,
      default: false,
    },
    defaultActiveFirstOption: {
      type: Boolean,
      default: false,
    },
    defaultOperator: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
    optionFilter: {
      type: Function,
      default: undefined,
    },
    onSelectChange: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    if (this.value != null) {
      let { value } = this.value;

      if (this.mode == "multiple" && !value) {
        value = [];
      }

      return {
        inputValue: value,
      };
    }

    return {
      inputValue: null,
    };
  },

  computed: {
    operator() {
      return (
        this.defaultOperator ??
        (this.mode == "default" ? FILTERS_EQUAL : FILTERS_IN)
      );
    },
  },

  watch: {
    value(newVal) {
      if (!newVal) {
        this.inputValue = newVal;
        return;
      }

      this.inputValue = newVal.value;
    },
  },

  methods: {
    onChange(value) {
      let filter;

      if (!value || (this.mode == "multiple" && !value.length)) {
        filter = {
          operator: this.operator,
          value: undefined,
        };
      } else {
        switch (this.mode) {
          case "multiple":
            filter = {
              operator: this.operator,
              value: this.useSourceLabel
                ? value.map((val) => val[this.sourceLabel])
                : value.map((val) => val[this.source]),
            };

            break;

          default:
            filter = {
              operator: this.operator,
              value: this.useSourceLabel
                ? value[this.sourceLabel]
                : value[this.source],
            };

            break;
        }
      }

      this.$emit("change", filter);
    },
  },
};
</script>
