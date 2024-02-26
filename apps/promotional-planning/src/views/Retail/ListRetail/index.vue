<template>
  <div class="list-retail">
    <bread-crumb :items="itemsMenu" />

    <resource
      :api-url="apiUrl"
      :name="[
        'promotion-planning.common.regions',
        'promotion-planning.common.customers',
        'promotion-planning.common.states',
        'promotion-planning.common.clusters',
        'promotion-planning.common.categories',
        'promotion-planning.common.products',
        'promotion-planning.common.sub-categories',
      ]"
      :resource-id-name="['code', 'id', 'code', 'code', 'code', 'code', 'code']"
    >
      <resource
        :api-url="apiUrl"
        name="promotion-planning.promo-entries.retail-prices"
        :page="page"
      >
        <list-retail />
      </resource>
    </resource>

    <router-view />
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMO_ENTRY_SALES_PLAN } from "@kraftheinz/common";
import ListRetail from "./ListRetail.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    ListRetail,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_ENTRY_SALES_PLAN,
      itemsMenu: [
        {
          title: "Master Files",
          path: "",
        },
        {
          title: "Retail Prices",
          path: "/retail-price",
        },
      ],
    };
  },
};
</script>
