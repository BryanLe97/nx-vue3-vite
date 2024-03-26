import Vue from "vue";
import FixedAssetScanning from "@kraftheinz/fixed-asset-scanning";

import "@kraftheinz/fixed-asset-scanning/dist/style.css";

import router from "@/router";

Vue.use(FixedAssetScanning, { router });
