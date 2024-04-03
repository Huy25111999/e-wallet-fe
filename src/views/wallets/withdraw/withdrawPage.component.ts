import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonLabel,
  IonInput,
  IonList,
  modalController,
  loadingController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonItem,
  IonNote,
  IonChip,
  IonSlides,
  IonSlide,
} from "@ionic/vue";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";
import { requestAddBank, requestVerifyOtp, requestWithdrawOTP } from "@/api/wallet";
import { showLoading } from "@/helpers/loadingHelper";
import { useStore } from "vuex";
import { requestUserInfo } from "@/api/profile";
import { formatNumber, hidePhoneNumber } from "@/helpers/formatHelper";
import router from "@/router";
import moment from "moment";
import { presentToast } from "@/helpers/toastHelper";
import VOtpInput from "vue3-otp-input";
import { presentAlert } from "@/helpers/alertHelper";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import InputField from "@/common/_controls/InputField.vue";
import { EVIROMENT } from "@/shared/config/eviroment";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonButton,
    Form,
    Field,
    IonLabel,
    IonInput,
    IonList,
    modalController,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonItem,
    IonNote,
    IonChip,
    VOtpInput,
    IonSlides,
    IonSlide,
    InputField,
    ModalBreakpoint,
  },

  setup() {
    const route = useRoute();
    const { t } = useI18n({
      inheritLocale: true,
    });

    const schemaRequestCode = Yup.object({
      amount: Yup.number()
        .required(t("wallet.top-up.error.amount-require"))
        .typeError(t("wallet.top-up.error.amount-require"))
        .min(10, t("wallet.top-up.error.min"))
        .max(999999, t("wallet.top-up.error.max")),
    });

    const schemaAddCard = Yup.object({
      bankName: Yup.string()
        .required(t("wallet.top-up.error.bankName_require"))
        .max(50, t("wallet.top-up.error.bankName_max")),
      account_number: Yup.string()
        .required(t("wallet.top-up.error.account_number_require"))
        .max(20, t("wallet.top-up.error.account_number_max")),
      account_name: Yup.string()
        .required(t("wallet.top-up.error.account_name_require"))
        .max(50, t("wallet.top-up.error.account_name_max")),
      swiftCode: Yup.string()
        .required(t("wallet.top-up.error.swiftCode_require"))
        .max(50, t("wallet.top-up.error.swiftCode_max")),
    });

    const userInfo = computed(() => store.getters.auth.userInfo) as any;
    const customerId = computed(() => store.getters.auth.customerId) as any;

    const selectedCard = ref({
      cardNo: "",
    });
    const formAddValues = reactive({
      account_number: "",
      account_name: "",
      swiftCode: "",
      bankName: "",
    });

    const formValues = reactive({
      amount: 10,
    });

    const formRequest = ref();
    const otpInput = ref();
    const formConfirm = ref();
    const formAdd = ref();
    const error = ref("");
    const otpInputValue = ref("");

    const tokenValue = ref({
      otpCode: "",
      phone: "",
      otpToken: "",
    });

    const countDownRef = ref();
    const resendOtp = reactive({
      time: 30000,
      isEnd: false,
    });

    const store = useStore();
    const slidesRef = ref();
    const navigate = (routerUrl: string) => {
      router.push({ path: routerUrl, replace: true });
    };
    const handleTopUp = () => {
      if (!selectedCard.value.cardNo) {
        presentAlert(t("wallet.top-up.error.notice"), t("wallet.top-up.error.require-bank"), false);
        return;
      } else {
        error;
        error.value = "";
        slidesRef.value.$el.slideTo(1, 500);
      }
    };

    watch(route, () => {
      selectedCard.value = {
        cardNo: "",
      };
    });

    const resetFormValues = () => {
      formAddValues.account_number = "";
      formAddValues.account_name = "";
      formAddValues.swiftCode = "";
      formAddValues.bankName = "";
    };

    const handleOnChange = (value: string) => {
      otpInputValue.value = value;
    };

    const handleConfirmWithdraw = (isResend?: boolean) => {
      const values = {
        amount: Number(formValues.amount),
        bankCard: selectedCard.value,
        customerId: store.getters.auth.customerId,
      };
      showLoading();
      requestWithdrawOTP(values)
        .then((res) => {
          loadingController.dismiss();
          tokenValue.value = res.data;
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode, "top");
          }
          slidesRef.value.$el.slideTo(2, 500);
          countDownRef.value.start();
        })
        .catch((err) => {
          loadingController.dismiss();
          presentToast(err.response.data.message, "top");
        })
        .finally(() => {
          loadingController.dismiss();
          if (isResend) {
            otpInput.value?.clearInput();
            resendOtp.isEnd = false;
          }
        });
    };

    const handleOnComplete = (otp) => {
      otpInputValue.value = otp;
    };

    const setValueAmount = (value: number) => {
      formValues.amount = value;
    };

    const selectCard = (card: any) => {
      selectedCard.value = card;
    };

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    onMounted(() => {
      fetchCustomerInfo();
    });

    onMounted(() => {
      loadUserData();
    });

    const loadUserData = () => {
      const customerId = store.getters.auth.customerId;
      if (customerId)
        requestUserInfo(customerId).then((res) => {
          store.dispatch("auth/getInfo", res.data);
        });
    };

    const goBack = () => {
      navigate("/tabs/dashboard");
      selectedCard.value = { cardNo: "" };
    };

    const handleConfirm = () => {
      showLoading();
      const data = {
        otpCode: otpInputValue.value,
        otpToken: tokenValue.value.otpToken,
        amount: formValues.amount,
        bankCard: selectedCard.value,
        customerId: store.getters.auth.customerId,
        phone: userInfo.value.phone,
      };
      //send request to server
      requestVerifyOtp(data)
        .then((res) => {
          loadingController.dismiss();
          router.push({
            path: `/tabs/wallets/withdraw/success/${formValues.amount}/${moment().unix()}`,
            replace: true,
          });
        })
        .catch((err) => {
          loadingController.dismiss();
          presentToast(err.response.data.message, "top");
        });
    };

    const handleSubmit = (values) => {
      schemaAddCard.validate(values).then(() => {
        const value = {
          customerId: store.getters.auth.customerId,
          cardNo: formAddValues.account_number,
          accountName: formAddValues.account_name,
          swiftCode: formAddValues.swiftCode,
          bankName: formAddValues.bankName,
        };
        showLoading();
        requestAddBank(value)
          .then((res) => {
            loadingController.dismiss();
            modalController.dismiss();
            loadUserData();
          })
          .catch((err) => {
            loadingController.dismiss();
            presentToast(err.response.data.message, "top");
          })
          .finally(() => {
            resetFormValues();
          });
      });
    };

    const handleChangeSlide = (params: any) => {
      slidesRef.value.$el.slideTo(params.indexSlide, params.time);
    };

    const onResendOtp = () => {
      resendOtp.isEnd = true;
    };

    const onReTakeOtp = () => {
      resendOtp.isEnd = false;
      countDownRef.value.restart();
      handleConfirmWithdraw(true);
    };

    watch(route, () => {
      slidesRef.value.$el.slideTo(0);
      resetFormValues();
    });

    return {
      userInfo,
      schemaRequestCode,
      schemaAddCard,
      formValues,
      formAddValues,
      countDownRef,
      resendOtp,
      formRequest,
      formConfirm,
      formAdd,
      error,
      selectedCard,
      slidesRef,
      resetFormValues,
      t,
      handleTopUp,
      formatNumber,
      hidePhoneNumber,
      setValueAmount,
      navigate,
      selectCard,
      // slideOpts,
      handleOnChange,
      handleOnComplete,
      handleConfirm,
      handleChangeSlide,
      otpInput,
      goBack,
      handleSubmit,
      handleConfirmWithdraw,
      onResendOtp,
      onReTakeOtp,
    };
  },
});
