
// import Antd from "./plugins/antdv";
import "./plugins/vee-validate";
import "./plugins/vue-axios";
import "./plugins/vue-infinite-loading";
import "./plugins/vue-lodash";
import "./plugins/vue-meta";
import "./plugins/vue-moment";
// import "./plugins/vue-portal";
import "./plugins/ability";
import "./plugins/vue-mask";
import "./plugins/quill-editor";
import "./plugins/v-click-outside";
import "./plugins/vue-numeral-filter";
import "./plugins/vue-i18n";

// import "./plugins/kraftheinz/application-contexts";
import "./plugins/kraftheinz/common";
// import "./plugins/kraftheinz/sterilization-specifications";
// import "./plugins/kraftheinz/watties-grower";
// import "./plugins/kraftheinz/sterilization-audits";
// import "./plugins/kraftheinz/container-filling";
// import "./plugins/kraftheinz/web-analytics";
// import "./plugins/kraftheinz/line-performance";
// import "./plugins/kraftheinz/promotional-planning";
// import "./plugins/kraftheinz/fixed-asset-scanning";
// import "./plugins/kraftheinz/export-orders";
// import "./plugins/kraftheinz/labelling-information-tool";
// import "./plugins/kraftheinz/shipment-closure";
// import "./plugins/kraftheinz/label-verification";
// import "./plugins/kraftheinz/stuck-claims";
// import "./plugins/kraftheinz/jido-seisei";
// import "./plugins/kraftheinz/promotion-claims-automation";

import Vuex from "vuex";
import Antd from "ant-design-vue";
import PortalVue from "portal-vue";


import router from "./router";
import store from "./store";

import App from "./App.vue";
import { MESSAGES } from "@kraftheinz/common";

import "./styles/styles.scss";

Vue.config.productionTip = false;

import I18Plugin from '@/plugins/vue-i18n';


const i18n = new VueI18n({
  locale: "ja",
  messages: MESSAGES,
});

import { createApp } from 'vue'


const app = createApp(App)
app.use(i18n)
app.use(router)
app.use(Antd)
app.use(Vuex)
app.use(PortalVue)
app.use(store)
app.use(I18Plugin);
app.mount('#app')

