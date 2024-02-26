
const PromotionalPlanning = () => import("../views/PromotionalPlanning.vue");

//promo entry
const PromoEntry = () => import("../views/PromoEntry/index.vue");
const PromoDetail = () => import("../views/PromoEntry/PromoDetail/index.vue");

//product
const ListProduct = () => import("../views/Product/ListProduct/index.vue");
const CreateProduct = () => import("../views/Product/CreateProduct/index.vue");
const EditProduct = () => import("../views/Product/EditProduct/index.vue");
const FilterProduct = () => import("../views/Product/FilterProduct/index.vue");

//customer
const ListCustomer = () => import("../views/Customer/ListCustomer/index.vue");
const CreateCustomer = () =>
  import("../views/Customer/CreateCustomer/index.vue");
const EditCustomer = () => import("../views/Customer/EditCustomer/index.vue");

//PL Line
const ListPlLine = () => import("../views/PLLine/ListPlLine/index.vue");
const CreatePlLine = () => import("../views/PLLine/CreatePlLine/index.vue");
const EditPlLine = () => import("../views/PLLine/EditPlLine/index.vue");

//Fixed Terms
const ListFixedTerm = () => import("../views/FixedTerm/ListFixedTerm/index.vue");
const CreateFixedTerm = () =>
  import("../views/FixedTerm/CreateFixedTerm/index.vue");
const EditFixedTerm = () => import("../views/FixedTerm/EditFixedTerm/index.vue");

//Administration
const UploadExport = () => import("../views/UploadExport/index.vue");

const ListUnitPercentage = () =>
  import("../views/UnitPercentage/ListUnitPercentage/index.vue");
const CreateUnitPercentage = () =>
  import("../views/UnitPercentage/CreateUnitPercentage/index.vue");
const EditUnitPercentage = () =>
  import("../views/UnitPercentage/EditUnitPercentage/index.vue");

//promo Optimization
const PerformanceOptimization = () =>
  import("../views/PerformanceOptimization/index.vue");
const PODetail = () =>
  import("../views/PerformanceOptimization/PODetail/index.vue");

// Activity List
const ListLocation = () =>
  import("../views/LocationList/ListLocation/index.vue");
const CreateLocation = () =>
  import("../views/LocationList/CreateLocation/index.vue");
const EditLocation = () =>
  import("../views/LocationList/EditLocation/index.vue");

//Landing Page
const LandingPage = () => import("../views/LandingPage/index.vue");
const ListLP = () => import("../views/LandingPage/ListLandingPage/index.vue");
const FilterAdvancedLP = () =>
  import("../views/LandingPage/FilterLandingPage/index.vue");

// Event List
const ListEvent = () => import("../views/EventList/ListEvent/index.vue");
const CreateEvent = () => import("../views/EventList/CreateEvent/index.vue");
const EditEvent = () => import("../views/EventList/EditEvent/index.vue");

//
const Retail = () => import("../views/Retail/ListRetail/index.vue");

//
const ScenarioBuilder = () => import("../views/ScenarioBuilder/index.vue");

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/promotion-planning",
    name: "PromotionalPlanning",
    component: PromotionalPlanning,
    redirect: { name: "LandingPage" },
    children: [
      {
        path: "promo-entries",
        name: "PromoEntries",
        component: PromoEntry,
        children: [
          {
            path: "empty",
            name: "PromoEmpty",
            component: PromoDetail,
          },
          {
            path: ":id",
            name: "PromoEdit",
            component: PromoDetail,
          },
        ],
      },
      {
        path: "products",
        name: "Products",
        component: ListProduct,
        children: [
          {
            path: "create",
            name: "CreateProduct",
            component: CreateProduct,
          },
          {
            path: "advanced-search",
            name: "FilterProduct",
            component: FilterProduct,
          },
          {
            path: ":id",
            name: "EditProduct",
            component: EditProduct,
          },
        ],
      },
      {
        path: "customers",
        name: "Customer",
        component: ListCustomer,
        children: [
          {
            path: "create",
            name: "CreateCustomer",
            component: CreateCustomer,
          },
          {
            path: ":id",
            name: "EditCustomer",
            component: EditCustomer,
          },
        ],
      },
      {
        path: "pl-lines",
        name: "PlLines",
        component: ListPlLine,
        children: [
          {
            path: "create",
            name: "CreatePlLine",
            component: CreatePlLine,
          },
          {
            path: ":id",
            name: "EditPlLine",
            component: EditPlLine,
          },
        ],
      },
      {
        path: "fixed-terms",
        name: "FixedTerm",
        component: ListFixedTerm,
        children: [
          {
            path: "create",
            name: "CreatePlLine",
            component: CreateFixedTerm,
          },
          {
            path: ":id",
            name: "EditFixedTerm",
            component: EditFixedTerm,
          },
        ],
      },
      {
        path: "upload-export",
        name: "UploadExport",
        component: UploadExport,
        children: [],
      },
      {
        path: "unit-percentage",
        name: "UnitPercentage",
        component: ListUnitPercentage,
        children: [
          {
            path: "create",
            name: "CreateUnitPercentage",
            component: CreateUnitPercentage,
          },
          {
            path: ":id",
            name: "EditUnitPercentage",
            component: EditUnitPercentage,
          },
        ],
      },
      {
        path: "activity-list",
        name: "LocationList",
        component: ListLocation,
        children: [
          {
            path: "create",
            name: "CreateLocation",
            component: CreateLocation,
          },
          {
            path: ":id",
            name: "EditLocation",
            component: EditLocation,
          },
        ],
      },
      {
        path: "promo-optimization",
        name: "PromoOptimization",
        component: PerformanceOptimization,
        children: [
          {
            path: "create",
            name: "POCreate",
            component: PODetail,
          },
          {
            path: ":id",
            name: "POEdit",
            component: PODetail,
          },
        ],
      },
      {
        path: "landing-page",
        name: "LandingPage",
        component: LandingPage,
        children: [
          {
            path: "",
            name: "LandingPage",
            component: ListLP,
            children: [
              {
                path: "advanced-search",
                name: "FilterLP",
                component: FilterAdvancedLP,
              },
            ],
          },
        ],
      },
      {
        path: "event-list",
        name: "EventList",
        component: ListEvent,
        children: [
          {
            path: "create",
            name: "CreateEvent",
            component: CreateEvent,
          },
          {
            path: ":id",
            name: "EditEvent",
            component: EditEvent,
          },
        ],
      },
      {
        path: "retail-price",
        name: "Retail Price",
        component: Retail,
      },
      {
        path: "scenario-builder",
        name: "Scenario Builder",
        component: ScenarioBuilder,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_BASE_URL),
  routes
})

export default router
