<template>
  <div class="active-filter">
    <a-select
      class="w-100"
      :value="value"
      :disabled="disabled"
      @change="onChange"
    >
      <a-select-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <a-icon :type="option.iconType" :theme="option.iconTheme" />
        {{ option.text }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { FILTERS_EQUAL } from "@/constants";

export default {
  name: "ActiveFilter",

  props: {
    customUrl: {
      type: String,
      default: "",
    },
    customQuery: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasCustomFilterInactive: {
      type: Boolean,
      default: false,
    },
    serverSide: {
      type: Boolean,
      default: true,
    },
  },

  inject: ["resourceName", "crud"],

  data() {
    return {
      field: "IsInactive",
      options: [
        {
          text: "All",
          value: "all",
          iconType: "container",
          iconTheme: "twoTone",
        },
        {
          text: "Active",
          value: "false",
          iconType: "eye",
          iconTheme: "twoTone",
        },
        {
          text: "Inactive",
          value: "true",
          iconType: "eye-invisible",
          iconTheme: "outlined",
        },
      ],
    };
  },

  computed: {
    filter() {
      if (this.hasCustomFilterInactive) {
        return this.crud.getQueryString(this.field);
      }

      return this.crud.getFilter(this.field);
    },

    value() {
      if (!this.filter) {
        return "all";
      }

      return this.filter.value;
    },
  },

  methods: {
    fetchList() {
      const { count, pageSize } = this.crud.getPagination();

      this.crud.setPagination({ count, page: 1, pageSize });
      this.crud.fetchList(this.customUrl, true, true, this.customQuery);
    },

    onChange(value) {
      if (!this.serverSide) {
        this.$emit("change", value);
        return;
      }

      if (value == "all") {
        if (this.hasCustomFilterInactive) {
          this.crud.deleteQueryString(this.field);
        } else {
          this.crud.deleteFilter(this.field);
        }

        this.fetchList();

        return;
      }

      if (this.hasCustomFilterInactive) {
        this.crud.setQueryString(this.field, value);
      } else {
        this.crud.setFilter(this.field, {
          operator: FILTERS_EQUAL,
          value,
        });
      }

      this.fetchList();
    },
  },
};
</script>

<style lang="scss" scoped>
.active-filter {
  width: 115px;
}
</style>
