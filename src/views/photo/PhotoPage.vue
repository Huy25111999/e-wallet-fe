<template>
  <div class="wrapper-camera">
    <div class="__header">
      <button
        class="btn-back"
        @click="
          () => {
            stopCamera();
            resetCapture();
          }
        "
      >
        <img src="@/common/assets/icon/Vector.png" />
      </button>
      <h3 class="text-center">{{ information.title }}</h3>
    </div>

    <p class="description">
      {{ information.description }}
    </p>

    <div id="cameraPreview" class="cameraPreview">
      <img
        class="img-preview"
        v-if="photoPreview"
        :src="`data:image/jpeg;base64,${photoPreview}`"
      />
    </div>
    <div class="camera-content">
      <h3 class="text-center">{{ information.cardName }}</h3>
    </div>
    <div class="actions text-center row w-full">
      <!-- isOpenCamera -->
      <button v-if="!photoPreview" class="capture ml-14 mb-3" @click="capturePhoto"></button>
      <button v-if="!photoPreview && isOpenCamera" class="switch-camera" @click="switchCam">
        <ion-icon :icon="cameraReverseOutline" />
      </button>
      <button v-if="photoPreview" class="use-photo mr-5 mb-3" @click="takePhoto">Use photo</button>
      <button v-if="photoPreview" class="use-photo" @click="resetCapture">Capture photo</button>
    </div>
  </div>
</template>

<script lang="ts" src="./photo.components.ts"></script>
<style lang="scss" src="./photo.scss"></style>
