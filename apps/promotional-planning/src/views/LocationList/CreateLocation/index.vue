<template>
  <div class="create-location">
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />
    <resource
      name="promotion-planning.common.primary-instore.category"
      :api-url="apiUrl"
    />

    <resource
      name="promotion-planning.primary-instore"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/activity-list"
    >
      <create-location />
    </resource>
  </div>
</template>

<script>
import CreateLocation from "./CreateLocation.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreateLocation,
  },
  data() {
    return {
      apiUrl,
    };
  },
};
</script>
