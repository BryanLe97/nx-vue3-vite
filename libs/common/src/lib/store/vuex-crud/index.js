import createActions from "./actions";
import createGetters from "./getters";
import createMutations from "./mutations";
import createState from "./state";

/**
 * Creates new Vuex CRUD module.
 *
 * @param {Object} configuration
 *
 * @property {String} apiUrl The root url.
 * @property {String} resourceIdName The name of ID attribute.
 * @property {String} resourceName The name of the resource.
 *
 * @property {Object} client The client that should be used to do API requests.
 * @property {Object} state The default state (will override generated state).
 * @property {Object} getters The default getters (will override generated getters object).
 * @property {Object} mutations The default mutations (will override generated mutations object).
 * @property {Object} actions The default actions (will override generated actions object).
 *
 * @property {Function} onFetchListStart Mutation method called after collection fetch start.
 * @property {Function} onFetchListSuccess Mutation method called after collection fetch success.
 * @property {Function} onFetchListError Mutation method called after collection fetch error.
 * @property {Function} onFetchSingleStart Mutation method called after single fetch start.
 * @property {Function} onFetchSingleSuccess Mutation method called after single fetch success.
 * @property {Function} onFetchSingleError Mutation method called after single fetch error.
 * @property {Function} onCreateStart Mutation method called after create state.
 * @property {Function} onCreateSuccess Mutation method called after create success.
 * @property {Function} onCreateError Mutation method called after create error.
 * @property {Function} onUpdateStart Mutation method called after update state.
 * @property {Function} onUpdateSuccess Mutation method called after update success.
 * @property {Function} onUpdateError Mutation method called after update error.
 * @property {Function} onReplaceStart Mutation method called after replace state.
 * @property {Function} onReplaceSuccess Mutation method called after replace success.
 * @property {Function} onReplaceError Mutation method called after replace error.
 * @property {Function} onDestroyStart Mutation method called after destroy state.
 * @property {Function} onDestroySuccess Mutation method called after destroy success.
 * @property {Function} onDestroyError Mutation method called after destroy error.
 * @property {Function} parseList A method used to parse list of resources.
 * @property {Function} parseSingle A method used to parse singe resource.
 * @property {Function} parseError A method used to parse error responses.
 *
 * @return {Object} A Vuex module.
 */
const createVuexCrud = ({
  apiUrl,
  resourceIdName = "id",
  resourceName,

  client,
  state = {},
  getters = {},
  mutations = {},
  actions = {},

  onFetchListStart = () => {},
  onFetchListSuccess = () => {},
  onFetchListError = () => {},
  onFetchSingleStart = () => {},
  onFetchSingleSuccess = () => {},
  onFetchSingleError = () => {},
  onCreateStart = () => {},
  onCreateSuccess = () => {},
  onCreateError = () => {},
  onUpdateStart = () => {},
  onUpdateSuccess = () => {},
  onUpdateError = () => {},
  onReplaceStart = () => {},
  onReplaceSuccess = () => {},
  onReplaceError = () => {},
  onDestroyStart = () => {},
  onDestroySuccess = () => {},
  onDestroyError = () => {},
  parseList = (res) => res,
  parseSingle = (res) => res,
  parseError = (res) => res,
} = {}) => {
  if (!resourceName) {
    throw new Error("Resource name must be specified");
  }

  const customUrlFn = (id, type, query) => {
    /**
     * If store module name has "." character, convert it to "/".
     * Because resource URLs have a structure of "[system]/[resource]", store module
     * will be named "[system].[resource]" instead of "[system]/[resource]"
     * for easier management.
     */
    const resourceUrl = resourceName.includes(".")
      ? resourceName.split(".").join("/")
      : resourceName;

    const rootUrl = `${apiUrl}/${resourceUrl}`;

    return id ? `${rootUrl}/${id}` : `${rootUrl}${query || ""}`;
  };

  return {
    namespaced: true,

    state: createState({ state }),

    getters: createGetters({ getters }),

    mutations: createMutations({
      mutations,
      resourceIdName,
      onFetchListStart,
      onFetchListSuccess,
      onFetchListError,
      onFetchSingleStart,
      onFetchSingleSuccess,
      onFetchSingleError,
      onCreateStart,
      onCreateSuccess,
      onCreateError,
      onUpdateStart,
      onUpdateSuccess,
      onUpdateError,
      onReplaceStart,
      onReplaceSuccess,
      onReplaceError,
      onDestroyStart,
      onDestroySuccess,
      onDestroyError,
    }),

    actions: createActions({
      actions,
      client,
      customUrlFn,
      parseList,
      parseSingle,
      parseError,
    }),
  };
};

export default createVuexCrud;
