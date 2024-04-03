import { loadingController } from "@ionic/vue";

export const showLoading = async () => {
  const loading = await loadingController.create({
    message: "Loading...",
    cssClass: "custom-loading",
  });
  await loading.present();
};
