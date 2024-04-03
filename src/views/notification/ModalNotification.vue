<template>
  <ion-modal ref="modal" :trigger="trigger" class="wrapper-notification">
    <ion-header>
      <ion-toolbar>
        <p @click="dismiss" class="__cancel cursor-pointer text-sm absolute left-2">
          {{ intl("notification.cancel") }}
        </p>
        <div class="__title w-full text-center font-medium">
          {{ intl("notification.title") }}
        </div>
        <ion-buttons slot="end"> </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ul class="pb-12">
        <NotificationItem
          v-for="notificationItem in notificationsList.notification"
          :key="notificationItem?.id"
          :item="notificationItem"
        />
        <ion-infinite-scroll @ionInfinite="ionInfinite">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ul>
    </ion-content>
  </ion-modal>
</template>
<script lang="ts" src="./modalNotification.ts"></script>
<style lang="scss" src="./modalNotification.scss" scoped></style>
