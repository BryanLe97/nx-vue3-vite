<template>
  <create-modal-composer title="Add Event">
    <select-input
      key="customerId"
      default-active-first-option
      label="Key Account"
      :option-filter="filterCustomers"
      place-holder="Key Account"
      reference="promotion-planning.common.customers"
      source="id"
      :source-label="(val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])"
      :span="24"
    />

    <text-input
      key="name"
      label="Event"
      :max-length="512"
      place-holder="Event"
      rules="required|max:512"
      :span="24"
    />
  </create-modal-composer>
</template>

<script>
import { PromoUtils } from "@/utils";

export default {
  name: "CreateEvent",

  mixins: [PromoUtils],

  methods: {
    filterCustomers(customer) {
      return customer.id !== 0;
    },
  },
};
</script>
