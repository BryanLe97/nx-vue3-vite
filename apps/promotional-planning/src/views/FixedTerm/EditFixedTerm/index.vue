<template>
  <div class="edit-fixed-term">
    <resource name="promotion-planning.common.pllines" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />

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

    <resource name="promotion-planning.common.products" :api-url="apiUrl" />

    <resource
      name="promotion-planning.fixedterms"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/fixed-terms"
      :page="page"
    >
      <edit-fixed-term />
    </resource>
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS } from "@kraftheinz/common";

import EditFixedTerm from "./EditFixedTerm.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditFixedTerm,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS,
    };
  },
};
</script>
