<template>
  <div class="promo-guardrails">
    <div v-if="enabledEntry" class="overlay"></div>
    <a-card class="promo-entry-container" :loading="isLoadingEntry || loading">
      <a-spin :spinning="isEntrySaving">
        <div class="d-flex mb-2 flex-wrap">
          <div
            v-if="summaryEntry"
            class="promo-entry__financial-summary d-flex justify-content-between"
          >
            <div
              v-for="(guar, idx) in guardrailColumns"
              :key="idx"
              class="ant-table ant-table-default ant-table-default"
            >
              <div class="ant-table-body">
                <table class="promo-entry-table">
                  <colgroup>
                    <col
                      v-for="col in guar"
                      :key="col.key"
                      :style="{
                        minWidth: col.width ? col.width + 'px' : 'auto',
                      }"
                    />
                  </colgroup>
                  <tr v-for="col in guar" :key="col.index">
                    <th :style="{ backgroundColor: disabledColor.code }">
                      {{ col.title }}
                    </th>
                    <td
                      :class="{
                        'txt-red': summaryEntry[switchToCase(col.key)] < 0,
                      }"
                      class="text-center"
                    >
                      <a-skeleton
                        :loading="islLoadingFinancial"
                        :paragraph="{ rows: 1 }"
                        :title="false"
                      >
                        {{
                          formatNumber(
                            summaryEntry[switchToCase(col.key)],
                            col.format
                          ) || "-"
                        }}
                      </a-skeleton>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div
            class="promo-entry__unit-case-switch justify-content-center d-flex align-items-center"
          >
            Unit
            <a-switch v-model="isShowCase" class="ml-2 mr-2" />
            Case
          </div>
        </div>
        <div class="h6 mb-3">Promo Entry</div>
        <simple-form v-slot="{ handleSubmit, reset }">
          <table
            v-click-outside="onEntryTableBlur"
            class="promo-entry-table table-custom"
          >
            <thead>
              <tr>
                <th
                  class="promo-entry-table__label-column grey-cell b7 text-left"
                >
                  Promo
                </th>
                <th
                  v-for="(data, index) in !enabledEntry
                    ? entries
                    : headerCreatePrice"
                  :key="index"
                  class="promo-entry-table__value-column h7 text-center"
                  :style="{
                    backgroundColor: colorList[index].code || '',
                    borderColor: colorList[index].code || '',
                    borderBottom: '1px solid #cdd3db',
                    color: data.seqNumber == 11 ? '#fff' : '#000',
                  }"
                >
                  {{ enabledEntry ? data : data.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in listRowName"
                :key="`${row.name} ${switchToCase(row.dataIndex)}`"
                :class="
                  { 'no-border': isNoneOrPercentage(switchToCase(row.dataIndex), true) },
                "
              >
                <td
                  :style="{
                    backgroundColor: disabledColor.code,
                  }"
                  :class="{
                    'd-flex h7': isNoneOrPercentage(
                      switchToCase(row.dataIndex)
                    ),
                  }"
                >
                  <span
                    :class="{
                      'hidden-text': row.name == 'hide',
                      'font-weight-bold': row.isBold,
                    }"
                  >
                    {{ row.name }}
                  </span>

                  <span
                    v-if="isNoneOrPercentage(switchToCase(row.dataIndex))"
                    class="ml-auto"
                  >
                    {{
                      unitPercentage[switchToCase(row.dataIndex)]
                        | numeral(row.numberFormat)
                    }}%
                  </span>
                </td>
                <td
                  v-for="(data, index) in !enabledEntry
                    ? entries
                    : headerCreatePrice"
                  :key="index"
                  :style="{
                    backgroundColor:
                      data.seqNumber == 11 ? colorList[index].opacityColor : '',
                  }"
                  :class="{
                    'text-right': true,
                    uneditable: isDisabledEntry(data, row),
                    focusing:
                      tabIndex ==
                      getTabIndex(switchToCase(row.dataIndex), index),
                    'over-write':
                      data.seqNumber != 11 &&
                      (row.dataIndex == 'scanVolume' ||
                        row.dataIndex == 'sellthroughVolume') &&
                      data[row.dataIndex] != data[`${row.dataIndex}History`],
                  }"
                  @click="canEdit && onEntryClick"
                >
                  <a-skeleton
                    class="ct-skeleton"
                    :loading="
                      islLoadingFinancial &&
                        ((data.seqNumber == 11 &&
                          rowIsCheckPOT.includes(row.dataIndex)) ||
                          row.dataIndex == 'sellthroughVolume' ||
                          rowIsCheckPOT.includes(row.dataIndex)) &&
                        !!data.retailPrice
                    "
                    :paragraph="{ rows: 1 }"
                    :title="false"
                  >
                    <editable-label
                      v-if="
                        promoEntry &&
                          !nonEditableDataIndex.includes(
                            switchToCase(row.dataIndex)
                          )
                      "
                      :data-source="getDataSource(row.dataSource)"
                      :disabled="isDisabledEntry(data, row)"
                      error-type="tooltip"
                      has-enter
                      :focused-on="
                        !isDisabledEntry(data, row) &&
                          tabIndex &&
                          tabIndex ==
                            getTabIndex(switchToCase(row.dataIndex), index)
                      "
                      form-item
                      :class-name="setClassName(data, row)"
                      :input-type="row.type"
                      :label="`${data.name} - ${row.name}`"
                      :max-length="15"
                      :number-format="row.numberFormat"
                      :rules="
                        listKeyAllowShowZero.includes(
                          switchToCase(row.dataIndex)
                        )
                          ? ''
                          : getInputRules(data, row)
                      "
                      :show-label="false"
                      :show-empty-value="
                        listKeyAllowShowZero.includes(
                          switchToCase(row.dataIndex)
                        ) && data.retailPrice != 0
                      "
                      :source="row.source"
                      :source-label="row.sourceLabel"
                      :suffix-input="row.suffixInput"
                      :value="
                        listKeyAllowShowZero.includes(
                          switchToCase(row.dataIndex)
                        )
                          ? data[switchToCase(row.dataIndex)]
                          : data[switchToCase(row.dataIndex)] || ''
                      "
                      @blur="
                        onChangeEntry(data, switchToCase(row.dataIndex), $event)
                      "
                      @click.native="
                        onEntryInputClick(
                          getTabIndex(switchToCase(row.dataIndex), index)
                        )
                      "
                    >
                      <template
                        v-if="
                          switchToCase(row.dataIndex) == 'frequency' &&
                            data.seqNumber != 11 &&
                            (data[switchToCase(row.dataIndex)] ||
                              data[switchToCase(row.dataIndex)] == 0)
                        "
                        #prefix
                      >
                        <a-tooltip>
                          <template #title>
                            {{
                              `${data.checkFrequency}/${data.frequency} weeks`
                            }}
                          </template>
                          <a-icon
                            :type="
                              checkFrequency(
                                data['checkFrequency'],
                                data[switchToCase(row.dataIndex)]
                              )
                            "
                            theme="filled"
                            :style="{ marginRight: '9px' }"
                          />
                        </a-tooltip>
                      </template>
                    </editable-label>
                  </a-skeleton>
                </td>
              </tr>
            </tbody>
          </table>
          <portal
            v-if="
              !enabledEntry &&
                isShowGuardrails.includes(tab) &&
                canEdit &&
                !loading
            "
            to="promotion-slider-edit-entry-footer"
          >
            <transition name="slide">
              <a-row
                class="promo-entry-footer neutral-1"
                justify="end"
                type="flex"
              >
                <a-col
                  v-if="
                    promoEntry && promoEntry.statusCode == PROMO_SALES_REVIEW
                  "
                >
                  <a-button @click="visibleReject = true">
                    Reject &amp; Comment
                  </a-button>
                  <a-button
                    class="ml-2"
                    :loading="isLoadingAcceptPromo"
                    type="primary"
                    @click="onClickAccept"
                  >
                    Accept
                  </a-button>
                </a-col>
                <a-col v-else>
                  <a-space>
                    <a-button
                      v-if="visibleRejectBtn"
                      :disabled="islLoadingFinancial"
                      @click="visibleReject = true"
                    >
                      Reject &amp; Comment
                    </a-button>
                    <a-button
                      :disabled="islLoadingFinancial"
                      @click="onCancelClick(reset)"
                      >Cancel</a-button
                    >
                    <a-button
                      type="primary"
                      :loading="isEntrySaving"
                      :disabled="islLoadingFinancial"
                      @click="handleSaveEntry(handleSubmit)"
                    >
                      Save
                    </a-button>
                  </a-space>
                </a-col>
              </a-row>
            </transition>
          </portal>
        </simple-form>
      </a-spin>
    </a-card>
    <reject-promo-modal :visible-reject.sync="visibleReject" />
  </div>
</template>

<script>
import {
  ADD_PERMISSION,
  EDIT_PERMISSION,
  ErrorHandlerMixin,
  PayloadHandlerMixin,
} from "@kraftheinz/common";

import EventBus from "@/EventBus";
import {
  COLOR_LIST_ENTRY_PRICE,
  LIST_ROW_NAME_ENTRY_PRICE,
  LIST_ROW_NAME_ENTRY_KH_PL,
  LIST_ROW_NAME_ENTRY_RETAIL_PL,
  LIST_HEADER_ENTRY_PRICE,
  LIST_HEADER_PL,
} from "@/constants/entry.price";
import {
  PROMO_SALES_REVIEW,
  PROMO_SALES_ACCEPTED,
  PROMO_SALES_PLAN,
} from "@/constants/pp.status";
import { URL_PP_APPROVE } from "@/constants/api-endpoints";
import { ACCEPT_SUCCESS } from "@/constants/pp.status";
import { PROMO_TACTIC_MULTIBUY, PROMO_TACTIC_$_PROMO } from "@/constants";
import { PromoUtils } from "@/utils";

// import KeyMetric from "./KeyMetric.vue";
// import PlTable from "./PlTable.vue";
import RejectPromoModal from "./RejectPromoModal.vue";

const apiUrl = import.meta.env.VITE_API_URL;
const PROMO_LENGTH = LIST_HEADER_ENTRY_PRICE.length;

const rowsIsNewWorldOrPakNSave = [
  "sellthroughVolume",
  "upfrontNIS",
  "netNIS",
  "storeGM",
  "storeGMPercent",
];

const rowsIsIGA = ["upfrontNIS", "netNIS", "storeGM", "storeGMPercent"];

const rowIsCheckPOT = [
  "invoiceValue",
  "upfrontNIS",
  "netNIS",
  "storeGM",
  "storeGMPercent",
  "nsvfpu",
  "lsv",
  "tradeSpend",
  "nsvkf",
  "cma",
  "cmaPercent",
  "rsv",
  "bannerGM",
  "bannerGMPercent",
  "storeGM",
  "storeGMPercent",
];

const specialRowIsCheckPOT = ["lsv", "rsv", "cma", "nsvkf", "nsvfpu"];

const isShowGuardrails = ["promotionEntryPrimaryId", "promotionEntryOnlineId"];

const KEY_CODES = {
  down: 40,
  right: 39,
  up: 38,
  left: 37,
  enter: 13,
  tab: 9,
};

const columnsCMA = [
  {
    title: "Total KHC CMA",
    width: 150,
    dataIndex: "total",
    key: "totalCMA",
    fixed: "left",
    format: "currency",
  },
  {
    title: "KHC CMA %",
    width: 100,
    dataIndex: "percent",
    key: "totalCMAPercent",
    fixed: "left",
    format: "percent",
  },
];

const columnsStoreGM = [
  {
    title: "Total Banner GM",
    width: 150,
    dataIndex: "total",
    key: "totalBannerGM",
    fixed: "left",
    format: "currency",
  },
  {
    title: "Banner GM %",
    width: 100,
    dataIndex: "percent",
    key: "totalBannerGMPercent",
    fixed: "left",
    format: "percent",
  },
];

const columnsBannerGM = [
  {
    title: "Total Store GM",
    width: 150,
    dataIndex: "total",
    key: "totalStoreGM",
    fixed: "left",
    format: "currency",
  },
  {
    title: "Store GM %",
    width: 100,
    dataIndex: "percent",
    key: "totalStoreGMPercent",
    fixed: "left",
    format: "percent",
  },
];

const listRowCase = [
  "scanVolume",
  "sellthroughVolume",
  "marginSupport",
  "offInvoice",
  "caseDealSGTT",
  "wwd",
  "baseScanDeal",
  "topUpScanDeal",
  "invoiceValue",
  "upfrontNIS",
  "netNIS",
  "nsvfpu",
];
const listKeyAllowShowZero = [
  "frequency",
  "scanVolume",
  "scanVolumeCase",
  "scanVolumeHistory",
  "sellthroughVolume",
  "sellthroughVolumeCase",
  "sellthroughVolumeHistory",
];

export default {
  name: "PromoGuardrails",

  components: {
    RejectPromoModal,
  },

  mixins: [PromoUtils, ErrorHandlerMixin, PayloadHandlerMixin],

  inject: ["resourceProps", "canProps", "fetchYTDVolume"],

  props: {
    promoEntryId: {
      type: Number,
      default: 0,
    },
    entryPrice: {
      type: Object,
      required: true,
    },
    enabledEntry: {
      type: Boolean,
      required: true,
    },
    keyMetricType: {
      type: String,
      default: "total",
      validator: (value) => ["total", "unit"].includes(value),
    },
    keyMetricUrl: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    plTableUrl: {
      type: String,
      default: null,
    },
    priceEntryUrl: {
      type: String,
      default: null,
    },
    promoEntry: {
      type: Object,
      default: null,
    },
    retailPriceUrl: {
      type: String,
      default: null,
    },
    tab: {
      type: String,
      default: "",
    },
    weeklyPriceUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    const [entryPermissions, guardrailPermission] = this.canProps;

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
      tacticProps,
      ,
      ,
      ytbTableProps,
    ] = this.resourceProps;
    const canRejectStatusCodes = [PROMO_SALES_ACCEPTED, PROMO_SALES_PLAN];
    return {
      PROMO_SALES_REVIEW,
      canRejectStatusCodes,
      colorList: COLOR_LIST_ENTRY_PRICE,
      createUrl: `/promotion-planning/promo-entries`,
      distributorApiUrl: `${apiUrl}/promotion-planning/promo-entries/distributor`,
      distributorProps,
      summaryEntry: {},
      entries: [],
      entriesOnUsing: [],
      entriesNotAllowed: [],
      entryPermissions,
      entryPriceUrl: "/promotion-planning/promo-entries/price-entries",
      guardrailPermission,
      headerCreatePrice: LIST_HEADER_ENTRY_PRICE,
      headerPl: LIST_HEADER_PL,
      inputs: [],
      isEntrySaving: false,
      isLoadingAcceptPromo: false,
      isLoadingKeyMetrics: false,
      isLoadingEntry: false,
      islLoadingFinancial: false,
      keyMetricProps,
      lastVersionUrl: `${apiUrl}/promotion-planning/common/last-version`,
      listRowName: [],
      listRowNamePl: LIST_ROW_NAME_ENTRY_KH_PL,
      listRowNamePlRetail: LIST_ROW_NAME_ENTRY_RETAIL_PL,
      minTabIndex: 100,
      multipleEntriesUrl: `${apiUrl}/promotion-planning/promo-entries/guardrails`,
      nonEditableDataIndex: ["sellin", "sellthrough", "sellout", "none"],
      originEntries: [],
      originSummaryEntry: {},
      permissions: {
        add: ADD_PERMISSION,
        edit: EDIT_PERMISSION,
      },
      plTableProps,
      promoEntryProps,
      requiredInputs: [],
      retailPriceProps,
      tabIndex: null,
      tacticProps,
      unitPercentage: {},
      visibleReject: false,
      weeklyPriceProps,
      guardrailColumns: [columnsCMA, columnsStoreGM, columnsBannerGM],
      isShowCase: false,
      payloadEntry: [],
      ytbTableProps,
      rowIsCheckPOT,
      isSellThroughEditing: 0,
      listKeyAllowShowZero,
      specialRowIsCheckPOT,
      isShowGuardrails,
    };
  },

  computed: {
    canEdit() {
      return (
        this.guardrailPermission.can(this.permissions.edit) &&
        this.promoEntry &&
        this.promoEntry.finYear >= this.$moment().year()
      );
    },

    disabledColor() {
      return this.colorList.find((color) => color.code === "#EAEDF0");
    },

    maxTabIndex() {
      return this.inputs.length * PROMO_LENGTH + this.minTabIndex - 1;
    },

    retailPrices() {
      return this.entries
        .filter((entry) => entry.retailPrice != 0)
        .map((entry) => entry.retailPrice);
    },

    weeklyPrices() {
      return this.weeklyPriceProps.crud.getList();
    },

    tactics() {
      return this.tacticProps.crud.getList();
    },

    tactic$PromoId() {
      const tactic$Promo = this.tactics.find(
        (tactic) => tactic.description == PROMO_TACTIC_$_PROMO
      );

      if (tactic$Promo) return tactic$Promo.id;

      return null;
    },

    visibleRejectBtn() {
      return this.promoEntry
        ? this.canRejectStatusCodes.includes(this.promoEntry.statusCode)
        : false;
    },
  },

  watch: {
    async promoEntryId(newVal) {
      this.fetchPromoEntries(newVal);
    },
    async entryPrice(newVal, oldVal) {
      if (!newVal.productId || !newVal.finYear || !newVal.customerId) return;

      if (this.comparePromoValue(newVal, oldVal)) return;

      const isChangePPG = oldVal.productId !== newVal.productId;

      const lastVersion = await this.getVersions(isChangePPG);

      this.changeParamUrl(this._.get(lastVersion, "promotionEntryId"));
    },

    weeklyPrices() {
      const startDayOfNow = this.$moment()
        .startOf("week")
        .add(1, "days");

      this.entriesNotAllowed = [];
      this.entriesOnUsing = [];

      for (const weeklyPrice of this.weeklyPrices) {
        const { seqNumber } = weeklyPrice;
        const startDay = this.$moment(weeklyPrice.startDay);

        if (!seqNumber) continue;

        if (startDay.isBefore(startDayOfNow)) {
          !this.entriesNotAllowed.includes(seqNumber) &&
            this.entriesNotAllowed.push(seqNumber);
        } else {
          !this.entriesOnUsing.includes(seqNumber) &&
            this.entriesOnUsing.push(seqNumber);
        }
      }
    },
  },

  created() {
    this.tacticProps.crud.deleteFilter("IsInactive");
    this.tacticProps.crud.fetchList();
    this.fetchPromoEntries(this.$route.params.id);
    EventBus.$on("onSaveSalePlans", () => {
      this.fetchPromoEntries(this.$route.params.id);
    });
  },

  destroyed() {
    EventBus.$off("onSaveSalePlans", () => {
      this.fetchPromoEntries(this.$route.params.id);
    });
  },

  mounted() {
    this.setPromoEntryKeyActions();
  },
  methods: {
    setClassName(data, row) {
      let cellName = row.dataIndex[0].toUpperCase() + row.dataIndex.slice(1);
      if (this.specialRowIsCheckPOT.includes(row.dataIndex)) {
        cellName = row.dataIndex.toUpperCase();
      }
      if (row.dataIndex == "cmaPercent") {
        cellName =
          row.dataIndex.slice(0, 3).toUpperCase() + row.dataIndex.slice(3);
      }
      return data[this.switchToCase(row.dataIndex)] < 0
        ? "txt-red"
        : ["sellthroughVolume", ...this.rowIsCheckPOT].includes(
            row.dataIndex
          ) && data[`is${cellName}Changed`]
        ? "over-write"
        : "";
    },

    switchToCase(key) {
      if (!listRowCase.includes(key)) return key;
      return this.isShowCase ? `${key}Case` : key;
    },

    async setDataSourceEntries(data) {
      const isNewWorldOrPAKNSAVE = data.isNewWorldOrPAKNSAVE;
      const isIGA = data.isIGA;
      this.entries = data.promotionTypes;
      this.summaryEntry = data.totalGuardrails;
      const filterUnitPercentage = this.entries.filter(
        (item) => item.name === "Unit Percentage"
      );
      this.unitPercentage =
        this.entries.length > 0 && filterUnitPercentage.length > 0
          ? filterUnitPercentage[0].unitPercentage
          : {};

      this.removeUnitPercentageItem();
      this.listRowName = [
        ...LIST_ROW_NAME_ENTRY_PRICE.filter((val) =>
          isNewWorldOrPAKNSAVE
            ? true
            : isIGA
            ? !rowsIsIGA.includes(val.dataIndex)
            : !rowsIsNewWorldOrPakNSave.includes(val.dataIndex)
        ),
      ];

      this.requiredInputs = this.listRowName
        .filter((row) => row.required)
        .map((row) => row.dataIndex);

      this.guardrailColumns = [
        columnsCMA,
        columnsStoreGM,
        isNewWorldOrPAKNSAVE ? columnsBannerGM : [],
      ];
    },

    async fetchPromoEntries(id) {
      try {
        this.isLoadingEntry = true;
        const url = `${apiUrl}/promotion-planning/promo-entries/${id}/guardrails`;
        const { data } = await this.axios.get(url);
        if (data) {
          this.originEntries = JSON.parse(JSON.stringify(data.promotionTypes));
          this.originSummaryEntry = JSON.parse(
            JSON.stringify(data.totalGuardrails)
          );
          this.payloadEntry = data.promotionTypes
            .filter((entry) => !!entry.retailPrice && entry.seqNumber != 11)
            .map((newEntry) => ({
              id: newEntry.id,
              promotionEntryId: newEntry.promotionEntryId,
              seqNumber: newEntry.seqNumber,
              scanVolume: newEntry.scanVolume,
              sellthroughVolume: newEntry.sellthroughVolume,
              isEditSellthrough: false,
              count: 0,
            }));
          this.setDataSourceEntries(data);
        }
      } catch (error) {
        console.log(error);
      }
      this.isLoadingEntry = false;
    },

    comparePromoValue(newVal, oldVal) {
      /**
       * Stop first-mount triggering
       */
      if (this._.isEmpty(oldVal)) return true;

      return (
        newVal.productId == oldVal.productId &&
        newVal.customerId == oldVal.customerId &&
        newVal.finYear == oldVal.finYear &&
        !this.enabledEntry
      );
    },

    async getVersions(isChangePPG) {
      try {
        const payload = {
          ProductId: this.entryPrice.productId,
          Year: this.entryPrice.finYear,
          CustomerId: this.entryPrice.customerId,
        };

        /** since 'CurrentPromoEntry' is helpful for the case effective weeks belongs 2 year,
         * when the user changes 'Year' in the filter, we will include 'CurrentPromoEntry' in the payload,
         * when the user changes 'PPG' in the filter, we won't include 'CurrentPromoEntry''in the payload
         * */
        if (!isChangePPG) {
          payload.CurrentPromoEntryId = this.promoEntry.id;
        }

        const lastVersionQuery = this.generateFeString(payload);

        const res = await this.axios.get(
          this.lastVersionUrl + "?" + lastVersionQuery
        );

        return res.data;
      } catch (error) {
        this.displayErrorNotification(error);
      }
    },

    checkFrequency(checkFrequency, frequency) {
      const variance = Math.abs(checkFrequency - frequency);

      if (variance === 0) return "check-circle";
      if (variance <= 2) return "info-circle";
      return "close-circle";
    },

    onChangeTypeMetric(type) {
      this.$emit("update:key-metric-type", type);
    },

    changeParamUrl(promoId) {
      const id = +this.$route.params.id;

      if (!promoId) {
        this.$emit("changeAction", "empty");
      } else {
        this.$emit("changeAction", "edit");

        if (promoId != id) {
          this.$router.push({
            name: "PromoEdit",
            params: { id: promoId },
          });
        } else {
          this.$emit("refreshData", promoId);
        }
      }
    },

    isValidEntry(entry) {
      let validInputs = [];
      let invalidInputs = [];

      this.requiredInputs.forEach((input) => {
        const value = entry[input];
        const invalid = input === "frequency" ? value != 0 && !value : !value;

        if (invalid) invalidInputs.push(input);
        else validInputs.push(input);
      });

      return {
        yes: invalidInputs.length === 0,
        validInputs,
        invalidInputs,
      };
    },

    isDisabledEntry(entry, row) {
      return (
        !this.promoEntry ||
        this.promoEntry.statusCode == PROMO_SALES_REVIEW ||
        row.disabled ||
        !entry.retailPrice ||
        entry.seqNumber == 11 ||
        (entry.seqNumber == 1 && row.dataIndex == "sellthroughVolume") ||
        (row.dataIndex == "sellthroughVolume" &&
          this.isSellThroughEditing != 0 &&
          this.isSellThroughEditing == 2) ||
        (row.dataIndex == "scanVolume" &&
          this.isSellThroughEditing != 0 &&
          this.isSellThroughEditing == 1)
      );
    },

    async onChangeEntry(entry, index, value) {
      try {
        // prevent re-calculator if the scan or sellthrough are blank
        if (
          this.requiredInputs.some((req) =>
            this.entries.some(
              (ent) =>
                !ent[this.switchToCase(req)] &&
                ent[this.switchToCase(req)] != 0 &&
                ent.retailPrice
            )
          ) ||
          this.isShowCase ||
          this.payloadEntry.find(
            (val) => val[index] == value && val.seqNumber == entry.seqNumber
          )
        ) {
          return;
        }
        this.islLoadingFinancial = true;
        entry[index] = +value;
        EventBus.$emit("isEditPromoEntry", true);
        const ListIndex = await this.payloadEntry.findIndex(
          (element) => element.seqNumber == entry.seqNumber
        );
        this.payloadEntry[ListIndex][index] = +value;
        if (index == "sellthroughVolume") {
          this.payloadEntry[ListIndex].isEditSellthrough = true;
        }
        this.isSellThroughEditing = index == "sellthroughVolume" ? 1 : 2;

        await this.onCallAPI(false).then((response) => {
          const { data } = response;
          this.setDataSourceEntries(data);
          this.payloadEntry.forEach((entry, idx) => {
            entry.sellthroughVolume =
              data.promotionTypes[idx].sellthroughVolume;
            entry.isEditSellthrough = false;
          });
        });
      } catch (err) {
        console.log(err);
      }
      this.tabIndex = null;
      this.islLoadingFinancial = false;
    },

    async onCallAPI(isCommitted) {
      const url = `${this.multipleEntriesUrl}?isCommitted=${isCommitted}`;
      return await this.axios.put(url, this.payloadEntry);
    },

    async onSaveClick() {
      try {
        this.isEntrySaving = true;
        await this.onCallAPI(true)
          .then((response) => {
            this.originEntries = JSON.parse(
              JSON.stringify(response.data.promotionTypes)
            );
            this.originSummaryEntry = JSON.parse(
              JSON.stringify(response.data.totalGuardrails)
            );
            this.setDataSourceEntries(response.data);
            this.removeUnitPercentageItem();
            this.promoEntryProps.crud.fetchEntity();
            this.weeklyPriceProps.crud.fetchList(this.weeklyPriceUrl);
            this.retailPriceProps.crud.fetchList(this.retailPriceUrl);
          })
          .catch(async (err) => {
            this.$notification.error({
              message: err.response.data.message,
            });
            if (
              err.response.data.details.find((val) =>
                val.includes("205_RESET_CONTENT")
              )
            ) {
              await this.promoEntryProps.crud.fetchEntity();
            }
          })
          .finally(() => {
            this.fetchYTDVolume();
            this.isEntrySaving = false;
            this.isSellThroughEditing = 0;
            EventBus.$emit("isEditPromoEntry", false);
          });
      } catch (error) {
        console.log(error);
      }
    },

    getInputRules(data, row) {
      let rules = row.validations;

      if (row.dataIndex === "retailPrice") {
        rules = `${rules}|not_existed:${this.retailPrices}`;
      }

      if (
        this.requiredInputs.includes(row.dataIndex) &&
        data.requiredErrors &&
        data.requiredErrors.length
      ) {
        rules = `required|${rules}`;
      }

      return rules;
    },

    handleSaveEntry(save) {
      this.isEntrySaving = true;
      const errorEntries = this.entries.find((ent) =>
        this.requiredInputs.some(
          (req) => !ent[req] && ent[req] != 0 && ent.retailPrice != 0
        )
      );
      if (errorEntries) {
        this.$notification.error({
          message: `Scan or Sellthrough of ${errorEntries.name} is required.`,
        });
        this.isEntrySaving = false;
        return;
      }
      save(this.onSaveClick);
      this.isEntrySaving = false;
    },

    onEntryClick() {
      if (!this.canEdit) {
        this.$notification.warning({
          message: "The promo entry in the previous year cannot be edited",
        });
      }
    },

    getTabIndex(dataIndex, entryIndex) {
      const inputIndex = this.requiredInputs.findIndex(
        (input) => input === dataIndex
      );

      if (inputIndex < 0) return null;

      return entryIndex + inputIndex * PROMO_LENGTH + this.minTabIndex;
    },

    onEntryInputClick(tabIndex) {
      if (!this.canEdit) return;
      this.tabIndex = tabIndex;
    },

    setPromoEntryKeyActions() {
      window.addEventListener("keydown", (e) => {
        if (this.tab !== "guardrails") return;
        const { keyCode } = e;
        const { down, right, up, left, enter, tab } = KEY_CODES;
        let { tabIndex } = this;

        switch (keyCode) {
          case down:
          case enter:
            tabIndex = null;
            break;

          case right:
            tabIndex += 1;
            break;

          case up:
            tabIndex -= PROMO_LENGTH;
            break;

          case left:
            tabIndex -= 1;
            break;

          case tab:
            e.preventDefault();
            tabIndex += 1;
            break;
        }

        this.tabIndex = tabIndex;

        this.$nextTick(() => {
          const inputFocusing = document.querySelector(
            ".promo-guardrails .table-custom td.focusing"
          );

          const main = document.querySelector(".ant-layout-content");
          const footer = document.querySelector(".promo-entry-footer");
          const header = document.querySelector(".kh-header");

          if (inputFocusing && main && footer && header) {
            const inputFocusingRect = inputFocusing.getBoundingClientRect();
            const inputBottom = inputFocusingRect.bottom;
            const inputTop = inputFocusingRect.top;
            const windowHeight = window.innerHeight;
            const inputHeight = inputFocusing.offsetHeight;
            const footerHeight = footer.offsetHeight;
            const headerHeight = header.offsetHeight;

            const errorInput = inputFocusing.querySelector(
              ".ant-form-item-control.has-error input"
            );

            if (errorInput) errorInput.focus();

            if (inputBottom > windowHeight - footerHeight) {
              main.scrollTop +=
                inputBottom - windowHeight + inputHeight + footerHeight;
            } else if (inputFocusingRect.top - headerHeight < 0) {
              main.scrollTop += inputTop - headerHeight;
            }
          }
        });
      });
    },

    onEntryTableBlur() {
      this.tabIndex = null;
    },

    onCancelClick(reset) {
      this.entries = JSON.parse(JSON.stringify(this.originEntries));
      this.summaryEntry = JSON.parse(JSON.stringify(this.originSummaryEntry));
      this.payloadEntry = this.entries
        .filter((entry) => !!entry.retailPrice && entry.seqNumber != 11)
        .map((newEntry) => ({
          id: newEntry.id,
          promotionEntryId: newEntry.promotionEntryId,
          seqNumber: newEntry.seqNumber,
          scanVolume: newEntry.scanVolume,
          sellthroughVolume: newEntry.sellthroughVolume,
          isEditSellthrough: false,
        }));
      this.isSellThroughEditing = 0;
      reset();
      EventBus.$emit("isEditPromoEntry", false);
    },

    submitDistributor() {
      const { distributorId } = this.entryPrice;

      if (distributorId) {
        this.distributorProps.crud.submitEntity(
          "replace",
          `${this.distributorApiUrl}/${distributorId}`
        );
      } else {
        this.distributorProps.crud.submitEntity("create");
      }
    },

    isNoneOrPercentage(value, isFieldNone = false) {
      let result;

      switch (value) {
        case "sellin":
        case "sellout":
        case "sellthrough":
          result = true;
          break;

        default:
          if (isFieldNone && value === "none") {
            result = true;
          } else {
            result = false;
          }
          break;
      }

      return result;
    },

    removeUnitPercentageItem() {
      const unitPercentageIdx = this.entries.findIndex(
        (item) => item.name === "Unit Percentage"
      );
      if (unitPercentageIdx !== -1) {
        this.entries.splice(unitPercentageIdx, 1);
      }
    },

    getDataSource(computedField) {
      return this[computedField];
    },

    onClickAccept() {
      this.$confirm({
        icon: "question-circle",
        title: "Are you sure to accept this plan?",
        cancelText: "Cancel",
        okText: "OK",
        onOk: () => this.acceptPromo(),
      });
    },

    async acceptPromo() {
      const promoId = this.$route.params.id;

      const payload = {
        publishId: promoId,
        isApprove: true,
        comment: null,
      };

      try {
        this.isLoadingAcceptPromo = true;
        await this.axios.post(apiUrl + URL_PP_APPROVE, payload);
        this.$notification.success({ message: ACCEPT_SUCCESS });
        await this.promoEntryProps.crud.fetchEntity();
        await this.fetchPromoEntries(this.$route.params.id);

        this.$emit("accepted");
      } catch (err) {
        this.displayErrorNotification(err);
      } finally {
        this.isLoadingAcceptPromo = false;
        this.visible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.promo-entry {
  &__financial-summary {
    flex: 2 4 auto;
  }
  &__unit-case-switch {
    flex: 2 4;
    @media (max-width: 1199px) {
      margin-top: 24px;
    }
  }
}
.promo-guardrails {
  ::v-deep {
    .anticon-check-circle {
      color: $success-6;
    }

    .anticon-info-circle {
      color: $warning-6;
    }

    .anticon-close-circle {
      color: $error-6;
    }
  }

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: 60px;
    background: $neutral-3;
    opacity: 0.5;
    z-index: 2;
  }

  .promo-entry-table {
    width: 100%;

    th,
    td {
      border: 1px solid $neutral-4;
      padding: 3.055px 3.819px;
      overflow-wrap: break-word;

      .hidden-text {
        color: transparent;
      }

      &.uneditable {
        cursor: no-drop;
      }

      .anticon-info-circle {
        transform: rotate(180deg);
      }
    }

    .grey-cell {
      background-color: $neutral-3;
    }

    .no-border {
      & > th,
      & > td {
        border: none;
        background-color: transparent !important;
      }
    }

    &__label-column {
      width: 18%;
    }

    &__value-column {
      width: 7.5%;
    }

    ::v-deep {
      .editable-label__content {
        justify-content: flex-end;
      }
    }
  }
  .over-write {
    color: #1b00ff;
    font-weight: bold;
  }
  .promo-entry-container {
    margin-top: 25px;

    ::v-deep {
      .ant-spin {
        width: calc(100% + 120px);
        max-height: unset;
      }

      .ant-form {
        overflow-x: auto;
      }
    }
  }
  .txt-red {
    color: $error-6;
  }
}
</style>
