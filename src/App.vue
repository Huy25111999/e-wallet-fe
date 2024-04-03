<template>
  <ion-app>
    <ion-router-outlet id="wrapper-app" />
  </ion-app>
  <!-- use for all component -->
  <photo-preview v-if="showCamera || photoPreview" />
  <video-preview v-if="showVideo" />
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, ref, watchEffect, onMounted } from "vue";
import { usePhoto } from "./helpers/usePhoto";
import { useVideo } from "./helpers/useVideo";
import PhotoPreview from "./views/photo/PhotoPage.vue";
import VideoPreview from "./views/video/VideoPage.vue";
import { useI18n } from "vue-i18n";
import * as actions from "@/api/profile";
import { useRoute } from "vue-router";
import { paramsDischargeVerify } from "./views/transaction/scan-qr-page/verify-otp/verifyOtp.component";
import store from "./vuex/store";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    PhotoPreview,
    VideoPreview,
  },

  setup() {
    const { showCamera, photoPreview } = usePhoto();
    const { showVideo } = useVideo();
    const { setLocaleMessage } = useI18n({ useScope: "global" });
    const lang = ref("");

    watchEffect(async () => {
      const params: any = {};
      lang.value = localStorage.getItem("language") as string;

      if (!lang.value) {
        lang.value = "en";
      }
      actions.getAllNation(params).then((res) => {
        if (res?.data) {
          const filterCountry = res?.data?.data.find((e: any) => {
            return e.code === lang.value;
          });
          if (filterCountry) {
            const getUrlCountry = filterCountry.fileJsonLanguage.url;
            fetch(getUrlCountry)
              .then((res) => res.json())
              .then((response) => {
                setLocaleMessage(lang.value, response);
              });
          }
        }
      });
    });

    return {
      showCamera,
      photoPreview,
      showVideo,
    };
  },
});
</script>

<style lang="scss">
#wrapper-app {
  max-width: 800px;
  margin: 0 auto;
}
</style>
