import { abilitiesPlugin } from '@casl/vue';
import Ability from "@/common/ability-builder";
export default {
    install(app) {
        app.use(abilitiesPlugin, Ability, {
        useGlobalProperties: true
        })
    },
};