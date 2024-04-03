import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
import QrcodeVue from "qrcode.vue";
import { IonContent, IonIcon, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IUserInfo } from "@/types";
import { formatToDollar } from "@/helpers/moneyHelper";
import { useI18n } from "vue-i18n";
import { IGenerateQrCode, IQrCodeData } from "@/types/transaction";
import {
  formatNumber,
  formatNumberEN_IN,
  formatTimeDDMM,
} from "@/helpers/formatHelper";
import { generateQrcode } from "@/api/transaction";

export default defineComponent({
  name: "PaymentPage",
  components: {
    QrcodeVue,
    IonContent,
    IonIcon,
    IonPage,
  },
  setup(props) {
    const userInfo = computed(() => store.getters.auth.userInfo) as any;

    const router = useRouter();
    const store = useStore();
    const qrCodeImage = ref<string>("");

    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const onQrCodeImageChange = (newQrCodeImage: string) => {
      qrCodeImage.value = newQrCodeImage;
    };

    const onGenerateQrCode = () => {
      const params: IGenerateQrCode = {
        account: userInfo.value.account,
      };
      generateQrcode(params).then((res) => {
        onQrCodeImageChange(res.data.data);
      });
    };

    onBeforeMount(() => {
      onGenerateQrCode();
    });

    const goToScanQR = () => {
      router.push("scanqr");
    };

    // qrCodeData,
    return {
      qrCodeImage,
      userInfo,
      router,
      intl,
      goToScanQR,
      formatToDollar,
      formatNumber,
    };
  },
});
