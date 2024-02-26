<template>
  <div class="list-retail">
    <div class="list-retail__filter card mx-4 mt-5 p-2">
      <simple-form v-slot="{ handleSubmit }">
        <a-row class="mr-0 w-100" type="flex" :gutter="[8, 8]">
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="required"
              label="Region"
              placeholder="Select Region"
              reference="promotion-planning.common.regions"
              source="code"
              source-label="description"
              source-description="description"
              :api-not-get-paging="true"
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :value="filterSelect.Region"
              @change="onFilter('Region', $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="required|max_selected:5"
              label="Key Account"
              mode="multiple"
              placeholder="Select Key Account"
              reference="promotion-planning.common.customers"
              source="id"
              source-description="keyAccount"
              :is-clear-when-params-change="true"
              :fetch-options-on-filter="true"
              :api-not-get-paging="true"
              :advanced-filters="queriesByRegion"
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :max-tag-count="2"
              :source-label="
                (opt) => generateLabel(opt, ['keyAccountCode', 'keyAccount'])
              "
              :value="filterSelect.CustomerId"
              @change="onFilter('CustomerId', $event)"
            />
          </a-col>
          <a-col :span="6">
            <span>Effective Weeks </span>
            <div class="d-flex cus-mt">
              <week-picker
                :form-item="isValidation"
                label="From week"
                class="flex-1 mr-2 d-block-span"
                :show-label="false"
                placeholder="From week"
                show-start-of-week
                rules="required"
                :value="effectiveWeek.fromDate"
                format-date="DD-MM-YYYY"
                @change="onChangeEffectiveDate('fromDate', $event)"
              />
              <week-picker
                :form-item="isValidation"
                label="To week"
                class="flex-1 ml-2 d-block-span"
                :show-label="false"
                placeholder="To week"
                show-start-of-week
                rules="required"
                format-date="DD-MM-YYYY"
                :value="effectiveWeek.toDate"
                :disabled="!effectiveWeek.fromDate"
                :disable-date="disabledDate"
                @change="onChangeEffectiveDate('toDate', $event)"
              />
            </div>
          </a-col>
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="required"
              label="Cluster"
              placeholder="Select Cluster"
              reference="promotion-planning.common.clusters"
              source="code"
              source-description="description"
              custom-query="all=false"
              :only-custom-query="true"
              :api-not-get-paging="true"
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :source-label="
                (opt) => generateLabel(opt, ['code', 'description'])
              "
              :value="filterSelect.Cluster"
              @change="onFilter('Cluster', $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="required"
              label="Category"
              placeholder="Select Category"
              reference="promotion-planning.common.categories"
              source="code"
              source-description="description"
              custom-query="all=false"
              :is-clear-when-params-change="true"
              :only-custom-query="true"
              :max-tag-count="2"
              :fetch-options-on-filter="true"
              :api-not-get-paging="true"
              :custom-url="
                `${apiUrl}/promotion-planning/common/categories/${filterSelect.Cluster}`
              "
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :source-label="
                (opt) => generateLabel(opt, ['code', 'description'])
              "
              :value="filterSelect.Category"
              @change="onFilter('Category', $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="required|max_selected:3"
              placeholder="Select Sub Category"
              reference="promotion-planning.common.sub-categories"
              source="code"
              source-description="description"
              label="Sub Category"
              mode="multiple"
              custom-query="all=false"
              :is-clear-when-params-change="true"
              :only-custom-query="true"
              :max-tag-count="2"
              :fetch-options-on-filter="true"
              :api-not-get-paging="true"
              :custom-url="
                `${apiUrl}/promotion-planning/common/sub-categories/${filterSelect.Category}`
              "
              :source-label="
                (opt) => generateLabel(opt, ['code', 'description'])
              "
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :value="filterSelect.SubCategory"
              @change="onFilter('SubCategory', $event)"
            />
          </a-col>
          <a-col :span="6">
            <select-input
              :form-item="isValidation"
              allow-clear
              rules="max_selected:10"
              label="PPG Code"
              mode="multiple"
              placeholder="Select PPG"
              reference="promotion-planning.common.products"
              source="code"
              source-description="description"
              custom-query="all=false&distinct=true"
              :source-label="
                (opt) => generateLabel(opt, ['code', 'description'])
              "
              :advanced-filters="ppgQueries"
              :fetch-options-on-filter="true"
              :is-clear-when-params-change="true"
              :api-not-get-paging="true"
              :clear-data-on-destroy="false"
              :clear-value-on-options-change="false"
              :max-tag-count="2"
              :value="filterSelect.PPGCode"
              @change="onFilter('PPGCode', $event)"
            />
          </a-col>
          <a-col :span="6" class="d-flex align-items-center">
            <a-button
              class="mr-2"
              @click="onClearFiltersClick"
              @mouseleave="setIsValidation"
            >
              Clear Filters
            </a-button>
            <a-button type="primary" @click="handleSubmit(fetchRetailPrice)">
              Apply Filters
            </a-button>
          </a-col>
        </a-row>
      </simple-form>
    </div>
    <div class="list-retail__table card mx-4 mb-5 mt-5 p-2">
      <div class="d-flex justify-content-end">
        Show Units
        <a-switch
          v-model="isShowUnits"
          :disabled="dataSource.length == 0"
          class="ml-2 mr-4 mb-2"
          @change="onShowUnit"
        />
      </div>
      <div
        v-if="dataSource.length > 0"
        class="ant-table ant-table-bordered ant-table-default ant-table-scroll-position-left ant-table-default"
      >
        <div class="ant-table-content">
          <div style="overflow: scroll;">
            <div class="ant-table-body" style="max-height: 500px;">
              <table class="table-hover scrolling-table">
                <colgroup>
                  <col key="week" style="width: 150px" />
                  <col
                    v-for="col in columns"
                    :key="col.key"
                    :style="{ width: col.width ? col.width + 'px' : 'auto' }"
                  />
                </colgroup>
                <thead class="ant-table-thead">
                  <tr>
                    <th
                      key="week"
                      class="fixed-table fixed-table__left fixed-table__top"
                      style="z-index: 200;"
                    >
                      Week
                    </th>
                    <th
                      v-for="col in columns"
                      :key="col.key"
                      class="ant-table-row-cell-break-word fixed-table fixed-table__top"
                    >
                      {{ col.title }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  v-for="(subCategories, idx) in dataSource"
                  :key="idx"
                  class="ant-table-tbody"
                >
                  <tr class="ant-table-row ant-table-row-level-0">
                    <td class="fixed-table fixed-table__left border-left-none">
                      <a-icon
                        v-if="subCategories.ppg && subCategories.ppg.length > 0"
                        class="mr-2"
                        :type="
                          !expandedRows.includes(subCategories.subCategoryCode)
                            ? 'plus-square'
                            : 'minus-square'
                        "
                        @click="toggleRow(subCategories.subCategoryCode)"
                      />{{ subCategories.subCategory }}
                    </td>
                    <td :colspan="columns.length"></td>
                  </tr>
                  <tr
                    v-if="expandedRows.includes(subCategories.subCategoryCode)"
                  >
                    <td
                      :colspan="Number(columns.length) + 1"
                      class="pd-0 border-left-none"
                    >
                      <table class="table-hover">
                        <colgroup>
                          <col key="week" style="width: 150px" />
                          <col
                            v-for="col in columns"
                            :key="col.key"
                            :style="{
                              width: col.width ? col.width + 'px' : 'auto',
                            }"
                          />
                        </colgroup>
                        <tbody
                          v-for="(ppg, idx) in subCategories.ppg"
                          :key="idx"
                          class="ant-table-tbody"
                        >
                          <tr class="ant-table-row ant-table-row-level-0">
                            <td
                              class="fixed-table fixed-table__left border-left-none"
                            >
                              <p class="ml-2">
                                <a-icon
                                  v-if="ppg.keyAcc.length > 0"
                                  class="mr-2"
                                  :type="
                                    !expandedRows.includes(ppg.ppgCode)
                                      ? 'plus-square'
                                      : 'minus-square'
                                  "
                                  @click="toggleRow(ppg.ppgCode)"
                                />{{ `${ppg.ppgCode} - ${ppg.ppg}` }}
                              </p>
                            </td>
                            <td :colspan="columns.length"></td>
                          </tr>
                          <tr v-if="expandedRows.includes(ppg.ppgCode)">
                            <td
                              :colspan="Number(columns.length) + 1"
                              class="pd-0 border-left-none"
                            >
                              <table
                                v-for="(keyAcc, idx) in ppg.keyAcc"
                                :key="idx"
                                class="ant-table-row ant-table-row-level-0"
                              >
                                <colgroup>
                                  <col key="week" style="width: 150px" />
                                  <col
                                    v-for="col in columns"
                                    :key="col.key"
                                    :style="{
                                      width: col.width
                                        ? col.width + 'px'
                                        : 'auto',
                                    }"
                                  />
                                </colgroup>
                                <tbody class="ant-table-tbody">
                                  <tr>
                                    <td
                                      class="fixed-table fixed-table__left border-left-none"
                                    >
                                      <p class="ml-4">
                                        {{
                                          `${keyAcc.keyAccountCode} - ${keyAcc.keyAccount}`
                                        }}
                                      </p>
                                    </td>
                                    <td
                                      v-for="(weeklyPrice,
                                      idx) in keyAcc.weeklyPrices"
                                      :key="idx"
                                      :class="{
                                        'custom-disabled': checkPermission(
                                          weeklyPrice
                                        ),
                                      }"
                                    >
                                      <a-dropdown
                                        :trigger="['click']"
                                        :disabled="checkPermission(weeklyPrice)"
                                      >
                                        <a
                                          class="ant-dropdown-link"
                                          @click="
                                            (e) =>
                                              e.preventDefault(
                                                onWeeklyPriceInputClick(
                                                  weeklyPrice
                                                )
                                              )
                                          "
                                        >
                                          <div
                                            v-if="!isShowUnits"
                                            class="number-input"
                                          >
                                            <div
                                              class="ant-input-number"
                                              :style="
                                                getcolorList(
                                                  keyAcc.guardrails,
                                                  weeklyPrice,
                                                  isShowUnits
                                                    ? weeklyPrice.unit
                                                    : false
                                                ).style
                                              "
                                            >
                                              <span
                                                class="ant-input-number-input d-flex align-items-center"
                                              >
                                                {{
                                                  formatCurrency(
                                                    weeklyPrice[keyWeekly]
                                                  )
                                                }}
                                              </span>
                                            </div>
                                          </div>
                                          <a-form-item
                                            v-else-if="
                                              isShowUnits &&
                                                weeklyPrice.seqNumber != 1
                                            "
                                            class="custom-error-form"
                                            has-feedback
                                            :validate-status="
                                              !weeklyPrice.unit &&
                                              weeklyPrice.promotionEntryId &&
                                              weeklyPrice.price
                                                ? 'error'
                                                : ''
                                            "
                                          >
                                            <div
                                              @mouseover="
                                                iDSelected = weeklyPrice.id
                                              "
                                              @mouseleave="iDSelected = null"
                                            >
                                              <a-tooltip
                                                overlay-class-name="has-error"
                                                :visible="
                                                  !weeklyPrice.unit &&
                                                    weeklyPrice.promotionEntryId &&
                                                    weeklyPrice.price &&
                                                    iDSelected == weeklyPrice.id
                                                "
                                              >
                                                <template
                                                  v-if="!weeklyPrice.unit"
                                                  #title
                                                >
                                                  Units cannot be blank
                                                </template>
                                                <number-input
                                                  :disabled="
                                                    checkPermission(weeklyPrice)
                                                  "
                                                  :class="{
                                                    'cursor-pointer': !isShowUnits,
                                                    'is-bold': getcolorList(
                                                      keyAcc.guardrails,
                                                      weeklyPrice,
                                                      isShowUnits
                                                        ? weeklyPrice.unit
                                                        : false
                                                    ).class,
                                                  }"
                                                  :type="
                                                    isShowUnits
                                                      ? 'number'
                                                      : 'currency'
                                                  "
                                                  :custom-style="
                                                    getcolorList(
                                                      keyAcc.guardrails,
                                                      weeklyPrice,
                                                      isShowUnits
                                                        ? weeklyPrice.unit
                                                        : false
                                                    ).style
                                                  "
                                                  :formatter="formatter"
                                                  :is-hide-arrow="true"
                                                  :is-blank="true"
                                                  :value="
                                                    weeklyPrice[keyWeekly]
                                                  "
                                                  @change="
                                                    onInputPrice(
                                                      weeklyPrice,
                                                      keyWeekly,
                                                      $event
                                                    )
                                                  "
                                                />
                                              </a-tooltip>
                                            </div>
                                          </a-form-item>
                                          <text-input v-else disabled />
                                        </a>
                                        <a-menu
                                          v-if="
                                            getGuardrailsList(
                                              keyAcc.guardrails,
                                              weeklyPrice
                                            ).length != 0 &&
                                              !isShowUnits &&
                                              !isShowUnits &&
                                              (!weeklyPrice.promotionEntryId ==
                                                0 ||
                                                !checkStartDate(
                                                  weeklyPrice.startDay
                                                ))
                                          "
                                          slot="overlay"
                                        >
                                          <template
                                            v-for="(guardrail,
                                            guardrailIdx) in getGuardrailsList(
                                              keyAcc.guardrails,
                                              weeklyPrice
                                            )"
                                          >
                                            <a-menu-item
                                              :key="guardrailIdx"
                                              :style="{
                                                cursor: !canRenderPromo(
                                                  guardrail
                                                )
                                                  ? 'not-allowed'
                                                  : 'pointer',
                                              }"
                                            >
                                              <a
                                                :disabled="
                                                  !canRenderPromo(guardrail)
                                                "
                                                class="text-right"
                                                :style="
                                                  `color: ${
                                                    getGuardrailsName(
                                                      guardrail.name
                                                    ).code
                                                  }; background-color: ${
                                                    getGuardrailsName(
                                                      guardrail.name
                                                    ).opacityColor
                                                  }`
                                                "
                                                href="javascript:;"
                                                @click="
                                                  onChangeRetail(
                                                    weeklyPrice,
                                                    guardrail,
                                                    getGuardrailsList(
                                                      keyAcc.guardrails,
                                                      weeklyPrice
                                                    )
                                                  )
                                                "
                                              >
                                                {{
                                                  formatCurrency(
                                                    guardrail[keyWeekly]
                                                  )
                                                }}
                                                <span
                                                  v-if="
                                                    guardrail.seqNumber != 1
                                                  "
                                                >
                                                  ({{
                                                    promoCounts[
                                                      guardrail.promotionEntryId
                                                    ][guardrail.seqNumber]
                                                      .remainFrequency
                                                  }})
                                                </span>
                                              </a>
                                            </a-menu-item>
                                          </template>
                                        </a-menu>
                                      </a-dropdown>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isLoading.table">
        <div class="d-flex flex-column align-items-center">
          <a-icon type="loading" />
        </div>
      </div>
      <div v-else>
        <div class="d-flex flex-column align-items-center">
          <a-icon type="inbox" :style="{ fontSize: '44px' }" />
          <p class="ant-empty-description">No Data</p>
        </div>
      </div>
    </div>
    <div class="list-retail__action d-flex justify-content-end px-5 py-3">
      <a-row class="list-retail-footer neutral-1" justify="end" type="flex">
        <a-tooltip
          overlay-class-name="weekly-price-entry__frequency-tooltip"
          placement="topRight"
        >
          <template v-if="overFrequency.isOver" #title>
            <div v-for="error in overFrequency.errors" :key="error.name">
              <span>
                <span :style="`color: ${getGuardrailsName(error.name).code}`">
                  {{ error.name }}
                </span>
                of
                <span class="font-weight-bold">{{ error.ppg }}</span> -
                <span class="font-weight-bold">{{ error.keyAcc }}</span>
                exceeds the guardrail weeks
              </span>
            </div>
          </template>

          <a-badge>
            <template v-if="overFrequency.isOver" #count>
              <a-icon
                theme="twoTone"
                type="exclamation-circle"
                two-tone-color="#fa8c16"
              />
            </template>

            <a-button
              type="primary"
              :loading="isLoading.save"
              :disabled="dataSource.length == 0 || overFrequency.isOver"
              @click="onSave"
            >
              Save
            </a-button>
          </a-badge>
        </a-tooltip>
      </a-row>
    </div>
  </div>
</template>

<script>
import { PromoUtils } from "@/utils";
import {
  PayloadHandlerMixin,
  FILTERS_EQUAL,
  FILTERS_IN,
  UPDATE_SUCCESS,
  EDIT_PRIOR_WEEK_PERMISSION,
  EDIT_PERMISSION,
  ErrorHandlerMixin,
} from "@kraftheinz/common";
import { COLOR_OBJECT_ENTRY_PRICE } from "@/constants/entry.price";
const eqOperator = ["CustomerId", "SubCategory", "PPGCode"];
const initialFilter = {
  Cluster: undefined,
  CustomerId: [],
  Region: undefined,
  Category: undefined,
  PPGCode: [],
  SubCategory: [],
};
const stateNational = { AU: "17", NZ: "08" };
export default {
  name: "ListRetail",
  mixins: [PromoUtils, PayloadHandlerMixin, ErrorHandlerMixin],
  inject: ["can", "crud", "apiUrl", "resourceProps"],
  data() {
    const [, , , , , productProps, ,] = this.resourceProps;
    return {
      productProps,
      filterSelect: { ...initialFilter },
      effectiveWeek: {
        fromDate: null,
        toDate: null,
      },
      dataSource: [],
      columns: [],
      expandedRows: [],
      errors: [],
      isShowUnits: false,
      isLoading: {
        save: false,
        table: false,
      },
      weeklyPrices: [],
      EDIT_PRIOR_WEEK_PERMISSION,
      EDIT_PERMISSION,
      objectColor: COLOR_OBJECT_ENTRY_PRICE,
      isValidation: true,
      promoCounts: {},
      clickedPromo: {
        promotionEntryId: null,
        seqNumber: null,
        unit: null,
        price: null,
      },
      iDSelected: null,
    };
  },
  computed: {
    queriesByRegion() {
      if (!this.filterSelect.Region) return null;
      return [
        [
          "Region",
          { operator: FILTERS_EQUAL, value: this.filterSelect.Region },
        ],
      ];
    },
    ppgQueries() {
      if (
        !this.filterSelect.Region ||
        !this.filterSelect.Cluster ||
        !this.filterSelect.Category ||
        !this.filterSelect.CustomerId ||
        !this.filterSelect.SubCategory
      )
        return null;
      return [
        [
          "Region",
          { operator: FILTERS_EQUAL, value: this.filterSelect.Region },
        ],
        [
          "CustomerId",
          { operator: FILTERS_IN, value: this.filterSelect.CustomerId },
        ],
        [
          "State",
          {
            operator: FILTERS_IN,
            value: stateNational[this.filterSelect.Region],
          },
        ],
        [
          "Cluster",
          { operator: FILTERS_EQUAL, value: this.filterSelect.Cluster },
        ],
        [
          "Category",
          { operator: FILTERS_EQUAL, value: this.filterSelect.Category },
        ],
        [
          "SubCategory",
          { operator: FILTERS_IN, value: this.filterSelect.SubCategory },
        ],
      ];
    },
    keyWeekly() {
      return this.isShowUnits ? "unit" : "price";
    },
    overFrequency() {
      let isOver = false;
      let errors = [];
      if (!this.promoCounts) return { isOver: isOver, errors: errors };
      for (const key in this.promoCounts) {
        if (this.promoCounts[key]) {
          const items = this.promoCounts[key];
          for (const itemKey in items) {
            if (items[itemKey]) {
              const item = items[itemKey];
              if (item.checkFrequency > item.frequency && item.seqNumber != 1) {
                isOver = true;
                errors.push({
                  name: item.name,
                  ppg: item.ppg,
                  keyAcc: item.keyAcc,
                });
              }
            }
          }
        }
      }
      return { isOver: isOver, errors: errors };
    },
  },
  async created() {
    this.crud.deleteFilter("IsInactive");
  },
  methods: {
    checkPermission(weeklyPrice) {
      return (
        !this.can(EDIT_PERMISSION) ||
        (!this.can(EDIT_PRIOR_WEEK_PERMISSION) &&
          this.checkStartDate(weeklyPrice.startDay)) ||
        weeklyPrice.promotionEntryId == 0
      );
    },

    isInputUnit(guardrails, unit, promotionEntryId, seqNumber) {
      const guardrailsSelected = guardrails.find(
        (val) =>
          val.unit == unit &&
          val.promotionEntryId == promotionEntryId &&
          val.seqNumber == seqNumber
      );
      return guardrailsSelected ? guardrailsSelected.name : "OverWrite";
    },

    getcolorList(colorList, weeklyPrice, unit) {
      const guardrailsName = colorList.find(
        (val) => val.seqNumber == weeklyPrice.seqNumber
      )?.name;
      if (unit) {
        const inputUnit = this.isInputUnit(
          colorList,
          unit,
          weeklyPrice.promotionEntryId,
          weeklyPrice.seqNumber
        );
        const getGuardrailsNameWithInputUnit = this.getGuardrailsName(
          inputUnit,
          guardrailsName
        );
        return {
          style: `color: ${getGuardrailsNameWithInputUnit.code}; background-color: ${getGuardrailsNameWithInputUnit.opacityColor}`,
          class: getGuardrailsNameWithInputUnit.bold,
        };
      }
      // the condition above will be true if the isShowUnit = true
      const getGuardrailsName = this.getGuardrailsName(guardrailsName);
      return this.checkPermission(weeklyPrice)
        ? {
            style: `color: ${getGuardrailsName.code}; background-color: #eaedf0; border: none`,
          }
        : {
            style: `color: ${getGuardrailsName.code}; background-color: ${getGuardrailsName.opacityColor}`,
          };
    },

    getGuardrailsName(key, keyIfUnitInput) {
      if (!key) return { code: "#000", opacityColor: "" };
      if (keyIfUnitInput) {
        return {
          code: this.objectColor[key.replace(/\s+/g, "")].code,
          opacityColor: this.objectColor[keyIfUnitInput.replace(/\s+/g, "")]
            .opacityColor,
          bold: this.objectColor[key.replace(/\s+/g, "")].bold,
        };
      }
      return this.objectColor[key.replace(/\s+/g, "")];
    },

    getGuardrailsList(arr, weeklyPrice) {
      return (
        arr.filter(
          (val) =>
            val.promotionEntryId == weeklyPrice.promotionEntryId &&
            val.price &&
            val.unit
        ) || null
      );
    },

    getListPromo() {
      const result = {};
      this.dataSource.forEach((category) => {
        category.ppg.forEach((ppg) => {
          ppg.keyAcc.forEach((keyAcc) => {
            keyAcc.guardrails.forEach((guardrail) => {
              const promotionEntryId = guardrail.promotionEntryId;
              const seqNumber = guardrail.seqNumber;
              if (!result[promotionEntryId]) {
                result[promotionEntryId] = {};
              }
              result[promotionEntryId][seqNumber] = {
                frequency: guardrail.frequency,
                remainFrequency: guardrail.remainFrequency,
                checkFrequency: guardrail.checkFrequency,
                name: guardrail.name,
                ppg: ppg.ppgCode,
                keyAcc: keyAcc.keyAccount,
                seqNumber: guardrail.seqNumber,
              };
            });
          });
        });
      });
      this.promoCounts = { ...result };
    },

    disabledDate(current) {
      if (!current) return false;
      // Get the current week
      //startDay change selectedWeek
      const fromDate = this.effectiveWeek.fromDate;
      const chosenDate = this.$moment(fromDate).startOf("week");
      const maxSelectableWeek = chosenDate.clone().add(53, "weeks");
      const minSelectableWeek = chosenDate
        .add(1, "days")
        .clone()
        .subtract(0, "weeks");
      // Calculate the week 52 weeks from now
      // Disable weeks beyond 52 weeks from now
      return current < minSelectableWeek || current > maxSelectableWeek;
    },

    formatCurrency(value) {
      if (!value) return;
      if (this.isShowUnits) return value;
      const [integerPart, decimalPart] = String(value).split("."); // split the int and the dec
      const limitedIntegerPart = integerPart.slice(0, this.interLength); // limit integer part to inter length characters
      const limitedDecimalPart = decimalPart
        ? decimalPart.slice(0, this.decimalLength)
        : null; // limit decimal part to decimal length characters if present
      const formattedInteger = limitedIntegerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      ); // add comma between the every three number
      return (
        `$ ${formattedInteger || "0"}` +
        (limitedDecimalPart
          ? `.${limitedDecimalPart}`
          : String(value).includes(".")
          ? "."
          : "")
      );
    },

    formatter(value) {
      if (!value || value == 0) return;
      return value;
    },

    getNumberOfDaysBetweenDates(startDate, endDate) {
      const datesAndMonthsArray = [];
      const currentDate = startDate;
      while (currentDate <= endDate) {
        datesAndMonthsArray.push({
          title: this.$moment(currentDate).format("DD MMM YY"),
          dataIndex: this.$moment(currentDate).format("DD/MMM/YYYY"),
          key: this.$moment(currentDate).format("DD/MMM/YYYY"),
          width: 100,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return datesAndMonthsArray;
    },

    async onClearFiltersClick() {
      this.isValidation = false;
      this.crud.clearFilters(),
        this.crud.deleteQueryStrings(),
        this.crud.deleteFilter("IsInactive");
      this.filterSelect = { ...initialFilter };
      this.effectiveWeek = {
        fromDate: null,
        toDate: null,
      };
      this.productProps.crud.clearList();
    },

    setIsValidation() {
      this.isValidation = true;
    },

    getAllCodeToExpand(arr) {
      arr.forEach((item) => {
        const keyAccCode = item.subCategoryCode;
        item.ppg.forEach((pggItem) => {
          const pggCode = pggItem.ppgCode;
          pggItem.keyAcc.forEach((keyItem) => {
            const subCode = keyItem.keyAccountCode;
            this.expandedRows.push(...[keyAccCode, pggCode, subCode]);
          });
        });
      });
    },

    async fetchRetailPrice() {
      try {
        this.isLoading.table = true;
        this.isShowUnits = false;
        this.dataSource = [];
        this.clickedPromo = {};
        await this.crud.fetchList();
        const data = await this.crud.getList();
        if (data) {
          this.expandedRows = [];
          this.dataSource = data[0].subCategories;
          this.getListPromo();
          await Promise.all([
            this.getAllCodeToExpand(this.dataSource),
            (this.columns = data[0].weeks.map((val) => ({
              title: this.$moment(val).format("DD MMM YY"),
              dataIndex: this.$moment(val).format("DD/MMM/YYYY"),
              key: this.$moment(val).format("DD/MMM/YYYY"),
              width: 100,
            }))),
          ]).finally(() => {
            this.isLoading.table = false;
            this.weeklyPrices = [];
            if (!this.filterSelect.PPGCode) {
              this.$notification.warning({
                message: "Only 20 PPGs are being displayed.",
              });
            }
          });
        }
      } catch (error) {
        this.isLoading.table = false;
        this.weeklyPrices = [];
        console.log(error);
      }
    },

    checkStartDate(dateToCheck) {
      var originalDate = new Date(dateToCheck);
      // Add 7 days to the original date
      originalDate.setDate(originalDate.getDate() + 7);
      return new Date() >= new Date(originalDate);
    },

    toggleRow(index) {
      if (this.expandedRows.includes(index)) {
        this.expandedRows = this.expandedRows.filter((row) => row !== index);
      } else {
        this.expandedRows.push(index);
      }
    },

    async onFilter(key, value) {
      if (!value || value === 0 || value.length == 0) {
        this.filterSelect[key] = undefined;
        this.crud.deleteFilter(key);
      } else {
        this.filterSelect[key] = value;
        this.crud.setFilter(key, {
          operator: eqOperator.includes(key) ? "In" : "Eq",
          value,
        });
      }
    },

    onShowUnit() {
      if (this.weeklyPrices?.length === 0) return;
      this.$confirm({
        title: "Show Units",
        content: "Would you like to save the changes?",
        onOk: () => {
          this.onSave();
        },
        onCancel: () => {
          this.isShowUnits = !this.isShowUnits;
        },
      });
    },

    onChangeEffectiveDate(key, date) {
      this.effectiveWeek[key] = date;
      this.crud.setQueryString(key, date);
    },

    onInputPrice(week, key, val) {
      if (key == "unit") {
        week[key] = val;
        this.weeklyPrices.push(week);
      }
    },

    onChangeRetail(week, val, guardrail) {
      if (week.price == val.price && week.unit == val.unit) return;
      week.price = val.price;
      week.unit = val.unit;
      week.seqNumber = val.seqNumber;
      week.coopDisplay = val.coopDisplay;
      this.weeklyPrices.push(week);
      if (
        this.clickedPromo.seqNumber != 0 &&
        this.promoCounts[this.clickedPromo.promotionEntryId][
          this.clickedPromo.seqNumber
        ].checkFrequency >
          this.promoCounts[this.clickedPromo.promotionEntryId][
            this.clickedPromo.seqNumber
          ].frequency
      ) {
        return (this.promoCounts[this.clickedPromo.promotionEntryId][
          this.clickedPromo.seqNumber
        ].checkFrequency -= 1);
      }

      this.promoCounts[week.promotionEntryId][
        week.seqNumber
      ].remainFrequency -= 1;
      if (
        !guardrail.find(
          (val) =>
            val.seqNumber == this.clickedPromo.seqNumber &&
            val.price == this.clickedPromo.price
        )
      )
        return;
      this.promoCounts[this.clickedPromo.promotionEntryId][
        this.clickedPromo.seqNumber
      ].remainFrequency += 1;
    },

    canRenderPromo(guardrail) {
      const { promotionEntryId, seqNumber } = guardrail;
      if (
        !this.promoCounts[promotionEntryId] ||
        !this.promoCounts[promotionEntryId][seqNumber]
      )
        return false;
      return (
        this.promoCounts[promotionEntryId][seqNumber].remainFrequency != 0 ||
        seqNumber == 1
      );
    },

    onWeeklyPriceInputClick(weeklyPrice) {
      this.clickedPromo = {
        promotionEntryId: weeklyPrice.promotionEntryId,
        seqNumber: weeklyPrice.seqNumber,
        price: weeklyPrice.price,
        unit: weeklyPrice.unit,
      };
    },

    async onSave() {
      try {
        this.isLoading.save = true;
        const apiEndpoint = `${this.apiUrl}/promotion-planning/promo-entries/retail-prices`;
        const { data } = await this.axios.put(apiEndpoint, this.weeklyPrices);
        this.weeklyPrices = [];
        if (data) {
          this.$notification.success({ message: UPDATE_SUCCESS });
        }
      } catch (error) {
        this.displayErrorNotification(error);
      } finally {
        this.isLoading.save = false;
      }
    },
  },
};
</script>
<style>
tr:hover {
  background-color: inherit !important;
  /* Add other styles as needed */
}
</style>
<style lang="scss" scoped>
.list-retail {
  &__filter {
    .cus-mt {
      margin-top: 0.3rem;
    }
    .week-picker {
      ::v-deep {
        .ant-calendar-picker {
          width: 100%;
        }
      }
    }
    .d-block-span {
      ::v-deep span {
        display: block;
        .ant-form-item {
          margin-bottom: 0px;
        }
      }
    }
    .flex-1 {
      flex: 1;
    }
  }
  &__table {
    .ant-table-bordered {
      .ant-table-tbody {
        tr {
          &:hover {
            td {
              background-color: #fff;
              &:first-child {
                border-left: none;
              }
            }
          }
        }
      }
    }
    .custom-error-form {
      margin-bottom: 0 !important;
    }
    .border-left-none {
      border-left: none !important;
    }
    .custom-disabled {
      background-color: #eaedf0;
    }
    .scrolling-table {
      width: 100%; /* Optional: Make the table 100% width of its container */
      table-layout: fixed; /* Prevent cell scaling */
    }
    .fixed-table {
      position: sticky;
      z-index: 100;
      &__left {
        left: 0px;
      }
      &__top {
        top: 0px;
      }
    }
    .pd-0 {
      padding: 0 !important;
    }
    .cursor-pointer {
      ::v-deep {
        .ant-input-number-input,
        .ant-input-number {
          cursor: pointer !important;
        }
      }
    }
    .ant-tooltip {
      &.has-error {
        .ant-tooltip-inner {
          background-color: rgba(245, 34, 45, 0.85);
        }

        .ant-tooltip-arrow {
          &::before {
            background-color: rgba(245, 34, 45, 0.85);
          }
        }
      }
    }
    ::v-deep {
      .is-bold {
        input {
          font-weight: bold;
        }
      }
    }
  }
  &__action {
    .list-retail-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 101;
      padding: 15px 40px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
