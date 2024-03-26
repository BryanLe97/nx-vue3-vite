import { createRouter, createWebHistory } from 'vue-router'

import Home from "@/views/Home";

import UserManagement from "@/views/UserManagement";
import ManageEmployee from "@/views/UserManagement/ManageEmployee";
import ListEmployee from "@/views/UserManagement/ManageEmployee/ListEmployee";
import EditEmployee from "@/views/UserManagement/ManageEmployee/EditEmployee";
import CreateEmployee from "@/views/UserManagement/ManageEmployee/CreateEmployee";

import ManageRole from "@/views/UserManagement/ManageRole";

import ReleaseNotes from "@/views/ReleaseNotes";
import Changelog from "@/views/ReleaseNotes/Changelog";
import ListChangelog from "@/views/ReleaseNotes/Changelog/ListChangelog";
import CreateChangelog from "@/views/ReleaseNotes/Changelog/CreateChangelog";

import ApplicationGroups from "@/views/UserManagement/ApplicationGroups";
import CreateApplicationGroups from "@/views/UserManagement/ApplicationGroups/CreateApplicationGroups";
import EditApplicationGroups from "@/views/UserManagement/ApplicationGroups/EditApplicationGroups";

import ApplicationSettings from "@/views/UserManagement/ApplicationSettings";
import AddExternalApp from "@/views/UserManagement/ApplicationSettings/AddExternalApp";
import EditExternalApp from "@/views/UserManagement/ApplicationSettings/EditExternalApp";

import GeneralComments from "@/views/UserManagement/GeneralComments";
import CreateGeneralComments from "@/views/UserManagement/GeneralComments/CreateGeneralComments";

import RolePermission from "@/views/UserManagement/RolePermission";

import NumberOfSiteVisitors from "@/views/UserManagement/NumberOfSiteVisitors";

import {
  IDENTITY_ROLE,
  IDENTITY_USER,
  VIEW_PERMISSION,
} from "@kraftheinz/common"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/general-comment",
        name: "GeneralComment",
        component: CreateGeneralComments,
      },
    ],
  },
  {
    path: "/config",
    component: UserManagement,
    redirect: {
      name: "ListEmployee",
    },
    children: [
      {
        path: "employees",
        name: "employees",
        component: ManageEmployee,
        children: [
          {
            path: "",
            name: "ListEmployee",
            component: ListEmployee,
            meta: `;${VIEW_PERMISSION};${IDENTITY_USER}`,
          },
          {
            path: "create",
            name: "CreateEmployee",
            component: CreateEmployee,
          },
          {
            path: ":id",
            name: "EditEmployee",
            component: EditEmployee,
          },
        ],
      },
      {
        path: "roles",
        name: "ListRole",
        component: ManageRole,
        meta: `;${VIEW_PERMISSION};${IDENTITY_ROLE}`,
      },
      {
        path: "application-groups",
        name: "ApplicationGroups",
        component: ApplicationGroups,
        children: [
          {
            path: "create",
            name: "CreateApplicationGroups",
            component: CreateApplicationGroups,
          },
          {
            path: ":id",
            name: "EditApplicationGroups",
            component: EditApplicationGroups,
          },
        ],
      },

      {
        path: "settings",
        name: "ApplicationSettings",
        component: ApplicationSettings,
        children: [
          {
            path: "create",
            name: "AddExternalApp",
            component: AddExternalApp,
          },
          {
            path: ":id",
            name: "EditExternalApp",
            component: EditExternalApp,
          },
        ],
      },
      {
        path: "general-comments",
        name: "GeneralComments",
        component: GeneralComments,
        children: [],
      },
      {
        path: "role-permission",
        name: "RolePermission",
        component: RolePermission,
        meta: `reports`,
        children: [],
      },
      {
        path: "site-visitors",
        name: "NumberOfSiteVisitors",
        component: NumberOfSiteVisitors,
        meta: `reports`,
        children: [],
      },
    ],
  },
  {
    path: "/release-notes",
    name: "ReleaseNotes",
    component: ReleaseNotes,
    children: [
      {
        path: "changelog",
        name: "changelog",
        component: Changelog,
        children: [
          {
            path: "",
            name: "ListChangelog",
            component: ListChangelog,
          },
          {
            path: "create",
            name: "CreateChangelog",
            component: CreateChangelog,
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
