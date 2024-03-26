import Vue from "vue";
import SterilizationSpecifications from "@kraftheinz/label-verification";

import router from "@/router";

import "@kraftheinz/label-verification/dist/style.css";

Vue.use(SterilizationSpecifications, { router });
