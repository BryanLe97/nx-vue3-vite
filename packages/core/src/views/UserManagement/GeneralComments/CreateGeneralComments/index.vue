<template>
  <resource name="identities.generalcomments" :api-url="apiUrl">
    <create-general-comments
      :visible.sync="visibleModal"
      :user-info="userInfo"
    />
  </resource>
</template>

<script>
  import CreateGeneralComments from "./CreateGeneralComments.vue";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: { CreateGeneralComments },

    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      userInfo: {
        type: Object,
        default: undefined,
      },
    },

    data() {
      return {
        apiUrl,
        visibleModal: this.visible,
      };
    },

    watch: {
      visible(newVal) {
        this.visibleModal = newVal;
      },

      visibleModal(newVal) {
        this.$emit("update:visible", newVal);
      },
    },
  };
</script>

<style></style>
