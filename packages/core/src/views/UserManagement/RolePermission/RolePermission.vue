<template>
  <list-composer
    title="Role & Permission"
    :has-active="false"
    :has-filter-inactive="false"
    custom-query="app=identity"
  >
    <text-field key="Name" title="Report Name" data-index="name" />
    <text-field
      key="Description"
      title="Description"
      data-index="description"
    />
    <template #action="{ record }">
      <a-tooltip>
        <template #title>Preview</template>
        <a-button
          class="btn-bunker"
          icon="right-circle"
          size="small"
          type="link"
          @click="preview(record.name)"
        />
      </a-tooltip>
    </template>
  </list-composer>
</template>

<script>
export default {
  name: "RolePermission",

  inject: ["crud", "apiUrl"],

  data() {
    return {
      preview(type) {
        const data = {
          report: type,
          reportType: "identity",
          reportParams: {},
        };

        this.axios.post(this.apiUrl + `/identities/reports`, data).then(
          (res) => {
            if (!res || !res.data || !res.data.reportViewerUri) {
              this.$notification["error"]({
                message: "Report not found!",
              });
            } else {
              window.open(res.data.reportViewerUri, "_blank");
            }
          },
          (err) => {
            this.$notification["error"]({
              message: err.message || "Errors!",
            });
          }
        );
      },
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped></style>
