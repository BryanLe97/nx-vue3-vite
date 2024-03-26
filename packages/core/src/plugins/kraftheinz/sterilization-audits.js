import Vue from "vue";
import SterilizationAudits from "@kraftheinz/sterilization-audits";

import "@kraftheinz/sterilization-audits/dist/style.css";

import router from "@/router";

Vue.use(SterilizationAudits, { router });
