<template>
  <filter-drawer-composer
    :default-query-strings="defaultQueryStrings"
    :has-filter-inactive="false"
    :is-advanced-filtered="isAdvancedFiltered"
  >
    <select-filter
      key="State"
      :allow-clear="true"
      :data-source="stateList"
      label="State"
      source="code"
      source-description="description"
      :source-label="(opt) => generateLabel(opt, ['region', 'description'])"
    />

    <select-filter
      key="Category"
      :allow-clear="true"
      label="Category"
      :queries="[['All', false]]"
      reference="promotion-planning.common.categories"
      source="code"
      source-description="description"
      :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
    />

    <select-filter
      key="PPGCode"
      :allow-clear="true"
      label="PPG"
      :queries="[
        ['All', false],
        ['paging', true],
        ['Include', true],
        ['distinct', true],
      ]"
      reference="promotion-planning.common.products"
      search-by="Code,Description"
      :search-by-depends-on-value="true"
      source="code"
      source-description="description"
      :source-label="(opt) => generateLabel(opt, ['code', 'description'])"
    />

    <select-filter
      key="Status"
      :allow-clear="true"
      label="Status"
      mode="multiple"
      reference="promotion-planning.promo-status"
      source="name"
      source-description="name"
      source-label="name"
    />
  </filter-drawer-composer>
</template>

<script>
const apiUrl = import.meta.env.VITE_API_URL;
import { PromoUtils } from "@/utils";

export default {
  name: "FilterPromoEntry",

  mixins: [PromoUtils],

  inject: ["can", "crud", "resourceProps"],
  data() {
    const [yearProps] = this.resourceProps;

    return {
      defaultAdvancedFilters: {
        Category: undefined,
        PPGCode: undefined,
        State: undefined,
        Status: undefined,
      },
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      stateList: [],
      yearProps,
    };
  },

  computed: {
    advancedFilterKeys() {
      return Object.keys(this.defaultAdvancedFilters);
    },

    advancedFilters() {
      return Array.from(this.crud.getFilters())
        .filter(([key]) => this.advancedFilterKeys.includes(key))
        .map(([key, filter]) => ({
          key,
          value: filter.value,
        }))
        .reduce(
          (filters, filter) => ({ ...filters, [filter.key]: filter.value }),
          {}
        );
    },

    commonYears() {
      return this.yearProps.crud.getList();
    },

    defaultYear() {
      const finYear = this.commonYears.find((year) => year.isDefault);
      return finYear ? finYear.year : null;
    },

    defaultQueryStrings() {
      return [["year", this.defaultYear]];
    },

    isAdvancedFiltered() {
      return Object.entries(this.advancedFilters).some(
        ([key, value]) => value !== this.defaultAdvancedFilters[key]
      );
    },
  },

  mounted() {
    this.getDataState();
  },

  methods: {
    async getDataState() {
      const filterRegion = this.crud.getFilter("Region");
      this.stateList = await this.fetchSelectedList(
        filterRegion ? filterRegion.value : "",
        this.stateApiUrl
      );
    },
  },
};
</script>
