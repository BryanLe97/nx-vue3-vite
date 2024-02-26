<template>
  <div class="weekly-price-entry">
    <a-spin :spinning="loading">
      <simple-form v-slot="{ handleSubmit, reset }">
        <a-row type="flex" justify="space-between" align="middle">
          <label class="filter-title">Weekly Price Entry</label>

          <a-space>
            <a-button
              icon="download"
              :loading="isDownloading"
              @click="onDownload"
            >
              Download
            </a-button>
            <a-button class="mr-3" type="primary" @click="setDefaultshelfPrice">
              Default to Shelf Price (Primary Plan)
            </a-button>
            <select-input
              class-name="select-input__weekly"
              label="Key Metrics by Price Point"
              :show-label="false"
              :data-source="weeklyViews"
              source="value"
              source-label="name"
              :value="viewMode"
              @change="onWeekViewChange"
            />
            <switch-input
              v-if="isShowSellthroughUnits"
              label="Sellthrough Units"
              label-horizontal="right"
              :value="isSellthrough"
              @change="onSellthroughUnitsChange"
            />
          </a-space>
        </a-row>

        <div
          v-click-outside="onTableBlur"
          class="weekly-price-entry__table mt-5"
        >
          <!-- HOVER FUNCTIONALITY
          put this code in the div just below to enable hover table functionality
          @mouseover="isShowIcon('mouseover',quarterIndex)"
          @mouseleave="isShowIcon('mouseleave',quarterIndex)"-->

          <table class="weekly-price-entry__table__header">
            <colgroup>
              <col :style="{ width: '70px' }" align="center" />
              <col
                v-for="(th, headerIndex) in tableCols"
                :key="headerIndex"
                :style="{
                  width: th.width + 'px',
                }"
              />
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">Quarter</th>
                <th
                  v-for="(th, headerIndex) in tableCols"
                  :key="'th' + headerIndex"
                  class="tcs-ignore grey-cell text-center"
                >
                  {{ th.name }}
                </th>
              </tr>
            </thead>
          </table>

          <div
            v-for="(quarterEntries, quarter, quarterIndex) in entriesByQuarter"
            :key="quarterIndex"
            class="weekly-price-entry__container"
            :style="{ marginTop: '-1px' }"
          >
            <weekly-price-entry-table
              :type-table="listTable"
              :events="events"
              :input-fields="inputs"
              :instore-displays="instoreDisplays"
              :instore-display-categories="instoreDisplayCategories"
              :price-entities="priceEntities"
              :prices="prices"
              :tactics="tactics"
              :quarter="+quarter"
              :quarter-entries="quarterEntries"
              :quarter-index="quarterIndex"
              :shelf-price-color="shelfPriceColor"
              :tab-index="tabIndex"
              :tab-index-start="tabIndexStartByQuarter[quarter]"
              :week-index-start="weekIndexStartByQuarter[quarter]"
              :is-expanded-row.sync="listExpandTable[+quarterIndex]"
              :is-sellthrough="isSellthrough"
              @change-entry="onEntryChange"
              @click-entry-label="onEntryInputClick"
              @paste-entries="onEntriesPaste"
            />
            <!-- HOVER FUNCTIONALITY
              enable this code to show the icon button
              <a-icon
              v-if="listPlusIcons[quarterIndex]['isShowIcon']"
              class="weekly-price-entry-table-icon-test"
              :type="listPlusIcons[quarterIndex]['icon']"
              @click="displaySubPanel(quarterIndex)"
            />-->
          </div>

          <portal
            v-if="tab === 'sales-plan' && hasEditPermission"
            to="promotion-slider-edit-entry-footer"
          >
            <transition name="slide">
              <a-row
                class="promo-entry-footer neutral-1"
                justify="end"
                type="flex"
              >
                <a-col>
                  <a-button :disabled="loading" @click="onCancelClick(reset)">
                    Cancel
                  </a-button>

                  <a-tooltip
                    overlay-class-name="weekly-price-entry__frequency-tooltip"
                    placement="topRight"
                  >
                    <template v-if="!isFrequencyValid" #title>
                      <div
                        v-for="(error, index) in frequencyErrors"
                        :key="index"
                      >
                        <span :style="{ color: error.color }">
                          {{ error.name }}
                        </span>
                        of
                        <span :style="{ fontWeight: 'bold' }">
                          {{ error.isOnline ? "Online" : "Primary" }}
                          {{
                            $moment(error.startDate).format(
                              PROMO_DATE_FORMAT_FOR_SALE
                            )
                          }}
                          -
                          {{
                            $moment(error.endDate)
                              .startOf("isoWeek")
                              .format(PROMO_DATE_FORMAT_FOR_SALE)
                          }}
                        </span>
                        exceeds the guardrail weeks!
                      </div>
                    </template>

                    <a-badge>
                      <template v-if="!isFrequencyValid" #count>
                        <a-icon
                          theme="twoTone"
                          type="exclamation-circle"
                          two-tone-color="#fa8c16"
                        />
                      </template>

                      <a-button
                        class="ml-2"
                        :disabled="!isFrequencyValid"
                        :loading="loading"
                        type="primary"
                        @click="handleSaveEntry(handleSubmit)"
                      >
                        Save
                      </a-button>
                    </a-badge>
                  </a-tooltip>
                </a-col>
              </a-row>
            </transition>
          </portal>
        </div>
      </simple-form>
    </a-spin>
  </div>
</template>

<script>
import _ from "lodash";
import numeral from "numeral";

import {
  EDIT_PERMISSION,
  EDIT_PRIOR_WEEK_PERMISSION,
  FileHandlersMixin,
} from "@kraftheinz/common";

import EventBus from "@/EventBus";
import {
  COLOR_LIST_ENTRY_PRICE,
  LIST_ROW_NAME_SUB_PANEL,
  LIST_COL_NAME_WEEKLY_PRICE,
  QUARTER_LENGTH,
  SHELF_PRICE_CODE,
} from "@/constants/entry.price";
import { PROMO_DATE_FORMAT_FOR_SALE } from "@/constants/others";

import WeeklyPriceEntryTable from "./WeeklyPriceEntryTable.vue";

const weeklyViews = [
  {
    value: 1,
    name: "1 week view",
  },
  {
    value: 4,
    name: "4 weeks view",
  },
];

const apiUrl = import.meta.env.VITE_API_URL;

const KEY_CODES = {
  DOWN: 40,
  RIGHT: 39,
  UP: 38,
  LEFT: 37,
  ENTER: 13,
  TAB: 9,
};

export default {
  name: "WeeklyPriceEntry",

  mixins: [FileHandlersMixin],

  components: {
    WeeklyPriceEntryTable,
  },

  inject: ["resourceProps", "canProps", "getFilterParam", "fetchYTDVolume"],

  props: {
    fetchGuardrails: {
      type: Function,
      default: () => {},
    },
    fetchList: {
      type: Function,
      default: () => {},
    },
    keyAccount: {
      type: String,
      default: null,
    },
    tab: {
      type: String,
      default: "",
    },
    weeklyPrices: {
      type: Array,
      default: null,
    },
    weeklyPriceUrl: {
      type: String,
      default: null,
    },
  },

  provide() {
    return {
      createInstoreDisplay: this.createInstoreDisplay,
    };
  },

  data() {
    const [, , salesPlanPermission] = this.canProps;

    const [
      promoEntryProps,
      ,
      ,
      weeklyPriceProps,
      ,
      ,
      retailPriceProps,
      multipleWeeklyPriceProps,
      ,
      tacticProps,
      instoreDisplaysProps,
    ] = this.resourceProps;

    const weeklyPriceList = this._.cloneDeep(this.weeklyPrices);

    // HOVER FUNCTIONALITY
    // let listPlusIcons = Array.from(Array(4).keys()).map((i) => ({
    //   id: i,
    //   icon: "plus-circle",
    //   isVisible: false,
    //   isShowIcon: false,
    // }));

    const instoreDisplaysFields = [
      "primaryInstoreDisplayId",
      "secondInstoreDisplayId",
      "thirdInstoreDisplayId",
    ];

    const hideSellthrougUnitsKeyAccounts = ["New World", "PAK N SAVE", "IGA"];

    const overiddenFields = ["coopDisplay"];

    return {
      LIST_ROW_NAME_SUB_PANEL,
      LIST_COL_NAME_WEEKLY_PRICE,
      PROMO_DATE_FORMAT_FOR_SALE,
      canCollapse: true,
      events: [],
      inputs: [],
      instoreDisplays: [],
      isAllExpanded: false,
      hideSellthrougUnitsKeyAccounts,
      listColor: COLOR_LIST_ENTRY_PRICE,
      listExpandTable: [],
      loading: false,
      minTabIndex: 100,
      multipleWeeklyPriceProps,
      instoreDisplayCategories: [],
      instoreDisplaysFields,
      instoreDisplaysProps,
      promoEntryProps,
      requiredInputs: [],
      retailPriceProps,
      salesPlanPermission,
      tabIndex: 0,
      tacticProps,
      viewMode: 1,
      weeklyPriceList,
      weeklyPriceListOrigin: weeklyPriceList,
      weeklyPriceProps,
      weeklyViews,
      overiddenFields,

      // HOVER FUNCTIONALITY
      // listPlusIcons,
      totalWeeksInAYear: this.weeklyPrices.length,
      distance: {
        x: 0,
        y: 0,
      },
      isDownloading: false,
      isLargeTable: false,
    };
  },

  computed: {
    effectiveDates() {
      if (!this.promoEntry)
        return {
          startDate: this.$moment().startOf("week"),
          endDate: this.$moment().endOf("week"),
        };

      const id = +this.$route.params.id;

      const promoEffectiveDates = this.promoEntry.effectiveDates.find(
        (dates) => dates.promotionEntryId == id
      );

      return {
        startDate: this.$moment(promoEffectiveDates.startDate),
        endDate: this.$moment(promoEffectiveDates.endDate),
      };
    },

    effectiveFrequencies() {
      return this.effectiveWeeklyPrices.reduce((frequencies, weeklyPrice) => {
        const {
          promotionEntryId,
          promotionEntryOnlineId,
          seqNumber,
          seqNumberOnline,
        } = weeklyPrice;

        if (!!promotionEntryId && !frequencies[promotionEntryId]) {
          frequencies[promotionEntryId] = {};
        }

        if (!!promotionEntryOnlineId && !frequencies[promotionEntryOnlineId]) {
          frequencies[promotionEntryOnlineId] = {};
        }

        if (this.hasFrequencyChecking(seqNumber, promotionEntryId))
          frequencies[promotionEntryId][seqNumber] =
            (frequencies[promotionEntryId][seqNumber] ?? 0) + 1;

        if (this.hasFrequencyChecking(seqNumberOnline, promotionEntryOnlineId))
          frequencies[promotionEntryOnlineId][seqNumberOnline] =
            (frequencies[promotionEntryOnlineId][seqNumberOnline] ?? 0) + 1;

        return frequencies;
      }, {});
    },

    effectiveWeeklyPrices() {
      return this.weeklyPriceList.filter(
        (weeklyPrice) => weeklyPrice.isWithinEffectiveDates
      );
    },

    entriesByQuarter() {
      return this.groupByKey(this.weeklyPriceList, "finQuater");
    },

    expandTable() {
      return [...LIST_COL_NAME_WEEKLY_PRICE, ...LIST_ROW_NAME_SUB_PANEL];
    },

    frequencies() {
      return this.priceEntry.reduce(
        (frequencies, { seqNumber, frequency, promotionEntryId }) => {
          if (frequencies[promotionEntryId]) {
            frequencies[promotionEntryId][seqNumber] = frequency;
            return frequencies;
          } else {
            return {
              ...frequencies,
              ...(this.hasFrequencyChecking(seqNumber, promotionEntryId)
                ? {
                    [promotionEntryId]: {
                      [seqNumber]: frequency,
                    },
                  }
                : {}),
            };
          }
        },
        {}
      );
    },

    frequencyErrors() {
      return Object.entries(this.effectiveFrequencies).reduce(
        (errors, [entryId, effectiveFrequencies]) => {
          const effectiveDate = this.promoEntry.effectiveDates.find(
            (entry) => entry.promotionEntryId == entryId
          );

          return [
            ...errors,
            ...Object.entries(effectiveFrequencies).reduce(
              (errors, [seqNumber, frequencies]) => {
                const promoEntry = this.listColor[seqNumber - 1];

                return [
                  ...errors,
                  ...(frequencies > this.frequencies[entryId][seqNumber]
                    ? [
                        {
                          ...(effectiveDate ?? {}),
                          color: promoEntry.code,
                          name: promoEntry.name,
                        },
                      ]
                    : []),
                ];
              },
              []
            ),
          ];
        },
        []
      );
    },

    hasEditPermission() {
      return this.salesPlanPermission.can(EDIT_PERMISSION);
    },

    hasEditPriorWeekPermission() {
      return this.salesPlanPermission.can(EDIT_PRIOR_WEEK_PERMISSION);
    },

    isSellthrough() {
      return this.promoEntry.isSellthroughEnabled || false;
    },

    isFrequencyValid() {
      return !Object.keys(this.frequencyErrors).length;
    },

    isShowSellthroughUnits() {
      return this.checkShowSellthroughUnits(
        this.keyAccount ?? this.promoEntry.keyAccount
      );
    },

    lastTableLength() {
      return this.totalWeeksInAYear - 3 * QUARTER_LENGTH;
    },

    listTable() {
      return this.isLargeTable ? this.expandTable : LIST_COL_NAME_WEEKLY_PRICE;
    },

    maxTabIndex() {
      return (
        this.inputs.length * this.weeklyPriceList.length + this.minTabIndex - 1
      );
    },

    prices() {
      return this.retailPriceProps.crud.getList().map((price) => {
        const color = this.listColor[price.seqNumber - 1].code;

        return {
          ...price,
          color: color !== this.shelfPriceColor ? color : "#BFC0C1",
          price: numeral(price.retailPrice).format("$0,0.00"),
        };
      });
    },

    priceEntities() {
      return this.prices.reduce((prices, price) => {
        const { seqNumber } = price;

        const { code: color, opacityColor } = this.listColor[seqNumber - 1];

        return {
          ...prices,
          [seqNumber]: {
            ...price,
            color,
            opacityColor,
          },
        };
      }, {});
    },

    priceEntry() {
      return this.retailPriceProps.crud.getList();
    },

    promoEntry() {
      return this.promoEntryProps.crud.getEntity();
    },

    shelfPriceColor() {
      return this.listColor.find((color) => color.name === "Shelf Price").code;
    },

    tabIndexStartByQuarter() {
      return this.getIndexStartByQuarter("tab");
    },

    tableLength() {
      return this.listTable.length - 1;
    },

    tactics() {
      return this.tacticProps.crud.getList();
    },

    invisibleCols() {
      return this.listTable
        .filter((col) => {
          return !col.defaultVisible;
        })
        .map((col) => col.dataIndex);
    },

    tableCols() {
      return this.listTable.filter(
        (col) => !this.invisibleCols.includes(col.dataIndex)
      );
    },

    weekIndexStartByQuarter() {
      return this.getIndexStartByQuarter("week");
    },
  },

  watch: {
    weeklyPrices(newVal) {
      this.weeklyPriceList = newVal;
      this.weeklyPriceListOrigin = newVal;
      this.updateWeeklyPricesEntity(newVal);
      this.setWeeklyPrices();
      this.onWeekViewChange(this.viewMode, { hasHandleSave: true });
    },
    listExpandTable(newVal) {
      if (newVal.every((val) => val === true)) {
        this.isAllExpanded = true;
        this.canCollapse = false;
      } else if (newVal.includes(true)) {
        this.canCollapse = this.isAllExpanded = false;
      } else {
        this.isAllExpanded = false;
        this.canCollapse = true;
      }
    },
  },

  async created() {
    const [instoreDisplays, events, instoreDisplayCategories] =
      await Promise.all([
        this.fetchInstoreDisplays(),
        this.fetchEvents(),
        this.fetchInstoreDisplayCategories(),
      ]);

    this.instoreDisplays = instoreDisplays;
    this.events = events;
    this.instoreDisplayCategories = instoreDisplayCategories;
  },

  mounted() {
    this.listExpandTable = new Array(4).fill(false);
    this.inputsLength();
    this.setWeeklyPrices();
    this.updateWeeklyPricesEntity(this.weeklyPriceList);
    this.setKeyActions();
  },

  methods: {
    calculateTotalUnit(value, ratio, isSellthrough) {
      if (!ratio) return 0;
      switch (isSellthrough) {
        case true:
          return value * ratio;
        case false:
          return value / ratio;
        default:
          return value;
      }
    },

    async createInstoreDisplay(value, categoryId) {
      const customUrl =
        this.instoreDisplaysProps.apiUrl +
        "/promotion-planning/primary-instore";

      try {
        const res = await this.instoreDisplaysProps.crud.submitEntity(
          "create",
          customUrl,
          {
            customerId: this.getFilterParam().customerId,
            rate: 0,
            description: value,
            categoryId,
          }
        );

        await this.fetchInstoreDisplays().then(
          (res) => (this.instoreDisplays = res)
        );

        return res.data;
      } catch (err) {
        this.$notification.error(err.message);
      }
    },

    hasFrequencyChecking(seqNumber, promotionEntryId) {
      const guardrailItem = this.priceEntry.filter(
        (promoObj) =>
          promoObj.seqNumber == seqNumber &&
          promoObj.promotionEntryId == promotionEntryId
      );
      if (guardrailItem && guardrailItem.length) {
        if (!guardrailItem[0].retailPrice && !guardrailItem[0].unit)
          return false;
      }
      return (
        seqNumber && seqNumber !== 0 && ![SHELF_PRICE_CODE].includes(seqNumber)
      );
    },

    inputsLength() {
      for (const row of this.listTable) {
        if (row.valid) {
          this.inputs = [...this.inputs, row.dataIndex];

          if (row.required) {
            this.requiredInputs = [...this.requiredInputs, row.dataIndex];
          }
        }
      }
    },

    // HOVER FUNCTIONALITY

    // displaySubPanel(index) {
    //   if (this.listPlusIcons[index]["isVisible"] === false) {
    //     this.isLargeTable = true;
    //     this.listPlusIcons.map((item) => {
    //       item["isVisible"] = true;
    //       item["isShowIcon"] = true;
    //       item["icon"] = "minus-circle";
    //     });
    //   } else {
    //     this.isLargeTable = false;
    //     this.listPlusIcons.map((item) => {
    //       item["icon"] = "plus-circle";
    //       item["isVisible"] = item["isShowIcon"] = false;
    //     });
    //   }
    //   this.inputs = [];
    //   this.inputsLength();
    // },

    // isShowIcon(type, index) {
    //   if (type === "mouseover") {
    //     if (!this.listPlusIcons[index]["isVisible"]) {
    //       this.listPlusIcons[index]["isShowIcon"] = true;
    //     }
    //   } else if (type === "mouseleave") {
    //     if (!this.listPlusIcons[index]["isVisible"]) {
    //       this.listPlusIcons[index]["isShowIcon"] = false;
    //     }
    //   }
    // },

    groupByKey(items, key) {
      return items.reduce((result, item) => {
        const quarter = item[key];

        return {
          ...result,
          [quarter]: [...(result[quarter] || []), item],
        };
      }, {});
    },

    checkIfOverridden(weeklyPrice, dataIndex) {
      const promo = this.prices.find((price) => {
        if (
          weeklyPrice.seqNumberOnline > SHELF_PRICE_CODE &&
          dataIndex !== "coopDisplay"
        ) {
          return (
            price.seqNumber === weeklyPrice.seqNumberOnline &&
            price.promotionEntryId === weeklyPrice.promotionEntryOnlineId
          );
        }
        return (
          price.seqNumber === weeklyPrice.seqNumber &&
          price.promotionEntryId === weeklyPrice.promotionEntryId
        );
      });
      if (dataIndex == "unit") {
        return (
          !promo ||
          weeklyPrice[dataIndex] !=
            promo[this.isSellthrough ? "sellthrough" : "scan"]
        );
      }

      if (this.overiddenFields.includes(dataIndex))
        return !promo || weeklyPrice[dataIndex] != promo[dataIndex];

      return false;
    },

    checkShowSellthroughUnits(keyAccount) {
      return this.hideSellthrougUnitsKeyAccounts.some((item) => {
        return keyAccount.search(item) >= 0;
      });
    },

    async fetchInstoreDisplays() {
      try {
        await this.instoreDisplaysProps.crud.fetchList(
          `${apiUrl}/promotion-planning/common/primary-instore/${
            this.getFilterParam().customerId
          }`
        );
        const res = this.instoreDisplaysProps.crud.getList();

        return res;
      } catch (error) {
        this.$notification.error(error.message);
      }
    },

    async fetchInstoreDisplayCategories() {
      try {
        const { data } = await this.axios.get(
          `${apiUrl}/promotion-planning/common/primary-instore/category`
        );

        return data;
      } catch (error) {
        this.$notification.error(error.message);
      }
    },

    async fetchEvents() {
      try {
        const res = await this.axios.get(
          `${apiUrl}/promotion-planning/common/events/${
            this.getFilterParam().customerId
          }`
        );

        return res.data;
      } catch (error) {
        this.$notification.error(error.message);
      }
    },

    setWeeklyPrices() {
      let weeklyPriceList = this._.cloneDeep(this.weeklyPriceList);
      let month = 0;

      const startDayOfNow = this.$moment().startOf("week").add(1, "days");

      weeklyPriceList = weeklyPriceList.map((weeklyPrice, index) => {
        const overridden = this.inputs.reduce((inputsOverridden, input) => {
          return {
            ...inputsOverridden,
            [input]: this.checkIfOverridden(weeklyPrice, input),
          };
        }, {});

        const startDate = this.$moment(weeklyPrice.startDay);
        const endDate = this.$moment(weeklyPrice.startDay).endOf("week");

        const effectiveDatesStart = this.effectiveDates.startDate;
        const effectiveDatesEnd = this.effectiveDates.endDate;
        const isWithinEffectiveDates =
          (startDate.isSameOrAfter(effectiveDatesStart) ||
            endDate.isSameOrAfter(effectiveDatesStart)) &&
          startDate.isSameOrBefore(effectiveDatesEnd);
        const canEdit = this.hasEditPriorWeekPermission
          ? isWithinEffectiveDates
          : startDate.isSameOrAfter(startDayOfNow) && isWithinEffectiveDates;

        if (canEdit) {
          const found = this.prices.find(
            (element) => element.seqNumber == weeklyPrice.seqNumber
          );
          if (!found) {
            weeklyPrice.seqNumber = 0;
          }
        }

        const isParent = index % 4 === 4 || index % 4 === 0;

        if (isParent) month++;

        return {
          ...weeklyPrice,
          date: startDate.format(PROMO_DATE_FORMAT_FOR_SALE),
          isParent,
          month,
          canEdit,
          overridden,
          isWithinEffectiveDates,
        };
      });

      this.weeklyPriceList = weeklyPriceList;
      this.weeklyPriceListOrigin = weeklyPriceList;
    },

    async onDownload() {
      try {
        this.isDownloading = true;
        const { promotionOptimisationId } = this.promoEntry;
        await this.downloadFile(
          `${apiUrl}/promotion-planning/promo-entries/export-saleplan`,
          "application/vnd.ms-excel",
          {
            promotionOptimisationId,
          }
        );
      } catch (error) {
        this.$notification.error(error.message);
      } finally {
        this.isDownloading = false;
      }
    },

    onWeekViewChange(value, options = {}) {
      this.viewMode = value;
      let parent;

      switch (value) {
        case 4:
          this.weeklyPriceList = this.weeklyPriceList.map((weeklyPrice) => {
            const { isParent, canEdit } = weeklyPrice;
            const hasValue = this.inputs.find((input) => !!weeklyPrice[input]);

            if (!canEdit) return weeklyPrice;

            parent = isParent ? weeklyPrice : {};

            if (hasValue || options.hasHandleSave) {
              return {
                ...weeklyPrice,
                isBelonged: !isParent,
              };
            }

            const {
              promotionTypeId,
              seqNumber,
              price,
              totalUnitSellthrough,
              totalUnitScan,
              coopAdd,
              coopDisplay,
              overridden,
            } = parent;

            return {
              ...weeklyPrice,
              isBelonged: !isParent,
              promotionTypeId,
              seqNumber,
              price,
              totalUnitSellthrough,
              totalUnitScan,
              coopAdd,
              coopDisplay,
              overridden,
            };
          });
          break;

        default:
          this.weeklyPriceList = this._.cloneDeep(this.weeklyPriceListOrigin);
          break;
      }

      this.updateWeeklyPricesEntity(this.weeklyPriceList);
    },

    onEntryClick(weeklyPrice) {
      const { canEdit, isBelonged } = weeklyPrice;

      if (!canEdit && !isBelonged) {
        this.$notification.warning({
          message: "The previous week cannot be edited",
        });
      }
    },

    onEntryChange: _.debounce(async function ({
      entryIndex,
      dataIndex,
      value,
    }) {
      let weeklyPriceList = this._.cloneDeep(this.weeklyPriceList);
      let isPriceChanged = false;

      EventBus.$emit("isEditPromoEntry", true);

      let weeklyPrice = this._.cloneDeep(weeklyPriceList[entryIndex]);

      weeklyPrice[dataIndex] = value;

      weeklyPrice.overridden[dataIndex] = this.checkIfOverridden(
        weeklyPrice,
        dataIndex
      );
      if (dataIndex === "seqNumber") {
        if (value) {
          const price = this.prices.find((price) => {
            return (
              price.seqNumber === value &&
              price.promotionEntryId === weeklyPrice.promotionEntryId
            );
          });
          if (!price) return;
          const {
            id,
            coopAdd,
            coopDisplay,
            retailPrice,
            tacticId,
            tacticName,
            scan,
            sellthrough,
            scanToSellthroughRatio,
          } = price;

          isPriceChanged = true;
          weeklyPrice.promotionTypeId = id;
          weeklyPrice.scanToSellthroughRatio = scanToSellthroughRatio;
          weeklyPrice.coopAdd = coopAdd;
          weeklyPrice.coopDisplay = coopDisplay;
          weeklyPrice.price = retailPrice;
          weeklyPrice.tacticId = tacticId;
          weeklyPrice.tacticName = tacticName;

          if (value !== SHELF_PRICE_CODE) {
            weeklyPrice.promotionTypeOnlineId = null;
            weeklyPrice.seqNumberOnline = null;
            weeklyPrice.tacticOnlineId = null;
            weeklyPrice.tacticNameOnline = null;
            weeklyPrice.unit = this.isSellthrough ? sellthrough : scan;
            weeklyPrice.uplift = weeklyPrice.unit - weeklyPrice.baseline;
          }

          weeklyPrice.overridden = this.inputs.reduce(
            (inputsOverridden, input) => ({
              ...inputsOverridden,
              [input]: false,
            }),
            {}
          );
        } else {
          weeklyPrice.coopDisplay = null;
          weeklyPrice.tacticId = null;
          weeklyPrice.tacticName = null;
          weeklyPrice.unit = 0;
          weeklyPrice.uplift = weeklyPrice.unit - weeklyPrice.baseline;
        }
      }

      if (dataIndex === "unit" && weeklyPrice.seqNumber) {
        weeklyPrice.uplift = value - weeklyPrice.baseline;
      }

      if (dataIndex === "seqNumberOnline") {
        if (value) {
          const price = this.prices.find((price) => {
            return (
              price.seqNumber === value &&
              price.promotionEntryId === weeklyPrice.promotionEntryOnlineId
            );
          });

          if (!price) return;

          const {
            tacticId,
            tacticName,
            scan,
            sellthrough,
            retailPrice,
            id,
            scanToSellthroughRatio,
          } = price;

          weeklyPrice.promotionTypeOnlineId = id;
          weeklyPrice.tacticOnlineId = tacticId;
          weeklyPrice.tacticNameOnline = tacticName;
          weeklyPrice.priceOnline = retailPrice;
          weeklyPrice.uplift = null;
          weeklyPrice.scanToSellthroughRatio = scanToSellthroughRatio;

          if (weeklyPrice.tacticId !== SHELF_PRICE_CODE) {
            weeklyPrice.promotionTypeId = null;
            weeklyPrice.tacticId = null;
            weeklyPrice.tacticName = null;
            weeklyPrice.seqNumber = null;
          }

          weeklyPrice.overridden = this.inputs.reduce(
            (inputsOverridden, input) => ({
              ...inputsOverridden,
              [input]: false,
            }),
            {}
          );

          if (value !== SHELF_PRICE_CODE) {
            weeklyPrice.unit = this.isSellthrough ? sellthrough : scan;
          }
        } else {
          weeklyPrice.coopDisplay = null;
          weeklyPrice.tacticOnlineId = null;
          weeklyPrice.tacticNameOnline = null;
          weeklyPrice.unit = 0;
        }
      }

      this.weeklyPriceListOrigin[entryIndex] = {
        ...weeklyPrice,
        isBelonged: false,
      };

      weeklyPriceList[entryIndex] = weeklyPrice;

      if (this.viewMode === 4 && weeklyPriceList[entryIndex].isParent) {
        const parent = weeklyPrice;

        const {
          month,
          promotionTypeId,
          unit,
          coopAdd,
          coopDisplay,
          overridden,
          scanToSellthroughRatio,
        } = parent;

        let validating = true;

        while (validating) {
          entryIndex++;

          let childWeeklyPrice = this._.cloneDeep(weeklyPriceList[entryIndex]);

          if (
            entryIndex >= weeklyPriceList.length ||
            childWeeklyPrice.month !== month
          ) {
            validating = false;
            break;
          }

          if (isPriceChanged) {
            childWeeklyPrice = {
              ...childWeeklyPrice,
              [dataIndex]: parent[dataIndex],
              promotionTypeId,
              unit,
              scanToSellthroughRatio,
              coopAdd,
              coopDisplay,
              overridden,
            };
          } else {
            childWeeklyPrice[dataIndex] = parent[dataIndex];

            childWeeklyPrice.overridden[dataIndex] = this.checkIfOverridden(
              childWeeklyPrice,
              dataIndex
            );
          }

          weeklyPriceList[entryIndex] = childWeeklyPrice;
        }
      }

      this.weeklyPriceList = weeklyPriceList;
      this.updateWeeklyPricesEntity(weeklyPriceList);
    },
    300),

    updateWeeklyPricesEntity(value) {
      this.multipleWeeklyPriceProps.crud.updateEntity("editForm", {
        resourceKey: "list",
        value,
      });
    },

    onSaveClick() {
      this.loading = true;
      const promoEntryId = this.$route.params.id;

      if (this._.isNil(promoEntryId)) return;

      this.multipleWeeklyPriceProps.crud.updateEntity("editForm", {
        resourceKey: "isSellthroughEnabled",
        value: this.isSellthrough,
      });

      const weeklyPriceEndpoint = `${apiUrl}/promotion-planning/promo-entries/${promoEntryId}/weekly-prices`;
      this.multipleWeeklyPriceProps.crud
        .submitEntity("replace", weeklyPriceEndpoint)
        .then(() => {
          this.promoEntryProps.crud.fetchEntity();
          this.fetchList();
          this.fetchGuardrails();
        })
        .catch((err) => {
          if (
            err.response.data.details.find((val) =>
              val.includes("205_RESET_CONTENT")
            )
          ) {
            EventBus.$emit("isEditPromoEntry", false);
            EventBus.$emit("onSaveSalePlans", null);
            EventBus.$emit("onChangeTabActive", null);
          }
        })
        .finally(() => {
          this.fetchYTDVolume();
          this.loading = false;
          EventBus.$emit("isEditPromoEntry", false);
          EventBus.$emit("onSaveSalePlans", null);
        });
    },

    onSellthroughUnitsChange(value) {
      this.weeklyPriceList.forEach((weeklyPrice) => {
        weeklyPrice.unit = this.calculateTotalUnit(
          weeklyPrice.unit,
          weeklyPrice.scanToSellthroughRatio,
          value
        );
      });

      this.promoEntry.isSellthroughEnabled = value;

      EventBus.$emit("isSellthrough", value);
    },

    handleSaveEntry(save) {
      let hasError = false;

      this.loading = true;
      this.weeklyPriceList = this.weeklyPriceList.map((weeklyPrice) => {
        const hasValue = this.inputs.find((input) => !!weeklyPrice[input]);
        const errors = hasValue
          ? this.requiredInputs.filter((input) => !weeklyPrice[input])
          : null;

        if (errors) hasError = true;

        return {
          ...weeklyPrice,
          errors,
        };
      });

      setTimeout(
        () => {
          save(this.onSaveClick);
          this.loading = false;
        },
        hasError ? 2000 : 0
      );
    },

    onCancelClick(reset) {
      this.weeklyPriceList = this._.cloneDeep(this.weeklyPrices);
      this.weeklyPriceListOrigin = this._.cloneDeep(this.weeklyPrices);
      this.viewMode = 1;

      this.setWeeklyPrices();
      this.updateWeeklyPricesEntity(this.weeklyPriceList);
      reset();
      EventBus.$emit("isEditPromoEntry", false);
    },

    onEntryInputClick(tableIndex, tabIndex, currentRow, coordX) {
      this.tabIndex = tabIndex;
      this.distance.y = this.getDistanceToTbl4(tableIndex, currentRow);
      this.distance.x = coordX;
    },

    onTableBlur() {
      this.tabIndex = 0;
    },

    getDistanceToTbl4(tableIndex, currentRow) {
      let distance =
        this.tableLength * (4 - tableIndex - 1) + this.tableLength - currentRow;
      return distance;
    },

    checkArrowKeys(type, tabIndex = 0) {
      let y = this.distance.y;
      let x = this.distance.x;

      switch (type) {
        case "left":
          tabIndex -=
            y < -1 || (y === -1 && x === QUARTER_LENGTH)
              ? this.lastTableLength
              : QUARTER_LENGTH;

          if (y + 1 <= 3 * this.tableLength - 1) {
            if (x === QUARTER_LENGTH && y === -1) {
              this.distance.x = QUARTER_LENGTH - 1;
            }
            this.distance.y += 1;
          }
          break;

        case "right":
          tabIndex += y > -1 ? QUARTER_LENGTH : this.lastTableLength;
          if (y - 1 >= -this.tableLength) {
            this.distance.y -= 1;
          }
          break;

        case "up":
          if (x !== 0) {
            if (y >= -1 || y < -1) {
              this.distance.x -= 1;
            }
          } else if (x === 0 && tabIndex >= this.minTabIndex) {
            this.distance.y += 1;
            if (y >= -1) this.distance.x = QUARTER_LENGTH - 1;
            else this.distance.x = this.lastTableLength - 1;
          }
          break;

        case "down":
          if (tabIndex <= this.maxTabIndex) {
            if (
              (y > -1 && x !== QUARTER_LENGTH - 1) ||
              (y <= -1 && x !== this.lastTableLength - 1)
            ) {
              this.distance.x += 1;
            } else if (
              (y > -1 && x === QUARTER_LENGTH - 1) ||
              (y <= -1 && x === this.lastTableLength - 1)
            ) {
              this.distance.y -= 1;
              this.distance.x = 0;
            }
          }
          break;
      }
      return tabIndex;
    },

    setKeyActions() {
      this.$el.addEventListener("keydown", (e) => {
        if (this.tab !== "sales-plan") return;

        const { keyCode } = e;
        const { DOWN, RIGHT, UP, LEFT, ENTER, TAB } = KEY_CODES;
        let { tabIndex } = this;

        switch (keyCode) {
          case ENTER:
          case DOWN:
            tabIndex += 1;
            this.checkArrowKeys("down", tabIndex);
            break;

          case UP:
            tabIndex -= 1;
            this.checkArrowKeys("up", tabIndex);
            break;

          case RIGHT:
            tabIndex = this.checkArrowKeys("right", tabIndex);
            break;

          case LEFT:
            tabIndex = this.checkArrowKeys("left", tabIndex);
            break;

          case TAB:
            e.preventDefault();
            tabIndex += 1;
            this.checkArrowKeys("right", tabIndex);
            break;
        }

        if (tabIndex >= this.minTabIndex && tabIndex <= this.maxTabIndex) {
          this.tabIndex = tabIndex;
        }

        this.$nextTick(() => {
          const inputFocusing = document.querySelector(
            ".weekly-price-entry td.focusing"
          );

          const main = document.querySelector(".ant-layout-content");
          const footer = document.querySelector(".promo-entry-footer");
          const header = document.querySelector("[class*='kh-header']");

          if (inputFocusing && main && footer && header) {
            const inputFocusingRect = inputFocusing.getBoundingClientRect();
            const inputBottom = inputFocusingRect.bottom;
            const inputTop = inputFocusingRect.top;
            const windowHeight = window.innerHeight;
            const inputHeight = inputFocusing.offsetHeight;
            const footerHeight = footer.offsetHeight;
            const headerHeight = header.offsetHeight;

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

    onEntriesPaste(newEntries) {
      newEntries.forEach((entry) => {
        const { index, ...otherProps } = entry;
        const currentEntry = this.weeklyPriceList[index];
        if (
          entry.seqNumberOnline &&
          currentEntry.seqNumber !== SHELF_PRICE_CODE
        ) {
          currentEntry.tacticId = null;
          currentEntry.tacticName = null;
          currentEntry.seqNumber = null;
          currentEntry.uplift = entry.unit - currentEntry.baseline;
        } else if (entry.seqNumber && entry.seqNumber !== SHELF_PRICE_CODE) {
          currentEntry.tacticOnlineId = null;
          currentEntry.tacticNameOnline = null;
          currentEntry.seqNumberOnline = null;
          currentEntry.uplift = entry.unit - currentEntry.baseline;
        }

        this.$set(this.weeklyPriceList, index, {
          ...currentEntry,
          ...otherProps,
        });
      });

      this.setWeeklyPrices();
      this.updateWeeklyPricesEntity(this.weeklyPriceList);
    },

    getIndexStartByQuarter(indexType) {
      return Object.values(this.entriesByQuarter).reduce(
        (indexStartByQuarter, _, currentIndex, entriesByQuarter) => {
          if (currentIndex === 0) {
            return {
              [currentIndex + 1]: indexType == "tab" ? this.minTabIndex : 0,
            };
          }

          const prevQuarterLength = entriesByQuarter[currentIndex - 1].length;
          const prevQuarterIndexStart = indexStartByQuarter[currentIndex];

          return {
            ...indexStartByQuarter,
            [currentIndex + 1]:
              prevQuarterIndexStart +
              prevQuarterLength * (indexType == "tab" ? this.inputs.length : 1),
          };
        },
        {}
      );
    },

    setDefaultshelfPrice() {
      let weeklyPriceList = this._.cloneDeep(this.weeklyPriceList);

      weeklyPriceList.forEach((item) => {
        const price = this.prices.find(
          (price) =>
            price.promotionEntryId === item.promotionEntryId &&
            price.seqNumber === SHELF_PRICE_CODE
        );

        if (item.canEdit && price) {
          const {
            id,
            coopAdd,
            coopDisplay,
            retailPrice,
            scan,
            seqNumber,
            sellthrough,
            tacticId,
            tacticName,
            scanToSellthroughRatio,
          } = price;

          Object.keys(item.overridden).forEach(
            (v) => (item.overridden[v] = false)
          );
          item.promotionTypeId = id;
          item.coopAdd = coopAdd;
          item.coopDisplay = coopDisplay;
          item.price = retailPrice;
          item.seqNumber = seqNumber;
          item.unit = this.isSellthrough ? sellthrough : scan;
          item.scanToSellthroughRatio = scanToSellthroughRatio;
          item.tacticId = tacticId;
          item.tacticName = tacticName;
          //online plan
          item.promotionTypeOnlineId = null;
          item.seqNumberOnline = null;
          item.tacticOnlineId = null;
          item.tacticNameOnline = null;
        }
      });

      this.weeklyPriceList = weeklyPriceList;
      this.updateWeeklyPricesEntity(weeklyPriceList);
    },
  },
};
</script>

<style lang="scss">
.weekly-price-entry {
  &__container {
    position: relative;
  }

  &__frequency-tooltip {
    max-width: unset;
  }

  &__table {
    position: relative;
    overflow: auto;
    height: 600px;

    &__header {
      width: 100%;
      table-layout: fixed;
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 1;
      border-bottom: 1px solid #ccc;
    }
  }

  .select-input__weekly {
    width: 200px;
  }

  .filter-title {
    color: #272d35;
    font-size: 16px;
    font-weight: 500;
  }

  .ant-spin-nested-loading {
    ::v-deep {
      .ant-spin-spinning {
        max-height: unset;
      }
    }
  }

  .weekly-price-entry-table-icon {
    font-size: 22px;
    color: #a3a3a3;
    cursor: pointer;
    margin-inline: 9px;

    &-test {
      font-size: 22px;
      color: #a3a3a3;
      cursor: pointer;
      margin-inline: 9px;
      position: absolute;
      bottom: -10px;
      left: -30px;
    }
  }
}
</style>
