<template>
  <simple-form v-slot="{ handleSubmit }">
    <a-modal
      v-model="visible"
      :class="className"
      :after-close="afterModalClose"
      destroy-on-close
      :title="title"
      :width="width"
    >
      <slot name="customText"></slot>
      <a-row align="top" :gutter="16" type="flex">
        <a-col v-for="field in fields" :key="field.key" :span="field.span">
          <component
            :is="field.tag"
            form-item
            :class="checkRequiredFields(field.rules)"
            :name="field.key"
            v-bind="field"
            :disabled="field.disabled || !hasMaintainPermission"
            @change="onChange($event, field.key)"
          ></component>
        </a-col>
      </a-row>

      <template #footer>
        <slot
          name="actions"
          :cancel="cancel"
          :isLoading="isLoading"
          :submit="() => handleSubmit(submit)"
        >
          <a-button @click="cancel">Cancel</a-button>
          <a-button
            v-if="hasMaintainPermission"
            :loading="isLoading"
            type="primary"
            @click="handleSubmit(submit)"
          >
            Add
          </a-button>
        </slot>
      </template>
    </a-modal>
  </simple-form>
</template>

<script>
  import { MAINTAIN_PERMISSION, ADD_PERMISSION } from "@/constants/index.js";
  import { CheckRequiredFields } from "@/mixins/index.js";

  export default {
    name: "CreateModal",

    mixins: [CheckRequiredFields],

    props: {
      fields: {
        type: Array,
        required: true,
      },
      className: {
        type: String,
        default: "",
      },
      customUrl: {
        type: String,
        default: null,
      },
      customListUrl: {
        type: String,
        default: "",
      },
      keyReceiveEvent: {
        type: Array,
        default: () => [],
      },
      /**
       * If CreateModal is used within a Resource which has multiple resources,
       * we extract the correct resource props from the resources object using
       * reference.
       */
      reference: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        default: "Edit",
      },
      visibleCustomModal: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 520,
      },
    },

    inject: [
      "can",
      "crud",
      "resourceName",
      "resourceIdName",
      "redirectRoute",
      "resources",
    ],

    data() {
      const resource = this.reference ? this.resources[this.reference] : {};

      return {
        newEntityId: "",
        permissions: {
          maintain: MAINTAIN_PERMISSION,
          add: ADD_PERMISSION,
        },
        visible: this.visibleCustomModal,
        ...resource,
      };
    },

    computed: {
      isLoading() {
        return this.$store.state[this.resourceName].isCreating;
      },

      internalCustomListUrl() {
        if (this.customListUrl) return this.customListUrl;
        if (this.customUrl && !this.customListUrl) return this.customUrl;
        return "";
      },

      hasMaintainPermission() {
        const { add, maintain } = this.permissions;

        return this.can(maintain) || this.can(add);
      },
    },

    watch: {
      visibleCustomModal(newval) {
        this.visible = newval;
      },
    },

    created() {
      this.crud.initEntity();
    },

    mounted() {
      if (this.redirectRoute) this.visible = true;
    },

    methods: {
      fetchList() {
        return this.crud.fetchList(this.internalCustomListUrl);
      },

      onChange(value, resourceKey) {
        this.storeValue(value, resourceKey);
        this.keyReceiveEvent.forEach((key) => {
          if (key === resourceKey) {
            this.$emit("change", { [resourceKey]: value });
          }
        });
      },

      storeValue(value, resourceKey) {
        if (!resourceKey.includes(",")) {
          this.crud.updateEntity("createForm", { resourceKey, value });
          return;
        }

        const resourceKeys = resourceKey.split(",");

        resourceKeys.forEach((key) =>
          this.crud.updateEntity("createForm", {
            resourceKey: key,
            value: value[key],
          })
        );
      },

      cancel() {
        this.visible = false;
      },

      async submit() {
        const res = await this.crud.submitEntity("create", this.customUrl);

        this.newEntityId = res.data[this.resourceIdName];

        const pageSize = this.crud.getPagination().pageSize;

        this.crud.setPagination({ page: 1, pageSize });
        this.fetchList();
        this.visible = false;
      },

      afterModalClose() {
        this.crud.clearEntity("createForm");

        if (!this.redirectRoute) {
          this.$emit("update:visible-custom-modal", false);
          return;
        }

        const redirectRoute = this.redirectRoute.includes(":id")
          ? this.redirectRoute.replace(":id", this.newEntityId)
          : this.redirectRoute;

        this.$router.push(redirectRoute);
      },
    },
  };
</script>
