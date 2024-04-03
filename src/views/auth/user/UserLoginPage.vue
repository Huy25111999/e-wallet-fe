<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-auth p-4" v-if="!openOtp">
        <div class="logo-img">
          <img src="@/common/assets/logo.svg" />
        </div>

        <h1 class="header mb-1">{{ t("user-login-page.header") }}</h1>
        <label class="sub-header">{{ t("user-login-page.sub-header") }}</label>

        <div class="flex items-center content-login">
          <Form
            @submit="handleRequestCode"
            class="form-request"
            ref="formRequest"
            :validation-schema="schemaRequestCode"
            v-slot="{ errors }"
          >
            <div class="input-field">
              <ion-label id="select-country">
                <img class="flag" :src="require('@/common/assets/icon/profile/' + getFlag())" />+
                {{ getCountryNumber() }}</ion-label
              >
              <Field
                name="phone_number"
                v-model="formValues.phone_number"
                v-slot="{ handleChange }"
              >
                <input
                  type="number"
                  inputmode="numeric"
                  @change="handleChange"
                  v-model="formValues.phone_number"
                />
              </Field>
            </div>
            <p v-if="errors.phone_number" class="text-left error mt-2">
              {{ errors.phone_number }}
            </p>

            <p class="phone-description">
              {{ t("user-login-page.title.phone") }}
            </p>
            <div class="flex justify-center items-center">
              <ion-button class="w-full" type="submit">{{
                t("user-login-page.title.continue")
              }}</ion-button>
            </div>
          </Form>
          <!-- TYPE OTP CODE -->
        </div>
      </div>
      <div v-if="openOtp" class="wrapper-auth p-4">
        <div class="logo flex items-center">
          <button class="go-back" @click="goBack">
            <img src="@/common/assets/icon/back.svg" />
          </button>
          <div class="logo-img-otp">
            <img src="@/common/assets/logo.svg" />
          </div>
        </div>
        <h1 class="header">{{ t("user-login-page.header-otp") }}</h1>
        <label class="sub-header-otp"
          >{{ t("user-login-page.sub-header-otp") }}
          <label class="phone"> {{ hidePhoneNumber(phoneNumber) }}</label></label
        >

        <Form class="form-confirm" ref="formConfirm">
          <v-otp-input
            class="flex justify-center items-center"
            ref="otpInput"
            input-classes="otp-input-custom"
            separator=""
            :num-inputs="6"
            :should-auto-focus="true"
            :is-input-num="true"
            :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
          />

          <div class="mt-5 flex flex-col items-center">
            <div class="flex items-center resend-title">
              {{ t("transaction.resend_code_question") }}
            </div>
            <p v-show="resendOtp.isEnd" class="resend ml-2 cursor-pointer" @click="onReTakeOtp">
              {{ t("transaction.resend_code") }}
            </p>
            <div v-show="!resendOtp.isEnd" class="countdown flex items-center">
              <p class="mr-1">{{ t("user-login-page.label.resend") }}</p>
              (
              <vue-countdown
                class="m-0"
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
            <ion-button :disabled="otpValidLength" @click="handleConfirm">{{
              t("user-login-page.title.login")
            }}</ion-button>
          </div>
        </Form>
      </div>
      <modal-breakpoint
        :title="t('user-login-page.title.country')"
        trigger="select-country"
        initial-breakpoint="0.7"
        ref="modal"
      >
        <ion-list>
          <ion-radio-group v-model="countrySelected">
            <ion-item
              v-for="(item, index) in countries"
              :key="index"
              @click="() => handleSelectCountry(countrySelected)"
            >
              <ion-label class="d-flex">
                <img :src="require('@/common/assets/icon/profile/' + item?.flag)" />
                <span class="ml-2">{{ item?.name }}</span>
              </ion-label>
              <ion-radio slot="start" :value="item.value"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      </modal-breakpoint>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" src="./UserLogin.component.ts"></script>

<style lang="scss" scoped src="./userLogin.scss"></style>
