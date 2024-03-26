<template>
  <div>
    <resource name="identities.common.app-group-list" :api-url="apiUrl" />
    <resource name="identities.common.portal.regions" :api-url="apiUrl" />
    <resource
      name="identities.configuration.appsettings"
      :api-url="apiUrl"
      redirect-route="/config/settings"
    >
      <add-external-app />
    </resource>
  </div>
</template>

<script>
  import AddExternalApp from "./AddExternalApp";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: { AddExternalApp },

    data() {
      return {
        AddExternalApp,
        apiUrl,
      };
    },
  };
</script>

<style></style>
