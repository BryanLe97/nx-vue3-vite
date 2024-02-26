<template>
  <div class="list-unit-percentage">
    <list-composer
      title="Unit Percentage"
      search-by="KeyAccount,PpgCode"
      ph-search-by="Search by Key Account, PPG"
    >
      <template #create-buttons="{ onClick }">
        <a-button type="primary" class="ml-2" @click="onClick">Add Unit %</a-button>
      </template>
      <url-field
        key="KeyAccountCode"
        base-url="/promotion-planning/unit-percentage"
        data-index="keyAccountCode"
        title="Key Account Code"
        :sorter="true"
      />
      <text-field key="KeyAccount" data-index="keyAccount" title="Key Account" :sorter="true" />
      <text-field key="Ppg" data-index="ppg" title="PPG" :sorter="true" />
      <text-field key="Sellin" data-index="sellin" title="Sellin %" :sorter="true" :width="100" />
      <text-field
        key="Sellthrough"
        data-index="sellthrough"
        title="Sellthrough %"
        :sorter="true"
        :width="150"
      />
      <text-field key="Sellout" data-index="sellout" title="Sellout %" :sorter="true" :width="120" />
    </list-composer>
  </div>
</template>

<script>
export default {
  name: "ListUnitPercentage",
}
</script>