<template>
  <div class="add-employee-containers">
    <resource
      name="sterilization.fill-types"
      :api-url="apiUrl"
      :create="CreateEmployee"
      redirect-route="/config/employees"
    />
  </div>
</template>

<script>
  import CreateEmployee from "./CreateEmployee";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    name: "CreateEmployee",

    data() {
      return {
        CreateEmployee,
        apiUrl,
      };
    },
  };
</script>
