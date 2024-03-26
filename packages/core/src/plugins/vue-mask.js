import VueMask from "v-mask";
import { VueMaskDirective } from "v-mask";
import { VueMaskFilter } from "v-mask";


export default {
    install(app) {
        app.use(VueMask);

        app.directive("mask", VueMaskDirective);

        app.filter("VMask", VueMaskFilter);
    },
};