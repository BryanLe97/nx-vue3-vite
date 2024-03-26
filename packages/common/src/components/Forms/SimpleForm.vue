<template>
  <validation-observer ref="simpleForm" v-slot="{ handleSubmit, invalid, reset }">
    <a-form>
      <slot :handle-submit="handleSubmit" :invalid="invalid" :reset="reset"></slot>
    </a-form>
  </validation-observer>
</template>

<script>
export default {
  name: "SimpleForm",

  methods: {
    resetForm() {
      this.$refs.simpleForm.reset();
    }
  }
};
</script>
