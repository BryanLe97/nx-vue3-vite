import Vue from "vue";

import {
  APP_CONTAINER_FILLING,
  APP_GROWER,
  ENTITY_LEVEL_FACILITY,
  APP_WEB_ANALYTICS,
  ENTITY_LEVEL_COUNTRY,
  APP_FAS,
  ENTITY_LEVEL_COMPANY,
} from "@/constants";

const ApplicationContexts = {
  install(Vue, options = {}) {
    const { apiUrl, contextHeader } = options;

    const fetchApplicationContexts = async ({
      app,
      entityLevel,
      entityLevelCode,
    }) => {
      const { data } = await Vue.axios.get(
        `${apiUrl}/identities/applications/contexts`,
        {
          params: { app, entityLevel, entityLevelCode },
        }
      );

      return data;
    };

    Vue.prototype.$context = {
      removeContext() {
        this.setAppContext(null);
      },

      setAppContext(entityId) {
        if (entityId !== null && typeof entityId !== "undefined") {
          Vue.axios.defaults.headers.common[contextHeader] = entityId;
          return;
        }

        delete Vue.axios.defaults.headers.common[contextHeader];
      },

      async setContainerFillingContext(facilityCode) {
        const appContexts = await fetchApplicationContexts({
          app: APP_CONTAINER_FILLING,
          entityLevel: ENTITY_LEVEL_FACILITY,
          entityLevelCode: facilityCode,
        });

        if (!appContexts.length) {
          this.setAppContext(null);
          return;
        }

        const { entityId } = appContexts[0];
        this.setAppContext(entityId);
      },

      async setWebAnalyticsContext() {
        const appContexts = await fetchApplicationContexts({
          app: APP_WEB_ANALYTICS,
          entityLevel: ENTITY_LEVEL_COUNTRY,
        });

        if (!appContexts.length) {
          this.setAppContext(null);
          return;
        }

        sessionStorage.setItem("waEntityContext", JSON.stringify(appContexts));
      },

      async setGrowerContext() {
        const appContexts = await fetchApplicationContexts({
          app: APP_GROWER,
          entityLevel: ENTITY_LEVEL_FACILITY,
          entityLevelCode: "pk",
        });

        if (!appContexts.length) {
          this.setAppContext(null);
          return;
        }

        const { entityId } = appContexts[0];
        this.setAppContext(entityId);
      },

      setSteriSpecsContext() {
        this.setAppContext("1011");
      },

      async setFasContext() {
        const appContexts = await fetchApplicationContexts({
          app: APP_FAS,
          entityLevel: ENTITY_LEVEL_COMPANY,
        });

        if (!appContexts.length) {
          this.setAppContext(null);
          return;
        }

        const { entityId } = appContexts[0];
        this.setAppContext(entityId);
      },
    };
  },
};

Vue.use(ApplicationContexts, {
  apiUrl: import.meta.env.VITE_API_URL,
  contextHeader: "entity-context",
});
