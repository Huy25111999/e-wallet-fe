import { requestRichcleLogin } from "@/api/auth";
import { showLoading } from "@/helpers/loadingHelper";
import { useToastify } from "@/helpers/useToastify";
import { richcleURL } from "@/shared/config/eviroment";
import { loadingController } from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as actions from "@/api/profile";

export default defineComponent({
  components: {},
  setup() {
    const { t: intl } = useI18n();
    const store = useStore();
    const router = useRouter();
    const toastify = useToastify();
    const { setLocaleMessage } = useI18n({ useScope: "global" });
    const lang = ref("");

    const onLoginClick = () => {
      const width = 400;
      const height = 400;
      const left = Number(screen.width / 2 - width / 2);
      const tops = Number(screen.height / 2 - height / 2);

      const loginWindow = window.open(
        richcleURL,
        "Richcle Account",
        `height=400,width=400,top=${tops},left=${left}`
      );
      // for checking user cancel/close SSO
      const timer = setInterval(() => {
        if (loginWindow?.closed) {
          clearInterval(timer);
        }
      }, 500);
    };

    onMounted(async () => {
      store.dispatch("language/setLang", "en");
      const params: any = {};
      lang.value = localStorage.getItem("language") as string;
      if (!lang.value) {
        lang.value = "en";
      }

      actions.getAllNation(params).then((res) => {
        if (res?.data) {
          const filterCountry = res?.data.find((e: any) => {
            return e.code === lang.value;
          });
          if (filterCountry) {
            const getUrlCountry = filterCountry.fileJsonLanguage.url;
            fetch(getUrlCountry)
              .then((res) => res.json())
              .then((response) => {
                setLocaleMessage(lang.value, response);
              });
          }
        }
      });

      window.addEventListener("message", (returnValue) => {
        if (returnValue.origin === "https://sso.richcle.com") {
          showLoading();
          const accountInfo = returnValue.data;

          if (accountInfo.result === "OK") {
            const params = {
              email: accountInfo.data.email,
              uid: accountInfo.data.userId,
              appid: process.env.VUE_APP_APPLICATION_ID,
              sessionKey: accountInfo.data.sessionKey,
            };

            requestRichcleLogin(params)
              .then((res) => {
                store.dispatch("auth/login", { data: res?.data });
                // window.location.pathname = "/tabs/dashboard";
                router.push({ path: "/tabs/dashboard", replace: true });
              })
              .catch((err) => {
                toastify.showError(err.response.data.message);
              })
              .finally(() => {
                loadingController.dismiss();
              });
          } else {
            loadingController.dismiss();
            toastify.showError(intl("common.login_failed"));
          }
        } else {
          loadingController.dismiss();
        }
      });
    });

    return { intl, onLoginClick };
  },
});
