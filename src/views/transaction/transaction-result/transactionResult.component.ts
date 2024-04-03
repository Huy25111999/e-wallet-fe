import { IUserInfo } from "@/types";
import { IonContent, IonPage } from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export type paramsCreate = {
  customerId: string;
  accountFrom: string;
  accountTo: string;
  amount: number;
};

export default defineComponent({
  name: "VerifyOtpSuccess",
  components: { IonPage, IonContent },
  props: ["handleChangeSlide", "qrCodeData"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;

    const handleTryAgain = () => {
      props.handleChangeSlide({ indexSlide: 2, time: 500 });
    };

    const goBack = () => {
      router.push({ path: "/tabs/transaction/scanqr", replace: true });
    };

    return { router, route, userInfo, intl, handleTryAgain, goBack };
  },
});
