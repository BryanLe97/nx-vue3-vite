import queryString from "query-string";
import _ from "lodash";

import { FILTERS_EQUAL } from "@/constants/filters.operators";

const initialFilters = () =>
  new Map([["IsInactive", { operator: FILTERS_EQUAL, value: "false" }]]);

export const Types = {
  FILTERS_SET_IS_ADVANCED_FILTERED: "FILTERS_SET_IS_ADVANCED_FILTERED",
  FILTERS_SET: "FILTERS_SET",
  QUERY_STRING_SET: "QUERY_STRING_SET",
  FILTERS_DELETE: "FILTERS_DELETE",
  FILTERS_DELETE_ONE: "FILTERS_DELETE_ONE",
  QUERY_STRING_DELETE: "QUERY_STRING_DELETE",
  QUERY_STRING_KEY_DELETE: "QUERY_STRING_KEY_DELETE",
  FILTERS_GET: "FILTERS_GET",
  FILTERS_GET_IS_ADVANCED_FILTERED: "FILTERS_GET_IS_ADVANCED_FILTERED",
  FILTERS_GET_ONE: "FILTERS_GET_ONE",
  FILTERS_GET_QUERY: "FILTERS_GET_QUERY",
  QUERY_STRING_GET: "QUERY_STRING_GET",
  QUERY_STRING_KEY_GET: "QUERY_STRING_KEY_GET",
};

export default () => ({
  state: {
    /**
     * A map of filters with key as the columns to filter and value as the
     * filter operator and value to apply
     *
     * @type {Map<String, Object>}
     */
    filters: initialFilters(),
    queryStrings: {},
    isAdvancedFiltered: false,
  },
  mutations: {
    [Types.FILTERS_SET_IS_ADVANCED_FILTERED](state, payload) {
      state.isAdvancedFiltered = payload;
    },

    [Types.FILTERS_SET](state, { key, value }) {
      const { filters } = state;

      filters.set(key, value);
      state.filters = new Map(filters);
    },

    [Types.FILTERS_DELETE](state) {
      state.filters = initialFilters();
      state.isAdvancedFiltered = false;
    },

    [Types.FILTERS_DELETE_ONE](state, { key }) {
      const { filters } = state;

      filters.delete(key);
      state.filters = new Map(filters);
    },

    [Types.QUERY_STRING_SET](state, { key, value }) {
      const { queryStrings } = state;

      state.queryStrings = {
        ...queryStrings,
        [key]: value,
      };
    },

    [Types.QUERY_STRING_DELETE](state) {
      state.queryStrings = {};
    },

    [Types.QUERY_STRING_KEY_DELETE](state, { key }) {
      state.queryStrings = _.omit(state.queryStrings, key);
    },
  },
  getters: {
    [Types.FILTERS_GET](state) {
      return state.filters;
    },

    [Types.FILTERS_GET_IS_ADVANCED_FILTERED](state) {
      return state.isAdvancedFiltered;
    },

    [Types.FILTERS_GET_ONE](state) {
      return (key) => state.filters.get(key);
    },

    /**
     * Querystring conforming to ZIN filter language 🤣
     */
    [Types.FILTERS_GET_QUERY](state) {
      if (!state.filters.size) {
        return "";
      }

      const andClauses = [];

      state.filters.forEach((val, keys) => {
        if (!val.value) return;

        if (keys.includes(",")) {
          const orClauses = keys
            .split(",")
            .map(
              (key) =>
                `(${key} ${val.operator} ${"`" +
                  encodeURIComponent(val.value) +
                  "`"})`
            );

          andClauses.push(`(${orClauses.join("or")})`);

          return;
        }

        if (
          typeof val.value == "string" &&
          val.value.includes(",") &&
          !Array.isArray(val.operator)
        ) {
          const { operator, value } = val;

          const orClauses = value
            .split(",")
            .map(
              (value) =>
                `(${keys} ${operator} ${"`" + encodeURIComponent(value) + "`"})`
            );

          andClauses.push(`(${orClauses.join("or")})`);

          return;
        }
        if (
          typeof val.value == "string" &&
          val.value.includes(",") &&
          Array.isArray(val.operator)
        ) {
          const { operator, value } = val;

          const orClauses = value
            .split(",")
            .map(
              (value, index) =>
                `(${keys} ${operator[index]} ${"`" +
                  encodeURIComponent(value) +
                  "`"})`
            );

          andClauses.push(`(${orClauses.join("and")})`);

          return;
        }

        andClauses.push(
          `(${keys} ${val.operator} ${"`" +
            encodeURIComponent(val.value) +
            "`"})`
        );
      });

      if (!andClauses.length) return "";

      return `fe=(${andClauses.join("and")})`;
    },

    [Types.QUERY_STRING_GET](state) {
      const { queryStrings } = state;
      return queryString.stringify(queryStrings);
    },

    [Types.QUERY_STRING_KEY_GET](state) {
      return (key) => {
        const value = state.queryStrings[key];

        return value !== undefined
          ? {
              key,
              value: typeof value === "boolean" ? value.toString() : value,
            }
          : undefined;
      };
    },
  },
});
