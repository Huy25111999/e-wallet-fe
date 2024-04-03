import { requestCodeLogin, requestLogin } from "@/api/auth";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import { hidePhoneNumber } from "@/helpers/formatHelper";
import { showLoading } from "@/helpers/loadingHelper";
import { presentToast } from "@/helpers/toastHelper";
import { useToastify } from "@/helpers/useToastify";
import { countries } from "@/shared/config/const";
import { EVIROMENT } from "@/shared/config/eviroment";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  loadingController,
  modalController,
} from "@ionic/vue";
import { call } from "ionicons/icons";
import { ErrorMessage, Field, Form } from "vee-validate";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import VOtpInput from "vue3-otp-input";
import { useStore } from "vuex";
import * as Yup from "yup";
import * as actions from "@/api/profile";

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonButton,
    VOtpInput,
    Form,
    Field,
    IonSelect,
    IonSelectOption,
    ModalBreakpoint,
    IonLabel,
    IonInput,
    IonItem,
    IonList,
    IonRadioGroup,
    IonRadio,
    modalController,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const toastify = useToastify();
    const store = useStore();

    const formRequest = ref();
    const formConfirm = ref();
    const otpInput = ref();
    const phoneNumber = ref("");
    const countrySelected = ref("1");
    const openOtp = ref(false);
    const errorToken = ref(false);
    const otpInputValue = ref("");
    const tokenValue = ref({
      otpCode: "",
      phone: "",
      otpToken: "",
    });
    const modalDelete = ref();
    const countDownRef = ref();
    const resendOtp = reactive({
      time: 30000,
      isEnd: false,
    });

    const { t, locale } = useI18n({
      inheritLocale: true,
    });
    const { setLocaleMessage } = useI18n({ useScope: "global" });
    const lang = ref("");

    const schemaRequestCode = Yup.object({
      phone_number: Yup.string()
        .required(t("user-login-page.error.phone-number-require"))
        .min(9, t("user-login-page.error.phone-number-min"))
        .max(20, t("user-login-page.error.phone-number-max")),
    });
    const formValues = reactive({
      phone_number: "",
    });

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
    });

    const handleRequestCode = (isResend?: boolean) => {
      showLoading();
      const currentParams = {
        phone: formValues.phone_number.trim(),
        countryCode: countrySelected.value,
      };

      // send request to server
      requestCodeLogin(currentParams)
        .then((res) => {
          openOtp.value = true;
          tokenValue.value = res.data;
          phoneNumber.value = res.data.phone;
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode + "", "top");
          }
        })
        .catch((err) => {
          if (err?.response?.data?.message) {
            toastify.showError(err?.response?.data?.message);
          }
        })
        .finally(() => {
          loadingController.dismiss();
          if (isResend) {
            countDownRef.value.restart();
            otpInput.value?.clearInput();
            resendOtp.isEnd = false;
          }
        });
    };

    const handleOnChange = (value: string) => {
      otpInputValue.value = value;
      if (value !== tokenValue.value.otpCode) {
        errorToken.value = true;
      } else {
        errorToken.value = false;
      }
    };

    const handleSelectCountry = (countryCode: string) => {
      // store.dispatch("language/setLang", language);
      // locale.value = language;
      countrySelected.value = countryCode;
      modalController.dismiss();
    };

    const handleConfirm = () => {
      showLoading();
      const data = {
        otpCode: otpInputValue.value,
        otpToken: tokenValue.value.otpToken,
        phone: phoneNumber.value,
      };

      //send request to server
      requestLogin(data)
        .then((res) => {
          store.dispatch("auth/login", { data: res?.data });
          router.push({ path: "/tabs/dashboard", replace: true });
        })
        .catch((err) => {
          toastify.showError(err?.response?.data?.message);
        })
        .finally(() => {
          loadingController.dismiss();
        });
    };

    const handleOnComplete = (otp) => {
      otpInputValue.value = otp;
    };

    const getFlag = () => {
      const selectedCountry = countries.find((e) => e.value == countrySelected.value);
      if (selectedCountry) {
        return selectedCountry.flag;
      } else {
        return "vn.svg";
      }
    };

    const getCountryNumber = () => {
      const selectedCountry = countries.find((e) => e.value == countrySelected.value);
      if (selectedCountry) {
        return selectedCountry.value;
      } else {
        return "1";
      }
    };

    const onOtpEnd = () => {
      resendOtp.isEnd = true;
    };

    const onReTakeOtp = () => {
      otpInputValue.value = "";
      handleRequestCode(true);
    };

    const goBack = () => {
      openOtp.value = false;
      formValues.phone_number = "";
      otpInputValue.value = "";
    };

    const otpValidLength = computed(() => otpInputValue.value.trim().length < 6);

    return {
      call,
      formRequest,
      formConfirm,
      otpInput,
      phoneNumber,
      schemaRequestCode,
      countries,
      countrySelected,
      modalDelete,
      openOtp,
      errorToken,
      tokenValue,
      otpInputValue,
      formValues,
      otpValidLength,
      resendOtp,
      countDownRef,
      onReTakeOtp,
      t,
      getCountryNumber,
      getFlag,
      hidePhoneNumber,
      handleRequestCode,
      handleConfirm,
      handleOnChange,
      handleSelectCountry,
      handleOnComplete,
      onOtpEnd,
      goBack,
    };
  },
});
