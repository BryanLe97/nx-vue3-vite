import { showErrorMessages } from "@/constants";
import { ERROR_NO_PERMISSIONS, VIEW_PERMISSION } from "@/constants/permissions";

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const checkingObj = isCheckingPermissions(to.meta);

      if (checkingObj.yes) {
        const { page, permission } = checkingObj;
        const hasPermission = vm.$can(permission, page);

        if (hasPermission) return next();

        const isFromHome = from.path == "/";

        if (isFromHome) {
          const { path: route, parentKey, key } = getRedirectedPage(vm);

          if (route) {
            vm.openKeys = parentKey ? [parentKey] : [];
            vm.selectedKeys = [key];

            return next({
              path: route,
            });
          }

          onError(vm, next);
        } else {
          onError(vm, next);
        }
      } else {
        next();
      }
    });
  },
};

function onError(vm, next) {
  next("/");
  vm.$nextTick(() => showErrorMessages(vm, ERROR_NO_PERMISSIONS));
}

function isCheckingPermissions(routeMeta) {
  if (!routeMeta || typeof routeMeta != "string" || !routeMeta.includes(";"))
    return {};

  const splitMeta = routeMeta.split(";");

  return {
    yes: splitMeta.length === 3,
    permission: splitMeta[1],
    page: splitMeta[2],
  };
}

/**
 * In case the default re-directed page is restricted, we move to the next page
 */
function getRedirectedPage(vm) {
  const { $can, dataMenu } = vm;
  let result;

  for (let menuItem of dataMenu) {
    result = findFirstAccessibleRoute(menuItem, $can);

    if (result)
      return {
        path: result.path,
        parentKey: result.parentKey,
        key: result.key,
      };
  }

  return {};
}

function findFirstAccessibleRoute(menuItem, $can) {
  if ($can(VIEW_PERMISSION, menuItem.page)) return menuItem;
  if (!menuItem.child || !menuItem.child.length) return;

  for (let childMenuItem of menuItem.child) {
    const _menuItem = findFirstAccessibleRoute(childMenuItem, $can);
    if (_menuItem) return { ..._menuItem, parentKey: menuItem.key };
  }
}
