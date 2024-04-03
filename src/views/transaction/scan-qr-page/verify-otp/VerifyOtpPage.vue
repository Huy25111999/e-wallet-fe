<template>
  <div class="wrapper-verifyOtp">
    <div class="__header flex justify-between items-center">
      <div class="nav-left flex items-center">
        <button class="goback" @click="goBack">
          <img src="@/common/assets/icon/transaction/backDark.svg" />
        </button>
        <h3>{{ intl("transaction.verify_otp_enter") }}</h3>
      </div>
    </div>

    <div class="__main">
      <div class="wrapper-otp">
        <div class="title">
          <h3 class="text-left">{{ intl("transaction.enter_verification") }}</h3>
        </div>
        <div class="description text-start">
          <div class="text-left flex items-center">
            <p>{{ intl("transaction.enter_code_verification") }}</p>
            <div class="phone ml-1">
              {{
                userInfo?.phone &&
                userInfo.countryCode &&
                userInfo.phone.replace(userInfo?.countryCode, "")
              }}
            </div>
          </div>
        </div>

        <Form class="form-confirm" ref="formConfirm">
          <v-otp-input
            class="flex justify-center items-center"
            ref="otpInputRef"
            input-classes="otp-input-custom"
            separator=""
            :num-inputs="6"
            :should-auto-focus="true"
            :is-input-num="true"
            :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />
          <div class="wrapper-resend flex flex-col items-center">
            <div class="flex items-center resend-title">
              {{ intl("transaction.resend_code_question") }}
            </div>
            <p v-show="resendOtp.isEnd" class="resend ml-2 cursor-pointer" @click="onReTakeOtp">
              {{ intl("transaction.resend_code") }}
            </p>
            <div v-show="!resendOtp.isEnd" class="countdown flex items-center">
              <p class="mr-1">{{ intl("user-login-page.label.resend") }}</p>
              (
              <vue-countdown
                class="m-0"
                :auto-start="$props.isSubmitted"
                ref="countDownRef"
                :time="resendOtp.time"
                v-slot="{ seconds }"
                @end="onOtpEnd"
              >
                {{ seconds }}s
              </vue-countdown>
              )
            </div>
          </div>

          <div class="flex justify-center items-center">
            <button
              :class="`btn-confirm ${otpValidLength && 'disabled'}`"
              type="button"
              @click="handleSubmit"
              :disabled="otpValidLength"
            >
              {{ intl("transaction.confirm") }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script src="./verifyOtp.component.ts" lang="ts"></script>
<style lang="scss" src="./verifyOtp.scss" scoped></style>
