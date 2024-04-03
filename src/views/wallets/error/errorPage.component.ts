import { requestUserInfo } from "@/api/profile";
import { formatNumber } from "@/helpers/formatHelper";
import router from "@/router";
import { IUserInfo } from "@/types";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
} from "@ionic/vue";
import moment from "moment";
import { Field, Form } from "vee-validate";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

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
    IonTitle,
    IonBackButton,
    IonButtons,
    IonItem,
  },

  setup() {
    const route = useRoute();
    const { t } = useI18n({
      inheritLocale: true,
    });
    const store = useStore();

    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;

    const navigate = (routerUrl: string) => {
      router.push({ path: routerUrl, replace: true });
    };

    const formatTime = (time) => {
      return moment(Number(time) * 1000).format("YYYY/MM/DD HH:mm A");
    };

    return {
      t,
      formatNumber,
      userInfo,
      route,
      formatTime,
      navigate,
    };
  },
});
