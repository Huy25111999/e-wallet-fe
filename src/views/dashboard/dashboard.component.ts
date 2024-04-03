import { filterNotification, getGuideList, updateStatusNotifications } from "@/api/notification";
import { formatNumber } from "@/helpers/formatHelper";
import { formatToDollar } from "@/helpers/moneyHelper";
import { IUpdateStatusNotification, IUserInfo } from "@/types";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonSlide,
  IonSlides,
  IonModal,
} from "@ionic/vue";
import {
  addCircleOutline,
  camera,
  helpCircleOutline,
  notifications,
  qrCode,
  scanCircle,
  trailSignOutline,
} from "ionicons/icons";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { computed, defineComponent, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ModalNotification from "../notification/ModalNotification.vue";
import GuideSlideItem from "@/views/dashboard/components/guide-item-slide/GuideItemSlide.vue";

export default defineComponent({
  name: "DashboardPage",
  components: {
    IonContent,
    IonPage,
    IonIcon,
    Swiper,
    SwiperSlide,
    IonCol,
    IonGrid,
    IonRow,
    IonSlides,
    IonPopover,
    IonList,
    IonItem,
    ModalNotification,
    IonModal,
    GuideSlideItem,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const userInfo: IUserInfo = computed(() => store.getters.auth.userInfo) as any;
    const notificationsList = computed(() => store.getters.notification) as any;
    const guides = computed(() => store.getters.guide.guides) as any;
    const customerId = computed(() => store.getters.auth.customerId);

    const { t } = useI18n({
      inheritLocale: true,
      flatJson: false,
      warnHtmlMessage: true,
    });

    const handleRouter = (url: string) => {
      router.replace(url);
    };

    function loadNotification() {
      filterNotification(customerId.value, {
        page: 1,
        size: 10,
      }).then((res) => {
        store.dispatch("notification/loadNotification", res.data);
      });
    }

    function loadGuideList() {
      const params = {
        keyTitleSearch: "",
        status: 1,
        page: 0,
        size: 10,
      };
      getGuideList(params).then((res) => {
        store.dispatch("guide/loadGuides", res.data);
      });
    }

    const handleUpdateStatusNotification = () => {
      const ids = notificationsList.value.notification.map(
        (notificationItem) => notificationItem.id
      );

      if (ids.length === 0) return;

      const params: IUpdateStatusNotification = {
        ids,
        status: 1,
      };

      updateStatusNotifications(params).then((res) => {
        loadNotification();
      });
    };

    onMounted(() => {
      loadGuideList();
    });

    return {
      userInfo,
      formatToDollar,
      addCircleOutline,
      camera,
      qrCode,
      scanCircle,
      trailSignOutline,
      notifications,
      helpCircleOutline,
      Swiper,
      router,
      notificationsList,
      guides,
      formatNumber,
      t,
      handleRouter,
      modules: [Pagination],
      handleUpdateStatusNotification,
    };
  },
});
