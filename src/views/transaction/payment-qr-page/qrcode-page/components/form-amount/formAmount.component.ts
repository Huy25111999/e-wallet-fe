import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  watchEffect,
} from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";
import { closeCircleOutline } from "ionicons/icons";
import store from "@/vuex/store";
import { IGenerateQrCode, IQrCodeData } from "@/types/transaction";
import { generateQrcode } from "@/api/transaction";

export default defineComponent({
  name: "FormAmount",
  props: ["handleChangeSlide", "onChange"],
  components: { Form, Field, ErrorMessage },
  setup(props, ctx) {
    const customerInfo = computed(() => store.getters.auth.userInfo);

    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const formAmountSchema = Yup.object({
      amount: Yup.number()
        .required(intl("transaction.transaction_qr_get_money_amount_required"))
        .moreThan(9, intl("transaction.transaction_qr_get_money_amount_min"))
        .max(10000, intl("transaction.transaction_qr_get_money_amount_max"))
        .test(
          "greaterThanZero",
          intl("transaction.transaction_qr_get_money_amount_invalid"),
          (value) => Number(value) > 0
        )
        .typeError(intl("transaction.transaction_qr_get_money_amount_required"))
        .nullable(),
      content: Yup.string().max(
        50,
        intl("transaction.transaction_qr_get_money_content_max")
      ),
    });

    const formValues = reactive<IQrCodeData>({
      amount: "",
      content: "",
    });

    const handleSubmit = (values: IQrCodeData) => {
      const params: IGenerateQrCode = {
        amount: Number(values.amount) || "",
        content: values.content,
        account: customerInfo.value.account,
      };

      generateQrcode(params).then((res) => {
        const newQrCodeImage = res.data.data;
        props.onChange(newQrCodeImage);

        props.handleChangeSlide({ indexSlide: 0, time: 0 });
        (document.activeElement as HTMLElement).blur();
      });
    };

    const handleResetValue = (resetField: any, name: string) => {
      resetField();
      if (name === "amount") {
        formValues.amount = "";
      } else {
        formValues.content = "";
      }
      props.onChange(formValues);
    };

    const goBack = () => {
      props.handleChangeSlide({ indexSlide: 0, time: 500 });
    };

    onUnmounted(() => {
      formValues.amount = "";
      formValues.content = "";
    });

    return {
      formValues,
      formAmountSchema,
      closeCircleOutline,
      intl,
      handleSubmit,
      handleResetValue,
      goBack,
    };
  },
});
