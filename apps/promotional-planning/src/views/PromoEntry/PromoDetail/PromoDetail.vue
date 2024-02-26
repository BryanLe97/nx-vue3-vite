<template>
  <div :class="['promo-detail', isStaging ? 'promo-detail--staging' : '']">
    <bread-crumb :items="itemsMenu" />

    <div class="header mb-5 px-5 pb-3">
      <span class="header-title">Promo Details {{ suffixHeader }}</span>
    </div>

    <promo-filter class="margin-bottom-for-slide" />
    <portal-target name="promotion-slider-edit-entry-footer" />
  </div>
</template>

<script>
import { ADD_PERMISSION } from "@kraftheinz/common";

import { PROMO_SALES_REVIEW } from "@/constants/pp.status";

import PromoFilter from "../PromoComponents/PromoFilter.vue";
const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "PromoDetail",

  components: {
    PromoFilter,
  },

  inject: ["canProps", "resourceProps"],

  provide() {
    return {
      fetchYTDVolume: this.fetchYTDVolume,
    };
  },

  data() {
    const [entryPermissions] = this.canProps;
    const [
      promoEntryProps,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ytdTableProps,
    ] = this.resourceProps;
    const id = this.$route.params.id;

    return {
      entryPermissions,
      itemsMenu: [
        {
          key: "landingPage",
          title: "PromoDB Home Page",
          path: "/promotion-planning/landing-page",
        },
        {
          key: "promoDetails",
          title: "Promo Details",
          path: `/promotion-planning/promo-entries/${id}`,
        },
      ],
      permissions: {
        add: ADD_PERMISSION,
      },
      promoEntryProps,
      record: {},
      ytdTableProps,
      id: this.$route.params.id,
    };
  },

  computed: {
    isStaging() {
      return this._.get(this.promoEntry, "statusCode") == PROMO_SALES_REVIEW;
    },

    promoEntry() {
      return this.promoEntryProps.crud.getEntity();
    },

    suffixHeader() {
      return this.isStaging ? "- Staging" : "";
    },
  },
  watch: {
    "$route.params.id": function(newId) {
      this.id = newId;
      this.itemsMenu[1].path = `/promotion-planning/promo-entries/${newId}`;
    },
  },
  methods: {
    async fetchYTDVolume() {
      this.ytdTableProps.crud.deleteFilter("IsInactive");
      this.ytdTableProps.crud.deletePagination();
      await this.ytdTableProps.crud.fetchList(
        `${apiUrl}/promotion-planning/promo-entries/${this.id}/comparison`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.promo-detail {
  ::v-deep {
    .ant-form-item {
      margin-bottom: 0 !important;
    }

    .ant-tabs-nav-container {
      padding-left: 0;
    }

    .ant-card,
    .ant-card-body,
    .ant-spin-nested-loading {
      height: 100%;
    }

    .margin-bottom-for-slide {
      margin-bottom: 70px;
    }
  }

  &--staging {
    background-color: #fffbe6;
  }

  .header {
    background-color: white;
  }

  .filter-title {
    color: black;
    font-weight: 500;
  }

  .header-title {
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .arrow-left {
    font-size: 18px;
  }
}
</style>
