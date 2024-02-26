<template>
  <create-modal-composer class="modal-add-plline" title="Add P&L Lines">
    <text-input
      key="code"
      label="Discount Code"
      placeholder="Discount Code"
      rules="required|alpha_dash"
      :max-length="20"
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
      rules="required"
      :max-length="255"
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
  </create-modal-composer>
</template>

<script>
export default {
  name: "CreatePlLine",
  inject: ["crud"],

  mounted() {
    this.crud.updateEntity("createForm", {
      resourceKey: "extract",
      value: false,
    });
  },
};
</script>

<style lang="scss">
.modal-add-plline {
  &__extract {
    padding-top: 18px;
  }
}
</style>
