import { once } from "lodash";

import createCrudModule from "@/store/vuex-crud/index.js";

import { Types as RequestsTypes } from "@/store/modules/requests";

import createFilterStore from "./filters";
import createPaginationStore, { Types as PaginationTypes } from "./pagination";
import createSorterStore from "./sorter";

const createLoadingInterceptor = once((client, store) => {
  const { namespace: requestsNamespace, REQUESTS_SET_LOADING } = RequestsTypes;

  const setLoading = (isLoading) => () =>
    store.commit(`${requestsNamespace}/${REQUESTS_SET_LOADING}`, { isLoading });

  // Requests Interceptors
  const successCall = (injectedLogic) => (requestOrResponse) => {
    injectedLogic();
    return requestOrResponse;
  };

  const errorCall = (injectedLogic) => (error) => {
    injectedLogic();
    return Promise.reject(error);
  };

  client.interceptors.request.use(successCall(setLoading(true)));

  client.interceptors.response.use(
    successCall(setLoading(false)),
    errorCall(setLoading(false))
  );
});

/**
 * Crud Module - Given a set of data, creates a vuex crud module and calls
 * the store to get it registered.
 *
 * @param {String}  apiUrl         The api url for a 'resourceName' resource
 * @param {Object}  client         The REST client communicating with backend
 * @param {String}  resourceName   The name of the resource
 * @param {String}  resourceIdName The name of the id property of a resource
 * @param {Object}  store          The global Vuex store variable
 */
export default ({
  apiUrl,
  client,
  resourceName,
  resourceIdName,
  store,
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
}) => {
  const parseList = (res) => {
    if (Array.isArray(res.data)) return res;
    if (!res.data.results) return { ...res, data: [res.data] };

    const { data } = res;

    store.commit(`${resourceName}/${PaginationTypes.PAGINATION_SET}`, {
      count: data.count || 0,
      page: data.page || 1,
      pageSize: data.pageSize || 10,
    });

    return {
      ...res,
      data: data.results,
    };
  };

  const filters = createFilterStore();
  const pagination = createPaginationStore();
  const sorter = createSorterStore();

  createLoadingInterceptor(client, store);

  const module = createCrudModule({
    apiUrl,
    client,
    resourceIdName,
    resourceName,

    // Custom store methods for pagination, sort and filter
    state: { ...pagination.state, ...sorter.state, ...filters.state },
    mutations: {
      ...pagination.mutations,
      ...sorter.mutations,
      ...filters.mutations,
    },
    getters: { ...pagination.getters, ...sorter.getters, ...filters.getters },

    // Store mutation callbacks
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

    // Parse response callbacks
    parseList,
  });

  store.registerModule(resourceName, module);
};
