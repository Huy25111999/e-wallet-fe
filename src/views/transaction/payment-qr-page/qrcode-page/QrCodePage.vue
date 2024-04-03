<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-slides
        :ionSlideDrag="false"
        ref="slidesRef"
        class="swiper-no-swiping"
      >
        <ion-slide>
          <div class="wrapper-wallet">
            <div class="__header flex justify-between items-center">
              <div class="nav-left flex items-center">
                <button class="goback" @click="goBack">
                  <img src="@/common/assets/icon/transaction/backDark.svg" />
                </button>
                <h3>{{ intl("transaction.transaction_qr_get_money") }}</h3>
              </div>
            </div>

            <div class="__main">
              <div class="card-content">
                <img
                  class="brand"
                  src="@/common/assets/icon/transaction/brand.svg"
                />
                <div class="title">
                  <p>{{ userInfo.fullname }}</p>
                </div>
                <!-- <div class="phone text-center">
                  <p>
                    {{ intl("transaction.transaction_qr_get_money_account") }}:
                    {{ userInfo.account }}
                  </p>
                </div> -->
                <div class="qr-code">
                  <img :src="qrCodeImage" />
                  <!-- <qrcode-vue :value="JSON.stringify(qrCodeValues)" :size="220" level="H" /> -->
                </div>
                <div class="actions" v-if="!qrCodeValues.amount">
                  <button
                    class="add-amount"
                    @click="
                      () => handleChangeSlide({ indexSlide: 1, time: 500 })
                    "
                  >
                    <img src="@/common/assets/icon/transaction/add.svg" />
                    {{ intl("transaction.transaction_qr_get_money_add") }}
                  </button>
                </div>
                <div
                  v-else
                  class="wrapper-amount flex justify-center items-center"
                >
                  <div class="amount mr-3">$ {{ qrCodeValues.amount }}</div>
                  <div
                    class="edit-amount"
                    @click="
                      () => handleChangeSlide({ indexSlide: 1, time: 500 })
                    "
                  >
                    <img src="@/common/assets/icon/transaction/edit-2.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ion-slide>
        <ion-slide>
          <form-amount
            :handleChangeSlide="handleChangeSlide"
            :onChange="onQrCodeImageChange"
          />
        </ion-slide>
        <ion-slide>
          <form-verifi-otp :handleChangeSlide="handleChangeSlide" />
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./qrcode.component.ts"></script>
<style lang="scss" src="./qrcode.scss" scoped></style>
