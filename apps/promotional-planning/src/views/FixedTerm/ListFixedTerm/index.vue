<template>
  <div class="list-fixed-term">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="promotion-planning.fixedterms"
      :api-url="apiUrl"
      create-route="/promotion-planning/fixed-terms/create"
      edit-route="/promotion-planning/fixed-terms/:id"
      :page="page"
    >
      <list-fixed-term />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS } from "@kraftheinz/common";

import ListFixedTerm from "./ListFixedTerm.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListFixedTerm,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS,
      itemsMenu: [
        {
          title: "Master Files",
          path: "",
        },
        {
          title: "Fixed Terms",
          path: "/promotional-planning/fixed-terms",
        },
      ],
    };
  },
};
</script>
