<template>
  <div class="edit-customer">
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource
      name="promotion-planning.customers"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/customers"
      :page="page"
    >
      <edit-customer />
    </resource>
  </div>
</template>

<script>
import EditCustomer from "./EditCustomer.vue";

import { PROMOTIONAL_PLANNING_PROMO_CUSTOMER } from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditCustomer,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_CUSTOMER,
    };
  },
};
</script>
