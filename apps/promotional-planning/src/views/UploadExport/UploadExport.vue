<template>
  <div>
    <list-composer
      title="Upload/Export"
      search-by="UploadFormat,FileName"
      ph-search-by="Search by Upload Format, File Name"
      :has-active="false"
    >
      <template #create-buttons>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item
              v-for="field in uploadTypes"
              :key="field.key"
              :disabled="field.disabled"
            >{{ field.name }}</a-menu-item>
          </a-menu>

          <a-button type="default" icon="upload">
            Upload
            <a-icon type="down" />
          </a-button>
        </a-dropdown>

        <a-button type="default" class="ml-2" icon="download" @click="exportFile">Export</a-button>
      </template>

      <template #customFilter>
        <div class="status-filter mr-2">
          <select-filter
            source="code"
            default-active-first-option
            source-label="name"
            :data-source="uploadTypesFilter"
            @change="onFiltersChange('UploadFormat', $event)"
          />
        </div>

        <div class="status-filter mr-2">
          <select-filter
            source="code"
            default-active-first-option
            source-label="name"
            :data-source="months"
            @change="onFiltersChange('Month', $event)"
          />
        </div>
      </template>

      <text-field
        key="UploadFormat"
        base-url="/promotion-planning/fixedterms"
        data-index="uploadFormat"
        title="Upload Format"
        :sorter="true"
        :width="150"
      />

      <text-field key="FileName" data-index="fileName" title="File Name" :sorter="true" />

      <text-field
        key="CreatedAt"
        data-index="createdAt"
        title="Date & Time"
        :parse="parseDate"
        :sorter="true"
        :width="150"
      />

      <text-field key="CreatedBy" data-index="createdBy" title="Uploaded by" :sorter="true" />
      <text-field key="Success" data-index="success" title="Upload Success" :width="150" />

      <tag-field
        key="Status"
        :color="getStatusColor"
        data-index="status"
        title="Status"
        :width="100"
      />

      <template #action="{ record }">
        <a-tooltip>
          <template #title>Detail</template>
          <a-button icon="profile" size="small" type="link" @click="onDetailClick(record)" />
        </a-tooltip>
      </template>
    </list-composer>

    <export-promo :visible.sync="visibleExport" />
    <upload-form :visible.sync="visibleUpload" :type="uploadType" />

    <a-modal :footer="false" :visible="visibleUploadDetails" @cancel="closeModalUploadDetails">
      <upload-details :error-files="uploadsDetail" title="Details" :has-description="false" />
    </a-modal>
  </div>
</template>

<script>
import {
  FILTERS_EQUAL,
  UPLOAD_MASS_ACCEPTANCE,
  UPLOAD_MASS_DELETION,
  UPLOAD_POT_LIST,
  UPLOAD_PUBLISH,
  UPLOAD_SALES_PLAN,
} from "@kraftheinz/common";

import ExportPromo from "@/views/Common/ExportPromo.vue";
import UploadForm from "@/views/Common/UploadForm.vue";
import UploadDetails from "@/views/Common/UploadDetails.vue";

const apiUrl = import.meta.env.VITE_API_URL;

const uploadTypesFilter = [
  {
    code: "All",
    name: "All format",
    key: "1",
    disabled: false,
  },
  {
    code: "Promotion List",
    name: "Promotion List",
    key: "2",
    disabled: false,
  },
  {
    code: "Sales Plan",
    name: "Sales Plan",
    key: "3",
    disabled: false,
    permissionCode: UPLOAD_SALES_PLAN,
  },
  {
    code: "Price Volume History",
    name: "Price Volume History",
    key: "4",
    disabled: true,
  },
  {
    code: "POT",
    name: "POT",
    key: "5",
    disabled: false,
    permissionCode: UPLOAD_POT_LIST,
  },
  {
    code: "Mass Publish",
    name: "Mass Publish",
    key: "6",
    disabled: false,
    permissionCode: UPLOAD_PUBLISH,
  },
  {
    code: "Mass Acceptance",
    name: "Mass Acceptance",
    key: "7",
    disabled: false,
    permissionCode: UPLOAD_MASS_ACCEPTANCE,
  },
  {
    code: "Mass Deletion",
    name: "Mass Deletion",
    key: "8",
    disabled: false,
    permissionCode: UPLOAD_MASS_DELETION,
  },
];

const incompleteStatus = ["Processing", "In Proccess", "In Progress"];
const failedStatus = ["Failed"];
const partiallyCompletedStatus = ["Partially Completed"];

export default {
  name: "UploadExport",

  inject: ["can", "crud"],

  components: {
    ExportPromo,
    UploadForm,
    UploadDetails,
  },

  data() {
    const months = [
      {
        code: 0,
        name: "This month",
      },
      ...Array.from(Array(12).keys()).map((_, i) => ({
        code: i + 1,
        name: this.$moment()
          .month(i)
          .format("MMMM"),
      })),
    ];

    return {
      apiUrl,
      filtersLoaded: 0,
      months,
      uploadType: 1,
      uploadsDetail: {},
      uploadTypesFilter,
      visibleExport: false,
      visibleUpload: false,
      visibleUploadDetails: false,
    };
  },

  computed: {
    uploadList() {
      return this.crud.getList();
    },

    uploadTypes() {
      return uploadTypesFilter.filter(
        (type) =>
          type.key !== "1" &&
          (!type.permissionCode || this.can(type.permissionCode))
      );
    },
  },

  watch: {
    uploadList(newVal) {
      if (this.fetchListInterval)
        this.fetchListInterval = clearInterval(this.fetchListInterval);
      if (newVal.some((val) => incompleteStatus.includes(val.status)))
        this.fetchListInterval = setInterval(
          this.crud.fetchList.bind(this.crud),
          10000
        );
    },
  },

  created() {
    this.onFiltersChange("Month", { operator: FILTERS_EQUAL, value: 0 });
  },

  beforeDestroy() {
    if (this.fetchListInterval)
      this.fetchListInterval = clearInterval(this.fetchListInterval);
  },

  methods: {
    exportFile() {
      this.visibleExport = true;
    },

    handleMenuClick(event) {
      this.uploadType = parseInt(event.key);
      this.visibleUpload = true;
    },

    parseDate(value) {
      if (!value) return "";
      return this.$moment(value).format("DD/MM/YYYY HH:mm");
    },

    onDetailClick(record) {
      this.axios
        .get(`${this.apiUrl}/promotion-planning/uploads/${record.id}`)
        .then((res) => {
          this.uploadsDetail = res.data;
          this.visibleUploadDetails = true;
        })
        .catch((err) => {
          this.$notification.error({
            message:
              this._.get(err, "response.data.message") || "Errors encountered",
          });
        });
    },

    getStatusColor(value) {
      if (
        incompleteStatus.includes(value) ||
        partiallyCompletedStatus.includes(value)
      ) {
        return "primary-6";
      }

      if (failedStatus.includes(value)) {
        return "error-6";
      }

      return "success-6";
    },

    onFiltersChange(key, filter) {
      let { value } = filter;

      this.filtersLoaded++;
      this.crud.setFilter(key, filter);
      this.crud.setPagination({ page: 1 });

      switch (key) {
        case "UploadFormat":
          if (value === "All") this.crud.deleteFilter(key);
          break;

        case "Month":
          if (value === 0) {
            this.crud.setFilter(key, {
              ...filter,
              value: this.$moment().month() + 1,
            });
          }
          break;
      }

      this.filtersLoaded >= 4 && this.crud.fetchList();
    },

    closeModalUploadDetails() {
      this.visibleUploadDetails = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.status-filter {
  min-width: 153px;
}
</style>
