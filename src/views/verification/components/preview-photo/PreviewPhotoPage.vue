<template>
  <div class="wrapper-photo">
    <div class="__main">
      <ul class="photos">
        <li class="__item" v-for="(photo, key, index) in $props.photos" :key="index">
          <img v-if="photo" :src="`data:image/jpeg;base64,${photo}`" />
          <h3 v-if="photo" class="text-center">{{ getTitle(String(key)) }}</h3>
        </li>

        <li class="btn-retake w-full flex justify-center items-center">
          <button @click="handleRetake">{{ intl("verification.preview_photo_retake") }}</button>
        </li>
      </ul>

      <div class="btn-next">
        <button class="w-full flex justify-center items-center" @click="handleNextStep">
          {{ intl("verification.preview_photo_next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./previewPhoto.component.ts"></script>
<style lang="scss" scoped src="./previewPhoto.scss"></style>
