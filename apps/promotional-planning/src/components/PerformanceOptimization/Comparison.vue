<template>
  <div class="comparison__container">
    <a-card>
      <a-row type="flex" align="middle">
        <a-col :span="24">
          <label class="h6 neutral-10--text">P&L Comparison $ (000s)</label>
        </a-col>
      </a-row>

      <a-row :gutter="24" class="mt-3">
        <a-col :span="24">
          <a-spin :spinning="isLoading" size="small">
            <a-row>
              <a-col>
                <a-table
                  bordered
                  :data-source="dataSourceDefault"
                  :pagination="false"
                  class="comparison__tbl"
                >
                  <a-table-column key="code" data-index="code">
                    <span slot="title" class="h7 neutral-10--text">
                      <select-input
                        size="small"
                        source="id"
                        source-label="name"
                        :data-source="resourcePlan"
                        default-active-first-option
                        :value="filterDatas.planId"
                        :disabled="true"
                      />
                    </span>
                    <template slot-scope="code, data">
                      <select-input
                        size="small"
                        source="code"
                        source-label="name"
                        :value="code"
                        default-active-first-option
                        :data-source="resourceMetrix"
                        @change="onChangeCredential($event, data)"
                      />
                    </template>
                  </a-table-column>
                  <a-table-column
                    key="combinedValue"
                    data-index="combinedValue"
                    width="50%"
                  >
                    <span slot="title">
                      <select-input
                        size="small"
                        source="id"
                        source-label="name"
                        :data-source="resourcePlan"
                        default-active-first-option
                        :value="filterDatas.comparison"
                        :disabled="true"
                      />
                    </span>
                  </a-table-column>
                </a-table>
              </a-col>
            </a-row>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { ErrorHandlerMixin, PayloadHandlerMixin } from "@kraftheinz/common";
import { PromoUtils } from "@/utils";
import { URL_POT_COMPARISON, URL_POT_METRIX } from "@/constants/api-endpoints";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "Comparison",

  mixins: [ErrorHandlerMixin, PayloadHandlerMixin, PromoUtils],

  props: {
    filterDatas: {
      type: Object,
      default: null,
    },
    resourcePlan: {
      type: Array,
      default: () => [],
    },
    refreshPLComparison: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dataSourceDefault: [
        {
          key: "0",
          code: "AvgPrice",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
        {
          key: "1",
          code: "ScanUnit",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
        {
          key: "2",
          code: "Nsv",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
        {
          key: "3",
          code: "Cma",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
        {
          key: "4",
          code: "Rsv",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
        {
          key: "5",
          code: "ReGm",
          subTotal: "0",
          divideTotal: "0",
          combinedValue: "0",
        },
      ],
      comparisonResult: [],
      resourceMetrix: [],
      isLoading: false,
    };
  },

  computed: {
    params() {
      return this.$route.params;
    },
  },

  watch: {
    filterDatas(newValue) {
      if (
        newValue &&
        newValue.promotionId &&
        newValue.comparison &&
        newValue.planId &&
        newValue.parameters
      ) {
        this.fetchComparisonResult(newValue);
      }
    },

    async refreshPLComparison(newVal) {
      if (!newVal) return;

      await this.fetchComparisonResult(this.filterDatas);
      this.$emit("update:refreshPLComparison", true);
    },
  },
  mounted() {
    this.getMetrix();
  },

  methods: {
    onChangeCredential(code, data) {
      const foundVal = this.comparisonResult.find((val) => val.code == code);

      if (foundVal) {
        const changedItem = this.dataSourceDefault.find(
          (val) => val.key == data.key
        );
        changedItem.code = code;
        changedItem.combinedValue = this.formatResult(
          foundVal.subTotal,
          foundVal.divideTotal
        );
      } else {
        this.$notification.error({
          message: "Something went wrong, please try again later.",
        });
      }
    },

    getMetrix() {
      const metrixEndpoint = apiUrl + URL_POT_METRIX;
      this.axios.get(metrixEndpoint).then((res) => {
        let { data: values } = res;
        this.resourceMetrix = values.results;
      });
    },

    async fetchComparisonResult(filterValues) {
      let store;
      let isLargeOrder;
      let isPalletOrder;
      let productId;

      const {
        comparison,
        planId,
        promotionId,
        isLeafStoreGM,
        parameters,
      } = filterValues;

      if (parameters) {
        store = parameters.store;
        isLargeOrder = parameters.isLargeOrder;
        isPalletOrder = parameters.isPalletOrder;
        productId = parameters.productId;
      }

      const params = {
        promotionId,
        planId,
        store,
        isLargeOrder,
        isPalletOrder,
        isLeafStoreGM,
        planDefaultId: comparison,
        productId,
      };

      try {
        this.isLoading = true;

        const queryString = this.generateQueryString(params);
        const apiEndpoint = apiUrl + URL_POT_COMPARISON + "?" + queryString;

        const res = await this.axios.get(apiEndpoint);

        if (res && res.data) {
          this.comparisonResult = res.data;
          this.mapData();
        }
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * mapData: create a combination of (subTotal, divideTotal) to display on the table.
     * be noted that the api returns 9 items, but the p&l comparison table has only 6 rows for displaying data.
     */
    mapData() {
      let objResult = {};
      const finalResult = [];

      /** combine subTotal with divideTotal into combinedValue with the corresponding formats, then store in an object.
       * the code will be used to name the property of that object.
       */
      this.comparisonResult.forEach((record) => {
        const combinedValue = this.formatResult(
          record.subTotal,
          record.divideTotal
        );
        record = { ...record, combinedValue };
        const key = record.code;

        objResult[key] = record;
      });

      /** replace the dataSourceDefault with the new values */
      this.dataSourceDefault.forEach((item) => {
        const key = item.code;
        const newValue = objResult[key];
        item = { ...item, ...newValue };
        finalResult.push(item);
      });

      this.dataSourceDefault = finalResult;
    },

    formatResult(subTotal, divideTotal) {
      subTotal > 0
        ? (subTotal = `+${this.formatCurrency(subTotal)}`)
        : (subTotal = `(${this.formatCurrency(Math.abs(subTotal))})`);
      divideTotal > 0
        ? (divideTotal = `+${divideTotal.toFixed(1)}%`)
        : (divideTotal = `(${Math.abs(divideTotal.toFixed(1))}%)`);
      return subTotal + " , " + divideTotal;
    },
  },
};
</script>

<style lang="scss" scoped>
.comparison__container {
  height: 100%;

  .select-row {
    width: 160px !important;
  }

  ::v-deep .ant-table-header-column {
    width: 100%;
  }
}

.comparison__tbl {
  ::v-deep {
    .ant-table-tbody > tr {
      td {
        padding-top: 4px;
        padding-bottom: 4px;
      }

      td:last-child {
        text-align: right;
      }
    }
  }
}
</style>
