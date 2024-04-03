<template>
  <ion-modal class="modal-delete" :id="id" ref="modal" trigger="open-custom-dialog">
    <div class="wrapper">
      <h1 class="text-center">{{ title }}</h1>
      <div class="description">{{ content }}</div>
      <div class="footer w-full flex justify-center items-center">
        <ion-button class="btn-no mr-4" @click="dismiss()">{{ intl("common.no") }}</ion-button>
        <ion-button class="btn-yes" @click="$props.handleConfirm">{{
          intl("common.yes")
        }}</ion-button>
      </div>
    </div>
  </ion-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { IonModal, IonButton } from "@ionic/vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ModalDelete",
  components: { IonModal, IonButton },
  props: ["title", "content", "id", "handleConfirm"],
  setup() {
    const modal = ref();
    const { t: intl } = useI18n();
    const dismiss = () => {
      modal.value.$el.dismiss();
    };

    return { modal, dismiss, intl };
  },
});
</script>
<style lang="scss">
ion-modal.modal-delete {
  --width: fit-content;
  --min-width: 327px;
  --height: fit-content;
  --border-radius: 16px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --background: #fff;

  h1 {
    font-weight: 600;
    font-size: 17px;
    color: #202046;
    margin-bottom: 16px;
  }
  ion-icon {
    margin-right: 6px;

    width: 48px;
    height: 48px;

    padding: 4px 0;

    color: #aaaaaa;
  }

  .wrapper {
    margin: 24px;

    .description {
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      text-align: center;
      letter-spacing: -0.078px;
      color: #9896a8;
      margin-bottom: 24px;
    }

    .footer {
      font-weight: 600;
      font-size: 14px;
      padding: 20px 0;
      color: #ccc;

      ion-button.btn-yes {
        width: 132px;
        height: 40px;
        --background: linear-gradient(135.54deg, #4fb4ed -0.96%, #343edf 100%);
        --border-radius: 16px;
        --box-shadow: none;
        color: #fff;
      }

      ion-button.btn-no {
        width: 132px;
        height: 40px;
        --background: #fff;
        --border-radius: 16px;
        --box-shadow: none;
        color: #4fb4ed;
        border: 1px solid #4fb4ed;
        border-radius: 16px;
      }
    }
  }
}
</style>
