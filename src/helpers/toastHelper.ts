import { toastController } from "@ionic/vue";

export const presentToast = async (message: string, position: "top" | "middle" | "bottom") => {
  const toast = await toastController.create({
    message: message,
    duration: 5000,
    position: position,
    buttons: [
      {
        text: "Dismiss",
        role: "cancel",
      },
    ],
  });

  await toast.present();
};
