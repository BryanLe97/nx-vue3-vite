<template>
  <filter-drawer-composer>
    <select-filter
      key="Cluster"
      label="Cluster"
      reference="promotion-planning.common.clusters"
      :queries="[['All', false]]"
      source="code"
      :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
    />

    <select-filter
      key="Category"
      label="Category"
      reference="promotion-planning.common.categories"
      :queries="[['All', false]]"
      source="code"
      :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
    />

    <select-filter
      key="SubCategory"
      label="Subcategory"
      reference="promotion-planning.common.sub-categories"
      :queries="[['All', false]]"
      source="code"
      :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
      :option-filter="filterSubCatOption"
    />

    <select-filter
      key="Region"
      label="Region"
      reference="promotion-planning.common.regions"
      source="code"
      source-label="description"
      span="12"
    />

    <select-filter
      key="State"
      label="State"
      reference="promotion-planning.common.states"
      :queries="[['All', false]]"
      source="code"
      source-label="description"
      span="12"
    />

    <select-filter
      key="KeyAccount"
      :default-operator="FILTERS_CONTAINS"
      label="Key Account"
      reference="promotion-planning.common.customers"
      source="keyAccountCode"
      :source-label="(opt) => generateLabel(opt, ['region', 'keyAccountCode', 'keyAccount'])"
    />

    <operator-filter key="RRP" label="RRP" type="number" />
    <operator-filter key="ListPrice" label="List Price" type="number" />
    <operator-filter key="COGS" label="COGS" type="number" />
    <operator-filter key="ShipperQty" label="Shipper Qty" type="number" />
  </filter-drawer-composer>
</template>

<script>
import { FILTERS_CONTAINS } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "FilterProduct",

  mixins: [PromoUtils],

  data() {
    return { FILTERS_CONTAINS };
  },

  methods: {
    filterSubCatOption(option) {
      return option.code != -1;
    },
  },
};
</script>
