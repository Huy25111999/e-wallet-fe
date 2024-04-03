import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import NotificationItem from "./notification-item/NotificationItem.vue";
import {
  IonModal,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { useI18n } from "vue-i18n";
import { filterNotification } from "@/api/notification";

export default defineComponent({
  name: "notificationList",
  components: {
    NotificationItem,
    IonModal,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  props: ["trigger"],
  setup(props, ctx) {
    const store = useStore();
    const { t: intl } = useI18n();
    const customerId = computed(() => store.getters.auth.customerId);

    const pageSize = ref<number>(10);
    const notificationsList: any = computed(
      () => store.getters.notification
    ) as any;

    function loadNotification() {
      filterNotification(customerId.value, {
        page: 1,
        size: pageSize.value + 10,
      }).then((res) => {
        store.dispatch("notification/loadNotification", res.data);
      });
    }

    const modal = ref();

    const ionInfinite = (ev: any) => {
      pageSize.value = pageSize.value + 10;
      loadNotification();

      ev.target.complete();
    };

    const dismiss = () => {
      modal.value.$el.dismiss();
    };

    return {
      intl,
      dismiss,
      ionInfinite,
      modal,
      notificationsList,
    };
  },
});
