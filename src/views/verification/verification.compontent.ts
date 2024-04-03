import { dataURLtoFile } from "@/helpers/fileHelper";
import { usePhoto } from "@/helpers/usePhoto";
import { defineComponent, onUnmounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import PreviewPhoto from "./components/preview-photo/PreviewPhotoPage.vue";
import VerificationUser from "./components/verify-user/VerificationUserForm.vue";
import { IonPage, IonContent } from "@ionic/vue";

export default defineComponent({
  name: "VerificationPage",
  components: { PreviewPhoto, VerificationUser, IonPage, IonContent },
  setup() {
    const router = useRouter();
    const { openCamera, photo } = usePhoto();
    const showPreviewImg = ref(false);
    const showFormUser = ref(false);
    const { t: intl } = useI18n({
      inheritLocale: true,
    });

    const verificationSelected = ref<string>("");
    const photos = reactive({
      passport: "",
      frontside: "",
      backside: "",
    });

    const handleSelectOption = (option: string) => {
      verificationSelected.value = option;
    };

    const onNextStep = () => {
      showFormUser.value = true;
      showPreviewImg.value = false;
    };

    const onRetake = () => {
      showPreviewImg.value = false;
      photos.backside = "";
      photos.frontside = "";
      photos.passport = "";

      if (verificationSelected.value === "id") {
        openCamera({
          title: intl("verification.capture_slide_id"),
          description: intl("verification.capture_slide_id_des"),
          cardName: intl("verification.capture_slide_id_front_card"),
        });
      } else {
        openCamera({
          title: intl("verification.capture_slide_passport"),
          description: intl("verification.capture_slide_passport_des"),
          cardName: intl("verification.capture_slide_passport_card"),
        });
      }
    };

    const handleOpenCamera = () => {
      if (verificationSelected.value === "id") {
        openCamera({
          title: intl("verification.capture_slide_id"),
          description: intl("verification.capture_slide_id_des"),
          cardName: intl("verification.capture_slide_id_front_card"),
        });
      } else {
        openCamera({
          title: intl("verification.capture_slide_passport"),
          description: intl("verification.capture_slide_passport_des"),
          cardName: intl("verification.capture_slide_passport_card"),
        });
      }
    };

    watch([photo], () => {
      if (!photo.value) return;

      if (verificationSelected.value === "passport") {
        photos.passport = photo.value as any;
        showPreviewImg.value = true;
      }

      if (verificationSelected.value === "id") {
        if (!photos.frontside) {
          photos.frontside = photo.value as any;

          openCamera({
            title: intl("verification.capture_slide_id"),
            description: intl("verification.capture_slide_id_des"),
            cardName: intl("verification.capture_slide_id_back_card"),
          });
        } else if (!photos.backside) {
          photos.backside = photo.value as any;
          showPreviewImg.value = true;
        }
      }
    });

    onUnmounted(() => {
      photos.backside = "";
      photos.frontside = "";
      photos.passport = "";
    });

    return {
      router,
      verificationSelected,
      showPreviewImg,
      photos,
      showFormUser,
      openCamera,
      intl,
      onNextStep,
      onRetake,
      handleSelectOption,
      handleOpenCamera,
    };
  },
});
