<template>
  <a-row :gutter="[16, 32]" type="flex" justify="end">
    <a-col :span="8">
      <select-input
        :data-source="plans"
        source="planId"
        source-label="planName"
        :value="planId"
        @change="onPlanChange"
      />
    </a-col>
    <a-col :span="24">
      <a-spin :spinning="isFetching">
        <colorful-editable-table
          :tbl-columns="baseScenarioTblColumns"
          :tbl-rows="baseScenarioTblConfig"
          :tbl-data="tblData"
          :po-id="poId"
          :plan-id="planId"
          :uneditable="true"
          :disable-header="true"
          :gap-x="1"
        />
      </a-spin>
    </a-col>
  </a-row>
</template>

<script>
import { ColorfulEditableTable } from "@/components";
import {
  PO_TBL_CONFIG,
  PO_TBL_COLUMNS,
} from "@/constants/promotion-optimisation";

import { cloneDeep, omit } from "lodash";

export default {
  name: "BaseScenario",

  components: { ColorfulEditableTable },

  props: {
    tblData: {
      type: Array,
      default: null,
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
  },

  data() {
    return {
      baseScenarioTblColumns: [],
    };
  },

  created() {
    this.baseScenarioTblColumns = cloneDeep(
      PO_TBL_COLUMNS.reduce((cols, col) => {
        if (col.type !== "criteria-group") cols.push(col);
        return cols;
      }, [])
    );

    this.baseScenarioTblConfig = PO_TBL_CONFIG.map((item) => {
      if (["scanBaseDeal", "scanTopUpDeal"].includes(item.dataIndex))
        item.numberFormat = "$0,0.00";
      return omit(item, "criteriaGroup");
    });
  },

  methods: {
    onPlanChange(value) {
      if (!value) return;
      this.$emit("change-plan", value);
    },
  },
};
</script>

<style></style>
