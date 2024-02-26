<template>
  <div class="create-product">
    <resource name="promotion-planning.common.clusters" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />

    <resource
      name="promotion-planning.products"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/products"
    >
      <create-product />
    </resource>
  </div>
</template>

<script>
import CreateProduct from "./CreateProduct.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreateProduct,
  },

  data() {
    return {
      CreateProduct,
      apiUrl,
    };
  },
};
</script>
