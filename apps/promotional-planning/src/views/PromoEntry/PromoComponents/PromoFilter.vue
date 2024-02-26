<template>
  <div class="promo-filter">
    <div class="body mx-5">
      <a-row :gutter="24" type="flex">
        <a-col :lg="24" :xl="13" class="mb-4">
          <a-card :loading="loading">
            <a-row :gutter="16">
              <a-col :span="12">
                <label class="filter-title mb-3">Promo details</label>
              </a-col>
            </a-row>

            <a-row :gutter="16" class="mb-3 mt-3">
              <a-col :span="12">
                <select-input
                  reference="promotion-planning.common.customers"
                  label="Key Account"
                  placeholder="Key Account"
                  source="id"
                  all-in-value
                  :source-label="
                    (val) =>
                      generateLabel(val, [
                        'region',
                        'keyAccountCode',
                        'keyAccount',
                      ])
                  "
                  :value="keyAccountId"
                  :sort-function="sortNationalAccount"
                  @change="onKeyAccountChange"
                />
              </a-col>

              <a-col :span="4">
                <select-input
                  reference="promotion-planning.common.regions"
                  placeholder="Region"
                  source="code"
                  disabled
                  source-label="description"
                  label="Region"
                  :value="regionCode ? regionCode : ''"
                  @change="(event) => changeSelectField(event, 'region')"
                />
              </a-col>

              <a-col :span="4">
                <select-input
                  placeholder="State"
                  source="code"
                  :data-source="stateList"
                  source-label="description"
                  label="State"
                  :value="filterPpgForm.state ? filterPpgForm.state : ''"
                  @change="(event) => changeSelectField(event, 'state')"
                />
              </a-col>

              <a-col :span="4">
                <select-input
                  label="Year"
                  :data-source="listYear"
                  source-label="description"
                  source="code"
                  :value="
                    filterFormParam.finYear
                      ? filterFormParam.finYear
                      : $moment().year()
                  "
                  @change="onFinYearChange"
                />
              </a-col>
            </a-row>

            <a-row :gutter="16" class="mt-3">
              <a-col :span="8">
                <select-input
                  :clear-data-on-destroy="false"
                  custom-query="All=false"
                  label="Cluster"
                  placeholder="Cluster"
                  reference="promotion-planning.common.clusters"
                  source="code"
                  :source-label="
                    (val) => generateLabel(val, ['code', 'description'])
                  "
                  :value="clusterValue"
                  @change="(event) => changeSelectField(event, 'cluster')"
                />
              </a-col>

              <a-col :span="8">
                <select-input
                  label="Category"
                  placeholder="Category"
                  :data-source="categoryList"
                  :source-label="
                    (val) => generateLabel(val, ['code', 'description'])
                  "
                  source="code"
                  :value="categoryValue"
                  @change="(event) => changeSelectField(event, 'category')"
                />
              </a-col>

              <a-col :span="8">
                <select-input
                  key="subCategorys"
                  source="code"
                  :data-source="subCatList"
                  placeholder="Subcategorys"
                  :source-label="
                    (val) => generateLabel(val, ['code', 'description'])
                  "
                  label="Subcategory"
                  :value="subcategoryValue"
                  @change="(event) => changeSelectField(event, 'subCategory')"
                />
              </a-col>
            </a-row>
          </a-card>
        </a-col>

        <a-col :lg="24" :xl="11" class="mb-4">
          <a-card :loading="loading">
            <a-row class="ppg-details-header" type="flex">
              <label class="filter-title mb-3">PPG Details</label>
              <a-button class="ml-2" type="primary" @click="goToPOTDetail">
                Go to POT
              </a-button>
            </a-row>

            <a-row :gutter="16" class="mb-3">
              <a-col :span="24">
                <select-input
                  label="PPG"
                  source="id"
                  placeholder="PPG"
                  :value="ppgValue"
                  :loading="ppgLoading"
                  :source-label="(val) => generateLabel(val, ppgLabelParams)"
                  :data-source="ppgList"
                  all-in-value
                  @change="onPPGChange"
                />
              </a-col>
            </a-row>

            <a-space :size="16">
              <text-input
                label="RRP"
                :disabled="true"
                :value="ppgDetails.rrp"
              />

              <text-input
                label="List Price"
                :disabled="true"
                :value="ppgDetails.listPrice"
              />

              <text-input
                label="COGS"
                :disabled="true"
                :value="ppgDetails.cogs"
              />

              <text-input
                label="Unit/Case"
                :disabled="true"
                :value="ppgDetails.shipperQty"
              />

              <text-input
                label="Leaf"
                :disabled="true"
                :value="ppgDetails.leaf + '%'"
              />
            </a-space>

            <a-space :size="16">
              <text-input
                label="Trade Terms"
                :disabled="true"
                :value="ppgDetails.dcTradingTerms + '%'"
              />

              <text-input
                label="Ullage"
                :disabled="true"
                :value="ppgDetails.dcUllagePerMDA + '%'"
              />

              <text-input
                label="Rebate"
                :disabled="true"
                :value="ppgDetails.dcRebates + '%'"
              />

              <text-input
                label="DC Fee"
                :disabled="true"
                :value="ppgDetails.dcFees + '%'"
              />

              <text-input
                label="Pick Fees"
                :disabled="true"
                :value="ppgDetails.pickFees"
              />
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <volume-checks
      v-show="activeTabKey === tabs.salesPlan"
      :promo-entry="promoEntry"
    />

    <div
      v-if="!enabledEntry && _.get(effectiveDates, 'length')"
      class="promo-filter__effective-dates mx-5 mb-4"
    >
      <div class="mb-3 h7 neutral-9--text">Effective Weeks</div>
      <a-skeleton
        :loading="isLoadingPromoEntry"
        :paragraph="{ rows: 1 }"
        :title="false"
      />
      <radio-group-input
        v-if="!isLoadingPromoEntry"
        :data-source="effectiveDates"
        name="effectiveDates"
        source="promotionEntryId"
        :source-label="getEffectiveDatesLabel"
        type="button"
        :value="id"
        @change="onEffectiveDatesChange"
      />
    </div>

    <div class="mx-5">
      <a-tabs
        v-model="activeTabKey"
        :default-active-key="tabs.guardrailsPrimary"
        @change="onTabChange"
      >
        <a-tab-pane
          v-for="value in guardrailKey"
          :key="value.key"
          :tab="value.label"
        >
          <promo-guardrails
            :enabled-entry="enabledEntry"
            :entry-price="filterFormParam"
            :key-metric-type.sync="keyMetricType"
            :key-metric-url="keyMetricUrl"
            :loading="isLoadingPromoEntry"
            :pl-table-url="plTableUrl"
            :price-entry-url="priceEntryUrl"
            :promo-entry="promoEntry"
            :retail-price-url="retailPriceUrl"
            :tab="activeTabKey"
            :weekly-price-url="weeklyPriceUrl"
            :promo-entry-id="promoEntryId"
            @accepted="onAccepted"
            @changeAction="onAction"
            @refreshData="fetchData"
          />
        </a-tab-pane>
        <a-tab-pane
          v-if="canViewSalesPlan && !isLoadingPromoEntry"
          :key="tabs.salesPlan"
          tab="Sales Plan"
          :disabled="isSalesPlanDisabled"
        >
          <promo-sales-plan
            :enabled-entry="enabledEntry"
            :entry-price="filterFormParam"
            :key-account="keyAccount"
            :price-entry-url="priceEntryUrl"
            :pl-table-url="plTableUrl"
            :promo-entry="promoEntry"
            :tab="activeTabKey"
            :weekly-price-url="weeklyPriceUrl"
          />
        </a-tab-pane>

        <span slot="tabBarExtraContent">
          {{
            promoEntry &&
            `Last update: ${$moment(promoEntry.updatedAt).format("DD/MM/YYYY")}
          by ${updatedBy.firstName} ${updatedBy.lastName}`
          }}
        </span>
      </a-tabs>
      <promo-comment v-if="promoEntry" :screen="screenName" />
    </div>
  </div>
</template>

<script>
import numeral from "numeral";
import EventBus from "@/EventBus";
import PromoComment from "./PromoComment.vue";

import {
  FILTERS_EQUAL,
  VIEW_PERMISSION,
  DUPLICATE_PERMISSION,
  DELETE_PERMISSION,
  ErrorHandlerMixin,
  PayloadHandlerMixin,
} from "@kraftheinz/common";

import { PROMO_SALES_REVIEW, PROMO_DATE_FORMAT_FOR_SALE } from "@/constants";
import { PromoUtils } from "@/utils";

import PromoGuardrails from "./PromoGuardrails.vue";
import PromoSalesPlan from "./PromoSalesPlan.vue";
import VolumeChecks from "./VolumeChecks.vue";

const apiUrl = import.meta.env.VITE_API_URL;
const onlineGuardrail = {
  label: "Guardrails - Online Plan",
  key: "promotionEntryOnlineId",
};
const primaryGuardrail = {
  label: "Guardrails - Primary Plan",
  key: "promotionEntryPrimaryId",
};

export default {
  name: "PromoFilter",

  mixins: [PayloadHandlerMixin, ErrorHandlerMixin, PromoUtils],

  components: {
    PromoGuardrails,
    PromoSalesPlan,
    PromoComment,
    VolumeChecks,
  },

  inject: ["resourceProps", "canProps"],

  provide() {
    return {
      getFilterParam: () => this.filterFormParam,
    };
  },

  data() {
    const [entryPermissions, guardrailPermission, salesPlanPermission] =
      this.canProps;

    const [
      promoEntryProps,
      keyMetricProps,
      plTableProps,
      weeklyPriceProps,
      ,
      ,
      retailPriceProps,
      ,
      distributorProps,
      ,
      ,
      ,
      commentsProps,
    ] = this.resourceProps;

    const year = this.$moment().year();
    const { id } = this.$route.params;

    const listYear = [
      { code: year - 1, description: year - 1 },
      { code: year, description: year },
      { code: year + 1, description: year + 1 },
    ];
    const tabs = {
      guardrailsPrimary: "promotionEntryPrimaryId",
      guardrailsOnline: "promotionEntryOnlineId",
      salesPlan: "sales-plan",
    };
    return {
      PROMO_SALES_REVIEW,
      activeTabKey: "",
      categoryApiUrl: `${apiUrl}/promotion-planning/common/categories`,
      categoryList: [],
      customerApiUrl: `${apiUrl}/promotion-planning/common/customers`,
      distributionCenter: "",
      distributorCode: [],
      distributorId: null,
      distributorList: [],
      distributorProps,
      editFor: {},
      enabledEntry: false,
      entryPermissions,
      filterFormParam: {},
      filterPpgForm: {},
      guardrailPermission,
      hasData: false,
      isLoadingPromoEntry: false,
      keyAccount: null,
      keyMetricProps,
      keyMetricType: "total",
      listVersion: [],
      listYear,
      loading: false,
      permissions: {
        view: VIEW_PERMISSION,
        duplicate: DUPLICATE_PERMISSION,
        active: DELETE_PERMISSION,
      },
      plTableProps,
      ppgApiUrl: `${apiUrl}/promotion-planning/common/products`,
      ppgDetails: {
        cogs: "",
        dcFees: 0,
        dcRebates: 0,
        dcTradingTerms: 0,
        dcUllagePerMDA: 0,
        leaf: 0,
        listPrice: "",
        pickFees: 0,
        rrp: "",
        shipperQty: "",
      },
      ppgList: [],
      ppgLoading: false,
      promoEntryProps,
      regionCode: "",
      retailPriceProps,
      salesPlanPermission,
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      stateList: [],
      subCatApiUrl: `${apiUrl}/promotion-planning/common/sub-categories`,
      subCatList: [],
      tabs,
      type: id ? "edit" : "empty",
      updatedBy: {
        firstName: "",
        lastName: "",
      },
      weeklyPriceProps,
      commentsProps,
      promoEntryId: 0,
      guardrailKey: [],
    };
  },

  computed: {
    canViewSalesPlan() {
      return (
        this.salesPlanPermission.can(this.permissions.view) &&
        !this.isSaleReview
      );
    },

    categoryValue() {
      return this._.get(this.promoEntry, "category", "");
    },

    clusterValue() {
      return this._.get(this.promoEntry, "cluster", "");
    },

    effectiveDates() {
      return this._.get(this.promoEntry, "effectiveDates", []).filter(
        (effectiveDate) => {
          switch (this.activeTabKey) {
            case this.tabs.guardrailsOnline:
              return effectiveDate.isOnline;

            case this.tabs.guardrailsPrimary:
              return !effectiveDate.isOnline;

            default:
              return true;
          }
        }
      );
    },

    id() {
      return +this.$route.params.id;
    },

    isSalesPlanDisabled() {
      return this.type === "create" || !this.promoEntry;
    },

    keyAccountId() {
      return this._.get(this.promoEntry, "customerId", "");
    },

    keyMetricUrl() {
      if (!this.id) return undefined;
      return `${apiUrl}/promotion-planning/promo-entries/${this.id}/key-metrics/${this.keyMetricType}`;
    },

    plTableUrl() {
      if (!this.id) return undefined;
      return `${apiUrl}/promotion-planning/promo-entries/${this.id}/statistic`;
    },

    ppgLabelParams() {
      const params = ["code", "description"];

      return this.filterPpgForm.state ? params : ["state", ...params];
    },

    ppgValue() {
      return this._.get(this.promoEntry, "productId", "");
    },

    promoEntry() {
      if (this.type == "edit") {
        return this.promoEntryProps.crud.getEntity();
      }

      return null;
    },

    priceEntryUrl() {
      if (!this.id) return undefined;
      return `${apiUrl}/promotion-planning/promo-entries/${this.id}/price-entries`;
    },

    retailPriceUrl() {
      if (!this.id) return undefined;
      return `${apiUrl}/promotion-planning/common/price-entries/${this.id}`;
    },

    subcategoryValue() {
      return this._.get(this.promoEntry, "subCategory", "");
    },

    versionValue() {
      return this._.get(this.promoEntry, "version", "");
    },

    weeklyPriceUrl() {
      if (!this.id) return undefined;
      return `${apiUrl}/promotion-planning/promo-entries/${this.id}/weekly-prices`;
    },

    isSaleReview() {
      return (
        this.promoEntry && this.promoEntry.statusCode === PROMO_SALES_REVIEW
      );
    },

    screenName() {
      return this.activeTabKey == "sales-plan" ? "SALES PLAN" : "GUARDRAIL";
    },
  },

  watch: {
    canViewSalesPlan(newVal) {
      if (
        newVal ||
        this.guardrailKey.some((val) => val.key === this.activeTabKey)
      )
        return;
      this.activeTabKey = this.promoEntry.isOnline
        ? this.tabs.guardrailsOnline
        : this.tabs.guardrailsPrimary;
    },

    async promoEntry(newVal, oldVal) {
      if (!newVal) return;
      this.weeklyPriceProps.crud.setFilter("Year", {
        operator: FILTERS_EQUAL,
        value: newVal.finYear,
      });

      const canFetch = !!oldVal && newVal.id !== oldVal.id;

      canFetch && this.weeklyPriceProps.crud.fetchList(this.weeklyPriceUrl);

      this.changeSelectField(newVal.region, "region", false);
      this.changeSelectField(newVal.cluster, "cluster", false);
      this.changeSelectField(newVal.category, "category", false);
      this.changeSelectField(newVal.subCategory, "subCategory", false);
      this.changeSelectField(newVal.state, "state", false);
      this.changeSelectField(newVal.customerId, "customer");
      this.storeValue("productId", newVal.productId);
      this.storeValue("finYear", newVal.finYear);
      this.storeValue("version", newVal.version);
      this.regionCode = newVal.region;
      this.distributionCenter = newVal.distributionCenter;
      this.distributorId = newVal.distributorId;
      this.onDistributorChange(newVal.distributorCode);

      try {
        const {
          data: { firstName, lastName },
        } = await this.axios.get(
          `${apiUrl}/identities/ad/users/${newVal.updatedBy}`
        );
        this.updatedBy = {
          firstName,
          lastName,
        };
      } catch (error) {
        this.updatedBy = {
          firstName: "Jone",
          lastName: "Doe",
        };
      }
    },

    async id(newVal) {
      if (!newVal) return;
      await this.fetchData(newVal);
    },
  },

  async created() {
    EventBus.$on("onSaveSalePlans", () => {
      this.activeTabKey = this.tabs.guardrailsPrimary;
      this.promoEntryProps.crud.fetchEntity();
    });
  },

  destroyed() {
    EventBus.$off("onSaveSalePlans", () => {
      this.activeTabKey = this.tabs.guardrailsPrimary;
      this.promoEntryProps.crud.fetchEntity();
    });
  },

  async mounted() {
    if (this.type == "edit") {
      try {
        this.isLoadingPromoEntry = true;

        const res = await Promise.all([
          this.promoEntryProps.crud.fetchEntity(),
          // this.priceEntryProps.crud.fetchList(this.priceEntryUrl),
          this.retailPriceProps.crud.fetchList(this.retailPriceUrl),
        ]);
        this.mapPpgDetailsData(res[0].data);
      } catch (error) {
        this.displayErrorNotification(error);
        this.$router.push({ name: "LandingPage" });
      } finally {
        this.isLoadingPromoEntry = false;
      }
    } else {
      this.weeklyPriceProps.crud.setFilter("Year", {
        operator: FILTERS_EQUAL,
        value: this.listYear[1].code, // Default to current year
      });

      this.enabledEntry = true;
      this.activeTabKey = this.tabs.guardrailsPrimary;
      this.storeValue("finYear", this.$moment().year());
    }
    this.getGuardrailsKey();
  },

  methods: {
    getGuardrailsKey() {
      this.guardrailKey = [];
      const isShowPrimaryGuardrail =
        !!this.promoEntry.promotionEntryPrimaryId &&
        this.isShowGuardrail("promotionEntryPrimaryId");
      const isShowOnlineGuardrail =
        !!this.promoEntry.promotionEntryOnlineId &&
        this.isShowGuardrail("promotionEntryOnlineId");
      if (isShowPrimaryGuardrail) this.guardrailKey.push(primaryGuardrail);
      if (isShowOnlineGuardrail) this.guardrailKey.push(onlineGuardrail);
      this.activeTabKey =
        this.promoEntry.promotionEntryPrimaryId == this.id
          ? "promotionEntryPrimaryId"
          : "promotionEntryOnlineId";
    },

    isShowGuardrail(key) {
      return (
        this.guardrailPermission.can(this.permissions.view) &&
        this.promoEntry &&
        this.promoEntry[key]
      );
    },

    async fetchData(promoEntryId) {
      try {
        this.isLoadingPromoEntry = true;
        const query =
          this.filterFormParam && this.filterFormParam.finYear
            ? `?year=${this.filterFormParam.finYear}`
            : "";
        const entryDetailUrl =
          apiUrl + "/promotion-planning/promo-entries/" + promoEntryId + query;
        const { data } = await this.promoEntryProps.crud.fetchEntity(
          entryDetailUrl
        );
        this.isLoadingPromoEntry = false;
        await Promise.all([
          this.weeklyPriceProps.crud.fetchList(this.weeklyPriceUrl),
          this.retailPriceProps.crud.fetchList(this.retailPriceUrl),
        ]);
        this.mapPpgDetailsData(data);
      } catch (error) {
        this.displayErrorNotification(error);
      }
    },

    onAccepted() {
      this.activeTabKey = this.tabs.salesPlan;
    },

    onAction(event) {
      const isEmpty = event == "empty";

      this.enabledEntry = isEmpty;

      if (isEmpty) {
        this.activeTabKey = this.tabs.guardrailsPrimary;
      }
    },

    onKeyAccountChange(value) {
      this.keyAccount = value.keyAccount;
      this.regionCode = value.region;
      this.distributionCenter = value.distributionCenter;
      this.distributorId = null;
      this.changeSelectField("", "state", false);
      this.changeSelectField(value.region, "region", false);
      this.changeSelectField(value.id, "customer");
      this.onDistributorChange([]);
    },

    onFinYearChange(value) {
      this.storeValue("finYear", value);

      this.weeklyPriceProps.crud.setFilter("Year", {
        operator: FILTERS_EQUAL,
        value: value,
      });
    },

    onPPGChange(value) {
      if (!value) return;

      this.storeValue("productId", value.id);
      this.mapPpgDetailsData(value);
      this.onDistributorChange(this.filterFormParam.distributorCode);
    },

    storeValue(resourceKey, value) {
      const filterFormParam = this.filterFormParam;
      this.filterFormParam = { ...filterFormParam, [resourceKey]: value };
    },

    async changeSelectField(e, name, isFilterPpg = true) {
      this.storeValue("productId", "");
      this.storeValueFilter(e, name);

      if (name === "category") {
        this.subCatList = await this.fetchSelectedList(e, this.subCatApiUrl);
        this.subCatList = this.subCatList.filter((e) => e.code !== "-1");
      } else if (name === "cluster") {
        this.categoryList = await this.fetchSelectedList(
          e,
          this.categoryApiUrl
        );

        this.categoryList = this.categoryList.filter((e) => e.code !== "-1");
      } else if (name === "region") {
        this.stateList = await this.fetchSelectedList(e, this.stateApiUrl);
        this.distributorList = await this.fetchSelectedList(
          e,
          this.customerApiUrl
        );
      }

      if (isFilterPpg) {
        this.ppgLoading = true;
        this.changeFilterPpg(e);
      }
    },

    storeValueFilter(value, resourceKey) {
      const filterPpgForm = this.filterPpgForm;
      this.filterPpgForm = { ...filterPpgForm, [resourceKey]: value };
    },

    async changeFilterPpg(e) {
      this.storeValue("customerId", this.filterPpgForm.customer);

      let noEmpty = Object.values(this.filterPpgForm).some((v) => v);

      this.ppgList = noEmpty
        ? await this.fetchSelectedList(
            e,
            this.ppgApiUrl +
              "?" +
              this.generateFeString({
                CustomerId: this.filterPpgForm.customer,
                Region: this.filterPpgForm.region,
                State: this.filterPpgForm.state,
                Cluster: this.filterPpgForm.cluster,
                Category: this.filterPpgForm.category,
                SubCategory: this.filterPpgForm.subCategory,
              }),
            true
          )
        : [];

      this.ppgList = this.ppgList.filter((e) => e.code !== "0");

      if (this.ppgList.length === 0) {
        this.enabledEntry = true;
        this.activeTabKey = this.tabs.guardrailsPrimary;
      }

      this.ppgLoading = false;
    },

    onTabChange(key) {
      this.activeTabKey = key;
      const guardrailKeyId = this.promoEntry[key];
      if (
        this.guardrailKey.some((item) => item.key === key) &&
        this.id != guardrailKeyId
      ) {
        this.$router.push({
          name: "PromoEdit",
          params: { id: guardrailKeyId },
        });
        this.promoEntryId = guardrailKeyId;
      }
    },

    onDistributorChange(values) {
      if (!values[0] && !values[1]) {
        values = [];
      }
      const distributorCode = [...values];
      const data = {
        customerId: this.filterPpgForm.customer,
        distributorCode1: distributorCode[0] ? distributorCode[0] : 0,
        distributorCode2: distributorCode[1] ? distributorCode[1] : 0,
      };

      this.distributorCode = [...distributorCode];
      this.storeValue("distributorCode", distributorCode);
      if (this.distributorId) {
        this.storeValue("distributorId", this.distributorId);
        this.storeDistributorValue(data, "editForm");
      } else {
        data.productId = this.filterFormParam.productId;

        this.storeDistributorValue(data, "createForm");
      }
    },

    storeDistributorValue(values, formType) {
      Object.keys(values).forEach((key) => {
        this.distributorProps.crud.updateEntity(formType, {
          resourceKey: key,
          value: values[key],
        });
      });
    },

    getEffectiveDatesLabel(option) {
      if (!option) return "";

      const fromWeek = option.startDate
        ? this.$moment(option.startDate).format(PROMO_DATE_FORMAT_FOR_SALE)
        : "";

      /** When publishing, we send the last day of the selected "To week" to the API.
       * Then, on the Promo Entry, we need to get the first day of that week to display correctly.
       */
      const toWeek = option.endDate
        ? this.$moment(option.endDate)
            .startOf("isoWeek")
            .format(PROMO_DATE_FORMAT_FOR_SALE)
        : "";

      return `${fromWeek} - ${toWeek} (${
        option.isOnline ? "Online" : "Primary"
      } )`;
    },

    onEffectiveDatesChange(promoEntryId) {
      this.$router.push({ name: "PromoEdit", params: { id: promoEntryId } });
      this.promoEntryId = promoEntryId;
    },

    goToPOTDetail() {
      if (!this.promoEntry) return;
      const routeData = `/promotion-planning/promo-optimization/${this.promoEntry.promotionOptimisationId}?status=${this.promoEntry.statusCode}`;
      window.open(routeData, "_blank");
    },

    /**
     * Map data from API response to PPG Details
     * @param {Record<string, any>} data
     */
    mapPpgDetailsData(data) {
      Object.keys(this.ppgDetails).forEach((key) => {
        if (key !== "shipperQty")
          this.ppgDetails[key] = numeral(data[key]).format("0.00");
        else this.ppgDetails[key] = data[key];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.promo-filter {
  .filter-title {
    color: #272d35;
    font-weight: 500;
  }

  ::v-deep {
    .ppg-details-header {
      .filter-title {
        flex-grow: 1;
      }

      .switch-input {
        margin-right: 15px;
      }
    }
  }
}
</style>
