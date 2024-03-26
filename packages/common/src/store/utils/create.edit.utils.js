import {
  initEntity,
  fetchEntity,
  getEntity,
  setEntity,
  getEntityForm,
  updateEntity,
  submitEntity,
  submitPartialEntity,
  destroyEntity,
  clearEntity,
  getFetchingStatus,
} from "./common.utils";

/**
 * Edit View Utils - A function used to create utilities
 *
 * @param {String} redirectRoute  A route the router will redirect to on submit
 * @param {String} resourceIdName The name of the id of a resource
 * @param {String} resourceName   The name of the resource
 * @param {Object} store          The global Vuex store variable
 * @param {Object} router         The global Vue router variable
 * @param {Object} parseResponses An object containing a parseSingle function
 * and a parseList function to be used on submit actions.
 *
 * @return {Object} A set of functions to be used in an Edit form.
 */
export default ({ resourceName, editRouteIdName, router, store }) => {
  return {
    /**
     * initEntity - Init the 'resourceName' entity in the store.
     */
    initEntity() {
      const formType = "createForm";

      initEntity({
        store,
        resourceName,
        formType,
      });
    },

    /**
     * fetchEntity - Fetches a single 'resourceName' element from the store.
     *
     * @return {Object} A fetched 'resourceName' entity.
     */
    fetchEntity(customUrl) {
      return fetchEntity({
        resourceName,
        router,
        store,
        customUrl,
        editRouteIdName,
      });
    },

    /**
     * getEntity - Gets a 'resourceName' entity from the store
     *
     * @param {Number} id A 'resourceName' id
     *
     * @return {Object} A 'resourceName' entity.
     */
    getEntity(id) {
      return getEntity({ router, resourceName, store, id, editRouteIdName });
    },

    /**
     * setEntity - Set a 'resourceName' entity into the store
     *
     * @param {Number} entity A 'resourceName' entity
     */
    setEntity(entity) {
      setEntity({ resourceName, entity, store });
    },

    /**
     * getEntityForm - Gets the current 'resourceName' entity form. The value does
     * not exist until a user inputs data using 'updateEntity'.
     *
     * @param {String} formType 'createForm' or 'editForm'
     *
     * @return {Object} a 'resourceName' object with updated data from the form.
     */
    getEntityForm(formType) {
      return getEntityForm({ store, resourceName, formType });
    },

    /**
     * clearEntity - Gets the current 'resourceName' entity form and clear.
     *
     * @param {String} formType 'createForm' or 'editForm'
     *
     * @return {Object} a 'resourceName' object with the form was cleared.
     */
    clearEntity(formType) {
      return clearEntity({ resourceName, formType, store });
    },

    /**
     * updateEntity - Given a key and a value, updates the 'resourceName' entity
     * in the store.
     *
     * @param {String} resourceKey A 'resourceName' attribute key
     * @param {String} value       A given value to be stored
     */
    updateEntity(formType, { resourceKey, value }) {
      updateEntity({
        resourceKey,
        value,
        store,
        resourceName,
        formType,
      });
    },

    /**
     * submitEntity - Dispatches a create/replace request
     *
     * @param {String} actionType "create" or "replace" action
     * @param {String} customUrl  if present, use this custom url for API call
     *
     * @return {Promise} A pending promise.
     */
    submitEntity(actionType, customUrl, payload) {
      let actionTypeParams;

      if (actionType == "create") {
        actionTypeParams = {
          data: this.getEntityForm("createForm"),
          formType: "createForm",
          customUrl: customUrl || null,
        };
      }

      if (actionType == "replace") {
        const id = router.history.current.params[editRouteIdName];
        actionTypeParams = {
          id,
          data: this.getEntityForm("editForm"),
          formType: "editForm",
          customUrl: customUrl || null,
        };

        if (id == 0) {
          actionType = "create";

          actionTypeParams = {
            data: this.getEntityForm("editForm"),
            formType: "editForm",
            customUrl: customUrl || null,
          };
        }
      }

      if (actionType === "update") {
        actionTypeParams = {
          data: this.getEntityForm("editForm"),
          formType: "editForm",
          customUrl: customUrl || null,
        };
      }

      if (actionType === "print") {
        actionType = "create";

        actionTypeParams = {
          data: this.getEntityForm("printForm"),
          formType: null,
          customUrl: customUrl || null,
        };
      }

      if (payload) {
        actionTypeParams = {
          data: payload,
          formType: null,
          customUrl: customUrl || null,
        };
      }

      return submitEntity({
        resourceName,
        actionType,
        actionTypeParams,
        store,
      });
    },

    /**
     * submitPartialEntity - Dispatches an update request
     *
     * @return {Promise} A pending promise.
     */
    submitPartialEntity({ resourceName, id, data, customUrl }) {
      const actionParams = { id, data, customUrl };

      return submitPartialEntity({
        resourceName,
        actionParams,
        store,
      });
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

    getFetchingStatus() {
      return getFetchingStatus({ store, resourceName });
    }
  };
};
