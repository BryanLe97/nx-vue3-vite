export const Types = {
  SORTER_SET: "SORTER_SET",
  SORTER_GET: "SORTER_GET",
  SORTER_GET_QUERY: "SORTER_GET_QUERY",
};

export default () => ({
  state: {
    sorter: { order: "", columnKey: "" },
  },

  mutations: {
    [Types.SORTER_SET](state, payload) {
      state.sorter = payload;
    },
  },

  getters: {
    [Types.SORTER_GET](state) {
      return state.sorter;
    },

    [Types.SORTER_GET_QUERY](state) {
      const { columnKey, order } = state.sorter;

      if (!columnKey || !order) {
        return "";
      }

      const query = `sort=${order == "ascend" ? "" : "-"}${columnKey}`;

      return query;
    },
  },
});
