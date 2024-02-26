<template>
  <div>
    <bread-crumb :items="itemsMenu" />
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource name="promotion-planning.common.clusters" :api-url="apiUrl" />
    <resource name="promotion-planning.common.categories" :api-url="apiUrl" />
    <resource name="promotion-planning.common.products" :api-url="apiUrl" />
    <resource
      name="promotion-planning.common.sub-categories"
      :api-url="apiUrl"
    />
    <resource
      name="promotion-planning.promo-optis.scenario-builder"
      :api-url="apiUrl"
      resource-id-name="id"
      :page="page"
    >
      <scenario-builder />
    </resource>
  </div>
</template>

<script>
import ScenarioBuilder from "./ScenarioBuilder.vue";
import { PROMOTIONAL_PLANNING_SCENARIO_BUILDER } from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: { ScenarioBuilder },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_SCENARIO_BUILDER,
      itemsMenu: [
        {
          key: "scenario-builder",
          title: "Scenario Builder",
          path: "/promotion-planning/scenario-builder",
        },
      ],
    };
  },
};
</script>

<style></style>
