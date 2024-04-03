export const DURATION_VIDEO = 10;

export const VIDEO_CONFIG = {
  url: "",
  player: "",
  retake: 0,
  isSaveDisabled: true,
  isStartRecording: false,
  isRetakeDisabled: true,
  submitText: "Submit",
  options: {
    controls: true,
    bigPlayButton: false,
    controlBar: {
      deviceButton: false,
      recordToggle: false,
      pipToggle: false,
    },
    width: 500,
    height: 300,
    fluid: true,
    plugins: {
      record: {
        pip: false,
        audio: false,
        video: true,
        maxLength: DURATION_VIDEO,
        debug: true,
      },
    },
  },
};
