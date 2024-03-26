<template>
  <div class="list-changelog-container">
    <bread-crumb :items="itemsMenu" />

    <resource
      name="identities.release-notes"
      :api-url="apiUrl"
      create-route="/release-notes/changelog/create"
    >
      <list-changelog />
    </resource>
  </div>
</template>

<script>
  import ListChangelog from "./ListChangelog";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      ListChangelog,
    },

    data() {
      return {
        apiUrl,
        itemsMenu: [
          {
            key: "release-notes",
            title: "Release Notes",
            path: "",
          },
          {
            key: "changelog",
            title: "Changelog",
            path: "/release-notes/changelog",
          },
        ],
      };
    },
  };
</script>
