import { generateQrcode } from "@/api/transaction";
import { IUserInfo } from "@/types";
import { IGenerateQrCode, IQrCodeData } from "@/types/transaction";
import { IonContent, IonPage, IonSlides, IonSlide } from "@ionic/vue";
import QrcodeVue from "qrcode.vue";
import { computed, defineComponent, onBeforeMount, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import FormAmount from "./components/form-amount/FormAmount.vue";

type ISlide = {
  indexSlide: number;
  time: number;
};

export default defineComponent({
  name: "PaymentPage",
  components: {
    QrcodeVue,
    IonContent,
    IonPage,
    FormAmount,
    IonSlides,
    IonSlide,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const slidesRef = ref();
    const qrCodeImage = ref("");

    const userInfo = computed(() => store.getters.auth.userInfo) as any;

    const qrCodeValues = ref<IQrCodeData>({
      fullName: store.getters.auth.userInfo.full_name || "",
      accountTo: store.getters.auth.userInfo.account,
      amount: "",
    });

    const onQrCodeImageChange = (newQrCodeImage: string) => {
      qrCodeImage.value = newQrCodeImage;
    };

    const goBack = () => {
      router.back();
    };

    const onGenerateQrCode = () => {
      const params: IGenerateQrCode = {
        account: userInfo.value.account,
      };
      generateQrcode(params).then((res) => {
        qrCodeImage.value = res.data.data;
      });
    };

    onBeforeMount(() => {
      onGenerateQrCode();
    });

    const handleChangeSlide = (params: ISlide) => {
      slidesRef.value.$el.slideTo(params.indexSlide, params.time);
    };

    return {
      handleChangeSlide,
      onQrCodeImageChange,
      goBack,
      intl,
      slidesRef,
      userInfo,
      qrCodeValues,
      qrCodeImage,
    };
  },
});
