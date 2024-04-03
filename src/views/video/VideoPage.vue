<template>
  <div class="wrapper-video">
    <div class="cameraPreview">
      <video id="myVideo" playsinline class="video-js vjs-default-skin"></video>
    </div>
    <div class="camera-content">
      <p class="description text-center">
        {{ intl("kyc.kyc_video_warning") }}
      </p>
    </div>
    <div class="actions w-full flex justify-around items-center flex-wrap">
      <button
        v-if="!recordData && !isRecording && isShowingCamera"
        class="recording"
        @click="handleStartRecording"
      ></button>
      <button v-if="recordData" class="use-photo mb-3" @click="takeVideo">Use video</button>
      <button v-if="recordData" class="use-photo mb-3" @click="handleRetakeVideo">Retake</button>
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import "videojs-record/dist/css/videojs.record.css";
import "webrtc-adapter";
import RecordRTC from "recordrtc";
import Record from "videojs-record/dist/videojs.record.js";
import FFmpegjsEngine from "videojs-record/dist/plugins/videojs.record.ffmpegjs.js";
import { defineComponent, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useVideo } from "@/helpers/useVideo";
import { DURATION_VIDEO } from "@/views/video/config";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VideoPage",
  components: {},
  setup() {
    const timeDuration = ref(DURATION_VIDEO);
    const durationInterval = ref();
    const { t: intl } = useI18n();

    const {
      showVideo,
      recordData,
      videoRef,
      isRecording,
      isShowingCamera,
      getDevice,
      onPlayVideo,
      startRecording,
      onFinishRecord,
      stopRecording,
      takeVideo,
      reTakeVideo,
    } = useVideo();

    const handleStartRecording = () => {
      startRecording();
    };

    const handleRetakeVideo = () => {
      timeDuration.value = DURATION_VIDEO;
      reTakeVideo();
    };

    watchEffect(() => {
      if (!isRecording) return;
      if (durationInterval.value) {
        clearInterval(durationInterval.value);
      }

      if (!timeDuration.value === 1) {
        return;
      }

      durationInterval.value = setInterval(() => {
        timeDuration.value--;
      }, 1000);
    });

    onMounted(() => {
      if (showVideo) {
        getDevice();
      }
      onFinishRecord();
    });

    return {
      handleStartRecording,
      onPlayVideo,
      handleRetakeVideo,
      stopRecording,
      takeVideo,
      isShowingCamera,
      recordData,
      videoRef,
      timeDuration,
      isRecording,
      intl,
    };
  },
});
</script>

<style lang="scss">
.wrapper-video {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  font-family: "Poppins";
  padding: 0 23px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding-top: 136px;

  .cameraPreview {
    position: relative;
    width: 100%;
    margin: 0 auto;
    border-radius: 24px;

    .corner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .video {
      border-radius: 26px;
    }

    .img-preview {
      border-radius: 26px;
    }
  }

  .camera-content {
    margin-top: 72px;
    position: relative;

    .description {
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: #f6f7f8;
      margin-bottom: 40px;
    }

    .duration {
      color: #fff;
    }
  }
  .actions {
    position: relative;
    margin-bottom: 30px;
    margin-top: 110px;
    .recording {
      border: 2px solid #ffffff;
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #ff6a6a;

      &::before {
        content: "";
        position: absolute;
        width: 72px;
        height: 72px;
        opacity: 0.32;
        border-radius: 50%;
        border: 2px solid #ffffff;
        top: -8px;
        left: -8px;
      }
    }

    .use-photo {
      width: 150px;
      padding: 14px 0;
      color: #5279e7;
      font-weight: 600;
      font-size: 16px;
      border: 1px solid #55adf8;
      border-radius: 16px;
    }
  }
}
</style>
