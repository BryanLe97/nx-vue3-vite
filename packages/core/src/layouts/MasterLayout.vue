<template>
  <a-layout id="kh-master-layout">
    <sider
      v-if="!isAtHomePage"
      :version="version"
      :is-collapsed="collapsed"
      @triggerChange="onTriggerChange"
    />

    <a-layout :style="{ position: 'relative' }">
      <app-header :has-logo="isAtHomePage" :version="version" />

      <a-layout-content :style="{ background: '#fff', minHeight: '280px' }">
        <router-view
          :is-sidebar-collapsed="collapsed"
          @collapsedMounted="onTriggerChange"
        />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import AppHeader from "@/components/Header";
  import Sider from "@/components/Sider";

  const apiUrl = import.meta.env.VITE_API_URL;

  export default {
    name: "MasterLayout",

    metaInfo: {
      title: "KraftHeinz",
    },

    components: {
      AppHeader,
      Sider,
    },

    data() {
      return {
        collapsed: false,
        version: "",
      };
    },

    computed: {
      isAtHomePage() {
        return this.$route.path == "/";
      },
    },

    mounted() {
      this.fetchVersion();
    },

    methods: {
      async fetchVersion() {
        try {
          const { data } = await this.axios.get(
            `${apiUrl}/identities/release-notes`,
            {
              params: {
                page: 1,
                pageSize: 1,
              },
            }
          );

          this.version = data.results[0].versionNumber;
        } catch (err) {
          console.error(err);
        }
      },

      onTriggerChange(collapsed) {
        this.collapsed = collapsed;
      },
    },
  };
</script>

<style lang="scss" scoped>
  #kh-master-layout {
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    .ant-layout-content {
      max-height: calc(100vh - 56px);
      overflow-x: hidden;
      overflow-y: auto;
      background: #f6f6fa !important;
    }
  }
</style>
