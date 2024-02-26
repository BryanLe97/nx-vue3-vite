<template>
  <div class="edit-location">
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
      <edit-location />
    </resource>
  </div>
</template>

<script>
import EditLocation from "./EditLocation.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    EditLocation,
  },
  data() {
    return {
      apiUrl,
    };
  },
};
</script>
