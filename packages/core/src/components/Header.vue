<template>
  <a-layout-header
    class="d-flex align-items-center justify-content-between"
    :class="[
      isOnStaging ? 'kh-header-staging' : 'kh-header',
      isTablet ? 'custom-ant-layout-header' : '',
    ]"
  >
    <a-row type="flex" align="middle" justify="space-between" class="w-100">
      <a-col
        :order="isTablet ? 2 : 1"
        class="d-flex flex-wrap align-items-center"
      >
        <img v-if="hasLogo" src="../assets/logo.png" />

        <router-link
          v-if="hasLogo"
          class="version-number ml-2"
          to="/release-notes"
        >
          <span>(ver {{ version }})</span>
        </router-link>

        <h5 v-else class="primary-color mr-3 mb-0">{{ title }}</h5>
        <portal-target name="facility-select" />
      </a-col>
      <a-col
        :order="isTablet ? 1 : 2"
        :span="isTablet ? 24 : 0"
        class="d-flex justify-content-center"
      >
        <h5 v-if="isOnStaging" class="noncore-title primary-color mb-0">
          {{ $t("app_portal.test_anj_app") }}
        </h5>
        <h5 v-else class="noncore-title primary-color mb-0">
          {{ $t("app_portal.anj_app") }}
        </h5>
      </a-col>

      <a-col
        :order="isTablet ? 3 : 3"
        class="right-menu d-flex align-items-center"
      >
        <div class="profile d-flex align-items-center ml-1">
          <a-avatar style="color: #ffffff; background-color: #0062ff">{{
            userAvatar
          }}</a-avatar>

          <div class="profile-details ml-2">
            <p class="name mb-0">
              {{ userInfo.firstName }} {{ userInfo.lastName }}
            </p>
            <p class="job-desc mb-0">{{ userInfo.jobTitle }}</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
  import { AuthTypes } from "@kraftheinz/common";

  const env = import.meta.env.VITE_APP_ENV;

  export default {
    name: "AppHeader",

    props: {
      hasLogo: {
        type: Boolean,
        default: true,
      },

      version: {
        type: String,
        default: "",
      },
    },

    data() {
      return {
        title: "",
        isOnStaging: env == "dev" || env == "staging",
        windowWidth: window.innerWidth,
      };
    },

    computed: {
      userInfo() {
        const { namespace, AUTH_GET_USER } = AuthTypes;
        return this.$store.getters[`${namespace}/${AUTH_GET_USER}`];
      },

      isTablet() {
        return this.windowWidth <= 1050;
      },

      userAvatar() {
        let avatar = "";
        if (!this.userInfo) return avatar;
        if (this.userInfo.firstName)
          avatar = avatar + this.userInfo.firstName.charAt(0);
        if (this.userInfo.lastName)
          avatar = avatar + this.userInfo.lastName.charAt(0);
        return avatar;
      },
    },

    watch: {
      "$route.path": function () {
        this.$nextTick(() => (this.title = window.document.title));
      },
    },

    mounted() {
      /**
       * First time loading window title when user refresh browser
       */
      setTimeout(() => (this.title = window.document.title), 500);

      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });

      this.$i18n.locale = localStorage.getItem("langCode") || "en";
    },

    beforeDestroy() {
      window.removeEventListener("resize", this.onResize);
    },

    methods: {
      onResize() {
        this.windowWidth = window.innerWidth;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .custom-ant-layout-header {
    height: auto !important;
  }
  .kh-header {
    box-shadow: inset 0px -1px 0px #eaedf0;
    background: white;

    &-staging {
      box-shadow: inset 0px -1px 0px #eaedf0;
      background: rgba(255, 74, 74, 0.925);

      h5 {
        line-height: 1;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .version-number {
        color: #ecf4ff;
      }

      // .noncore-title {
      //   transform: translateX(-25%);
      // }

      .profile {
        p.name {
          color: #ecf4ff;
          font-size: 12px;
          line-height: 20px;
        }

        p.job-desc {
          font-size: 12px;
          line-height: 20px;
          color: #ecf4ff;
        }
      }
    }

    h5 {
      line-height: 1;
      font-size: 1.25rem;
    }

    .version-number {
      color: #92a0b0;
    }

    .profile {
      p.name {
        font-size: 12px;
        line-height: 20px;
      }

      p.job-desc {
        font-size: 12px;
        line-height: 20px;
        color: #92a0b0;
      }
    }
  }
</style>
