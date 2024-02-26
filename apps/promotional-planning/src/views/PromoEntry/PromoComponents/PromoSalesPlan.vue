<template>
  <div class="promo-sales-plan">
    <a-card
      v-if="entryPrice && promoEntry.entry !== ''"
      :loading="loading"
      class="weekly-price-entry-card"
    >
      <weekly-price-entry
        :fetch-list="fetchWeeklyPriceList"
        :fetch-guardrails="fetchGuardrails"
        :key-account="keyAccount"
        :tab="tab"
        :weekly-prices="weeklyPrices"
        :weekly-price-url="weeklyPriceUrl"
      />
    </a-card>
  </div>
</template>

<script>
import WeeklyPriceEntry from "./WeeklyPriceEntry.vue";

import { PromoUtils } from "@/utils";

export default {
  name: "PromoSalesPlan",

  components: {
    WeeklyPriceEntry,
  },

  mixins: [PromoUtils],

  inject: ["resourceProps"],

  props: {
    enabledEntry: {
      type: Boolean,
      default: false,
    },
    entryPrice: {
      type: Object,
      required: true,
    },
    keyAccount: {
      type: String,
      default: null,
    },
    promoEntry: {
      type: Object,
      required: true,
    },
    plTableUrl: {
      type: String,
      default: null,
    },
    priceEntryUrl: {
      type: String,
      default: null,
    },
    tab: {
      type: String,
      default: "",
    },
    weeklyPriceUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    const [, , plProps, weeklyPriceProps] = this.resourceProps;

    return {
      plProps,
      weeklyPriceProps,
    };
  },

  computed: {
    loading() {
      return this.weeklyPriceProps.crud.getFetchingStatus();
    },

    weeklyPrices() {
      return this.weeklyPriceProps.crud.getList();
    },
  },

  mounted() {
    this.fetchWeeklyPriceList();
  },

  methods: {
    fetchWeeklyPriceList() {
      this.weeklyPriceProps.crud.fetchList(this.weeklyPriceUrl);
    },

    fetchPLList() {
      this.plProps.crud.fetchList(this.plTableUrl);
    },

    fetchGuardrails() {
      this.fetchPLList();
    },
  },
};
</script>

<style lang="scss" scoped>
.promo-sales-plan {
  .weekly-price-entry-card {
    margin-top: 25px;
  }

  .price-volumn-history-card {
    margin-top: 24px;
  }
}
</style>
