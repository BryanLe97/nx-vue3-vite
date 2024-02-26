<script>
export default {
  name: "ActionColumn",

  emits: ["edit", "delete"],

  props: {
    deleteButtonProps: {
      type: Object,
      default: () => ({}),
    },
    deleteCancelText: {
      type: String,
      default: "Cancel",
    },
    deleteOkText: {
      type: String,
      default: "Delete",
    },
    deleteCallback: {
      type: Function,
      default: () => ({}),
    },
    deleteMessage: {
      type: [String, Function],
      default: "Are you sure you want to delete this?",
    },
    editButtonProps: {
      type: Object,
      default: () => ({}),
    },
    hasEdit: {
      type: Boolean,
      default: true,
    },
    hasDelete: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "Action",
    },
    record: {
      type: Object,
      default: undefined,
    },
  },

  computed: {
    sDeleteButtonProps() {
      return {
        icon: "delete",
        size: "small",
        type: "link",
        ...this.deleteButtonProps,
      };
    },

    sEditButtonProps() {
      return {
        icon: "edit",
        size: "small",
        type: "link",
        ...this.editButtonProps,
      };
    },
  },

  methods: {
    onDelete() {
      const deleteMessage =
        typeof this.deleteMessage === "function"
          ? this.deleteMessage(this.record)
          : this.deleteMessage;

      this.$emit(
        "delete",
        this.record,
        deleteMessage,
        this.deleteCallback,
        this.deleteCancelText,
        this.deleteOkText
      );
    },

    onEdit() {
      this.$emit("edit", this.record);
    },
  },
};
</script>

<template>
  <div class="list__action-column">
    <slot :record="record">
      <a-space>
        <slot name="before" :record="record" />

        <a-tooltip v-if="hasEdit" title="Edit">
          <slot name="edit" :handle-edit="onEdit" :record="record">
            <a-button v-bind="sEditButtonProps" @click="onEdit" />
          </slot>
        </a-tooltip>

        <a-tooltip v-if="hasDelete" title="Delete">
          <slot name="delete" :handle-delete="onDelete" :record="record">
            <a-button v-bind="sDeleteButtonProps" @click="onDelete" />
          </slot>
        </a-tooltip>

        <slot name="after" :record="record" />
      </a-space>
    </slot>
  </div>
</template>

<style lang="scss">
.list__action-column {
  display: inline-block;
}
</style>
