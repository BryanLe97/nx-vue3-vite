<template>
  <a-card>
    <div class="weekly-price-entry__YTBVolume">
      <div class="d-inline-block">
        <select-input
          class="select-filter mb-2"
          source="value"
          source-label="label"
          placeholder="Select Location"
          default-active-first-option
          :data-source="options"
          @change="onChange"
        />
      </div>
      <a-card :loading="loading" class="card-pd-0" :bordered="false">
        <div
          class="ant-table ant-table-bordered ant-table-default"
          style="overflow-x: auto"
        >
          <div class="ant-table-body">
            <table v-if="dataSourceYTD.length > 0" class="promo-entry-table">
              <colgroup>
                <col
                  :style="{
                    minWidth: '180px',
                  }"
                />
                <col
                  v-for="col in dataSourceYTD"
                  :key="col.seqNumber"
                  :style="{
                    minWidth: '100px',
                  }"
                />
              </colgroup>
              <thead class="ant-table-thead">
                <tr>
                  <th class="fixed-table">Promo</th>
                  <th
                    v-for="(td, index) in dataSourceYTD"
                    :key="td.seqNumber"
                    :style="{
                      backgroundColor: colorList[index].code || '',
                      borderColor: colorList[index].code || '',
                      borderBottom: '1px solid #cdd3db',
                      textAlign: 'center',
                    }"
                  >
                    {{ td.promotionName }}
                  </th>
                </tr>
              </thead>
              <tbody class="ant-table-tbody">
                <tr v-for="col in columnYTD" :key="col.key">
                  <td class="fixed-table" style="text-transform: capitalize">
                    {{ col.name }}
                  </td>
                  <td
                    v-for="td in dataSourceYTD"
                    :key="`${td.promotionTypeId} -${td.tacticName}`"
                    :style="{
                      textAlign: formatNumber(td[col], 'currency', true)
                        ? 'right'
                        : 'center',
                      fontSize: col.key == 'tacticName' ? '700' : '',
                      color:
                        numberNegative.includes(col.key) && td[col.key] < 0
                          ? 'red '
                          : 'black',
                    }"
                  >
                    {{
                      (col.key == "tacticName"
                        ? td[col.key]
                        : formatNumber(
                            td[col.key],
                            currencyApply.includes(col.key)
                              ? "currency"
                              : "number",
                            false
                          )) || "-"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-card>
    </div>
  </a-card>
</template>
<script>
import { ErrorHandlerMixin } from "@kraftheinz/common";
import EventBus from "@/EventBus";
import { PromoUtils } from "@/utils";
import { COLOR_LIST_ENTRY_PRICE } from "@/constants/entry.price";

const currencyApply = ["plannedPrice", "actualPrice", "priceDifference"];
const numberNegative = ["priceDifference", "unitDifference"];
const sellthroughColumnKeys = [
  "plannedUnitSellthrough",
  "unitDifferenceSellthrough",
];
const scanColumnKeys = ["plannedUnitScan", "unitDifferenceScan"];
export default {
  name: "YTDVolumeTable",

  mixins: [PromoUtils, ErrorHandlerMixin],

  inject: ["crud", "resourceName", "fetchYTDVolume", "resourceProps"],

  data() {
    const [, , , , , , , , , , , , ytdTableProps] = this.resourceProps;
    return {
      columnYTD: [
        {
          key: "tacticName",
          name: "Tactic",
        },
        {
          key: "plannedPrice",
          name: "Planned price",
        },
        {
          key: "plannedUnit",
          name: "Planned Unit (Week)",
        },
        {
          key: "actualPrice",
          name: "Actual Price",
        },
        {
          key: "actualUnit",
          name: "Actual Unit (Week)",
        },
        {
          key: "priceDifference",
          name: "Price Difference",
        },
        {
          key: "unitDifference",
          name: "Unit Difference",
        },
      ],
      colorList: COLOR_LIST_ENTRY_PRICE,
      currencyApply,
      isSellthrough: false,
      numberNegative,
      scanColumnKeys,
      sellthroughColumnKeys,
      ytdTableProps,
      options: [
        { label: "YTD Volume Comparison", value: "YTD" },
        { label: "QTR Volume Comparison", value: "QTR" },
      ],
    };
  },

  computed: {
    loading() {
      return this.$store.state[this.resourceName].isFetchingList;
    },

    dataSourceYTD() {
      return this.crud.getList();
    },
  },

  watch: {
    "$route.params.id": function () {
      this.fetchYTDVolume();
    },
  },

  async created() {
    await this.fetchYTDVolume();
    EventBus.$on("isSellthrough", (value) => {
      this.isSellthrough = value;
    });
  },

  beforeDestroy() {
    EventBus.$off("isSellthrough");
  },

  methods: {
    async onChange(value = "YTD") {
      this.ytdTableProps.crud.setQueryString("comparisonType", value);
      await this.fetchYTDVolume();
    },
  },
};
</script>
<style lang="scss" scoped>
.fixed-table {
  position: sticky;
  left: 0px;
}
.card-pd-0 {
  ::v-deep .ant-card-body {
    padding: 0px;
  }
}
</style>
