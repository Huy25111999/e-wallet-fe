<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-auth p-4">
        <div class="logo-img">
          <img src="@/common/assets/logo.svg" />
        </div>

        <h1 class="header mb-1">{{ intl("user-login-page.header") }}</h1>
        <label class="sub-header">{{ intl("user-login-page.sub-header") }}</label>

        <div class="flex items-center content-login">
          <ion-button class="w-full" type="button" @click="onLoginClick">{{
            intl("user-login-page.title.login")
          }}</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" src="./userRichcle.component.ts"></script>

<style lang="scss" scoped src="./userRichcle.scss"></style>
