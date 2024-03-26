<template>
  <div>
    <resource name="identities.common.app-group-color-list" :api-url="apiUrl" />
    <resource
      name="identities.configuration.appgroups"
      :api-url="apiUrl"
      redirect-route="/config/application-groups"
    >
      <create-application-groups />
    </resource>
  </div>
</template>

<script>
  import CreateApplicationGroups from "./CreateApplicationGroups";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      CreateApplicationGroups,
    },

    data() {
      return {
        CreateApplicationGroups,
        apiUrl,
      };
    },
  };
</script>

<style></style>
