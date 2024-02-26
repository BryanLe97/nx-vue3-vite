<template>
  <div>
    <resource :api-url="apiUrl" name="promotion-planning.common.customers" />

    <resource
      :api-url="apiUrl"
      name="promotion-planning.events"
      redirect-route="/promotion-planning/event-list"
    >
      <edit-event />
    </resource>
  </div>
</template>

<script>
import EditEvent from "./EditEvent.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: { EditEvent },

  data() {
    return {
      apiUrl,
    };
  },
};
</script>