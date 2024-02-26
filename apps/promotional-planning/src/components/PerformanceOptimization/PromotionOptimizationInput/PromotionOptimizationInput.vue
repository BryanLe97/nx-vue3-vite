<template>
  <a-card>
    <a-row :gutter="[16, 0]" type="flex" justify="space-between">
      <a-col>
        <h6 class="h6">Promotion Optimisation</h6>
      </a-col>
      <a-col>
        <template v-if="hasCreateBtn">
          <a-button
            type="primary"
            class="ml-1"
            @click="showConfirmation(false)"
          >
            New Scenario
          </a-button>
          <a-button type="primary" class="ml-1" @click="showConfirmation(true)">
            New Online Only Scenario
          </a-button>
        </template>
      </a-col>
    </a-row>

    <a-row
      class="promotion-optimization-input__container pt-3"
      :gutter="[24, 0]"
    >
      <!-- base version -->
      <a-col :span="13">
        <a-row type="flex" align="middle" :gutter="[4, 0]" class="mb-3">
          <a-col :xs="24" :xl="6">
            <label>Base version</label>
          </a-col>

          <a-col :xs="24" :xl="18">
            <a-row :gutter="[4, 0]" type="flex" align="middle" justify="end">
              <a-col :xs="24" :xl="13">
                <template v-if="editingVersion === BASE">
                  <text-input
                    form-item
                    rules="required"
                    label="Scenario Name"
                    :show-label="false"
                    placeholder="Enter a name"
                    :max-length="100"
                    :value="selectedScenarios[BASE].name"
                    @change="(newVal) => onChangeScenarioName(newVal, BASE)"
                  />
                </template>

                <template v-else>
                  <select-input
                    :data-source="ascListPlan"
                    form-item
                    source="id"
                    source-label="name"
                    :show-label="false"
                    all-in-value
                    :disabled="hasOneScenario"
                    default-active-first-option
                    @change="onChangeBaseVersion"
                  />
                </template>
              </a-col>

              <a-col
                :xs="12"
                :xl="editingVersion === BASE ? 4 : 2"
                class="d-flex justify-content-end"
              >
                <template v-if="editingVersion === BASE">
                  <a-button
                    icon="save"
                    title="Save"
                    @click="onClickSave(BASE)"
                  />
                  <a-button
                    icon="close"
                    title="Cancel"
                    class="ml-1"
                    @click="onClickCancelEdit()"
                  />
                </template>

                <template v-else>
                  <a-button
                    icon="edit"
                    title="Edit"
                    @click="onClickEdit(BASE)"
                  />
                </template>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-spin :spinning="isLoadingBaseData" size="small">
          <a-row>
            <a-col>
              <div ref="base" class="base-version__wrapper">
                <base-version-input
                  :tbl-data="baseData"
                  :uneditable="hasOneScenario"
                  :is-collapsed="isCollapsed"
                  :is-account-group="isAccountGroup"
                  @change="baseData = $event"
                  @scrollX="onScrollBaseVersion"
                  @onPaste="replaceBaseData"
                />
              </div>
            </a-col>
          </a-row>
        </a-spin>
      </a-col>

      <!-- comparison version -->
      <a-col :span="11">
        <a-row
          type="flex"
          align="middle"
          :gutter="[4, 0]"
          class="mb-3"
          style="width: calc(100% - 170px)"
        >
          <a-col :xs="24" :xl="6">
            <label>Comparison version</label>
          </a-col>

          <a-col :xs="24" :xl="18">
            <a-row :gutter="[4, 0]" type="flex" align="middle" justify="end">
              <a-col :xs="24" :xl="16">
                <template v-if="editingVersion === COMPARISON">
                  <text-input
                    form-item
                    label="Scenario Name"
                    :show-label="false"
                    rules="required"
                    placeholder="Enter a name"
                    :max-length="100"
                    :value="selectedScenarios[COMPARISON].name"
                    @change="
                      (newVal) => onChangeScenarioName(newVal, COMPARISON)
                    "
                  />
                </template>

                <template v-else>
                  <select-input
                    :data-source="listPlan"
                    form-item
                    source="id"
                    source-label="name"
                    :show-label="false"
                    all-in-value
                    :disabled="hasOneScenario"
                    default-active-first-option
                    @change="onChangeComparisonVersion"
                  />
                </template>
              </a-col>

              <a-col :xs="12" :xl="5" class="d-flex justify-content-end">
                <template v-if="editingVersion === COMPARISON">
                  <a-button
                    class="comparison-button"
                    icon="save"
                    title="Save"
                    @click="onClickSave(COMPARISON)"
                  ></a-button>
                  <a-button
                    class="comparison-button ml-1"
                    icon="close"
                    title="Cancel"
                    @click="onClickCancelEdit()"
                  />
                </template>

                <template v-else>
                  <a-button
                    class="comparison-button"
                    icon="edit"
                    title="Edit"
                    @click="onClickEdit(COMPARISON)"
                  ></a-button>
                  <a-tooltip placement="top" title="Delete Scenario">
                    <a-button
                      class="comparison-button ml-1"
                      icon="delete"
                      title="Delete"
                      :disabled="hasOneScenario"
                      @click="onClickDelete(COMPARISON)"
                    ></a-button>
                  </a-tooltip>
                </template>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-spin :spinning="isLoadingCompData" size="small">
          <a-row>
            <a-col>
              <div ref="comparison" class="comparison-version__wrapper">
                <comparison-version-input
                  :tbl-data="comparisonData"
                  :is-collapsed="isCollapsed"
                  :is-account-group="isAccountGroup"
                  @change="comparisonData = $event"
                  @scrollX="onScrollComparisonVersion"
                  @onPaste="replaceCompData"
                />
              </div>
            </a-col>
          </a-row>
        </a-spin>
      </a-col>
    </a-row>

    <a-row type="flex" justify="end" class="mt-2">
      <a-col>
        <p v-if="!isLoadingCompData">
          <template v-if="metadata.updatedAt">
            Last updated by {{ metadata.updatedBy }} at
            {{ metadata.updatedAt | moment(FORMAT_DATE_TIME_PRIMARY) }}.
          </template>

          <template v-else>Never been edited.</template>
          <br />

          <template v-if="metadata.publishedAt">
            Last published by {{ metadata.publishedBy }} at
            {{ metadata.publishedAt | moment(FORMAT_DATE_TIME_PRIMARY) }}.
          </template>
          <template v-else>Never been published.</template>
        </p>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import isNil from "lodash/isNil";
import cloneDeep from "lodash/cloneDeep";
import EventBus from "@/EventBus";

import {
  ErrorHandlerMixin,
  PayloadHandlerMixin,
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
  FORMAT_DATE_TIME_PRIMARY,
} from "@kraftheinz/common";

import {
  URL_POT,
  URL_POT_OPTIONS,
  URL_POT_PLAN_METADATA,
  URL_PP_DELETE,
} from "@/constants/api-endpoints";

const BaseVersionInput = () => import("./BaseVersionInput.vue");
const ComparisonVersionInput = () => import("./ComparisonVersionInput.vue");

const apiUrl = import.meta.env.VITE_API_URL;
const BASE = "base";
const COMPARISON = "comparison";

export default {
  name: "PromotionOptimizationInput",

  mixins: [ErrorHandlerMixin, PayloadHandlerMixin],

  components: {
    BaseVersionInput,
    ComparisonVersionInput,
  },
  inject: ["resourceProps"],

  props: {
    hasCreateBtn: {
      type: Boolean,
      default: true,
    },
    listPlan: {
      type: Array,
      default: null,
    },
    refreshMetadata: {
      type: Boolean,
      default: false,
    },
    isCollapsed: {
      type: Boolean,
      default: true,
    },
    refreshBaseInput: {
      type: Boolean,
      default: false,
    },
    isAccountGroup: {
      type: Boolean,
      default: false,
    },
  },

  provide() {
    return {
      optionsProps: {
        ...this.promoOptionsProps,
      } /** provide the optionsProps to use in the ColorfulEditableTable component */,
      parametersProps: { ...this.parametersProps },
      selectedScenarioIds: this.selectedScenarios,
    };
  },

  data() {
    const promotionId = this.$route.params.id;
    const promoOptionsProps = this.resourceProps.find(
      (item) =>
        item.resourceName === "promotion-planning.promo-optis.promo-options"
    );

    const planProps = this.resourceProps.find(
      (item) => item.resourceName === "promotion-planning.common.plans"
    );

    const parametersProps = this.resourceProps.find(
      (item) =>
        item.resourceName === "promotion-planning.promo-optis.parameters"
    );

    const metadata = {
      updatedAt: "",
      updatedBy: "",
      publishedAt: "",
      publishedBy: "",
    };

    return {
      FORMAT_DATE_TIME_PRIMARY,
      BASE,
      COMPARISON,
      promoOptionsProps,
      planProps,
      parametersProps,
      promotionId,
      metadata,
      baseData: [],
      comparisonData: [],
      urlOptions: URL_POT_OPTIONS,
      isLoadingBaseData: false,
      isLoadingCompData: false,
      editingVersion: null,
      newScenarioNames: {
        [BASE]: "",
        [COMPARISON]: "",
      },
      selectedScenarios: {
        [BASE]: null,
        [COMPARISON]: null,
      },
    };
  },

  computed: {
    /** KHPOT-38: After the "scenario 1" has been created and it's the unique scenario of the current viewing PPG:
     * + disable the base version dropdown and input,
     * + only enable the user to input the comparison version,
     * + disable the parameters dropdown  */
    hasOneScenario() {
      return this.listPlan && this.listPlan.length === 1;
    },

    ascListPlan() {
      if (this.listPlan && this.listPlan.length > 0) {
        const copyListPlan = cloneDeep(this.listPlan);
        return copyListPlan.sort(function (a, b) {
          return a.id - b.id;
        });
      }

      return this.listPlan;
    },
  },

  watch: {
    refreshMetadata(newVal) {
      if (newVal && this.selectedScenarios[COMPARISON]) {
        const compScenarioId = this.selectedScenarios[COMPARISON].id;
        this.fetchPlanMetadata(compScenarioId);
      }
    },

    async refreshBaseInput(newVal) {
      if (!newVal) return;

      const scenarioId = this.selectedScenarios[BASE].id;
      this.isLoadingBaseData = true;
      this.baseData = await this.fetchScenarioDetails(scenarioId);
      this.$emit("update:refreshBaseInput", false);
      this.isLoadingBaseData = false;
    },
  },

  methods: {
    /**
     * onScrollBaseVersion- the comparison version table will be scroll sychronously with the base version table
     */
    onScrollBaseVersion(scrollVal) {
      const ele = this.$refs.comparison;
      const tbl = ele.querySelector("#underlying-table");
      tbl.scrollLeft = scrollVal;
    },

    /**
     * onScrollComparisonVersion - the base version table will be scroll sychronously with the comparison version table
     */
    onScrollComparisonVersion(scrollVal) {
      const ele = this.$refs.base;
      const tbl = ele.querySelector("#underlying-table");
      tbl.scrollLeft = scrollVal;
    },

    async onChangeBaseVersion(val) {
      this.selectedScenarios[BASE] = val;
      const scenarioId = val ? val.id : null;

      this.$emit("filterPO", { planId: scenarioId });
      this.isLoadingBaseData = true;
      this.baseData = await this.fetchScenarioDetails(scenarioId);
      this.isLoadingBaseData = false;
    },

    async onChangeComparisonVersion(val) {
      this.selectedScenarios[COMPARISON] = val;
      const scenarioId = val ? val.id : null;

      this.$emit("filterPO", { comparison: scenarioId });
      this.isLoadingCompData = true;
      this.comparisonData = await this.fetchScenarioDetails(scenarioId);
      this.isLoadingCompData = false;
      this.fetchPlanMetadata(scenarioId);
    },

    async fetchScenarioDetails(scenarioId) {
      const promotionId = +this.$route.params.id;

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

    /**
     * replaceBaseData - Replace the data of pasted cells with copied data to the base version table
     */
    replaceBaseData(pastedData) {
      pastedData.forEach((item) => {
        const { index, ...otherProps } = item;
        const currentData = this.baseData[index];
        const newData = { ...currentData, ...otherProps };

        this.$set(this.baseData, index, newData);
      });
    },

    /**
     * replaceCompData - Replace the data of pasted cells with copied data to the comparison version table
     */
    replaceCompData(pastedData) {
      const data = new Promise((resolve) => {
        resolve(
          pastedData.forEach((item) => {
            const { index, ...otherProps } = item;
            const currentData = this.comparisonData[index];
            const newData = { ...currentData, ...otherProps };
            this.$set(this.comparisonData, index, newData);
          })
        );
      });
      data.then(() => {
        this.getColumnIndexWhenPasted(pastedData);
      });
    },

    getColumnIndexWhenPasted(pastedData) {
      let arrIndex = [];
      pastedData.forEach((item) => {
        arrIndex.push(item["index"]);
      });
      arrIndex = [...new Set(arrIndex)];
      EventBus.$emit("pasted-data-into-table", arrIndex);
    },

    showConfirmation(isOnline) {
      this.$confirm({
        title: "Do you want to create a new scenario?",
        content:
          "You are about to create a new scenario in the database, this operation can not be undone. Are you sure you want to create a new scenario?",
        onOk: () => this.createScenario(isOnline),
      });
    },

    async createScenario(isOnline) {
      const promotionId = this.$route.params.id;
      const apiEndpoint = apiUrl + this.urlOptions;
      const queryParams = { promotionId: +promotionId, isOnline: isOnline };
      if (isNil(promotionId)) {
        this.displayErrorNotification();
        return;
      }

      try {
        const { data } = await this.axios.post(apiEndpoint, queryParams);

        if (!data || !data.planItem) return;

        const newCompScenario = data.planItem.id;

        /** emit a signal to the parent component to refresh the list of plan */
        this.$emit("has-new-scenario", {
          comparison: newCompScenario,
        });

        this.isLoadingCompData = true;
        this.comparisonData = await this.fetchScenarioDetails(newCompScenario);
        this.isLoadingCompData = false;

        this.$notification.success({ message: CREATE_SUCCESS });
      } catch (error) {
        this.displayErrorNotification(error);
      }
    },

    async fetchPlanMetadata(planId) {
      const metadataEndpoint = apiUrl + URL_POT_PLAN_METADATA;
      const payload = {
        params: {
          planId,
        },
      };

      try {
        const { data } = await this.axios.get(metadataEndpoint, payload);

        if (!data) return;

        this.metadata = { ...this.metadata, ...data };
      } catch (error) {
        this.displayErrorNotification(error);
      } finally {
        this.$emit("update:refreshMetadata", false);
      }
    },

    onChangeScenarioName(newVal, version) {
      this.newScenarioNames[version] = newVal;
    },

    onClickCancelEdit() {
      this.editingVersion = null;
    },

    onClickEdit(version) {
      this.editingVersion = version;
      const originalData = this.selectedScenarios[version];
      this.newScenarioNames[version] = originalData.name;
    },

    onClickDelete(version) {
      let scenario = this.selectedScenarios[version];
      this.$confirm({
        title: "Warning",
        content: `Are you sure to delete scenario ${scenario.name}?`,
        onOk: async () => {
          let urlEndPoint = apiUrl + URL_PP_DELETE + scenario.id;
          try {
            const { data } = await this.axios.delete(urlEndPoint, scenario.id);
            if (data) {
              this.$emit("scenario-name-changed");
              this.$notification.success({ message: DELETE_SUCCESS });
            }
          } catch (err) {
            this.displayErrorNotification(err);
          }
        },
      });
    },

    async onClickSave(version) {
      let isChanged;
      let payload = {};

      const originalData = this.selectedScenarios[version];
      const scenarioId = originalData.id;
      const newScenarioName = this.newScenarioNames[version];

      if (!newScenarioName || newScenarioName.trim().length === 0) {
        this.$notification.warning({ message: "Please input a scenario name" });
        return;
      }

      payload["name"] = newScenarioName;
      isChanged = newScenarioName.trim() !== originalData.name.trim();

      /** do not call the api to save if there is no change on the scenario name */
      if (!isChanged) return;

      try {
        const apiEndpoint = apiUrl + URL_POT + `?planId=${scenarioId}`;

        const { data } = await this.axios.put(apiEndpoint, payload);
        if (data && data.id === scenarioId) {
          this.$emit("scenario-name-changed");
          this.$notification.success({ message: UPDATE_SUCCESS });
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.editingVersion = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comparison-button {
  min-width: 32px;
}
</style>
