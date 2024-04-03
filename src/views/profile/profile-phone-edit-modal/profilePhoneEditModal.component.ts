import InputField from "@/common/_controls/InputField.vue";
import ModalBreakpoint from "@/components/ModalBreakpoint.vue";
import { countries } from "@/shared/config/const";
import { Field, Form } from "vee-validate";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import * as Yup from "yup";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  loadingController,
  modalController,
  IonModal,
} from "@ionic/vue";
import { IParamsUpdatePhone } from "@/types";
import { useStore } from "vuex";
import { requestUserInfo, updatePhone } from "@/api/profile";
import { useToastify } from "@/helpers/useToastify";

export default defineComponent({
  components: {
    ModalBreakpoint,
    InputField,
    Form,
    Field,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonSelect,
    IonSelectOption,
    loadingController,
    modalController,
    IonModal,
  },
  props: ["refPhoneModal"],
  setup(props) {
    const INIT_COUNTRY_CODE = "1";
    const { t: intl } = useI18n();
    const store = useStore();
    const toastify = useToastify();

    const schemaRequestCode = Yup.object({
      phone: Yup.string()
        .required(intl("profile.phone.error.phone-number-require"))
        .min(9, intl("profile.phone.error.phone-number-min"))
        .max(20, intl("profile.phone.error.phone-number-max")),
    });

    const userInfo = computed(() => store.getters.auth.userInfo) as any;
    const customerId = computed(() => store.getters.auth.customerId) as any;

    const modal = ref();
    const formInit = reactive({
      phone: "",
      countryCode: INIT_COUNTRY_CODE,
    });

    const resetFormValues = () => {
      formInit.phone = "";
      formInit.countryCode = INIT_COUNTRY_CODE;
    };

    const handleSelectCountry = (countryCode: string) => {
      formInit.countryCode = countryCode;
      modalController.dismiss();
    };

    const getFlag = () => {
      const selectedCountry = countries.find((e) => e.value == formInit.countryCode);
      if (selectedCountry) {
        return selectedCountry.flag;
      } else {
        return "vn.svg";
      }
    };

    const getCountryNumber = () => {
      const selectedCountry = countries.find((e) => e.value == formInit.countryCode);
      if (selectedCountry) {
        return selectedCountry.value;
      } else {
        return INIT_COUNTRY_CODE;
      }
    };
    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    const handleSubmit = (values) => {
      const requestBody: IParamsUpdatePhone = {
        phone: values.phone,
        countryCode: formInit.countryCode,
        userId: userInfo.value.id,
      };
      updatePhone(requestBody)
        .then((res: any) => {
          if (res.status === 200) {
            fetchCustomerInfo();
            toastify.showSuccess(intl("common.update_success"));
          } else {
            toastify.showSuccess(intl("common.update_failed"));
          }
        })
        .finally(() => {
          modal.value.$el.dismiss();
        });
    };

    watchEffect(() => {
      if (userInfo.value && modal.value) {
        formInit.phone = userInfo?.value?.phone?.replace(userInfo?.value?.countryCode, "");
        formInit.countryCode = userInfo?.value?.countryCode || INIT_COUNTRY_CODE;
      } else {
        resetFormValues();
      }
    });

    return {
      modal,
      formInit,
      countries,
      schemaRequestCode,
      intl,
      getFlag,
      handleSubmit,
      resetFormValues,
      getCountryNumber,
      handleSelectCountry,
    };
  },
});
