<template>
  <a-dropdown class="w-100" :trigger="['contextmenu']">
    <div class="weekly-price-entry-table">
      <div class="d-flex align-items-stretch">
        <table
          ref="entryTable"
          class="weekly-price-entry-table__entries table table-custom"
        >
          <colgroup>
            <col :style="{ width: '70px' }" />
            <col
              v-for="(th, headerIndex) in tableCols"
              :key="headerIndex"
              :style="{
                width: th.width + 'px',
              }"
            />
          </colgroup>
          <tbody>
            <tr
              v-for="(td, entryIndex) in quarterEntries"
              :key="'td' + entryIndex"
            >
              <td
                v-if="entryIndex === 0"
                :rowspan="quarterEntries.length"
                class="tcs-ignore grey-cell bold text-center"
              >
                Q{{ quarter }}
              </td>

              <td
                v-for="(th, headerIndex) in tableCols"
                :key="'th' + headerIndex"
                :class="{
                  'tcs-ignore text-center': !!uneditableFields.includes(
                    th.dataIndex
                  ),
                  'grey-cell': th.dataIndex === 'startDay',
                  bold:
                    (td.seqNumberOnline !== SHELF_PRICE_CODE ||
                      td.seqNumber !== SHELF_PRICE_CODE) &&
                    (th.dataIndex === 'seqNumber' ||
                      th.dataIndex === 'tacticName' ||
                      th.dataIndex === 'seqNumberOnline' ||
                      th.dataIndex === 'tacticNameOnline'),
                  belonged: th.dataIndex !== 'startDay' && td.isBelonged,
                  uneditable:
                    !td.canEdit ||
                    !hasEditPermission ||
                    !checkEditablePrice(th.dataIndex, td),
                  overridden:
                    !isReadonlyCell(td, th) &&
                    th.dataIndex !== 'startDay' &&
                    th.dataIndex !== 'seqNumber' &&
                    th.dataIndex !== 'tacticName' &&
                    td.overridden &&
                    td.overridden[th.dataIndex] &&
                    td.isWithinEffectiveDates,
                  focusing: tabIndex == getTabIndex(th.dataIndex, entryIndex),
                }"
                :style="
                  th.dataIndex !== 'startDay' &&
                  getPriceStyles(td, th.dataIndex)
                "
                :data-coord-x="headerIndex + 1"
                :data-coord-y="entryIndex"
                :data-field="th.dataIndex"
                :data-value="getCellDataValue(td, th)"
                :data-quarter-index="quarterIndex"
                :data-is-within-effective-dates="td.canEdit"
                :data-promotion-entry-id="td.promotionEntryId"
                :data-promotion-entry-online-id="td.promotionEntryOnlineId"
                @click="
                  th.dataIndex !== 'startDay' &&
                    th.dataIndex !== 'tacticName' &&
                    th.dataIndex !== 'tacticNameOnline' &&
                    hasEditPermission &&
                    onEntryClick(td)
                "
                @contextmenu="onContextMenuOpen"
              >
                <template v-if="isReadonlyCell(td, th)">
                  <span
                    :class="
                      getReadonlyFieldClass(th.dataIndex, td[th.dataIndex])
                    "
                  >
                    {{ getReadonlyCellData(td, th) }}
                  </span>
                </template>
                <div
                  v-else-if="th.dataIndex === 'note'"
                  :style="getNoteStyles(td.canEdit && hasEditPermission)"
                >
                  <a-tooltip :title="td.note">
                    <a-popover title="Note" trigger="click">
                      <div
                        class="text-truncate"
                        :style="getNoteStyles(td.canEdit && hasEditPermission)"
                      >
                        {{ td.note }}
                      </div>
                      <template #content>
                        <text-area
                          :value="td.note"
                          :disabled="!td.canEdit || !hasEditPermission"
                          :max-length="255"
                          @change="
                            onEntryChange(
                              quarterIndex,
                              entryIndex,
                              th.dataIndex,
                              $event
                            )
                          "
                        />
                      </template>
                    </a-popover>
                  </a-tooltip>
                </div>
                <template v-else-if="th.dataIndex !== 'startDay'">
                  <editable-label
                    form-item
                    :custom-search="
                      instoreDisplaysFields.includes(th.dataIndex)
                    "
                    :has-tooltip="th.hasTooltip"
                    :input-type="getCellType(td, th)"
                    :focused-on="
                      (td.errors && td.errors.includes(th.dataIndex)) ||
                      (!!tabIndex &&
                        tabIndex == getTabIndex(th.dataIndex, entryIndex))
                    "
                    :label="`${td.date} - ${th.name}`"
                    :show-label="false"
                    :show-empty-value="
                      !!td.seqNumber && th.dataIndex !== 'coopDisplay'
                    "
                    :data-source="
                      getDataSource(
                        th.dataSource,
                        instoreDisplaysFields.includes(th.dataIndex)
                          ? th.name
                          : undefined,
                        td
                      )
                    "
                    :option-filter="(option) => optionFilter(option, td)"
                    :search-debounce-time="0"
                    :source="th.source"
                    :source-description="th.sourceDescription"
                    :source-label="th.sourceLabel"
                    :value="getCellDataValue(td, th)"
                    :number-format="th.numberFormat"
                    :suffix-input="th.suffixInput"
                    :rules="getInputRules(td, th)"
                    :max-length="15"
                    error-type="tooltip"
                    :disabled="
                      !td.canEdit ||
                      !hasEditPermission ||
                      !checkEditablePrice(th.dataIndex, td)
                    "
                    has-enter
                    @change="
                      onEntryChange(
                        quarterIndex,
                        entryIndex,
                        th.dataIndex,
                        $event
                      )
                    "
                    @click.native="
                      onEntryLabelClick(
                        quarter,
                        getTabIndex(th.dataIndex, entryIndex),
                        headerIndex,
                        entryIndex,
                        td,
                        th
                      )
                    "
                    @enter="onEntryEnter(quarterIndex, entryIndex, th, $event)"
                    @search="($event) => (searchValue = $event)"
                  />
                </template>
                <template v-else>W{{ td.finWeek }} - {{ td.date }}</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <a-menu slot="overlay">
      <a-menu-item key="copy" @click="onCopy">Copy</a-menu-item>
      <a-menu-item key="paste" @click="onPaste">Paste</a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import _ from "lodash";
import numeral from "numeral";

import { EDIT_PERMISSION } from "@kraftheinz/common";

import { SHELF_PRICE_CODE } from "@/constants/entry.price";
import { SheetClip, TableCellSelector } from "@/libs";

export default {
  name: "WeeklyPriceEntryTable",

  inject: ["canProps", "getFilterParam", "createInstoreDisplay"],

  props: {
    typeTable: {
      type: Array,
      required: true,
      default: () => [],
    },
    inputFields: {
      type: Array,
      required: true,
      default: () => [],
    },
    priceEntities: {
      type: Object,
      required: true,
      default: () => {},
    },
    prices: {
      type: Array,
      required: true,
      default: () => [],
    },
    tactics: {
      type: Array,
      required: true,
      default: () => [],
    },
    quarter: {
      type: Number,
      required: true,
      default: null,
    },
    quarterEntries: {
      type: Array,
      required: true,
      default: () => [],
    },
    quarterIndex: {
      type: Number,
      required: true,
      default: null,
    },
    shelfPriceColor: {
      type: String,
      required: true,
      default: "",
    },
    tabIndex: {
      type: Number,
      required: true,
      default: null,
    },
    tabIndexStart: {
      type: Number,
      required: true,
      default: null,
    },
    weekIndexStart: {
      type: Number,
      required: true,
      default: null,
    },
    instoreDisplays: {
      type: Array,
      default: () => [],
    },
    instoreDisplayCategories: {
      type: Array,
      default: () => [],
    },
    isSellthrough: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    const [, , salesPlanPermission] = this.canProps;

    const instoreDisplaysFields = [
      "primaryInstoreDisplayId",
      "secondInstoreDisplayId",
      "thirdInstoreDisplayId",
    ];

    const uneditableFields = [
      "startDay",
      "tacticName",
      "tacticNameOnline",
      "baseline",
      "uplift",
    ];

    return {
      SHELF_PRICE_CODE,
      instoreDisplaysFields,
      isExpanded: false,
      pastedEntries: [],
      salesPlanPermission,
      searchValue: undefined,
      tcs: null,
      tcsBuffer: null,
      uneditableFields,
    };
  },

  computed: {
    hasEditPermission() {
      return this.salesPlanPermission.can(EDIT_PERMISSION);
    },

    invisibleCols() {
      return this.typeTable
        .filter((col) => {
          return !col.defaultVisible;
        })
        .map((col) => col.dataIndex);
    },

    startDateOfThisWeek() {
      return this.$moment().startOf("week").add(1, "days");
    },

    tableCols() {
      return this.typeTable.filter(
        (col) => !this.invisibleCols.includes(col.dataIndex)
      );
    },
  },

  mounted() {
    const options = {
      deselectOutTableClick: true,
      ignoreThead: true,
      ignoreTfoot: true,
      selectIgnoreClass: false,
      getCellFn: (cell) => this.parseDataForCopying(cell),
      setCellFn: (cell, data, coord) =>
        this.parseDataForPasting(cell, data, coord),
    };

    const buffer = new TableCellSelector.Buffer();

    this.tcsBuffer = buffer;
    this.tcs = new TableCellSelector(this.$refs.entryTable, options, buffer);
  },

  beforeDestroy() {
    this.tcsBuffer.destroy();
    this.tcs.destroy();
  },

  methods: {
    checkEditablePrice(dataIndex, data) {
      if (dataIndex === "seqNumber" || dataIndex === "tacticName")
        return data.isEnabled;
      else if (
        dataIndex === "seqNumberOnline" ||
        dataIndex === "tacticNameOnline"
      )
        return data.isEnabledOnline;

      return true;
    },

    formatNumber(num, format) {
      return numeral(num).format(format);
    },

    getInputRules(data, row) {
      let rules = row.validations || "";

      if (row.required && data.errors) {
        rules = `required|${rules}`;
      }

      return rules;
    },

    getPriceStyles(td, dataIndex) {
      const seqNumber =
        td[
          dataIndex === "seqNumber" || dataIndex === "tacticName"
            ? "seqNumber"
            : "seqNumberOnline"
        ];
      const price = this.priceEntities[seqNumber];

      if (["baseline", "uplift"].includes(dataIndex)) {
        return { color: this.priceEntities[1].color };
      }

      if (!price) return null;

      return {
        color:
          (dataIndex === "seqNumber" ||
            dataIndex === "tacticName" ||
            dataIndex === "seqNumberOnline" ||
            dataIndex === "tacticNameOnline") &&
          price.color,
        // backgroundColor: price.opacityColor,
      };
    },

    getDataSource(dataSourceName, category, td) {
      if (dataSourceName === "instoreDisplays" && category) {
        return this[dataSourceName].filter(
          (data) => data.category === category
        );
      }

      if (dataSourceName === "primaryPrices") {
        return this.prices.filter((price) => {
          return price.promotionEntryId === td.promotionEntryId;
        });
      }

      if (dataSourceName === "onlinePrices") {
        return this.prices.filter((price) => {
          return (
            price.seqNumber !== 1 &&
            price.promotionEntryId === td.promotionEntryOnlineId
          );
        });
      }

      return this[dataSourceName];
    },

    getTabIndex(dataIndex, entryIndex) {
      const inputIndex = this.inputFields.findIndex(
        (field) => field === dataIndex
      );

      if (inputIndex < 0) return null;

      return (
        this.tabIndexStart +
        inputIndex * this.quarterEntries.length +
        entryIndex
      );
    },

    getReadonlyCellData(record, col) {
      return record.seqNumber === SHELF_PRICE_CODE &&
        ["unit"].includes(col.dataIndex)
        ? null
        : col.parse
        ? col.parse(record[col.dataIndex], record)
        : this.formatNumber(record[col.dataIndex], col.numberFormat);
    },

    isReadonlyCell(record, col) {
      let isReadonly = false;
      if (col.dataIndex === "unit")
        isReadonly =
          (!record.seqNumber || record.seqNumber === SHELF_PRICE_CODE) &&
          (!record.seqNumberOnline ||
            record.seqNumberOnline === SHELF_PRICE_CODE);

      return col.readonly || isReadonly;
    },

    optionFilter(option, dataIndex, data) {
      if (dataIndex == "eventId")
        return (option) => option.id == data.primaryInstoreDisplayId;

      return this.searchValue
        ? option.description.toLowerCase().includes(this.searchValue)
        : true;
    },

    parseDataForCopying(cell) {
      const { field, value, isWithinEffectiveDates } = cell.dataset;

      /**
       * old requirement: KHPP-652 >> new requirement: KHPOT-153
       * as an side-effect of the KHPOT-153,
       * if a sale plan is INSIDE of the selected effective date, data-value equals value of the 'Retail price' field.
       * else, data-value equals value of the 'seqNumber'.
       */
      if (
        (field == "seqNumber" || field == "seqNumberOnline") &&
        isWithinEffectiveDates
      ) {
        return this.priceEntities[value].seqNumber;
      }

      if (field == "primaryInstoreDisplayId" || field == "eventId") {
        return cell.innerText;
      }

      return value;
    },

    parseDataForPasting(cell, data) {
      let value;
      const {
        field,
        isWithinEffectiveDates,
        promotionEntryId,
        promotionEntryOnlineId,
      } = cell.dataset;

      /** prevent to paste the copied data to cells that are outside of the selected effective dates */
      if (!isWithinEffectiveDates) {
        this.$notification.warning({
          message: "Not allowed to paste to outside of the effective dates",
        });

        return;
      }

      if (!this._.isNil(data)) {
        if (Number.isNaN(+data)) value = data;
        else value = +data;
      }

      const entryIndex = this.weekIndexStart + +cell.dataset.coordY;

      const pastedEntryIndex = this.pastedEntries.findIndex(
        (entry) => entry.index == entryIndex
      );

      if (pastedEntryIndex > -1) {
        let price, instoreDisplay;

        switch (field) {
          case "seqNumber":
            price = this.prices.find(
              (price) =>
                price.seqNumber == value &&
                price.promotionEntryId == promotionEntryId
            );
            if (price) {
              this.pastedEntries[pastedEntryIndex].price = value;
              this.pastedEntries[pastedEntryIndex].promotionTypeId = price.id;
              this.pastedEntries[pastedEntryIndex].seqNumber = price.seqNumber;
              this.pastedEntries[pastedEntryIndex].tacticId = price.tacticId;
              this.pastedEntries[pastedEntryIndex].tacticName =
                price.tacticName;
              this.pastedEntries[pastedEntryIndex].unit = this.isSellthrough
                ? price.sellthrough
                : price.scan;
            }

            break;

          case "seqNumberOnline":
            price = this.prices.find(
              (price) =>
                price.seqNumber == value &&
                price.promotionEntryId == promotionEntryOnlineId
            );
            if (price) {
              this.pastedEntries[pastedEntryIndex].promotionTypeOnlineId =
                price.id;
              this.pastedEntries[pastedEntryIndex].seqNumberOnline =
                price.seqNumber;
              this.pastedEntries[pastedEntryIndex].tacticOnlineId =
                price.tacticId;
              this.pastedEntries[pastedEntryIndex].tacticNameOnline =
                price.tacticName;
              this.pastedEntries[pastedEntryIndex].unit = this.isSellthrough
                ? price.sellthrough
                : price.scan;
            }

            break;

          case "primaryInstoreDisplayId":
          case "eventId":
            if (typeof value === "string" && value.length > 0) {
              instoreDisplay = this.instoreDisplays.find(
                (display) => value.includes(display.description) // There is an "\r" character in value
              );

              if (instoreDisplay) {
                this.pastedEntries[pastedEntryIndex][field] = instoreDisplay.id;
              }
            }

            break;

          default:
            this.pastedEntries[pastedEntryIndex][field] = value;
        }
      } else {
        const newEntry = { index: entryIndex };
        let price, instoreDisplay;

        switch (field) {
          case "seqNumber":
            price = this.prices.find(
              (price) =>
                price.seqNumber == value &&
                price.promotionEntryId == promotionEntryId
            );

            if (price) {
              newEntry.promotionTypeId = price.id;
              newEntry.promotionTypeOnlineId = null;
              newEntry.seqNumber = price.seqNumber;
              newEntry.tacticId = price.tacticId;
              newEntry.tacticName = price.tacticName;
              newEntry.unit = this.isSellthrough
                ? price.sellthrough
                : price.scan;
            }
            break;

          case "seqNumberOnline":
            price = this.prices.find(
              (price) =>
                price.seqNumber == value &&
                price.promotionEntryId == promotionEntryOnlineId
            );

            if (price) {
              newEntry.promotionTypeId = null;
              newEntry.promotionTypeOnlineId = price.id;
              newEntry.seqNumberOnline = price.seqNumber;
              newEntry.tacticOnlineId = price.tacticId;
              newEntry.tacticNameOnline = price.tacticName;
              newEntry.unit = this.isSellthrough
                ? price.sellthrough
                : price.scan;
            }

            break;

          case "primaryInstoreDisplayId":
          case "eventId":
            if (typeof value === "string" && value.length > 0) {
              instoreDisplay = this.instoreDisplays.find(
                (display) => value.includes(display.description) // There is an "\r" character in value
              );

              if (instoreDisplay) {
                newEntry[field] = instoreDisplay.id;
              }
            }

            break;

          default:
            newEntry[field] = value;
        }

        this.pastedEntries.push(newEntry);
      }

      this.afterPaste();
    },

    afterPaste: _.debounce(function () {
      this.$emit("paste-entries", this.pastedEntries);
      this.pastedEntries = [];
    }, 50),

    onContextMenuOpen(e) {
      if (this.$refs.entryTable.querySelector(".tcs-select")) return;

      const cell = e.currentTarget;
      const coordX = +cell.dataset.coordX;
      const coordY = +cell.dataset.coordY;

      this.tcs.select([coordY, coordX], [coordY, coordX]);
    },

    onCopy() {
      this.tcs.copy();
    },

    onExpand() {
      this.$emit("update:is-expanded-row", !this.isExpanded);
    },

    onEntryChange(quarterIndex, entryIndex, dataIndex, value) {
      this.$emit("change-entry", {
        entryIndex: this.weekIndexStart + entryIndex,
        dataIndex,
        value,
      });
    },

    onEntryClick(weeklyEntry) {
      const { canEdit, isBelonged } = weeklyEntry;

      if (!canEdit && !isBelonged) {
        this.$notification.warning({
          message: "The week cannot be edited.",
        });
      }
    },

    onEntryEnter(quarterIndex, entryIndex, row, value) {
      const category = this.instoreDisplayCategories.find(
        (item) => item.description === row.name
      );

      if (
        value &&
        category &&
        this.instoreDisplaysFields.includes(row.dataIndex) &&
        !this.instoreDisplays.find(
          (item) => item.description === value || item.id === value
        )
      ) {
        this.createInstoreDisplay(value, category.id).then((res) =>
          this.onEntryChange(quarterIndex, entryIndex, row.dataIndex, res.id)
        );
      }
    },

    onEntryLabelClick(quarter, tabIndex, headerIndex, entryIndex, td, th) {
      this.searchValue = null;
      if (
        (th.dataIndex == "eventId" && !td.primaryInstoreDisplayId) ||
        !td.canEdit
      ) {
        return;
      }

      this.$emit(
        "click-entry-label",
        quarter,
        tabIndex,
        headerIndex,
        entryIndex
      );
    },

    async onPaste() {
      const selectedCell = this.$refs.entryTable.querySelector(".tcs-select");
      const coordX = +selectedCell.dataset.coordX;
      const coordY = +selectedCell.dataset.coordY;

      try {
        const clipboardText = await window.navigator.clipboard.readText();
        this.tcs.paste(SheetClip.parse(clipboardText), [coordY, coordX]);
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * old requirement: KHPP-652 >> new requirement: KHPOT-153
     * as an side-effect of the KHPOT-153,
     * if a sale plan is INSIDE of the selected effective date, showing the 'Retail price' field as a readonly text. This value is the old price taking from the api /weekly-prices/all.
     * else, showing a dropdown. The list of options is taken from the api common/price-entries. Index of the selected item is the value of 'seqNumber'.
     */
    getCellDataValue(cellData, cellConfig) {
      if (cellConfig.key === "retailPrice" && !cellData.canEdit) {
        return cellData.price;
      }
      return cellData[cellConfig.dataIndex];
    },

    getNoteStyles(canEdit) {
      let cellStyle = {
        minHeight: "20px",
        cursor: "pointer",
      };

      if (!canEdit) {
        cellStyle.pointerEvents = "none";
      }

      return cellStyle;
    },

    getCellType(cellData, cellConfig) {
      if (cellConfig.key === "retailPrice" && !cellData.canEdit) {
        return "text";
      }
      return cellConfig.type;
    },

    getReadonlyFieldClass(dataIndex, value) {
      if (dataIndex === "tacticName") return [];
      return [{ negative: dataIndex === "uplift" && value < 0 }];
    },
  },
};
</script>

<style lang="scss" scoped>
.weekly-price-entry-table {
  .table-custom {
    th,
    td {
      border: 1px solid #cdd3db;

      &.uneditable {
        background-color: #eaedf0 !important;
        cursor: no-drop;
      }

      &.belonged {
        background: #f0f2f4 !important;
      }

      &.overridden {
        color: #1b00ff;
        font-weight: bold;
      }
    }

    .grey-cell {
      background-color: #eaedf0 !important;
    }

    .tcs-select {
      background: #e5efff !important;
    }

    th {
      span {
        &.hidden {
          visibility: hidden;
        }
      }
    }

    &.weekly-price-entry-table__quarter {
      > tr > th:last-child {
        border-right: 0;
      }
    }
  }

  .table {
    color: #272d35;
    table-layout: fixed;

    th,
    td {
      padding: 8px 10px;
      overflow-wrap: break-word;
      color: #272d35;
    }

    .body > td {
      text-align: right;
    }

    .header-td {
      font-weight: 500;
      text-align: center;
    }

    > tr {
      &:not(:first-child) {
        > td {
          width: 6.7%;
          max-width: 0;
        }

        &:not(:first-child) {
          > td {
            text-align: right;
          }
        }
      }

      > td {
        &.disabled {
          cursor: no-drop;

          .editable-label {
            cursor: no-drop;
          }
        }
      }
    }
  }

  .bold {
    font-weight: 500;
  }

  .text-center {
    text-align: center;
  }

  .tcs-select {
    background: #e5efff !important;
  }

  &__quarter {
    width: 60px;
  }

  &__entries {
    width: 100%;

    .readonly {
      color: $neutral-7;

      &.negative {
        color: $error-6;
      }
    }
  }

  &__header {
    position: relative;
    text-align: center;
    .toggle-baseline-btn {
      position: absolute;
      bottom: -18px;
      left: -20px;

      min-width: unset;
      width: 20px;
      height: 20px;

      border: 2px solid #cdd3db;
      border-radius: 50%;
      font-size: 9px;

      ::v-deep {
        > .anticon > svg {
          shape-rendering: auto;
        }
      }
    }
  }

  ::v-deep {
    .editable-label__content {
      justify-content: flex-end;
    }
  }
}
</style>
