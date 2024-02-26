<template>
  <div class="create-pl-line">
    <resource name="promotion-planning.common.lines" :api-url="apiUrl" resource-id-name="code" />
    <resource
      name="promotion-planning.pllines"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/pl-lines"
    >
      <create-pl-line />
    </resource>
  </div>
</template>

<script>
import CreatePlLine from "./CreatePlLine.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreatePlLine,
  },

  data() {
    return {
      CreatePlLine,
      apiUrl,
    };
  },
};
</script>
