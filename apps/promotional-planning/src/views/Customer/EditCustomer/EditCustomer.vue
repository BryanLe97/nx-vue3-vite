<template>
  <edit-modal-composer
    :custom-url="`${customApiUrl}${customerId}`"
    :entity-id="customerId"
    :is-fetch-entity-by-id="true"
    :last-modified-by-name="true"
    title="Edit Customer"
    :key-receive-event="keyReceiveEvent"
    @change="onChangeControl"
  >
    <text-input
      key="code"
      label="National Account Code"
      :disabled="true"
      placeholder="National Account Code"
      rules="required|alpha_dash"
      :span="12"
    />

    <select-input
      key="region"
      label="Region"
      reference="promotion-planning.common.regions"
      placeholder="Region"
      :on-select-change="onRegionChange"
      source="code"
      source-label="description"
      rules="required"
      :span="12"
    />

    <text-input
      key="description"
      label="National Account"
      placeholder="National Account"
      rules="required"
      :max-length="255"
      :span="24"
    />

    <text-input
      key="keyAccountCode"
      label="Key Account Code"
      :disabled="true"
      placeholder="Key Account Code"
      rules="required|alpha_dash"
      :max-length="10"
      :span="12"
    />

    <text-input
      key="keyAccount"
      label="Key Account"
      placeholder="Key Account"
      :rules="`required|not_same:${distributionCenter},${keyAccount},Distribution Center`"
      :max-length="255"
      :span="24"
    />

    <select-input
      key="distributionCenterId"
      label="Distribution Center"
      placeholder="Distribution Center"
      :data-source="distributionCenterList"
      :loading="loading"
      :all-in-value="true"
      :on-select-change="onDistributionCenterChange"
      :rules="`not_same:${distributionCenter},${keyAccount},Key Account`"
      source="id"
      :source-label="(val) => generateLabel(val, ['region', 'keyAccountCode', 'keyAccount'])"
      :span="24"
    />
  </edit-modal-composer>
</template>

<script>
import { PromoUtils } from "@/utils";

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: "EditCustomer",
  inject: ["crud"],
  mixins: [PromoUtils],

  data() {
    const { id } = this.$route.params;
    return {
      customerId: id,
      customApiUrl: `${apiUrl}/promotion-planning/customers/`,
      keyAccount: "",
      distributionCenterList: [],
      distributionCenter: "",
      keyReceiveEvent: ["keyAccount"],
      loading: false,
      apiUrl,
      entity: {},
    };
  },

  async mounted() {
    await this.crud.fetchEntity(), (this.entity = this.crud.getEntity());
    this.keyAccount = this.entity.keyAccount;
    this.distributionCenter = this.entity.distributionCenter;
    this.getDistributionCenterList(this.entity.region);
  },

  methods: {
    onRegionChange(region) {
      this.getDistributionCenterList(region);
    },

    async getDistributionCenterList(region) {
      this.loading = true;
      const res = await this.axios.get(
        `${this.apiUrl}/promotion-planning/common/customers/${region}?None=true`
      );
      if (res && res.data) {
        this.distributionCenterList = res.data.results;
        this.loading = false;
      }
    },

    onChangeControl(value) {
      Object.keys(value).forEach((key) => {
        if (key === "keyAccount") {
          this.keyAccount = value.keyAccount;
        }
      });
    },

    onDistributionCenterChange(value) {
      this.crud.updateEntity("editForm", {
        resourceKey: "distributionCenterId",
        value: value.id,
      });
      this.distributionCenter = value.keyAccount;
    },
  },
};
</script>
