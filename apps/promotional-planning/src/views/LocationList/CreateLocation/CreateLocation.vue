<template>
  <create-modal-composer title="Add Activity">
    <select-input
      key="customerId"
      default-active-first-option
      label="Key Account"
      :option-filter="filterCustomers"
      place-holder="Key Account"
      reference="promotion-planning.common.customers"
      source="id"
      :source-label="
        (val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])
      "
      :span="24"
    />

    <text-input
      key="description"
      label="Activity"
      place-holder="Activity"
      :max-length="512"
      :span="24"
    />

    <text-input
      key="rate"
      label="Rate"
      :max-length="6"
      place-holder="Rate"
      prefix="%"
      rules="number|between:0,100|decimal:3,2"
      :span="24"
    />

    <select-input
      key="categoryId"
      label="Category"
      reference="promotion-planning.common.primary-instore.category"
      source="id"
      source-label="description"
      rules="required"
      :span="24"
    />
  </create-modal-composer>
</template>

<script>
import { PromoUtils } from "@/utils";

export default {
  name: "CreateLocation",
  mixins: [PromoUtils],

  methods: {
    filterCustomers(customer) {
      return customer.id !== 0;
    },
  },
};
</script>
