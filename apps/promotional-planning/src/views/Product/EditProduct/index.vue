<template>
  <div class="edit-product">
    <resource name="promotion-planning.common.clusters" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource
      name="promotion-planning.products"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/products"
      :page="page"
    >
      <edit-product />
    </resource>
  </div>
</template>

<script>
import EditProduct from "./EditProduct.vue";

import { PROMOTIONAL_PLANNING_PROMO_PRODUCT } from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditProduct,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_PRODUCT,
    };
  },
};
</script>
