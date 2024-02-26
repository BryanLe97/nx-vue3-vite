<template>
  <create-modal-composer
    class="modal-add-product"
    title="Add Product"
    :key-receive-event="keyReceiveEvent"
    :width="750"
    @change="changeSelectField"
  >
    <text-input
      key="code"
      form-item
      label="PPG Code"
      rules="required|alpha_dash"
      placeholder="PPG Code"
      :max-length="10"
      :span="8"
    />

    <text-area
      key="description"
      form-item
      label="PPG Description"
      placeholder="PPG Description"
      rules="required"
      :max-length="255"
      :rows="1"
      :span="24"
    />

    <select-input
      key="cluster"
      form-item
      label="Cluster"
      reference="promotion-planning.common.clusters"
      custom-query="All=false"
      placeholder="Cluster"
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      source-description="description"
      rules="required"
      :span="8"
    />

    <select-input
      key="category"
      label="Category"
      placeholder="Category"
      source="code"
      source-description="description"
      form-item
      rules="required"
      :data-source="categoryList"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="8"
    />

    <select-input
      key="subCategory"
      class-name="modal-add-product__sub-cat"
      label="Subcategory"
      placeholder="Subcategory"
      source="code"
      source-description="description"
      form-item
      rules="required"
      :data-source="subCatList"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      :span="8"
    />

    <select-input
      key="region"
      label="Region"
      reference="promotion-planning.common.regions"
      placeholder="Region"
      source="code"
      source-label="description"
      form-item
      rules="required"
      :span="8"
    />

    <select-input
      key="state"
      form-item
      label="State"
      placeholder="State"
      source="code"
      source-label="description"
      rules="required"
      :loading="isLoadingState"
      :data-source="stateList"
      :span="8"
    />

    <select-input
      key="customerId"
      form-item
      label="Key Account"
      placeholder="Key Account"
      source="id"
      source-description="keyAccount"
      rules="required"
      :data-source="customerList"
      :loading="isLoadingCustomer"
      :sort-function="sortNationalAccount"
      :span="8"
      :source-label="
        (val) => generateLabel(val, ['keyAccountCode', 'keyAccount'])
      "
    />

    <number-input
      key="rrp"
      form-item
      label="RRP"
      placeholder="$ RRP"
      rules="positive|decimal:10,2"
      type="currency"
      :inter-length="10"
      :decimal-length="2"
      :min="0"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="listPrice"
      form-item
      label="List Price"
      placeholder="$ List Price"
      rules="required|positive|decimal:10,2"
      type="currency"
      :inter-length="10"
      :decimal-length="2"
      :min="0"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="cogs"
      label="COGS"
      placeholder="$ COGS"
      form-item
      rules="required|positive|decimal:10,2"
      type="currency"
      :inter-length="10"
      :decimal-length="2"
      :min="0"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="shipperQty"
      form-item
      label="Shipper Qty"
      placeholder="Shipper Qty"
      rules="required|positive"
      :min="0"
      :is-hide-arrow="true"
      :max-length="8"
      :span="8"
    />

    <number-input
      key="gst"
      form-item
      label="GST"
      placeholder="GST %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :disabled="isNZ"
      :value="gstValue"
      :span="8"
    />

    <text-input
      key="kgPerUnit"
      label="Kg/Unit"
      placeholder="Kg/Unit"
      form-item
      rules="number|between:0,100|decimal:3,2"
      :max-length="6"
      :span="8"
    />

    <week-picker
      key="startDate"
      label="Start Date"
      placeholder="Start Date"
      rules="required"
      show-start-of-week
      :format-date="PROMO_DATE_FORMAT_FOR_SALE"
      :span="8"
    />

    <week-picker
      key="endDate"
      label="End Date"
      placeholder="End Date"
      rules="required"
      show-start-of-week
      :format-date="PROMO_DATE_FORMAT_FOR_SALE"
      :span="8"
    />

    <!-- For DC's Parameters -->
    <divider-line text="DC Parameters" :span="24" />
    <number-input
      key="dcTradingTerms"
      label="Trading Terms"
      placeholder="Trading Terms %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :span="8"
    />

    <number-input
      key="dcUllagePerMDA"
      label="Ullage/MDA"
      placeholder="Ullage/MDA %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :span="8"
    />

    <number-input
      key="dcRebates"
      label="Rebates (incl. Settlement Disc)"
      placeholder="Rebates (incl. Settlement Disc) %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :span="8"
    />

    <number-input
      key="dcFees"
      label="Dc Fee (%Inv.)"
      placeholder="Dc Fee (%Inv.) %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :span="8"
    />

    <number-input
      key="pickFees"
      label="Pick Fees/Unit"
      placeholder="Pick Fees/Unit"
      type="number"
      :formatter="formatter"
      :parser="parser"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="leaf"
      label="Leaf"
      placeholder="Leaf %"
      type="percent"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :formatter="formatter"
      :parser="parser"
      :max:="100"
      :min="0"
      :span="8"
    />

    <number-input
      key="handlingFee"
      label="Handling Fee"
      placeholder="Handling Fee"
      :formatter="formatter"
      :parser="parser"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="cdsFee"
      label="CDS Fee"
      placeholder="CDS Fee"
      :formatter="formatter"
      :parser="parser"
      :is-hide-arrow="true"
      :span="8"
    />

    <number-input
      key="dcVolPercent"
      label="DC Vol %"
      placeholder="DC Vol %"
      type="percent"
      :disabled="isAu"
      :value="dcVolPercent"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :max:="100"
      :min="0"
      :span="8"
    />

    <number-input
      key="dcAdvancedPricing"
      label="Advanced Pricing (FSSI)"
      placeholder="Advanced Pricing (FSSI) %"
      type="percent"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :formatter="formatter"
      :parser="parser"
      :max:="100"
      :min="0"
      :span="8"
    />

    <number-input
      key="dcStoreMarginRebates"
      label="Store Margin Rebates (FSSI)"
      placeholder="Store Margin Rebates (FSSI) %"
      type="percent"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :formatter="formatter"
      :parser="parser"
      :max:="100"
      :min="0"
      :span="8"
    />

    <!-- For Store's Parameters -->
    <divider-line text="Store Parameters" :span="24" />
    <number-input
      key="storeTradingTerms"
      label="Trading Terms"
      placeholder="Trading Terms %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :value="storeTradingTerms"
      :disabled="!isNZ"
      :span="8"
    />

    <number-input
      key="storeUllagePerMDA"
      label=" Ullage/MDA"
      placeholder=" Ullage/MDA %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :value="storeUllagePerMDA"
      :disabled="!isNZ"
      :span="8"
    />

    <number-input
      key="storeRebates"
      label="Rebates (incl. Settlement Disc)"
      placeholder="Rebates (incl. Settlement Disc) %"
      type="percent"
      rules="between:0,100|decimal:3,2"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :value="storeRebates"
      :disabled="!isNZ"
      :span="8"
    />
  </create-modal-composer>
</template>

<script>
import { ErrorHandlerMixin, FORMAT_DATE_SECONDARY } from "@kraftheinz/common";
import { PromoUtils } from "@/utils";
import { PROMO_DATE_FORMAT_FOR_SALE } from "@/constants";
import { FormatDateTimeMixin } from "@/mixins";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "CreateProduct",

  inject: ["crud"],

  mixins: [PromoUtils, ErrorHandlerMixin, FormatDateTimeMixin],

  data() {
    return {
      PROMO_DATE_FORMAT_FOR_SALE,
      FORMAT_DATE_SECONDARY,
      keyReceiveEvent: ["category", "region", "cluster", "endDate"],
      subCatList: [],
      categoryList: [],
      stateList: [],
      customerList: [],
      isNZ: false,
      gstValue: "",
      dcVolPercent: null,
      subCatApiUrl: `${apiUrl}/promotion-planning/common/sub-categories`,
      categoryApiUrl: `${apiUrl}/promotion-planning/common/categories`,
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      customerApiUrl: `${apiUrl}/promotion-planning/common/customers`,
      isLoadingCustomer: false,
      isLoadingState: false,
      storeParameterKeys: [
        "storeTradingTerms",
        "storeUllagePerMDA",
        "storeRebates",
        "storeListRebates",
        "storeLargeOrder",
        "storePalletOrder",
      ],
      storeTradingTerms: null,
      storeUllagePerMDA: null,
      storeRebates: null,
      storeListRebates: null,
      storeLargeOrder: null,
      storePalletOrder: null,
      isAu: false,
    };
  },

  methods: {
    storeValue(resourceKey, value) {
      this.crud.updateEntity("createForm", {
        resourceKey,
        value,
      });
    },

    async fetchStatesByRegion(region) {
      try {
        this.isLoadingState = true;
        const res = await this.fetchSelectedList(region, this.stateApiUrl);
        this.stateList = res.filter((e) => e.code !== "-1");
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingState = false;
      }
    },

    async fetchCustomersByRegion(region) {
      try {
        this.isLoadingCustomer = true;
        const customerApiUrl = this.customerApiUrl + "/" + region + "?All=true";
        this.customerList = await this.fetchSelectedList(
          region,
          customerApiUrl,
          true
        );
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingCustomer = false;
      }
    },

    async fetchCategoriesByCluster(cluster) {
      try {
        const res = await this.fetchSelectedList(cluster, this.categoryApiUrl);
        this.categoryList = res.filter((e) => e.code !== "-1");
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async fetchSubcategoriesByCategory(category) {
      try {
        const res = await this.fetchSelectedList(category, this.subCatApiUrl);
        this.subCatList = res.filter((e) => e.code !== "-1");
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    changeSelectField(e) {
      let key = Object.keys(e)[0];

      const endDate = this.getTheLastDayOfWeek(
        e.endDate,
        FORMAT_DATE_SECONDARY
      );

      /** keyReceiveEvent: ["category", "region", "cluster", endDate] */
      switch (key) {
        case "category":
          this.fetchSubcategoriesByCategory(e.category);
          break;
        case "cluster":
          this.fetchCategoriesByCluster(e.cluster);
          break;
        case "endDate":
          this.storeValue("endDate", endDate);
          break;
        case "region":
          this.fetchStatesByRegion(e.region);
          this.fetchCustomersByRegion(e.region);

          if (e.region === "NZ") {
            this.isNZ = true;
            this.gstValue = "15";
            this.dcVolPercent = null;
            this.isAu = false;
            this.storeValue("gst", "15");
          } else {
            this.isNZ = false;
            this.gstValue = "10";
            this.dcVolPercent = "100";
            this.isAu = true;
            this.storeValue("gst", "10");
            this.storeValue("dcVolPercent", "100");
            this.clearStoreParameters();
          }
          break;
        default:
          break;
      }
    },

    formatter(value) {
      if (!value) return "";
      const [integerPart, decimalPart] = String(value).split("."); // split the int and the dec
      const limitedIntegerPart = integerPart.slice(0, 6); // limit integer part to inter length characters
      const limitedDecimalPart = decimalPart ? decimalPart.slice(0, 2) : null; // limit decimal part to decimal length characters if present
      return (
        `${limitedIntegerPart || "0"}` +
        (limitedDecimalPart
          ? `.${limitedDecimalPart}`
          : value.includes(".")
          ? "."
          : "")
      ); // join the int and the dec together
    },
    parser(value) {
      return value.replace(/[^0-9.]/g, ""); // only take one to nine
    },
    /** clearStoreParameters: clear value of all fields of store parameters */
    clearStoreParameters() {
      this.storeParameterKeys.forEach((propertyName) => {
        this[propertyName] = "";
        this.storeValue(propertyName, "");
      });
    },
  },
};
</script>
