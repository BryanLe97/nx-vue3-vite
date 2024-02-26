<template>
  <list-composer
    title="Customers"
    search-by="Code,Description,KeyAccountCode,KeyAccount"
    ph-search-by="Search by Code, Description, Key Account Code, Key Account"
  >
    <template #create-buttons="{ onClick }">
      <a-button
        v-if="can(permissions.add)"
        type="primary"
        class="ml-2"
        @click="onClick"
      >
        Add Customer
      </a-button>
    </template>
    <url-field
      key="Code"
      base-url="/promotion-planning/customers"
      data-index="code"
      title="National Account Code"
      :sorter="true"
      :width="150"
    />

    <text-field
      key="Description"
      data-index="description"
      title="National Account"
      :sorter="true"
    />

    <url-field
      key="KeyAccountCode"
      data-index="keyAccountCode"
      base-url="/promotion-planning/customers"
      title="Key Account Code"
      :sorter="true"
      :width="200"
    />

    <text-field
      key="KeyAccount"
      data-index="keyAccount"
      title="Key Account"
      :sorter="true"
    />

    <text-field
      key="distributionCenter"
      data-index="distributionCenter"
      title="Distribution Center"
      :sorter="true"
    />

    <text-field
      key="RegionDescription"
      data-index="regionDescription"
      title="Region"
      :width="100"
      :sorter="true"
    />
  </list-composer>
</template>

<script>
import { ADD_PERMISSION } from "@kraftheinz/common";

export default {
  name: "ListCustomer",
  inject: ["can"],

  data() {
    return {
      permissions: {
        add: ADD_PERMISSION,
      },
    };
  },
};
</script>
