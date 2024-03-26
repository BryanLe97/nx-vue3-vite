import lodash from "lodash";
import VueLodash from "vue-lodash";

// name is optional
export default {
    install(app) {
        app.use(VueLodash, { lodash: lodash });
    },
};