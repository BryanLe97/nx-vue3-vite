<template>
  <div>
    <bread-crumb :items="menuItems" />
    <resource name="identities.generalcomments" :api-url="apiUrl">
      <general-comments />
    </resource>
  </div>
</template>

<script>
  import GeneralComments from "./GeneralComments.vue";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: { GeneralComments },

    data() {
      return {
        apiUrl,
        menuItems: [
          {
            key: "config",
            title: "Configuration",
            path: "",
          },
          {
            key: "general-comment",
            title: "General Comments",
            path: "/config/general-comment",
          },
        ],
      };
    },
  };
</script>

<style></style>
