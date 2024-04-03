<template>
  <ion-page>
    <ion-content :fullscreen="true"> 404 page </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonContent } from "@ionic/vue";

export default defineComponent({
  name: "Tab1Page",
  components: { IonContent, IonPage },
});
</script>

<style lang=""></style>
