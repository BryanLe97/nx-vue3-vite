import Vue from "vue";
import LinePerformance from "@kraftheinz/line-performance";

import "@kraftheinz/line-performance/dist/style.css";

import router from "@/router";

Vue.use(LinePerformance, { router });
