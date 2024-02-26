<template>
  <div class="list-location">
    <bread-crumb :items="menuItems" />

    <resource
      name="promotion-planning.primary-instore"
      :api-url="apiUrl"
      create-route="/promotion-planning/activity-list/create"
      edit-route="/promotion-planning/activity-list/:id"
      :page="page"
    >
      <list-location />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_LOCATION_LIST } from "@kraftheinz/common";

import ListLocation from "./ListLocation.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListLocation,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_LOCATION_LIST,
      menuItems: [
        {
          title: "Master Files",
          path: "",
        },
        {
          title: "Activity List",
          path: "/promotion-planning/activity-list",
        },
      ],
    };
  },
};
</script>
