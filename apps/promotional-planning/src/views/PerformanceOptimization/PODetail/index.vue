<template>
  <div class="promo-detail">
    <resource
      name="promotion-planning.common.regions"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="promotion-planning.common.clusters"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="promotion-planning.common.store-dc"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="promotion-planning.common.cds-list"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource
      name="identities.users-of-app"
      :api-url="apiUrl"
      resource-id-name="email"
    />

    <resource
      :name="[
        'promotion-planning.promo-optis',
        'promotion-planning.promo-optis.parameters',
        'promotion-planning.promo-optis.promo-options',
        'promotion-planning.common.plans',
        'promotion-planning.promo-optis.send-email',
        'promotion-planning.common.date-range-product',
        'promotion-planning.comments',
      ]"
      :resource-id-name="['id', 'planId', 'id', 'id', 'planId', 'id']"
      :api-url="apiUrl"
      :page="page"
      :subscriptions="[{}, {}, {}, {}, {}, sendEmailSubscriptions, {}]"
    >
      <p-o-detail :page="page" />
    </resource>
  </div>
</template>

<script>
import {
  PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL,
  PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_LIST,
} from "@kraftheinz/common";

import PODetail from "./PODetail.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "PODetailIndex",
  components: {
    PODetail,
  },

  data() {
    return {
      PODetail,
      apiUrl,
      isEdit: false,
      page: [
        PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL,
        "",
        "",
        "",
        "",
        PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_LIST,
      ],
      sendEmailSubscriptions: {
        onCreateSuccess: () => {},
      },
    };
  },
};
</script>
