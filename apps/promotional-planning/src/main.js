import './styles.scss';

import FreqCheckIconField from "./components/FreqCheckIconField.vue";

import router from './router';

import { createApp } from 'vue';
import App from './app/App.vue';

const app = createApp(App);

app.use(router);
app.component('FreqCheckIconField', FreqCheckIconField);

app.mount('#root');
