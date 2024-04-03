<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex justify-between item-center">
          <div class="logo-brand">
            <!-- <img
              @click="navigate('/tabs/wallets/' + route?.params?.type)"
              src="@/common/assets/icon/wallet/back.svg"
            /> -->
            <img
              @click="navigate('/tabs/wallets/top-up')"
              src="@/common/assets/icon/wallet/back.svg"
            />
            <h1>{{ t("wallet.top-up.transaction") }}</h1>
          </div>
        </div>
        <div class="__main">
          <div class="logo-img">
            <img src="@/common/assets/logo.svg" />
            <span>{{ formatTime(route?.params?.dateTime) }}</span>
          </div>
          <div class="message">
            <span>
              {{ t("wallet.top-up.message.error") }}
            </span>
          </div>
          <div class="title-transaction">
            {{ t("wallet.top-up.transaction-detail") }}
          </div>
          <div class="detail-transaction">
            <ul class="feature-list">
              <li class="cursor-pointer">
                <div class="__name">
                  <span>{{ t("wallet.top-up.title.account") }}</span>
                </div>
                <div class="__value">
                  {{ userInfo?.account }}
                </div>
              </li>
              <li class="cursor-pointer">
                <div class="__name">
                  <span>{{ t("wallet.top-up.title.transfer-amount") }}</span>
                </div>
                <div class="__value">
                  <span class="amount">
                    {{ formatNumber(route?.params?.amount) }}
                  </span>
                </div>
              </li>
              <li class="cursor-pointer">
                <div class="__name">
                  <span>{{ t("wallet.top-up.title.fee") }}</span>
                </div>
                <div class="__value">
                  <span class="amount">
                    {{ formatNumber(0) }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="flex justify-center items-center">
            <ion-button type="button" class="submit" @click="navigate('/tabs/dashboard')">{{
              t("wallet.top-up.button.home")
            }}</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./errorPage.component.ts"></script>

<style lang="scss" scoped src="./error.scss"></style>
