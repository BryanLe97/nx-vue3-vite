<template>
  <div class="select-input" :class="className">
    <validation-provider
      v-if="formItem"
      v-slot="slotProps"
      :custom-messages="customMessages"
      :name="label"
      :rules="rules"
    >
      <a-form-item
        :colon="false"
        has-feedback
        :help="showError && slotProps.errors[0]"
        :label="showLabel ? label : undefined"
        :validate-status="resolveState(slotProps)"
      >
        <a-select
          v-model="inputValue"
          class="w-100"
          :allow-clear="allowClear"
          :disabled="disabled"
          :show-arrow="!disabled"
          :filter-option="
            searchBy.length > 0 || customSearch ? false : filterOption
          "
          :loading="loading || isFetching || isSearching"
          :mode="mode"
          option-filter-prop="children"
          :placeholder="disabled && !disableHasPlaceholder ? '' : placeholder"
          show-search
          :option-label-prop="optionLabelProp"
          :size="size"
          :max-tag-count="maxTagCount"
          :get-popup-container="(trigger) => trigger.parentNode"
          @change="onChange"
          @search="fetchSearchData"
          @blur="onBlur"
        >
          <slot name="data-source" :options="options">
            <a-select-option
              v-for="(option, index) in options"
              :key="index"
              :value="option[source]"
              :disabled="isOptionDisabled(option[source])"
            >
              <a-tooltip placement="left">
                <template v-if="sourceDescription" #title>
                  {{ generateDescription(option) }}
                </template>

                <a-tag
                  v-if="tagColor"
                  :color="option[tagColor]"
                  :style="{ height: '16px', border: '1px solid #92a0b0' }"
                ></a-tag>

                <span
                  :style="{ color: option.color ? option.color : '#272d35' }"
                >
                  {{ generateLabel(option) }}
                </span>
              </a-tooltip>
            </a-select-option>
          </slot>

          <a-select-option v-if="lazy && !isComplete" key="infinite">
            <infinite-loading @infinite="onInfinite" />
          </a-select-option>
        </a-select>
      </a-form-item>
    </validation-provider>

    <template v-else>
      <label v-if="label && showLabel">{{ label }}</label>

      <div>
        <a-select
          v-model="inputValue"
          class="w-100"
          :allow-clear="allowClear"
          :default-active-first-option="defaultActiveFirstOption"
          :disabled="disabled"
          :show-arrow="!disabled"
          :filter-option="
            searchBy.length > 0 || customSearch ? false : filterOption
          "
          :loading="loading || isFetching || isSearching"
          :mode="mode"
          option-filter-prop="children"
          :placeholder="disabled && !disableHasPlaceholder ? '' : placeholder"
          show-search
          :option-label-prop="optionLabelProp"
          :size="size"
          :max-tag-count="maxTagCount"
          :get-popup-container="(trigger) => trigger.parentNode"
          @change="onChange"
          @search="fetchSearchData"
          @blur="onBlur"
        >
          <slot name="data-source" :options="options">
            <a-select-option
              v-for="(option, index) in options"
              :key="index"
              :value="option[source]"
              :disabled="isOptionDisabled(option[source])"
            >
              <a-tooltip placement="left">
                <template v-if="sourceDescription" #title>
                  {{ generateDescription(option) }}
                </template>

                <a-tag
                  v-if="tagColor"
                  :color="option[tagColor]"
                  :style="{ height: '16px', border: '1px solid #92a0b0' }"
                ></a-tag>

                <span
                  :style="{ color: option.color ? option.color : '#272d35' }"
                >
                  {{ generateLabel(option) }}
                </span>
              </a-tooltip>
            </a-select-option>
          </slot>

          <a-select-option v-if="lazy && !isComplete" key="infinite">
            <infinite-loading @infinite="onInfinite" />
          </a-select-option>
        </a-select>
      </div>
    </template>
  </div>
</template>

<script>
  import { debounce } from "lodash";

  import { FILTERS_CONTAINS, FILTERS_EQUAL } from "@/constants/index.js";
  import createCrudProps from "@/utils/crud.bindings";

  export default {
    name: "SelectInput",

    props: {
      source: {
        type: String,
        required: true,
      },
      advancedFilters: {
        type: Array,
        default: null,
      },
      allInValue: {
        type: Boolean,
        default: false,
      },
      allowClear: {
        type: Boolean,
        default: false,
      },
      allowDestroyed: {
        type: Boolean,
        default: false,
      },
      apiNotGetPaging: {
        type: Boolean,
        default: false,
      },
      autocomplete: {
        type: Boolean,
        default: false,
      },
      className: {
        type: [String, Object],
        default: "",
      },
      clearDataOnDestroy: {
        type: Boolean,
        default: true,
      },
      clearValueOnOptionsChange: {
        type: Boolean,
        default: true,
      },
      confirmBeforeChange: {
        type: Boolean,
        default: false,
      },
      confirmTitle: {
        type: String,
        default: "",
      },
      customQuery: {
        type: String,
        default: "",
      },
      customSearch: {
        type: Boolean,
        default: false,
      },
      customUrl: {
        type: String,
        default: null,
      },
      customMessages: {
        type: Object,
        default: undefined,
      },
      dataSource: {
        type: Array,
        default: null,
      },
      defaultActiveFirstOnChange: {
        type: Boolean,
        default: false,
      },
      defaultActiveFirstOption: {
        type: Boolean,
        default: false,
      },
      defaultActiveWithOneOption: {
        type: Boolean,
        default: false,
      },
      deleteFilter: {
        type: [String, Boolean],
        default: null,
      },
      defaultValue: {
        type: [Number, String, Array],
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      disableHasPlaceholder: {
        type: Boolean,
        default: false,
      },
      fetchOptionsOnFilter: {
        type: Boolean,
        default: false,
      },
      filterType: {
        type: String,
        default: FILTERS_CONTAINS,
      },
      formItem: {
        type: Boolean,
        default: false,
      },
      loading: {
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
      mode: {
        type: String,
        default: "default",
      },
      onlyCustomQuery: {
        type: Boolean,
        default: false,
      },
      onSelectChange: {
        type: Function,
        default: () => {},
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
        default: (value) => value,
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
        default: null,
      },
      //the option list is changed -> the value will get the fist option for default.
      resetDefaultFirstOption: {
        type: Boolean,
        default: true,
      },
      rules: {
        type: [Object, String],
        default: "",
      },
      searchBy: {
        type: String,
        default: "",
      },
      searchByDependsOnValue: {
        type: Boolean,
        default: false,
      },
      selectedWithValue: {
        type: String,
        default: null,
      },
      showError: {
        type: Boolean,
        default: true,
      },
      showLabel: {
        type: Boolean,
        default: true,
      },
      sourceDescription: {
        type: [String, Function],
        default: "",
      },
      sourceLabel: {
        type: [String, Function],
        default: "",
      },
      value: {
        type: [Number, String, Array],
        default: undefined,
      },
      useSourceLabel: {
        type: Boolean,
        default: false,
      },
      searchDebounceTime: {
        type: Number,
        default: 600,
      },
      sortFunction: {
        type: Function,
        default: undefined,
      },
      sortOptions: {
        type: String,
        default: "",
      },
      maxSelectedOptions: {
        type: Number,
        default: undefined,
      },
      maxTagCount: {
        type: Number,
        default: undefined,
      },
      tagColor: {
        type: String,
        default: "",
      },
      size: {
        type: String,
        default: "default",
      },
      preventRender: {
        type: Boolean,
        default: false,
      },
      isClearWhenParamsChange: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      let data = {
        currentValue: null,
        isComplete: false,
        isFetching: false,
        isSearching: false,
        isValueFirstChange: true,
        notSearchNull: false,
        optionSelected: [],
      };

      if (this.reference) {
        const crudProps = createCrudProps({
          resourceName: this.reference,
          resourceIdName: this.source,
          router: this.$router,
          store: this.$store,
        });

        data = {
          ...data,
          ...crudProps,
        };
      }

      data.inputValue = this.parseValue(this.value);
      return data;
    },

    computed: {
      options() {
        if (this.reference) {
          let options = this.crud.getList();

          if (this.sortFunction) {
            options.sort(this.sortFunction);
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
        if (this.isClearWhenParamsChange) this.$emit("change", null);
      },

      customQuery() {
        this.fetchList();
        if (this.isClearWhenParamsChange) this.$emit("change", null);
      },

      customUrl() {
        this.fetchList();
        if (this.isClearWhenParamsChange) this.$emit("change", null);
      },

      options(newVal, oldVal) {
        if (
          (!this.clearValueOnOptionsChange && oldVal && oldVal.length) ||
          this.autocomplete
        )
          return;

        const source = this.useSourceLabel ? this.sourceLabel : this.source;

        let isInputExist = newVal.some(
          (value) => value[source] == this.inputValue
        );

        if (
          (this.defaultActiveFirstOption && !this.value && newVal.length) ||
          (this.defaultActiveFirstOption &&
            this.resetDefaultFirstOption &&
            !isInputExist &&
            newVal.length) ||
          (this.defaultActiveWithOneOption && newVal.length === 1)
        ) {
          if (this.mode == "multiple") {
            this.inputValue = [newVal[0][source]];
          } else {
            if (
              !this.inputValue ||
              newVal.every((option) => option[source] !== this.inputValue) ||
              this.resetDefaultFirstOption
            ) {
              this.inputValue = newVal[0][source];
            }
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
            this.setValue(values);
            this.commitChange(values);
            return;
          }
          const obj = newVal.find((val) => val[source] == this.inputValue);
          if (
            !obj &&
            !this.searchByDependsOnValue &&
            this.preventRender == false
          ) {
            this.setValue(null);
            this.commitChange(null);
            return;
          }
        }
      },

      queries(newVal) {
        if (!newVal) return;

        newVal.forEach(([key, value]) => this.crud.setQueryString(key, value));
        this.fetchList();
      },

      async value(newVal) {
        this.currentValue = this.parseValue(newVal);
        if (this.isValueFirstChange && this.selectedWithValue) {
          this.isFetching = true;

          this.crud.setQueryString(
            this.selectedWithValue,
            this.parseValue(newVal)
          );

          await this.fetchList();
          this.crud.deleteQueryStrings();
          this.isValueFirstChange = false;
          this.isFetching = false;
        }
        this.inputValue = this.parseValue(newVal);

        if (this.mode !== "multiple") {
          /** The first time passing value trigger change event, but not change when exists oldValue */
          if (this.defaultActiveFirstOnChange) {
            this.onChange(this.parseValue(newVal));
            return;
          }
        }
      },
    },

    async created() {
      try {
        this.fetchSearchData = debounce(
          this.fetchSearchData,
          this.searchDebounceTime
        );
        if (this.reference) {
          this.isFetching = true;

          if (this.lazy) {
            this.crud.setPagination({ page: 1, pageSize: 50 });

            this.crud.setFilter("IsInactive", {
              operator: FILTERS_EQUAL,
              value: "false",
            });
          } else {
            this.crud.deleteFilter("IsInactive");
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

          if (this.searchBy) {
            this.crud.setFilter(this.searchBy, {
              operator: this.filterType,
              value: this.value,
            });
          }

          if (this.fetchOptionsOnFilter) return;
          if (this.selectedWithValue && this.isValueFirstChange) return;

          await this.fetchList();
        }

        if (
          this.dataSource &&
          this.dataSource.length &&
          !this.value &&
          this.defaultActiveFirstOption
        ) {
          this.inputValue = this.options[0][this.source];
          this.onChange(this.inputValue);
        }
      } finally {
        this.isFetching = false;
      }
    },

    destroyed() {
      if (this.clearDataOnDestroy && this.crud) {
        this.crud.clearList();
        this.crud.clearFilters();
        this.crud.deleteQueryStrings();
      }
    },

    methods: {
      commitChange(value) {
        this.currentValue = value;

        if (this.autocomplete) {
          this.$emit("change", value);
          this.onSelectChange(value);

          return;
        }

        if (this.mode == "multiple") {
          this.optionSelected = value;
          let objs = value.map((val) =>
            this.options.find((option) => option[this.source] == val)
          );

          if (!this.allInValue) {
            objs = objs.map((obj) => obj[this.source]);
          }

          this.$emit("change", objs);
          this.onSelectChange(objs);
        } else {
          if (!this.allInValue) {
            this.$emit("change", value);
            this.onSelectChange(value);
            return;
          }

          const obj = this.options.find((item) => item[this.source] == value);

          this.$emit("change", obj);
          this.onSelectChange(obj);
        }
      },

      async fetchList(customUrl = this.customUrl, refresh = true) {
        if (this.deleteFilter) {
          this.crud.deleteFilter(this.deleteFilter);
        }

        if (refresh) {
          this.crud.setPagination({ page: 1, pageSize: 50 });
        }

        if (this.apiNotGetPaging) {
          this.crud.deletePagination();
        }

        /**
         * Don't run fetchList until all the advanced filter and queries are present
         */
        if (
          (this.advancedFilters &&
            this.advancedFilters.some((filter) => !filter[1])) ||
          (this.queries && this.queries.some((query) => this._.isNil(query[1])))
        ) {
          return;
        }
        return this.crud.fetchList(
          customUrl,
          refresh,
          true,
          this.customQuery,
          this.onlyCustomQuery
        );
      },

      revertChange() {
        this.inputValue = this.value;
      },

      setValue(newVal) {
        this.inputValue = newVal;
      },

      async fetchSearchData(value) {
        if (this.customSearch) {
          // if (!value) return;
          this.$emit("search", value);
          return;
        }

        if (
          !this.searchByDependsOnValue &&
          (this.searchBy.length === 0 || (this.notSearchNull && !value))
        ) {
          this.notSearchNull = false;
          return;
        }

        this.isSearching = true;

        const val = {
          operator: this.filterType,
          value: this.searchByDependsOnValue ? value || this.value : value,
        };

        if (this.deleteFilter) {
          this.crud.deleteFilter(this.deleteFilter);
        }

        this.crud.setFilter(this.searchBy, val);
        this.crud.setPagination({ page: 1, pageSize: 50 });
        await this.fetchList();
        this.isSearching = false;
      },

      filterOption(input, option) {
        const stringQueryFn =
          this.filterType == FILTERS_CONTAINS ? "includes" : "startsWith";

        /* prettier-ignore */
        if(option.componentOptions.children.length === 2){
        return option.componentOptions.children[1].elm.innerText
        .toLowerCase()[stringQueryFn](input.toLowerCase());
      }
      else return option.componentOptions.children[0].elm.innerText
        .toLowerCase()[stringQueryFn](input.toLowerCase());
      },

      generateLabel(option) {
        if (!this.sourceLabel) return option[this.source];
        if (typeof this.sourceLabel == "string")
          return option[this.sourceLabel];
        return this.sourceLabel(option);
      },

      generateDescription(option) {
        if (typeof this.sourceDescription == "string")
          return option[this.sourceDescription];
        return this.sourceDescription(option);
      },

      resolveState({ errors }) {
        const [firstError] = errors;

        if (firstError) {
          this.$emit("error", firstError);
          return "error";
        }

        this.$emit("error", null);
        return "";
      },

      onChange(value) {
        this.notSearchNull = true;
        if (!this.confirmBeforeChange) {
          if (this._.isNil(value) && !this._.isNil(this.defaultValue)) {
            this.commitChange(this.defaultValue);
            this.setValue(this.defaultValue);
          } else {
            this.commitChange(value);
          }

          return;
        }
        this.$confirm({
          title: this.confirmTitle,
          icon: "warning",
          cancelText: "No",
          okText: "Yes",
          okType: "danger",
          onOk: () => this.commitChange(value),
          onCancel: this.revertChange,
        });
      },

      async onInfinite($state) {
        const { page, pageSize } = this.crud.getPagination();

        this.crud.setPagination({ page: page + 1, pageSize });

        const res = await this.fetchList(this.customUrl, false);

        if (res.data.length) {
          $state.loaded();
        } else {
          $state.complete();
          this.isComplete = true;
        }
      },

      onBlur(value) {
        /**
         * This condition to active first option
         * When search value does not exist in the options and using the SLOT data-source
         */
        if (value === "labelSelectOption") {
          this.inputValue = this.options[0][this.source];
          this.onChange(this.options[0][this.source]);
        }
      },

      isOptionDisabled(value) {
        if (this.mode === "multiple" && this.maxSelectedOptions > 0) {
          const isMaxOptionSelected =
            this.optionSelected.length >= this.maxSelectedOptions;

          return (
            this.optionSelected.findIndex((option) => option === value) ===
              -1 && isMaxOptionSelected
          );
        }
      },
    },
  };
</script>
