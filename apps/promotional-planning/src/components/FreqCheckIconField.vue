<template>
  <a-popover :content="content" overlay-class-name="freq-check--popover__dark">
    <template v-if="hasIcon">
      <a-icon v-bind="freqCheckIcon" theme="filled" />
    </template>
  </a-popover>
</template>

<script>
import isNil from 'lodash/isNil';
import {
  FREQUENCY_CHECK,
  PROMO_SALES_ACCEPTED,
  PROMO_SALES_PLAN,
} from '../constants';

export default {
  name: 'FreqCheckIconField',

  props: {
    value: {
      type: [Boolean, String, Number, Object, Array],
      default: 'Empty content',
    },
    record: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      freqCheckStatus: [PROMO_SALES_ACCEPTED, PROMO_SALES_PLAN],
    };
  },

  computed: {
    content() {
      return `Total variance = ${this.value ?? 0} weeks`;
    },

    freqCheckIcon() {
      const freqCheck = FREQUENCY_CHECK[this.freqCheckType];

      return freqCheck
        ? {
            style: {
              color: freqCheck.color,
              fontSize: '20px',
            },
            type: freqCheck.icon,
          }
        : {};
    },

    freqCheckType() {
      return !this.hasIcon
        ? null
        : this.value === 0
        ? 1
        : this.value <= 2
        ? 2
        : 3;
    },

    hasIcon() {
      return (
        !isNil(this.value) &&
        this.record &&
        this.freqCheckStatus.includes(this.record.statusCode)
      );
    },
  },
};
</script>

<style lang="scss">
.freq-check--popover__dark {
  .ant-popover-inner {
    background-color: #5c6c7f;
  }

  .ant-popover-title {
    color: #ffffff;
    border-bottom-color: #737e8d;
  }

  .ant-popover-inner-content {
    color: #ffffff;
  }

  &.ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow,
  &.ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow,
  &.ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
    border-right-color: #5c6c7f;
    border-bottom-color: #5c6c7f;
  }
}
</style>
