import * as actions from "@/api/verification";
import InputDatePicker from "@/common/_controls/InputDatePicker.vue";
import InputField from "@/common/_controls/InputField.vue";
import InputRadio from "@/common/_controls/InputRadio.vue";
import { dataURLtoFile } from "@/helpers/fileHelper";
import { showLoading } from "@/helpers/loadingHelper";
import { presentToast } from "@/helpers/toastHelper";
import { usePhoto } from "@/helpers/usePhoto";
import { useToastify } from "@/helpers/useToastify";
import { useVideo } from "@/helpers/useVideo";
import { IVerification, IVerificationFile } from "@/types";
import store from "@/vuex/store";
import { IonCol, IonGrid, IonRow, loadingController } from "@ionic/vue";
import { Field, Form } from "vee-validate";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import { saveFileToS3Buket } from "@/shared/config/utils";
import { requestUserInfo } from "@/api/profile";
export default defineComponent({
  name: "VerificationUser",
  components: {
    Form,
    InputField,
    InputDatePicker,
    InputRadio,
    IonGrid,
    IonRow,
    IonCol,
    Field,
  },
  props: ["photos", "verificationSelected"],
  setup(props) {
    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const verificationPassportSchema = Yup.object().shape({
      passportNo: Yup.string()
        .required(intl("kyc.kyc_passport_required"))
        .max(50, intl("kyc.kyc_passport_character")),
      first_name: Yup.string()
        .required(intl("kyc.kyc_first_name_required"))
        .max(50, intl("kyc.kyc_first_name_character")),
      last_name: Yup.string()
        .required(intl("kyc.kyc_last_name_required"))
        .max(50, intl("kyc.kyc_last_name_character")),
      nationality: Yup.string()
        .required(intl("kyc.kyc_nationality_required"))
        .max(50, intl("kyc.kyc_nationality_character")),
      place_of_birth: Yup.string()
        .required(intl("kyc.kyc_place_of_birth_required"))
        .max(50, intl("kyc.kyc_place_of_birth_character")),
      date_of_birth: Yup.date().required(intl("kyc.kyc_date_of_birth_required")).nullable(),
      date_of_issue: Yup.date().required(intl("kyc.kyc_date_of_issue_required")).nullable(),
      date_of_expiry: Yup.date()
        .required(intl("kyc.kyc_date_of_expiry_required"))
        .when("date_of_issue", (date_of_issue, schema) => {
          if (date_of_issue) {
            const dayAfter = new Date(date_of_issue.getTime() + 86400000);
            return schema.min(dayAfter, intl("kyc.kyc_date_of_expiry_invalid"));
          }
          return schema;
        }),
    });

    const verificationDocumentSchema = Yup.object().shape({
      documentNo: Yup.string()
        .required(intl("kyc.kyc_document_required"))
        .max(50, intl("kyc.kyc_document_character")),
      first_name: Yup.string()
        .required(intl("kyc.kyc_first_name_required"))
        .max(50, intl("kyc.kyc_first_name_character")),
      last_name: Yup.string()
        .required(intl("kyc.kyc_last_name_required"))
        .max(50, intl("kyc.kyc_last_name_character")),
      nationality: Yup.string()
        .required(intl("kyc.kyc_nationality_required"))
        .max(50, intl("kyc.kyc_nationality_character")),
      place_of_birth: Yup.string()
        .required(intl("kyc.kyc_place_of_birth_required"))
        .max(50, intl("kyc.kyc_place_of_birth_character")),
      date_of_birth: Yup.date().required(intl("kyc.kyc_date_of_birth_required")).nullable(),
      date_of_issue: Yup.date().required(intl("kyc.kyc_date_of_issue_required")).nullable(),
      date_of_expiry: Yup.date()
        .required(intl("kyc.kyc_date_of_expiry_required"))
        .when("date_of_issue", (date_of_issue, schema) => {
          if (date_of_issue) {
            const dayAfter = new Date(date_of_issue.getTime() + 86400000);
            return schema.min(dayAfter, intl("kyc.kyc_date_of_expiry_invalid"));
          }
          return schema;
        }),
    });

    const { openCamera, photo } = usePhoto();
    const router = useRouter();
    const toastify = useToastify();
    const { startRecording, getDevice, onDestroy, recordData, isTakeVideo } = useVideo();

    const photoValues = ref<IVerificationFile>({});
    const contentRef = ref<any>();
    const formValues = reactive<IVerification>({
      customerId: store.getters.auth.customerId,
      passportNo: "",
      documentNo: "",
      date_of_issue: undefined,
      date_of_expiry: undefined,
      gender: "male",
      first_name: "",
      last_name: "",
      date_of_birth: undefined,
      place_of_birth: "",
      nationality: "",
    });

    const isValidForm = computed(() => {
      return Object.values(formValues).some((valueItem) => !valueItem);
    });
    const customerId = computed(() => store.getters.auth.customerId) as any;

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    const handleSubmit = () => {
      showLoading();
      const newPhotos: IVerificationFile = {};
      Object.keys(props.photos).forEach((photoItem) => {
        if (props.photos[photoItem]) {
          newPhotos[photoItem] = dataURLtoFile(
            `data:image/jpeg;base64,${props.photos[photoItem]}`,
            `${photoItem}.png`
          );
        }
      });

      photoValues.value = newPhotos;

      if (!recordData.value) {
        getDevice();
      }
    };

    watchEffect(() => {
      if (props.verificationSelected === "passport") {
        delete formValues.documentNo;
      } else {
        delete formValues.passportNo;
      }
    });

    watchEffect(async () => {
      if (!recordData.value) return;

      photoValues.value.record = recordData.value as any;
      const currentFormData = {
        ...formValues,
        ...photoValues.value,
        date_of_expiry: formValues.date_of_expiry.getTime(),
        date_of_issue: formValues.date_of_issue.getTime(),
        birthday: formValues.date_of_birth.getTime(),
        files: [],
      };
      if (isTakeVideo.value) {
        const fileData = [
          {
            type: "record",
            file: recordData.value,
          },
          {
            type: "frontside",
            file: currentFormData.frontside,
          },
          {
            type: "backside",
            file: currentFormData.backside,
          },
          {
            type: "passport",
            file: currentFormData.passport,
          },
        ];

        saveFileToS3Buket(fileData, "e-wallet", "kyc")
          .then((e: any) => {
            actions
              .createKycRequestByCustomer({
                files: e,
                passportNo: currentFormData.passportNo,
                documentNo: currentFormData.documentNo,
                dateOfIssue: currentFormData.date_of_issue,
                dateOfExpiry: currentFormData.date_of_expiry,
                firstName: currentFormData.first_name,
                lastName: currentFormData.last_name,
                birthday: currentFormData.birthday,
                placeOfBirth: currentFormData.place_of_birth,
                nationality: currentFormData.nationality,
                sex: currentFormData.gender,
                customerId: currentFormData.customerId,
              })
              .then((res) => {
                contentRef.value = res.data;
                toastify.showSuccess(intl("kyc.kyc_submitted"));
              })
              .catch((error) => {
                toastify.showError(error.response.data.message);
                contentRef.value = error.response.data;
              })
              .finally(() => {
                // toastify.showInfo(JSON.stringify(contentRef.value));
                fetchCustomerInfo();
                loadingController.dismiss();
                router.push({ path: "/tabs/profile", replace: true });
                onDestroy();
              });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });

    return {
      router,
      photo,
      formValues,
      verificationPassportSchema,
      verificationDocumentSchema,
      intl,
      isValidForm,
      openCamera,
      handleSubmit,
      startRecording,
    };
  },
});
