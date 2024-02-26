<template>
  <div class="parameters h-100">
    <a-card>
      <a-row
        type="flex"
        justify="space-between"
        align="middle"
        :gutter="24"
        class="mb-3"
      >
        <a-col :span="12">
          <select-input
            source="id"
            source-label="name"
            :data-source="listPlan"
            default-active-first-option
            :value="selectedPlan"
            :disabled="listPlan.length === 1 || name === 'childrenParameters'"
            @change="onFilterChange('planId', $event)"
          />
        </a-col>
      </a-row>
      <a-row
        type="flex"
        justify="space-between"
        :gutter="24"
      >
        <a-col :span="12">
          <p class="text-center font-weight-bold primary-color underline-text">Product Details</p>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>RRP</label>
                </a-col>
                <a-col :span="12">
                  $ {{ Number(dataParameters.rrp || 0).toFixed(2) }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>GST %</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.gst }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>List Price per Unit</label>
                </a-col>
                <a-col :span="12" class="input-price">
                  <number-input
                    key="2"
                    form-item
                    type="currency"
                    :is-hide-arrow="true"
                    :value="dataParameters.price"
                    @change="onChangeListPrice"
                  />
                  <div v-if="name == 'parameters'" class="list__date-range">
                    <div
                      v-for="dateRange in listDateRange"
                      :key="dateRange.productId"
                      class="d-flex justify-content-around align-items-center date-range__item p-2"
                      @click="changeDateRange(dateRange.productId)"
                    >
                      <p class="b7 mb-0">
                        <strong>{{ formatDecimal(dateRange.listPrice) }}</strong>
                      </p>
                      <span class="date-range__item">
                        {{ $moment(dateRange.startDate).format("DD MMM YYYY") }} -
                        {{ getTheFirstDayOfWeek(dateRange.endDate, "DD MMM YYYY") }}
                      </span>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Kg/unit</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.kg }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>COGS (in VLC)</label>
                </a-col>
                <a-col :span="12">
                  <number-input
                    key="3x"
                    form-item
                    type="currency"
                    :is-hide-arrow="true"
                    :value="dataParameters.cogs"
                    @change="overwriteParameter('cogs', $event)"
                  />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Unit per Shipper</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.unitPer }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="12">
          <p class="text-center font-weight-bold primary-color underline-text">Financials</p>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="11">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>DC Vol %</label>
                </a-col>
                <a-col :span="12" class="primary-color">
                  {{ dcVol }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="13">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Dc Fee (&Inv.) %</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.dcFees }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-4"
            align="middle"
            :gutter="24"
          >
            <a-col :span="11">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Trading Terms %</label>
                </a-col>
                <a-col :span="12">
                  {{ tradingTerms }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="13">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Pick Fees/Unit</label>
                </a-col>
                <a-col :span="12">
                  $ {{ Number(dataParameters.pickFees || 0).toFixed(2) }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="11">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Ullage/MDA %</label>
                </a-col>
                <a-col :span="12">
                  {{ ullageMDA }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="13">
              <a-row
                v-if="isShowFssi"
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Advanced pricing (FSSI) %</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.advancedPricing }}
                </a-col>
              </a-row>
              <a-row
                v-else-if="isShowCdsFee"
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>CDS Fees</label>
                </a-col>
                <a-col :span="12">
                  $ {{ Number(dataParameters.cdsFee || 0).toFixed(2) }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="11">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col a-col :span="12">
                  <label>Rebates %</label>
                </a-col>
                <a-col :span="12">
                  {{ rebates }}
                </a-col>
              </a-row>
            </a-col>
            <a-col v-if="isShowFssi" :span="13">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>Store Margin Rebate (FSSI) %</label>
                </a-col>
                <a-col :span="12">
                  {{ dataParameters.storeMarginRebates }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row
            v-if="isShowCdsFee && isShowFssi"
            type="flex"
            justify="space-between"
            class="mb-2"
            align="middle"
            :gutter="24"
          >
            <a-col :span="11" />
            <a-col :span="13">
              <a-row
                type="flex"
                justify="space-between"
                :gutter="24"
              >
                <a-col :span="12">
                  <label>CDS Fees</label>
                </a-col>
                <a-col :span="12">
                  $ {{ dataParameters.cdsFee }}
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!-- </a-spin> -->
    </a-card>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

import { PromoUtils } from "@/utils";
import EventBus from "@/EventBus";
import { FormatDateTimeMixin } from "@/mixins";

export default {
  name: "NewParameters",

  mixins: [PromoUtils, FormatDateTimeMixin],

  props: {
    name: {
      type: String,
      default: "parameters",
    },
    listPlan: {
      type: Array,
      default: null,
    },
    listDateRange: {
      type: Array,
      default: null,
    },
    defaultFilters: {
      type: Object,
      default: () => {},
    },
    parametersValues: {
      type: Object,
      default: () => {},
    },
    shortCodeKeyAccount: {
      type: Boolean,
      default: false,
      /** can be set to: "dc", "dts" for new world ni or leave it blank for the other cases */
    },
    selectedPlan: {
      type: Number,
      default: null,
    },
    isShowCdsFee: {
      type: Boolean,
      default: false,
    },
    isShowFssi: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const dataYesOrNo = [
      {
        code: "false",
        name: "No",
      },
      {
        code: "true",
        name: "Yes",
      },
    ];

    const dataParameters = {
      tradingTerms: "",
      ullageMDA: "",
      rebates: "",
      listRebates: "",
      dcFees: "",
      pickFees: "",
      cdsCode: "",
      cdsFee: "",
      gst: "",
      kg: "",
      cogs: 0,
      unitPer: "",
      price: 0,
    };

    return {
      dataYesOrNo,
      dataParameters,
    };
  },

  computed: {
    dcVol () {
      return (this.dataParameters.dcVol === 0 || this.dataParameters.dcVol === 100) ? this.dataParameters.dcVol :  `${this.dataParameters.dcVolPercent} | ${this.dataParameters.dtsVolPercent}`
    },
    tradingTerms () {
      switch (this.dataParameters.dcVol){
        case 0:
          return this.shortCodeKeyAccount ? this.dataParameters.storeTradingTerms : this.dataParameters.dcTradingTerms
        case 100:
          return this.dataParameters.dcTradingTerms
        default:
          return `${this.dataParameters.dcTradingTerms} | ${this.dataParameters.storeTradingTerms}`
      }
    },
    ullageMDA () {
      switch (this.dataParameters.dcVol){
        case 0:
          return this.shortCodeKeyAccount ? this.dataParameters.storeUllageMDA  : this.dataParameters.dcUllageMDA
        case 100:
          return this.dataParameters.dcUllageMDA
        default:
          return `${this.dataParameters.dcUllageMDA} | ${this.dataParameters.storeUllageMDA}`
      }
    },
    rebates () {
      switch (this.dataParameters.dcVol){
        case 0:
          return this.shortCodeKeyAccount ?  this.dataParameters.storeRebates : this.dataParameters.dcRebates
        case 100:
          return this.dataParameters.dcRebates
        default:
          return `${this.dataParameters.dcRebates} | ${this.dataParameters.storeRebates}`
      }
    }
  },

  watch: {
    parametersValues(newVal) {
      if (newVal) {
        this.dataParameters = { ...this.dataParameters, ...newVal };
      }
    },
  },

  methods: {
    changeDateRange(productId) {
      this.overwriteParameter("price", "");
      this.overwriteParameter("cogs", "");
      this.$emit("changeDateRange", productId);
    },

    onChangeListPrice: debounce(function(price) {
      this.overwriteParameter("price", price);

      // TODO: rename the event
      EventBus.$emit("change-parameters-evt", {
        planId: this.selectedPlan,
      });
    }, 200),

    onFilterChange(key, value) {
      this.$emit("changeFilter", { [key]: value, isSelectedDateRange: false });
    },

    overwriteParameter(key, value) {
      this.$emit("overwriteParameter", { key, value });
    },
  },
};
</script>

<style lang="scss" scoped>
.underline-text {
  text-decoration: underline;
}
.input-price {
  position: relative;

  &:hover .list__date-range {
    display: block;
  }

  .list__date-range {
    display: none;
    position: absolute;
    width: 220px;
    max-height: 100px;
    background: white;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    z-index: 9;
    overflow: auto;
    border-radius: 8px;
  }

  .date-range__item {
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background: rgb(225, 225, 225);
    }
  }
}
</style>
