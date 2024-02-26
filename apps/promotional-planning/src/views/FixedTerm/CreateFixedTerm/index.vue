<template>
  <div class="create-fixed-term">
    <resource name="promotion-planning.common.pllines" :api-url="apiUrl" resource-id-name="code" />
    <resource name="promotion-planning.common.customers" :api-url="apiUrl" />

    <resource
      name="promotion-planning.common.categories"
      :api-url="apiUrl"
      resource-id-name="code"
    />

    <resource
      name="promotion-planning.common.sub-categories"
      :api-url="apiUrl"
      resource-id-name="code"
    />

    <resource name="promotion-planning.common.products" :api-url="apiUrl" />

    <resource
      name="promotion-planning.fixedterms"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/fixed-terms"
    >
      <create-fixed-term />
    </resource>
  </div>
</template>

<script>
import CreateFixedTerm from "./CreateFixedTerm.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreateFixedTerm,
  },

  data() {
    return {
      apiUrl,
    };
  },
};
</script>
