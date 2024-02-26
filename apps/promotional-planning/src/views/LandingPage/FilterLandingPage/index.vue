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
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource name="promotion-planning.common.products" :api-url="apiUrl" />
    <resource name="promotion-planning.promo-status" :api-url="apiUrl" />

    <resource
      :api-url="apiUrl"
      :name="['promotion-planning.common.year']"
      :resource-id-name="['year']"
    >
      <resource
        name="promotion-planning.promo"
        :api-url="apiUrl"
        redirect-route="/promotion-planning/landing-page"
      >
        <filter-landing-page />
      </resource>
    </resource>
  </div>
</template>

<script>
import FilterLandingPage from "./FilterLandingPage.vue";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  components: {
    FilterLandingPage,
  },

  data() {
    return {
      apiUrl,
    };
  },
};
</script>

<style></style>
