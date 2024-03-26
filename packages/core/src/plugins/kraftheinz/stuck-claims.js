import Vue from "vue";
import StuckClaims from "@kraftheinz/stuck-claims";

import router from "@/router";

import "@kraftheinz/stuck-claims/dist/style.css";

Vue.use(StuckClaims, { router });
