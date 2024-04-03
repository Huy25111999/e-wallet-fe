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
import {
  requestAddBank,
  removeCard,
  requestAddCard,
  requestVerifyOtp,
  requestWithdrawOTP,
} from "@/api/wallet";
import { showLoading } from "@/helpers/loadingHelper";
import { useStore } from "vuex";
import { requestUserCard, requestUserInfo } from "@/api/profile";
import { formatNumber, hidePhoneNumber } from "@/helpers/formatHelper";
import ModalDelete from "@/components/ModalDelete.vue";
import router from "@/router";
import moment from "moment";
import { presentToast } from "@/helpers/toastHelper";
import VOtpInput from "vue3-otp-input";
import { presentAlert } from "@/helpers/alertHelper";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import AddCardModal from "@/components/add-card-modal/AddCardModal.vue";
import InputField from "@/common/_controls/InputField.vue";
import { EVIROMENT } from "@/shared/config/eviroment";
import { useRoute } from "vue-router";

import { alertCircleOutline, trashOutline } from "ionicons/icons";
import { deposit } from "@/api/topup";

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
    ModalDelete,
    AddCardModal,
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

    const schemaAddCard = Yup.object().shape({
      cardName: Yup.string()
        .required(t("wallet.top-up.error.card_name_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.card_name_max")),
      cardNumber: Yup.string()
        .required(t("wallet.top-up.error.card_number_require"))
        .nullable()
        .max(20, t("wallet.top-up.error.card_number_max")),
      cardEmail: Yup.string(),
      cardCVC: Yup.string()
        .required(t("wallet.top-up.error.card_cvc_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.card_cvc_max")),
      cardExpYear: Yup.string().required(t("wallet.top-up.error.cardExpYear")),
    });

    const userInfo = computed(() => store.getters.auth.userInfo) as any;
    const userCard = computed(() => store.getters.auth.cardInfo) as any;
    const customerId = computed(() => store.getters.auth.customerId) as any;

    const selectedCard = ref();
    const formAddValues = reactive({
      cardNumber: "",
      cardExpYear: "",
      cardCVC: "",
      cardName: "",
      cardEmail: "",
    });

    const checkValidate = ref({
      cardNumber: false,
      cardExpYear: false,
      cardCVC: false,
      cardName: false,
      cardEmail: false,
    });

    const formValues = reactive({
      amount: 100,
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
    const clickSubmit = ref(false);
    const modalDeleteRef = ref();

    const store = useStore();
    const slidesRef = ref();
    const navigate = (routerUrl: string) => {
      router.push({ path: routerUrl, replace: true });
    };
    const handleTopUp = () => {
      if (!selectedCard.value) {
        presentAlert(t("wallet.top-up.error.notice"), t("wallet.top-up.error.require-bank"), false);
        return;
      } else {
        showLoading();
        const data = {
          customerId: store.getters.auth.customerId,
          amount: Number(formValues.amount),
          creditCardId: selectedCard.value,
        };
        deposit(data).then(
          () => {
            loadingController.dismiss();
            router.push({
              path: `/tabs/wallets/top-up/success/${formValues.amount}/${moment().unix()}`,
              replace: true,
            });
          },
          (err) => {
            loadingController.dismiss();
            router.push({
              path: `/tabs/wallets/top-up/error/${formValues.amount}/${moment().unix()}`,
              replace: true,
            });
          }
        );
      }
    };

    watch(route, () => {
      selectedCard.value = null;
    });
    const resetFormValues = () => {
      formAddValues.cardCVC = "";
      formAddValues.cardEmail = "";
      formAddValues.cardName = "";
      formAddValues.cardExpYear = "";
      formAddValues.cardNumber = "";
      clickSubmit.value = false;
      checkValidate.value.cardNumber = false;
      checkValidate.value.cardExpYear = false;
      checkValidate.value.cardCVC = false;
      checkValidate.value.cardName = false;
      checkValidate.value.cardEmail = false;
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
      selectedCard.value = card.id;
    };

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    onMounted(() => {
      fetchCustomerInfo();
      loadUserCard();
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
    const loadUserCard = () => {
      const customerId = store.getters.auth.customerId;
      if (customerId)
        requestUserCard(customerId).then((res) => {
          store.dispatch("auth/getCard", res.data);
        });
    };
    const goBack = () => {
      navigate("/tabs/dashboard");
      selectedCard.value = null;
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
            path: `/tabs/wallets/withdraw/success/${formValues.amount}/${moment().toISOString()}`,
            replace: true,
          });
        })
        .catch((err) => {
          loadingController.dismiss();
          presentToast(err.response.data.message, "top");
        });
    };

    const handleSubmit = (values) => {
      checkValidate.value.cardNumber = true;
      checkValidate.value.cardExpYear = true;
      checkValidate.value.cardCVC = true;
      checkValidate.value.cardName = true;
      checkValidate.value.cardEmail = true;
      schemaAddCard.validate(values).then(() => {
        const listExpValue: string[] =
          (formAddValues.cardExpYear.includes("/") && formAddValues.cardExpYear.split("/")) || [];
        const value = {
          customerId: store.getters.auth.customerId,
          cardNumber: formAddValues.cardNumber.replace(/\s\s+/g, " "),
          cardExpYear: Number(listExpValue && listExpValue.length >= 2 && listExpValue[1].trim()),
          cardExpMonth: Number(listExpValue && listExpValue.length >= 2 && listExpValue[0].trim()),
          cardCVC: Number(formAddValues.cardCVC),
          cardName: formAddValues.cardName,
          cardEmail: formAddValues.cardEmail,
          cardType: "visa",
        };
        showLoading();
        requestAddCard(value)
          .then((res) => {
            loadingController.dismiss();
            modalController.dismiss();
            loadUserData();
            loadUserCard();
            resetFormValues();
          })
          .catch((err) => {
            loadingController.dismiss();
            presentToast(err.response.data.message, "top");
          })
          .finally(() => {
            modalDeleteRef.value.$el.dismiss();
          });
      });
    };

    const validate = (field) => {
      checkValidate.value[field] = true;
      schemaAddCard.validateAt(field, schemaAddCard[field]);
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

    const onDelete = (card) => {
      selectedCard.value = card;
      modalDeleteRef.value.$el.present();
    };

    const deleteCardFn = () => {
      const id = selectedCard.value;
      const data = {
        customerId: store.getters.auth.customerId,
        cardNo: selectedCard.value?.cardNo,
        accountName: selectedCard.value?.accountName,
        bankName: selectedCard.value?.name || selectedCard.value?.bankName,
        swiftCode: selectedCard.value?.swiftCode,
      };
      showLoading();
      removeCard(id, data)
        .then(() => {
          loadingController.dismiss();
          loadUserData();
          loadUserCard();
        })
        .catch((err) => {
          loadingController.dismiss();
          presentToast(err.response.data.message, "top");
        })
        .finally(() => {
          modalDeleteRef.value.$el.dismiss();
        });
    };

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
      alertCircleOutline,
      trashOutline,
      userCard,
      clickSubmit,
      validate,
      checkValidate,
      modalDeleteRef,
      deleteCardFn,
      onDelete,
    };
  },
});
