<script>
import { createCrudModule } from "@/store/modules";
import createCrudProps from "@/utils/crud.bindings";

export default {
  name: "Resource",

  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    create: {
      type: Object,
      default: null,
    },
    createRoute: {
      type: [String, Array],
      default: "",
    },
    edit: {
      type: Object,
      default: null,
    },
    editRoute: {
      type: [String, Array],
      default: "",
    },
    editRouteIdName: {
      type: [String, Array],
      default: "id",
    },
    filter: {
      type: Object,
      default: null,
    },
    filterRoute: {
      type: [String, Array],
      default: "",
    },
    list: {
      type: Object,
      default: null,
    },
    name: {
      type: [String, Array],
      default: null,
    },
    redirectRoute: {
      type: [String, Array],
      default: "",
    },
    resourceIdName: {
      type: [String, Array],
      default: "id",
    },
    resources: {
      type: Array,
      default: null,
    },
    subscriptions: {
      type: [Object, Array],
      default: () => ({}),
    },
    page: {
      type: [String, Array],
      default: null,
    },
  },

  provide() {
    let can = null;
    let canProps = null;

    if (!Array.isArray(this.page)) {
      can = this.can;
    } else {
      canProps = this.page.map((pageName) => {
        const primaryKeyIndex = pageName.indexOf("_primary");

        pageName =
          primaryKeyIndex > 0
            ? pageName.substring(0, primaryKeyIndex)
            : pageName;

        return {
          page: pageName,
          isPrimary: primaryKeyIndex > 0,
          can: (permission) => {
            return this.can(permission, pageName);
          },
        };
      });
    }

    if (this.name) {
      if (!Array.isArray(this.name)) {
        const crudProps = createCrudProps({
          filter: this.filter,
          filterRoute: this.filterRoute,
          create: this.create,
          createRoute: this.createRoute,
          edit: this.edit,
          editRoute: this.editRoute,
          editRouteIdName: this.editRouteIdName,
          redirectRoute: this.redirectRoute,
          resourceName: this.name,
          resourceIdName: this.resourceIdName,
          router: this.$router,
          store: this.$store,
        });

        return {
          apiUrl: this.apiUrl,
          ...crudProps,
          can,
          canProps,
        };
      }

      return {
        resourceProps: this.name.map((resourceName, index) => {
          const editRouteIdName = Array.isArray(this.editRouteIdName)
            ? this.editRouteIdName[index]
            : this.editRouteIdName;

          const resourceIdName = Array.isArray(this.resourceIdName)
            ? this.resourceIdName[index]
            : this.resourceIdName;

          const can = (permission) => this.can(permission, this.page[index]);

          const crudProps = createCrudProps({
            filterRoute: this.filterRoute[index],
            createRoute: this.createRoute[index],
            editRoute: this.editRoute[index],
            editRouteIdName,
            redirectRoute: this.redirectRoute[index],
            resourceName,
            resourceIdName,
            router: this.$router,
            store: this.$store,
          });

          return {
            apiUrl: this.apiUrl,
            can,
            ...crudProps,
          };
        }),
        can,
        canProps,
      };
    }

    if (this.resources) {
      const resources = {};

      this.resources.forEach((resource) => {
        resources[resource.name] = {
          apiUrl: this.apiUrl,
          can,
          ...createCrudProps({
            createRoute: resource.createRoute,
            editRoute: resource.editRoute,
            editRouteIdName: resource.resourceIdName ?? "id",
            filterRoute: resource.filterRoute,
            redirectRoute: resource.redirectRoute,
            resourceName: resource.name,
            resourceIdName: resource.resourceIdName ?? "id",
            router: this.$router,
            store: this.$store,
          }),
        };
      });

      return {
        resources,
        can,
        canProps,
      };
    }
  },

  created() {
    if (this.name) {
      if (!Array.isArray(this.name)) {
        this.createStoreModule({
          apiUrl: this.apiUrl,
          resourceName: this.name,
          resourceIdName: this.resourceIdName,
          subscriptions: this.subscriptions,
        });

        return;
      }

      this.name.forEach((resourceName, index) => {
        const resourceIdName = Array.isArray(this.resourceIdName)
          ? this.resourceIdName[index]
          : this.resourceIdName;

        this.createStoreModule({
          apiUrl: this.apiUrl,
          resourceName,
          resourceIdName,
          subscriptions: this.subscriptions[index],
        });
      });

      return;
    }

    if (this.resources) {
      this.resources.forEach((resource) => {
        this.createStoreModule({
          apiUrl: this.apiUrl,
          resourceName: resource.name,
          resourceIdName: resource.resourceIdName ?? "id",
          subscriptions: resource.subscriptions,
        });
      });
    }
  },

  methods: {
    createStoreModule({ apiUrl, resourceName, resourceIdName, subscriptions }) {
      if (!this.storeHasModule(resourceName)) {
        createCrudModule({
          apiUrl,
          client: this.axios,
          resourceName,
          resourceIdName,
          store: this.$store,
          ...this.createDefaultSubscriptions(),
          ...subscriptions,
        });
      }
    },

    storeHasModule(moduleName) {
      return Object.keys(this.$store.getters).some((key) => {
        const existedModule = key.split("/")[0];
        return moduleName == existedModule;
      });
    },

    createDefaultSubscriptions() {
      return {
        onCreateSuccess: (state, response) => {
          if (!this._.get(response, "data.message")) {
            this.$notification.success({ message: "Item Created" });
            return;
          }

          this.$notification.success({ message: response.data.message });
        },
        onCreateError: (state, err) => this.displayErrorNotification(err),

        onFetchListError: (state, err) => this.displayErrorNotification(err),

        onFetchSingleError: (state, err) => {
          this.$router.push(this.redirectRoute);
          this.displayErrorNotification(err);
        },

        onReplaceSuccess: () =>
          this.$notification.success({ message: "Item Updated" }),
        onReplaceError: (state, err) => this.displayErrorNotification(err),

        onUpdateSuccess: () =>
          this.$notification.success({ message: "Item Updated" }),
        onUpdateError: (state, err) => this.displayErrorNotification(err),

        onDestroySuccess: () =>
          this.$notification.success({ message: "Item Deleted" }),
        onDestroyError: (state, err) => this.displayErrorNotification(err),
      };
    },

    displayErrorNotification(err) {
      if (!err || !err.response) {
        this.$notification.error({ message: "Errors encountered." });
        return;
      }

      const { status } = err.response;

      if (status == "401") {
        this.$notification.error({
          message: "You don't have permissions to perform this action.",
        });

        return;
      }

      if (status == "409") {
        this.$notification.warning({
          message: "Importing...",
        });

        return;
      }

      const requestCorrelationId =
        err.response.headers["request-correlation-id"];

      if (requestCorrelationId) {
        const h = this.$createElement;

        const message =
          this._.get(err, "response.data.message") ||
          h("div", [
            h(
              "div",
              "Something went wrong. Please provide Silicon Stack support staff with the following request id:"
            ),
            h("div", [h("b", `${requestCorrelationId}`)]),
          ]);

        const style = this._.get(err, "response.data.message")
          ? undefined
          : { marginLeft: `${375 - 450}px`, width: "450px" };

        this.$notification.error({ message, style });

        return;
      }

      this.$notification.error({ message: "Errors encountered." });
    },

    can(permission, page = this.page) {
      if (!this.page) return true;

      return this.$can(permission, page);
    },
  },

  render(createElement) {
    const children = [];

    if (this.list) {
      children.push(createElement(this.list));
    }

    if (this.filter) {
      children.push(createElement(this.filter));
    }

    if (this.create) {
      children.push(createElement(this.create));
    }

    if (this.edit) {
      children.push(createElement(this.edit));
    }

    if (this.$slots.default) {
      children.push(this.$slots.default);
    }

    return createElement("div", children);
  },
};
</script>
