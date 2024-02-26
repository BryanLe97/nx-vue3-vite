<template>
  <simple-form v-slot="{ handleSubmit, reset }">
    <a-modal
      :after-close="reset"
      :confirm-loading="loading"
      :mask-closable="false"
      ok-text="Send & Save"
      title="Send Email"
      :visible="visible"
      :width="832"
      wrap-class-name="pot__send-email-modal"
      @cancel="onCancel"
      @ok="handleSubmit(onSave)"
    >
      <a-row :gutter="[0, 20]" type="flex">
        <a-col :span="24">
          <strong class="send-email__note">
            Please notify Revenue Management team before saving
            <span>*</span>
          </strong>
        </a-col>

        <a-col :span="24">
          <a-row type="flex">
            <a-col :span="24">
              <select-input
                autocomplete
                custom-query="appCode=promotion-planning"
                form-item
                label="Email"
                mode="multiple"
                option-label-prop="value"
                reference="identities.users-of-app"
                rules="required"
                search-by="FirstName,LastName,Email"
                source="email"
                :value="entity.recipients"
                @change="updateEntity('recipients', $event)"
              >
                <template #data-source="{ options }">
                  <template v-if="options.length">
                    <a-select-option
                      key="title"
                      class="ant-select-dropdown-menu-item__title"
                      disabled
                    >
                      <a-row type="flex">
                        <a-col :span="12">Email</a-col>
                        <a-col :span="12">User Name</a-col>
                      </a-row>
                    </a-select-option>

                    <a-select-option
                      v-for="option in options"
                      :key="option.email"
                      :value="option.email"
                    >
                      <a-row type="flex">
                        <a-col :span="12">{{ option.email }}</a-col>
                        <a-col :span="12">{{
                          `${option.firstName} ${option.lastName}`
                        }}</a-col>
                      </a-row>
                    </a-select-option>
                  </template>
                </template>
              </select-input>
            </a-col>

            <a-col :span="24">
              <text-area
                form-item
                label="Message"
                placeholder="Type message"
                :rows="4"
                rules="required|max:255"
                :value="entity.message"
                @change="updateEntity('message', $event)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </simple-form>
</template>

<script>
export default {
  name: "SendEmail",

  inject: ["resourceProps"],

  props: {
    handleSave: {
      type: Function,
      default: () => ({}),
    },
    promotionId: {
      type: Number,
      default: undefined,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const [, , , , sendEmailProps] = this.resourceProps;

    return { entity: {}, loading: false, sendEmailProps };
  },

  watch: {
    visible(newVisible) {
      if (newVisible) this.setOriginalEntity();
    },
  },

  mounted() {
    this.setOriginalEntity();
  },

  methods: {
    onCancel() {
      this.entity = {};
      this.sendEmailProps.crud.clearEntity("createForm");
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },

    async onSave() {
      this.loading = true;

      try {
        /**
         * Not using Promise.all in these fetching
         * because of the sendEmailProps has to be successful,
         * the handleSave handle later then
         */
        await this.sendEmailProps.crud.submitEntity("create");
        await this.handleSave();

        this.onCancel();
      } finally {
        this.loading = false;
      }
    },

    setOriginalEntity() {
      this.updateEntity("baseUrl", window.location.origin);
      this.updateEntity("promotionOptimisationId", this.promotionId);
    },

    updateEntity(key, value) {
      this.entity = { ...this.entity, [key]: value };
      this.sendEmailProps.crud.updateEntity("createForm", {
        resourceKey: key,
        value,
      });
    },
  },
};
</script>

<style lang="scss">
.pot__send-email-modal {
  .send-email__note {
    span {
      color: $error-6;
    }
  }
}
</style>
