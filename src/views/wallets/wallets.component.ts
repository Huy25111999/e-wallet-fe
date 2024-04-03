import { requestUserInfo } from "@/api/profile";
import { deleteCard, requestAddBank, requestAddCard } from "@/api/wallet";
import InputField from "@/common/_controls/InputField.vue";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
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
import { computed, defineComponent, reactive, ref } from "vue";
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
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const walletDatas = computed(() => store.getters.wallet.wallets);
    const customerId = store.getters.auth.customerId;
    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;
    const formAdd = ref();
    const modalDeleteRef = ref();
    const cardSelected = ref();

    const { t } = useI18n({
      inheritLocale: true,
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

    const formAddValues = reactive({
      account_number: "",
      account_name: "",
      swiftCode: "",
      bankName: "",
    });

    const resetFormValues = () => {
      formAddValues.account_number = "";
      formAddValues.account_name = "";
      formAddValues.swiftCode = "";
      formAddValues.bankName = "";
    };

    const loadUserData = () => {
      if (customerId)
        requestUserInfo(customerId).then((res) => {
          store.dispatch("auth/getInfo", res.data);
        });
    };
    const navigate = (url) => {
      void router.replace(url);
    };
    const handleSubmit = (values) => {
      schemaAddCard.validate(values).then(() => {
        const value = {
          customerId: customerId,
          cardNo: formAddValues.account_number,
          accountName: formAddValues.account_name,
          swiftCode: formAddValues.swiftCode,
          bankName: formAddValues.bankName,
        };
        showLoading();
        requestAddBank(value)
          .then((res) => {
            loadingController.dismiss();
            loadUserData();
            modalController.dismiss();
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

    const checkValidate = ref({
      cardNumber: false,
      cardExpYear: false,
      cardCVC: false,
      cardName: false,
      cardEmail: false
    });
    const validate = (field) =>{
      checkValidate.value[field] = true;
      schemaAddCard.validateAt(field, schemaAddCard[field])
  }

    const onSelectCard = (card) => {
      cardSelected.value = card;
      modalDeleteRef.value.$el.present();
    };

    const deleteCardFn = () => {
      const data = {
        customerId: customerId,
        cardNo: cardSelected.value?.cardNo,
        accountName: cardSelected.value?.accountName,
        bankName: cardSelected.value?.name || cardSelected.value?.bankName,
        swiftCode: cardSelected.value?.swiftCode,
      };
      showLoading();
      deleteCard(data)
        .then(() => {
          cardSelected.value = null;
          loadingController.dismiss();
          loadUserData();
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
      checkValidate
    };
  },
});
