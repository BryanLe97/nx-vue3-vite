<template>
  <div>
    <bread-crumb :items="itemsMenu" />
    <resource name="identities.common.apps" :api-url="apiUrl" />
    <resource name="identities.common.sitevisitors" :api-url="apiUrl">
      <number-of-site-visitors />
    </resource>
  </div>
</template>

<script>
  import NumberOfSiteVisitors from "./NumberOfSiteVisitors.vue";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      NumberOfSiteVisitors,
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
            key: "site-visitors",
            title: "Site Visitor Count",
            path: "/config/site-visitors",
          },
        ],
      };
    },
  };
</script>

<style></style>
