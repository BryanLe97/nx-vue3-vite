<template>
  <div>
    <h2 class="pt-2 pb-4 px-5 number-of-site__heading">
      Site Visitor Count
    </h2>
    <line-chart class="px-5" name="site-visitor-chart" :config="chartConfig" />
    <list-composer
      :has-action="false"
      :has-active="false"
      :has-filter-inactive="false"
      custom-padding-table="px-5 pb-5 pt-3"
    >
      <template #customFilter>
        <div class="number-of-site__filter d-flex flex-column w-100">
          <div class="d-flex justify-content-between">
            <div class="left-filter d-flex align-items-center">
              Country
              <select-input
                class="select-filter m-2"
                :data-source="listCountries"
                source="countryName"
                placeholder="Select Country"
                default-active-first-option
                @change="onCountryChange"
              />

              Location
              <select-input
                class="select-filter m-2"
                :data-source="listLocations"
                source="locationName"
                placeholder="Select Location"
                default-active-first-option
                @change="onLocationChange"
              />

              Application
              <select-input
                class="select-filter m-2"
                reference="identities.common.apps"
                source="appCode"
                source-label="appName"
                placeholder="Select Application"
                default-active-first-option
                @change="onAppChange"
              />

              Date Range
              <date-range-picker class="ml-2" @change="onDateRangeChange" />
            </div>
            <div class="right-filter d-flex align-items-center">
              <a-tooltip>
                <template #title>
                  Search By LAN-ID, First Name, Last Name
                </template>
                <keyword-filter
                  class="m-2"
                  :field="`UserName,FirstName,LastName`"
                  :placeholder="`Search By LAN-ID, First Name, Last Name`"
                />
              </a-tooltip>
            </div>
          </div>
          <div class="mb-2">Total Site visitor Count: {{ totalVisitors }}</div>
        </div>
      </template>
      <text-field key="AppName" data-index="appName" title="Application" />
      <text-field key="UserName" data-index="userName" title="LAN-ID" />
      <text-field key="FirstName" data-index="firstName" title="First Name" />
      <text-field key="LastName" data-index="lastName" title="Last Name" />
      <text-field key="JobTitle" data-index="jobTitle" title="Job Title" />
      <text-field key="Email" data-index="email" title="Email" />
      <text-field
        key="VisitCount"
        data-index="visitCount"
        title="Visit Count"
      />
    </list-composer>
  </div>
</template>

<script>
import { LineChart } from "@kraftheinz/common";

export default {
  name: "NumberOfSiteVisitors",

  components: {
    LineChart,
  },

  inject: ["crud", "apiUrl"],

  data() {
    return {
      listCountries: [],
      listLocations: [],
      listApplications: [],

      chartConfig: {},
    };
  },

  computed: {
    totalVisitors() {
      return this.crud.getPagination().count;
    },
  },

  async mounted() {
    await this.getCountries();
    await this.getChartData();
  },

  methods: {
    async onCountryChange(value) {
      if (value === "All") {
        await this.crud.deleteQueryString("Country");
        this.crud.fetchList();
        this.listLocations = [{ locationName: "All" }];
        return;
      }
      await this.crud.setQueryString("Country", value);
      this.crud.fetchList();
      this.getLocations(value);
    },

    async onLocationChange(value) {
      if (value === "All") {
        await this.crud.deleteQueryString("Location");
        this.crud.fetchList();
        return;
      }
      await this.crud.setQueryString("Location", value);
      this.crud.fetchList();
    },

    async onDateRangeChange(value) {
      const startDate = value.startDate + " 00:00:00";
      const endDate = value.endDate + " 24:00:00";
      await this.crud.setQueryString(
        "StartDate",
        this.$moment(startDate)
          .utc()
          .format()
      );
      await this.crud.setQueryString(
        "EndDate",
        this.$moment(endDate)
          .utc()
          .format()
      );
      this.crud.fetchList();
    },

    async onAppChange(value) {
      await this.crud.setQueryString("AppCode", value);
      this.crud.fetchList();
    },

    async getCountries() {
      const { data } = await this.axios.get(
        `${this.apiUrl}/identities/common/countries`
      );
      this.listCountries = [{ countryName: "All" }, ...data.results];
    },

    async getChartData() {
      const { data } = await this.axios.get(
        `${this.apiUrl}/identities/common/sitevisitors/linechart`
      );

      this.chartConfig = {
        data: data.results,
        xField: "monthText",
        yField: "numberOfUser",
        seriesField: "country",
        smooth: true,
        legend: {
          itemName: {
            style: {
              fontSize: 15,
              fontWeight: 600,
              fill: "black",
            },
          },
          marker: {
            symbol: (x, y) => {
              return [
                ["M", 0, y],
                ["L", 25, y],
              ];
            },
            style: {
              lineWidth: 3,
            },
          },
        },
      };
    },

    async getLocations(countryName) {
      const { data } = await this.axios.get(
        `${this.apiUrl}/identities/common/countries/locations?country=${countryName}`
      );
      this.listLocations = [{ locationName: "All" }, ...data.results];
    },
  },
};
</script>

<style lang="scss" scoped>
.number-of-site {
  &__heading {
    display: block;
    font-size: 20px;
    font-weight: 700;
    background: white;
  }

  &__filter {
    .select-filter {
      min-width: 150px;
    }
  }
}
</style>
