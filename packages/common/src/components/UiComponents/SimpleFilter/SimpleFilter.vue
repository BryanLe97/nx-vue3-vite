<template>
  <div class="simple-filter">
    <a-select :default-value="selectedOption" class="w-100" @change="onChange">
      <a-select-option v-for="option in options" :key="option.value" :value="option.value">
        <span :style="[option.color ? {'color': `${option.color}`} : '']">
          <a-icon v-if="option.iconType" :type="option.iconType" :theme="option.iconTheme"></a-icon>
          {{ option.text }}
        </span>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>

export default {
  name: "SimpleFilter",

  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedOption: this.options[0].value
    }
  },

  methods: {
    onChange(val) {
      this.$emit('change', val);
    },
  },
};
</script>
