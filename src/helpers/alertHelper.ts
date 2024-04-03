import {alertController} from "@ionic/vue";

export const presentAlert = async (header, message, buttonString?) => {
    const alert = await alertController.create({
        header: header,
        message: message,
        buttons: buttonString ? [buttonString] : ['OK'],
    });
    await alert.present();
}
