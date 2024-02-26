<template>
  <div class="scenario-builder list">
    <div class="list__title pt-2 pb-4">
      <h2 class="mb-0">Scenario Builder</h2>
    </div>
    <div class="m-5">
      <section class="list__filters py-4">
        <scenario-builder-filter
          :is-filtering="isFiltering"
          @apply="onApplyFilters"
          @clear="reset"
        />
      </section>
      <simple-form v-slot="{ invalid }">
        <div
          v-if="listScenarioBuilder.length && comparisonData"
          class="list__content bg-white px-4 py-2"
        >
          <a-collapse :bordered="false" active-key="financials">
            <a-collapse-panel key="financials" header="Financials">
              <a-spin :spinning="isFetchingComparisonData">
                <div
                  v-if="comparisonData.promotionOptimisationIds"
                  class="horizontal-scroll pb-2"
                >
                  <a-space class="flex-nowrap" :size="100">
                    <financials-comparison-table
                      title="Total"
                      :has-reload="false"
                      :table-data="comparisonData.total"
                    />

                    <financials-comparison-table
                      v-for="data in comparisonData.keyAccounts"
                      :key="data.keyAccount"
                      :has-reload="false"
                      :title="data.keyAccount"
                      :table-data="data"
                    />
                  </a-space>
                </div>
              </a-spin>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <section
          v-if="listScenarioBuilder.length"
          class="list__content bg-white p-4"
        >
          <div>
            <div class="w-100 d-flex justify-content-center">
              <a-space size="large">
                <a-button @click="onApplyAll">Apply to All</a-button>
                <a-button
                  type="primary"
                  :loading="!!reviewingTables.length"
                  @click="onReviewAll"
                >
                  Review All
                </a-button>
              </a-space>
            </div>
            <a-collapse
              :bordered="false"
              :active-key="[subCategory.subCategoryCode]"
            >
              <a-collapse-panel
                :key="subCategory.subCategoryCode"
                :header="subCategory.subCategory"
              >
                <a-collapse
                  :bordered="false"
                  :active-key="
                    listScenarioBuilder[0].ppGs.map((ppg) => ppg.ppgCode)
                  "
                >
                  <a-collapse-panel
                    v-for="ppg in listScenarioBuilder[0].ppGs"
                    :key="ppg.ppgCode"
                    :header="`${ppg.ppgCode} - ${ppg.ppg}`"
                  >
                    <a-collapse
                      :bordered="false"
                      :active-key="
                        ppg.keyAccounts.map(
                          (keyAccount) => keyAccount.keyAccountCode
                        )
                      "
                    >
                      <a-collapse-panel
                        v-for="keyAccount in ppg.keyAccounts"
                        :key="keyAccount.keyAccountCode"
                        :header="`${keyAccount.keyAccountCode} - ${keyAccount.keyAccount}`"
                        :set="(plan = keyAccount.plan)"
                      >
                        <a-space
                          class="d-flex scenario-builder__wrapper horizontal-scroll"
                        >
                          <a-row
                            class="scenario-table"
                            type="flex"
                            :gutter="16"
                          >
                            <a-col :span="12">
                              <base-scenario
                                :is-fetching="
                                  fetchingTables.includes(
                                    keyAccount.keyAccountCode
                                  )
                                "
                                :tbl-data="plan.promotionOptimisationTypes"
                                :po-id="plan.basePromotionOptimisationId"
                                :plans="keyAccount.plans"
                                :plan-id="plan.basePlanId"
                                @change-plan="onPlanChange(keyAccount, $event)"
                              />
                            </a-col>
                            <a-col :span="2" class="h-100">
                              <form-review-scenario
                                :plan-id="plan.basePlanId"
                                :po-id="plan.basePromotionOptimisationId"
                                :is-filtering="isFiltering"
                                :is-reviewing="
                                  reviewingTables.includes(
                                    plan.basePromotionOptimisationId
                                  )
                                "
                                :review-data="
                                  getDataFromList(
                                    reviewForms,
                                    plan.basePlanId,
                                    plan.basePromotionOptimisationId
                                  )
                                "
                                @change="onReviewFormChange"
                                @review="
                                  onReviewScenario(
                                    keyAccount.plan.basePromotionOptimisationId,
                                    $event
                                  )
                                "
                              />
                            </a-col>
                            <a-col :span="10">
                              <review-scenario
                                :is-fetching="
                                  reviewingTables.includes(
                                    plan.basePromotionOptimisationId
                                  )
                                "
                                :data-source="
                                  getDataFromList(
                                    reviewScenarios,
                                    keyAccount.plan.basePlanId,
                                    keyAccount.plan.basePromotionOptimisationId
                                  )
                                "
                                :po-id="plan.basePromotionOptimisationId"
                                :plan-id="plan.basePlanId"
                                :fin-year="finYear"
                                :years="years"
                                @change="onReviewScenarioChange"
                              />
                            </a-col>
                            <a-col
                              v-if="
                                comparisonData &&
                                comparisonData.plans.some(
                                  (item) => item.basePlanId === plan.basePlanId
                                )
                              "
                            >
                              <a-row type="flex" align="middle" class="h-100">
                                <a-col>
                                  <a-spin
                                    :spinning="
                                      reviewingTables.includes(
                                        plan.basePromotionOptimisationId
                                      ) ||
                                      fetchingComparisonTables.includes(
                                        plan.basePromotionOptimisationId
                                      )
                                    "
                                  >
                                    <financials-comparison-table
                                      class="ml-5"
                                      :table-data="
                                        getDataFromList(
                                          comparisonData.plans,
                                          plan.basePlanId,
                                          plan.basePromotionOptimisationId
                                        )
                                      "
                                    />
                                  </a-spin>
                                </a-col>
                              </a-row>
                            </a-col>
                          </a-row>
                        </a-space>
                      </a-collapse-panel>
                    </a-collapse>
                  </a-collapse-panel>
                </a-collapse>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </section>
        <a-empty v-else :image="EmptyImage.PRESENTED_IMAGE_SIMPLE" />
        <section
          v-if="can(permissions.create)"
          class="list__footer d-flex justify-content-end px-5 py-3"
        >
          <a-button
            :disabled="!reviewScenarios.length || invalid"
            type="primary"
            :loading="isCreating"
            @click="onCreate"
          >
            Create
          </a-button>
        </section>
      </simple-form>
    </div>
  </div>
</template>

<script>
import { EmptyImage, ErrorHandlerMixin } from "@kraftheinz/common";
import { PromoUtils } from "@/utils";
import { URL_POT_OPTIONS } from "@/constants/api-endpoints";
import { CREATE_PERMISSION } from "@kraftheinz/common/src/constants";
import ScenarioBuilderFilter from "./ScenarioBuilderComponents/ScenarioBuilderFilter.vue";
import BaseScenario from "./ScenarioBuilderComponents/BaseScenario.vue";
import ReviewScenario from "./ScenarioBuilderComponents/ReviewScenario.vue";
import FormReviewScenario from "./ScenarioBuilderComponents/FormReviewScenario.vue";
import FinancialsComparisonTable from "./ScenarioBuilderComponents/FinancialsComparisonTable.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "ScenarioBuilder",

  mixins: [PromoUtils, ErrorHandlerMixin],

  components: {
    BaseScenario,
    ScenarioBuilderFilter,
    FormReviewScenario,
    ReviewScenario,
    FinancialsComparisonTable,
  },

  inject: ["crud", "apiUrl", "can"],

  provide() {
    return {
      optionsProps: {
        crud: this.crud,
      },
      parametersProps: {},
      selectedScenarioIds: [],
      years: this.years,
      fetchComparisonData: this.fetchComparisonData,
    };
  },

  data() {
    const currentYear = this.$moment().year();
    const years = [
      { year: currentYear - 1 },
      { year: currentYear },
      { year: currentYear + 1 },
    ];

    return {
      // listScenarioBuilder: [],
      comparisonData: undefined,
      comparisonUrl: "/promotion-planning/promo-optis/scenario-comparison",
      EmptyImage,
      fetchingTables: [],
      fetchingComparisonTables: [],
      isCreating: false,
      isFiltering: false,
      isFetchingComparisonData: false,
      reviewForms: [],
      reviewingTables: [],
      reviewScenarios: [],
      reviewUrl: "/promotion-planning/promo-optis/reviews",
      createUrl: "/promotion-planning/promo-optis/scenario-builder",
      urlOptions: URL_POT_OPTIONS,
      finYear: null,
      years,
      permissions: {
        create: CREATE_PERMISSION,
      },
    };
  },

  computed: {
    listScenarioBuilder() {
      return this.crud.getList();
    },

    filteredFinYear() {
      return this.crud.getFilter("FinYear").value || null;
    },

    subCategory() {
      const { subCategoryCode, subCategory } = this.listScenarioBuilder[0];

      return { subCategoryCode, subCategory };
    },
  },

  async mounted() {
    // const url =
    //   "/promotion-planning/promo-optis/scenario-builder/?count=0&page=1&pageSize=10&fe=((Region%20Eq%20`NZ`)and(CustomerId%20In%20`7061%2C7062`)and(FinYear%20Eq%20`2023`)and(ClusterCode%20Eq%20`1111`)and(CategoryCode%20Eq%20`03`)and(SubCategoryCode%20Eq%20`3200`)and(PPGCode%20In%20`54%2C59`))";
    // const { data } = await this.axios.get(this.apiUrl + url);
    // this.listScenarioBuilder = data;
    // this.crud.setFilter("FinYear", { operator: "Eq", value: 2023 });
    this.crud.deleteFilter("IsInactive");
  },

  destroyed() {
    this.crud.clearList();
    this.crud.clearFilters();
    this.crud.deleteQueryStrings();
  },

  methods: {
    async fetchScenarioDetails(promotionId, scenarioId) {
      const apiEndpoint =
        apiUrl +
        this.urlOptions +
        `?promotionId=${promotionId}&planId=${scenarioId}`;

      try {
        const { data } = await this.axios.get(apiEndpoint);
        return data;
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async getReviewData() {
      try {
        const { data } = await this.axios.post(
          this.apiUrl + this.reviewUrl,
          this.reviewForms
        );

        return data;
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async fetchComparisonData(poId) {
      try {
        this.isFetchingComparisonData = true;
        this.fetchingComparisonTables.push(poId);
        const { data } = await this.axios.post(
          this.apiUrl + this.comparisonUrl,
          { plans: this.reviewScenarios }
        );
        if (!data) return;
        this.comparisonData = data;
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isFetchingComparisonData = false;
        this.fetchingComparisonTables = this.fetchingComparisonTables.filter(
          (item) => item !== poId
        );
      }
    },

    onApplyAll() {
      const firstPpg = { ...this.reviewForms[0] };

      delete firstPpg.basePlanId;
      delete firstPpg.basePromotionOptimisationId;

      this.reviewForms = this.reviewForms.map((item) => {
        return { ...item, ...firstPpg };
      });
    },

    async onApplyFilters() {
      try {
        this.finYear = this.crud.getFilter("FinYear").value || null;
        this.isFiltering = true;
        this.crud.deleteFilter("IsInactive");
        this.reset();
        this.crud.clearList();
        await this.crud.fetchList();
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isFiltering = false;
      }
    },

    reset() {
      this.reviewScenarios = [];
      this.reviewForms = [];
      this.comparisonData = undefined;
    },

    async onCreate() {
      try {
        this.isCreating = true;
        const { data } = await this.axios.post(
          `${this.apiUrl}${this.createUrl}`,
          this.reviewScenarios
        );

        this.reviewScenarios = data;

        let countSuccess = 0;
        let countFail = 0;

        data.map((item) => {
          if (item.isSuccess) countSuccess++;
          else if (!item.isSuccess) countFail++;
        });

        if (countSuccess > 0)
          this.$notification.success({
            message: `Successfully created ${countSuccess} scenario${
              countSuccess > 1 ? "s" : ""
            }`,
          });

        if (countFail > 0)
          setTimeout(() => {
            this.$notification.error({
              message: `Failed to created ${countFail} scenario${
                countFail > 1 ? "s" : ""
              }`,
            });
          }, 100);
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isCreating = false;
      }
    },

    onReviewFormChange(formData) {
      const { basePlanId, basePromotionOptimisationId } = formData;
      const scenarioIndex = this.reviewForms.findIndex(
        (item) =>
          item.basePlanId == basePlanId &&
          item.basePromotionOptimisationId == basePromotionOptimisationId
      );

      if (scenarioIndex < 0) {
        this.reviewForms = [...this.reviewForms, { ...formData }];
      } else this.reviewForms[scenarioIndex] = { ...formData };
    },

    onReviewScenarioChange(data) {
      const { basePlanId, basePromotionOptimisationId } = data;
      this.reviewScenarios = this.reviewScenarios.map((item) => {
        if (
          item.basePlanId === basePlanId &&
          item.basePromotionOptimisationId === basePromotionOptimisationId
        )
          return { ...data };

        return item;
      });
    },

    async onPlanChange(keyAccount, planId) {
      this.fetchingTables.push(keyAccount.keyAccountCode);
      try {
        const promoId = keyAccount.plan.basePromotionOptimisationId;
        const baseScenarioData = await this.fetchScenarioDetails(
          promoId,
          planId
        );

        this.reviewForms.map((item) => {
          if (item.basePromotionOptimisationId === promoId)
            item.basePlanId = planId;

          return item;
        });

        this.reviewScenarios = this.reviewScenarios.filter(
          (item) =>
            item.basePlanId !== planId &&
            item.basePromotionOptimisationId !== promoId
        );

        await this.fetchComparisonData();

        keyAccount.plan.basePlanId = planId;
        keyAccount.plan.promotionOptimisationTypes = baseScenarioData;
      } finally {
        this.fetchingTables = this.fetchingTables.filter(
          (item) => item !== keyAccount.keyAccountCode
        );
      }
    },

    async onReviewAll() {
      this.reviewingTables = this.reviewForms.map(
        (item) => item.basePromotionOptimisationId
      );

      this.reviewScenarios = await this.getReviewData();

      await new Promise((resolve) => {
        this.reviewScenarios.forEach((item) => {
          item.finYear = this.finYear;
          item.planName = item.defaultPlanName;
        });

        resolve();
      });

      await this.fetchComparisonData();

      this.reviewingTables = [];
    },

    async onReviewScenario(poId, value) {
      try {
        this.reviewingTables.push(poId);

        const { basePlanId, basePromotionOptimisationId } = value;

        this.onReviewFormChange(value);

        //map new scenario

        const newScenarios = await this.getReviewData();
        const newScenario = this.getDataFromList(
          newScenarios,
          basePlanId,
          basePromotionOptimisationId
        );

        this.reviewScenarios = this.mapScenario(
          {
            ...newScenario,
            finYear: this.finYear,
            planName: newScenario.defaultPlanName,
          },
          this.reviewScenarios
        );

        await this.fetchComparisonData();
      } finally {
        this.reviewingTables = this.reviewingTables.filter(
          (item) => item !== poId
        );
      }
    },

    getDataFromList(list, planId, poId) {
      if (!list.length) return;
      return list.find(
        (item) =>
          item.basePlanId === planId &&
          item.basePromotionOptimisationId === poId
      );
    },

    mapScenario(newScenario, listScenario) {
      const { basePlanId, basePromotionOptimisationId } = newScenario;
      const newScenarioIndex = listScenario.findIndex(
        (item) =>
          item.basePlanId === basePlanId &&
          item.basePromotionOptimisationId === basePromotionOptimisationId
      );

      if (newScenarioIndex < 0) listScenario.push(newScenario);
      else listScenario[newScenarioIndex] = newScenario;

      return listScenario;
    },
  },
};
</script>

<style lang="scss">
.scenario-builder {
  .list {
    &__filters,
    &__content {
      .ant-collapse {
        &-header {
          font-weight: 500;
          padding-left: 50px;
          width: fit-content;
        }

        &-borderless {
          background-color: transparent;
        }

        &-item {
          border-bottom: none;
          &-disabled {
            .ant-collapse-arrow {
              border-color: #d9d9d9;
            }
          }
        }

        &-arrow {
          border: 1px #000 solid;
          padding: 2px;
        }
      }
    }
    &__footer {
      position: absolute;
      background: white;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
      padding: 15px 40px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  &__wrapper {
    .scenario-table {
      width: 1450px;
      margin-bottom: 6px;
      padding-top: 50px;
      flex-wrap: nowrap;
    }
  }

  .horizontal-scroll {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .bg-white {
    background-color: white;
  }
}
</style>
