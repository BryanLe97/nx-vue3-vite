<template>
  <div>
    <bread-crumb :items="itemsMenu" />
    <resource
      name="identities.configuration.appsettings"
      resource-id-name="code"
      :api-url="apiUrl"
      create-route="/config/settings/create"
      edit-route="/config/settings/:id"
      :page="page"
    >
      <application-settings />
    </resource>
    <router-view />
  </div>
</template>

<script>
  import ApplicationSettings from "./ApplicationSettings";

  import { APPLICATION_SETTINGS } from "@kraftheinz/common";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      ApplicationSettings,
    },

    data() {
      return {
        page: APPLICATION_SETTINGS,
        ApplicationSettings,
        apiUrl,
        itemsMenu: [
          {
            path: "",
            key: "configuration",
            title: "Configuration",
          },
          {
            path: "/employees/settings",
            key: "settings",
            title: "Application Settings",
          },
        ],
      };
    },
  };
</script>

<style></style>
