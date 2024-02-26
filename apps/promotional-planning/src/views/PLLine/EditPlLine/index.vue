<template>
  <div class="edit-pl-line">
    <resource name="promotion-planning.common.lines" :api-url="apiUrl" resource-id-name="code" />

    <resource
      name="promotion-planning.pllines"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/pl-lines"
      :page="page"
    >
      <edit-pl-line />
    </resource>
  </div>
</template>

<script>
import EditPlLine from "./EditPlLine.vue";

import { PROMOTIONAL_PLANNING_PROMO_PANDL } from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditPlLine,
  },

  data() {
    return {
      apiUrl,
      page: PROMOTIONAL_PLANNING_PROMO_PANDL,
    };
  },
};
</script>
