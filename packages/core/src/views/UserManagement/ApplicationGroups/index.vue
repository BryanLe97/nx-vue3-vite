<template>
  <div>
    <bread-crumb :items="itemsMenu" />

    <resource
      name="identities.configuration.appgroups"
      :api-url="apiUrl"
      create-route="/config/application-groups/create"
      edit-route="/config/application-groups/:id"
      :page="page"
    >
      <application-groups />
    </resource>
    <router-view />
  </div>
</template>

<script>
  import ApplicationGroups from "./ApplicationGroups";
  import { APPLICATION_GROUPS } from "@kraftheinz/common";

  const apiUrl = import.meta.env.VITE_API_URL;
  export default {
    components: { ApplicationGroups },

    data() {
      return {
        page: APPLICATION_GROUPS,
        ApplicationGroups,
        apiUrl,
        itemsMenu: [
          {
            key: "configuration",
            title: "Configuration",
            path: "",
          },
          {
            key: "applicationGroups",
            title: "Application Groups",
            path: "/config/application-groups",
          },
        ],
      };
    },
  };
</script>

<style></style>
