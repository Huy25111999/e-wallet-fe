<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-slide">
        <ion-slides :ionSlideDrag="false" ref="slidesRef" class="swiper-no-swiping">
          <ion-slide>
            <div class="wrapper-wallet">
              <div class="__header flex justify-between items-center">
                <div class="nav-left flex items-center">
                  <h3>{{ intl("transaction.scanqr_title") }}</h3>
                </div>
              </div>
              <div>
                <qrcode-stream
                  v-show="cameraStatus.isShowing"
                  @detect="onDetect"
                  :torch="cameraStatus.torchActive"
                >
                  <!-- <div v-if="validationFailure" class="validation-failure">
                    {{ intl("transaction.scanqr_code_invalid") }}
                  </div>

                  <div v-if="validationPending" class="validation-pending">
                    {{ intl("transaction.scanqr_code_loading") }}
                  </div> -->
                </qrcode-stream>
              </div>

              <div class="__main">
                <div class="title">
                  {{ intl("transaction.scanqr_code_title") }}
                </div>
                <div class="space-scan">
                  <img src="@/common/assets/icon/transaction/Corner-light.png" />
                </div>
                <div class="description">
                  <p>{{ intl("transaction.scanqr_code_desription") }}</p>
                </div>

                <div class="recent-transaction flex flex-col items-center">
                  <div class="icons flex items-center">
                    <img
                      class="mr-7"
                      src="@/common/assets/icon/transaction/Photo.png"
                      @click="onSelectQrCodeImage"
                    />
                    <input
                      hidden
                      type="file"
                      @change="onUploadQrCodeCapture"
                      @click="onResetFile"
                      ref="inputQrCaptureRef"
                    />
                    <QrcodeCapture
                      @decode="onDecode"
                      ref="qrCodeCaptureRef"
                      v-show="false"
                      v-if="isInitDecode"
                    />
                    <img src="@/common/assets/icon/transaction/flash.png" @click="toggleTorch" />
                  </div>
                  <div class="__content">
                    {{ intl("transaction.recent_transactions") }}
                  </div>
                </div>
                <div class="actions">
                  <button class="payment mr-5" @click="goToPaymentQR">
                    {{ intl("transaction.payment_qr") }}
                  </button>
                  <button class="scan">
                    {{ intl("transaction.scan_qr") }}
                  </button>
                </div>
              </div>
            </div></ion-slide
          >
          <ion-slide>
            <ScanQrInfo
              :handleChangeSlide="handleChangeSlide"
              :onSubmit="onSubmit"
              :qrCodeData="qrCodeData"
              :isDisCharge="isDisCharge"
            />
          </ion-slide>
          <ion-slide>
            <FormVerifyOtp
              :isDisCharge="isDisCharge"
              :isSubmitted="isSubmitted"
              :resetOnSubmit="resetOnSubmit"
              :handleChangeSlide="handleChangeSlide"
              :qrCodeData="qrCodeData"
              :onSaveSuccess="onSaveSuccess"
            />
          </ion-slide>
          <ion-slide>
            <TransactionResult :handleChangeSlide="handleChangeSlide" :qrCodeData="qrCodeData" />
          </ion-slide>
        </ion-slides>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./scan.component.ts"></script>
<style lang="scss" src="./scan.scss" scoped></style>
