const createActions = ({
  actions,
  client,
  customUrlFn,
  parseList,
  parseSingle,
  parseError,
}) => {
  const [FETCH_SINGLE, CREATE, REPLACE, DESTROY] = [
    "FETCH_SINGLE",
    "CREATE",
    "REPLACE",
    "DESTROY",
  ];

  const urlGetter = ({ customUrl, customUrlFnArgs, id, type }) => {
    if (typeof customUrl === "string") {
      return customUrl;
    }

    const argsArray = Array.isArray(customUrlFnArgs)
      ? customUrlFnArgs
      : [customUrlFnArgs];
    const args = [id || null, type || null].concat(argsArray);

    return customUrlFn(...args);
  };

  return {
    /**
     * GET /api/<resourceName>
     *
     * Fetch list of resources.
     */
    async fetchList(
      { commit },
      { config, customUrl, customUrlFnArgs = [], refresh } = {}
    ) {
      commit("fetchListStart");

      let url;

      if (typeof customUrl == "string") {
        url = customUrl;
      } else {
        const argsArray = Array.isArray(customUrlFnArgs)
          ? customUrlFnArgs
          : [customUrlFnArgs];

        url = customUrlFn(...argsArray);
      }

      try {
        const res = await client.get(url, config);
        const parsedResponse = parseList(res);

        commit("fetchListSuccess", { refresh, response: parsedResponse });

        return parsedResponse;
      } catch (err) {
        const parsedError = parseError(err);

        commit("fetchListError", parsedError);

        return Promise.reject(parsedError);
      }
    },

    /**
     * GET /api/<resourceName>/:id
     *
     * Fetch single resource.
     */
    fetchSingle(
      { commit },
      { id, config, customUrl, customUrlFnArgs = [] } = {}
    ) {
      commit("fetchSingleStart");

      return client
        .get(
          urlGetter({
            customUrl,
            customUrlFnArgs,
            type: FETCH_SINGLE,
            id,
          }),
          config
        )
        .then((res) => {
          const parsedResponse = parseSingle(res);

          commit("fetchSingleSuccess", parsedResponse);

          return res;
        })
        .catch((err) => {
          const parsedError = parseError(err);

          commit("fetchSingleError", parsedError);

          return Promise.reject(parsedError);
        });
    },

    /**
     * POST /api/<resourceName>
     *
     * Create a new reource.
     */
    create({ commit }, { data, config, customUrl, customUrlFnArgs = [] } = {}) {
      commit("createStart");

      return client
        .post(
          urlGetter({ customUrl, customUrlFnArgs, type: CREATE }),
          data,
          config
        )
        .then((res) => {
          const parsedResponse = parseSingle(res);

          commit("createSuccess", parsedResponse);

          return parsedResponse;
        })
        .catch((err) => {
          const parsedError = parseError(err);

          commit("createError", parsedError);

          return Promise.reject(parsedError);
        });
    },

    /**
     * PATCH /api/<resouceName>/:id
     *
     * Update a single resource.
     */
    async update(
      { commit },
      { id, data, config, customUrl, customUrlFnArgs = [] } = {}
    ) {
      commit("updateStart");

      let url;

      if (typeof customUrl == "string") {
        url = customUrl;
      } else {
        const argsArray = Array.isArray(customUrlFnArgs)
          ? customUrlFnArgs
          : [customUrlFnArgs];

        url = customUrlFn(id, ...argsArray);
      }

      try {
        const res = await client.patch(url, data, config);
        const parsedResponse = parseSingle(res);

        commit("updateSuccess", {
          response: parsedResponse,
          fieldNames: data.map((d) => d.path),
        });

        return parsedResponse;
      } catch (err) {
        const parsedError = parseError(err);

        commit("updateError", parsedError);

        return Promise.reject(parsedError);
      }
    },

    /**
     * PUT /api/<resouceName>/:id
     *
     * Update a single resource.
     */
    replace(
      { commit },
      { id, data, config, customUrl, customUrlFnArgs = [] } = {}
    ) {
      commit("replaceStart");

      return client
        .put(
          urlGetter({
            customUrl,
            customUrlFnArgs,
            type: REPLACE,
            id,
          }),
          data,
          config
        )
        .then((res) => {
          const parsedResponse = parseSingle(res);

          commit("replaceSuccess", parsedResponse);

          return parsedResponse;
        })
        .catch((err) => {
          const parsedError = parseError(err);

          commit("replaceError", parsedError);

          return Promise.reject(parsedError);
        });
    },

    /**
     * DELETE /api/<resouceName>/:id
     *
     * Destroy a single resource.
     */
    destroy({ commit }, { id, config, customUrl, customUrlFnArgs = [] } = {}) {
      commit("destroyStart");

      return client
        .delete(
          urlGetter({
            customUrl,
            customUrlFnArgs,
            type: DESTROY,
            id,
          }),
          config
        )
        .then((res) => {
          const parsedResponse = parseSingle(res);

          commit("destroySuccess", id, parsedResponse);

          return parsedResponse;
        })
        .catch((err) => {
          const parsedError = parseError(err);

          commit("destroyError", parsedError);

          return Promise.reject(parsedError);
        });
    },

    ...actions,
  };
};

export default createActions;
