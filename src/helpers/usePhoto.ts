import { IPhotoInformation } from "@/types";
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from "@capacitor-community/camera-preview";
import { reactive, ref } from "vue";

const showCamera = ref(false);
const photoPreview = ref();
const photo = ref();
const isOpenCamera = ref(false);
const position = ref("rear");
const openFrontCam = ref(false);

// information photo
const information = reactive<IPhotoInformation>({
  title: "",
  description: "",
  cardName: "",
});

export function usePhoto() {
  const openCamera = async (params?: IPhotoInformation) => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: position.value,
      parent: "cameraPreview",
      className: "video",
      width: 1080,
      height: 2000,
    };
    showCamera.value = true;
    if (params) {
      information.title = params.title;
      information.description = params.description;
      information.cardName = params.cardName;
    }

    isOpenCamera.value = true;
    await CameraPreview.start(cameraPreviewOptions);
  };

  const stopCamera = async () => {
    await CameraPreview.stop();
    showCamera.value = false;
  };

  const capturePhoto = async () => {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 50,
    };

    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    photoPreview.value = result.value;

    stopCamera();
  };

  const resetCapture = () => {
    openCamera(information);
    photoPreview.value = null;
  };

  const takePhoto = () => {
    photo.value = photoPreview.value;

    //reset value after take photo
    photoPreview.value = null;
    showCamera.value = false;
    isOpenCamera.value = false;
  };

  const destroyPhoto = () => {
    photo.value = null;
  };

  const onSwitchCamera = async (positionCamera: string) => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: positionCamera,
      parent: "cameraPreview",
      className: "video",
      width: 1080,
      height: 2000,
    };

    await CameraPreview.stop();

    await CameraPreview.start(cameraPreviewOptions);
  };

  const switchCam = () => {
    if (position.value === "rear") {
      position.value = "front";
    } else {
      position.value = "rear";
    }
    onSwitchCamera(position.value);
  };

  return {
    openCamera,
    stopCamera,
    capturePhoto,
    resetCapture,
    takePhoto,
    destroyPhoto,
    isOpenCamera,
    photoPreview,
    photo,
    showCamera,
    information,
    openFrontCam,
    switchCam,
  };
}
