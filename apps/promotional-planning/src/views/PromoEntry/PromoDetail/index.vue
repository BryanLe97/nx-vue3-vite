<template>
  <div class="promo-detail">
    <resource
      name="promotion-planning.common.regions"
      :api-url="apiUrl"
      resource-id-name="code"
    />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource
      name="promotion-planning.common.clusters"
      :api-url="apiUrl"
      resource-id-name="code"
    />

    <resource
      :name="[
        'promotion-planning.promo-entries',
        'promotion-planning.promo-entries.key-metrics',
        'promotion-planning.promo-entries.statistic',
        'promotion-planning.weekly-prices',
        'promotion-planning.promo-entries.price-entries.multiple',
        'promotion-planning.promo-entries.active',
        'promotion-planning.common.price-entries',
        'promotion-planning.promo-entries.weekly-prices.multiple',
        'promotion-planning.promo-entries.distributor',
        'promotion-planning.common.tactic',
        'promotion-planning.common.primary-instore',
        'promotion-planning.common.plans',
        'promotion-planning.promo-entries.ytd-comparison',
        'promotion-planning.comments',
      ]"
      :api-url="apiUrl"
      :resource-id-name="[
        'id',
        'seqNumber',
        'version',
        'finWeek',
        '',
        '',
        'id',
        '',
        '',
        'id',
        'seqNumber',
      ]"
      :page="page"
    >
      <promo-detail :page="page" />
    </resource>
  </div>
</template>

<script>
import {
  PROMOTIONAL_PLANNING_PROMO_ENTRY,
  PROMOTIONAL_PLANNING_PROMO_ENTRY_GUARDRAILS,
  PROMOTIONAL_PLANNING_PROMO_ENTRY_SALES_PLAN,
} from "@kraftheinz/common";

import EventBus from "@/EventBus";

import PromoDetail from "./PromoDetail.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "CreateProfile",
  components: {
    PromoDetail,
  },

  data() {
    return {
      PromoDetail,
      apiUrl,
      isEdit: false,
      page: [
        PROMOTIONAL_PLANNING_PROMO_ENTRY,
        PROMOTIONAL_PLANNING_PROMO_ENTRY_GUARDRAILS,
        PROMOTIONAL_PLANNING_PROMO_ENTRY_SALES_PLAN,
      ],
    };
  },

  created() {
    EventBus.$on("isEditPromoEntry", (val) => {
      this.isEdit = val;
    });
  },

  destroyed() {
    EventBus.$off("isEditPromoEntry", (val) => {
      this.isEdit = val;
    });
  },

  beforeRouteLeave(to, from, next) {
    if (!this.isEdit || from.name == "DuplicatePromoDetail") {
      next();
    } else {
      this.$confirm({
        title: "Are you sure that you want to leave this site?",
        content:
          "You have unsaved changes. If you leave this page, these change will be lost.",
        okText: "Stay",
        cancelText: "Yes, leave without saving.",
        onOk() {
          next(false);
        },
        onCancel() {
          next();
        },
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.promo-detail {
  ::v-deep {
    .promo-entry-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      padding: 15px 40px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
