<template>
  <div :class="customPaddingTop" class="list">
    <a-row v-if="title || hasCreate" class="list__title pt-2 pb-4">
      <a-col v-if="title" :span="16">
        <h2 class="mb-0">{{ title }}</h2>
      </a-col>

      <a-col class="list__add-btn" :offset="title ? 0 : 12" :span="8">
        <a-row>
          <a-col>
            <slot name="create-buttons" :onClick="onAddClick">
              <a-button
                v-if="
                  (hasMaintainPermission || hasCreatePermission) && hasCreate
                "
                type="primary"
                @click="onAddClick"
              >
                {{ createButtonText || `Add ${title}` }}
              </a-button>
            </slot>
          </a-col>
          <a-col>
            <slot name="custom-buttons"></slot>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <div :class="'list__table ' + customPaddingTable">
      <div
        :class="[
          'list__basic-filters',
          'd-flex',
          'justify-content-between',
          customMarginFilter,
        ]"
      >
        <div class="d-flex align-items-end w-100">
          <div v-if="labelItemCount" class="h7">{{ itemCount }}</div>
          <active-filter
            v-if="hasActive"
            class="mr-2"
            :disabled="isLoading"
            :custom-url="customUrl"
            :has-custom-filter-inactive="hasCustomFilterInactive"
          />

          <slot name="customFilter"></slot>

          <a-button
            v-if="showClearFiltersButton && hasFilter && hasAdvancedSearch"
            :disabled="isLoading"
            icon="close-circle"
            @click="onClearFiltersClick"
          >
            Clear filters
          </a-button>
        </div>

        <div class="d-flex align-items-end filter-container pl-2">
          <slot name="customFilterRight"></slot>

          <a-tooltip v-if="searchBy">
            <template #title>{{ phSearchBy }}</template>
            <keyword-filter
              :disabled="isLoading"
              :field="searchBy"
              :custom-url="customUrl"
              :custom-query="customQuery"
              :placeholder="phSearchBy"
            />
          </a-tooltip>

          <a-badge :dot="isAdvancedFiltered">
            <a-button
              v-if="hasFilter && hasAdvancedSearch"
              class="ml-2"
              :disabled="isLoading"
              @click="onAdvancedSearchClick"
            >
              Advanced Search
            </a-button>
          </a-badge>

          <a-dropdown
            v-if="dynamicColumns"
            v-model="visibleDropdown"
            class="ml-2"
            :trigger="['click']"
          >
            <template #overlay>
              <a-menu class="dynamic-columns">
                <a-checkbox-group
                  :value="checkedList"
                  :options="plainOptions"
                  @change="onChange"
                />

                <a-menu-item class="dynamic-columns__buttons">
                  <a-button @click="handleCancelClick">Cancel</a-button>
                  <a-button
                    type="primary"
                    class="dynamic-columns__buttons--ok"
                    @click="handleApplyColumns"
                  >
                    OK
                  </a-button>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button icon="bars" @click="handleChecked">
              Hide/Show Columns
            </a-button>
          </a-dropdown>

          <template>
            <slot name="customButton" :fetchList="fetchList"></slot>
          </template>
        </div>
      </div>

      <list-table
        bordered
        :children="children"
        :custom-row="customRow"
        :loading="isLoading || loadingTable"
        :data-source="resourceList"
        :pagination="pagination"
        :row-key="rowKey"
        :row-selection="rowSelection"
        :scroll="scroll"
        :sorter="sorter"
        :table-change-handler="onTableChange"
        @delete="onDeleteClick"
        @edit="onEditClick"
      />
    </div>
  </div>
</template>

<script>
  /** EIR is edit in row */

  import {
    ADD_PERMISSION,
    CREATE_PERMISSION,
    DEL_ITEM_PERMISSION,
    DELETE_PERMISSION,
    EDIT_PERMISSION,
    MAINTAIN_PERMISSION,
  } from "@/constants/index.js";

  var columnsActive = [];
  var plainOptions = [];
  var defaultCheckedList = [];

  import ListTable from "./ListTable.vue";

  export default {
    name: "List",

    components: { ListTable },

    props: {
      children: {
        type: Array,
        required: true,
      },
      actionsWidth: {
        type: Number,
        default: 78,
      },
      /**
       * configDelete: {
       *   source: String,        // source
       *   sourceLabel: String,   // name label delete
       *   icon: "delete",        // icon delete
       * }
       */
      configDelete: {
        type: Object,
        default: null,
      },
      createButtonText: {
        type: String,
        default: "",
      },
      customCol: {
        type: Object,
        default: null,
      },
      customMarginFilter: {
        type: String,
        default: "mb-3",
      },
      customPaddingTable: {
        type: String,
        default: "p-5",
      },
      customPaddingTop: {
        type: String,
        default: "",
      },
      customQuery: {
        type: String,
        default: "",
      },
      customUrl: {
        type: String,
        default: "",
      },
      customUrlEditInRow: {
        type: String,
        default: "",
      },
      customTableRow: {
        type: Function,
        default: null,
      },
      dataSource: {
        type: Array,
        default: null,
      },
      /**
       * @type {Array<{ key: string, operator: string, value: any }>}
       */
      defaultFilters: {
        type: Array,
        default: () => [],
      },
      /**
       * @type {Array<{ key: string, value: any }>}
       */
      defaultQueryStrings: {
        type: Array,
        default: () => [],
      },
      disabledRow: {
        type: Object,
        default: null,
      },
      dynamicColumns: {
        type: Boolean,
        default: false,
      },
      fetchOnFirstMount: {
        type: Boolean,
        default: true,
      },
      filters: {
        type: Object,
        default: null,
      },
      hasAction: {
        type: Boolean,
        default: true,
      },
      hasActive: {
        type: Boolean,
        default: true,
      },
      hasAdvancedSearch: {
        type: Boolean,
        default: true,
      },
      hasCustomFilterInactive: {
        type: Boolean,
        default: false,
      },
      hasDelete: {
        type: Boolean,
        default: false,
      },
      hasDeleteDeactive: {
        type: Boolean,
        default: false,
      },
      hasEditInRow: {
        type: Boolean,
        default: false,
      },
      hasFilterInactive: {
        type: Boolean,
        default: true,
      },
      hidePagination: {
        type: Boolean,
        default: false,
      },
      hasSizeChanger: {
        type: Boolean,
        default: true,
      },
      labelItemCount: {
        type: String,
        default: null,
      },
      listDetailOf: {
        type: String,
        default: null,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      onlyCustomQuery: {
        type: Boolean,
        default: false,
      },
      onSelectChange: {
        type: Function,
        default: () => {},
      },
      /**
       * If List is used within a Resource which has multiple resources,
       * we extract the correct resource props from the resources object using
       * reference.
       */
      reference: {
        type: String,
        default: null,
      },
      rowKey: {
        type: [String, Number],
        default: "id",
      },
      scroll: {
        type: Object,
        default: undefined,
      },
      showClearFiltersButton: {
        type: Boolean,
        default: true,
      },
      phSearchBy: {
        type: String,
        default: "Search by keywords",
      },
      searchBy: {
        type: String,
        default: null,
      },
      selectedRowKeys: {
        type: Array,
        default: undefined,
      },
      sourceDelete: {
        type: String,
        default: "",
      },
      setFirstPageOnChangePageSize: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "",
      },
      trackingColumns: {
        type: String,
        default: "",
      },
      urlTrackingColumn: {
        type: String,
        default: "",
      },
    },

    inject: {
      apiUrl: { default: "apiUrl" },
      can: { default: "can" },
      canProps: { default: "canProps" },
      createRoute: { default: "createRoute" },
      crud: { default: "crud" },
      editRoute: { default: "editRoute" },
      filterRoute: { default: "filterRoute" },
      hasCreate: { default: "hasCreate" },
      hasEdit: { default: "hasEdit" },
      hasFilter: { default: "hasFilter" },
      resourceName: { default: "resourceName" },
      resourceIdName: { default: "resourceIdName" },
      resources: { default: "resources" },
    },

    data() {
      defaultCheckedList = [];
      plainOptions = [];

      const resource = this.reference ? this.resources[this.reference] : {};

      return {
        dataEditInRow: null,
        editForm: {},
        isEdit: false,
        editingKey: null,
        isEditingInRow: false,
        isFetchingList: false,
        loadingTable: false,
        columnsActive,
        visibleDropdown: false,
        checkedList: [],
        plainOptions,
        ...resource,
      };
    },

    computed: {
      isAdvancedFiltered() {
        return this.crud.getIsAdvancedFiltered();
      },

      isLoading() {
        return (
          this.$store.state[this.resourceName].isFetchingList || this.loading
        );
      },

      isReplacing() {
        return this.$store.state[this.resourceName].isReplacing;
      },

      itemCount() {
        let count = 0;

        if (this.dataSource) {
          count = this.crud.getPagination().count || this.dataSource.length;
        } else if (this.listDetailOf) {
          const list = this._.get(
            this.crud.getEntity(),
            `${this.listDetailOf}`,
            []
          );

          count = list.length;
        } else {
          count = this.crud.getPagination().count;
        }

        return `${this.labelItemCount} (${count})`;
      },

      pagination() {
        if (this.hidePagination) return false;

        const { page, count, pageSize } = this.crud.getPagination();

        return {
          current: page,
          showSizeChanger: this.hasSizeChanger,
          showTotal: this.showTotal,
          total: count || 0,
          pageSize,
        };
      },

      resourceList() {
        let list = [];

        if (this.dataSource) {
          list = [...this.dataSource];
        } else if (this.listDetailOf) {
          list = this._.get(this.crud.getEntity(), `${this.listDetailOf}`, []);
        } else {
          list = [...this.crud.getList()];
        }

        if (this.editingKey) {
          list = list.map((item) => {
            if (item[this.resourceIdName] == this.editingKey)
              return {
                ...item,
                editable: true,
              };

            return item;
          });
        }

        if (this.filters) {
          const { key, items } = this.filters;

          list = list.filter((item) => !items.includes(item[key]));
        }

        return list;
      },

      rowSelection() {
        if (!this.selectedRowKeys) return undefined;

        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
        };
      },

      sorter() {
        return this.crud.getSorter();
      },

      primaryPermission() {
        if (this.can) return null;
        return this.canProps.find((permission) => permission.isPrimary);
      },

      hasMaintainPermission() {
        if (this.can)
          return this.can(MAINTAIN_PERMISSION) || this.can(EDIT_PERMISSION);

        return (
          this.primaryPermission.can(MAINTAIN_PERMISSION) ||
          this.primaryPermission.can(EDIT_PERMISSION)
        );
      },

      hasCreatePermission() {
        if (this.can)
          return this.can(CREATE_PERMISSION) || this.can(ADD_PERMISSION);

        return (
          this.primaryPermission.can(CREATE_PERMISSION) ||
          this.primaryPermission.can(ADD_PERMISSION)
        );
      },

      hasDeletePermission() {
        if (this.can) return this.can(DELETE_PERMISSION);
        return this.primaryPermission.can(DELETE_PERMISSION);
      },

      hasDelPermission() {
        if (this.can) return this.can(DEL_ITEM_PERMISSION);
        return this.primaryPermission.can(DEL_ITEM_PERMISSION);
      },
    },

    watch: {
      resourceList(val) {
        /** in case we don't use the api */
        if (this.dataSource) return;

        const pagination = this.crud.getPagination();
        if (val.length == 0 && pagination.page > 1) {
          this.crud.setPagination({
            ...this.crud.getPagination(),
            page: pagination.page - 1,
            pageSize: pagination.pageSize,
          });

          this.fetchList();
        }
      },
    },

    created() {
      if (!this.hasFilterInactive || this.hasCustomFilterInactive) {
        this.crud.deleteFilter("IsInactive");
      }

      if (this.hasCustomFilterInactive) {
        this.crud.setQueryString("IsInactive", false);
      }

      if (!this.dataSource && this.fetchOnFirstMount) {
        this.fetchList();
      }

      if (this.dynamicColumns) {
        this.getCheckedListColumns();
      }
    },

    async mounted() {
      if (this.hasEditInRow) {
        this.cacheData = this.crud.getList().map((item) => ({ ...item }));
      }
    },

    methods: {
      setColumnActive() {
        var dataNew = [];
        for (var i = 0; i < this.checkedList.length; i++) {
          const found = this.children.find(
            (e) => e.key === this.checkedList[i]
          );
          if (found) dataNew.push(found);
        }
        this.columnsActive = dataNew;
      },

      setDefaultFilters() {
        if (this.defaultFilters.length) {
          this.defaultFilters.forEach(({ key, operator, value }) => {
            this.crud.setFilter(key, { operator, value });
          });
        }

        if (this.defaultQueryStrings.length) {
          this.defaultQueryStrings.forEach(({ key, value }) => {
            this.crud.setQueryString(key, value);
          });
        }
      },

      getCheckedListColumns() {
        this.axios
          .get(this.urlTrackingColumn)
          .then((response) => {
            this.checkedList = response.data[this.trackingColumns]
              ? response.data[this.trackingColumns]
              : defaultCheckedList;
            this.setColumnActive();
          })
          .catch((err) => console.error(err));
      },

      handleChecked() {
        this.getCheckedListColumns();
      },

      onChange(checkedList) {
        this.checkedList = checkedList;
      },

      handleCancelClick() {
        this.visibleDropdown = false;
      },

      handleApplyColumns() {
        const dataCheckList = {
          [this.trackingColumns]: this.checkedList,
        };
        this.axios
          .post(this.urlTrackingColumn, dataCheckList)
          .then(() => {
            this.setColumnActive();
            this.showNotification("success", "Table Updated");
            this.visibleDropdown = false;
          })
          .catch((err) => console.error(err));
      },

      async fetchList() {
        if (this.listDetailOf) {
          await this.crud.fetchEntity(this.customUrl);
          return;
        }

        await this.crud.fetchList(
          this.customUrl,
          true,
          true,
          this.customQuery,
          this.onlyCustomQuery
        );
      },

      toggleActive(record) {
        return () =>
          this.crud
            .submitPartialEntity({
              resourceName: this.resourceName,
              id: record.id,
              customUrl: this.customUrl
                ? `${this.customUrl}/${record[this.resourceIdName]}`
                : null,
              data: [
                {
                  op: "replace",
                  path: "/IsInactive",
                  value: !record.isInactive,
                },
              ],
            })
            .then(() => this.fetchList())
            .catch((err) => console.error(err));
      },

      showTotal(total, range) {
        return `Viewing ${range[0]}-${range[1]} of ${total}`;
      },

      customRow(record) {
        /**
         * Identities Apis are still using 'isActive' property,
         * this is a temporary fix until they make changes
         */

        if (this.customTableRow && typeof this.customTableRow == "function") {
          return this.customTableRow(record);
        }

        if (record.isInactive || ("isActive" in record && !record.isActive)) {
          return { class: "list__item--inactive" };
        }

        if (
          this.disabledRow &&
          record[this.disabledRow.field] &&
          record[this.disabledRow.field] === this.disabledRow.condition
        ) {
          return { class: "list__item--inactive" };
        }

        return {};
      },

      onAddClick() {
        this.$router.push(this.createRoute);
      },

      onClearFiltersClick() {
        this.crud.clearFilters();
        this.crud.deleteQueryStrings();

        if (!this.hasFilterInactive) {
          this.crud.deleteFilter("IsInactive");
        }

        this.crud.setIsAdvancedFiltered(false);
        this.setDefaultFilters();
        this.fetchList();
      },

      onAdvancedSearchClick() {
        this.$router.push(this.filterRoute);
      },

      onTableChange(pagination, filters, sorter) {
        const { current, pageSize } = pagination;

        const currentPagination = this.crud.getPagination();
        const currentPage = currentPagination.pageSize;

        this.crud.setPagination({
          ...currentPagination,
          page:
            this.setFirstPageOnChangePageSize && pageSize !== currentPage
              ? 1
              : current,
          pageSize,
        });

        const { columnKey, order } = sorter;

        this.crud.setSorter({ columnKey, order });
        this.fetchList();
      },

      onDeleteClick(record) {
        let icon,
          okType,
          title,
          content,
          sourceDel = "",
          sourceLabelDel = "";

        if (this.configDelete) {
          sourceDel = this.configDelete.source
            ? `"${record[this.configDelete.source]}"`
            : "";
          sourceLabelDel = this.configDelete.sourceLabel || "";
          icon = this.configDelete.icon;
        }

        if (record[this.rowKey]) {
          title = `Do you want to delete ${sourceLabelDel} ${sourceDel}?`;
          content = `If you click Yes, you won’t be able to undo this Delete operation. Are you sure you want delete ${sourceLabelDel} ${sourceDel}?`;
          okType = "danger";
        }

        this.$confirm({
          class: "list__modal-delete",
          icon: icon || "warning",
          title,
          content,
          cancelText: "Cancel",
          okText: "Delete",
          okType,
          onOk: this.onDestroyEntity(record),
        });
      },

      onDestroyEntity(record) {
        const customUrlDel = this.customUrl
          ? `${this.customUrl}/${record[this.rowKey]}`
          : null;
        return () =>
          this.crud
            .destroyEntity(customUrlDel, record[this.rowKey])
            .then(() => this.fetchList())
            .catch((err) => console.error(err));
      },

      onToggleActiveClick(record, customTitle = null, type = null) {
        let icon, okType, title;

        if (record.isInactive) {
          title = "Do you want to Activate this item?";
          icon = "eye";
          okType = "primary";
        } else {
          title = customTitle
            ? customTitle
            : "Do you want to Deactivate this item?";
          icon = type ? type : "eye-invisible";
          okType = "danger";
        }

        this.$confirm({
          class: "list__modal-confirm",
          icon,
          title,
          cancelText: "No",
          okText: "Yes",
          okType,
          onOk: this.toggleActive(record),
        });
      },

      onDeleteDeactiveClick(record) {
        if (record.isInactive) return;

        let icon, okType, title;

        if (record.id) {
          title =
            "Do you want to Delete Cluster " +
            `"${
              this.sourceDelete ? record[this.sourceDelete] : record.clusterName
            }"?`;
          icon = "warning";
          okType = "danger";
        }

        this.$confirm({
          class: "list__modal-delete",
          icon,
          title,
          cancelText: "Cancel",
          okText: "Delete",
          okType,
          onOk: () => {
            this.crud
              .submitPartialEntity({
                resourceName: this.resourceName,
                id: record.id,
                customUrl: this.customUrl
                  ? `${this.customUrl}/${record[this.resourceIdName]}`
                  : null,
                data: [
                  {
                    op: "replace",
                    path: "/IsInactive",
                    value: true,
                  },
                ],
              })
              .catch((error) => {
                this.showErrorMsg(error);
              });
          },
        });
      },

      toggleEIR(record) {
        if (record.editable) {
          this.editingKey = null;
        } else {
          this.editingKey = record[this.resourceIdName];
        }
      },

      onEditClick(record, hasDetail = false) {
        if (this.hasEditInRow) {
          this.editForm = {};
          this.toggleEIR(record);
          return;
        }

        const editRoute = this.editRoute.replace(
          ":id",
          hasDetail
            ? `detail/${record[this.resourceIdName]}`
            : record[this.resourceIdName]
        );

        this.$router.push(editRoute);
      },

      // cancel edit in row
      onCancelEIR(record) {
        this.toggleEIR(record, false);
        this.editForm = {};
      },

      storeValue(value, resourceKey, resourcePath) {
        this.editForm = {
          ...this.editForm,
          [resourceKey]: { value, resourcePath },
        };

        this.crud.updateEntity("editForm", {
          resourceKey,
          value,
          resourcePath,
        });
        this.isEdit = Object.keys(this.editForm).length > 0 ? true : false;
      },

      textInputChange({ target: { value } }, resourceKey) {
        this.storeValue(value, resourceKey);
      },

      // update data edit in row
      onSaveEIR(record) {
        this.loadingTable = true;
        this.isEditingInRow = true;

        const customUrl = this.customUrlEditInRow
          ? this.customUrlEditInRow.replace(
              "RECORD_ID",
              record[this.resourceIdName]
            )
          : "";

        const data = [];

        Object.entries(this.editForm).forEach(([key, value]) => {
          data.push({
            op: "replace",
            path: `/${value.resourcePath || key}`,
            value: value.value,
          });
        });

        this.editForm = {};

        this.crud
          .submitPartialEntity({
            resourceName: this.resourceName,
            customUrl,
            data,
          })
          .then((response) => {
            if (this.listDetailOf) {
              const { data } = response;

              const indexItem = this.resourceList.findIndex(
                (item) =>
                  item[this.resourceIdName] == record[this.resourceIdName]
              );

              const listDetails = this.resourceList;

              listDetails[indexItem] = data;

              this.crud.setEntity({
                ...this.crud.getEntity(),
                [this.listDetailOf]: listDetails,
              });
            }

            this.toggleEIR(record);
            this.isEdit = false;
          })
          .catch(() => {
            this.toggleEIR(record, false);
          })
          .finally(() => {
            this.isEditingInRow = false;
            this.loadingTable = false;
            this.fetchList();
          });
      },

      showNotification(type, message) {
        this.$notification[type]({ message });
      },

      showErrorMsg(err) {
        this.$notification["error"]({
          message: err.response.data.message || "Errors encountered!",
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }

  .list {
    width: 100%;
  }

  .bg-white {
    background: white !important;
  }

  .label-option-select {
    font-weight: bold;
    color: #272d35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dynamic-columns {
    .ant-checkbox-group {
      max-height: 450px;
      overflow-y: auto;
      display: grid;
      padding: 4px 12px 8px !important;
      margin-bottom: 10px;
    }

    .ant-checkbox-group-item {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }

  .dynamic-columns__buttons {
    border-top: 1px solid #e7e7e7;
    display: flex;
    justify-content: flex-end;

    &.ant-dropdown-menu-item {
      &:hover {
        background-color: transparent;
      }
    }

    .dynamic-columns__buttons--ok {
      margin-left: 12px;
    }
  }
</style>

<style lang="scss">
  /** fix an issue of the background color of the fixed header caused by the scrollbar */
  .ant-table-bordered.ant-table-fixed-header
    .ant-table-scroll
    .ant-table-header {
    &::-webkit-scrollbar {
      border: 1px solid #cdd3db !important;
      border-left: 0 !important;
    }
  }
  .ant-table-fixed-header {
    .ant-table-scroll .ant-table-header {
      &::-webkit-scrollbar {
        border: 1px solid #eaedf0 !important;
      }
    }
  }
  .ant-table-hide-scrollbar {
    &::-webkit-scrollbar {
      background-color: #eaedf0 !important;
    }
  }

  ::-webkit-scrollbar {
    border-radius: 0 !important;
  }
</style>
