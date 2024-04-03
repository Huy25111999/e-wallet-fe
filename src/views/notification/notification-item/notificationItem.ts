import { INotification } from "@/types";
import moment from "moment";
import { defineComponent, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { IonIcon } from "@ionic/vue";
import { chevronForwardOutline } from "ionicons/icons";

export default defineComponent({
  name: "notificationItem",
  components: { IonIcon },
  props: ["item"],
  setup(props, ctx) {
    const CHART_LIMIT = 271;
    const notificationItem = ref<INotification>({});
    const { t: intl } = useI18n();

    const showMore = ref(false);

    const onShowContent = () => {
      showMore.value = true;
    };

    const onHideContent = () => {
      showMore.value = false;
    };

    const formatTime = (time) => {
      return moment(Number(time)).format("YYYY/MM/DD");
    };

    const TRANSACTION_TYPE = {
      TOP_UP: 1,
      TRANSFER: 2,
      WITHDRAW: 3,
      REFUND: 4,
    };

    const getTitle = (type: number) => {
      switch (type) {
        case TRANSACTION_TYPE.TOP_UP:
          return "Top up";
        case TRANSACTION_TYPE.TRANSFER:
          return "Transfer";
        case TRANSACTION_TYPE.WITHDRAW:
          return "Withdraw";
        case TRANSACTION_TYPE.REFUND:
          return "Refund";
      }
    };

    watchEffect(() => {
      notificationItem.value = { ...JSON.parse(props.item.message), createAt: props.item.createAt };
    });

    return {
      notificationItem,
      CHART_LIMIT,
      TRANSACTION_TYPE,
      showMore,
      chevronForwardOutline,
      onShowContent,
      onHideContent,
      formatTime,
      getTitle,
      intl,
    };
  },
});
