<template>
  <simple-form v-slot="{ handleSubmit }">
    <a-row :gutter="16" type="flex" align="middle">
      <a-col :span="6">
        <select-input
          form-item
          allow-clear
          rules="required"
          label="Region"
          placeholder="Select Region"
          reference="promotion-planning.common.regions"
          source="code"
          source-label="description"
          :value="filterForm.Region"
          @change="onSelectFilter('Region', $event)"
        />
      </a-col>
      <a-col :span="6">
        <select-input
          form-item
          allow-clear
          rules="required|max_selected:5"
          label="Key Account"
          placeholder="Select Key Account"
          mode="multiple"
          reference="promotion-planning.common.customers"
          source="id"
          :source-label="
            (opt) => generateLabel(opt, ['keyAccountCode', 'keyAccount'])
          "
          :is-clear-when-params-change="true"
          :fetch-options-on-filter="true"
          :api-not-get-paging="true"
          :clear-data-on-destroy="false"
          :max-tag-count="2"
          :advanced-filters="keyAccountFilters"
          :value="filterForm.CustomerId"
          @change="onSelectFilter('CustomerId', $event)"
        />
      </a-col>
      <a-col :span="2">
        <select-input
          form-item
          allow-clear
          rules="required"
          label="Year"
          placeholder="Year"
          :data-source="years"
          source="year"
          :value="filterForm.FinYear"
          @change="onSelectFilter('FinYear', $event)"
        />
      </a-col>
      <a-col :span="4">
        <select-input
          form-item
          allow-clear
          rules="required"
          label="Cluster"
          placeholder="Select Cluster"
          reference="promotion-planning.common.clusters"
          source="code"
          :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
          custom-query="all=false"
          :value="filterForm.ClusterCode"
          @change="onSelectFilter('ClusterCode', $event)"
        />
      </a-col>
    </a-row>
    <a-row :gutter="16" type="flex" align="middle">
      <a-col :span="6">
        <select-input
          form-item
          allow-clear
          rules="required"
          label="Category"
          placeholder="Select Category"
          reference="promotion-planning.common.categories"
          source="code"
          :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
          custom-query="all=false"
          :is-clear-when-params-change="true"
          :fetch-options-on-filter="true"
          :api-not-get-paging="true"
          :clear-data-on-destroy="false"
          :advanced-filters="categoryFilters"
          :value="filterForm.CategoryCode"
          @change="onSelectFilter('CategoryCode', $event)"
        />
      </a-col>
      <a-col :span="6">
        <select-input
          form-item
          allow-clear
          rules="required"
          label="Sub Category"
          placeholder="Select Sub Category"
          reference="promotion-planning.common.sub-categories"
          source="code"
          :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
          custom-query="all=false"
          only-custom-query
          :is-clear-when-params-change="true"
          :fetch-options-on-filter="true"
          :api-not-get-paging="true"
          :clear-data-on-destroy="false"
          :advanced-filters="subCategoryFilters"
          :value="filterForm.SubCategoryCode"
          @change="onSelectFilter('SubCategoryCode', $event)"
        />
      </a-col>
      <a-col :span="6">
        <select-input
          form-item
          allow-clear
          rules="required|max_selected:10"
          label="PPG"
          placeholder="Select PPG"
          mode="multiple"
          reference="promotion-planning.common.products"
          source="code"
          :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
          :queries="ppgQueries"
          :max-tag-count="2"
          :is-clear-when-params-change="true"
          :fetch-options-on-filter="true"
          :api-not-get-paging="true"
          :clear-data-on-destroy="false"
          :advanced-filters="ppgFilters"
          :value="filterForm.PPGCode"
          @change="onSelectFilter('PPGCode', $event)"
        />
      </a-col>
      <a-col>
        <a-space class="mb-1">
          <a-button @click="onClearFilters">Clear Filters</a-button>
          <a-button
            type="primary"
            :loading="isFiltering"
            @click="handleSubmit(onApplyFilters)"
          >
            Apply Filters
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </simple-form>
</template>

<script>
import { FILTERS_EQUAL, FILTERS_IN } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "ScenarioBuilderFilter",

  mixins: [PromoUtils],

  inject: ["crud", "years"],

  props: {
    isFiltering: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const defaultFilterForm = {
      CategoryCode: undefined,
      ClusterCode: undefined,
      CustomerId: [],
      FinYear: undefined,
      Region: undefined,
      SubCategoryCode: undefined,
    };
    const multipleSelectFields = ["CustomerId", "PPGCode"];
    const stateNational = { AU: "17", NZ: "08" };

    return {
      stateNational,
      defaultFilterForm,
      filterForm: { ...defaultFilterForm },
      multipleSelectFields,
    };
  },

  computed: {
    keyAccountFilters() {
      if (!this.filterForm.Region) return null;
      return [
        ["Region", { operator: FILTERS_EQUAL, value: this.filterForm.Region }],
      ];
    },

    categoryFilters() {
      if (!this.filterForm.ClusterCode) return null;
      return [
        [
          "Cluster",
          { operator: FILTERS_EQUAL, value: this.filterForm.ClusterCode },
        ],
      ];
    },

    subCategoryFilters() {
      return [
        [
          "ClusterCode",
          { operator: FILTERS_EQUAL, value: this.filterForm.ClusterCode },
        ],
        [
          "CategoryId",
          { operator: FILTERS_EQUAL, value: this.filterForm.CategoryCode },
        ],
      ];
    },

    ppgFilters() {
      if (
        !this.filterForm.CategoryCode ||
        !this.filterForm.CustomerId ||
        !this.filterForm.Region ||
        !this.filterForm.SubCategoryCode
      )
        return [["SubCategory"]];
      return [
        ...this.keyAccountFilters,
        ...this.categoryFilters,
        [
          "CustomerId",
          {
            operator: FILTERS_IN,
            value: this.filterForm.CustomerId,
          },
        ],
        [
          "State",
          {
            operator: FILTERS_IN,
            value: this.stateNational[this.filterForm.Region],
          },
        ],
        [
          "Category",
          { operator: FILTERS_EQUAL, value: this.filterForm.CategoryCode },
        ],
        [
          "SubCategory",
          {
            operator: FILTERS_IN,
            value: this.filterForm.SubCategoryCode,
          },
        ],
      ];
    },

    ppgQueries() {
      return [
        ["all", false],
        ["distinct", true],
        ["finYear", this.filterForm.FinYear],
      ];
    },
  },

  methods: {
    onApplyFilters() {
      this.$emit("apply");
    },

    onClearFilters() {
      this.crud.clearFilters();
      this.crud.deleteFilter("IsInactive");
      this.filterForm = { ...this.defaultFilterForm };
      this.crud.clearList();
      this.$emit("clear");
    },

    onSelectFilter(key, value) {
      if (!value || value.length === 0) {
        this.crud.deleteFilter(key);
        this.filterForm[key] = undefined;
      } else {
        this.crud.setFilter(key, {
          operator: this.multipleSelectFields.includes(key)
            ? FILTERS_IN
            : FILTERS_EQUAL,
          value,
        });
        this.filterForm[key] = value;
      }
    },
  },
};
</script>

<style></style>
