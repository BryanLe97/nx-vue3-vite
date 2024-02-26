<template>
  <div class="po-filter">
    <div class="body mx-5">
      <a-row :gutter="24" type="flex">
        <a-col :lg="24" :xl="24" class="mb-4">
          <a-card :loading="isLoading">
            <label class="filter-title pb-3">Promotional Optimisation</label>
            <a-row :gutter="24" class="mb-3 mt-3">
              <a-col :span="5">
                <select-input
                  :data-source="yesNoOptions"
                  label="Is Account Group New World NI?"
                  placeholder="Is Account Group New World NI?"
                  source="code"
                  source-label="name"
                  :value="defaultOptionAccountGroup"
                  @change="onChangeAccountGroupOption"
                />
              </a-col>
              <a-col :span="5">
                <select-input
                  :data-source="listCustomers"
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
                  :value="keyAccountValue"
                  :sort-function="sortNationalAccount"
                  :disabled="isAccountGroup"
                  @change="onKeyAccountChange"
                />
              </a-col>
              <a-col :span="2">
                <text-input
                  key="region"
                  disabled
                  label="Region"
                  :value="regionCode ? regionCode : ''"
                />
              </a-col>
              <a-col :span="2">
                <select-input
                  placeholder="State"
                  source="code"
                  :data-source="stateList"
                  source-label="description"
                  label="State"
                  :value="filterPpgForm.state"
                  default-active-first-option
                  :clear-value-on-options-change="false"
                  @change="changeSelectField($event, 'state')"
                />
              </a-col>
              <a-col :span="2">
                <select-input
                  label="Year"
                  :data-source="listYear"
                  source-label="description"
                  source="code"
                  :value="filterFormParam.finYear"
                  @change="onFinYearChange"
                />
              </a-col>
            </a-row>
            <a-row :gutter="24" class="mb-3 mt-3">
              <a-col :span="5">
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
                  @change="changeSelectField($event, 'cluster')"
                />
              </a-col>
              <a-col :span="5">
                <select-input
                  label="Category"
                  placeholder="Category"
                  :data-source="categoryList"
                  :source-label="
                    (val) => generateLabel(val, ['code', 'description'])
                  "
                  source="code"
                  :value="categoryValue"
                  @change="changeSelectField($event, 'category')"
                />
              </a-col>
              <a-col :span="6">
                <select-input
                  source="code"
                  :data-source="subCatList"
                  placeholder="Subcategory"
                  :source-label="
                    (val) => generateLabel(val, ['code', 'description'])
                  "
                  label="Subcategory"
                  :value="subcategoryValue"
                  @change="changeSelectField($event, 'subCategory')"
                />
              </a-col>
              <a-col :span="6">
                <select-input
                  label="PPG"
                  source="code"
                  placeholder="PPG"
                  :value="pPGValue"
                  :loading="ppgLoading"
                  :source-label="(val) => generateLabel(val, ppgLabelParams)"
                  :data-source="ppgList"
                  all-in-value
                  @change="onPPGChange"
                />
              </a-col>
            </a-row>
            <a-row :gutter="24" class="mb-3 mt-3">
              <a-col :span="5">
                <text-input key="idc" label="IDC" disabled :value="idcValue" />
              </a-col>
              <a-col :span="5">
                <select-input
                  key="leaf"
                  source="code"
                  :data-source="yesNoOptions"
                  source-label="name"
                  label="Leaf into Store GM%?"
                  default-active-first-option
                  @change="changeSelectField($event, 'isLeafStoreGM', false)"
                />
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import isNil from "lodash/isNil";

import {
  ErrorHandlerMixin,
  PayloadHandlerMixin,
  FILTERS_EQUAL,
  FILTERS_NOT_EQUAL,
} from "@kraftheinz/common";

import { PromoUtils } from "@/utils";
import {
  NEW_WORLD_AUCKLAND_CODE,
  NEW_WORLD_WGTN_SHOPRITE_CODE,
} from "@/constants/others";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "POFilter",

  components: {},

  mixins: [PromoUtils, PayloadHandlerMixin, ErrorHandlerMixin],
  inject: ["resourceProps"],

  data() {
    const promoOptisProps = this.resourceProps.find(
      (item) => item.resourceName === "promotion-planning.promo-optis"
    );

    const year = this.$moment().year();
    const listYear = [
      { code: year - 1, description: year - 1 },
      { code: year, description: year },
      { code: year + 1, description: year + 1 },
    ];
    const yesNoOptions = [
      {
        code: "false",
        name: "No",
      },
      {
        code: "true",
        name: "Yes",
      },
    ];

    return {
      promoOptisProps,
      listYear,
      yesNoOptions,
      categoryList: [],
      filterFormParam: {},
      ppgList: [],
      regionCode: "",
      filterPpgForm: {},
      stateList: [],
      subCatList: [],
      listKeyAccounts: [],
      northIslandKeyAccounts: [],
      ppgLoading: false,
      filterParameters: {},
      ppgValue: "",
      keyAccountValue: "",
      isAccountGroup: false,
      newWorldAucklandData: {},
      categoryApiUrl: `${apiUrl}/promotion-planning/common/categories`,
      ppgApiUrl: `${apiUrl}/promotion-planning/common/products`,
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      subCatApiUrl: `${apiUrl}/promotion-planning/common/sub-categories`,
      customerApiUrl: `${apiUrl}/promotion-planning/common/customers`,
      checkPromoApiUrl: `${apiUrl}/promotion-planning/promo-optis/check-promo-exist-plan`,
      createPOApiUrl: `${apiUrl}/promotion-planning/promo-optis`,
    };
  },

  computed: {
    isLoading() {
      return this.promoOptisProps
        ? this.$store.state[this.promoOptisProps.resourceName].isFetchingList
        : true;
    },
    ppgLabelParams() {
      const params = ["code", "description"];
      return this.filterPpgForm.state ? params : ["state", ...params];
    },

    promotionId() {
      return this.$route.params.id;
    },

    promoEntry() {
      if (this.promotionId) {
        return this.promoOptisProps.crud.getEntity();
      }
      return null;
    },

    idcValue() {
      return this.promoEntry ? this.promoEntry.itemDissCode : "";
    },

    clusterValue() {
      return this.promoEntry ? this.promoEntry.cluster : "";
    },

    categoryValue() {
      return this.promoEntry ? this.promoEntry.category : "";
    },

    pPGValue() {
      return this.promoEntry ? this.promoEntry.ppgCode : "";
    },

    subcategoryValue() {
      return this.promoEntry ? this.promoEntry.subCategory : "";
    },

    defaultOptionAccountGroup() {
      return this.promoEntry
        ? NEW_WORLD_AUCKLAND_CODE.includes(
            this.promoEntry.keyAccountCode
          ).toString()
        : "false";
    },

    listCustomers() {
      return this.isAccountGroup
        ? this.northIslandKeyAccounts
        : this.listKeyAccounts;
    },
  },

  watch: {
    async promoEntry(newVal) {
      if (newVal) {
        this.keyAccountValue = newVal.customerId;
        this.isAccountGroup = NEW_WORLD_AUCKLAND_CODE.includes(
          newVal.keyAccountCode
        );

        this.changeSelectField(newVal.region, "region", false);
        this.changeSelectField(newVal.cluster, "cluster", false);
        this.changeSelectField(newVal.category, "category", false);
        this.changeSelectField(newVal.subCategory, "subCategory", false);
        this.changeSelectField(newVal.state, "state", false);
        this.changeSelectField(newVal.customerId, "customerId");

        this.storeValue("isLeafStoreGM", newVal.isLeafStoreGM);
        this.storeValue("productId", newVal.productId);
        this.storeValue("finYear", newVal.finYear);
        this.regionCode = newVal.region;
        this.ppgValue = newVal.productId;
      }
    },
  },

  async mounted() {
    this.fetchListCustomer(true);
    this.fetchAucklandData();
    this.storeValue("finYear", this.$moment().year());
  },

  methods: {
    async onKeyAccountChange(keyAccount) {
      let selectedState;

      if (isNil(keyAccount)) {
        this.clearFilterForm();
      } else {
        this.regionCode = keyAccount.region;

        /** fetch list of state based on the region on this key account */
        this.stateList = await this.fetchSelectedList(
          keyAccount.region,
          this.stateApiUrl
        );

        if (this.stateList.length > 0 && !this.promotionId) {
          selectedState = this.stateList[0].code;
        }

        const currentFilters = cloneDeep(this.filterPpgForm);

        this.filterPpgForm = {
          ...currentFilters,
          region: keyAccount.region,
          customerId: keyAccount.id,
          state: selectedState,
        };

        this.filterParameters = {
          ...this.filterParameters,
          keyAccountCode: keyAccount.keyAccountCode,
        };
        this.$emit("filterParameters", this.filterParameters);

        /** clear value of the ppg dropdown */
        this.storeValue("productId", "");

        this.ppgLoading = true;
        this.changeFilterPpg();
      }
    },

    clearFilterForm() {
      this.regionCode = "";

      const currentFilters = cloneDeep(this.filterPpgForm);

      this.filterPpgForm = {
        ...currentFilters,
        region: "",
        customerId: null,
        state: null,
      };

      /** clear value of the ppg dropdown */
      this.storeValue("productId", "");
      this.ppgList = [];
    },

    async onFinYearChange(value) {
      this.storeValue("finYear", value);
      if (!this.pPGValue) return;
      const params = {
        productCode: this.pPGValue,
        customerId: this.filterPpgForm.customerId,
        finYear: this.filterFormParam.finYear,
        state: this.filterPpgForm.state,
        subCategory: this.filterPpgForm.subCategory,
        isChangedFinYear: true,
      };
      const apiEndpoint = this.checkPromoApiUrl;

      await this.axios
        .get(apiEndpoint, { params })
        .then((res) => {
          let { data } = res;
          if (this.promotionId != data.promotionId)
            this.$router.push(
              `/promotion-planning/promo-optimization/` + data.promotionId
            );
        })
        .catch((err) => {
          this.displayErrorNotification(err);
        });
    },

    onPPGChange(value) {
      if (value) {
        this.storeValue("productId", value.code);
        this.storeValueFilter(value.subCategory, "subCategory");

        const checkPromoValue = {
          productCode: value.code,
          customerId: this.filterPpgForm.customerId,
          finYear: this.filterFormParam.finYear,
          state: this.filterPpgForm.state,
          subCategory: this.filterPpgForm.subCategory,
        };

        const formValues = {
          isLeafStoreGM:
            this.filterPpgForm.isLeafStoreGM ||
            this.filterFormParam.isLeafStoreGM,
        };

        this.checkExistScenario(checkPromoValue, formValues);
      }
    },

    async changeSelectField(e, name, isFilterPpg = true) {
      let listSubCategories = [];
      let listCategories = [];

      this.storeValueFilter(e, name);

      switch (name) {
        case "category":
          listSubCategories = await this.fetchSelectedList(
            e,
            this.subCatApiUrl
          );
          this.subCatList = listSubCategories.filter(
            (item) => item.code !== "-1"
          );
          this.$emit("filterParameters", { [name]: e });
          break;

        case "cluster":
          listCategories = await this.fetchSelectedList(e, this.categoryApiUrl);
          this.categoryList = listCategories.filter(
            (item) => item.code !== "-1"
          );
          this.$emit("filterParameters", { [name]: e });
          break;

        case "region":
          /** fetch list of state based on the region on this POT */
          this.stateList = await this.fetchSelectedList(e, this.stateApiUrl);
          break;

        case "isLeafStoreGM":
          this.filterParameters = { ...this.filterParameters, [name]: e };
          this.$emit("filterParameters", this.filterParameters);
          break;
      }
      if (isFilterPpg) {
        this.storeValue("productId", "");
        this.ppgLoading = true;
        this.changeFilterPpg();
      }
    },

    storeValue(resourceKey, value) {
      const filterFormParam = this.filterFormParam;
      this.filterFormParam = { ...filterFormParam, [resourceKey]: value };
    },

    storeValueFilter(value, resourceKey) {
      const filterPpgForm = this.filterPpgForm;
      this.filterPpgForm = { ...filterPpgForm, [resourceKey]: value };
    },

    async changeFilterPpg() {
      this.storeValue("customerId", this.filterPpgForm.customerId);
      let hasFilter = Object.values(this.filterPpgForm).some((v) => v);

      if (!hasFilter) {
        this.ppgList = [];
        return;
      }

      const feQueryString = this.generateFeString({
        CustomerId: this.filterPpgForm.customerId,
        Region: this.filterPpgForm.region,
        State: this.filterPpgForm.state,
        Cluster: this.filterPpgForm.cluster,
        Category: this.filterPpgForm.category,
        SubCategory: this.filterPpgForm.subCategory,
      });

      this.ppgList = await this.fetchSelectedList(
        null,
        this.ppgApiUrl + "?" + `${feQueryString}&isPromotionOptimization=true`,
        true
      );

      this.ppgLoading = false;
    },

    goToDetail(promotionId) {
      this.$router.push(
        `/promotion-planning/promo-optimization/` + promotionId
      );
    },

    createPromoOptis(valueCreate) {
      this.axios
        .post(this.createPOApiUrl, valueCreate)
        .then((res) => {
          let { data: value } = res;
          this.goToDetail(value.id);
        })
        .catch((err) => {
          this.displayErrorNotification(err);
        });
    },

    async checkExistScenario(valuesCheck, valueCreate) {
      let queries = "";
      for (const [key, value] of Object.entries(valuesCheck)) {
        queries += `${key}=${value}&`;
      }
      const apiEndpoint = this.checkPromoApiUrl + "?" + queries;
      const hasScenario = await this.axios.get(apiEndpoint);

      if (!hasScenario.data.isExist) {
        this.askToCreate(valuesCheck, valueCreate);
      } else {
        this.goToDetail(hasScenario.data.promotionId);
      }
    },

    askToCreate(valuesCheck, valueCreate) {
      this.$confirm({
        title: "Do you want to create new Scenario?",
        content: "Cannot find any scenario matching with your filter.",
        onOk: () => {
          this.createPromoOptis({ ...valuesCheck, ...valueCreate });
        },
        onCancel: () => {
          this.storeValue("productId", this.ppgValue);
        },
      });
    },

    onChangeAccountGroupOption(val) {
      if (val === "true") {
        this.keyAccountValue = this.newWorldAucklandData.id;

        this.onKeyAccountChange(this.newWorldAucklandData);

        this.isAccountGroup = true;
      } else {
        this.keyAccountValue = this.promoEntry
          ? this.promoEntry.customerId
          : null;

        this.isAccountGroup = false;
      }
    },

    async fetchListCustomer(excludeNorthIsland = true) {
      try {
        let feQueryString = "";

        if (excludeNorthIsland) {
          const queries = {
            KeyAccountCode: {
              operator: FILTERS_NOT_EQUAL,
              value: [...NEW_WORLD_AUCKLAND_CODE, NEW_WORLD_WGTN_SHOPRITE_CODE],
            },
          };

          feQueryString = "&" + this.generateFeString(queries);
        }

        const customerEndpoint =
          this.customerApiUrl + "?all=false" + feQueryString;
        const { data } = await this.axios.get(customerEndpoint);

        if (data && data.results && data.results.length > 0) {
          this.listKeyAccounts = [...data.results];
        } else {
          this.listKeyAccounts = [];
        }
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },

    async fetchAucklandData() {
      try {
        const feQueryString = this.generateFeString(
          {
            KeyAccountCode: {
              operator: FILTERS_EQUAL,
              value: [...NEW_WORLD_AUCKLAND_CODE],
            },
          },
          "or"
        );
        const aucklandEndpoint = `${this.customerApiUrl}?all=false&${feQueryString}`;

        const { data } = await this.axios.get(aucklandEndpoint);

        if (data && data.results && data.results.length > 0) {
          this.newWorldAucklandData = {
            ...data.results[0],
            keyAccount: "New World DTS",
          };

          /** remove all the elements if has */
          this.northIslandKeyAccounts = [];

          /** then, the northIslandKeyAccounts contains only new world auckland */
          this.northIslandKeyAccounts.push(this.newWorldAucklandData);
        } else {
          this.northIslandKeyAccounts = [];
        }
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.po-filter {
  .filter-title {
    color: #272d35;
    font-weight: 500;
    font-size: 16px;
  }
}
</style>
