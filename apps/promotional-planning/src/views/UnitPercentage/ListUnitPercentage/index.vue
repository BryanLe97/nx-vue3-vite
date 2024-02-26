<template>
  <div class="list-unit-percentage">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="promotion-planning.unit-percentage"
      :api-url="apiUrl"
      create-route="/promotion-planning/unit-percentage/create"
      edit-route="/promotion-planning/unit-percentage/:id"
      :page="page"
    >
      <list-unit-percentage />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE } from "@kraftheinz/common";

import ListUnitPercentage from "./ListUnitPercentage.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListUnitPercentage,
  },

  data() {
    return {
      apiUrl,
      ListUnitPercentage,
      itemsMenu: [
        {
          title: "Administration",
          path: "",
        },
        {
          title: "Unit Percentage",
          path: "/promotional-planning/unit-percentage",
        },
      ],
      page: PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE,
    };
  },
};
</script>
