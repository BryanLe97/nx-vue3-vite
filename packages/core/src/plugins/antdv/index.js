import Antd from "ant-design-vue";
import * as Icons from '@ant-design/icons-vue';
import "./ant.less";

export default {
    install(app) {
        app.use(Antd);
        Object.keys(Icons).forEach((key) => {
            app.component(key, Icons[key]);
        });
    },
};
