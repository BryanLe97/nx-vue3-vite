<template>
  <div>
    <bread-crumb :items="itemsMenu" />
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource name="promotion-planning.common.clusters" :api-url="apiUrl" resource-id-name="code" />

    <resource name="promotion-planning.uploads" :api-url="apiUrl" :page="page">
      <upload-export />
    </resource>
  </div>
</template>

<script>
import { PROMOTIONAL_PLANNING_PROMOTION_ENTRY } from "@kraftheinz/common";

import UploadExport from "./UploadExport.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    UploadExport,
  },

  data() {
    return {
      apiUrl,
      itemsMenu: [
        {
          title: "Administration",
          path: "",
        },
        {
          title: "Upload/Export",
          path: "/promotional-planning/upload-export",
        },
      ],
      page: PROMOTIONAL_PLANNING_PROMOTION_ENTRY,
    };
  },
};
</script>

<style>
</style>
