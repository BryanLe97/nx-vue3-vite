import Vue from "vue";

import ExportOrders from "@kraftheinz/export-orders";

import "@kraftheinz/export-orders/dist/style.css";

import router from "@/router";

Vue.use(ExportOrders, { router });
