<template>
  <div class="pot-parameters-container">
    <a-spin :spinning="isParametersLoading" size="small">
      <new-parameters
        name="parameters"
        :short-code-key-account="isAccountGroup"
        :list-plan="dataSourcePlan"
        :list-date-range="listDateRange"
        :default-filters="parameterFilters[0]"
        :parameters-values="dataParametersByKeyAccount"
        :selected-plan="composedFilters.parameters.planId"
        :is-show-cds-fee="isShowCdsFee"
        :is-show-fssi="isShowFssi"
        @changeFilter="onChangeFilter('parameters', $event)"
        @overwriteParameter="
          storeValue('parametersProps', $event.key, $event.value)
        "
        @changeDateRange="onChangeDateRange('parameters', $event)"
      />
    </a-spin>
  </div>
</template>

<script>
import { ErrorHandlerMixin, PayloadHandlerMixin } from "@kraftheinz/common";
import NewParameters from "./NewParameter.vue";
import {
  KEY_ACCOUNT_CODE_COUNTDOWN,
  KEY_ACCOUNT_CODE_4SQUARE_SI,
} from "@/constants/others";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "POParameters",

  components: {
    NewParameters,
  },

  inject: ["resourceProps"],
  mixins: [ErrorHandlerMixin, PayloadHandlerMixin],

  props: {
    isAccountGroup: {
      type: Boolean,
      default: false,
    },
    dcId: {
      type: [String, Number],
      default: null,
    },
    externalFilters: {
      type: Object,
      default: null,
    },
  },

  data() {
    const dateRangeProps = this.resourceProps.find(
      (item) =>
        item.resourceName === "promotion-planning.common.date-range-product"
    );
    const parametersProps = this.resourceProps.find(
      (item) =>
        item.resourceName === "promotion-planning.promo-optis.parameters"
    );
    const planProps = this.resourceProps.find(
      (item) => item.resourceName === "promotion-planning.common.plans"
    );

    const promotionId = +this.$route.params.id;

    const composedFilters = {
      parameters: {
        promotionId: promotionId,
        store: "",
        isLargeOrder: "",
        isPalletOrder: "",
        planId: null,
      }
    };

    const defaultDTSFilters = {
      store: "Store",
      isLargeOrder: "false",
      isPalletOrder: "false",
    };

    const defaultDCFilters = {
      store: "DC",
      isLargeOrder: "true",
      isPalletOrder: "true",
    };

    return {
      apiUrl,
      planProps,
      parametersProps,
      dateRangeProps,
      promotionId,
      composedFilters,
      listParameters: [],
      dataSourcePlan: [],
      allDTSParameters: [],
      allDCParameters: [],
      allParameters: [],
      listDateRange: [],
      dataParametersByKeyAccount: {},
      dataDCParametersByKeyAccount: {},
      isParametersLoading: false,
      isChildParametersLoading: false,
      keyAccountCode: [KEY_ACCOUNT_CODE_COUNTDOWN, KEY_ACCOUNT_CODE_4SQUARE_SI],
      defaultDTSFilters,
      defaultDCFilters,
      isShowCdsFee: true,
      isShowFssi: true,
    };
  },

  computed: {
    parameterFilters() {
      if (this.isAccountGroup) {
        return [this.defaultDTSFilters, this.defaultDCFilters];
      }
      return [this.defaultFilters];
    },

    listPlan() {
      return this.planProps.crud.getList() ?? [];
    },

    isLeafStoreGM() {
      return this.externalFilters.isLeafStoreGM;
    },

    isCheckValueByKeyAccount() {
      return this.keyAccountCode.includes(this.externalFilters.keyAccountCode);
    },

    defaultFilters() {
      return {
        store: "DC",
        isLargeOrder: this.isCheckValueByKeyAccount ? "true" : "false",
        isPalletOrder: this.isCheckValueByKeyAccount ? "true" : "false",
      };
    },
  },

  watch: {
    externalFilters(newValue) {
      this.isShowCdsFee = (newValue.cluster == '1111' && newValue.category == '07') || false; // show CdsFee if cluster and category both are Beverages
      this.isShowFssi = (newValue.keyAccountCode == '3510' || newValue.keyAccountCode == '3520') || false // show fssi if cluster and category both are Beverages
      if (
        newValue &&
        newValue.promotionId &&
        newValue.planId &&
        newValue.comparison
      ) {
        this.dataSourcePlan = this.generateDataSourcePlan(newValue);
      }
    },
  },

  created() {
    this.setDefaultValuesToComposedFilters();
  },

  methods: {
    /**
     * setDefaultValuesToComposedFilters(): update the composedFilters with default value of the filters
     */
    setDefaultValuesToComposedFilters() {
      Object.assign(this.composedFilters.parameters, this.parameterFilters[0]);

      if (this.parameterFilters.length === 2) {
        Object.assign(
          this.parameterFilters[1]
        );
      }
    },

    async fetchListDateRange() {
      await this.dateRangeProps.crud.deleteFilter("IsInactive");
      await this.dateRangeProps.crud.deletePagination();
      await this.dateRangeProps.crud.setQueryString(
        "promotionOptimisationId",
        this.promotionId
      );
      await this.dateRangeProps.crud.fetchList();
      this.listDateRange = this.dateRangeProps.crud.getList();
    },

    async onChangeFilter(container, filterData) {
      if (!container || !filterData) return;

      let broadcastData = {};
      /** to update the composedFilters with new filter data*/
      this.composedFilters[container] = {
        ...this.composedFilters[container],
        ...filterData,
      };

      const latestFilters = this.composedFilters[container];
      await this.refreshDataParameters(container, latestFilters);

      broadcastData[container] = {
        ...this.composedFilters[container],
        ...filterData,
      };

      this.$emit("changeParametersFilters", broadcastData);
    },

    async onChangeDateRange(key, productId) {
      this.isParametersLoading = true;
      this.composedFilters[key].isSelectedDateRange = true
      const payload = {
        ...this.composedFilters[key],
        productId,
      };
      await this.onChangeFilter(key, payload);
    },

    async refreshDataParameters(container, latestFilters) {
      let resParametersByKeyAccount;
      let dataKey;

      if (!latestFilters || !latestFilters.promotionId || !latestFilters.planId)
        return;

      this.isParametersLoading = true;

      await this.fetchListDateRange();

      resParametersByKeyAccount = await this.fetchParametersByKeyAccount(
        this.parametersProps,
        latestFilters,
        this.promotionId
      );

      dataKey = resParametersByKeyAccount.filter(
        (objData) => objData.planId == latestFilters.planId
      );

      if (dataKey)
        this.composedFilters["parameters"] = {
          ...this.composedFilters["parameters"],
          productId: dataKey[0].productId,
        };

      this.dataParametersByKeyAccount = dataKey[0];

      this.storeParameters(
        "parametersProps",
        this.dataParametersByKeyAccount
      );

      this.isParametersLoading = false;
    },

    storeParameters(resourcePropsName, parametersData) {
      if (
        resourcePropsName !== "parametersProps"
      )
        return;

      const {
        tradingTerms,
        cdsCode,
        cdsFee,
        directVol,
        cogs,
        price,
        planId,
        productId,
      } = parametersData;

      const fieldsForSaving = {
        tradingTerms,
        cdsCode,
        cdsFee,
        directVol,
        cogs,
        price,
        planId,
        productId,
      };

      Object.entries(fieldsForSaving).forEach(([key, value]) => {
        this.storeValue(resourcePropsName, key, value);
      });
    },

    storeValue(resourcePropsName, itemKey, itemValue) {
      this.dataParametersByKeyAccount = {
        ...this.dataParametersByKeyAccount,
        [itemKey]: itemValue,
      };

      this[resourcePropsName].crud.updateEntity("editForm", {
        resourceKey: itemKey,
        value: itemValue,
      });
    },

    async fetchParametersByKeyAccount(
      resourceProps,
      parameterFilters,
      promotionId
    ) {
      try {
        const payload = {
          promotionId,
          isLeafStoreGM: this.isLeafStoreGM,
          planId: parameterFilters.planId,
          isLargeOrder: parameterFilters.isLargeOrder,
          isPalletOrder: parameterFilters.isPalletOrder,
          store: parameterFilters.store,
          productId: parameterFilters.productId,
          isSelectedDateRange: parameterFilters.isSelectedDateRange,
        };

        const query = this.generateQueryString(payload);
        resourceProps.crud.deleteFilter("IsInactive");
        await resourceProps.crud.fetchList(null, true, true, query, true);
        return resourceProps.crud.getList();
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    /** KHPOT-39:
     *  Options of the Parameter dropdown includes the selected scenario of base version and selected scenario of comparison version
     * */
    generateDataSourcePlan(filters) {
      if (!this.listPlan || this.listPlan.length === 0) return [];

      const dataSourcePlan = [];

      const baseVersionId = filters.planId;
      const comparisonVersionId = filters.comparison;

      const baseVersionDetails = this.listPlan.find(
        (item) => item.id === baseVersionId
      );

      if (baseVersionDetails) {
        dataSourcePlan.push(baseVersionDetails);
      }

      if (baseVersionId !== comparisonVersionId) {
        const comparisonVersionDetails = this.listPlan.find(
          (item) => item.id === comparisonVersionId
        );

        if (comparisonVersionDetails) {
          dataSourcePlan.push(comparisonVersionDetails);
        }
      }

      return dataSourcePlan;
    },
  },
};
</script>
