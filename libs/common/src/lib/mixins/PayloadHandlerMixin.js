import isNil from "lodash/isNil";

import { FILTERS_EQUAL } from "@/constants";

export default {
  methods: {
    /**
     * generateFeString() returns the 'fe' query string confirming to ZIN filter language.
     * Format of the params can be:
     * params = {
     *    [key1]: {
     *        operator: [operator_value],
     *        value: [[val1, val2]]
     *    }
     * }
     * or
     * params = {
     *    [key1]: [value1],
     *    [key2]: [value2]
     * }
     */
    generateFeString(params, operator = 'and') {
      let feString = "";

      if (!params) return feString;

      let andClauses = [];

      Object.entries(params).forEach(([key, val]) => {
        if (isNil(val) || val === "") return;

        if (typeof val === "object") {
          const { operator, value } = val;

          if (Array.isArray(value)) {
            andClauses = value.map((item) =>
              `(${key + " " + operator + " `" + encodeURIComponent(item) + "`"})`
            );

          } else {
            andClauses.push(`(${key + " " + operator + " `" + encodeURIComponent(value) + "`"})`);
          }

        } else {
          // in case the 'params' contains key-value pairs only, we use the 'eq' as default operator
          andClauses.push(`(${key + " " + FILTERS_EQUAL + " `" + encodeURIComponent(val) + "`"})`);
        }
      })

      if (!andClauses || andClauses.length === 0) return "";

      return `fe=(${andClauses.join(operator)})`;
    },

    generateQueryString(parameters = {}) {
      let queries = [];

      for (const [key, value] of Object.entries(parameters)) {
        if (!isNil(value)) {
          queries.push(`${key}=${value}`);
        }
      }

      if (queries.length === 0) return "";

      return queries.join("&");
    }
  }
}
