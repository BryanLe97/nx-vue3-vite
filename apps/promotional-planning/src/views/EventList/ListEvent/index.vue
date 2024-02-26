<template>
  <div>
    <bread-crumb :items="menuItems" />

    <resource
      name="promotion-planning.events"
      :api-url="apiUrl"
      create-route="/promotion-planning/event-list/create"
      edit-route="/promotion-planning/event-list/:id"
      :page="page"
    >
      <list-event />
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_EVENT_LIST as page } from "@kraftheinz/common";

import ListEvent from "./ListEvent.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: { ListEvent },

  data() {
    const menuItems = [
      {
        title: "Master Files",
        path: "",
      },
      {
        title: "Event List",
        path: "/promotion-planning/event-list",
      },
    ];

    return {
      apiUrl,
      menuItems,
      page,
    };
  },
};
</script>