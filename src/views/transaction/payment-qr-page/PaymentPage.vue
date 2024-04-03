<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex justify-between items-center">
          <div class="nav-left flex items-center">
            <h3>{{ intl("transaction.transaction_payment_qr_title") }}</h3>
          </div>
          <div
            class="my-qrcode cursor-pointer"
            @click="() => router.push('paymentqr/get-money')"
          >
            <img src="@/common/assets/icon/transaction/scan.png" />
          </div>
        </div>

        <div class="__main">
          <div class="title">{{ userInfo?.fullname }}</div>
          <div class="card-content">
            <div class="qr-code">
              <img
                :src="qrCodeImage"
                class="w-[400px] h-[400px]"
                alt="qrCode"
              />
              <!-- <qrcode-vue :value="JSON.stringify(qrCodeData)" :size="220" level="H" /> -->
              <div class="brand"></div>
            </div>

            <div class="content">
              <div class="phone text-center">
                {{ intl("transaction.transaction_payment_qr_user_account") }}:
                {{ userInfo?.account }}
              </div>
              <div class="wrapper-money flex justify-center items-center">
                <div class="title">DBM:</div>
                <div class="total-money">
                  {{ formatNumber(userInfo?.amount) }}
                </div>
                <div
                  class="add cursor-pointer"
                  @click="() => router.push('/tabs/wallets/top-up')"
                >
                  <img src="@/common/assets/icon/transaction/add.png" />
                </div>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="payment mr-5">
              {{ intl("transaction.transaction_payment_qr_title") }}
            </button>
            <button class="scan" @click="() => router.push('scanqr')">
              {{ intl("transaction.transaction_payment_qr_scan") }}
            </button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./payment.component.ts"></script>
<style lang="scss" src="./payment.scss" scoped></style>
