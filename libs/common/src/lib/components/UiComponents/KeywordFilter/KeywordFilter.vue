<template>
  <div class="keyword-filter">
    <a-input
      :disabled="disabled"
      :value="inputValue"
      :placeholder="placeholder"
      :allow-clear="allowClear"
      :max-length="maxLength"
      @change="onChange"
    >
      <template #suffix>
        <a-icon type="search" />
      </template>
    </a-input>
  </div>
</template>

<script>
import _ from "lodash";
import { FILTERS_CONTAINS } from "@/constants";

export default {
  name: "KeywordFilter",

  props: {
    allowClear: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    field: {
      type: String,
      required: true,
    },
    customUrl: {
      type: String,
      default: "",
    },
    customQuery: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    operator: {
      type: String,
      default: FILTERS_CONTAINS,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
  },

  inject: ["resourceName", "crud"],

  data() {
    return {
      inputValue: "",
    };
  },

  computed: {
    filter() {
      return this.crud.getFilter(this.field);
    },
  },

  watch: {
    filter(newVal) {
      if (newVal) {
        this.inputValue = newVal.value;
      } else {
        this.inputValue = "";
      }
    },
  },

  mounted() {
    if (this.filter) {
      this.inputValue = this.filter.value;
    }
  },

  methods: {
    fetchList: _.debounce(function () {
      const { count, pageSize } = this.crud.getPagination();

      this.crud.setPagination({ count, page: 1, pageSize });
      this.crud.fetchList(this.customUrl, true, true, this.customQuery);
    }, 1000),

    onChange: function ({ target: { value } }) {
      if (!value) {
        this.crud.deleteFilter(this.field);
        this.fetchList();
        return;
      }

      const val = {
        operator: this.operator,
        value: value.trim(),
      };

      this.crud.setFilter(this.field, val);
      this.fetchList();
    },
  },
};
</script>

<style lang="scss" scoped>
.keyword-filter {
  width: 230px;
}
</style>
