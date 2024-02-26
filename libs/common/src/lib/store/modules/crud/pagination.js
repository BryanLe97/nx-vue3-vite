export const Types = {
  PAGINATION_SET: "PAGINATION_SET",
  PAGINATION_GET: "PAGINATION_GET",
  PAGINATION_DELETE: "PAGINATION_DELETE",
};

export default () => ({
  state: {
    pagination: { count: 0, page: 1, pageSize: 10 },
  },
  mutations: {
    [Types.PAGINATION_SET](state, payload) {
      state.pagination = payload;
    },
    [Types.PAGINATION_DELETE](state) {
      state.pagination = {};
    },
  },
  getters: {
    [Types.PAGINATION_GET](state) {
      return state.pagination;
    },
  },
});
