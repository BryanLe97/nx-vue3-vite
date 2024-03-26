<template>
  <div class="">
    <bread-crumb :items="itemsMenu" />
    <resource
      name="identities.users"
      :api-url="apiUrl"
      :page="page"
      create-route="/config/employees/create"
      edit-route="/config/employees/:id"
      :list="ListEmployee"
    />
    <router-view />
  </div>
</template>

<script>
  import { IDENTITY_USER } from "@kraftheinz/common";
  import ListEmployee from "./ListEmployee";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    name: "ListEmployee",

    data() {
      return {
        ListEmployee,
        apiUrl,
        page: IDENTITY_USER,
        itemsMenu: [
          {
            key: "configuration",
            title: "Configuration",
            path: "",
          },
          {
            key: "manageemployee",
            title: "Manage Users",
            path: "/config/employees",
          },
        ],
      };
    },
  };
</script>
