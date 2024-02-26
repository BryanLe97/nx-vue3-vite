<template>
  <div ref="priceTable" class="price-table__container">
    <div
      id="priceTable"
      v-scroll="handleScroll"
      class="price-table_scroll"
      :style="{
        overflowX: 'auto',
        borderRight: '1px solid #cdd3db',
        width: formatWidthTable(),
      }"
    >
      <table class="table table-custom2" style="width: 100%">
        <tr class="tbl-header">
          <th
            v-if="isShowRowCell"
            :colspan="syncCollapse ? '2' : '1'"
            class="header-td"
            :style="{ minWidth: syncCollapse ? '286px' : '205px' }"
          ></th>
          <th
            v-for="(header, index) in listHeaderName"
            :key="index"
            :style="{
              minWidth: header.width,
              backgroundColor: header.headerBgColor,
              textAlign: header.align,
              textWrap: 'noWrap',
            }"
            class="header-td"
            :class="[invisibleColumns.includes(index) ? 'd-none' : '']"
          >
            {{ header.title }}
          </th>
        </tr>

        <template v-for="(row, index) in listRowNameTable">
          <tr
            v-if="isRowVisible(row.dataIndex)"
            :key="index"
            :class="[checkRowClass(row), `row-${index}`]"
            @mouseover="addClassHover"
            @mouseleave="removeClassHover"
          >
            <th
              v-if="isShowRowCell"
              :class="[checkRowThClass(row), 'text-truncate']"
              :rowspan="rowSpanList[row.dataIndex]"
              :style="{
                fontWeight: listBoldSummaryKey.includes(row.dataIndex)
                  ? '500'
                  : 'normal',
              }"
            >
              <template v-if="row.rowspan && isInvGroup(row.group)">
                <a-dropdown :trigger="['click']" class="d-top-right">
                  <a-icon type="caret-down" />
                  <a-menu slot="overlay" @click="onSelectRow">
                    <a-menu-item key="InvKHC">Inv Buy KHC (000s)</a-menu-item>
                    <a-menu-item key="InvBanner">
                      Inv Buy Retailer (000s)
                    </a-menu-item>
                    <a-menu-item key="InvStore">
                      Inv Buy Store (Blended)
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              {{ row.title }}
            </th>
            <template v-if="!row.rowspan">
              <td
                v-for="(val, indexN) in remapTableDatas(row.dataIndex)"
                :key="indexN"
                :class="[
                  `data-col-${indexN}`,
                  invisibleColumns.includes(indexN) ? 'd-none' : '',
                  isNagativeNumber(val) ? 'nagative-number-color' : '',
                ]"
                style="min-width: 80px"
              >
                {{ formatValue(val) }}
              </td>
              <td
                style="min-width: 100px"
                :class="[syncCollapse ? 'd-none' : '']"
              >
                -
              </td>
            </template>
          </tr>
        </template>
      </table>
    </div>

    <div
      v-if="isShowRowCell"
      id="priceTableLeft"
      class="price-table-fixed-left"
    >
      <table class="table table-custom2 freeze-cols">
        <tr class="tbl-header">
          <th
            :colspan="syncCollapse ? '2' : '1'"
            class="header-td"
            style="height: 28px"
          ></th>
        </tr>

        <template v-for="(row, index) in listRowNameTable">
          <tr
            v-if="isRowVisible(row.dataIndex)"
            :key="index"
            :class="[checkRowClass(row), `row-${index}`]"
            @mouseover="addClassHover"
            @mouseleave="removeClassHover"
          >
            <th
              :class="[checkRowThClass(row), 'text-truncate']"
              :rowspan="rowSpanList[row.dataIndex]"
              :style="{
                fontWeight: listBoldSummaryKey.includes(row.dataIndex)
                  ? '500'
                  : 'normal',
              }"
            >
              <template v-if="row.rowspan && isInvGroup(row.group)">
                <a-dropdown :trigger="['click']" class="d-top-right">
                  <a-icon type="caret-down" />
                  <a-menu slot="overlay" @click="onSelectRow">
                    <a-menu-item key="InvKHC">Inv Buy KHC (000s)</a-menu-item>
                    <a-menu-item key="InvBanner">
                      Inv Buy Retailer (000s)
                    </a-menu-item>
                    <a-menu-item key="InvStore">
                      Inv Buy Store (Blended)
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              {{ row.title }}
            </th>
          </tr>
        </template>
      </table>
    </div>

    <div id="priceTableRight" class="price-table-fixed-right">
      <table class="table table-custom2 freeze-cols">
        <tr class="tbl-header">
          <th class="header-td" style="height: 28px; min-width: 100px">
            Summary
          </th>
          <th v-if="isShowDeltaField" class="empty-column"></th>
          <th
            v-if="isShowDeltaField"
            class="header-td"
            style="height: 28px; text-align: center; min-width: 148px"
          >
            Delta
          </th>
        </tr>

        <template v-for="(row, index) in listRowNameTable">
          <tr
            v-if="isRowVisible(row.dataIndex)"
            :key="index"
            :class="[checkRowClass(row), `row-${index}`]"
            @mouseover="addClassHover"
            @mouseleave="removeClassHover"
          >
            <td
              v-if="!row.rowspan"
              :class="[
                isNagativeNumber(remapTotalDatas(row.dataIndex))
                  ? 'nagative-number-color'
                  : '',
                listBoldSummaryKey.includes(row.dataIndex)
                  ? 'font-weight-bold'
                  : 'font-weight-normal',
              ]"
              :style="{
                minWidth: '80px',
              }"
            >
              {{ formatValue(remapTotalDatas(row.dataIndex)) }}
            </td>
            <td
              v-if="!row.rowspan && isShowDeltaField"
              class="empty-column"
            ></td>
            <td
              v-if="!row.rowspan && isShowDeltaField"
              :class="[
                isNagativeNumber(remapDeltaDatas(row.dataIndex))
                  ? 'nagative-number-color'
                  : '',
                listBoldSummaryKey.includes(row.dataIndex)
                  ? 'font-weight-bold'
                  : 'font-weight-normal',
              ]"
              style="text-align: center"
            >
              {{ formatValueDelta(row.dataIndex) }}
            </td>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import {
  LIST_HEADER_NAME,
  LIST_FORMAT_CURRENCY_KEY,
  LIST_FORMAT_PERCENT_KEY,
  LIST_UPPERCASE_KEY,
  LIST_UPPERCASE_THREE_CHAR_KEY,
  LIST_BOLD_SUMMARY_KEY,
} from "@/constants/PerformanceOptimization/basic.pl";
import { PromoUtils } from "@/utils";

export default {
  name: "BasicView",

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

  mixins: [PromoUtils],

  props: {
    isShowRowCell: {
      type: Boolean,
      default: true,
    },
    listRowNameTable: {
      type: Array,
      default: () => [],
    },
    dataTable: {
      type: Object,
      default: () => {},
    },
    hiddenFields: {
      type: Array,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    syncCollapse: {
      type: Boolean,
      default: true,
    },
    isShowDeltaField: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tableWidth: 0,
      invisibleColumns: [],
      tblColumns: LIST_HEADER_NAME,
      listFormatCurrencyKey: LIST_FORMAT_CURRENCY_KEY,
      listFormatPercentKey: LIST_FORMAT_PERCENT_KEY,
      listUppercaseKey: LIST_UPPERCASE_KEY,
      listUpperThreeCharKey: LIST_UPPERCASE_THREE_CHAR_KEY,
      listBoldSummaryKey: LIST_BOLD_SUMMARY_KEY,
    };
  },

  computed: {
    listHeaderName() {
      const arr = cloneDeep(this.tblColumns);
      if (this.dataTable.optimisationType) {
        this.dataTable.optimisationType.forEach((ele, index) => {
          if (ele.tacticName) {
            arr[index].title = ele.tacticName;
          }
        });
      }

      return arr;
    },

    rowSpanList() {
      return this.listRowNameTable.reduce(
        (list, row) => ({
          ...list,
          ...(row.reference && this.isDataIndexVisible(row.dataIndex)
            ? {
                [row.reference]: (list[row.reference] ?? 1) + 1,
                [row.dataIndex]: 1,
              }
            : {}),
        }),
        {}
      );
    },
  },

  watch: {
    syncCollapse(newVal) {
      this.generateTable(newVal);
    },
  },
  mounted() {
    const ele = this.$refs.priceTable;
    const tblWidth = ele
      ? ele.querySelector("#priceTable table").clientWidth
      : "";
    this.tableWidth = tblWidth;
    this.generateTable(this.syncCollapse);
  },

  methods: {
    generateTable(isCollapsed) {
      if (isCollapsed) {
        this.hideAdditionalColumns();
      } else {
        this.showAllColumns();
      }
    },

    /** getDefaultCollapsedColumns: return an array of indexes of the items which has 'hidden' = 'true' */
    getDefaultCollapsedColumns() {
      if (!this.tblColumns || !this.tblColumns.length) return [];

      let indexOfInvisibleItem = [];
      this.tblColumns.forEach((item, index) => {
        if (item.hidden) {
          indexOfInvisibleItem.push(index);
        }
      });

      return indexOfInvisibleItem;
    },

    showAllColumns() {
      /** remove all items in the invisibleColumns, then there is no hidden columns */
      this.invisibleColumns = [];
    },

    hideAdditionalColumns() {
      /** hide all columns that its 'hidden' attribute equals 'true' */
      this.invisibleColumns = this.getDefaultCollapsedColumns();
    },

    isInvGroup(rowGroup) {
      const invGroup = ["InvKHC", "InvBanner", "InvStore"];
      return invGroup.includes(rowGroup);
    },

    checkRowClass(row) {
      let className = "body bg-light ";
      className += row.isBold ? "bold " : "";
      className += row.isRed ? "red " : " ";
      className += row.isBlue ? "blue " : " ";
      className += row.isHide ? "d-none " : " ";
      className += row.noneBorder ? "none-border-bottom " : "none-border-top ";
      className += row.rowspan ? "bg-row " : " ";
      className += row.isFirstChild ? "first-child " : " ";
      className += row.isFirstChild20 ? "first-child-20 " : " ";
      className += row.isSecondChild ? "second-child " : " ";
      className += row.isThirdChild ? "third-child " : " ";
      className += row.dataIndex === "spaceRow" ? "space-row " : " ";

      return className;
    },

    checkRowThClass(row) {
      let className = "";
      className += row.noneBorder == undefined ? "header-td " : "body-td ";
      className += row.rowspan ? "th-child-first " : "th-child-second ";
      className += row.rowspan && !this.syncCollapse ? "d-none " : " ";

      if (row.dataIndex === "spaceRow") {
        className = "header-td th-child-first";
      }

      return className;
    },

    remapUnit(key, value) {
      if (value && this.listFormatCurrencyKey.includes(key)) {
        return this.formatCurrency(value);
      } else if (value && this.listFormatPercentKey.includes(key)) {
        return value.toFixed(1) + "%";
      }
      return value != undefined ? this.formatDecimal(value) : "";
    },

    remapTableDatas(keys) {
      const data = [];
      if (this.dataTable && this.dataTable.optimisationType) {
        this.dataTable.optimisationType.forEach((x) =>
          data.push(x[keys] != undefined ? this.remapUnit(keys, x[keys]) : "")
        );
      }
      return data;
    },

    remapTotalDatas(keys) {
      if (this.dataTable && this.dataTable.total) {
        let key = "";

        if (this.listUppercaseKey.includes(keys)) {
          key = keys.toUpperCase();
        } else if (this.listUpperThreeCharKey.includes(keys)) {
          key = keys.slice(0, 3).toUpperCase() + keys.slice(3);
        } else {
          key = keys.charAt(0).toUpperCase() + keys.slice(1);
        }
        return this.remapUnit(keys, this.dataTable.total["total" + key]);
      }
    },
    onSelectRow({ key }) {
      this.listRowNameTable.forEach((element) => {
        if (element.group === key) {
          element.isHide = false;
        } else if (element.group) {
          element.isHide = true;
        }
      });
    },

    handleScroll(evt) {
      const sLeft = evt.target.scrollLeft;
      this.$emit("scrollX", sLeft);
    },

    addClassHover(e) {
      if (e) {
        const className = e.target.parentElement.className.split(" ").pop();
        const ele = this.$refs.priceTable;
        const priceTable = ele.querySelector(`#priceTable table .${className}`);
        const priceTableLeft = ele.querySelector(
          `#priceTableLeft table .${className}`
        );
        const priceTableRight = ele.querySelector(
          `#priceTableRight table .${className}`
        );

        priceTable ? priceTable.classList.toggle("price-row-hover") : "";
        priceTableLeft
          ? priceTableLeft.classList.toggle("price-row-hover")
          : "";
        priceTableRight
          ? priceTableRight.classList.toggle("price-row-hover")
          : "";
      }
    },

    removeClassHover(e) {
      if (e) {
        const className = e.srcElement.className.split(" ").pop();
        const ele = this.$refs.priceTable;
        const priceTable = ele.querySelector(`#priceTable table .${className}`);
        const priceTableLeft = ele.querySelector(
          `#priceTableLeft table .${className}`
        );
        const priceTableRight = ele.querySelector(
          `#priceTableRight table .${className}`
        );

        priceTable ? priceTable.classList.remove("price-row-hover") : "";
        priceTableLeft
          ? priceTableLeft.classList.remove("price-row-hover")
          : "";
        priceTableRight
          ? priceTableRight.classList.remove("price-row-hover")
          : "";
      }
    },

    isDataIndexVisible(dataIndex) {
      return !this.hiddenFields ? true : !this.hiddenFields.includes(dataIndex);
    },

    isRowVisible(dataIndex) {
      if (dataIndex === "spaceRow") return true;
      return this.isDataIndexVisible(dataIndex) && this.rowSpanList[dataIndex];
    },

    isNagativeNumber(value) {
      const val = this.convertValueToNumber(value);
      return val < 0 ? true : false;
    },

    formatValue(value) {
      if (!value || value == 0) return "";

      if (value.includes("$")) {
        let val = +value.replace(/,|\$/g, "");
        return val < 0
          ? `(${this.formatCurrency(Math.abs(val))})`
          : this.formatCurrency(val);
      } else if (value.includes("%")) {
        let val = +value.replace(/,|%/g, "");
        Math.abs(val) < 100 ? (val = val.toFixed(1)) : (val = val.toFixed());

        return val < 0 ? `(${Math.abs(val) + "%"})` : val + "%";
      }

      let val = +value.replace(/,/g, "");
      return val < 0
        ? `(${this.formatDecimal(Math.abs(val))})`
        : this.formatDecimal(val);
    },

    remapDeltaDatas(keys) {
      if (
        this.dataTable &&
        this.dataTable.total &&
        this.dataTable.totalBaseDatas
      ) {
        let key = "";
        if (this.listUppercaseKey.includes(keys)) {
          key = "total" + keys.toUpperCase();
        } else if (this.listUpperThreeCharKey.includes(keys)) {
          key = "total" + keys.slice(0, 3).toUpperCase() + keys.slice(3);
        } else {
          key = "total" + keys.charAt(0).toUpperCase() + keys.slice(1);
        }

        if (this.listFormatPercentKey.includes(keys)) {
          return this.dataTable.total[key] && this.dataTable.totalBaseDatas[key]
            ? (
                (this.dataTable.total[key] -
                  this.dataTable.totalBaseDatas[key]) *
                100
              )
                .toFixed(1)
                .toString()
            : "";
        }
        return this.dataTable.total[key] && this.dataTable.totalBaseDatas[key]
          ? (
              this.dataTable.total[key] - this.dataTable.totalBaseDatas[key]
            ).toString()
          : "";
      }
    },

    formatValueDelta(keys) {
      if (
        this.dataTable &&
        this.dataTable.total &&
        this.dataTable.totalBaseDatas
      ) {
        let key = "";
        if (this.listUppercaseKey.includes(keys)) {
          key = "total" + keys.toUpperCase();
        } else if (this.listUpperThreeCharKey.includes(keys)) {
          key = "total" + keys.slice(0, 3).toUpperCase() + keys.slice(3);
        } else {
          key = "total" + keys.charAt(0).toUpperCase() + keys.slice(1);
        }

        if (this.dataTable.total[key] && this.dataTable.totalBaseDatas[key]) {
          if (this.listFormatPercentKey.includes(keys)) {
            let val =
              this.dataTable.total[key] - this.dataTable.totalBaseDatas[key];
            return val.toFixed(1) == "0.0" || val.toFixed(1) == "-0.0"
              ? "-"
              : Math.abs(val) < 100
              ? val.toFixed(1) + "pp"
              : val.toFixed() + "pp";
          }

          if (keys === "weeksPS") {
            let val =
              this.dataTable.total[key] - this.dataTable.totalBaseDatas[key];
            return val.toFixed() == "0" ? "-" : val.toFixed();
          }

          if (["baseUnitsPS", "upliftUnitsPS"].includes(keys)) {
            let val =
              this.formatCurrency(
                this.dataTable.total[key] - this.dataTable.totalBaseDatas[key]
              ).replace("$", "") +
              ` (${this.percentage(
                this.dataTable.total[key],
                this.dataTable.totalBaseDatas[key]
              )})`;

            return [
              "0.00 (0.0%)",
              "-0.00 (0.0%)",
              "0.00 (0%)",
              "-0.00 (0%)",
            ].includes(val)
              ? "-"
              : val;
          }
          const cur = this.formatCurrency(
            this.dataTable.total[key] - this.dataTable.totalBaseDatas[key]
          );
          const per = this.percentage(
            this.dataTable.total[key],
            this.dataTable.totalBaseDatas[key]
          );
          let val = `${cur} (${per})`;
          if (keys == "sellInUnitsTU" || keys == "sellOutUnitsTU")
            val = val.replace("$", "");
          return this.isZeroVal({ cur, per }) ? "-" : val;
        }

        return "";
      }
    },

    isZeroVal(curPerVal) {
      const { cur, per } = curPerVal;
      return (
        parseFloat(cur.replace(/[^0-9.]/g, "")) == 0 &&
        parseFloat(per.replace(/[^0-9.]/g, "")) == 0
      );
    },

    formatWidthTable() {
      if (this.isShowDeltaField) {
        return this.syncCollapse ? "calc(100% - 268px)" : "calc(100% - 168px)";
      }
      return this.syncCollapse ? "calc(100% - 99px)" : "calc(100% + 1px)";
    },
  },
};
</script>
<style lang="scss" scoped>
.table {
  color: #272d35;
  th,
  td {
    padding: 3px 10px;
    overflow-wrap: break-word;
    color: #272d35;
    height: 28px;
  }
  .bg-light {
    background-color: #f9fafb;
  }

  .body > td {
    text-align: left;
    white-space: nowrap;
    text-align: right;
    border-right: 1px solid #cdd3db;
  }

  .header-td {
    font-weight: 500;
    text-align: left;
  }
}
.table-custom2 {
  .bold {
    td,
    th {
      border-top: 1px solid #cdd3db;
      color: #272d35;
      height: 28px;
    }
    td {
      font-weight: 400;
    }

    th {
      font-weight: 500;
    }
  }
  .red {
    th {
      border-top: 1px solid #cdd3db;
      color: #cc0000;
      height: 28px;
    }
  }
  .blue {
    th {
      border-top: 1px solid #cdd3db;
      color: #66a1ff;
      height: 28px;
    }
  }

  .body:last-child {
    border-bottom: 1px solid #cdd3db;
  }

  .header-td {
    border: 1px solid #cdd3db;
  }

  .body-td {
    border-right: 1px solid #cdd3db;
  }

  tr.price-row-hover > th,
  tr.price-row-hover > td {
    background: #e6f7ff !important;
  }

  .body > td:last-child {
    border-right: 1px solid #cdd3db;
  }

  .first-child {
    th {
      padding-left: 30px;
      font-weight: 500;
    }
    td {
      font-weight: 400;
    }
  }
  .first-child-20 {
    th {
      padding-left: 20px;
      font-weight: 500;
    }
    td {
      font-weight: 400;
    }
  }
  .second-child {
    th {
      padding-left: 60px;
      font-weight: 500;
    }
    td {
      font-weight: 400;
    }
  }
  .third-child {
    th {
      padding-left: 90px;
      font-weight: 500;
    }
    td {
      font-weight: 400;
    }
  }

  .none-border > th,
  .none-border > td {
    border-left: none !important;
    border-right: none !important;
    background-color: transparent !important;
  }

  .none-border-bottom {
    border-bottom: none !important;
  }

  .none-border > th {
    font-weight: 500 !important;
  }
  .none-border-top {
    th,
    td {
      border-top: none !important;
    }
  }

  tr {
    td {
      &:nth-child(1) {
        border-left: 1px solid #cdd3db;
      }
    }
  }
}

th {
  position: relative;
}

.d-top-right {
  position: absolute;
  top: 8px;
  right: 8px;
}

.d-none {
  display: none;
}

.border-bottom-0 {
  border-bottom: 0;
}

.bg-red {
  background: red;
}

.bg-row {
  background: #eaedf0;
}

.bg-highlight {
  background: #ffe7ba;
}

.th-child-first {
  width: 80px;
}
.th-child-second {
  width: 205px;
  border-left: 1px solid #cdd3db;
}
.price-table__container {
  position: relative;
  font-size: 12px;
  .price-table-fixed-left {
    position: absolute;
    top: 0;
    background: #ffff;
    left: 0;
    .freeze-cols tr:not(.space-row) {
      th.th-child-second {
        box-shadow: 1px 0 5px #cdd3db;
      }

      td {
        white-space: nowrap;
        text-align: right;
        min-width: 90px;
      }
    }
  }
  .price-table-fixed-right {
    position: absolute;
    top: 0;
    background: #ffff;
    right: 0;
    .freeze-cols tr:not(.space-row) {
      th.th-child-second {
        box-shadow: 1px 0 5px #cdd3db;
      }
    }

    .empty-column {
      width: 21px;
      background-color: #ffff;
      border-top: 1px solid #ffff;
      border-bottom: 1px solid #ffff;
    }
  }

  .nagative-number-color {
    color: #cc0000 !important;
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
}
.space-row {
  border-top: 1px solid #cdd3db;
  border-bottom: 1px solid #cdd3db;

  th,
  td {
    border-right: none !important;
    border-left: none !important;
    background-color: #fff !important;
  }
}
</style>
