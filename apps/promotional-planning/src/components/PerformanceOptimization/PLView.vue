<template>
  <div class="pl-view">
    <div class="body mx-5">
      <table-view
        :filter-datas="filterDatas"
        :list-row-name-base="listRowNameExpert"
        :base-datas="baseDatas"
        :scenario-datas="scenarioDatas"
        :name-base-version="nameBaseVersion"
        :name-comparison-version="nameComparisonVersion"
        :is-loading-base="isLoadingBase"
        :is-loading-comparison="isLoadingComparison"
        :sync-collapse="isCollapsed"
        :hidden-fields="baseDatas.hiddenFields"
        @onChangeLeafStoreGM="onChangeLeafStoreGM"
      />
    </div>
  </div>
</template>

<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";

import TableView from "./TableView.vue";
import { LIST_ROW_NAME_EXPERTVIEW } from "@/constants/PerformanceOptimization/basic.pl";
import { SCENARIO_VERSION } from "@/constants/promotion-optimisation";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "PLView",

  components: {
    TableView,
  },

  mixins: [ErrorHandlerMixin],

  props: {
    filterDatas: {
      type: Object,
      default: () => {},
    },
    resourcePlan: {
      type: Array,
      default: () => [],
    },
    refreshView: {
      type: [Boolean, String],
      default: false,
    },
    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      baseDatas: {},
      scenarioDatas: {},
      isLoadingBase: false,
      isLoadingComparison: false,
      listRowNameExpert: LIST_ROW_NAME_EXPERTVIEW,
      expertViewApiUrl: `${apiUrl}/promotion-planning/promo-optis/expert-views`,
      planApiUrl: `${apiUrl}/promotion-planning/common/plans`,
    };
  },

  computed: {
    nameBaseVersion() {
      let planItem = "";
      if (this.filterDatas.comparison && this.resourcePlan.length) {
        planItem = this.resourcePlan.find(
          (x) => x.id == this.filterDatas.planId
        );
        return planItem ? planItem.name : "";
      }
      return "";
    },
    nameComparisonVersion() {
      let planItem = "";
      if (this.filterDatas.comparison && this.resourcePlan.length) {
        planItem = this.resourcePlan.find(
          (x) => x.id == this.filterDatas.comparison
        );
        return planItem ? planItem.name : "";
      }
      return planItem;
    },
    potId() {
      return this.$route.params.id;
    },
  },

  watch: {
    filterDatas(val) {
      if (val && val.promotionId == this.potId && val.parameters) {
        this.fetchData(val);
      }
    },

    async refreshView(val) {
      if (!val) return;

      switch (val) {
        case SCENARIO_VERSION.BASE:
          this.getExpertDataBaseVersion();
          break;
        case SCENARIO_VERSION.COMPARISON:
          this.getExpertDataComparisonVersion();
          break;
        case "all":
          this.fetchData(this.filterDatas);
          break;
        default:
          break;
      }

      this.$emit("update:refreshView", false);
    },
  },

  methods: {
    async fetchData(filters) {
      try {
        this.isLoadingBase = true;
        this.isLoadingComparison = true;
        const [baseVersionRes, comparisonVersionRes] = await Promise.all([
          this.getExpertViewData(filters, filters.planId),
          this.getExpertViewData(filters, filters.comparison),
        ]);

        if (baseVersionRes && baseVersionRes.data) {
          this.baseDatas = baseVersionRes.data;
        }

        if (comparisonVersionRes && comparisonVersionRes.data) {
          this.scenarioDatas = comparisonVersionRes.data;
          this.scenarioDatas.totalBaseDatas = this.baseDatas.total;
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingBase = false;
        this.isLoadingComparison = false;
      }
    },

    async getExpertDataBaseVersion() {
      try {
        this.isLoadingBase = true;
        const { data } = await this.getExpertViewData(
          this.filterDatas,
          this.filterDatas.planId
        );
        this.baseDatas = data;
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingBase = false;
      }
    },

    async getExpertDataComparisonVersion() {
      try {
        this.isLoadingComparison = true;
        const { data } = await this.getExpertViewData(
          this.filterDatas,
          this.filterDatas.comparison
        );
        this.scenarioDatas = data;
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingComparison = false;
      }
    },

    async getExpertViewData(filters, scenarioId) {
      try {
        const {
          isLeafStoreGM,
          parameters,
          childrenParameters,
          isInvestmentBuy,
        } = filters;
        let payload = {
          PromotionOptimisationId: parameters.promotionId,
          planId: scenarioId,
          isSelectedDateRange: parameters.isSelectedDateRange,
          productId: parameters.productId,
          isInvestmentBuy,
        };

        if (childrenParameters && childrenParameters.promotionId) {
          const childrenParameter = {
            ...childrenParameters,
            planId: scenarioId,
          };
          payload.childrenParameter = childrenParameter;
        }

        return this.axios.post(this.expertViewApiUrl, payload);
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },
    async onChangeLeafStoreGM(val) {
      this.filterDatas.isInvestmentBuy = val;
      this.fetchData(this.filterDatas);
    },
  },
};
</script>
