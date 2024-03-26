import listUtils from "@/store/utils/list.utils";
import createEditUtils from "@/store/utils/create.edit.utils";

/**
 * Create CRUD Bindings - A function used to bind props to CRUD components.
 *
 * @param {Object}   create                 The component for creating resource
 * @param {Object}   createRoute            The route for creating resource
 * @param {Object}   edit                   The component for editing resource
 * @param {Object}   editRoute              The route for editing resource
 * @param {String}   resourceName           The name of a resource
 * @param {String}   resourceIdName         The name of the id field
 * @param {Object}   store                  The global Vuex store variable
 *
 * @return {Object} An object with binding functions
 */
export default ({
  create,
  createRoute,
  edit,
  editRoute,
  editRouteIdName,
  filter,
  filterRoute,
  resourceName,
  resourceIdName,
  redirectRoute,
  router,
  store,
}) => {
  const hasCreate = !!create || !!createRoute;
  const hasEdit = !!edit || !!editRoute;
  const hasFilter = !!filter || !!filterRoute;

  const utils = {
    ...listUtils({
      resourceName,
      router,
      store,
    }),
    ...createEditUtils({
      editRouteIdName,
      redirectRoute,
      resourceIdName,
      resourceName,
      router,
      store,
    }),
  };

  return {
    createRoute,
    editRoute,
    editRouteIdName,
    filterRoute,
    hasCreate,
    hasEdit,
    hasFilter,
    redirectRoute,
    resourceIdName,
    resourceName,
    crud: {
      ...utils,
    },
  };
};
