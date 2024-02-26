<template>
  <simple-form v-slot="{ handleSubmit }">
    <div class="d-flex flex-column align-items-center justify-content-between">
      <span class="p-2 mb-4">New Scenario</span>

      <a-space direction="vertical">
        <text-input
          label="LSV%"
          suffix="%"
          :disabled="isFiltering || isReviewing"
          :value="reviewForm.lsv"
          :parse-value="parse2Decimal"
          @blur="changeReviewForm('lsv', $event)"
        />
        <text-input
          label="COGS%"
          suffix="%"
          :disabled="isFiltering || isReviewing"
          :value="reviewForm.cogs"
          :parse-value="parse2Decimal"
          @blur="changeReviewForm('cogs', $event)"
        />
        <text-input
          label="Base Elasticity"
          :disabled="isFiltering || isReviewing"
          :value="reviewForm.baseElasticity"
          :parse-value="parse2Decimal"
          @blur="changeReviewForm('baseElasticity', $event)"
        />
        <text-input
          label="Add. Pr. Elast. %"
          suffix="%"
          :disabled="isFiltering || isReviewing"
          :value="reviewForm.addPrElastPercent"
          :parse-value="parse2Decimal"
          @blur="changeReviewForm('addPrElastPercent', $event)"
        />
        <select-input
          label="GM Maintain"
          rules="required"
          :disabled="isFiltering || isReviewing"
          :data-source="ynOptions"
          source="value"
          source-label="label"
          :value="reviewForm.isGMMaintainEnabled ? 1 : 0"
          @change="changeReviewForm('isGMMaintainEnabled', $event === 1)"
        />
        <select-input
          label="Round Price"
          rules="required"
          :disabled="isFiltering || isReviewing"
          :data-source="ynOptions"
          source="value"
          source-label="label"
          :value="reviewForm.isRoundingPriceEnabled ? 1 : 0"
          @change="changeReviewForm('isRoundingPriceEnabled', $event === 1)"
        />
      </a-space>
      <a-button
        class="mt-2"
        type="primary"
        :disabled="isFiltering"
        :loading="isReviewing"
        @click="handleSubmit(onReviewClick)"
      >
        Review
      </a-button>
    </div>
  </simple-form>
</template>

<script>
export default {
  name: "FormReviewScenario",

  props: {
    reviewData: {
      type: [Function, Object],
      default: undefined,
    },
    isFiltering: {
      type: Boolean,
      default: false,
    },
    isReviewing: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: Number,
      default: null,
    },
    poId: {
      type: Number,
      default: null,
    },
  },

  data() {
    const ynOptions = [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ];

    const defaultReviewForm = {
      lsv: "0.00",
      cogs: "0.00",
      isGMMaintainEnabled: true,
      isRoundingPriceEnabled: true,
      baseElasticity: "0.00",
      addPrElastPercent: "0.00",
      basePlanId: this.planId,
      basePromotionOptimisationId: this.poId,
    };

    const typeNumberKeys = [
      "lsv",
      "cogs",
      "baseElasticity",
      "addPrElastPercent",
    ];

    return {
      defaultReviewForm,
      ynOptions,
      reviewForm: { ...defaultReviewForm },
      typeNumberKeys,
    };
  },

  watch: {
    isFiltering(newVal) {
      if (newVal) this.reviewForm = { ...this.defaultReviewForm };
    },
    planId(newVal) {
      this.reviewForm.basePlanId = newVal;
    },
    poId(newVal) {
      this.reviewForm.basePromotionOptimisationId = newVal;
    },
    reviewData(newVal) {
      this.reviewForm = { ...this.reviewForm, ...newVal };
    },
  },

  mounted() {
    this.$emit("change", this.reviewForm);
  },

  methods: {
    changeReviewForm(key, value) {
      this.reviewForm[key] = value;

      this.$emit("change", this.reviewForm);
    },

    parse2Decimal(value) {
      return value && !isNaN(value) ? parseFloat(value).toFixed(2) : "0.00";
    },

    onReviewClick() {
      this.$emit("review", this.reviewForm);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  label {
    display: inline-block;
    text-align: center;
    width: 100%;
  }
}
</style>
