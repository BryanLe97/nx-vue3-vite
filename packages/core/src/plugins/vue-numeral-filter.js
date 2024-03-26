import VueNumeralFilterInstaller from "vue-numeral-filter";

export default {
    install(app) {
      app.use(VueNumeralFilterInstaller, {
        locale: "en-au"
      });
    },
};