<template>
  <div class="create-customer">
    <resource name="promotion-planning.common.regions" :api-url="apiUrl" resource-id-name="code" />
    <resource
      name="promotion-planning.customers"
      :api-url="apiUrl"
      redirect-route="/promotion-planning/customers"
    >
      <create-customer />
    </resource>
  </div>
</template>

<script>
import CreateCustomer from "./CreateCustomer.vue";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    CreateCustomer,
  },

  data() {
    return {
      CreateCustomer,
      apiUrl,
    };
  },
};
</script>
