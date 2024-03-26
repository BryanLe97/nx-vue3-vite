import axios from "axios";
import VueAxios from "vue-axios";

const instance = axios.create({
  timeout: 900000, // 15 minutes
});

export default {
    install(app) {
        app.use(VueAxios, instance);
    },
};
