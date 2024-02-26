<template>
  <div class="export-promo">
    <simple-form v-slot="{ handleSubmit }">
      <a-modal
        title="Export Promo"
        :visible="visible"
        :width="1000"
        destroy-on-close
        @ok="handleSubmit(handleOk)"
        @cancel="handleCancel"
      >
        <div v-if="!isExported">
          <a-row :gutter="24" type="flex">
            <a-col v-if="typeExport != 1" :span="4">
              <week-picker
                form-item
                label="From week"
                placeholder="From week"
                show-start-of-week
                rules="required"
                format-date="DD-MM-YYYY"
                class="export-promo__week-picker"
                @change="storeValue('fromDate', $event)"
              />
            </a-col>

            <a-col v-else :span="4">
              <select-input
                label="From year"
                :data-source="getListYear(year - 1)"
                source-label="description"
                source="code"
                :value="year - 1"
                @change="storeValue('fromYear', $event)"
              />
            </a-col>

            <a-col v-if="typeExport != 1" :span="4">
              <week-picker
                form-item
                label="To week"
                placeholder="To week"
                rules="required"
                show-start-of-week
                format-date="DD-MM-YYYY"
                class="export-promo__week-picker"
                @change="storeValue('toDate', $event)"
              />
            </a-col>

            <a-col v-else :span="4">
              <select-input
                label="To year"
                :data-source="getListYear(year)"
                source-label="description"
                source="code"
                :value="year"
                @change="storeValue('toYear', $event)"
              />
            </a-col>

            <a-col :span="8">
              <select-input
                ref="customer"
                reference="promotion-planning.common.customers"
                label="Key Acount"
                placeholder="Key Acount"
                source="id"
                :source-label="
                  (val) =>
                    generateLabel(val, [
                      'region',
                      'keyAccountCode',
                      'keyAccount',
                    ])
                "
                @change="storeValue('customerId', $event)"
              />
            </a-col>

            <a-col :span="4">
              <select-input
                ref="region"
                reference="promotion-planning.common.regions"
                placeholder="Region"
                source="code"
                source-label="description"
                label="Region"
                @change="(event) => changeSelectField(event, 'region')"
              />
            </a-col>

            <a-col :span="4">
              <select-input
                ref="state"
                placeholder="State"
                source="code"
                :data-source="stateList"
                source-label="description"
                label="State"
                @change="storeValue('state', $event)"
              />
            </a-col>
          </a-row>

          <a-row :gutter="24" type="flex" class="mt-3">
            <a-col :span="8">
              <label :style="radioStyle">Export Format</label>

              <a-radio-group v-model="typeExport" @change="onExportTypeChange">
                <a-radio
                  v-for="type in exportTypes"
                  :key="type.value"
                  :value="type.value"
                  :disabled="type.disabled"
                  :style="radioStyle"
                >{{ type.name }}</a-radio>
              </a-radio-group>
            </a-col>
            <a-col :span="16">
              <a-row :gutter="24" type="flex">
                <a-col :span="12">
                  <select-input
                    ref="cluster"
                    reference="promotion-planning.common.clusters"
                    source="code"
                    placeholder="Cluster"
                    custom-query="All=false"
                    :source-label="
                      (val) => generateLabel(val, ['code', 'description'])
                    "
                    label="Cluster"
                    @change="(event) => changeSelectField(event, 'cluster')"
                  />
                </a-col>
                <a-col :span="12">
                  <select-input
                    ref="category"
                    label="Category"
                    placeholder="Category"
                    :data-source="categoryList"
                    :source-label="
                      (val) => generateLabel(val, ['code', 'description'])
                    "
                    source="code"
                    @change="(event) => changeSelectField(event, 'category')"
                  />
                </a-col>
              </a-row>
              <a-row :gutter="24" type="flex" class="mt-3">
                <a-col :span="12">
                  <select-input
                    ref="subCategory"
                    key="subCategorys"
                    source="code"
                    :data-source="subCatList"
                    placeholder="Subcategory"
                    :source-label="
                      (val) => generateLabel(val, ['code', 'description'])
                    "
                    label="Subcategory"
                    @change="(event) => changeSelectField(event, 'subCategory')"
                  />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="24" type="flex" class="mt-3">
            <a-col :span="8">
              <label :style="radioStyle">Version</label>
              <checkbox-input
                ref="isInactive"
                label="Active only"
                :value="true"
                @change="storeValue('isInactive', $event)"
              />
            </a-col>
            <a-col :span="16">
              <select-input
                ref="ppg"
                label="PPG"
                :source="typeExport == 1 ? 'id' : 'entryId'"
                placeholder="PPG"
                :source-label="
                  (val) =>
                    generateLabel(
                      val,
                      typeExport == 1
                        ? ['code', 'description']
                        : ['finYear', 'code', 'description']
                    )
                "
                :data-source="ppgList"
                @change="
                  storeValue(typeExport == 1 ? 'productId' : 'entryId', $event)
                "
              />
            </a-col>
          </a-row>
        </div>
        <div v-else class="download-result">
          <a-icon type="cloud-download" />
          <br />
          <a-spin v-if="isDownload" tip="Preparing download..."></a-spin>
          <p v-else style="color: green">Download successful!</p>
          <div v-if="!isDownload">
            <a-icon type="file-excel" />&nbsp;
            <a
              v-if="data"
              @click="
                stringToCsvFile(
                  data.fileName,
                  data.data,
                  data.isExcel,
                  data.contentType
                )
              "
            >{{ data.fileName }}</a>
          </div>
        </div>

        <template slot="footer">
          <div v-if="!isExported">
            <a-button key="back" @click="handleCancel">Cancel</a-button>

            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleSubmit(handleOk)"
            >Export</a-button>
          </div>

          <div v-else>
            <a-button key="submit" type="primary" @click="handleCancel">OK</a-button>
          </div>
        </template>
      </a-modal>
    </simple-form>
  </div>
</template>
<script>
import { PayloadHandlerMixin } from "@kraftheinz/common";

import { PromoUtils } from "@/utils";
import { ExportTypes } from "@/constants";

const apiUrl = import.meta.env.VITE_API_URL;
const { EXPORT_TYPES, PROMOTION_LIST, PROMOTION_ANALYSIS, DEMANTRA } =
  ExportTypes;

export default {
  name: "ExportPromo",

  mixins: [PromoUtils, PayloadHandlerMixin],

  inject: ["crud"],

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  provide() {
    return {
      apiUrl,
    };
  },

  data() {
    const year = this.$moment().year();

    return {
      apiUrl,
      loading: false,
      exportTypes: EXPORT_TYPES,
      typeExport: PROMOTION_LIST,
      isExported: false,
      isDownload: true,
      data: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      filterFormParam: {},
      categoryApiUrl: `${apiUrl}/promotion-planning/common/categories`,
      ppgApiUrl: `${apiUrl}/promotion-planning/common/products`,
      entriesUrl: `${apiUrl}/promotion-planning/common/entries`,
      stateApiUrl: `${apiUrl}/promotion-planning/common/states`,
      subCatApiUrl: `${apiUrl}/promotion-planning/common/sub-categories`,
      year,
      categoryList: [],
      ppgList: [],
      stateList: [],
      subCatList: [],
    };
  },

  mounted() {
    this.storeValue("isInactive", true);
    this.storeValue("fromYear", this.year - 1);
    this.storeValue("toYear", this.year);
  },

  methods: {
    getListYear(year) {
      return [
        { code: year - 1, description: year - 1 },
        { code: year, description: year },
        { code: year + 1, description: year + 1 },
      ];
    },

    handleCancel() {
      this.$emit("update:visible", false);

      setTimeout(() => {
        this.filterFormParam = {};
        this.typeExport = PROMOTION_LIST;
        this.isExported = false;
        this.isDownload = true;
        this.files =
          this.errorFiles =
          this.categoryList =
          this.subCatList =
          this.stateList =
          this.ppgList =
            [];
      }, 200);
    },

    onExportTypeChange() {
      this.$refs.customer.setValue(undefined);

      if (this.typeExport == DEMANTRA) {
        this.$refs.region.setValue("AU");
        this.changeSelectField("AU", "region");
      } else {
        this.$refs.region.setValue(undefined);
      }

      this.$refs.state.setValue(undefined);
      this.$refs.cluster.setValue(undefined);
      this.$refs.category.setValue(undefined);
      this.$refs.subCategory.setValue(undefined);
      this.$refs.ppg.setValue(undefined);
      this.$refs.isInactive.setValue(true);
      this.filterFormParam = {};
      this.storeValue("isInactive", true);

      this.files =
        this.errorFiles =
        this.categoryList =
        this.subCatList =
        this.stateList =
        this.ppgList =
          [];
    },

    handleOk() {
      let queryExtra = "",
        exportUrl = "",
        responseType = "",
        isExcel = false;

      switch (this.typeExport) {
        case PROMOTION_LIST:
          queryExtra = `&fromYear=${
            this.filterFormParam.fromYear || this.year - 1
          }&toYear=${this.filterFormParam.toYear || this.year}`;
          isExcel = false;
          exportUrl = `${apiUrl}/promotion-planning/promo-entries/export-list`;

          break;

        case PROMOTION_ANALYSIS:
          queryExtra = `&fromDate=${this.$moment(
            this.filterFormParam.fromDate
          ).format("YYYY/MM/DD")}&toDate=${this.$moment(
            this.filterFormParam.toDate
          ).format("YYYY/MM/DD")}`;
          exportUrl = `${apiUrl}/promotion-planning/promo-entries/export-details`;
          responseType = "blob";
          isExcel = true;

          break;

        case DEMANTRA:
          queryExtra = `&fromDate=${this.$moment(
            this.filterFormParam.fromDate
          ).format("YYYY/MM/DD")}&toDate=${this.$moment(
            this.filterFormParam.toDate
          ).format("YYYY/MM/DD")}&region=${this.filterFormParam.region}`;

          exportUrl = `${apiUrl}/promotion-planning/promo-entries/export-demantra`;
          isExcel = false;

          break;
      }

      this.isExported = true;

      this.exportPromoList(
        this.typeExport,
        exportUrl,
        queryExtra,
        responseType,
        isExcel
      );
    },

    exportPromoList(typeExport, exportUrl, queryExtra, responseType, isExcel) {
      this.axios
        .get(
          exportUrl + "?" +
            this.generateFeString({
              ProductId: this.filterFormParam.productId,
              EntryId: this.filterFormParam.entryId,
              Region:
                typeExport == DEMANTRA
                  ? undefined
                  : this.filterFormParam.region,
              State: this.filterFormParam.state,
              CustomerId: this.filterFormParam.customerId,
              Cluster: this.filterFormParam.cluster,
              Category: this.filterFormParam.category,
              SubCategory: this.filterFormParam.subCategory,
              IsInactive: this.filterFormParam.isInactive ? false : null,
            }) +
            queryExtra,
          { responseType: responseType }
        )
        .then((res) => {
          let fileName = res.headers["filename"];
          this.data = {
            data: res.data,
            fileName: fileName,
            isExcel: isExcel,
            contentType: res.headers["content-type"],
          };
          this.stringToCsvFile(
            fileName,
            res.data,
            isExcel,
            res.headers["content-type"]
          );
          this.isDownload = false;
        })
        .catch((err) => {
          this.showErrorMsg(err);
          this.handleCancel();
        });
    },

    storeValue(resourceKey, value) {
      const filterFormParam = this.filterFormParam;

      this.filterFormParam = { ...filterFormParam, [resourceKey]: value };

      if (
        this.typeExport != PROMOTION_LIST &&
        this.filterFormParam.subCategory
      ) {
        this.fetchEntries();
      }
    },

    async changeSelectField(e, name) {
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
      } else {
        if (this.typeExport == PROMOTION_LIST) {
          this.ppgList = await this.fetchSelectedList(e, this.ppgApiUrl);
        }
        this.ppgList = this.ppgList.filter((e) => e.code !== "0");
        if (this.ppgList.length === 0) {
          this.enabledEntry = true;
          this.activeTabKey = "guardrails";
        }
      }

      this.storeValue(name, e);
    },

    async fetchEntries() {
      this.ppgList = await this.fetchSelectedList(
        null,
        this.entriesUrl + "?" +
          this.generateFeString({
            Region: this.filterFormParam.region,
            State: this.filterFormParam.state,
            CustomerId: this.filterFormParam.customerId,
            FinYear: this.filterFormParam.finYear,
            Cluster: this.filterFormParam.cluster,
            Category: this.filterFormParam.category,
            SubCategory: this.filterFormParam.subCategory,
          }) +
          `&fromDate=${this.$moment(this.filterFormParam.fromDate).format(
            "YYYY/MM/DD"
          )}&toDate=${this.$moment(this.filterFormParam.toDate).format(
            "YYYY/MM/DD"
          )}`,
        true
      );
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .anticon-cloud-download {
    color: #92a0b0;
    font-size: 50px;
    margin-bottom: 20px;
  }
}

.export-promo__week-picker {
  ::v-deep {
    .ant-row {
      margin-bottom: 0;
    }
    .ant-form-item-control {
      line-height: 32px;
    }
  }
}
.download-result {
  text-align: center;
  padding: 70px 0;
}
</style>
