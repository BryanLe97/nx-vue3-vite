<template>
  <div
    class="colorful-editable-table__container"
    :style="{
      width: isShowDeltaField ? `calc(${tblWidth} - 170px)` : tblWidth,
    }"
  >
    <div
      id="underlying-table"
      v-scroll="handleScroll"
      class="underlying-table__container"
    >
      <a-dropdown :trigger="['contextmenu']">
        <table
          ref="poTbl"
          v-click-outside="onEntryTableBlur"
          class="colorful-editable-table"
          :class="[
            'po-table--' + tblName,
            { 'colorful-editable-table--collapsed': isCollapsed },
          ]"
        >
          <tr>
            <th
              v-for="(header, index) in tblColumns"
              :key="index"
              :style="{
                minWidth: header.width,
                backgroundColor: header.headerBgColor,
                textAlign: header.align,
                minHeight: '33px',
              }"
              class="tcs-ignore"
              :class="[
                invisibleColumns.includes(index) ? 'd-none' : '',
                'th-' + header.type,
                header.type == 'criteria-group'
                  ? isCollapsed
                    ? ''
                    : 'd-none'
                  : '',
              ]"
            >
              <!-- 'index' starts from 0 -->
              <template v-if="tblName == 'base' && index < 2">
                {{ header.title }}
              </template>

              <select-input
                v-else
                class-name="fs-12"
                :data-source="promoTacticData"
                source="id"
                source-label="description"
                :value="header.title"
                size="small"
                :disabled="disableHeader"
                :allow-clear="allowClearHeader"
                @change="onChangeHeader(index - gapX, $event)"
              />
            </th>
          </tr>

          <tr v-for="(rowConfig, rowIndex) in tblRows" :key="rowIndex">
            <td
              v-if="
                rowConfig.criteriaGroup && rowConfig.criteriaGroup.rowSpan > 0
              "
              :rowspan="rowConfig.criteriaGroup.rowSpan"
              class="criteria-group tcs-ignore"
              :class="[isCollapsed ? '' : 'd-none']"
            >
              {{ rowConfig.criteriaGroup.text }}
            </td>

            <td v-if="rowConfig.criteria" class="criteria tcs-ignore">
              {{ rowConfig.criteria }}
            </td>

            <td
              v-for="(record, columnNo) in scenarioDetails"
              :key="`${rowConfig.key}-${columnNo}`"
              :class="[
                `data-col-${columnNo}`,
                invisibleColumns.includes(columnNo + gapX) ? 'd-none' : '',
                tabIndex == getTabIndex(rowConfig.dataIndex, columnNo)
                  ? 'focusing'
                  : '',
                record.overridden && record.overridden[rowConfig.dataIndex]
                  ? 'overridden'
                  : rowConfig.dataIndex === 'baseVolume'
                  ? 'neutral-7--text'
                  : '',
              ]"
              class="text-right"
              :data-coord-x="columnNo + gapX"
              :data-coord-y="rowIndex + gapY"
              :data-plan-id="record['planId']"
              :data-option-id="record['id']"
              :data-field="rowConfig.dataIndex"
              :data-value="record[rowConfig.dataIndex]"
              @contextmenu="onContextMenuOpen"
            >
              <editable-label
                input-type="text"
                form-item
                error-type="tooltip"
                :label="rowConfig.label"
                :value="record[rowConfig.dataIndex]"
                :number-format="rowConfig.numberFormat"
                :suffix-input="rowConfig.suffixInput"
                :disabled="uneditable || rowConfig.disabled"
                :rules="rowConfig.validationRules"
                :focused-on="
                  tabIndex == getTabIndex(rowConfig.dataIndex, columnNo)
                "
                @blur="onBlurEntity(rowConfig.dataIndex, record)"
                @change="
                  onChangeDataCell(columnNo, rowConfig.dataIndex, $event)
                "
                @click.native="
                  onEntryInputClick(getTabIndex(rowConfig.dataIndex, columnNo))
                "
                @dblclick.native="
                  onClearOverwritten(
                    rowConfig.dataIndex,
                    record,
                    uneditable || rowConfig.disabled
                  )
                "
              />
            </td>
          </tr>
        </table>

        <a-menu slot="overlay">
          <a-menu-item key="copy" @click="onCopy">Copy</a-menu-item>
          <a-menu-item key="paste" @click="onPaste">Paste</a-menu-item>
          <a-menu-item key="delete" @click="onDelete">Delete</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <div v-if="tblFreezeColumns.length > 0" class="freeze-cols__container">
      <table class="freeze-cols">
        <tr>
          <th
            v-for="(header, index) in tblFreezeColumns"
            :key="index"
            :style="{
              width: header.width,
              backgroundColor: header.headerBgColor,
              height: '33px',
            }"
            :class="[
              header.type == 'criteria-group'
                ? isCollapsed
                  ? ''
                  : 'd-none'
                : '',
            ]"
          >
            {{ header.title }}
          </th>
        </tr>

        <tr v-for="(rowConfig, rowIndex) in tblRows" :key="rowIndex">
          <td
            v-if="
              rowConfig.criteriaGroup && rowConfig.criteriaGroup.rowSpan > 0
            "
            :rowspan="rowConfig.criteriaGroup.rowSpan"
            class="criteria-group"
            :class="[isCollapsed ? '' : 'd-none']"
          >
            {{ rowConfig.criteriaGroup.text }}
          </td>
          <td v-if="rowConfig.criteria" class="criteria">
            {{ rowConfig.criteria }}
          </td>
        </tr>
      </table>
    </div>

    <div class="free-cols-right__container">
      <table class="free-cols-right__table">
        <tr>
          <td>
            <!-- KHPOT-67: by default, showing: shelf price, promo 1, 2, 3 -->
            <!-- and adding an icon to expand the rest -->
            <template v-if="isCollapsed">
              <div class="collapse-expand__icon">
                <a-icon
                  id="expand-icon"
                  type="plus-circle"
                  title="Show more columns"
                  :style="{ fontSize: '22px', color: '#5c6c7f' }"
                  @click="onClickAddColumns()"
                />
              </div>
            </template>

            <!-- and adding an icon next to collapse these additional columns -->
            <template v-else>
              <div class="collapse-expand__icon">
                <a-icon
                  id="collapse-icon"
                  type="minus-circle"
                  title="Hide additional columns"
                  :style="{ fontSize: '22px', color: '#5c6c7f' }"
                  @click="onClickHideColumns()"
                />
              </div>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

import { SheetClip, TableCellSelector } from "@/libs";
import { PROMO_TACTIC_MULTIBUY, PROMO_TACTIC_OOG_MULTIBUY } from "@/constants";
import EventBus from "@/EventBus";

const apiUrl = import.meta.env.VITE_API_URL;

const KEY_CODES = {
  down: 40,
  right: 39,
  up: 38,
  left: 37,
  enter: 13,
  tab: 9,
};

export default {
  name: "ColorfulEditableTable",

  directives: {
    scroll: {
      inserted: (el, binding) => {
        let f = (event) => {
          if (binding.value(event, el)) {
            el.removeEventListener("scroll", f);
          }
        };

        el.addEventListener("scroll", f);
      },
    },
  },

  inject: ["optionsProps", "parametersProps", "selectedScenarioIds"],

  props: {
    tblWidth: {
      /** ex: "787px" or "70%" */
      type: String,
      default: "100%",
    },
    tblColumns: {
      type: Array,
      default: null,
    },
    tblRows: {
      type: Array,
      default: null,
    },
    tblData: {
      type: Array,
      default: null,
    },
    tblName: {
      type: String,
      default: "",
    },
    gapX: {
      /** gapX stands for taking gapX column(s) to show the row name (criteria group and criteria) */
      type: Number,
      default: 0,
    },
    gapY: {
      /** gapY stands for the number of row to show the table header */
      type: Number,
      default: 0,
    },
    uneditable: {
      type: Boolean,
      default: false,
    },
    syncCollapse: {
      type: Boolean,
      default: true,
    },
    allowClearHeader: {
      type: Boolean,
      default: false,
    },
    disableHeader: {
      type: Boolean,
      default: false,
    },
    isAccountGroup: {
      type: Boolean,
      default: false,
    },
    isShowDeltaField: {
      type: Boolean,
      default: false,
    },
    poId: {
      type: [String, Number],
      default: null,
    },
    planId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      apiUrl,
      defaultBaseVolume: undefined,
      tcs: null,
      tcsBuffer: null,
      pastedData: [],
      newValues: [],
      scenarioDetails: [],
      promoTacticData: [],
      invisibleColumns: [],
      isCollapsed: true,
      minTabIndex: 100,
      tabIndex: null,
    };
  },

  computed: {
    inputs() {
      return this.tblRows ? this.tblRows.map((item) => item.dataIndex) : [];
    },

    tblFreezeColumns() {
      if (!this.tblColumns || this.tblColumns.length === 0) return [];

      return this.tblColumns.filter((item) => item.fixed);
    },

    headerLength() {
      return this.tblColumns.length;
    },

    maxTabIndex() {
      return this.inputs.length * this.headerLength + this.minTabIndex - 1;
    },

    tacticMultiBuyId() {
      const tacticMultibuy = this.promoTacticData.reduce(
        (totalObj, currentObj) => {
          if (
            currentObj.description == PROMO_TACTIC_MULTIBUY ||
            currentObj.description == PROMO_TACTIC_OOG_MULTIBUY
          )
            totalObj.push(currentObj.id);

          return totalObj;
        },
        []
      );

      if (tacticMultibuy && tacticMultibuy.length) return tacticMultibuy;

      return 5;
    },

    listParameters() {
      return this.parametersProps.crud.getList();
    },

    parameterEntity() {
      return this.parametersProps.crud.getEntityForm("editForm");
    },
  },

  watch: {
    tblData(newVal) {
      if (this.tcs) {
        this.destroyTcs();
      }

      this.scenarioDetails = this._.cloneDeep(newVal);
      this.storeTblData(this.tblName, newVal);

      this.$nextTick(() => {
        this.initTcs();
      });

      this.remapColumnTitle(newVal);
      this.getDefaultBaseVolume();
    },

    syncCollapse(newVal) {
      this.isCollapsed = newVal;

      if (newVal) {
        this.hideAdditionalColumns();
      } else {
        this.showAllColumns();
      }
    },
  },

  mounted() {
    this.scenarioDetails = this.tblData;
    this.storeTblData(this.tblName, this.tblData);
    this.getPromoTactic();
    this.invisibleColumns = this.getIndexOfInvisibleItems(this.tblColumns);
    this.remapColumnTitle(this.tblData);

    this.$nextTick(() => {
      this.initTcs();
    });
    this.setPromoEntryKeyActions();
    this.getDefaultBaseVolume();
  },

  beforeDestroy() {
    this.destroyTcs();
    EventBus.$off("change-parameters-evt");
    EventBus.$off("pasted-data-into-table");
  },

  methods: {
    lastColumnIndex() {
      const totalColumns = this.tblColumns.length;
      const totalInvisibleColumns = this.invisibleColumns.length;

      /** substract 1 because the column's index starting from 0 */
      return totalColumns - totalInvisibleColumns - 1;
    },

    getIndexOfInvisibleItems(columns) {
      let indexOfInvisibleItem = [];
      if (!columns || !columns.length) return indexOfInvisibleItem;

      columns.forEach((item, index) => {
        if (item.hidden) {
          indexOfInvisibleItem.push(index);
        }
      });

      return indexOfInvisibleItem;
    },

    initTcs() {
      const tcsOptions = {
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
      this.tcs = new TableCellSelector(this.$refs.poTbl, tcsOptions, buffer);
    },

    destroyTcs() {
      this.tcsBuffer.destroy();
      this.tcs.destroy();
    },
    /** handleScroll: emit the value of scrollLeft to serve the synchronous scrolling between multi-tables */
    handleScroll(evt) {
      const sLeft = evt.target.scrollLeft;
      this.$emit("scroll", sLeft);
    },

    formatData(val) {
      if (isNaN) return val;
      return +val;
    },

    onBlurEntity(dataIndex, record) {
      if (dataIndex === "baseVolume" && !record.baseVolume)
        this.setBaseVolumeToDefault(record);

      this.$emit("change", this.scenarioDetails);
    },

    onClearOverwritten(dataIndex, record, disabled) {
      if (
        dataIndex === "baseVolume" &&
        !isNaN(this.defaultBaseVolume) &&
        !disabled
      ) {
        record[dataIndex] = this.defaultBaseVolume;
        record.overridden[dataIndex] = false;
        this.tabIndex = null;
      }
    },

    onChangeHeader(index, tacticId) {
      if (this._.isNil(this.scenarioDetails[index])) return;

      /** if selected tactic !== Multibuy: autopopulate redemptionQty = 1 and redemption = 100
       * else (sleected tactic == Multibuy): clear autopopulated values of redemptionQty and redemption
       */

      if (tacticId && !this.tacticMultiBuyId.includes(tacticId)) {
        this.scenarioDetails[index].redemption = 100;
        this.scenarioDetails[index].redemptionQty = 1;
      } else {
        this.scenarioDetails[index].redemption = null;
        this.scenarioDetails[index].redemptionQty = null;
      }

      this.storeValue(index, "tacticId", tacticId);
      this.storeTblData(this.tblName, this.scenarioDetails);
    },

    onChangeDataCell(columnNo, key, value) {
      this.storeValue(columnNo, key, value);
    },

    setBaseVolumeToDefault(scenarioDetail) {
      const { avgPromoPrice, tacticId, freqWeeks } = scenarioDetail;
      if (avgPromoPrice && tacticId && freqWeeks) {
        scenarioDetail.baseVolume = this.defaultBaseVolume;
        scenarioDetail.overridden.baseVolume = false;
      }
    },

    storeValue(index, key, value) {
      if (this.scenarioDetails) {
        let scenarioDetail = this.scenarioDetails[index];

        const newValue = this.formatData(value);
        scenarioDetail[key] = newValue;

        switch (key) {
          case "tacticId":
            this.tblColumns[index + this.gapX].title = value;
            this.setBaseVolumeToDefault(scenarioDetail);
            break;

          case "baseVolume":
            if (value != this.defaultBaseVolume)
              scenarioDetail.overridden.baseVolume = true;
            else if (value == this.defaultBaseVolume)
              scenarioDetail.overridden.baseVolume = false;
            break;

          case "avgPromoPrice":
          case "freqWeeks":
            this.setBaseVolumeToDefault(scenarioDetail);
            break;

          default:
            break;
        }

        scenarioDetail[key] = newValue;
        this.$emit("change", this.scenarioDetails);
      }
    },

    storeTblData(key, tblData) {
      this.optionsProps.crud.updateEntity("editForm", {
        resourceKey: key,
        value: tblData,
      });
    },

    async getDefaultBaseVolume() {
      const url = `${this.apiUrl}/promotion-planning/common/basevolume`;
      const { data } = await this.axios.get(url, {
        params: {
          promotionOptimisationId: this.poId || this.$route.params.id,
          planId: this.planId || this.selectedScenarioIds[this.tblName].id,
        },
      });

      if (data) {
        this.defaultBaseVolume = data.baseVolume;
      }
    },

    getParameters(tblName) {
      let editingScenario = this.selectedScenarioIds[tblName].id;
      let parameters = {
        price: 0,
        tradingTerms: 0,
      };

      if (
        this.parameterEntity &&
        editingScenario === this.parameterEntity.planId
      ) {
        return { ...parameters, ...this.parameterEntity };
      } else {
        const found = this.listParameters.find(
          (item) => item.planId === editingScenario
        );

        if (!found) return parameters;

        return { ...parameters, ...found };
      }
    },

    onContextMenuOpen(e) {
      /** If there is any element with tcs-select in class, it means at least one cell was selected.
       *  Then, we won't do anything to keep the current selection.
       *  Else, we add the .tcs-select to the cell at the current position.
       * */
      const dataset = e.currentTarget.dataset;

      if (this.$refs.poTbl.querySelector(".tcs-select") || !dataset) return;

      const coordX = +dataset.coordX;
      const coordY = +dataset.coordY;

      this.tcs.select([coordY, coordX], [coordY, coordX]);
    },

    onCopy() {
      this.tcs.copy();
    },

    parseDataForCopying(cell) {
      if (!cell || !cell.dataset) return;

      return cell.dataset.value;
    },

    async onPaste() {
      const selectedCells = this.$refs.poTbl.querySelector(".tcs-select");
      if (!selectedCells || !selectedCells.dataset) return;

      const coordX = +selectedCells.dataset.coordX;
      const coordY = +selectedCells.dataset.coordY;

      try {
        const clipboardText = await window.navigator.clipboard.readText();
        this.tcs.paste(SheetClip.parse(clipboardText), [coordY, coordX]);
      } catch (error) {
        console.log(error);
      }
    },

    parseDataForPasting(cell, data) {
      if (this._.isNil(data)) return;

      let copiedValue;
      const { field, optionId, planId, coordX } = cell.dataset;
      const itemIndex = +coordX - this.gapX;

      /** if the use inputs zero (0), showing zero in the table. else */
      if (data === 0 || data === "0" || isNaN(data)) {
        copiedValue = data;
      } else if (typeof data === "string" && !data.length) {
        copiedValue = null;
      } else {
        copiedValue = +data;
      }

      /** index: stands for index in the tblData array */
      const cellInfo = {
        index: itemIndex,
        [field]: copiedValue,
        optionId: +optionId,
        planId: +planId,
      };

      if (field === "baseVolume") {
        Object.assign(cellInfo, {
          overridden: { baseVolume: data !== this.defaultBaseVolume },
        });
      }

      this.pastedData.push(cellInfo);
      this.afterPaste();
    },

    afterPaste: _.debounce(function() {
      this.$emit("pasted", this.pastedData);
      this.pastedData = [];
    }, 50),

    async getPromoTactic() {
      const { data } = await this.axios.get(
        `${this.apiUrl}/promotion-planning/common/tactic`
      );
      this.promoTacticData = [...data];
    },

    onDelete() {
      /** be noted that js-table-cell-selector will execute setCellFn() after clearing */
      this.tcs.clear();
    },

    onClickAddColumns() {
      this.isCollapsed = false;

      this.showAllColumns();

      const expandEvent = new CustomEvent("syncCollapse", {
        bubbles: true,
        detail: {
          isCollapsed: false,
        },
      });

      const expandIconEle = document.querySelector("#expand-icon");

      expandIconEle.dispatchEvent(expandEvent);
    },

    onClickHideColumns() {
      this.isCollapsed = true;

      this.hideAdditionalColumns();

      const collapseEvent = new CustomEvent("syncCollapse", {
        bubbles: true,
        detail: {
          isCollapsed: true,
        },
      });

      const collapseIconEle = document.querySelector("#collapse-icon");
      collapseIconEle.dispatchEvent(collapseEvent);
    },

    showAllColumns() {
      /** remove all items in the invisibleColumns, then there is no hidden item */
      this.invisibleColumns.length = 0;
    },

    hideAdditionalColumns() {
      this.invisibleColumns = this.getIndexOfInvisibleItems(this.tblColumns);
    },

    remapColumnTitle(arr) {
      if (arr.length > 0) {
        arr.forEach((ele, index) => {
          this.tblColumns[index + this.gapX].title = ele.tacticId;
        });
      }
    },

    getTabIndex(dataIndex, entryIndex) {
      const inputIndex = this.inputs.findIndex((input) => input === dataIndex);

      if (inputIndex < 0) return null;

      return entryIndex + inputIndex * this.headerLength + this.minTabIndex;
    },

    onEntryInputClick(tabIndex) {
      this.tabIndex = tabIndex;
    },

    setPromoEntryKeyActions() {
      window.addEventListener("keydown", (e) => {
        const { keyCode } = e;
        const { down, right, up, left, enter, tab } = KEY_CODES;
        let { tabIndex } = this;

        switch (keyCode) {
          case down:
          case enter:
            tabIndex += this.headerLength;
            break;

          case right:
            tabIndex += 1;
            break;

          case up:
            tabIndex -= this.headerLength;
            break;

          case left:
            tabIndex -= 1;
            break;

          case tab:
            e.preventDefault();
            tabIndex += 1;
            break;
        }

        if (tabIndex >= this.minTabIndex && tabIndex <= this.maxTabIndex) {
          this.tabIndex = tabIndex;
        }

        this.$nextTick(() => {
          const inputFocusing = document.querySelector(
            ".colorful-editable-table__container .colorful-editable-table td.focusing"
          );

          const main = document.querySelector(".ant-layout-content");
          const footer = document.querySelector(".promo-detail__footer");
          const header = document.querySelector(".ant-layout-header");

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

    onEntryTableBlur() {
      this.tabIndex = null;
    },
  },
};
</script>

<style lang="scss">
.colorful-editable-table__container {
  position: relative;
  font-size: 12px;

  table,
  th,
  td {
    border: 1px solid #cdd3db;
    border-collapse: collapse;
  }

  th,
  td {
    // white-space: nowrap;
    color: #272d35;
  }

  th {
    padding: 4px 5px;
  }

  td {
    padding: 4px 10px;

    &.overridden {
      color: #1b00ff;
      font-weight: bold;
    }
  }

  .underlying-table__container {
    overflow-x: auto;
    /** 130px is the width of the last column that contains the icon to expand or collapse */
    width: calc(100% - 100px);
  }

  .freeze-cols__container {
    position: absolute;
    top: 0;
    left: 0;

    .freeze-cols {
      box-shadow: 1px 0 5px #cdd3db;
    }
  }

  .free-cols-right__container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;

    .free-cols-right__table {
      height: 100%;
      width: 101px;
      box-shadow: -4px 0px 16px rgba(0, 45, 87, 0.1);
    }
  }

  .colorful-editable-table {
    > tr {
      .th-criteria-group {
        width: 80px;
      }

      .th-criteria {
        width: 205px;
      }

      .editable-label__content {
        justify-content: flex-end;
      }
    }
  }

  .po-table--base {
    &.colorful-editable-table--collapsed {
      .th-data-col {
        /** width of a column to display data equals ((100% - [total width of criteria_group and criteria]) / 4)  */
        width: calc(25% - 82px);
        max-width: calc(25% - 82px);
      }
    }
  }

  .po-table--comparison {
    &.colorful-editable-table--collapsed {
      .th-data-col {
        width: 25%;
        max-width: 25%;
      }
    }
  }

  .colorful-editable-table {
    width: 100%;
  }

  /* criteria group */
  .criteria-group {
    background-color: #eaedf0;
  }
  /* details */
  .criteria {
    background-color: #ffffff;
  }

  /* shelf price */
  .data-col-0 {
    background-color: #ffffff;
  }
  /* promo 1 */
  .data-col-1 {
    background-color: #eefffa;
  }
  /* promo 2 */
  .data-col-2 {
    background-color: #fff7e6;
  }
  /* promo 3 */
  .data-col-3 {
    background-color: #f9f0ff;
  }
  /* promo 4 */
  .data-col-4 {
    background-color: #feffe6;
  }
  /* promo 5 */
  .data-col-5 {
    background-color: #fff1f0;
  }
  /* promo 6 */
  .data-col-6 {
    background-color: #e6fffb;
  }
  /* promo 7 */
  .data-col-7 {
    background-color: #f0f5ff;
  }
  /* promo 8 */
  .data-col-8 {
    background-color: #fff0f6;
  }
  /* promo 9 */
  .data-col-9 {
    background-color: #fcffe6;
  }

  .text-right {
    text-align: right;
  }

  .tcs-select {
    background: #e5efff !important;
  }

  .collapse-expand__icon {
    text-align: center;
  }

  .ant-select-allow-clear {
    .ant-select-clear-icon {
      color: #f5222d;
    }
  }

  .fs-12 {
    span {
      font-size: 12px;
    }
  }

  .ant-form-item {
    margin-bottom: 0px;
  }
}
</style>
