import "video.js/dist/video-js.css";
import "videojs-record/dist/css/videojs.record.css";
import videojs from "video.js";
import "webrtc-adapter";
import RecordRTC from "recordrtc";
import Record from "videojs-record/dist/videojs.record.js";
import FFmpegjsEngine from "videojs-record/dist/plugins/videojs.record.ffmpegjs.js";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "VideoPage",
  components: {},
  setup() {
    // const { capturePhoto, photoPreview, stopCamera, resetCapture, takePhoto } = usePhoto();
    const options = {
      controls: true,
      width: 320,
      height: 240,
      fluid: false,
      bigPlayButton: false,
      controlBar: {
        volumePanel: false,
      },
      plugins: {
        record: {
          audio: false,
          video: true,
          maxLength: 10,
          displayMilliseconds: false,
          debug: true,
        },
      },
    };

    const player = videojs("myVideo", options, function () {
      // print version information at startup
      const msg =
        "Using video.js " +
        videojs.VERSION +
        " with videojs-record " +
        videojs.getPluginVersion("record") +
        " and recordrtc " +
        RecordRTC.version;
      videojs.log(msg);
    });

    const startRecording = () => {
      player.record().getDevice();
    };

    return {
      startRecording,
    };
  },
});
