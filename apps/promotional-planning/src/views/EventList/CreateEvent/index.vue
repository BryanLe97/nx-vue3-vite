<template>
  <div>
    <resource :api-url="apiUrl" name="promotion-planning.common.customers" />

    <resource
      :api-url="apiUrl"
      name="promotion-planning.events"
      redirect-route="/promotion-planning/event-list"
    >
      <create-event />
    </resource>
  </div>
</template>

<script>
import CreateEvent from "./CreateEvent.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: { CreateEvent },

  data() {
    return {
      apiUrl,
    };
  },
};
</script>