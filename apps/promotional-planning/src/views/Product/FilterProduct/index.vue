<template>
  <div>
    <resource name="promotion-planning.common.clusters" :api-url="apiUrl" resource-id-name="code" />
    <resource
      name="promotion-planning.common.categories"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="promotion-planning.common.sub-categories"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.states" :api-url="apiUrl" resource-id-name="code" />
    <resource
      name="promotion-planning.common.customers"
      :api-url="apiUrl"
      resource-id-name="keyAccountCode"
    />
    <resource name="promotion-planning.common.products" :api-url="apiUrl" />
    <resource
      name="promotion-planning.products"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/products"
    >
      <filter-product />
    </resource>
  </div>
</template>

<script>
import FilterProduct from "./FilterProduct.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    FilterProduct,
  },
  data() {
    return {
      apiUrl,
    };
  },
};
</script>

<style>
</style>
