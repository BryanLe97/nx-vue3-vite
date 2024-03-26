import queryString from "query-string";

import {
  fetchList,
  getList,
  getPagination,
  setPagination,
  getSorter,
  getSorterQuery,
  setSorter,
  getIsAdvancedFiltered,
  setIsAdvancedFiltered,
  getFilters,
  getFilter,
  getFilterQuery,
  setFilter,
  deleteFilter,
  clearFilters,
  destroyEntity,
  clearList,
  deletePagination,
  setQueryString,
  deleteQueryStrings,
  deleteQueryString,
  getQueryStrings,
  getQueryString,
} from "./common.utils";

/**
 * List View Utils - A function used to create utilities
 *
 * @param {String} resourceName   The name of the resource
 * @param {Object} store          The global Vuex store variable
 *
 * @return {Object} A set of functions to be used in an Edit form.
 */
export default ({ resourceName, store, router }) => {
  return {
    /**
     * fetchList - Fetches a set of 'resourceName' using the Vuex Crud getters
     *
     * @return {Array} An array of 'resourceName' elements
     */
    fetchList(
      customUrl,
      refresh = true,
      appendQuery = true,
      customQuery,
      onlyCustomQuery = false
    ) {
      const pagination = queryString.stringify(this.getPagination());
      // const queryParams = this.getQueryParams();
      const sort = this.getSorterQuery();
      const filter = this.getFilterQuery();
      
      let query = "";

      const queryStrings = this.getQueryStrings();

      const _customQuery =
        customQuery && typeof customQuery == "object"
          ? queryString.stringify(customQuery)
          : customQuery;

      if (pagination || sort || filter || queryStrings) {
        query =
          "?" +
          pagination +
          (sort ? `&${sort}` : "") +
          (filter ? `&${filter}` : "") +
          (_customQuery ? `&${_customQuery}` : "") +
          (queryStrings ? `&${queryStrings}` : "");
      }

      if (onlyCustomQuery) {
        query =
          "?" +
          (customQuery ? `${customQuery}` : "") +
          (filter ? `&${filter}` : "");
      }

      query = query.replace("?&", "?");

      let url = null;

      if (customUrl) {
        url = customUrl;

        if (appendQuery) {
          url += query;
        }
      }

      return fetchList({
        resourceName,
        store,
        customUrl: url,
        query,
        refresh,
      });
    },

    /**
     * getList - Gets a set of 'resourceName' elements from the store
     *
     * @return {Array} An array of 'resourceName' elements
     */
    getList() {
      return getList({ resourceName, store });
    },

    /**
     * getPagination - Gets pagination for 'resourceName' elements from the store
     *
     * @return {Object} A pagination object of 'resourceName' elements
     */
    getPagination() {
      return getPagination({ resourceName, store });
    },

    /**
     * setPagination - Sets pagination for 'resourceName' elements from the store
     */
    setPagination(newOptions) {
      const options = { ...this.getPagination(), ...newOptions };
      setPagination({ resourceName, store, options });
    },

    /**
     * getSorter - Gets sorting options for 'resourceName' elements from the store
     *
     * @return {String} A sorter of 'resourceName' elements
     */
    getSorter() {
      return getSorter({ resourceName, store });
    },

    /**
     * getSorterQuery - Gets sorting query string for 'resourceName' elements from the store
     *
     * @return {String} A sorter query string for 'resourceName' elements
     */
    getSorterQuery() {
      return getSorterQuery({ resourceName, store });
    },

    /**
     * setSorter - Sets sorting options for 'resourceName' elements from the store
     */
    setSorter(options) {
      setSorter({ resourceName, store, options });
    },

    /**
     * getIsAdvancedFiltered - Get a boolean value indicating that advanced filter is
     * applied or not
     *
     * @return {Boolean} A boolean value indicating that advanced filter is
     * applied or not
     */
    getIsAdvancedFiltered() {
      return getIsAdvancedFiltered({ resourceName, store });
    },

    /**
     * getFilters - Gets filter map for 'resourceName' elements from the store
     *
     * @return {Map<Array, Object>} A filter Map object for 'resourceName' elements
     */
    getFilters() {
      return getFilters({ resourceName, store });
    },

    /**
     * getFilter - Gets filter map item with specified key for 'resourceName' elements from the store
     *
     * @return {Object} A filter value object for 'resourceName' elements
     */
    getFilter(key) {
      return getFilter({ resourceName, store, key });
    },

    /**
     * getFilterQuery - Gets filter query string for 'resourceName' elements from the store
     *
     * @return {String} A filter query string for 'resourceName' elements
     */
    getFilterQuery() {
      return getFilterQuery({ resourceName, store });
    },

    /**
     * setIsAdvancedFiltered - Sets a boolean value indicating that advanced filter is
     * applied or not
     */
    setIsAdvancedFiltered(value) {
      setIsAdvancedFiltered({ resourceName, store, value });
    },

    /**
     * setFilter - Sets filter option for 'resourceName' elements from the store
     */
    setFilter(key, value) {
      setFilter({ resourceName, store, key, value });
    },

    /**
     * deleteFilter - Remove filter option for 'resourceName' elements from the store
     */
    deleteFilter(key) {
      deleteFilter({ resourceName, store, key });
    },

    /**
     * clearFilter - Remove all filter options for 'resourceName' elements from the store
     */
    clearFilters() {
      clearFilters({ resourceName, store });
    },

    /**
     * setQueryString - Sets query string for 'resourceName' elements from the store
     */
    setQueryString(key, value) {
      setQueryString({ resourceName, store, key, value });
    },

    /**
     * getQueryStrings - Gets query string for 'resourceName' elements from the store
     *
     * @return {String} query strings for 'resourceName' elements
     */
    getQueryStrings() {
      return getQueryStrings({ resourceName, store });
    },

    /**
     * getQueryString - Gets query string for 'resourceName' elements from the store
     *
     * @return {String} query strings for 'resourceName' elements
     */
    getQueryString(key) {
      return getQueryString({ resourceName, store, key });
    },

    /**
     * deleteQueryStrings - Remove query strings for 'resourceName' elements from the store
     */
    deleteQueryStrings() {
      deleteQueryStrings({ resourceName, store });
    },

    /**
     * deleteQueryStrings - Remove query strings for 'resourceName' elements from the store
     */
    deleteQueryString(key) {
      deleteQueryString({ resourceName, store, key });
    },

    destroyEntity(customUrl, id) {
      return destroyEntity({
        resourceName,
        router,
        store,
        customUrl,
        id,
      });
    },

    clearList() {
      clearList({ store, resourceName });
    },

    /**
     * deletePagination - Remove all pagination options for 'resourceName' elements from the store
     */
    deletePagination() {
      deletePagination({ resourceName, store });
    },
  };
};
