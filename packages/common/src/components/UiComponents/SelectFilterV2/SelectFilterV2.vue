<template>
  <div class="select-filter" :class="className">
    <label v-if="label">{{ label }}</label>

    <a-select
      class="w-100"
      :default-active-first-option="defaultActiveFirstOption"
      :disabled="disabled"
      :filter-option="searchBy.length > 0 ? false : filterOption"
      :loading="loading || isFetching || isSearching"
      :mode="mode"
      :placeholder="placeholder"
      show-search
      :option-label-prop="optionLabelProp"
      :value="inputValue"
      option-filter-prop="children"
      @change="onChange"
      @search="fetchSearchData"
    >
      <slot name="data-source" :options="options">
        <a-select-option
          v-for="(option, index) in options"
          :key="index"
          :value="option[source]"
        >
          <a-tooltip placement="left" class="d-flex align-items-center">
            <template
              v-if="sourceDescription && option[sourceDescription]"
              #title
              >{{ option[sourceDescription] }}</template
            >

            <span :style="{ color: option.color ? option.color : '#272d35' }">{{
              generateLabel(option)
            }}</span>
          </a-tooltip>
        </a-select-option>
      </slot>

      <a-select-option v-if="lazy && !isComplete" key="infinite">
        <infinite-loading @infinite="onInfinite" />
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  import _ from "lodash";

  import {
    FILTERS_EQUAL,
    FILTERS_IN,
    FILTERS_CONTAINS,
  } from "@/constants/index.js";
  import createCrudProps from "@/utils/crud.bindings";

  export default {
    name: "SelectFilterV2",

    props: {
      source: {
        type: String,
        required: true,
      },
      advancedFilters: {
        type: Array,
        default: null,
      },
      className: {
        type: String,
        default: "",
      },
      clearValueOnOptionsChange: {
        type: Boolean,
        default: true,
      },
      dataSource: {
        type: Array,
        default: null,
      },
      defaultActiveFirstOption: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      filterType: {
        type: String,
        default: FILTERS_CONTAINS,
      },
      hasOptionAll: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        default: "",
      },
      lazy: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: "default",
      },
      optionFilter: {
        type: Function,
        default: undefined,
      },
      optionLabelProp: {
        type: String,
        default: null,
      },
      parseValue: {
        type: Function,
        default: (value) => value.value,
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
      searchBy: {
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
      value: {
        type: Object,
        default: () => ({}),
      },
      deleteFilter: {
        type: String,
        default: "",
      },
    },

    inject: ["crud"],

    data() {
      const data = {
        isComplete: false,
        isFetching: false,
        isSearching: false,
        notSearchNull: false,
      };

      if (this.reference) {
        const crudProps = createCrudProps({
          resourceName: this.reference,
          resourceIdName: this.source,
          router: this.$router,
          store: this.$store,
        });

        Object.assign(data, crudProps);
      }

      if (this.hasOptionAll) {
        data.optionAll = { [this.source]: 0, [this.sourceLabel]: "All" };
      }

      if (
        this.hasOptionAll &&
        (!this.value.value || !this.value.value.length)
      ) {
        data.inputValue =
          this.mode == "multiple"
            ? [data.optionAll[this.source]]
            : data.optionAll[this.source];
      } else {
        data.inputValue = this.value.value;
      }

      return data;
    },

    computed: {
      operator() {
        return this.mode == "default" ? FILTERS_EQUAL : FILTERS_IN;
      },

      options() {
        if (this.reference) {
          let options = this.crud.getList();

          if (this.hasOptionAll) {
            options = [this.optionAll, ...options];
          }

          if (this.optionFilter) {
            options = options.filter(this.optionFilter);
          }

          return options;
        }

        if (this.optionFilter) {
          return this.dataSource.filter(this.optionFilter);
        }

        return this.dataSource;
      },
    },

    watch: {
      advancedFilters(newVal) {
        if (!newVal) return;

        newVal.forEach(([key, value]) => this.crud.setFilter(key, value));
        this.fetchList();
      },

      options(newVal, oldVal) {
        if (!this.clearValueOnOptionsChange && oldVal && oldVal.length) return;

        const source = this.useSourceLabel ? this.sourceLabel : this.source;

        let isInputExist = newVal.some(
          (value) => value[source] == this.inputValue
        );

        if (
          (this.defaultActiveFirstOption && !this.value && newVal.length) ||
          (this.defaultActiveFirstOption && !isInputExist && newVal.length)
        ) {
          if (this.mode == "multiple") {
            this.inputValue = [newVal[0][source]];
          } else {
            this.inputValue = newVal[0][source];
          }

          this.onChange(this.inputValue);

          return;
        }

        if (this.inputValue) {
          if (this.mode == "multiple") {
            const values = this._.intersection(
              this.inputValue,
              newVal.map((option) => option[source])
            );

            this.inputValue = values;
            this.onChange(values);
            return;
          }

          const obj = newVal.find((val) => val[source] == this.inputValue);

          if (!obj) {
            this.inputValue = null;
            this.onChange(null);
            return;
          }
        }
      },

      queries(newVal) {
        if (!newVal) return;

        newVal.forEach(([key, value]) => this.crud.setQueryString(key, value));
        this.fetchList();
      },

      value(newVal) {
        if (this.hasOptionAll && (!newVal.value || !newVal.value.length)) {
          this.inputValue = this.mode == "multiple" ? [0] : 0;
          return;
        }

        this.inputValue = newVal.value;
      },
    },

    async created() {
      try {
        if (this.reference) {
          this.isFetching = true;

          if (this.lazy) {
            this.crud.setPagination({ page: 1, pageSize: 50 });

            this.crud.setFilter("IsInactive", {
              operator: FILTERS_EQUAL,
              value: "false",
            });
          } else {
            this.crud.deleteFilter(this.deleteFilter);
          }

          if (this.advancedFilters) {
            this.advancedFilters.forEach(([key, value]) =>
              this.crud.setFilter(key, value)
            );
          }

          if (this.queries) {
            this.queries.forEach(([key, value]) =>
              this.crud.setQueryString(key, value)
            );
          }

          await this.fetchList();
        }

        if (
          this.defaultActiveFirstOption &&
          !this.value &&
          this.options &&
          this.options.length
        ) {
          this.inputValue = this.options[0][this.source];
          this.onChange(this.inputValue);
        }
      } finally {
        this.isFetching = false;
      }
    },

    methods: {
      async fetchList(refresh = true) {
        if (this.deleteFilter) {
          this.crud.deleteFilter(this.deleteFilter);
        }

        if (refresh) {
          this.crud.setPagination({ page: 1, pageSize: 50 });
        }

        if (this.apiNotGetPaging) {
          this.crud.deletePagination();
        }

        return this.crud.fetchList(
          undefined,
          refresh,
          true,
          this.customQuery,
          this.onlyCustomQuery
        );
      },

      fetchSearchData: _.debounce(async function (value) {
        if (this.searchBy.length === 0 || (this.notSearchNull && !value)) {
          this.notSearchNull = false;
          return;
        }
        this.isSearching = true;

        const val = {
          operator: this.filterType,
          value,
        };

        if (this.deleteFilter) {
          this.crud.deleteFilter(this.deleteFilter);
        }

        this.crud.setFilter(this.searchBy, val);
        this.crud.setPagination({ page: 1, pageSize: 50 });
        await this.fetchList();
        this.isSearching = false;
      }, 600),

      filterOption(input, option) {
        const stringQueryFn =
          this.filterType == FILTERS_CONTAINS ? "includes" : "startsWith";

        /* prettier-ignore */
        if (option.componentOptions.children.length === 2) {
        return option.componentOptions.children[1].elm.innerText
          .toLowerCase()
          [stringQueryFn](input.toLowerCase());
      } else
        return option.componentOptions.children[0].elm.innerText
          .toLowerCase()
          [stringQueryFn](input.toLowerCase());
      },

      generateLabel(option) {
        if (!this.sourceLabel) return option[this.source];
        if (typeof this.sourceLabel == "string")
          return option[this.sourceLabel];

        return this.sourceLabel(option);
      },

      onChange(value) {
        let filter;

        if (!value || !value.length) {
          filter = {
            operator: this.operator,
            value: undefined,
          };

          this.$emit("change", filter);

          return;
        }

        if (this.mode == "multiple") {
          let lastSelectedItem = value[value.length - 1];

          if (this.hasOptionAll) {
            if (lastSelectedItem === 0 || !value.length) {
              value = [];
            } else {
              value = value.filter((val) => val !== 0);
            }
          }

          const objs = value.map((val) =>
            this.options.find((option) => option[this.source] == val)
          );

          let filterValue;

          if (!value.length) {
            filterValue = undefined;
          } else {
            filterValue = this.useSourceLabel
              ? objs.map((obj) => obj[this.sourceLabel])
              : objs.map((obj) => obj[this.source]);
          }

          filter = {
            operator: this.operator,
            value: filterValue,
          };
        } else {
          const obj = this.options.find(
            (option) => option[this.source] == value
          );

          filter = {
            operator: this.operator,
            value: this.useSourceLabel
              ? obj[this.sourceLabel]
              : obj[this.source],
          };
        }

        this.$emit("change", filter);
      },

      async onInfinite($state) {
        const { page, pageSize } = this.crud.getPagination();

        this.crud.setPagination({ page: page + 1, pageSize });

        const res = await this.fetchList(false);

        if (res.data.length) {
          $state.loaded();
        } else {
          $state.complete();
          this.isComplete = true;
        }
      },
    },
  };
</script>
