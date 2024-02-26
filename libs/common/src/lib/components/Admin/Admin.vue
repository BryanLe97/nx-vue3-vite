<template>
  <div class="admin">
    <a-spin v-if="!isAuthenticated" class="admin__spinner" size="large" tip="Loading..." />
    <component :is="appLayout" v-else />
  </div>
</template>

<script>
import { AbilityBuilder } from "@casl/ability";

import createAuthModule, { Types as AuthTypes } from "@/store/modules/auth";
import entitiesModule, { Types as EntityTypes } from "@/store/modules/entities";
import requestsModule, {
  Types as RequestsTypes,
} from "@/store/modules/requests";

export default {
  name: "Admin",

  props: {
    appLayout: {
      type: Object,
      required: true,
    },
    authProvider: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      isCheckingAuth: false,
    };
  },

  computed: {
    isAuthenticated() {
      const { namespace, AUTH_IS_AUTHENTICATED } = AuthTypes;
      return this.$store.getters[`${namespace}/${AUTH_IS_AUTHENTICATED}`];
    },
  },

  created() {
    const authModule = createAuthModule({ client: this.authProvider });
    const { namespace: authNamespace } = AuthTypes;
    const { namespace: entityNamespace } = EntityTypes;
    const { namespace: requestsNamespace } = RequestsTypes;

    this.$store.registerModule(authNamespace, authModule);
    this.$store.registerModule(entityNamespace, entitiesModule);
    this.$store.registerModule(requestsNamespace, requestsModule);
  },

  async mounted() {
    try {
      await this.performAuth();
    } catch (error) {
      await this.login();
      this.performAuth();
    }
  },

  methods: {
    async login() {
      const { namespace, AUTH_LOGIN_REQUEST } = AuthTypes;
      await this.$store.dispatch(`${namespace}/${AUTH_LOGIN_REQUEST}`);
    },

    async performAuth(getOperationQuery = {}) {
      this.isCheckingAuth = true;

      const {
        namespace,
        AUTH_CHECK_REQUEST,
        AUTH_GET_OPERATION_REQUEST,
        AUTH_SET_IS_AUTHENTICATED,
      } = AuthTypes;

      try {
        await this.$store.dispatch(`${namespace}/${AUTH_CHECK_REQUEST}`);

        const operations = await this.$store.dispatch(
          `${namespace}/${AUTH_GET_OPERATION_REQUEST}`,
          getOperationQuery
        );

        this.$ability.update(this.defineRules(operations));
        this.$store.commit(`${namespace}/${AUTH_SET_IS_AUTHENTICATED}`, true);
      } finally {
        this.isCheckingAuth = false;
      }
    },

    defineRules(operations) {
      const { can, rules } = new AbilityBuilder();

      Object.entries(operations).forEach(([subject, actions]) =>
        can(actions, subject)
      );

      return rules;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin {
  height: 100vh;
}

.admin__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
