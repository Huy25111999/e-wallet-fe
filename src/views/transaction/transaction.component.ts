import { IonContent, IonIcon, IonPage, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { TRANSACTION_TYPE } from "./const";

export default defineComponent({
  name: "TransactionPage",
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonRouterOutlet,
  },

  setup() {
    const transactionSelected = ref(TRANSACTION_TYPE.QR_CODE);

    const handleSelectTransaction = (option: string) => {
      transactionSelected.value = option;
    };

    return {
      handleSelectTransaction,
      transactionSelected,
    };
  },
});
