import store from "@/vuex/store";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { IonicVue } from "@ionic/vue";
import axios from "axios";
import { createApp, onMounted } from "vue";
import App from "./App.vue";
import router from "./router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/display.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";

/* Theme variables */
import { defaultLocale, messages } from "@/i18n";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { createI18n } from "vue-i18n";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import setUpAxios from "./shared/config/__setUpAxios";
import "./theme/main.css";
import "./theme/variables.css";
import VueCreditCardValidation from "vue-credit-card-validation";
import i18n from "./i18n";

const lang = store.getters.language.language || defaultLocale;

// const i18n = createI18n<false>({
//   legacy: false,
//   locale: lang,
//   messages: {},
//   allowComposition: true,
//   flatJson: false,
//   warnHtmlMessage: true,
//   fallbackLocale: lang,
// });

const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueCreditCardValidation)
  .use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)
  .component(VueCountdown.name, VueCountdown);
app.directive('focus',{
  mounted(el){
    el.focus();
  }
})
setUpAxios(axios, store);
defineCustomElements(window);

router.isReady().then(() => {
  app.mount("#app");
});
