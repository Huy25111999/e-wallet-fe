import {
  requestDischargeCreateOtp,
  requestDischargeVerifyOtp,
  requestTransactionCreateOtp,
  requestTransactionVerifyOtp,
} from "@/api/transaction";
import { presentToast } from "@/helpers/toastHelper";
import { EVIROMENT } from "@/shared/config/eviroment";
import { IUserInfo } from "@/types";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import VOtpInput from "vue3-otp-input";
import { useStore } from "vuex";
import { ICreateOTPDischarge, ICreateOTPTransaction } from "../scan-qr-info/scanQrInfo.component";
import { useRoute } from "vue-router";

export type paramsVerify = {
  customerId: string;
  accountFrom: string;
  accountTo: string;
  amount: number;
  otpCode: string;
  otpToken: string;
  phone: string;
};

export type paramsDischargeVerify = {
  receiverKey: string;
  price: number;
  otpCode?: string;
  appKey: string;
  otpToken?: string;
  phone?: string;
  currency?: string;
  fromWhere?: string;
};

export default defineComponent({
  name: "VerifyOtpPage",
  props: [
    "handleChangeSlide",
    "isDisCharge",
    "qrCodeData",
    "onSaveSuccess",
    "isSubmitted",
    "resetOnSubmit",
  ],
  components: { VOtpInput },
  setup(props, ctx) {
    const store = useStore();
    const route = useRoute();
    const otpInputValue = reactive({
      otpCode: "",
      otpToken: "",
    });

    const countDownRef = ref();
    const otpInputRef = ref();
    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;
    const resendOtp = reactive({
      time: 30000,
      isEnd: false,
    });

    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const handleOnComplete = (otpCode: string) => {
      otpInputValue.otpCode = otpCode;
    };

    const handleOnChange = (otpCode: string) => {
      otpInputValue.otpCode = otpCode;
    };

    const goBack = () => {
      props.handleChangeSlide({ indexSlide: 1, time: 500 });
    };

    const otpValidLength = computed(() => otpInputValue.otpCode.trim().length < 6);

    const resendCodeTransactionFn = (isResend?: boolean) => {
      const requestParams: ICreateOTPTransaction = {
        customerId: store.getters.auth.customerId,
        accountFrom: store.getters.auth.userInfo.account,
        accountTo: props.qrCodeData.accountTo,
        amount: Number(props.qrCodeData.amount),
        content: props?.qrCodeData?.content,
      };

      requestTransactionCreateOtp(requestParams)
        .then((res) => {
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode, "top");
          }
          otpInputValue.otpToken = res.data.otpToken;
        })
        .catch((error) => {
          presentToast(error.response.data.message, "top");
        })
        .finally(() => {
          if (isResend) {
            otpInputRef.value?.clearInput();
            resendOtp.isEnd = false;
          }
        });
    };

    const resendCodeDischargeFn = (isResend?: boolean) => {
      const requestParams: ICreateOTPDischarge = {
        receiverKey: route.query.receiverKey as string,
      };

      requestDischargeCreateOtp(requestParams)
        .then((res) => {
          if (process.env.VUE_APP_NODE_ENV === EVIROMENT) {
            presentToast(res.data.otpCode, "top");
          }
          otpInputValue.otpToken = res.data.otpToken;
        })
        .catch((error) => {
          presentToast(error.response.data.message, "top");
        })
        .finally(() => {
          if (isResend) {
            otpInputRef.value?.clearInput();
            resendOtp.isEnd = false;
          }
        });
    };

    const handleTransaction = async () => {
      const dataMessage = {
        success: false,
        message: "",
      };

      const requestParams: paramsVerify = {
        customerId: store.getters.auth.customerId,
        accountFrom: store.getters.auth.userInfo.account,
        accountTo: props.qrCodeData.accountTo,
        amount: Number(props.qrCodeData.amount),
        otpCode: otpInputValue.otpCode || props.qrCodeData.otpCode,
        otpToken: otpInputValue.otpToken || props.qrCodeData.otpToken,
        phone: store.getters.auth.userInfo.phone,
      };

      await requestTransactionVerifyOtp(requestParams)
        .then((res: any) => {
          dataMessage.success = true;
          //load profile data
          props.onSaveSuccess();
        })
        .catch((error) => {
          dataMessage.success = false;
          dataMessage.message = error.response.data.message;
        })
        .finally(() => {
          props.resetOnSubmit();
          otpInputRef.value?.clearInput();
          otpInputValue.otpCode = "";
        });

      props.handleChangeSlide({ indexSlide: 3, time: 500, data: dataMessage });
    };

    const handleDischarge = async () => {
      const dataMessage = {
        success: false,
        message: "",
      };

      const requestParams: paramsDischargeVerify = {
        appKey: route?.query?.appKey as string,
        price: Number(route?.query?.price),
        otpCode: otpInputValue.otpCode || props.qrCodeData.otpCode,
        otpToken: otpInputValue.otpToken || props.qrCodeData.otpToken,
        phone: props.qrCodeData.phone,
        receiverKey: route?.query?.receiverKey as string,
        currency: route?.query?.currency as string,
      };

      await requestDischargeVerifyOtp(requestParams)
        .then((res) => {
          dataMessage.success = true;
          if (route?.query?.fromWhere) {
            window.opener.postMessage(res.data, String(route?.query?.fromWhere));
          }

          //load profile data
          // props.onSaveSuccess();
        })
        .catch((error) => {
          dataMessage.success = false;
          dataMessage.message = error.response.data.message;
        })
        .finally(() => {
          props.resetOnSubmit();
          otpInputRef.value?.clearInput();
          otpInputValue.otpCode = "";
        });

      props.handleChangeSlide({ indexSlide: 3, time: 500, data: dataMessage });
    };

    const handleSubmit = async () => {
      if (props.isDisCharge) {
        handleDischarge();
      } else {
        handleTransaction();
      }
    };

    const onOtpEnd = () => {
      resendOtp.isEnd = true;
    };

    const onReTakeOtp = () => {
      resendOtp.isEnd = false;
      countDownRef.value.restart();
      handleCreateOtp();
    };

    const handleCreateOtp = () => {
      if (props.isDisCharge) {
        resendCodeDischargeFn(true);
      } else {
        resendCodeTransactionFn(true);
      }
    };

    return {
      otpInputValue,
      userInfo,
      resendOtp,
      countDownRef,
      otpInputRef,
      handleOnChange,
      handleSubmit,
      goBack,
      otpValidLength,
      intl,
      handleOnComplete,
      handleCreateOtp,
      onReTakeOtp,
      onOtpEnd,
    };
  },
});
