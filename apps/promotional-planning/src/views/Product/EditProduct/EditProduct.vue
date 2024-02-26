<template>
  <edit-modal-composer
    class="modal-edit-product"
    :custom-url="`${customApiUrl}${productId}`"
    :entity-id="productId"
    :is-fetch-entity-by-id="true"
    :key-receive-event="keyReceviceEvent"
    :last-modified-by-name="true"
    title="Edit Product"
    :width="750"
    @change="changeSelectField"
  >
    <text-input
      key="code"
      label="PPG Code"
      placeholder="PPG Code"
      rules="required|alpha_dash"
      :disabled="true"
      :span="8"
    />

    <text-area
      key="description"
      label="PPG Description"
      placeholder="PPG Description"
      rules="required"
      :max-length="255"
      :rows="1"
      :span="24"
    />

    <select-input
      key="cluster"
      label="Cluster"
      custom-query="All=false"
      reference="promotion-planning.common.clusters"
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
      :data-source="categoryList"
      placeholder="Category"
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      source-description="description"
      rules="required"
      :span="8"
    />

    <select-input
      key="subCategory"
      label="Subcategory"
      :data-source="subCatList"
      placeholder="Subcategory"
      default-active-first-option
      reset-defaut-first-option
      source="code"
      :source-label="(val) => generateLabel(val, ['code', 'description'])"
      source-description="description"
      rules="required"
      :span="8"
    />

    <select-input
      key="region"
      label="Region"
      reference="promotion-planning.common.regions"
      placeholder="Region"
      source="code"
      source-label="description"
      :disabled="true"
      rules="required"
      :span="8"
    />
    <select-input
      key="state"
      label="State"
      :data-source="stateList"
      :loading="isLoadingState"
      placeholder="State"
      source="code"
      source-label="description"
      rules="required"
      :span="8"
    />
    <select-input
      key="customerId"
      label="Key Account"
      :data-source="customerList"
      :loading="isLoadingCustomer"
      placeholder="Key Account"
      source="id"
      :source-label="
        (val) => generateLabel(val, ['keyAccountCode', 'keyAccount'])
      "
      source-description="keyAccount"
      rules="required"
      :sort-function="sortNationalAccount"
      :span="8"
    />
    <number-input
      key="rrp"
      label="RRP"
      placeholder="RRP"
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
      label="List Price"
      placeholder="List Price"
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
      placeholder="COGS"
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
      label="GST"
      placeholder="GST"
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
      :inter-length="6"
      :span="8"
    />

    <number-input
      key="cdsFee"
      label="CDS Fee"
      placeholder="CDS Fee"
      :formatter="formatter"
      :parser="parser"
      :is-hide-arrow="true"
      :inter-length="6"
      :span="8"
    />

    <number-input
      key="dcVolPercent"
      label="DC Vol %"
      placeholder="DC Vol %"
      type="percent"
      :disabled="isAU"
      :is-hide-arrow="true"
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
      rules="between:0,100|decimal:3,2"
      type="percent"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :value="storeTradingTerms"
      :disabled="isAU"
      :span="8"
    />

    <number-input
      key="storeUllagePerMDA"
      label=" Ullage/MDA"
      placeholder=" Ullage/MDA %"
      rules="between:0,100|decimal:3,2"
      type="percent"
      :max="100"
      :min="0"
      :is-hide-arrow="true"
      :inter-length="3"
      :decimal-length="2"
      :value="storeUllagePerMDA"
      :disabled="isAU"
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
      :disabled="isAU"
      :span="8"
    />
  </edit-modal-composer>
</template>

<script>
import { ErrorHandlerMixin, FORMAT_DATE_SECONDARY } from "@kraftheinz/common";
import { PromoUtils } from "@/utils";
import { PROMO_DATE_FORMAT_FOR_SALE } from "@/constants";
import { FormatDateTimeMixin } from "@/mixins";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "EditProduct",

  mixins: [PromoUtils, ErrorHandlerMixin, FormatDateTimeMixin],

  inject: ["crud"],

  data() {
    const { id } = this.$route.params;
    return {
      PROMO_DATE_FORMAT_FOR_SALE,
      productId: id,
      customApiUrl: `${apiUrl}/promotion-planning/products/`,
      subCatApiUrl: `${apiUrl}/promotion-planning/common/sub-categories`,
      categoryApiUrl: `${apiUrl}/promotion-planning/common/categories`,
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      customerApiUrl: `${apiUrl}/promotion-planning/common/customers`,
      keyReceviceEvent: ["category", "region", "cluster", "endDate"],
      storeTradingTerms: null,
      storeUllagePerMDA: null,
      storeRebates: null,
      storeListRebates: null,
      storeLargeOrder: null,
      storePalletOrder: null,
      subCatList: [],
      categoryList: [],
      stateList: [],
      customerList: [],
      isLoadingCustomer: false,
      isLoadingState: false,
      isAU: false,
      isNZ: false,
      gstValue: "",
    };
  },

  computed: {
    productEntity() {
      return this.crud.getEntity(this.$route.params.id);
    },
  },

  watch: {
    async productEntity(newVal) {
      if (newVal && newVal.category) {
        this.changeSelectField({ region: newVal.region });
        this.changeSelectField({ cluster: newVal.cluster });
        this.changeSelectField({ category: newVal.category });
      } else {
        this.crud.fetchEntity();
      }
    },
  },

  methods: {
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
      /** keyReceiveEvent: ["category", "region", "cluster"] */
      switch (key) {
        case "category":
          this.fetchSubcategoriesByCategory(e.category);
          break;
        case "cluster":
          this.fetchCategoriesByCluster(e.cluster);
          break;
        case "endDate":
          this.crud.updateEntity("editForm", {
            resourceKey: "endDate",
            value: endDate,
          });
          break;
        case "region":
          this.isAU = e && e.region === "AU";
          this.fetchStatesByRegion(e.region);
          this.fetchCustomersByRegion(e.region);

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
  },
};
</script>
