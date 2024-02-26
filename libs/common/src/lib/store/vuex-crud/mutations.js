/**
 * Create default mutations and merge them with mutations defined by a user.
 */
const createMutations = ({
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
}) => ({
  /** FETCH LIST */

  fetchListStart(state) {
    state.isFetchingList = true;
    onFetchListStart(state);
  },

  fetchListSuccess(state, { refresh, response }) {
    const { data } = response;
    const newEntities = {};

    data.forEach((item, index) => {
      const id = item[resourceIdName];

      if (id === undefined || id === null) {
        item[resourceIdName] = index;
      }

      newEntities[item[resourceIdName].toString()] = item;
    });

    const newList = data.map((item) => item[resourceIdName].toString());

    if (refresh) {
      state.entities = newEntities;
      state.list = newList;
    } else {
      state.entities = { ...state.entities, ...newEntities };
      state.list = [...state.list, ...newList];
    }

    state.isFetchingList = false;
    state.fetchListError = null;
    onFetchListSuccess(state, response);
  },

  fetchListError(state, err) {
    state.list = [];
    state.fetchListError = err;
    state.isFetchingList = false;
    onFetchListError(state, err);
  },

  /** FETCH SINGLE */

  fetchSingleStart(state) {
    state.isFetchingSingle = true;
    onFetchSingleStart(state);
  },

  fetchSingleSuccess(state, response) {
    const { data } = response;
    const id = data[resourceIdName].toString();

    if (state.entities[id]) {
      const entity = { ...state.entities[id], ...data };

      state.entities = {
        ...state.entities,
        [id]: entity,
      };
    } else {
      state.entities = {
        ...state.entities,
        [id]: data,
      };
    }

    state.isFetchingSingle = false;
    state.fetchSingleError = null;
    onFetchSingleSuccess(state, response);
  },

  fetchSingleError(state, err) {
    state.fetchSingleError = err;
    state.isFetchingSingle = false;
    onFetchSingleError(state, err);
  },

  /** CREATE */

  createStart(state) {
    state.isCreating = true;
    onCreateStart(state);
  },

  createSuccess(state, response) {
    const { data } = response;
    const { entities } = state;

    if (data && data[resourceIdName]) {
      const id = data[resourceIdName].toString();
      const { list } = state;

      entities[id] = data;

      state.entities = entities;
      state.list = [...list, id];
    } else if (data && data.results) {
      data.results.forEach((result) => {
        const id = result[resourceIdName].toString();
        entities[id] = result;
      });

      const ids = data.results.map((result) =>
        result[resourceIdName].toString()
      );
      state.entities = entities;
      state.list = [...ids];
    }

    state.isCreating = false;
    state.createError = null;
    onCreateSuccess(state, response);
  },

  createError(state, err) {
    state.createError = err;
    state.isCreating = false;
    onCreateError(state, err);
  },

  /** UPDATE */

  updateStart(state) {
    state.isUpdating = true;
    onUpdateStart(state);
  },

  updateSuccess(state, { response, fieldNames }) {
    const { data } = response;
    const id = data && data[resourceIdName].toString();
    const { entities } = state;

    entities[id] = {
      ...entities[id],
      ...data,
    };

    /** Trigger re-rendering of list */
    const { list } = state;
    const listIndex = state.list.indexOf(id);

    if (listIndex >= 0) {
      list[listIndex] = id;
      // Refresh list
      state.list = list;
    }

    state.isUpdating = false;
    state.updateError = null;

    if (fieldNames.includes("IsInactive")) {
      /* update the pagination */
      const { count, page, pageSize } = state.pagination;
      const maxPage = Math.ceil(count / pageSize);
      const newCount = count === 0 ? count : count - 1;
      let newPage = page;

      /** case: before activating or deactivating, we have 21 items, current selected page = 3.
       * After activating / deactivating, the newPage (selected page) should be 3 - 1 = 2 */
      if (maxPage > 1 && page >= maxPage && newCount % pageSize === 0) {
        newPage = page - 1;
      }

      state.pagination = {
        count: newCount,
        page: newPage,
        pageSize,
      };
    }

    onUpdateSuccess(state, response);
  },

  updateError(state, err) {
    state.updateError = err;
    state.isUpdating = false;
    onUpdateError(state, err);
  },

  /** REPLACE */

  replaceStart(state) {
    state.isReplacing = true;
    onReplaceStart(state);
  },

  replaceSuccess(state, response) {
    const { data } = response;

    if (data && data[resourceIdName]) {
      const { entities, list } = state;
      const id = data[resourceIdName].toString();
      const entity = { ...entities[id], ...data };

      state.entities = {
        ...entities,
        [id]: entity,
      };

      /** Trigger re-rendering of list */
      state.list = [...list];
    }

    state.isReplacing = false;
    state.replaceError = null;
    onReplaceSuccess(state, response);
  },

  replaceError(state, err) {
    state.replaceError = err;
    state.isReplacing = false;
    onReplaceError(state, err);
  },

  /** DESTROY */

  destroyStart(state) {
    state.isDestroying = true;
    onDestroyStart(state);
  },

  destroySuccess(state, id, response) {
    const listIndex = state.list.indexOf(id.toString());

    if (listIndex >= 0) {
      state.list.splice(listIndex, 1);
    }

    state.isDestroying = false;
    state.destroyError = null;

    /* update the pagination */
    const { count, page, pageSize } = state.pagination;
    const maxPage = Math.ceil(count / pageSize);
    const newCount = count === 0 ? count : count - 1;
    let newPage = page;

    /** case: before deleting, we have 21 items, current selected page = 3.
     * Then, after deleting, the newPage (selected page) should be 3 - 1 = 2 */
    if (maxPage > 1 && page >= maxPage && newCount % pageSize === 0) {
      newPage = page - 1;
    }

    state.pagination = {
      count: newCount,
      page: newPage,
      pageSize,
    };

    onDestroySuccess(state, response);
  },

  destroyError(state, err) {
    state.destroyError = err;
    state.isDestroying = false;
    onDestroyError(state, err);
  },

  setEntity(state, entity) {
    const { entities, list } = state;
    const id = entity[resourceIdName].toString();

    const newEntities = { ...entities, [id]: entity };
    const newList = [...list, id];

    state.entities = newEntities;
    state.list = newList;
  },

  clearList(state) {
    state.entities = {};
    state.list = [];
  },

  ...mutations,
});

export default createMutations;
