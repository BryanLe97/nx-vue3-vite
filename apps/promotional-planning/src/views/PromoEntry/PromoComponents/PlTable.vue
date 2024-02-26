<template>
  <div class="pl-table">
    <a-row class="mt-4" :gutter="24">
      <a-col :span="12">
        <a-card :loading="loading">
          <table width="100%" class="table table-custom2">
            <tr class="header">
              <th
                rowspan="1"
                class="legend-title border-top border-left grey-cell"
              >
                KH P&L
              </th>
              <td class="header-td">Value 000's</td>
              <td class="header-td">% Sales</td>
            </tr>
            <tr
              v-for="(row, index) in listRowNamePl"
              :key="index"
              :class="[
                'body',
                `${row.isBold ? 'bold' : 'none-bold'}`,
                `${row.noneBorder ? 'none-border-top' : ''}`,
                { version: row.dataIndex === 'version' },
              ]"
            >
              <th
                v-if="row.dataIndex !== 'version'"
                :style="
                  row.dataIndex === 'costOfGoods' ? 'padding-left: 10px' : ''
                "
              >
                <span :class="row.isChild ? 'last-child black' : ''">{{
                  row.name
                }}</span>
              </th>
              <td
                v-for="(data, i) in !enabledEntry ? plTable : headerPl"
                :key="'a' + i"
                :class="{ active: data.isActive }"
              >
                <span :class="row.isChild ? 'last-child' : ''">{{
                  parsePLValue(data, row)
                }}</span>
              </td>
              <td
                v-for="(data, i) in !enabledEntry ? plTable : headerPl"
                :key="'b' + i"
                :class="{ active: data.isActive }"
              >
                <span :class="row.isChild ? 'last-child' : ''">{{
                  parsePLValue(data, row, "%")
                }}</span>
              </td>
            </tr>
          </table>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card :loading="loading">
          <table width="100%" class="table table-custom2">
            <tr class="header">
              <th
                rowspan="1"
                class="legend-title border-top border-left grey-cell"
              >
                Retailer P&L (Excl GST)
              </th>
              <td class="header-td">Value 000's</td>
              <td class="header-td">% Sales</td>
            </tr>
            <tr
              v-for="(row, index) in listRowNamePlRetail"
              :key="index"
              class="body"
              :class="[
                'body',
                `${row.isBold ? 'bold' : 'none-bold'}`,
                `${row.noneBorder ? 'none-border-top' : ''}`,
                { version: row.dataIndex === 'version' },
              ]"
            >
              <th
                v-if="row.dataIndex !== 'version'"
                :style="
                  row.dataIndex === 'costOfGoods2' ? 'padding-left: 10px' : ''
                "
              >
                <span
                  :class="[
                    { hidden: row.name === 'none' },
                    row.isChild
                      ? 'last-child black'
                      : row.isFirstChild
                      ? 'first-child black'
                      : '',
                  ]"
                >
                  {{ row.name }}
                </span>
              </th>
              <td
                v-for="(data, i) in !enabledEntry ? plTable : headerPl"
                :key="'c' + i"
                :class="{ active: data.isActive }"
              >
                <span
                  :class="[
                    { hidden: row.name === 'none' },
                    row.isChild
                      ? 'last-child'
                      : row.isFirstChild
                      ? 'first-child'
                      : '',
                  ]"
                >
                  {{ row.name === "none" ? "" : parsePLValue(data, row) }}
                </span>
              </td>
              <td
                v-for="(data, index) in !enabledEntry ? plTable : headerPl"
                :key="'d' + index"
                :class="{ active: data.isActive }"
              >
                <span
                  :class="[
                    { hidden: row.name === 'none' },
                    row.isChild
                      ? 'last-child'
                      : row.isFirstChild
                      ? 'first-child'
                      : '',
                  ]"
                >
                  {{ parsePLValue(data, row, "%") }}
                </span>
              </td>
            </tr>
          </table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import numeral from "numeral";

import {
  COLOR_LIST_ENTRY_PRICE,
  LIST_ROW_NAME_ENTRY_KH_PL,
  LIST_ROW_NAME_ENTRY_RETAIL_PL,
  LIST_HEADER_PL,
} from "@/constants/entry.price";

export default {
  name: "PlTable",

  props: {
    plTable: {
      type: Array,
      required: true,
    },
    enabledEntry: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      colorList: COLOR_LIST_ENTRY_PRICE,
      headerPl: LIST_HEADER_PL,
      isEntrySaving: false,
      listRowNamePl: LIST_ROW_NAME_ENTRY_KH_PL,
      listRowNamePlRetail: LIST_ROW_NAME_ENTRY_RETAIL_PL,
    };
  },
  methods: {
    parsePLValue(data, row, type = null) {
      const { enabledEntry } = this;
      switch (type) {
        case "%":
          if (row.dataNextIndex === "rrpSaleValuePercent") {
            return data["rrpSaleValue"] === 0
              ? "N/A"
              : numeral(data[row.dataNextIndex]).format("0,0.0") + "%";
          }
          if (
            row.dataNextIndex === "consumerDiscountPercent" ||
            row.dataNextIndex === "khFundedPercent" ||
            row.dataNextIndex === "retailerFundedPercent"
          ) {
            return data[row.dataNextIndex] === 0
              ? "N/A"
              : numeral(data[row.dataNextIndex]).format("0,0.0") + "%";
          } else {
            return row.dataNextIndex === "version"
              ? enabledEntry
                ? data
                : "Ver. " + data[row.dataNextIndex]
              : data[row.dataNextIndex] || data[row.dataNextIndex] === 0
              ? numeral(data[row.dataNextIndex]).format("0,0.0") + "%"
              : "";
          }

        default:
          return row.dataIndex === "version"
            ? enabledEntry
              ? data
              : "Ver. " + data[row.dataIndex]
            : numeral(data[row.dataIndex]).format("0,0");
      }
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
  }

  .body > td {
    text-align: right;
  }

  .header-td {
    font-weight: 500;
    text-align: right;
    width: 150px;
  }

  tr:hover {
    background: #e6f7ff !important;
  }
}
.table-custom2 {
  .hight-light {
    td,
    th {
      font-weight: 500;
    }
  }

  .first-child {
    font-style: italic;
  }

  .last-child {
    padding-left: 15px;
    font-style: italic;
    font-size: 12px;
  }

  .bold {
    td,
    th {
      border-top: 1px solid #cdd3db;
      font-weight: 500;
      color: #272d35;
    }
  }

  .body:last-child {
    border-bottom: 1px solid #cdd3db;
  }

  .header-td {
    border: 1px solid #cdd3db;
  }

  .body th,
  .body > td:nth-child(2),
  .body > td:nth-child(3) {
    border-left: 1px solid #cdd3db;
  }

  .black {
    color: #4c4a4a;
  }

  .body > td.active {
    color: #0062ff;
  }

  .body > td:last-child {
    border-right: 1px solid #cdd3db;
  }

  .none-bold {
    th {
      padding-left: 30px;
    }
    th,
    td {
      font-weight: 400;
      color: #5c6c7f;
    }
  }

  .legend-title {
    font-size: 16px;
    padding-left: 0;
    padding-top: 0;
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
    &.version {
      td {
        border-left: none !important;

        &:nth-child(1),
        &:nth-child(4) {
          border-left: 1px solid #cdd3db !important;
        }
      }
    }

    th {
      span {
        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
