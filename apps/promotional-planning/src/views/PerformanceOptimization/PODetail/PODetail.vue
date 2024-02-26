<template>
  <div ref="poDetailContainer" class="promo-optimize-detail">
    <bread-crumb :items="itemsMenu" />

    <div class="px-2">
      <a-row class="header mb-4 px-4 pb-3" :gutter="16" type="flex">
        <a-col class="d-flex align-items-center flex-wrap" :span="12">
          <span class="mr-3 header-title">Promotional Optimisation</span>
        </a-col>
      </a-row>
    </div>

    <p-o-filter @filterParameters="updateQueryFilter" />

    <a-skeleton :loading="promotionId && isFetchingData">
      <simple-form v-slot="{ handleSubmit, reset }">
        <div v-if="promotionId" class="form">
          <div class="parameters-comparison mx-5">
            <a-row :gutter="24" type="flex">
              <a-col :span="24" class="mb-4">
                <p-o-parameters
                  :is-account-group="isAccountGroup"
                  :dc-id="dcId"
                  :external-filters="queryFilter"
                  @changeParametersFilters="onChangeParametersFilters"
                />
              </a-col>
              <a-col :span="12" class="mb-4">
                <comparison
                  :resource-plan="resourcePlan"
                  :filter-datas="queryFilter"
                  :refresh-p-l-comparison.sync="refreshPLComparison"
                />
              </a-col>
            </a-row>
          </div>

          <chart-aggregate />

          <div class="px-5">
            <promotion-optimization-input
              :has-create-btn="canAdd"
              :list-plan="resourcePlan"
              :refresh-metadata.sync="refreshMetadata"
              :refresh-base-input.sync="refreshBaseInput"
              :is-collapsed="isCollapsed"
              :is-account-group="isAccountGroup"
              @filterPO="updateQueryFilter"
              @has-new-scenario="onHasNewScenario"
              @scenario-name-changed="fetchListPlan"
            />
          </div>

          <p-l-view
            :refresh-view.sync="refreshView"
            :resource-plan="resourcePlan"
            :filter-datas="queryFilter"
            :is-collapsed="isCollapsed"
            class="pt-3"
          />

          <a-card class="mx-5 my-3">
            <div>
              <label class="font-weight-bold h5">History</label>
              <a-icon
                class="ml-2"
                :type="isCollapseHistory ? 'down' : 'up'"
                @click="toggleHistory"
              />
            </div>

            <div v-if="!isCollapseHistory" class="mt-3">
              <publish-history :view-only="true" :history="history" />
            </div>
          </a-card>

          <pot-comment />

          <a-row
            class="promo-detail__footer neutral-1"
            type="flex"
            justify="end"
          >
            <a-col>
              <a-button @click="onCancel(reset)">Cancel</a-button>

              <a-button
                v-if="canEdit"
                class="ml-2"
                :loading="isLoading"
                type="primary"
                @click="handleSubmit(onSave)"
              >
                Save
              </a-button>

              <a-button v-if="canPublish" class="ml-2" @click="goToPublish">
                Publish to PP
              </a-button>
            </a-col>
          </a-row>
        </div>
      </simple-form>
    </a-skeleton>

    <publish
      :plan-id="queryFilter.comparison"
      :plan-name="getPlanName(queryFilter.comparison)"
      :visible.sync="visiblePublish"
      :product-id="productId"
      @publish-done="onPublishDone"
      @refetch-after-delete="fetchListPlan"
    />

    <send-email
      :handle-save="handleSave"
      :promotion-id="+promotionId"
      :visible.sync="isSendEmailVisible"
    />
  </div>
</template>

<script>
import {
  ErrorHandlerMixin,
  ADD_SCENARIO_PERMISSION,
  EDIT_PERMISSION,
  PUBLISH_PERMISSION,
  SENDEMAIL_PERMISSION,
  PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_LIST,
} from "@kraftheinz/common";

import POFilter from "@/components/PerformanceOptimization/POFilter.vue";
import POParameters from "@/components/PerformanceOptimization/POParameters.vue";
import Comparison from "@/components/PerformanceOptimization/Comparison.vue";
import PromotionOptimizationInput from "@/components/PerformanceOptimization/PromotionOptimizationInput/PromotionOptimizationInput.vue";
import PLView from "@/components/PerformanceOptimization/PLView.vue";
import PotComment from "@/components/PerformanceOptimization/PotComment.vue";
import ChartAggregate from "@/components/PerformanceOptimization/ChartAggregate.vue";
import Publish from "@/views/PerformanceOptimization/Publish/Publish.vue";
import SendEmail from "./SendEmail.vue";
import PublishHistory from "@/views/PerformanceOptimization/Publish/PublishHistory.vue";

import {
  URL_POT_OPTIONS,
  URL_POT_PARAMETERS,
  URL_POT_PLAN,
} from "@/constants/api-endpoints";
import { SCENARIO_VERSION } from "@/constants/promotion-optimisation";
import { NEW_WORLD_AUCKLAND_CODE } from "@/constants/others";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "PODetail",

  mixins: [ErrorHandlerMixin],

  components: {
    POFilter,
    POParameters,
    Comparison,
    PromotionOptimizationInput,
    PLView,
    PotComment,
    ChartAggregate,
    Publish,
    SendEmail,
    PublishHistory,
  },

  inject: ["resourceProps"],

  provide() {
    return {
      publishEndpoint: this.publishEndpoint,
      fetchPublishHistoryPODetail: this.fetchPublishHistory,
    };
  },

  data() {
    const [
      promoOptisProps,
      parametersProps,
      promoOptionsProps,
      planProps,
      sendEmailProps,
    ] = this.resourceProps;

    const { id } = this.$route.params;

    return {
      promoOptisProps,
      parametersProps,
      promoOptionsProps,
      publishEndpoint: `${apiUrl}/promotion-planning/promo-optis/${id}/publish`,
      productId: null,
      planProps,
      sendEmailProps,
      itemsMenu: [
        {
          key: "landingPage",
          title: "PromoDB Home Page",
          path: "/promotion-planning/landing-page",
        },
        {
          key: id ? "detail" : "create",
          title: "Promotional Optimization",
          path: "/promotion-planning/promo-optimization/create",
        },
      ],

      queryFilter: {
        isInvestmentBuy: true,
      },
      isLoading: false,
      refreshView: false,
      refreshPLComparison: false,
      resourcePlan: [],
      refreshMetadata: false,
      refreshBaseInput: false,
      visiblePublish: false,
      isCollapsed: true,
      isSendEmailVisible: false,
      saveDone: {
        parameter: false,
        base: false,
        comparison: false,
      },
      isAccountGroup: false,
      isCollapseHistory: false,
      isFetchingData: true,
      history: [],
    };
  },

  computed: {
    canSendEmail() {
      return this.$can(
        SENDEMAIL_PERMISSION,
        PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_LIST
      );
    },

    promotionId() {
      return this.$route.params.id;
    },

    canAdd() {
      return this.promoOptisProps.can(ADD_SCENARIO_PERMISSION);
    },

    canEdit() {
      return this.promoOptisProps.can(EDIT_PERMISSION);
    },

    canPublish() {
      return this.promoOptisProps.can(PUBLISH_PERMISSION);
    },

    poDetails() {
      return this.promoOptisProps.crud.getEntity();
    },

    dcId() {
      return this.poDetails && this.poDetails.promotionChildrenId;
    },
  },

  watch: {
    promotionId() {
      this.fetchPODetail();
      this.fetchListPlan();
    },

    "queryFilter.comparison"() {
      this.fetchPublishHistory();
    },
  },

  async mounted() {
    if (this.promotionId) {
      this.fetchPODetail();
      this.fetchListPlan();
    }
    this.$refs.poDetailContainer.addEventListener("syncCollapse", (evt) => {
      this.isCollapsed = evt.detail.isCollapsed;
    });
  },

  unmounted() {
    this.parametersProps.crud.clearEntity("editForm");
    this.promoOptionsProps.crud.clearEntity("editForm");
  },

  methods: {
    async fetchPublishHistory() {
      try {
        const publishEndpoint = `${apiUrl}/promotion-planning/promo-optis/${this.$route.params.id}/publish`;
        const payload = {
          params: {
            planId: this.queryFilter.comparison,
          },
        };

        const res = await this.axios.get(publishEndpoint, payload);

        if (res && res.data && res.data.results) {
          this.history = res.data.results;
        }
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },
    async fetchPODetail() {
      try {
        this.isFetchingData = true;

        const res = await this.promoOptisProps.crud.fetchEntity();

        if (res && res.data) {
          const { id, keyAccountCode, region } = res.data;

          this.updateQueryFilter({
            promotionId: id,
            keyAccountCode: keyAccountCode,
          });

          /** it is north island account group */
          this.isAccountGroup =
            NEW_WORLD_AUCKLAND_CODE.includes(keyAccountCode) || region === "NZ";
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isFetchingData = false;
      }
    },

    async fetchListPlan() {
      const promotionId = +this.$route.params.id;

      if (promotionId) {
        this.planProps.crud.deleteFilter("IsInactive");
        this.planProps.crud.deletePagination();

        const planEndpoint =
          apiUrl + URL_POT_PLAN + `?promotionId=${promotionId}`;

        const { data } = await this.planProps.crud.fetchList(planEndpoint);
        this.resourcePlan = data;
      }
    },

    onCancel(resetForm) {
      resetForm();
      this.$router.push(`/promotion-planning/landing-page`);
    },

    async saveParameters() {
      let parametersMessage = "Parameters Updated";
      let sectionName = "parameters";
      let successCounter = 0;

      if (this.isAccountGroup) {
        parametersMessage = "Parameters of DTS Updated";
        sectionName = "parameters of DTS";
      }

      /** submit the main parameters - 1st 'parameters' block */
      try {
        const parametersPayload = this.parametersProps.crud.getEntityForm(
          "editForm"
        );

        const { planId } = parametersPayload;

        await this.submitParameter(this.promotionId, planId, parametersPayload);

        successCounter++;
        this.$notification.success({ message: parametersMessage });
      } catch (errParam) {
        this.onSaveFailed(sectionName, errParam);
      }

      /** to refresh depended sections if can save successfully at least 1 'parameters' block */
      this.saveDone.parameter = successCounter > 0;
    },

    submitParameter(promotionId, planId, payload) {
      const paramsEndpoint =
        apiUrl +
        URL_POT_PARAMETERS +
        `?promotionId=${promotionId}&planId=${planId}`;
      return this.axios.put(paramsEndpoint, payload);
    },

    submitPromoOptions(scenarioId, payload) {
      const promotionId = +this.$route.params.id;

      if (promotionId >= 0 && scenarioId >= 0) {
        const optionEndpoint =
          apiUrl +
          URL_POT_OPTIONS +
          `?promotionId=${promotionId}&planId=${scenarioId}`;
        return this.axios.put(optionEndpoint, payload);
      }

      return false;
    },

    async handleSave() {
      this.isLoading = true;

      await this.saveParameters();

      const poInputData = this.promoOptionsProps.crud.getEntityForm("editForm");
      const { base, comparison } = poInputData;
      const baseScenarioId = this.queryFilter.planId;
      const compScenarioId = this.queryFilter.comparison;

      /** if the base version scenario is same as comparison version scenario,
       *  saving the data of comparison version table only.
       * */
      if (baseScenarioId !== compScenarioId) {
        this.refreshBaseInput = false;

        try {
          await this.submitPromoOptions(baseScenarioId, base);
          this.saveDone.base = true;
          this.$notification.success({ message: "Base Version Updated" });
        } catch (errBase) {
          this.saveDone.base = false;
          this.onSaveFailed("base version", errBase);
        }
      }

      try {
        await this.submitPromoOptions(compScenarioId, comparison);
        this.saveDone.comparison = true;

        this.$notification.success({ message: "Comparison Version Updated" });
      } catch (errComp) {
        this.saveDone.comparison = false;
        this.onSaveFailed("comparison version", errComp);
      }

      /** since we don't call api to submit base version,
       * we will set saveDone.base equals the result of saveDone.comparison to trigger refreshing base version in the basic/expert view
       * after saving comparison successfully */
      if (baseScenarioId === compScenarioId) {
        this.saveDone.base = this.saveDone.comparison;
        this.refreshBaseInput = true;
      }

      this.afterSave();

      this.isLoading = false;
    },

    onSaveFailed(section, err) {
      /** overwrite message of response to make it more specific for parameters */
      let parameterErr = { ...err };
      parameterErr.response.data.message = `Cannot save ${section}. Reason: ${err.response.data.message}`;

      this.displayErrorNotification(parameterErr);
    },

    async onSave() {
      if (this.canSendEmail) this.isSendEmailVisible = true;
      else await this.handleSave();
    },

    async afterSave() {
      const { base, comparison, parameter } = this.saveDone;
      if (parameter) {
        this.refreshPLComparison = true;
        if (base && comparison) {
          this.refreshView = "all";
        } else if (base) {
          this.refreshView = SCENARIO_VERSION.BASE;
        } else if (comparison) {
          this.refreshView = SCENARIO_VERSION.COMPARISON;
        }
      } else if (base && comparison) {
        this.refreshPLComparison = true;
        this.refreshView = "all";
      } else if (comparison) {
        this.refreshPLComparison = true;
        this.refreshView = SCENARIO_VERSION.COMPARISON;
      } else if (base) {
        this.refreshPLComparison = true;
        this.refreshView = SCENARIO_VERSION.BASE;
      }

      /** turn the refreshMetadata on to trigger recall its api  */
      this.refreshMetadata = true;
    },

    updateQueryFilter(newVal) {
      this.queryFilter = { ...this.queryFilter, ...newVal };
    },

    /**
     * 1. call the api to get new data of plans, data of parameters
     * 2. update the value of comparison in the queryFilter object
     */
    async onHasNewScenario(newVal) {
      await this.fetchListPlan();
      this.updateQueryFilter(newVal);
    },

    getPlanName(planId) {
      const planInfo = this.resourcePlan.find((item) => item.id === +planId);
      return planInfo ? planInfo.name : "";
    },

    goToPublish() {
      this.visiblePublish = true;
    },

    onPublishDone() {
      /** turn the refreshMetadata on to trigger recall its api  */
      this.refreshMetadata = true;
      this.refreshView = "all";
      this.fetchPODetail();
      this.fetchListPlan();
    },

    onChangeParametersFilters(newValues) {
      /** update filters of parameters to the queryFilter */
      this.queryFilter = { ...this.queryFilter, ...newValues };
      this.productId = this.queryFilter.parameters.productId;
      this.refreshView = "all";
    },

    toggleHistory() {
      this.isCollapseHistory = !this.isCollapseHistory;
    },
  },
};
</script>

<style lang="scss" scoped>
.promo-optimize-detail {
  padding-bottom: 30px;

  ::v-deep {
    .ant-form-item {
      margin-bottom: 0 !important;
    }

    .ant-tabs-nav-container {
      padding-left: 0;
    }

    .ant-card,
    .ant-card-body,
    .ant-spin-nested-loading {
      height: 100%;
    }

    .margin-bottom-for-slide {
      margin-bottom: 70px;
    }
  }

  .header {
    background-color: white;
  }

  .filter-title {
    color: black;
    font-weight: 500;
  }

  .header-title {
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .arrow-left {
    font-size: 18px;
  }

  .promo-detail__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 15px 40px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
