import { usePhoto } from "@/helpers/usePhoto";
import { defineComponent, watchEffect } from "vue";
import {
  addCircleOutline,
  camera,
  helpCircleOutline,
  notifications,
  qrCode,
  scanCircle,
  trailSignOutline,
  cameraReverseOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "CameraPage",
  components: {},
  setup() {
    const {
      capturePhoto,
      photoPreview,
      stopCamera,
      resetCapture,
      takePhoto,
      showCamera,
      information,
      isOpenCamera,
      openFrontCam,
      switchCam,
    } = usePhoto();

    return {
      capturePhoto,
      stopCamera,
      resetCapture,
      takePhoto,
      photoPreview,
      showCamera,
      information,
      isOpenCamera,
      openFrontCam,
      switchCam,
      cameraReverseOutline,
    };
  },
});
