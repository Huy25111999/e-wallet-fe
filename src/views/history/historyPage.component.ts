import { loadHistoryList } from "@/api/history";
import ModalDelete from "@/components/ModalDelete.vue";
import { formatDateToDayMonthYearNameShort, getNameMY } from "@/helpers/formatHelper";
import { showLoading } from "@/helpers/loadingHelper";
import useDebouncedRef from "@/helpers/useDebouncedRef";
import {
  IonAlert,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonModal,
  IonPage,
  loadingController,
} from "@ionic/vue";
import {
  addOutline,
  arrowBackOutline,
  chevronBackOutline,
  chevronDown,
  removeOutline,
} from "ionicons/icons";
import moment from "moment";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import TransactionCard from "./transaction-card/transaction-card.vue";
import { formatNumber } from "@/helpers/formatHelper";

export default defineComponent({
  name: "HistoryPage",
  components: {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonCardHeader,
    ModalDelete,
    IonInput,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    loadingController,
    IonAlert,
    TransactionCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    getNameMY,
    formatDateToDayMonthYearNameShort,
  },
  setup() {
    const { t: intl } = useI18n();

    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const query = useDebouncedRef("", 400);
    const fromDate = ref<Date>(moment().subtract(30, "days").startOf("days").toDate());
    const toDate = ref<Date>(moment().endOf("days").toDate());
    const filter = ref<string>("all");
    const showHistory = ref<boolean>(false);
    const type = ref<any>(null);
    const moneyVolatility = reactive({
      amountTotalMinus: 0,
      amountTotalPlus: 0,
    });

    const pagination = reactive({
      page: 1,
      size: 10,
    });

    const listTransactions = computed(() => store.getters.history.history);

    const total = computed(() => store.getters.history.total) as any;
    const customerId = computed(() => store.getters.auth.customerId);
    const onBtnHistoryClick = () => {
      showHistory.value = !showHistory.value;
    };

    function formatDateToDayMonthName(date: Date) {
      return moment(date).format("DD") + " " + moment(date).format("MMMM");
    }

    function formatDateToDayMonthYearName(date: Date) {
      return (
        moment(date).format("DD") +
        " " +
        moment(date).format("MMMM") +
        " " +
        moment(date).format("YYYY")
      );
    }

    const getMoneyVolatility = () => {
      const params = {
        status: 1,
        dateFrom: fromDate.value.getTime(),
        dateTo: toDate.value.getTime(),
        page: pagination.page,
        size: pagination.size,
      };

      loadHistoryList(customerId.value, params).then((res) => {
        moneyVolatility.amountTotalMinus = res.data.amountTotalMinus;
        moneyVolatility.amountTotalPlus = res.data.amountTotalPlus;
      });
    };

    const loadHistory = () => {
      if (!customerId.value) return;
      showLoading();
      const params = {
        status: 1,
        dateFrom: fromDate.value.getTime(),
        dateTo: toDate.value.getTime(),
        type: type.value ? type.value : null,
        page: pagination.page,
        size: pagination.size,
      };

      loadHistoryList(customerId.value, params)
        .then((res) => {
          store.dispatch("history/loadHistory", res.data);
        })
        .finally(() => {
          loadingController.dismiss();
        });
    };

    watchEffect(() => {
      if (!customerId.value) return;
      getMoneyVolatility();
    });

    function filterIcon(typeName: string, typeFilter: number) {
      type.value = typeFilter;
      filter.value = typeName;
      loadHistory();
    }

    function pre() {
      toDate.value = moment(toDate.value).subtract(1, "months").endOf("months").toDate();
      fromDate.value = moment(fromDate.value).subtract(1, "months").startOf("months").toDate();
      loadHistory();
    }

    function next() {
      toDate.value = moment(toDate.value).add(1, "months").endOf("months").toDate();
      fromDate.value = moment(fromDate.value).add(1, "months").startOf("months").toDate();
      loadHistory();
    }

    const ionInfinite = (ev: any) => {
      pagination.size = pagination.size + 10;

      if (pagination.size > total.value) {
        pagination.size = total.value;
      }

      loadHistory();
      ev.target.complete();
    };

    watch(route, () => {
      fromDate.value = moment().subtract(30, "days").startOf("days").toDate();
      toDate.value = moment().endOf("days").toDate();
      filter.value = "all";
      showHistory.value = false;
      type.value = null;
      moneyVolatility.amountTotalMinus = 0;
      moneyVolatility.amountTotalPlus = 0;
    });

    return {
      router,
      showHistory,
      fromDate,
      toDate,
      store,
      type,
      listTransactions,
      query,
      moment,
      IonIcon,
      arrowBackOutline,
      chevronDown,
      addOutline,
      removeOutline,
      chevronBackOutline,
      moneyVolatility,
      filter,
      pre,
      next,
      onBtnHistoryClick,
      formatDateToDayMonthYearName,
      formatDateToDayMonthName,
      formatNumber,
      filterIcon,
      getNameMY,
      formatDateToDayMonthYearNameShort,
      ionInfinite,
      intl,
    };
  },
});
