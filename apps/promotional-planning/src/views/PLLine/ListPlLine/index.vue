<template>
  <div class="list-pl-line">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="promotion-planning.pllines"
      :api-url="apiUrl"
      create-route="/promotion-planning/pl-lines/create"
      edit-route="/promotion-planning/pl-lines/:id"
      :page="page"
    >
      <list-pl-line />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_PANDL } from "@kraftheinz/common";

import ListPlLine from "./ListPlLine.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListPlLine,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_PANDL,
      itemsMenu: [
        {
          title: "Master Files",
          path: "",
        },
        {
          title: "P&L Lines",
          path: "/promotion-planning/pl-lines",
        },
      ],
    };
  },
};
</script>
