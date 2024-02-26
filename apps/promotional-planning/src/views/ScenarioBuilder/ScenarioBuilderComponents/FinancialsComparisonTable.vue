<template>
  <div v-if="tableData" class="financials-comparison-table">
    <div class="w-100 d-flex justify-content-end">
      <h4 v-if="title">{{ title }}</h4>
    </div>
    <a-tooltip title="Re-calculate">
      <a-button
        v-if="hasReload"
        class="reload-button mb-2"
        shape="circle"
        icon="reload"
        :loading="reloading"
        @click="onReload"
      />
    </a-tooltip>
    <table v-if="!tableData.message">
      <tr class="financials-comparison-table__header">
        <td></td>
        <td>Base</td>
        <td>New</td>
        <td>%</td>
      </tr>
      <tr v-for="row in tableRows" :key="row.dataIndex">
        <td>{{ row.title }}</td>
        <td>
          {{
            (currencyFields.includes(row.dataIndex) ? "$" : "") +
            formatDecimal(tableData.base[row.dataIndex], row.dataIndex) +
            (percentFields.includes(row.dataIndex) ? "%" : "")
          }}
        </td>
        <td>
          {{
            (currencyFields.includes(row.dataIndex) ? "$" : "") +
            formatDecimal(tableData.new[row.dataIndex], row.dataIndex) +
            (percentFields.includes(row.dataIndex) ? "%" : "")
          }}
        </td>
        <td>
          {{
            formatDecimal(tableData.percent[row.dataIndex]) +
            (percentFields.includes(row.dataIndex) ? "pp" : "%")
          }}
        </td>
      </tr>
    </table>

    <span v-else class="financials-comparison-table__noti">
      {{ tableData.message }}
    </span>
  </div>
</template>

<script>
import numeral from "numeral";
import { ErrorHandlerMixin } from "@kraftheinz/common";

import { FINANCIALS_COMPARISON_TABLE_ROWS } from "@/constants";

export default {
  name: "FinancialsComparisonTable",

  mixins: [ErrorHandlerMixin],

  inject: ["fetchComparisonData"],

  props: {
    title: {
      type: String,
      default: null,
    },
    tableData: {
      type: Object,
      default: undefined,
    },
    hasReload: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    const tableRows = FINANCIALS_COMPARISON_TABLE_ROWS;

    const percentFields = ["netCMAPercent", "gmPercent", "promoROI"];
    const currencyFields = ["pricePerUnits"];

    return {
      reloading: false,
      tableRows,
      percentFields,
      currencyFields,
    };
  },

  methods: {
    formatDecimal(value, dataIndex) {
      if (!value || isNaN(value)) return value;

      let formatType = "0,0.00";
      if (
        dataIndex &&
        dataIndex !== "pricePerUnits" &&
        !this.percentFields.includes(dataIndex)
      )
        formatType = "0,0";

      return numeral(value).format(formatType);
    },

    async onReload() {
      this.reloading = true;
      try {
        await this.fetchComparisonData();
        this.reloading = false;
      } catch (err) {
        this.displayErrorNotification(err);
      }
    },
  },
};
</script>

<style lang="scss">
.financials-comparison-table {
  width: fit-content;

  .reload-button {
    margin-left: 100px;
  }

  th,
  td {
    min-width: 100px;
    color: #272d35;
    white-space: nowrap;
    border: 1px solid #cdd3db;
    border-collapse: collapse;
  }

  th,
  td:not(td:first-child) {
    text-align: center;
  }

  tr {
    th:first-child,
    td:first-child {
      border: none;
    }
  }

  th {
    padding: 4px 5px;
  }

  &__header {
    td:not(td:first-child) {
      background: #0072c3;
      color: white;
    }
  }

  &__noti {
    white-space: nowrap;
    color: red;
  }
}
</style>
