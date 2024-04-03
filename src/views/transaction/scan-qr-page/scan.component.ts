import { requestUserInfo } from "@/api/profile";
import { useToastify } from "@/helpers/useToastify";
import { IQrCodeData } from "@/types/transaction";
import { IonContent, IonIcon, IonPage, IonSlide, IonSlides } from "@ionic/vue";
import { addOutline, chevronForwardOutline, qrCodeOutline, scanOutline } from "ionicons/icons";
import { computed, defineComponent, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { QrcodeCapture, QrcodeStream } from "vue3-qrcode-reader";
import { useStore } from "vuex";
import TransactionResult from "../transaction-result/TransactionResult.vue";
import ScanQrInfo from "./scan-qr-info/ScanQrInfo.vue";
import FormVerifyOtp from "./verify-otp/VerifyOtpPage.vue";
import { paramsDischargeVerify } from "./verify-otp/verifyOtp.component";
type ISlide = {
  indexSlide: number;
  time: number;
  data?: {
    message?: string;
    true?: string;
    customerId?: string;
    accountFrom?: string;
    accountTo?: string;
    amount?: number;
  };
};

export default defineComponent({
  name: "ScanPage",
  components: {
    IonPage,
    IonContent,
    IonIcon,
    QrcodeStream,
    QrcodeCapture,
    ScanQrInfo,
    FormVerifyOtp,
    IonSlides,
    IonSlide,
    TransactionResult,
  },

  setup(props) {
    const cameraType = {
      AUTO: "auto",
      OFF: "off",
    };

    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const slidesRef = ref();
    const qrCodeData = ref<IQrCodeData>();
    const isSubmitted = ref(false);
    const isDisCharge = ref<boolean>(false);

    //variable/select-qrcode from device
    const isInitDecode = ref(true);
    const qrCodeCaptureRef = ref();
    const inputQrCaptureRef = ref();

    const cameraStatus = reactive({
      isShowing: true,
      camera: cameraType.AUTO,
      isValid: undefined as any,
      torchActive: false,
    });

    const customerId = computed(() => store.getters.auth.customerId);

    const { t: intl } = useI18n({
      inheritLocale: true,
    });
    const toastify = useToastify();

    const handleChangeSlide = (params: ISlide) => {
      if (params.data) {
        qrCodeData.value = { ...qrCodeData.value, ...params.data } as any;
      }

      slidesRef.value && slidesRef.value.$el.slideTo(params.indexSlide, params.time);
      //turn off torch after change slide
      cameraStatus.torchActive = false;

      if (params.indexSlide === 0) {
        isInitDecode.value = true;
      }
    };

    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    const turnCameraOn = () => {
      cameraStatus.camera = cameraType.AUTO;
      cameraStatus.isShowing = true;
    };

    const turnCameraOff = () => {
      cameraStatus.camera = cameraType.OFF;
      cameraStatus.isShowing = false;
    };

    //when scan qrcode from stream
    const onDetect = async (promise: any) => {
      //time scan
      await timeout(1000);

      const { content } = await promise;

      turnCameraOff();

      if (content && isJsonString(content)) {
        cameraStatus.isValid = true;

        const qrCodeContent = JSON.parse(content) as IQrCodeData;
        qrCodeData.value = qrCodeContent;

        if (
          customerId.value === qrCodeContent.customerId ||
          qrCodeData.value?.accountTo === customerId.value
        ) {
          cameraStatus.isValid === false;
          //time before open camera
          await timeout(500);
          turnCameraOn();
          return;
        }

        handleChangeSlide({ indexSlide: 1, time: 500 });
      } else {
        cameraStatus.isValid = false;
      }

      await timeout(1000);
      turnCameraOn();
    };

    const validationFailure = computed(() => {
      return cameraStatus.isValid === false;
    });

    const validationPending = computed(() => {
      return cameraStatus.isValid === undefined && cameraStatus.camera === cameraType.OFF;
    });

    const onSelectQrCodeImage = () => {
      inputQrCaptureRef.value.click();
    };

    const onUploadQrCodeCapture = (event) => {
      qrCodeCaptureRef.value.onChangeInput(event);
    };

    const onResetFile = (event) => {
      event.target.value = "";
    };

    //when scan qrcode from image
    const onDecode = (result) => {
      qrCodeData.value = JSON.parse(result);
      handleChangeSlide({ indexSlide: 1, time: 500 });
      // isInitDecode.value = false;
    };

    const onInit = async (promise: any) => {
      try {
        const { capabilities } = await promise;
        // successfully initialized
      } catch (error: any) {
        // presentToast(error, "top");
        if (error.name === "NotAllowedError") {
          // user denied camera access permisson
        } else if (error.name === "NotFoundError") {
          // no suitable camera device installed
        } else if (error.name === "NotSupportedError") {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === "NotReadableError") {
          // may9be camera is already in use
        } else if (error.name === "OverconstrainedError") {
          // did you requested the front camera although there is none?
        } else if (error.name === "StreamApiNotSupportedError") {
          // browser seems to be lacking features
        }
      } finally {
        // hide loading indicator
      }
    };

    const toggleTorch = () => {
      cameraStatus.torchActive = !cameraStatus.torchActive;
    };

    const onSubmit = () => {
      isSubmitted.value = true;
    };

    const resetOnSubmit = () => {
      isSubmitted.value = false;
    };

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    const onSaveSuccess = () => {
      fetchCustomerInfo();
    };

    const goToPaymentQR = () => {
      router.push({ path: "paymentqr" });
    };

    watch(route, () => {
      if (route.path !== "/tabs/transaction/scanqr") {
        handleChangeSlide({ indexSlide: 0, time: 0 });
        qrCodeData.value = undefined;
      }

      cameraStatus.isShowing = !cameraStatus.isShowing;
    });

    watchEffect(() => {
      if (Object.keys(route.query).length > 0 && route.path === "/tabs/transaction/scanqr") {
        handleChangeSlide({ indexSlide: 1, time: 0 });
        isDisCharge.value = true;
      } else if (
        route.path === "/tabs/transaction/scanqr" &&
        Object.keys(route.query).length === 0
      ) {
        store.dispatch("transaction/removeDischargeInfo");
        isDisCharge.value = false;
      }
    });

    return {
      onDetect,
      onInit,
      goToPaymentQR,
      handleChangeSlide,
      intl,
      onSaveSuccess,
      onDecode,
      onSubmit,
      resetOnSubmit,
      onSelectQrCodeImage,
      toggleTorch,
      onUploadQrCodeCapture,
      onResetFile,
      isDisCharge,
      isInitDecode,
      inputQrCaptureRef,
      cameraStatus,
      isSubmitted,
      slidesRef,
      qrCodeData,
      router,
      qrCodeCaptureRef,
      validationFailure,
      cameraType,
      validationPending,
      // icon
      chevronForwardOutline,
      addOutline,
      scanOutline,
      qrCodeOutline,
    };
  },
});
