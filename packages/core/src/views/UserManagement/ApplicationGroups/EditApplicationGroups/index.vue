<template>
  <div>
    <resource name="identities.common.app-group-color-list" :api-url="apiUrl" />
    <resource
      name="identities.configuration.appgroups"
      :api-url="apiUrl"
      redirect-route="/config/application-groups"
    >
      <edit-application-groups />
    </resource>
  </div>
</template>

<script>
  import EditApplicationGroups from "./EditApplicationGroups";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      EditApplicationGroups,
    },

    data() {
      return {
        EditApplicationGroups,
        apiUrl,
      };
    },
  };
</script>

<style></style>
