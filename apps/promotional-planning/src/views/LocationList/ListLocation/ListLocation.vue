<template>
  <list-composer
    title="Activity List"
    search-by="CustomerName,Description"
    ph-search-by="Search by Key Account and Activity"
  >
    <url-field
      key="CustomerName"
      base-url="/promotion-planning/activity-list"
      data-index="customerName"
      title="Key Account"
      :sorter="true"
    />

    <text-field
      key="Description"
      data-index="description"
      title="Activity"
      :sorter="true"
    />

    <text-field
      key="Rate"
      data-index="rate"
      :parse="parseRate"
      title="Rate"
      :sorter="true"
    />
    <text-field
      key="category"
      data-index="category"
      title="Category"
      :sorter="true"
    />
  </list-composer>
</template>

<script>
export default {
  name: "LocationList",

  methods: {
    parseRate(rate) {
      return rate + "%";
    },
  },
};
</script>
