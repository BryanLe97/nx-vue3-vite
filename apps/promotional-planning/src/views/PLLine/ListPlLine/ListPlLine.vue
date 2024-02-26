<template>
  <list-composer
    title="P&L Lines"
    search-by="Code,Description"
    ph-search-by="Search by Code, Description"
  >
    <url-field
      key="Code"
      base-url="/promotion-planning/pl-lines"
      data-index="code"
      title="Discount Code"
      :sorter="true"
      :width="150"
    />
    <text-field
      key="Description"
      data-index="description"
      title="Discount Description"
      :sorter="true"
    />
    <text-field key="LineDescription" data-index="lineDescription" title="Line" :sorter="true" />
    <check-box-field
      key="Extract"
      data-index="extract"
      title="Extract"
      align="center"
      :width="110"
    />
  </list-composer>
</template>

<script>
export default {
  name: "ListPlLine",

  data() {
    return {};
  },
};
</script>
