<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex justify-between item-center">
          <div class="logo-brand">
            <img @click="navigate('/tabs/dashboard')" src="@/common/assets/icon/wallet/back.svg" />
            <h1>{{ t("wallet.top-up.header") }}</h1>
          </div>
        </div>
        <div class="__main">
          <Form
            @submit="handleTopUp"
            v-slot="{ errors }"
            class="form-request"
            ref="formRequest"
            :validation-schema="schemaRequestCode"
          >
            <div class="your-balance">
              <div class="title">
                <img src="@/common/assets/icon/wallet/balance.svg" />
                <h4 class="ml-3">{{ t("wallet.top-up.balance") }}</h4>
              </div>
              <div class="total-money">
                {{ formatNumber(userInfo?.amount) }}
              </div>
            </div>
            <div>
              <Field name="amount" v-model="formValues.amount" type="number">
                <ion-input
                  class="custom"
                  inputmode="numeric"
                  :clear-input="true"
                  :placeholder="t('wallet.top-up.amount-placeholder')"
                  v-model="formValues.amount"
                  type="number"
                  @ionChange="validate"
                ></ion-input>
              </Field>

              <p v-if="errors.amount" class="error">{{ error }}</p>
            </div>
            <div>
              <div class="amount-chip flex justify-between flex-wrap items-center mt-2">
                <!--     -->
                <button
                  type="button"
                  :class="[{ 'chip-button': true }, { active: formValues.amount === 10 }]"
                  @click="setValueAmount(10)"
                >
                  <ion-label>$10</ion-label>
                </button>
                <!--     -->
                <button
                  type="button"
                  :class="[
                    { 'margin-left-chip chip-button': true },
                    { active: formValues.amount === 100 },
                  ]"
                  @click="setValueAmount(100)"
                >
                  <ion-label>$100</ion-label>
                </button>
                <!--   -->
                <button
                  type="button"
                  :class="[
                    { 'margin-left-chip chip-button': true },
                    { active: formValues.amount === 150 },
                  ]"
                  @click="setValueAmount(150)"
                >
                  <ion-label>$150</ion-label>
                </button>
                <button
                  type="button"
                  :class="[
                    { 'margin-left-chip chip-button': true },
                    { active: formValues.amount === 200 },
                  ]"
                  @click="setValueAmount(200)"
                >
                  <ion-label>$200</ion-label>
                </button>
              </div>
            </div>
            <div class="flex justify-center items-center">
              <button type="submit" class="submit uppercase">
                {{ t("wallet.top-up.button.top-up") }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./topUpPage.component.ts"></script>

<style lang="scss" scoped src="./topUpPage.scss"></style>
