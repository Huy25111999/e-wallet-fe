<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header">
          <div>
            <h4 class="__header_title">
              <img src="@/common/assets/logo-light.svg" />
              <div
                class="flex justify-center items-center cursor-pointer relative"
                id="notification-modal"
                @click="handleUpdateStatusNotification"
              >
                <ion-icon :icon="notifications" />
                <span class="not-read" v-if="notificationsList?.total">
                  {{ notificationsList?.total }}
                </span>
              </div>
            </h4>
            <div class="__my_money">
              <p class="w-full __text_money">{{ t("dashboard.subHeader") }}</p>
              <div class="__money">
                <span>{{ formatNumber(userInfo?.amount) }} </span>
                <span class="flex items-center ml-4">
                  <img src="@/common/assets/icon/dashboard/info.svg" />
                </span>
              </div>
            </div>
          </div>

          <ul class="__menu flex justify-around">
            <li @click="() => router.push({ name: 'topUp' })">
              <img src="@/common/assets/icon/dashboard/tolUp.svg" />
              <p class="__icon_menu">{{ t("dashboard.tolUp") }}</p>
            </li>
            <li @click="() => router.push({ name: 'withdraw' })">
              <img src="@/common/assets/icon/dashboard/withdraw.svg" />
              <p class="__icon_menu">{{ t("dashboard.withdraw") }}</p>
            </li>
            <li @click="() => router.push({ name: 'paymentqr' })">
              <img src="@/common/assets/icon/dashboard/paymentQR.svg" />
              <p class="__icon_menu">{{ t("dashboard.paymentQR") }}</p>
            </li>
            <li @click="() => router.push({ name: 'scanqr' })">
              <img src="@/common/assets/icon/dashboard/scan.svg" />
              <p class="__icon_menu">{{ t("dashboard.scan") }}</p>
            </li>
          </ul>
        </div>

        <div class="__main">
          <div class="__header_main">
            <div class="__header_1">{{ t("dashboard.OfferHeader.title") }}</div>
            <div class="__header_3">
              {{ t("dashboard.OfferHeader.subtitle") }}
            </div>
          </div>

          <div class="slide mt-3" v-for="guideItem in guides" :key="guideItem.id">
            <ion-slides :pager="true" class="rounded-lg">
              <GuideSlideItem
                v-for="(guideImageItem, idx) in guideItem.images"
                :guideImageItem="guideImageItem"
                :key="idx"
              />
            </ion-slides>
          </div>
        </div>
      </div>

      <ModalNotification trigger="notification-modal" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./dashboard.component.ts"></script>

<style lang="scss" scoped src="./dashboard.scss"></style>
