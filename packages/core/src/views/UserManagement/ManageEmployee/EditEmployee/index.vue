<template>
  <div class="edit-employee-containers">
    <resource
      :name="['identities.entities', 'identities.users']"
      :api-url="apiUrl"
      :redirect-route="['', '/config/employees']"
      :page="page"
    >
      <edit-employee />
    </resource>
  </div>
</template>

<script>
  import { IDENTITY_USER } from "@kraftheinz/common";
  import EditEmployee from "./EditEmployee";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    components: {
      EditEmployee,
    },

    data() {
      return {
        EditEmployee,
        apiUrl,
        page: IDENTITY_USER,
      };
    },
  };
</script>
