import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { useStore } from "vuex";
import { requestDischargeCreateOtp, requestTransactionCreateOtp } from "@/api/transaction";
import { presentToast } from "@/helpers/toastHelper";
import { IUserInfo } from "@/types";
import { useI18n } from "vue-i18n";
import * as Yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { closeCircleOutline } from "ionicons/icons";
import { EVIROMENT } from "@/shared/config/eviroment";
import { IQrCodeData } from "@/types/transaction";
import { useRoute, useRouter } from "vue-router";

export type ICreateOTPTransaction = {
  customerId: string;
  accountFrom: string;
  accountTo: string;
  amount: number;
  content: string;
};

export type ICreateOTPDischarge = {
  receiverKey: string;
};

export default defineComponent({
  name: "scanQRInfo",
  components: { IonPage, IonContent, Form, Field, ErrorMessage },
  props: ["handleChangeSlide", "qrCodeData", "onSubmit", "isDisCharge"],
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const formAmountSchema = Yup.object({
      amount: Yup.number()
        .required(intl("transaction.transaction_qr_get_money_amount_required"))
        .moreThan(9, intl("transaction.transaction_qr_get_money_amount_min"))
        .max(10000, intl("transaction.transaction_qr_get_money_amount_max"))
        .test(
          "greaterThanZero",
          intl("transaction.transaction_qr_get_money_amount_invalid"),
          (value) => Number(value) > 0
        )
        .typeError(intl("transaction.transaction_qr_get_money_amount_required"))
        .nullable(),
      content: Yup.string().max(50, intl("transaction.transaction_qr_get_money_content_max")),
    });

    const formValues = reactive<IQrCodeData>({
      amount: "",
      content: "",
    });

    const userInfo = computed(() => store.getters.auth.userInfo);
    const disabledFormAmount = computed(() => {
      if (props?.qrCodeData?.amount) {
        return false;
      } else if (route.query?.price) {
        return false;
      }
      return true;
    });

    const goBack = () => {
      props.handleChangeSlide({ indexSlide: 0, time: 500 });
    };

    const handleCreateOtpTransaction = () => {
      const requestPamras: ICreateOTPTransaction = {
        customerId: store.getters.auth.customerId,
        accountFrom: store.getters.auth.userInfo.account,
        accountTo: props.qrCodeData.account,
        amount: Number(formValues.amount ? formValues.amount : props.qrCodeData.amount),
        content: formValues.content ? formValues.content : props?.qrCodeData?.content,
      };

      // SEND REQUEST TO SERVER
      requestTransactionCreateOtp(requestPamras)
        .then((res) => {
          props.handleChangeSlide({
            indexSlide: 2,
            time: 500,
            data: { ...requestPamras, otpToken: res.data.otpToken },
          });
          formValues.amount = "";
          formValues.content = "";
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode, "top");
          }
          props.onSubmit();
        })
        .catch((error) => {
          presentToast(error.response.data.message, "top");
        });
    };

    const handleCreateOtpDisCharge = () => {
      const requestPamras: ICreateOTPDischarge = {
        receiverKey: route?.query?.receiverKey as string,
      };

      // SEND REQUEST TO SERVER
      requestDischargeCreateOtp(requestPamras)
        .then((res) => {
          props.handleChangeSlide({
            indexSlide: 2,
            time: 500,
            data: {
              ...requestPamras,
              otpToken: res.data.otpToken,
              phone: res.data.phone,
            },
          });
          formValues.amount = "";
          formValues.content = "";
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode, "top");
          }
          props.onSubmit();
        })
        .catch((error) => {
          presentToast(error.response.data.message.message, "top");
        });
    };

    const handleCreateOtp = () => {
      if (props.isDisCharge) {
        handleCreateOtpDisCharge();
      } else {
        handleCreateOtpTransaction();
      }
    };

    watchEffect(() => {
      formValues.amount = route.query.price as string;
    });

    return {
      formValues,
      disabledFormAmount,
      route,
      formAmountSchema,
      userInfo,
      closeCircleOutline,
      router,
      store,
      intl,
      goBack,
      handleCreateOtp,
    };
  },
});
