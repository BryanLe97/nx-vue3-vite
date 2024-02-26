<template>
  <edit-modal-composer
    class="modal-add-fixedterm"
    :last-modified-by-name="true"
    title="Edit Fixed Terms"
    :width="600"
  >
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
      source="id"
      :source-label="
        (val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])
      "
      rules="required"
      :sort-function="sortNationalAccount"
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
      class-name-component="margin-bottom"
      placeholder="LSV %"
      :max-length="6"
      class-name="margin-input"
      rules="number|between:0,100|decimal:3,2"
      :span="12"
    />

    <text-input
      key="isv"
      label="ISV %"
      class-name-component="margin-bottom"
      class-name="margin-input"
      placeholder="ISV"
      :max-length="6"
      rules="number|between:0,100|decimal:3,2"
      :span="12"
    />
  </edit-modal-composer>
</template>

<script>
import { FILTERS_EQUAL } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "EditFixedTerm",
  inject: ["crud"],
  mixins: [PromoUtils],

  data() {
    const { id } = this.$route.params;

    return {
      fixedtermId: id,
      selectedCategoryId: null,
      selectedCustomerId: null,
      selectedSubcategoryId: null,
    };
  },

  computed: {
    entity() {
      return this.crud.getEntity() || {};
    },

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

  watch: {
    entity(newVal) {
      this.selectedCustomerId = newVal.customerId;
      this.selectedCategoryId = newVal.category;
      this.selectedSubcategoryId = newVal.subCategory;
    },
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
