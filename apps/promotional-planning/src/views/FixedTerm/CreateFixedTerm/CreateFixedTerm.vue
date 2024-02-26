<template>
  <create-modal-composer class="modal-add-fixedterm" title="Add Fixed Terms" :width="600">
    <select-input
      key="plLineId"
      label="Discount"
      placeholder="Discount"
      reference="promotion-planning.common.pllines"
      source="id"
      rules="required"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="24"
    />

    <select-input
      key="customerId"
      label="Key Account"
      :on-select-change="onCustomerChange"
      placeholder="Key Account"
      reference="promotion-planning.common.customers"
      rules="required"
      source="id"
      :source-label="
        (val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])
      "
      :span="24"
    />

    <select-input
      key="category"
      label="Category"
      :on-select-change="onCategoryChange"
      placeholder="Category"
      reference="promotion-planning.common.categories"
      rules="required"
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="12"
    />

    <select-input
      key="subCategory"
      :advanced-filters="subcategoryFilters"
      :fetch-options-on-filter="true"
      label="Subcategory"
      :on-select-change="onSubcategoryChange"
      placeholder="Subcategory"
      reference="promotion-planning.common.sub-categories"
      rules="required"
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="12"
    />

    <select-input
      key="ppgId"
      :advanced-filters="ppgFilters"
      :fetch-options-on-filter="true"
      label="PPG Code"
      placeholder="PPG Code"
      :queries="ppgQueries"
      reference="promotion-planning.common.products"
      rules="required"
      source="id"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="24"
    />

    <text-input
      key="lsv"
      label="LSV %"
      placeholder="LSV %"
      rules="number|between:0,100|decimal:3,2"
      :max-length="6"
      :span="12"
    />

    <text-input
      key="isv"
      label="ISV %"
      placeholder="ISV"
      rules="number|between:0,100|decimal:3,2"
      :max-length="6"
      :span="12"
    />
  </create-modal-composer>
</template>

<script>
import { FILTERS_EQUAL } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "CreateFixedTerm",
  mixins: [PromoUtils],

  data() {
    return {
      selectedCategoryId: null,
      selectedCustomerId: null,
      selectedSubcategoryId: null,
    };
  },

  computed: {
    subcategoryFilters() {
      if (!this.selectedCategoryId) return null;

      return [
        [
          "CategoryId",
          { operator: FILTERS_EQUAL, value: this.selectedCategoryId },
        ],
      ];
    },

    ppgFilters() {
      if (!this.selectedCustomerId || !this.selectedSubcategoryId) return null;

      return [
        [
          "CustomerId",
          { operator: FILTERS_EQUAL, value: this.selectedCustomerId },
        ],
        [
          "SubCategory",
          { operator: FILTERS_EQUAL, value: this.selectedSubcategoryId },
        ],
      ];
    },

    ppgQueries() {
      return [
        ["Include", true],
        ["distinct", true],
      ];
    },
  },

  destroyed() {
    this.selectedCustomerId = null;
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
  },

  methods: {
    onCategoryChange(value) {
      this.selectedCategoryId = value;
    },

    onCustomerChange(value) {
      this.selectedCustomerId = value;
    },

    onSubcategoryChange(value) {
      this.selectedSubcategoryId = value;
    },
  },
};
</script>
