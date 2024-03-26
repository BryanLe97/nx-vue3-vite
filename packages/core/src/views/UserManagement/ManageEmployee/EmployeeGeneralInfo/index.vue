<template>
  <div>
    <resource name="identities.users" :api-url="apiUrl" :page="page">
      <employee-general-info />
    </resource>
  </div>
</template>

<script>
  import { IDENTITY_USER } from "@kraftheinz/common";
  import EmployeeGeneralInfo from "./EmployeeGeneralInfo";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    name: "GeneralInfo",

    components: {
      EmployeeGeneralInfo,
    },

    props: {
      entity: {
        type: [Object, String],
        default: () => {},
      },
    },

    provide() {
      return {
        data: this.entity,
      };
    },

    data() {
      return {
        apiUrl,
        page: IDENTITY_USER,
      };
    },
  };
</script>
