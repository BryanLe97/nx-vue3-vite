<template>
  <div class="body">
    <portal to="sider-items">
      <div class="kh-application p-4">
        <p class="m-0">Promotion Planning</p>
        <h5 class="mb-0">Promotional Planning ANZ</h5>
      </div>

      <a-menu
        :default-open-keys="openKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="collapsed"
        :selected-keys="selectedKeys"
      >
        <template v-for="item in dataMenu">
          <template
            v-if="
              item.key == 'home' ||
              (!hasChildMenu(item) && $can(permissions.view, item.page))
            "
          >
            <a-menu-item
              v-if="!item.hidden"
              :key="item.key"
              @click="onItemClick($event)"
            >
              <router-link :to="item.path">
                <a-icon :type="item.icon" />
                <span>{{ item.title }}</span>
              </router-link>
            </a-menu-item>
          </template>

          <template v-if="hasChildMenu(item)">
            <a-sub-menu v-if="!item.hidden" :key="item.key">
              <template v-slot:title>
                <a-icon :type="item.icon" />
                <span>{{ item.title }}</span>
              </template>

              <template v-for="itemChild in item.child">
                <a-menu-item
                  v-if="
                    !itemChild.hidden && $can(permissions.view, itemChild.page)
                  "
                  :key="itemChild.key"
                  @click="onItemClick($event)"
                >
                  <router-link :to="itemChild.path">{{
                    itemChild.title
                  }}</router-link>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </template>
        </template>
      </a-menu>
    </portal>

    <router-view v-if="showChildRoute" />
  </div>
</template>

<script>
import {
  PROMOTIONAL_PLANNING_PROMO_CUSTOMER,
  PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS,
  PROMOTIONAL_PLANNING_PROMO_EVENT_LIST,
  PROMOTIONAL_PLANNING_PROMO_LIST,
  PROMOTIONAL_PLANNING_PROMO_LOCATION_LIST,
  PROMOTIONAL_PLANNING_PROMO_PANDL,
  PROMOTIONAL_PLANNING_PROMO_PRODUCT,
  PROMOTIONAL_PLANNING_PROMO_UPLOAD_EXPORT,
  PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE,
  PROMOTIONAL_PLANNING_SCENARIO_BUILDER,
  VIEW_PERMISSION,
  AuthTypes,
  PermissionCheckMixin,
} from 'common';

export default {
  name: 'PromotionalPlanning',

  metaInfo: {
    title: 'Promotional Planning',
  },

  mixins: [PermissionCheckMixin],

  data() {
    return {
      collapsed: false,
      showChildRoute: false,
      permissions: {
        view: VIEW_PERMISSION,
      },
      dataMenu: [
        {
          title: 'Back to Main Menu',
          path: '/',
          key: 'home',
          icon: 'appstore',
          child: [],
        },
        {
          title: 'PromoDB Home Page',
          path: '/promotion-planning/landing-page',
          key: 'landing-page',
          icon: 'container',
          page: PROMOTIONAL_PLANNING_PROMO_LIST,
          child: [],
        },
        {
          title: 'Scenario Builder',
          path: '/promotion-planning/scenario-builder',
          key: 'scenario-builder',
          page: PROMOTIONAL_PLANNING_SCENARIO_BUILDER,
          icon: 'table',
          child: [],
        },
        {
          title: 'Retail Price',
          path: '/promotion-planning/retail-price',
          icon: 'container',
          page: PROMOTIONAL_PLANNING_PROMO_LIST,
          child: [],
        },
        {
          title: 'Administration',
          path: '',
          key: 'administration',
          icon: 'solution',
          page: PROMOTIONAL_PLANNING_PROMO_UPLOAD_EXPORT,
          child: [
            {
              title: 'Upload/Export',
              path: '/promotion-planning/upload-export',
              key: 'upload-export',
              page: PROMOTIONAL_PLANNING_PROMO_UPLOAD_EXPORT,
            },
          ],
        },
        {
          title: 'Master Files',
          path: '',
          key: 'masterfiles',
          icon: 'tool',
          child: [
            {
              title: 'Products',
              path: '/promotion-planning/products',
              key: 'products',
              page: PROMOTIONAL_PLANNING_PROMO_PRODUCT,
            },
            {
              title: 'Customers',
              path: '/promotion-planning/customers',
              key: 'customers',
              page: PROMOTIONAL_PLANNING_PROMO_CUSTOMER,
            },
            {
              title: 'P&L Lines',
              path: '/promotion-planning/pl-lines',
              key: 'pl-lines',
              page: PROMOTIONAL_PLANNING_PROMO_PANDL,
            },
            {
              title: 'Fixed Terms',
              path: '/promotion-planning/fixed-terms',
              key: 'fixed-terms',
              page: PROMOTIONAL_PLANNING_PROMO_FIXED_TERMS,
            },
            {
              title: 'Unit Percentage',
              path: '/promotion-planning/unit-percentage',
              page: PROMOTIONAL_PLANNING_PROMO_UNIT_PERCENTAGE,
              key: 'unit-percentage',
            },
            {
              title: 'Activity List',
              path: '/promotion-planning/activity-list',
              key: 'activity-list',
              page: PROMOTIONAL_PLANNING_PROMO_LOCATION_LIST,
            },
            {
              title: 'Event List',
              path: '/promotion-planning/event-list',
              key: 'event-list',
              page: PROMOTIONAL_PLANNING_PROMO_EVENT_LIST,
            },
          ],
        },
      ],
      openKeys: [],
      rootSubmenuKeys: [],
      selectedKeys: [],
    };
  },

  computed: {
    currentRouteInfo() {
      if (!this.$route.matched[1]) return {};

      const { path, meta } = this.$route.matched[1];
      return { path, meta };
    },

    userInfo() {
      const { namespace, AUTH_GET_USER } = AuthTypes;
      return this.$store.getters[`${namespace}/${AUTH_GET_USER}`];
    },
  },

  watch: {
    currentRouteInfo(newVal) {
      this.updateMenu(newVal);
    },

    userInfo(newVal) {
      let ppRole =
        newVal.roles &&
        newVal.roles.find((e) => e.app == 'promotion-planning' && e.isActive);

      if (ppRole) {
        this.$context.setAppContext(ppRole.entityId);
      }

      this.showChildRoute = true;
    },
  },

  created() {
    if (!this._.isEmpty(this.userInfo)) this.applyContext(this.userInfo);
    this.updateMenu(this.currentRouteInfo);
  },

  methods: {
    applyContext(userInfos) {
      let ppRole =
        userInfos.roles &&
        userInfos.roles.find(
          (e) => e.app == 'promotion-planning' && e.isActive
        );

      if (ppRole) {
        this.$context.setAppContext(ppRole.entityId);
      }

      this.showChildRoute = true;
    },

    hasChildMenu(menuItem) {
      if (!menuItem.child.length) return false;

      return menuItem.child.some((child) =>
        this.$can(this.permissions.view, child.page)
      );
    },

    updateMenu: function ({ path, meta }) {
      this.openKeys = typeof meta == 'string' ? [meta.split(';')[0]] : null;

      let title = path.substring(path.lastIndexOf('/') + 1);

      this.selectedKeys = [title];
    },

    onItemClick: function (e) {
      if (!e.key) return;

      let { path } = this.currentRouteInfo;
      let title = path.substring(path.lastIndexOf('/') + 1);

      if (title === e.key) {
        this.selectedKeys = [e.key];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  .ant-menu,
  .ant-menu-submenu > ::v-deep .ant-menu {
    border: none;
  }

  .ant-menu-inline {
    max-height: calc(100vh - 212.5px);
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #babac0;

    &::-webkit-scrollbar {
      background-color: transparent;
    }
  }

  .ant-menu-submenu {
    & > ::v-deep .ant-menu-inline.ant-menu-sub {
      position: relative;
    }
  }

  &.ant-layout-sider-collapsed {
    .sidebar-header {
      justify-content: center;
      .logo-container {
        width: 0;
      }
    }

    .kh-application * {
      width: 0;
    }
  }

  .sidebar-header {
    height: 56px;
    box-shadow: inset 0px -1px 0px #eaedf0, inset -1px 0px 0px #eaedf0;
    background-color: #ffffff;
    justify-content: space-around;
    background: #f9fafb;

    .logo-container {
      width: auto;
      overflow: hidden;
      transition: width 0.2s;
    }
  }

  /* Temp css */
  p {
    font-weight: bold;
    font-size: 14px;
    color: #99c0ff;
  }

  h5 {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
  }

  /* end temp css */
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

.kh-application {
  background-image: url('@/assets/promotional.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  * {
    width: 100%;
    overflow: hidden;
    transition: width 0.2s;
  }
}
</style>
