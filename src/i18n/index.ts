import { Locales } from "./locales";
import { createI18n } from "vue-i18n";
// import en from "./en.json";
// import vn from "./vn.json";
// import kr from "./kr.json";

export const messages = {
  [Locales.EN]: "en",
  [Locales.KR]: "kr",
  [Locales.VN]: "vn",
};

let lang = localStorage.getItem("language") as string;
if (!lang) {
  lang = "en";
}
const i18n = createI18n<false>({
  legacy: false,
  locale: lang,
  messages: {},
  allowComposition: true,
  flatJson: false,
  warnHtmlMessage: true,
  fallbackLocale: lang,
});

export const defaultLocale = Locales.EN;
export default i18n;
