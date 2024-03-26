<template>
  <div class="range-number-input">
    <template v-if="formItem">
      <!-- has validation rules -->
      <validation-provider v-slot="slotProps" :name="label" :rules="rules">
        <a-form-item
          :colon="false"
          has-feedback
          :help="slotProps.errors[0]"
          :label="label"
          :validate-status="resolveState(slotProps)"
        >
          <a-input-group compact>
            <a-input v-model="values[0]" class="range-input" @change="onChange" :disabled="disabled"/>
            <a-input :class="'range-marker' + (disabled? ' grey-color': '')" placeholder="~" disabled />
            <a-input
              v-model="values[1]"
              class="range-input range-input-2"
              :rules="rules"
              @change="onChange"
              :disabled="disabled"
            />
          </a-input-group>
        </a-form-item>
      </validation-provider>
    </template>
    <template v-else>
      <!-- no validation -->
      <label v-if="label">{{ label }}</label>
      <a-input-group compact>
        <a-input v-model="values[0]" class="range-input" @change="onChange" :disabled="disabled"/>
        <a-input :class="'range-marker' + (disabled? ' grey-color': '')" placeholder="~" disabled />
        <a-input v-model="values[1]" class="range-input range-input-2" @change="onChange" :disabled="disabled"/>
      </a-input-group>
    </template>
  </div>
</template>

<script>
export default {
  name: "RangeNumberInput",

  props: {
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Array],
      default: "",
    },
  },

  data() {
    return {
      values: {
        type: Array,
        default: [-Infinity, Infinity],
      },
    };
  },

  watch: {
    value(newVal) {
      if (newVal != undefined) {
        if (typeof newVal === "string") {
          const items = newVal.split("~");
          this.values = items.map((item) => item.trim());
        } else if (newVal.isArray()) {
          this.values = newVal;
        }
      }
    },
  },

  methods: {
    resolveState({ errors }) {
      if (errors[0]) return "error";

      return "";
    },
    onChange() {
      const values = [this.values[0], this.values[1]];
      const mergedValue = values.join(" ~ ");

      this.$emit("change", mergedValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.range-input {
  width: 40%;
  text-align: center;

  &.range-input-2 {
    border-left: 1px solid #fff;

    &:hover,
    &:active,
    &:focus {
      border-color: #3381ff;
    }
  }
}
.range-marker {
  width: 20%;
  border-left: 0;
  border-right: 0;
  pointer-events: none;
  background-color: #fff;
  text-align: center;
}
.grey-color{
  background-color: #f5f5f5 !important;
}
</style>
