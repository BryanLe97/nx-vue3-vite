import {
  FilterTypes,
  PaginationTypes,
  SorterTypes,
} from "@/store/modules/crud";
import { Types as EntitiesTypes } from "@/store/modules/entities";

/**
 * fetchList - Given a resource name, calls the store to dispatch a get request
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {String} payload      The query string passed to API to get data
 *
 * @return {Promise<Array>} A promise containing 'resourceName' list
 * from the Vuex Crud store
 */
export const fetchList = ({
  resourceName,
  store,
  customUrl,
  query,
  refresh,
}) => {
  const moduleName = `${resourceName}/fetchList`;
  let payload;

  if (customUrl) {
    payload = { customUrl, refresh };
  } else {
    payload = { customUrlFnArgs: query, refresh };
  }

  return store.dispatch(moduleName, payload);
};

/**
 * getList - Given a resource name, calls the store to get the current
 * list of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Array} A 'resourceName' list from the Vuex Crud store
 */
export const getList = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/list`;
  return store.getters[moduleName];
};

/**
 * getPagination - Given a resource name, calls the store to get the current
 * pagination of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Object} A pagination object for resourceName' list from the Vuex Crud store
 */
export const getPagination = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${PaginationTypes.PAGINATION_GET}`;
  return store.getters[moduleName];
};

/**
 * setPagination - Given a resource name, calls the store to set the current
 * pagination of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {Object} options      New pagination configuration object
 */
export const setPagination = ({ resourceName, store, options }) => {
  const moduleName = `${resourceName}/${PaginationTypes.PAGINATION_SET}`;
  store.commit(moduleName, options);
};

/**
 * getSorter - Given a resource name, calls the store to get the current
 * sorter of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Object} A sorter object for 'resourceName' list from the Vuex Crud store
 */
export const getSorter = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${SorterTypes.SORTER_GET}`;
  return store.getters[moduleName];
};

/**
 * getSorterQuery - Given a resource name, calls the store to get the current
 * sorter query string of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {String} A sorter query string for 'resourceName' list from the Vuex Crud store
 */
export const getSorterQuery = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${SorterTypes.SORTER_GET_QUERY}`;
  return store.getters[moduleName];
};

/**
 * setSorter - Given a resource name, calls the store to set the current
 * sorter of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {Object} options      New sorter configuration object
 */
export const setSorter = ({ resourceName, store, options }) => {
  const moduleName = `${resourceName}/${SorterTypes.SORTER_SET}`;
  store.commit(moduleName, options);
};

/**
 * getFilters - Given a resource name, calls the store to get the current
 * filters of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Object} A filter Map object for 'resourceName' list from the Vuex Crud store
 */
export const getFilters = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_GET}`;
  return store.getters[moduleName];
};

/**
 * getQueryStrings - Given a resource name, calls the store to get the current
 * query strings of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Object} A filter Map object for 'resourceName' list from the Vuex Crud store
 */
export const getQueryStrings = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.QUERY_STRING_GET}`;
  return store.getters[moduleName];
};

/**
 * getQueryString - Given a resource name, calls the store to get the current
 * query strings of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Object} A filter Map object for 'resourceName' list from the Vuex Crud store
 */
export const getQueryString = ({ resourceName, store, key }) => {
  const moduleName = `${resourceName}/${FilterTypes.QUERY_STRING_KEY_GET}`;
  return store.getters[moduleName](key);
};

/**
 * getFilter - Given a resource name, calls the store to get one the current
 * filters of 'resourceName' elements
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {Object} payload      The filter key, which is an arrays of column name
 *
 * @return {Object} A filter Map item object for key from the Vuex Crud store
 */
export const getFilter = ({ resourceName, store, key }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_GET_ONE}`;
  return store.getters[moduleName](key);
};

/**
 * getFilterQuery - Given a resource name, calls the store to get the current
 * filters query string
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {String} A query string passed to API to get data
 */
export const getFilterQuery = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_GET_QUERY}`;
  return store.getters[moduleName];
};

/**
 * getIsAdvancedFiltered - Given a resource name, calls the store to get the current
 * state of applying advanced filters
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 *
 * @return {Boolean} A query string passed to API to get data
 */
export const getIsAdvancedFiltered = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_GET_IS_ADVANCED_FILTERED}`;
  return store.getters[moduleName];
};

/**
 * setFilter - Given a resource name, calls the store to set the one the filter item
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {String} key          The filter key, which is string of column name
 * separated by commas
 * @param {Object} value        An object contains operator and value to filter
 */
export const setFilter = ({ resourceName, store, key, value }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_SET}`;
  return store.commit(moduleName, { key, value });
};

/**
 * setQueryString - Given a resource name, calls the store to set the one the query string item
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {String} key          The filter key, which is string of column name
 * separated by commas
 * @param {Object} value        An object contains operator and value to filter
 */
export const setQueryString = ({ resourceName, store, key, value }) => {
  const moduleName = `${resourceName}/${FilterTypes.QUERY_STRING_SET}`;
  return store.commit(moduleName, { key, value });
};

/**
 * setIsAdvancedFiltered - Given a resource name, calls the store to set the one the filter item
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {Boolean} key         A boolean value indicating that advanced filter is
 * applied or not
 */
export const setIsAdvancedFiltered = ({ resourceName, store, value }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_SET_IS_ADVANCED_FILTERED}`;
  return store.commit(moduleName, value);
};

/**
 * deleteFilter - Given a resource name, calls the store to delete the current
 * filters
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 * @param {String} key          The filter key to delete
 */
export const deleteFilter = ({ resourceName, store, key }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_DELETE_ONE}`;
  return store.commit(moduleName, { key });
};

/**
 * deleteFilter - Given a resource name, calls the store to delete the current
 * filters
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 */
export const clearFilters = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.FILTERS_DELETE}`;
  return store.commit(moduleName);
};

/**
 * deleteQueryStrings - Given a resource name, calls the store to delete the current query strings
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 */
export const deleteQueryStrings = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${FilterTypes.QUERY_STRING_DELETE}`;
  return store.commit(moduleName);
};

/**
 * deleteQueryString - Given a resource name, calls the store to delete the current query string
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 */
export const deleteQueryString = ({ resourceName, store, key }) => {
  const moduleName = `${resourceName}/${FilterTypes.QUERY_STRING_KEY_DELETE}`;
  return store.commit(moduleName, { key });
};

/**
 * initEntity - Calls the store to init the 'resourceName' entity.
 *
 * @param {Object} store        The global Vuex store variable
 * @param {String} resourceName The name of the resource
 * @param {String} formType     The form type in the entities state (createForm, editForm)
 */

export const initEntity = ({ store, resourceName, formType }) => {
  const { namespace, ENTITIES_CREATE_FORM } = EntitiesTypes;
  const moduleName = `${namespace}/${ENTITIES_CREATE_FORM}`;
  const entity = resourceName;

  store.commit(moduleName, { formType, entity });
};

/**
 * fetchEntity - Given a resource name, calls the store to dispatch a single get
 * request
 *
 * @param {String} resourceName   The name of the resource
 * @param {Object} store          The global Vuex store variable
 * @param {Object} router         The global Vue router variable
 *
 * @return {Object} The fetched entity.
 */
export const fetchEntity = ({
  resourceName,
  store,
  router,
  customUrl,
  editRouteIdName,
}) => {
  const id = router.history.current.params[editRouteIdName];
  const moduleName = `${resourceName}/fetchSingle`;

  return store.dispatch(moduleName, { id, customUrl });
};

/**
 * getEntity - Given a resource name, calls the store to get a single element.
 *
 * @param {String} resourceName   The name of the resource
 * @param {Number} id             The id of the resource entity
 * @param {Object} store          The global Vuex store variable
 * @param {Object} router         The global Vue router variable
 *
 * @return {Object} A 'resourceName' entity.
 */
export const getEntity = ({
  resourceName,
  id,
  store,
  router,
  editRouteIdName,
}) => {
  const _id =
    id !== null && id !== undefined
      ? id
      : router.history.current.params[editRouteIdName];
  const moduleName = `${resourceName}/byId`;

  return store.getters[moduleName](_id);
};

/**
 * setEntity - Given a resource name, calls the store to set a single element.
 *
 * @param {String} resourceName   The name of the resource
 * @param {Number} entity         The entity to put into the store
 * @param {Object} store          The global Vuex store variable
 */
export const setEntity = ({ resourceName, entity, store }) => {
  const moduleName = `${resourceName}/setEntity`;
  store.commit(moduleName, entity);
};

/**
 * clearList - Given a resource name, calls the store to delete the current list.
 *
 * @param {String} resourceName   The name of the resource
 * @param {Object} store          The global Vuex store variable
 */
export const clearList = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/clearList`;
  store.commit(moduleName);
};

/**
 * getEntityForm - Given a resource name and a form type, calls the store to get the
 * current 'resourceName' entity. The value does not exist until a user inputs
 * data using 'updateEntity'.
 *
 * @param {String} resourceName   The name of the resource
 * @param {String} formType       The form type in the entities state (createForm, editForm)
 * @param {Object} store          The global Vuex store variable
 *
 * @return {Object} a 'resourceName' object with updated data from the form.
 */
export const getEntityForm = ({ resourceName, formType, store }) => {
  const form = store.state.entities[formType] || {};
  return form[resourceName];
};

/**
 * clearEntity - Given a key, calls the store to clear the
 * entity.
 *
 * @param {Object} store        The global Vuex store variable
 * @param {String} resourceName The name of the resource
 * @param {String} formType     The form type in the entities state (createForm, editForm)
 */
export const clearEntity = ({ resourceName, formType, store }) => {
  const { namespace, ENTITIES_CLEAR_FORM } = EntitiesTypes;
  const moduleName = `${namespace}/${ENTITIES_CLEAR_FORM}`;
  const entity = resourceName;

  store.commit(moduleName, { formType, entity });
};

/**
 * updateEntity - Given a key and a value, calls the store to update the
 * 'resourceName' entity.
 *
 * @param {String} resourceKey  A 'resourceName' attribute key
 * @param {String} value        A given value to be stored
 * @param {Object} store        The global Vuex store variable
 * @param {String} resourceName The name of the resource
 * @param {String} formType     The form type in the entities state (createForm, editForm)
 */
export const updateEntity = ({
  resourceKey,
  value,
  store,
  resourceName,
  formType,
}) => {
  const { namespace, ENTITIES_UPDATE_FORM } = EntitiesTypes;
  const moduleName = `${namespace}/${ENTITIES_UPDATE_FORM}`;
  const entity = resourceName;

  store.commit(moduleName, { formType, value, resourceKey, entity });
};

/**
 * submitEntity - Given an object with params, calls the store to dispatch
 * an 'actionType' request
 *
 * @param {String} resourceName      The name of the resource
 * @param {String} actionType        The type of the vuex-crud action (ex: create, update)
 * @param {Object} actionTypeParams  The vuex-crud dispatch params
 * @param {Object} store             The global Vuex store variable
 *
 * @return {Promise} A pending promise.
 */
export const submitEntity = async ({
  resourceName,
  actionType,
  actionTypeParams,
  store,
}) => {
  const moduleName = `${resourceName}/${actionType}`;
  return await store.dispatch(moduleName, actionTypeParams);
};

/**
 * submitPartialEntity - Given an object with params, calls the store to dispatch
 * an 'update' request
 *
 * @param {String} resourceName      The name of the resource
 * @param {Object} actionParams      The vuex-crud dispatch params
 * @param {Object} store             The global Vuex store variable
 *
 * @return {Promise} A pending promise.
 */
export const submitPartialEntity = ({ resourceName, actionParams, store }) => {
  const moduleName = `${resourceName}/update`;
  return store.dispatch(moduleName, actionParams);
};

/**
 * deleteEntity - Given a key and a value, calls the store to update the
 * 'resourceName' entity.
 *
 * @param {Object} store        The global Vuex store variable
 * @param {String} resourceName The name of the resource
 * @param {Number} id           ID of resource
 */
export const destroyEntity = ({ store, resourceName, customUrl, id }) => {
  const moduleName = `${resourceName}/destroy`;
  return store.dispatch(moduleName, { id, customUrl });
};

/**
 * deletePagination - Given a resource name, calls the store to delete the current
 * pagination
 *
 * @param {String} resourceName The name of the resource
 * @param {Object} store        The global Vuex store variable
 */
export const deletePagination = ({ resourceName, store }) => {
  const moduleName = `${resourceName}/${PaginationTypes.PAGINATION_DELETE}`;
  return store.commit(moduleName);
};

export const getFetchingStatus = ({ store, resourceName }) => {
  return store.state[resourceName].isFetchingList;
};
