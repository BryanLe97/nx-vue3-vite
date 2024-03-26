import VueMeta from "vue-meta";

export default {
    install(app) {
        app.use(VueMeta, { refreshOnceOnNavigation: true });
    },
};