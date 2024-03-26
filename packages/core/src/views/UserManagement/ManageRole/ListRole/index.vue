<template>
  <div :key="key">
    <resource
      name="identities.roles"
      :api-url="apiUrl"
      create-route="/config/roles/create"
      edit-route="/config/roles/:id"
      :page="page"
    >
      <list-role @role-selected="onRoleSelected" />
    </resource>
    <router-view />
  </div>
</template>

<script>
  import { IDENTITY_ROLE } from "@kraftheinz/common";
  import ListRole from "./ListRole";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      ListRole,
    },

    props: {
      toggleRole: {
        type: Function,
        required: true,
      },
      selectedRoleId: {
        type: [Number, String],
        default: "",
      },
    },

    data() {
      return {
        ListRole,
        apiUrl,
        show: true,
        entityContext: null,
        key: 1,
        page: IDENTITY_ROLE,
      };
    },

    provide() {
      return {
        toggleRole: this.toggleRole,
        selectedRoleId: this.selectedRoleId,
      };
    },

    methods: {
      onRoleSelected(roleDetails) {
        this.$emit("role-selected", roleDetails);
      },
    },
  };
</script>
