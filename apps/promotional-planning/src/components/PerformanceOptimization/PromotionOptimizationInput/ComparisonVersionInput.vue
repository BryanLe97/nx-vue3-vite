<template>
  <div class="comparision-version-input__container">
    <colorful-editable-table
      tbl-width="100%"
      :tbl-columns="tblColumns"
      :tbl-rows="tblConfig"
      :tbl-data="tblData"
      tbl-name="comparison"
      :gap-x="0"
      :gap-y="1"
      :sync-collapse="isCollapsed"
      :is-account-group="isAccountGroup"
      :is-show-delta-field="true"
      allow-clear-header
      @change="onChange"
      @scroll="onScroll"
      @pasted="onPaste"
    />
  </div>
</template>

<script>
import {
  PO_COMPARISON_TBL_CONFIG,
  PO_COMPARISON_TBL_COLUMNS,
} from "@/constants/promotion-optimisation";

const ColorfulEditableTable = () =>
  import("@/components/ColorfulEditableTable/ColorfulEditableTable.vue");

export default {
  components: {
    ColorfulEditableTable,
  },

  props: {
    tblData: {
      type: Array,
      default: null,
    },
    isCollapsed: {
      type: Boolean,
      default: true,
    },
    isAccountGroup: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tblColumns: PO_COMPARISON_TBL_COLUMNS,
    };
  },

  computed: {
    tblConfig() {
      return this.isAccountGroup
        ? this.insertFieldForDistributor()
        : PO_COMPARISON_TBL_CONFIG;
    },
  },

  methods: {
    insertFieldForDistributor() {
      const marginSupportFields = [
        {
          key: "margin-support-o-i",
          dataIndex: "marginSupportOIStore",
          label: "Margin Support OI Store",
          numberFormat: "$0,0.0000",
          suffixInput: "$",
          validationRules: "number|decimal:6,5",
        },
        {
          key: "margin-support-o-i-d-c",
          dataIndex: "marginSupportOI",
          label: "Margin Support OI DC",
          numberFormat: "$0,0.0000",
          suffixInput: "$",
          validationRules: "number|decimal:6,5",
        },
      ];

      const indexMarginSupportIO = PO_COMPARISON_TBL_CONFIG.findIndex(
        (item) => item.key === "margin-support-o-i"
      );

      let clonedTblConfig = [...PO_COMPARISON_TBL_CONFIG];

      if (indexMarginSupportIO > -1) {
        clonedTblConfig.splice(indexMarginSupportIO, 1, ...marginSupportFields);
      }

      return clonedTblConfig;
    },

    onChange(val) {
      this.$emit("change", val);
    },

    onScroll(val) {
      this.$emit("scrollX", val);
    },

    /**
     * Replace the data of pasted cells with copied data
     */
    onPaste(pastedData) {
      this.$emit("onPaste", pastedData);
    },
  },
};
</script>
