<template>
  <div class="edit-unit-percentage">
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
      <edit-unit-percentage />
    </resource>
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE } from "@kraftheinz/common";

import EditUnitPercentage from "./EditUnitPercentage.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditUnitPercentage,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE,
    };
  },
};
</script>
