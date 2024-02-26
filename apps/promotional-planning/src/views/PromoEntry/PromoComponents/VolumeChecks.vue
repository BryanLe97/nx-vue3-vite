<template>
  <div class="volume-checks body mx-5 mb-5">
    <a-collapse :bordered="false">
      <a-collapse-panel
        key="volume-checks"
        header="Volume Checks"
        :style="{ border: 0 }"
      >
        <chart-aggregate
          v-if="promoEntry"
          :promotion-id="promoEntry.promotionOptimisationId"
          :show-table="false"
        >
          <template #extra>
            <a-button type="primary" @click="onClickVolumeChecks">
              Volume Checks
            </a-button>
          </template>
        </chart-aggregate>
        <resource
          name="promotion-planning.promo-entries.ytd-comparison"
          resource-id-name="seqNumber"
          :api-url="apiUrl"
        >
          <YTD-volume-table />
        </resource>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import ChartAggregate from "@/components/PerformanceOptimization/ChartAggregate.vue";
import YTDVolumeTable from "@/components/PerformanceOptimization/YTDVolumeTable.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "VolumeChecks",
  components: { ChartAggregate, YTDVolumeTable },
  props: {
    promoEntry: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      apiUrl,
      activeKey: "volume-checks",
      volumeChecksUrl:
        "https://analytics.kraftheinz.com/#/site/CrossFunctionalAnalytics/views/PromoExecutionandCompliance/SellIn-SellOut?=null&:iid=2",
    };
  },

  methods: {
    onClickVolumeChecks() {
      window.open(this.volumeChecksUrl, "_blank");
    },
  },
};
</script>

<style lang="scss">
.volume-checks {
  .ant-collapse {
    &-borderless {
      background: transparent;
    }

    &-header {
      font-size: 16px;
      font-weight: 700;
    }

    &-content-box {
      padding: 0;
    }
  }

  .chart-aggregate {
    margin: 0 !important;
  }
}
</style>
