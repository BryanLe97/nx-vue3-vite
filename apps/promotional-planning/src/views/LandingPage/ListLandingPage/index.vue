<template>
  <div class="list-promo">
    <bread-crumb :items="itemsMenu" />

    <resource
      :api-url="apiUrl"
      :name="[
        'promotion-planning.common.regions',
        'promotion-planning.common.customers',
        'promotion-planning.common.clusters',
        'promotion-planning.common.sub-categories',
        'promotion-planning.common.plans',
        'promotion-planning.common.year',
      ]"
      :resource-id-name="['code', 'id', 'code', 'code', 'name', 'year']"
    >
      <resource
        :api-url="apiUrl"
        create-route="/promotion-planning/promo-optimization/create"
        filter-route="/promotion-planning/landing-page/advanced-search"
        name="promotion-planning.promo"
        :page="page"
      >
        <list-landing-page />
      </resource>
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_ENTRY } from "@kraftheinz/common";

import ListLandingPage from "./ListLandingPage.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListLandingPage,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_ENTRY,
      ListLandingPage,
      itemsMenu: [
        {
          key: "landing-page",
          title: "PromoDB Home Page",
          path: "",
        },
      ],
    };
  },
};
</script>
