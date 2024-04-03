import InputDatePicker from "@/common/_controls/InputDatePicker.vue";
import InputField from "@/common/_controls/InputField.vue";
import { Form } from "vee-validate";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VerificationUser",
  components: { Form, InputField, InputDatePicker },
  props: ["photos", "onNextStep", "onRetake"],
  setup(props) {
    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const handleRetake = () => {
      props.onRetake();
    };

    const handleNextStep = () => {
      props.onNextStep();
    };

    const getTitle = (key: string) => {
      switch (key) {
        case "frontside":
          return intl("verification.capture_slide_id_front_card");
        case "backside":
          return intl("verification.capture_slide_id_back_card");
        default:
          return intl("verification.capture_slide_passport_card");
      }
    };
    return { handleRetake, handleNextStep, getTitle, intl };
  },
});
