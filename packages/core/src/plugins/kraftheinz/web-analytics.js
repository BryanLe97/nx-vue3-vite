import Vue from "vue";
import WebAnalytics from "@kraftheinz/web-analytics";

import "@kraftheinz/web-analytics/dist/style.css";

import router from "@/router";

Vue.use(WebAnalytics, { router });
