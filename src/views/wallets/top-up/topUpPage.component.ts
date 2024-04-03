import { requestUserInfo } from "@/api/profile";
import { requestTopUp } from "@/api/wallet";
import { formatNumber } from "@/helpers/formatHelper";
import { showLoading } from "@/helpers/loadingHelper";
import { presentToast } from "@/helpers/toastHelper";
import router from "@/router";
import { IUserInfo } from "@/types";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  loadingController,
  modalController,
} from "@ionic/vue";
import moment from "moment";
import { Field, Form } from "vee-validate";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import * as Yup from "yup";

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
  },

  setup() {
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

    const store = useStore();
    const formRequest = ref();
    const error = ref(null);
    const formValues = reactive({
      amount: 10,
    });

    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;
    const customerId = computed(() => store.getters.auth.customerId) as any;

    const navigate = (routerUrl: string) => {
      router.push({ path: routerUrl, replace: true });
    };

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    onMounted(() => {
      fetchCustomerInfo();
    });

    const handleTopUp = () => {
      const values = {
        amount: Number(formValues.amount),
        successUrl:
          "http://" + window.location.host + `/tabs/wallets/top-up/success/${formValues.amount}`,
        cancelUrl:
          "http://" + window.location.host + `/tabs/wallets/top-up/error/${formValues.amount}`,
      };
      showLoading();
      const customerId = store.getters.auth.customerId;
      requestTopUp(customerId, values)
        .then((res) => {
          loadingController.dismiss();
          window.open(res.data.url, "_self");
        })
        .catch((err) => {
          loadingController.dismiss();
          presentToast(err.response.data.message.raw.message, "top");
        });
    };

    const validate = (ev) => {
      const value = ev.target.value;
      schemaRequestCode
        .validate({
          amount: value,
        })
        .then(() => {
          error.value = null;
        })
        .catch((err) => {
          error.value = err.message;
        });
    };

    const setValueAmount = (value: number) => {
      formValues.amount = value;
    };

    return {
      t,
      handleTopUp,
      formatNumber,
      userInfo,
      schemaRequestCode,
      formValues,
      setValueAmount,
      formRequest,
      validate,
      error,
      navigate,
    };
  },
});
