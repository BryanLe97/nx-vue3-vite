export const Types = {
  namespace: "entities",

  ENTITIES_CLEAR_FORM: "ENTITIES_CLEAR_FORM",
  ENTITIES_CREATE_FORM: "ENTITIES_CREATE_FORM",
  ENTITIES_UPDATE_FORM: "ENTITIES_UPDATE_FORM",

  ENTITIES_GET_ENTITY: "ENTITIES_GET_ENTITY",
};

const initForm = (state, { formType, entity }) => {
  state[formType] = state[formType] || {};
  state[formType][entity] = state[formType][entity] || {};
};

const clearForm = (state, { formType, entity }) => {
  if (state[formType] && state[formType][entity]) {
    state[formType][entity] = {};
  }
};

export default {
  namespaced: true,
  state: {},
  mutations: {
    [`${Types.ENTITIES_CLEAR_FORM}`]: clearForm,
    [`${Types.ENTITIES_CREATE_FORM}`]: initForm,
    [`${Types.ENTITIES_UPDATE_FORM}`](
      state,
      { formType, entity, resourceKey, value }
    ) {
      initForm(state, { formType, entity });
      state[formType][entity][resourceKey] =
        typeof value == "string" ? value.trim() : value;
    },
  },
  getters: {
    [`${Types.ENTITIES_GET_ENTITY}`]: (state) => state,
  },
};
