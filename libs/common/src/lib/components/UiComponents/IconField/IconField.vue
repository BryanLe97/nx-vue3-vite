<template>
  <div class="icon-field">
    <template v-if="hasTooltip">
      <a-tooltip>
        <template #title>
          <span v-if="tooltipContent">{{ tooltipContent }}</span>
        </template>
        <a-icon v-if="icon" :type="icon" :style="style" :theme="theme" />
      </a-tooltip>
    </template>
    <template v-else>
      <a-icon v-if="icon" :type="icon" :style="style" :theme="theme" />
    </template>
  </div>
</template>

<script>
export default {
  name: "IconField",

  props: {
    value: {
      type: [Boolean, String, Number, Object, Array],
      default: "Empty content",
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    renderIcon: {
      type: Function,
      default: (value) => value,
    },
    iconStyle: {
      type: [Object, Function],
      default: (value) => value,
    },
    theme: {
      type: String,
      default: "outlined",
    },
    hasTooltip: {
      type: Boolean,
      default: false,
    },
    renderTooltip: {
      type: Function,
      default: (value) => value,
    },
    rerenderOnRecordChanged: {
      /** if the icon-field is rendered based on many attributes of the record,
       * turn this prop ON to trigger rerender the icon after the record changes */
      type: Boolean,
      default: false,
    },
    dataIndex: {
      type: String,
      default: "",
    },
  },

  data() {
    let style;

    if (typeof this.iconStyle == "function") {
      style = this.iconStyle(this.value, this.record);
    } else {
      style = this.iconStyle;
    }

    return {
      style,
      icon: this.renderIcon(this.value, this.record),
      tooltipContent: this.renderTooltip(this.value, this.record),
    };
  },

  watch: {
    value(newVal) {
      this.rerenderIcon(newVal, this.record);
    },

    record(newVal) {
      if (!this.rerenderOnRecordChanged) return;

      this.rerenderIcon(newVal[this.dataIndex], this.record);
    },
  },

  methods: {
    rerenderIcon(val, record) {
      if (typeof this.iconStyle == "function") {
        this.style = this.iconStyle(val, record);
      } else {
        this.style = this.iconStyle;
      }

      this.icon = this.renderIcon(val, record);
      this.tooltipContent = this.renderTooltip(val, record);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-field {
  text-align: center;
}
</style>
