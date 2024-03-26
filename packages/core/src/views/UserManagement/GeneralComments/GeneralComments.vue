<template>
  <list-composer
    title="General Comments"
    :has-active="false"
    :has-filter-inactive="false"
    :has-edit-in-row="true"
    :custom-url-edit-in-row="customUrlEditInRow"
  >
    <template #customFilter>
      <div class="d-flex align-items-center">
        <span class="mr-2">Status</span>
        <select-input
          class="status-filter"
          :data-source="listStatus"
          source="id"
          source-label="status"
          placeholder="Select Status"
          default-active-first-option
          @change="onStatusChange"
        />
      </div>
    </template>

    <template #customButton>
      <date-range-picker @change="onDateRangeChange" />
    </template>

    <text-field key="UserId" title="LANID" data-index="userName" />
    <text-field
      key="FullName"
      title="First & Last Name"
      data-index="fullName"
    />
    <text-field
      key="CreatedAt"
      title="Submitted Date"
      data-index="createdAt"
      :parse="formatDate"
    />
    <text-field key="Comments" title="Comments" data-index="comments" />
    <text-field
      key="Status"
      title="Status"
      data-index="statusName"
      edit-in-row="select-input"
      :edit-in-row-data="editStatusData"
      :width="150"
    />
  </list-composer>
</template>

<script>
import { GENERAL_COMMENTS_STATUS } from "@/constants";
export default {
  name: "GeneralComments",

  inject: ["crud", "apiUrl"],

  data() {
    return {
      listStatus: [{ id: 0, status: "All" }, ...GENERAL_COMMENTS_STATUS],
      editStatusData: {
        dataSource: GENERAL_COMMENTS_STATUS,
        source: "id",
        sourceLabel: "status",
      },
      customUrlEditInRow: `${this.apiUrl}/identities/generalcomments/RECORD_ID`,
    };
  },

  destroyed() {
    this.crud.deleteQueryString("fromDate");
    this.crud.deleteQueryString("toDate");
  },

  methods: {
    onDateRangeChange(value) {
      this.crud.setQueryString("fromDate", value.startDate);
      this.crud.setQueryString("toDate", value.endDate);
      this.crud.fetchList();
    },

    onStatusChange(value) {
      if (value === 0) {
        this.crud.deleteFilter("Status");
        this.crud.fetchList();
      } else {
        this.crud.setFilter("Status", { operator: "Eq", value });
        this.crud.fetchList();
      }
    },

    formatDate(date) {
      return this.$moment(date).format("DD/MM/YYYY");
    },
  },
};
</script>

<style lang="scss" scoped>
.status-filter {
  width: 130px;
}
</style>
