<template>
  <div>
    <resource name="identities.common.app-group-list" :api-url="apiUrl" />
    <resource name="identities.common.portal.regions" :api-url="apiUrl" />
    <resource
      name="identities.configuration.appsettings"
      :api-url="apiUrl"
      redirect-route="/config/settings"
    >
      <edit-external-app />
    </resource>
  </div>
</template>

<script>
  import EditExternalApp from "./EditExternalApp";
  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: { EditExternalApp },

    data() {
      return {
        EditExternalApp,
        apiUrl,
      };
    },
  };
</script>

<style></style>
