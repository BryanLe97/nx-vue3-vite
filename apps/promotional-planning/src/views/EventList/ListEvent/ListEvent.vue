<template>
  <list-composer
    ph-search-by="Search by Key Account, Event"
    search-by="KeyAccount,Name"
    title="Event List"
  >
    <template #create-buttons="{ onClick }">
      <div>
        <a-button v-if="can(permissions.add)" type="primary" @click="onClick">Add Event List</a-button>
      </div>
    </template>

    <url-field
      key="KeyAccount"
      base-url="/promotion-planning/event-list"
      data-index="keyAccount"
      title="Key Account"
      :sorter="true"
    />

    <text-field key="Name" data-index="name" title="Event" :sorter="true" />
  </list-composer>
</template>

<script>
import { ADD_PERMISSION } from "@kraftheinz/common";

export default {
  name: "ListEvent",

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