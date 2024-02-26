<template>
  <div class="chart-aggregate mx-5 mb-4">
    <div>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-card>
            <div class="d-flex align-items-center justify-content-between">
              <h1 class="neutral-10--text mb-0">IRi</h1>

              <slot name="extra" />
            </div>

            <a-row :gutter="24" class="my-1">
              <a-col :span="4">
                <select-input
                  :data-source="listYear"
                  label="Data Source"
                  placeholder="Data Source"
                  source="code"
                  :value="selectFilter.year"
                  @change="filterChart($event, 'year')"
                />
              </a-col>
              <!-- <a-col :span="4">
                <number-input
                  key="maxPrice"
                  :min="0"
                  label="Max Price"
                  :value="selectFilter.maxPrice"
                  @change="filterChart($event, 'maxPrice')"
                />
              </a-col>-->
              <!-- <a-col :span="4">
                <number-input
                  key="indexStep"
                  :min="0"
                  label="Index Step"
                  :value="selectFilter.indexStep"
                  @change=" ($event, 'indexStep')"
                />
              </a-col>-->
            </a-row>

            <a-row :gutter="24" class="my-1">
              <a-col :span="24">
                <a-spin :spinning="isLoading" size="small">
                  <dual-axes
                    v-if="chartData.length > 0"
                    name="IRi"
                    :config="config"
                  />
                  <a-empty
                    v-if="!showTable && !chartData.length"
                    :image="EmptyImage.PRESENTED_IMAGE_SIMPLE"
                  />
                </a-spin>
              </a-col>
            </a-row>

            <a-row
              v-show="showTable"
              class="chart-aggregate__table mt-1 mb-3"
              :gutter="24"
            >
              <a-col :span="24">
                <a-dropdown :trigger="['contextmenu']">
                  <a-row type="flex">
                    <a-col v-if="selectFilter.year" :span="2">
                      <div
                        class="chart-aggregate__table-label-year d-flex justify-content-center align-items-center text-center"
                      >
                        <span class="h7">{{ selectFilter.year }}</span>
                      </div>

                      <div
                        class="chart-aggregate__table-label-total h7 text-center"
                      >
                        Total
                      </div>
                    </a-col>

                    <a-col :span="22">
                      <div ref="ChartTable">
                        <a-table
                          :columns="columns"
                          :data-source="chartTable"
                          :loading="isLoading"
                          :pagination="false"
                          :row-key="
                            (record) =>
                              record.min + record.max + record.totalRSVFY + ''
                          "
                          bordered
                          @change="onTableChange"
                        ></a-table>
                      </div>
                    </a-col>
                  </a-row>

                  <a-menu slot="overlay">
                    <a-menu-item key="copy" @click="onCopy">Copy</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import numeral from "numeral";

import { DualAxes } from "@kraftheinz/common";

import { URL_POT, URL_POT_CHART_YEAR } from "@/constants/api-endpoints";
import { PromoUtils } from "@/utils";
import { TableCellSelector } from "@/libs";

import { EmptyImage } from "@kraftheinz/common";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "Charts",

  components: { DualAxes },
  mixins: [PromoUtils],

  props: {
    promotionId: {
      type: Number,
      default: undefined,
    },

    showTable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      chartData: [],
      chartTable: [],
      chartTableDefault: [],
      columns: [],
      EmptyImage,
      isLoading: false,
      isMounted: true,
      listYear: [],
      selectFilter: {
        year: null,
        // maxPrice: 100,
        // indexStep: 10,
      },
      tcs: null,
      tcsBuffer: null,
    };
  },

  computed: {
    config() {
      return {
        autoFit: false,
        padding: [16, 16],
        data: [this.chartData, this.chartData],
        xField: "week",
        yField: ["unit", "price"],
        meta: {
          unit: {
            formatter: (val) => {
              return numeral(val).format("0,0");
            },
          },
        },
        legend: {
          offsetY: -5,
          position: "top-right",
          itemName: {
            formatter: (text) => {
              return text.charAt(0).toUpperCase() + text.slice(1);
            },
          },
        },
        yAxis: {
          unit: false,
          price: {
            min: 0,
            label: {
              formatter: () => ` `,
            },
            grid: {
              line: {
                style: {
                  lineWidth: 1,
                  lineDash: [2, 2],
                  cursor: "pointer",
                },
              },
            },
          },
        },
        geometryOptions: [
          {
            geometry: "column",
            color: "#17D395",
            label: {
              position: "middle",
              style: {
                fill: "#272D35",
                opacity: 0.6,
              },
            },
          },
          {
            geometry: "line",
            color: "#FFA940",
            lineStyle: {
              lineWidth: 2,
            },
            label: {
              position: "middle",
              style: {
                fill: "#272D35",
                opacity: 0.6,
              },
            },
            point: {
              size: 3,
              style: {
                fill: "white",
                stroke: "#FFA940",
                lineWidth: 2,
              },
            },
          },
        ],
      };
    },

    params() {
      return this.$route.params;
    },
  },
  watch: {
    params(val) {
      if (val) {
        this.getChartYear();
      }
    },

    columns(val) {
      if (val) {
        if (this.tcs) {
          this.destroyTcs();
        }

        this.$nextTick(() => {
          this.initTcs();
        });
      }
    },

    listYear(val) {
      if (this.isMounted && val && val.length > 0) {
        this.selectFilter.year = val[val.length - 1].code;
        this.fetchChartData();
        this.isMounted = false;
      }
    },
  },

  mounted() {
    this.getChartYear();
    this.initTcs();
  },

  beforeDestroy() {
    this.destroyTcs();
  },

  methods: {
    getChartYear() {
      const promotionId = this.promotionId ?? this.params.id;
      if (promotionId) {
        const url = apiUrl + URL_POT_CHART_YEAR + `?promotionId=${promotionId}`;

        this.axios
          .get(url)
          .then((res) => {
            let { data: values } = res;
            this.listYear = values.listYear;
          })
          .finally(() => (this.isLoading = false));
      }
    },

    customColumn(tableData) {
      if (tableData.length) {
        const valueTotalRSVFY = tableData[tableData.length - 1].totalRSVFY;
        const valueUnitFY = tableData[tableData.length - 1].totalUnitFY;

        this.columns = [
          {
            title: "Total RSV: " + this.formatCurrency(valueTotalRSVFY),
            children: [
              {
                title: "Avg PTC",
                children: [
                  {
                    title: "FY",
                    dataIndex: "avgPriceFY",
                    key: "avgPriceFY",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 0,
                          "data-coord-y": index + 3,
                          "data-field": "avgPriceFY",
                          "data-value": value,
                        },
                      };
                    },
                  },
                ],
              },
            ],
          },
          {
            title: " ",
            children: [
              {
                title: "Frequency (Weeks)",
                children: [
                  {
                    title: "Q1",
                    dataIndex: "freqWeeksQ1",
                    key: "freqWeeksQ1",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 1,
                          "data-coord-y": index + 3,
                          "data-field": "freqWeeksQ1",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q2",
                    dataIndex: "freqWeeksQ2",
                    key: "freqWeeksQ2",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 2,
                          "data-coord-y": index + 3,
                          "data-field": "freqWeeksQ2",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q3",
                    dataIndex: "freqWeeksQ3",
                    key: "freqWeeksQ3",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 3,
                          "data-coord-y": index + 3,
                          "data-field": "freqWeeksQ3",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q4",
                    dataIndex: "freqWeeksQ4",
                    key: "freqWeeksQ4",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 4,
                          "data-coord-y": index + 3,
                          "data-field": "freqWeeksQ4",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "FY",
                    dataIndex: "freqWeeksFY",
                    key: "freqWeeksFY",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value) : "",
                        attrs: {
                          "data-coord-x": 5,
                          "data-coord-y": index + 3,
                          "data-field": "freqWeeksFY",
                          "data-value": value,
                        },
                      };
                    },
                  },
                ],
              },
            ],
          },
          {
            title: `Total Units ${this.formatDecimal(valueUnitFY)}`,
            children: [
              {
                title: "Units/Week",
                children: [
                  {
                    title: "Q1",
                    dataIndex: "unitPerWeekQ1",
                    key: "unitPerWeekQ1",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value, true) : "",
                        attrs: {
                          "data-coord-x": 6,
                          "data-coord-y": index + 3,
                          "data-field": "unitPerWeekQ1",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q2",
                    dataIndex: "unitPerWeekQ2",
                    key: "unitPerWeekQ2",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value, true) : "",
                        attrs: {
                          "data-coord-x": 7,
                          "data-coord-y": index + 3,
                          "data-field": "unitPerWeekQ2",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q3",
                    dataIndex: "unitPerWeekQ3",
                    key: "unitPerWeekQ3",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value, true) : "",
                        attrs: {
                          "data-coord-x": 8,
                          "data-coord-y": index + 3,
                          "data-field": "unitPerWeekQ3",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "Q4",
                    dataIndex: "unitPerWeekQ4",
                    key: "unitPerWeekQ4",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value, true) : "",
                        attrs: {
                          "data-coord-x": 9,
                          "data-coord-y": index + 3,
                          "data-field": "unitPerWeekQ4",
                          "data-value": value,
                        },
                      };
                    },
                  },
                  {
                    title: "FY",
                    dataIndex: "unitPerWeekFY",
                    key: "unitPerWeekFY",
                    sorter: true,
                    customRender: (value, row, index) => {
                      return {
                        children: value ? this.formatDecimal(value, true) : "",
                        attrs: {
                          "data-coord-x": 10,
                          "data-coord-y": index + 3,
                          "data-field": "unitPerWeekFY",
                          "data-value": value,
                        },
                      };
                    },
                  },
                ],
              },
            ],
          },
        ];
      }
    },

    filterChart: _.debounce(function (value, key) {
      this.selectFilter = { ...this.selectFilter, [key]: value };

      if (typeof value === "number") {
        this.fetchChartData();
      }
    }, 500),

    fetchChartData() {
      const promotionId = this.promotionId ?? this.$route.params.id;

      if (promotionId) {
        this.isLoading = true;
        let url = apiUrl + URL_POT + `/${promotionId}/chart?`;
        let queries = [];

        for (const [key, value] of Object.entries(this.selectFilter)) {
          queries.push(`${key}=${value}`);
        }

        url += queries.join("&");

        this.axios
          .get(url)
          .then((res) => {
            let { data: values } = res;

            this.chartTable = values.chartTable;
            this.chartTableDefault = values.chartTable;
            this.customColumn(values.chartTable);

            this.chartData = values.chartData.map((x) => ({
              unit: x.unit,
              price: parseFloat(x.price.toFixed(2)),
              week: this.$moment(x.week).format("DD/MM/YYYY"),
            }));
          })
          .finally(() => (this.isLoading = false));
      }
    },

    initTcs() {
      const tcsOptions = {
        deselectOutTableClick: true,
        ignoreThead: true,
        ignoreTfoot: true,
        selectIgnoreClass: false,
        getCellFn: (cell) => this.parseDataForCopying(cell),
      };
      const buffer = new TableCellSelector.Buffer();
      this.tcsBuffer = buffer;
      this.tcs = new TableCellSelector(
        this.$refs.ChartTable.querySelector(".ant-table-body table"),
        tcsOptions,
        buffer
      );
    },

    parseDataForCopying(cell) {
      if (!cell || !cell.dataset) return;

      return cell.dataset.value;
    },

    onCopy() {
      this.tcs.copy();
    },

    destroyTcs() {
      this.tcsBuffer.destroy();
      this.tcs.destroy();
    },

    onTableChange(pagination, filters, sorter) {
      let lastArr = this.chartTableDefault[this.chartTableDefault.length - 1];

      switch (sorter.order) {
        case "ascend":
          this.chartTable = this.chartTableDefault
            .slice(0, this.chartTableDefault.length - 1)
            .sort((a, b) => {
              return a[sorter.field] - b[sorter.field];
            });
          this.chartTable.push(lastArr);
          this.customColumn(this.chartTable);
          break;
        case "descend":
          this.chartTable = this.chartTableDefault
            .slice(0, this.chartTableDefault.length - 1)
            .sort((a, b) => {
              return b[sorter.field] - a[sorter.field];
            });
          this.chartTable.push(lastArr);
          this.customColumn(this.chartTable);
          break;
        default:
          this.chartTable = this.chartTableDefault;
          this.customColumn(this.chartTable);
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-aggregate {
  &__table-label-year {
    height: calc(100% - 30px);
    border: 1px solid $neutral-4;
    border-right: none;
    border-bottom: none;
  }

  &__table-label-total {
    height: 30px;
    background: $neutral-2;
    border: 1px solid $neutral-4;
    border-right: none;
    padding: 4px 8px;
  }
}

::v-deep {
  .ant-table-bordered .ant-table-thead > tr:not(:last-child) > th {
    border-bottom: none;
  }

  .ant-table-bordered .ant-table-tbody > tr:hover > td:first-child {
    border-left: 1px solid $neutral-4;
  }

  .ant-table-thead > tr:first-child > th {
    background: #ffffff;
  }

  .ant-table-tbody > tr:last-child > td {
    background: #f9fafb;
  }

  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: none;
  }

  .ant-table-tbody
    > tr:last-child:hover:not(.ant-table-expanded-row):not(
      .ant-table-row-selected
    )
    > td {
    background: $neutral-2;
  }

  .tcs-select {
    background: #e5efff !important;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding-top: 4px;
    padding-bottom: 4px;
    height: 30px;
  }
}
</style>
