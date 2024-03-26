<template>
  <div id="app">
    <admin :app-layout="MasterLayout" :auth-provider="authProvider" />
  </div>
</template>

<script>
  import MasterLayout from "./layouts/MasterLayout";
  import createAuthProvider from "./store/auth.provider";

  export default {
    name: "App",

    data() {
      const authProvider = createAuthProvider(this.axios, {
        authUrls: {
          login: `${import.meta.env.VITE_API_URL}/login`,
          operations: `${
            import.meta.env.VITE_API_URL
          }/identities/self/operations`,
          userInfo: `${import.meta.env.VITE_API_URL}/identities/users`,
        },
        storageKey: "accessToken",
        userField: "userId",
      });

      return {
        MasterLayout,
        authProvider,
      };
    },
  };
</script>

<style lang="scss">
  .list__modal-confirm {
    .ant-modal-confirm-body {
      .anticon {
        color: #0062ff !important;
      }
    }

    &.list__modal-reverse-transaction {
      .ant-modal-confirm-body {
        .anticon {
          color: #d9363e !important;
        }
      }
    }

    &.list__modal-warning {
      .ant-modal-confirm-body {
        .anticon {
          color: #fa8c16 !important;
        }
      }
    }
    .ant-modal-confirm-btns {
      margin-top: 52px;
    }
  }

  .list__modal-delete {
    .ant-modal-confirm-body {
      .anticon {
        color: #d9363e !important;
      }
    }
  }

  .ant-notification-notice {
    .ant-notification-notice-content {
      word-break: break-word;
    }
  }
</style>
