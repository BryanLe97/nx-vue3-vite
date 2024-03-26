<template>
  <create-modal-composer
    v-if="visibleModal"
    title="General Comments"
    :visible-custom-modal.sync="visibleModal"
    :width="530"
  >
    <template #customText>
      <div class="mb-2">
        <span class="error-6--text">
          This form is only to be used for general feedback / suggestions on how
          to improve the portal. IT incidents need to be raised via the
          <a href="https://service.kraftheinz.com/" target="_blank">
            Kraft Heinz IT Portal.
          </a>
        </span>
      </div>
    </template>
    <text-input
      label="LANID"
      :disabled="true"
      form-item
      :value="userInfo.userName"
      :span="24"
    />
    <text-input
      label="User Name"
      form-item
      :disabled="true"
      :value="userInfo.firstName + ` ` + userInfo.lastName"
      :span="24"
    />
    <text-area
      key="comments"
      label="Comments"
      :max-length="500"
      :span="24"
      form-item
      :rows="5"
    />
  </create-modal-composer>
</template>

<script>
export default {
  name: "GeneralComments",

  inject: ["crud"],

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
      isLoading: false,
      visibleModal: this.visible,
      createForm: {},
      statusNew: 1,
    };
  },

  watch: {
    visible(newVal) {
      this.visibleModal = newVal;

      this.storeValue("userId", this.userInfo.id);
      this.storeValue("comments", "");
      this.storeValue("status", this.statusNew);
    },

    visibleModal(newVal) {
      if (!newVal) this.$emit("update:visible", newVal);
    },
  },

  methods: {
    storeValue(resourceKey, value) {
      const createForm = this.createForm;
      this.createForm = {
        ...createForm,
        [resourceKey]: value,
      };
      this.crud.updateEntity("createForm", { resourceKey, value });
    },
  },
};
</script>

<style></style>
