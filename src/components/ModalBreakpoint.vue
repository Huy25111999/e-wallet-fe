<template>
  <ion-modal
    class="modal-breakpoint overflow-auto"
    ref="modal"
    :trigger="trigger"
    :backdropDismiss="false"
  >
    <div class="wrapper">
      <div class="wrapper-header">
        <h1>{{ title }}</h1>
        <ion-icon :icon="closeOutline" @click="onHide" />
      </div>
      <slot></slot>
    </div>
  </ion-modal>
</template>

<script lang="ts">
import { IonIcon, IonModal } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "ModalBreakpoint",
  props: ["trigger", "initialBreakpoint", "title", "dismiss"],
  components: {
    IonModal,
    IonIcon,
  },
  setup(props) {
    const modal = ref();
    const onHide = () => {
      modal.value.$el.dismiss();
      props.dismiss && props.dismiss();
    };

    return {
      modal,
      closeOutline,
      onHide,
    };
  },
});
</script>
<style lang="scss">
ion-modal.modal-breakpoint {
  --width: 95%;
  --height: fit-content;
  --background: #fff;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);

  .wrapper{
    max-height: 650px;
    overflow: auto;
  }

  .wrapper-header {
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ccc;
    ion-icon {
      font-size: 20px;
      cursor: pointer;
    }
  }

  ion-content {
    --background: #fff;
  }

  .wrapper-header {
    h1 {
      font-weight: bold;
    }
  }
}
</style>
