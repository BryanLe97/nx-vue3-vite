<template>
  <div class="list-customer">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="promotion-planning.customers"
      :api-url="apiUrl"
      create-route="/promotion-planning/customers/create"
      edit-route="/promotion-planning/customers/:id"
      :page="page"
    >
      <list-customer />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_CUSTOMER } from "@kraftheinz/common";

import ListCustomer from "./ListCustomer.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListCustomer,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_CUSTOMER,
      itemsMenu: [
        {
          title: "Master Files",
          path: "",
        },
        {
          key: "customer",
          title: "Customers",
          path: "/promotion-planning/customers",
        },
      ],
    };
  },
};
</script>
