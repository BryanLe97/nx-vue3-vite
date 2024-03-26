<template>
  <div class="create-changelog-container">
    <resource name="identities.release-notes" :api-url="apiUrl">
      <create-changelog />
    </resource>
  </div>
</template>

<script>
  import CreateChangelog from "./CreateChangelog";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      CreateChangelog,
    },

    data() {
      return {
        apiUrl,
      };
    },
  };
</script>
