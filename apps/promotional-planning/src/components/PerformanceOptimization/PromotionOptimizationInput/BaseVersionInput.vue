<template>
  <div class="base-version-input__container">
    <colorful-editable-table
      tbl-width="100%"
      :tbl-columns="tblColumns"
      :tbl-rows="tblConfig"
      :tbl-data="tblData"
      tbl-name="base"
      :gap-x="2"
      :gap-y="1"
      :uneditable="uneditable"
      :sync-collapse="isCollapsed"
      :is-account-group="isAccountGroup"
      allow-clear-header
      @change="onChange"
      @scroll="onScroll"
      @pasted="onPaste"
    />
  </div>
</template>

<script>
import {
  PO_TBL_CONFIG,
  PO_TBL_COLUMNS,
} from "@/constants/promotion-optimisation";
import { URL_POT_OPTIONS } from "@/constants/api-endpoints";

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
    uneditable: {
      type: Boolean,
      default: false,
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
      tblColumns: PO_TBL_COLUMNS,
      urlOptions: URL_POT_OPTIONS,
    };
  },

  computed: {
    tblConfig() {
      return this.isAccountGroup
        ? this.insertFieldForDistributor()
        : PO_TBL_CONFIG;
    },
  },

  methods: {
    insertFieldForDistributor() {
      const marginSupportFields = [
        {
          key: "margin-support-o-i",
          criteriaGroup: {
            text: "Perm. OI",
            rowSpan: 2,
          },
          criteria: "Margin Support OI$ (DTS)",
          dataIndex: "marginSupportOIStore",
          numberFormat: "$0,0.0000",
          suffixInput: "$",
          validationRules: "number|decimal:6,5",
        },
        {
          key: "margin-support-o-i-d-c",
          criteriaGroup: {
            text: "Perm. OI",
            rowSpan: 0,
          },
          criteria: "Margin Support OI$ (DC)",
          dataIndex: "marginSupportOI",
          numberFormat: "$0,0.0000",
          suffixInput: "$",
          validationRules: "number|decimal:6,5",
        },
      ];

      const indexMarginSupportIO = PO_TBL_CONFIG.findIndex(
        (item) => item.key === "margin-support-o-i"
      );

      let clonedTblConfig = [...PO_TBL_CONFIG];

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

    onPaste(pastedData) {
      this.$emit("onPaste", pastedData);
    },
  },
};
</script>
