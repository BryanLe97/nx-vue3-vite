<template>
  <div class="filter-drawer">
    <a-drawer
      :after-visible-change="afterVisibleChange"
      :closable="false"
      placement="right"
      :visible="visible"
      width="320"
      @close="onClose"
    >
      <template #title>
        <div class="h6">
          <span>Advanced Search</span>
        </div>
      </template>

      <a-row :gutter="8">
        <a-col
          v-for="field in fields"
          :key="field.key"
          :span="field.span || 24"
          class="filter-drawer__filter pb-3"
        >
          <component
            :is="field.tag"
            :value="
              field.type !== 'queryString'
                ? filters.get(field.key)
                : convertQueryString(field.key)
            "
            v-bind="field"
            @change="
              field.type !== 'queryString'
                ? storeFilter($event, field.key)
                : storeQueryString($event, field.key)
            "
          ></component>
        </a-col>
      </a-row>

      <div
        class="filter-drawer__actions mt-3 w-100 d-flex justify-content-between"
      >
        <a-button class="pl-0" type="link" @click="onClearAllClick">
          Clear all
        </a-button>

        <a-button type="primary" @click="onApplyClick">Apply</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import { RequestsTypes } from "@/store/modules/index.js";

  export default {
    name: "FilterDrawer",

    props: {
      fields: {
        type: Array,
        required: true,
      },
      customUrl: {
        type: String,
        default: "",
      },
      defaultFilters: {
        type: Array,
        default: null,
      },
      defaultQueryStrings: {
        type: Array,
        default: null,
      },
      hasFilterInactive: {
        type: Boolean,
        default: true,
      },
      isAdvancedFiltered: {
        type: Boolean,
        default: undefined,
      },
      /**
       * If FilterDrawer is used within a Resource which has multiple resources,
       * we extract the correct resource props from the resources object using
       * reference.
       */
      reference: {
        type: String,
        default: null,
      },
    },

    inject: ["crud", "redirectRoute", "resourceName", "resources"],

    data() {
      const resource = this.reference ? this.resources[this.reference] : {};

      return {
        visible: false,
        ...resource,
      };
    },

    computed: {
      filters() {
        return this.crud.getFilters();
      },

      isLoading() {
        const { namespace, REQUESTS_IS_LOADING } = RequestsTypes;
        return this.$store.getters[`${namespace}/${REQUESTS_IS_LOADING}`];
      },

      getQueryStrings() {
        return this.crud.getQueryStrings();
      },
    },

    mounted() {
      this.visible = true;
    },

    methods: {
      fetchList() {
        const { count, pageSize } = this.crud.getPagination();

        this.crud.setPagination({ count, page: 1, pageSize });
        this.crud.fetchList(this.customUrl);
      },

      storeFilter(filter, key) {
        this.crud.setFilter(key, filter);
      },

      storeQueryString(filter, key) {
        this.crud.setQueryString(key, filter.value);
      },

      onClose() {
        this.visible = false;
      },

      onClearAllClick() {
        this.crud.clearFilters();
        this.crud.deleteQueryStrings();

        if (this.defaultQueryStrings) {
          this.defaultQueryStrings.forEach((element) => {
            this.crud.setQueryString(element[0], element[1]);
          });
        }

        if (this.defaultFilters) {
          this.defaultFilters.forEach((element) => {
            this.crud.setFilter(element[0], element[1]);
          });
        }
        if (!this.hasFilterInactive) this.crud.deleteFilter("IsInactive");
        this.fetchList();
        this.crud.setIsAdvancedFiltered(false);
        this.visible = false;
      },

      onApplyClick() {
        this.fetchList();
        this.crud.setIsAdvancedFiltered(this.isAdvancedFiltered ?? true);
        this.visible = false;
      },

      afterVisibleChange(visible) {
        if (!visible) {
          this.$router.push(this.redirectRoute);
        }
      },

      convertQueryString(fieldKey) {
        let obj = {
          operator: "Eq",
          value: null,
        };
        let queryValues = this.getQueryStrings;

        if (!queryValues) return obj;

        if (!queryValues.includes("&")) {
          let value = queryValues.substr(
            queryValues.indexOf("=") + 1,
            queryValues.length
          );
          obj.value = value;
          return obj;
        }

        const arrQuery = queryValues.split("&");

        let item =
          arrQuery.length > 0
            ? arrQuery.filter(
                (val) => fieldKey === val.substring(0, val.indexOf("="))
              )[0]
            : null;
        let value = item
          ? item.substr(item.indexOf("=") + 1, item.length)
          : null;
        obj.value = value;

        return obj;
      },
    },
  };
</script>
