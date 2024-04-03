import { requestUserInfo, requestUserCard } from "@/api/profile";
import { deleteCard, removeCard, requestAddBank, requestAddCard } from "@/api/wallet";
import InputField from "@/common/_controls/InputField.vue";
 import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import AddCardModal from "@/components/add-card-modal/AddCardModal.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import { formatNumber, formatNumberEN_IN, formatTimeDDMM } from "@/helpers/formatHelper";
import { showLoading } from "@/helpers/loadingHelper";
import { presentToast } from "@/helpers/toastHelper";
import { IUserInfo } from "@/types";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  loadingController,
  modalController,
} from "@ionic/vue";
import { addCircleOutline, trashOutline, walletOutline } from "ionicons/icons";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Field, Form } from "vee-validate";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

export default defineComponent({
  name: "WalletsPage",
  components: {
    IonContent,
    IonPage,
    IonIcon,
    InputField,
    IonButton,
    Form,
    Field,
    ModalBreakpoint,
    ModalDelete,
    AddCardModal
  },
  setup() {
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

    const { t } = useI18n({
      inheritLocale: true,
    });

    const schemaAddCard = Yup.object().shape({
      cardName: Yup.string()
        .required(t("wallet.top-up.error.card_name_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.card_name_max")),
      cardNumber: Yup.string()
        .required(t("wallet.top-up.error.account_number_require"))
        .nullable()
        .max(20, t("wallet.top-up.error.account_number_max")),
      cardEmail: Yup.string(),
      cardCVC: Yup.string()
        .required(t("wallet.top-up.error.swiftCode_require"))
        .nullable()
        .max(50, t("wallet.top-up.error.swiftCode_max")),
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

    onMounted(() => {
      //  fetchCustomerInfo();
      loadUserCard();
      loadUserData();
    });

    // const fetchCustomerInfo = () => {
    //     requestUserInfo(customerId.value).then((res) => {
    //         store.dispatch("auth/getInfo", res.data);
    //     });
    // };

    const loadUserData = () => {
      if (customerId)
        requestUserInfo(customerId).then((res) => {
          store.dispatch("auth/getInfo", res.data);
        });
    };

    const loadUserCard = () => {
      if (customerId)
        requestUserCard(customerId).then((res) => {
          store.dispatch("auth/getCard", res.data);
        });
    };

    const navigate = (url) => {
      void router.replace(url);
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

    const onSelectCard = (card) => {
      cardSelected.value = card;
    };

    const onDelete = (card) => {
      cardSelected.value = card;
      modalDeleteRef.value.$el.present();
    };

    const deleteCardFn = () => {
      const id = cardSelected.value.id;
      const data = {
        customerId: customerId,
        cardNo: cardSelected.value?.cardNo,
        accountName: cardSelected.value?.accountName,
        bankName: cardSelected.value?.name || cardSelected.value?.bankName,
        swiftCode: cardSelected.value?.swiftCode,
      };
      showLoading();
      removeCard(id, data)
        .then(() => {
          cardSelected.value = null;
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
      // presentActionSheet,
      formatNumberEN_IN,
      deleteCardFn,
      onSelectCard,
      resetFormValues,
      modalDeleteRef,
      router,
      userInfo,
      addCircleOutline,
      walletOutline,
      trashOutline,
      walletDatas,
      formatTimeDDMM,
      handleSubmit,
      navigate,
      formAdd,
      schemaAddCard,
      formAddValues,
      formatNumber,
      t,
      modules: [Pagination],
      validate,
      checkValidate,
      clickSubmit,
      userCard,
      cardSelected,
      onDelete,
    };
  },
});
