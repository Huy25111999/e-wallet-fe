import { VIDEO_CONFIG } from "@/views/video/config";
import { loadingController } from "@ionic/vue";
import RecordRTC from "recordrtc";
import "webrtc-adapter";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-record/dist/css/videojs.record.css";
import { reactive, ref } from "vue";
import "webrtc-adapter";
// import JSZip from "jszip";

const video = reactive(VIDEO_CONFIG);

const videoRef = ref();
const recordData = ref<File>();
const showVideo = ref(false);
const isShowingCamera = ref(false);
const isRecording = ref(false);
const isTakeVideo = ref(false);

export const useVideo = () => {
  const getDevice = async () => {
    showVideo.value = true;
    videoRef.value = videojs("#myVideo", video.options);
    await videoRef.value.record().getDevice();
    isShowingCamera.value = true;
    loadingController.dismiss();
  };

  const startRecording = () => {
    // file.startRecord();
    video.isSaveDisabled = true;
    video.isRetakeDisabled = true;
    isRecording.value = true;
    video.retake += 1;
    videoRef.value.record().start();
  };

  const stopRecording = () => {
    showVideo.value = false;
    // videoRef.value.record().stop();
  };

  const onPlayVideo = () => {
    videoRef.value.play();
    recordData.value = videoRef.value.recordedData;
  };

  const onFinishRecord = () => {
    videoRef.value.on("finishRecord", () => {
      recordData.value = new File(
          [videoRef.value.recordedData],
          "video"
      ) as File;
      isRecording.value = false;
    });
  };

  const reTakeVideo = () => {
    recordData.value = undefined;
    startRecording();
  };

  const takeVideo = () => {
    isTakeVideo.value = true;
    stopRecording();
  };

  const onDestroy = () => {
    videoRef.value.dispose();
    recordData.value = undefined;
    showVideo.value = false;
    isRecording.value = false;
    isTakeVideo.value = false;
    isShowingCamera.value = false;
  };

  return {
    recordData,
    videoRef,
    showVideo,
    isRecording,
    isTakeVideo,
    isShowingCamera,
    getDevice,
    startRecording,
    onFinishRecord,
    onPlayVideo,
    takeVideo,
    stopRecording,
    onDestroy,
    reTakeVideo,
  };
};
