<template>
  <div class="basic-view">
    <a-card>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <label class="font-weight-bold h5">Financials</label>
          <a-icon
            class="ml-2"
            :type="activeKey ? 'up' : 'down'"
            @click="toggleRow"
          />
        </div>
        <div class="d-flex align-items-baseline">
          <switch-input
            class="mr-2"
            :value="filterDatas.isInvestmentBuy"
            @change="$emit('onChangeLeafStoreGM', $event)"
          />
          <p class="mb-0">Investment Buy</p>
        </div>
      </div>
      <a-row v-if="activeKey" :gutter="24">
        <a-col
          type="flex"
          class="mb-4"
          style="margin-right: 12px; margin-left: 12px"
        >
        </a-col>
        <a-col :span="13">
          <div class="h6 neutral-10--text mb-2">{{ nameBaseVersion }}</div>
          <a-spin :spinning="isLoadingBase" size="small">
            <div ref="base">
              <price-table
                :list-row-name-table="listRowNameBase"
                :data-table="baseDatas"
                :sync-collapse="syncCollapse"
                :hidden-fields="hiddenFields"
                @scrollX="onScrollBaseTbl"
              />
            </div>
          </a-spin>
        </a-col>
        <a-col :span="11">
          <div class="h6 neutral-10--text mb-2">
            {{ nameComparisonVersion }}
          </div>
          <a-spin :spinning="isLoadingComparison" size="small">
            <div ref="comparison">
              <price-table
                :is-show-row-cell="false"
                :data-table="scenarioDatas"
                table-width="1200px"
                :list-row-name-table="listRowNameBase"
                :sync-collapse="syncCollapse"
                :hidden-fields="hiddenFields"
                :is-show-delta-field="true"
                @scrollX="onScrollComparisonTbl"
              />
            </div>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import PriceTable from "./PriceTable.vue";
export default {
  name: "BasicView",

  components: {
    PriceTable,
  },
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
  props: {
    filterDatas: {
      type: Object,
      default: () => {},
    },
    listRowNameBase: {
      type: Array,
      default: () => [],
    },
    baseDatas: {
      type: Object,
      default: () => {},
    },
    scenarioDatas: {
      type: Object,
      default: () => {},
    },
    hiddenFields: {
      type: Array,
      default: null,
    },
    nameBaseVersion: {
      type: String,
      default: null,
    },
    nameComparisonVersion: {
      type: String,
      default: null,
    },
    isLoadingBase: {
      type: Boolean,
      default: false,
    },
    isLoadingComparison: {
      type: Boolean,
      default: false,
    },
    syncCollapse: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      activeKey: true,
    };
  },

  methods: {
    toggleRow() {
      this.activeKey = !this.activeKey;
    },
    onScrollBaseTbl(scrollVal) {
      const ele = this.$refs.comparison;
      const tbl = ele.querySelector("#priceTable");
      tbl.scrollLeft = scrollVal;
    },

    onScrollComparisonTbl(scrollVal) {
      const ele = this.$refs.base;
      const tbl = ele.querySelector("#priceTable");
      tbl.scrollLeft = scrollVal;
    },
  },
};
</script>
<style lang="scss" scoped></style>
