<template>
  <div class="list-product">
    <list-composer
      title="Products"
      search-by="Code,Description,SubCategoryDescription,CategoryDescription,RegionDescription,ClusterDescription,StateDescription,KeyAccount"
      ph-search-by="Search by Code, Description, KeyAccount,..."
      :scroll="{ x: 2600 }"
      :actions-width="100"
    >
      <template #create-buttons="{ onClick }">
        <a-button
          v-if="can(permissions.upload)"
          type="default"
          icon="upload"
          @click="uploadFile"
          >Upload</a-button
        >

        <a-button
          v-if="can(permissions.export)"
          type="default"
          class="ml-2"
          icon="download"
          @click="exportFile"
          >Export</a-button
        >

        <a-button
          v-if="can(permissions.add)"
          type="primary"
          class="ml-2"
          @click="onClick"
          >Add Product</a-button
        >
      </template>

      <url-field
        key="Code"
        fixed="left"
        base-url="/promotion-planning/products"
        data-index="code"
        title="PPG Code"
        :sorter="true"
        :width="104"
      />

      <text-field
        key="Description"
        fixed="left"
        data-index="description"
        title="PPG Description"
        :sorter="true"
        :width="184"
      />

      <text-field
        key="ClusterDescription"
        data-index="clusterDescription"
        title="Cluster"
        :sorter="true"
        :width="144"
      />

      <text-field
        key="CategoryDescription"
        data-index="categoryDescription"
        title="Category"
        :sorter="true"
        :width="144"
      />

      <text-field
        key="SubCategoryDescription"
        data-index="subCategoryDescription"
        title="Subcategory"
        :sorter="true"
        :width="120"
      />

      <text-field
        key="RegionDescription"
        data-index="regionDescription"
        title="Region"
        :width="88"
        :sorter="true"
      />

      <text-field
        key="StateDescription"
        data-index="stateDescription"
        title="State"
        :width="88"
        :sorter="true"
      />

      <text-field
        key="KeyAccount"
        data-index="keyAccount"
        title="Key Account"
        :width="150"
        :sorter="true"
      />

      <text-field
        key="Rrp"
        data-index="rrp"
        title="RRP"
        :width="72"
        :parse="parsePrice"
        :sorter="true"
      />

      <text-field
        key="ListPrice"
        data-index="listPrice"
        title="List Price"
        :parse="parsePrice"
        :width="72"
        :sorter="true"
      />

      <text-field
        key="Cogs"
        data-index="cogs"
        title="COGS"
        :parse="parsePrice"
        :width="80"
        :sorter="true"
      />

      <text-field
        key="ShipperQty"
        data-index="shipperQty"
        title="Shipper Qty"
        :width="88"
        :sorter="true"
      />

      <text-field
        key="DcTradingTerms"
        data-index="dcTradingTerms"
        title="Trading Terms"
        :sorter="true"
        :width="88"
      />

      <text-field
        key="DcUllagePerMDA"
        data-index="dcUllagePerMDA"
        title="Ullage/MDA"
        :sorter="true"
        :width="80"
      />

      <text-field
        key="DcRebates"
        data-index="dcRebates"
        title="Rebates (incl. Settlement Disc)"
        :sorter="true"
        :width="200"
      />

      <text-field
        key="leaf"
        data-index="leaf"
        title="Leaf"
        :sorter="true"
        :width="92"
      />

      <text-field
        key="handlingFee"
        data-index="handlingFee"
        title="Handling Fee"
        :sorter="true"
        :width="150"
      />

      <text-field
        key="cdsFee"
        data-index="cdsFee"
        title="CDS Fee"
        :sorter="true"
        :width="92"
      />

      <text-field
        key="dcVolPercent"
        data-index="dcVolPercent"
        title="DC Vol %"
        :sorter="true"
        :width="100"
      />

      <text-field
        key="dcAdvancedPricing"
        data-index="dcAdvancedPricing"
        title="Advanced Pricing (FSSI)"
        :sorter="true"
        :width="200"
      />

      <text-field
        key="dcStoreMarginRebates"
        data-index="dcStoreMarginRebates"
        title="Store Margin Rebates (FSSI)"
        :sorter="true"
        :width="200"
      />

      <text-field
        key="KgPerUnit"
        data-index="kgPerUnit"
        title="Kg/Unit"
        :sorter="true"
        :width="88"
      />
      <text-field
        key="DcFees"
        data-index="dcFees"
        title="Dc Fee (%Inv.)"
        :sorter="true"
        :width="88"
      />
      <text-field
        key="PickFees"
        data-index="pickFees"
        title="Pick Fees/Unit"
        :sorter="true"
        :width="100"
      />
      <text-field
        key="StartDate"
        data-index="startDate"
        title="Start Date"
        :parse="parseStartDate"
        :sorter="true"
        :width="88"
      />
      <text-field
        key="EndDate"
        data-index="endDate"
        title="End Date"
        :parse="parseEndDate"
        :sorter="true"
        :width="88"
      />
    </list-composer>

    <upload-form :visible.sync="visible" :multiple="false" :type="1" />
  </div>
</template>

<script>
import {
  ADD_PERMISSION,
  EXPORT_PERMISSION,
  UPLOAD_PERMISSION,
} from "@kraftheinz/common";

import { PromoUtils } from "@/utils";
import { FormatDateTimeMixin } from "@/mixins";
import UploadForm from "@/views/Common/UploadForm.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "ListProduct",
  inject: ["can", "crud"],

  components: {
    UploadForm,
  },

  mixins: [PromoUtils, FormatDateTimeMixin],

  data() {
    return {
      visible: false,
      permissions: {
        add: ADD_PERMISSION,
        export: EXPORT_PERMISSION,
        upload: UPLOAD_PERMISSION,
      },
    };
  },

  methods: {
    parseStartDate(value) {
      if (!value) return "";
      return this.$moment(value).format("DD MMMM YYYY");
    },

    parseEndDate(value) {
      if (!value) return "";
      return this.getTheFirstDayOfWeek(value, "DD MMMM YYYY");
    },

    parsePrice(value) {
      if (!value) return "";
      return "$" + value.toFixed(2);
    },

    parseGst(value) {
      if (!value) return "";
      return value.toFixed(2);
    },

    uploadFile() {
      this.visible = true;
    },

    exportFile() {
      const fileName = `product_export_${this.$moment().format(
        "DD_MM_YYYY"
      )}.csv`;
      this.axios
        .get(
          apiUrl +
            `/promotion-planning/products/export?` +
            this.crud.getFilterQuery()
        )
        .then((res) => {
          this.stringToCsvFile(fileName, res.data);
        })
        .catch((err) => this.showErrorMsg(err));
    },
  },
};
</script>
