<template>
  <div class="create-unit-percentage">
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource
      name="promotion-planning.unit-percentage.products"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="promotion-planning.unit-percentage"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/unit-percentage"
      :page="page"
    >
      <create-unit-percentage />
    </resource>
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE } from "@kraftheinz/common";

import CreateUnitPercentage from "./CreateUnitPercentage.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreateUnitPercentage,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE,
    };
  },
};
</script>
