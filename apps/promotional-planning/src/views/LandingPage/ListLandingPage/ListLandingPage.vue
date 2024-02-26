<template>
  <div>
    <list-composer
      :actions-width="97"
      :show-clear-filters-button="false"
      :default-query-strings="defaultQueryStrings"
      :fetch-on-first-mount="false"
      :has-active="false"
      :has-filter-inactive="false"
      ph-search-by="Search by PPG"
      search-by="Name"
      :scroll="{ x: 1600 }"
      title="PromoDB Home Page"
    >
      <template #customFilter>
        <a-row class="mr-0 w-100" type="flex" :gutter="[8, 8]">
          <a-col :span="6">
            <select-input
              allow-clear
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :disabled="isFetchingList"
              placeholder="Select Region"
              reference="promotion-planning.common.regions"
              source="code"
              source-label="description"
              source-description="description"
              :value="regionFilter.value"
              @change="onFilter(filterKeys.region, $event)"
            />
          </a-col>

          <a-col :span="6">
            <select-input
              allow-clear
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :disabled="isFetchingList"
              mode="multiple"
              :max-tag-count="1"
              placeholder="Select Key Account"
              reference="promotion-planning.common.customers"
              source="id"
              :source-label="
                (opt) => generateLabel(opt, ['keyAccountCode', 'keyAccount'])
              "
              source-description="keyAccount"
              :value="customerFilter.value"
              @change="onFilter(filterKeys.customer, $event)"
            />
          </a-col>

          <a-col :span="6">
            <select-input
              allow-clear
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :disabled="isFetchingList"
              placeholder="Select Cluster"
              :queries="filterQueries"
              reference="promotion-planning.common.clusters"
              source="code"
              source-label="description"
              source-description="description"
              :value="clusterFilter.value"
              @change="onFilter(filterKeys.cluster, $event)"
            />
          </a-col>
          <a-col :span="6">
            <a-button
              type="primary"
              :disabled="isFetchingList"
              @click="fetchList"
            >
              Apply Filters
            </a-button>
          </a-col>
          <a-col :span="6">
            <select-input
              allow-clear
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :disabled="isFetchingList"
              :option-filter="(subCategory) => subCategory.code !== '-1'"
              placeholder="Select Sub Category"
              reference="promotion-planning.common.sub-categories"
              source="code"
              :source-label="
                (opt) => generateLabel(opt, ['code', 'description'])
              "
              source-description="description"
              :value="subCategoriesFilter.value"
              @change="onFilter(filterKeys.subCategory, $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              allow-clear
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              reference="promotion-planning.common.plans"
              :disabled="isFetchingList"
              source="name"
              source-label="name"
              source-description="name"
              :value="scenarioFilter.value"
              placeholder="Select Scenario"
              @change="onFilter(filterKeys.scenario, $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :default-value="defaultYear"
              reference="promotion-planning.common.year"
              :disabled="isFetchingList"
              source="year"
              source-label="year"
              source-description="year"
              :value="yearFilter.value"
              placeholder="Select Year"
              @change="onFilter(filterKeys.year, $event)"
            />
          </a-col>

          <a-col :span="6">
            <a-button
              :disabled="isFetchingList"
              icon="close-circle"
              @click="onClearFiltersClick"
            >
              Clear Filters
            </a-button>
          </a-col>
        </a-row>
      </template>

      <template #create-buttons="{ onClick }">
        <a-space :size="8">
          <a-button type="primary" @click="openTableau">
            Tableau Dashboard
          </a-button>
          <a-button v-if="canAdd" type="primary" @click="onClick">
            Add POT
          </a-button>
        </a-space>
      </template>

      <text-field
        key="RegionDescription"
        data-index="regionDescription"
        title="Region"
        :width="100"
        :sorter="true"
      />

      <text-field
        key="StateDescription"
        data-index="stateDescription"
        title="State"
        :width="150"
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
        key="SubCategoryDescription"
        data-index="subCategoryDescription"
        title="Subcategory"
        :width="200"
        :sorter="true"
      />

      <url-field
        key="Name"
        class-name="word-break-all"
        :base-url="getBaseUrlOfDetailPage"
        data-index="name"
        title="PPG"
        :sorter="true"
        :width="350"
        :clickable="hasViewPermission"
      />

      <tag-field
        key="Status"
        data-index="status"
        title="Status"
        :width="150"
        :sorter="true"
        :color="getStatusColor"
      />

      <freq-check-icon-field
        key="NewFreqCheck"
        data-index="newFreqCheck"
        title="Freq Check"
        :sorter="true"
        :width="150"
        align="center"
      />

      <tooltip-field
        key="Notes"
        data-index="notes"
        title="Notes"
        :parse="parseComment"
        :width="250"
      />

      <text-field
        key="EffectiveFromDate"
        allow-html
        data-index="effectiveWeeks"
        title="Effective Weeks"
        :parse="parseEffectiveWeeks"
        :width="200"
        :sorter="true"
      />

      <text-field
        key="LastUpdated"
        data-index="lastUpdated"
        title="Last Updated"
        :parse="parseLastUpdated"
        :width="200"
        :sorter="true"
      />

      <template #action="{ record }">
        <div class="d-flex justify-content-center">
          <div class="action__icon-container">
            <a-tooltip>
              <template #title>POT</template>
              <a-button
                icon="dollar"
                type="link"
                :disabled="!record.isPOTEnabled"
                @click="goToPOTDetail(record)"
              />
            </a-tooltip>
          </div>

          <div class="action__icon-container">
            <a-tooltip>
              <template #title>Promo Details</template>
              <a-button
                icon="calendar"
                type="link"
                :disabled="!record.isPromoDetailEnabled"
                @click="goToEntryDetail(record)"
              />
            </a-tooltip>
          </div>
        </div>
      </template>
    </list-composer>
  </div>
</template>

<script>
import {
  ADD_POT_PERMISSION,
  DUPLICATE_PERMISSION,
  PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL,
  VIEW_PERMISSION,
} from "@kraftheinz/common";

import {
  PROMO_STATUS_COLORS,
  POT_STATUSES,
  PROMO_SALES_REVIEW,
  PROMO_SALES_ACCEPTED,
  PROMO_SALES_PLAN,
  PROMO_DATE_FORMAT_FOR_SALE,
} from "@/constants";
import { PromoUtils } from "@/utils";

export default {
  name: "ListPromo",

  inject: ["can", "crud", "resourceProps", "resourceName"],

  mixins: [PromoUtils],

  data() {
    const [, , , subCategoryProps, , yearProps] = this.resourceProps;

    return {
      filterKeys: {
        cluster: "Cluster",
        customer: "CustomerId",
        region: "Region",
        scenario: "scenarioName",
        subCategory: "SubCategory",
        year: "year",
      },
      isLoading: true,
      permissions: {
        view: VIEW_PERMISSION,
        duplicate: DUPLICATE_PERMISSION,
      },
      proEntryStatus: {
        salePlan: PROMO_SALES_PLAN,
        saleAccepted: PROMO_SALES_ACCEPTED,
        saleReview: PROMO_SALES_REVIEW,
      },
      promoIncludedNotes: ["salereview", "revmanreview"],
      subCategoryProps,
      subCategories: [],
      tableauUrl:
        "https://analytics.kraftheinz.com/#/site/CrossFunctionalAnalytics/views/PromoExecutionandCompliance/LandingPage?:origin=card_share_link&:embed=n",
      yearProps,
    };
  },

  computed: {
    canAdd() {
      return this.$can(
        ADD_POT_PERMISSION,
        PROMOTIONAL_PLANNING_PROMO_OPTIMIZATION_DETAIL
      );
    },

    hasViewPermission() {
      return this.can(this.permissions.view);
    },

    regionFilter() {
      return this.crud.getFilter(this.filterKeys.region) || "";
    },

    clusterFilter() {
      return this.crud.getFilter(this.filterKeys.cluster) || "";
    },

    customerFilter() {
      return this.crud.getFilter(this.filterKeys.customer) || "";
    },

    subCategoriesFilter() {
      return this.crud.getFilter(this.filterKeys.subCategory) || "";
    },

    scenarioFilter() {
      return this.crud.getQueryString(this.filterKeys.scenario) || "";
    },

    yearFilter() {
      return this.crud.getQueryString(this.filterKeys.year) || "";
    },

    filterQueries() {
      return [["All", false]];
    },

    commonYears() {
      return this.yearProps.crud.getList();
    },

    defaultYear() {
      const finYear = this.commonYears.find((year) => year.isDefault);
      return finYear ? finYear.year : null;
    },

    defaultQueryStrings() {
      return [{ key: this.filterKeys.year, value: this.defaultYear }];
    },

    isFetchingList() {
      return (
        this.$store.state[this.resourceName].isFetchingList || this.isLoading
      );
    },
  },

  watch: {
    defaultYear(newVal) {
      this.onFilter(this.filterKeys.year, newVal);
      this.fetchList();
    },
  },

  created() {
    this.crud.setPagination({ page: 1, pageSize: 40 });
    this.subCategoryProps.crud.deleteFilter("IsInactive");
    this.fetchList();
  },
  beforeUpdate() {
    this.isLoading = false;
  },

  methods: {
    fetchList() {
      this.crud.fetchList();
    },

    async onClearFiltersClick() {
      this.crud.clearFilters();
      this.crud.deleteQueryStrings();
      this.crud.deleteFilter("IsInactive");
      this.onFilter(this.filterKeys.year, this.$moment().year());
      this.fetchList();
    },

    getStatusColor(value, record) {
      return PROMO_STATUS_COLORS[record.statusCode];
    },

    parseDate(date) {
      return this.$moment(date).format(PROMO_DATE_FORMAT_FOR_SALE);
    },

    parseLastUpdated(value, record) {
      return `${this.parseDate(value)} by ${record.fullName}`;
    },

    parseEffectiveWeeks(value) {
      return value
        .map(
          (week) =>
            `${this.parseDate(week.fromDate)} - ${this.parseDate(week.toDate)}`
        )
        .join("<br />");
    },

    getBaseUrlOfDetailPage(record) {
      return POT_STATUSES.includes(record.statusCode)
        ? `/promotion-planning/promo-optimization/${record.promotionOptimisationId}`
        : `/promotion-planning/promo-entries/${record.promotionEntryId}`;
    },

    goToPOTDetail(record) {
      if (!record) return;
      this.$router.push({
        name: "POEdit",
        params: { id: record.promotionOptimisationId },
        query: {
          status: record.statusCode,
        },
      });
    },

    goToEntryDetail(record) {
      if (!record) return;

      this.$router.push({
        name: "PromoEdit",
        params: {
          id: record.promotionEntryId,
        },
      });
    },

    getFilterOperator(key) {
      switch (key) {
        case this.filterKeys.customer:
          return "In";

        default:
          return "Eq";
      }
    },

    async onFilter(key, value) {
      if (!value || (Array.isArray(value) && !value.length)) {
        switch (key) {
          case this.filterKeys.scenario:
          case this.filterKeys.year:
            this.crud.deleteQueryString(key);
            break;

          default:
            this.crud.deleteFilter(key);
            break;
        }
      } else {
        switch (key) {
          case this.filterKeys.scenario:
          case this.filterKeys.year:
            this.crud.setQueryString(key, value);
            break;

          default:
            this.crud.setFilter(key, {
              operator: this.getFilterOperator(key),
              value,
            });
            break;
        }
      }
    },

    hasComment(status) {
      return this.promoIncludedNotes.includes(status);
    },

    openTableau() {
      window.open(this.tableauUrl, "_blank");
    },

    parseComment(value, record) {
      const { listComment, statusCode } = record;

      return !this.hasComment(statusCode) || !listComment || !listComment.length
        ? ""
        : listComment.join("\n");
    },
  },
};
</script>

<style lang="scss">
.filter-box-year {
  width: 125px;
}

.action__icon-container {
  display: inline-block;
  margin-left: 2px;
  margin-right: 2px;

  ::v-deep {
    .ant-btn > .anticon {
      margin-top: 3px;
    }
  }
}

.ant-tooltip {
  .ant-tooltip-inner {
    white-space: pre-line;
  }
}

.ant-tag-sales-plan-ic {
  color: #f9fafb;
  background: #f5222d;
  border: 1px solid #f5222d;
}
</style>
