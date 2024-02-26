<template>
  <list-composer
    title="Fixed Terms"
    search-by="DiscountCode,DiscountDescription,KeyAccount,SubCategoryDescription,PPGDescription"
    ph-search-by="Search by Code, Description,..."
    :scroll="{ x: 1600 }"
  >
    <url-field
      key="DiscountCode"
      base-url="/promotion-planning/fixed-terms"
      data-index="discountCode"
      title="Discount Code"
      :sorter="true"
      :width="130"
      fixed="left"
    />
    <text-field
      key="DiscountDescription"
      data-index="discountDescription"
      title="Discount Description"
      :width="300"
      :sorter="true"
    />
    <text-field
      key="KeyAccount"
      data-index="keyAccount"
      title="Key Account"
      :sorter="true"
    />
    <text-field
      key="CategoryDescription"
      data-index="categoryDescription"
      title="Category"
      :sorter="true"
    />
    <text-field
      key="SubCategoryDescription"
      data-index="subCategoryDescription"
      title="Subcategory"
      :sorter="true"
    />
    <text-field
      key="PPGDescription"
      data-index="ppgDescription"
      title="PPG"
      :sorter="true"
    />
    <text-field
      key="LSV"
      data-index="lsv"
      title="LSV %"
      :parse="parseNum"
      :sorter="true"
      :width="80"
    />
    <text-field
      key="ISV"
      data-index="isv"
      title="ISV %"
      :parse="parseNum"
      :sorter="true"
      :width="75"
    />
  </list-composer>
</template>

<script>
export default {
  name: "ListFixedTerm",

  methods: {
    parseNum(value) {
      if (!value) return;
      return value.toFixed(2);
    },
  },
};
</script>
