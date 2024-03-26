<template>
  <list-composer
    title="Manage Users"
    create-button-text="Add User"
    search-by="UserName,FirstName,LastName,JobTitle,Email"
    ph-search-by="Search by Username, First Name, Last Name, Job Title and Email"
  >
    <url-field
      key="UserName"
      base-url="/config/employees"
      :sorter="true"
      data-index="userName"
      title="Username"
    />

    <text-field key="FirstName" data-index="firstName" :sorter="true" title="First Name" />
    <text-field key="LastName" data-index="lastName" :sorter="true" title="Last Name" />
    <text-field key="JobTitle" data-index="jobTitle" :sorter="true" title="Job Title" />
    <text-field key="Email" data-index="email" :sorter="true" title="Email" />

    <template #action="{ edit, record }">
      <a-tooltip v-if="can(MAINTAIN_PERMISSION)">
        <template #title>{{ !record.isActive ? "Activate" : "Deactivate" }}</template>

        <a-button
          class="list__action-toggle-active mr-2"
          :icon="!record.isActive ? 'eye-invisible' : 'eye'"
          size="small"
          type="link"
          @click="toggleUserStatus(record)"
        />
      </a-tooltip>

      <a-tooltip>
        <template #title>Detail</template>
        <a-button icon="right-circle" size="small" type="link" @click="edit(record)" />
      </a-tooltip>
    </template>
  </list-composer>
</template>

<script>
import { MAINTAIN_PERMISSION } from "@kraftheinz/common";

export default {
  name: "ListEmployee",

  inject: ["crud", "can"],

  data() {
    return {
      MAINTAIN_PERMISSION,
    };
  },

  methods: {
    toggleUserStatus(record, customTitle = null, type = null) {
      let icon, okType, title;

      if (!record.isActive) {
        title = "Do you want to Activate this item?";
        icon = "eye";
        okType = "primary";
      } else {
        title = customTitle
          ? customTitle
          : "Do you want to Deactivate this item?";
        icon = type ? type : "eye-invisible";
        okType = "danger";
      }

      this.$confirm({
        class: "list__modal-confirm",
        icon,
        title,
        cancelText: "No",
        okText: "Yes",
        okType,
        onOk: this.toggleActive(record),
      });
    },

    toggleActive(record) {
      return () =>
        this.crud
          .submitPartialEntity({
            resourceName: "identities.users",
            id: record.id,
            data: [
              {
                op: "replace",
                path: "/IsInactive",
                value: record.isActive,
              },
            ],
          })
          .then(() => this.crud.fetchList());
    },
  },
};
</script>
