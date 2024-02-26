<template>
  <a-tooltip
    :visible="hasError"
    overlay-class-name="error-message"
    :get-popup-container="(trigger) => trigger.parentNode"
    :auto-adjust-overflow="false"
    placement="topLeft"
    :title="scenarioDetails.message"
  >
    <a-row v-if="dataSource" :gutter="[16, 0]" type="flex" justify="end">
      <a-col :span="24">
        <div class="d-flex justify-content-between align-items-start">
          <text-input
            form-item
            rules="required"
            :disabled="isFetching"
            :custom-messages="{ required: 'Scenario Name is required.' }"
            :custom-name="`${planId}-planName`"
            :value="scenarioDetails.planName"
            style="width: 200px"
            @change="onChange($event, 'planName')"
          />
          <a-space align="center">
            <span class="mr-2">Year</span>

            <select-input
              :show-label="false"
              :disabled="isFetching"
              :data-source="years"
              source="year"
              :value="scenarioDetails.finYear"
              style="width: 150px"
              @change="onChange($event, 'finYear')"
            />
          </a-space>
        </div>
      </a-col>
      <a-col :span="24">
        <a-spin :spinning="isFetching">
          <colorful-editable-table
            :tbl-columns="tblCols"
            :tbl-rows="tblConfig"
            :tbl-data="scenarioDetails.promotionOptimisationTypes"
            :po-id="poId"
            :plan-id="planId"
            :tbl-name="`${poId}comparison`"
            :gap-x="0"
            :gap-y="1"
            @change="onChange"
            @pasted="replaceData"
          />
        </a-spin>
      </a-col>
    </a-row>
  </a-tooltip>
</template>

<script>
import { ColorfulEditableTable } from "@/components";
import {
  PO_COMPARISON_TBL_CONFIG,
  PO_COMPARISON_TBL_COLUMNS,
} from "@/constants/promotion-optimisation";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "ReviewScenario",

  components: { ColorfulEditableTable },

  inject: ["crud", "fetchComparisonData"],

  props: {
    dataSource: {
      type: Object,
      default: undefined,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    plans: {
      type: Array,
      default: null,
    },
    poId: {
      type: [String, Number],
      default: null,
    },
    planId: {
      type: [String, Number],
      default: null,
    },
    finYear: {
      type: [String, Number],
      default: null,
    },
    years: {
      type: Array,
      default: null,
    },
  },

  data() {
    const tblConfig = cloneDeep(PO_COMPARISON_TBL_CONFIG);
    const tblCols = cloneDeep(PO_COMPARISON_TBL_COLUMNS);

    return {
      tblConfig,
      tblCols,
    };
  },

  computed: {
    scenarioDetails() {
      return { ...this.dataSource };
    },

    hasError() {
      return this.dataSource && "isSuccess" in this.dataSource
        ? !this.dataSource.isSuccess
        : false;
    },
  },

  mounted() {
    this.tblConfig = this.tblConfig.map((item) => {
      if (["scanBaseDeal", "scanTopUpDeal"].includes(item.dataIndex))
        item.numberFormat = "$0,0.00";
      return item;
    });
  },

  methods: {
    onChange(data, key) {
      this.scenarioDetails.isSuccess = true;
      if (key) this.scenarioDetails[key] = data;
      else if (!key && data.length)
        this.scenarioDetails.promotionOptimisationTypes = data;

      this.$emit("change", this.scenarioDetails);

      if (key === "finYear") {
        this.fetchComparisonData(this.poId);
      }
    },

    replaceData(pastedData) {
      const newPromotionOptimisationTypes = [
        ...this.scenarioDetails.promotionOptimisationTypes,
      ];
      pastedData.forEach((item) => {
        const { index, ...otherProps } = item;
        const currentData = newPromotionOptimisationTypes[index];
        const newData = { ...currentData, ...otherProps };

        newPromotionOptimisationTypes[index] = newData;
      });

      this.scenarioDetails.promotionOptimisationTypes = [
        ...newPromotionOptimisationTypes,
      ];

      this.$emit("change", this.scenarioDetails);
    },
  },
};
</script>

<style lang="scss">
.error-message {
  .ant-tooltip {
    &-inner,
    &-arrow::before {
      background-color: rgba(245, 34, 45, 0.85);
      color: white;
    }

    &-inner {
      width: fit-content;
      white-space: nowrap;
    }
  }
}
</style>
