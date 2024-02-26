<template>
  <div class="key-metric">
    <a-card class="key-matrics-container" :loading="loading">
      <div class="header-matrix">
        <select-input
          label="Key Metrics by Price Point"
          :data-source="keyMetrics"
          source="value"
          source-label="name"
          :value="key"
          @change="changeTypeKeyMetric"
        />
      </div>

      <table width="100%" class="table table-custom mt-3 key-matrics">
        <tr class="header">
          <th class="border-top border-left grey-cell">Promo</th>
          <td
            v-for="(data, index) in !enabledEntry
              ? keyMetric
              : headerCreateMetric"
            :key="index"
            class="border-top header-td"
            :style="{
              backgroundColor: colorList[index].code || '',
              borderColor: colorList[index].code || '',
              borderBottom: '1px solid #cdd3db',
            }"
          >{{ !enabledEntry ? data.name : data }}</td>
        </tr>

        <tr
          v-for="row in listRowNameMatric"
          :key="row.name"
          :class="['body', { 'none-border': row.dataIndex === 'none' }]"
        >
          <th>
            <span :class="{ hidden: row.name === 'hide' }">{{ row.name }}</span>
          </th>

          <td
            v-for="(data, index) in !enabledEntry
              ? keyMetric
              : headerCreateMetric"
            :key="index"
            :class="{ negative: data[row.dataIndex] < 0 }"
          >
            <template v-if="data[row.dataIndex]">
              <template v-if="row.dataIndex === 'cmaPercent' && data[row.dataIndex] < 0">N/A</template>

              <template
                v-else-if="specialFormat[key].includes(row.dataIndex)"
              >{{ data[row.dataIndex] | numeral(row.numberFormat2) }}</template>

              <template v-else>
                <span
                  v-if="row.type == 'dollar'"
                >{{ data[row.dataIndex] | numeral(row.numberFormat) }}</span>

                <span v-else>{{ (data[row.dataIndex] / 100) | numeral(row.numberFormat) }}</span>
              </template>
            </template>
          </td>
        </tr>
      </table>
    </a-card>
  </div>
</template>
<script>
import {
  COLOR_LIST_ENTRY_PRICE,
  LIST_ROW_NAME_ENTRY_METRICS,
  LIST_HEADER_METRIC,
} from "@/constants/entry.price";

const key = {
  total: "total",
  unit: "unit",
};

const keyMetrics = [
  {
    value: key.total,
    name: "Total",
  },
  {
    value: key.unit,
    name: "Unit",
  },
];

const specialFormat = {
  [key.total]: ["cma", "rsv", "retailerMargin"],
  [key.unit]: ["nsv"],
};

export default {
  name: "KeyMetric",

  props: {
    keyMetric: {
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
      headerCreateMetric: LIST_HEADER_METRIC,
      listRowNameMatric: LIST_ROW_NAME_ENTRY_METRICS,
      keyMetrics,
      key: key.total,
      specialFormat,
    };
  },

  methods: {
    changeTypeKeyMetric(key) {
      this.key = key;
      this.$emit("changeType", key);
    },
  },
};
</script>

<style lang="scss" scoped>
.key-matrics-container {
  margin-top: 24px;

  .header-matrix {
    .select-input {
      display: flex;
      align-items: center;

      ::v-deep {
        label {
          color: #272d35;
          font-size: 16px;
          font-weight: 500;
          margin-right: 16px;
        }

        .ant-select {
          width: 110px;
        }
      }
    }
  }
}

.table-custom {
  th,
  td {
    border-right: 1px solid #cdd3db;
    border-bottom: 1px solid #cdd3db;
  }

  .border-top {
    border-top: 1px solid #cdd3db;
  }

  .grey-cell {
    background-color: #eaedf0;
  }

  .body > th,
  .border-left {
    border-left: 1px solid #cdd3db;
    font-weight: 400;
  }

  th {
    span {
      &.hidden {
        visibility: hidden;
      }
    }
  }
}

.key-matrics {
  .body {
    > th {
      background-color: #eaedf0;
    }

    td {
      background-color: #f6f6fa;

      &.negative {
        color: #f5222d;
      }
    }
  }
}

.key-matrics {
  .body > th {
    background-color: #eaedf0;
  }

  .body td {
    background-color: #f6f6fa;
  }
}

.table {
  color: #272d35;

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
}

.key-matrics-container {
  table tr td {
    width: 7.5%;
  }
}
</style>
