<template>
  <list-composer
    :has-filter-inactive="false"
    :has-active="false"
    :has-action="false"
    :custom-query="`roleId=${roleId}`"
    custom-padding-table="p-0"
  >
    <text-field
      key="PermissionName"
      data-index="permissionName"
      title="Permission Name"
    />
    <text-field
      key="OperationName"
      data-index="operationName"
      title="Operation Name"
    />
    <text-field key="UserName" data-index="userName" title="LAN-ID" />
    <text-field key="FullName" data-index="fullName" title="Full Name" />
    <text-field key="JobTitle" data-index="jobTitle" title="Job Title" />
    <text-field key="Email" data-index="email" title="Email" />
  </list-composer>
</template>

<script>
export default {
  name: "OverridedPermissions",

  inject: ["crud"],

  props: {
    roleId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {};
  },

  watch: {
    roleId(newVal) {
      this.crud.setQueryString("roleId", newVal);
      this.crud.fetchList();
    },
  },
};
</script>
