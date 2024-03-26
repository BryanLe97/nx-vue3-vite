<template>
  <div>
    <bread-crumb :items="itemsMenu" />
    <resource name="identities.reports" :api-url="apiUrl">
      <role-permission />
    </resource>
  </div>
</template>

<script>
  import RolePermission from "./RolePermission.vue";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      RolePermission,
    },
    data() {
      return {
        apiUrl,
        itemsMenu: [
          {
            key: "reports",
            title: "Reports",
            path: "",
          },
          {
            key: "role-permission",
            title: "Role & Permission",
            path: "/config/role-permission",
          },
        ],
      };
    },
  };
</script>

<style></style>
