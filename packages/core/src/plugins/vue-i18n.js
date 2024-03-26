import { createI18n } from 'vue-i18n'
import { MESSAGES } from "@kraftheinz/common";

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: MESSAGES, // set locale messages
})
export default {
  install(app) {
    app.use(i18n);
  },
};