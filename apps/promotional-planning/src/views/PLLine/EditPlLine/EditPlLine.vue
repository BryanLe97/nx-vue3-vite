<template>
  <edit-modal-composer
    class="modal-edit-pl-line"
    :custom-url="`${customApiUrl}${plLineId}`"
    :entity-id="plLineId"
    :is-fetch-entity-by-id="true"
    :last-modified-by-name="true"
    title="Edit P&L Line"
  >
    <text-input
      key="code"
      :disabled="true"
      label="Discount Code"
      placeholder="Discount Code"
      rules="required|alpha_dash"
      :span="12"
    />

    <checkbox-input
      key="extract"
      class-name="modal-add-plline__extract"
      label="Extract"
      :span="12"
    />

    <text-input
      key="description"
      label="Discount Description"
      placeholder="Discount Description"
      :max-length="255"
      rules="required"
      :span="12"
    />

    <select-input
      key="line"
      label="Line"
      reference="promotion-planning.common.lines"
      placeholder="Line"
      source="code"
      source-label="description"
      rules="required"
      :span="12"
    />
  </edit-modal-composer>
</template>

<script>
const apiUrl = import.meta.env.VITE_API_URL;
export default {
  name: "EditPlLine",

  data() {
    const { id } = this.$route.params;

    return {
      plLineId: id,
      customApiUrl: `${apiUrl}/promotion-planning/pllines/`,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-edit-pl-line {
  &__sub-cat {
    width: 50%;
    padding-right: 5px;
  }
}
</style>
