<template>
  <div class="list-product">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="promotion-planning.products"
      :api-url="apiUrl"
      create-route="/promotion-planning/products/create"
      edit-route="/promotion-planning/products/:id"
      filter-route="/promotion-planning/products/advanced-search"
      :page="page"
    >
      <list-product />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_PRODUCT } from "@kraftheinz/common";

import ListProduct from "./ListProduct.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListProduct,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_PRODUCT,
      itemsMenu: [
        {
          title: "Master Files",
          path: "",
        },
        {
          title: "Products",
          path: "/promotion-planning/products",
        },
      ],
    };
  },
};
</script>
