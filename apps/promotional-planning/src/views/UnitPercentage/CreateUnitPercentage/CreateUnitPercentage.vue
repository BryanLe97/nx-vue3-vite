<template>
  <create-modal-composer title="Add Unit Percentage">
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
  </create-modal-composer>
</template>

<script>
import { FILTERS_EQUAL } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";

export default {
  name: "CreateUnitPercentage",
  inject: ["crud"],
  mixins: [PromoUtils],

  data() {
    return {
      selectedCustomer: {},
    };
  },

  computed: {
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

  methods: {
    onCustomerChange(value) {
      const data = {
        id: value.id,
        region: value.region,
      };

      this.selectedCustomer = { ...data };
      this.crud.updateEntity("createForm", {
        resourceKey: "customerId",
        value: value.id,
      });
    },
  },
};
</script>
