import createActions from "./actions";
import createGetters from "./getters";
import createMutations from "./mutations";
import createState from "./state";
import Types from "./types";

/**
 * Create Auth Module - Given a set of data, creates a vuex auth module and
 * calls the store to get it registered.
 *
 * @param {Function}  client            An http client
 * @param {String}    moduleName        The name of the auth module
 * @param {Object}    store             The global Vuex store variable
 */
export default ({ client }) => {
  const types = Types;

  return {
    namespaced: true,
    state: createState(),
    actions: createActions({ client, types }),
    mutations: createMutations({ types }),
    getters: createGetters({ types }),
  };
};

export { Types };
