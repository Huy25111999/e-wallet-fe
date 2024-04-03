import { requestUserCard, requestUserInfo } from "@/api/profile";
import { requestAddCard } from "@/api/wallet";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import { formatNumber, formatNumberEN_IN, formatTimeDDMM } from "@/helpers/formatHelper";
import { showLoading } from "@/helpers/loadingHelper";
import { presentToast } from "@/helpers/toastHelper";
import { IUserInfo } from "@/types";
import { closeOutline } from "ionicons/icons";

import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  loadingController,
  modalController,
  IonModal,
} from "@ionic/vue";
import { addCircleOutline, trashOutline, walletOutline, closeCircleOutline } from "ionicons/icons";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Field, Form, useField, ErrorMessage } from "vee-validate";
import { computed, defineComponent, onMounted, reactive, watchEffect, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

export default defineComponent({
  name: "AddCardModal",
  props: ["trigger", "initialBreakpoint", "title", "dismiss"],
  components: {
    IonModal,
    IonIcon,
    ModalBreakpoint,
    Form,
    Field,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const walletDatas = computed(() => store.getters.wallet.wallets);
    const customerId = store.getters.auth.customerId;
    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;
    const userCard = computed(() => store.getters.auth.cardInfo) as any;
    const formAdd = ref();
    const modalDeleteRef = ref();
    const cardSelected = ref();
    const clickSubmit = ref(false);
    const modal = ref();
    const messages = ref();
    const checkEmail = ref(false);

    const { t } = useI18n({
      inheritLocale: true,
    });

    const onHide = () => {
      modal.value.$el.dismiss();
      props.dismiss && props.dismiss();
    };

    const schemaAddCard = Yup.object({
      cardName: Yup.string()
        .required(t("wallet.top-up.error.card_name_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.card_name_max")),
      cardNumber: Yup.string()
        .required(t("wallet.top-up.error.card_number_require"))
        .nullable()
        .max(20, t("wallet.top-up.error.card_number_max")),
      cardEmail: Yup.string()
        .matches(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[com]\w{2,2})+$/,
          t("wallet.top-up.error.emailInvalid")
        )
        .max(50, t("wallet.top-up.error.card_email_max"))
        .required(t("wallet.top-up.error.email_require")),
      cardCVC: Yup.string()
        .required(t("wallet.top-up.error.card_cvc_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.card_cvc_max")),
      cardExpYear: Yup.string().required(t("wallet.top-up.error.cardExpYear")),
    });

    const formAddValues = reactive({
      cardNumber: "",
      cardExpYear: "",
      cardCVC: "",
      cardName: "",
      cardEmail: "",
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

    const checkValidate = ref({
      cardNumber: false,
      cardExpYear: false,
      cardCVC: false,
      cardName: false,
      cardEmail: false,
    });

    const validate = (field) => {
      checkValidate.value[field] = true;
      schemaAddCard.validateAt(field, schemaAddCard[field]);
    };

    const navigate = (url) => {
      void router.replace(url);
    };

    const loadUserData = () => {
      if (customerId)
        requestUserInfo(customerId).then((res) => {
          store.dispatch("auth/getInfo", res.data);
        });
    };

    onMounted(() => {
      loadUserCard();
      loadUserData();
    });
    // watchEffect(()=>{
    // })

    const loadUserCard = () => {
      if (customerId)
        requestUserCard(customerId).then((res) => {
          store.dispatch("auth/getCard", res.data);
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
          });
      });
    };

    const handleClearValue = (field) => {
      formAddValues[field] = "";
    };

    return {
      schemaAddCard,
      formAddValues,
      checkValidate,
      clickSubmit,
      modalDeleteRef,
      router,
      userInfo,
      addCircleOutline,
      walletOutline,
      trashOutline,
      walletDatas,
      formAdd,
      modules: [Pagination],
      userCard,
      cardSelected,
      modal,
      closeOutline,
      handleClearValue,
      onHide,
      t,
      resetFormValues,
      validate,
      handleSubmit,
      formatNumberEN_IN,
      formatTimeDDMM,
      navigate,
      formatNumber,
    };
  },
});
