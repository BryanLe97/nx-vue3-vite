<template>
  <edit-modal-composer title="Edit Unit Percentage">
    <select-input
      key="customerId"
      label="Key Account Code"
      reference="promotion-planning.common.customers"
      :on-select-change="onCustomerChange"
      :all-in-value="true"
      source="id"
      :source-label="(val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])"
      placeholder="Key Account Code"
      rules="required"
      :span="24"
    />
    <select-input
      key="productCode"
      label="PPG"
      :advanced-filters="ppgFilters"
      :fetch-options-on-filter="true"
      :api-not-get-paging="true"
      reference="promotion-planning.unit-percentage.products"
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      placeholder="PPG"
      rules="required"
      :span="24"
    />
    <number-input
      key="sellin"
      label="Sellin %"
      placeholder="Sellin %"
      rules="required|min_value:0|max_value:100"
      :span="8"
    />
    <number-input
      key="sellthrough"
      label="Sellthrough %"
      placeholder="Sellthrough %"
      rules="required|min_value:0|max_value:100"
      :span="8"
    />
    <number-input
      key="sellout"
      label="Sellout %"
      placeholder="Sellout %"
      rules="required|min_value:0|max_value:100"
      :span="8"
    />
  </edit-modal-composer>
</template>

<script>
import { FILTERS_EQUAL } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "EditUnitPercentage",
  inject: ["crud"],
  mixins: [PromoUtils],

  data() {
    return {
      selectedCustomer: {},
    };
  },

  computed: {
    entity() {
      return this.crud.getEntity() || {};
    },

    ppgFilters() {
      if (!this.selectedCustomer.id) return null;

      return [
        [
          "CustomerId",
          { operator: FILTERS_EQUAL, value: this.selectedCustomer.id },
        ],
      ];
    },
  },

  watch: {
    entity(newVal) {
      this.getValue(newVal, true);
    },
  },

  methods: {
    onCustomerChange(value) {
      this.crud.updateEntity("editForm", {
        resourceKey: "customerId",
        value: value.id,
      });
      this.getValue(value);
    },

    getValue(value, isFromDetails = false) {
      const data = {
        id: isFromDetails ? value.customerId : value.id,
        region: value.region,
      };

      this.selectedCustomer = { ...data };
    },
  },
};
</script>
